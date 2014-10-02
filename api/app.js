var domain = require('domain'),
    express = require('express'),
    winston = require('winston');

var routes = require('./core/mainRoutes'),
    auth = require('./core/auth'),
    cors = require('./core/cors'),
    db = require('./core/mongoose');

function setupHttpDefaultMiddleware(app) {
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var multer = require('multer');

    app.use(favicon(__dirname + '/dist/img/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(multer({
        dest: './dist/img/uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        }
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '/dist')));
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
function initDatabase(app){
    db.init(function (err) {
        if(!err) { winston.info('Models are loaded!'); }
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
        withAppAuth: _with(auth.setup),
        withAppRoutes: _with(routes.setup),
        with404Handler: _with(setup404Handler),
        withErrorHandlers: _with(setupErrorHandlers),
        withInitDatabase: _with(initDatabase)
    };
}


module.exports = appBuilder;

module.exports.defaultSetup = function () {
    return appBuilder()
        .withDefaultHttpMiddleware()
        .withCors()
        .withAppAuth()
        .withAppRoutes()
        .with404Handler()
        .withErrorHandlers()
        .withInitDatabase()
        .instance
        ;
};
