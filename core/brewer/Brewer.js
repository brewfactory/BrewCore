/**
 * Brewing module
 * manage phases
 *
 * @module Brewer
 **/


var schedule = require('node-schedule');

var Logger = require('./../module/Logger');
var LOG = 'Brewer';

// dependencies
var temperature = require('../temperature');
var coreEvent = require('../event');

var _actualBrew;
var _prevPhase;
var _actualPhase;

// private fns
var resetActualBrew;
var brewChanged;
var endBrew;
var startNextPhase;
var activateActualPhase;

var BOILING_TOLERATED_TEMP = 99;


/**
 * Initialize
 *
 * @method init
 */
exports.init = function () {
  resetActualBrew();

  Logger.info('Brewer is successfully initialized', LOG);
};


/**
 * Get Brew progress
 *
 * @method getProgress
 * @return {Boolean}
 */
exports.getProgress = function () {
  return _actualBrew && _actualBrew.inProgress;
};


/**
 * Cancel brew
 *
 * @method cancelBrew
 */
exports.cancelBrew = function () {
  endBrew();
};


/**
 * Reset actual brew
 *
 * @method resetActualBrew
 */
resetActualBrew = function () {

  // Cancel jobs
  if (_actualBrew && _actualBrew.jobs) {
    _actualBrew.jobs.forEach(function (job) {
      job.cancel();
    });
  }

  // Reset actual brew
  _actualBrew = {
    name: null,
    startTime: null,
    jobs: [],
    phases: [],
    inProgress: false,
    paused: false
  };

  // Reset phase (actual, previous)
  _actualPhase = null;
  _prevPhase = null;

  // Emit brew ended
  coreEvent.brewer.ended();

  brewChanged();
};


/**
 * End actual brew
 *
 * @method endBrew
 */
endBrew = function () {

  // log
  Logger.info('Brew ended', LOG, {
    name: _actualBrew.name,
    date: new Date()
  });

  // Reset
  resetActualBrew();

  // Set point temp
  temperature.setPointToInactive();

  // Emit brew change
  brewChanged();
};


/**
 * Brew changed
 *
 * @method brewChanged
 */
brewChanged = function () {
  var pureActualBrew = {
    name: _actualBrew.name,
    startTime: _actualBrew.startTime,
    inProgress: _actualBrew.inProgress,
    paused: _actualBrew.paused,
    phases: _actualBrew.phases.map(function (phase) {
      return {
        min: phase.min,
        temp: phase.temp,
        jobEnd: phase.jobEnd || null,
        inProgress: phase.inProgress,
        tempReached: phase.tempReached
      };
    })
  };

  // Notify EventDispatcher module
  coreEvent.brewer.brewChanged(pureActualBrew);
};


/**
 * Set paused state
 * Pause the actual phase and save the state for restore
 * Restore paused state
 *
 * @method resetActualBrew
 * @return {Boolean} state of actual brew
 */
exports.setPaused = function () {
  var pauseDiff;

  _actualBrew.paused = !_actualBrew.paused;

  // event
  coreEvent.brewer.statusChanged(_actualBrew.paused);

  // Temp didn't be reached
  if (_actualPhase.inProgress === true && _actualPhase.tempReached === false) {
    if (_actualBrew.paused === true) {

      Logger.info('Paused', LOG, {
        name: _actualBrew.name,
        holdTemp: temperature.getActual()
      });

      temperature.setPoint(temperature.getActual());
    } else {

      Logger.info('Resumed', LOG, {
        name: _actualBrew.name
      });

      temperature.setPoint(_actualPhase.temp);
    }
  }

  // Temp was reached
  else if (_actualPhase.inProgress === true && _actualPhase.tempReached === true) {
    if (_actualBrew.paused) {
      _actualPhase.pausedAt = new Date();
      _actualPhase.job.cancel();

      // Hold actual temp
      temperature.setPoint(temperature.getActual());

      // log
      Logger.info('Paused', LOG, {
        name: _actualBrew.name
      });

    } else {
      pauseDiff = new Date().getTime() - _actualPhase.pausedAt.getTime();

      _actualPhase.jobEnd.setTime(_actualPhase.jobEnd.getTime() + pauseDiff);
      _actualPhase.job = schedule.scheduleJob(_actualPhase.jobEnd, startNextPhase);
      _actualBrew.jobs.push(_actualPhase.job);

      // Restore point temperature
      temperature.setPoint(_actualPhase.temp);

      // log
      Logger.info('Resumed', LOG, {
        name: _actualBrew.name,
        wait: pauseDiff
      });
    }
  }

  // Emit brew changed
  brewChanged();

  return _actualBrew.paused;
};


