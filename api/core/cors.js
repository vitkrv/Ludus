
module.exports.setup = function (app) {
    app.all('*', function(req, res, next){
        if (!req.get('Origin')) return next();

        // todo move this to cfg or separate file in order to be configurable
        res.set('Access-Control-Allow-Origin', '*');

        res.set('Access-Control-Allow-Methods', 'PUT, DELETE');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, username, password');
        res.set('Access-Control-Allow-Max-Age', 3600);

        if ('OPTIONS' == req.method)
            return res.send(200);
        next();
    });
};