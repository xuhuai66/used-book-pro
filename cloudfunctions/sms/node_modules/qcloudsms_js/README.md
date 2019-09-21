腾讯云短信 Node.js SDK
===

## 腾讯短信服务

目前`腾讯云短信`为客户提供`国内短信`、`国内语音`和`海外短信`三大服务，腾讯云短信SDK支持以下操作：

### 国内短信

国内短信支持操作：

- 单发短信
- 指定模板单发短信
- 群发短信
- 指定模板群发短信
- 拉取短信回执和短信回复状态

> `Note` 短信拉取功能需要联系腾讯云短信技术支持(QQ:3012203387)开通权限，量大客户可以使用此功能批量拉取，其他客户不建议使用。

### 海外短信

海外短信支持操作：

- 单发短信
- 指定模板单发短信
- 群发短信
- 指定模板群发短信
- 拉取短信回执和短信回复状态

> `Note` 海外短信和国内短信使用同一接口，只需替换相应的国家码与手机号码，每次请求群发接口手机号码需全部为国内或者海外手机号码。

### 语音通知

语音通知支持操作：

- 发送语音验证码
- 发送语音通知
- 上传语音文件
- 按语音文件fid发送语音通知
- 指定模板发送语音通知类

## 开发

### 准备

在开始开发云短信应用之前，需要准备如下信息:

- [x] 获取SDK AppID和AppKey

