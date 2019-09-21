export default class Aggregation {
    _db: any;
    _request: any;
    _stages: any[];
    _collectionName: string;
    constructor(db: any, collectionName: any);
    end(): Promise<any>;
    unwrap(): any[];
}
