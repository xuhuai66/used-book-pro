"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./lib/util");
const db_1 = require("./db");
const util_2 = require("./util");
const update_1 = require("./serializer/update");
const datatype_1 = require("./serializer/datatype");
const update_2 = require("./commands/update");
class DocumentReference {
    constructor(db, coll, docID, projection = {}) {
        this._db = db;
        this._coll = coll;
        this.id = docID;
        this.request = new db_1.Db.reqClass(this._db.config);
        this.projection = projection;
    }
    create(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        let params = {
            collectionName: this._coll,
            data: datatype_1.serialize(data)
        };
        if (this.id) {
            params['_id'] = this.id;
        }
        this.request.send('database.addDocument', params).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    id: res.data._id,
                    requestId: res.requestId
                });
            }
        }).catch((err) => {
            callback(err);
        });
        return callback.promise;
    }
    set(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        if (!data || typeof data !== 'object') {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        let hasOperator = false;
        const checkMixed = (objs) => {
            if (typeof objs === 'object') {
                for (let key in objs) {
                    if (objs[key] instanceof update_2.UpdateCommand) {
                        hasOperator = true;
                    }
                    else if (typeof objs[key] === 'object') {
                        checkMixed(objs[key]);
                    }
                }
            }
        };
        checkMixed(data);
        if (hasOperator) {
            return Promise.resolve({
                code: 'DATABASE_REQUEST_FAILED',
                message: 'update operator complicit'
            });
        }
        const merge = false;
        let param = {
            collectionName: this._coll,
            data: datatype_1.serialize(data),
            multi: false,
            merge,
            upsert: true
        };
        if (this.id) {
            param['query'] = { _id: this.id };
        }
        this.request.send('database.updateDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    updated: res.data.updated,
                    upsertedId: res.data.upserted_id,
                    requestId: res.requestId
                });
            }
        }).catch((err) => {
            callback(err);
        });
        return callback.promise;
    }
    update(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        if (!data || typeof data !== 'object') {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        const query = { _id: this.id };
        const merge = true;
        const param = {
            collectionName: this._coll,
            data: update_1.UpdateSerializer.encode(data),
            query: query,
            multi: false,
            merge,
            upsert: false
        };
        this.request.send('database.updateDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    updated: res.data.updated,
                    upsertedId: res.data.upserted_id,
                    requestId: res.requestId
                });
            }
        }).catch((err) => {
            callback(err);
        });
        return callback.promise;
    }
    remove(callback) {
        callback = callback || util_1.createPromiseCallback();
        const query = { _id: this.id };
        const param = {
            collectionName: this._coll,
            query: query,
            multi: false
        };
        this.request.send('database.deleteDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    deleted: res.data.deleted,
                    requestId: res.requestId
                });
            }
        }).catch((err) => {
            callback(err);
        });
        return callback.promise;
    }
    get(callback) {
        callback = callback || util_1.createPromiseCallback();
        const query = { _id: this.id };
        const param = {
            collectionName: this._coll,
            query: query,
            multi: false,
            projection: this.projection
        };
        this.request.send('database.queryDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                const documents = util_2.Util.formatResDocumentData(res.data.list);
                callback(0, {
                    data: documents,
                    requestId: res.requestId,
                    total: res.TotalCount,
                    limit: res.Limit,
                    offset: res.Offset
                });
            }
        }).catch((err) => {
            callback(err);
        });
        return callback.promise;
    }
    field(projection) {
        for (let k in projection) {
            if (projection[k]) {
                projection[k] = 1;
            }
            else {
                projection[k] = 0;
            }
        }
        return new DocumentReference(this._db, this._coll, this.id, projection);
    }
}
exports.DocumentReference = DocumentReference;
