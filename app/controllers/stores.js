/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Store = mongoose.model('Store')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function(req, res, next, id) {

  Store.load(id, function(err, store) {
    if (err) return next(err);
    if (!store) return next(new Error('not found'));
    if (req.session.storeId) delete req.session.storeId;
    req.session.storeId = store.id;
    req.store = store;
    next();
  });
};

/**
 * List
 */

exports.index = function(req, res) {
  // console.dir(req.params)
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page,
    criteria: {
      _user: req.user._id
    }
  };

  Store.list(options, function(err, stores) {
    if (err) return res.render('500');
    Store.count().exec(function(err, count) {
      res.render('stores/index', {
        title: 'Stores',
        user: req.user,
        stores: stores,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New shop
 */

exports.new = function(req, res) {
  res.render('stores/new', {
    title: 'New Store',
    store: new Store({})
  });
};

/**
 * Create a shop
 */

exports.create = function(req, res) {
  
  var store = new Store(req.body);
  var user = req.user;

  store._user = user._id;
  store.save(function(err) {
    if (err) {
      return res.render('500', {
        error: utils.errors(err.errors),
        title: 'Stores'
      });
    }
    
    user._stores.push(store);
    user.save();
    console.log("New Store", store)
    req.flash('success', 'Successfully created store!');
    return res.redirect('/stores/' + store._id);
  });
};

/**
 * Edit shop
 */

exports.edit = function(req, res) {
  res.render('stores/edit', {
    title: 'Edit ' + req.store.name,
    store: req.store
  });
};

/**
 * Update shop
 */

exports.update = function(req, res) {
  var store = req.store;
  store = extend(store, req.body);

  store.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/stores/' + store._id);
    }

    res.render('stores/edit', {
      title: 'Edit Store',
      store: store,
      error: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show shop
 */

exports.show = function(req, res) {
  res.render('stores/show', {
    title: req.store.name,
    user: req.user,
    store: req.store
  });
};

/**
 * Delete a shop
 */

exports.destroy = function(req, res) {
  var store = req.store;
  store.remove(function(err) {
    req.flash('info', 'Deleted successfully');
    res.redirect('/stores');
  });
};