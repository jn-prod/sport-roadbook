// node_modules
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var resultSchema = mongoose.Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  event: { type: Schema.ObjectId, ref: 'Event', required: true },
  place: { type: Number, index: true },
  finishers_qty: { type: Number },
  official_time: { type: Number },
  description: { type: String },

  // log
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

module.exports = mongoose.model('Result', resultSchema)
