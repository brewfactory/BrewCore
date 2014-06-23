/**
 * Provides routing for the express application
 *
 * @module routing
 **/

'use strict';

/**
 * Set Brew
 *
 * @method setPWM
 * @param {Brewer} Brewer
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
module.exports.setBrew = function (Brewer, req, res) {
  var name = req.param('name') || '',
    startTime = req.param('startTime') || new Date(),
    phases = req.param('phases') || [];

  // Set new Brew
  Brewer.setBrew(name, phases, startTime);

  res.json({
    status: 'ok'
  });
};


/**
 * Stop Brew
 *
 * @method stopBrew
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
module.exports.cancelBrew = function (Brewer, req, res) {
  Brewer.cancelBrew();

  res.json({
    status: 'ok'
  });
};


/**
 * Pause Brew
 *
 * @method pauseBrew
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
module.exports.pauseBrew = function (Brewer, req, res) {
  var paused = Brewer.setPaused();

  Brewer.emitBrewChanged();

  res.json({
    status: 'ok',
    paused: paused
  });
};