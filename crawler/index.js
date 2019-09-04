// The modules
const express        = require("express");
// The src
const storeErr       = require("./src/store-err");
const request        = require("./src/request");
const getSiteData    = require("./src/get-site-data")

request.get("localhost/index", function (html, url) {
   getSiteData.parse(html, url, function (result) {
      console.log(result);
   });
});