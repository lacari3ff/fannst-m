class Article {
  constructor(articleObject) {
    this.title = articleObject.title;
    this.guid = articleObject.guid;
    this.isoDate = articleObject.isoDate;
    this.image = articleObject.image;
    this.pubDate = articleObject.pubDate;
    this.contentSnippet = articleObject.contentSnippet;
    this.keywords = articleObject.keywords;
    this.pubName = articleObject.pubName;
    this.category = articleObject.category;
    this.country = articleObject.country;
  }

  save (dbo, cb) {
    dbo.collection("articles").insertOne(this, function(err) {
      cb(!err);
    });
  }

  static upsert (dbo, articleObject, cb) {
    dbo.collection("articles").replaceOne({
      guid: articleObject.guid
    }, {
      guid: articleObject.guid,
      title: articleObject.title,
      isoDate: articleObject.isoDate,
      image: articleObject.image,
      pubDate: articleObject.pubDate,
      contentSnippet: articleObject.contentSnippet,
      pubName: articleObject.pubName,
      keywords: articleObject.keywords,
      category: articleObject.category,
      country: articleObject.country
    }, {
      upsert: true
    }, function (err) {
      cb(!err);
    });
  }

  static keywordSearch (dbo, keywords, country, skip, limit, cb) {
    dbo.collection("articles").find({
      $and: [
        {
          keywords: {
            $in: keywords
          }
        },
        {
          country: country
        }
      ]
    }).sort({
      pubDate: -1
    }).skip(skip).limit(limit).toArray(function (err, articles) {
      cb (err ? false : articles);
    });
  }

  static getLatest (dbo, country, category, cb) {
    dbo.collection("articles").find({
      $and: [
        {
          country: country
        },
        {
          category: category
        }
      ]
    }).sort({pubDate: -1}).limit(30).toArray(function (err, articles) {
      cb(err ? false : articles);
    })
  }
}
// Exports the model
module.exports = Article;
