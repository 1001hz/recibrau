//app/models/user.js
var TOKEN_EXPIRY = 3600000; //miliseconds -> 60 mins
var SECRET = "cuxtisq";

var crypto = require('crypto');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    account: { type: String, required: true, default: 'user' },
    token: { type: String },
    lastLogin: { type: String }
});

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    //if (!user.isModified('password')) return next();

    //var hash = crypto.createHash('sha256').update(user.password).digest('hex');

    //user.password = hash;
    next();
});

UserSchema.methods.validateToken = function (candidateToken, cb) {
    try {
        var d = new Date();
        var now = d.getTime();

        if (candidateToken != this.token) {
            cb(null, false, "Invalid authentication token.");

        }
        else if ((parseInt(this.lastLogin) + parseInt(TOKEN_EXPIRY)) < now) {
            cb(null, false, "Authentication token has expired.");
        }
        else {
            cb(null, true, "Token is valid.");
        }
    }
    catch (e) {
        cb(e.message, null, null)
    }
};

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    try{
        var candidatePasswordHash = crypto.createHash('sha256').update(candidatePassword).digest('hex');
        if (candidatePasswordHash == this.password) {
            cb(null, true);
        }
        else {
            cb(null, false)
        }
    }
    catch (e) {
        cb(e.message, null)
    }
};


UserSchema.methods.setToken = function (cb) {
    try {
        
        //Set token
        var d = new Date();
        var now = d.getTime();
        this.token = crypto.createHash('sha256').update(this.username + SECRET + now).digest('hex');
        this.lastLogin = now;

        cb(null);
    }
    catch (e) {
        cb(e.message)
    }
};


module.exports = mongoose.model('User', UserSchema);