/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Category = mongoose.model('Category')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function(req, res, next, id) {
	var options = {
		criteria: {
			// shopId: req.shop._id
		}
	};
	Category.findOne({
		_id: id
	}, function(err, category) {
		console.log("Category found", category.name)
		// access to the children
		category.getChildren(function(err, children) {
			console.log("Children", children)
		});
		// access to the siblings
		category.getSiblings(function(err, siblings) {
			console.log("Siblings", siblings)
		});
		// access to the ancestors
		category.getAncestors(function(err, ancestors) {
			console.log("Ancestors", ancestors)
			// ...
		});

		category.getArrayTree(function(err, tree) {
			// ... [ {"_id": "...", "children": [ {...} ]}]
			console.log("array tree", tree)
		});
		// // get doc tree
		category.getTree(function(err, tree) {
			// ... { "doc ID": { ..., children: { ... } }
			console.log("tree", tree)
		});

		// check element is root
		console.log("is root", category.isRoot())

		// check element is leaf
		console.log("is leaf", category.isLeaf());

		// depth virtual attributes
		console.log("depth", category.depth)

		// category.getArrayTree(function(err, tree) {
		// 	console.log("TT", tree)
		// });

	});


	Category.load(id, function(err, category) {
		if (err) return next(err);
		if (!category) return next(new Error('not found'));

		req.category = category;
		// console.log("\nCategory loaded\n", category)
		next();
	});
};

/**
 * List
 */

exports.index = function(req, res) {
	// console.log("shop?", req.shop)
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	var perPage = 30;
	var options = {
		perPage: perPage,
		page: page,
		// criteria: {
		// 	shopId: req.shop._id
		// }
	};

	Category.listDept(options, function(err, categories) {
		// console.log("categories", categories)
		var trees = [];

		if (err) return res.render('500');
		// if there are no categories set, go to render
		if (categories.length === 0) render(trees);

		categories.forEach(function(category) {
			var promise = category.getArrayTree();
			promise.onFulfill(render)
		})

		function render(data) {

			if (data.length > 0) trees.push(data[0]);
			if (trees.length === categories.length) {
				res.render('categories/index', {
					title: 'Categories',
					user: req.user,
					categories: trees,
				});
			}
		}
	});
};

/**
 * New category
 */

exports.new = function(req, res) {
	var options = {
		criteria: {
			// shopId: req.shop._id
		}
	};
	Category.list(options, function(err, categories) {
		if (err) return res.render('500');
		res.render('categories/new', {
			// shopId: req.shop._id,
			title: 'New Category',
			category: new Category({}),
			parents: categories,
			layout: false
		});
	})
	// console.log("categories",available)
};

/**
 * Create a category
 */

exports.create = function(req, res) {
	var category = new Category(req.body);
	// category.shopId = req.shop._id;
	category.save(function(err) {
		if (err) {
			console.log("Error", err)
			return res.render('500', {
				error: utils.errors(err.errors || err),
				categories: category,
				title: 'Error'
			});
		}
		console.log("Category created", category)
		req.flash('success', 'Successfully created category!');
		return res.redirect('/categories/index');
	});
	// console.log("files", req.files)
	// shop.uploadAndSave(req.files.image, function (err) {
	//   if (!err) {
	//     req.flash('success', 'Successfully created shop!');
	//     return res.redirect('/shops/'+shop._id);
	//   }

	//   res.render('shops/new', {
	//     title: 'New Category',
	//     shop: shop,
	//     error: utils.errors(err.errors || err)
	//   });
	// });
};

/**
 * Edit shop
 */

exports.edit = function(req, res) {
	res.render('categories/edit', {
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
			title: 'Edit Category',
			shop: shop,
			error: utils.errors(err.errors || err)
		});
	});
};

/**
 * Show shop
 */

exports.show = function(req, res) {

	Category.load(req.params.categoryId, function(err, category) {
		if (err) return next(err);
		if (!category) return next(new Error('not found'));

		res.render('categories/show', {
			title: category.name,
			category: category
		});
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