/*
 * Brewer index
 *
 */

var Brewer = require('./Brewer');

exports.init = Brewer.init;
exports.getProgress = Brewer.getProgress;
exports.cancelBrew = Brewer.cancelBrew;
exports.setPaused = Brewer.setPaused;
exports.setBrew = Brewer.setBrew;
exports.getActualBrew = Brewer.getActualBrew;
exports.onTempUpdate = Brewer.onTempUpdate;
