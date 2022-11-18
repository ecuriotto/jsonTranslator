let languageSelection = {
    language: "",
    //TODO remove the hardcode
    codeInternal:"it",
    codeListener: function(val){},
    set code(val){
        this.codeInternal = val;
        this.codeListener(val);
    },
    get code(){
        return this.codeInternal;
    },
    registerListener: function(listener){
        this.codeListener = listener;
    }
}

languageSelection.registerListener(function(val) {
    nextStep(1);
    document.getElementById("file-selector").disabled = false;
});

//Get Countries From Json File
const searchcountry = async searchBox => {
    const res = await fetch('../data/supported_languages.json');
    const countries = await res.json();
  
    //Get Entered Data
    let fits = countries.text.filter(country => {
      const regex = new RegExp(`^${searchBox}`, 'gi');
      if(country.language.match(regex))
        return country.language
    });
  
    if (searchBox.length === 0) {
      fits = [];
      countryList.innerHTML = '';
    }
  
    outputHtml(fits);
};
  
const fillInputWithChoice = (language, code) =>{
    document.getElementById("search").value = language;
    languageSelection.language = language;
    languageSelection.code = code;
    
    for(const el of document.getElementsByName("suggestion")){
        el.style.display = 'none';
    }
    
}

// show results in HTML
const outputHtml = fits => {
    if (fits.length > 0) {
      const html = fits
        .map(
          fit => `
       <div name="suggestion" class="row">
       <div class="col s12">
         <div class="card  grey darken-4 darken-1">
           <div class="card-content white-text">
             <a onclick="fillInputWithChoice(\'${fit.language}\',\'${fit.code}\');" href="javascript:void(0);">${fit.language} (${fit.code})</a>
           </div>
         </div>
       </div>
     </div>
       `
        )
        .join('');
  
      document.getElementById('countryList').innerHTML = html;
      
    }
};
  
