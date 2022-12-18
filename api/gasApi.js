const AbstractApi = require("./abstractApi");
const Store = require('electron-store')
const store = new Store();

module.exports = class GasApi extends AbstractApi {
    static async getUserList() {
        const url = store.get("gasGetListAPIEndPoint");
        const query = {
            "target": "user",
            "user_Id": "all"
        };
        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.userList === "undefined") {
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
        return res.userList;
    }

    static async getScheduleList() {
        const url = store.get("gasGetListAPIEndPoint");
        const query = {
            "target": "schedule",
            "schedule_id": "all"
        };

        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.scheduleList === "undefined") {
            throw new Error("スケジュール情報の取得に失敗しました。");
        }
        return res.scheduleList;
    }

    /**
     * 終日イベント登録
     * @param ymd
     * @param title
     * @return {Promise<null>}
     */
    static async postGoogleCalendarScheduleForAllDays(ymd, title) {
        const url = store.get("gasPostScheduleAPIEndPoint");
        const calendarId = store.get("gasPostScheduleAPICalenderId");
        const request = {
            "target": "calendar",
            "ymd": ymd,
            "title": title,
            "calendar_id": calendarId
        };
        let res = await this.callPostApi(url, {}, request);
        if (res?.data.status !== "success") {
            throw new Error("スケジュール情報の登録に失敗しました。");
        }
        return res;
    }

    /**
     * ミーティングなどの時間指定イベントの登録
     * @param ymd
     * @param title
     * @param start
     * @param end
     * @return {Promise<null>}
     */
    static async postGoogleCalendarScheduleForMeeting(ymd, title, start, end) {
        const url = store.get("gasPostScheduleAPIEndPoint");
        const calendarId = store.get("gasPostScheduleAPICalenderId");
        const request = {
            "target": "calendar",
            "ymd": ymd,
            "title": title,
            "calendar_id": calendarId,
            "start": start,
            "end": end
        };
        let res = await this.callPostApi(url, {}, request);
        if (res?.data.status !== "success") {
            throw new Error("スケジュール情報の登録に失敗しました。");
        }
        return res;
    }
}