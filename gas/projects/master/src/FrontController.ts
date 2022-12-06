import {getUserAction} from "./action/GetUserAction";
import {getScheduleAction} from "./action/GetScheduleAction";
import {getTicketTemplateAction} from "./action/GetTicketTemplateAction";

export function frontController(params: any, httpMethod: string): any
{
    let target = params?.target;
    if (typeof target === "undefined") {
        target = "undefined";
    }

    let res = {};
    switch (target) {
        case "user":
            res = getUserAction(params);
            break;
        case "schedule":
            res = getScheduleAction(params);
            break;
        case "template_ticket":
            res = getTicketTemplateAction(params);
            break;
        default:
    }

    return res;
}