"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));
const counters = {};
exports.autoCount = (domain = 'any') => {
    if (!counters[domain]) {
        counters[domain] = 0;
    }
    return counters[domain]++;
};
let networkStatus;
const networkOnlineSubscribers = [];
exports.onceNetworkOnline = () => new Promise(resolve => {
    if (networkStatus && networkStatus.isConnected) {
        resolve();
    }
    else {
        networkOnlineSubscribers.push(resolve);
    }
});
