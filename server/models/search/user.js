// The modules
const mongoose  = require("mongoose");
const Schema    = mongoose.Schema;
// The creation of the user schema
const userSchema = Schema({
    uid: String,
    username: String,
    password: String,
    salt: String,
    domain: String,
    bdate: Date,
    cdate: Date,
    verified: Boolean,
    gender: Number,
    restemail: String,
    fullname: String
});
// Exports the model
module.exports = mongoose.model("User", userSchema);