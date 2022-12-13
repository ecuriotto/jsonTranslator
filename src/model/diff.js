//Store the differences (+) between the last and previous version.
//The input is a git diff operation
const fs = require('fs');
//const allContents = fs.readFileSync('../../test-git-diff/diff.txt', 'utf-8');

let diffObject = {};
function parseDiffFile(diffFile) {
  for (line of diffFile.split(/\r?\n/)) {
    if (line.startsWith('+++')) {
      continue;
    }
    if (line.startsWith('+')) {
      //remove the first and last character (+ and ,)
      let lineParsed = line.substring(1, line.length - 1);

      const lineParsedArray = lineParsed.split('"');
      if (lineParsedArray.length < 4) {
        // just skipping. only interested in this pattern ' "somekey":"sone value"
      } else {
        const key = lineParsedArray[1];
        const value = lineParsedArray[3];
        diffObject[key] = value;
      }
    }
  }
  return Object.keys(diffObject).length;
}

function getDiffObject() {
  return diffObject;
}

//parseDiffFile(allContents);
//console.log(diffObject);

module.exports = { parseDiffFile, getDiffObject };
