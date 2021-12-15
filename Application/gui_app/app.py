import time
from tkinter import *
from PIL import ImageTk, Image
from tkinter import ttk
import platform
import cpuinfo
import psutil
import GPUtil
import serial.tools.list_ports
import speedtest
import threading
import sys
from . import window
import pystray
from pystray import MenuItem as item

class App():
  def __init__(self):
    self.cpu = {}
    self.os = {}
    self.storage = {}
    self.ram = {}
    self.gpu = {}
    self.getInfos()
    self.speed = speedtest.Speedtest()

    self.tk = Tk()
    self.icon = ImageTk.PhotoImage(file="photos/icon.png")
    self.tk.iconphoto(False, self.icon)
    self.tk.title("Check Computers")
    self.tk.geometry("520x730")
    self.tk.resizable(0, 0)
    self.tk.configure(background='#121834')

    self.widget_small = ImageTk.PhotoImage(file="photos/widget1.png")
    self.widget_medium = ImageTk.PhotoImage(file="photos/widget2.png")
    self.widget_long = ImageTk.PhotoImage(file="photos/widget3.png")
    self.widget_height = ImageTk.PhotoImage(file="photos/widget4.png")
    self.img_latence = ImageTk.PhotoImage(file="photos/latency.png")
    self.img_download = ImageTk.PhotoImage(file="photos/down-arrow.png")
    self.img_upload = ImageTk.PhotoImage(file="photos/upload.png")
    self.icon = ImageTk.PhotoImage(file="photos/icon.png")

    self.user = Image.open("photos/account.png").resize((45, 45), Image.ANTIALIAS)
    self.lock = Image.open("photos/lock.png").resize((45, 45), Image.ANTIALIAS)
    self.exit = Image.open("photos/logout.png").resize((30, 30), Image.ANTIALIAS)
    self.web = Image.open("photos/web.png").resize((30, 30), Image.ANTIALIAS)

    self.ecran = False
    self.btn_speed_test = None
    self.speed_test_run = None
    self.latence_val = None
    self.down_val = None
    self.up_val = None
    self.icon = None
    self.test_ecran = None

    self.widgets()
    self.displayInfos()
    self.connectedScreen()
    self.widget_speed_test()
    self.upload = IntVar()
    self.download = IntVar()
    self.latence = IntVar()
    self.tk.protocol("WM_DELETE_WINDOW", self.hidde_window)
    self.tk.mainloop()


  def hidde_window(self):
    self.tk.after_cancel(self.test_ecran)
    self.tk.destroy()
    win = window.Window(self.user, self.lock, self.exit, self.web, self.icon)

  def widgets(self):
    info_widget = Label(self.tk, image=self.widget_medium, borderwidth=0, highlightthickness=0)
    info_widget.place(x=30, y=30)
    info_widget_title = Label(self.tk, text="Système",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    info_widget_title.place(x=50, y=50)

  def displayInfos(self):
    system_stats = Label(self.tk, text="-CPU : " + self.cpu['type'],
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
    system_stats.place(x=50, y=110)
    system_stats = Label(self.tk, text="-GPU : " + self.gpu['type'],
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
    system_stats.place(x=50, y=140)
    system_stats = Label(self.tk, text="-OS : " + self.os['os'],
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
    system_stats.place(x=50, y=170)
    system_stats = Label(self.tk, text="-Version : " + self.os['version'],
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
    system_stats.place(x=50, y=200)
    system_stats = Label(self.tk, text="-Ram : " + self.ram['total'],
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
    system_stats.place(x=50, y=230)
    system_stats = Label(self.tk, text="-Nombre de disque : " + str(self.storage['nb_disk']),
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
    system_stats.place(x=50, y=260)
    system_stats = Label(self.tk, text="-Stockage total : " + str(self.storage['storage_total']),
                         font=("Berlin Sans fb demi", 13),background="#31395e", fg="#F5F5F5")
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
    ecran_widget = Label(self.tk, image=self.widget_long, borderwidth=0, highlightthickness=0)
    ecran_widget.place(x=30, y=365)
    ecran_widget_title = Label(self.tk, text="Ecran",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    ecran_widget_title.place(x=50, y=385)

    if(not self.ecran):
      ecran_status = Label(self.tk, text="Déconnecté", foreground="#f70909",font=("Berlin Sans fb demi", 30),
                           background="#31395e")
      ecran_status.place(x=150,y=425)
    elif(self.ecran):
      ecran_status = Label(self.tk, text="Connecté", foreground="#3df709",font=("Berlin Sans fb demi", 30),
                           background="#31395e")
      ecran_status.place(x=170,y=425)

  def connectedScreen(self):
    myports = [tuple(p) for p in list(serial.tools.list_ports.comports())]
    if len(myports) > 0:
      if "VID:PID=2341:0043" in myports[0][2]:
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
    self.latence.set(int(pings))


  def test(self):

    self.btn_speed_test["state"] = 'disabled'
    self.speed_test_run["foreground"] = "#3df709"

    threading.Thread(target=self.connexion_test, daemon=True).start()

    self.tk.wait_variable(self.latence)
    self.btn_speed_test["state"] = 'normal'
    self.speed_test_run["foreground"] = "#f70909"

    self.latence_val["text"] = str(self.latence.get()) + " ms"
    self.down_val["text"] = str(self.download.get()) + " Mb/s"
    self.up_val["text"] = str(self.upload.get()) + " Mb/s"

  def widget_speed_test(self):
    speed_widget = Label(self.tk, image=self.widget_long, borderwidth=0, highlightthickness=0)
    speed_widget.place(x=30, y=545)
    speed_widget_title = Button(self.tk, text="Speed Test",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e", command=self.test, highlightthickness=0, activebackground="#414c80",
                      borderwidth=0, relief="flat", disabledforeground="#F5F5F5")
    speed_widget_title.place(x=50, y=555)
    speed_run = Label(self.tk, text="run",foreground="#f70909", font=("Berlin Sans fb demi", 14),
                      background="#31395e")
    speed_run.place(x=230, y=575)

    self.speed_test_run = speed_run
    self.btn_speed_test = speed_widget_title

    latence_icon = Label(self.tk, image=self.img_latence, borderwidth=0, highlightthickness=0, background="#31395e")
    latence_icon.place(x=360, y=630)
    latence_value = Label(self.tk, text="", borderwidth=0, highlightthickness=0, background="#31395e",
                          foreground="#F5F5F5")
    latence_value.place(x=400, y=635)

    download_icon = Label(self.tk, image=self.img_download, borderwidth=0, highlightthickness=0, background="#31395e")
    download_icon.place(x=220, y=630)
    download_value = Label(self.tk, text="", borderwidth=0, highlightthickness=0, background="#31395e",
                          foreground="#F5F5F5")
    download_value.place(x=260, y=635)

    upload_icon = Label(self.tk, image=self.img_upload, borderwidth=0, highlightthickness=0, background="#31395e")
    upload_icon.place(x=70, y=630)
    upload_value = Label(self.tk, text="", borderwidth=0, highlightthickness=0, background="#31395e",
                          foreground="#F5F5F5")
    upload_value.place(x=110, y=635)

    self.latence_val = latence_value
    self.down_val = download_value
    self.up_val = upload_value