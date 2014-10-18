
/**
 * Module dependencies.
 */

var path = require('path');
var extend = require('util')._extend;
var development = require('./env/development');
var test = require('./env/test');
var production = require('./env/production');

var host = {
  ip: '127.0.0.1',
  port: 3030,
  securePort: 8443
};

var defaults = {
  root: path.normalize(__dirname + '/..'),
  host: host
};

/**
 * Expose
 */
module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];