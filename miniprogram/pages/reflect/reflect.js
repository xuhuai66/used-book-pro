const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      data: {
            num: 0,
            key: '',
            times: 1,
      },
      onLoad() {
            this.getTimes();
            this.getnum();
            this.setData({
                  canReflect: app.canReflect
            })
      },
      //获取金额
      getnum() {
            let that = this;
            db.collection('user').where({
                  _openid: app.openid
            }).get({
                  success: function(res) {
                        console.log(res.data)
                        that.setData({
                              userid: res.data[0]._id,
                              num: res.data[0].parse,
                        });
                  },
                  fail() {
                        that.setData({
                              num: 0,
                        });
                        wx.showToast({
                              title: '获取失败',
                              icon: 'none'
                        })
                  }
            })
      },
      //金额输入
      keyInput(e) {
            this.data.key = e.detail.value;
      },
      //校检
      check(e) {
            let that = this;
            //每日仅限提现一次
            if (that.data.times > 0) {
                  wx.showToast({
                        title: '每日仅限提现一次，请明日再来',
                        icon: 'none',
                  })
                  return false;
            }
            //首先校检是否提交中
            if (!app.canReflect) {
                  return false
            }
            //校检金额不得为空
            if (!that.data.key) {
                  wx.showToast({
                        title: '请输入提现金额',
                        icon: 'none',
                  })
                  return false;
            }
            //校检金额不得低于10元
            let key = parseInt(that.data.key);
            if (key < 10) {
                  wx.showToast({
                        title: '单笔提现金额不得低于10元',
                        icon: 'none',
                  })
                  return false;
            }
            //校检金额不得高于余额
            if (key > that.data.num) {
                  wx.showToast({
                        title: '余额不足',
                        icon: 'none',
                  })
                  return false;
            }
            //校检金额不得高于30
            if (key > 30) {
                  wx.showToast({
                        title: '单笔提现金额不得超过30元',
                        icon: 'none',
                  })
                  return false;
            }
            that.reflectpost();
      },
      //获取当天提现次数
      getTimes() {
            let that = this;
            db.collection('times').where({
                  _openid: app.openid,
                  days: config.days()
            }).count({
                  success: function(res) {
                        that.setData({
                              times: res.total
                        })
                  },
                  fail() {
                        that.setData({
                              times: 1
                        })
                  }
            })
      },
      //记录提现记录
      addTimes() {
            let that = this;
            db.collection('times').add({
                  data: {
                        days: config.days()
                  },
                  success: function(res) {
                        // console.log(res)
                  },
                  fail: console.error
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
                        oid: app.openid,
                  },
                  success: function(res) {
                        // console.log(res)
                  },
                  fail: console.error
            })
      },
      //提现提交
      reflectpost() {
            let that = this;
            wx.showLoading({
                  title: '正在提现',
            });
            app.canReflect = false;
            that.setData({
                  canReflect: false,
            })
            // 利用云开发接口，调用云函数发起订单
            wx.cloud.callFunction({
                  name: 'ref',
                  data: {
                        userid: that.data.userid,
                        num: that.data.key,
                  },
                  success: res => {
                        if (res.result == 0) {
                              that.failref();
                        } else {
                              that.successref();
                        }
                  },
                  fail(e) {
                        that.failref();
                        console.log(e)
                  }
            });
      },
      //提现成功回调
      successref() {
            let that = this;
            //记录今日次数
            that.addTimes();
            that.setData({
                  num: that.data.num - that.data.key,
                  times: 1
            })
            that.history('余额提现', that.data.key, 2);
            wx.hideLoading();
            wx.showToast({
                  title: '提现成功',
                  icon: 'success'
            });
      },
      //提现失败回调
      failref() {
            wx.hideLoading();
            wx.showToast({
                  title: '提现失败，请稍后再试',
                  icon: 'none'
            });
            //释放禁用操作
            app.canReflect = true;
            this.setData({
                  canReflect: true,
            })
      }
})