import {
  IBoundTunnelRequestOptions,
  IBoundTunnelRequest,
  ITunnelResponse
} from './network'

/**
 * Common interfaces and types
 */

export interface IAPIError {
  errMsg: string
}

export interface IAPIParam<T = any> {
  config?: ICloudConfig
  success?: (res: T) => void
  fail?: (err: IAPIError) => void
  complete?: (val: T | IAPIError) => void
}

export interface IAPISuccessParam {
  errMsg: string
}

export type IAPICompleteParam = IAPISuccessParam | IAPIError

export type IAPIFunction<T, P extends IAPIParam<T>> = (
  param: P
) => Promise<T> | any

export interface IInitCloudConfig {
  env?:
    | string
    | {
        database?: string
        functions?: string
        storage?: string
      }
  traceUser?: boolean
}

export interface ICloudConfig {
  env?: string
  traceUser?: boolean
}

export interface IICloudAPI {
  init: (config?: IInitCloudConfig) => void
  [api: string]: AnyFunction | IAPIFunction<any, any>
}

export interface ICloudService {
  name: string
  context: IServiceContext
  getAPIs: () => { [name: string]: IAPIFunction<any, any> }
}

export interface IServiceContext {
  // name: string
  // identifiers: IRuntimeIdentifiers
  // request: IBoundTunnelRequest
  // debug: boolean
  env?: string
}

export interface ICloudServices {
  [serviceName: string]: ICloudService
}

export interface ICloudMetaData {
  session_id: string
}

export interface ICloudAppConfig {
  db_doc_size_limit: number
  db_realtime_ping_interval: number
  db_realtime_pong_wait_timeout: number
  upload_max_file_size: number
  get_temp_file_url_max_requests: number
  call_function_poll_max_retry: number
  call_function_max_req_data_size: number
  call_function_client_poll_timeout: number
  call_function_valid_start_retry_gap: number
}

export interface ICloudClass {
  appConfig: ICloudAppConfig
  apiPermissions: object
  identifiers: IRuntimeIdentifiers
  debug: boolean
  defaultConfig: IInitCloudConfig
  getOverriddenConfig(config: IInitCloudConfig): IInitCloudConfig
  getEnv(config: IInitCloudConfig, service: string): string | undefined
  getMetaData(): ICloudMetaData
  registerService(service: ICloudService): void
  request(options: IBoundTunnelRequestOptions): Promise<ITunnelResponse>
}

export interface IRuntimeIdentifiers {
  pluginId?: string
  [key: string]: any
}

export type AnyObject = {
  [x: string]: any
}

export type AnyArray = any[]

export type AnyFunction = (...args: any[]) => any

export type ICloudReportValueArray = [
  0, // type	上报类型
  string, // api 云api名
  number, // totalTime	api总耗时
  number, // tunnelTime	api数据管道耗时
  number, // scfPollTime	云函数单次轮询耗时
  string // networkType 网络类型
]

/**
 * original wx
 */

declare namespace WXNS {
  interface AnyObject {
    [key: string]: any
  }

  interface IAPIParam<T> {
    success?: (res: T) => void
    fail?: (err: IAPIError) => void
    complete?: (val: T | IAPIError) => void
  }

  interface CommonAPIResult {
    errMsg: string
  }

  interface IAPIError {
    errMsg: string
  }

  interface IProgressUpdateEvent {
    progress: number
    totalBytesWritten: number
    totalBytesExpectedToWrite: number
  }

  interface operateWXData {
    (param: any): void
  }

  interface uploadFile {
    /**
     * upload file
     * @param param
     */
    (param: IUploadFileParam): IUploadFileTask
  }

  interface IUploadFileParam extends IAPIParam<IUploadFileSuccessResult> {
    url: string
    filePath: string
    name: string
    header?: AnyObject
  }

  interface IUploadFileSuccessResult extends CommonAPIResult {
    data: string
    statusCode: number
  }

  interface IUploadFileTask {
    onProgressUpdate: (fn: (event: IProgressUpdateEvent) => void) => void
    abort: AnyFunction
  }

  interface downloadFile {
    /**
     * download file
     * @param param
     */
    (param: IDownloadFileParam): IDownloadFileTask
  }

  interface IDownloadFileParam extends IAPIParam<IDownloadFileSuccessResult> {
    url: string
    header?: AnyObject
  }

  interface IDownloadFileSuccessResult extends CommonAPIResult {
    tempFilePath: string
    statusCode: number
  }

  interface IDownloadFileTask {
    onProgressUpdate: (fn: (event: IProgressUpdateEvent) => void) => void
    abort: AnyFunction
  }

  interface request {
    (param: IRequestParam): IRequestTask
  }

