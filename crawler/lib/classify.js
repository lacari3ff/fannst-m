// The keywords
let pornKeywords = new RegExp("/" + require("./keywords/porn").join("|") + "/gi");
// The classify site function
function classifySiteCategory (text) {
    let result = pornKeywords.test(text);
    if(result) // 0 is regular site, 1 is adult site
        return 1;
    else
        return 0;
}
// Exports
module.exports = { classifySiteCategory };