const envid = 'zf-shcud'; //云开发环境id

/*
下
面
不
用
管
*/

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
      env: envid,
})
const TcbRouter = require('tcb-router'); //云函数路由
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
      const app = new TcbRouter({
            event
      });
      //钱包充值
      app.router('recharge', async(ctx) => {
            const wxContext = cloud.getWXContext()
            const openid = wxContext.OPENID;
            const userinfo = await db.collection('user').where({
                  _openid: openid // 填入当前用户 openid
            }).get()
            try {
                  ctx.body = await db.collection('user').doc(userinfo.data[0]._id).update({
                        data: {
                              parse: userinfo.data[0].parse + parseInt(event.num)
                        }
                  });
            } catch (e) {
                  console.error(e)
            }
      });
      //买家确认收货
      app.router('toseller', async(ctx) => {
            //先增加历史记录
            await db.collection('history').add({
                  // data 字段表示需新增的 JSON 数据
                  data: {
                        oid: event.seller,
                        name: '出售书籍',
                        num: event.num,
                        stamp: new Date().getTime(),
                        type: 1,
                  }
            })

            //再修改钱包值
            let userinfo = await db.collection('user').where({
                  _openid: event.seller, // 卖家openid
            }).get()
            ctx.body = await db.collection('user').doc(userinfo.data[0]._id).update({
                  data: {
                        parse: userinfo.data[0].parse + parseInt(event.num)
                  }
            });
      });
      //卖家取消订单退款
      app.router('tobuyer', async(ctx) => {
            //先增加历史记录
            await db.collection('history').add({
                  // data 字段表示需新增的 JSON 数据
                  data: {
                        oid: event.buyer,
                        name: '卖家取消交易退款',
                        num: event.num,
                        stamp: new Date().getTime(),
                        type: 1,
                  }
            })
            //再修改钱包值
            let userinfo = await db.collection('user').where({
                  _openid: event.buyer,
            }).get()
            ctx.body = await db.collection('user').doc(userinfo.data[0]._id).update({
                  data: {
                        parse: userinfo.data[0].parse + parseInt(event.num)
                  }
            });
      });
      return app.serve();
}