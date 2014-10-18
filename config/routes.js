/*
 * Module dependencies.
 */

var users = require('../app/controllers/users');
var shops = require('../app/controllers/shops');
var categories = require('../app/controllers/categories');
var products = require('../app/controllers/products');
var orders = require('../app/controllers/orders');
var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

var shopAuth = [auth.requiresLogin, auth.shop.hasAuthorization];
var categoryAuth = [auth.requiresLogin, auth.category.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function(app, passport) {

  // home route
  app.get('/', auth.requiresLogin, function(req, res) {

    if (req.user._shops.length === 1) {
      // go to shop page
      res.redirect('/shops/' + req.user._shops[0]);
    } else {
      // render user dashboard
      res.render('index', {
        user: req.user
      })
    }
  });

  // user routes
  app.param('userId', users.load);
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', auth.requiresLogin, users.show);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);

  // shop routes
  app.param('id', shops.load);
  app.get('/shops', auth.requiresLogin, shops.index);
  app.get('/shops/new', auth.requiresLogin, shops.new);
  app.post('/shops', auth.requiresLogin, shops.create);
  app.get('/shops/:id', shopAuth, shops.show);
  app.get('/shops/:id/edit', shopAuth, shops.edit);
  app.put('/shops/:id', shopAuth, shops.update);
  app.delete('/shops/:id', shopAuth, shops.destroy);

  // categories routes
  app.param('categoryId', categories.load);
  app.get('/categories', auth.requiresLogin, categories.index);
  app.get('/categories/new', auth.requiresLogin, categories.new);
  app.post('/categories', auth.requiresLogin, categories.create);
  app.get('/categories/:categoryId', auth.requiresLogin, categories.show);
  app.delete('/categories/:categoryId', categoryAuth, categories.destroy);

  // products routes
  app.param('productId', products.load);
  app.get('/products', auth.requiresLogin, products.index);
  app.get('/products/new', auth.requiresLogin, products.new);
  app.post('/products', auth.requiresLogin, products.create);
  app.get('/products/:productId', auth.requiresLogin, products.show);
  // tag routes
  // app.get('/tags/:tag', tags.index);


  /**
   * Error handling
   */

  app.use(function(err, req, res, next) {
    // treat as 404
    if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}