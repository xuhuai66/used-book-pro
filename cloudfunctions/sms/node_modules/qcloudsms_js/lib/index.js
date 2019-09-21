/*!
 * qcloudsms_js
 */

"use strict";

/**
 * Module dependencies.
 * @ignore
 */

var sms = require("./sms");
var voice = require("./voice");


/**
 * Expose `createQcloudSms`.
 */

exports = module.exports = createQcloudSms;


/**
 * Create a QcloudSms instance
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @return {object}
 */
function createQcloudSms(appid, appkey) {
    if (!appid || !appkey) {
        throw new Error("Require appid and appkey!");
    }
    var qcloudsms = {appid: appid, appkey: appkey};

    var ssender, msender;
    qcloudsms.SmsSingleSender = function() {
        if (!ssender) {
            ssender = new sms.SmsSingleSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return ssender;
    };
    qcloudsms.SmsMultiSender = function() {
        if (!msender) {
            msender = new sms.SmsMultiSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return msender;
    };

    var spuller, mspuller;
    qcloudsms.SmsStatusPuller = function() {
        if (!spuller) {
            spuller = new sms.SmsStatusPuller(qcloudsms.appid, qcloudsms.appkey);
        }
        return spuller;
    };
    qcloudsms.SmsMobileStatusPuller = function() {
        if (!mspuller) {
            mspuller = new sms.SmsMobileStatusPuller(qcloudsms.appid, qcloudsms.appkey);
        }
        return mspuller;
    };

    var pvsender, cvsender;
    qcloudsms.SmsVoicePromptSender = function() {
        if (!pvsender) {
            pvsender = new voice.SmsVoicePromptSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return pvsender;
    };
    qcloudsms.PromptVoiceSender = function() {
        if (!pvsender) {
            pvsender = new voice.PromptVoiceSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return pvsender;
    };
    qcloudsms.SmsVoiceVerifyCodeSender = function() {
        if (!cvsender) {
            cvsender = new voice.SmsVoiceVerifyCodeSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return cvsender;
    };
    qcloudsms.CodeVoiceSender = function() {
        if (!cvsender) {
            cvsender = new voice.CodeVoiceSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return cvsender;
    };

    var tvsender;
    qcloudsms.TtsVoiceSender = function() {
        if (!tvsender) {
            tvsender = new voice.TtsVoiceSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return tvsender;
    };

    var uploader, fvsender;
    qcloudsms.VoiceFileUploader = function() {
        if (!uploader) {
            uploader = new voice.VoiceFileUploader(qcloudsms.appid, qcloudsms.appkey);
        }
        return uploader;
    };
    qcloudsms.FileVoiceSender = function() {
        if (!fvsender) {
           fvsender = new voice.FileVoiceSender(qcloudsms.appid, qcloudsms.appkey);
        }
        return fvsender;
    };

    return qcloudsms;
}
