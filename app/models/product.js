/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var cloudinary = require('../../config/cloudinary');
var config = require('../../config/config');
var utils = require('../../lib/utils');
var Schema = mongoose.Schema;

/**
 * Getters
 */

var getTags = function(tags) {
  return tags.join(',');
};

/**
 * Setters
 */

var setTags = function(tags) {
  return tags.split(',');
};

/**
 * Product Schema
 */

var ProductSchema = new Schema({

  department: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  brand: {
    id: String,
    name: String,
    image: {}
  },
  name: {
    type: String,
    default: '',
    trim: true
    // required: true
  },
  sku: {
    type: String,
    default: ''
    // required: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  desc: {
    type: String,
    default: '',
    trim: true
  },
  // short_desc: {
  //   type: String,
  //   default: ''
  // },
  // thumbnail: {},
  assets: {
    images: []
  },
  attrs: [], //Will be used to implement facetting
  shipping: {
    dimensions: {
      height: {
        type: Number,
        default: 0
      },
      length: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 0
      }
    },
    weight: {
      type: Number,
      default: 0
    }
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  _shop: {
    type: Schema.ObjectId,
    ref: 'Shop'
  },
  _variants: {
    type: Schema.ObjectId,
    ref: 'Variant'
  },
  _categories: [{
    type: Schema.ObjectId,
    ref: 'Category'
  }]

});

/**
 * Validations
 */

ProductSchema.path('name').required(true, 'Item name cannot be blank');
ProductSchema.path('sku').required(true, 'Item SKU cannot be blank');

/**
 * Pre-remove hook
 */

// ProductSchema.pre('save', function(next) {

//   var self = this;

//   mongoose.models["Category"].findOne({
//     _id: self.username
//   }, function(err, user) {
//     if (user) {
//       self.invalidate("user", "username must be unique");
//     }
//     done();
//   });
//   next();
//   console.log("pre save", this)
//   next()
// });

// ProductSchema.pre('save', true, function(next, done) {
//   var self = this;
  /**
   * NOTE: middleware to get category names from the input and then save them concatanated to category field
   *
  // calling next kicks off the next middleware in parallel
  mongoose.models["Category"].findOne({
    _id: self._categories[0]
  }, function(err, category) {
    console.log("category", category)
    if (err) {
      done(err);
    } else if (category) {
      console.log(category)
      // self.invalidate("username", "username must be unique");
      // done(new Error("username must be unique"));
    } else {
      done();
    }
  });

  */
//   done();
// });
// ProductSchema.pre('remove', function (next) {
//   var imager = new Imager(imagerConfig, 'S3');
//   var files = this.image.files;

//   // if there are files associated with the item, remove from the cloud too
//   imager.remove(files, function (err) {
//     if (err) return next(err);
//   }, 'article');

//   next();
// });

/**
 * Methods
 */

ProductSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function(images, cb) {
    // console.log("images in", !images, !images.length)
    // console.log("images", images)
    if (!images || !images.length) return this.save(cb);
    console.log("here?")
    var self = this;

    this.validate(function(err) {

      if (err) return cb(err);
      // File upload (for promise api)
      cloudinary.uploader.upload(images.path, {
        type: "upload"
      })
        .then(function(image) {
          console.log();
          console.log("** File Upload (Promise)");
          console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
          console.log("* " + image.public_id);
          self.image = image;
          return self.save(cb);
        })
        .catch(function(err) {
          console.log();
          console.log("** File Upload (Promise)");
          if (err) {
            console.warn(err);
          }
        })
    });
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  // addComment: function(user, comment, cb) {
  //   var notify = require('../mailer');

  //   this.comments.push({
  //     body: comment.body,
  //     user: user._id
  //   });

  //   if (!this.user.email) this.user.email = 'email@product.com';
  //   notify.comment({
  //     article: this,
  //     currentUser: user,
  //     comment: comment.body
  //   });

  //   this.save(cb);
  // },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  // removeComment: function(commentId, cb) {
  //   var index = utils.indexof(this.comments, {
  //     id: commentId
  //   });
  //   if (~index) this.comments.splice(index, 1);
  //   else return cb('not found');
  //   this.save(cb);
  // }
}

/**
 * Statics
 */

ProductSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function(id, cb) {
    this.findOne({
      _id: id
    })
      .populate('_shop')
      .populate('_category', 'name')
      .exec(cb);
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function(options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('_shop')
      .populate('_category', 'path')
      .sort({
        'lastModified': -1
      }) // sort by date
    .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}

mongoose.model('Product', ProductSchema);