const RedmineApi = require("../api/redmineApi");
const VersionInfo = require("../entity/versionInfo");

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

    async generateProjectTicket(major, minor, maintenance) {
        let versionInfo = new VersionInfo(major, minor, maintenance, null);
        try {
            const ticketList = await RedmineApi.getTicketsByVersion(1, versionInfo);
            if (ticketList.length < 1) {
                return;
            }
            for (let i = 0; i < ticketList.length; i++) {
                if (!ticketList[i].hasOwnProperty("tracker")) {
                    console.error("異常なチケットを検知しました。");
                    continue;
                }
                switch (ticketList[i].tracker.id) {
                    case Issue.TRACKER_ID_FEATURE:
                        break;
                    default:
                }
            }
        } catch (e) {
            console.log(e)
            throw new Error("対象バージョンのチケット取得に失敗しました。");
        }
    }
}