let myData = {};
//number of unique phrases to translate in the file
let numberOfTotalKeys = 0;
//const URL = "http://localhost:7070/";
const helperKeyword = 'automatic-help';
const userKeyword = 'my-translation';
const helperColor = 'has-text-link';

//let divData = null;
let jsonToSave = null;
let page = 0;
let limit = 6;
let totalPages = 0;
let fileName = 'translation.json';

let numberOfTotalKeysObj;

let numberOfUpdatedKeysInit = 0; //how many keys are already translated at the beginning (DRAFT)
let alreadyTranslated = {}; //when importing a draft we store here the previously user translated phrases
//This function can either be used to write the form based on the json, or to update the json with the translated data
let analyseInputJson = (file) => {
  const reader = new FileReader();
  reader.addEventListener('load', async (event) => {
    myData = JSON.parse(event.target.result);
    fileName = file.name;
    let myDataRaw = event.target.result;

    numberOfTotalKeysObj = await makeRequest(
      'POST',
      '/saveDataFromFile/' + languageSelection.code,
      myDataRaw
    );
    let numberOfPhrases = JSON.parse(numberOfTotalKeysObj).numberOfPhrases;
    numberOfTotalKeys = numberOfPhrases.total;
    alreadyTranslated = numberOfPhrases.alreadyTranslated;
    numberOfUpdatedKeysInit = Object.keys(alreadyTranslated).length;
    totalPages = Math.ceil(numberOfTotalKeys / limit);
    page = 0;
    document.getElementById('myData').replaceChildren();
    let paginatedData = await makeRequest(
      'GET',
      '/getData/' + languageSelection.code,
      null,
      'page=' + page + '&limit=' + limit
    );
    writeHeader();
    writeDom(JSON.parse(paginatedData));
  });
  reader.readAsText(file);
};

function checkIfDuplicateExists(arr) {
  return new Set(arr).size + '-' + arr.length;
}

/*
let doubleKeysVerify = [];
verifyDoubleKeys = (myData) => {
  for (const key in myData) {
    if (typeof myData[key] == 'string') {
      doubleKeysVerify.push(key);
    } else {
      verifyDoubleKeys(myData[key]);
    }
  }
};

let pickValue = (key) => {
  let result = { val: '', source: '' };
  if (checkNested(myData, userKeyword, key)) {
    result.val = myData[userKeyword][key];
    result.source = 'human';
  } else if (checkNested(myData, helperKeyword, key)) {
    result.val = myData[helperKeyword][key];
    result.source = 'helper';
  } else {
    result.val = myData[key];
    result.source = 'file';
  }
  return result;
};

let checkNested = (obj, level, ...rest) => {
  if (obj === undefined) return false;
  if (rest.length == 0 && obj.hasOwnProperty(level)) return true;
  return checkNested(obj[level], ...rest);
};
*/
const nextStep = (next) => {
  let elements = document.getElementsByClassName('steps-segment');
  for (const elementId in elements) {
    if (elementId == next - 1) {
      elements[elementId].classList.remove('is-active');
      continue;
    }
    if (elementId == next) {
      elements[elementId].classList.add('is-active');
      break;
    }
  }
};

const cleanMyData = () => {
  const myDataToDelete = document.getElementById('myData');
  myDataToDelete.innerHTML = '';
  myData = {};
};

function makeRequest(method, url, payload, requestParams) {
  return new Promise(function (resolve, reject) {
    const urlWithParams = requestParams ? url + '?' + requestParams : url;
    let xhr = new XMLHttpRequest();
    xhr.open(method, urlWithParams);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    if (payload) {
      xhr.send(payload);
    } else {
      xhr.send();
    }
  });
}
let saveInFirestore = () => {
  const myTranslations = document.getElementsByName('myTrans');
  let correctMachineTranslations = {};
  for (myTrans of myTranslations) {
    if (myTrans.value && myTrans.value != '') {
      let rootId = myTrans.id.split('|')[1];
      let machineTrans = document.getElementById('machineTrans|' + rootId);
      let eng = document.getElementById('eng|' + rootId);
      if (myTrans.value != machineTrans.value) {
        correctMachineTranslations[eng.value] = myTrans.value;
      }
    }
  }
  if (Object.keys(correctMachineTranslations).length > 0) {
    makeRequest(
      'POST',
      '/saveInFirestore/' + languageSelection.code,
      JSON.stringify(correctMachineTranslations)
    );
  }
};
