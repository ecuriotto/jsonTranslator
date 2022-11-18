const Firestore = require('@google-cloud/firestore');
const path = require('path');
//import { collection, query, where, getDocs } from Firestore;

class FirestoreClient {
    constructor(){
        this.firestore = new Firestore({
            projectId: 'enrico-curiotto',
            keyFilename: path.join(__dirname, '/serviceAccount/service-account.json')

        })
    }
    async save(collection, data){
        const docRef = this.firestore.collection(collection).doc(data.languageCode);
        await docRef.set(data);

    }

    async saveByPath(path, data){
        const docRef = this.firestore.doc(path);
        await docRef.set(data, { merge: true });
    }

    async getByPath(path){
        return this.firestore.doc(path) 
    }

    async getExistingPhrasesFromFirestore(path){
        let myDoc = this.firestore.doc(path)
        const response = await myDoc.get()
        //console.log(response);
        return response;
    }
    /*
    async getExistingPhrasesFromFirestoreIncluded(collection, filePhrases){
        const lang = this.firestore.collection(collection)
        const out = query(lang, )
    }
    */

}

module.exports = new FirestoreClient()