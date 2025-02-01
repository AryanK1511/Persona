# import os

# from dotenv import load_dotenv
# load_dotenv()
# DEBUGGING_FLAG = os.getenv("DEBUGGING")

# from intent import Intent
# from llm import LLM
# from permission import Permission
# from stt import STT
# from tts import TTS

# class Workflow:
#     def __init__(self):
#         # maybe all of these are not used, reomove if not used
#         self.intent = Intent()
#         self.llm = LLM()
#         self.permission = Permission()
#         self.stt = STT()
#         self.tts = TTS()

#     def run(self, user_id, prompt):
#         if DEBUGGING_FLAG:
#             print("1. workflow started with user_id: ", user_id, " and prompt: ", prompt)

#         intent = self.intent.get_intent(prompt)
#         if DEBUGGING_FLAG:
#             print("2. intent: ", intent)

#         permission_error = self.permission.check_permission(user_id, intent)
#         if DEBUGGING_FLAG:
#             print("3. permission_error: ", permission_error)

#         if permission_error:
#             return {"error": permission_error}
        
#         system_message = "orange"
#         response = self.llm.generate_response(prompt, intent, system_message)
#         if DEBUGGING_FLAG:
#             print("4. response: ", response)

#         return {"response": response}

        