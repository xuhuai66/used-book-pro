import { VirtualWebSocketClient } from './virtual-websocket-client';
import { DB } from '../typings/index';
interface IRealtimeListenerConstructorOptions extends DB.IRealtimeListenerConstructorOptions {
    close: () => void;
    debug?: boolean;
    virtualClient?: VirtualWebSocketClient;
}
export declare class RealtimeListener implements DB.RealtimeListener {
    close: () => void;
    onChange: (res: any) => void;
    onError: (error: any) => void;
    constructor(options: IRealtimeListenerConstructorOptions);
}
export {};
