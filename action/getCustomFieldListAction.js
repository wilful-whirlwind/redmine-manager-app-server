const GasLogic = require("../logic/gasLogic");
const TemplateTicketLogic = require("../logic/templateTicketLogic");


module.exports = async function(event, data) {
    const gasLogic = new GasLogic();
    try {
        const customFieldList = await gasLogic.getCustomFieldList();
        event.returnValue = {
            "status": "success",
            "customFieldList": customFieldList,
        };
    } catch(e) {
        event.returnValue = {
            "status": "failed",
            "message": e.message
        };
    }
}