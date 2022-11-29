const fs = require('fs');

function jsonReader(dataAddress) {
  fs.readFileSync(dataAddress, (err, fileData) => {
    if (err) {
      console.log(err);
    }
    try {
      const object = JSON.parse(fileData);
      return object;
    } catch (err) {
      console.log(err);
    }
  });
}
function getFlatKey(keyRoot, key) {
  return keyRoot + '^' + key;
}
let orig;
let enrico;
fs.readFile('./en-ufficiale-2.json', 'utf8', (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  enrico = JSON.parse(data);
  fs.readFile('./en.json', 'utf8', (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    orig = JSON.parse(data);
    let origKeys = {};
    iter('', orig);
    function iter(keyRoot, el) {
      for (let key in el) {
        let val = el[key];
        let flatKey = getFlatKey(keyRoot, key);
        if (typeof val == 'string') {
          let valTrimmed = val.replace(/\s/g, '');
          origKeys[valTrimmed] = flatKey;
        } else {
          iter(flatKey, val);
        }
      }
    }
    //console.log(origKeys);
    let enricoUpd = {};
    let enricoT = enrico['***MYTRANS***'];
    for (let key in enricoT) {
      let origKey = origKeys[key]; //Object.keys(origKeys).find((mykey) => origKeys[mykey] == key);
      enricoUpd[origKey] = enricoT[key];
    }
    console.log(JSON.stringify(enricoUpd, null, 4));
    //console.log(origKeys);
  });
});

/*
for (let key of enrico['***MYTRANS***']) {
}
*/
