const GasLogic = require("../logic/gasLogic");
const RedmineLogic = require("../logic/redmineLogic");
const createResponse = require("./createResponse");

/**
 *
 * @param data
 * @return {*[]}
 */
function validate(data) {
    let message = [];
    if (typeof data?.task_name !== "string" || data.task_name.length < 1) {
        message.push("タスク名は必須です。");
    }
    return message;
}

module.exports = async function(event, data) {
    const errorMessage = validate(data);
    if (errorMessage.length > 0) {
        event.returnValue = {
            "status": "error",
            "message": errorMessage.join("<br />"),
        };
        return;
    }
    const gasLogic = new GasLogic();
    const redmineLogic = new RedmineLogic();
    let folderId = "";
    let testSheetId = "";
    try {
        folderId = await gasLogic.createGoogleDrive(data);
        testSheetId = await gasLogic.createTestDocument(data, folderId);
        const redmineTicketNumber = await redmineLogic.createTaskTicket(data, folderId, testSheetId, 1);
        console.log("チケット登録: #" + redmineTicketNumber);
        event.returnValue = {
            "status": "success",
            "message": "登録しました。",
        };
    } catch(e) {
        //TODO ロールバック処理

        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}