const RedmineApi = require("../api/redmineApi");
const VersionInfo = require("../entity/versionInfo");

module.exports = class RedmineVersionLogic {
    async initializeVersionLogic(major, minor, maintenance, dueDate) {
        let versionInfo = new VersionInfo(major, minor, maintenance, dueDate);
        try {
            return await RedmineApi.postVersion(1, versionInfo);
        } catch (e) {
            console.log(e)
            throw new Error("バージョンの登録に失敗しました。");
        }
    }
}