// The modules
const fs = require("fs");
const sendmail = require("sendmail")({
  silent: true,
  dkim: {
    privateKey: fs.readFileSync("./keys/smtp/dkim-private.key", "utf8"),
    keySelector: "default._domainkey"
  }
});
const nodemailer = require("nodemailer");
const directTransport = require("nodemailer-direct-transport");
const transport = nodemailer.createTransport(
  directTransport({
    name: "mail.fannst.nl"
  })
);
// The function
// function send(from, to, subject, html, text, cb) {
//     sendmail({
//         from: from,
//         to: to,
//         subject: subject,
//         html: html,
//         text: text
//     }, function(err, reply) {
//         if (err) {
//             cb(false);
//         } else {
//             cb(reply);
//         }
//     });
// }
function send(from, to, subject, html, text, cb) {
  transport.sendMail(
    {
      to: to,
      from: from,
      subject: subject,
      html: html,
      text: text,
      dkim: {
        domainName: "mail.fannst.nl",
        keySelector: "default._domainkey",
        privateKey: fs.readFileSync("./keys/smtp/dkim-private.key", "utf8"),
        cacheDir: "./tmp",
        cacheTreshold: 100 * 1024,
        skipFields: " message-id:date"
      }
    },
    function(err, info) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
}
// Exports
module.exports = { send };
