const RedmineLogic = require("../logic/redmineLogic");
const SaveConfigLogic = require("../logic/saveConfigLogic");

module.exports = async function(event, data) {
    const redmineLogic = new RedmineLogic();
    const redmineTrackerList = await redmineLogic.getTrackerList();

    const configLogic = new SaveConfigLogic();
    const trackerActiveList = await configLogic.getRedmineTrackerConfig();
    const trackerMonHoursDivisionList = configLogic.getRedmineTrackerManHoursDivisionConfig();
    event.returnValue = {
        "redmineTrackerList": redmineTrackerList,
        "trackerActiveList": trackerActiveList,
        "trackerMonHoursDivisionList": trackerMonHoursDivisionList
    };
}