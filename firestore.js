const FirestoreClient = require('./firestoreClient')

const dictionary = {
    languageCode: 'it',
}

const firstKey = {
    "home":"casa",
    "chair":"sedia"
}
const secondKey = {
    "cat":"gatto",
    "dog":"cane"
}

const save = async() => {
    await FirestoreClient.save('dictionary', dictionary);
}

const saveByPath = async() => {
    await FirestoreClient.saveByPath("dictionary/it/", firstKey)
}

const getByPath = async() => {
    const resp = FirestoreClient.getByPath("dictionary/it/");
    const doc = await resp.get();
    console.log(doc);
}


//save();
getByPath();