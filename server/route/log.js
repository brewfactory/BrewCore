/**
 * Log routing
 *
 * @routing log
 **/

var Logger = require('../module/Logger');
var LOG = 'log-router';

var Brew = require('../../schema/Brew');


/**
 * Find
 *
 * @method find
 * @param {Function} next
 */
exports.find = function *(next) {
  var include = this.query.include;
  var name = this.query.name;
  var startTime = this.query.startTime;
  var query = {};
  var queryInclude = {
    name: 1,
    startTime: 1
  };

  var brews;

  if(name) {
    query.name = name;
  }

  if(startTime) {
    startTime.name = name;
  }

  // Include phases
  if(include && include.indexOf('phases') > -1) {
    queryInclude.phases = 1;
  }

  // Query database
  try {
    brews = yield Brew.find(query, queryInclude).exec();
  } catch (err) {
    Logger.error('find: DB error', LOG, { err: err });
    this.throw(500, 'DB error');
  }

  // Res
  yield next;
  this.body = {
    brews: brews
  };
};


/**
 * Find one
 *
 * @method findOne
 * @param {Function} next
 */
exports.findOne = function *(next) {
  var id = this.params.id;
  var brew;

  if(!id) {
    this.throw(500, 'Id is required');
  }

  // Query database
  try {
    brew = yield Brew.findOne({ _id: id }).exec();
  } catch (err) {
    Logger.error('findOne: DB error', LOG, { err: err });
    this.throw(500, 'DB error');
  }

  // Res
  yield next;
  this.body = {
    brews: brew
  };
};

