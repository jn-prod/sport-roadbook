// node_modules
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var EventSchema = mongoose.Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  type: { type: String, index: true },
  sport: { type: String },
  name: { type: String },
  description: { type: String },
  city: { type: String },
  distance: { type: Number },
  date_start: { type: Date, required: true },
  date_end: { type: Date, required: true },

  // log
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

module.exports = mongoose.model('Event', EventSchema)
