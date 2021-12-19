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


def check_role(IDUSER):
    db_cursor.execute(f"SELECT Role from Users where idUser = {IDUSER}")
    check = db_cursor.fetchall()
    # if role == 'Admin' => lance tt les checks
    # TODO

### FUNCTIONS TO CHECK TABLES ###
def check_user_table():
    db_cursor.execute("SHOW TABLES LIKE 'Users';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE Users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(45) NOT NULL, \
        password VARCHAR(500) NOT NULL, email VARCHAR(60) NOT NULL, nom VARCHAR(45) NOT NULL, \
        prenom VARCHAR(45) NOT NULL, role VARCHAR(45) NOT NULL, PRIMARY KEY (id));")

def check_pcs_table():
    db_cursor.execute("SHOW TABLES LIKE 'pcs';")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE pcs(idPc INT NOT NULL AUTO_INCREMENT,\
        idUser INT NOT NULL, test_date VARCHAR(60) NOT NULL, user_name VARCHAR(60) NOT NULL, processor VARCHAR(60) NOT NULL, \
        cpu_type VARCHAR(60) NOT NULL, PRIMARY KEY (idPc), FOREIGN KEY(idUser) \
        REFERENCES Users(id));")

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
        total_swap VARCHAR(12) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (idPc) REFERENCES pcs(idPc));")

def check_storage_table():
    db_cursor.execute("SHOW TABLES LIKE 'storage';")
    test = db_cursor.fetchall()
    if len(test) == 0:
        db_cursor.execute("CREATE TABLE storage (id INT NOT NULL AUTO_INCREMENT, idPc INT NOT NULL, \
        test_date VARCHAR(60) NOT NULL, total_storage VARCHAR(20) NOT NULL, used_storage VARCHAR(20) NOT NULL, \
        PRIMARY KEY (id), FOREIGN KEY (idPc) REFERENCES pcs(idPc));")


### FUNCTIONS TO SEND DATA ###
def pc_info_test_to_db(idUser, current_date, user_name, processor, cpu_type):
    sql = "INSERT INTO pcs (idUser, test_date, user_name, processor, cpu_type) \
    VALUES (%s, %s, %s, %s, %s);"
    values = (idUser, current_date, user_name, processor, cpu_type)
    db_cursor.execute(sql, values)
    my_db.commit()

def battery_test_to_db(idPc, current_date, percent):
    sql = "INSERT INTO battery (idPc, test_date, battery_percent) VALUES (%s, %s, %s);"
    values = (idPc, current_date, percent)
    db_cursor.execute(sql, values)
    my_db.commit()

def cpu_test_to_db(idPc, current_date, percent):
    sql = "INSERT INTO cpu (idPc, test_date, cpu_percent) VALUES (%s, %s, %s);"
    values = (idPc, current_date, percent)
    db_cursor.execute(sql, values)
    my_db.commit()

def ram_test_to_db(idPc, current_date, total_virtual, percent_virtual, total_swap):
    sql = "INSERT INTO ram (idPc, test_date, total_virtual, percent_virtual, total_swap) VALUES (%s, %s, %s, %s, %s);"
    values = (idPc, current_date, total_virtual, percent_virtual, total_swap)
    db_cursor.execute(sql, values)
    my_db.commit()

def storage_test_to_db(idPc, current_date, total_storage, used_storage):
    time.sleep(5)
    sql = "INSERT INTO storage(idPc, test_date, total_storage, used_storage) VALUES (%s, %s, %s, %s);"
    values = (idPc, current_date, total_storage, used_storage)
    # turn into list
    db_cursor.execute(sql, values)
    my_db.commit()


### LOAD DATABASE ###

def load_db():
    check_user_table()
    check_pcs_table()
    #print(os.environ.get("USER_DISPLAY_NAME"))
    check_user(os.environ.get("USER_DISPLAY_NAME"))
    check_cpu_table()
    check_ram_table()
    check_battery_table()
    check_storage_table()


### CHECK IF USER AND PC EXISTS ###

def check_user(user_name):
    db_cursor.execute(f"SELECT id from Users WHERE username = '{user_name}';")
    test = db_cursor.fetchall()
    #print(test)
    if len(test) == 0:
        print('Who are you?')
    else:
        print(f"Hello, {user_name}!")
        check_pc(os.environ.get("USERNAME"))

def check_pc(idUser, pc_name):
    db_cursor.execute(f"SELECT idPc from pcs WHERE (idUser = '{idUser}' AND user_name = '{pc_name}');")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        print(f"No PC registered.")
        return 0
    else:
        print(f"This computer's registered!")
        return 1

### GET USER ID and PC ID
def get_user_id(user_name):
    db_cursor.execute(f"SELECT id from Users WHERE username = '{user_name}';")
    test = db_cursor.fetchall()
    print(test)
    if len(test) == 0:
        print('No user found!')
        return -1;
    else:
        user_id = int(''.join(map(str, test[0])))
        return user_id

def get_pc_id(idUser, pc_name):
    db_cursor.execute(f"SELECT idPc from pcs WHERE (idUser = '{idUser}' AND user_name = '{pc_name}');")
    test = db_cursor.fetchall()
    # print(test)
    if len(test) == 0:
        print(f"No PC found!")
        return -1
    else:
        pc_id = int(''.join(map(str, test[0])))
        return pc_id


if __name__ == '__main__':
    pass



