/**
 * scripts for motion
 */
'use strict';

/* jshint browser: true */
/* globals registerHandler */

/**
 * handler for motion-start-result
 */
registerHandler('motion-start-result', (result) => { // jscs:ignore jsDoc
  console.log('result', result);
});
