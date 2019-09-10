class Log {
  constructor(logObject) {
    this.ip = logObject.ip;
    this.ua = logObject.ua;
    this.hid = logObject.hid;
    this.timestamp = logObject.timestamp;
    this.key = logObject.key;
    this.location = Object.assign(
      {
        lat: 0,
        long: 0,
        city: "",
        country: ""
      },
      logObject.location
    );
    this.device = Object.assign(
      {
        type: "",
        model: "",
        browser: "",
        browser_patch: ""
      },
      logObject.device
    );
  }

  save(dbo, cb) {
    dbo.collection("logs").insertOne(this, function(err) {
      cb(!err);
    });
  }

  static findByKeyAndHid(dbo, key, hid, cb) {
    dbo.collection("logs").findOne(
      {
        $and: [
          {
            key: key
          },
          {
            hid: hid
          }
        ]
      },
      function(err, log) {
        if (err) cb(false);
        else if (log) cb(log);
        else cb(false);
      }
    );
  }

  static deleteOne(dbo, key, hid, cb) {
    dbo.collection("logs").deleteOne(
      {
        $and: [
          {
            key: key
          },
          {
            hid: hid
          }
        ]
      },
      function(err) {
        cb(!err);
      }
    );
  }

  static find(dbo, hid, skip, limit, cb) {
    dbo
      .collection("logs")
      .find({
        hid: hid
      })
      .skip(skip)
      .limit(limit)
      .toArray(function(err, logs) {
        if (err) cb(false);
        else if (logs) cb(logs);
        else cb(false);
      });
  }
}

module.exports = Log;
