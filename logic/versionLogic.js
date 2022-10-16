const Store = require('electron-store')

module.exports = class VersionLogic {

    createVersionInfoBySavedFormat(redmineVersion, redmineTicketList, redmineTicketRelationList, trackerIdList, trackerManHoursDivisionList, userList) {
        let resultFormattedVersionInfo = "";
        const ticketListEachTracker = this.createTicketListEachTracker(redmineTicketList, trackerIdList);
        const manHourList = this.createMonHoursList(redmineTicketList, redmineTicketRelationList, userList, trackerManHoursDivisionList);
        resultFormattedVersionInfo += this.createFormattedTicketList(ticketListEachTracker, trackerManHoursDivisionList);
        resultFormattedVersionInfo += "\n" + this.createFormattedManHourList(manHourList);
        return resultFormattedVersionInfo;
    }

    createMonHoursList(redmineTicketList, redmineTicketRelationList, userList, trackerManHoursDivisionList) {
        let result = [];
        let convertedUserList = [];
        let currentRedmineCategoryId = 0;
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
        let ignoreIdList = [];
        let noParentTicketCount = 0;
        for (let i = 0; i < redmineTicketList.length; i++) {
            // 親チケットになっているチケットは無視
            if (typeof redmineTicketList[i]?.parent === "undefined") {
                // 親がないのはプロジェクトチケット
                ignoreIdList.push(redmineTicketList[i].id);
                noParentTicketCount++;
                continue;
            }
            ignoreIdList.push(redmineTicketList[i].parent.id);
        }
        if (noParentTicketCount < 1) {
            throw new Error("プロジェクトチケットがありません。");
        }
        if (noParentTicketCount > 1) {
            throw new Error("親指定の漏れているチケットがあります。");
        }
        let set = new Set(ignoreIdList);
        const uniqueIgnoreIdList = Array.from(set);

        for (let i = 0; i < redmineTicketList.length; i++) {
            if (
                trackerManHoursDivisionList[redmineTicketList[i].tracker.id] === "1" ||
                uniqueIgnoreIdList.includes(redmineTicketList[i].id)
            ) {
                continue;
            }
            currentRedmineCategoryId = 0;
            if (typeof redmineTicketList[i]?.category !== "undefined") {
                currentRedmineCategoryId = redmineTicketList[i].category.id;
            }
            if (typeof result[currentRedmineCategoryId] === "undefined") {
                result[currentRedmineCategoryId] = {};
                result[currentRedmineCategoryId].issues = [];
                result[currentRedmineCategoryId].manHoursList = [];
                result[currentRedmineCategoryId].categoryName = redmineTicketList[i].category.name;
                result[currentRedmineCategoryId].totalManHour = 0.0;
                result[currentRedmineCategoryId].totalManHourList = [];
            }
            if (typeof result[currentRedmineCategoryId].manHoursList[redmineTicketList[i].tracker.id] === "undefined") {
                result[currentRedmineCategoryId].manHoursList[redmineTicketList[i].tracker.id] = {
                    trackerName: redmineTicketList[i].tracker.name,
                    manHoursList: [],
                    totalManHour: 0.0
                };
            }
            if (typeof redmineTicketList[i]?.assigned_to === "undefined") {
                throw new Error("担当未割り当てのチケットがあります。");
            }
            if (typeof result[currentRedmineCategoryId].manHoursList[redmineTicketList[i].tracker.id].manHoursList[redmineTicketList[i].assigned_to.id] === "undefined") {
                result[currentRedmineCategoryId].manHoursList[redmineTicketList[i].tracker.id].manHoursList[redmineTicketList[i].assigned_to.id] = {
                    user: convertedUserList[redmineTicketList[i].assigned_to.id],
                    totalManHour: 0.0
                };
            }
            if (
                (
                    typeof redmineTicketList[i]?.estimated_hours === "undefined" ||
                    redmineTicketList[i]?.estimated_hours === null
                ) &&
                !uniqueIgnoreIdList.includes(redmineTicketList[i].id)
            ) {
                throw new Error("工数が未入力のチケットがあります。");
            }
            result[currentRedmineCategoryId].totalManHour += redmineTicketList[i].estimated_hours;
            if (typeof result[currentRedmineCategoryId].totalManHourList[redmineTicketList[i].assigned_to.id] === "undefined") {
                result[currentRedmineCategoryId].totalManHourList[redmineTicketList[i].assigned_to.id] = {
                    name: redmineTicketList[i].assigned_to.name,
                    manHour: 0.0
                };
            }
            result[currentRedmineCategoryId].totalManHourList[redmineTicketList[i].assigned_to.id].manHour += redmineTicketList[i].estimated_hours;
            result[currentRedmineCategoryId].manHoursList[redmineTicketList[i].tracker.id].totalManHour += redmineTicketList[i].estimated_hours;
            result[currentRedmineCategoryId].manHoursList[redmineTicketList[i].tracker.id].manHoursList[redmineTicketList[i].assigned_to.id].totalManHour += redmineTicketList[i].estimated_hours;
            result[currentRedmineCategoryId].issues.push(redmineTicketList[i]);
        }
        return result;
    }

    createFormattedManHourList(totalManHourList) {
        let eachResult = [];
        let tmpArrayForTotal = [];
        let tmpArrayForTotalEachUsers = [];
        let tmpArrayForEachTracker = [];
        let tmpArrayForEachUsersOfTracker = [];
        const unit = "h";
        const separator = "、";
        // 一行目: 合計
        for (let i = 0; i < totalManHourList.length; i++) {
            if (typeof totalManHourList[i] === "undefined") {
                continue;
            }
            tmpArrayForTotal.push(totalManHourList[i].categoryName + totalManHourList[i].totalManHour + unit);
            for (let j = 0; j < totalManHourList[i].totalManHourList.length; j++) {
                if (typeof totalManHourList[i].totalManHourList[j] === "undefined") {
                    continue;
                }
                tmpArrayForTotalEachUsers.push(totalManHourList[i].totalManHourList[j].name + totalManHourList[i].totalManHourList[j].manHour + unit);
            }
        }
        eachResult[0] = "* " + tmpArrayForTotal.join(separator);
        eachResult[0] += "(" + tmpArrayForTotalEachUsers.join(separator) + ")";
        let firstLoopFlag = true;
        let tmpArray = [];
        // 二行目以降
        for (let i = 0; i < totalManHourList.length; i++) {
            if (typeof totalManHourList[i] === "undefined") {
                continue;
            }
            for (let j = 0; j < totalManHourList[i].manHoursList.length; j++) {
                if (typeof totalManHourList[i].manHoursList[j] === "undefined") {
                    continue;
                }
                if (firstLoopFlag) {
                    eachResult[j + 1] = "    * " + totalManHourList[i].manHoursList[j].trackerName + "：" ;
                }
                tmpArrayForEachTracker.push(totalManHourList[i].categoryName + ":" + totalManHourList[i].manHoursList[j].totalManHour + unit);
                for (let k = 0; k < totalManHourList[i].manHoursList[j].manHoursList.length; k++) {
                    if (typeof totalManHourList[i].manHoursList[j].manHoursList[k] === "undefined") {
                        continue;
                    }
                    tmpArrayForEachUsersOfTracker.push(totalManHourList[i].manHoursList[j].manHoursList[k].user.name + totalManHourList[i].manHoursList[j].manHoursList[k].totalManHour + unit);
                }
                tmpArray.push(tmpArrayForEachTracker.join(separator)  + "(" + tmpArrayForEachUsersOfTracker.join(separator) + ")");
                tmpArrayForEachTracker = [];
                tmpArrayForEachUsersOfTracker = [];
            }
            firstLoopFlag = false;
        }

        let skipCount = 1;
        for(let i = 0; i < tmpArray.length; i++) {
            if (typeof eachResult[i + skipCount] === "undefined") {
                skipCount++;
                i--;
                continue;
            }
            eachResult[i + skipCount] += tmpArray[i];
        }

        let result = "## 工数\n\n";
        result += eachResult.join("\n");
        return result.replace(/(\n)+/g,'\n');
    }

    createTicketListEachTracker(redmineTicketList, trackerIdList) {
        if (!Array.isArray(redmineTicketList)) {
            throw new Error("チケット情報に異常が発生しました。");
        }

        const resultList = [];
        for (let i = 0; i < redmineTicketList.length; i++) {
            if (typeof redmineTicketList[i]?.category === "undefined") {
               //TODO:ポリシ設定によって、エラーにする
               //throw new Error("カテゴリが未設定のチケットがあります。");
                redmineTicketList[i].category = {
                    id: 0,
                    name: "共通"
                };
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