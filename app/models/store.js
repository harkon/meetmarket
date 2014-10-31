/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

/**
 * Store Schema
 */

var StoreSchema = new Schema({
  available: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    addr1: {
      type: String,
      default: ''
    },
    addr2: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    zip: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
  },
  numbers: {
    tel: {
      type: String,
      default: ''
    },
    fax: {
      type: String,
      default: ''
    },
    mob: {
      type: String,
      default: ''
    }
  },
  coordinates: [Number],
  _user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // managers: [{
  //   type: Schema.ObjectId,
  //   ref: 'Manager'
  // }]

});

/**
 * Validations
 */

StoreSchema.path('name').required(true, 'Store name cannot be blank');

/**
 * Pre-save hook
 */

StoreSchema.pre('save', function(next) {

  console.log(this._user)

  next();
});

/**
 * Pre-remove hook
 */

StoreSchema.pre('remove', function(next) {
  // var imager = new Imager(imagerConfig, 'S3');
  // var files = this.image.files;

  // // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function(err) {
  //   if (err) return next(err);
  // }, 'shop');

  next();
});

/**
 * Methods
 */

StoreSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function(images, cb) {
    // console.log("images", images)
    if (!images || !images.length) return this.save(cb)

    // var imager = new Imager(imagerConfig, 'S3');
    var self = this;

    this.validate(function(err) {
      if (err) return cb(err);
      imager.upload(images, function(err, cdnUri, files) {
        if (err) return cb(err);
        if (files.length) {
          self.image = {
            cdnUri: cdnUri,
            files: files
          };
        }
        self.save(cb);
      }, 'store');
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

  addComment: function(user, comment, cb) {
    var notify = require('../mailer');

    this.comments.push({
      body: comment.body,
      user: user._id
    });

    if (!this.user.email) this.user.email = 'email@product.com';
    notify.comment({
      article: this,
      currentUser: user,
      comment: comment.body
    });

    this.save(cb);
  },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  removeComment: function(commentId, cb) {
    var index = utils.indexof(this.comments, {
      id: commentId
    });
    if (~index) this.comments.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  }
};

/**
 * Statics
 */

StoreSchema.statics = {

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
      .populate('_user', '_id')
    // .populate('comments.user')
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
      .populate('_user', '_id')
      .sort({
        'createdAt': -1
      }) // sort by date
    .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
};

StoreSchema.plugin(autoIncrement.plugin, {
  model: 'Store',
  startAt: 100000
});

mongoose.model('Store', StoreSchema);