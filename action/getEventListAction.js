const GasLogic = require("../logic/gasLogic");


module.exports = async function(event, data) {
    const logic = new GasLogic();
    try {
        const eventList = await logic.getScheduleList();
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