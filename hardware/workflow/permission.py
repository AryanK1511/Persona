from database.mongo import Mongo

intents = [
    "general",
    "current_location",
    "distance",
    "schedule"
]

intents_str = "general, current_location, distance, schedule"

class Permission:
    def __init__(self):
        self.mongo = Mongo()

    def get_data(self, user_id, intent, friend):
        # is friends
        if not self.is_friends(user_id, friend):
            error_message = "You are not friends with " + friend
            return [None, error_message]

        permission = self.get_permission(user_id, intent, friend)
        print("permission: ", permission)
        
        if not permission:
            error_code = ""
            if intent == "current_location" or intent == "distance":
                error_code = "location"
            elif intent == "schedule":
                error_code = "schedule"
            error_message = "You do not have permission to access " + friend + "'s " + error_code
            return [None, error_message]
        
        data = self.get_more_data(user_id, friend, intent)
        return [data, None]

    def get_permission(self, user_id, intent, friend):
        if  intent == "general":
            return True
        elif intent == "current_location" or intent == "distance":
            return self.mongo.isLocationAccess(user_id, friend)
        elif intent == "schedule":
            print("checking schedule access")
            return self.mongo.isScheduleAccess(user_id, friend)

    def is_friends(self, user_id, friend):
        return self.mongo.areFriends(user_id, friend)

    def get_more_data(self, user_id, friend, intent):
        pass