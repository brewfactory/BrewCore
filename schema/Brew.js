/**
 * Mongoose brew model
 *
 * @module Brew
 **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BrewSchema;

BrewSchema = new Schema({

  name: {
    index: true,
    type: String,
    required: true
  },

  startTime: {
    index: true,
    type: Date,
    'default': Date.now
  },

  phases: [{
    min: Number,
    temp: Number
  }],

  logs: [{
    temp: Number,
    pwm: Number,
    date: {
      type: Date,
      'default': Date.now
    }
  }],

  activity: [{
    name: {
      type: String,
      required: true
    },
    additional: Schema.Types.Mixed,
    date: {
      type: Date,
      'default': Date.now
    }
  }]
});


// model
module.exports = mongoose.model('Brew', BrewSchema);
