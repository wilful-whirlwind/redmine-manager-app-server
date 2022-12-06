import {getSpreadSheetId} from "../config/Config";

export class UserLogic {

    public userList: any;

    constructor() {
        const sheetId = getSpreadSheetId();
        if (sheetId === null) {
            throw new Error("スプレッドシートのIDが設定されていません。");
        }
        const spreadSheet = SpreadsheetApp.openById(sheetId);
        const sheet = spreadSheet.getSheetByName("ユーザマスタ");
        if (sheet === null) {
            throw new Error("ユーザマスタが存在しません。");
        }
        const range = sheet.getDataRange();
        const values = range.getValues();
        const userList = [];

        for (let row = 1; row < values.length; row++) {
            userList.push({
                id: values[row][0],
                name: values[row][1],
                redmine_user_id: values[row][2],
                timecard_user_id: values[row][3],
                mail_address: values[row][4],
                password_hashed: values[row][5],
            });
        }

        this.userList = userList;
    }

    /**
     * 全て取得
     */
    public getUserInfo() {
        return {
            "userList": this.userList
        };
    }

    /**
     * ユーザID検索
     * @param id ユーザID
     */
    public getUserById(id: string|number) {
        if (typeof id === "string") {
            id = Number.parseInt(id);
        }
        for (let row = 0; row < this.userList.length; row++) {
            if (typeof this.userList[row].id === "string") {
                this.userList[row].id = Number.parseInt(this.userList[row].id);
            }
            if (id === this.userList[row].id) {
                return this.userList[row];
            }
        }
        return null;
    }
}