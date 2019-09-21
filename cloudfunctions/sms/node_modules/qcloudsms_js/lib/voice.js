/*!
 * qcloudsms_js
 *
 * @module voice
 *
 */

"use strict";

/**
 * Module dependencies.
 * @ignore
 */
var url = require("url");
var util = require("./util");


/**
 * Module exports
 * @ignore
 */
exports.SmsVoicePromptSender = PromptVoiceSender;
exports.PromptVoiceSender = PromptVoiceSender;

exports.SmsVoiceVerifyCodeSender = CodeVoiceSender;
exports.CodeVoiceSender = CodeVoiceSender;

exports.TtsVoiceSender = TtsVoiceSender;
exports.VoiceFileUploader = VoiceFileUploader;
exports.FileVoiceSender = FileVoiceSender;


/**
 * PromptVoiceSender
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function PromptVoiceSender(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://cloud.tim.qq.com/v5/tlsvoicesvr/sendvoiceprompt";
}

/**
 * Send a prompt voice
 *
 * @param  {string}    nactionCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phoneNumber - phone number
 * @param  {string}    prompttype - voice prompt type, currently value is 2
 * @param  {string}    msg - prompt voice message
 * @param  {number}    playtimes - playtimes, optional, max is 3, default is 2
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
PromptVoiceSender.prototype.send = function(nationCode, phoneNumber, prompttype, msg, playtimes, ext, callback) {
    // assert
    util.assert(typeof playtimes == "number" && playtimes > 0 && playtimes < 3,
                "playtimes must be an integer and great than zero");

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                nationcode: nationCode,
                mobile: phoneNumber
            },
            prompttype: prompttype,
            promptfile: msg,
            playtimes: parseInt(playtimes),
            sig: util.calculateSignature(this.appkey, random, now, [phoneNumber]),
            time: now,
            ext: !ext ? "" : ext + ""
        }
    };

    util.request(options, callback);
};


/**
 * CodeVoiceSender
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function CodeVoiceSender(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://cloud.tim.qq.com/v5/tlsvoicesvr/sendcvoice";
}

/**
 * Send a code voice
 *
 * @param  {string}    nationCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phonenumber -  phone number
 * @param  {string}    msg - voice verify code message
 * @param  {number}    playtimes - playtimes, optional, max is 3, default is 2
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
CodeVoiceSender.prototype.send = function(nationCode, phoneNumber, msg, playtimes, ext, callback) {
    // assert
    util.assert(typeof playtimes == "number" && playtimes > 0,
                "playtimes must be an integer and great than zero");

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                nationcode: nationCode,
                mobile: phoneNumber
            },
            msg: msg,
            playtimes: playtimes,
            sig: util.calculateSignature(this.appkey, random, now, [phoneNumber]),
            time: now,
            ext: !ext ? "" : ext + ""
        }
    };

    util.request(options, callback);
};

/**
 * TtsVoiceSender
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function TtsVoiceSender(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://cloud.tim.qq.com/v5/tlsvoicesvr/sendtvoice";
}

/**
 * Send a tts voice
 *
 * @param  {string}    nationCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phonenumber -  phone number
 * @param  {number}    templId - template id
 * @param  {array}     params - template parameters
 * @param  {number}    playtimes - playtimes, optional, max is 3, default is 2
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
TtsVoiceSender.prototype.send = function(nationCode, phoneNumber, templId, params, playtimes, ext, callback) {
    // assert
    util.assert(typeof playtimes == "number" && playtimes > 0,
                "playtimes must be an integer and great than zero");

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                nationcode: nationCode,
                mobile: phoneNumber
            },
            tpl_id: parseInt(templId),
            params: params,
            playtimes: playtimes,
            sig: util.calculateSignature(this.appkey, random, now, [phoneNumber]),
            time: now,
            ext: !ext ? "" : ext + ""
        }
    };

    util.request(options, callback);
};

/**
 * FileVoiceSender
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function FileVoiceSender(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://cloud.tim.qq.com/v5/tlsvoicesvr/sendfvoice";
}

/**
 * Send a file voice
 *
 * @param  {string}    nationCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phoneNumber -  phone number
 * @param  {string}    fid - voice file fid
 * @param  {number}    playtimes - playtimes, optional, max is 3, default is 2
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
FileVoiceSender.prototype.send = function(nationCode, phoneNumber, fid, playtimes, ext, callback) {
    // assert
    util.assert(typeof playtimes == "number" && playtimes > 0,
                "playtimes must be an integer and great than zero");

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                nationcode: nationCode,
                mobile: phoneNumber
            },
            fid: fid,
            playtimes: playtimes,
            sig: util.calculateSignature(this.appkey, random, now, [phoneNumber]),
            time: now,
            ext: !ext ? "" : ext + ""
        }
    };

    util.request(options, callback);
};

/**
 * VoiceFileUploader
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function VoiceFileUploader(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://cloud.tim.qq.com/v5/tlsvoicesvr/uploadvoicefile";
}

/**
 * Upload voice file
 *
 * @param  {Buffer}    fileContent -  voice file content
 * @param  {string}    contentType -  voice file content type, Enum{"mp3", "wav"}
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
VoiceFileUploader.prototype.upload = function(fileContent, contentType, callback) {
    // assert
    util.assert(Buffer.isBuffer(fileContent),
                "fileContent is not instance of Buffer");
    util.assert(contentType == "mp3" || contentType == "wav",
                "contentType is invalid and should be 'mp3' or 'wav'");

    var type;
    if (contentType == "wav") {
        type = "audio/wav";
    } else {
        type = "audio/mpeg";
    }

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var fileSha1Sum = util.sha1sum(fileContent);
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random + "&time=" + now,
        method: "POST",
        headers: {
            "Content-Type": type,
            "x-content-sha1": fileSha1Sum,
            "Authorization": util.calculateAuth(
                this.appkey, random, now, fileSha1Sum
            )
        },
        body: fileContent
    };

    util.request(options, callback);
};
