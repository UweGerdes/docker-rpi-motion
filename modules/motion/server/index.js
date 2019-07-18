/**
 * Routes for motion
 */

'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap

const controller = require('./controller.js');

/**
 * GET / route
 *
 * @name get_default_route
 */
router.get('/', controller.index);

/**
 * GET /image/[image] route
 *
 * @name get_image_route
 */
router.get('/:show/:eventShow', controller.show);

/**
 * GET /run/[command] route
 *
 * @name get_run_route
 */
router.get('/run/:command?', controller.run);

module.exports = {
  router: router,
  connectServer: controller.connectServer,
  useExpress: controller.useExpress
};
