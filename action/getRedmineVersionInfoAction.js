const RedmineLogic = require("../logic/redmineLogic");
const VersionLogic = require("../logic/versionLogic");
const GasLogic = require("../logic/gasLogic")
const Store = require("electron-store");
const store = new Store();


module.exports = async function(event, versionId) {
    const redmineLogic = new RedmineLogic();
    const versionLogic = new VersionLogic();
    const gasLogic = new GasLogic();
    try {
        const redmineVersion = await redmineLogic.getVersion(versionId);
        const redmineTicketList = await redmineLogic.getTicketByVersion(versionId, 1);
        const redmineTicketRelationList = await redmineLogic.getTicketRelationByVersion(redmineTicketList);
        const trackerIdList = store.get("tracker_id") ?? [];
        const trackerManHoursDivisionList = store.get("man-hours_division") ?? [];
        const userList = await gasLogic.getUserList();
        const versionInfo = versionLogic.createVersionInfoBySavedFormat(redmineVersion, redmineTicketList, redmineTicketRelationList, trackerIdList, trackerManHoursDivisionList, userList);
        event.returnValue = {
            "status": "success",
            "versionInfo": versionInfo,
        };
    } catch (e) {
        event.returnValue = {
            "status": "failed",
            "message": e.message,
        };
    }

}