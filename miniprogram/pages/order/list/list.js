const app = getApp()
const db = wx.cloud.database();
const config = require("../../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            scrollTop: 0,
            nomore: false,
            tab: [{
                        name: '全部',
                        id: 0,
                  },
                  {
                        name: '交易中',
                        id: 1,
                  },
                  {
                        name: '交易完成',
                        id: 2,
                  },
                  {
                        name: '已取消',
                        id: 3,
                  }
            ],
            tabid: 0,
      },
      //导航栏切换
      changeTab(e) {
            let that = this;
            that.setData({
                  tabid: e.currentTarget.dataset.id
            })
            that.getlist();
      },
      //跳转详情页
      godetail(e) {
            wx.navigateTo({
                  url: '/pages/order/detail/detail?id=' + e.currentTarget.dataset.id,
            })
      },
      onLoad() {
            wx.showLoading({
                  title: '加载中',
            })
            this.getlist();
      },
      //获取列表
      getlist() {
            let that = this;
            let status = that.data.tabid;
            if (status == 0) {
                  var statusid = _.neq(0); //除-2之外所有
            } else {
                  var statusid = parseInt(status) //小程序搜索必须对应格式
            }
            db.collection('order').where({
                  status: statusid,
                  _openid: app.openid
            }).orderBy('creat', 'desc').get({
                  success(re) {
                        wx.stopPullDownRefresh(); //暂停刷新动作
                        that.setData({
                              nomore: false,
                              page: 0,
                              list: re.data
                        })
                        wx.hideLoading();
                  }
            })
      },
      //取消订单(仅当订单为交易中时候，取消后卖家状态恢复)
      cancel(ord) {
            let that = this;
            let detail = ord.currentTarget.dataset.ord;
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
                                          _id: detail.sellid,
                                          status: 0 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                    },
                                    success: res => {
                                          console.log('修改订单状态成功')
                                          wx.cloud.callFunction({
                                                name: 'pay',
                                                data: {
                                                      $url: "changeO", //云函数路由参数
                                                      _id: detail._id,
                                                      status: 3 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                                },
                                                success: res => {
                                                      console.log('修改订单状态成功')
                                                      that.up(detail.price); //返回钱到余额
                                                      that.canceltip(detail.seller, detail.bookinfo.title);
                                                      that.getlist();
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
      //下拉刷新
      onPullDownRefresh() {
            this.getlist();
      },
      //确认收货
      confirm(ord) {
            let that = this;
            let detail = ord.currentTarget.dataset.ord;
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
                                          _id: detail.sellid,
                                          status: 2 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                    },
                                    success: res => {
                                          console.log('修改订单状态成功')
                                          wx.cloud.callFunction({
                                                name: 'pay',
                                                data: {
                                                      $url: "changeO", //云函数路由参数
                                                      _id: detail._id,
                                                      status: 2 //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                                },
                                                success: res => {
                                                      wx.cloud.callFunction({
                                                            name: 'his',
                                                            data: {
                                                                  $url: "toseller", //云函数路由参数
                                                                  seller: detail.seller,
                                                                  num: detail.price
                                                            },
                                                            success() {
                                                                  wx.hideLoading();
                                                                  that.confirmtip(detail.seller, detail.bookinfo.title);
                                                                  that.getlist();
                                                            }
                                                      })
                                                },
                                          })
                                    },
                              })
                        }
                  }
            })
      },

      //删除订单
      delete(ord) {
            let that = this;
            let detail = ord.currentTarget.dataset.ord;
            wx.showModal({
                  title: '温馨提示',
                  content: '您确认要删除此订单吗',
                  success(res) {
                        if (res.confirm) {
                              wx.showLoading({
                                    title: '正在处理',
                              })
                              db.collection('order').doc(detail._id).remove({
                                    success() {
                                          that.getlist();
                                    },
                                    fail: console.error
                              })
                        }
                  }
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
                        oid: app.openid
                  },
                  success: function(res) {
                        console.log('钱包历史记录成功')
                  },
                  fail: console.error
            })
      },
      //至顶
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //监测屏幕滚动
      onPageScroll: function(e) {
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
      onReachBottom() {
            this.more();
      },
      //加载更多
      more() {
            let that = this;
            if (that.data.nomore || that.data.list.length < 20) {
                  return false
            }
            let page = that.data.page + 1;
            let status = that.data.tabid;
            if (status == 0) {
                  var statusid = _.neq(0); //除-2之外所有
            } else {
                  var statusid = parseInt(status) //小程序搜索必须对应格式
            }
            db.collection('order').where({
                  status: statusid,
                  _openid: app.openid
            }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
                  success: function(res) {
                        if (res.data.length == 0) {
                              that.setData({
                                    nomore: true
                              })
                              return false;
                        }
                        if (res.data.length < 20) {
                              that.setData({
                                    nomore: true
                              })
                        }
                        that.setData({
                              page: page,
                              list: that.data.list.concat(res.data)
                        })
                  },
                  fail() {
                        wx.showToast({
                              title: '获取失败',
                              icon: 'none'
                        })
                  }
            })
      },
      //邮件提醒订单取消
      //m卖家_id,n书籍名字
      canceltip(m, n) {
            let that = this;
            db.collection('user').where({
                  _openid:m
            }).get({
                  success: function(res) {
                        console.log(res)
                        wx.cloud.callFunction({
                              name: 'email',
                              data: {
                                    type: 4, //1下单提醒2提醒收货3取消交易4取消订单5交易完成
                                    email: res.data[0].email,
                                    title: n,
                              },
                              success: re => {
                                    console.log(re)
                              },
                        })
                  },
            })
      },
      //邮件提醒交易完成
      //m卖家_id,n书籍名字
      confirmtip(m, n) {
            let that = this;
            db.collection('user').where({
                  _openid: m
            }).get({
                  success: function (res) {
                        console.log(res)
                        wx.cloud.callFunction({
                              name: 'email',
                              data: {
                                    type: 5, //1下单提醒2提醒收货3取消交易4取消订单//5交易完成
                                    email: res.data[0].email,
                                    title: n,
                              },
                              success: re => {
                                    console.log(re)
                              },
                        })
                  },
            })
      },
})