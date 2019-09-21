'use strict';

/**
 * A class representation of the BSON DBRef type.
 */
class DBRef {
  /**
   * Create a DBRef type
   *
   * @param {string} collection the collection name.
   * @param {ObjectId} oid the reference ObjectId.
   * @param {string} [db] optional db name, if omitted the reference is local to the current db.
   * @return {DBRef}
   */
  constructor(collection, oid, db, fields) {
    // check if namespace has been provided
    const parts = collection.split('.');
    if (parts.length === 2) {
      db = parts.shift();
      collection = parts.shift();
    }

    this.collection = collection;
    this.oid = oid;
    this.db = db;
    this.fields = fields || {};
  }

  /**
   * @ignore
   * @api private
   */
  toJSON() {
    const o = Object.assign(
      {
        $ref: this.collection,
        $id: this.oid
      },
      this.fields
    );

    if (this.db != null) o.$db = this.db;
    return o;
  }

  /**
   * @ignore
   */
  toExtendedJSON() {
    let o = {
      $ref: this.collection,
      $id: this.oid
    };

    if (this.db) o.$db = this.db;
    o = Object.assign(o, this.fields);
    return o;
  }

  /**
   * @ignore
   */
  static fromExtendedJSON(doc) {
    var copy = Object.assign({}, doc);
    ['$ref', '$id', '$db'].forEach(k => delete copy[k]);
    return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
  }
}

Object.defineProperty(DBRef.prototype, '_bsontype', { value: 'DBRef' });
// the 1.x parser used a "namespace" property, while 4.x uses "collection". To ensure backwards
// compatibility, let's expose "namespace"
Object.defineProperty(DBRef.prototype, 'namespace', {
  get() {
    return this.collection;
  },
  set(val) {
    this.collection = val;
  },
  configurable: false
});
module.exports = DBRef;
