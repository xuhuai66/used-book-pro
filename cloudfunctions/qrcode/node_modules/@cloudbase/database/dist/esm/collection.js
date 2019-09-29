import { DocumentReference } from './document';
import { Query } from './query';
import Aggregation from './aggregate';
export class CollectionReference extends Query {
    constructor(db, coll) {
        super(db, coll);
    }
    get name() {
        return this._coll;
    }
    doc(docID) {
        return new DocumentReference(this._db, this._coll, docID);
    }
    add(data, callback) {
        let docRef = this.doc();
        return docRef.create(data, callback);
    }
    aggregate() {
        return new Aggregation(this._db, this._coll);
    }
}
