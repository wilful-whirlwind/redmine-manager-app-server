const RedmineApi = require("../api/redmineApi");
const VersionInfo = require("../entity/versionInfo");
const Store = require('electron-store')
const store = new Store();

module.exports = class RedmineLogic {
    async initializeVersionLogic(major, minor, maintenance, dueDate) {
        let versionInfo = new VersionInfo(major, minor, maintenance, dueDate);
        try {
            return await RedmineApi.postVersion(1, versionInfo);
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
            const redmineUri = store.get("redmineUri");
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
}