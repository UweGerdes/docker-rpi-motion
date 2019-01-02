/**
 * ## Controller for motion
 *
 * @module motion/controller
 */

'use strict';

const path = require('path'),
  socketIo = require('socket.io'),
  config = require('../../../lib/config'),
  model = require('./model.js');
const viewBase = path.join(path.dirname(__dirname), 'views');

const viewRenderParams = {
  // model data
  // view helper functions
};

let socket,
  io;

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

/**
 * ### set express for socket
 *
 * @param {object} app - express instance
 */
const setExpress = (server) => {
  io = socketIo(server);
  io.sockets.on('connection', function (newSocket) {
    console.log('socket.io incoming connection');
    socket = newSocket;
    socket.on('startMotion', async () => {
      console.log('socket.io startMotion');
      const started = await model.startMotion();
      socket.emit('status', started);
    });
    socket.on('stopMotion', async () => {
      console.log('socket.io stopMotion');
      const stopped = await model.stopMotion();
      socket.emit('status', stopped);
    });
    socket.on('isRunning', async () => {
      const isRunning = await model.isRunning();
      console.log('socket.io isRunning', isRunning);
      socket.emit('status', { isRunning: isRunning });
    });
    socket.on('setValue', (data) => {
      console.log('socket.io setValue', data);
    });
  });
};

module.exports = {
  index: index,
  run: run,
  setExpress: setExpress
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
