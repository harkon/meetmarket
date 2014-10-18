/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    var options = {
      criteria: {
        'facebook.id': profile.id
      }
    };
    User.load(options, function(err, user) {
      if (err) return done(err);
      if (!user) {
        // user = new User({
        //   name: profile.displayName,
        //   email: profile.emails[0].value,
        //   username: profile.username,
        //   provider: 'facebook',
        //   facebook: profile._json
        // });
        // user.save(function(err) {
        //   if (err) console.log(err);
        //   return done(err, user);
        // });
        return done(err, null);
      } else {
        return done(err, user);
      }
    });
  }
);

// function(accessToken, refreshToken, profile, done) {
//   // asynchronous verification, for effect...
//   FB.api('/me/accounts', {
//     access_token: accessToken
//   }, function(res) {
//     if (!res || res.error) {
//       console.log(!res ? 'error occurred' : res.error);
//       return;
//     }
//   });

//   process.nextTick(function() {
//     return done(null, profile);
//   });

// }