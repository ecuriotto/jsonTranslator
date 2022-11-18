const InputData = require('./model/inputData')
const GoogleTranslateClient = require('./googleTranslateClient')
const FirestoreClient = require('./firestoreClient')

getData = async (languageCode, page, limit) =>{ 
    console.time();
    let fileMatchesWithFirestore = InputData.getDataFromFile();
    let translatedByUserSavedInDraft = InputData.getTranslatedByUserSavedInDraft();
    let paginatedKeys = Object.keys(fileMatchesWithFirestore).slice(limit * page, limit * (page + 1))
    let paginatedData = []
    let countGoogleCalls = 0;  
    for(key of paginatedKeys){
        let singleEntry = {}
        singleEntry["english"] = key;
        if(fileMatchesWithFirestore[key] == ""){
            //we get the translation from google and we save it to firestore
            countGoogleCalls +=1;
            let machineTrans = await GoogleTranslateClient.translateText(key, languageCode)
            singleEntry["machineTranslation"] = machineTrans[0];
            let toSaveInFirestore= {}
            toSaveInFirestore[key] = singleEntry["machineTranslation"];
            console.log(toSaveInFirestore);
            FirestoreClient.saveByPath(languageCode, toSaveInFirestore);
        }
        else{
            singleEntry["machineTranslation"] = fileMatchesWithFirestore[key]
        }
        let phraseToTranslateTrimmed = key.replace(/\s/g, "")
        if(translatedByUserSavedInDraft[phraseToTranslateTrimmed]){
            singleEntry["myTranslation"] = translatedByUserSavedInDraft[phraseToTranslateTrimmed];
        }
        paginatedData.push(singleEntry);   
    }    
    console.log(paginatedData);
    console.log(`${countGoogleCalls} Google translation calls done`)
    console.timeEnd();
    return paginatedData;
}



module.exports = {getData} 