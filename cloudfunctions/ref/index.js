const config = {
      appid: 'wx383426ad9ffe1075', //小程序Appid
      envName: 'zf-shcud', // 小程序云开发环境ID
      mchid: '1111111111', //商户号
      partnerKey: '1111111111111111111111', //此处填服务商密钥
      pfx: '', //证书初始化
      fileID: 'cloud://zf-shcud.11111111111111111/apiclient_cert.p12' //证书云存储id
      actionName:'重庆大学二手书小程序提现',
      rate:1 //提现收取利率，1指的是每笔收取1%
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

      let userInfo = (await db.collection('user').doc(event.userid).get()).data;
      if (parseInt(userInfo.parse)<=parseInt(event.num)){
            return 0;
      }
      //首先获取证书文件
     let fileres = await cloud.downloadFile({
            fileID: config.fileID,
      })
      config.pfx = fileres.fileContent
      let pay = new tenpay(config,true)
      let result = await pay.transfers({
            partner_trade_no: 'bookreflect' + Date.now() + event.num,
            openid: userInfo._openid,
            check_name: 'NO_CHECK',
            amount: parseInt(event.num) * (100 - config.rate),
            desc: config.actionName,
      });
      if (result.result_code == 'SUCCESS') {
            //成功后操作
            //以下是进行余额计算
            let re=await db.collection('user').doc(event.userid).update({
                  data: {
                        parse: userInfo.parse - parseInt(event.num)
                  }
            });
            return re
      }
}
