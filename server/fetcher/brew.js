var brewResource = require('../resources/brew');

/*
 * Create
 *
 * @method create
 * @param {Object} brew
 * @callback
 */
exports.create = function (brew) {

  // Promise
  return brewResource.create({ brew: brew });
};


/*
 * Stop
 *
 * @method stop
 * @callback
 */
exports.stop = function () {

  // Promise
  return brewResource.stop();
};


/*
 * Pause
 *
 * @method pause
 * @callback
 */
exports.pause = function () {

  // Promise
  return brewResource.pause();
};
