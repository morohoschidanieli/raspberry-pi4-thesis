import RPi.GPIO as GPIO
import random
import time

rPin = 26
gPin = 19
bPin = 13

print("Introduce valorile pentru RGB")
redValue = int(input("Red: ")) * 0.39215686
greenValue = int(input("Green: ")) * 0.39215686
blueValue = int(input("Blue: ")) * 0.39215686

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(rPin, GPIO.OUT)
GPIO.setup(gPin, GPIO.OUT)
GPIO.setup(bPin, GPIO.OUT)
GPIO.output(rPin, GPIO.LOW)
GPIO.output(gPin, GPIO.HIGH)
GPIO.output(bPin, GPIO.HIGH)

red = GPIO.PWM(rPin, 100)
green = GPIO.PWM(gPin, 100)
blue = GPIO.PWM(bPin, 100)

red.start(0)
blue.start(0)
green.start(0)

def changeColor(r_val, g_val, b_val):
    red.ChangeDutyCycle(r_val)
    green.ChangeDutyCycle(g_val)
    blue.ChangeDutyCycle(b_val)
    
while True:
    changeColor(redValue, blueValue, greenValue)