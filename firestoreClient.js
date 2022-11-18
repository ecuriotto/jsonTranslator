const Firestore = require('@google-cloud/firestore');
const path = require('path');
//import { collection, query, where, getDocs } from Firestore;

class FirestoreClient {
    rootCollection = "dictionary";
    constructor(){
        this.firestore = new Firestore({
            projectId: 'enrico-curiotto',
            keyFilename: path.join(__dirname, '/serviceAccount/service-account.json')

        })
    }

    async saveByPath(collection, data){
        const docRef = this.firestore.doc(path.join(this.rootCollection, collection ));
        await docRef.set(data, { merge: true });
    }

    async getExistingPhrasesFromFirestore(collection){
        let myDoc = this.firestore.doc(path.join(this.rootCollection, collection ))
        const response = await myDoc.get()
        //console.log(response);
        return response;
    }
 

}

module.exports = new FirestoreClient()