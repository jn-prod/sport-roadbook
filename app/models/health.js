// node_modules
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HealthSchema = mongoose.Schema({
    user: { type: Schema.ObjectId, ref:'User', required: true },
    hrv: { type: Number },    
    humeur: { type: Number },
    sommeil: { type: Number },  
    lassitude: { type: Number },  
    recuperation: { type: Number },  
    stress: { type: Number },
    pouls: { type: Number },  
    poids: { type: Number },
    blessure: { type: Boolean },
    maladie: { type: Boolean },
    competition_day: { type: Boolean }, // abandonné
    day_highligths: { type: String },
    faim: { type: Number },
    soif: { type: Number },
    commentaires: { type: String },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    weather: {
        weather_main: { type: String },
        openweathermap_icon: { type: String },
        main_temp: { type: Number },
        main_pressure: { type: Number },
        main_humidity: { type: Number },
        main_temp_min: { type: Number },
        main_temp_max: { type: Number },
        wind_speed: { type: Number },
        wind_deg: { type: Number },
        clouds: { type: Number },
        sys_sunrise: { type: Date },
        sys_sunset: { type: Date }
    },

    //log
    created_at : { type: Date, required: true, default: Date.now },
    updated_at: { type: Date }
})

var Health = module.exports = mongoose.model('Health', HealthSchema)