const restify = require('restify');
const users = require('./../middleware/users-middleware');

module.exports = function(server) {
    server.get('/v1/users', function(req, res, next) {
        users.fetchAll(req)
        .then(function(results) {
            res.send({
                data: results
            });
        })
        .catch(function(error) {
            return next(new restify.InternalError(error));
        });
    });

    server.get('/v1/users/:id', function(req, res, next) {
        users.findById(req.params.id)
        .then(function(user) {
            res.send({
                data: user
            });
        })
        .catch(function(error) {
            return next(new restify.ResourceNotFoundError(error));
        });
    });
};

