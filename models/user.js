var mongoose = require('mongoose');
var Trips = require("./trips");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    description: String,
    listOfTrips:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trips"
         }
    ],
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);