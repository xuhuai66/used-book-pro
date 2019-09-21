export const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));
const counters = {};
export const autoCount = (domain = 'any') => {
    if (!counters[domain]) {
        counters[domain] = 0;
    }
    return counters[domain]++;
};
let networkStatus;
const networkOnlineSubscribers = [];
export const onceNetworkOnline = () => new Promise(resolve => {
    if (networkStatus && networkStatus.isConnected) {
        resolve();
    }
    else {
        networkOnlineSubscribers.push(resolve);
    }
});
