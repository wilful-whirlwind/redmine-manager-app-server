const RedmineLogic = require("../logic/redmineLogic");
const SaveConfigLogic = require("../logic/saveConfigLogic");
const createResponse = require("./createResponse");

module.exports = async function(event, data) {
    const redmineLogic = new RedmineLogic();
    try {
        const redmineTrackerList = await redmineLogic.getTrackerList();
        const configLogic = new SaveConfigLogic();
        const trackerActiveList = await configLogic.getRedmineTrackerConfig();
        const trackerMonHoursDivisionList = await configLogic.getRedmineTrackerManHoursDivisionConfig();
        return createResponse(event, {
            "status": "success",
            "redmineTrackerList": redmineTrackerList,
            "trackerActiveList": trackerActiveList,
            "trackerMonHoursDivisionList": trackerMonHoursDivisionList
        })
    } catch (e) {
        return createResponse(event, {
            "status": "failed",
            "message": e.message
        });
    }

}