<<<<<<< HEAD
import assemblyai as aai

aai.settings.api_key = "8f2ee51c6a8d4413b9b486f44afec4ae"


def on_open(session_opened: aai.RealtimeSessionOpened):
    print("Session ID:", session_opened.session_id)


def on_data(transcript: aai.RealtimeTranscript):
    if not transcript.text:
        return

    if isinstance(transcript, aai.RealtimeFinalTranscript):
        print(transcript.text, end="\r\n")
    else:
        print(transcript.text, end="\r")


def on_error(error: aai.RealtimeError):
    print("An error occurred:", error)


def on_close():
    print("Closing Session")


transcriber = aai.RealtimeTranscriber(
    sample_rate=16_000,
    on_data=on_data,
    on_error=on_error,
    on_open=on_open,
    on_close=on_close,
)

transcriber.connect()

microphone_stream = aai.extras.MicrophoneStream(sample_rate=16_000)
transcriber.stream(microphone_stream)

transcriber.close()
=======
import os
import sys

import speech_recognition as sr
from dotenv import load_dotenv
from workflow import Workflow

load_dotenv()

sys.stderr = open(os.devnull, "w")
os.dup2(os.open(os.devnull, os.O_WRONLY), 2)


def detect_silence(audio_data, recognizer, silence_threshold=1.0):
    return (
        recognizer.energy_threshold
        > silence_threshold * recognizer.dynamic_energy_threshold
    )


def main():
    ws = Workflow()
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
                ws.run("123", transcription)

                # Once we get the response from the workflow, we need to send that response to the other pi

            except sr.WaitTimeoutError:
                print("No speech detected")
            except sr.RequestError as e:
                print(f"Could not request results from OpenAI Whisper API; {e}")
            except sr.UnknownValueError:
                print("Could not understand audio")


if __name__ == "__main__":
    main()
>>>>>>> 194597baea80a2118a376135cd8913217a248ab8
