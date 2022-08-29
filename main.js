const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path");
const handleFileOpen = require("./actions/fileDialogAction");

const createWindow = () => {
  const width = 700;
  const height = 600;
  const win = new BrowserWindow({
    width: width,
    height: height,
    minHeight: height,
    minWidth: width,
    maxHeight: height,
    maxWidth: width,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    fullscreen: false,
    frame: true
  })
  // 開発ツールを有効化
  // win.webContents.openDevTools();
  win.loadFile('./views/build/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})