const FirestoreClient = require('../firestoreClient')

let phrasesInFile = [];
let translatedByUserSavedInDraft = {};
let fileMatchesWithFirestore = {};
let languageCode = '';

function initVar(){
    phrasesInFile = [];
    fileMatchesWithFirestore = {};
}

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
    savePhrasesInFileRec(body);
    console.log(phrasesInFile);
    console.log(translatedByUserSavedInDraft);
    await prepareAdditionalData()
    return Object.keys(fileMatchesWithFirestore).length;
}

getDataFromFile = () =>{ 
    return fileMatchesWithFirestore
}
getTranslatedByUserSavedInDraft = () =>{ 
    return translatedByUserSavedInDraft;
}
module.exports = {saveDataFromFile, getDataFromFile, getTranslatedByUserSavedInDraft} 

