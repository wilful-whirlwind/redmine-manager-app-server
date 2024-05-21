const SaveConfigLogic = require("../logic/saveConfigLogic");
const createResponse = require("./createResponse");


module.exports = async function(event, data) {
    const logic = new SaveConfigLogic();
    await logic.saveConfig(data);
    createResponse(event, "登録しました。");
    return true;
}