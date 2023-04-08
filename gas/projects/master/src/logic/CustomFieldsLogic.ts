import {getSpreadSheetId} from "../config/Config";

export class CustomFieldsLogic {

    public customFieldList: any;

    constructor() {
        const sheetId = getSpreadSheetId();
        if (sheetId === null) {
            throw new Error("スプレッドシートのIDが設定されていません。");
        }
        const spreadSheet = SpreadsheetApp.openById(sheetId);
        const sheet = spreadSheet.getSheetByName("カスタムフィールドマスタ");
        if (sheet === null) {
            throw new Error("カスタムフィールドマスタが存在しません。");
        }
        const range = sheet.getDataRange();
        const values = range.getValues();
        const customFieldList = [];

        for (let row = 1; row < values.length; row++) {
            customFieldList.push({
                id: values[row][0],
                name: values[row][1],
                required_division: values[row][2],
                project_id: values[row][3],
                tracker_id: values[row][4],
                default_value: values[row][5],
                limited_user_division: values[row][6],
            });
        }

        this.customFieldList = customFieldList;
    }

    /**
     * 全て取得
     */
    public getCustomFieldsInfo() {
        return {
            "customFieldList": this.customFieldList
        };
    }

    /**
     * ユーザID検索
     * @param id ユーザID
     */
    public getCustomFieldById(id: string|number) {
        if (typeof id === "string") {
            id = Number.parseInt(id);
        }
        for (let row = 0; row < this.customFieldList.length; row++) {
            if (typeof this.customFieldList[row].id === "string") {
                this.customFieldList[row].id = Number.parseInt(this.customFieldList[row].id);
            }
            if (id === this.customFieldList[row].id) {
                return this.customFieldList[row];
            }
        }
        return null;
    }
}