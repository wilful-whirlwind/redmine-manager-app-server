const getRedmineTrackerListAction = require("./action/getRedmineTrackerListAction");
// server.js
const http = require('http');
const router = require('./router'); // routerを読み込み

router.get('/', (req, res) => { // httpメソッドが「GET」、パスが「/」を登録
    res.writeHead(200,  {'Content-Type': 'application/json'});
    res.end(JSON.stringify(getRedmineTrackerListAction(req, res)));
});

const server = http.createServer(async (req, res) => {
    await router.bodyParser(req); // POSTパラメータ対応
    const handler = router.route(req); // 登録済みの関数を取得(ルーティング)
    handler(req, res); // 関数の実行
});

// start server on port 8080
server.listen(8081);