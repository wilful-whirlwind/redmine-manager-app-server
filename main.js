const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require("path");
const saveRedmineVersionAction = require("./action/saveRedmineVersionAction");
const saveConfigAction = require("./action/saveConfigAction");
const loadConfigAction = require("./action/loadConfigAction");
const getRedmineTrackerListAction = require("./action/getRedmineTrackerListAction");
const getRedmineVersionListAction = require("./action/getRedmineVersionListAction");
const getRedmineVersionInfoAction = require("./action/getRedmineVersionInfoAction");
const getEventListAction = require("./action/getEventListAction");
const saveRedmineConfigAction = require("./action/saveRedmineConfigAction")

let win;
const createWindow = () => {
  const width = 1050;
  const height = 900;
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

  // リンクをクリックするとWebブラウザで開く
  const handleUrlOpen = (e, url)=>{
    if( url.match(/^http/)){
      e.preventDefault()
      shell.openExternal(url)
    }
  }
  win.webContents.on('will-navigate', handleUrlOpen);
  win.webContents.setWindowOpenHandler(handleUrlOpen);

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

ipcMain.on('dialog:getRedmineVersionList', async function(event, args) {
  console.log(args);
  await getRedmineVersionListAction(event, args);
});

ipcMain.on('dialog:getEventList', async function(event, args) {
  console.log(args);
  await getEventListAction(event, args);
});

ipcMain.on('dialog:createRedmineInfo', async function(event, args) {
  console.log(args);
  await getRedmineVersionInfoAction(event, args);
});

ipcMain.on('dialog:redmineVersion', saveRedmineVersionAction);
ipcMain.on('dialog:saveConfig', saveConfigAction);
ipcMain.on('dialog:saveRedmineConfig', saveRedmineConfigAction);
