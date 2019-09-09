// The modules
const express = require("express");
const cors = require("cors");
const BodyParser = require("body-parser");
const path = require("path");
// Initializes
const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(
  BodyParser.urlencoded({
    extended: false
  })
);
// The Routes
const SearchRoute = require("./routes/search-route");
const WeatherRoute = require("./routes/weather-route");
const NewsRoute = require("./routes/news-route");
const AuthRoute = require("./routes/auth-route");
app.use("/rest/search", SearchRoute);
app.use("/rest/weather", WeatherRoute);
app.use("/rest/news", NewsRoute);
app.use("/rest/auth", AuthRoute);
app.get("*", function(req, res, next) {
  let domain = req.hostname;
  let p = req.path;

  switch (domain) {
    case "news.fannst.nl": {
      switch (p) {
        case "/": {
          res.redirect(301, "/frontpage");
          break;
        }
        default: {
          res.sendFile(path.resolve(`${__dirname}/views/news/index.html`));
          break;
        }
      }
      break;
    }
    case "auth.fannst.nl": {
      switch (p) {
        case "/": {
          res.redirect(301, "/signin");
          break;
        }
        default: {
          res.sendFile(path.resolve(`${__dirname}/views/auth/index.html`));
          break;
        }
      }
      break;
    }
    default: {
      res.json({
        status: false
      });
      break;
    }
  }
});
// Listens
app.listen(80);
