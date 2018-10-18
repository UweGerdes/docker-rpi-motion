/**
 * # control the motion program
 *
 * use with node require
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

const spawn = require('child_process').spawn,
  fkill = require('fkill'),
  fs = require('fs'),
  processExists = require('process-exists');

let verbose = false;
let motionProcess = null;

/**
 * ### start motion
 *
 * @param {Function} callback - after end
 */
function start(callback) {
  let cmd = 'motion';
  let args = ['-b'];
  isRunning().then(exists => { // jscs:ignore jsDoc
    if (exists === false) {
      if (verbose) {
        console.log('starting: ' + cmd + ' ' + args.join(' '));
      }
      let out = fs.openSync('./motion.log', 'a');
      let err = fs.openSync('./motion.log', 'a');
      motionProcess = spawn(cmd, args,
        {
          detached: true,
          stdio: ['ignore', out, err]
        }
      );
      motionProcess.unref();
      return new Promise((resolve) => { // jscs:ignore jsDoc
        resolve(true);
      });
    } else {
      if (verbose) {
        console.log('restarting: ' + cmd + ' ' + args.join(' '), exists);
      }
      return new Promise((resolve) => { // jscs:ignore jsDoc
        resolve(false);
      });
    }
  });

}

/**
 * ### stop motion
 */
function stop() {
  return isRunning().then(running => { // jscs:ignore jsDoc
    if (running) {
      fkill('motion');
    }
    return new Promise((resolve) => { // jscs:ignore jsDoc
      resolve(running);
    });
  });
}

/**
 * ### is motion running
 *
 * @returns {Boolean} motion run status
 */
function isRunning() {
  return processExists('motion');
}

module.exports = {
  start: start,
  stop: stop,
  isRunning: isRunning
};
