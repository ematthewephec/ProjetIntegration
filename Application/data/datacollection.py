import psutil
import platform
import cpuinfo
import GPUtil
import time
from datetime import datetime
from threading import *
from .dbconnection import *
import os
import serial.tools.list_ports

IS_RUNNING = True
computer_data = {}
BUTTON_TOGGLE = False

# GET DATE AND TIME
now = datetime.now() # current date and time
CURRENT_DATE = now.strftime("%d/%m/%Y, %H:%M:%S")

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
    user = psutil.users()
    computer_data['info']['user_name'] = user[0].name
    computer_data['info']['processor'] = platform.processor()
    computer_data['info']['cpu_type'] = cpuinfo.get_cpu_info()['brand_raw']

def battery_test(IDPC):
    while IS_RUNNING:
        computer_data['battery'] = {}
        battery = psutil.sensors_battery()
        computer_data['battery']['percent'] = battery.percent
        #battery_test_to_db(IDPC, CURRENT_DATE, **computer_data['battery'])
        #print('Battery data sent!')
        time.sleep(60)
        if not IS_RUNNING:
            break

def battery_test2():
    computer_data['battery'] = {}
    battery = psutil.sensors_battery()
    computer_data['battery']['percent'] = battery.percent
    #battery_test_to_db(IDPC, CURRENT_DATE, **computer_data['battery'])
    #print('Battery data sent!')

def cpu_test(IDPC):
    while IS_RUNNING:
        computer_data['cpu'] = {}
        i = 0
        while True:
            i = i + 1
            cpu = psutil.cpu_percent(interval=1)
            if cpu > 60 or i == 10:
                # print("FINI")
                break
        computer_data['cpu']['percent'] = cpu
        cpu_test_to_db(IDPC, CURRENT_DATE, **computer_data['cpu'])
        print('CPU data sent!')
        time.sleep(10)
        if not IS_RUNNING:
            break

def cpu_test2():
    computer_data['cpu'] = {}
    i = 0
    while True:
        i = i + 1
        cpu = psutil.cpu_percent(interval=1)
        if cpu > 60 or i == 10:
            # print("FINI")
            break
    computer_data['cpu']['percent'] = cpu

def ram_test(IDPC):
    while IS_RUNNING:
        computer_data['ram'] = {}
        svmem = psutil.virtual_memory()
        computer_data['ram']['total_virtual'] = get_size(svmem.total)
        # computer_data['ram']['used_virtual'] = get_size(svmem.used)
        # computer_data['ram']['available_virtual'] = get_size(svmem.available)
        computer_data['ram']['percent_virtual'] = svmem.percent

        swap = psutil.swap_memory()
        computer_data['ram']['total_swap'] = get_size(swap.total)
        # computer_data['ram']['used_swap'] = get_size(swap.used)
        # computer_data['ram']['available_swap'] = get_size(swap.available)

        ram_test_to_db(IDPC, CURRENT_DATE, **computer_data['ram'])

        print('RAM data sent!')
        time.sleep(10)
        if not IS_RUNNING:
            break

def ram_test2():
    computer_data['ram'] = {}
    svmem = psutil.virtual_memory()
    computer_data['ram']['total_virtual'] = get_size(svmem.total)
    # computer_data['ram']['used_virtual'] = get_size(svmem.used)
    # computer_data['ram']['available_virtual'] = get_size(svmem.available)
    computer_data['ram']['percent_virtual'] = svmem.percent

    swap = psutil.swap_memory()
    computer_data['ram']['total_swap'] = get_size(swap.total)
    # computer_data['ram']['used_swap'] = get_size(swap.used)
    # computer_data['ram']['available_swap'] = get_size(swap.available)

def storage_test(IDPC):
    while IS_RUNNING:
        computer_data['storage'] = {}
        partitions = psutil.disk_partitions()
        # disk_nums, total storage, total used
        # print(len(partitions))
        # computer_data['storage_disk']['partitions'] = len(partitions)
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

        #storage_test_to_db(IDPC, CURRENT_DATE, **computer_data['storage'])
        #print('Storage data sent!')
        time.sleep(90)
        if not IS_RUNNING:
            break

def storage_test2():
    computer_data['storage'] = {}
    partitions = psutil.disk_partitions()
    # disk_nums, total storage, total used
    # print(len(partitions))
    # computer_data['storage_disk']['partitions'] = len(partitions)
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


### concept
# run tests in concurrence
# send data to database through backend nodejs request
# once data has been successfully sent or received,
# get data for display using another function
# loop until app is killed or tests are stopped


