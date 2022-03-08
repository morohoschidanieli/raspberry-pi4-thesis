from mq import *
import sys, time


mq = MQ()
print("Merge1")
while True:
    perc = mq.MQPercentage()
    sys.stdout.write("\r")
    sys.stdout.write("\033[K")
    sys.stdout.write("CO: %g ppm, Smoke: %g ppm" % (perc["CO"], perc["SMOKE"]))
    sys.stdout.flush()
    time.sleep(0.1)

