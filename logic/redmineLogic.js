const RedmineApi = require("../api/redmineApi");
const VersionInfo = require("../entity/versionInfo");
const store = require('../util/storeUtil')

module.exports = class RedmineLogic {

    async getVersionByName(versionInfo) {
        const versionList = await RedmineApi.getVersionList(1);
        const targetVersionName = versionInfo.getVersionName();
        for (let i = 0; i < versionList.length; i++) {
            if (versionList[i].name === targetVersionName) {
                return versionList[i];
            }
        }
    }

    async createRedmineVersionLogic(major, minor, maintenance, dueDate) {
        let versionInfo = new VersionInfo(major, minor, maintenance, dueDate);
        const targetVersionName = versionInfo.getVersionName();
        try {
            const versionList = await RedmineApi.getVersionList(1);
            for (let i = 0; i < versionList.length; i++) {
                 if (versionList[i].name === targetVersionName) {
                     console.log("同名バージョンがあるため、skip");
                     return versionList[i];
                 }
            }
            const res = await RedmineApi.postVersion(1, versionInfo);
            if (typeof res?.data !== "object") {
                return false;
            }
            if (typeof res.data?.version !== "object") {
                return false;
            }
            return res.data.version;
        } catch (e) {
            console.log(e)
            throw new Error("バージョンの登録に失敗しました。");
        }
    }

    async getTrackerList() {
        try {
            return await RedmineApi.getTrackerList();
        } catch (e) {
            console.log(e)
            throw new Error("トラッカーの取得に失敗しました。");
        }
    }

    async getVersionList() {
        try {
            const versionList = await RedmineApi.getVersionList(1);
            const redmineUri = await store.get("redmineUri");
            for (let i = 0; i < versionList.length; i++) {
                versionList[i].url = redmineUri + "/versions/" + versionList[i].id;
            }
            return versionList;
        } catch (e) {
            console.log(e)
            throw new Error("バージョンの取得に失敗しました。");
        }
    }

    async getVersion(id) {
        try {
            return await RedmineApi.getVersion(id);
        } catch (e) {
            console.log(e)
            throw new Error("バージョンの取得に失敗しました。");
        }
    }

    async getTicketByVersion(id, rule) {
        try {
            const res = await RedmineApi.getTicketsByVersion(1, id);
            let result = [];
            switch (rule) {
                case 1: // feedbackbugを除く
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].subject.indexOf("feedbackbug") > -1) {
                            continue;
                        }
                        result.push(res[i]);
                    }
                    break;
                default:
                    result = res;
            }
            return result;
        } catch (e) {
            console.log(e)
            throw new Error("バージョンの取得に失敗しました。");
        }
    }

    async getTicketRelationByVersion(redmineTicketList) {
        try {
            let result = [];
            for (let i = 0; i < redmineTicketList.length; i++) {
                result.push(await RedmineApi.getTicketRelations(redmineTicketList[i].id));
            }
            return result;
        } catch (e) {
            console.log(e)
            throw new Error("バージョンの取得に失敗しました。");
        }
    }

    async createTicketList(ticketList, fixedVersionId, projectId, versionInfo) {
        let response = 0;
        let currentPostTargetList = [];
        let targetTicket = null;
        try {
            let postedTicketList = [];
            // post root issues
            for (let i = 0; i < ticketList.length; i++) {
                ticketList[i].redmineParentIssueId = "";
                ticketList[i].redmineIssueId = "";
                if (!ticketList[i].parent) {
                    if (!ticketList[i].useFlag) {
                        console.log("rootチケットを作成しないので終了。");
                        return [];
                    }
                    ticketList[i].label = ticketList[i].label + versionInfo.getVersionName(" ver.", ".", "");
                    response = await RedmineApi.postTicket(ticketList[i], fixedVersionId, projectId, versionInfo);
                    ticketList[i].redmineIssueId = response.id;
                    ticketList[i].childrenIsPosted = false;
                    postedTicketList.push(ticketList[i]);
                }
            }

            // post not root issues
            while (true) {
                targetTicket = null;
                for (let i = 0; i < postedTicketList.length; i++) {
                    if (!postedTicketList[i].childrenIsPosted) {
                        targetTicket = postedTicketList[i];
                        postedTicketList[i].childrenIsPosted = true;
                        break;
                    }
                }
                if (!targetTicket) {
                    // 全て変換が終わればループ終了。
                    break;
                }
                currentPostTargetList = [];
                for (let i = 0; i < ticketList.length; i++) {
                    if (ticketList[i].parent !== targetTicket.id) {
                        continue;
                    }
                    ticketList[i].redmineParentIssueId = targetTicket.redmineIssueId;
                    currentPostTargetList.push(ticketList[i]);
                }
                for (let i = 0; i < currentPostTargetList.length; i++) {
                    if (currentPostTargetList[i].useFlag) {
                        currentPostTargetList[i].label = currentPostTargetList[i].label + versionInfo.getVersionName(" ver.", ".", "");
                        response = await RedmineApi.postTicket(currentPostTargetList[i], fixedVersionId, projectId, versionInfo);
                    }
                    currentPostTargetList[i].redmineIssueId = response.id;
                    currentPostTargetList[i].childrenIsPosted = false;
                    postedTicketList.push(currentPostTargetList[i]);
                }
            }

            return postedTicketList;
        } catch (e) {
            console.log(e)
            throw new Error("チケットの登録に失敗しました。");
        }
    }

    async createTaskTicket(data, googleDrivePath, testDocumentPath, projectId) {
        let ticket = {
            label: data.task_name,
            trackerId: data.trackerId,
            startDate: null,
            endDate: null,
            content: "",
            categoryId: null,
            redmineParentIssueId: null, //TODO:親チケット特定
            customField_3: googleDrivePath, // TODO:カスタムフィールド設定
            customField_4: testDocumentPath, // TODO:カスタムフィールド設定
        };
        return await RedmineApi.postTicket(ticket, data.version_id, projectId);
    }
}