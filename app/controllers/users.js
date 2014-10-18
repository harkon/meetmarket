/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

/**
 * Load
 */

exports.load = function(req, res, next, id) {
  var options = {
    criteria: {
      _id: id
    }
  };
  User.load(options, function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

/**
 * Create user
 */

exports.create = function(req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      return res.render('users/signup', {
        error: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      });
    }
    console.log("User created", user)
    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/users/' + user._id);
    });
  });
};

/**
 *  Show profile
 */

exports.show = function(req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.fullname,
    user: user
  });
};

/**
 * Login
 */

var login = function(req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/users/' + req.user.id;
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

exports.signin = function(req, res) {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function(req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  });
};

/**
 * Show sign up form
 */

exports.signup = function(req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;