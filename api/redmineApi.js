const AbstractApi = require("./abstractApi");
const Store = require('electron-store')
const store = new Store();

module.exports = class RedmineApi extends AbstractApi {
    static async postVersion(projectId, versionInfo) {
        const redmineUrl = store.get("redmineUri");
        return await this.callPostApi(redmineUrl + "/projects/" + projectId + "/versions.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineVersionRequest(versionInfo));
    }

    /**
     *
     * @param projectId
     * @param versionInfo
     * @return {Promise<array>}
     */
    static async getTicketsByVersion(projectId, versionInfo) {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/projects/" + projectId + "/issues.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineGetTicketRequestQuery(versionInfo.fixed_version_id));
        if (!result.hasOwnProperty("issues")) {
            throw new Error("チケット情報の取得に失敗しました。")
        }
        return result.issues;
    }

    static async getTrackerList() {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/trackers.json", RedmineApi.#generateHeader(), {});
        if (!result.data.hasOwnProperty("trackers")) {
            throw new Error("トラッカー情報の取得に失敗しました。")
        }
        return result.data.trackers;
    }

    static #generateHeader() {
        const accessToken = store.get("redmineAccessToken");
        return {
            "X-Redmine-API-Key": accessToken
        }
    }

    static #createRedmineGetTicketRequestQuery(fixedVersionId) {
        return {
            "fixed_version_id": fixedVersionId,
            "status_id": "*",
            "limit": 100
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