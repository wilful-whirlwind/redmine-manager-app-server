const GasLogic = require("../logic/gasLogic");
const VersionInfo = require("../entity/versionInfo");
const createResponse = require("./createResponse")

module.exports = async function(event, data) {
    const logic = new GasLogic();
    try {
        const major = data?.majorVersion;
        const minor = data?.minorVersion;
        const maintenance = data?.maintenanceVersion;
        const versionInfo = new VersionInfo(major, minor, maintenance, null);
        const versionName = versionInfo.getVersionName("ver.", ".", "_");
        let eventList = await logic.getScheduleListFromGoogleCalendar(versionName);
        eventList = logic.convertScheduleList(eventList, versionName);
        return createResponse(event, {
            "status": "success",
            "eventList": eventList,
        })
    } catch(e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}