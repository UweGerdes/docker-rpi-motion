/**
 * scripts for event handling by data attributes
 */
'use strict';

/* jshint browser: true */

let dataHandler = {};

/**
 * click for xhttp request and use handler for result
 */
dataHandler['data-click-xhr'] = {
  elements: document.querySelectorAll('[data-click-xhr]'),
  event: 'click',
  func: function (event) { // jscs:ignore jsDoc
    const element = event.target;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // jscs:ignore jsDoc
      if (this.readyState == 4) {
        if (this.status == 200) {
          if (element.hasAttribute('data-click-xhr-result')) {
            const fn = element.getAttribute('data-click-xhr-result');
            if (dataHandler[fn]) {
              dataHandler[fn](this.responseText);
            } else {
              console.log('handler not found: ' + fn);
            }
          } else {
            console.log('attribute data-click-xhr-result missing in: ', element);
          }
        }
      }
    };
    xhttp.open('GET', element.getAttribute('data-click-xhr'), true);
    xhttp.send();
  }
};

/**
 * attach event to elements
 *
 * @param {DOMelement} element - to attach event
 * @param {string} event - type
 * @param {function} handler - event handler
 */
function attachEventHandler(element, event, handler) {
  if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  } else if (element.addEventListener) {
    element.addEventListener(event, handler, false);
  } else {
    element.addEventListener(event, handler, false);
  }
}

/**
 * attach event handlers
 */
Object.values(dataHandler).forEach((handler) => { // jscs:ignore jsDoc
  handler.elements.forEach((element) => { // jscs:ignore jsDoc
    attachEventHandler(element, handler.event, handler.func);
  });
});
