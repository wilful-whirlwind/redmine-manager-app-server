const VersionInfo = require("../entity/versionInfo");
const GasApi = require("../api/gasApi");


module.exports = class GasLogic {
    async getUserList() {
        try {
            return await GasApi.getUserList();
        } catch (e) {
            console.log(e)
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
    }
}