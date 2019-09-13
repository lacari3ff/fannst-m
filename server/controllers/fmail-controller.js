// The sources
const sendmail = require("../src/send-mail");
const HTMLtoText = require("html-to-text");
// The tools
const verify = require("../tools/verify");
// Database
const dbos = require("../database/dbos");
let dbo;
dbos.smtp(function (res) {
  dbo = res;
});
// The functions
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

module.exports = { send };