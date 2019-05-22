/**
 * wrapper for gulp-notify
 *
 * @module gulp/lib/notify
 */

'use strict';

const gulpNotify = require('gulp-notify');

/**
 * log only to console, not GUI
 *
 * @param {pbject} options - setting options
 * @param {function} callback - gulp callback
 * @type {function}
 */
const notify = gulpNotify.withReporter((options, callback) => {
  callback();
});

module.exports = notify;
