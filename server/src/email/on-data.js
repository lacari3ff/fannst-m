/**
 * Author:  Luke Alexander Cornelius Antonius Rieff
 * Project: Fannst Online Services
 * Year:    2019/2020
 */
// The modules
const mailparser    = require("mailparser").simpleParser;
const fs            = require("fs");
const path          = require("path");
const sh            = require("sorthash");
const jimp          = require("jimp");
const sendmail      = require("sendmail");
// The models
const Email         = require("../../models/smtp/email");
// The global variables
let _ATTACHMENT_DIR = "./public/smtp-attachments";
// The database
const dbos = require("../../database/dbos");
let dbo;
dbos.smtp(function (res) {
    dbo = res;
});
let auth_dbo;
dbos.auth(function (res) {
    auth_dbo = res;
});
// The models
const User  = require("../../models/auth/user");
const Log   = require("../../models/auth/log");
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
                processRecipients(body, function(isReceived) {
                    console.log(isReceived);
                    if (isReceived)
                        callback(null, "message end");
                    else
                        callback(new Error("No recipients found, or something else went wrong."));
                });
            }
        })
    });
}
function processRecipients(body, cb) {
    let i = 0;
    let received = false;
    function entry() {
        console.log(body.to);
        if(i >= body.to.value.length) {
            console.log("done");
            cb(received);
        } else {
            let recipient = body.to.value[i].address;
            let arr = recipient.split("@");
            console.log(arr);
            if(arr[1] === "fannst.nl") {
                let username = arr[0];
                User.findByUsername(auth_dbo, username, function(user) {
                    console.log(user);
                    if(user) {
                        processAttachments(body.attachments, function(attachments) {
                            // Creates the mail object
                            let mailObject = {
                                messageId: body.messageId,
                                html: body.html,
                                text: body.text,
                                headers: body.headers,
                                from: body.from,
                                to: body.to,
                                type: 1,
                                hid: user.hid,
                                attachments: attachments,
                                subject: body.subject,
                                date: body.date
                            };

                            // Stores the email
                            let emaild = new Email(mailObject);
                            emaild.save(dbo, function(err) {
                                if(err) {
                                    i++;
                                    entry();
                                } else {
                                    received = true;
                                    i++;
                                    entry();
                                }
                            });
                        });
                    } else {
                        i++;
                        entry();
                    }
                })
            } else {
                i++;
                entry();
            }
        }
    }
    entry();
}
function processAttachments(attachments, cb) {
    if(attachments.length >= 1) {
        let processed = [];
        let i = 0;
        function entry() {
            if(i >= attachments.length) {
                cb(processed);
            } else {
                console.log(i);
                let attachment = attachments[i];
                // The file name:wq
                let _FILE_NAME = `${sh.randomString({
                    type: "chars",
                    length: 12
                })}-${attachment.filename}`;
                // Checks the attachment file type
                if(attachment.contentType === "image/jpeg" || attachment.contentType === "image/png" || attachment.contentType === "image/gif") {
                    // Stores the image
                    // Processes other files
                    fs.writeFile(path.resolve(_ATTACHMENT_DIR + "/" + _FILE_NAME), attachment.content, function(err) {
                        console.log(err);
                        if (err) {
                            processed.push({
                                contentType: attachment.contentType,
                                filename: attachment.filename,
                                formats: {
                                    small: "small-" + _FILE_NAME,
                                    raw: _FILE_NAME
                                },
                                status: false
                            });
                            i++;
                            entry();
                        } else {
                            // Processes the images
                            jimp.read(path.resolve(_ATTACHMENT_DIR + "/" + _FILE_NAME), function(err, image) {
                                if(err) {
                                    processed.push({
                                        contentType: attachment.contentType,
                                        filename: attachment.filename,
                                        formats: {
                                            small: "small-" + _FILE_NAME,
                                            raw: _FILE_NAME
                                        },
                                        status: false
                                    });
                                    i++;
                                    entry();
                                } else {
                                    image
                                        .resize(120, 180)
                                        .quality(60)
                                        .write(path.resolve(_ATTACHMENT_DIR + "/small-" + _FILE_NAME));
                                    processed.push({
                                        contentType: attachment.contentType,
                                        filename: attachment.filename,
                                        formats: {
                                            small: "small-" + _FILE_NAME,
                                            raw: _FILE_NAME
                                        },
                                        status: true
                                    });
                                    i++;
                                    entry();
                                }
                            })
                        }
                    });
                } else {
                    // Processes other files
                    fs.writeFile(path.resolve(_ATTACHMENT_DIR + "/" + _FILE_NAME), attachment.content, function(err) {
                        console.log(err);
                        if(err) {
                            processed.push({
                                contentType: attachment.contentType,
                                filename: attachment.filename,
                                formats: {
                                    raw: _FILE_NAME
                                },
                                status: false
                            });
                            i++;
                            entry();
                        } else {
                            i++;
                            processed.push({
                                contentType: attachment.contentType,
                                filename: attachment.filename,
                                formats: {
                                    raw: _FILE_NAME
                                },
                                status: true
                            });
                            entry();
                        }
                    });
                }
            }
        }
        entry();
    } else {
        cb([]);
    }
}
// Exports
module.exports = onData;