import {getSpreadSheetId} from "../config/Config";

export class TicketTemplateLogic {

    public ticketTemplateList: any;

    constructor() {
        const sheetId = getSpreadSheetId();
        if (sheetId === null) {
            throw new Error("スプレッドシートのIDが設定されていません。");
        }
        const spreadSheet = SpreadsheetApp.openById(sheetId);
        const sheet = spreadSheet.getSheetByName("テンプレートチケットマスタ");
        if (sheet === null) {
            throw new Error("テンプレートチケットマスタが存在しません。");
        }
        const range = sheet.getDataRange();
        const values = range.getValues();
        const ticketTemplateList = [];

        for (let row = 1; row < values.length; row++) {
            if (
                typeof values[row][0] === "undefined" ||
                values[row][0] === null ||
                values[row][0].length < 1
            ) {
                continue;
            }
            ticketTemplateList.push({
                id: values[row][0],
                name: values[row][1],
                tracker_id: values[row][2],
                categoryName: values[row][3],
                redmine_user_id: values[row][4],
                parent_issue_id: values[row][5],
            });
        }

        this.ticketTemplateList = ticketTemplateList;
    }

    /**
     * 全て取得
     */
    public getTicketTemplateInfo() {
        return {
            "ticketTemplateList": this.ticketTemplateList
        };
    }

    /**
     * チケットテンプレートID検索
     * @param id チケットテンプレートID
     */
    public getTicketTemplateById(id: string|number) {
        if (typeof id === "string") {
            id = Number.parseInt(id);
        }
        for (let row = 0; row < this.ticketTemplateList.length; row++) {
            if (typeof this.ticketTemplateList[row].id === "string") {
                this.ticketTemplateList[row].id = Number.parseInt(this.ticketTemplateList[row].id);
            }
            if (id === this.ticketTemplateList[row].id) {
                return this.ticketTemplateList[row];
            }
        }
        return null;
    }
}