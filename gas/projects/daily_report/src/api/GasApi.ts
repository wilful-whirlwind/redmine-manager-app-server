import {AbstractApi} from "./AbstractApi";

export class GasApi extends AbstractApi {
    public static async postDailyReport(report: any)
    {
        const sheet = SpreadsheetApp.openById("1CPMYk8W2nJ2NWJj-K2ipY7DGrJYUvnPY_YwJP9Nckp0");
        sheet.getRange('A1:A1').setValue(JSON.stringify(report));
    }
}