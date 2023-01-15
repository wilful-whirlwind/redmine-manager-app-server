import {ScheduleLogic} from "../logic/ScheduleLogic";

function validate(params: any) {

}

export function deleteScheduleFromCalendarAction(params: any)
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
    const searchString = params?.search_string;
    const scheduleLogic = new ScheduleLogic();
    return scheduleLogic.deleteScheduleToGoogleCalendar(versionName, calendarId, from, to, searchString);
}