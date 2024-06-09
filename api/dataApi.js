const AbstractApi = require("./abstractApi");
const store = require('../util/storeUtil')
const ExecuteStyle = require("../env/env");

module.exports = class DataApi extends AbstractApi {
    static async getUserList() {
        const executeStyle = new ExecuteStyle();
        let url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const query = {
            "target": "user",
            "id": "all"
        };
        if (executeStyle.isWeb()) {
            url = url + '/user';
        }
        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.userList === "undefined") {
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
        return res.userList;
    }

    static async getTemplateTicketList() {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const query = {
            "target": "template_ticket",
            "template_ticket_id": "all"
        };
        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.ticketTemplateList === "undefined") {
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
        return res.ticketTemplateList;
    }

    static async getScheduleListFromGoogleCalendar(from, to, versionName) {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const calendarId = await store.get("gasPostScheduleAPICalenderId");
        const query = {
            "target": "calendar",
            "calendar_id": calendarId,
            "from": from,
            "to": to,
            "version_name": versionName
        };

        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.calendarList === "undefined") {
            throw new Error("登録済みカレンダー情報の取得に失敗しました。");
        }
        return res.calendarList;
    }

    static async getScheduleList() {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
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
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasPostScheduleAPIEndPoint" + executeStyle.style);
        const calendarId = await store.get("gasPostScheduleAPICalenderId");
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
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasPostScheduleAPIEndPoint" + executeStyle.style);
        const calendarId = await store.get("gasPostScheduleAPICalenderId");
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

    /**
     * イベント削除
     * @param from
     * @param to
     * @param title
     * @param versionName
     * @return {Promise<null>}
     */
    static async deleteGoogleCalendarSchedule(from, to, title, versionName) {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasPostScheduleAPIEndPoint" + executeStyle.style);
        const calendarId = await store.get("gasPostScheduleAPICalenderId");
        const request = {
            "target": "delete_event",
            "calendar_id": calendarId,
            "from": from,
            "to": to,
            "version_name": versionName,
            "search_string": title
        };
        let res = await this.callPostApi(url, {}, request);
        if (res?.data.status !== "deleted" && res?.data.status !== "not found") {
            throw new Error("スケジュールの削除に失敗しました。");
        }
        return res;
    }

    static async getCustomFieldList() {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const query = {
            "target": "custom_field",
            "custom_field_id": "all"
        };
        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.customFieldList === "undefined") {
            throw new Error("カスタムフィールド情報の取得に失敗しました。");
        }
        return res.customFieldList;
    }

    static async postGoogleDrive(taskName) {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const sendTargetId = await store.get("gasPostGoogleDriveAPITargetFolderId") ?? "";
        if (sendTargetId.length < 1) {
            throw new Error("google driveのIDが未設定です。configより設定してください。")
        }
        const request = {
            "target": "drive",
            "id": sendTargetId,
            "name": taskName
        };
        let res = await this.callPostApi(url, {}, request);
        if (res?.data.status !== "created" && res?.data.status !== "not found") {
            throw new Error("Google driveの作成に失敗しました。");
        }
        return res.data.id;
    }


    static async postTemplateTestSheet(folderId) {
        if (folderId.length < 1) {
            throw new Error("対象フォルダのIDが不正です。");
        }
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const templateSheetId = await store.get("gasPostTestTemplateSheetAPITemplateSpreadSheetId");
        if (templateSheetId.length < 1) {
            throw new Error("GASテストテンプレート生成APIのテンプレートシートIDが未設定です。configより設定してください。");
        }
        const request = {
            "target": "templateTestSheet",
            "folderId": folderId,
            "templateSheetId": templateSheetId
        };
        let res = await this.callPostApi(url, {}, request);
        if (res?.data.status !== "created" && res?.data.status !== "not found") {
            throw new Error("Google driveの作成に失敗しました。");
        }
        return res.data.id;
    }

    static async getUserForAuth(password) {
        const executeStyle = new ExecuteStyle();
        let url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const query = {
            "target": "user",
            "id": "auth",
            "password": password
        };
        if (executeStyle.isWeb()) {
            url = url + '/user';
        }
        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.result === "undefined") {
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
        return res.result;
    }

    static async updateUser(id, name, mailAddress) {
        const executeStyle = new ExecuteStyle();
        const url = await store.get("gasGetListAPIEndPoint" + executeStyle.style);
        const request = {
            "target": "user",
            "Id": id,
            "Name": name,
            "MailAddress": mailAddress,
        };
        let res = await this.callPatchApi(url + "/user", {}, request);
        if (res?.data.status !== "created" && res?.data.status !== "not found") {
            throw new Error("Google driveの作成に失敗しました。");
        }
        return res.data;
    }
}