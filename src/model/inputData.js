const FirestoreClient = require('../firestoreClient')
const Phrase = require('../model/phrase');

let phrases = [];
let translatedByUserSavedInDraft = {};
let alreadyTranslated=[];
let fileMatchesWithFirestore = {};
let languageCode = '';
let orderCount = 0;

function initVar(){
    phrases = [];
    fileMatchesWithFirestore = {};
    orderCount = 0;
}


savePhrasesInFile = (body) =>{
    alreadyTranslated=[];

    translatedByUserSavedInDraft = {...translatedByUserSavedInDraft, ...body["***MYTRANS***"]}    
    if(!translatedByUserSavedInDraft){
        translatedByUserSavedInDraft = {}
    }
    savePhrasesInFileRec(body);
    phrases = phrases.concat(alreadyTranslated);
}

savePhrasesInFileRec = (body) =>{  
    for(let key in body){
        if(key=="***MYTRANS***"){
            break;
        }
        let val = body[key];
        if(typeof val == "string"){
            let phrase = new Phrase(key, val)
            if(translatedByUserSavedInDraft[key]){
                phrase.previouslyTranslated=translatedByUserSavedInDraft[key]
            }
            orderCount += 1; //used for sorting
            phrase.orderId = orderCount;
            phrases.push(phrase); 
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
            let firestoreExistingPhrasesEngUpper = Object.keys(firestoreExistingPhrasesData).map(firePhrase => firePhrase.toUpperCase())
            phrases.map(function(phrase) {
                phrase.inFirestore=false;
                let engUpper = phrase.eng.toUpperCase();
                if(firestoreExistingPhrasesEngUpper.includes(engUpper)){           
                    phrase.suggestedTrans = firestoreExistingPhrasesData[Object.keys(firestoreExistingPhrasesData).find(key => key.toUpperCase()===engUpper)]
                    phrase.inFirestore=true;
                }    
                return phrase;
            });
            console.log("end of prepareAdditionalData")
        }
        catch(err){
            console.error("Error with Firestore");
        }

}

sortPhrases = () =>{
    phrases.sort((a, b) => {
        if((a.previouslyTranslated.length ==0 &&  b.previouslyTranslated.length== 0) || (a.previouslyTranslated.length >0 &&  b.previouslyTranslated.length> 0)){
            //no translations, the natural order is applied
            return a.orderId > b.orderId ? 1 : -1;
        }
        if(a.previouslyTranslated.length > 0 && b.previouslyTranslated.length == 0) return 1
            
        
        if(a.previouslyTranslated.length == 0 && b.previouslyTranslated.length > 0) return -1;
        
    });
}

saveDataFromFile = async (body, lang) =>{
    languageCode = lang;
    initVar();
    savePhrasesInFile(body);
    await prepareAdditionalData()
    sortPhrases();
    for(let cipo of phrases){
        cipo.print();
    }
    let output = {};
    output["total"]=Object.keys(phrases).length
    output["alreadyTranslated"]=translatedByUserSavedInDraft;
    for(let p of phrases){
        p.print();
    }
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
                phrases.push(val)
            }        
        }
        else{
            savePhrasesInFileRec(val)
        }    
    }
}
getPhrases = () =>{
    return phrases;
}

getDataFromFile = () =>{ 
    return fileMatchesWithFirestore
}
getTranslatedByUserSavedInDraft = () =>{ 
    return translatedByUserSavedInDraft;
}
module.exports = {saveDataFromFile, getTranslatedByUserSavedInDraft, savePreviousVersionTrans, getPhrases} 

