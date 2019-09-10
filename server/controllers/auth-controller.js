// The modules
const sh = require("sorthash");
const crypto = require("crypto");
const geoip = require("geoip-lite");
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
function signin(req, res, next) {
  let { username, password } = req.body;
  // Checks if the data is valid
  if (username !== undefined && password !== undefined) {
    // Checks if the user already exists
    User.findByUsernameOrPhone(dbo, username, username, function(user) {
      // Checks the password
      if (sh.compare(password, user.salt, user.hash)) {
        // Gets the location
        let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        let geo = geoip.lookup(ip);
        // Generates the log
        let logd = new Log({
          ip: ip,
          ua: req.headers["user-agent"],
          hid: user.hid,
          key: crypto.randomBytes(128).toString("hex"),
          location: {
            lat: geo.ll[0],
            long: geoip.ll[1]
          },
          device: {
            type: req.device.parser.get_type(),
            model: req.device.parser.get_model(),
            browser: req.device.parser.useragent.family,
            browser_patch: req.device.parser.useragent.patch
          }
        });

        logd.save(dbo, function(success) {
          if (success) {
            res.json({
              status: true,
              key: logd.key,
              hid: logd.hid
            });
          } else {
            res.json({
              status: false,
              error: 3
            });
          }
        });
      } else {
        res.json({
          status: false,
          error: 2
        });
      }
    });
  } else {
    res.json({
      status: false,
      error: 1
    });
  }
}

function signup(req, res, next) {
  let {
    firstname,
    lastname,
    username,
    password,
    confirm,
    birthdate,
    phone,
    recovery,
    gender
  } = req.body;
  // Checks if the data is set
  if (
    firstname !== undefined &&
    lastname !== undefined &&
    username !== undefined &&
    password !== undefined &&
    confirm !== undefined &&
    birthdate !== undefined &&
    phone !== undefined &&
    recovery !== undefined &&
    gender !== undefined
  ) {
    // Checks if the user already exists
    User.findByUsernameOrPhone(dbo, username, phone, function(user) {
      if (user) {
        res.json({
          status: false,
          error: 1
        });
      } else {
        // Checks if the passwords match
        if (password === confirm) {
          // Hashes the password
          let { hash, salt } = sh.hash(password, 20);
          // Gets the hid
          function entry() {
            // Generates the hid
            let hid = crypto
              .randomBytes(18)
              .toString("hex")
              .substring(0, 18);
            // Checks if the hid is in use
            User.findByHid(dbo, hid, function(user) {
              if (!user) {
                let userd = new User({
                  firstname: firstname,
                  lastname: lastname,
                  username: username,
                  hash: hash,
                  salt: salt,
                  birthdate: birthdate,
                  phone: phone,
                  recovery: recovery,
                  gender: gender,
                  hid: hid,
                  desc: "",
                  pic: "default",
                  options: {
                    location_history: true,
                    search_history: true
                  }
                });

                userd.save(dbo, function(success) {
                  if (success) {
                    res.json({
                      status: true
                    });
                  } else {
                    res.json({
                      status: false,
                      error: 3
                    });
                  }
                });
              } else {
                entry();
              }
            });
          }

          entry();
        } else {
          res.json({
            status: false,
            error: 2
          });
        }
      }
    });
  } else {
    res.json({
      status: false
    });
  }
}

module.exports = { signup, signin };
