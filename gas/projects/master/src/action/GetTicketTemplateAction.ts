import {ScheduleLogic} from "../logic/ScheduleLogic";
import {TicketTemplateLogic} from "../logic/TicketTemplateLogic";

function validate(params: any) {
    const ticketTemplateId = params?.template_ticket_id;
    if (typeof ticketTemplateId !== "string" && typeof ticketTemplateId !== "number") {
        throw new Error("templateTicketIdが不正です。");
    }
}

export function getTicketTemplateAction(params: any)
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
    const ticketTemplateId = params?.template_ticket_id;
    const ticketTemplateLogic = new TicketTemplateLogic();
    let res = {};
    if (ticketTemplateId === "all") {
        res = ticketTemplateLogic.getTicketTemplateInfo();
    } else {
        res = ticketTemplateLogic.getTicketTemplateById(ticketTemplateId);
    }
    return res;
}