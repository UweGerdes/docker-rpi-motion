/**
 * Test for motion page elements
 */

'use strict';

const socketURL = 'http://0.0.0.0:8080';

const io = require('socket.io-client'),
  assert = require('chai').assert,
  options = {
    transports: ['websocket'],
    'force new connection': true
  };

describe('motion/tests/server/socket.io.js', function () {
  describe('socket', function () {
    it('should send stopMotion and receive status isRunning=false', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('stopMotion');
      });
      client.on('status', function(data) {
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send isRunning and receive status isRunning=false', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('isRunning');
      });
      client.on('status', function(data) {
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send startMotion and receive status wasRunning=false, isRunning=true', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('startMotion');
      });
      client.on('status', function(data) {
        assert.equal(data.wasRunning, false, 'wasRunning');
        assert.equal(data.isRunning, true, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send isRunning and receive status isRunning=true', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('isRunning');
      });
      client.on('status', function(data) {
        assert.equal(data.isRunning, true, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send startMotion and receive status wasRunning=true, isRunning=true', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('startMotion');
      });
      client.on('status', function(data) {
        assert.equal(data.wasRunning, true, 'wasRunning');
        assert.equal(data.isRunning, true, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send isRunning and receive status isRunning=true', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('isRunning');
      });
      client.on('status', function(data) {
        assert.equal(data.isRunning, true, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send stopMotion and receive status wasRunning=true, isRunning=false', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('stopMotion');
      });
      client.on('status', function(data) {
        assert.equal(data.wasRunning, true, 'wasRunning');
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
      client.on('connect_timeout', (timeout) => {
        console.log('connect_timeout reached', timeout);
        client.disconnect();
        done();
      });
    });
    it('should send stopMotion and receive status wasRunning=false, isRunning=false', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('stopMotion');
      });
      client.on('status', function(data) {
        assert.equal(data.wasRunning, false, 'wasRunning');
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send isRunning and receive status isRunning=false', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('isRunning');
      });
      client.on('status', function(data) {
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
    });
  });
});
