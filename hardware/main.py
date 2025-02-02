import io
import os

import requests
from database.mongo import Mongo
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from pydub import AudioSegment
from pydub.playback import play
from utils.logger import create_log
from workflow import Workflow
from workflow.mqtt import MQTTClient

intents = [
    "general",
    "current_location",
    "distance",
    "schedulegive_address_permission",
    "give_schedule_permission",
]

load_dotenv()

MQTT_BROKER = os.getenv("BROKER_HOST", "localhost")
MQTT_PORT = int(os.getenv("BROKER_PORT", 1883))

# ========== FAST API APP ==========
app = FastAPI()
# =================================


class CustomMQTTClient(MQTTClient):
    def on_message(self, client, userdata, message):
        create_log(
            "info", f"Received message on {message.topic}: {message.payload.decode()}"
        )
        mongo_client = Mongo()

        # Add friends when RFID is detected and play audio saying that the friend has been added
        if message.topic == "rfid/tag":
            message_received = message.payload.decode()

            if os.getenv("IS_TRANSMITTER") == "false":
                wf = Workflow()
                audio_url = wf.tts.synthesize_speech(
                    "Jessica has been added to your friend list"
                )
                audio_response = requests.get(audio_url)
                audio = AudioSegment.from_file(
                    io.BytesIO(audio_response.content), format="mp3"
                )
                play(audio)
                mongo_client.updateFriends("123", "Jessica")
                mongo_client.updateFriends("456", "John")
                create_log("info", "Adding new friend")
                create_log("info", f"Audio URL: {audio_url}")

                self.publish_message("pi/1", "friend_added")

            elif os.getenv("IS_TRANSMITTER") == "true":
                wf = Workflow()
                audio_url = wf.tts.synthesize_speech(
                    "Aryan has been added to your friend list"
                )
                audio_response = requests.get(audio_url)
                audio = AudioSegment.from_file(
                    io.BytesIO(audio_response.content), format="mp3"
                )
                play(audio)

        elif message.topic == os.getenv("SUBSCRIBED_TOPIC"):
            message_received = message.payload.decode()

            if message_received.split(":")[0] == "access_calendar":
                if message_received.split(":")[1] == "false":
                    wf = Workflow()
                    audio_url = wf.tts.synthesize_speech(
                        "Aryan is trying to access your calendar! Would you like to grant him permission?"
                    )
                    audio_response = requests.get(audio_url)
                    audio = AudioSegment.from_file(
                        io.BytesIO(audio_response.content), format="mp3"
                    )
                    play(audio)

            if message_received == "calendar_permission":
                wf = Workflow()
                audio_url = None
                if os.getenv("MY_TOPIC") == "pi/2":
                    audio_url = wf.tts.synthesize_speech(
                        "John has granted you permission to access her calendar!"
                    )
                elif os.getenv("MY_TOPIC") == "pi/1":
                    audio_url = wf.tts.synthesize_speech(
                        "Jessica has granted you permission to access his calendar!"
                    )

                audio_response = requests.get(audio_url)
                audio = AudioSegment.from_file(
                    io.BytesIO(audio_response.content), format="mp3"
                )
                play(audio)

    def publish_message(self, topic, message):
        try:
            self.publish(topic, message)
            create_log("info", f"Published message to {topic}: {message}")
        except Exception as e:
            create_log("error", f"Failed to publish message to {topic}: {e}")


mqtt_client = CustomMQTTClient(MQTT_BROKER, MQTT_PORT)


@app.on_event("startup")
async def startup_event():
    create_log("info", "Starting MQTT connection")
    mqtt_client.connect()
    mqtt_client.subscribe("rfid/tag")
    mqtt_client.subscribe(os.getenv("SUBSCRIBED_TOPIC"))
    create_log("info", "MQTT connection started and subscribed to topics")


@app.post("/log_message")
async def log_message(request: Request):
    data = await request.json()
    message = data.get("message")
    create_log("info", f"Received message: {message}")
    wf = Workflow()
    curr_user_id = "123"
    if os.getenv("MY_TOPIC") == "pi/2":
        curr_user_id = "456"

    response = wf.run(curr_user_id, message)
    print(response)

    audio_url = response["response"]
    audio_response = requests.get(audio_url)
    audio = AudioSegment.from_file(io.BytesIO(audio_response.content), format="mp3")

    if response.intent == "schedule":
        if response.data is None:
            mqtt_client.publish_message(os.getenv("MY_TOPIC"), "access_calendar:false")

    if response.intent == "give_schedule_permission":
        mqtt_client.publish_message(os.getenv("MY_TOPIC"), "calendar_permission")
        # Give actual permission here
        mongo_client = Mongo()
        user_id = None
        name = None
        if os.getenv("MY_TOPIC") == "pi/1":
            user_id = "123"
            name = "John"
        elif os.getenv("MY_TOPIC") == "pi/2":
            user_id = "456"
            name = "Jessica"
        mongo_client.addScheduleAccess(user_id, name)
        wf = Workflow()
        other_person_name = None
        if os.getenv("MY_TOPIC") == "pi/1":
            other_person_name = "Jessica"
        elif os.getenv("MY_TOPIC") == "pi/2":
            other_person_name = "John"
        audio_url = wf.tts.synthesize_speech(
            f"You have granted {other_person_name} permission to access your calendar!"
        )
        audio_response = requests.get(audio_url)
        audio = AudioSegment.from_file(io.BytesIO(audio_response.content), format="mp3")
        play(audio)

    play(audio)

    return {"status": "success"}
