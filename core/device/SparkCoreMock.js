/*
 * SparkCore
 *
 * @module SparkCore
 */

var events = require('events');
var coreEmitter = new events.EventEmitter();

var PIDController = require('liquid-pid');

var Logger = require('../module/Logger');
var LOG = 'SparkCoreMock';

var pwm = 0;
var pointTemp = 25;

var cWater = 4183.2;                                      // Heat capacity J/(kg*°C)
var m = 40.0;                                             // Weigh of the water (kg)
var Ta = 20;                                              // Temperature of the environment (your room, etc.) (°C)
var Rth = 0.024;                                          // Thermal conductivity, total thermal resistance between
var deltaT;                                               // Delta temperature
var T0 = 20;                                              // Start temperature of the water (°C)
var temp = T0;                                            // Actual temperature of the water (°C)
var dt;

var pidController;

var PMAX = 4000;

var INTERVAL_TEMP = 1000;
var INTERVAL_PWM = 1000;

pidController = new PIDController({
  Kp: 25,
  Ki: 1000,
  Kd: 9,
  temp: {
    ref: T0,
    Pmax: PMAX
  }
});

var connected = false;

var core1;


/*
 * Initialize
 *
 * @method init
 */
exports.init = function () {
  var core1Emit;

  core1 = new events.EventEmitter();

  core1Emit = core1.emit;

  // Pipe emitter
  // FIXME: anything better?
  core1.emit = function() {
    var args = Array.prototype.slice.call(arguments);

    // Original
    core1Emit.apply(core1, args);

    // Root emitter
    coreEmitter.emit.apply(coreEmitter, args);
  };

  // Fake connect
  core1.emit('connect');
};


/*
 * Calculate temp
 *
 * @method calculateTemp
 * @param {Number} _pwm
 * @param {Date} date
 */
function calculateTemp(_pwm, date) {
  var deltaTime = date || new Date();
  deltaTime = deltaTime.getTime();

  pwm = _pwm || pwm;

  if (dt) {
    deltaTime = deltaTime - dt.getTime();
    deltaTime /= 1000;

    // Delta Temperature in the k. step
    deltaT = (pwm - (temp - Ta) / Rth) * deltaTime / (cWater * m);
    temp += deltaT;
  }

  dt = new Date();
}


/*
 * Calculate pwm
 *
 * @method calculatePWM
 */
function calculatePWM() {
  pwm = pidController.calculate(temp);
}


/*
 * Set point
 *
 * @method setPoint
 * @param {String} pointStr
 * @callback
 */
exports.setPoint = function (pointStr, callback) {
  if (connected === false) {
    return;
  }

  pointTemp = Number(pointStr);

  pidController.setPoint(pointTemp);

  Logger.info('setPoint to core1', LOG, { point: pointStr });
};


/*
 * Init fake events
 *
 * @method initFakeEvents
 */
function initFakeEvents() {
  // Temp info interval
  setInterval(function () {
    calculateTemp();

    core1.emit('tempInfo', { data: temp });
  }, INTERVAL_TEMP);


// PWM info interval
  setInterval(function () {
    calculatePWM();

    core1.emit('pwmInfo', { data: (pwm / PMAX) * 100 });
  }, INTERVAL_PWM);
}


/*
 * Events
 *
 */

// Connect
coreEmitter.on('connect', function () {
  connected = true;

  console.log('connect');

  initFakeEvents();
});

// Error
coreEmitter.on('error', function (err) {
  Logger.error('Error happened', LOG, {
    err: err
  });
});

exports.coreEmitter = coreEmitter;
