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
 * Item Schema
 */

var VariantSchema = new Schema({

  name: {
    type: String,
    default: ''
  },
  lname: {
    type: String,
    default: ''
  },
  assets: {
    images: []
  },
  attrs: [],

  lastModified: {
    type: Date,
    default: Date.now
  },
  _product: {
    type: Schema.ObjectId,
    ref: 'Product'
  }
});

/**
 * Validations
 */

// VariantSchema.path('title').required(true, 'Item name cannot be blank');
// VariantSchema.path('body').required(true, 'Article body cannot be blank');

/**
 * Pre-remove hook
 */

VariantSchema.pre('save', function(next) {

  console.log("pre save")
  next()
});

// VariantSchema.pre('remove', function (next) {
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

VariantSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function(files, cb) {

    if (!files || !files.length) return this.save(cb)

    var self = this;

    this.validate(function(err) {
      if (err) return cb(err);
      // File upload (for promise api)
      cloudinary.uploader.upload(file.path, {
        type: "upload"
      })
        .then(function(image) {
          console.log();
          console.log("** File Upload (Promise)");
          console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
          console.log("* " + image.public_id);
          self.images.push(image);
          // return self.save();
          if (self.images.length == files.length) {
            self.save()
          }
        })
        .then(function(photo) {
          // both are undefined cause we don't return anything at the previus function
          console.log('** photo saved', err, photo)
        })
        .catch(function(err) {
          console.log();
          console.log("** File Upload (Promise)");
          if (err) {
            console.warn(err);
          }
        })
        .finally(function() {
          // res.render('photos/create_through_server', {
          //   photo: photo,
          //   upload: photo.image
          // });
          cb()
        });
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

VariantSchema.statics = {

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
      .populate('_product')
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
      .populate('_product')
      .sort({
        'lastModified': -1
      }) // sort by date
    .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}

mongoose.model('Variant', VariantSchema);