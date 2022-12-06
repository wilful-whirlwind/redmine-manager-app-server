import {getUserAction} from "./action/GetUserAction";

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
            break;
        case "templateTicket":
            break;
        default:
    }

    return res;
}