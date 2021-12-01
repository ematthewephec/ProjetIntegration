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
        port=int(os.environ.get("PORTDB")),
        host=os.environ.get("HOST"),
        user=os.environ.get("USER"),
        password=os.environ.get("PASSWORDDB"),
        database=os.environ.get("DATABASE"),

    )
except mdb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

db_cursor = my_db.cursor()


### FUNCTIONS TO CHECK TABLES ###
def check_user_table():
    db_cursor.execute("SHOW TABLES LIKE 'Users';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE Users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(45) NOT NULL, \
        password VARCHAR(500) NOT NULL, email VARCHAR(60) NOT NULL, nom VARCHAR(45) NOT NULL, \
        prenom VARCHAR(45) NOT NULL, PRIMARY KEY (id));")

def check_pcs_table():
    db_cursor.execute("SHOW TABLES LIKE 'pcs';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE pcs(idPc INT NOT NULL AUTO_INCREMENT,\
        idUser INT NOT NULL, PRIMARY KEY (idPc), FOREIGN KEY(idUser) \
        REFERENCES Users(id));")

def check_info_table():
    db_cursor.execute("SHOW TABLES LIKE 'info';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE info(id INT NOT NULL AUTO_INCREMENT, idPc INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, user_name VARCHAR(60) NOT NULL, processor VARCHAR(60) NOT NULL, \
        cpu_type VARCHAR(60) NOT NULL, os_version VARCHAR(60), \
        PRIMARY KEY (id), FOREIGN KEY (idPc) REFERENCES pcs(idPc));")

def check_battery_table():
    db_cursor.execute("SHOW TABLES LIKE 'battery';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE battery (id INT NOT NULL AUTO_INCREMENT, idPc INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, battery_percent FLOAT(3,1) NOT NULL, PRIMARY KEY (id), \
        FOREIGN KEY (idPc) REFERENCES pcs(idPc));")

def check_cpu_table():
    db_cursor.execute("SHOW TABLES LIKE 'cpu';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE cpu (id INT NOT NULL AUTO_INCREMENT, idPc INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, cpu_percent FLOAT(3,1) NOT NULL, PRIMARY KEY (id), \
        FOREIGN KEY (idPc) REFERENCES pcs(idPc));")

def check_ram_table():
    db_cursor.execute("SHOW TABLES LIKE 'ram';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE ram (id INT NOT NULL AUTO_INCREMENT, idPc INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, total_virtual VARCHAR(12) NOT NULL, percent_virtual FLOAT(3,1) NOT NULL, \
        total_swap VARCHAR(12) NOT NULL, percent_swap FLOAT(3,1) NOT NULL, PRIMARY KEY (id), \
        FOREIGN KEY (idPc) REFERENCES pcs(idPc));")

def check_storage_table():
    db_cursor.execute("SHOW TABLES LIKE 'storage';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE storage (id INT NOT NULL AUTO_INCREMENT, idPc INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, total_storage VARCHAR(20) NOT NULL, used_storage VARCHAR(20) NOT NULL, \
        PRIMARY KEY (id), FOREIGN KEY (idPc) REFERENCES pcs(idPc));")


### FUNCTIONS TO SEND DATA ###
def info_test_to_db(idPc, current_date, user_name, processor, cpu_type, os_version):
    sql = "INSERT INTO info(idPc, test_date, user_name, processor, cpu_type, os_version) \
    VALUES (%s, %s, %s, %s, %s, %s)"
    values = (id, idPc, current_date, user_name, processor, cpu_type, os_version)
    db_cursor.execute(sql, values)
    my_db.commit()


def battery_test_to_db(idPc, current_date, percent):
    sql = "INSERT INTO battery (idPc, test_date, battery_percent) VALUES (%s, %s, %s)"
    values = (idPc, current_date, percent)
    db_cursor.execute(sql, values)
    my_db.commit()


def cpu_test_to_db(idPc, current_date, percent):
    sql = "INSERT INTO cpu (idPc, test_date, cpu_percent) VALUES (%s, %s, %s)"
    values = (idPc, current_date, percent)
    db_cursor.execute(sql, values)
    my_db.commit()


def ram_test_to_db(idPc, current_date, total_virtual, percent_virtual, total_swap, percent_swap):
    sql = "INSERT INTO ram (idPc, current_date, total_virtual, percent_virtual, total_swap, percent_swap) VALUES \
                  (%s, %s, %s, %s, %s, %s)"
    values = (idPc, current_date, total_virtual, percent_virtual, total_swap, percent_swap)
    db_cursor.execute(sql, values)
    my_db.commit()


def storage_test_to_db(idPc, current_date, total_storage, used_storage):
    sql = "INSERT INTO storage(idPc, test_date, total_storage, used_storage) VALUES (%s, %s, %s, %s)"
    values = (idPc, current_date, total_storage, used_storage)
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()


### LOAD DATABASE ###

def load_db():
    check_user_table()
    check_pcs_table()
    check_info_table()
    check_cpu_table()
    check_ram_table()
    check_battery_table()
    check_storage_table()


### CHECK IF USER AND PC EXISTS ###

def check_user(username):
    db_cursor.execute(f"SELECT id from Users WHERE username == {username};")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        print('Does not exist')
    else:
        check_pc(username, int(os.environ.get("IDPC")))


def check_pc(idUser, idPC):
    db_cursor.execute(f"SELECT * from pcs WHERE idPc == {idPC};")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        db_cursor.execute(f"INSERT INTO pcs(idPc, idUser) VALUES (null, {idUser}")


if __name__ == '__main__':
    pass



