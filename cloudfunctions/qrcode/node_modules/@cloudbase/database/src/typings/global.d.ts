import { WX, WXNS, AnyFunction } from '.'
declare const wx: WX

export interface __AppServiceSDK__ {
  _operateWXData: WXNS.operateWXData
  _uploadFileSkipCheckDomain: WXNS.uploadFile
  _downloadFileSkipCheckDomain: WXNS.downloadFile
  _requestSkipCheckDomain: WXNS.request
  _socketSkipCheckDomainFactory: WXNS.socketFactory
  wx: WX
}

export interface __Reporter__ {
  surroundThirdByTryCatch: (fn: AnyFunction, extend?: string) => AnyFunction
  reportIDKey: (options: { id: string; key: string; force?: boolean }) => void
  reportKeyValue: (options: {
    key: string
    value: string
    force?: boolean
    immediately?: boolean
  }) => void
}

export interface __WXConfig {
  platform: 'devtools' | 'ios' | 'android'
  vendor?: 'mina'
  onReady: (callback: () => void) => void
}

export interface __Global {
  networkLog: (options: INetworkLogSendOptions) => void
}

export interface INetworkLogOptionsBase {
  reqId: string
  type: string
  console: boolean
  timestampMs?: number
  callFramesIgnoreLength?: number
}

export interface INetworkLogOptionsRequestWillBeSent
  extends INetworkLogOptionsBase {
  type: 'requestWillBeSent'
  url: string
  headers: Record<string, any>
  body: string
}

export interface INetworkLogOptionsLoadingFinished
  extends INetworkLogOptionsBase {
  type: 'loadingFinished'
  body: string
  bodyBase64Encoded?: boolean
}

export interface INetworkLogOptionsLoadingFailed
  extends INetworkLogOptionsBase {
  type: 'loadingFailed'
  errorCode: number
  errorMsg: string
}

export interface INetworkLogOptionsInit extends INetworkLogOptionsBase {
  type: 'init'
  config: Record<string, any> | string
}

export type INetworkLogOptions =
  | INetworkLogOptionsRequestWillBeSent
  | INetworkLogOptionsLoadingFinished
  | INetworkLogOptionsLoadingFailed
  | INetworkLogOptionsInit

export interface IAutoNetworkLogOptions {
  url: string
  headers?: Record<string, any>
  console?: boolean
  reqBody: string
  resultGetter?: (res: any) => any
}

export type INetworkLogSendOptions = INetworkLogOptions & {
  domain: 'cloud'
  method: 'POST'
}
