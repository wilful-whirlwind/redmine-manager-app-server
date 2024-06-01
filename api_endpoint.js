const getRedmineTrackerListAction = require("./action/getRedmineTrackerListAction");
const getRedmineVersionListAction = require("./action/getRedmineVersionListAction");
const authAction = require("./action/authAction");
const loadConfigAction = require("./action/loadConfigAction");
const saveConfigAction = require("./action/saveConfigAction");

// server.js
const http = require('http');
const router = require('./router'); // routerを読み込み

const defaultHeader = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-CSRF-Token"
};

router.get('/trackers', async (req, res) => { // httpメソッドが「GET」、パスが「/」を登録
    res.writeHead(200,  defaultHeader);

    res.end(JSON.stringify(await getRedmineTrackerListAction(req, res)));
});
router.get('/versions', async (req, res) => { // httpメソッドが「GET」、パスが「/」を登録
    res.writeHead(200,  defaultHeader);
    const result = await getRedmineVersionListAction(req, res);
    res.end(JSON.stringify(result));
});

router.post('/auth', async (req, res) => { // httpメソッドが「POST」、パスが「/」を登録
    res.writeHead(200,  defaultHeader);
    const result = await authAction(req, req.body);
    res.end(JSON.stringify(result));
});

router.get('/config', async (req, res) => { // httpメソッドが「POST」、パスが「/」を登録
    res.writeHead(200,  defaultHeader);
    const result = await loadConfigAction(req, res);
    res.end(JSON.stringify(result));
});

router.post('/config', async (req, res) => { // httpメソッドが「POST」、パスが「/」を登録
    res.writeHead(200,  defaultHeader);
    const result = await saveConfigAction(req, req.body);
    res.end(JSON.stringify(result));
});


const server = http.createServer(async (req, res) => {
    await router.bodyParser(req); // POSTパラメータ対応
    const handler = router.route(req); // 登録済みの関数を取得(ルーティング)
    handler(req, res); // 関数の実行
});

// start server on port 8080
server.listen(8081);