/**
 * Set new brew
 *
 * @method setBrew
 * @param {String} name
 * @param {Array} phases
 * @param {Date} startTime as Date str
 */
exports.setBrew = function (name, phases, startTime) {

  // cancel earlier
  endBrew();

  // set actual
  _actualBrew.name = name;
  _actualBrew.phases = phases;
  _actualBrew.startTime = new Date(startTime);

  // Set default phases
  _actualBrew.phases = _actualBrew.phases.map(function (phase) {
    phase.inProgress = false;
    phase.tempReached = false;

    return phase;
  });

  Logger.info('set brew', LOG, {
    name: _actualBrew.name,
    phases: _actualBrew.phases,
    startTime: _actualBrew.startTime
  });

  if (_actualBrew.startTime <= new Date()) {
    startNextPhase();
  } else {
    _actualBrew.jobs.push(schedule.scheduleJob(_actualBrew.startTime, startNextPhase));
  }

  // Emit brew change
  brewChanged();
};


/**
 * Get actual brew
 *
 * @method getActualBrew
 */
exports.getActualBrew = function () {
  return _actualBrew;
};


/**
 * Start the next phase
 *
 * @method startNextPhase
 */
startNextPhase = function () {
  var actualIdx = _actualBrew.phases.indexOf(_actualPhase);
  var phasesLength = _actualBrew.phases.length;

  _actualBrew.inProgress = true;

  if (_actualPhase) {
    _prevPhase = _actualPhase;
    _prevPhase.inProgress = false;
    _prevPhase.job.cancel();
    _prevPhase.job = null;

    coreEvent.brewer.phaseChanged({ status: 'ended' });

    Logger.info('stop phase', LOG, {phase: _prevPhase});
  }

  // start new phase
  if (phasesLength - 1 > actualIdx) {
    _actualPhase = _actualBrew.phases[actualIdx + 1];
    _actualPhase.tempReached = false;
    _actualPhase.inProgress = true;

    // Set point temperature
    temperature.setPoint(_actualPhase.temp);

    // log
    Logger.info('start phase', LOG, _actualPhase);

    // Emit brew change
    brewChanged();
  }

  // no more phase left
  else {
    // End brew
    endBrew();
  }
};


/**
 * Called from external by the EventDispatcher module
 * Fires when temperature updated
 *
 * @method onTempUpdate
 */
exports.onTempUpdate = function (temp) {
  var isHeating;
  var isCooling;
  var isBoiling;

  // prev phase temp
  if (!_prevPhase) {
    _prevPhase = _prevPhase || {};
    _prevPhase.temp = temp;
  }

  // actual phase
  if (!_actualBrew.paused && _actualPhase && !_actualPhase.tempReached) {

    // Log wait
    Logger.wait(5000, 'temp waiting', LOG, {
      actualTemp: temp,
      waitForTemp: _actualPhase.temp
    });

    isHeating = _prevPhase.temp <= _actualPhase.temp;
    isCooling = _prevPhase.temp >= _actualPhase.temp;
    isBoiling = 100 === _actualPhase.temp;

    // Heating
    if (temp >= _actualPhase.temp && isHeating) {
      Logger.info('Temp reached for the phase', LOG, {mode: 'heating'});

      activateActualPhase();
    }

    // Heating: Boiling
    else if (isBoiling && temp >= BOILING_TOLERATED_TEMP && isHeating) {
      Logger.info('Temp reached for the phase', LOG, {mode: 'heating'});

      activateActualPhase();
    } else if (temp < _actualPhase.temp && isHeating) {
      Logger.silly('Heating necessary to reach the phase temp', LOG, {mode: 'heating'});
    }

    // Wait for cool
    else if (temp <= _actualPhase.temp && isCooling) {
      Logger.info('Temp reached for the phase', LOG, {mode: 'cooling'});

      activateActualPhase();
    } else if (temp > _actualPhase.temp && isCooling) {
      Logger.silly('Cooling necessary to reach the phase temp', LOG, {mode: 'cooling'});
    }

  }

};


/**
 * Set the actual phase to the active phase
 *
 * @method activateActualPhase
 */
activateActualPhase = function () {

  // Change state of the actual phase
  _actualPhase.tempReached = true;

  // Log
  Logger.info('activate phase', LOG, _actualPhase);

  // schedule phase end trigger
  _actualPhase.jobEnd = new Date();
  _actualPhase.jobEnd.setMinutes(_actualPhase.jobEnd.getMinutes() + _actualPhase.min);
  _actualPhase.job = schedule.scheduleJob(_actualPhase.jobEnd, startNextPhase);
  _actualBrew.jobs.push(_actualPhase.job);

  brewChanged();
};
