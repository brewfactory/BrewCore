var Brew = require('../../schema/Brew');

/*
 * Find
 *
 * @method find
 */
exports.find = function () {
  return new Promise(function (resolve, reject) {
    Brew
      .find({}, { name: 1, startTime: 1 })
      .exec()
      .then(function (brews) {
        resolve({ brews: brews });
      }, reject);
  });
};


/*
 * Find one
 *
 * @method findOne
 * @param {Object} options
 */
exports.findOne = function (options) {
  return new Promise(function (resolve, reject) {
    Brew
      .findOne({ _id: options.id })
      .exec()
      .then(function (brew) {
        resolve({ brews: brew });
      }, reject);
  });
};
