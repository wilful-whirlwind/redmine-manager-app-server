const {app} = require("electron");
const SaveConfigLogic = require("../logic/saveConfigLogic");
const createResponse = require("./createResponse");

module.exports = function(event, data) {
    const logic = new SaveConfigLogic();
    return createResponse(event, logic.getBasicConfig());
}