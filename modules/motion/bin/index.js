/**
 * control the motion program
 *
 * use with node require
 *
 * @module index
 */

'use strict';

const spawn = require('child_process').spawn,
  fkill = require('fkill'),
  fs = require('fs'),
  processExists = require('process-exists');

let verbose = true;
let motionProcess = null;
let cmd = 'motion';
let args = ['-b', '-m', '-c', '/home/node/app/modules/motion/bin/motion.conf'];

var isRunning =
/**
 * is motion running
 *
 * use process-exists to check existance of process motion
 *
 * @returns {Boolean} motion run status
 */
exports.isRunning = () => {
  return processExists('motion');
};

/**
 * start motion
 *
 * spawn child process motion and redirect output to ./logs/index.log
 */
exports.start = () => {
  return isRunning().then(exists => {
    if (exists === false) {
      if (verbose) {
        console.log('starting: ' + cmd + ' ' + args.join(' '));
      }
      let out = fs.openSync('./logs/index.log', 'a');
      let err = fs.openSync('./logs/index.log', 'a');
      motionProcess = spawn(
        cmd,
        args,
        {
          detached: true,
          stdio: ['ignore', out, err]
        }
      );
      motionProcess.unref();
    } else {
      if (verbose) {
        console.log('already started: ' + cmd + ' ' + args.join(' '), exists);
      }
    }
    console.log('started: ' + exists + ' ' + cmd + ' ' + args.join(' '));
    return new Promise((resolve) => {
      resolve(exists);
    });
  });
};

/**
 * stop motion
 *
 * fkill the motion process
 */
exports.stop = () => {
  const delay = (t, val) => {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(val);
      }, t);
    });
  };
  return isRunning().then((running) => {
    return new Promise((resolve, reject) => {
      if (running) {
        try {
          console.log('fkill motion');
          fkill('motion');
          console.log('delay 3000');
          delay(3000);
          console.log('resolve');
          resolve(running);
        } catch (error) {
          console.log(cmd, args.join(' '), 'could not be killed');
          reject(error);
        }
      } else {
        resolve(running);
      }
    });
  });
};
