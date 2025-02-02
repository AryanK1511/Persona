import io
import os

import requests
from database.mongo import Mongo
from dotenv import load_dotenv
from fastapi import FastAPI
from pydub import AudioSegment
from pydub.playback import play
from utils.logger import create_log
from workflow import Workflow
from workflow.mqtt import MQTTClient

load_dotenv()

MQTT_BROKER = os.getenv("BROKER_HOST", "localhost")
MQTT_PORT = int(os.getenv("BROKER_PORT", 1883))
MQTT_BROKER = os.getenv("BROKER_HOST", "localhost")
MQTT_PORT = int(os.getenv("BROKER_PORT", 1883))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "test/topic")

create_log("info", f"MQTT_BROKER: {MQTT_BROKER}")

# ========== FAST API APP ==========
create_log("info", f"MQTT_BROKER: {MQTT_BROKER}")

# ========== FAST API APP ==========
app = FastAPI()
# =================================


class CustomMQTTClient(MQTTClient):
    def on_message(self, client, userdata, message):
        if message.topic == "rfid/tag":
            message_received = message.payload.decode()
            create_log(
                "info", f"Received message on {message.topic}: {message_received}"
            )

            mongo_client = Mongo()
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
                mongo_client.updateFriends("123", "Jessica", "false", "false")
                mongo_client.updateFriends("456", "John", "false", "false")
                create_log("info", "Adding new friend")
                create_log("info", f"Audio URL: {audio_url}")

                self.publish("pi/1", "on")

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
        elif message.topic == "pi/2":
            message_received = message.payload.decode()
            create_log(
                "info", f"Received message on {message.topic}: {message_received}"
            )

            if message_received == "friend_request":
                mongo_client = Mongo()
                if os.getenv("IS_TRANSMITTER") == "false":
                    mongo_client.updateFriends("123", "Aryan", "false", "false")
                    mongo_client.updateFriends("123", "Krins", "false", "false")
                    create_log("info", "Adding new friend")
                    self.publish("pi/1", "on")


mqtt_client = CustomMQTTClient(MQTT_BROKER, MQTT_PORT)


@app.on_event("startup")
async def startup_event():
    create_log("info", "Starting MQTT connection")
    mqtt_client.connect()
    mqtt_client.subscribe("rfid/tag")
    mqtt_client.subscribe("pi/2")
    create_log("info", "MQTT connection started and subscribed to topics")


@app.get("/")
async def root():
    create_log("info", "Root endpoint called")
    create_log("info", "Root endpoint called")
    return {"message": "FastAPI running with MQTT!"}
