import mariadb as mdb

### LOGIN TO MYSQL DATABASE###
def main():
    try:
        mydb = mdb.connect(
            host="localhost",
            user="root",
            password="Jh@ndar.506",
            port=3307,
            database="python_data"
        )
        return mydb
    except mdb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

