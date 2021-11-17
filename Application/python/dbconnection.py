import sys
import mariadb as mdb
import os
from dotenv import load_dotenv as env
import time

### SETUP ENVIRONMENT VARIABLES ###
env()

### CONNECT TO DATABASE ###
try:
    my_db = mdb.connect(
        port = int(os.environ.get("PORTDB")),
        host = os.environ.get("HOST"),
        user = os.environ.get("USER"),
        password = os.environ.get("PASSWORDDB"),
        database = os.environ.get("DATABASE")
    )
except mdb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

db_cursor = my_db.cursor()


### FUNCTIONS TO CHECK TABLES ###
def check_user_table():
    db_cursor.execute("SHOW TABLES LIKE 'users';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        # print('Does not exist')
        db_cursor.execute("CREATE TABLE users (id INT NOT NULL, username VARCHAR(45) NOT NULL, \
        passwords VARCHAR(500) NOT NULL, email VARCHAR(60) NOT NULL, nom VARCHAR(45) NOT NULL, \
        prenom VARCHAR(45) NOT NULL, PRIMARY KEY (id));")

def check_basic_info_table():
    db_cursor.execute("SHOW TABLES LIKE 'basic_info_test';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        #print('Does not exist')
        db_cursor.execute("CREATE TABLE basic_info_test (testID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, user_name VARCHAR(60) NOT NULL, processor VARCHAR(60) NOT NULL, \
        cpu_type VARCHAR(60) NOT NULL, PRIMARY KEY (testID), FOREIGN KEY (userID) REFERENCES users(id));")

def check_battery_table():
    db_cursor.execute("SHOW TABLES LIKE 'battery_test';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        # print('Does not exist')
        db_cursor.execute("CREATE TABLE battery_test (testID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, battery_percent FLOAT(3,1) NOT NULL, PRIMARY KEY (testID), \
        FOREIGN KEY (userID) REFERENCES users(id));")

def check_cpu_table():
    db_cursor.execute("SHOW TABLES LIKE 'cpu_test';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        #print('Does not exist')
        db_cursor.execute("CREATE TABLE cpu_test (testID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, cpu_percent FLOAT(3,1) NOT NULL, PRIMARY KEY (testID), \
        FOREIGN KEY (userID) REFERENCES users(id));")

def check_ram_table():
    db_cursor.execute("SHOW TABLES LIKE 'ram_test';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        #print('Does not exist')
        db_cursor.execute("CREATE TABLE ram_test (testID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, total_virtual VARCHAR(12) NOT NULL, percent_virtual FLOAT(3,1) NOT NULL, \
        total_swap VARCHAR(12) NOT NULL, percent_swap FLOAT(3,1) NOT NULL, PRIMARY KEY (testID), FOREIGN KEY (userID) REFERENCES users(id));")

def check_storage_table():
    db_cursor.execute("SHOW TABLES LIKE 'storage_test';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        # print('Does not exist')
        db_cursor.execute("CREATE TABLE storage_test (testID INT NOT NULL AUTO_INCREMENT, userID INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, total_storage VARCHAR(20) NOT NULL, used_storage VARCHAR(20) NOT NULL, \
        PRIMARY KEY (testID), FOREIGN KEY (userID) REFERENCES users(id));")

### FUNCTIONS TO SEND DATA ###
def basic_info_test_to_db(userID, current_date, user, processor, cpu_type):
    sql = "INSERT INTO basic_info_test (userID, test_date, user_name, processor, cpu_type) VALUES (%s, %s, %s, %s, %s)"
    values = (userID, current_date, user, processor, cpu_type)
    db_cursor.execute(sql, values)
    my_db.commit()

def battery_test_to_db(userID, current_date, percent):
    sql = "INSERT INTO battery_test (userID, test_date, battery_percent) VALUES (%s, %s, %s)"
    values = (userID, current_date, percent)
    db_cursor.execute(sql, values)
    my_db.commit()

def cpu_test_to_db(userID, current_date, percent):
    sql = "INSERT INTO cpu_test (userID, test_date, cpu_percent) VALUES (%s, %s, %s)"
    values = (userID, current_date, percent)
    db_cursor.execute(sql, values)
    my_db.commit()

def ram_test_to_db(userID, current_date, vram_total, vram_percent, swap_total, swap_percent):
    sql = "INSERT INTO ram_test (userID, test_date, total_virtual, percent_virtual, total_swap, percent_swap) VALUES \
                  (%s, %s, %s, %s, %s, %s)"
    values = (userID, current_date, vram_total, vram_percent, swap_total, swap_percent)
    db_cursor.execute(sql, values)
    my_db.commit()

def storage_test_to_db(userID, current_date, total_storage, used_storage):
    time.sleep(5)
    sql = "INSERT INTO storage_test (userID, test_date, total_storage, used_storage) VALUES (%s, %s, %s, %s)"
    values = (userID, current_date, total_storage, used_storage)
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()

### LOAD DATABASE ###
def load_db():
    check_user_table()
    check_basic_info_table()
    check_cpu_table()
    check_ram_table()
    check_battery_table()
    check_storage_table()

if __name__ == '__main__':
    pass



