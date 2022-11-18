const inputDataFromFile = require('./model/inputData')
const GoogleTranslateClient = require('./googleTranslateClient')

getData = async (languageCode, page, limit) =>{ 
    console.time();
    let fileMatchesWithFirestore = inputDataFromFile.getDataFromFile();
    let translatedByUserSavedInDraft = inputDataFromFile.getTranslatedByUserSavedInDraft();
    let paginatedKeys = Object.keys(fileMatchesWithFirestore).slice(limit * page, limit * (page + 1))
    //let paginatedData = paginatedKeys.reduce((cur, key) => { return Object.assign(cur, { [key]: fileMatchesWithFirestore[key] })}, {});
    /*
    let paginatedData = paginatedKeys.reduce((cur, key) => { 
        return Object.assign(cur, 
            { 
                [key]: fileMatchesWithFirestore[key] == '' ? = await GoogleTranslateClient.translateText(phrasesForHelper, languageCode) : fileMatchesWithFirestore[key]
            })
        }, {});
    */
    let paginatedData = []    
    for(key of paginatedKeys){
        let singleEntry = {}
        singleEntry["english"] = key;
        if(fileMatchesWithFirestore[key] == ""){
            singleEntry["machineTranslation"]  = await GoogleTranslateClient.translateText(key, languageCode)
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
    console.timeEnd();
    return paginatedData;
}

module.exports = {getData} 