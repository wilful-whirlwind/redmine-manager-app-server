const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    initializeVersion: function(data) {
        return ipcRenderer.sendSync('dialog:redmineVersion', data);
        // ipcRenderer.send('sendMessage', res);
    },
    saveConfig: function(data) {
        const res = ipcRenderer.sendSync('dialog:saveConfig', data);
        ipcRenderer.send('sendMessage', res);
    },
    saveRedmineConfig: function(data) {
        const res = ipcRenderer.sendSync('dialog:saveRedmineConfig', data);
        ipcRenderer.send('sendMessage', res);
    },
    loadConfig: function(data) {
        return ipcRenderer.sendSync('dialog:loadConfig', data);
    },
    getRedmineTrackerList:function(data) {
        return ipcRenderer.sendSync('dialog:getRedmineTrackerConfigList', data);
    },
    getRedmineVersionList:function(data) {
        return ipcRenderer.sendSync('dialog:getRedmineVersionList', data);
    },
    getEventList:function(data) {
        return ipcRenderer.sendSync('dialog:getEventList', data);
    },
    createVersionInfo:function(data) {
        return ipcRenderer.sendSync('dialog:createRedmineInfo', data);
    },
    sendMessage: (callback) => ipcRenderer.on('sendMessage', callback),
    getCurrentEventListFromCalender:function(data) {
        return ipcRenderer.sendSync('dialog:getCurrentEventListFromCalender', data);
    }
})