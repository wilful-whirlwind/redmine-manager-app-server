import {ScheduleLogic} from "../logic/ScheduleLogic";

function validate(params: any) {

}

export function postCalendarScheduleAction(body: any)
{
    try {
        validate(body);
    } catch(e) {
        Logger.log(e);
        return {
            "status": "error",
            "message": "リクエストボディが不正です。"
        }
    }
    const ymd = body?.ymd;
    const title = body?.title;
    const calendarId = body?.calendar_id;
    let start = body?.start;
    let end = body?.end;
    if (typeof start === "undefined") {
        start = "";
    }
    if (typeof end === "undefined") {
        end = "";
    }
    const scheduleLogic = new ScheduleLogic();
    scheduleLogic.saveScheduleToGoogleCalendar(ymd, title, calendarId, start, end)
    return {
        "status": "success",
        "message": "登録しました"
    };
}