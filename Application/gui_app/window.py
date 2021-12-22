import sys
from tkinter import *
import requests
from PIL import ImageTk, Image
import webbrowser
import pystray
from pystray import MenuItem as item
import json
import platform
import cpuinfo
import psutil
import GPUtil
import serial.tools.list_ports
import speedtest
import threading
import aiohttp
import asyncio
from Application.data import datacollection as data
from Application.data import dbconnection as dbc


class Window():
    def __init__(self, user, lock, exit, web, icon):
        self.tk = Tk()
        self.icon = ImageTk.PhotoImage(icon)
        self.tk.iconphoto(False, self.icon)
        self.tk.title("Check Computers")
        self.tk.geometry("500x600")
        self.tk.resizable(False, False)
        self.tk.configure(background='#8eb8de')
        self.tk.protocol('WM_DELETE_WINDOW', self.hide_window)

        self.img1 = ImageTk.PhotoImage(file="photos/input.png")
        self.img2 = ImageTk.PhotoImage(file="photos/input.png")
        self.confirm = ImageTk.PhotoImage(file="photos/login.png")
        self.user_img = ImageTk.PhotoImage(user)
        self.lock_img = ImageTk.PhotoImage(lock)
        self.exit_img = ImageTk.PhotoImage(exit)
        self.web_img = ImageTk.PhotoImage(web)
        self.widget_small = ImageTk.PhotoImage(file="photos/widget1.png")
        self.widget_medium = ImageTk.PhotoImage(file="photos/widget2.png")
        self.widget_long = ImageTk.PhotoImage(file="photos/widget3.png")
        self.widget_height = ImageTk.PhotoImage(file="photos/widget4.png")
        self.img_latency = ImageTk.PhotoImage(file="photos/latency.png")
        self.img_download = ImageTk.PhotoImage(file="photos/down-arrow.png")
        self.img_upload = ImageTk.PhotoImage(file="photos/upload.png")

        self.user = Image.open("photos/account.png").resize((45, 45), Image.ANTIALIAS)
        self.lock = Image.open("photos/lock.png").resize((45, 45), Image.ANTIALIAS)
        self.exit = Image.open("photos/logout.png").resize((30, 30), Image.ANTIALIAS)
        self.web = Image.open("photos/web.png").resize((30, 30), Image.ANTIALIAS)

        self.cpu = {}
        self.os = {}
        self.storage = {}
        self.ram = {}
        self.gpu = {}
        self.getInfos()
        # verson python 3.7
        self.speed = speedtest.Speedtest()

        self.counter = 0
        self.entry1 = None
        self.entry2 = None

        self.pc_name = None
        self.user_id = None
        self.pc_id = None

        self.ser = None

        self.master = None
        self.ecran = False
        self.btn_speed_test = None
        self.speed_test_run = None
        self.latency_val = None
        self.down_val = None
        self.up_val = None
        self.icon_service = None
        self.test_ecran = None
        self.upload = IntVar()
        self.download = IntVar()
        self.latency = IntVar()

        self.create_title()
        self.create_input()
        self.create_button()
        self.tk.after(0, self.run_as_service())

        self.tk.mainloop()

    def show_window(self):
        self.icon_service.stop()
        self.tk.after(0, self.tk.deiconify())

    def create_service(self):
        image = Image.open("favicon.ico")
        menu = (item('Login', self.show_window), item('Exit', self.close_app))
        self.icon_service = pystray.Icon("name", image, "Checkpcs", menu)

    def hide_window(self):
        self.tk.withdraw()
        self.create_service()
        self.icon_service.run()

    def run_as_service(self):
        self.create_service()
        self.tk.withdraw()
        self.icon_service.run()

    def create_title(self):
        titre = Label(text="User Login", font=("Berlin Sans fb demi", 32), foreground="#1d0159", background="#8eb8de")
        titre.place(
            x=100, y=50,
            width=300,
            height=60)

    def create_input(self):
        label = Label(self.tk, image=self.img1, borderwidth=0,highlightthickness=0 )
        label.pack(pady=140)
        label_user1 = Label(self.tk, image=self.user_img, borderwidth=0,highlightthickness=0)
        label_user1.place(x=118, y=155)
        self.entry1 = Entry(
            bd=0,
            bg="#6883A7",
            highlightthickness=0, font=("Berlin Sans fb demi", 12))
        self.entry1.place(
            x=190, y=150,
            width=185,
            height=60)

        label2 = Label(self.tk, image=self.img2, borderwidth=0,highlightthickness=0)
        label2.place(x=100, y=240)
        label_lock = Label(self.tk, image=self.lock_img, borderwidth=0,highlightthickness=0)
        label_lock.place(x=118, y=255)
        self.entry2 = Entry(
            bd=0,
            bg="#6883A7",
            highlightthickness=0, font=("Berlin Sans fb demi", 12), show="*")
        self.entry2.place(
            x=190, y=250,
            width=185,
            height=60)

    def create_button(self):
        btn = Button(self.tk,
                     command=self.close_app,
                     image=self.exit_img,
                     borderwidth=0,
                     highlightthickness=0,
                     background="#8eb8de",
                     activebackground="#8eb8de")
        btn.place(
            x=30, y=530,
            width=40,
            height=40)

        btn2 = Button(self.tk,
                      command=self.open_website,
                      image=self.web_img,
                      borderwidth=0,
                      highlightthickness=0,
                      background="#8eb8de",
                      activebackground="#8eb8de")
        btn2.place(
            x=440, y=530,
            width=40,
            height=40)

        btn3 = Button(self.tk,
                      command=self.connexion_1,
                      image=self.confirm,
                      borderwidth=0,
                      highlightthickness=0,
                      background="#8eb8de",
                      activebackground="#8eb8de")
        btn3.pack(pady=10)

    def connexion_1(self):
        asyncio.run(self.connexion())

    async def connexion(self):
        url = 'https://checkpcs.com/api/user/Login'
        myobj = {'username': self.entry1.get(), 'password': self.entry2.get()}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=myobj) as res:
                data = await res.json()
                print(data)

        if(data["auth"]):
            self.counter += 1
            self.open_app()
            self.tk.after(1000, self.run_tests, self.pc_id)
        else:
            self.tk.destroy()

    def send_to_arduino(self):
        self.collected_data = data.computer_data
        print(self.collected_data)
        ram_percent = str(self.collected_data['ram']['percent_virtual'])
        cpu_percent = str(self.collected_data['cpu']['percent'])
        battery_percent = str(self.collected_data['battery']['percent'])
        storage_percent = str((int(self.collected_data['storage']['used_storage'][:-2]) / int(
            self.collected_data['storage']['total_storage'][:-2])) * 100)

        arduino_data = f"{ram_percent}-{cpu_percent}-{battery_percent}-{storage_percent}"

        print(arduino_data)
        myports = [tuple(p) for p in list(serial.tools.list_ports.comports())]
        if "VID:PID=2341:0043" in myports[0][2]:
            self.ser = serial.Serial()
            self.ser.baudrate = 19200
            self.ser.port = myports[0][0]
            self.ser.open()

            self.tk.after(3500, lambda: self.ser.write(b'' + arduino_data.encode() + b'\n'))

    def run_tests(self, pc_id):
        data.run_tests(pc_id)
        #self.tk.after(20000, self.send_to_arduino)

    def check_pc(self):
        self.pc_name = psutil.users()[0].name
        self.user_id = dbc.get_user_id(self.entry1.get())
        # self.user_id = 7
        if dbc.check_pc(self.user_id, self.pc_name) == 0:
            data.info_test()
            dbc.pc_info_test_to_db(self.user_id, data.CURRENT_DATE, **data.computer_data['info'])
        self.pc_id = dbc.get_pc_id(self.user_id, self.pc_name)
        print(f"PC {self.pc_name} exists!")

    def close_app(self):
        self.tk.destroy()
        if self.icon_service is not None:
            self.icon_service.stop()

    def open_website(self):
        webbrowser.open('https://www.checkpcs.com')

    def open_app(self):
        self.tk.withdraw()
        self.master = Toplevel(self.tk)
        self.master.title("Check Computers")
        self.master.geometry("520x730")
        self.master.resizable(0, 0)
        self.master.configure(background='#121834')
        self.widgets()
        self.displayInfos()
        self.connectedScreen()
        self.widget_speed_test()
        self.check_pc()
        self.master.protocol('WM_DELETE_WINDOW', self.hide_master)

    def hide_master(self):
        self.counter -= 1
        self.master.withdraw()
        #self.tk.after_cancel(self.test_ecran)
        self.create_service_data()
        self.icon_service.run()

    def create_service_data(self):
        image = Image.open("favicon.ico")
        menu = (item('Show', self.show_window_data), item('Logout', self.logout), item('Exit', self.close_app))
        self.icon_service = pystray.Icon("name", image, "Checkpcs", menu)

    def show_window_data(self):
        self.icon_service.stop()
        self.tk.after(0, self.master.deiconify())

    def logout(self):
        data.IS_RUNNING = False
        self.counter = 0
        self.master.destroy()
        self.icon_service.stop()
        self.tk.after(0, self.tk.deiconify())

    def widgets(self):
        info_widget = Label(self.master, image=self.widget_medium, borderwidth=0, highlightthickness=0)
        info_widget.place(x=30, y=30)
        info_widget_title = Label(self.master, text="Système", foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                                  background="#31395e")
        info_widget_title.place(x=50, y=50)

    def displayInfos(self):
        system_stats = Label(self.master, text="-CPU : " + self.cpu['type'],
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=110)
        system_stats = Label(self.master, text="-GPU : " + self.gpu['type'],
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=140)
        system_stats = Label(self.master, text="-OS : " + self.os['os'],
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=170)
        system_stats = Label(self.master, text="-Version : " + self.os['version'],
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=200)
        system_stats = Label(self.master, text="-Ram : " + self.ram['total'],
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=230)
        system_stats = Label(self.master, text="-Nombre de disque : " + str(self.storage['nb_disk']),
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=260)
        system_stats = Label(self.master, text="-Stockage total : " + str(self.storage['storage_total']),
                             font=("Berlin Sans fb demi", 13), background="#31395e", fg="#F5F5F5")
        system_stats.place(x=50, y=290)

    def get_size(self, bytes, suffix='B'):
        factor = 1028
        for unit in ["", "K", "M", "G", "P"]:
            if bytes < factor:
                return f"{bytes:.2f}{unit}{suffix}"
            bytes /= factor

    def getInfos(self):
        partitions = psutil.disk_partitions()
        self.storage['nb_disk'] = len(partitions)
        total_storage_size = 0
        for partition in partitions:
            try:
                partition_usage = psutil.disk_usage(partition.mountpoint)
            except PermissionError:
                continue
            total_storage_size += partition_usage.total
        self.storage['storage_total'] = self.get_size(total_storage_size)

        uname = platform.uname()
        self.os['os'] = f"{uname.system} {uname.release}"
        self.os['version'] = f"{uname.version}"

        self.cpu['type'] = cpuinfo.get_cpu_info()['brand_raw']

        svmem = psutil.virtual_memory()
        self.ram['total'] = self.get_size(svmem.total)

        gpus = GPUtil.getGPUs()
        list_gpus = []
        for gpu in gpus:
            gpu_name = gpu.name
            list_gpus.append(gpu_name)
        self.gpu['type'] = list_gpus[0]

    def screen(self):
        ecran_widget = Label(self.master, image=self.widget_long, borderwidth=0, highlightthickness=0)
        ecran_widget.place(x=30, y=365)
        ecran_widget_title = Label(self.master, text="Ecran", foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                                   background="#31395e")
        ecran_widget_title.place(x=50, y=385)

        if not self.ecran:
            ecran_status = Label(self.master, text="Déconnecté", foreground="#f70909", font=("Berlin Sans fb demi", 30),
                                 background="#31395e")
            ecran_status.place(x=150, y=425)
        elif self.ecran:
            ecran_status = Label(self.master, text="Connecté", foreground="#3df709", font=("Berlin Sans fb demi", 30),
                                 background="#31395e")
            ecran_status.place(x=170, y=425)

    def connectedScreen(self):
        my_ports = [tuple(p) for p in list(serial.tools.list_ports.comports())]
        if len(my_ports) > 0:
            if "VID:PID=2341:0043" in my_ports[0][2]:
                self.ecran = True
            else:
                self.ecran = False
        else:
            self.ecran = False
        self.screen()
        self.test_ecran = self.tk.after(5000, self.connectedScreen)

    def connexion_test(self):
        threads = None
        dl = self.speed.download(threads=threads)
        up = self.speed.upload(threads=threads)
        pings = self.speed.results.ping
        self.download.set(int(dl / 1024 / 1024))
        self.upload.set(int(up / 1024 / 1024))
        self.latency.set(int(pings))

    def test(self):

        self.btn_speed_test["state"] = 'disabled'
        self.speed_test_run["foreground"] = "#3df709"

        threading.Thread(target=self.connexion_test, daemon=True).start()

        self.tk.wait_variable(self.latency)
        self.btn_speed_test["state"] = 'normal'
        self.speed_test_run["foreground"] = "#f70909"

        self.latency_val["text"] = str(self.latency.get()) + " ms"
        self.down_val["text"] = str(self.download.get()) + " Mb/s"
        self.up_val["text"] = str(self.upload.get()) + " Mb/s"

    def widget_speed_test(self):
        speed_widget = Label(self.master, image=self.widget_long, borderwidth=0, highlightthickness=0)
        speed_widget.place(x=30, y=545)
        speed_widget_title = Button(self.master, text="Speed Test", foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                                    background="#31395e", command=self.test, highlightthickness=0,
                                    activebackground="#414c80",
                                    borderwidth=0, relief="flat", disabledforeground="#F5F5F5")
        speed_widget_title.place(x=50, y=555)
        speed_run = Label(self.master, text="run", foreground="#f70909", font=("Berlin Sans fb demi", 14),
                          background="#31395e")
        speed_run.place(x=230, y=575)

        self.speed_test_run = speed_run
        self.btn_speed_test = speed_widget_title

        latency_icon = Label(self.master, image=self.img_latency, borderwidth=0, highlightthickness=0, background="#31395e")
        latency_icon.place(x=360, y=630)
        latency_value = Label(self.master, text="", borderwidth=0, highlightthickness=0, background="#31395e",
                              foreground="#F5F5F5")
        latency_value.place(x=400, y=635)

        download_icon = Label(self.master, image=self.img_download, borderwidth=0, highlightthickness=0,
                              background="#31395e")
        download_icon.place(x=220, y=630)
        download_value = Label(self.master, text="", borderwidth=0, highlightthickness=0, background="#31395e",
                               foreground="#F5F5F5")
        download_value.place(x=260, y=635)

        upload_icon = Label(self.master, image=self.img_upload, borderwidth=0, highlightthickness=0, background="#31395e")
        upload_icon.place(x=70, y=630)
        upload_value = Label(self.master, text="", borderwidth=0, highlightthickness=0, background="#31395e",
                             foreground="#F5F5F5")
        upload_value.place(x=110, y=635)

        self.latency_val = latency_value
        self.down_val = download_value
        self.up_val = upload_value

if __name__ == '__main__':
    data.info_test()