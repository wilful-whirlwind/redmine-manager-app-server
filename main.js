const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path");
const redmineVersionAction = require("./action/redmineVersionAction");
const saveConfigAction = require("./action/saveConfigAction");
const loadConfigAction = require("./action/loadConfigAction");
const getRedmineTrackerListAction = require("./action/getRedmineTrackerListAction");
const saveRedmineConfigAction = require("./action/saveRedmineConfigAction")

let win;
const createWindow = () => {
  const width = 700;
  const height = 600;
  win = new BrowserWindow({
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
  win.webContents.openDevTools();
  win.loadFile('./views/build/index.html')
}

app.whenReady().then(async () => {
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

ipcMain.on('sendMessage', function(event, args) {
  console.log(args);
  win.webContents.send('sendMessage', args);
});

ipcMain.on('dialog:loadConfig', async function(event, args) {
  console.log(args);
  loadConfigAction(event, args);
});

ipcMain.on('dialog:getRedmineTrackerConfigList', async function(event, args) {
  console.log(args);
  await getRedmineTrackerListAction(event, args);
});

ipcMain.on('dialog:redmineVersion', redmineVersionAction);
ipcMain.on('dialog:saveConfig', saveConfigAction);
ipcMain.on('dialog:saveRedmineConfig', saveRedmineConfigAction);
