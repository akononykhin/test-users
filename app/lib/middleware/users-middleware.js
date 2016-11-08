const User = require('./../models/user');
const redisClient = require('./../cache');

// Logging ====================
const bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'Users:Server:Middleware:Users'});


const redisIdKeyPrefix = 'users:id:';
const redisEmailKeyPrefix = 'users:email:';


// Contents ===================
module.exports = {
    findById,
    findByEmail,
    fetchAll
};

function findById(id) {
    return new Promise(function(resolve, reject) {
        redisClient.get(redisIdKeyPrefix + id, function(err, reply) {
            if(reply) {
                resolve(new User(JSON.parse(reply)));
            }
            else {
                new User({id: id}).fetch({require: false})
                .then(function(model) {
                    if(model) {
                        redisClient.set(redisIdKeyPrefix + id, JSON.stringify(model));
                        redisClient.set(redisEmailKeyPrefix + model.email, model.id);
                    
                        resolve(model);
                    }
                    else {
                        reject("NotFound");
                    }
                });
            }
        });
    });
};

function findByEmail(email) {
    return new Promise(function(resolve, reject) {
        redisClient.get(redisEmailKeyPrefix + email, function(err, reply) {
            if(reply) {
                User.findById(reply)
                .then(function(model) {
                    resolve(model);
                });
            }
            else {
                new User({email: email}).fetch({require: false})
                .then(function(model) {
                    if(model) {
                        redisClient.set(redisIdKeyPrefix + id, JSON.stringify(model));
                        redisClient.set(redisEmailKeyPrefix + model.email, model.id);
                    
                        resolve(model);
                    }
                    else {
                        reject("NotFound");
                    }
                });
            }
        });
    });
};



function fetchAll(req) {
    return new Promise(function(resolve, reject) {
        log.info("fetchAll started");
        var model = new User();
        if(req.params.email) {
            model = model.where({email: req.params.email});
        }
        if(req.params.sort) {
            var sorts = req.params.sort.split(',');
            sorts.forEach(function(sort) {
                model = model.orderBy(sort);
            });
        }
        var page = parseInt(req.params.page, 10);
        var perPage = parseInt(req.params.per_page, 10);
        if(!page || 1 > page) {
            page = 1;
        }
        if(!perPage || 100 < perPage) {
            perPage = 50;
        }

        log.info("Before DB request");
        model.fetchPage({page: page, pageSize: perPage}).then(function(results) {
            resolve(results);
        })
        .catch(function(error) {
            log.error("Error DB: " + error);
            reject(error);
        });
/*
    User.query().fetchPage({oageSize:10,page:2}).then((users) => {
        resolve(users);
    });
*/
    });
};
