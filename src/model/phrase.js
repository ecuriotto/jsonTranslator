Phrase = class {
  key = "";
  eng = "";
  suggestedTrans = "";
  inFirestore;
  previouslyTranslated = "";
  orderId = "";

  constructor(key, eng) {
    this.key = key;
    this.eng = eng;
  }
  get eng() {
    return this.eng;
  }
  set eng(value) {
    this.eng = value;
  }

  get suggestedTrans() {
    return this.suggestedTrans;
  }
  set suggestedTrans(value) {
    this.suggestedTrans = value;
  }
  get key() {
    return this.key;
  }
  set key(value) {
    this.key = value;
  }
  get inFirestore() {
    return this.inFirestore;
  }
  set inFirestore(value) {
    this.inFirestore = value;
  }

  get previouslyTranslated() {
    return this.previouslyTranslated;
  }
  set previouslyTranslated(value) {
    this.previouslyTranslated = value;
  }
  get orderId() {
    return this.orderId;
  }
  set orderId(value) {
    this.orderId = value;
  }
  print = () => {
    console.log(this);
  };
};

module.exports = Phrase;
