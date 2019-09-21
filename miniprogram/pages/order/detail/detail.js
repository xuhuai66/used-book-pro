const app = getApp()
const db = wx.cloud.database();
const config = require("../../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {

      },
      onLoad: function(e) {
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
                              detail: e.data
                        })
                        that.getSeller(e.data.seller);
                  },
                  fail() {
                        wx.showToast({
                              title: '获取失败，请稍后到订单中心内查看',
                              icon: 'none'
                        })
                  }
            })
      },
      //获取卖家信息
      getSeller(m) {
            let that = this;
            db.collection('user').where({
                  _openid: m
            }).get({
                  success: function(res) {
                        wx.hideLoading();
                        that.setData({
                              userinfo: res.data[0]
                        })
                  }
            })
      },
      //取消订单
      cancel() {
            let that = this;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确认要取消该订单吗',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在处理',
                              })
                              wx.cloud.callFunction({
                                    name: 'pay',
                                    data: {
                                          $url: "changeP", //云函数路由参数
                                          _id: that.data.detail.sellid,
                                          status: 0 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                    },
                                    success: res => {
                                          console.log('修改订单状态成功')
                                          wx.cloud.callFunction({
                                                name: 'pay',
                                                data: {
                                                      $url: "changeO", //云函数路由参数
                                                      _id: that.data.detail._id,
                                                      status: 3 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                                },
                                                success: res => {
                                                      console.log('修改订单状态成功')
                                                      that.up(that.data.detail.price); //返回钱到余额
                                                      that.canceltip();
                                                      that.getdetail(that.data.detail._id);
                                                },
                                                fail(e) {
                                                      wx.hideLoading();
                                                      wx.showToast({
                                                            title: '发生异常，请及时和管理人员联系处理',
                                                            icon: 'none'
                                                      })
                                                }
                                          })
                                    },
                                    fail(e) {
                                          wx.hideLoading();
                                          wx.showToast({
                                                title: '发生异常，请及时和管理人员联系处理',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      //确认收货
      confirm() {
            let that = this;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确认已收货吗',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在处理',
                              })
                              wx.cloud.callFunction({
                                    name: 'pay',
                                    data: {
                                          $url: "changeP", //云函数路由参数
                                          _id: that.data.detail.sellid,
                                          status: 2 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                    },
                                    success: res => {
                                          console.log('修改订单状态成功')
                                          wx.cloud.callFunction({
                                                name: 'pay',
                                                data: {
                                                      $url: "changeO", //云函数路由参数
                                                      _id: that.data.detail._id,
                                                      status: 2 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                                },
                                                success: res => {
                                                      console.log('修改订单状态成功')
                                                      wx.cloud.callFunction({
                                                            name: 'his',
                                                            data: {
                                                                  $url: "toseller", //云函数路由参数
                                                                  seller: that.data.detail.seller,
                                                                  num: that.data.detail.price
                                                            },
                                                            success() {
                                                                  wx.hideLoading();
                                                                  that.confirmtip();
                                                                  that.getdetail(that.data.detail._id);
                                                            }
                                                      })
                                                },
                                                fail(e) {
                                                      wx.hideLoading();
                                                      wx.showToast({
                                                            title: '发生异常，请及时和管理人员联系处理',
                                                            icon: 'none'
                                                      })
                                                }
                                          })
                                    },
                                    fail(e) {
                                          wx.hideLoading();
                                          wx.showToast({
                                                title: '发生异常，请及时和管理人员联系处理',
                                                icon: 'none'
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      //删除订单
      delete() {
            let that = this;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确认要删除此订单吗',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在处理',
                              })
                              db.collection('order').doc(that.data.detail._id).remove({
                                    success() {
                                          //页面栈返回
                                          let i = getCurrentPages()
                                          wx.navigateBack({
                                                success: function() {
                                                      i[i.length - 2].getlist();
                                                }
                                          });
                                    },
                                    fail: console.error
                              })
                        }
                  }
            })
      },
      //复制
      copy(e) {
            wx.setClipboardData({
                  data: e.currentTarget.dataset.copy,
                  success: res => {
                        wx.showToast({
                              title: '复制' + e.currentTarget.dataset.name + '成功',
                              icon: 'success',
                              duration: 1000,
                        })
                  }
            })
      },
      //电话拨打
      phone(e) {
            wx.makePhoneCall({
                  phoneNumber: e.currentTarget.dataset.phone
            })
      },
      //余额计算
      up(num) {
            let that = this;
            wx.cloud.callFunction({
                  name: 'his',
                  data: {
                        $url: "recharge", //云函数路由参数
                        num: num
                  },
                  success(e) {
                        wx.showToast({
                              title: '取消成功',
                              icon: 'success',
                        })
                        that.history('取消订单退款', num, 1);
                  },
                  fail(e) {
                        wx.showToast({
                              title: '发送错误，请联系管理员',
                              icon: 'none'
                        })
                  }
            })
      },
      //历史记录
      history(name, num, type) {
            let that = this;
            db.collection('history').add({
                  data: {
                        stamp: new Date().getTime(),
                        type: type, //1充值2支付
                        name: name,
                        num: num,
                        oid:app.openid
                  },
                  success: function(res) {
                        console.log(res)
                  },
                  fail: console.error
            })
      },
      //邮件提醒交易取消
      canceltip() {
            let that = this;
            wx.cloud.callFunction({
                  name: 'email',
                  data: {
                        type: 4,//1下单提醒2提醒收货3取消交易4取消订单5交易完成
                        email: that.data.userinfo.email,
                        title: that.data.detail.bookinfo.title,
                  },
                  success: res => {
                        console.log(res)
                  },
            })
      },
      //邮件提醒订单完成
      confirmtip() {
            let that = this;
            wx.cloud.callFunction({
                  name: 'email',
                  data: {
                        type: 5,//1下单提醒2提醒收货3取消交易4取消订单5交易完成
                        email: that.data.userinfo.email,
                        title: that.data.detail.bookinfo.title,
                  },
                  success: res => {
                        console.log(res)
                  },
            })
      },
})