  interface IRequestParam extends IAPIParam<IRequestSuccessResult> {
    url: string
    data?: AnyObject | string | ArrayBuffer
    header?: AnyObject
    method?: string
    dataType?: string
    responseType?: string
  }

  interface IRequestSuccessResult {
    data: AnyObject | string | ArrayBuffer
    statusCode: number
    header: AnyObject
  }

  interface IRequestTask {
    abort: () => void
  }

  interface socketFactory {
    (): ISocketMethods
  }

  interface ISocketMethods {
    connectSocket: (args: Socket.IConnectSocketOptions) => Socket.ISocketTask
    closeSocket: (args: Socket.ICloseSocketOptions) => void
    sendSocketMessage: (args: Socket.ISendSocketMessageOptions) => void
    onSocketOpen: (
      callback: (res?: Socket.IOnSocketOpenCallbackParam) => void
    ) => void
    onSocketClose: (callback: () => void) => void
    onSocketMessage: (
      callback: (res?: Socket.IOnSocketMessageCallbackParam) => void
    ) => void
    onSocketError: (callback: (error: any) => void) => void
  }

  namespace Socket {
    type READY_STATE =
      | 0 // CONNECTING
      | 1 // OPEN
      | 2 // CLOSING
      | 3 // CLOSED

    interface ISocketTask {
      readyState: READY_STATE
      // send(options: ISocketTaskSendOptions): void
      send(msg: String): void
      close(code: Number, reason: String): void
      // on(type: String, callback: any): void
      // onopen(callback: (res: ISocketTaskOnOpenCallbackParam) => void): void
      // onclose(callback: (event: IOnSocketCloseCallbackParam) => void): void
      // onerror(callback: (error: any) => void): void
      // onmessage(
      //   callback: (res: ISocketTaskOnMessageCallbackParam) => void
      // ): void
      onopen(event: any): void
      onclose(event: any): void
      onerror(event: any): void
      onmessage(event: any): void
    }

    interface ISocketTaskSendOptions extends IAPIParam<any> {
      data: string | ArrayBuffer
    }

    interface ISocketTaskCloseOptions extends IAPIParam<any> {
      code?: number
      reason?: string
    }

    interface ISocketTaskOnOpenCallbackParam {
      header: Record<string, string>
    }

    interface ISocketTaskOnMessageCallbackParam {
      data: string | ArrayBuffer
    }

    interface IConnectSocketOptions extends IAPIParam<void> {
      url: string
      header?: Record<string, string>
      protocols?: string[]
      tcbNoDelay?: boolean
    }

    interface ICloseSocketOptions extends IAPIParam<void> {
      code?: number
      reason?: string
    }

    interface ISendSocketMessageOptions extends IAPIParam<void> {
      data: string | ArrayBuffer
    }

    interface IOnSocketOpenCallbackParam {
      header: Record<string, string>
    }

    interface IOnSocketMessageCallbackParam {
      data: string | ArrayBuffer
    }

    interface IOnSocketCloseCallbackParam {
      code: number
      reason: string
    }
  }

  interface getFileInfo {
    (param: IGetFileInfoParam): void
  }

  interface IGetFileInfoParam extends IAPIParam<IGetFileInfoSuccessResult> {
    filePath: string
    digestAlgorithm?: string
  }

  interface IGetFileInfoSuccessResult {
    size: number
    digest: string
  }

  interface IGetNetworkTypeParam
    extends IAPIParam<IGetNetworkTypeSuccessResult> {}

  interface IGetNetworkTypeSuccessResult {
    networkType: NetworkType
  }

  interface IOnNetworkStatusChangeCallback {
    (res: { isConnected: boolean; networkType: NetworkType }): void
  }

  type NetworkType = 'wifi' | '4g' | '3g' | '2g' | 'unknown' | 'none'
}

declare interface WX {
  operateWXData(param: any): void
  uploadFile(param: WXNS.IUploadFileParam): WXNS.IUploadFileTask
  downloadFile(param: WXNS.IDownloadFileParam): WXNS.IDownloadFileTask
  request(param: WXNS.IRequestParam): WXNS.IRequestTask
  getFileInfo(param: WXNS.IGetFileInfoParam): void
  getNetworkType(param: WXNS.IGetNetworkTypeParam): void
  onNetworkStatusChange(callback: WXNS.IOnNetworkStatusChangeCallback): void
  version: {
    version: string // eg. "2.7.4"
    updateTime: string // eg. "2019.7.5 10:26:14"
  }
}

/**
 * extend wx with cloud
 */