云短信应用SDK `AppID`和`AppKey`可在[短信控制台](https://console.cloud.tencent.com/sms)的应用信息里获取，如您尚未添加应用，请到[短信控制台](https://console.cloud.tencent.com/sms)中添加应用。

- [x] 申请签名

一个完整的短信由短信`签名`和短信正文内容两部分组成，短信`签名`须申请和审核，`签名`可在[短信控制台](https://console.cloud.tencent.com/sms)的相应服务模块`内容配置`中进行申请。

- [x] 申请模板

同样短信或语音正文内容`模板`须申请和审核，`模板`可在[短信控制台](https://console.cloud.tencent.com/sms)的相应服务模块`内容配置`中进行申请。

## 安装

### npm

qcloudsms_js采用npm进行安装，要使用qcloudsms功能，只需要执行:

```shell
npm install qcloudsms_js
```

### 手动

1. 手动下载或clone最新版本qcloudsms_js代码
2. 把qcloudsms_js把代码放入项目目录
3. 然后在项目里require qcloudsms_js, 如: `var moduleName = require("path/to/qcloudsms_js")`

## 用法

### 文档

若您对接口存在疑问，可以查阅:

* [API开发指南](https://cloud.tencent.com/document/product/382/5808)
* [SDK文档](https://qcloudsms.github.io/qcloudsms_js/)
* [错误码](https://cloud.tencent.com/document/product/382/3771)

### 示例

- **准备必要参数和实例化QcloudSms**

```javascript
var QcloudSms = require("qcloudsms_js");

// 短信应用SDK AppID
var appid = 1400009099;  // SDK AppID是1400开头

// 短信应用SDK AppKey
var appkey = "9ff91d87c2cd7cd0ea762f141975d1df37481d48700d70ac37470aefc60f9bad";

// 需要发送短信的手机号码
var phoneNumbers = ["21212313123", "12345678902", "12345678903"];

// 短信模板ID，需要在短信应用中申请
var templateId = 7839;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

// 签名
var smsSign = "腾讯云";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

// 实例化QcloudSms
var qcloudsms = QcloudSms(appid, appkey);

// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, res, resData) {
    if (err) {
        console.log("err: ", err);
    } else {
        console.log("request data: ", res.req);
        console.log("response data: ", resData);
    }
}
```

- **单发短信**

```javascript
var smsType = 0; // Enum{0: 普通短信, 1: 营销短信}
var ssender = qcloudsms.SmsSingleSender();
ssender.send(smsType, 86, phoneNumbers[0],
  "【腾讯云】您的验证码是: 5678", "", "", callback);
```

> `Note` 如需发送海外短信，同样可以使用此接口，只需将国家码"86"改写成对应国家码号。
> `Note` 无论单发/群发短信还是指定模板ID单发/群发短信都需要从控制台中申请模板并且模板已经审核通过，才可能下发成功，否则返回失败。

- **指定模板ID单发短信**

```javascript
var ssender = qcloudsms.SmsSingleSender();
var params = ["5678"];
ssender.sendWithParam(86, phoneNumbers[0], templateId,
  params, SmsSign, "", "", callback);  // 签名参数未提供或者为空时，会使用默认签名发送短信
```

> `Note` 无论单发/群发短信还是指定模板ID单发/群发短信都需要从控制台中申请模板并且模板已经审核通过，才可能下发成功，否则返回失败。

- **群发**

```javascript
var smsType = 0;  // Enum{0: 普通短信, 1: 营销短信}
var msender = qcloudsms.SmsMultiSender();
msender.send(smsType, "86", phoneNumbers,
  "【腾讯云】您的验证码是: 5678", "", "", callback);
```

> `Note` 无论单发/群发短信还是指定模板ID单发/群发短信都需要从控制台中申请模板并且模板已经审核通过，才可能下发成功，否则返回失败。

- **指定模板ID群发**

```javascript
var msender = qcloudsms.SmsMultiSender();
var params = ["5678"];
msender.sendWithParam("86", phoneNumbers, templateId,
  params, smsSign, "", "", callback);  // 签名参数未提供或者为空时，会使用默认签名发送短信
```

> `Note` 群发一次请求最多支持200个号码，如有对号码数量有特殊需求请联系腾讯云短信技术支持(QQ:3012203387)。

- **发送语音验证码**

```javascript
var cvsender = qcloudsms.CodeVoiceSender();
cvsender.send("86", phoneNumbers[0], "1234", 2, "", callback);
```

> `Note` 语音验证码发送只需提供验证码数字，例如当msg=“5678”时，您收到的语音通知为“您的语音验证码是5678”，如需自定义内容，可以使用语音通知。

- **发送语音通知**

```javascript
var pvsender = qcloudsms.PromptVoiceSender();
pvsender.send("86", phoneNumbers[0], 2, "5678", 2, "", callback);
```

- **拉取短信回执以及回复**

```javascript
var maxNum = 10;  // 单次拉取最大量
var spuller = qcloudsms.SmsStatusPuller();
// 拉取短信回执
spuller.pullCallback(maxNum, callback);
// 拉取回复
spuller.pullReply(maxNum, callback);
```

> `Note` 短信拉取功能需要联系腾讯云短信技术支持(QQ:3012203387)，量大客户可以使用此功能批量拉取，其他客户不建议使用。

- **拉取单个手机短信状态**

```javascript
var beginTime = 1511125600;  // 开始时间(unix timestamp)
var endTime = 1511841600;    // 结束时间(unix timestamp)
var maxNum = 10;             // 单次拉取最大量
var mspuller = qcloudsms.SmsMobileStatusPuller();
// 拉取短信回执
mspuller.pullCallback("86", phoneNumbers[0], beginTime, endTime, maxNum, callback);
// 拉取回复
mspuller.pullReply("86", phoneNumbers[0], beginTime, endTime, maxNum, callback);
```

> `Note` 短信拉取功能需要联系腾讯云短信技术支持(QQ:3012203387)，量大客户可以使用此功能批量拉取，其他客户不建议使用。

- **发送海外短信**

海外短信与国内短信发送类似, 发送海外短信只需替换相应国家码。


- **上传语音文件**

```javascript
var fs = require("fs");

// Note: 语音文件大小上传限制400K字节
var filePath = "/home/pf/data/download/scripts/voice/4162.mp3";
var fileContent = fs.readFileSync(filePath);
var uploader = qcloudsms.VoiceFileUploader();
// 上传成功后，callback里会返回语音文件的fid
uploader.upload(fileContent, "mp3", callback);
```

> `Note` '语音文件上传'功能需要联系腾讯云短信技术支持(QQ:3012203387)才能开通

- **按语音文件fid发送语音通知**

```javascript
// Note：这里fid来自`上传语音文件`接口返回的响应，要按语音
//    文件fid发送语音通知，需要先上传语音文件获取fid
var fid = "c799d10a43ec109f02f2288ca3c85b79e7700c98.mp3";
var fvsender = qcloudsms.FileVoiceSender();
fvsender.send("86", phoneNumbers[0], fid, 2, "", callback);
```

> `Note` 按'语音文件fid发送语音通知'功能需要联系腾讯云短信技术支持(QQ:3012203387)才能开通

- **指定模板发送语音通知**

```javascript
var templateId = 12345;
var params = ["5678"];
var tvsender = qcloudsms.TtsVoiceSender();
tvsender.send("86", phoneNumbers[0], templateId, params, 2, "", callback);
```
