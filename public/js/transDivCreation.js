
const textInputSizeClass = "is-3"
const bulmaLabelTextColor = "has-text-primary-light"
const numberCharactersPerLine = 22

calculaterows = (transLength) => {
    let rows = transLength / numberCharactersPerLine;
    return Math.ceil(transLength / 30)
}

writeHeader = () => {
    divData = document.getElementById("myData");
    let divToAdd = document.createElement('div');
    divToAdd.className = "columns has-background-black";

    let divHeader1 = document.createElement('div')
    let divHeader1Top = document.createElement('div')
    divHeader1.classList.add("column");
    divHeader1.classList.add(textInputSizeClass)
    divHeader1Top.classList.add("has-text-centered")
    let labelHeader1 = document.createElement('label')
    labelHeader1.classList.add(bulmaLabelTextColor)
    labelHeader1.innerHTML = "Text to translate"
    divHeader1.appendChild(divHeader1Top)
    divHeader1Top.appendChild(labelHeader1)

    let divHeader2 = document.createElement('div')
    let divHeader2Top = document.createElement('div')
    divHeader2.classList.add("column");
    divHeader2.classList.add(textInputSizeClass)
    divHeader2Top.classList.add("has-text-centered")
    let labelHeader2 = document.createElement('label')
    labelHeader2.classList.add(bulmaLabelTextColor)
    labelHeader2.innerHTML = "Google translation suggestion";
    divHeader2.appendChild(divHeader2Top)
    divHeader2Top.appendChild(labelHeader2)

    let divHeader3 = document.createElement('div')
    let divHeader3Top = document.createElement('div')
    divHeader3.classList.add("column");
    divHeader3.classList.add("is-1")
    divHeader3Top.classList.add("has-text-centered")
    let labelHeader3 = document.createElement('label')
    labelHeader3.classList.add(bulmaLabelTextColor)
    labelHeader3.innerHTML = "Copy google translation";
    divHeader3.appendChild(divHeader3Top)
    divHeader3Top.appendChild(labelHeader3)

    let divHeader4 = document.createElement('div')
    let divHeader4Top = document.createElement('div')
    divHeader4.classList.add("column");
    divHeader4.classList.add(textInputSizeClass)
    divHeader4Top.classList.add("has-text-centered")
    let labelHeader4 = document.createElement('label')
    labelHeader4.classList.add(bulmaLabelTextColor)
    labelHeader4.innerHTML = "Your suggestion";
    divHeader4.appendChild(divHeader4Top)
    divHeader4Top.appendChild(labelHeader4)

    divToAdd.appendChild(divHeader1);
    divToAdd.appendChild(divHeader2);
    divToAdd.appendChild(divHeader3);
    divToAdd.appendChild(divHeader4);
    divData.appendChild(divToAdd);
}
writeInputEng = (trans) => {
    let divToAdd = document.createElement('div');
    divToAdd.className = "columns has-background-black";
    let divEl = document.createElement('div')
    divEl.classList.add("column");
    divEl.classList.add(textInputSizeClass)
    let inpEl = document.createElement("textarea");
    inpEl.className = "textarea is-primary"
    inpEl.setAttribute("rows", calculaterows(trans.english.length))
    inpEl.value = trans.english;
    inpEl.readOnly = true
    inpEl.setAttribute("id", "eng|" + rems(trans.english))
    divEl.appendChild(inpEl);
    divToAdd.appendChild(divEl);
    return divToAdd;
}

writeMachineTranslation = (trans, divToAdd) => {
    let divEl = document.createElement('div');
    divEl.classList.add("column");
    divEl.classList.add(textInputSizeClass)
    let inpEl = document.createElement("textarea");
    inpEl.className = "textarea is-link";
    inpEl.setAttribute("rows", calculaterows(trans.english.length));
    inpEl.setAttribute("id", "machineTrans|" + rems(trans.english));
    inpEl.setAttribute("name", "machineTrans");
    inpEl.value = trans.machineTranslation;
    inpEl.readOnly = true;
    divEl.appendChild(inpEl);
    divToAdd.appendChild(divEl);
    return divToAdd;

}

rems = (trans) => {
    //console.log(trans.split(" ").join(""))
    return trans.split(" ").join("");
}

writeAcceptMachineTranslation = (trans, divToAdd) => {
    let divEl = document.createElement('div')
    let divCheck = document.createElement('div')
    let divCheckTop = document.createElement('div')
    divEl.className = "column is-1";
    divCheck.className = "field"
    divCheckTop.className = "has-text-centered"
    let inpEl = document.createElement("input");
    inpEl.type = "checkbox"
    inpEl.className = "switch has-text-centered targetAcceptCheck"
    //inpEl.className = "switch has-text-centered targetAcceptCheck";
    inpEl.setAttribute('id', 'validate|' + rems(trans));
    //inpEl.name = "validate|"+rems(trans)
    let labelEl = document.createElement('label')
    labelEl.setAttribute("for", 'validate|' + rems(trans))
    //labelEl.innerHTML="validate"
    divEl.appendChild(divCheck);
    divCheck.appendChild(divCheckTop)
    divCheckTop.appendChild(inpEl);
    divCheckTop.appendChild(labelEl);
    divToAdd.appendChild(divEl);
    return divToAdd;
}

writeMyTranslation = (trans, divToAdd) => {
    let divEl = document.createElement('div')
    divEl.classList.add("column");
    divEl.classList.add(textInputSizeClass)
    let inpEl = document.createElement("textarea");
    inpEl.className = "textarea is-link has-background-warning";
    inpEl.setAttribute("rows", calculaterows(trans.english.length))
    inpEl.setAttribute("id", "myTrans|" + rems(trans.english))
    inpEl.setAttribute("name", "myTrans");
    divEl.appendChild(inpEl);
    divToAdd.appendChild(divEl);
    return divToAdd;

}
writeDom = (paginatedData) => {
    divData = document.getElementById("myData");

    for (let trans of paginatedData) {
        let divToAdd = writeInputEng(trans);
        divToAdd = writeMachineTranslation(trans, divToAdd);
        divToAdd = writeAcceptMachineTranslation(trans.english, divToAdd);
        divToAdd = writeMyTranslation(trans, divToAdd);
        divData.appendChild(divToAdd);
    }
    addEventListeners();
}