declare interface WX {
  cloud: {
    init: (config?: ICloudConfig) => void

    callFunction: (
      param: ICloud.CallFunctionParam
    ) => Promise<ICloud.CallFunctionResult> | void

    uploadFile: (
      param: ICloud.UploadFileParam
    ) => Promise<ICloud.UploadFileResult> | WXNS.IUploadFileTask
    downloadFile: (
      param: ICloud.DownloadFileParam
    ) => Promise<ICloud.DownloadFileResult> | WXNS.IDownloadFileTask
    getTempFileURL: (
      param: ICloud.GetTempFileURLParam
    ) => Promise<ICloud.GetTempFileURLResult> | void
    deleteFile: (
      param: ICloud.DeleteFileParam
    ) => Promise<ICloud.DeleteFileResult> | void

    database: (config?: DB.IDatabaseConfig) => DB.Database
  }
}

declare namespace ICloud {
  interface ICloudAPIParam<T = any> extends IAPIParam<T> {
    config?: ICloudConfig
  }

  // === API: callFunction ===
  export type CallFunctionData = AnyObject

  export interface CallFunctionResult extends IAPISuccessParam {
    result: AnyObject | string | undefined
    requestID?: string
  }

  export interface CallFunctionParam
    extends ICloudAPIParam<CallFunctionResult> {
    name: string
    data?: CallFunctionData
    slow?: boolean
    version?: number
  }
  // === end ===

  // === API: uploadFile ===
  export interface UploadFileResult extends IAPISuccessParam {
    fileID: string
    statusCode: number
  }

  export interface UploadFileParam extends ICloudAPIParam<UploadFileResult> {
    cloudPath: string
    filePath: string
    header?: AnyObject
  }
  // === end ===

  // === API: downloadFile ===
  export interface DownloadFileResult extends IAPISuccessParam {
    tempFilePath: string
    statusCode: number
  }

  export interface DownloadFileParam
    extends ICloudAPIParam<DownloadFileResult> {
    fileID: string
    cloudPath?: string
  }
  // === end ===

  // === API: getTempFileURL ===
  export interface GetTempFileURLResult extends IAPISuccessParam {
    fileList: GetTempFileURLResultItem[]
  }

  export interface GetTempFileURLResultItem {
    fileID: string
    tempFileURL: string
    maxAge: number
    status: number
    errMsg: string
  }

  export interface GetTempFileURLParam
    extends ICloudAPIParam<GetTempFileURLResult> {
    fileList: (
      | string
      | {
          fileID: string
          maxAge?: number
        })[]
  }
  // === end ===

  // === API: deleteFile ===
  interface DeleteFileResult extends IAPISuccessParam {
    fileList: DeleteFileResultItem[]
  }

  interface DeleteFileResultItem {
    fileID: string
    status: number
    errMsg: string
  }

  interface DeleteFileParam extends ICloudAPIParam<DeleteFileResult> {
    fileList: string[]
  }
  // === end ===

  // === API: CloudID ===
  abstract class CloudID {
    constructor(cloudID: string)
  }
  // === end ===
}

// === Functions ===
declare namespace Functions {
  export interface IFunctionsServiceContext extends IServiceContext {
    appConfig: {
      maxReqDataSize: number
      maxPollRetry: number
      maxStartRetryGap: number
      clientPollTimeout: number
    }
  }
}

// === Storage ===
declare namespace Storage {
  export interface IStorageServiceContext extends IServiceContext {
    appConfig: {
      uploadMaxFileSize: number
      getTempFileURLMaxReq: number
    }
  }
}

// === Utils ===
declare namespace Utils {
  export interface IUtilsServiceContext extends IServiceContext {}
}

// === Database ===
declare namespace DB {
  /**
   * The class of all exposed cloud database instances
   */
  export class Database {
    public readonly identifiers: IRuntimeIdentifiers
    public readonly context: IDatabaseServiceContext
    public config: IDatabaseConfig
    public readonly command: DatabaseCommand
    public readonly Geo: IGeo
    public readonly serverDate: () => ServerDate
    public readonly RegExp: IRegExpConstructor
    public readonly engine: IEngine
    public readonly __safe_props__?: Set<string>
    public readonly debug?: boolean

    private constructor(options: IDatabaseConstructorOptions)

    collection(collectionName: string): CollectionReference

    setConfig(config: IDatabaseConfig): void
  }

  export interface IDatabaseConfig {
    env?: string
    realtimeDatabase?: {
      // max retry on connection failure
      maxReconnect?: number
      // interval between reconnection attempt, unit: seconds
      reconnectInterval?: number
    }
  }

  export class CollectionReference extends Query {
    public readonly collectionName: string
    public readonly database: Database
    public readonly __safe_props__?: Set<string>

    private constructor(name: string, database: Database)

    doc(docId: string | number): DocumentReference

    add(options: IAddDocumentOptions): Promise<IAddResult> | void | string

    aggregate(): Aggregate
  }

