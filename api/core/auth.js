var User = require('./models/user'),
    url = require('url'),
    config = require('./appconfig'),
    moment = require('moment'),
    jwt = require('jwt-simple');

function parseToken(req, res, next) {
    var parsed_url = url.parse(req.url, true);
    var token =
        (req.body && req.body.authToken) ||
        parsed_url.query.authToken;

    if (!token) {
        next();
    } else {
        try {
            var decoded = jwt.decode(token, config.get('auth:jwtSecret'));
            if (decoded.exp <= moment().unix()) {
                res.json(400, {
                    message: 'Access token has expired'
                });
            }

            User.findOne({ '_id': decoded.iss }, function (err, user) {
                if (!err) {
                    req.user = user;
                    return next();
                }
            });
        } catch (err) {
            return next();
        }
    }
}

module.exports.setup = function (app) {
    app.use(parseToken);
};

module.exports.requireAuth = function (req, res, next) {
    if (!req.user) {
        res.json(401, {
            message: 'Not authorized'
        });
    } else {
        next();
    }
};
