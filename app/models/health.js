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

    //log
    created_at : { type: Date, required: true, default: Date.now },
    updated_at: { type: Date }
})

var Health = module.exports = mongoose.model('Health', HealthSchema)