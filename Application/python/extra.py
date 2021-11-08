import speedtest as speed
import psutil
import platform
import cpuinfo
import GPUtil
from datetime import datetime
from threading import *
import mariadb as mdb
import sys
import time
from pyspectator.processor import Cpu # temperature
import dbconnection as dbc
import math
# import wmi

### LOGIN TO MYSQL DATABASE###
try:
    my_db = mdb.connect(
        host=dbc.host,
        user=dbc.user,
        password=dbc.password,
        port=dbc.port,
        database=dbc.database
    )
except mdb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

db_cursor = my_db.cursor()

u_name = "Jacques"
now_date = datetime.today()

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


def cpu_test_to_db():
    time.sleep(5)
    sql = "INSERT INTO cpu_test (userID, test_date, cpu_percent) VALUES (%s, %s, %s)"
    values = (u_name, now_date, computer_data['cpu_percent'])
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()


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

def battery_test_to_db():
    time.sleep(5)
    sql = "INSERT INTO battery_test (userID, test_date, battery_percent) VALUES (%s, %s, %s)"
    values = (u_name, now_date, computer_data['battery'])
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()

def basic_info_test():
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

def basic_info_test_to_db():
    time.sleep(5)
    sql = "INSERT INTO basic_info_test (userID, test_date, user_name, processor, cpu_type) VALUES (%s, %s, %s, %s, %s)"
    values = (u_name, now_date, computer_data['user'], computer_data['processor'], computer_data['cpu_type'])
    #turn into list
    db_cursor.execute(sql, values)
    my_db.commit()

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
        computer_data['virtual_ram']['percent'] = svmem.percent

        swap = psutil.swap_memory()
        """print('\nSwap Partition: ')
        print(f" Total: {get_size(swap.total)}")
        print(f" Free: {get_size(swap.free)}")
        print(f" Used: {get_size(swap.used)}")
        print(f" Percentage: {get_size(swap.percent)} %")"""
        computer_data['swap_ram']['total'] = get_size(swap.total)
        computer_data['swap_ram']['percent'] = swap.percent

        time.sleep(5)

def ram_test_to_db():
    time.sleep(5)
    sql = "INSERT INTO ram_test (userID, test_date, total_virtual, percent_virtual, total_swap, percent_swap) VALUES \
                  (%s, %s, %s, %s, %s, %s)"
    values = (u_name, now_date, computer_data['virtual_ram']['total'],
              computer_data['virtual_ram']['percent'], computer_data['swap_ram']['total'],
              computer_data['swap_ram']['percent'])
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()

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

def storage_test_to_db():
    time.sleep(5)
    sql = "INSERT INTO storage_test (userID, test_date, total_storage, used_storage) VALUES (%s, %s, %s, %s)"
    values = (u_name, now_date, computer_data['storage_disk']['total'],
              computer_data['storage_disk']['used'])
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()

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

        send_data_to_db()

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


def check_cpu_table():
    db_cursor.execute("SHOW TABLES LIKE 'cpu_test';")
    test = db_cursor.fetchall()
    #print(test)
    if len(test) == 0:
        #print('Does not exist')
        db_cursor.execute("CREATE TABLE cpu_test (userID VARCHAR(60), test_date VARCHAR(60), cpu_percent INT)")


def check_ram_table():
    db_cursor.execute("SHOW TABLES LIKE 'ram_test';")
    test = db_cursor.fetchall()
    #print(test)
    if len(test) == 0:
        #print('Does not exist')
        db_cursor.execute("CREATE TABLE ram_test (userID VARCHAR(60), test_date VARCHAR(60), \
        total_virtual VARCHAR(12), percent_virtual VARCHAR(12), total_swap VARCHAR(12), percent_swap VARCHAR(12))")

def check_basic_info_table():
    db_cursor.execute("SHOW TABLES LIKE 'basic_info_test';")
    test = db_cursor.fetchall()
    #print(test)
    if len(test) == 0:
        #print('Does not exist')
        db_cursor.execute("CREATE TABLE basic_info_test (userID VARCHAR(60), test_date VARCHAR(60), \
        user_name VARCHAR(60), processor VARCHAR(60), cpu_type VARCHAR(60))")

def check_battery_table():
    db_cursor.execute("SHOW TABLES LIKE 'battery_test';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        # print('Does not exist')
        db_cursor.execute("CREATE TABLE battery_test (userID VARCHAR(60), test_date VARCHAR(60), \
            battery_percent VARCHAR(10))")

def check_storage_table():
    db_cursor.execute("SHOW TABLES LIKE 'storage_test';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        # print('Does not exist')
        db_cursor.execute("CREATE TABLE storage_test (userID VARCHAR(60), test_date VARCHAR(60), \
            total_storage VARCHAR(20), used_storage VARCHAR(20))")

def load_db():
    check_basic_info_table()
    check_cpu_table()
    check_ram_table()
    check_battery_table()
    check_storage_table()

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

    basic_info_thread = Thread(target=basic_info_test, daemon=True)
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
    basic_info_thread.start()
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
        if BUTTON_TOGGLE:
            IS_RUNNING = False

def send_data_to_db():
    basic_info_test_to_db()
    cpu_test_to_db()
    battery_test_to_db()
    ram_test_to_db()
    storage_test_to_db()

if __name__ == "__main__":
    load_db()
    run_tests()




