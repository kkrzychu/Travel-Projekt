var mongoose = require('mongoose');

var tripsSchema = new mongoose.Schema({
    ilosc: String,
    nazwa: String,
    cena: String,
    ubezpieczenie: String
    
});

module.exports = mongoose.model("Trips", tripsSchema);