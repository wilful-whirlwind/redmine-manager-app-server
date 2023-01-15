import {syncDailyReportAction} from "./action/SyncDailyReportAction";

/**
 * front cotroller
 * @param params パラメータ
 * @param callType httpMethod or 'sync'
 */
export function frontController(params: any, callType: string): any
{
    let target = params?.target;
    if (typeof target === "undefined") {
        target = "undefined";
    }

    let res = {};
    if (callType === 'get') {
        switch (target) {
            default:
        }
    } else if (callType === 'post') {
        switch (target) {
            default:
        }
    } else if (callType === 'sync') {
        switch (target) {
            case "daily_report":
                res = syncDailyReportAction(params);
                break;
            default:
        }
    }

    return res;
}