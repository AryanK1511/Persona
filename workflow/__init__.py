from intent import Intent
from llm import LLM
from permission import Permission
from stt import STT
from tts import TTS

class Workflow:
    def __init__(self):
        # maybe all of these are not used, reomove if not used
        self.intent = Intent()
        self.llm = LLM()
        self.permission = Permission()
        self.stt = STT()
        self.tts = TTS()

    def run(self, user_id, prompt):
        intent = self.intent.get_intent(user_id, prompt)