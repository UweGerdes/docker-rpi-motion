/*
 * Start a HTTP server for motion
 *
 * node server.js
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

var bodyParser = require('body-parser'),
	express = require('express'),
	fs = require('fs'),
	logger = require('morgan'),
	os = require('os'),
	path = require('path');

var motion = require('./index.js');

var interfaces = os.networkInterfaces(),
	app = express();

var httpPort = process.env.SERVER_PORT || "8082",
	verbose = (process.env.VERBOSE == 'true'),
	baseDir = __dirname;

var captureDir = path.join(baseDir, 'capture'),
	logsDir = path.join(baseDir, 'logs');

if (!fs.existsSync(captureDir)) {
	fs.mkdirSync(captureDir);
}

if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

// Log the requests
if (verbose) {
	app.use(logger('dev'));
}

// work on post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files
app.use(express.static(path.join(baseDir, 'public')));

// Handle AJAX requests for run configs
app.get('/:id/:command/:options?', function(req, res){
	runCommand(req.params, res);
});

// Route for root dir
app.get('/', function(req, res){
	res.sendFile(path.join(baseDir, 'public', 'index.html'));
});

// Route for everything else.
app.get('*', function(req, res){
	res.status(404).send('Sorry cant find that: ' + req.url);
});

// Fire it up!
app.listen(httpPort);
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
// console.log("IP address of container  :  " + addresses);
console.log('motion server listening on http://' + addresses[0] + ':' + httpPort);

function runCommand(params, res) {
	console.log("ID: " + params.id + ", Command: " + params.command);
	switch(params.command) {
		case "start":
			motion.start(params.id);
			break;
		case "stop":
			motion.stop(params.id);
			break;
		default:
			console.log("Command not found: " + params.command);
			break;
	}
	res.sendFile(path.join(baseDir, 'public', 'index.html'));
}

