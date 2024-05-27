const Store = require("electron-store");
const ExecuteStyle = require("../env/env");
const {get} = require("axios");
const store = new Store();

const saveToStore = function (key, data) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        store.set(key, data);
    } else if(style.isWeb()) {
    }
}

const getFromStore = async function(key) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        return await store.get(key);
    } else if(style.isWeb()) {
        const result = await get('http://localhost:8080/config?key=' + key);
        return result.data.result.Value;
    }
}

module.exports = {
    get: getFromStore,
    set: saveToStore
}
