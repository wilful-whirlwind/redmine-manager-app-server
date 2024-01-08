const RedmineLogic = require("../logic/redmineLogic");

module.exports = async function(event, data) {
    const redmineLogic = new RedmineLogic();
    try {
        const redmineVersionList = await redmineLogic.getVersionList();
        event.returnValue = {
            "status": "success",
            "redmineVersionList": redmineVersionList
        };
    } catch (e) {
        event.returnValue = {
            "status": "failed",
            "redmineVersionList": []
        };
    }
}