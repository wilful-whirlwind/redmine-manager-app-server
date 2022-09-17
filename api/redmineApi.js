const AbstractApi = require("./abstractApi");

module.exports = class RedmineApi extends AbstractApi {
    static async postVersion(versionId, versionInfo) {
        const redmineUrl = "http://49.212.209.129/";
        return await this.callPostApi(redmineUrl + "projects/" + versionId + "/versions.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineVersionRequest(versionInfo));
    }

    static #generateHeader() {
        return {
            "X-Redmine-API-Key": "5232591c06b5aab0123d65c986873cd620059df1"
        }
    }

    static #createRedmineVersionRequest(versionInfo) {
        return {
            "version": {
                "name": versionInfo.getVersionName("ver.", ".", "_POSサーバー"),
                "description": "",
                "status": "open",
                "due_date": versionInfo.dueDate,
                "sharing": "none",
                "wiki_page_title": ""
            }
        }
    }

}