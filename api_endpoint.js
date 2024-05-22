const getRedmineTrackerListAction = require("./action/getRedmineTrackerListAction");
const getRedmineVersionListAction = require("./action/getRedmineVersionListAction");
// server.js
const http = require('http');
const router = require('./router'); // routerを読み込み

router.get('/trackers', async (req, res) => { // httpメソッドが「GET」、パスが「/」を登録
    res.writeHead(200,  {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Redmine-API-Key, X-CSRF-Token"
    });

    res.end(JSON.stringify(await getRedmineTrackerListAction(req, res)));
});
router.get('/versions', async (req, res) => { // httpメソッドが「GET」、パスが「/」を登録
    res.writeHead(200,  {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Redmine-API-Key, X-CSRF-Token"
    });
    const result = await getRedmineVersionListAction(req, res);
    res.end(JSON.stringify(result));
});


const server = http.createServer(async (req, res) => {
    await router.bodyParser(req); // POSTパラメータ対応
    const handler = router.route(req); // 登録済みの関数を取得(ルーティング)
    handler(req, res); // 関数の実行
});

// start server on port 8080
server.listen(8081);