  export class DocumentReference {
    public readonly __safe_props__?: Set<string>

    private constructor(docId: string | number, database: Database)

    field(object: object): this

    get(
      options?: IGetDocumentOptions
    ): Promise<IQuerySingleResult> | void | string

    set(
      options?: ISetSingleDocumentOptions
    ): Promise<ISetResult> | void | string

    update(
      options?: IUpdateSingleDocumentOptions
    ): Promise<IUpdateResult> | void | string

    remove(
      options?: IRemoveSingleDocumentOptions
    ): Promise<IRemoveResult> | void | string
  }

  export class Query {
    public readonly collectionName: string
    public readonly __safe_props__?: Set<string>

    where(condition: IQueryCondition): Query

    orderBy(fieldPath: string, order: string): Query

    limit(max: number): Query

    skip(offset: number): Query

    field(object: object): Query

    get(options?: IGetDocumentOptions): Promise<IQueryResult> | void | string

    // update(options?: IUpdateDocumentOptions): Promise<IUpdateResult> | void

    // remove(options?: IRemoveDocumentOptions): Promise<IRemoveResult> | void

    count(
      options?: ICountDocumentOptions
    ): Promise<ICountResult> | void | string

    watch(options: IWatchOptions): RealtimeListener
  }

  export class PipelineBase<T> {
    addFields(val: any): T
    bucket(val: any): T
    bucketAuto(val: any): T
    collStats(val: any): T
    count(val: any): T
    facet(val: any): T
    geoNear(val: any): T
    graphLookup(val: any): T
    group(val: any): T
    indexStats(val: any): T
    limit(val: any): T
    lookup(val: any): T
    match(val: any): T
    out(val: any): T
    project(val: any): T
    redact(val: any): T
    replaceRoot(val: any): T
    sample(val: any): T
    skip(val: any): T
    sort(val: any): T
    sortByCount(val: any): T
    unwind(val: any): T

    end(): void
  }

  export class Pipeline extends PipelineBase<Pipeline> {}

  export class Aggregate extends PipelineBase<Aggregate> {
    end(options?: IDBAPIParam): Promise<IAggregateResult> | void
  }

  export interface IRealtimeListenerConstructorOptions extends IWatchOptions {
    // ws: any
    // query: string
  }

  export class RealtimeListener {
    private constructor(options: IRealtimeListenerConstructorOptions)
    // "And Now His Watch Is Ended"
    close: () => void
  }

  export interface DatabaseCommand {
    __safe_props__?: Set<string>

    eq(val: any): DatabaseQueryCommand
    neq(val: any): DatabaseQueryCommand
    gt(val: any): DatabaseQueryCommand
    gte(val: any): DatabaseQueryCommand
    lt(val: any): DatabaseQueryCommand
    lte(val: any): DatabaseQueryCommand
    in(val: any[]): DatabaseQueryCommand
    nin(val: any[]): DatabaseQueryCommand

    geoNear(options: IGeoNearCommandOptions): DatabaseQueryCommand
    geoWithin(options: IGeoWithinCommandOptions): DatabaseQueryCommand
    geoIntersects(options: IGeoIntersectsCommandOptions): DatabaseQueryCommand

    and(
      ...expressions: (DatabaseLogicCommand | IQueryCondition)[]
    ): DatabaseLogicCommand
    or(
      ...expressions: (DatabaseLogicCommand | IQueryCondition)[]
    ): DatabaseLogicCommand

    set(val: any): DatabaseUpdateCommand
    remove(): DatabaseUpdateCommand
    inc(val: number): DatabaseUpdateCommand
    mul(val: number): DatabaseUpdateCommand

    push(...values: any[]): DatabaseUpdateCommand
    pop(): DatabaseUpdateCommand
    shift(): DatabaseUpdateCommand
    unshift(...values: any[]): DatabaseUpdateCommand

