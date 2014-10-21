/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Product = mongoose.model('Product')
var Category = mongoose.model('Category')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function(req, res, next, id) {

  Product.load(id, function(err, product) {
    if (err) return next(err);
    if (!product) return next(new Error('not found'));
    req.product = product;
    console.log("product", product)
    next();
  });
};

/**
 * List
 */

exports.index = function(req, res) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Product.list(options, function(err, products) {
    console.log("#Products", products)
    if (err) return res.render('500');
    Product.count().exec(function(err, count) {
      res.render('products/index', {
        title: 'Products',
        user: req.user,
        products: products,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New article
 */

exports.new = function(req, res) {

  var options = {
    criteria: {
      'parentId': null
    }
  }

  Category.list(options, function(err, results) {

    if (err) return res.render('500');
    var categories = [];
    // if there are no categories set, go to render
    if (results.length === 0) render(categories);

    results.forEach(function(category) {
      var promise = category.getArrayTree();
      promise.onFulfill(render)
    })

    function render(data) {

      if (data.length > 0) categories.push(data[0]);
      if (categories.length === results.length) {
        res.render('products/new', {
          title: 'New Product',
          product: new Product({}),
          categories: categories,
          layout: false
        });
      }
    }



  })



};

/**
 * Create an article
 */

exports.create = function(req, res) {

  var product = new Product(req.body);
  console.log("product", product)
  product.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      req.flash('success', 'Successfully created product!');
      return res.redirect('/products');
    }

    res.render('500', {
      title: 'New Product',
      product: product,
      error: utils.errors(err.errors || err)
    });

  });
  // res.send(product);
};

/**
 * Edit an product
 */

exports.edit = function(req, res) {
  res.render('products/edit', {
    title: 'Edit ' + req.product.title,
    product: req.product
  });
};

/**
 * Update article
 */

exports.update = function(req, res) {
  var product = req.product;
  product = extend(product, req.body);

  product.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/products/' + product._id);
    }

    res.render('products/edit', {
      title: 'Edit Product',
      product: product,
      error: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function(req, res) {
  res.render('products/show', {
    title: req.product.title,
    product: req.product
  });
};

/**
 * Delete an article
 */

exports.destroy = function(req, res) {
  var product = req.product;
  product.remove(function(err) {
    req.flash('info', 'Deleted successfully');
    res.redirect('/products');
  });
};