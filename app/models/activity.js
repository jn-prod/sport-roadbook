var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = mongoose.Schema({
    user: { type: Schema.ObjectId, ref:'User', required: true },
    type: { type: String, index:true },
    name: { type: String },
    description: { type: String },
    distance: { type: Number },
    moving_time: { type: Number },
    total_elevation_gain: { type: Number },
    start_date_local: { type: Date },
    average_speed: { type: Number },
    calories: { type: Number },    

    //log
    created_at : { type: Date, required: true, default: Date.now },
    updated_at: { type: Date }
})

var Activity = module.exports = mongoose.model('Activity', ActivitySchema)