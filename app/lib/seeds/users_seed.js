var uuid = require('uuid');
var moment = require('moment');
var crypto = require('crypto');

exports.seed = function(knex, Promise) {
    var userPromises = [];
    for(var i = 1; i <= 25; i++){
        var user= {
            id: 'US-' + uuid.v4(),
            status: 'active',
            first_name: 'Name_' + i,
            last_name: 'Surname_' + i,
            email: 'user' + i + '@test.com', 
            password: 'my_password_' + i,
            created_at: moment().utc().format('YYYY-MM-DD HH:mm:ss')
        };
        if(i%5) {
            user.status = 'disabled';
            user.deleted_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
        }
        userPromises.push(createUser(knex, user));
    }

    return Promise.all(userPromises);
};

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(10).toString('base64');

        crypto.pbkdf2(password, salt, 100, 60, 'sha512', (err, key) => {
            if (err) reject(err);

            // function:algorithm:iterations:salt:key(hex)
            const hashedPassword = `PBKDF2:sha512:100:${salt}:${key.toString('hex')}`;
            resolve(hashedPassword);
        });
    });
};

function createUser(knex, user) {
    return hashPassword(user.password)
    .then(function(hashedPassword){
        user.password = hashedPassword;
        return knex('users')
            .insert(user);
    });
};