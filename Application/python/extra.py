import speedtest as speed
import psutil
import platform
import cpuinfo
import GPUtil
from tabulate import tabulate
from datetime import datetime
from multiprocessing import Process as mproc
from threading import *
import mariadb as mdb
import sys
import time
from pyspectator.processor import Cpu # temperature
from dbconnection import main as dbconnect
import math
# import wmi

### LOGIN TO MYSQL DATABASE###
"""try:
    mydb = mdb.connect(
        host="localhost",
        user="root",
        password="Jh@ndar.506",
        port=3307,
        database="python_data"
    )
except mdb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

mycursor = mydb.cursor()"""

my_db = dbconnect()
db_cursor = my_db.cursor()

IS_RUNNING = True
computer_data = {}
BUTTON_TOGGLE = False

# https://www.thepythoncode.com/article/get-hardware-system-information-python
def get_size(bytes, suffix='B'):
    factor = 1028
    for unit in ["", "K", "M", "G", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor


def cpu_test():
   while IS_RUNNING:
       """print('--------------------------')
          print('------- CPU Test ---------')
          print('--------------------------')"""
       i = 0
       while True:
           i = i + 1
           cpu = psutil.cpu_percent(interval=1)
           # print(cpu)
           # cpu_proc = mproc(target=cpu_test_multiproc, args=[cpu])
           # change to thread => daemon
           # cpu_proc.start()
           # cpu_proc.join()
           if cpu > 60 or i == 10:
               # print("FINI")
               break
       computer_data['cpu_percent'] = cpu
       time.sleep(2)


def cpu_test_multiproc(cpu_percent):
    u_name = "test_user"
    now_date = datetime.today()
    sql = "INSERT INTO cpu_test (user_id, test_date, cpu_percent) VALUES (%s, %s, %s)"
    values = (u_name, now_date, cpu_percent)
    # turn into list
    # mycursor.execute(sql, values)
    # mydb.commit()
    time.sleep(1)


def convert_time(seconds):
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return "%d:%02d:%02d" % (hours, minutes, seconds)


def battery_test():
    while IS_RUNNING:
        """print('--------------------------')
            print('----- Battery Test ------')
            print('--------------------------')"""
        battery = psutil.sensors_battery()
        computer_data['battery'] = battery.percent

        """print("Battery percentage : ", battery.percent)
        print("Power plugged in : ", battery.power_plugged)

        # converting seconds to hh:mm:ss
        print("Battery left : ", convert_time(battery.secsleft))"""
        time.sleep(60)

def user_info_test():
    while IS_RUNNING:
        """print('--------------------------')
        print('------- info Test ---------')
        print('--------------------------')"""
        user = psutil.users()
        # print(f"user is : {user[0].name}")
        computer_data['user'] = user[0].name
        # print(f"User: {user[0].name}")
        computer_data['processor'] = platform.processor()
        # print(f"the processor is : {platform.processor()}")
        computer_data['cpu_type'] = cpuinfo.get_cpu_info()['brand_raw']
        # print(f"CPU is : {cpu}")
        # test1 = platform.machine()
        # print(test1)
        # lol1 = cpuinfo.get_cpu_info()
        # print(f"the processor is : {lol1.brand_raw}")
        time.sleep(300)


def ram_test():
    while IS_RUNNING:
        computer_data['virtual_ram'] = {}
        computer_data['swap_ram'] = {}

        svmem = psutil.virtual_memory()
        """print('--------------------------')
        print('------- RAM Test ---------')
        print('--------------------------')
        print(f" Total: {get_size(svmem.total)}")
        print(f" Available: {get_size(svmem.available)}")
        print(f" Used: {get_size(svmem.used)}")
        print(f" Percentage: {get_size(svmem.percent)} %")"""
        computer_data['virtual_ram']['total'] = get_size(svmem.total)
        computer_data['virtual_ram']['percent'] = get_size(svmem.percent)

        swap = psutil.swap_memory()
        """print('\nSwap Partition: ')
        print(f" Total: {get_size(swap.total)}")
        print(f" Free: {get_size(swap.free)}")
        print(f" Used: {get_size(swap.used)}")
        print(f" Percentage: {get_size(swap.percent)} %")"""
        computer_data['swap_ram']['total'] = get_size(swap.total)
        computer_data['swap_ram']['percent'] = get_size(swap.percent)

        time.sleep(5)

def storage_test():
    while IS_RUNNING:
        computer_data['storage_disk'] = {}
        partitions = psutil.disk_partitions()
        # disk_nums, total storage, total used
        # print(len(partitions))
        computer_data['storage_disk']['number'] = len(partitions)
        total_storage_size = 0
        total_storage_used = 0

        for partition in partitions:
            try:
                partition_usage = psutil.disk_usage(partition.mountpoint)
            except PermissionError:
                # this can be catched due to the disk that
                # isn't ready
                continue
            total_storage_size += partition_usage.total
            total_storage_used += partition_usage.used

        computer_data['storage_disk']['total'] = get_size(total_storage_size)
        computer_data['storage_disk']['used'] = get_size(total_storage_used)

        time.sleep(90)

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

        print('=====OVERVIEW=====')
        print(f'Time: {datetime.today()}')
        print(f"User: {computer_data['user']}")
        print(f"CPU: {computer_data['cpu_type']}")
        print(f"Processor: {computer_data['processor']}")
        print(f"Battery Percentage: {computer_data['battery']}%")
        print(f"CPU Percentage: {computer_data['cpu_percent']}%")
        print("\n")
        print(f"Number of Disk Partitions: {computer_data['storage_disk']['number']}")
        print(f"Total Storage Space: {computer_data['storage_disk']['total']}")
        print(f"Used Storage Space: {computer_data['storage_disk']['used']}")
        print("\n")
        print(f"RAM - Total Virtual Memory: {computer_data['virtual_ram']['total']}")
        print(f"RAM - Virtual Memory Percentage: {computer_data['virtual_ram']['percent']}%")
        print(f"RAM - Total Swap Memory: {computer_data['swap_ram']['total']}")
        print(f"RAM - Swap Memory Percentage: {computer_data['swap_ram']['percent']}%")
        print("\n")
        #print(f"Network Download Speed: {computer_data['speedtest']['download']} Mbits/s")
        #print(f"Network Upload Speed: {computer_data['speedtest']['upload']} Mbits/s")
        #print(f"Network Ping: {computer_data['speedtest']['ping']} ms")

def main():
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

    user_info_thread = Thread(target=user_info_test, daemon=True)
    battery_thread = Thread(target=battery_test, daemon=True)
    cpu_thread = Thread(target=cpu_test, daemon=True)
    ram_thread = Thread(target=ram_test, daemon=True)
    storage_thread = Thread(target=storage_test, daemon=True)
    #speedtest_thread = Thread(target=speed_test, daemon=True)
    #gpu_thread
    #network_thread
    #temperature_thread
    display_thread = Thread(target=display_data, daemon=True)

    ### initialize daemons
    ### once tkinter button is linked, we can toggle start and stop
    user_info_thread.start()
    battery_thread.start()
    cpu_thread.start()
    ram_thread.start()
    storage_thread.start()
    #speedtest_thread.start()
    #gpu_thread.start()
    #network_thread.start()
    #temperature_thread.start()
    display_thread.start()
    
    while IS_RUNNING:
        pass
        # insert event listener here to check if App button stops tests
        if(BUTTON_TOGGLE):
            IS_RUNNING = False

if __name__ == "__main__":
    main()

