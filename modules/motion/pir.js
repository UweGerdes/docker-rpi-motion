'use strict';

const Gpio = require('onoff').Gpio, // include onoff to interact with the GPIO
  log = require('../../lib/log.js');

const pirSensor = new Gpio(14, 'in', 'both'); // use GPIO pin 12 as input, and 'both' button presses, and releases should be handled

pirSensor.watch(function (err, value) { // Watch for hardware interrupts on pirSensor GPIO, specify callback function
  if (err) { // if an error
    console.error('There was an error', err); // output error message to console
    return;
  }
  log.info('PIR ' + value);
});

log.info('PIR started');

function unexportOnClose() { // function to run when exiting program
  pirSensor.unexport(); // Unexport PIR GPIO to free resources
  log.info('PIR stopped');
}

process.on('SIGINT', unexportOnClose); // function to run when user closes using ctrl+c
