/**
 * Category Hierarchy
 *
 * Operations
 *
 * - Read and Display a Category
 * - Add a Category to the Hierarchy
 * - Change the Ancestry of a Category
 * - Rename a Category
 *
 */

var mongoose = require('mongoose'),
	tree = require('mongoose-materialized'),
	Schema = mongoose.Schema;


var CategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		default: ''
	},
	count: {
		type: Number,
		default: 0
	},
	status: {
		type: String,
		default: 'active'
	},
	facets: [],
	// shop: {
	// 	type: Schema.ObjectId,
	// 	ref: 'Shop'
	// }
});



CategorySchema.statics = {

	/**
	 * Find category by id
	 *
	 * @param {ObjectId} id
	 * @param {Function} cb
	 * @api private
	 */

	load: function(id, cb) {
		this.findOne({
			_id: id
		})
		// .populate('shop', '_id')
		// .populate('comments.user')
		.exec(cb);
	},

	/**
	 * List categories
	 *
	 * @param {Object} options
	 * @param {Function} cb
	 * @api private
	 */

	list: function(options, cb) {
		var criteria = options.criteria || {}
		this.find(criteria)
		.sort({'name':1})
		.exec(cb)
	},
	listDept: function(options, cb) {
		var criteria = options.criteria || {
			'parentId': null
		}
		this.find(criteria)
			.sort({
				'name': 1
			})
			.exec(cb)
	}

}

/**
 * NOTE: This should be declared at the end of the object, after all the static methods
 */

CategorySchema.plugin(tree, {
	separator: '#'
});

mongoose.model('Category', CategorySchema); // Category