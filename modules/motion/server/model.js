/**
 * Model for motion
 *
 * Wrapper for the index.js in the main folder of this project
 * Make event list from capture files
 *
 * @module motion/model
 */

'use strict';

const glob = require('glob'),
  path = require('path'),
  motion = require('../../../index.js');

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

/**
 * getEventList
 *
 * get the list of events / files in capture
 * TODO use motion.conf - target_dir
 *
 * @returns {Array} event list
 */
function getEventList() {
  let events = {};
  const eventId = filename => filename.replace(/^.+\/([0-9]+-[0-9]+).+/, '$1');
  const videos = glob.sync(path.join(__dirname, '..', '..', '..', 'capture', '*.avi'));
  videos.forEach(filename => {
    events[eventId(filename)] = { video: filename };
  });
  const images = glob.sync(path.join(__dirname, '..', '..', '..', 'capture', '*.jpg'));
  images.forEach(filename => {
    if (!events[eventId(filename)]) {
      events[eventId(filename)] = { };
    }
    events[eventId(filename)].image = filename;
  });
  for (let [key, value] of Object.entries(events)) {
    value.date = key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d{2})/, '$3.$2.$1');
    value.time = key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d{2})/, '$4:$5:$6');
    value.take = key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d{2})/, '$7');
  }
  return events;
}

module.exports = {
  startMotion: startMotion,
  stopMotion: stopMotion,
  isRunning: isRunning,
  getEventList: getEventList
};
