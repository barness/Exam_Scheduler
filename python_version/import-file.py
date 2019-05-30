from tkinter import Tk
from tkinter import filedialog
from excel import *

root = Tk().withdraw()
files =  filedialog.askopenfilenames(initialdir = ".",title = "Select file",filetypes = (("excel files","*.xlsx"),("all files","*.*")))
files = list(files)

for f in files:
    courseName, studentList = readExcel(f)
    print(courseName, studentList)
