var core = require('../../core');

/*
 * Read
 *
 * @method read
 */
exports.read = function () {
  return new Promise(function (resolve) {
    var actualBrew = core.brew.get();

    var brew = {
      id: actualBrew.id,
      name: actualBrew.name,
      startTime: actualBrew.startTime,
      phases: actualBrew.phases.map(function (phase) {
        return {
          min: phase.min,
          temp: phase.temp,
          inProgress: phase.inProgress,
          tempReached: phase.tempReached,
          jobEnd: phase.jobEnd
        };
      }),
      inProgress: actualBrew.inProgress,
      paused: actualBrew.paused
    };

    resolve(brew);
  });
};
