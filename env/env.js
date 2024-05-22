module.exports = class ExecuteStyle {

    constructor() {
        this.style = "APP";
        // this.style = "WEB";
    }

    isApp() {
        return this.style === "APP";
    }

    isWeb() {
        return this.style === "WEB";
    }
}

