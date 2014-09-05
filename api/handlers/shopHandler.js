var mongoose = require('mongoose');

var db = require('../core/mongoose');
var routeErrors = require('./routeErrors');
var Staff = require('../core/models/staff');

var _ = require('underscore')._;

function omitPrivates(obj) {
    return _(obj).omit(_.filter(_(obj).keys(), function (x) {
        return x[0] == '_';
    }));
}

function listMapper(array) {
    return _.map(array, function (v) {
        var obj = v.toObject();
        return omitPrivates(obj);
    });
}

var handlers = {
    list: function (req, res, next) {
        var pageSize = req.query.page_size;
        var pageNum = req.query.page_num;

        if (typeof pageSize == 'undefined' && typeof pageNum == 'undefined') {
            Staff.find({}, function (err, data) {
                if (err) res.send(new routeErrors.InternalError(), 500);
                else {
                    Staff.count({}, function (err, count) {
                        if (err) res.send(new routeErrors.InternalError(), 500);
                        res.send({page_size: count, page_num: 1, staffs_all_count: count, staffs: listMapper(data)});
                    });
                }
            });
        }
        else if (typeof pageSize == 'undefined' && typeof pageNum != 'undefined') {
            res.send(new routeErrors.QueryValidationError(), 400);
        }
        else {
            if (typeof pageNum == 'undefined' && typeof pageSize != 'undefined') {
                pageNum = 1;
            }

            if (pageSize <= 0 ||
                pageNum <= 0 ||
                Math.round(pageSize) != pageSize || Math.round(pageNum) != pageNum) {
                res.send(new routeErrors.QueryValidationError(), 400);
            }
            else {
                Staff.find({}, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}, function (err, data) {
                    if (err) res.send(new routeErrors.InternalError(), 500);
                    else {
                        Staff.count({}, function (err, count) {
                            if (err) res.send(new routeErrors.InternalError(), 500);
                            res.send({page_size: pageSize, page_num: pageNum, staffs_all_count: count, staffs: listMapper(data)});
                        });
                    }
                });
            }
        }
    },
    get: function (req, res, next) {
        var id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        }
        catch (e) {
            res.send(new routeErrors.StaffNotFoundError(), 404);
            return next();
        }

        Staff.findOne({_id: id}, {__t: 0, __v: 0}, function (err, data) {
            if (err) return res.send(new routeErrors.InternalError(), 500);
            if (data) {
                res.send(omitPrivates(data.toObject()), 200);
            } else {
                res.send(new routeErrors.StaffNotFoundError(), 404);
            }
        });
    },
    create: function (req, res, next) {
       /* var highway = omitPrivates(req.body);

        Highway.create(highway, function (err, data) {
                if (err) {
                    switch (err.name) {
                        case 'ValidationError':
                            res.send(new routeErrors.QueryValidationError(err.errors), 400);
                            break;
                        case 'CastError':
                            res.send(new routeErrors.QueryValidationError('Cast error in \'' + err.path + '\', must be ' + err.type), 400);
                            break;
                        default :
                            res.send(new routeErrors.InternalError(), 500);
                    }
                }
                else {
                    res.send({id: data._id});
                }
            }
        );*/
    },
    update: function (req, res, next) {
       /* var id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        }
        catch (e) {
            res.send(new routeErrors.HighwayNotFoundError(), 404);
            return next();
        }

        Highway.findOne({_id: id}, function (err, data) {
            if (err) res.send(new routeErrors.InternalError(), 500);
            if (!data) res.send(new routeErrors.HighwayNotFoundError(), 404);
            else {
                (_.extend(data, omitPrivates(req.body))).save(function (err) {
                    if (err) {
                        switch (err.name) {
                            case 'ValidationError':
                                res.send(new routeErrors.QueryValidationError(), 400);
                                break;
                            case 'CastError':
                                res.send(new routeErrors.QueryValidationError('Cast error in \'' + err.path + '\', must be ' + err.type), 400);
                                break;
                            default:
                                res.send(new routeErrors.InternalError(), 500);
                        }
                    } else {
                        res.send(204);
                    }
                });
            }
        });*/
    },
    remove: function (req, res, next) {
       /* var id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        }
        catch (e) {
            res.send(new routeErrors.HighwayNotFoundError(), 404);
            return next();
        }

        Highway.remove({_id: id}, function (err, data) {
            if (err) return next(err);
            if (data)
                res.send(204);
            else
                res.send(new routeErrors.HighwayNotFoundError(), 404);
        });*/
    }
};

module.exports = handlers;