

let myData = {};
let numberOfTotalKeys = 0;
let helperKeyword = "automatic-help";
let userKeyword = "my-translation"


//This function can either be used to write the form based on the json, or to update the json with the translated data
analyseInputJson = (file, func) => {

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        //console.log(event.target.result)
        myData = JSON.parse(event.target.result);
        
        func(myData, document.getElementById("myData"), 0);

    });
    reader.readAsText(file);
}    


createDom = (myData, element, iteration) => {

    for (const key in myData){
        let div = document.createElement('div');
        //helperKeyword, userKeyword are added by the webapp so they are filtered
        if([helperKeyword, userKeyword].includes(key))
            break;
        if(typeof myData[key] == "string"){
            div.className = "columns has-background-black"
            let divCode = document.createElement('div')
            divCode.className = "column is-one-fifth"
            divCode.innerHTML = '<input id="item" class="input is-success" type="text" disabled value="'+key+'">';
            let divEng = document.createElement('div')
            divEng.className = "column is-one-third"
            divEng.innerHTML = '<input class="input is-warning" type="text" disabled value="'+myData[key]+'">';
            let divToTranslate = document.createElement('div')
            divToTranslate.className = "column is-one-third"
            let pickedValue = pickValue(key);
            if(pickedValue.source=="file"){
                divToTranslate.innerHTML = '<input id="'+key+'" class="input" name="toTranslate" placeholder="Please translate '+myData[key]+'" type="text"></input>'
            }
            else{
                divToTranslate.innerHTML = '<input id="'+key+'" class="input" name="toTranslate" value="'+pickedValue.val+'" type="text"></input>'
            }

            for(let i=0; i< iteration; i++){
            let divEmptyColumn = document.createElement('div')
            divEmptyColumn.className = "column is-1"
            //divEmptyColumn.innerHTML = 'X';
            div.appendChild(divEmptyColumn)
            }
            div.appendChild(divCode);
            div.appendChild(divEng);
            div.appendChild(divToTranslate);
            if(pickedValue.source=="helper"){
                let divCheckbox = document.createElement('div')
                divCheckbox.className = "column is-1"
                divCheckbox.innerHTML='<label id="lab-check-'+key+'" class="checkbox has-text-white"><input name="helper-checkbox" id="check-'+key+'" type="checkbox">Validate translation?</label>';
                div.appendChild(divCheckbox);

            }
                
            element.appendChild(div);
            numberOfTotalKeys = numberOfTotalKeys +1;
        }
        else{ //title
            
            div.className = "columns"
            let divTitle = document.createElement('div')
            divTitle.className = "column is-full has-background-black"
            divTitle.innerHTML = '<label class="label has-text-white">' + key + '</label>';

            for(let i=0; i< iteration; i++){
                let divEmptyColumn = document.createElement('div')
                divEmptyColumn.className = "column is-1"
                //divEmptyColumn.innerHTML = 'X';
                div.appendChild(divEmptyColumn)
            }
            div.appendChild(divTitle);
            //document.getElementById("myData").appendChild(div);
            element.appendChild(div);
            createDom(myData[key], divTitle, iteration + 1)
        }                 
    }
}
let pickValue = (key) =>{
    let result = {"val":"","source":""}
    if(checkNested(myData, userKeyword, key)){
        result.val=myData[userKeyword][key];
        result.source="human";
    }
    else if(checkNested(myData, helperKeyword, key)){
        result.val=myData[helperKeyword][key];
        result.source="helper";
    }
    else{
        result.val=myData[key];
        result.source="file";
    }
    return result;
}

let checkNested = (obj, level,  ...rest) => {
    if (obj === undefined) return false
    if (rest.length == 0 && obj.hasOwnProperty(level)) return true
    return checkNested(obj[level], ...rest)
} 
let saveOutputJson = (jsonOrigin) =>{

    createOutputJson(jsonOrigin);
    download(JSON.stringify(jsonOrigin, null, 2), 'translation.json', 'text/plain');
}

let createOutputJson = (jsonOrigin) =>{
    for(const key in jsonOrigin){
        if(typeof jsonOrigin[key] == "string"){
            var element = document.getElementById(key);
            jsonOrigin[key] = element.value;
            console.log(jsonOrigin[key]);
        }
        else{
            console.log(key + " - " + jsonOrigin[key]);
            createOutputJson(jsonOrigin[key]);
        }
   } 
}

let createValidateCheckboxes = () =>{
    
    let checkboxes = document.getElementsByName("helper-checkbox");
    for (const checkbox of checkboxes){
        checkbox.addEventListener('change', function() {
        if (this.checked) {
            console.log("Checkbox is checked.." + this.id);
            let translationId = this.id.split("-")[1]
            let elementWithTranslation = document.getElementById(translationId);
            myData[userKeyword][translationId]=elementWithTranslation.value;
            console.log(myData[userKeyword][translationId]);
            this.style.display = 'none';
            let label = document.getElementById("lab-check-"+translationId)
            label.style.display = 'none';
        } 
        });
    }
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

const updateProgressBar = () =>{
    let numberOfUpdatedKeys = 0;
    let progressElement = document.getElementById("progress");
    let progressTextElement = document.getElementById("progressText");
    progressElement.setAttribute("max", numberOfTotalKeys);
    let toTranslate = document.getElementsByName("toTranslate");
    for(key in toTranslate){
        if(toTranslate[key].value != null && toTranslate[key].value != ""){
            numberOfUpdatedKeys++;
        }
    }
    progressTextElement.innerHTML = numberOfUpdatedKeys +" / " + numberOfTotalKeys + " keys updated";
    progressElement.value = numberOfUpdatedKeys;

}

setInterval(updateProgressBar, 5000)

