const Store = require('electron-store')
const store = new Store();

module.exports = class SaveConfigLogic {
    async saveConfig(configInfo) {
        console.log(configInfo);
        for (const property in configInfo) {
            store.set(property, configInfo[property]);
        }
        return true;
    }

    loadConfig() {
        let configInfo = {
            basicAuthUserId: "",
            basicAuthPassWord: "",
            redmineUri: "",
            redmineAccessToken: "",
            gasPostScheduleAPIEndPoint: "",
            gasPostScheduleAPIAccessToken: "",
            gasPostScheduleAPIProjectFolderId: "",
            gasPostScheduleAPITemplateProjectFolderId: "",
            gasPostResultAPIEndPoint: "",
            gasPostResultAPIAccessToken: "",
            slackMailAddressForRequestToMember: "",
            slackMailAddressForNoticeToCS: "",
            platformAPIAccessToken: ""
        };

        for (const property in configInfo) {
            configInfo[property] = store.get(property) ?? "";
        }
        return configInfo;
    }
}