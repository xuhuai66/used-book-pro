import { DB } from '../typings/index';
interface ISnapshotConstructorOptions {
    id: number;
    docChanges: DB.ISingleDBEvent[];
    docs: Record<string, any>[];
    type?: DB.SnapshotType;
    msgType?: String;
}
export declare class Snapshot implements DB.ISnapshot {
    id: number;
    docChanges: DB.ISingleDBEvent[];
    docs: Record<string, any>[];
    type?: 'init';
    constructor(options: ISnapshotConstructorOptions);
}
export {};
