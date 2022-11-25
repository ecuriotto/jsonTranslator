//const translationsMaster = require('../translationsMaster')
const InputData = require('../model/inputData')
const retriever = require('../retriever')
const FirestoreClient = require('../firestoreClient');

getData = async (request, response) => {
    console.log('controller getDataFromFile.......')
    const languageCode = request.params.lang;
    const page = parseInt(request.query.page);
    const limit = parseInt(request.query.limit);
    console.log(`languageCode ${languageCode} page ${page} and limit= ${limit}`)
    let paginatedData = await retriever.getData(languageCode, page, limit);
    //console.log(`route controller paginated data: ${paginatedData}`);
    response.send(paginatedData);

}

saveDataFromFile = async (request, response) => {
    //Called when we upload the file
    console.log('controller saveDataFromFile.......')
    const languageCode = request.params.lang;
    const numberOfPhrases = await InputData.saveDataFromFile(request.body, languageCode);
    //console.log('controller saveDataFromFile data are saved.......')
    response.send({ numberOfPhrases: numberOfPhrases });
}

savePreviousVersionTrans = async (request, response) => {
    //Called when we upload the file
    console.log('controller savePreviousTrans.......')
    
    languageCode = request.params.lang;
    const numberOfPhrases = await InputData.savePreviousVersionTrans(request.body, languageCode);
    console.log('controller savePreviousTrans data are saved.......')
    response.send(numberOfPhrases);
    
    
}

saveInFirestore = async (request, response) => {
    const languageCode = request.params.lang;
    try{
        await FirestoreClient.saveByPath(languageCode, request.body);
    }
    catch(err){
        console.log("Error Saving translations into firestore. It's not blocking but there could be other issues around");
    }    
    
    response.status(204).send('Status: Ok');
}

module.exports = { saveDataFromFile, getData, saveInFirestore, savePreviousVersionTrans }