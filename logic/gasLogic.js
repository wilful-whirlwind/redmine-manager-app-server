const VersionInfo = require("../entity/versionInfo");
const GasApi = require("../api/gasApi");


module.exports = class GasLogic {
    async getUserList() {
        try {
            return await GasApi.getUserList();
        } catch (e) {
            console.log(e)
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
    }

    async getScheduleList() {
        try {
            return await GasApi.getScheduleList();
        } catch (e) {
            console.log(e)
            throw new Error("スケジュール情報の取得に失敗しました。");
        }
    }

    async postScheduleList(eventDateTimeList) {
        try {
            let currentEvent = null;
            for (let i = 0; i < eventDateTimeList.length; i++) {
                currentEvent = eventDateTimeList[i];
                if (typeof currentEvent?.name === "undefined") {
                    continue;
                }
                if (typeof currentEvent?.ymd === "undefined") {
                    continue;
                }
                if (
                    typeof currentEvent?.from === "undefined" &&
                    typeof currentEvent?.to === "undefined"
                ) {
                    await GasApi.postGoogleCalendarScheduleForAllDays(currentEvent.ymd, currentEvent.name);
                }
                if (
                    typeof currentEvent?.from === "string" &&
                    typeof currentEvent?.to === "string"
                ) {
                    await GasApi.postGoogleCalendarScheduleForMeeting(currentEvent.ymd, currentEvent.name, currentEvent.from, currentEvent.to);
                }
            }
        } catch (e) {
            console.log(e)
            throw new Error("スケジュール情報の登録に失敗しました。");
        }
    }
}