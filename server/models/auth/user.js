class User {
    constructor (userObject) {
        this.firstname  = userObject.firstname;
        this.lastname   = userObject.lastname;
        this.username   = userObject.username;
        this.salt       = userObject.salt;
        this.hash       = userObject.hash;
        this.birthdate  = userObject.birthdate;
        this.phone      = userObject.phone;
        this.recovery   = userObject.recovery;
        this.gender     = userObject.gender;
        this.hid        = userObject.hid;
        this.desc       = userObject.desc;
        this.pic        = userObject.pic;
        this.options    = Object.assign({
            location_history: true,
            search_history: true
        }, userObject.options);
    }

    save (dbo, cb) {
        dbo.collection("users").insertOne(this, function (err) {
           cb (!err);
        });
    }

    static findByHid (dbo, hid, cb) {
        dbo.collection("users").findOne({
            hid: hid
        }, function (err, user) {
            if (err)
                cb (false);
            else if (user)
                cb (user);
            else
                cb (false);
        });
    }

    static findByUsernameOrPhone (dbo, username, phone, cb) {
        dbo.collection("users").findOne({
            $or: [
                {
                    username: username
                },
                {
                    phone: phone
                }
            ]
        }, function (err, user) {
            if (err)
                cb (false);
            else if (user)
                cb (user);
            else
                cb (false);
        });
    }
}

module.exports = User;