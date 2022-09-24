const {app} = require("electron");
const SaveConfigLogic = require("../logic/saveConfigLogic");


module.exports = async function(event, data) {
    const logic = new SaveConfigLogic();
    await logic.saveConfig(data);
    event.returnValue = "登録しました。";
    return true;
}