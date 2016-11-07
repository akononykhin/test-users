const restify = require('restify');
const users = require('./../middleware/users-middleware');

module.exports = function(server) {
    server.get('/v1/users/:id', function(req, res, next) {
        users.findById(req.params.id)
        .then(function(user) {
            req.log.info("User fetched. id="+user.id);
            res.send({
                data: user
            });
        })
        .catch(function(error) {
            return next(new restify.ResourceNotFoundError(""));
        });
    });
};

