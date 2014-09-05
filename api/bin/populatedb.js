var userInfo = {
    username : "admin",
    email : "vitkrv@gmail.com",
    password : "1q2w3e"
};

var q = require('q'),
    mongoose = require('mongoose'),
    User = require('../core/models/user'),
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

function createUser(username,pwd, email){
    var def = q.defer(),
        user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(pwd)
        .then(function(){
            user.save(function (err) {
                err && def.reject(err);
                def.resolve(user);
            });
        }, function(err){
            def.reject(err);
        });
    return def.promise;
}

function findUser(username){
    var def = q.defer();

    User.findOne({ username: username }, function (err, user) {
        if(err) def.reject(err);
        else def.resolve(user);
    });

    return def.promise;
}

db.once('open', function () {
    findUser(userInfo.username)
        .then(function (user) {
            if(!!user){
                console.log(('Database is already populated with sample data').green);
            } else {
                return createUser(userInfo.username, userInfo.password, userInfo.email)
                    .then(function(){ return createSampleStaff(); })
                    .then(function(){
                        console.log(('User ' + JSON.stringify(userInfo) + ' and sample staffs were created.').green);
                    }, function(err){
                        console.log('Could not save user or staffs.'.red, err);
                    });
            }
        })
        .then(function(){
            process.exit();
        });
});
