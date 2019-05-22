/**
 * Model for motion
 *
 * This is just a wrapper for the index.js in the main folder of this project
 *
 * @module motion/model
 */

'use strict';

const motion = require('../../../index.js');
const dryRun = false;

/**
 * startMotion
 *
 * start the motion process
 */
function startMotion() {
  if (!dryRun) {
    return motion.start();
  } else {
    console.log('motion.start();');
  }
}

/**
 * stopMotion
 *
 * stop the motion process
 */
function stopMotion() {
  if (!dryRun) {
    return motion.stop();
  } else {
    console.log('motion.stop();');
  }
}

/**
 * isRunning
 *
 * check status of motion process
 *
 * @returns {Boolean} motion run status
 */
function isRunning() {
  return motion.isRunning();
}

module.exports = {
  startMotion: startMotion,
  stopMotion: stopMotion,
  isRunning: isRunning
};
