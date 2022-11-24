## Json translator
This web application is intended to translate a json file from english to another language.

## Usage
npm install
node src/index.js
http://localhost:7070

### Select the language you want to translate

### Upload a json file
Key-values could be nested, in the values there should be text in english.
A table will appear in the application with the list of translations proposed by google.
you can either confirm the translation or update it.
The result is stored in google firestore, that works as a kind of cache.
Every time a translation is needed, the app will look first in firestore if the term has already been translated.
If it's not been translated yet then google translate will be invoked and the term will be stored in firestore for the future.

### Save/open a draft
You can save a draft on the filesystem, and open it again later on.
The already translated keys will pop up at the end of the page.

### Save the final work
When all the keys are translated you can save the final json that will contain the same keys than the original file and your translation.

## Prerequisites
you need to have a google cloud account and enable the api for firestores and translate.
Get a service-account.json file and store it in the project root. 