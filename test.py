import time

import RPi.GPIO as GPIO

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.OUT)
GPIO.setup(24, GPIO.OUT)
GPIO.setup(25, GPIO.OUT)

# Set up PWM
red = GPIO.PWM(23, 100)
green = GPIO.PWM(24, 100)
blue = GPIO.PWM(25, 100)

# Start PWM
red.start(0)
green.start(0)
blue.start(0)


def set_color(r, g, b):
    red.ChangeDutyCycle(100 - r)
    green.ChangeDutyCycle(100 - g)
    blue.ChangeDutyCycle(100 - b)


try:
    while True:
        # Red
        set_color(100, 0, 0)
        time.sleep(1)
        # Green
        set_color(0, 100, 0)
        time.sleep(1)

except KeyboardInterrupt:
    pass

# Clean up
red.stop()
green.stop()
blue.stop()
GPIO.cleanup()
