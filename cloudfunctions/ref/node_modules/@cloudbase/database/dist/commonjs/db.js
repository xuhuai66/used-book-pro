"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Geo = require("./geo/index");
const collection_1 = require("./collection");
const command_1 = require("./command");
const index_1 = require("./serverDate/index");
const index_2 = require("./regexp/index");
const transaction_1 = require("./transaction");
class Db {
    constructor(config) {
        this.config = config;
        this.Geo = Geo;
        this.serverDate = index_1.ServerDateConstructor;
        this.command = command_1.Command;
        this.RegExp = index_2.RegExpConstructor;
        this.startTransaction = transaction_1.startTransaction;
        this.runTransaction = transaction_1.runTransaction;
    }
    collection(collName) {
        if (!collName) {
            throw new Error('Collection name is required');
        }
        return new collection_1.CollectionReference(this, collName);
    }
    createCollection(collName) {
        let request = new Db.reqClass(this.config);
        const params = {
            collectionName: collName
        };
        return request.send('database.addCollection', params);
    }
}
exports.Db = Db;
