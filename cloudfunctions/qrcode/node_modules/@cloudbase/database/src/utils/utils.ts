// import WX from '@/externals/public-lib/wx'
// import { getSDK } from "../externals/public-lib/appserviceSdk"
import { WXNS } from '../typings/index'
// declare const wx: WX

export const sleep = (ms: number = 0) => new Promise(r => setTimeout(r, ms))

// export const nextLoop = () => new Promise(r => setImmediate(r))

const counters: Record<string, number> = {}

export const autoCount = (domain: string = 'any'): number => {
  if (!counters[domain]) {
    counters[domain] = 0
  }
  return counters[domain]++
}

interface INetworkStatus {
  isConnected: boolean
  networkType: WXNS.NetworkType
}

let networkStatus: INetworkStatus
// let networkMonitored = false
const networkOnlineSubscribers: (() => void)[] = []

// export const getNetworkStatus = (): Promise<INetworkStatus> =>
//   new Promise<INetworkStatus>(resolve => {
//     if (networkStatus) {
//       resolve(networkStatus)
//       return
//     }

//     // getSDK().wx.getNetworkType({
//     //   success: res => {
//     //     networkStatus = {
//     //       networkType: res.networkType,
//     //       isConnected: res.networkType !== "none"
//     //     }

//     //     resolve(networkStatus)

//     //     if (!networkMonitored) {
//     //       monitorNetwork()
//     //     }
//     //   },
//     //   fail: reject
//     // })
//   })

// export const throwErrorIfNetworkOffline = () =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const { isConnected } = await getNetworkStatus()
//       // isConnected ? resolve() : reject(`network offline`)
//       // } catch (e) {
//       //   // resolve anyway
//       //   resolve()
//       // }
//       if (isConnected) {
//         resolve()

//         // if (process.env.DEBUG) {
//         console.log(`[cloud] resolve throwErrorIfNetworkOffline`)
//         // }
//       } else {
//         reject(`network offline`)
//       }
//     } catch (e) {
//       // resolve anyway
//       resolve()
//     }
//   })

export const onceNetworkOnline = () =>
  new Promise<void>(resolve => {
    if (networkStatus && networkStatus.isConnected) {
      resolve()
    } else {
      networkOnlineSubscribers.push(resolve)
    }
  })

// function monitorNetwork() {
//   getSDK().wx.onNetworkStatusChange(res => {
//     networkStatus.networkType = res.networkType
//     networkStatus.isConnected = res.isConnected

//     if (res.isConnected && networkOnlineSubscribers.length) {
//       while (networkOnlineSubscribers.length) {
//         try {
//           networkOnlineSubscribers.shift()!()
//         } catch (e) {}
//       }
//     }
//   })
//   networkMonitored = true
// }
