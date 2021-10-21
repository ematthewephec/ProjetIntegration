from tkinter import *
from PIL import ImageTk, Image
import webbrowser
from app.app import App

class Window():
    def __init__(self, user, lock, exit, web):
        self.tk = Tk()
        self.tk.title("Check Computers")
        self.tk.geometry("500x600")
        self.tk.resizable(False, False)
        self.tk.configure(background='#8eb8de')

        self.new = None;

        self.img1 = ImageTk.PhotoImage(file="photos/input.png")
        self.img2 = ImageTk.PhotoImage(file="photos/input.png")
        self.confirm = ImageTk.PhotoImage(file="photos/login.png")
        self.user_img = ImageTk.PhotoImage(user)
        self.lock_img = ImageTk.PhotoImage(lock)
        self.exit_img = ImageTk.PhotoImage(exit)
        self.web_img = ImageTk.PhotoImage(web)

        self.entry1 = None;
        self.entry2 = None;

        self.create_title()
        self.create_input()
        self.create_button()

        self.tk.mainloop()

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
                      command=self.conexion,
                      image=self.confirm,
                      borderwidth=0,
                      highlightthickness=0,
                      background="#8eb8de",
                      activebackground="#8eb8de")
        btn3.pack(pady=10)

    def conexion(self):
        if (self.entry1.get() == "aaa" and self.entry2.get() == "bbb"):
            print("Connecté")
            self.tk.destroy()
            self.new = App()
        else:
            print("Erreur, mauvais identifiant ou mot de passe")

    def close_app(self):
        self.tk.destroy()

    def open_website(self):
        webbrowser.open('https://www.google.be')
