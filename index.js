/*
 * control the motion program
 *
 * node index.js
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

var exec = require('child_process').exec;

var verbose = false;
var status = { running: false };
var motionProcess = null;

function start(id, callback) {
	var cmd = "motion";
	var args = ['-n'];
	if (verbose) {
		console.log('starting: ' + cmd + ' ' + args.join(' '));
	}
	status.running = false;
	stop(id);
	status.running = true;
	motionProcess = exec(cmd + ' ' + args.join(' '),
		function (error, stdout, stderr) {
			log('finished ' + id, error, ", stderr: ", stderr);
		}
	);
	motionProcess.stdout.on('data', function(data) { console.log(id + ': ' + data.trim()); });
	motionProcess.stderr.on('data', function(data) { console.log(id + ' stderr: ' + data.trim()); });
	motionProcess.on('error', function(err) { console.log(id + ' error: ' + err.trim()); });
	motionProcess.on('close', function(code) {
		if (code > 0) {
			console.log('load ' + id + ' exit: ' + code);
		}
		status.running = false;
		if (callback) {
			callback(status);
		}
	});
}

function stop(id) {
	if (status.running === true) {
		console.log('stopping motion ' + id);
		motionProcess.kill('SIGKILL');
		status.running = false;
	}
}

function log(msgStart, error, stdout, stderr) {
	if (stdout.length > 0) { console.log(msgStart + ' stdout: ' + stdout.trim()); }
	if (stderr.length > 0) { console.log(msgStart + ' stderr: ' + stderr.trim()); }
	if (error !== null)	   { console.log(msgStart + ' error:\n' + JSON.stringify(error, undefined, 4)); }
}

module.exports = {
	start: start,
	stop: stop
};

