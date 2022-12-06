import {UserLogic} from "../logic/UserLogic";

function validate(params: any) {
    const userId = params?.user_id;
    if (typeof userId !== "string" && typeof userId !== "number") {
        throw new Error("userIdが不正です。");
    }
}

export function getUserAction(params: any)
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
    const userId = params?.user_id;
    const userLogic = new UserLogic();
    let res = {};
    if (userId === "all") {
        res = userLogic.getUserInfo();
    } else {
        res = userLogic.getUserById(userId);
    }
    return res;
}