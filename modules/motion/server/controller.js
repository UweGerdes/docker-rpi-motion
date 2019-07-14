/**
 * Controller for motion
 *
 * @module motion/controller
 * @requires modules/motion/server/model
 * @requires module:lib/config
 */

'use strict';

const express = require('express'),
  path = require('path'),
  SocketIo = require('socket.io'),
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
 * Render index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  let data = Object.assign({
    eventList: model.getEventList()
  },
  req.params,
  config.getData(req),
  viewRenderParams);
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * Render index page with image
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const image = (req, res) => {
  let data = Object.assign({
    eventList: model.getEventList(),
    image: req.params.image
  },
  req.params,
  config.getData(req),
  viewRenderParams);
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * Render index page with video
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const video = (req, res) => {
  let data = Object.assign({
    title: 'Motion',
    eventList: model.getEventList(),
    video: req.params.video
  },
  req.params,
  config.getData(req),
  viewRenderParams);
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * Run command
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
 * Serve static capture files
 *
 * @param {object} app - express app
 */
const useExpress = (app) => {
  app.use('/motion/capture', express.static('capture'));
};

/**
 * Use server and httpsServer for socket
 *
 * @param {object} server - express instance
 * @param {object} httpsServer - httpsServer instance
 */
const connectServer = (server, httpsServer) => {
  io = new SocketIo({ path: '/motion/socket.io' });
  io.attach(server);
  io.attach(httpsServer);
  io.sockets.on('connection', function (newSocket) {
    socket = newSocket;
    socket.on('startMotion', async () => {
      const started = await model.startMotion();
      const isRunning = await model.isRunning();
      socket.emit('status', { wasRunning: started, isRunning: isRunning });
    });
    socket.on('stopMotion', async () => {
      const wasRunning = await model.isRunning();
      const stopped = await model.stopMotion();
      const isRunning = await model.isRunning();
      socket.emit('status', { wasRunning: wasRunning, stopped: stopped, isRunning: isRunning });
    });
    socket.on('isRunning', async () => {
      const isRunning = await model.isRunning();
      socket.emit('status', { isRunning: isRunning });
    });
  });
};

module.exports = {
  index: index,
  image: image,
  video: video,
  run: run,
  useExpress: useExpress,
  connectServer: connectServer
};
