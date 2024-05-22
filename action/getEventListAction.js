const GasLogic = require("../logic/gasLogic");
const createResponse = require("./createResponse");


module.exports = async function(event, data) {
    const logic = new GasLogic();
    try {
        const eventList = await logic.getScheduleListFromEventMaster();
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