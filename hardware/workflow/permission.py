from database.mongo import Mongo
from database.google_calendar import get_calendar
import os

from dotenv import load_dotenv
load_dotenv()
DEBUGGING_FLAG = os.getenv("DEBUGGING")

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

    def get_data(self, user_id, intent, friend, days):
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
        
        if intent == "give_address_permission":
            self.mongo.addLocationAccess(user_id, friend)
            return ["Succesfully updated the address permission for " + friend, None]
        elif intent == "give_schedule_permission":
            self.mongo.addScheduleAccess(user_id, friend)
            return ["Succesfully updated the schedule permission for " + friend, None]
        else:
            permission = self.get_permission(user_id, intent, friend)
            if not permission:
                error_code = ""
                if intent == "current_location" or intent == "distance":
                    error_code = "location"
                elif intent == "schedule":
                    error_code = "schedule"
                error_message = "You do not have permission to access " + friend + "'s " + error_code
                return [None, error_message]
            
            data = self.get_more_data(user_id, friend, intent, days)
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

    def get_more_data(self, user_id, friend, intent, days):
        if intent == "schedule":
            events =  get_calendar(days)
            events_str = ""
            for event in events:
                start = event["start"].get("dateTime", event["start"])
                events_str += f"{start} {event['summary']}\n"
                if DEBUGGING_FLAG:
                    print(f"{start} {event['summary']}")
            return events_str