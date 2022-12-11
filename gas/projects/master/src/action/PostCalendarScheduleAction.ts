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
            "type": "error",
            "message": "リクエストボディが不正です。"
        }
    }
    const ymd = body?.ymd;
    const title = body?.title;
    const calendarId = body?.calendar_id;
    const scheduleLogic = new ScheduleLogic();
    scheduleLogic.saveScheduleToGoogleCalendar(ymd, title, calendarId)
    return {
        "status": "success",
        "message": "登録しました"
    };
}