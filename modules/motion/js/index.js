/**
 * receive events from server and emit actions
 *
 * @module motion/socket-events
 */

'use strict';

var socket = io();

window.addEventListener('load', documentLoaded);

function documentLoaded() {
  const emitterElements = document.querySelectorAll('[data-emit]');
  emitterElements.forEach((element) => {
    addEmitter(element);
  });
}

socket.on('connect', () => {
  // console.log('connected');
});

socket.on('connect_error', (error) => {
  console.log('connect_error', error);
});

socket.on('status', (data) => {
  console.log('status', data);
});

function addEmitter(element) {
  element.addEventListener('click', () => {
    socket.emit(
      element.dataset.emit,
      JSON.parse(
        element.dataset.data
          .replace(/'/g, '"')
          .replace(/([A-Za-z0-9_-]+):/g, '"$1":')
      )
    );
  });
}
