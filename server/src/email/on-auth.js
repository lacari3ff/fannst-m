/**
 * Author:  Luke Alexander Cornelius Antonius Rieff
 * Project: Fannst Online Services
 * Year:    2019/2020
 */
// The database
const dbos = require("../database/dbos");
let dbo;
dbos.smtp(function (res) {
    dbo = res;
});
// The models
const User  = require("../../models/auth/user");
const Log   = require("../../models/auth/log");
// The functions
function onAuth(auth, session, callback) {
    if(auth.username !== undefined && auth.password !== undefined) {
        Log.findByKeyAndHid(dbo, auth.password, auth.username, function(log) {
            if(log) {
                User.findByHid(dbo, log.hid, function(user) {
                    if(user) {
                        callback(null, {
                            user: user
                        });
                    } else {
                        return callback(new Error("The log is linked to a non existing account."));
                    }
                })
            } else {
                return callback(new Error("Log not found, please authenticate."));
            }
        });
    } else {
        return callback(new Error("Please enter your HID and Key."));
    }
}
// Exports
module.exports = onAuth;