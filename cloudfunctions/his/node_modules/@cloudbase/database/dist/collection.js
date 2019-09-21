"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("./document");
const query_1 = require("./query");
const aggregate_1 = require("./aggregate");
class CollectionReference extends query_1.Query {
    constructor(db, coll) {
        super(db, coll);
    }
    get name() {
        return this._coll;
    }
    doc(docID) {
        return new document_1.DocumentReference(this._db, this._coll, docID);
    }
    add(data, callback) {
        let docRef = this.doc();
        return docRef.create(data, callback);
    }
    aggregate() {
        return new aggregate_1.default(this._db, this._coll);
    }
}
exports.CollectionReference = CollectionReference;
