from socket import socket
from threading import Thread
from gpiozero import LED
from gpiozero import MotionSensor
import RPi.GPIO as GPIO
import time
import rpi_i2c
from mq import *
import sys, time
import requests
import pyrebase

firebaseConfig = {
    'apiKey': "AIzaSyD3qooGTPdXGN6NBDSpNZteiwGOpgkJZzY",
    'authDomain': "licenta-3e164.firebaseapp.com",
    'databaseURL': "https://licenta-3e164-default-rtdb.firebaseio.com",
    'projectId': "licenta-3e164",
    'storageBucket': "licenta-3e164.appspot.com",
    'messagingSenderId': "987851035034",
    'appId': "1:987851035034:web:825ea9c221d2d8933c2a23",
    'measurementId': "G-9SKBFKBX69"
}

firebase=pyrebase.initialize_app(firebaseConfig)
db = firebase.database()

rgbData = db.child('sensors/rgb-data').get()

redValue = int(float(rgbData.val()['red'])) * 0.39215686
greenValue = int(float(rgbData.val()['green'])) * 0.39215686
blueValue = int(float(rgbData.val()['blue'])) * 0.39215686

rPin = 26
gPin = 19
bPin = 13

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

green_led = LED(17)
pir=MotionSensor(4)
green_led.off()

class SHT21:
    i2c = rpi_i2c.I2C()     # I2C Wrapper Class

    def measure(self, dev=1, scl=3, sda=2):
        """Complete cycle including open, measurement und close, return tuple of temperature and humidity"""
        self.open(dev, scl, sda)
        t = self.read_temperature()
        rh = self.read_humidity()
        self.i2c.close()
        return (t, rh)

    def open(self, dev=1, scl=3, sda=2):
        """Hardware I2C Port, B,B+,Pi 2 = 1 the first Pi = 0"""
        self.i2c.open(0x40,dev, scl, sda)
        self.i2c.write([0xFE])  # execute Softreset Command  (default T=14Bit RH=12)
        time.sleep(0.050)

    def read_temperature(self):
        """ Temperature measurement (no hold master), blocking for ~ 88ms !!! """
        self.i2c.write([0xF3])
        time.sleep(0.086)  # wait, typ=66ms, max=85ms @ 14Bit resolution
        data = self.i2c.read(3)
        if (self._check_crc(data, 2)):
            t = ((data[0] << 8) + data[1]) & 0xFFFC  # set status bits to zero
            t = -46.82 + ((t * 175.72) / 65536)  # T = 46.82 + (175.72 * ST/2^16 )
            return round(t, 1)
        else:
            return None

    def read_humidity(self):
        """ RH measurement (no hold master), blocking for ~ 32ms !!! """
        self.i2c.write([0xF5])  # Trigger RH measurement (no hold master)
        time.sleep(0.03)  # wait, typ=22ms, max=29ms @ 12Bit resolution
        data = self.i2c.read(3)
        if (self._check_crc(data, 2)):
            rh = ((data[0] << 8) + data[1]) & 0xFFFC  # zero the status bits
            rh = -6 + ((125 * rh) / 65536)
            if (rh > 100): rh = 100
            return round(rh, 1)
        else:
            return None

    def close(self):
        """Closes the i2c connection"""
        self.i2c.close()

    def _check_crc(self, data, length):
        """Calculates checksum for n bytes of data and compares it with expected"""
        crc = 0
        for i in range(length):
            crc ^= (ord(chr(data[i])))
            for bit in range(8, 0, -1):
                if crc & 0x80:
                    crc = (crc << 1) ^ 0x131  # CRC POLYNOMIAL
                else:
                    crc = (crc << 1)
        return True if (crc == data[length]) else False
# Threads

# --------Read/Show Temperature and Humidity
def readTempAndHumidity():
    sht21 = SHT21()

    url = 'http://localhost:9000/get-temperature-data'
    ht21Data = {'temperature' : '',
                  'humidity' : ''}
    while True:
        try:
            (temperature, humidity) = sht21.measure(1)      # I2C-1 Port
            sht21Data = {'temperature' : temperature, 'humidity' : humidity}
            requests.post(url, sht21Data)
            #print(response)a
            print("Temperature: %s °C  Humidity: %s %%" % (temperature, humidity))
        except:
            print("SHT21 I/O Error")
        time.sleep(2)

# --------Motion sensor
def motionDetect():
    data = {"isActivated" : ''}
    url = "http://localhost:9000/motion-sensor-data"
    while True:
        pir.wait_for_motion()
        green_led.on()
        data = {"isActivated" : 'true'}
        response = requests.post(url, data)
        pir.wait_for_no_motion()
        green_led.off()
        data = {"isActivated" : 'false'}
        response = requests.post(url, data)

# --------Gas Sensor
def readGas():
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
        if perc["SMOKE"] > 0.25:
            GPIO.output(buzzerPin, GPIO.HIGH)
            time.sleep(2)
            GPIO.output(buzzerPin, GPIO.LOW)
            mq135Data = {"C0" : perc["CO"],
                 "Smoke" : perc["SMOKE"],
                 "isAlarmOn" : 'true'}
            print()
        response = requests.post(url, mq135Data)
        sys.stdout.flush()
        time.sleep(2)

# --------Change RGB Color
def changeRGBColor():      
    url = "http://localhost:9000/rgb-data"
    getUrl = "https://licenta-3e164-default-rtdb.firebaseio.com/sensors/rgb-data"
    getData = ""
    while True:
        rgbData = db.child('sensors/rgb-data').get()
        redValue = int(float(rgbData.val()['red'])) * 0.39215686
        greenValue = int(float(rgbData.val()['green'])) * 0.39215686
        blueValue = int(float(rgbData.val()['blue'])) * 0.39215686
        changeColor(redValue, blueValue, greenValue)
        print(redValue)
        time.sleep(2)

# Functions

# --------changeRGBColor
def changeColor(r_val, g_val, b_val):
    red.ChangeDutyCycle(r_val)
    green.ChangeDutyCycle(g_val)
    blue.ChangeDutyCycle(b_val)

if __name__ == "__main__":
    showTemperatureAndHumidityThread = Thread(target = readTempAndHumidity)
    motionDetectThread = Thread(target = motionDetect)
    changeRGBColorThread = Thread(target = changeRGBColor)
    readGasThread = Thread(target = readGas)

    readGasThread.start()
    changeRGBColorThread.start()
    showTemperatureAndHumidityThread.start()
    motionDetectThread.start()
    
    changeRGBColorThread.join()
    showTemperatureAndHumidityThread.join()
    motionDetectThread.join()
    readGasThread.join()
    print("thread finished..exiting")