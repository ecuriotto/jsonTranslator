function getFlatKey(rootKey, key) {
  return rootKey + '^' + key;
}
let saveOutputJson = (isFinal) => {
  jsonToSave = myData;
  if (isFinal) {
    createFinalFile('', jsonToSave);
    delete jsonToSave['***MYTRANS***'];
  } else {
    createDraft();
  }
  download(
    JSON.stringify(jsonToSave, null, 2),
    fileName.split('.')[0] + '-draft.json',
    'text/plain'
  );
  saveInFirestore();
};
const createFinalFile = (keyRoot, jsonToSave) => {
  for (const key in jsonToSave) {
    let flatKey = getFlatKey(keyRoot, key);
    if (typeof jsonToSave[key] == 'string') {
      let myTransEl = document.getElementById('myTrans|' + flatKey);
      if (myTransEl) {
        let phraseTranslated = myTransEl.value;
        jsonToSave[key] = phraseTranslated;
      } else if (alreadyTranslated.hasOwnProperty(flatKey)) {
        jsonToSave[key] = alreadyTranslated[flatKey];
      }
    } else {
      //console.log(key + " - " + jsonOrigin[key]);
      createFinalFile(flatKey, jsonToSave[key]);
    }
  }
};
const createDraft = () => {
  let savedData = {};
  for (let prop in jsonToSave) {
    savedData[prop] = jsonToSave[prop];
  }

  let humanTranslations = {};
  for (let myTrans of document.getElementsByName('myTrans')) {
    if (myTrans.value && myTrans.value != '') {
      let rootId = myTrans.id.split('|')[1];
      let key = document.getElementById('key|' + rootId);
      humanTranslations[key.value] = myTrans.value;
    }
  }
  //merge the translations done by user in the previous draft with the actual one
  const mergedTranslations = { ...alreadyTranslated, ...humanTranslations };
  savedData['***MYTRANS***'] = mergedTranslations;
  jsonToSave = savedData;
};

function download(content, fileName, contentType) {
  var a = document.createElement('a');
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
