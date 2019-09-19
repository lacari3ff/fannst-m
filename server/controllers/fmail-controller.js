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
            if(!email.read) {
              Email.setReadById(dbo, email._id, function(success) {
                if(success) {
                  res.json({
                    status: true,
                    email: email
                  });
                } else {
                  res.json({
                    status: false,
                    error: "Could not set mail read."
                  });
                }
              })
            } else {
              res.json({
                status: true,
                email: email
              });
            }
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
        let text = HTMLtoText.fromString(html);
        sendmail.send(
            `${user.firstname} ${user.lastname} <${user.username}@fannst.nl>`,
            req.body.to.split(","),
            subject,
            html,
            text,
            function(success) {
              if (success) {
                let emaild = new Email({
                  messageId: success.messageId,
                  html: html,
                  text: text,
                  headers: success.headers,
                  from: {
                    value: [
                      {
                        address: user.username + "@fannst.nl", 
                        name: user.firstname + " " + user.lastname
                      }
                    ]
                  },
                  to: {
                    value: req.body.to.split(",").map(recipient => {
                      return {
                        name: "",
                        address: recipient
                      }
                    })
                  },
                  type: 0,
                  hid: user.hid,
                  attachments: [],
                  subject: subject,
                  date: new Date().toDateString(),
                  read: false
                });

                emaild.save(dbo, function (err) {
                  if (err) {
                    res.send({
                      status: false,
                      error: "Email sent, but not stored in Fannst database."
                    });
                  } else {
                    res.send({
                      status: true
                    });
                  }
                })
              } else {
                res.send({
                  status: false,
                  error: "Could not send the Email."
                })
              }
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