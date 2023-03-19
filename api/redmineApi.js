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
     * @param offset
     * @return {Promise<array>}
     */
    static async getTicketsByVersion(projectId, versionId, offset= 0) {
        const redmineUrl = store.get("redmineUri");
        let response = await this.callGetApi(redmineUrl + "/projects/" + projectId + "/issues.json", RedmineApi.#generateHeader(), RedmineApi.#createRedmineGetTicketRequestQuery(versionId, offset));
        let tmpResult = {};
        if (!response.hasOwnProperty("issues")) {
            throw new Error("チケット情報の取得に失敗しました。")
        }
        let result = response.issues;
        if (response.total_count > (offset + 1) * 100) {
            offset++;
            tmpResult = await this.getTicketsByVersion(projectId, versionId, offset);
            result = result.concat(tmpResult);
        }
        return result;
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

    static async postTicket(ticket, fixedVersionId, projectId, versionInfo) {
        const redmineUrl = store.get("redmineUri");
        const result = await this.callPostApi(redmineUrl + "/issues.json", RedmineApi.#generateHeader(), RedmineApi.#generateIssuesRequest(ticket, fixedVersionId, projectId, versionInfo));
        if (!result.hasOwnProperty("data")) {
            throw new Error("チケットの登録に失敗しました。")
        }
        if (!result.data.hasOwnProperty("issue")) {
            throw new Error("チケットの登録に失敗しました。")
        }
        return result.data.issue;
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

    static #createRedmineGetTicketRequestQuery(fixedVersionId, offset) {
        return {
            "fixed_version_id": fixedVersionId,
            "status_id": "*",
            "limit": 100,
            "offset": offset * 100
        }
    }

    static #createRedmineVersionRequest(versionInfo) {
        return {
            "version": {
                "name": versionInfo.getVersionName(),
                "description": "",
                "status": "open",
                "due_date": versionInfo.dueDate,
                "sharing": "none",
                "wiki_page_title": ""
            }
        }
    }

    static #generateIssuesRequest(ticket, fixedVersionId, projectId, versionInfo) {
        return {
            issue: {
                project_id: projectId,
                subject: ticket.label + versionInfo.getVersionName(" ver.", ".", ""),
                tracker_id: ticket.trackerId,
                status_id: 1, // 新規
                priority_id: 2, // 通常
                start_date: ticket.startDate,
                due_date: ticket.endDate,
                description: ticket.description,
                category_id: ticket.categoryId,
                fixed_version_id: fixedVersionId,
                parent_issue_id: ticket.redmineParentIssueId,
                is_private: false
            }
        }
    }
}