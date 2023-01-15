import {ScheduleLogic} from "../logic/ScheduleLogic";

function validate(params: any) {

}

export function getScheduleFromCalendarAction(params: any)
{
    try {
        validate(params);
    } catch(e) {
        Logger.log(e);
        return {
            "type": "error",
            "message": "クエリパラメータが不正です。"
        }
    }
    const calendarId = params?.calendar_id;
    const versionName = params?.version_name;
    const from = params?.from;
    const to = params?.to;
    const scheduleLogic = new ScheduleLogic();
    const calendarList = scheduleLogic.getScheduleToGoogleCalendar(versionName, calendarId, from, to);
    return {
        "calendarList": calendarList
    }
}