const GasLogic = require("../logic/gasLogic");
const createResponse = require("./createResponse");
const ExecuteStyle = require("../env/env");
const UserLogic = require("../logic/Userlogic");


module.exports = async function(event, data) {
    const executeStyle = new ExecuteStyle();
    if (executeStyle.isApp()) {
        return await executeForApp(event, data);
    } else {
        return await executeForWeb(event, data);
    }
}

async function executeForApp(event, data) {
    const logic = new GasLogic();
    try {
        const eventList = await logic.getScheduleListFromEventMaster();
        return createResponse(event, {
            "status": "success",
            "eventList": eventList,
        });
    } catch(e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}

async function executeForWeb(event, data) {
    const logic = new UserLogic();
    try {
        const result = await logic.getUserList();
        return createResponse(event, {
            "status": "success",
            "userList": result,
        });
    } catch(e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}