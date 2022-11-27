const InputData = require('./model/inputData')
const GoogleTranslateClient = require('./googleTranslateClient')
const FirestoreClient = require('./firestoreClient')

let languageCode = "";
let countGoogleCalls = 0;

getGoogleTranslation = async (phrase) => {
    
    countGoogleCalls +=1;
    console.log(phrase.eng);
    let machineTrans = await GoogleTranslateClient.translateText(phrase.eng, this.languageCode)
    phrase.suggestedTrans = machineTrans[0];
    saveGoogleTransInFirestore(languageCode, phrase.eng, phrase.suggestedTrans)
    return phrase;
}

saveGoogleTransInFirestore = async (eng, trans) =>{
    let toSaveInFirestore= {}
    toSaveInFirestore[eng] = trans;
    FirestoreClient.saveByPath(languageCode, toSaveInFirestore);
}

getData = async (languageCode, page, limit) =>{
    this.languageCode = languageCode;
    countGoogleCalls = 0;
    console.time();
    //let fileMatchesWithFirestore = InputData.getDataFromFile();
    //let translatedByUserSavedInDraft = InputData.getTranslatedByUserSavedInDraft();
    let phrases = InputData.getPhrases();
    let paginatedPhrases = phrases.slice(limit * page, limit * (page + 1))
    
    let paginatedPhrasesUpd = [];
    for(let phrase of paginatedPhrases){
        if(!phrase.inFirestore){
            phrase = await getGoogleTranslation(phrase);
        }    
        paginatedPhrasesUpd.push(phrase);
    }

    console.log(`${countGoogleCalls} Google translation calls done`)
    console.timeEnd();
    for(const p of paginatedPhrasesUpd){
        p.print();
    }
    return paginatedPhrasesUpd;
}



module.exports = {getData} 