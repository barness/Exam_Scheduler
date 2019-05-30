'''
Khanh Nghiem
06/06/2018
'''
import exam_scheduling_ver1 as backend
import wx
BACKGROUNDCOLOR = (240, 240, 240, 255)
#====================================================================
class Widgets(wx.Panel):
    def __init__(self, parent):
        wx.Panel.__init__(self, parent)
        self.panel = wx.Panel(self)

        self.asset = []
        self.files = []
        self.graph = {}
        self.coloring = {}

        self.createFrames()
        self.addWidgets()
        self.addLog()
        self.layoutWidgets()

    #----------------------------------------------------------
    def createFrames(self):
        staticBox = wx.StaticBox( self.panel, -1, "Widgets Frame", size=(450, -1))
        self.statBoxSizerV = wx.StaticBoxSizer(staticBox, wx.HORIZONTAL)
        staticBox = wx.StaticBox( self.panel, -1, "Log", size=(450, -1) )
        self.statBoxSizerLog = wx.StaticBoxSizer(staticBox, wx.HORIZONTAL)
        staticBox = wx.StaticBox( self.panel, -1, "Blocks", size=(450, -1) )
        self.statBoxSizerBlocks = wx.StaticBoxSizer(staticBox, wx.HORIZONTAL)

    #----------------------------------------------------------
    def layoutWidgets(self):
        self.boxSizerV = wx.BoxSizer( wx.VERTICAL)


        self.boxSizerV.Add( self.statBoxSizerV, 1, wx.ALL )
        self.boxSizerV.Add( self.statBoxSizerLog, 1, wx.ALL )
        self.boxSizerV.Add( self.statBoxSizerBlocks, 1, wx.ALL )

        self.panel.SetSizer( self.boxSizerV )
        self.boxSizerV.SetSizeHints( self.panel )
        self.boxSizerV.Fit( self.panel )

    #----------------------------------------------------------
    def addWidgets(self):
        self.addButtons()

    #----------------------------------------------------------
    def addButtons(self):
        boxSizerH = wx.BoxSizer(wx.HORIZONTAL)
        openFilesBtn = wx.Button(self.panel, label='Get Files')
        openFilesBtn.Bind(wx.EVT_BUTTON, self.openFiles)

        #self.conflictBtn = wx.Button(self.panel, label='Check Conflicts')
        #self.conflictBtn.Bind(wx.EVT_BUTTON, self.checkConflicts)
        #if (len(self.files)==0):
            #self.conflictBtn.Disable()

        boxSizerH.Add(openFilesBtn)
        #boxSizerH.Add(self.conflictBtn)
        boxSizerH.Fit( self.panel )
        self.statBoxSizerV.Add( boxSizerH, 1, wx.ALL )

    #----------------------------------------------------------
    def addLog(self):
        boxSizerH = wx.BoxSizer(wx.HORIZONTAL)
        # Text Area for recording logs
        log = wx.TextCtrl(self, -1,
                                style=wx.TE_MULTILINE | wx.BORDER_SUNKEN | wx.TE_READONLY |
                                wx.TE_RICH2, size=(450,150))
        self.log = log
        boxSizerH.Add(log)
        self.statBoxSizerLog.Add( boxSizerH, 1, wx.ALL )

    #----------------------------------------------------------
    def openFiles(self,event):
        # otherwise ask the user what new file to open
        with wx.FileDialog(self, "Import Files", wildcard="*.xlsx", style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST | wx.FD_MULTIPLE ) as fileDialog:
            if fileDialog.ShowModal() == wx.ID_CANCEL:
                return     # the user changed their mind
            # Proceed loading the file chosen by the user
            files = fileDialog.GetPaths()
            names = ""
            for i in range(len(files)):
                path = files[i]
                name = path[path.rfind('/')+1:]+"\n"
                self.log.AppendText("LOADED: "+name)
            self.log.AppendText("IMPORTED "+str(len(files))+"FILE(S)\n")
            self.files = files
            if(len(self.files)>0):
                #self.conflictBtn.Enable()
                self.checkConflicts(event)

    #----------------------------------------------------------
    def checkConflicts(self,event):
        asset = self.statBoxSizerBlocks.GetItemCount()
        for i in range(asset):
            self.statBoxSizerBlocks.Remove(i)
            print('success')

        for i in range(len(self.asset)):
            try:
                self.asset.pop().Destroy()
                #print('success')
            except:
                print('error')

        numchildren = self.boxSizerV.GetItemCount()
        print(numchildren)
        self.boxSizerV.Remove(self.statBoxSizerBlocks)

        enrollment = backend.process(self.files)
        graph = backend.createGraph(enrollment)
        coloring,free = backend.schedule(graph)
        self.log.AppendText(str(coloring)+'\n')
        self.log.AppendText(str(free)+'\n')

        color_list = ['#9980FA', '#12CBC4', '#C4E538', '#FFC312', 'red', 'purple']
        boxSizerH = wx.BoxSizer(wx.HORIZONTAL)
        blocks = list(backend.blocks(coloring).items())
        for i in range(len(blocks)):
            statBox = wx.StaticBox( self.panel, -1, 'Block '+str(i+1) )
            statBoxSizerV = wx.StaticBoxSizer(statBox, wx.VERTICAL)

            course_list = blocks[i][1]
            for k in range(len(course_list)):
                btn = wx.Button(self.panel, label=course_list[k])
                #btn.Disable()
                btn.SetBackgroundColour(color_list[i])
                statBoxSizerV.Add(btn, 1, wx.ALL)
                self.asset.append(btn)
            boxSizerH.Add(statBoxSizerV, 1, wx.ALL)

        statBox = wx.StaticBox( self.panel, -1, 'Free' )
        statBoxSizerV = wx.StaticBoxSizer(statBox, wx.VERTICAL)

        for j in range(len(free)):
            btn = wx.Button(self.panel, label=free[j])
            #btn.Disable()
            btn.SetBackgroundColour('white')
            statBoxSizerV.Add(btn, 1, wx.ALL)
            self.asset.append(btn)
        boxSizerH.Add(statBoxSizerV, 1, wx.ALL)
        boxSizerH.Fit( self.panel )

        staticBox3 = wx.StaticBox( self.panel, -1, 'Blocks', size=(450, -1) )
        self.statBoxSizerBlocks = wx.StaticBoxSizer(staticBox3, wx.HORIZONTAL)
        self.statBoxSizerBlocks.Add(boxSizerH, 1, wx.ALL)

        self.boxSizerV.Add(self.statBoxSizerBlocks)
        self.boxSizerV.Fit( self.panel )
        self.panel.SetSizer(self.boxSizerV)
        self.boxSizerV.SetSizeHints( self.panel )

    #----------------------------------------------------------
    def getFiles(self):
        return self.files


