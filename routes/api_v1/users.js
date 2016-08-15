'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const Account = require('../../models/account');
const users = require('../../controller/user');
const requireAuth = passport.authenticate('jwt', {session: false});

app.use(passport.initialize());

require('../../config/passport')(passport);

router.post('/register', users.register);
router.post('/login', users.login);
router.post('/refresh_token', requireAuth, users.refreshToken);
router.get('/profile', requireAuth, users.profile);
router.put('/profile', requireAuth, users.updateProfile);
router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

module.exports = router;
