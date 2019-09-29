const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
import Dialog from '../../vant/dialog/dialog';
Page({

      /**
       * 页面的初始数据
       */
      data: {

      },
      onLoad(e) {
            this.setData({
                  bookinfo: JSON.parse(e.bookinfo)
            });
            this.getqrcode();
      },
      getqrcode() {
            let that = this;
            wx.showLoading({
                  title: '绘制分享图片中',
                  mask: true
            })
            wx.cloud.callFunction({
                  name: 'qrcode',
                  data: {
                        scene: that.data.bookinfo.id
                  }
            }).then(idres => {
                  console.log(idres)
                  wx.cloud.getTempFileURL({
                        fileList: [{
                              fileID: idres.result
                        }]
                  }).then(res => {
                        console.log(res)
                        that.eventDraw(res.fileList[0].tempFileURL)
                  }).catch(error => {
                        wx.hideLoading();
                        wx.showToast({
                              title: '制作失败',
                              icon: 'none'
                        })
                        // handle error
                  })
            }).catch(error => {
                  console.log(error)
                  wx.hideLoading();
                  wx.showToast({
                        title: '制作失败',
                        icon: 'none'
                  })
            })
      },
      //作图
      eventDraw(qrurl) {
            let that = this;
            let info = that.data.bookinfo;
            that.setData({
                  painting: {
                        width: 375,
                        height: 355,
                        clear: true,
                        views: [{
                                    type: 'rect',
                                    background: "#ffffff",
                                    top: 0,
                                    left: 0,
                                    width: 375,
                                    height: 355,
                              }, {
                                    type: 'image', //封面图
                                    url: info.pic,
                                    top: 30,
                                    left: 30,
                                    width: 90,
                                    height: 90,
                              },
                              {
                                    type: 'text', //标题
                                    content: info.name,
                                    fontSize: 16,
                                    lineHeight: 21,
                                    color: '#383549',
                                    textAlign: 'left',
                                    top: 35,
                                    left: 140,
                                    width: 180,
                                    MaxLineNumber: 2,
                                    breakWord: true,
                                    bolder: true
                              },
                              {
                                    type: 'text', //现价
                                    content: '￥' + info.now + '.00',
                                    fontSize: 19,
                                    color: '#E62004',
                                    textAlign: 'left',
                                    top: 103,
                                    left: 140,
                                    MaxLineNumber: 1,
                                    bolder: true
                              },
                              {
                                    type: 'text', //原价
                                    content: '原价:￥' + info.origin,
                                    fontSize: 13,
                                    color: '#7E7E8B',
                                    textAlign: 'left',
                                    top: 107,
                                    left: 230,
                                    textDecoration: 'line-through'
                              },
                              {
                                    type: 'rect',
                                    background: "#eeeeee",
                                    top: 150,
                                    left: 0,
                                    width: 375,
                                    height: 1
                              },
                              {
                                    type: 'image', //小程序码
                                    url: qrurl,
                                    top: 160,
                                    left: 127.5,
                                    width: 100,
                                    height: 100
                              },
                              {
                                    type: 'text',
                                    content: '长按识别小程序，查看详情',
                                    fontSize: 14,
                                    lineHeight: 21,
                                    color: '#b8b8b8',
                                    textAlign: 'left',
                                    top: 280,
                                    left: 95,
                              },
                              {
                                    type: 'rect',
                                    background: "#eeeeee",
                                    top: 305,
                                    left: 0,
                                    width: 375,
                                    height: 1
                              },
                              {
                                    type: 'image', //logo
                                    url: '/images/poster/logo.png',
                                    top: 320,
                                    left: 20,
                                    width: 129,
                                    height: 20
                              },
                              {
                                    type: 'text',
                                    content: '— —让智慧延续，让温暖传递',
                                    fontSize: 13,
                                    lineHeight: 20,
                                    color: '#383549',
                                    textAlign: 'left',
                                    top: 325,
                                    left: 160,
                              },
                        ]
                  }
            })
      },
      eventGetImage(event) {
            console.log(event)
            wx.hideLoading()
            const {
                  tempFilePath,
                  errMsg
            } = event.detail
            if (errMsg === 'canvasdrawer:ok') {
                  this.setData({
                        shareImage: tempFilePath
                  })
            }
      },
      //保存相册
      eventSave() {
            let that = this;
            wx.saveImageToPhotosAlbum({
                  filePath: that.data.shareImage,
                  success(res) {
                        wx.showToast({
                              title: '保存图片成功',
                              icon: 'success',
                              duration: 2000
                        })
                  },
                  fail() {
                        that.setData({
                              show: true
                        })
                  }
            })
      },
      getSetting(e) {
            let that = this;
            let isSet = e.detail.authSetting['scope.writePhotosAlbum']
            if (isSet) {
                  that.setData({
                        show: false
                  })
                  that.eventSave();
            } else {
                  that.setData({
                        show: true
                  })
            }
      },
      //预览图片
      preview(e) {
            wx.previewImage({
                  urls: e.currentTarget.dataset.link.split(",")
            });
      },
})