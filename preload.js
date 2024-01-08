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
    },
    getTemplateTicketList:function (data) {
        return ipcRenderer.sendSync('dialog:getTemplateTicketList', data);
    },
    getCustomFieldList: function (data) {
        return ipcRenderer.sendSync('dialog:getCustomFieldList', data);
    },
    getTaskListByVersionNumber: function(data) {
        return ipcRenderer.sendSync('dialog:getTaskListByVersionNumber', data);
    },
    getTrackerList: function(data) {
        return ipcRenderer.sendSync('dialog:getTrackerList', data);
    },
    saveTask: function(data) {
        return ipcRenderer.sendSync('dialog:saveTask', data);
    }
})