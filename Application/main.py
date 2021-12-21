from Application.gui_app.window import Window
import pystray
from pystray import MenuItem as item
from PIL import Image, ImageTk

if __name__ == '__main__':
    user = Image.open("photos/account.png").resize((45, 45), Image.ANTIALIAS)
    lock = Image.open("photos/lock.png").resize((45, 45), Image.ANTIALIAS)
    exit = Image.open("photos/logout.png").resize((30, 30), Image.ANTIALIAS)
    web = Image.open("photos/web.png").resize((30, 30), Image.ANTIALIAS)
    icon = Image.open("photos/icon.png")

    win = Window(user, lock, exit, web, icon)
