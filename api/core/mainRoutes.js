var _ = require('underscore'),
    express = require('express'),
    auth = require('./auth'),
//   authHandlers = require('../handlers/authHandlers'),
    shopHandlers = require('../handlers/shopHandler');


module.exports.setup = function (app) {
    app.use('/v1/', withRouter(function (v1) {
        v1.use('/shop', withRouter(function (r) {
            r.get('/', shopHandlers.list);
            r.get('/:id', shopHandlers.get);
        }));
        // todo with auth
       /* v1.use('/shop', withRouter(auth.requireAuth, function (r) {
            r.post('/', shopHandlers.create);
            r.put('/:id', shopHandlers.update);
            r.delete('/:id', shopHandlers.remove);
        }));*/
    }));
};

function withRouter() {
    var args = Array.prototype.slice.call(arguments, 0),
        f = _.last(args);
    var middleware = Array.prototype.slice.call(
        arguments, 0, arguments.length - 1);

    var r = express.Router();

    _.each(middleware, function (el) {
        r.use(el);
    });

    f(r);
    return r;
}


