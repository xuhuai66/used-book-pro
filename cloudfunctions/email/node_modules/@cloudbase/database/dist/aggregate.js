"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const bson_1 = require("bson");
class Aggregation {
    constructor(db, collectionName) {
        this._db = db;
        this._request = new db_1.Db.reqClass(this._db.config);
        this._stages = [];
        this._collectionName = collectionName;
    }
    async end() {
        const result = await this._request.send('database.aggregate', {
            collectionName: this._collectionName,
            stages: this._stages
        });
        if (result && result.data && result.data.list) {
            return {
                requestId: result.requestId,
                data: JSON.parse(result.data.list).map(bson_1.EJSON.parse)
            };
        }
        return result;
    }
    unwrap() {
        return this._stages;
    }
}
exports.default = Aggregation;
const pipelineStages = [
    'addFields',
    'bucket',
    'bucketAuto',
    'count',
    'geoNear',
    'group',
    'limit',
    'match',
    'project',
    'lookup',
    'replaceRoot',
    'sample',
    'skip',
    'sort',
    'sortByCount',
    'unwind'
];
pipelineStages.forEach(stage => {
    Aggregation.prototype[stage] = function (param) {
        this._stages.push({
            stageKey: `$${stage}`,
            stageValue: JSON.stringify(param)
        });
        return this;
    };
});
