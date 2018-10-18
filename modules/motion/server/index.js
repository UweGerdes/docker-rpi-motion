/**
 * Routes for motion
 */
'use strict';

const express = require('express'),
  router = express.Router();

const controller = require('./controller.js');

// motion overview
router.get('/', controller.index);

// run motion command
router.get('/run/:command?', controller.run);

module.exports = router;
