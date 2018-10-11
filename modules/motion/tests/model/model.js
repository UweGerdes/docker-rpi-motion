/**
 * Test for motion data model
 */
'use strict';

const assert = require('assert')
  ;

const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('motion API', () => {
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
    assert.equal(model.isRunning(), false);
  });
  it('should start motion', () => {
    model.startMotion();
    assert.equal(model.isRunning(), true);
  });
  it('should stop motion', () => {
    model.stopMotion();
    assert.equal(model.isRunning(), false);
  });
});
