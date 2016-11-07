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
    findByEmail
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


