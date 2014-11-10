var moment = require("moment");
var cloudinary = require('../config/cloudinary');

module.exports = function(Handlebars) {
	return {
		add: function(value, addition) {
			return value + addition;
		},
		copyright: function(year) {
			return new Handlebars.SafeString("&copy;" + year);
		},
		debug: function(optionalValue) {
			// console.log("Current Context");
			// console.log("====================");
			// console.log(this);

			if (optionalValue) {
				console.log("Value");
				console.log("====================");
				console.log(optionalValue);
			} else {
				console.log("No context provided");
				console.log("====================");
			}
		},
		formatDate: function(datetime, f) {
			if (moment) {
				// f = DateFormats[format];
				return moment(datetime).format(f);
			} else {
				return datetime;
			}
		},
		getJSON: function(url) {
			return new Promise(function(resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open('get', url, true);
				xhr.responseType = 'json';
				xhr.onload = function() {
					var status = xhr.status;
					if (status == 200) {
						resolve(xhr.response);
					} else {
						reject(status);
					}
				};
				xhr.send();
			});
		},
		view: function(path, url) {

			var data;
			getJSON(url).then(function(response) {
				console.log("Success!", response);
				data = response;
			}, function(error) {
				console.error("Failed!", error);
				return;
			});

			Handlebars.render(path, data).then(function(view) {
				console.log("View", view);
				return new Handlebars.SafeString(view);
			});
		},
		encodeURI: function(str) {
			return encodeURIComponent(str);
		},
		cloudImage: function(id, w, h, c) {
			var image = cloudinary.image(id, {
					width: w,
					height: h,
					crop: c
				})
				// return new Handlebars.SafeString(image);
			return image;
		},
		cloudUrl: function(id) {
			return cloudinary.url(id)
		},
		treeView: function(categories) {
			if (categories.length > 0) {
				return deepSetMenu(categories)
			} else {
				return;
			}
		},
		treeInput: function(categories){
			return deepSetInput(categories)
		}


	}; // return end

	/**
	 *
	 * Utility functions
	 *
	 */


	function deepSetMenu(nodes) {
		var el = '<ul>';
		nodes.forEach(function(node) {
			var path = node.name
				.split(" ")
				.filter(function(v) {
					return v !== ''
				})
				.join("_");

			el += '<li><span class="badge pull-right">' + node.count + '</span><a href="#' + path + '">' + node.name + '</a>';
			if (node.children) {
				var sorted = node.children.sort(compare);
				el += deepSetMenu(sorted)
			}
			el += '</li>';
		})
		return el += '</ul>';
	}

	function deepSetInput(nodes) {
		var el = '<ul>';
		nodes.forEach(function(node) {
			var id = node.name.split(" ")
				.filter(function(v) {
					return v !== ''
				})
				.join("_");

			el += '<li><input type="checkbox" id="' + id + '" checked="checked" /><label><input type="checkbox" name="_categories[]" value="' + node._id + '" form="productForm"/><span></span></label><label for="' + id + '">' + node.name + '</label>'

			if (node.children) {
				var sorted = node.children.sort(compare);
				el += deepSetInput(sorted)
			}
			el += '</li>'
		})
		return el += '</ul>';
	}

	function compare(a, b) {
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	}

	function getJSON(url) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', url, true);
			xhr.responseType = 'json';
			xhr.onload = function() {
				var status = xhr.status;
				if (status == 200) {
					resolve(xhr.response);
				} else {
					reject(status);
				}
			};
			xhr.send();
		});
	}

	function exposeTemplates(req, res, next) {
		// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
		// templates which will be shared with the client-side of the app.
		hbs.getTemplates('shared/templates/', {
			cache: app.enabled('view cache'),
			precompiled: true
		}).then(function(templates) {
			// RegExp to remove the ".handlebars" extension from the template names.
			var extRegex = new RegExp(hbs.extname + '$');

			// Creates an array of templates which are exposed via
			// `res.locals.templates`.
			templates = Object.keys(templates).map(function(name) {
				return {
					name: name.replace(extRegex, ''),
					template: templates[name]
				};
			});

			// Exposes the templates during view rendering.
			if (templates.length) {
				res.locals.templates = templates;
			}

			setImmediate(next);
		})
			.catch(next);
	}

} // module end