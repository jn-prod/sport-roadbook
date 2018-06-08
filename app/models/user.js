// node_modules
var mongoose = require('mongoose')

// User Schema
var UserSchema = mongoose.Schema({
  strava_id: { type: Number },
  facebook_id: { type: Number },
  username: { type: String },
  email: { type: String, unique: true, required: true, index: true },
  firstname: { type: String },
  lastname: { type: String },
  sex: { type: String },
  country: { type: String },
  city: { type: String },
  size: { type: Number },
  date_of_birth: { type: Date },

  // log
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

module.exports = mongoose.model('User', UserSchema)
