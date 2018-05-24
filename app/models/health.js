var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HealthSchema = mongoose.Schema({
    user: { type: Schema.ObjectId, ref:'User', required: true },
    hrv: { type: Number },    
    sommeil: { type: Number },  
    lassitude: { type: Number },  
    recuperation: { type: Number },  
    pouls: { type: Number },  
    poids: { type: Number },
    blessure: { type: Boolean },
    competition_day: { type: Boolean },
    faim: { type: Number },
    soif: { type: Number },
    commentaires: { type: String },

    //log
    created_at : { type: Date, required: true, default: Date.now },
    updated_at: { type: Date }
})

var Health = module.exports = mongoose.model('Health', HealthSchema)