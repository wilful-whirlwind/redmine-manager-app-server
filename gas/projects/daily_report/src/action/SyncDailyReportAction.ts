import {DailyReportLogic} from "../logic/DailyReportLogic";
import {UserLogic} from "../logic/UserLogic";

function validate(params: any) {

}

export async function syncDailyReportAction(params: any)
{
    try {
        validate(params);
    } catch(e) {
        Logger.log(e);
        return {
            "type": "error",
            "message": "パラメータが不正です。"
        }
    }
    let res = {};
    const logic = new UserLogic();
    const userList = await logic.getUserList();

    return res;
}