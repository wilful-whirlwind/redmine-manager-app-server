const Store = require("electron-store");
const ExecuteStyle = require("../env/env");
const store = new Store();

const saveToStore = function (key, data) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        store.set(key, data);
    } else if(style.isWeb()) {
    }
}

const getFromStore = function(key) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        return store.get(key);
    } else if(style.isWeb()) {
        return "";
    }
}

module.exports = {
    get: getFromStore,
    set: saveToStore
}
