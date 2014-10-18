/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Shop = mongoose.model('Shop')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function(req, res, next, id) {

  Shop.load(id, function(err, shop) {
    if (err) return next(err);
    if (!shop) return next(new Error('not found'));
    if (req.session.shopId) delete req.session.shopId;
    req.session.shopId = shop.id;
    req.shop = shop;
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

  Shop.list(options, function(err, shops) {
    if (err) return res.render('500');
    Shop.count().exec(function(err, count) {
      res.render('shops/index', {
        title: 'Shops',
        user: req.user,
        shops: shops,
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
  res.render('shops/new', {
    title: 'New Shop',
    shop: new Shop({})
  });
};

/**
 * Create a shop
 */

exports.create = function(req, res) {
  
  var shop = new Shop(req.body);
  var user = req.user;

  shop._user = user._id;
  shop.save(function(err) {
    if (err) {
      return res.render('shops/', {
        error: utils.errors(err.errors),
        shop: shop,
        title: 'Shops'
      });
    }
    
    // console.log("req user", user);
    user._shops.push(shop);
    user.save();
    // console.log("New Shop", shop)
    req.flash('success', 'Successfully created shop!');
    return res.redirect('/shops/' + shop.id);
  });
  // console.log("files", req.files)
  // shop.uploadAndSave(req.files.image, function (err) {
  //   if (!err) {
  //     req.flash('success', 'Successfully created shop!');
  //     return res.redirect('/shops/'+shop._id);
  //   }

  //   res.render('shops/new', {
  //     title: 'New Shop',
  //     shop: shop,
  //     error: utils.errors(err.errors || err)
  //   });
  // });
};

/**
 * Edit shop
 */

exports.edit = function(req, res) {
  res.render('shops/edit', {
    title: 'Edit ' + req.shop.title,
    shop: req.shop
  });
};

/**
 * Update shop
 */

exports.update = function(req, res) {
  var shop = req.shop;
  shop = extend(shop, req.body);

  shop.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/shops/' + shop._id);
    }

    res.render('shops/edit', {
      title: 'Edit Shop',
      shop: shop,
      error: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show shop
 */

exports.show = function(req, res) {
  res.render('shops/show', {
    title: req.shop.name,
    user: req.user,
    shop: req.shop
  });
};

/**
 * Delete a shop
 */

exports.destroy = function(req, res) {
  var shop = req.shop;
  shop.remove(function(err) {
    req.flash('info', 'Deleted successfully');
    res.redirect('/shops');
  });
};