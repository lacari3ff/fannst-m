/**
 * Author:  Luke Alexander Cornelius Antonius Rieff
 * Project: Fannst Online Services
 * Year:    2019/2020
 */
// The modules
const mailparser = require("mailparser").simpleParser;
// The models
const Email = require("../../models/smtp/email");
// The functions
function onData(stream, session, callback) {
    let body = "";
    // On data listener
    stream.on("data", function(chunk) {
        body += chunk;
    });
    // On the end of the data stream
    stream.on("end", function() {
        mailparser(body, function(err, body) {
            if(session.user) {
                // Means a email is being send
            } else {
                processAttachments(body.attachments, function(attachments) {
                   console.log(attachments);
                   callback(null, "Message queued.");
                });
                // Means a email is being received
            }
        })
    });
}
function processAttachments(attachments, cb) {
    if(attachments.length >= 1) {
        let i = 0;
        function entry() {
            if(i > attachments.length) {
                çb([]);
            } else {
                let attachment = attachments[i];
                console.log(attachment);
                i++
            }
        }
        entry();
    } else {
        cb([]);
    }
}
// Exports
module.exports = onData;