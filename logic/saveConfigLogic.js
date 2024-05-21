const store = require('../util/storeUtil')

module.exports = class SaveConfigLogic {
    async saveConfig(configInfo) {
        console.log(configInfo);
        for (const property in configInfo) {
            store.set(property, configInfo[property]);
        }
        return true;
    }

    async saveRedmineConfig(configInfo) {
        console.log(configInfo);
        for (const property in configInfo) {
            store.set(property, configInfo[property]);
        }
        return true;
    }

    getBasicConfig() {
        let configInfo = {
            basicAuthUserId: "",
            basicAuthPassWord: "",
            redmineUri: "",
            redmineAccessToken: "",
            gasGetListAPIEndPoint: "",
            gasPostScheduleAPIEndPoint: "",
            gasPostScheduleAPICalenderId: "",
            gasPostGoogleDriveAPITargetFolderId : "",
            gasPostTestTemplateSheetAPITemplateSpreadSheetId: "",
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

    getRedmineTrackerConfig() {
        return store.get("tracker_id") ?? {};
    }

    getRedmineTrackerManHoursDivisionConfig() {
        return store.get("man-hours_division") ?? [];
    }
}