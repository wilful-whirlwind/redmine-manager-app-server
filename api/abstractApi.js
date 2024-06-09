const axios = require('axios');
const store = require('../util/storeUtil')
const {Agent} = require("https");

module.exports = class AbstractApi {

    /**
     * execute post api
     * @param uri
     * @param headers
     * @param request
     * @return {Promise<null>}
     */
    static async callPostApi(uri, headers, request) {
        let response = null;
        headers = await this.setBasicAuth(headers);
        try {
            response = await axios.post(uri, request, {headers: headers});
        } catch (e) {
            console.error(e);
            throw new Error("APIの実行に失敗しました。")
        }
        return response;
    }

    /**
     * execute post api
     * @param uri
     * @param headers
     * @param request
     * @return {Promise<null>}
     */
    static async callPatchApi(uri, headers, request) {
        let response = null;
        headers = await this.setBasicAuth(headers);
        try {
            response = await axios.patch(uri, request, {headers: headers});
        } catch (e) {
            console.error(e);
            throw new Error("APIの実行に失敗しました。")
        }
        return response;
    }

    /**
     * execute get api
     * @param uri
     * @param headers
     * @param query
     * @return {Promise<null>}
     */
    static async callGetApi(uri, headers, query) {
        let response = null;
        headers = await this.setBasicAuth(headers);
        const agent = new Agent({
            rejectUnauthorized: false
        });
        try {
            response = await axios.get(uri, {params: query, headers: headers, httpsAgent: agent});
            console.log(response);
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }

    static async setBasicAuth(headers) {
        const basicAuthUserId = await store.get("basicAuthUserId") ?? "";
        const basicAuthPassWord = await store.get("basicAuthPassWord") ?? "";
        if (basicAuthUserId.length > 0 && basicAuthPassWord.length > 0) {
            if (typeof headers === "undefined" || headers === null) {
                headers = {}
            }
            headers.Authorization = 'Basic ' + new Buffer(basicAuthUserId + ':' + basicAuthPassWord).toString('base64');
        }
        return headers;
    }
}