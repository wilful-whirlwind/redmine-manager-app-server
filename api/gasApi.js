const AbstractApi = require("./abstractApi");
const Store = require('electron-store')
const store = new Store();

module.exports = class GasApi extends AbstractApi {
    static async getUserList() {
        const url = store.get("gasGetUserListAPIEndPoint");
        let res = await this.callGetApi(url, {}, {});
        if (typeof res?.userList === "undefined") {
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
        return res.userList;
    }
}