const AbstractApi = require("./abstractApi");
const Store = require('electron-store')
const store = new Store();

module.exports = class RedmineApi extends AbstractApi {
    static async postVersion(projectId, versionInfo) {
        const redmineUrl = store.get("redmineUri");
        return await this.callPostApi(redmineUrl + "/projects/" + projectId + "/versions.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineVersionRequest(versionInfo));
    }

    static async getVersionList(projectId) {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/projects/" + projectId + "/versions.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineGetVersionRequestQuery());
        if (!result.hasOwnProperty("versions")) {
            throw new Error("チケット情報の取得に失敗しました。")
        }
        return result.versions;
    }

    static async getVersion(versionId) {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/versions/" + versionId + ".json", RedmineApi.#generateHeader(), {});
        if (!result.hasOwnProperty("version")) {
            throw new Error("チケット情報の取得に失敗しました。")
        }
        return result.version;
    }

    /**
     *
     * @param projectId
     * @param versionId
     * @return {Promise<array>}
     */
    static async getTicketsByVersion(projectId, versionId) {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/projects/" + projectId + "/issues.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineGetTicketRequestQuery(versionId));
        if (!result.hasOwnProperty("issues")) {
            throw new Error("チケット情報の取得に失敗しました。")
        }
        return result.issues;
    }

    /**
     * @param issueId
     * @return {Promise<array>}
     */
    static async getTicketRelations(issueId) {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/issues/" + issueId + "/relations.json", RedmineApi.#generateHeader(), {});
        if (!result.hasOwnProperty("relations")) {
            throw new Error("チケットリレーション情報の取得に失敗しました。")
        }
        return result.relations;
    }

    static async getTrackerList() {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callGetApi(redmineUrl + "/trackers.json", RedmineApi.#generateHeader(), {});
        if (!result.hasOwnProperty("trackers")) {
            throw new Error("トラッカー情報の取得に失敗しました。")
        }
        return result.trackers;
    }

    static #generateHeader() {
        const accessToken = store.get("redmineAccessToken");
        return {
            "X-Redmine-API-Key": accessToken
        }
    }

    static #createRedmineGetVersionRequestQuery() {
        return {
            "limit": 100
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