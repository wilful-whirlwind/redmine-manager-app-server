import {DriveLogic} from "../logic/DriveLogic";

function validate(params: any) {

}

export function postDriveAction(body: any)
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
    const targetId = body?.id;
    const name = body?.name;
    const driveLogic = new DriveLogic();
    try {
        const id = driveLogic.createFolderToTarget(targetId, name);
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