import { VirtualWebSocketClient } from './virtual-websocket-client'
import { DB } from '../typings/index'

// =============== Realtime Listener (Public) ====================

interface IRealtimeListenerConstructorOptions
  extends DB.IRealtimeListenerConstructorOptions {
  // init
  close: () => void
  // debug
  debug?: boolean
  virtualClient?: VirtualWebSocketClient
}

export class RealtimeListener implements DB.RealtimeListener {
  close: () => void
  onChange: (res: any) => void
  onError: (error: any) => void

  constructor(options: IRealtimeListenerConstructorOptions) {
    this.close = options.close
    this.onChange = options.onChange
    this.onError = options.onError

    if (options.debug) {
      Object.defineProperty(this, 'virtualClient', {
        get: () => {
          return options.virtualClient
        }
      })
    }
  }
}
