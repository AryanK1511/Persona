from ai.openAi import ChatGPTInteraction
from datetime import datetime
import os

from dotenv import load_dotenv
load_dotenv()
DEBUGGING_FLAG = os.getenv("DEBUGGING")
class LLM:
    def __init__(self):
        self.chatGPTInteraction = ChatGPTInteraction()

    def generate_response(self, user_prompt: str, intent: str, data: str) -> str:
        data = data if data else ""
        system_message = ""
        if intent == "general":
            system_message = "Just answer this general question."
        elif intent == "current_location":
            system_message = "Just answer this current location question with the given data " + data
        elif intent == "distance":
            system_message = "Just answer this distance question with the given data " + data
        elif intent == "schedule":
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            system_message = "Answer the schedule question with the following schedule " + data + ". Today is " + now
        elif intent == "give_address_permission":
            system_message = "Just paraphrase this address permission request response."
        elif intent == "give_schedule_permission":
            system_message = "Just paraphrase this schedule permission request response."
        if DEBUGGING_FLAG:
            print(system_message)
        return self.chatGPTInteraction.generate_response(user_prompt, system_message)
    