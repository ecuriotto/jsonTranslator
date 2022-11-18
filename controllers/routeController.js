const translationsMaster = require('../translationsMaster')
const inputDataFromFile = require('../model/inputData')
const retriever = require('../retriever')

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
    const numberOfPhrases = await inputDataFromFile.saveDataFromFile(request.body, languageCode);
    console.log('controller saveDataFromFile data are saved.......')
    response.send({ numberOfPhrases: numberOfPhrases });
}

module.exports = { saveDataFromFile, getData }