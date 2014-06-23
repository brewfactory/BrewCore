/**
 * Mongoose Log model
 *
 * @module Log
 **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LogSchema;
var LogModel;


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
  LogModel.aggregate({
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
    if(err) {
      return callback(err);
    }

    logs = logs.map(function (log) {
      return {
        name: log._id.name,
        from: log.from,
        to: log.to
      };
    });

    return callback(null, logs);
  });
};


/**
 * Find one brew
 *
 * @method findBrews
 * @param {Object} params
 * @param {Function} callback
 */
LogSchema.statics.findOneBrew = function (params, callback) {
//  params.from = new Date(params.from);
//  params.to = new Date(params.to);

  return this.where('level', 'status')
    .where('add.name', params.name)
    .where('date')
    .gte(params.from)
    .lte(params.to)
    .select('add.temp add.pwm date')
    .sort('date')
    .exec(callback);
};


// model
module.exports = LogModel = mongoose.model('Log', LogSchema);
