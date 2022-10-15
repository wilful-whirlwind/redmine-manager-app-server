const RedmineLogic = require("../logic/redmineLogic");

module.exports = async function(event, data) {
    const redmineLogic = new RedmineLogic();
    const redmineVersionList = await redmineLogic.getVersionList();
    event.returnValue = {
        "redmineVersionList": redmineVersionList,
    };
}