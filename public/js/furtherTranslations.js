savePrevPhrases = (file) =>{
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
        myData = JSON.parse(event.target.result);
        fileName = file.name;
        let myDataRaw = event.target.result

        numberOfTotalKeysObj = await makeRequest("POST", URL + "savePreviousVersionTrans/" + languageSelection.code, myDataRaw);
        console.log("Phrases in the previous version " + JSON.parse(numberOfTotalKeysObj).previousVersionPhrasesNumber.previousVersionPhrasesNumber)
        /*
        let numberOfPhrases = JSON.parse(numberOfTotalKeysObj).numberOfPhrases;
        numberOfTotalKeys = numberOfPhrases.total;
        alreadyTranslated = numberOfPhrases.alreadyTranslated;
        numberOfUpdatedKeysInit = Object.keys(alreadyTranslated).length;
        totalPages = Math.ceil(numberOfTotalKeys / limit)
        page = 0;
        let paginatedData = await makeRequest("GET", getDataUrl + languageSelection.code, null, "page=" + page + "&limit=" + limit);
        writeHeader();
        writeDom(JSON.parse(paginatedData));
        */
    });
    reader.readAsText(file);
}