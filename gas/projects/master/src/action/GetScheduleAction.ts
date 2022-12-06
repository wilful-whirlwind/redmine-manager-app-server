import {ScheduleLogic} from "../logic/ScheduleLogic";

function validate(params: any) {
    const scheduleId = params?.schedule_id;
    if (typeof scheduleId !== "string" && typeof scheduleId !== "number") {
        throw new Error("scheduleIdが不正です。");
    }
}

export function getScheduleAction(params: any)
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
    const scheduleId = params?.schedule_id;
    const scheduleLogic = new ScheduleLogic();
    let res = {};
    if (scheduleId === "all") {
        res = scheduleLogic.getScheduleInfo();
    } else {
        res = scheduleLogic.getScheduleById(scheduleId);
    }
    return res;
}