    aggregate: {
      abs(val: any): DatabaseAggregateCommand
      add(val: any): DatabaseAggregateCommand
      addToSet(val: any): DatabaseAggregateCommand
      allElementsTrue(val: any): DatabaseAggregateCommand
      and(val: any): DatabaseAggregateCommand
      anyElementTrue(val: any): DatabaseAggregateCommand
      arrayElemAt(val: any): DatabaseAggregateCommand
      arrayToObject(val: any): DatabaseAggregateCommand
      avg(val: any): DatabaseAggregateCommand
      ceil(val: any): DatabaseAggregateCommand
      cmp(val: any): DatabaseAggregateCommand
      concat(val: any): DatabaseAggregateCommand
      concatArrays(val: any): DatabaseAggregateCommand
      cond(val: any): DatabaseAggregateCommand
      convert(val: any): DatabaseAggregateCommand
      dateFromParts(val: any): DatabaseAggregateCommand
      dateToParts(val: any): DatabaseAggregateCommand
      dateFromString(val: any): DatabaseAggregateCommand
      dateToString(val: any): DatabaseAggregateCommand
      dayOfMonth(val: any): DatabaseAggregateCommand
      dayOfWeek(val: any): DatabaseAggregateCommand
      dayOfYear(val: any): DatabaseAggregateCommand
      divide(val: any): DatabaseAggregateCommand
      eq(val: any): DatabaseAggregateCommand
      exp(val: any): DatabaseAggregateCommand
      filter(val: any): DatabaseAggregateCommand
      first(val: any): DatabaseAggregateCommand
      floor(val: any): DatabaseAggregateCommand
      gt(val: any): DatabaseAggregateCommand
      gte(val: any): DatabaseAggregateCommand
      hour(val: any): DatabaseAggregateCommand
      ifNull(val: any): DatabaseAggregateCommand
      in(val: any): DatabaseAggregateCommand
      indexOfArray(val: any): DatabaseAggregateCommand
      indexOfBytes(val: any): DatabaseAggregateCommand
      indexOfCP(val: any): DatabaseAggregateCommand
      isArray(val: any): DatabaseAggregateCommand
      isoDayOfWeek(val: any): DatabaseAggregateCommand
      isoWeek(val: any): DatabaseAggregateCommand
      isoWeekYear(val: any): DatabaseAggregateCommand
      last(val: any): DatabaseAggregateCommand
      let(val: any): DatabaseAggregateCommand
      literal(val: any): DatabaseAggregateCommand
      ln(val: any): DatabaseAggregateCommand
      log(val: any): DatabaseAggregateCommand
      log10(val: any): DatabaseAggregateCommand
      lt(val: any): DatabaseAggregateCommand
      lte(val: any): DatabaseAggregateCommand
      ltrim(val: any): DatabaseAggregateCommand
      map(val: any): DatabaseAggregateCommand
      max(val: any): DatabaseAggregateCommand
      mergeObjects(val: any): DatabaseAggregateCommand
      meta(val: any): DatabaseAggregateCommand
      min(val: any): DatabaseAggregateCommand
      millisecond(val: any): DatabaseAggregateCommand
      minute(val: any): DatabaseAggregateCommand
      mod(val: any): DatabaseAggregateCommand
      month(val: any): DatabaseAggregateCommand
      multiply(val: any): DatabaseAggregateCommand
      neq(val: any): DatabaseAggregateCommand
      not(val: any): DatabaseAggregateCommand
      objectToArray(val: any): DatabaseAggregateCommand
      or(val: any): DatabaseAggregateCommand
      pow(val: any): DatabaseAggregateCommand
      push(val: any): DatabaseAggregateCommand
      range(val: any): DatabaseAggregateCommand
      reduce(val: any): DatabaseAggregateCommand
      reverseArray(val: any): DatabaseAggregateCommand
      rtrim(val: any): DatabaseAggregateCommand
      second(val: any): DatabaseAggregateCommand
      setDifference(val: any): DatabaseAggregateCommand
      setEquals(val: any): DatabaseAggregateCommand
      setIntersection(val: any): DatabaseAggregateCommand
      setIsSubset(val: any): DatabaseAggregateCommand
      setUnion(val: any): DatabaseAggregateCommand
      size(val: any): DatabaseAggregateCommand
      slice(val: any): DatabaseAggregateCommand
      split(val: any): DatabaseAggregateCommand
      sqrt(val: any): DatabaseAggregateCommand
      stdDevPop(val: any): DatabaseAggregateCommand
      stdDevSamp(val: any): DatabaseAggregateCommand
      strcasecmp(val: any): DatabaseAggregateCommand
      strLenBytes(val: any): DatabaseAggregateCommand
      strLenCP(val: any): DatabaseAggregateCommand
      substr(val: any): DatabaseAggregateCommand
      substrBytes(val: any): DatabaseAggregateCommand
      substrCP(val: any): DatabaseAggregateCommand
      subtract(val: any): DatabaseAggregateCommand
      sum(val: any): DatabaseAggregateCommand
      switch(val: any): DatabaseAggregateCommand
      toBool(val: any): DatabaseAggregateCommand
      toDate(val: any): DatabaseAggregateCommand
      toDecimal(val: any): DatabaseAggregateCommand
      toDouble(val: any): DatabaseAggregateCommand
      toInt(val: any): DatabaseAggregateCommand
      toLong(val: any): DatabaseAggregateCommand
      toObjectId(val: any): DatabaseAggregateCommand
      toString(val: any): DatabaseAggregateCommand
      toLower(val: any): DatabaseAggregateCommand
      toUpper(val: any): DatabaseAggregateCommand
      trim(val: any): DatabaseAggregateCommand
      trunc(val: any): DatabaseAggregateCommand
      type(val: any): DatabaseAggregateCommand
      week(val: any): DatabaseAggregateCommand
      year(val: any): DatabaseAggregateCommand
      zip(val: any): DatabaseAggregateCommand

      pipeline(): Pipeline
    }
  }

