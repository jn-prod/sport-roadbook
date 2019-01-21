// node_modules
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var resultSchema = mongoose.Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  event: { type: Schema.ObjectId, ref: 'Event' },
  activy: { type: Schema.ObjectId, ref: 'Activity' },
  place: { type: Number, index: true },
  finishers_qty: { type: Number },
  official_time: { type: Number },

  // log
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

module.exports = mongoose.model('Result', resultSchema)