def display_data():
    print('=====OVERVIEW=====')
    print(f"Battery Percentage: {computer_data['battery']['percent']}%")
    """print(f"CPU Percentage: {computer_data['cpu']['percent']}%")
    print("\n")
    print(f"Number of Disk Partitions: {computer_data['storage']['number']}")
    print(f"Total Storage Space: {computer_data['storage']['total_storage']}")
    print(f"Used Storage Space: {computer_data['storage']['used_storage']}")
    print("\n")
    print(f"RAM - Total Virtual Memory: {computer_data['ram']['vram_total']}")
    print(f"RAM - Virtual Memory Percentage: {computer_data['ram']['vram_percent']}%")
    print(f"RAM - Total Swap Memory: {computer_data['ram']['swap_total']}")
    print(f"RAM - Swap Memory Percentage: {computer_data['ram']['swap_percent']}%")
    print("\n")"""

def send_to_arduino():
    ram_percent = str(computer_data['ram']['percent_virtual'])
    cpu_percent = str(computer_data['cpu']['percent'])
    battery_percent = computer_data['battery']['percent']
    if battery_percent == 100:
        battery_percent = str(99)
    storage_percent = str(77)

    arduino_data = f"{ram_percent}-{cpu_percent}-{battery_percent}-{storage_percent}"

    myports = [tuple(p) for p in list(serial.tools.list_ports.comports())]
    if len(myports) > 0:
        if "VID:PID=2341:0043" in myports[0][2]:
            ser = serial.Serial()
            ser.baudrate = 19200
            ser.port = myports[0][0]
            ser.open()

            time.sleep(3)
            ser.write(b'' + arduino_data.encode() + b'\n')

def send_data(IDPC):
    while IS_RUNNING:
        battery_test2()
        now = datetime.now()
        CURRENT_DATE = now.strftime("%d/%m/%Y, %H:%M:%S")
        battery_test_to_db(IDPC, CURRENT_DATE, **computer_data['battery'])
        print('Battery data sent!')
        time.sleep(1)

        storage_test2()
        now = datetime.now()
        CURRENT_DATE = now.strftime("%d/%m/%Y, %H:%M:%S")
        storage_test_to_db(IDPC, CURRENT_DATE, **computer_data['storage'])
        print('Storage data sent!')
        time.sleep(1)

        for i in range(5):
            cpu_test2()
            now = datetime.now()
            CURRENT_DATE = now.strftime("%d/%m/%Y, %H:%M:%S")
            cpu_test_to_db(IDPC, CURRENT_DATE, **computer_data['cpu'])
            print('CPU data sent!')
            time.sleep(1)

            ram_test2()
            now = datetime.now()
            CURRENT_DATE = now.strftime("%d/%m/%Y, %H:%M:%S")
            ram_test_to_db(IDPC, CURRENT_DATE, **computer_data['ram'])
            print('RAM data sent!')
            time.sleep(1)

        send_to_arduino()

        if not IS_RUNNING:
            break

def get_pc_info():
    info_test()
    IDUSER = get_user_id(os.environ.get("USER_DISPLAY_NAME"))
    if IDUSER == -1:
        IDUSER = get_user_id(os.environ.get("USER_DISPLAY_NAME"))
        CURRENT_DATE = now.strftime("%d/%m/%Y, %H:%M:%S")
        pc_info_test_to_db(IDUSER, CURRENT_DATE, **computer_data['info'])

def run_tests(pc_id):
    ### configure daemons
    # cpu_test() OK
    # ram_test() OK
    # battery_test() OK
    # storage_test() OK
    # display_data() OK

    battery_thread = Thread(target=battery_test, args=[pc_id], daemon=True)
    cpu_thread = Thread(target=cpu_test, args=[pc_id], daemon=True)
    ram_thread = Thread(target=ram_test, args=[pc_id], daemon=True)
    storage_thread = Thread(target=storage_test, args=[pc_id], daemon=True)
    #display_thread = Thread(target=display_data, daemon=True)
    send_data_thread = Thread(target=send_data, args=[pc_id], daemon=True)

    ### initialize daemons
    #battery_thread.start()
    #cpu_thread.start()
    #ram_thread.start()
    #storage_thread.start()
    #display_thread.start()
    send_data_thread.start()

    #battery_thread.join()
    #cpu_thread.join()
    #ram_thread.join()
    #storage_thread.join()


if __name__ == "__main__":
    load_db()
    get_pc_info()
    run_tests()




