const ExecuteStyle = require("../env/env");

module.exports = function createResponse(event, data) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        event.returnValue = data;
        return event;
    } else if(style.isWeb()) {
        return data;
    }
}