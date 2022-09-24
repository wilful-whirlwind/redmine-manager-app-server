const {app} = require("electron");
const SaveConfigLogic = require("../logic/saveConfigLogic");

module.exports = function(event, data) {
    const logic = new SaveConfigLogic();
    event.returnValue = logic.loadConfig();
}