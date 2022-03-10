
import requests
from gpiozero import LED
from gpiozero import MotionSensor

green_led = LED(17)
pir=MotionSensor(4)
green_led.off()
data = {"isActivated" : ''}
url = "http://localhost:9000/motion-sensor-data"


while True:
    pir.wait_for_motion()
    green_led.on()
    print("Motion Detected")
    data = {"isActivated" : 'true'}
    response = requests.post(url, data)
    print(response)
    pir.wait_for_no_motion()
    green_led.off()
    data = {"isActivated" : 'false'}
    response = requests.post(url, data)
    print(response)
    print("Motion Stopped")