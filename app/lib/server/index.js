const restify = require('restify');
const bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'Users:Server'});

const serverConfig = {
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    log: log,
    formatters: {
        'application/json': customFormatJSON,
        'application/javascript': customFormatJSONP,
        'application/jsonp': customFormatJSONP
    }
};

module.exports = createServer;

function createServer() {
    const server = restify.createServer(serverConfig);

    server
        .on('error', onError)
        .on('listening', onListening)
        .use(restify.queryParser())
        .use(restify.bodyParser())
        .use(restify.jsonp())
        .use(restify.acceptParser(server.acceptable))
        .use(restify.fullResponse())
        .use(restify.CORS({
            credentials: true,
            headers: ['Authorization', 'X-Authorization', 'Origin', 'Accept', 'Content-Type', 'X-Requested-With', 'X-HTTP-Method-Override']
        }))
        .use(restify.requestLogger())
        .pre(restify.pre.userAgentConnection())
        .listen(process.env.PORT);


    return server;
}

// -------------------------------------

function onError(err) {
    log.error(err);

    throw new Error(err);
}

function onListening() {
    log.info(`Listening on port ${process.env.PORT}`);
}

function customFormatJSON(req, res, body, cb) {
    if (body instanceof Error) {
        // snoop for RestError or HttpError, but don't rely on
        // instanceof
        res.statusCode = body.statusCode || 500;

        if (body.body) {
            body = body.body;
        } else {
            body = {
                message: body.message
            };
        }
    } else if (Buffer.isBuffer(body)) {
        body = body.toString('base64');
    }

    var envelopedBody = {
        status: res.statusCode,
        data: body
    };

    var data = JSON.stringify(envelopedBody);
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return cb(null, data);
}

function customFormatJSONP(req, res, body, cb) {
    if (!body) {
        res.setHeader('Content-Length', 0);
        return (null);
    }

    if (body instanceof Error) {
        if ((body.restCode || body.httpCode) && body.body) {
            body = body.body;
        } else {
            body = {
                message: body.message
            };
        }
    }

    if (Buffer.isBuffer(body)) {
        body = body.toString('base64');
    }


    var envelopedBody = {
        status: res.statusCode,
        data: body
    };

    var _cb = req.query.callback || req.query.jsonp;
    var data;

    if (_cb) {
        data = 'typeof ' + _cb + ' === \'function\' && ' +
                _cb + '(' + JSON.stringify(envelopedBody) + ');';
    } else {
        data = JSON.stringify(envelopedBody);
    }

    res.setHeader('Content-Length', Buffer.byteLength(data));
    return cb(null, data);
}
