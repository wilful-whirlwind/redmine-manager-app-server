const GasLogic = require("../logic/gasLogic");
const TemplateTicketLogic = require("../logic/templateTicketLogic");
const createResponse = require("./createResponse");


module.exports = async function(event, data) {
    const gasLogic = new GasLogic();
    try {
        const customFieldList = await gasLogic.getCustomFieldList();
        return createResponse(event, {
            "status": "success",
            "customFieldList": customFieldList,
        })
    } catch(e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}