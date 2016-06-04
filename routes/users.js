var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var app = express();

router.get('/', function(req, res) {
  res.render('users/index', {user: req.user});
});

router.get('/register', function(req, res) {
  res.render('users/register', {});
});

router.post('/register', function(req, res, next) {
  Account.register(new Account({username: req.body.username}), req.body.password, function(err, account) {
    if (err) {
      return res.render('users/register', {error: err.message});
    }

    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});

router.get('/login', function(req, res) {
  res.render('users/login', {
    user: req.user,
    error: req.flash('error')
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true
}), function(req, res, next) {
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('users/profile', {user: req.user});
});

router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

module.exports = router;
