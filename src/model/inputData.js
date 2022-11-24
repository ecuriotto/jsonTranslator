const FirestoreClient = require('../firestoreClient')

let phrasesInFile = [];
let translatedByUserSavedInDraft = {};
let alreadyTranslated=[];
let fileMatchesWithFirestore = {};
let languageCode = '';

function initVar(){
    phrasesInFile = [];
    fileMatchesWithFirestore = {};
}

/*
savePhrasesInFileRec = (body) =>{    
    for(let key in body){
        if(key=="***MYTRANS***"){
            translatedByUserSavedInDraft = body[key];
            break;
        }
        let val = body[key];
        if(typeof val == "string"){
            phrasesInFile.push(val)
        }
        else{
            savePhrasesInFileRec(val)
        }    
    }
}
*/
savePhrasesInFile = (body) =>{
    alreadyTranslated=[];
    translatedByUserSavedInDraft = body["***MYTRANS***"];
    if(!translatedByUserSavedInDraft){
        translatedByUserSavedInDraft = {}
    }
    savePhrasesInFileRec(body);
    phrasesInFile = phrasesInFile.concat(alreadyTranslated);
}
savePhrasesInFileRec = (body) =>{  

    for(let key in body){
        if(key=="***MYTRANS***"){
            break;
        }
        let val = body[key];
        if(typeof val == "string"){
            if(translatedByUserSavedInDraft[val]){
                alreadyTranslated.push(val)
            }
            else{
                phrasesInFile.push(val)
            }        
        }
        else{
            savePhrasesInFileRec(val)
        }    
    }
}

prepareAdditionalData = async () => {

        const firestoreExistingPhrases = await FirestoreClient.getExistingPhrasesFromFirestore(languageCode);
        const firestoreExistingPhrasesData = firestoreExistingPhrases.data();
    
        let firestoreExistingPhrasesKeysUpper = Object.keys(firestoreExistingPhrasesData).map(firePhrase => firePhrase.toUpperCase())
        phrasesInFile.filter(function(filePhrase) {
            if(firestoreExistingPhrasesKeysUpper.includes(filePhrase.toUpperCase())){           
                fileMatchesWithFirestore[filePhrase]=firestoreExistingPhrasesData[filePhrase]
            }    
            else{
                fileMatchesWithFirestore[filePhrase]='';
                // useless? phrasesForHelper.push(filePhrase) 
            }               
        });
        console.log("end of prepareAdditionalData")
}


saveDataFromFile = async (body, lang) =>{
    languageCode = lang;
    initVar();
    savePhrasesInFile(body);
    await prepareAdditionalData()
    let output = {};
    output["total"]=Object.keys(fileMatchesWithFirestore).length
    output["alreadyTranslated"]=Object.keys(translatedByUserSavedInDraft).length
    return output;
}

getDataFromFile = () =>{ 
    return fileMatchesWithFirestore
}
getTranslatedByUserSavedInDraft = () =>{ 
    return translatedByUserSavedInDraft;
}
module.exports = {saveDataFromFile, getDataFromFile, getTranslatedByUserSavedInDraft} 

