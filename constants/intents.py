from enum import Enum

class Intents(Enum):
  GENERAL = "general"
  CURRENT_LOCATION = "current_location"
  DISTANCE = "distance"
  ISFRIEND = "isfriend"

  @staticmethod
  def get_all_intents_as_string():
    return ', '.join([intent.value for intent in Intents])
