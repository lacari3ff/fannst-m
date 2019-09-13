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
const jimp         = require("jimp");
// The models
const Email = require("../../models/smtp/email");
// The global variables
let _ATTACHMENT_DIR = "./public/smtp-attachments";
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
            }
        })
    });
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
                    // Processes the images
                    jimp.read(path.resolve(_ATTACHMENT_DIR + "/" + _FILE_NAME), function(err, image) {
                            if(err) {
                                console.log(err);
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