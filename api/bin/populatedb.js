var q = require('q'),
    mongoose = require('mongoose'),
    Staff = require('../core/models/staff'),
    config = require('../core/appconfig');
require('colors');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Failed to connect to database!'.red));

function createSampleStaff() {
    var def = q.defer(),
        staff = ({
            name: 'Tidehunter',
            description: 'Арбузик: "Кункевиииииич!!!"',
            avatar: 'http://localhost:3000/img/tidehunter1.jpg',
            available: true,
            price: 112,
            towns: ["Харьков"],
            photos: ['Фото арбузика1', 'Фото арбузика2']
        }),
        staff2 = ({
            name: 'Tidehunter',
            description: 'Арбузик: "Кункевиииииич!!!"',
            avatar: 'http://localhost:3000/img/tidehunter2.jpg',
            available: false,
            price: 112,
            towns: ["Харьков"],
            photos: ['Фото арбузика1', 'Фото арбузика2']
        });

    Staff.create(staff, function (err, data) {
        if (err) def.reject(err);
        else
            Staff.create(staff2, function (err, data) {
                if (err) def.reject(err); else def.resolve(data);
            });

    });
    return def.promise;
}

db.once('open', function () {
    createSampleStaff().then(function () {
        console.log("Finished!");
        process.exit();
    });
});
