const GasLogic = require("../logic/gasLogic");
const TemplateTicketLogic = require("../logic/templateTicketLogic");
const createResponse = require("./createResponse");


module.exports = async function(event, data) {
    const gasLogic = new GasLogic();
    const templateTicketLogic = new TemplateTicketLogic();
    try {
        const templateTicketList = await gasLogic.getTemplateTicketList();
        const getTemplateTicketTreeInfo = templateTicketLogic.convertTreeListFromTemplateTicketList(templateTicketList);
        return createResponse(event, {
            "status": "success",
            "templateTicketList": getTemplateTicketTreeInfo,
        })
    } catch(e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}