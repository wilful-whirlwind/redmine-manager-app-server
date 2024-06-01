const Store = require("electron-store");
const ExecuteStyle = require("../env/env");
const {get, post} = require("axios");
const store = new Store();

const saveToStore = async function (key, data) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        store.set(key, data);
    } else if(style.isWeb()) {
        let request = {};
        request.Key = key;
        request.Value = data;
        const result = await post('http://localhost:8080/config', request);
        console.log(result);
    }
}

const getFromStore = async function(key) {
    const style = new ExecuteStyle();
    if (style.isApp()) {
        return await store.get(key);
    } else if(style.isWeb()) {
        const result = await get('http://localhost:8080/config?key=' + key);
        if (result.data?.result) {
            return result.data.result.Value;
        }
        return null;
    }
}

module.exports = {
    get: getFromStore,
    set: saveToStore
}
