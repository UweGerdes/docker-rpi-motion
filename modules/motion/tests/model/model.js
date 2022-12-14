/**
 * Test for motion data model
 */

'use strict';

const assert = require('assert');
const model = require('../../server/model.js');

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
    const wasRunning = await model.startMotion();
    assert.equal(wasRunning, false);
  });
  it('should run', async () => {
    const isRunning = await model.isRunning();
    assert.equal(isRunning, true);
  });
  /*
  it('should start motion again', async () => {
    const wasRunning = await model.startMotion();
    assert.equal(wasRunning, true);
  });
  it('should run', async () => {
    const isRunning = await model.isRunning();
    assert.equal(isRunning, true);
  });
  it('detection paused', async () => {
    const status = await model.getDetectionStatus();
    assert.equal(status, 'pause');
  });
  it('detection start', async () => {
    const status = await model.setDetectionStatus('start');
    assert.equal(status, 'active');
  });
  it('detection stop', async () => {
    const status = await model.setDetectionStatus('pause');
    assert.equal(status, 'pause');
  });
  */
  it('should stop motion', async () => {
    const wasRunning = await model.stopMotion();
    assert.equal(wasRunning, true);
  });
  it('should not run', async () => {
    let isRunning = await model.isRunning();
    assert.equal(isRunning, false);
  });
});
