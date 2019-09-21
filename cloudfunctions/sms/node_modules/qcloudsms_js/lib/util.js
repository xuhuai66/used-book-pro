/*!
 * qcloudsms_js
 *
 * @module util
 *
 */

"use strict";

/**
 * Module dependencies.
 * @ignore
 */

var crypto = require("crypto");
var https = require("https");


/**
 * Module exports
 * @ignore
 */

exports.getRandom = getRandom;
exports.calculateSignature = calculateSignature;
exports.request = request;
exports.getCurrentTime = getCurrentTime;
exports.assert = assert;
exports.sha1sum = sha1sum;
exports.calculateAuth = calculateAuth;


/**
 * Get a random number
 *
 * @return {number}
 * @public
 */
function getRandom() {
    return Math.round(Math.random() * 99999);
}

/**
 * Get current time
 *
 * @return {number}
 * @public
 */
function getCurrentTime() {
    return Math.floor(Date.now()/1000);
}

/**
 * Calculate a request signature according to parameters
 *
 * @param  {string}  appkey - sdk appkey
 * @param  {string}  random - random string
 * @param  {number}  time - unix timestamp time
 * @param  {array}   phoneNumbers - phone number array
 * @return {string}
 * @public
 */
function calculateSignature(appkey, random, time, phoneNumbers) {
    if (phoneNumbers) {
        return crypto.createHash("sha256").update(
            "appkey=" + appkey + "&random=" + random + "&time=" + time
                + "&mobile=" + phoneNumbers.join(","),
            "utf-8"
        ).digest("hex");
    } else {
        return crypto.createHash("sha256").update(
            "appkey=" + appkey + "&random=" + random + "&time=" + time,
            "utf-8"
        ).digest("hex");
    }
}

/**
 * Calculate a voice uploading request signature
 *
 * @param  {string}  appkey - sdk appkey
 * @param  {string}  random - random string
 * @param  {number}  time - unix timestamp time
 * @param  {string}  fileSha1sum - voice file sha1sum
 * @return {string}
 * @public
 */
function calculateAuth(appkey, random, time, fileSha1Sum) {
    return crypto.createHash("sha256").update(
        "appkey=" + appkey + "&random=" + random + "&time="
            + time  + "&content-sha1=" + fileSha1Sum,
        "utf-8"
    ).digest("hex");
}

/**
 * Calculate sha1sum
 *
 * @param  {Buffer}  buf - raw buf
 * @return {string}
 * @public
 */
function sha1sum(buf) {
    return crypto.createHash("sha1").update(buf).digest("hex");
}


/**
 * Make a request and call given callback
 *
 * @param  {object}    options - request options
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
function request(options, callback) {
    var body;
    if (options.body) {
        body = options.body;
        delete options.body;
    }

    var req = https.request(options, function(res) {
        res.setEncoding("utf-8");
        var resData = "";

        res.on("data", function(data) {
            resData += data;
        });

        res.on("error", function(err) {
            callback(err, res, undefined);
        });

        res.on("end", function() {
            res.req = options;
            res.req.body = body;
            callback(undefined, res, JSON.parse(resData));
        });
    });

    req.on("error", function(err) {
        callback(err, undefined, undefined);
    });

    if (body) {
        if (Buffer.isBuffer(body)) {
            req.write(body);
        } else {
            req.write(JSON.stringify(body));
        }
    }
    req.end();
}

/**
 * assert expression
 *
 * @param  {bool}    condition - assert condtion
 * @param  {string}  message - assert failed message
 * @public
 */
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        // Fallback
        throw message;
    }
}
