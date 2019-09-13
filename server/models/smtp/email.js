const mongodb = require("mongodb");
/**
 * Author:  Luke Alexander Cornelius Antonius Rieff
 * Project: Fannst Online Services
 * Year:    2019/2020
 */
//
class Email {
    constructor(emailObject) {
        this.messageId      = emailObject.messageId;
        this.html           = emailObject.html;
        this.text           = emailObject.text;
        this.headers        = emailObject.headers;
        this.from           = emailObject.from;
        this.to             = emailObject.to;
        this.type           = emailObject.type; // 0 Sent, 1 Received, 2 Reply
        this.hid            = emailObject.hid;
        this.attachments    = emailObject.attachments;
        this.subject        = emailObject.subject;
        this.date           = emailObject.date;
    }

    save(dbo, cb) {
        dbo.collection("emails").insertOne(this, function(err) {
            cb(err);
        });
    }

    static findById(dbo, id, cb) {
        dbo.collection("emails").findOne({
            _id: mongodb.ObjectID(id)
        }, function(err, email) {
            if(err)
                cb(false);
            else if(email)
                cb(email);
            else
                cb(false);
        });
    }

    static findByMessageIdAndHid(dbo, messageId, hid, cb) {
        dbo.collection("emails").findOne({
            $and: [
                {
                    messageId: messageId
                },
                {
                    hid: hid
                }
            ]
        }, function(err, email) {
            if(err)
                cb(false);
            else if(email)
                cb(email);
            else
                cb(false);
        });
    }

    static findByHid(dbo, hid, skip, limit, type, cb) {
        dbo.collection("emails").find({
            $and: [
                {
                    hid: hid
                },
                {
                    type: type
                }
            ]
        }).sort({_id: -1}).skip(skip).limit(limit).toArray(function(err, emails) {
            cb(err ? false : emails);
        })
    }

    static deleteByMessageIdAndHid(dbo, messageId, hid, cb) {
        dbo.collection("emails").deleteOne({
            $and: [
                {
                    messageId: messageId
                },
                {
                    hid: hid
                }
            ]
        }, function(err) {
            cb(!err);
        })
    }
}

module.exports = Email;