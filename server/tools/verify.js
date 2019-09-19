// The modules
const url = require("url");
// The models
const Log = require("../models/auth/log");
const User = require("../models/auth/user");
// Database
const dbos = require("../database/dbos");
let dbo;
dbos.auth(function(res) {
  dbo = res;
});
// The functions
function verify(req, res, cb) {
  let { key, hid } = req.body;

  if (key !== undefined && hid !== undefined) {
    Log.findByKeyAndHid(dbo, key, hid, function(log) {
      if (log) {
        User.findByHid(dbo, log.hid, function(user) {
          if (user) {
            cb(user);
          } else {
            res.json({
              status: false,
              error: "User not found! Please sign in again."
            });

            cb(false);
          }
        });
      } else {
        res.json({
          status: false,
          error: "Log not found! Please sign in again."
        });

        cb(false);
      }
    });
  } else {
    res.json({
      status: false,
      error: "Please sign in, this feature is only available for accounts."
    });

    cb(false);
  }
}
function verifyGET(req, res, cb) {
  let urld = url.parse(req.url, true);
  let { key, hid } = urld.query;

  if (key !== undefined && hid !== undefined) {
    Log.findByKeyAndHid(dbo, key, hid, function(log) {
      if (log) {
        User.findByHid(dbo, log.hid, function(user) {
          if (user) {
            cb(user);
          } else {
            res.json({
              status: false,
              error: "User not found! Please sign in again."
            });

            cb(false);
          }
        });
      } else {
        res.json({
          status: false,
          error: "Log not found! Please sign in again."
        });

        cb(false);
      }
    });
  } else {
    res.json({
      status: false,
      error: "Please sign in, this feature is only available for accounts."
    });

    cb(false);
  }
}
// Exports
module.exports = { verify, verifyGET };
