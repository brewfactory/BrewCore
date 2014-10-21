/**
 * Brew routing
 *
 * @routing brew
 **/

var core = require('../../core');
var Brew = require('../../schema/Brew');


/**
 * Create
 *
 * @method create
 * @param {Function} next
 */
exports.create = function *(next) {
  var body = this.request.body;
  var name = body.name;
  var startTime = body.startTime || new Date();
  var phases = body.phases || [];
  var brew;

  if (!name) {
    this.throw(403, 'Name is required');
  }

  // Create brew
  try {
    brew = yield Brew
      .create({
        name: name,
        phases: phases,
        startTime: startTime
      });
  } catch (err) {
    console.error(err);
    this.throw(500);
  }

  // Set new Brew
  core.brew.set({
    id: brew._id,
    name: name,
    phases: phases.map(function (phase) {
      return {
        min: phase.min,
        temp: phase.temp
      };
    }),
    startTime: startTime
  });

  // Res
  yield next;
  this.body = {
    status: 'ok'
  };
};


/**
 * Stop
 *
 * @method stop
 * @param {Function} next
 */
exports.stop = function *(next) {
  core.brew.cancel();

  // Res
  yield next;
  this.body = {
    status: 'ok'
  };
};


/**
 * Pause
 *
 * @method pause
 * @param {Function} next
 */
exports.pause = function *(next) {
  var paused = core.brew.pause();

  // Res
  yield next;
  this.body = {
    status: 'ok',
    paused: paused
  };
};
