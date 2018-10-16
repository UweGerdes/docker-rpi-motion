/**
 * ## Model for motion
 *
 * @module motion/model
 */
'use strict';

const motion = require('../../../index.js');
const dryRun = false;

/**
 * ### startMotion
 */
function startMotion() {
  if (!dryRun) {
    return motion.start();
  } else {
    console.log('motion.start();');
  }
}

/**
 * ### stopMotion
 */
function stopMotion() {
  if (!dryRun) {
    return motion.stop();
  } else {
    console.log('motion.stop();');
  }
}

/**
 * ### isRunning
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
