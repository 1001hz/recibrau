//app/models/grain.js
var mongoose = require('mongoose');

module.exports = mongoose.model('Grain', {
    name: { type: String, default: '' },
    extractPotential: { type: Number, max: 100 },
    colour: { type: Number, max: 1000 },
    maxYield: { type: Number, max: 100 }
});