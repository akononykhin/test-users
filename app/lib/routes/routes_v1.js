const books = require('./../middleware/books-middleware');

module.exports = function(server) {

/*
    server.get('/',
        books.getBooks,
        (req, res, next) => {
            res.send({
                status: 200,
                data: res.data
            });
            // return next();
        });
*/

    server.get({path: '/v1', name: 'v1_root'}, function(req, res, next) {
        req.log.info('V1 test request');
        res.send({id: 1, name: 'v1_root'});
        return next();
    });

    server.get({path: '/v1/ttt', name: 'v1_ttt'}, function(req, res, next) {
        req.log.info('V1 ttt request');
        res.send();
        return next();
    });
};

