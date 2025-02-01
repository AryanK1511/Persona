from ai.openAi import ChatGPTInteraction
class Intent:
    def __init__(self):
        self.chatGPTInteraction = ChatGPTInteraction()
    
    def get_intent(self, prompt):
        return self.chatGPTInteraction.get_intent(prompt)