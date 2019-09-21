const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {

      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (e) {
            this.getdetail(e.id);
      },
      //回到首页
      home() {
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },
      //获取订单详情
      getdetail(_id) {
            let that = this;
            db.collection('order').doc(_id).get({
                  success(e) {
                      that.setData({
                            creatTime: config.formTime(e.data.creat),
                            detail:e.data
                      })
                  },
                  fail(){
                        wx.showToast({
                              title: '获取失败，请稍后到订单中心内查看',
                              icon:'none'
                        })
                  }
            })
      },
      godetail(){
            wx.redirectTo({
                  url: '/pages/order/list/list',
            })
      }
})