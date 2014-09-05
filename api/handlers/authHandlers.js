var User = require('../core/models/user'),
    config = require('../core/appconfig'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    jwt = require('jwt-simple');

module.exports.token = function(req, res, next) {
    function sendAuthenticationError(){
        res.json(401, {
            message:'Authentication error'
        });
    }
    function authenticateUser(user){
        var expires = moment().add(7, 'days').unix();

        var token = jwt.encode({
                iss: user.id,
                exp: expires
            },
            config.get('auth:jwtSecret'));

        res.json({
            token : token,
            expires : expires
        });
    }

    if (!(req.headers.username && req.headers.password)) {
        sendAuthenticationError();
    } else {
        User.findOne({ username: req.headers.username }, function (err, user) {
            if((!user) || err){
                sendAuthenticationError();
            } else {
                user.verifyPassword(req.headers.password)
                    .then(function(isMatch){
                        if (isMatch) {
                            authenticateUser(user);
                        } else {
                            sendAuthenticationError();
                        }
                    },
                    function(err){
                        sendAuthenticationError();
                    });
            }
        });
    }
};