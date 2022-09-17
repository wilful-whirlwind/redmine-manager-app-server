const RedmineVersionLogic = require("../logic/redmineVersionLogic");
const Store = require('electron-store')
const {app} = require("electron");
const store = new Store();


module.exports = async function(event, data) {
    console.log(data);
    const redmineVersionLogic = new RedmineVersionLogic();
    try {
        await redmineVersionLogic.initializeVersionLogic(data.majorVersion, data.minorVersion, data.maintenanceVersion, data.releaseDate);
        console.log("sendMessage A");
        store.set("sendMessage","登録しました");
        event.returnValue = "登録しました。";
    } catch (e) {
        console.log("sendMessage B");
        store.set("sendMessage","登録に失敗しました。同一バージョンが生成されていないか確認してください。");
        event.returnValue = "登録に失敗しました。同一バージョンが生成されていないか確認してください。";
    }
}