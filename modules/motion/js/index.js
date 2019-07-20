/**
 * receive events from server and emit actions
 *
 * @module motion/socket-events
 */

'use strict';

let socket = io({ path: '/motion/socket.io' });

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
  scrollList();
}

socket.on('connect', () => {
  // console.log('connected');
});

socket.on('connect_error', (error) => {
  console.log('connect_error', error);
});

socket.on('status', (data) => {
  if ('isRunning' in data) {
    statusElements.isRunning.forEach(element => {
      element.dataset.isRunning = data.isRunning;
      if (data.isRunning) {
        element.classList.add('running');
        element.classList.remove('stopped');
      } else {
        element.classList.add('stopped');
        element.classList.remove('running');
      }
    });
    enabledElements.isRunning.forEach(element => {
      element.dataset.isRunning = data.isRunning;
      if (data.isRunning) {
        element.disabled = false;
      } else {
        element.disabled = true;
      }
    });
    enabledElements['!isRunning'].forEach(element => {
      element.dataset.isRunning = data.isRunning;
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
  if (statusElements[element.dataset.status] === undefined) {
    statusElements[element.dataset.status] = [];
  }
  statusElements[element.dataset.status].push(element);
}

function addEnabledElement(element) {
  if (enabledElements[element.dataset.enabled] === undefined) {
    enabledElements[element.dataset.enabled] = [];
  }
  enabledElements[element.dataset.enabled].push(element);
}

function scrollList() {
  const list = document.querySelector('.eventList-container');
  const item = document.querySelector('#item-' + document.location.href.replace(/.+\//, ''));
  if (list && item) {
    list.scroll(0, Math.max(0, item.offsetTop - 4 * item.offsetHeight - 10));
  }
}
