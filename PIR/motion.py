from gpiozero import LED
from gpiozero import MotionSensor

green_led = LED(17)
pir=MotionSensor(4)
green_led.off()

while True:
    pir.wait_for_motion()
    green_led.on()
    print("Motion Detected")
    pir.wait_for_no_motion()
    green_led.off()
    print("Motion Stopped")