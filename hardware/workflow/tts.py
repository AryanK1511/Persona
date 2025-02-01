import requests
import time
import os

class TTS:
    def __init__(self, api_token, actor_id):
        self.api_token = api_token
        self.actor_id = actor_id
        self.api_url = "https://typecast.ai/api/speak"


    def synthesize_speech(self, text, lang="auto", model_version="latest", xapi_hd=True, xapi_audio_format="mp3"):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_token}"
        }
        data = {
            "text": text,
            "lang": lang,
            "actor_id": self.actor_id,
            "model_version": model_version,
            "xapi_hd": xapi_hd,
            "xapi_audio_format": xapi_audio_format
        }

        # Send POST request to initiate speech synthesis
        response = requests.post(self.api_url, headers=headers, json=data)
        response_data = response.json()

        if response.status_code != 200:
            raise Exception(f"Error: {response_data.get('message', 'Unknown error')}")

        # Extract the speak_v2_url from the response
        speak_v2_url = response_data["result"]["speak_v2_url"]

        # Poll the speak_v2_url until the status is 'done'
        while True:
            poll_response = requests.get(speak_v2_url, headers=headers)
            poll_data = poll_response.json()
            # print(poll_data)

            if poll_response.status_code != 200:
                raise Exception(f"Error: {poll_data.get('message', 'Unknown error')}")

            status = poll_data['result']["status"]
            if status == "done":
                # Retrieve the audio download URL
                audio_download_url = poll_data['result']["audio_download_url"]
                return audio_download_url
            elif status == "failed":
                raise Exception("Error during speech synthesis.")
            else:
                time.sleep(1)