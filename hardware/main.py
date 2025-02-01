import os
import asyncio
import paho.mqtt.client as mqtt
from fastapi import FastAPI
from dotenv import load_dotenv
import workflow
# Load environment variables
load_dotenv()

# MQTT Configuration
MQTT_BROKER = os.getenv("MQTT_BROKER", "mqtt.eclipseprojects.io")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "test/topic")

# FastAPI App
app = FastAPI()

# MQTT Client Setup
mqtt_client = mqtt.Client()

def on_message(client, userdata, message):
    """Handles incoming MQTT messages."""
    print(f"📩 Received message on {message.topic}: {message.payload.decode()}")

def start_mqtt():
    """Connects to MQTT broker and starts listening."""
    mqtt_client.on_message = on_message
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT)
    mqtt_client.subscribe(MQTT_TOPIC)
    mqtt_client.loop_start()  # Run MQTT in the background

@app.on_event("startup")
async def startup_event():
    """Start MQTT connection when FastAPI starts."""
    start_mqtt()

@app.get("/")
async def root():
    return {"message": "FastAPI running with MQTT!"}
