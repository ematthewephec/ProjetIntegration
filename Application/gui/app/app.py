from tkinter import *
from PIL import ImageTk, Image
from tkinter import ttk

class App():
  def __init__(self):
    self.tk = Tk()
    self.tk.title("Check Computers")
    self.tk.geometry("1350x750")
    self.tk.resizable(0, 0)
    self.tk.configure(background='#121834')

    self.ttk = ttk.Style()
    self.ttk.theme_use('clam')
    self.ttk.configure("green.Horizontal.TProgressbar", background='#90ee90')

    self.widget_small = ImageTk.PhotoImage(file="photos/widget1.png")
    self.widget_medium = ImageTk.PhotoImage(file="photos/widget2.png")
    self.widget_long = ImageTk.PhotoImage(file="photos/widget3.png")
    self.widget_height = ImageTk.PhotoImage(file="photos/widget4.png")
    self.upload = ImageTk.PhotoImage(file="photos/upload.png")
    self.download = ImageTk.PhotoImage(file="photos/down-arrow.png")
    self.latence = ImageTk.PhotoImage(file="photos/latency.png")
    self.start = ImageTk.PhotoImage(file="photos/power.png")

    self.cpu = {'type': "Intel(R) Core(TM) i7-9750K", 'frequence': "2.60Ghz", 'utilisation': 87}
    self.ram = {'type': "DDR4 3200Mhz", 'taille': "16Gb", 'utilisation': 81}
    self.batterie = {'pourcentage': 89}
    self.system = {'user': "François", "version_os": "Windows 10 v21H1"}
    self.temperature = {'degre': 57}
    self.stockage = {'taille': "1Tb", 'restant': "300Gb"}
    self.network = {'download': 1000, 'upload': 1000, 'latence': 700}
    self.ecran = True
    self.running = False

    self.test_ecran()
    self.system_info()
    self.cpu_info()
    self.ram_info()
    self.batterie_info()
    self.temperature_info()
    self.boutton_start()
    self.stockage_info()
    self.network_info()
    self.tk.mainloop()

  def cpu_info(self):
    cpu_widget = Label(self.tk, image=self.widget_medium, borderwidth=0, highlightthickness=0)
    cpu_widget.place(x=30, y=30)
    cpu_infos = Label(self.tk, text="Processeur",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    cpu_infos.place(x=50, y=50)
    progress_cpu = ttk.Progressbar(self.tk, orient=HORIZONTAL, length=290, mode='determinate',
                                   value=self.cpu['utilisation'],style="green.Horizontal.TProgressbar")
    progress_cpu.place(x=110, y=150, height=40)
    cpu_percent = Label(text=str(progress_cpu['value']) + "%", font=("Berlin Sans fb demi", 18),
                        foreground="#F5F5F5", background="#31395e")
    cpu_percent.place(x=230, y=200)

  def ram_info(self):
    ram_widget = Label(self.tk, image=self.widget_medium, borderwidth=0, highlightthickness=0)
    ram_widget.place(x=865, y=30)
    ram_infos = Label(self.tk, text="Mémoire RAM",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    ram_infos.place(x=885, y=50)
    progress_ram = ttk.Progressbar(self.tk, orient=HORIZONTAL, length=290, mode='determinate',
                                   value=self.ram['utilisation'],style="green.Horizontal.TProgressbar")
    progress_ram.place(x=950, y=150, height=40)
    ram_percent = Label(text=str(progress_ram['value']) + "%", font=("Berlin Sans fb demi", 18),
                        foreground="#F5F5F5", background="#31395e")
    ram_percent.place(x=1070, y=200)

  def batterie_info(self):
    batterie_widget = Label(self.tk, image=self.widget_small, borderwidth=0, highlightthickness=0)
    batterie_widget.place(x=30, y=365)
    batterie_infos = Label(self.tk, text="Batterie",foreground="#3d78f7", font=("Berlin Sans fb demi", 20),
                      background="#31395e")
    batterie_infos.place(x=50, y=385)
    progress_batterie = ttk.Progressbar(self.tk, orient=HORIZONTAL, length=150, mode='determinate',
                                   value=self.batterie['pourcentage'],style="green.Horizontal.TProgressbar")
    progress_batterie.place(x=67, y=430, height=30)
    batterie_percent = Label(text=str(progress_batterie['value']) + "%", font=("Berlin Sans fb demi", 18),
                        foreground="#F5F5F5", background="#31395e")
    batterie_percent.place(x=117, y=465)

  def temperature_info(self):
    temperature_widget = Label(self.tk, image=self.widget_small, borderwidth=0, highlightthickness=0)
    temperature_widget.place(x=260, y=365)
    temperature_indos = Label(self.tk, text="Température",foreground="#3d78f7", font=("Berlin Sans fb demi", 20),
                      background="#31395e")
    temperature_indos.place(x=280, y=385)

    if(self.temperature['degre'] < 30):
      temperature_degre = Label(self.tk, text=str(self.temperature['degre']) + "°C", foreground="#97d2d8",
                                font=("Berlin Sans fb demi", 30), background="#31395e")
      temperature_degre.place(x=330, y=430)

    elif(self.temperature['degre'] < 50):
      temperature_degre = Label(self.tk, text=str(self.temperature['degre']) + "°C", foreground="#3d78f7",
                                font=("Berlin Sans fb demi", 30), background="#31395e")
      temperature_degre.place(x=330, y=430)

    elif(self.temperature['degre'] > 50 and self.temperature['degre'] < 70):
      temperature_degre = Label(self.tk, text=str(self.temperature['degre']) + "°C", foreground="#f2b141",
                                font=("Berlin Sans fb demi", 30), background="#31395e")
      temperature_degre.place(x=330, y=430)

    elif(self.temperature['degre'] > 70):
      temperature_degre = Label(self.tk, text=str(self.temperature['degre']) + "°C", foreground="#ef3434",
                                font=("Berlin Sans fb demi", 30), background="#31395e")
      temperature_degre.place(x=330, y=430)

  def system_info(self):
    system_widget = Label(self.tk, image=self.widget_height, borderwidth=0, highlightthickness=0)
    system_widget.place(x=515, y=30)
    system_infos = Label(self.tk, text="Système",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    system_infos.place(x=535, y=50)

    system_stats = Label(self.tk, text="-CPU : " + self.cpu['type'],
                         font=("Berlin Sans fb demi", 13),background="#31395e")
    system_stats.place(x=555, y=120)
    system_stats = Label(self.tk, text="-RAM : " + self.ram['taille'] + " "+ self.ram['type'],
                         font=("Berlin Sans fb demi", 13),background="#31395e")
    system_stats.place(x=555, y=160)
    system_stats = Label(self.tk, text="- OS: Windows v21H1",
                         font=("Berlin Sans fb demi", 13),background="#31395e")
    system_stats.place(x=555, y=200)
    system_stats = Label(self.tk, text="-User : François",
                         font=("Berlin Sans fb demi", 13),background="#31395e")
    system_stats.place(x=555, y=240)

  def connexion_ecran(self):
    ecran_widget = Label(self.tk, image=self.widget_small, borderwidth=0, highlightthickness=0)
    ecran_widget.place(x=30, y=550)
    ecran_infos = Label(self.tk, text="Ecran",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    ecran_infos.place(x=50, y=570)
    if(not self.ecran):
      ecran_status = Label(self.tk, text="Déconnecté", foreground="#f70909",font=("Berlin Sans fb demi", 20),
                           background="#31395e")
      ecran_status.place(x=75,y=615)
    elif(self.ecran):
      ecran_status = Label(self.tk, text="Connecté", foreground="#3df709",font=("Berlin Sans fb demi", 20),
                           background="#31395e")
      ecran_status.place(x=80,y=615)

  def test_ecran(self):
    self.ecran = not self.ecran
    self.connexion_ecran()
    self.tk.after(10000, self.test_ecran)

  def stockage_info(self):
    stockage_widget = Label(self.tk, image=self.widget_long, borderwidth=0, highlightthickness=0)
    stockage_widget.place(x=865, y=365)
    stockages_infos = Label(self.tk, text="Stockage",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    stockages_infos.place(x=885, y=385)
    stockages_stats = Label(self.tk, text="Nombre de disque(s) : 2",font=("Berlin Sans fb demi", 14),
                      background="#31395e")
    stockages_stats.place(x=905,y=435)
    stockages_stats = Label(self.tk, text="Utilisation : 1300 / 2000 Gb",font=("Berlin Sans fb demi", 14),
                      background="#31395e")
    stockages_stats.place(x=905,y=465)

  def network_info(self):
    network_widget = Label(self.tk, image=self.widget_long, borderwidth=0, highlightthickness=0)
    network_widget.place(x=865, y=550)
    stockages_infos = Label(self.tk, text="Test de Connexion",foreground="#3d78f7", font=("Berlin Sans fb demi", 25),
                      background="#31395e")
    stockages_infos.place(x=885, y=570)

    upload_img = Label(self.tk, image=self.upload, borderwidth=0, highlightthickness=0, background="#31395e")
    upload_img.place(x=905, y=630)
    upload_value = Label(self.tk, text=str(self.network['upload']) + "Mb/s", font=("Berlin Sans fb demi", 12),
                         background="#31395e")
    upload_value.place(x=940, y=632)

    download_img = Label(self.tk, image=self.download, borderwidth=0, highlightthickness=0, background="#31395e")
    download_img.place(x=1055, y=630)
    download_value = Label(self.tk, text=str(self.network['download']) + "Mb/s", font=("Berlin Sans fb demi", 12),
                         background="#31395e")
    download_value.place(x=1095, y=632)

    latency_img = Label(self.tk, image=self.latence, borderwidth=0, highlightthickness=0, background="#31395e")
    latency_img.place(x=1205, y=630)
    latency_value = Label(self.tk, text=str(self.network['latence']) + "ms", font=("Berlin Sans fb demi", 12),
                         background="#31395e")
    latency_value.place(x=1245, y=632)

  def boutton_start(self):
    bouton_widget = Label(self.tk, image=self.widget_small, borderwidth=0, highlightthickness=0)
    bouton_widget.place(x=260, y=550)
    if(not self.running):
      bouton_titre = Label(self.tk, text="Running",foreground="#f70909", font=("Berlin Sans fb demi", 25),
                        background="#31395e")
      bouton_titre.place(x=280, y=570)
    elif(self.running):
      bouton_titre = Label(self.tk, text="Running",foreground="#3df709", font=("Berlin Sans fb demi", 25),
                        background="#31395e")
      bouton_titre.place(x=280, y=570)
    btn_start = Button(self.tk,
                  command=self.toggle_start,
                  image=self.start,
                  borderwidth=0,
                  highlightthickness=0,
                  background="#31395e",
                  activebackground="#31395e")
    btn_start.place(x=340, y=620)

  def toggle_start(self):
    self.running = not self.running
    self.boutton_start()