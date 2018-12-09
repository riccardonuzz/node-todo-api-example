const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// called whenever the user saves:
// if a user's password is modified, then re-hash it!
UserSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// this method set up
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return { _id: userObject._id, email: userObject.email };
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123', {expiresIn: 60*60*24*30}).toString();
    user.tokens = user.tokens.concat([{access, token}]);
    
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    let user = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
        //console.log(decoded);
    } catch(e) {
        return Promise.reject(e); //uguale al precedente
    }

    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;

    return User.findOne({ email }).then(user => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to comparre password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};


let User = mongoose.model('User', UserSchema);
module.exports = { User };
