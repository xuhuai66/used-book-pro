const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            nomore: false,
            list:[],
            num:0,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onShow: function(options) {
            this.getnum();
      },
      go(e) {
            wx.navigateTo({
                  url: e.currentTarget.dataset.go
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
                              num: res.data[0].parse,
                              nomore: false,
                        });
                        that.his();
                  },
                  fail() {
                        wx.showToast({
                              title: '获取失败',
                              icon: 'none'
                        })
                  }
            })
      },
      //获取历史
      his() {
            let that = this;
            db.collection('history').where({
                 oid: app.openid
            }).orderBy('stamp', 'desc').get({
                  success: function(res) {
                        console.log(res.data)
                        that.setData({
                              page: 0,
                              list: res.data,
                              nomore:false,
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
      more() {
            let that = this;
            if (that.data.nomore || that.data.list.length < 20) {
                  return false
            }
            let page = that.data.page + 1;
            db.collection('history').where({
                  oid: app.openid
            }).orderBy('stamp', 'desc').skip(page * 20).get({
                  success: function(res) {
                        if(res.data.length==0){
                              that.setData({
                                    nomore:true
                              })
                              return false;
                        }
                        if(res.data.length<20){
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
      onReachBottom() {
            this.more();
      },
      //至顶
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //监测屏幕滚动
      onPageScroll: function (e) {
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
})