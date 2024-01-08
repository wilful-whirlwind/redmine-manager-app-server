import {DriveLogic} from "../logic/DriveLogic";

function validate(params: any) {

}

export function postTestTemplateSheetAction(body: any)
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
    const folderId = body?.folderId;
    const templateSheetId = body?.templateSheetId;
    const driveLogic = new DriveLogic();
    try {
        const id = driveLogic.copySheetToTarget(folderId, templateSheetId);
        return {
            "status": "created",
            "message": "登録しました",
            "id": id
        }
    } catch (e) {
        return {
            "status": "failed",
            "message": "Driveの作成に失敗しました。" + e,
        }
    }
}