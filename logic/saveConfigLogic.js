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

    async getBasicConfig() {
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
            configInfo[property] = await store.get(property) ?? "";
        }
        return configInfo;
    }

    async getRedmineTrackerConfig() {
        return await store.get("tracker_id") ?? {};
    }

    async getRedmineTrackerManHoursDivisionConfig() {
        return await store.get("man-hours_division") ?? [];
    }
}