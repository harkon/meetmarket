/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var oAuthTypes = [
	'facebook'
];

/**
 * User Schema
 */

var UserSchema = new Schema({
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},
	company: {
		type: String,
		default: ''
	},
	address: {
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
	email: {
		type: String,
		default: ''
	},
	username: {
		type: String,
		default: ''
	},
	provider: {
		type: String,
		default: ''
	},
	hashed_password: {
		type: String,
		default: ''
	},
	salt: {
		type: String,
		default: ''
	},
	authToken: {
		type: String,
		default: ''
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	modifiedAt: {
		type: Date,
		default: Date.now
	},
	facebook: {},
	google: {},
	_stores: [{
		type: Number,
		ref: 'Store'
	}]
});

/**
 * Virtuals
 */

UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
	});

UserSchema
	.virtual('fullname')
	.set(function(fullName) {
		this._fullname = fullname;
		if (fullName.indexOf(' ') !== -1) {
			var segments = fullName.split(' ');
			this.firstname = segments[0];
			this.lastname = segments[1];
		} else {
			this.firstname = fullName;
		}
	})
	.get(function() {
		return this._fullname;
	});

/**
 * Validations
 */

var validatePresenceOf = function(value) {
	return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('firstname').validate(function(firstname) {
	if (this.skipValidation()) return true;
	return firstname.length;
}, 'First name cannot be blank');

UserSchema.path('lastname').validate(function(lastname) {
	if (this.skipValidation()) return true;
	return lastname.length;
}, 'Last name cannot be blank');

UserSchema.path('email').validate(function(email) {
	if (this.skipValidation()) return true;
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function(email, fn) {
	var User = mongoose.model('User');
	if (this.skipValidation()) fn(true);

	// Check only when it is a new user or when email field is modified
	if (this.isNew || this.isModified('email')) {
		User.find({
			email: email
		}).exec(function(err, users) {
			fn(!err && users.length === 0);
		});
	} else fn(true);
}, 'Email already exists');

// UserSchema.path('shops').validate(function(username) {
// 	if (this.skipValidation()) return true;
// 	return username.length;
// }, 'Username cannot be blank');

// UserSchema.path('hashed_password').validate(function(hashed_password) {
// 	if (this.skipValidation()) return true;
// 	return hashed_password.length;
// }, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password) && !this.skipValidation()) {
		next(new Error('Invalid password'));
	} else {
		next();
	}
})

/**
 * Methods
 */

UserSchema.methods = {

	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */

	authenticate: function(plainText) {
		// console.log("hash", this.hashed_password)
		return bcrypt.compareSync(plainText, this.hashed_password);
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */

	makeSalt: function() {
		return bcrypt.genSaltSync(10);
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */

	encryptPassword: function(password) {
		if (!password) return '';
		return bcrypt.hashSync(password, this.salt);
	},

	/**
	 * Validation is not required if using OAuth
	 */

	skipValidation: function() {
		return~ oAuthTypes.indexOf(this.provider);
	}
};

/**
 * Statics
 */

UserSchema.statics = {

	/**
	 * Load
	 *
	 * @param {Object} options
	 * @param {Function} cb
	 * @api private
	 */

	load: function(options, cb) {
		// console.log("user load", options)
		// options.select = options.select || 'firstname lastname _stores';
		this.findOne(options.criteria)
			.populate('_stores')
			// .select(options.select)
			.exec(cb);
	}
}

mongoose.model('User', UserSchema);