#====================================================================
class MainFrame(wx.Frame):
    def __init__(self, *args, **kwargs):
        wx.Frame.__init__(self, *args, **kwargs)
        self.createWidgets()
        self.Show()
    #----------------------------------------------------------
    def exitGUI(self, event):       # callback
        self.Destroy()
    #----------------------------------------------------------
    def createWidgets(self):
        self.CreateStatusBar()      # wxPython built-in method
        self.createMenu()
        self.createNotebook()
    #----------------------------------------------------------
    def createMenu(self):
        menu= wx.Menu()
        menu.Append(wx.ID_NEW, "New", "Create something new")
        menu.AppendSeparator()
        _exit = menu.Append(wx.ID_EXIT, "Exit", "Exit the GUI")
        self.Bind(wx.EVT_MENU, self.exitGUI, _exit)
        menuBar = wx.MenuBar()
        menuBar.Append(menu, "File")
        menu1= wx.Menu()
        menu1.Append(wx.ID_ABOUT, "About", "wxPython GUI")
        menuBar.Append(menu1, "Help")
        self.SetMenuBar(menuBar)
    #----------------------------------------------------------
    def createNotebook(self):
        panel = wx.Panel(self)
        notebook = wx.Notebook(panel)
        widgets = Widgets(notebook)
        notebook.AddPage(widgets, "Scheduler")
        notebook.SetBackgroundColour(BACKGROUNDCOLOR)
        # layout
        boxSizer = wx.BoxSizer()
        boxSizer.Add(notebook, 1, wx.EXPAND)
        panel.SetSizerAndFit(boxSizer)

    #----------------------------------------------------------
    def getWidget(self):
        return self.widgets

#======================
# Start GUI
#======================
app = wx.App()
frame = MainFrame(None, title="Final Exam Scheduling", size=(500,650))
app.MainLoop()
