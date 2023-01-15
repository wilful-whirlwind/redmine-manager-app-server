const GasLogic = require("../logic/gasLogic");
const VersionInfo = require("../entity/versionInfo");


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
        event.returnValue = {
            "status": "success",
            "eventList": eventList,
        };
    } catch(e) {
        event.returnValue = {
            "status": "failed",
            "message": e.message
        };
    }
}