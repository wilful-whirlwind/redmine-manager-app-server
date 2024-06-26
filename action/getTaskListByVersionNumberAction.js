const RedmineLogic = require("../logic/redmineLogic");
const VersionInfo = require("../entity/versionInfo");
const createResponse = require("./createResponse");

module.exports = async function(event, data) {
    const redmineLogic = new RedmineLogic();
    try {
        let versionInfo = new VersionInfo(data.majorVersion, data.minorVersion, data.maintenanceVersion, null);
        const redmineVersion = await redmineLogic.getVersionByName(versionInfo);
        const taskList = await redmineLogic.getTicketByVersion(redmineVersion.id, 1);
        for (let i = 0; i < taskList.length; i++) {
            taskList[i].pic = "A";
            taskList[i].deadLine = "";
        }
        return createResponse(event, {
            "status": "success",
            "taskList": taskList,
        })
    } catch {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}