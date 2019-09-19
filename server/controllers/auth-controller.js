// The modules
const sh = require("sorthash");
const crypto = require("crypto");
const geoip = require("geoip-lite");
const HTMLtoText  = require("html-to-text");
// The models
const User = require("../models/auth/user");
const Log = require("../models/auth/log");
// Database
const dbos = require("../database/dbos");
let dbo;
dbos.auth(function(res) {
  dbo = res;
});
// The src
const sendmail = require("../src/send-mail");
// The functions
function signin(req, res, next) {
  let { username, password } = req.body;
  // Checks if the data is valid
  if (username !== undefined && password !== undefined) {
    // Checks if the user already exists
    User.findByUsernameOrPhone(dbo, username, username, function(user) {
      if(user) {
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
              long: geo.ll[1],
              country: geo.country,
              city: geo.city
            },
            timestamp: new Date(),
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
                error: "Could not store the log to the database."
              });
            }
          });
        } else {
          res.json({
            status: false,
            error: "Invalid password."
          });
        }
      } else {
        res.json({
          status: false,
          error: "User does not exist."
        });
      }
    });
  } else {
    res.json({
      status: false,
      error: "Please leave no fields empty."
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
          error: "Username, or phone already used."
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
                    if (userd.recovery !== "" && userd.recovery) {
                      let html = `
                      <strong>You are the recovery address for: <a href="mailto:${userd.username}@fannst.nl">${userd.username}@fannst.nl</a></strong>
                      <p>What does this mean? Well this means that your email can be used to recover the password of: ${userd.firstname}. If this is a mistake please contact <a href="mailto:help.accounts@fannst.nl">help.accounts@fannst.nl</a></p>
                      `;
                      sendmail.send("accounts@fannst.nl", userd.recovery, "You have been registered as recovery address for...", html, HTMLtoText.fromString(html), function(success) {
                        res.json({
                          status: true
                        });
                      })
                    }
                  } else {
                    res.json({
                      status: false,
                      error: "Could not store user to database."
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
            error: "Passwords do not match."
          });
        }
      }
    });
  } else {
    res.json({
      status: false,
      error: "Please leave no fields empty."
    });
  }
}

module.exports = { signup, signin };
