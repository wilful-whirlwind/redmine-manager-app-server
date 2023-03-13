const GasLogic = require("../logic/gasLogic");
const TemplateTicketLogic = require("../logic/templateTicketLogic");


module.exports = async function(event, data) {
    const gasLogic = new GasLogic();
    const templateTicketLogic = new TemplateTicketLogic();
    try {
        const templateTicketList = await gasLogic.getTemplateTicketList();
        const getTemplateTicketTreeInfo = templateTicketLogic.convertTreeListFromTemplateTicketList(templateTicketList);
        event.returnValue = {
            "status": "success",
            "templateTicketList": getTemplateTicketTreeInfo,
        };
    } catch(e) {
        event.returnValue = {
            "status": "failed",
            "message": e.message
        };
    }
}