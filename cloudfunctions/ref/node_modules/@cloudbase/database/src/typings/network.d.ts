import { IAPIError, ICloudConfig, ICloudMetaData, ICloudClass } from '.'

// Section #1: internal interfaces

export interface ITunnelRequest {
  cloud?: ICloudClass
  apiName?: string,
  data: ITunnelData,
  success?: (res: ITunnelResponse) => void,
  fail?: (err: IAPIError) => void,
  complete?: (val: ITunnelResponse | IAPIError) => void,
}

export interface ITunnelResponse {
  errCode?: number,
  errMsg: string,
  data: any,
  rawData: string,
  respData: {
    // JSON data
    data: string,
  }
}

export interface ITunnelRawResponse {
  errCode?: number,
  errMsg: string,
  rawData: string,
  respData: {
    // JSON data
    data: string,
  }
}

export interface IBaseResponse {
  errcode: number,
  errmsg: string,
}

export interface ITunnelJSONRawData {
  baseresponse: IBaseResponse,
  status?: number,
  errmsg?: string,
}

export interface ITunnelDataMeta extends ICloudMetaData {

}

export interface ITunnelData {
  qbase_api_name: string,
  qbase_req: string | null | undefined,
  qbase_options: {
    env?: string
    trace_user?: boolean
  },
  qbase_meta: ITunnelDataMeta,
  cli_req_id: string,
}

export interface ITunnelOptions {
  cloud?: ICloudClass
  requireDataNotEmpty?: boolean
  fireOnIdle?: boolean
  onFire?: () => void
}

export interface IGetBoundTunnelRequestOptions {
  cloud: ICloudClass
}

export type IBoundTunnelRequestOptions = ITunnelOptions & {
  apiName: string
  serviceName: string
  serializedReqData: string | undefined | null
  env?: string
  // config?: ICloudConfig
}

export interface IBoundTunnelRequest {
  (options: IBoundTunnelRequestOptions): Promise<ITunnelResponse>
}
