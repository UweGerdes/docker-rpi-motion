/**
 * ## Controller for motion
 *
 * @module motion/controller
 */

'use strict';

const path = require('path'),
  config = require('../../../lib/config'),
  model = require('./model.js');
const viewBase = path.join(path.dirname(__dirname), 'views');

const viewRenderParams = {
  // model data
  // view helper functions
};

/**
 * ### index page
 *
 * render the index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  let data = Object.assign({
    title: 'Motion'
  },
  req.params,
  getHostData(req),
  viewRenderParams);
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * ### run command
 *
 * render the run result data
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const run = (req, res) => {
  res.set('Content-Type', 'application/json');
  model[req.params.command]().then((result) => { // jscs:ignore jsDoc
    res.send({ data: result });
  }).catch((error) => { // jscs:ignore jsDoc
    res.send({ error: error });
  });
};

module.exports = {
  index: index,
  run: run
};

/**
 * Get the host data for livereload
 *
 * @private
 * @param {String} req - request
 */
function getHostData(req) {
  let livereloadPort = config.server.livereloadPort;
  const host = req.get('Host');
  if (host.indexOf(':') > 0) {
    livereloadPort = parseInt(host.split(':')[1], 10) + 1;
  }
  return {
    environment: process.env.NODE_ENV,
    hostname: req.hostname,
    livereloadPort: livereloadPort
  };
}
