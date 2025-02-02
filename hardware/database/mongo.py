import os
from pymongo.mongo_client import MongoClient
from pymongo import MongoClient

from dotenv import load_dotenv
load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")

'''
User:
  _id: str
  name: str
  friends: List[{
    name: str, 
    schedule: bool,
    location: bool
  }]
'''

class Mongo:
    def __init__(self):
        # Initialize the MongoDB client
        if not MONGODB_URI:
            raise ValueError("MONGODB_URI not found in environment variables")
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client["hh"]
        self.users_collection = self.db["users"]
        self.users = []

    def getUser(self, user_id):
        for user in self.users:
            if user["_id"] == user_id:
                return user

        user =  self.users_collection.find_one({"_id": user_id})
        self.users.append(user)
        return user

    # add friends
    def updateFriends(self, user_id, friend_name):
      """
      Updates the friends list of a user by adding a new friend or updating an existing friend's details.
      Args:
        user_id (str): The ID of the user whose friends list is to be updated.
        friend_name (str): The name of the friend to add or update.
        schedule (str): The schedule information of the friend.
        location (str): The location information of the friend.
      """
      user = self.getUser(user_id)

      # updates the friends if exists or add a new friend
      friend = next((friend for friend in user["friends"] if friend["name"].lower() == friend_name.lower()), None)
      if friend is None:
          user["friends"].append({
            "name": friend_name,
            "schedule": False,
            "location": False
          })
      else:
          friend["schedule"] = False
          friend["location"] = False

      # updates the database
      self.users_collection.update_one(
          {"_id": user_id},
          {"$set": {"friends": user["friends"]}}
      )
      # removes this user from the local cache so we can fetch it again
      self.users = [u for u in self.users if u["_id"] != user_id]

    # get user friends
    def areFriends(self, user_id, friend_name):
      """
      Checks if a given friend is in the user's friends list.
      Args:
        user_id (str): The ID of the user.
        friend_name (str): The name of the friend to check.
      Returns:
        bool: True if the friend is in the user's friends list, False otherwise.
      """
      user = self.getUser(user_id)
      for friend in user["friends"]:
          if friend_name.lower() in friend["name"].lower():
              return True
      return False
            
    # isLocationAccess
    def isLocationAccess(self, user_id, friend_name):
        user = self.getUser(user_id)
        for friend in user["friends"]:
            if friend_name.lower() in friend["name"].lower():
                return friend["location"]
        return False
    
    # isScheduleAccess
    def isScheduleAccess(self, user_id, friend_name):
        user = self.getUser(user_id)
        for friend in user["friends"]:
            if friend_name.lower() in friend["name"].lower():
                return friend["schedule"]
        return False
  
    # add user
    def addUser(self, user_id, name):
        """
        Adds a new user to the database.
        Args:
          user_id (str): The ID of the user to add.
          name (str): The name of the user to add.
        """
        user = {
            "_id": user_id,
            "name": name,
            "friends": [
                {
                    "name": "Bob",
                    "schedule": False,
                    "location": True
                },
                {
                    "name": "Charlie",
                    "schedule": True,
                    "location": False
                }
            ]
        }
        self.users_collection.insert_one(user)
        self.users.append(user)
        return user
    
    # addLocationAccess
    def addLocationAccess(self, user_id, friend_name):
        """
        Adds location access permission to a friend.
        Args:
          user_id (str): The ID of the user granting permission.
          friend_name (str): The name of the friend to grant permission to.
        """
        user = self.getUser(user_id)

        friend = next((friend for friend in user["friends"] if friend["name"].lower() == friend_name.lower()), None)
        if friend is not None:
            friend["location"] = True
            self.users_collection.update_one(
                {"_id": user_id},
                {"$set": {"friends": user["friends"]}}
            )
            self.users = [u for u in self.users if u["_id"] != user_id]
            return True
        return False
    
    # addScheduleAccess
    def addScheduleAccess(self, user_id, friend_name):
        """
        Adds schedule access permission to a friend.
        Args:
          user_id (str): The ID of the user granting permission.
          friend_name (str): The name of the friend to grant permission to.
        """
        user = self.getUser(user_id)

        friend = next((friend for friend in user["friends"] if friend["name"].lower() == friend_name.lower()), None)
        if friend is not None:
            friend["schedule"] = True
            self.users_collection.update_one(
                {"_id": user_id},
                {"$set": {"friends": user["friends"]}}
            )
            self.users = [u for u in self.users if u["_id"] != user_id]
            return True
        return False

      