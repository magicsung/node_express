'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Account = require('../../models/account');
const config = require('../../config/index');

const requireAuth = passport.authenticate('jwt', {session: false});

app.use(passport.initialize());

require('../../config/passport')(passport);

router.post('/register', function(req, res) {
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
});

router.post('/login', function(req, res) {
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
});

router.get('/refresh_token', requireAuth, function(req, res) {
  var token = jwt.sign({
    id: req.user._id
  }, config.secret, {expiresIn: '1 day'});
  res.status(201).json({
    success: true,
    newToken: 'JWT ' + token
  });
});

router.get('/dashboard', requireAuth, function(req, res) {
  res.status(200).json({'user_id': req.user._id, 'email': req.user.email});
});

router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

module.exports = router;
