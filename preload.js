const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    initializeVersion: function(data) {
        const res = ipcRenderer.sendSync('dialog:redmineVersion', data);
        ipcRenderer.send('sendMessage', res);
    },
    sendMessage: (callback) => ipcRenderer.on('sendMessage', callback)
})