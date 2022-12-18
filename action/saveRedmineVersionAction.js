const RedmineLogic = require("../logic/redmineLogic");
const GasLogic = require("../logic/gasLogic");
const Store = require('electron-store')
const {app} = require("electron");
const store = new Store();


module.exports = async function(event, data) {
    console.log(data);
    const redmineLogic = new RedmineLogic();
    const gasLogic = new GasLogic();
    try {
        const resForRedmine = await redmineLogic.initializeVersionLogic(data.majorVersion, data.minorVersion, data.maintenanceVersion, data.releaseDate);
        console.log(resForRedmine)
        const resForGas = await gasLogic.postScheduleList(data.eventDateTimeList);
        console.log(resForGas);
        store.set("sendMessage","登録しました");
        event.returnValue = "登録しました。";
    } catch (e) {
        store.set("sendMessage","登録に失敗しました。同一バージョンが生成されていないか確認してください。");
        event.returnValue = "登録に失敗しました。同一バージョンが生成されていないか確認してください。";
    }
}