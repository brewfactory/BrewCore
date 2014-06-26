/*
 * Event index
 *
 */

var Event = require('./Event');

exports.brewer = {};

exports.brewer.brewChanged = Event.brewer.brewChanged;
exports.brewer.ended = Event.brewer.ended;
exports.brewer.statusChanged = Event.brewer.statusChanged;
exports.brewer.phaseChanged = Event.brewer.phaseChanged;

exports.temperature = {};
exports.temperature.changed = Event.temperature.changed;

exports.emitter = Event.emitter;
