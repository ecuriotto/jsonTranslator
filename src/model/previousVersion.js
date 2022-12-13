const Phrase = require('./phrase');
const Diff = require('./diff');

let alreadyTranslatedInPreviousVersion = [];
let orderId = 100000;

function savePreviousVersionTrans(body, lang) {
  alreadyTranslatedInPreviousVersion = [];
  orderId = 100000;
  previousVersionPhrasesNumber = Object.keys(body).length;
  savePreviousVersionTransRec('', body);
  let output = { previousVersionPhrasesNumber: previousVersionPhrasesNumber };
  return output;
}

function savePreviousVersionTransRec(keyRoot, obj) {
  for (let key in obj) {
    let val = obj[key];
    let flatKey = getFlatKey(keyRoot, key);
    if (typeof val == 'string') {
      phrase = new Phrase(flatKey, '');
      phrase.previouslyTranslated = val;
      phrase.inFirestore = true;
      orderId = orderId + 1;
      phrase.orderId = orderId;
      alreadyTranslatedInPreviousVersion.push(phrase);
    } else {
      savePreviousVersionTransRec(flatKey, val);
    }
  }
}

function getFlatKey(keyRoot, key) {
  return keyRoot + '^' + key;
}

function getPreviousVersionTrans() {
  return mergePreviousVersionWithDiff();
}

function mergePreviousVersionWithDiff() {
  const diffObject = Diff.getDiffObject();
  //Let's check existing keys that changed text to translate (eng)
  //If they're both in previous version and diff it means there's an update
  for (const phrase of alreadyTranslatedInPreviousVersion) {
    //const keyArr = phrase.key.split(/\ˆ/);
    const phraseKey = phrase.key;
    //'\u005E' corresponds to the key separator: "^"
    if (phraseKey.lastIndexOf('\u005E') >= 0) {
      const keyString = phraseKey.substring(phraseKey.lastIndexOf('\u005E') + 1);
      //const keyString = keyArr[keyArr.length - 1];
      console.log(diffObject[keyString]);
      if (diffObject[keyString]) {
        delete diffObject[keyString];
        phrase.previouslyTranslated = '';
      }
    }
  }
  //The elements not removed previpusly are the NEW keys in diff file
  for (const key in diffObject) {
    const newPhrase = new Phrase(key, diffObject[key]);
    orderId = orderId + 1;
    newPhrase.orderId = orderId;
    alreadyTranslatedInPreviousVersion.push(newPhrase);
  }

  return alreadyTranslatedInPreviousVersion;
}
module.exports = {
  savePreviousVersionTrans,
  getPreviousVersionTrans,
};
