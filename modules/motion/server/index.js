/**
 * Routes for motion
 */

'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap

const controller = require('./controller.js');

// motion overview
router.get('/', controller.index);

// run motion command
router.get('/run/:command?', controller.run);

module.exports = {
  router: router
};
