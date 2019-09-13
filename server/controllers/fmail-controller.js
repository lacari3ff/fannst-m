// The sources
const sendmail    = require("../src/send-mail");
const HTMLtoText  = require("html-to-text");
// The tools
const verify      = require("../tools/verify");
// The models
const Email       = require("../models/smtp/email");
// Database
const dbos        = require("../database/dbos");
let dbo;
dbos.smtp(function (res) {
  dbo = res;
});
// The functions
function fetchMail(req, res, next) {
  verify.verify(req, res, function(user) {
    if(user) {
      let { id } = req.body;
      if(
          id !== undefined
      ) {
        Email.findById(dbo, id, function(email) {
          if(email) {
            res.json({
              status: true,
              email: email
            });
          } else {
            res.json({
              status: false,
              error: "Email does not exist."
            });
          }
        })
      } else {
        res.json({
          status: false,
          error: "Please enter the hid and id."
        });
      }
    }
  })
}
function getEmails(req, res, next) {
  verify.verify(req, res, function(user) {
    if(user) {
      let { skip, limit, type } = req.body;
      if(
          skip !== undefined &&
          limit !== undefined &&
          type !== undefined
      ) {
        Email.findByHid(dbo, user.hid, parseInt(skip), parseInt(limit), parseInt(type), function(emails) {
          res.json({
            status: true,
            emails: emails
          });
        });
      } else {
        res.json({
          status: false,
          error: "Please provide skip and limit."
        });
      }
    }
  })
}
function send(req, res, next) {
  verify.verify(req, res, function(user) {
    if(user) {
      let { to, subject, html } = req.body;
      if(
          to !== undefined &&
          subject !== undefined &&
          html !== undefined
      ) {
        sendmail.send(
            `${user.firstname} ${user.lastname} <${user.username}@fannst.nl>`,
            req.body.to.split(","),
            subject,
            html,
            HTMLtoText.fromString(html),
            function(success) {
              res.send({
                status: success
              });
            })
      } else {
        res.json({
          status: false,
          error: "To, HTML and subject are required."
        })
      }
    }
  })
}
function html(req, res, next) {
  verify.verifyGET(req, res, function(user) {
    if(user) {
      let { id } = req.params;

      if(
          id !== undefined
      ) {
        Email.findById(dbo, id, function(email) {
          if(email) {
            res.send(email.html);
          } else {
            res.json({
              status: false,
              error: "Email does not exist."
            });
          }
        });
      } else {
       res.json({
         status: false,
         error: "Please enter the ID."
       });
      }
    }
  })
}

module.exports = { send, getEmails, fetchMail, html };