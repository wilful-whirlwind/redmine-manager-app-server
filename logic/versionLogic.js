const Store = require('electron-store')

module.exports = class VersionLogic {

    createVersionInfoBySavedFormat(redmineVersion, redmineTicketList, redmineTicketRelationList, trackerIdList, trackerManHoursDivisionList, userList) {
        let resultFormattedVersionInfo = "";
        const ticketListEachTracker = this.createTicketListEachTracker(redmineTicketList, trackerIdList);
        resultFormattedVersionInfo += this.createFormattedTicketList(ticketListEachTracker, trackerManHoursDivisionList);
        this.createMonHoursList(redmineTicketList, redmineTicketRelationList, userList);
        return resultFormattedVersionInfo;
    }

    createMonHoursList(redmineTicketList, redmineTicketRelationList, userList) {
        let result = [];
        let convertedUserList = [];
        let currentRedmineUserId = 0;
        for (let i = 0; i < userList.length; i++) {
            if (typeof userList[i]?.redmine_user_id === "undefined") {
                throw new Error("ユーザのredmine情報が不正です。");
            }
            convertedUserList[userList[i].redmine_user_id] = userList[i];
        }
        convertedUserList[0] = {
            "id": 0,
            "name": "undefined",
            "redmine_user_id": null,
            "timecard_user_id": null,
            "mail_address": null,
        };

        for (let i = 0; i < redmineTicketList.length; i++) {
            currentRedmineUserId = 0;
            if (typeof redmineTicketList[i]?.assigned_to !== "undefined") {
                currentRedmineUserId = redmineTicketList[i].assigned_to.id;
            }
            if (typeof result[currentRedmineUserId] === "undefined") {
                result[currentRedmineUserId] = {};
                result[currentRedmineUserId].issues = [];
                result[currentRedmineUserId].manHours = 0.0;
                result[currentRedmineUserId].user = convertedUserList[currentRedmineUserId];
            }
            if (
                typeof redmineTicketList[i]?.estimated_hours === "undefined" ||
                redmineTicketList[i]?.estimated_hours === null
            ) {
                throw new Error("工数が未入力のチケットがあります。");
            }
            result[currentRedmineUserId].manHours += redmineTicketList[i].estimated_hours;
            result[currentRedmineUserId].issues.push(redmineTicketList[i]);
        }
        return result;
    }

    createTicketListEachTracker(redmineTicketList, trackerIdList) {
        if (!Array.isArray(redmineTicketList)) {
            throw new Error("チケット情報に異常が発生しました。");
        }

        const resultList = [];
        for (let i = 0; i < redmineTicketList.length; i++) {
            if (typeof redmineTicketList[i]?.category === "undefined") {
                throw new Error("カテゴリが未設定のチケットがあります。");
            }
            if (typeof resultList[redmineTicketList[i].category.id] === "undefined") {
                resultList[redmineTicketList[i].category.id] = {};
                resultList[redmineTicketList[i].category.id].categoryName = redmineTicketList[i].category.name;
                resultList[redmineTicketList[i].category.id].trackerList = [];
            }
            for (let j = 0; j < trackerIdList.length; j++) {
                if (redmineTicketList[i].tracker.id === j) {
                    if (typeof resultList[redmineTicketList[i].category.id].trackerList[j] === "undefined") {
                        resultList[redmineTicketList[i].category.id].trackerList[j] = {};
                        resultList[redmineTicketList[i].category.id].trackerList[j].trackerName = redmineTicketList[i].tracker.name;
                        resultList[redmineTicketList[i].category.id].trackerList[j].ticketList = [];
                    }
                    resultList[redmineTicketList[i].category.id].trackerList[j].ticketList.push(redmineTicketList[i]);
                }
            }
        }
        return resultList;
    }

    createFormattedTicketList(redmineTicketList, trackerManHoursDivisionList) {
        let resultString = "## 内容\n\n";

        for (let i = 0; i < redmineTicketList.length; i++) {
            if (typeof redmineTicketList[i] === "undefined") {
                continue;
            }
            resultString += "### " + redmineTicketList[i].categoryName + "\n\n";
            for (let j = 1; j < redmineTicketList[i].trackerList.length; j++) {
                if (typeof redmineTicketList[i].trackerList[j] === "undefined") {
                    continue;
                }
                if (trackerManHoursDivisionList[j] === '1') {
                    continue;
                }
                resultString += "- " + redmineTicketList[i].trackerList[j].trackerName + "\n";
                for (let k = 0; k < redmineTicketList[i].trackerList[j].ticketList.length; k++) {
                    resultString += "     - ##" + redmineTicketList[i].trackerList[j].ticketList[k].id + "\n";
                }
            }
        }

        return resultString;
    }


}