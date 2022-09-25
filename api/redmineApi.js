const AbstractApi = require("./abstractApi");
const Store = require('electron-store')
const store = new Store();

module.exports = class RedmineApi extends AbstractApi {
    static async postVersion(versionId, versionInfo) {
        const redmineUrl = store.get("redmineUri");
        return await this.callPostApi(redmineUrl + "/projects/" + versionId + "/versions.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineVersionRequest(versionInfo));
    }

    static #generateHeader() {
        const accessToken = store.get("redmineAccessToken");
        return {
            "X-Redmine-API-Key": accessToken
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