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
        let currentRedmineTrackerId = 0;
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
            currentRedmineTrackerId = 0;
            if (typeof redmineTicketList[i]?.category !== "undefined") {
                currentRedmineTrackerId = redmineTicketList[i].tracker.id;
            }
            if (typeof result[currentRedmineTrackerId] === "undefined") {
                result[currentRedmineTrackerId] = {};
                result[currentRedmineTrackerId].issues = [];
                result[currentRedmineTrackerId].manHoursList = [];
                result[currentRedmineTrackerId].trackerName = redmineTicketList[i].tracker.name;
                result[currentRedmineTrackerId].totalManHour = 0.0;
                result[currentRedmineTrackerId].totalManHourList = [];
            }
            if (typeof result[currentRedmineTrackerId].manHoursList[redmineTicketList[i].category.id] === "undefined") {
                result[currentRedmineTrackerId].manHoursList[redmineTicketList[i].category.id] = {
                    categoryName: redmineTicketList[i].category.name,
                    manHoursList: [],
                    totalManHour: 0.0
                };
            }
            if (typeof redmineTicketList[i]?.assigned_to === "undefined") {
                // throw new Error("担当未割り当てのチケットがあります。");
                redmineTicketList[i].assigned_to = {
                    id: 0,
                    name: "共通"
                };
            }
            if (typeof result[currentRedmineTrackerId].manHoursList[redmineTicketList[i].category.id].manHoursList[redmineTicketList[i].assigned_to.id] === "undefined") {
                result[currentRedmineTrackerId].manHoursList[redmineTicketList[i].category.id].manHoursList[redmineTicketList[i].assigned_to.id] = {
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
                redmineTicketList[i].estimated_hours = 5.0;
                // throw new Error("工数が未入力のチケットがあります。");
            }
            result[currentRedmineTrackerId].totalManHour += redmineTicketList[i].estimated_hours;
            if (typeof result[currentRedmineTrackerId].totalManHourList[redmineTicketList[i].assigned_to.id] === "undefined") {
                result[currentRedmineTrackerId].totalManHourList[redmineTicketList[i].assigned_to.id] = {
                    name: redmineTicketList[i].assigned_to.name,
                    manHour: 0.0
                };
            }
            result[currentRedmineTrackerId].totalManHourList[redmineTicketList[i].assigned_to.id].manHour += redmineTicketList[i].estimated_hours;
            result[currentRedmineTrackerId].manHoursList[redmineTicketList[i].category.id].totalManHour += redmineTicketList[i].estimated_hours;
            result[currentRedmineTrackerId].manHoursList[redmineTicketList[i].category.id].manHoursList[redmineTicketList[i].assigned_to.id].totalManHour += redmineTicketList[i].estimated_hours;
            result[currentRedmineTrackerId].issues.push(redmineTicketList[i]);
        }
        return result;
    }

    createFormattedManHourList(totalManHourList) {
        let eachResult = [];
        let tmpArray = [];
        let tmpArrayByUser = [];
        let tmpArrayByUserForJoin = [];
        const unit = "h";
        const separator = "、";
        const preString = " * ";
        const separator2 = "：";
        eachResult[0] = this.createFormattedManHourListTotal(totalManHourList, unit, separator);
        for (let currentTrackerId = 1; currentTrackerId < totalManHourList.length; currentTrackerId++) {
            if (typeof totalManHourList[currentTrackerId] === "undefined") {
                continue;
            }
            eachResult[currentTrackerId] = preString + totalManHourList[currentTrackerId].trackerName + separator2;
            for (let currentCategoryId = 0; currentCategoryId < totalManHourList[currentTrackerId].manHoursList.length; currentCategoryId++) {
                if (typeof totalManHourList[currentTrackerId].manHoursList[currentCategoryId] === "undefined") {
                    continue;
                }
                tmpArray.push(
                    totalManHourList[currentTrackerId].manHoursList[currentCategoryId].categoryName +
                    totalManHourList[currentTrackerId].manHoursList[currentCategoryId].totalManHour + unit
                );
                for (let currentUserId = 0; currentUserId < totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList.length; currentUserId++) {
                    if (typeof totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId] === "undefined") {
                        continue;
                    }

                    if (typeof tmpArrayByUser[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user.name] === "undefined") {
                        tmpArrayByUser[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user.name] = 0.0;
                    }
                    tmpArrayByUser[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user.name] += totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].totalManHour;
                }
            }
            for (const userName in tmpArrayByUser) {
                tmpArrayByUserForJoin.push(userName+tmpArrayByUser[userName]+unit);
            }
            tmpArrayByUser = [];
            eachResult[currentTrackerId] += tmpArray.join(separator) + "(" + tmpArrayByUserForJoin.join(separator) + ")";
            tmpArrayByUserForJoin = [];
            tmpArray = [];
        }
        let result = "## 工数\n\n";
        for (let i = 0; i <eachResult.length; i++) {
            if (typeof eachResult[i] === "undefined") {
                continue;
            }
            result += eachResult[i] + "\n";
        }
        return result.replace(/(\n)+/g,'\n');
    }

    createFormattedManHourListTotal(totalManHourList, unit, separator) {
        let eachResult = "";
        let tmpArrayForTotal = [];
        let tmpArrayForTotalJoin = [];
        let tmpArrayForTotalEachUsers = [];
        let tmpArrayForTotalEachUsersForJoin = [];
        // 一行目: 合計
        for (let currentTrackerId = 0; currentTrackerId < totalManHourList.length; currentTrackerId++) {
            if (typeof totalManHourList[currentTrackerId] === "undefined") {
                continue;
            }
            for (let currentCategoryId = 0; currentCategoryId < totalManHourList[currentTrackerId].manHoursList.length; currentCategoryId++) {
                if (typeof totalManHourList[currentTrackerId].manHoursList[currentCategoryId] === "undefined") {
                    continue;
                }
                if (typeof tmpArrayForTotal[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].categoryName] === "undefined") {
                    tmpArrayForTotal[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].categoryName] = 0.0;
                }
                tmpArrayForTotal[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].categoryName] += totalManHourList[currentTrackerId].manHoursList[currentCategoryId].totalManHour;
                for (let currentUserId = 0; currentUserId < totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList.length; currentUserId++) {
                    if (typeof totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId] === "undefined") {
                        continue;
                    }
                    if (typeof totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user === "undefined") {
                        totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user = {
                            id: -1,
                            name: currentUserId+"(redmine)",
                            redmine_user_id: currentUserId,
                            timecard_user_id: null,
                            mail_address: "",
                            password_hashed: ""
                        };
                    }
                    if (typeof tmpArrayForTotalEachUsers[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user.name] === "undefined") {
                        tmpArrayForTotalEachUsers[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user.name] = 0.0;
                    }
                    tmpArrayForTotalEachUsers[totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].user.name] += totalManHourList[currentTrackerId].manHoursList[currentCategoryId].manHoursList[currentUserId].totalManHour;
                }
            }
        }

        eachResult = "* 開発：";
        for (const tmpTotal in tmpArrayForTotal) {
            tmpArrayForTotalJoin.push(tmpTotal+tmpArrayForTotal[tmpTotal]+unit);
        }

        for (const tmpUserTotal in tmpArrayForTotalEachUsers) {
            tmpArrayForTotalEachUsersForJoin.push(tmpUserTotal+tmpArrayForTotalEachUsers[tmpUserTotal]+unit);
        }

        eachResult += tmpArrayForTotalJoin.join(separator) + "(";
        eachResult += tmpArrayForTotalEachUsersForJoin.join(separator) + ")";

        return eachResult;
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
                    resultString += " - ##" + redmineTicketList[i].trackerList[j].ticketList[k].id + "\n";
                }
            }
        }
        return resultString;
    }
}