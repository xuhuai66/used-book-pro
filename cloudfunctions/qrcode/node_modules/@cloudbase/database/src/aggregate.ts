import { Db } from './index'
import { EJSON } from 'bson'
export default class Aggregation {
  _db: any
  _request: any
  _stages: any[]
  _collectionName: string
  constructor(db, collectionName) {
    this._db = db
    this._request = new Db.reqClass(this._db.config)
    this._stages = []
    this._collectionName = collectionName
  }

  async end() {
    const result = await this._request.send('database.aggregate', {
      collectionName: this._collectionName,
      stages: this._stages
    })
    if (result && result.data && result.data.list) {
      return {
        requestId: result.requestId,
        data: JSON.parse(result.data.list).map(EJSON.parse)
      }
    }
    return result
  }

  unwrap() {
    return this._stages
  }
}

const pipelineStages = [
  'addFields',
  'bucket', // 分块
  'bucketAuto', // 自动分块
  'count',
  'geoNear', // 地理位置
  'group',
  'limit',
  'match',
  'project',
  'lookup',
  'replaceRoot',
  'sample', // 随机提取doc
  'skip',
  'sort',
  'sortByCount', // 根据数量排序
  'unwind' // 数组字段一拆多
]
pipelineStages.forEach(stage => {
  Aggregation.prototype[stage] = function(param) {
    this._stages.push({
      stageKey: `$${stage}`,
      stageValue: JSON.stringify(param)
    })
    return this
  }
})
