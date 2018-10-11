/**
 * # control the motion program
 *
 * use with node require
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

const exec = require('child_process').execFile;

let verbose = false;
let motionProcess = null;

/**
 * ### start motion
 *
 * @param {Function} callback - after end
 */
function start(callback) {
  let cmd = 'motion';
  let args = ['-n'];
  if (verbose) {
    console.log('starting: ' + cmd + ' ' + args.join(' '));
  }
  stop();
  motionProcess = exec(cmd, args,
    function (error, stdout, stderr) {
      console.log('fin', stdout, stderr);
      console.log('finished ' + ((error) ? 'error: ' + error : ', all ok'));
    }
  );
  motionProcess.stdout.on('data', function (data) { console.log('stdout: ' + data.trim()); });
  motionProcess.stderr.on('data', function (data) { console.log('stderr: ' + data.trim()); });
  motionProcess.on('error', function (err) { console.log('error: ' + err.trim()); });
  motionProcess.on('close', function (exitCode) {
    if (exitCode > 0) {
      console.log('exitCode: ' + exitCode);
    }
    if (callback) {
      callback();
    }
  });
}

/**
 * ### stop motion
 */
function stop() {
  if (isRunning()) {
    motionProcess.kill('SIGTERM');
  }
}

/**
 * ### is motion running
 *
 * @returns {Boolean} motion run status
 */
function isRunning() {
  if (motionProcess && !motionProcess.killed) {
    if (verbose) {
      console.log('motion running');
    }
    return true;
  } else {
    if (verbose) {
      console.log('motion not running');
    }
    return false;
  }
}

module.exports = {
  start: start,
  stop: stop,
  isRunning: isRunning
};

