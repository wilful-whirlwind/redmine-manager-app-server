const RedmineApi = require("../api/redmineApi");
const VersionInfo = require("../entity/versionInfo");

module.exports = class RedmineVersionLogic {
    initializeVersionLogic(major, minor, maintenance, dueDate) {
        let versionInfo = new VersionInfo(major, minor, maintenance, dueDate);
        try {
            RedmineApi.postVersion(1, versionInfo);
        } catch (e) {
            console.log(e)
        }
        return true;
    }
}