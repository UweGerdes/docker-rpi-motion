/**
 * Test for motion data model
 */

'use strict';

const assert = require('assert');
const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('motion/tests/model/model.js', () => {
  it('should have startMotion', () => {
    assert.notEqual(model.startMotion, null);
  });
  it('should have stopMotion', () => {
    assert.notEqual(model.stopMotion, null);
  });
  it('should have isRunning', () => {
    assert.notEqual(model.isRunning, null);
  });
  it('should not run', () => {
    model.isRunning().then(running => {
      assert.equal(running, false);
    });
  });
  it('should start motion', () => {
    model.startMotion().then(running => {
      assert.equal(running, true);
    });
  });
  it('should stop motion', () => {
    model.stopMotion().then(wasRunning => {
      assert.equal(wasRunning, false);
    });
  });
});
