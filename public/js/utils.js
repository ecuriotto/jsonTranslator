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
let limit = 10;
let totalPages = 0;
let fileName = 'translation.json';

let numberOfTotalKeysObj;

let numberOfUpdatedKeysInit = 0; //how many keys are already translated at the beginning (DRAFT)
let alreadyTranslated = {}; //when importing a draft we store here the previously user translated phrases
let alreadyTranslatedNumber = 0;
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
    alreadyTranslatedNumber = Object.keys(alreadyTranslated).length;
    numberOfUpdatedKeysInit = Object.keys(alreadyTranslated).length;
    totalPages = Math.ceil(numberOfTotalKeys / limit);
    page = 0;
    document.getElementById('dataGlobal').replaceChildren();
    let paginatedData = await makeRequest(
      'GET',
      '/getData/' + languageSelection.code,
      null,
      'page=' + page + '&limit=' + limit
    );
    document.getElementById('dataHeader').hasChildNodes() ? null : writeHeader();
    writeDom(JSON.parse(paginatedData));
    switchHeaderToData(true);
  });
  reader.readAsText(file);
};

function cleanMyData() {
  const myDataToDelete = document.getElementById('dataGlobal');
  myDataToDelete.innerHTML = '';
  myData = {};
}

function cleanAll() {
  cleanMyData();
  //Reinitialize the select
  document.getElementById('select-mode').options[0].selected = true;
}

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

//show all panels <=n
function showPanel(n) {
  //Since the n=1 is the default case, n can only ne 2 or 3
  let i;
  let panels = document.getElementsByClassName('not-showing-at-startup');
  if (n > panels.length || n < 1) {
    panelIndex = panels.length;
  }
  for (i = 0; i < panels.length; i++) {
    if (i <= n - 2) panels[i].style.display = 'block';
    else panels[i].style.display = 'none';
  }
}

function hidePreviousVersionFiles(shouldHide) {
  const visibility = shouldHide ? 'none' : 'block';
  document.getElementById('previousTranslationFileDiv').style.display = visibility;
  document.getElementById('diffFileDiv').style.display = visibility;
}

function switchHeaderToData(shouldISwitch) {
  const visibilitySelection = shouldISwitch ? 'none' : 'block';
  const visibilityData = shouldISwitch ? 'block' : 'none';
  document.getElementById('data-header').style.display = visibilityData;
  document.getElementById('selection-section').style.display = visibilitySelection;
}

function setTheme(theme) {
  document.documentElement.className = theme;
}
