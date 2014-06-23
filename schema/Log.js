/**
 * Mongoose Log model
 *
 * @module Log
 **/

'use strict';

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  LogSchema;

LogSchema = new Schema({

  date: {
    index: true,
    type: Date,
    'default': Date.now
  },

  level: {
    type: String,
    'default': 'info'
  },

  msg: {
    type: String
  },

  add: {}
});

/**
 * Find previous brews
 *
 * @method findBrews
 * @param {Function} callback
 */
LogSchema.statics.findBrews = function (callback) {
  this.aggregate({
    $match: {
      'date': {
        '$ne': null
      },
      level: 'status'
    }
  }, {
    $group: {
      _id: { day: { $dayOfYear: '$date' }, name: '$add.name' },
      from: { $min: '$date' },
      to: { $max: '$date' }
    }
  }, {
    $project: {
      name: '$add.name',
      from: '$from',
      to: '$to'
    }
  }, function (err, logs) {

    var
      response = [],
      i;

    // err
    if (err) {
      return callback(err);
    }

    for (i in logs) {
      response.push({
        name: logs[i]._id.name,
        from: logs[i].from,
        to: logs[i].to
      });
    }

    return callback(null, response);
  });
};

/**
 * Find one brew
 *
 * @method findBrews
 * @param {Object} brew
 * @param {Function} callback
 */
LogSchema.statics.findOneBrew = function (brew, callback) {
  brew.from = new Date(brew.from);
  brew.to = new Date(brew.to);

  this.where('level', 'status')
    .where('add.name', brew.name)
    .where('date')
    .gte(brew.from)
    .lte(brew.to)
    .select('add.temp add.pwm date')
    .sort('date')
    .exec(callback);
};



// model
module.exports = mongoose.model('Log', LogSchema);
