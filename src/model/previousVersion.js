const Phrase = require('../model/phrase');

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
  return alreadyTranslatedInPreviousVersion;
}
module.exports = {
  savePreviousVersionTrans,
  getPreviousVersionTrans,
};
