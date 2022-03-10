from mq import *
import sys, time
import RPi.GPIO as GPIO
import time
import requests
buzzerPin = 6

GPIO.setmode(GPIO.BCM)
GPIO.setup(buzzerPin, GPIO.OUT)
GPIO.output(buzzerPin, GPIO.LOW)

mq = MQ()

mq135Data = {"C0" : "0",
             "Smoke" : "0",
             "isAlarmOn" : 'false'}
url = "http://localhost:9000/get-smoke-data"

while True:
    perc = mq.MQPercentage()
    sys.stdout.write("\r")
    sys.stdout.write("\033[K")
    sys.stdout.write("CO: %g ppm, Smoke: %g ppm" % (perc["CO"], perc["SMOKE"]))
    mq135Data = {"C0" : perc["CO"],
                 "Smoke" : perc["SMOKE"],
                 "isAlarmOn" : 'false'}
    response = requests.post(url, mq135Data)
    if perc["SMOKE"] > 1.2:
        mq135Data = {"C0" : perc["CO"],
                 "Smoke" : perc["SMOKE"],
                 "isAlarmOn" : 'true'}
        response = requests.post(url, mq135Data)
        GPIO.output(buzzerPin, GPIO.HIGH)
        time.sleep(2)
        GPIO.output(buzzerPin, GPIO.LOW)
    mq135Data = {"C0" : perc["CO"],
                 "Smoke" : perc["SMOKE"],
                 "isAlarmOn" : 'false'}
    response = requests.post(url, mq135Data)
    sys.stdout.flush()
    time.sleep(2)

