/**
 * scripts for motion
 */

'use strict';

/* globals registerHandler */

/**
 * handler for motion-start-result
 */
registerHandler('motion-start-result', (result) => { // jscs:ignore jsDoc
  console.log('result', result);
});
