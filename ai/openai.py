import os
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")

class ChatGPTInteraction:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=api_key)
        self.conversation_history = []

    def reset(self):
        self.conversation_history = []

    # def get_intent(self, user_prompt: str) -> str:


    # async def generate_response(self,user_prompt: str) -> str:
    #     try:
    #         self.conversation_history.append({"role": "user", "content": user_prompt})
    #         messages = [
    #             {
    #                 "role": "system",
    #                 "content": "You are a helpful assistant analyzing data about the speed of different OS's.",
    #             },
    #             {
    #                 "role": "user",
    #                 "content": f"Here is the data to analyze in CSV format:",
    #             },
    #         ]
    #         messages.extend(self.conversation_history)

    #         response = self.client.chat.completions.create(
    #             model="gpt-4", messages=messages, temperature=0.7, max_tokens=4000
    #         )

    #         assistant_response = response.choices[0].message.content
    #         self.conversation_history.append(
    #             {"role": "assistant", "content": assistant_response}
    #         )

    #         return assistant_response

    #     except Exception as e:
    #         print("ERROR in openai.py in ai folder while completing the response:", e)


