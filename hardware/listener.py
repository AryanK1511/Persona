import os
import sys

import requests
import speech_recognition as sr
from dotenv import load_dotenv

load_dotenv()

sys.stderr = open(os.devnull, "w")
os.dup2(os.open(os.devnull, os.O_WRONLY), 2)


def detect_silence(audio_data, recognizer, silence_threshold=1.0):
    return (
        recognizer.energy_threshold
        > silence_threshold * recognizer.dynamic_energy_threshold
    )


def main():
    r = sr.Recognizer()
    r.dynamic_energy_threshold = True
    r.dynamic_energy_adjustment_damping = 0.15
    r.dynamic_energy_ratio = 1.5
    r.pause_threshold = 1.0

    print("Starting transcription...")

    while True:
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=0.5)

            try:
                print("Listening...")
                audio = r.listen(source)
                transcription = r.recognize_openai(audio)

                result = {"message": transcription}
                print(result)

                response = requests.post(
                    "http://localhost:8000/log_message", json=result
                )
                if response.status_code == 200:
                    print("Message logged successfully")

            except sr.WaitTimeoutError:
                print("No speech detected")
            except sr.RequestError as e:
                print(f"Could not request results from OpenAI Whisper API; {e}")
            except sr.UnknownValueError:
                print("Could not understand audio")


if __name__ == "__main__":
    main()
