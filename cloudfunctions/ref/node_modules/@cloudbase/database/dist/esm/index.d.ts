import { Point } from './geo/point';
import { CollectionReference } from './collection';
import { Command } from './command';
interface GeoTeyp {
    Point: typeof Point;
}
export declare class Db {
    Geo: GeoTeyp;
    command: typeof Command;
    RegExp: any;
    serverDate: any;
    startTransaction: any;
    runTransaction: any;
    config: any;
    static ws: any;
    static reqClass: any;
    static getAccessToken: Function;
    constructor(config?: any);
    collection(collName: string): CollectionReference;
    createCollection(collName: string): any;
}
export {};
