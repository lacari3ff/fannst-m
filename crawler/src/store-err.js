// The modules
const fs = require("fs");
const path = require("path");
// The append file
function appendFile(err) {
    writeErrFile(generateDate(new Date()), err);
}
// The generate date function
function generateDate(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
// Write file function
function writeErrFile(name, err) {
    let date = new Date();

    try {
        fs.appendFileSync(path.resolve(`${__dirname}/../logs/${name}`), `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}: ${err}\n`);
    } catch (err) {
        console.log(`A error occurred: ${err}`);
    }
}
// Exports
module.exports = { appendFile };

