"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Geo = require("./geo");
const collection_1 = require("./collection");
const command_1 = require("./command");
const serverDate_1 = require("./serverDate");
const regexp_1 = require("./regexp");
class Db {
    constructor(config) {
        this.config = config;
        this.Geo = Geo;
        this.serverDate = serverDate_1.ServerDateConstructor;
        this.command = command_1.Command;
        this.RegExp = regexp_1.RegExpConstructor;
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
