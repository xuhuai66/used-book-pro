import { VirtualWebSocketClient } from './virtual-websocket-client';
import { DB } from '../typings/index';
import { IRequestMessage } from '../typings/realtime';
import { CLOSE_EVENT_CODE } from './ws-event';
export interface IRealtimeWebSocketClientConstructorOptions {
    maxReconnect?: number;
    reconnectInterval?: number;
    context: DB.IDatabaseServiceContext;
}
export interface ISignature {
    envId: string;
    secretVersion: number;
    signStr: string;
    wsUrl: string;
    expireTS: number;
}
export interface ILoginInfo {
    loggedIn: boolean;
    loggingInPromise?: Promise<ILoginResult>;
    loginStartTS?: number;
    loginResult?: ILoginResult;
}
export interface ILoginResult {
    envId: string;
}
export interface IWSSendOptions {
    msg: IRequestMessage;
    waitResponse?: boolean;
    skipOnMessage?: boolean;
    timeout?: number;
}
export interface IWSWatchOptions extends DB.IWatchOptions {
    envId?: string;
    collectionName: string;
    query: string;
}
export declare class RealtimeWebSocketClient {
    private _virtualWSClient;
    private _queryIdClientMap;
    private _watchIdClientMap;
    private _maxReconnect;
    private _reconnectInterval;
    private _context;
    private _ws?;
    private _lastPingSendTS?;
    private _pingFailed;
    private _pongMissed;
    private _pingTimeoutId?;
    private _pongTimeoutId?;
    private _logins;
    private _wsInitPromise?;
    private _wsReadySubsribers;
    private _wsResponseWait;
    private _rttObserved;
    private _reconnectState;
    constructor(options: IRealtimeWebSocketClientConstructorOptions);
    private initWebSocketConnection;
    private initWebSocketEvent;
    private isWSConnected;
    private onceWSConnected;
    private webLogin;
    private getAccessToken;
    private getWaitExpectedTimeoutLength;
    private heartbeat;
    clearHeartbeat(): void;
    private ping;
    send: <T = any>(opts: IWSSendOptions) => Promise<T>;
    close(code: CLOSE_EVENT_CODE): void;
    closeAllClients: (error: any) => void;
    pauseClients: (clients?: Set<VirtualWebSocketClient>) => void;
    resumeClients: (clients?: Set<VirtualWebSocketClient>) => void;
    private onWatchStart;
    private onWatchClose;
    watch(options: IWSWatchOptions): DB.RealtimeListener;
}
