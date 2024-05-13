const RedmineLogic = require("../logic/redmineLogic");
const createResponse = require("./createResponse");

module.exports = async function(event, data) {
    const redmineLogic = new RedmineLogic();
    try {
        const redmineVersionList = await redmineLogic.getVersionList();
        return createResponse(event, {
            "status": "success",
            "redmineVersionList": redmineVersionList
        })
    } catch (e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }
}