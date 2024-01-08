import {getSpreadSheetId} from "../config/Config";
import {type} from "os";

export class DriveLogic {

    public scheduleList: any;

    constructor() {
    }

    /**
     * google Driveのフォルダを追加
     * @param id
     * @param name
     */
    public createFolderToTarget(id: string, name: string) {
        const targetDrive = DriveApp.getFolderById(id);
        const drive = targetDrive.createFolder(name);
        if (drive === null) {
            throw new Error("ドライブIDが不正です。")
        }
        return drive.getId();
    }

    /**
     * 指定したスプレッドシートを指定したフォルダにコピー
     * @param folderId
     * @param templateSheetId
     */
    public copySheetToTarget(folderId: string, templateSheetId: any) {
        const targetDrive = DriveApp.getFolderById(folderId);
        if (targetDrive === null) {
            throw new Error("ドライブIDが不正です。")
        }
        const origin = SpreadsheetApp.openById(templateSheetId);
        if (!origin) {
            throw new Error("コピー元スプレッドシートIDが不正です。")
        }
        const copy = origin.copy("テストシート");
        if (!copy) {
            throw new Error("コピーに失敗しました。")
        }

        const copyFile = DriveApp.getFileById(copy.getId());
        if (!copyFile) {
            throw new Error("コピーしたスプレッドシートのファイル情報の取得に失敗しました。")
        }

        copyFile.moveTo(targetDrive);
        return copy.getId();
    }
}