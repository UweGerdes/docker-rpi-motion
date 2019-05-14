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
  describe('GET /motion/', function () {
    it('should send isRunning and receive status message', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('isRunning');
      });
      client.on('status', function(data) {
        console.log('isRunning status', data);
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
    });
    it('should send stopMotion and receive status message', function (done) {
      const client = io.connect(socketURL, options);
      client.on('connect', function() {
        client.emit('stopMotion');
      });
      client.on('status', function(data) {
        console.log('stopMotion status', data);
        assert.equal(data.stopMotion, false, 'stopMotion');
        assert.equal(data.isRunning, false, 'isRunning');
        client.disconnect();
        done();
      });
    });
  });
});
