var fs = require('fs-extra');
var path = require('path');
var crypto = require('crypto');

var routeErrors = require('./routeErrors');

var _ = require('underscore')._;

var handlers = {
    create: function (req, res, next) {
        if (req.files) {
            if (req.files.file.size === 0) {
                return  res.send(new Error("Hey, first would you select a file?"));
            }
            fs.exists(req.files.file.path, function (exists) {
                if (exists) {
                    res.send({name: req.files.file.name }, 200);
                } else {
                    res.send({error: "Well, there is no magic for those who don’t believe in it!"});
                }
            });
        }
    },
    delete: function (req, res, next) {
        var name;
        try {
            name = req.headers.filename;
        }
        catch (e) {
            return res.send({error: 'doesn\'t contain "name" field'}, 404);
        }
        console.log("name = " +name);
        fs.unlink('../api/dist/img/uploads/' + name, function (err) {
            if (!err) {
                res.send(200);
            } else {
                res.send(500);
            }
        });
    }
};

module.exports = handlers;