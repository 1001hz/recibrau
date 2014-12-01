//app/models/grain.js
var mongoose = require('mongoose');

module.exports = mongoose.model('Grain', {
    name: { type: String, default: '' },
    origin: { type: String, default: '' },
    supplier: { type: String, default: '' },
    mash: { type: String, default: '' },
    type: { type: String, default: '' },
    addAfterBoil: { type: String, default: '' },
    potential: { type: Number },
    diastaticPower: { type: Number },
    colour: { type: Number },
    dryYield: { type: Number },
    maxInBatch: { type: Number },
    protein: { type: Number },
    moisture: { type: Number }
});