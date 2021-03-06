'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var Account = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'http://dummyimage.com/100x100/cccccc/fff&text=avatar'
  },
  avatarUpload: {
    type: String
  },
  role: {
    type: String,
    enum: [
      'User', 'Manager', 'Admin'
    ],
    default: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  profile: {
    description: { type: String, default: ''},
    mobile: { type: String, default: ''}
  }
});

// Saves the user's password hashed (plain text password storage is not good)
Account.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

Account.pre('findOneAndUpdate', function(next) {
  var user = this;
  if (user._update.password) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user._update.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user._update.password = hash;
        next();
      });
    });
  } else {
    delete user._update.password
    return next();
  }
});

// Create method to compare password input to password saved in database
Account.methods = {

  comparePassword: function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  },

};

module.exports = mongoose.model('Account', Account);
