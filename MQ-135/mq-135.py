from mq import *
import sys, time
import RPi.GPIO as GPIO
import time

buzzerPin = 6

GPIO.setmode(GPIO.BCM)
GPIO.setup(buzzerPin, GPIO.OUT)
GPIO.output(buzzerPin, GPIO.LOW)

mq = MQ()

while True:
    perc = mq.MQPercentage()
    sys.stdout.write("\r")
    sys.stdout.write("\033[K")
    sys.stdout.write("CO: %g ppm, Smoke: %g ppm" % (perc["CO"], perc["SMOKE"]))
    if perc["SMOKE"] > 1.2:
        GPIO.output(buzzerPin, GPIO.HIGH)
        time.sleep(2)
        GPIO.output(buzzerPin, GPIO.LOW)
    sys.stdout.flush()
    time.sleep(0.1)

