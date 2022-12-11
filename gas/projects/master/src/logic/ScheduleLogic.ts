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
                useFlag: values[row][0],
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
     */
    public saveScheduleToGoogleCalendar(ymd: string, title:string, calendarId: string) {
        const calendar = CalendarApp.getCalendarById(calendarId);
        if (calendar === null) {
            throw new Error("カレンダーIDが不正です。")
        }
        calendar.createAllDayEvent(title, new Date(ymd));
    }
}