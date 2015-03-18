/**
 * Module dependencies
 */

var fs = require('fs');
var http = require("http");
var https = require("https");
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var uriUtil = require('mongodb-uri');
var autoIncrement = require('mongoose-auto-increment');

var config = require('./config/config');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || config.host.ip,
	port = process.env.OPENSHIFT_NODEJS_PORT || config.host.port,
	sslPort = process.env.OPENSHIFT_NODEJS_SSLPORT || config.host.securePort,
	credentials = {
		key: fs.readFileSync('./ssl/server.key', 'utf8'),
		cert: fs.readFileSync('./ssl/server.crt', 'utf8')
	};

var app = express();
// Connect to mongodb
var connect = function() {
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1,
				connectTimeoutMS: 30000
			}
		}
	};
	var mongodbUri = config.db;
	var mongooseUri = uriUtil.formatMongoose(mongodbUri);
	mongoose.connect(mongooseUri, options);
	console.log("Connected to '%s' database", mongodbUri);
};

// connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

autoIncrement.initialize(mongoose.connection);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function(file) {
	if (/\.js$/.test(file)) require(__dirname + '/app/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

var start = function() {
	// only run https when local
	if (!process.env.OPENSHIFT_NODEJS_PORT) {
		https.createServer(credentials, app).listen(sslPort, ipaddress);
		console.info("Secure server started on address http://%s:%s in %s mode", ipaddress, sslPort, app.get('env'));
	}

	http.createServer(app).listen(port, ipaddress);
	console.info("Server started on address http://%s:%s in %s mode",
		ipaddress,
		port,
		app.get('env')
	);
};

start();