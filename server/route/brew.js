/**
 * Provides routing for the express application
 *
 * @module routing
 **/

var Brewer = require('../../core/brewer');


/**
 * Set Brew
 *
 * @method setPWM
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
exports.setBrew = function (req, res) {
  var name = req.param('name') || '';
  var startTime = req.param('startTime') || new Date();
  var phases = req.param('phases') || [];

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
exports.cancelBrew = function (req, res) {
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
exports.pauseBrew = function (req, res) {
  var paused = Brewer.setPaused();

  Brewer.emitBrewChanged();

  res.json({
    status: 'ok',
    paused: paused
  });
};
