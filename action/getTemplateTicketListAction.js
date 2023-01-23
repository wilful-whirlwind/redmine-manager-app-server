const GasLogic = require("../logic/gasLogic");


module.exports = async function(event, data) {
    const logic = new GasLogic();
    try {
        const templateTicketList = await logic.getTemplateTicketList();
        event.returnValue = {
            "status": "success",
            "templateTicketList": templateTicketList,
        };
    } catch(e) {
        event.returnValue = {
            "status": "failed",
            "message": e.message
        };
    }
}