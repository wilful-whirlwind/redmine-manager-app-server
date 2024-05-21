var parser = require('url');
var fs = require('fs');
var handlers = {};

exports.get = (url, handler) => {
    handlers["GET/"+url] = handler;
}

exports.post = (url, handler) => {
    handlers["POST/"+url] = handler;
}

exports.route = (req) => {
    var url = parser.parse(req.url, true);
    var handler = handlers[req.method+"/"+url.pathname];
    if (!handler) handler = this.missing(req);
    return handler;
}

exports.missing = (req) => {
    var url = parser.parse(req.url, true);
    var path = __dirname + "/public" + url.pathname
    let mime;
    try {
        var data = fs.readFileSync(path);
        mime = req.headers.accepts || 'text/html'
        return (req, res) => {
            res.writeHead(200, {'Content-Type': mime});
            res.write(data);
            res.end();
        }
    } catch (e) {
        return (req, res) => {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("No route registerd for " + url.pathname);
            res.end();
        }
    }
}

exports.bodyParser = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve();
            return;
        }

        var data = '';
        req.on('data', (chunk) => {
            data += chunk.toString();
        })

        req.on('end', () => {
            try {
                req.body = JSON.parse(data);
            } catch (e) {
                req.body = {};
            }
            resolve();
        });

        req.on('error', (e) => {
            reject(e);
        });
    });
}