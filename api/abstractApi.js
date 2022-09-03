const axios = require('axios');

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
        try {
            response = await axios.post(uri, request, {headers: headers});
        } catch (e) {
            console.log(e)
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
        try {
            response = await axios.get(uri, {params: query, headers: headers});
        } catch (e) {
            console.log(e)
        }
        return response;
    }
}