const RedmineLogic = require("../logic/redmineLogic");
const GasLogic = require("../logic/gasLogic");
const Store = require('electron-store')
const {app} = require("electron");
const VersionInfo = require("../entity/versionInfo");
const createResponse = require("./createResponse");
const store = new Store();


function validate(data) {
    let errList = [];
    if (typeof data?.majorVersion === "undefined") {
        errList.push("メジャーバージョンの値が不正です。");
    }

    if (typeof data?.minorVersion === "undefined") {
        errList.push("マイナーバージョンの値が不正です。");

    }

    if (typeof data?.maintenanceVersion === "undefined") {
        errList.push("メンテナンスバージョンの値が不正です。");
    }
    return errList;
}

module.exports = async function(event, data) {
    console.log(data);
    let errList = validate(data);
    if (errList.length > 0) {
        event.returnValue = JSON.stringify(errList);
        return;
    }
    const redmineLogic = new RedmineLogic();
    const gasLogic = new GasLogic();
    try {
        let versionInfo = new VersionInfo(data.majorVersion, data.minorVersion, data.maintenanceVersion, data.releaseDate);
        const createdVersion = await redmineLogic.createRedmineVersionLogic(data.majorVersion, data.minorVersion, data.maintenanceVersion, data.releaseDate);
        const resForGas = await gasLogic.postScheduleList(data.eventDateTimeList, data.majorVersion, data.minorVersion, data.maintenanceVersion);
        const ticketResult = await redmineLogic.createTicketList(data.templateTicketTreeInfo, createdVersion.id, createdVersion.project.id, versionInfo);

        console.log(resForGas);
        store.set("sendMessage","登録しました");
        return createResponse(event, "登録しました。");
    } catch (e) {
        store.set("sendMessage","登録に失敗しました。同一バージョンが生成されていないか確認してください。");
        return createResponse(event, "登録に失敗しました。同一バージョンが生成されていないか確認してください。");
    }
}