  export enum AGGREGATE_COMMANDS_LITERAL {
    AVG = 'avg',
    MULTIPLY = 'multiply',
    SUM = 'sum'
  }

  export class DatabaseAggregateCommand {
    public fieldName: string | symbol
    public operator: AGGREGATE_COMMANDS_LITERAL | string
    public operands: any[]

    _setFieldName(fieldName: string): DatabaseAggregateCommand

    // avg(val: any): DatabaseAggregateCommand
    // month(val: any): DatabaseAggregateCommand
    // sum(): DatabaseAggregateCommand
  }

  export enum LOGIC_COMMANDS_LITERAL {
    AND = 'and',
    OR = 'or',
    NOT = 'not',
    NOR = 'nor'
  }

  export class DatabaseLogicCommand {
    public fieldName: string | symbol
    public operator: LOGIC_COMMANDS_LITERAL | string
    public operands: any[]
    public readonly __safe_props__?: Set<string>

    _setFieldName(fieldName: string): DatabaseLogicCommand

    and(
      ...expressions: (DatabaseLogicCommand | IQueryCondition)[]
    ): DatabaseLogicCommand
    or(
      ...expressions: (DatabaseLogicCommand | IQueryCondition)[]
    ): DatabaseLogicCommand
  }

  export enum QUERY_COMMANDS_LITERAL {
    // normal
    EQ = 'eq',
    NEQ = 'neq',
    GT = 'gt',
    GTE = 'gte',
    LT = 'lt',
    LTE = 'lte',
    IN = 'in',
    NIN = 'nin',
    // geo
    GEO_NEAR = 'geoNear',
    GEO_WITHIN = 'geoWithin',
    GEO_INTERSECTS = 'geoIntersects'
  }

  export class DatabaseQueryCommand extends DatabaseLogicCommand {
    public operator: QUERY_COMMANDS_LITERAL | string
    public readonly __safe_props__?: Set<string>

    _setFieldName(fieldName: string): DatabaseQueryCommand

    eq(val: any): DatabaseLogicCommand
    neq(val: any): DatabaseLogicCommand
    gt(val: any): DatabaseLogicCommand
    gte(val: any): DatabaseLogicCommand
    lt(val: any): DatabaseLogicCommand
    lte(val: any): DatabaseLogicCommand
    in(val: any[]): DatabaseLogicCommand
    nin(val: any[]): DatabaseLogicCommand

    geoNear(options: IGeoNearCommandOptions): DatabaseLogicCommand
    geoWithin(options: IGeoWithinCommandOptions): DatabaseLogicCommand
    geoIntersects(options: IGeoIntersectsCommandOptions): DatabaseLogicCommand
  }

  export enum UPDATE_COMMANDS_LITERAL {
    SET = 'set',
    REMOVE = 'remove',
    INC = 'inc',
    MUL = 'mul',
    PUSH = 'push',
    POP = 'pop',
    SHIFT = 'shift',
    UNSHIFT = 'unshift'
  }

  export class DatabaseUpdateCommand {
    public fieldName: string | symbol
    public operator: UPDATE_COMMANDS_LITERAL
    public operands: any[]

    constructor(
      operator: UPDATE_COMMANDS_LITERAL,
      operands: any[],
      fieldName?: string | symbol
    )

    _setFieldName(fieldName: string): DatabaseUpdateCommand
  }

  export class Batch {}

  export interface IDatabaseConfig {
    env?: string
  }

  export interface IDatabaseConstructorOptions {
    config?: IDatabaseConfig
    context: IDatabaseServiceContext
  }

  export interface IAppConfig {
    docSizeLimit: number
    realtimePingInterval: number
    realtimePongWaitTimeout: number
    // accessToken: any
    getAccessToken: function
  }

  export interface IDatabaseServiceContext extends IServiceContext {
    appConfig: IAppConfig
    ws?: any
  }

  /**
   * A contract that all API provider must adhere to
   */
  export class APIBaseContract<
    PROMISE_RETURN,
    CALLBACK_RETURN,
    PARAM extends IAPIParam,
    CONTEXT = any
  > {
    getContext(param: PARAM): CONTEXT

    /**
     * In case of callback-style invocation, this function will be called
     */
    getCallbackReturn(param: PARAM, context: CONTEXT): CALLBACK_RETURN

    getFinalParam<T extends PARAM>(param: PARAM, context: CONTEXT): T

    run<T extends PARAM>(param: T): Promise<PROMISE_RETURN>
  }

