import { Point } from './geo/point'
import * as Geo from './geo'
import { CollectionReference } from './collection'
import { Command } from './command'
import { ServerDateConstructor } from './serverDate'
import { RegExpConstructor } from './regexp'

/**
 * 地理位置类型
 */
interface GeoTeyp {
  Point: typeof Point;
}

/**
 * 数据库模块
 *
 * @author haroldhu
 */
export class Db {
  /**
   * Geo 类型
   */
  Geo: GeoTeyp;

  /**
   * 逻辑操作的命令
   */
  command: typeof Command;

  RegExp: any;

  serverDate: any;

  /**
   * 初始化
   *
   * 默认是 `default` 数据库，为今后扩展使用
   *
   * @param config
   */
  config: any;
  
  static reqClass: any;

  constructor(config?: any) {
    this.config = config
    this.Geo = Geo
    this.serverDate = ServerDateConstructor
    this.command = Command
    this.RegExp = RegExpConstructor
  }

  /**
   * 获取集合的引用
   *
   * @param collName - 集合名称
   */
  collection(collName: string): CollectionReference {
    if (!collName) {
      throw new Error('Collection name is required')
    }
    return new CollectionReference(this, collName)
  }

  /**
   * 创建集合
   */
  createCollection(collName: string) {
    let request = new Db.reqClass(this.config)

    const params = {
      collectionName: collName
    }

    return request.send('database.addCollection', params)
  }
}
