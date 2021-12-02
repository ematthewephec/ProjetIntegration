import speedtest as speed
import psutil
import platform
import cpuinfo
import GPUtil
from datetime import datetime
from threading import *
import time
# from pyspectator.processor import Cpu # temperature
import dbconnection as dbc
import math
import os
#import dotenv
from dotenv import load_dotenv as env

IS_RUNNING = True
computer_data = {}
BUTTON_TOGGLE = False

IDPC = int(os.environ.get("IDPC"))
CURRENT_DATE = datetime.now()

# https://www.thepythoncode.com/article/get-hardware-system-information-python
def get_size(bytes, suffix='B'):
    factor = 1028
    for unit in ["", "K", "M", "G", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor

def convert_time(seconds):
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return "%d:%02d:%02d" % (hours, minutes, seconds)

### TESTS ###
def info_test():
    computer_data['info'] = {}
    while IS_RUNNING:
        """print('--------------------------')
        print('------- info Test ---------')
        print('--------------------------')"""
        user = psutil.users()
        # print(f"user is : {user[0].name}")
        computer_data['info']['user_name'] = user[0].name
        # print(f"User: {user[0].name}")
        computer_data['info']['processor'] = platform.processor()
        # print(f"the processor is : {platform.processor()}")
        computer_data['info']['cpu_type'] = cpuinfo.get_cpu_info()['brand_raw']
        computer_data['info']['os_version'] = platform.platform()
        # print(f"CPU is : {cpu}")
        # test1 = platform.machine()
        # print(test1)
        # lol1 = cpuinfo.get_cpu_info()
        # print(f"the processor is : {lol1.brand_raw}")
        time.sleep(300)

def battery_test():
    computer_data['battery'] = {}
    while IS_RUNNING:
        """print('--------------------------')
            print('----- Battery Test ------')
            print('--------------------------')"""
        battery = psutil.sensors_battery()
        computer_data['battery']['percent'] = battery.percent

def cpu_test():
    computer_data['cpu'] = {}
    while IS_RUNNING:
        i = 0
        while True:
            i = i + 1
            cpu = psutil.cpu_percent(interval=1)
            if cpu > 60 or i == 10:
                # print("FINI")
                break
        computer_data['cpu']['percent'] = cpu

def ram_test():
    computer_data['ram'] = {}
    while IS_RUNNING:
        svmem = psutil.virtual_memory()
        """print('--------------------------')
        print('------- RAM Test ---------')
        print('--------------------------')
        print(f" Total: {get_size(svmem.total)}")
        print(f" Available: {get_size(svmem.available)}")
        print(f" Used: {get_size(svmem.used)}")
        print(f" Percentage: {get_size(svmem.percent)} %")"""
        computer_data['ram']['total_virtual'] = get_size(svmem.total)
        #computer_data['ram']['used_virtual'] = get_size(svmem.used)
        #computer_data['ram']['available_virtual'] = get_size(svmem.available)
        computer_data['ram']['percent_virtual'] = svmem.percent

        swap = psutil.swap_memory()
        """print('\nSwap Partition: ')
        print(f" Total: {get_size(swap.total)}")
        print(f" Free: {get_size(swap.free)}")
        print(f" Used: {get_size(swap.used)}")
        print(f" Percentage: {get_size(swap.percent)} %")"""
        computer_data['ram']['total_swap'] = get_size(swap.total)
        #computer_data['ram']['used_swap'] = get_size(swap.used)
        #computer_data['ram']['available_swap'] = get_size(swap.available)
        computer_data['ram']['percent_swap'] = swap.percent

def storage_test():
    computer_data['storage'] = {}
    while IS_RUNNING:
        partitions = psutil.disk_partitions()
        # disk_nums, total storage, total used
        # print(len(partitions))
        #computer_data['storage_disk']['partitions'] = len(partitions)
        total_storage_size = 0
        total_storage_used = 0

        for partition in partitions:
            try:
                partition_usage = psutil.disk_usage(partition.mountpoint)
            except PermissionError:
                # this can be caught due to the disk that
                # isn't ready
                continue
            total_storage_size += partition_usage.total
            total_storage_used += partition_usage.used

        computer_data['storage']['total_storage'] = get_size(total_storage_size)
        computer_data['storage']['used_storage'] = get_size(total_storage_used)

        time.sleep(60)

#TO DO
def gpu_test():
    pass

#TO DO
def network_info_test():
    pass

#TO DO
def temperature_test():
    pass

def speed_test():
    while IS_RUNNING:
        """print('--------------------------')
        print('------- Speed Test -------')
        print('--------------------------')"""
        computer_data['speedtest'] = {}
        test = speed.Speedtest()
        # print("Loading server list ...")
        test.get_servers()
        # print("Choosing best server...")
        best = test.get_best_server()

        # print(f"Found: {best['host']} located in {best['country']}")

        # print("performing download test ...")
        download_result = test.download()
        # print("performing upload test ...")
        upload_result = test.upload()
        ping_result = test.results.ping

        # print(f" download test : {download_result / 1024 / 1024:.2f} Mbits/s")
        # print(f" upload test : {upload_result / 1024 / 1024:.2f} Mbits/s")
        # print(f" ping test : {ping_result} ms")

        computer_data['speedtest']['download'] = math.trunc(download_result / 1024 / 1024)
        computer_data['speedtest']['upload'] = math.trunc(upload_result / 1024 / 1024)
        computer_data['speedtest']['ping'] = math.trunc(ping_result)


### concept
# run tests in concurrence
# send data to database through backend nodejs request
# once data has been successfully sent or received,
# get data for display using another function
# loop until app is killed or tests are stopped


def display_data():
    while IS_RUNNING:
        print('Waiting for data...')
        time.sleep(15)
        #print(computer_data)

        print('=====OVERVIEW=====')
        print(f'Time: {datetime.today()}')
        print(f"User: {computer_data['info']['user']}")
        print(f"CPU: {computer_data['info']['cpu_type']}")
        print(f"Processor: {computer_data['info']['processor']}")
        print(f"Battery Percentage: {computer_data['battery']['percent']}%")
        print(f"CPU Percentage: {computer_data['cpu']['percent']}%")
        print("\n")
        print(f"Number of Disk Partitions: {computer_data['storage']['number']}")
        print(f"Total Storage Space: {computer_data['storage']['total_storage']}")
        print(f"Used Storage Space: {computer_data['storage']['used_storage']}")
        print("\n")
        print(f"RAM - Total Virtual Memory: {computer_data['ram']['vram_total']}")
        print(f"RAM - Virtual Memory Percentage: {computer_data['ram']['vram_percent']}%")
        print(f"RAM - Total Swap Memory: {computer_data['ram']['swap_total']}")
        print(f"RAM - Swap Memory Percentage: {computer_data['ram']['swap_percent']}%")
        print("\n")
        #print(f"Network Download Speed: {computer_data['speedtest']['download']} Mbits/s")
        #print(f"Network Upload Speed: {computer_data['speedtest']['upload']} Mbits/s")
        #print(f"Network Ping: {computer_data['speedtest']['ping']} ms")

def send_data():
    while IS_RUNNING:
        time.sleep(12)
        dbc.info_test_to_db(IDPC, CURRENT_DATE, **computer_data['info'])
        dbc.battery_test_to_db(IDPC, CURRENT_DATE, **computer_data['battery'])
        dbc.cpu_test_to_db(IDPC, CURRENT_DATE, **computer_data['cpu'])
        dbc.ram_test_to_db(IDPC, CURRENT_DATE, **computer_data['ram'])
        dbc.storage_test_to_db(IDPC, CURRENT_DATE, **computer_data['storage'])
        print('Data successfully sent!')

def run_tests():
    IS_RUNNING = True
    ### configure daemons
    # speed_test() TODO DEBUG
    # cpu_test() OK
    # ram_test() OK
    # battery_test() OK
    # user_info_test() OK
    # storage_test() OK
    # network_test TODO
    # temperature_test() TODO
    # display_data() OK

    info_thread = Thread(target=info_test, daemon=True)
    battery_thread = Thread(target=battery_test, daemon=True)
    cpu_thread = Thread(target=cpu_test, daemon=True)
    ram_thread = Thread(target=ram_test, daemon=True)
    storage_thread = Thread(target=storage_test, daemon=True)
    #speedtest_thread = Thread(target=speed_test, daemon=True)
    #gpu_thread
    #network_thread
    #temperature_thread
    #display_thread = Thread(target=display_data, daemon=True)
    send_data_thread = Thread(target=send_data, daemon=True)

    ### initialize daemons
    ### once tkinter button is linked, we can toggle start and stop
    info_thread.start()
    battery_thread.start()
    cpu_thread.start()
    ram_thread.start()
    storage_thread.start()
    #speedtest_thread.start()
    #gpu_thread.start()
    #network_thread.start()
    #temperature_thread.start()
    #display_thread.start()
    send_data_thread.start()

    while IS_RUNNING:
        pass
        # insert event listener here to check if App button stops tests
        if BUTTON_TOGGLE:
            IS_RUNNING = False

if __name__ == "__main__":
    dbc.load_db()
    run_tests()




