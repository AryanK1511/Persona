import os
import logging
from fastapi import FastAPI
from dotenv import load_dotenv
from workflow.mqtt import MQTTClient
from utils.logger import create_log

load_dotenv()

MQTT_BROKER = os.getenv("BROKER_HOST", "localhost")
MQTT_PORT = int(os.getenv("BROKER_PORT", 1883))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "test/topic")

create_log("info", f"MQTT_BROKER: {MQTT_BROKER}")

# ========== FAST API APP ==========
app = FastAPI()
# =================================

class CustomMQTTClient(MQTTClient):
    def on_message(self, client, userdata, message):
        create_log("info", f"Received message on {message.topic}: {message.payload.decode()}")
        if message.topic == "rfid/tag":
            create_log("info", f"📩 Received message on {message.topic}: {message.payload.decode()}")
        elif message.topic == "pi/2":
            self.publish("pi/1", message.payload.decode())

mqtt_client = CustomMQTTClient(MQTT_BROKER, MQTT_PORT)

@app.on_event("startup")
async def startup_event():
    """Start MQTT connection when FastAPI starts."""
    create_log("info", "Starting MQTT connection")
    mqtt_client.connect()
    mqtt_client.subscribe("rfid/tag")
    mqtt_client.subscribe("pi/2")
    create_log("info", "MQTT connection started and subscribed to topics")

@app.get("/")
async def root():
    create_log("info", "Root endpoint called")
    return {"message": "FastAPI running with MQTT!"}
