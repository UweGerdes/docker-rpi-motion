/**
 * receive events from server and emit actions
 *
 * @module motion/socket-events
 */

'use strict';

let socket = io({ path: '/motion/socket.io/' });

let statusElements = { };
let enabledElements = { };
let eventElements = { };

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
  eventElements.status = document.querySelectorAll('[data-status]');
  eventElements.enabled = document.querySelectorAll('[data-enabled]');
  eventElements.content = document.querySelectorAll('[data-content]');
  socket.emit('isRunning');
  socket.emit('getDetectionStatus');
  scrollList();
}

socket.on('connect', () => {
  console.log('connected to ', socket.id);
});

socket.on('connect_error', (error) => {
  console.log('connect_error:', error.message);
});

socket.on('status', (data) => {
  if ('isRunning' in data) {
    statusElements.isRunning.forEach(element => {
      if (data.isRunning) {
        element.classList.add('running');
      } else {
        element.classList.remove('running');
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
  if ('detectionStatus' in data) {
    console.log(data.detectionStatus);
    statusElements.detectionStatus.forEach(element => {
      if (data.detectionStatus === 'active') {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
    eventElements.content.forEach(element => {
      if (element.dataset.content === 'detectionStatus') {
        element.textContent = data.detectionStatus;
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
