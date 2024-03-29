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
  { Server } = require('socket.io'),
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
  const eventList = model.getEventList();
  let data = Object.assign(
    {
      eventList: Object.values(eventList)
    },
    req.params,
    config.getData(req),
    viewRenderParams
  );
  res.render(path.join(viewBase, 'index.pug'), data);
};

/**
 * Render index page with image or video
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const show = (req, res) => {
  const eventList = model.getEventList();
  let data = Object.assign(
    {
      eventList: Object.values(eventList),
      eventShow: req.params.eventShow,
      show: req.params.show
    },
    req.params,
    config.getData(req),
    viewRenderParams
  );
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
  model[req.params.command]().then((result) => {
    res.send({ data: result });
  }).catch((error) => {
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
 * Use httpServer and httpsServer for socket
 *
 * @param {object} httpServer - express instance
 * @param {object} httpsServer - httpsServer instance
 */
const connectServer = (httpServer, httpsServer) => {
  io = new Server({ path: '/motion/socket.io/', allowEIO3: true });
  io.attach(httpServer);
  io.attach(httpsServer);
  io.on('connection', function (newSocket) {
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
    socket.on('getDetectionStatus', async () => {
      socket.emit('status', { detectionStatus: await model.getDetectionStatus() });
    });
    socket.on('startDetection', async () => {
      socket.emit('status', { detectionStatus: await model.setDetectionStatus('start') });
    });
    socket.on('stopDetection', async () => {
      socket.emit('status', { detectionStatus: await model.setDetectionStatus('pause') });
    });
  });
};

module.exports = {
  index: index,
  show: show,
  run: run,
  useExpress: useExpress,
  connectServer: connectServer
};
