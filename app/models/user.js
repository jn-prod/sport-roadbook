var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
  strava_id: { type: Number },
  username: { type: String, index:true },
  email: { type: String },
  firstname: { type: String },
  lastname : { type: String },
  sex: { type: String },
  country: { type: String },
  city: { type: String },

  //log
  created_at : { type: Date, required: true, default: Date.now },
  updated_at: { type: Date }
})

var User = module.exports = mongoose.model('User', UserSchema)