let myData = {};
//number of unique phrases to translate in the file
let numberOfTotalKeys = 0;
const getDataUrl = "http://localhost:7070/getData/";
const helperKeyword = "automatic-help";
const userKeyword = "my-translation"
const helperColor = "has-text-link"

let divData = null;
let jsonToSave = null;
let page = 0;
let limit = 6
let totalPages = 0
let fileName = "translation.json"

let numberOfTotalKeysObj;

//This function can either be used to write the form based on the json, or to update the json with the translated data
analyseInputJson = (file) => {

    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
        myData = JSON.parse(event.target.result);
        fileName = file.name;
        let myDataRaw = event.target.result

        numberOfTotalKeysObj = await makeRequest("POST", "http://localhost:7070/saveDataFromFile/" + languageSelection.code, myDataRaw);
        numberOfTotalKeys = JSON.parse(numberOfTotalKeysObj).numberOfPhrases;
        totalPages = Math.ceil(numberOfTotalKeys / limit)
        let paginatedData = await makeRequest("GET", getDataUrl + languageSelection.code, null, "page=" + page + "&limit=" + limit);
        writeHeader();
        writeDom(JSON.parse(paginatedData));
    });
    reader.readAsText(file);

}

function checkIfDuplicateExists(arr) {
    //return new Set(arr).size !== arr.length
    return new Set(arr).size + "-" + arr.length
}

let doubleKeysVerify = []
verifyDoubleKeys = (myData) => {
    for (const key in myData) {
        if (typeof myData[key] == "string") {
            doubleKeysVerify.push(key)
        }
        else {
            verifyDoubleKeys(myData[key])
        }
    }
}

let pickValue = (key) => {
    let result = { "val": "", "source": "" }
    if (checkNested(myData, userKeyword, key)) {
        result.val = myData[userKeyword][key];
        result.source = "human";
    }
    else if (checkNested(myData, helperKeyword, key)) {
        result.val = myData[helperKeyword][key];
        result.source = "helper";
    }
    else {
        result.val = myData[key];
        result.source = "file";
    }
    return result;
}

let checkNested = (obj, level, ...rest) => {
    if (obj === undefined) return false
    if (rest.length == 0 && obj.hasOwnProperty(level)) return true
    return checkNested(obj[level], ...rest)
}


const updateProgressBar = () => {
    let numberOfUpdatedKeys = 0;
    let progressElement = document.getElementById("progress");
    let progressTextElement = document.getElementById("progressText");
    progressElement.setAttribute("max", numberOfTotalKeys);
    let toTranslate = document.getElementsByName("myTrans");
    for (key of toTranslate) {
        if (key.value != null && key.value != "" && !key.classList.contains(helperColor)) {
            numberOfUpdatedKeys++;
        }
    }
    progressTextElement.innerHTML = numberOfUpdatedKeys + " / " + numberOfTotalKeys + " keys updated";
    progressElement.value = numberOfUpdatedKeys;

}

const nextStep = (next) => {
    let elements = document.getElementsByClassName("steps-segment");
    for (const elementId in elements) {
        if (elementId == next - 1) {
            elements[elementId].classList.remove("is-active");
            continue;
        }
        if (elementId == next) {
            elements[elementId].classList.add("is-active");
            break;
        }

    }
}

const cleanMyData = () => {
    const myDataToDelete = document.getElementById("myData");
    myDataToDelete.innerHTML = '';
    myData = {};
}

function makeRequest(method, url, payload, requestParams) {
    return new Promise(function (resolve, reject) {
        const urlWithParams = requestParams ? url + "?" + requestParams : url
        let xhr = new XMLHttpRequest();
        xhr.open(method, urlWithParams);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (payload) {
            xhr.send(payload);
        }
        else {
            xhr.send();
        }
    });
}
saveInFirestore= () => {
    const myTranslations = document.getElementsByName("myTrans");
    let correctMachineTranslations = {}
    for(myTrans of myTranslations){
        if(myTrans.value && myTrans.value !=""){
            let rootId = myTrans.id.split("|")[1];
            let machineTrans = document.getElementById("machineTrans|"+rootId);
            let eng = document.getElementById("eng|"+rootId);
            if(myTrans.value != machineTrans.value){
                correctMachineTranslations[eng.value] = myTrans.value;
            }
        }
    }
    console.log(correctMachineTranslations)
    if(Object.keys(correctMachineTranslations).length > 0){
        makeRequest("POST", "http://localhost:7070/saveInFirestore/" + languageSelection.code, JSON.stringify(correctMachineTranslations));
    }
}

setInterval(updateProgressBar, 5000)

