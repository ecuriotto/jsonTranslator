const InputData = require('../model/inputData')
let body = JSON.parse(
    `{ 
        "appName": "Optimize",
        "navigation": { 
          "homepage": "Home", 
          "analysis": "Analysis"
        },
        "templates": { 
          "homepage": "Home", 
          "noProcessHint": "Create Blank Dashboard", 
          "noXmlHint": "Select Process definition to display diagram", 
          "blankSlate": { 
            "selectProcess": "Select up to 10 process definitions", 
            "selectTemplate": "Select a template" 
          } 
        },
        "***MYTRANS***": {
            "appName": "Optimize"
          } 
      }`
) 

InputData.saveDataFromFile(body, "it");