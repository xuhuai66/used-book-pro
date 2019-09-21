import { Db } from './index';
import { EJSON } from 'bson';
export default class Aggregation {
    constructor(db, collectionName) {
        this._db = db;
        this._request = new Db.reqClass(this._db.config);
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
                data: JSON.parse(result.data.list).map(EJSON.parse)
            };
        }
        return result;
    }
    unwrap() {
        return this._stages;
    }
}
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
