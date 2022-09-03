const RedmineVersionLogic = require("../logic/redmineVersionLogic");
module.exports = async function(event, data) {
    console.log(data);
    const redmineVersionLogic = new RedmineVersionLogic();
    redmineVersionLogic.initializeVersionLogic(data.majorVersion, data.minorVersion, data.maintenanceVersion, data.releaseDate);
}