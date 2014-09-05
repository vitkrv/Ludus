require('mongoose-schema-extend');
var mongoose = require('mongoose');

var Staff = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: false },
    avatar: { type: String, required: false },
    available: { type: Boolean, required: false },
    towns: {type: [String], required: true},
    photos: {type: [String], required: true}
}, { toObject: { virtuals: true }, toJSON: { virtuals: true }, collection: 'staffs'});


module.exports = mongoose.model("Staff", Staff);
