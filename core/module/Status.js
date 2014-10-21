var FREQUENCY = process.env.STATUS_FREQ ? parseInt(process.env.STATUS_FREQ, 10) : 30000;

var brewer = require('../brewer');
var temperature = require('../temperature');
var device = require('../device');

var Brew = require('../../schema/Brew');
var Logger = require('../module/Logger');
var LOG = 'Status';

var interval;


/**
 * Status of the system
 * save to database
 *
 * @method report
 * @param {Object} options
 */
function report(options) {
  options = options || {};

  if (!options.id) {
    throw new Error('Id is required');
  }

  Brew.findByIdAndUpdate(options.id,
    {$push: {logs: {temp: options.temp, pwm: options.pwm}}},
    {safe: true},
    function (err) {
      if(err) {
        return Logger.error('Save status', LOG, {err: err});
      }
    }
  );
}


/*
 * Init
 *
 * @method init
 */
function init() {
  interval = setInterval(function () {
    var brew = brewer.getActualBrew();

    if (!brew.id) {
      return;
    }

    report({
      id: brew.id,
      temp: temperature.getActual(),
      pwm: device.getPWM()
    });

  }, FREQUENCY);
}


// Public
exports.init = init;
