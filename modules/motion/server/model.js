/**
 * Model for motion
 *
 * Wrapper for the index.js in the main folder of this project
 * Make event list from capture files
 *
 * @module motion/model
 */

'use strict';

const axios = require('axios'),
  glob = require('glob'),
  path = require('path'),
  motion = require('../../../index.js');

const dryRun = false;

/**
 * startMotion
 *
 * start the motion process
 */
async function startMotion() {
  if (!dryRun) {
    const started = motion.start();
    await sleep(300);
    return started;
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
 * getDetectionStatus
 *
 * get detection status of motion
 *
 * @returns {String} detection status
 */
async function getDetectionStatus() {
  let status = '';
  if (motion.isRunning()) {
    try {
      const page = await axios({
        method: 'get',
        url: 'http://localhost:8082/0/detection/status'
      });
      status = page.data.replace(/(?:.|\s)+Detection status ([A-Z]+)(?:.|\s)+/m, '$1').toLowerCase();
    } catch (error) {
      if (error.message.match(/.*connect ECONNREFUSED.*/)) {
        status = 'no connection to motion server';
      } else {
        status = error.message;
      }
    }
  } else {
    status = 'not running';
  }
  return status;
}

/**
 * setDetectionStatus
 *
 * set detection status of motion
 *
 * @param {String} newStatus - status to set
 * @returns {String} detection status
 */
async function setDetectionStatus(newStatus) {
  let status = '';
  if (motion.isRunning()) {
    try {
      await axios({
        method: 'get',
        url: 'http://localhost:8082/0/detection/' + newStatus
      });
      status = getDetectionStatus();
    } catch (error) {
      if (error.message.match(/.*connect ECONNREFUSED.*/)) {
        status = 'no connection';
      } else {
        status = error.message;
      }
    }
  } else {
    status = 'not running';
  }
  return status;
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
      videoFilename: path.basename(filename)
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
  });
  for (let [key, value] of Object.entries(events)) {
    value.date = key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d+)/, '$3.$2.$1');
    value.time = key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d+)/, '$4:$5:$6');
    value.take = key.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d+)/, '$7');
  }
  return events;
}

module.exports = {
  startMotion: startMotion,
  stopMotion: stopMotion,
  isRunning: isRunning,
  getDetectionStatus: getDetectionStatus,
  setDetectionStatus: setDetectionStatus,
  getEventList: getEventList
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
