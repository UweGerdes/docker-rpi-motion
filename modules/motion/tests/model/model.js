/**
 * Test for motion data model
 */

'use strict';

const assert = require('assert');
const model = require('../../server/model.js');

function delay(t, val) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val);
    }, t);
  });
}

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
  it('should not run', async () => {
    const isRunning = await model.isRunning();
    assert.equal(isRunning, false);
  });
  it('should not be stopped if not there', async () => {
    const wasRunning = await model.stopMotion();
    assert.equal(wasRunning, false);
  });
  it('should start motion', async () => {
    const isRunning = await model.startMotion();
    assert.equal(isRunning, true);
  });
  it('should run', async () => {
    const isRunning = await model.isRunning();
    assert.equal(isRunning, true);
  });
  it('should stop motion', async () => {
    const wasRunning = await model.stopMotion();
    assert.equal(wasRunning, true);
  });
  it('should not run', async () => {
    await delay(3000);
    let isRunning = await model.isRunning();
    assert.equal(isRunning, false);
  });
});
