import paho.mqtt.client as mqtt

class MQTTClient:
    def __init__(self, broker, port):
        self.client = mqtt.Client()
        self.broker = broker
        self.port = port
        self.client.on_message = self.on_message

    def connect(self):
        self.client.connect(self.broker, self.port)
        self.client.loop_start()

    def on_message(self, client, userdata, message):
        """Override this method to handle incoming messages."""
        pass

    def subscribe(self, topic):
        self.client.subscribe(topic)

    def publish(self, topic, payload):
        self.client.publish(topic, payload)
