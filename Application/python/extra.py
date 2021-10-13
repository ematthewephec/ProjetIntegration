import speedtest
import psutil
import platform
import os
import time
from pyspectator.processor import Cpu
import wmi
import clr
import cpuinfo
import GPUtil
import sys
from tabulate import tabulate
from datetime import datetime


# https://www.thepythoncode.com/article/get-hardware-system-information-python
def get_size(bytes, suffix='8'):
    factor = 1028
    for unit in ["", "K", "M", "G", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor


def cpu_test():
    print('--------------------------')
    print('------- CPU Test ---------')
    print('--------------------------')
    i = 0
    while True:
        i = i + 1
        cpu = psutil.cpu_percent(interval=1)
        print(cpu)
        if cpu > 60 or i == 10:
            print("FINI")
            break


def convert_time(seconds):
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return "%d:%02d:%02d" % (hours, minutes, seconds)


def baterrie_test():
    print('--------------------------')
    print('----- Baterrie Test ------')
    print('--------------------------')
    battery = psutil.sensors_battery()

    print("Battery percentage : ", battery.percent)
    print("Power plugged in : ", battery.power_plugged)

    # converting seconds to hh:mm:ss
    print("Battery left : ", convert_time(battery.secsleft))


def user_info_test():
    print('--------------------------')
    print('------- info Test ---------')
    print('--------------------------')
    user = psutil.users()
    print(f"user is : {user[0].name}")
    print(f"the processor is : {platform.processor()}")
    lol = cpuinfo.get_cpu_info()['brand_raw']
    print(f"CPU is : {lol}")
    lol1 = cpuinfo.get_cpu_info()
    print(f"the processor is : {lol1}")


def ram_test():
    print('--------------------------')
    print('------- RAM Test ---------')
    print('--------------------------')
    svmem = psutil.virtual_memory()
    print(f" Total: {get_size(svmem.total)}")
    print(f" Available: {get_size(svmem.available)}")
    print(f" Used: {get_size(svmem.used)}")
    print(f" Percentage: {get_size(svmem.percent)} %")

    swap = psutil.swap_memory()
    print('\nSwap Partition: ')
    print(f" Total: {get_size(swap.total)}")
    print(f" Free: {get_size(swap.free)}")
    print(f" Used: {get_size(swap.used)}")
    print(f" Percentage: {get_size(swap.percent)} %")


def test_speed():
    print('--------------------------')
    print('------- Speed Test -------')
    print('--------------------------')
    test = speedtest.Speedtest()
    print("Loading server list ...")
    test.get_servers()
    print("Choosing best server...")
    best = test.get_best_server()

    print(f"Found: {best['host']} located in {best['country']}")

    print("performing download test ...")
    download_result = test.download()
    print("performing upload test ...")
    upload_result = test.upload()
    ping_result = test.results.ping

    print(f" download test : {download_result / 1024 / 1024:.2f} Mbits/s")
    print(f" upload test : {upload_result / 1024 / 1024:.2f} Mbits/s")
    print(f" ping test : {ping_result} ms")


def main():
    # test_speed()
    # ram_test()
    # cpu_test()
    # print('Hardware Monitor:')
    # baterrie_test()
    user_info_test()