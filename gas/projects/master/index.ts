import {frontController} from "./src/FrontController";

export {}

declare global {
    function doPost(e: any): any;
    function doGet(e: any): any;
}

function createResponse(payload: string) {
    ContentService.createTextOutput()
    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(payload);
    return output;
}

global.doPost = (e: any) => {
    const body = JSON.parse(e.postData.getDataAsString());
    const res = frontController(body, 'post');
    return createResponse(JSON.stringify(res));
}

global.doGet = function(e: any) {
    const res = frontController(e.parameter, 'get');
    return createResponse(JSON.stringify(res));
}
