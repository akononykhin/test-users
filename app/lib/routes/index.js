module.exports = function(server) {
    require('./routes_v1')(server);

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

    server.get({path: '/', name: 'root'}, function(req, res, next) {
        req.log.info('test request');
        res.send();
        return next();
    });
*/
};