  export interface IGeoPointConstructor {
    new (longitude: number, latitide: number): GeoPoint
    new (geojson: IGeoJSONPoint): GeoPoint
    (longitude: number, latitide: number): GeoPoint
    (geojson: IGeoJSONPoint): GeoPoint
  }

  export interface IGeoMultiPointConstructor {
    new (points: GeoPoint[] | IGeoJSONMultiPoint): GeoMultiPoint
    (points: GeoPoint[] | IGeoJSONMultiPoint): GeoMultiPoint
  }

  export interface IGeoLineStringConstructor {
    new (points: GeoPoint[] | IGeoJSONLineString): GeoLineString
    (points: GeoPoint[] | IGeoJSONLineString): GeoLineString
  }

  export interface IGeoMultiLineStringConstructor {
    new (
      lineStrings: GeoLineString[] | IGeoJSONMultiLineString
    ): GeoMultiLineString
    (lineStrings: GeoLineString[] | IGeoJSONMultiLineString): GeoMultiLineString
  }

  export interface IGeoPolygonConstructor {
    new (lineStrings: GeoLineString[] | IGeoJSONPolygon): GeoPolygon
    (lineStrings: GeoLineString[] | IGeoJSONPolygon): GeoPolygon
  }

  export interface IGeoMultiPolygonConstructor {
    new (polygons: GeoPolygon[] | IGeoJSONMultiPolygon): GeoMultiPolygon
    (polygons: GeoPolygon[] | IGeoJSONMultiPolygon): GeoMultiPolygon
  }

  export interface IGeo {
    Point: IGeoPointConstructor
    MultiPoint: IGeoMultiPointConstructor
    LineString: IGeoLineStringConstructor
    MultiLineString: IGeoMultiLineStringConstructor
    Polygon: IGeoPolygonConstructor
    MultiPolygon: IGeoMultiPolygonConstructor
  }

  export interface IGeoJSONPoint {
    type: 'Point'
    coordinates: [number, number]
  }

  export interface IGeoJSONMultiPoint {
    type: 'MultiPoint'
    coordinates: [number, number][]
  }

  export interface IGeoJSONLineString {
    type: 'LineString'
    coordinates: [number, number][]
  }

  export interface IGeoJSONMultiLineString {
    type: 'MultiLineString'
    coordinates: [number, number][][]
  }

  export interface IGeoJSONPolygon {
    type: 'Polygon'
    coordinates: [number, number][][]
  }

  export interface IGeoJSONMultiPolygon {
    type: 'MultiPolygon'
    coordinates: [number, number][][][]
  }

  export type IGeoJSONObject =
    | IGeoJSONPoint
    | IGeoJSONMultiPoint
    | IGeoJSONLineString
    | IGeoJSONMultiLineString
    | IGeoJSONPolygon
    | IGeoJSONMultiPolygon

  export abstract class GeoPoint {
    public longitude: number
    public latitude: number

    constructor(longitude: number, latitude: number)

    toJSON(): IGeoJSONPoint
    toString(): string
  }

  export abstract class GeoMultiPoint {
    public points: GeoPoint[]

    constructor(points: GeoPoint[])

    toJSON(): IGeoJSONMultiPoint
    toString(): string
  }

  export abstract class GeoLineString {
    public points: GeoPoint[]

    constructor(points: GeoPoint[])

    toJSON(): IGeoJSONLineString
    toString(): string
  }

  export abstract class GeoMultiLineString {
    public lines: GeoLineString[]

    constructor(lines: GeoLineString[])

    toJSON(): IGeoJSONMultiLineString
    toString(): string
  }

  export abstract class GeoPolygon {
    public lines: GeoLineString[]

    constructor(lines: GeoLineString[])

    toJSON(): IGeoJSONPolygon
    toString(): string
  }

  export abstract class GeoMultiPolygon {
    public polygons: GeoPolygon[]

    constructor(polygons: GeoPolygon[])

    toJSON(): IGeoJSONMultiPolygon
    toString(): string
  }

  export type GeoInstance =
    | GeoPoint
    | GeoMultiPoint
    | GeoLineString
    | GeoMultiLineString
    | GeoPolygon
    | GeoMultiPolygon

  export interface IGeoNearCommandOptions {
    geometry: GeoPoint
    maxDistance?: number
    minDistance?: number
  }

  export interface IGeoWithinCommandOptions {
    geometry: GeoPolygon | GeoMultiPolygon
  }

  export interface IGeoIntersectsCommandOptions {
    geometry:
      | GeoPoint
      | GeoMultiPoint
      | GeoLineString
      | GeoMultiLineString
      | GeoPolygon
      | GeoMultiPolygon
  }

