from tkinter import *
from PIL import ImageTk, Image
import webbrowser
from app.app import App
from app.window import Window

if __name__ == '__main__':
    user = Image.open("photos/account.png")
    lock = Image.open("photos/lock.png")
    exit = Image.open("photos/logout.png")
    web = Image.open("photos/web.png")
    resized_user = user.resize((45, 45), Image.ANTIALIAS)
    resized_lock = lock.resize((45, 45), Image.ANTIALIAS)
    resized_exit = exit.resize((30, 30), Image.ANTIALIAS)
    resized_web = web.resize((30, 30), Image.ANTIALIAS)
    win = Window(resized_user, resized_lock, resized_exit, resized_web)