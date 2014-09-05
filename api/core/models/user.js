var bcrypt = require('bcrypt'),
    q = require('q'),
    mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false }
}, { collection: 'users'});

userSchema.methods.setPassword = function (pwd) {
    var def = q.defer(),
        self = this;

    bcrypt.genSalt(function (err, salt) {
        if (err) {
            def.reject(err);
        }

        bcrypt.hash(pwd, salt, function (err, hash) {
            self.passwordHash = hash;
            def.resolve();
        });
    });
    return def.promise;
};
userSchema.methods.verifyPassword = function (pwd) {
    var def = q.defer(), self = this;

    bcrypt.compare(pwd, self.passwordHash, function (err, res) {
        if (err) {
            def.reject(err);
        }
        def.resolve(res);
    });
    return def.promise;
};

module.exports = mongoose.model("User", userSchema);

