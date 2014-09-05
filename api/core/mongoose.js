var mongoose = require('mongoose');
var config = require('./appconfig');
var log = require('winston');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});

db.once('open', function callback() {
    log.info("Connected to DB!");
});

var models = {};

var init = function (callback) {
    var staffModel = 'Staff';
    try {
        models[staffModel] = mongoose.model(staffModel, require('./models/staff').Scheme);
    }
    catch (e) {
        callback(e);
    }
    callback();
};

// TODO => thrown error is not properly handled in routeHandler
var model = function (modelName) {
    var name = modelName.toLowerCase();
    if (typeof models[name] == "undefined") {
        throw "Model '" + name + "' is not exist";
    }
    return models[name];
};

module.exports.init = init;
module.exports.model = model;