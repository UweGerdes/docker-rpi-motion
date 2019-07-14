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
  const videos = glob.sync(path.join(__dirname, '..', '..', '..', 'capture', '*.mp4'));
  videos.forEach(filename => {
    events[eventId(filename)] = {
      video: filename,
      videoFilename: path.basename(filename),
      videoLink: filename.replace(/^.+\//, '/motion/video/')
    };
  });
  const images = glob.sync(path.join(__dirname, '..', '..', '..', 'capture', '*.jpg'));
  let eventIds = { };
  Object.keys(events).forEach(eventId => {
    const parts = eventId.split('-');
    if (eventIds[parts[1]]) {
      eventIds[parts[1]].push(parseInt(parts[0], 10));
    } else {
      eventIds[parts[1]] = [parseInt(parts[0], 10)];
    }
  });
  const getEventId = eventId => {
    let foundId = eventId;
    const parts = eventId.split('-');
    const time = parseInt(parts[0], 10);
    if (eventIds[parts[1]]) {
      eventIds[parts[1]].forEach(id => {
        if (Math.abs(time - id) < 120) {
          foundId = String(id) + '-' + parts[1];
        }
      });
    }
    return foundId;
  };
  images.forEach(filename => {
    const eventIdFound = getEventId(eventId(filename));
    if (!events[eventIdFound]) {
      events[eventIdFound] = { };
    }
    events[eventIdFound].image = filename;
    events[eventIdFound].imageFilename = path.basename(filename);
    events[eventIdFound].imageLink = filename.replace(/^.+\//, '/motion/image/');
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
