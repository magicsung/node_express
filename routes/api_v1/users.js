var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;

var users = {
  zack: {
    username: 'zack',
    password: '1234',
    id: 1,
  },
  node: {
    username: 'node',
    password: '5678',
    id: 2,
  },
}

var localStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },
  function(username, password, done) {
    user = users[ username ];

    if ( user == null ) {
      return done( null, false, { message: 'Invalid user' } );
    };

    if ( user.password !== password ) {
      return done( null, false, { message: 'Invalid password' } );
    };

    done( null, user );
  }
)

Passport.use( 'local', localStrategy );

router.post('/login', Passport.authenticate( 'local', { session: false } ), function( req, res ) {
  res.send(
    {
      'message': 'success',
      'userID': req.user.id
    }
  );
});

module.exports = router;
