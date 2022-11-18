const FirestoreClient = require('../firestoreClient')
const path = require('path');
const collection = 'dictionary';

let phrasesInFile = [];
let fileMatchesWithFirestore = {};
let languageCode = '';

function initVar(){
    phrasesInFile = [];
    fileMatchesWithFirestore = {};
}

savePhrasesInFileRec = (body) =>{    
    for(let key in body){
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

        const firestoreExistingPhrases = await FirestoreClient.getExistingPhrasesFromFirestore(path.join(collection,languageCode));
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
    await prepareAdditionalData()
    return Object.keys(fileMatchesWithFirestore).length;
}

getDataFromFile = () =>{ 
    return fileMatchesWithFirestore
    //console.log(phrasesForHelper)
    //return phrasesInFile;
}

module.exports = {saveDataFromFile, getDataFromFile} 

