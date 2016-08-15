'use strict';

const mongoose = require('mongoose');
const co = require('co');
const Post = require('../models/account');
const Account = require('../models/account');
const config = require('../config/index');
const jwt = require('jsonwebtoken');
const assign = Object.assign;
const multer = require('multer');

exports.register = function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({success: false, message: 'Please enter email and password.'});
  } else {
    var newUser = new Account({email: req.body.email, password: req.body.password, username: req.body.username});

    newUser.save(function(err) {
      if (err) {
        return res.status(400).json({success: false, message: 'That email address already exists.'});
      }
      res.status(201).json({success: true, message: 'Successfully created new user.'});
    });
  }
};

exports.login = function(req, res) {
  Account.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err)
      throw err;

    if (!user) {
      res.status(401).send({success: false, message: 'Authentication failed. User not found.'});
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign({
            id: user._id
          }, config.secret, {expiresIn: '3 day'});
          res.status(200).json({
            success: true,
            token: 'JWT ' + token,
            email: user.email,
            username: user.username,
            avatar: user.avatar
          });
        } else {
          res.status(401).send({success: false, message: 'Authentication failed. Passwords did not match.'});
        }
      });
    }
  });
};

exports.refreshToken = function(req, res) {
  var token = jwt.sign({
    id: req.user._id
  }, config.secret, {expiresIn: '3 day'});
  res.status(201).json({
    success: true,
    token: 'JWT ' + token,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar
  });
};

exports.profile = function(req, res) {
  res.status(200).json({
    user_id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    profile: req.user.profile
  });
}

exports.updateProfile = function(req, res) {
  Account.findOneAndUpdate({_id: req.user._id}, {
    username: req.body.username,
    password: req.body.password,
    profile: {
      description: req.body.description,
      mobile: req.body.mobile
    }
  },function (err, account) {
    if (err)
      throw err;

    res.status(200).json({success: true, message: 'Successfully update profile.'});
  });
}