  export interface IServerDateOptions {
    offset: number
  }

  export abstract class ServerDate {
    public readonly options: IServerDateOptions
    constructor(options?: IServerDateOptions)
  }

  export interface IRegExpOptions {
    regexp: string
    options?: string
  }

  export interface IRegExpConstructor {
    new (options: IRegExpOptions): RegExp
    (options: IRegExpOptions): RegExp
  }

  export abstract class RegExp {
    public readonly regexp: string
    public readonly options: string
    constructor(options: IRegExpOptions)
  }

  export type DocumentId = string | number

  export interface IDocumentData {
    _id?: DocumentId
    [key: string]: any
  }

  export interface IDBAPIParam extends IAPIParam {}

  export interface IAddDocumentOptions extends IDBAPIParam {
    data: IDocumentData
  }

  export interface IGetDocumentOptions extends IDBAPIParam {
    stringifyTest?: boolean
  }

  export interface ICountDocumentOptions extends IDBAPIParam {
    stringifyTest?: boolean
  }

  export interface IUpdateDocumentOptions extends IDBAPIParam {
    data: IUpdateCondition
    stringifyTest?: boolean
  }

  export interface IUpdateSingleDocumentOptions extends IDBAPIParam {
    data: IUpdateCondition
    stringifyTest?: boolean
  }

  export interface ISetDocumentOptions extends IDBAPIParam {
    data: IUpdateCondition
    stringifyTest?: boolean
  }

  export interface ISetSingleDocumentOptions extends IDBAPIParam {
    data: IUpdateCondition
    stringifyTest?: boolean
  }

  export interface IRemoveDocumentOptions extends IDBAPIParam {
    query: IQueryCondition
    stringifyTest?: boolean
  }

  export interface IRemoveSingleDocumentOptions extends IDBAPIParam {
    stringifyTest?: boolean
  }

  export interface IWatchOptions {
    // server realtime data init & change event
    onChange: (snapshot: ISnapshot) => void
    // error while connecting / listening
    onError: (error: any) => void
  }

  export interface ISnapshot {
    id: number
    docChanges: ISingleDBEvent[]
    docs: Record<string, any>
    type?: SnapshotType
  }

  export type SnapshotType = 'init'

  export interface ISingleDBEvent {
    id: number
    dataType: DataType
    queueType: QueueType
    docId: string
    doc: Record<string, any>
    updatedFields?: any
    removedFields?: any
  }

  export type DataType = 'init' | 'update' | 'add' | 'remove' | 'replace'

  export type QueueType = 'init' | 'enqueue' | 'dequeue' | 'update'

  export type IQueryCondition = Record<string, any> | DatabaseLogicCommand

  export interface ConditionRecord {
    [key: string]: IQueryCondition
  }

  // export interface IQueryCondition {
  //   [key: string]: any,
  // }

  export type IStringQueryCondition = string

  export interface IQueryResult extends IAPISuccessParam {
    data: IDocumentData[]
  }

  export interface IQuerySingleResult extends IAPISuccessParam {
    data: IDocumentData
  }

  export interface IUpdateCondition {
    [key: string]: any
  }

  export type IStringUpdateCondition = string

  export interface ISetCondition {}

  export interface IAddResult extends IAPISuccessParam {
    _id: DocumentId
  }

  export interface IUpdateResult extends IAPISuccessParam {
    stats: {
      updated: number
      // created: number,
    }
  }

  export interface ISetResult extends IAPISuccessParam {
    _id: DocumentId
    stats: {
      updated: number
      created: number
    }
  }

  export interface IRemoveResult extends IAPISuccessParam {
    stats: {
      removed: number
    }
  }

  export interface ICountResult extends IAPISuccessParam {
    total: number
  }

  export interface IAggregateResult extends IAPISuccessParam {
    list: any[]
  }

  interface IEngine {
    QuerySerializer: typeof IQuerySerializer
    UpdateSerializer: typeof IUpdateSerializer
    AggregateSerializer: typeof IAggregateSerializer
    Decoder: typeof IDecoder
    encodeInternalDataType(val: any): DB.IQueryCondition
  }

  abstract class IQuerySerializer {
    static encode(
      query: IQueryCondition | DatabaseQueryCommand | DatabaseLogicCommand
    ): IQueryCondition
  }

  abstract class IUpdateSerializer {
    static encode(
      query: IQueryCondition | DatabaseUpdateCommand
    ): IUpdateCondition
  }

  abstract class IAggregateSerializer {
    static encode(query: IQueryCondition | DatabaseAggregateCommand): any[]
  }

  abstract class IDecoder {
    static decode(data: object | object[]): object
  }
}

/**
 * Utils
 */
