const FirestoreClient = require('../firestoreClient')
const Phrase = require('../model/phrase');

let phrases = [];
let translatedByUserSavedInDraft = {};
let alreadyTranslatedInPreviousVersion=[];
let fileMatchesWithFirestore = {};
let languageCode = '';
let orderCount = 0;
let orderId = 100000;

function initVar(){
    phrases = [];
    fileMatchesWithFirestore = {};
    orderCount = 0;
}


savePhrasesInFile = (body) =>{
    
    translatedByUserSavedInDraft = {...translatedByUserSavedInDraft, ...body["***MYTRANS***"]}    
    if(!translatedByUserSavedInDraft){
        translatedByUserSavedInDraft = {}
    }
    savePhrasesInFileRec(body);
    //TODO MERGE THE TWO OBJECTS
    //phrases = phrases.concat(alreadyTranslatedInPreviousVersion);
    let phrasesUpd = []
    for(let phrase of phrases){
        let newPhrase = new Phrase();
        let matchPhrase = alreadyTranslatedInPreviousVersion.find(obj =>{
            if(obj.key == phrase.key) 
                return obj;
            else
                return undefined;    
        })
        if(matchPhrase){
            newPhrase = matchPhrase;
            //newPhrase.suggestedTrans = matchPhrase.previouslyTranslated;
            newPhrase.eng = phrase.eng;
        }    
        else{
            newPhrase = phrase;
        }    
        phrasesUpd.push(newPhrase);
    }
    phrases = phrasesUpd;

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
    alreadyTranslatedInPreviousVersion=[];
    orderId = 100000;
    previousVersionPhrasesNumber = Object.keys(body).length;
    savePreviousVersionTransRec(body);
    let output = {"previousVersionPhrasesNumber":previousVersionPhrasesNumber};
    return output;
}

savePreviousVersionTransRec = (body) =>{
    
    for(let key in body){
        let val = body[key];
        if(typeof val == "string"){

            phrase = new Phrase(key, "")
            phrase.previouslyTranslated = val;
            phrase.inFirestore = true;
            orderId = orderId + 1; 
            phrase.orderId = orderId;   
            alreadyTranslatedInPreviousVersion.push(phrase);    
        }
        else{
            savePreviousVersionTransRec(val)
        }    
    }
}
getPhrases = () =>{
    return phrases;
}

getTranslatedByUserSavedInDraft = () =>{ 
    return translatedByUserSavedInDraft;
}
module.exports = {saveDataFromFile, getTranslatedByUserSavedInDraft, savePreviousVersionTrans, getPhrases} 

