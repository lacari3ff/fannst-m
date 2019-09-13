// The modules
const sendmail = require("sendmail")();
// The function
function send(from, to, subject, html, text, cb) {
    sendmail({
        from: from,
        to: to,
        subject: subject,
        html: html,
        text: text
    }, function(err, reply) {
        cb(!err);
    });
}
// Exports
module.exports = { send };