const DataApi = require("../api/DataApi");

module.exports = class UserLogic {
    async authLoginIsValid(userName, password) {
        const responseUserList = await DataApi.getUserForAuth(password);
        return !!responseUserList;
    }
}