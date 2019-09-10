// The modules
const sh = require("sorthash");
const crypto = require("crypto");
const geoip = require("geoip-lite");
// The tools
const verify = require("../tools/verify");
// The models
const User = require("../models/auth/user");
const Log = require("../models/auth/log");
// Database
const dbos = require("../database/dbos");
let dbo;
dbos.auth(function(res) {
  dbo = res;
});
// The functions
function getLatestLogs(req, res, next) {
  verify.verify(req, res, function(user, log) {
    Log.find(dbo, user.hid, 0, 30, function(logs) {
      res.json({
        status: true,
        logs: logs
      });
    });
  });
}

module.exports = { getLatestLogs };
