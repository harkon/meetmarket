/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var compression = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var expHbs = require('express-handlebars');
var serveStatic = require('serve-static');

var mongoStore = require('connect-mongostore')(session);
var flash = require('connect-flash');
var winston = require('winston');
var config = require('./config');

var multer = require('multer');
// var pkg = require('../package.json');
var handlebarsHelpers = require('../lib/handlebarsHelpers');
var path = require('path');
var env = process.env.NODE_ENV || 'development';

var inspect = require('util').inspect;

/**
 * Expose
 */

module.exports = function(app, passport) {

  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512
  }));

  // Static files middleware
  var root = path.normalize(__dirname + '/..')
  app.use(serveStatic(root + '/public'));

  // Use winston on production
  var log;
  if (env !== 'development') {
    log = {
      stream: {
        write: function(message, encoding) {
          winston.info(message);
        }
      }
    };
  } else {
    log = {
      format: 'dev'
    };
  }
  // Logging middleware
  if (env !== 'test') app.use(morgan("dev", log));

  var hbs = expHbs.create({
    extname: 'hbs',
    defaultLayout: 'default.hbs',
    layoutsDir: 'app/views/layouts/',
    partialsDir: [
      'app/views/partials/'
    ]
  });

  hbs.helpers = handlebarsHelpers(hbs);

  app.engine('hbs', hbs.engine);

  app.set('views', 'app/views');

  app.set('view engine', 'hbs');

  app.enable('view cache');

  // expose package.json to views
  app.use(function(req, res, next) {
    // res.locals.pkg = pkg;
    res.locals.env = env;
    // res.locals.success = req.flash('success');
    // res.locals.error = req.flash('error');
    next();
  });
  // cookieParser should be above session
  app.use(cookieParser());

  // bodyParser should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  // methodOverride should be above csurf
  app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // express/mongo session storage
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    maxAge: null,
    store: new mongoStore({
      db: 'meetmarket',
      collection: 'sessions',
      host: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
      port: process.env.OPENSHIFT_MONGODB_DB_PORT || '27017',
      username: process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'admin',
      password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'admin12345',
      expireAfter: 60 * 60 * 1000 // one hour
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  app.use(flash());
  
    // expose package.json to views
  // app.use(function(req, res, next) {
  //   // res.locals.pkg = pkg;
  //   // res.locals.env = env;
  //   res.locals.success = req.flash('success');
  //   res.locals.error = req.flash('error');
  //   next();
  // });

  app.use(multer({
    inMemory: true,
    onParseStart: function() {
      console.log('Form parsing started at: ', new Date())
    },
    onParseEnd: function(req, next) {
      // usage example: custom body parse
      req.body = require('qs').parse(req.body);
      req.files = require('qs').parse(req.files);
      // call the next middleware
      console.log('Form parsing completed at: ', new Date());
      next();
    },
    onError: function(error, next) {
      console.log(error)
      next(error)
    }
  }));

  // adds CSRF support
  if (process.env.NODE_ENV !== 'test') {

    app.use(csrf());
    // This could be moved to view-helpers :-)
    app.use(function(req, res, next) {
      if (req.method === 'GET') {
        res.locals.csrf_token = req.csrfToken();
      }
      next();
    });

  }
};

/**
 *
 *  Input name in programatically readable keys
 *
 *  "foo"              => ['foo']
 *  "[foo]"            => ['foo']
 *  "foo[inn[bar]]"    => ['foo', 'inn', 'bar']
 *  "foo[inn[bar[a]]]" => ['foo', 'inn', 'bar', 'a']
 *  "[arr][idx]"       => ['arr', val']
 *
 **/

// safe check for undefined values
function isUndefined(obj) {
  return obj === void 0;
}
// 1,2,3,4 ... are valid array indexes
function isValidArrayIndex(val) {
  return /^[0-9]+$/.test(String(val));
}

function deepSet(o, keys, value) {
  var key, nextKey, tail, lastIdx, lastVal, f;

  if (isUndefined(o)) {
    throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined");
  }
  if (!keys || keys.length === 0) {
    throw new Error("ArgumentError: param 'keys' expected to be an array with least one element");
  }

  key = keys[0];

  if (keys.length === 1) {
    o[key] = value;
  } else {
    nextKey = keys[1];
    if (isUndefined(o[key])) {
      if (isValidArrayIndex(nextKey)) {
        o[key] = [];
      } else {
        o[key] = {};
      }
    }

    tail = keys.slice(1);
    deepSet(o[key], tail, value);
  }

}