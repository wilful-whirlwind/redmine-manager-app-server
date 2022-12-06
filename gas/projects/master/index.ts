import {frontController} from "./src/FrontController";

export {}

declare global {
    function doPost(): any;
    function doGet(e: any): any;
}

function createResponse(payload: string) {
    ContentService.createTextOutput()
    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(payload);
    return output;
}

global.doPost = () => {
    return createResponse(JSON.stringify({"type": "post"}));
}

global.doGet = function(e: any) {
    const res = frontController(e.parameter, 'get');
    return createResponse(JSON.stringify(res));
}
