const FirestoreClient = require('../firestoreClient');
const Phrase = require('../model/phrase');
const PreviousVersion = require('./previousVersion');

let phrases = [];
let translatedByUserSavedInDraft = {};
let fileMatchesWithFirestore = {};
let languageCode = '';
let orderCount = 0;
let orderId = 100000;

function initVar() {
  phrases = [];
  fileMatchesWithFirestore = {};
  translatedByUserSavedInDraft = {};
  orderCount = 0;
}

function savePhrasesInFile(body) {
  translatedByUserSavedInDraft = {
    ...translatedByUserSavedInDraft,
    ...body['***MYTRANS***'],
  };
  if (!translatedByUserSavedInDraft) {
    translatedByUserSavedInDraft = {};
  }
  savePhrasesInFileRec('', body);
  const alreadyTranslatedInPreviousVersion = PreviousVersion.getPreviousVersionTrans();
  if (Object.keys(alreadyTranslatedInPreviousVersion).length > 0) {
    phrases = getMergedWithPreviousVersion(alreadyTranslatedInPreviousVersion);
  }
}

function getMergedWithPreviousVersion(alreadyTranslatedInPreviousVersion) {
  //phrases = phrases.concat(alreadyTranslatedInPreviousVersion);
  let phrasesUpd = [];
  for (let phrase of phrases) {
    let newPhrase = new Phrase();
    let matchPhrase = alreadyTranslatedInPreviousVersion.find((obj) => {
      if (obj.key == phrase.key) return obj;
      else return undefined;
    });
    if (matchPhrase) {
      newPhrase = matchPhrase;
      //newPhrase.suggestedTrans = matchPhrase.previouslyTranslated;
      newPhrase.eng = phrase.eng;
    } else {
      newPhrase = phrase;
    }
    phrasesUpd.push(newPhrase);
  }
  return phrasesUpd;
}

function getFlatKey(keyRoot, key) {
  return keyRoot + '^' + key;
}
function savePhrasesInFileRec(keyRoot, obj) {
  for (let key in obj) {
    if (key == '***MYTRANS***') {
      break;
    }
    let val = obj[key];
    let flatKey = getFlatKey(keyRoot, key);
    if (typeof val == 'string') {
      let phrase = new Phrase(flatKey, val);
      if (translatedByUserSavedInDraft[flatKey]) {
        phrase.previouslyTranslated = translatedByUserSavedInDraft[flatKey];
      }
      orderCount += 1; //used for sorting
      phrase.orderId = orderCount;
      phrases.push(phrase);
    } else {
      savePhrasesInFileRec(flatKey, val);
    }
  }
}

async function prepareAdditionalData() {
  let firestoreExistingPhrasesData = [];
  try {
    const firestoreExistingPhrases = await FirestoreClient.getExistingPhrasesFromFirestore(
      languageCode
    );
    firestoreExistingPhrasesData = firestoreExistingPhrases.data();
    let firestoreExistingPhrasesEngUpper = Object.keys(firestoreExistingPhrasesData).map(
      (firePhrase) => firePhrase.toUpperCase()
    );
    phrases.map(function (phrase) {
      phrase.inFirestore = false;
      let engUpper = phrase.eng.toUpperCase();
      if (firestoreExistingPhrasesEngUpper.includes(engUpper)) {
        phrase.suggestedTrans =
          firestoreExistingPhrasesData[
            Object.keys(firestoreExistingPhrasesData).find((key) => key.toUpperCase() === engUpper)
          ];
        phrase.inFirestore = true;
      }
      return phrase;
    });
    console.log('end of prepareAdditionalData');
  } catch (err) {
    console.error('Error with Firestore');
  }
}

function sortPhrases() {
  phrases.sort((a, b) => {
    if (
      (a.previouslyTranslated.length == 0 && b.previouslyTranslated.length == 0) ||
      (a.previouslyTranslated.length > 0 && b.previouslyTranslated.length > 0)
    ) {
      //no translations, the natural order is applied
      return a.orderId > b.orderId ? 1 : -1;
    }
    if (a.previouslyTranslated.length > 0 && b.previouslyTranslated.length == 0) return 1;

    if (a.previouslyTranslated.length == 0 && b.previouslyTranslated.length > 0) return -1;
  });
}

async function saveDataFromFile(body, lang) {
  languageCode = lang;
  initVar();
  savePhrasesInFile(body);
  await prepareAdditionalData();
  sortPhrases();

  let output = {};
  output['total'] = Object.keys(phrases).length;
  output['alreadyTranslated'] = translatedByUserSavedInDraft;
  for (let p of phrases) {
    p.print();
  }
  return output;
}

function getPhrases() {
  return phrases;
}

function getTranslatedByUserSavedInDraft() {
  return translatedByUserSavedInDraft;
}
module.exports = {
  saveDataFromFile,
  getTranslatedByUserSavedInDraft,
  getPhrases,
};
