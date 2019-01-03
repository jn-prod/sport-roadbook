// node_modules
var mongoose = require('mongoose')

var Schema = mongoose.Schema

// Team Schema
var UserSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  coach: { type: Schema.ObjectId, ref: 'User', required: true },
  membres: [
    { type: Schema.ObjectId, ref: 'User', required: true }
  ],
  code: { type: String },

  // log
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

module.exports = mongoose.model('Team', UserSchema)
