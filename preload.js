const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    openFile: function(data) {ipcRenderer.send('dialog:openFile', data); }
})