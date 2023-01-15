
export class AbstractApi {

    /**
     * execute get api
     * @param uri
     * @param headers
     * @param query
     * @return {Promise<any>}
     */
    static async callGetApi(uri: string, headers: any, query:any = null): Promise<any> {
        let response = null;
        // headers = this.setBasicAuth(headers);
        let convertedUri = uri;
        if (query !== null && typeof query === "object") {
            convertedUri += "?";
            let convertedUriArr = [];
            for (let key in query) {
                convertedUriArr.push(key + "=" + query[key]);
            }
            convertedUri += convertedUriArr.join("&");
        }
        try {
            response = UrlFetchApp.fetch(convertedUri).getContentText();
            console.log(response);
            if (response.length > 0) {
                return JSON.stringify(response);
            } else {
                return "";
            }
        } catch (e) {
            console.log(e)
        }
    }

    static setBasicAuth(headers: any, basicAuthUserId: string, basicAuthPassWord: string)
    {
        if (basicAuthUserId.length > 0 && basicAuthPassWord.length > 0) {
            if (typeof headers === "undefined" || headers === null) {
                headers = {}
            }
            headers.Authorization = 'Basic ' + new Buffer(basicAuthUserId + ':' + basicAuthPassWord).toString('base64');
        }
        return headers;
    }
}