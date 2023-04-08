import {CustomFieldsLogic} from "../logic/CustomFieldsLogic";

function validate(params: any) {

}

export function getCustomFieldsAction(params: any)
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
    const customFieldId = params?.custom_field_id;
    const customFieldsLogic = new CustomFieldsLogic();
    let res = {};
    if (customFieldId === "all") {
        res = customFieldsLogic.getCustomFieldsInfo();
    } else {
        res = customFieldsLogic.getCustomFieldById(customFieldId);
    }
    return res;
}