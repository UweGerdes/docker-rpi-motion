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
 */
function start() {
  let cmd = 'motion';
  let args = ['-b'];
  return isRunning().then(exists => {
    if (exists === false) {
      if (verbose) {
        console.log('starting: ' + cmd + ' ' + args.join(' '));
      }
      let out = fs.openSync('./logs/index.log', 'a');
      let err = fs.openSync('./logs/index.log', 'a');
      motionProcess = spawn(cmd, args,
        {
          detached: true,
          stdio: ['ignore', out, err]
        });
      motionProcess.unref();
    } else {
      if (verbose) {
        console.log('already started: ' + cmd + ' ' + args.join(' '), exists);
      }
    }
    return new Promise((resolve) => {
      resolve(exists);
    });
  });
}

/**
 * ### stop motion
 */
function stop() {
  const delay = (t, val) => {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(val);
      }, t);
    });
  };
  return isRunning().then((running) => {
    return new Promise(async (resolve) => {
      if (running) {
        await fkill('motion');
        await delay(3000);
        resolve(running);
      } else {
        resolve(running);
      }
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
