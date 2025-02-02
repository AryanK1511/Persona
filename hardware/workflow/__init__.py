from dotenv import load_dotenv

load_dotenv()


from workflow.intent import Intent
from workflow.llm import LLM
from workflow.permission import Permission
from workflow.stt import STT
from workflow.tts import TTS

DEBUGGING_FLAG = os.getenv("DEBUGGING")
TYPECAST_API_KEY = os.getenv("TYPECAST_API_KEY")
ACTOR_ID = "631725814e0d806f7158efde"


class Workflow:
    def __init__(self):
        # maybe all of these are not used, reomove if not used
        self.intent = Intent()
        self.llm = LLM()
        self.permission = Permission()
        self.stt = STT()
        self.tts = TTS(TYPECAST_API_KEY, ACTOR_ID)

    def run(self, user_id, prompt):
        if DEBUGGING_FLAG:
            print(
                "1. workflow started with user_id: ", user_id, " and prompt: ", prompt
            )

        [intent, friend] = self.intent.get_intent(prompt)
        if DEBUGGING_FLAG:
            print("2. intent: ", intent, friend)

        [data, error] = self.permission.get_data(user_id, intent, friend)
        if DEBUGGING_FLAG:
            print("3. data: ", data, error)

        if error:
            audio_url = self.tts.synthesize_speech(error)
            if DEBUGGING_FLAG:
                print("5. audio_url: ", audio_url)
            return {"response": audio_url}

        system_message = "orange"
        response = self.llm.generate_response(prompt, intent, system_message)
        if DEBUGGING_FLAG:
            print("4. response: ", response)

        audio_url = self.tts.synthesize_speech(response)
        if DEBUGGING_FLAG:
            print("5. audio_url: ", audio_url)
        return {"response": audio_url}


# test = Workflow()
# test.run("123", "where is Charlie right now?")
