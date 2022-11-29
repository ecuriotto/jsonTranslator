const textInputSizeClass = 'is-3';
const bulmaLabelTextColor = 'has-text-primary-light';
const numberCharactersPerLine = 30;

const calculaterows = (transLength) => {
  const rows = transLength / numberCharactersPerLine;
  return Math.ceil(rows);
};

const writeHeader = () => {
  let divData = document.getElementById('myData');
  let divToAdd = document.createElement('div');
  divToAdd.className = 'columns';

  let divHeader1 = document.createElement('div');
  let divHeader1Top = document.createElement('div');
  divHeader1.classList.add('column');
  divHeader1.classList.add(textInputSizeClass);
  divHeader1Top.classList.add('has-text-centered');
  let labelHeader1 = document.createElement('label');
  labelHeader1.classList.add(bulmaLabelTextColor);
  labelHeader1.innerHTML = 'Text to translate';
  divHeader1.appendChild(divHeader1Top);
  divHeader1Top.appendChild(labelHeader1);

  let divHeader2 = document.createElement('div');
  let divHeader2Top = document.createElement('div');
  divHeader2.classList.add('column');
  divHeader2.classList.add(textInputSizeClass);
  divHeader2Top.classList.add('has-text-centered');
  let labelHeader2 = document.createElement('label');
  labelHeader2.classList.add(bulmaLabelTextColor);
  labelHeader2.innerHTML = 'Google translation suggestion';
  divHeader2.appendChild(divHeader2Top);
  divHeader2Top.appendChild(labelHeader2);

  let divHeader3 = document.createElement('div');
  let divHeader3Top = document.createElement('div');
  divHeader3.classList.add('column');
  divHeader3.classList.add('is-1');
  divHeader3Top.classList.add('has-text-centered');
  let labelHeader3 = document.createElement('label');
  labelHeader3.classList.add(bulmaLabelTextColor);
  labelHeader3.innerHTML = 'Copy google translation';
  divHeader3.appendChild(divHeader3Top);
  divHeader3Top.appendChild(labelHeader3);

  let divHeader4 = document.createElement('div');
  let divHeader4Top = document.createElement('div');
  divHeader4.classList.add('column');
  divHeader4.classList.add(textInputSizeClass);
  divHeader4Top.classList.add('has-text-centered');
  let labelHeader4 = document.createElement('label');
  labelHeader4.classList.add(bulmaLabelTextColor);
  labelHeader4.innerHTML = 'Your suggestion';
  divHeader4.appendChild(divHeader4Top);
  divHeader4Top.appendChild(labelHeader4);

  //divToAdd.appendChild(divHeader0);
  divToAdd.appendChild(divHeader1);
  divToAdd.appendChild(divHeader2);
  divToAdd.appendChild(divHeader3);
  divToAdd.appendChild(divHeader4);
  divData.appendChild(divToAdd);
};

const writeInputKey = (trans) => {
  let divToAdd = document.createElement('div');
  divToAdd.className = 'columns';
  let divEl = document.createElement('div');
  divEl.hidden = true;
  //divEl.classList.add("column");
  //divEl.setAttribute("display", "none");
  divEl.classList.add(textInputSizeClass);
  let inpEl = document.createElement('label');
  inpEl.className = 'textarea is-primary';
  inpEl.setAttribute('rows', calculaterows(trans.key.length));
  //inpEl.setAttribute("rows", calculaterows(trans.eng.length))
  inpEl.value = trans.key;
  inpEl.setAttribute('visibility', 'hidden');
  inpEl.readonly = true;
  inpEl.setAttribute('id', 'key|' + rems(trans.key));
  divEl.appendChild(inpEl);
  divToAdd.appendChild(divEl);
  return divToAdd;
};

const writeInputEng = (trans, divToAdd) => {
  //divToAdd = document.createElement('div');
  //divToAdd.className = "columns";
  let divEl = document.createElement('div');
  divEl.classList.add('column');
  divEl.classList.add(textInputSizeClass);
  let inpEl = document.createElement('textarea');
  inpEl.className = 'textarea is-primary';
  inpEl.setAttribute('rows', calculaterows(trans.eng.length));
  inpEl.value = trans.eng;
  inpEl.readOnly = true;
  inpEl.setAttribute('id', 'eng|' + rems(trans.key));
  divEl.appendChild(inpEl);
  divToAdd.appendChild(divEl);
  return divToAdd;
};

const writeMachineTranslation = (trans, divToAdd) => {
  let divEl = document.createElement('div');
  divEl.classList.add('column');
  divEl.classList.add(textInputSizeClass);
  let inpEl = document.createElement('textarea');
  inpEl.className = 'textarea is-link';
  inpEl.setAttribute('rows', calculaterows(trans.eng.length));
  inpEl.setAttribute('id', 'machineTrans|' + rems(trans.key));
  inpEl.setAttribute('name', 'machineTrans');
  inpEl.value = trans.suggestedTrans;
  inpEl.readOnly = true;
  divEl.appendChild(inpEl);
  divToAdd.appendChild(divEl);
  return divToAdd;
};

const rems = (trans) => {
  //console.log(trans.split(" ").join(""))
  return trans.split(' ').join('');
};

const writeAcceptMachineTranslation = (trans, divToAdd) => {
  let divEl = document.createElement('div');
  let divCheck = document.createElement('div');
  let divCheckTop = document.createElement('div');
  divEl.className = 'column is-1';
  divCheck.className = 'field';
  divCheckTop.className = 'has-text-centered';
  let inpEl = document.createElement('input');
  inpEl.type = 'checkbox';
  inpEl.className = 'switch has-text-centered targetAcceptCheck';
  //inpEl.className = "switch has-text-centered targetAcceptCheck";
  inpEl.setAttribute('id', 'validate|' + rems(trans));
  //inpEl.name = "validate|"+rems(trans)
  let labelEl = document.createElement('label');
  labelEl.setAttribute('for', 'validate|' + rems(trans));
  //labelEl.innerHTML="validate"
  divEl.appendChild(divCheck);
  divCheck.appendChild(divCheckTop);
  divCheckTop.appendChild(inpEl);
  divCheckTop.appendChild(labelEl);
  divToAdd.appendChild(divEl);
  return divToAdd;
};

const writeMyTranslation = (trans, divToAdd) => {
  let divEl = document.createElement('div');
  divEl.classList.add('column');
  divEl.classList.add(textInputSizeClass);
  let inpEl = document.createElement('textarea');
  inpEl.className = 'textarea is-link';
  inpEl.setAttribute('rows', calculaterows(trans.eng.length));
  inpEl.setAttribute('id', 'myTrans|' + rems(trans.key));
  inpEl.setAttribute('name', 'myTrans');
  //TODO CHANGE myTranslation
  if (trans.previouslyTranslated) {
    inpEl.value = trans.previouslyTranslated;
    if (inpEl.value == trans.suggestedTrans) {
      divToAdd.querySelector('input[type=checkbox]').checked = true;
    }
  }
  divEl.appendChild(inpEl);
  divToAdd.appendChild(divEl);
  return divToAdd;
};
const writeDom = (paginatedData) => {
  let divData = document.getElementById('myData');

  for (let trans of paginatedData) {
    let divToAdd = writeInputKey(trans);
    divToAdd = writeInputEng(trans, divToAdd);
    divToAdd = writeMachineTranslation(trans, divToAdd);
    divToAdd = writeAcceptMachineTranslation(trans.key, divToAdd);
    divToAdd = writeMyTranslation(trans, divToAdd);
    divData.appendChild(divToAdd);
  }
  addEventListeners();
};
