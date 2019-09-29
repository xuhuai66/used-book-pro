

# 欢迎使用，下面是配置教程
## 劳烦您花一秒钟时间，戳戳右上角的star
### 本程序完全开源，说明地址：
#### [https://mp.weixin.qq.com/s/e93APJGBrqbGNBiLuqKaxQ](https://mp.weixin.qq.com/s/e93APJGBrqbGNBiLuqKaxQ "https://mp.weixin.qq.com/s/e93APJGBrqbGNBiLuqKaxQ")

#### 目前新版程序已经上线，可先预览：
![小程序【重庆大学二手书】](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/pyq.png "小程序【重庆大学二手书】")

长话短说，下面直接说配置流程

## 一、小程序端
### 1、下载导入
直接下载到本地，然后导入开发者工具

最近墙的厉害，也可使用蓝奏云下载

> [https://www.lanzous.com/i6hd9mh](https://www.lanzous.com/i6hd9mh "https://www.lanzous.com/i6hd9mh")

> 小程序开发综合文档地址：[https://developers.weixin.qq.com/miniprogram/dev/framework/](https://developers.weixin.qq.com/miniprogram/dev/framework/ "https://developers.weixin.qq.com/miniprogram/dev/framework/")

### 2、开通云环境

不罗嗦，这都是基础，直接看官方说明操作即可

> 云开发官方文档说明：[https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html "https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html")

### 3、配置前端config

找到config.js文件，然后按照我写的注释更改为你自己

![config.js](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/1.png "config.js")

### 4、细节修改

#### ①app.json 全局顶部导航

![app.json](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/2.png "app.json")

#### ②pages/help/help.js 帮助文档

![help.js](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/3.png "help.js")

#### ③images 默认图片

![images](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/4.png "images")


## 二、云函数

### 1、修改基础信息

每个云函数要修改的部分，我都捻出来放在了顶部，直接根据我做的注释信息进行修改，如下图所示

![云函数](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/5.png "云函数")

#### 补充说明：

##### 1.books云函数中使用的书籍信息使用的是极速数据的接口

> 详情地址：[https://www.jisuapi.com/api/isbn/](https://www.jisuapi.com/api/isbn/ "https://www.jisuapi.com/api/isbn/")


##### 2.email云函数中使用的默认发送邮件方式为QQ邮箱

> 开发文档地址：[https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28](https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28 "https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28")


##### 3.sms云函数中使用的腾讯云短信接口

> 申请地址：[https://cloud.tencent.com/product/sms](https://cloud.tencent.com/product/sms "https://cloud.tencent.com/product/sms")

> 开发文档：[https://cloud.tencent.com/document/product/382/34874](https://cloud.tencent.com/document/product/382/34874 "https://cloud.tencent.com/document/product/382/34874")

### 2、上传全部文件

挨个提交每个云函数，其中依赖包我已经一起上传了，无需再挨个本地去安装，直接上传所有文件即可

![云函数](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/6.png "云函数")

## 三、云开发数据库

### 1、创建集合 设置权限

分别创建下图所示的集合，然后将所有集合的权限设置为所有可读

![集合](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/7.png "集合")

| 集合名称  | 存储内容  |
| ------------ | ------------ |
|  banner | 首页轮播  |
| books  | 书籍信息  |
| history  | 钱包收支记录  |
|  order |  订单信息 |
| publish  |  发布信息 |
|  start | 启动页图  |
|  times | 提现次数  |
| user  |  用户数据 |

### 2、设置banner

#### ①在banner集合下新增一条记录

#### ②按照下图所示添加字段

![轮播](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/8.png "轮播")

如果不知道如何添加，可以直接导入我生成的json，然后修改即可

> banner集合示例记录下载地址: [http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/database_export-RMHdk59cOYBr.json](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/database_export-RMHdk59cOYBr.json "http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/database_export-RMHdk59cOYBr.json")

#### 补充说明

list数组下的img为图片地址，id为唯一区分字段，url为点击轮播后跳转的地址，这个地址必须为与此小程序关联的公众号文章或者为业务域名地址，如果没有就留空即可

### 3、设置启动页图片

#### ①在start集合下新增一条记录

#### ②按照下图所示添加字段

![start](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/9.png "start")

## 四、云存储配置

#### 1.提现设置

> [https://mp.weixin.qq.com/s/0ee3aHbtqhYT6b-0xljleQ](https://mp.weixin.qq.com/s/0ee3aHbtqhYT6b-0xljleQ "https://mp.weixin.qq.com/s/0ee3aHbtqhYT6b-0xljleQ")

#### 2.新建文件夹【share】，用于存放生成的小程序码


## 五、公众平台配置

### 1、设置基本信息

|  名称 | 配置  |
| ------------ | ------------ |
| 类目  | 生活服务 > 环保回收/废品回收  |
| 基础库	  | 2.4.3|

【开发】-【开发设置】-【服务器域名】-【downloadFile合法域名】：

①api.jisuapi.com

②你的云存储下载域名，如下图所示

![云存储下载域名](https://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/11.png  "云存储下载域名")

### 2、提交审核

审核页面路径：pages/start/start

### 3、设置在线客服

打开【设置】--【客服】--【添加】，绑定成功后，打开小程序【客服小助手】，状态设置为在线即可，到时候有客户咨询自动会推送到你的微信号上的

![客服](http://cqu.oss-cn-shenzhen.aliyuncs.com/img/book/github/10.png "客服")


## 六、服务与反馈

#### 小程序内有本人详细的联系方式，有问题及时反馈
#### 如果需要提供安装服务，直接联系我微信：xuhuai66
#### 下面是我的小程序php开发交流圈

> [https://mp.weixin.qq.com/s/Jlxn0aw05R8jED4jZtVMwQ](https://mp.weixin.qq.com/s/Jlxn0aw05R8jED4jZtVMwQ "https://mp.weixin.qq.com/s/Jlxn0aw05R8jED4jZtVMwQ")

