const DataApi = require("../api/DataApi");

module.exports = class UserLogic {
    async authLoginIsValid(userName, password) {
         return await DataApi.getUserForAuth(password);
    }

    /**
     * @return {Promise<*>}
     */
    async getUserList() {
        return await DataApi.getUserList();
    }

    async updateUser(id, name, mailAddress) {
        return await DataApi.updateUser(id, name, mailAddress);
    }
}