const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  // 開発ツールを有効化
  win.webContents.openDevTools();
  win.loadFile('./views/config.html')
}

app.whenReady().then(() => {
  createWindow()
})
