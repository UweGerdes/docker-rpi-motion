/**
 * receive events from server and emit actions
 *
 * @module motion/socket-events
 */

'use strict';

let socket = io();

let statusElements = { };
let enabledElements = { };

window.addEventListener('load', documentLoaded);

function documentLoaded() {
  const emitterElements = document.querySelectorAll('[data-emit]');
  emitterElements.forEach((element) => {
    addEmitter(element);
  });
  const statusElements = document.querySelectorAll('[data-status]');
  statusElements.forEach((element) => {
    addStatusElement(element);
  });
  const enabledElements = document.querySelectorAll('[data-enabled]');
  enabledElements.forEach((element) => {
    addEnabledElement(element);
  });
  socket.emit('isRunning');
}

socket.on('connect', () => {
  // console.log('connected');
});

socket.on('connect_error', (error) => {
  console.log('connect_error', error);
});

socket.on('status', (data) => {
  // console.log('status', data);
  if ('isRunning' in data) {
    statusElements.isRunning.forEach(element => {
      element.dataset.isRunning = data.isRunning;
      if (data.isRunning) {
        element.innerText = 'running';
      } else {
        element.innerText = 'stopped';
      }
    });
    enabledElements.isRunning.forEach(element => {
      if (data.isRunning) {
        element.disabled = false;
      } else {
        element.disabled = true;
      }
    });
    enabledElements['!isRunning'].forEach(element => {
      if (data.isRunning) {
        element.disabled = true;
      } else {
        element.disabled = false;
      }
    });
  }
});

function addEmitter(element) {
  element.addEventListener('click', () => {
    socket.emit(
      element.dataset.emit
    );
  });
}

function addStatusElement(element) {
  console.log('add', element);
  if (statusElements[element.dataset.status] === undefined) {
    statusElements[element.dataset.status] = [];
  }
  statusElements[element.dataset.status].push(element);
}

function addEnabledElement(element) {
  console.log('enabled', element);
  if (enabledElements[element.dataset.enabled] === undefined) {
    enabledElements[element.dataset.enabled] = [];
  }
  enabledElements[element.dataset.enabled].push(element);
}
