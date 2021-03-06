// node_modules
var mongoose = require('mongoose')

// User Schema
var UserSchema = mongoose.Schema({
  strava_id: { type: Number },
  strava_access_token: { type: String },
  strava_refresh_token: { type: String },
  facebook_id: { type: Number },
  username: { type: String },
  email: { type: String, unique: true, required: true, index: true },
  firstname: { type: String },
  lastname: { type: String },
  sex: { type: String },
  country: { type: String },
  city: { type: String },
  height: { type: Number },
  date_of_birth: { type: Date },
  fc_max: { type: Number, default: 200 },
  tss: { type: Number },

  // log
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

module.exports = mongoose.model('User', UserSchema)
