const config = {
      appid: 'wx383426ad9ffe1075', //小程序Appid
      envName: 'zf-shcud', // 小程序云开发环境ID
      mchid: '1111111111', //商户号
      partnerKey: '1111111111111111111111', //此处填服务商密钥
      pfx: '', //证书初始化
      fileID: 'cloud://zf-shcud.11111111111111111/apiclient_cert.p12' //证书云存储id
};

/*
下
面
不
用
管
*/

const cloud = require('wx-server-sdk')
cloud.init({
      env: config.envName
})
const db = cloud.database();
const tenpay = require('tenpay'); //支付核心模块
exports.main = async(event, context) => {
      //首先获取证书文件
      const res = await cloud.downloadFile({
            fileID: config.fileID,
      })
      config.pfx = res.fileContent
      let pay = new tenpay(config,true)
      let result = await pay.transfers({
            //这部分参数含义参考https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2
            partner_trade_no: 'bookreflect' + Date.now() + event.num,
            openid: event.userinfo._openid,
            check_name: 'NO_CHECK',
            amount: parseInt(event.num) * 100,
            desc: '二手书小程序提现',
      });
      if (result.result_code == 'SUCCESS') {
            //如果提现成功后的操作
            //以下是进行余额计算
            let re=await db.collection('user').doc(event.userinfo._id).update({
                  data: {
                        parse: event.userinfo.parse - parseInt(event.num)
                  }
            });
            return re
      }
}