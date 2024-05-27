const SaveConfigLogic = require("../logic/saveConfigLogic");
const createResponse = require("./createResponse");

module.exports = async function(event, data) {
    const logic = new SaveConfigLogic();
    return createResponse(event, await logic.getBasicConfig());
}