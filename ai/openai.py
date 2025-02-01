import os
from openai import OpenAI

# import sys
# sys.path.append("..")

from dotenv import load_dotenv
load_dotenv()

from constants import intents

class ChatGPTInteraction:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        print("api_key: ", api_key) 
        self.client = OpenAI(api_key=api_key)
        self.conversation_history = []

    def clean(self):
        self.conversation_history = self.conversation_history[-10:]

    def get_intent(self, user_prompt: str) -> str:
        try:
            # prepare the conversation history
            self.conversation_history.append({"role": "user", "content": user_prompt})
            messages = [
                {
                    "role": "system",
                    "content": "You are a straightforward assistant used to get intent out of user's transcribed input. You have the following options, " + intents.Intents.get_all_intents_as_string(),
                }
            ]
            messages.extend(self.conversation_history)

            # generate the response
            response = self.client.chat.completions.create(
                model="gpt-4", messages=messages, temperature=0.7, max_tokens=4000
            )
            assistant_response = response.choices[0].message.content
            self.conversation_history.append(
                {"role": "assistant", "content": assistant_response}
            )
            self.clean()
            return assistant_response
        except Exception as e:
            self.clean()
            print("ERROR in openai.py while parisng the intent", e)



    async def generate_response(self,user_prompt: str) -> str:
        try:
            self.conversation_history.append({"role": "user", "content": user_prompt})
            messages = [
                {
                    "role": "system",
                    "content": "You are a helpful assistant analyzing data about the speed of different OS's.",
                },
                {
                    "role": "user",
                    "content": f"Here is the data to analyze in CSV format:",
                },
            ]
            messages.extend(self.conversation_history)

            response = self.client.chat.completions.create(
                model="gpt-4", messages=messages, temperature=0.7, max_tokens=4000
            )

            assistant_response = response.choices[0].message.content
            self.conversation_history.append(
                {"role": "assistant", "content": assistant_response}
            )

            self.clean()
            return assistant_response

        except Exception as e:
            self.clean()
            print("ERROR in openai.py while generating LLM response:", e)



openai = ChatGPTInteraction()
print(openai.get_intent("What is the speed of Windows 10?"))
