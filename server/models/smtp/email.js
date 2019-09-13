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
    }

    save(dbo, cb) {
        dbo.collection("emails").insertOne(this, function(err) {
            cb(!err);
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