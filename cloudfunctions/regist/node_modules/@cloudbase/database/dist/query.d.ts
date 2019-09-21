import { OrderByDirection } from './constant';
interface GetRes {
    data: any[];
    requestId: string;
    total: number;
    limit: number;
    offset: number;
}
export declare class Query {
    get(callback?: any): Promise<GetRes>;
    count(callback?: any): any;
    where(query: object): Query;
    orderBy(fieldPath: string, directionStr: OrderByDirection): Query;
    limit(limit: number): Query;
    skip(offset: number): Query;
    update(data: Object, callback?: any): Promise<any>;
    field(projection: Object): Query;
    remove(callback?: any): any;
}
export {};
