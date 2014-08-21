var domain = require('domain'),
    express = require('express');

var routes = require('./core/mainRoutes'),
    cors = require('./core/cors');

function setupHttpDefaultMiddleware(app) {
    var path = require('path');
    var favicon = require('static-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../app/dist')));
}

function setup404Handler(app) {
/// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
}
/// error handlers
function setupErrorHandlers(app) {
    app.use(function (req, res, next) {
        var reqDomain = domain.create();
        reqDomain.add(req);
        reqDomain.add(res);

        res.on('close', function () {
            reqDomain.dispose();
        });
        reqDomain.on('error', function (err) {
            next(err);
        });
        reqDomain.run(next);
    });

    app.use(function (err, req, res, next) {
        var error = (app.get('env') === 'development') ? err : {};

        res.status(err.status || 500);
        res.json(404, {
            message: err.message,
            error: error
        });
    });
}

function appBuilder() {
    var app = express();

    function _with(fn) {
        return function () {
            fn(app);
            return this;
        };
    }

    return {
        instance: app,
        withDefaultHttpMiddleware: _with(setupHttpDefaultMiddleware),
        withCors: _with(cors.setup),
        withAppRoutes: _with(routes.setup),
        with404Handler: _with(setup404Handler),
        withErrorHandlers: _with(setupErrorHandlers)
    };
}


module.exports = appBuilder;

module.exports.defaultSetup = function () {
    return appBuilder()
        .withDefaultHttpMiddleware()
        .withCors()
        .withAppRoutes()
        .with404Handler()
        .withErrorHandlers()
        .instance
        ;
};
