'use strict';

const path = require('path');
const FirestoreClient = require('./firestoreClient')
const GoogleTranslateClient = require('./googleTranslateClient')
let languageCode = "";
let collection = "dictionary";
let phrasesInFile = [];
let firestoreExistingPhrasesKeys = []
let fileMatchesWithFirestore = [];
let phrasesForHelper = []
let phrasesTranslatedByHelperToInsertInFirestore = {}
let mergedPhrases = {}

function initVar(){
    phrasesInFile = [];
    firestoreExistingPhrasesKeys = []
    fileMatchesWithFirestore = {};
    phrasesForHelper = [];
    phrasesTranslatedByHelperToInsertInFirestore = {};
    mergedPhrases = {};
}
function getPhrasesInFileRec(json){
    
    for(let key in json){
        let val = json[key];
        if(typeof val == "string"){
            phrasesInFile.push(val)
        }
        else{
            getPhrasesInFileRec(val)
        }    
    }
}

function getPhrasesInFile(json){
    phrasesInFile = [];
    getPhrasesInFileRec(json)
}

function insertPhrasesTranslatedByHelperInFirestore(languageCode, phrasesForHelper, phrasesTranslatedByHelper){
    
    phrasesTranslatedByHelper.forEach((translation, i) => {
        phrasesTranslatedByHelperToInsertInFirestore[phrasesForHelper[i]]=translation
        //console.log(`${phrasesForHelper[i]} => (${languageCode}) ${translation}`);
      });
    console.log(phrasesTranslatedByHelperToInsertInFirestore);
    //FirestoreClient.saveByPath(path.join(collection,languageCode), phrasesTranslatedByHelperToInsertInFirestore);
}
function mergeFirestoreWithMachine(){
    mergedPhrases = {...fileMatchesWithFirestore, ...phrasesTranslatedByHelperToInsertInFirestore}
}
function createResponseArray(){
    let responseArray = []
    phrasesInFile.forEach((phrase, i) => {
        let singleEntry = {}
        singleEntry["english"] = phrase;
        singleEntry["translatedByMachine"] = mergedPhrases[phrase]
        responseArray.push(singleEntry);
    });
    console.log(responseArray);

}

async function getTranslationsMaster(request, response) {
    
    languageCode = request.params.lang;
    initVar();

    /* Call firestore get all keys of a dictionary */
    const firestoreExistingPhrases = await FirestoreClient.getExistingPhrasesFromFirestore(path.join(collection,languageCode));
    const firestoreExistingPhrasesData = firestoreExistingPhrases.data();

    getPhrasesInFile(request.body)
    let firestoreExistingPhrasesKeysUpper = Object.keys(firestoreExistingPhrasesData).map(firePhrase => firePhrase.toUpperCase())
    phrasesInFile.filter(function(filePhrase) {
        if(firestoreExistingPhrasesKeysUpper.includes(filePhrase.toUpperCase())){
            
            //let singleMatch = {};
            fileMatchesWithFirestore[filePhrase]=firestoreExistingPhrasesData[filePhrase]
            //fileMatchesWithFirestore.push(singleMatch);        
            //fileMatchesWithFirestore.push({filePhrase:firestoreExistingPhrasesData[filePhrase]});
        }    
        else
            phrasesForHelper.push(filePhrase)    
    });
    console.log('phrases in file')
    console.log(phrasesInFile)
 
    console.log('firestore matches')
    console.log(fileMatchesWithFirestore)

    console.log('phrases For Helper')
    console.log(phrasesForHelper)
    if(phrasesForHelper.length > 0){
        let phrasesTranslatedByHelper = await GoogleTranslateClient.translateText(phrasesForHelper, languageCode)
        //console.log('Translations:');
        //console.log(phrasesTranslatedByHelper)
        insertPhrasesTranslatedByHelperInFirestore(languageCode, phrasesForHelper, phrasesTranslatedByHelper)
    }

    mergeFirestoreWithMachine();
    createResponseArray();
    response.render('index');
    /*
    phrasesRequested = compareFileWithFirestore(file, firestoreExistingPhrases);

    phrasesTranslatedByHelper = getTranslationsByHelper(phrasesRequested);

    insertPhrasesTranslatedByHelperInFirestore(languageCode, phrasesTranslatedByHelper)

    writeHelperAndFirestorephrasesInMyData(phrasesTranslatedByHelper, fileMatchesWithFirestore)
    */
}
//getTranslationsMaster();

module.exports = {getTranslationsMaster}
