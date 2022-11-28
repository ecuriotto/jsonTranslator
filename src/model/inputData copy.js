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


savePhrasesInFile = (body) =>{
    alreadyTranslated=[];
    /*
    if(Object.keys(translatedByUserSavedInDraft).length > 0)
        translatedByUserSavedInDraft = body["***MYTRANS***"];
    else
        translatedByUserSavedInDraft = {...translatedByUserSavedInDraft, ...body["***MYTRANS***"]}
    */
    translatedByUserSavedInDraft = {...translatedByUserSavedInDraft, ...body["***MYTRANS***"]}    
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
            if(translatedByUserSavedInDraft[val.replace(/\s/g, "")]){
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

        let firestoreExistingPhrasesData = [];
        try{
            const firestoreExistingPhrases = await FirestoreClient.getExistingPhrasesFromFirestore(languageCode);
            firestoreExistingPhrasesData = firestoreExistingPhrases.data();
        }
        catch(err){
            console.log("Error with Firestore");
        }
        
        
    
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
    output["alreadyTranslated"]=translatedByUserSavedInDraft;
    return output;
}

savePreviousVersionTrans = async (body, lang) =>{
    languageCode = lang;
    savePreviousVersionTransRec(body)
    translatedByUserSavedInDraft=body;
    previousVersionPhrasesNumber = Object.keys(body).length;
    let output = {"previousVersionPhrasesNumber":previousVersionPhrasesNumber};
    return output;
}

savePreviousVersionTransRec = (body) =>{  
    for(let key in body){
        let val = body[key];
        if(typeof val == "string"){
            if(translatedByUserSavedInDraft[val.replace(/\s/g, "")]){
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

getDataFromFile = () =>{ 
    return fileMatchesWithFirestore
}
getTranslatedByUserSavedInDraft = () =>{ 
    return translatedByUserSavedInDraft;
}
module.exports = {saveDataFromFile, getDataFromFile, getTranslatedByUserSavedInDraft, savePreviousVersionTrans} 
