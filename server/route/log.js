/**
 * Provides routing for the express application
 *
 * @module routing
 **/

'use strict';



/**
 * Find brew logs
 *
 * @method findBrewLogs
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 * @param {Function} next Express Function
 */
module.exports.findBrewLogs = function (LogModel, req, res, next) {
  LogModel.findBrews(function (err, result) {

    // err
    if (err) {
      return next(err);
    }

    res.json(result);
  });
};


/**
 * Find one brew log
 *
 * @method findBrewLogs
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 * @param {Function} next Express Function
 */
module.exports.findOneBrewLog = function (LogModel, req, res, next) {
  var brew = req.param('brew');

  // err: brew
  if (!brew) {
    return next(new Error('Undefined brew'));
  }

  LogModel.findOneBrew(brew, function (err, result) {

    // err
    if (err) {
      return next(err);
    }

    res.json(result);
  });
};
