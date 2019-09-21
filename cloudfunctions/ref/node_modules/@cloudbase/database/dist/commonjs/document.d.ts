import { DB } from './typings/index';
export declare class DocumentReference {
    readonly id: string;
    readonly projection: Object;
    private _getAccessToken;
    set(data: Object, callback?: any): Promise<any>;
    update(data: Object, callback?: any): any;
    remove(callback?: any): Promise<any>;
    get(callback?: any): Promise<any>;
    field(projection: Object): DocumentReference;
    watch: (options: DB.IWatchOptions) => DB.RealtimeListener;
}
