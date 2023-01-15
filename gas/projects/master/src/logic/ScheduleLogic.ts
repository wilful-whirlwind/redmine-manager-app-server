import {getSpreadSheetId} from "../config/Config";
import {type} from "os";

export class ScheduleLogic {

    public scheduleList: any;

    constructor() {
        const sheetId = getSpreadSheetId();
        if (sheetId === null) {
            throw new Error("スプレッドシートのIDが設定されていません。");
        }
        const spreadSheet = SpreadsheetApp.openById(sheetId);
        const sheet = spreadSheet.getSheetByName("スケジュールマスタ");
        if (sheet === null) {
            throw new Error("スケジュールマスタが存在しません。");
        }
        const range = sheet.getDataRange();
        const values = range.getValues();
        const scheduleList = [];

        for (let row = 1; row < values.length; row++) {
            scheduleList.push({
                use_flag: values[row][0],
                id: values[row][1],
                name: values[row][2],
                all_day_flag: values[row][3],
                start_date: values[row][4],
                start_time: values[row][5],
                end_time: values[row][6],
            });
        }

        this.scheduleList = scheduleList;
    }

    /**
     * 全て取得
     */
    public getScheduleInfo() {
        return {
            "scheduleList": this.scheduleList
        };
    }

    /**
     * スケジュールID検索
     * @param id スケジュールID
     */
    public getScheduleById(id: string|number) {
        if (typeof id === "string") {
            id = Number.parseInt(id);
        }
        for (let row = 0; row < this.scheduleList.length; row++) {
            if (typeof this.scheduleList[row].id === "string") {
                this.scheduleList[row].id = Number.parseInt(this.scheduleList[row].id);
            }
            if (id === this.scheduleList[row].id) {
                return this.scheduleList[row];
            }
        }
        return null;
    }

    /**
     * google calenderに予定を登録
     * @param ymd
     * @param title
     * @param calendarId
     * @param start
     * @param end
     */
    public saveScheduleToGoogleCalendar(ymd: string, title:string, calendarId: string, start: string, end: string) {
        const calendar = CalendarApp.getCalendarById(calendarId);
        if (calendar === null) {
            throw new Error("カレンダーIDが不正です。")
        }
        if (start.length < 1) {
            calendar.createAllDayEvent(title, new Date(ymd));
        } else {
            const startDate = new Date(ymd + " " + start);
            const endDate = new Date(ymd + " " + end);
            calendar.createEvent(title, startDate, endDate);
        }
    }

    /**
     * google calenderに予定を取得
     * @param versionName
     * @param calendarId
     * @param from
     * @param to
     */
    public getScheduleToGoogleCalendar(versionName:string, calendarId: string, from: string, to: string) {
        const calendar = CalendarApp.getCalendarById(calendarId);
        if (calendar === null) {
            throw new Error("カレンダーIDが不正です。")
        }
        const events = calendar.getEvents(new Date(from), new Date(to));
        let res = [];
        let start: GoogleAppsScript.Base.Date;
        let end: GoogleAppsScript.Base.Date;
        for (let i = 0; i < events.length; i++) {
            if (events[i].getTitle().search(versionName) > -1) {
                start = events[i].getStartTime();
                end = events[i].getEndTime();
                // 日本時間に合わせる。
                start.setHours(start.getHours() + 9);
                end.setHours(end.getHours() + 9);
                res.push(
                    {
                        "title": events[i].getTitle(),
                        "start": start,
                        "end": end,
                        "all_day_event_flag": events[i].isAllDayEvent()
                    }
                );
            }
        }
        return res;
    }

    /**
     * google calenderに予定を取得
     * @param versionName
     * @param calendarId
     * @param from
     * @param to
     * @param searchString
     */
    public deleteScheduleToGoogleCalendar(versionName:string, calendarId: string, from: string, to: string, searchString: string) {
        const calendar = CalendarApp.getCalendarById(calendarId);
        if (calendar === null) {
            throw new Error("カレンダーIDが不正です。")
        }
        if (searchString.length < 1) {
            throw new Error("削除検索文字列が空です。")
        }
        const events = calendar.getEvents(new Date(from), new Date(to));
        let res = {
            status: "not found",
        };
        let start: GoogleAppsScript.Base.Date;
        let end: GoogleAppsScript.Base.Date;
        for (let i = 0; i < events.length; i++) {
            if (events[i].getTitle() === versionName + searchString) {
                res.status = "deleted";
                events[i].deleteEvent();
            }
        }
        return res;
    }
}