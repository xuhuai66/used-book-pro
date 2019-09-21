var app = getApp();
var db = wx.cloud.database();

Page({
      /**
       * 页面的初始数据
       */
      data: {
            list: [{
                  title: '该程序是做什么的？',
                  id: 0,
                  des: ['本程序主要是方便重庆大学的朋友发布自己不要了的二手书的。',
                        '如果您是其它学校得同学，可以访问【关于程序】页面，根据说明给自己学校也部署一个'
                  ],
                  check: true,
            }, {
                  title: '该程序收费吗？',
                  id: 1,
                  des: ['本程序是完全的公益项目，永久承诺不收取任何中介费，您可以随心所欲的发布自己的书籍和购买'],
                  check: false,
            }, {
                  title: '为什么要留下联系方式？',
                  id: 2,
                  des: ['本程序交易完全由交易双方沟通。', '除非程序出现问题导致交易故障，平台不参与任何交易'],
                  check: false,
            }, {
                  title: '关于提现处为什么需要含有手续费？',
                  id: 3,
                  des: ['对于本程序的正常运行，成本支出有以下几个方面', '1、程序部署上线，每年都需要微信认证300元。', '2、配置短信提醒码，目前单价是0.05一条', '3、云开发套餐，目前使用的是30元每月的套餐', '程序完全公益，不存在盈利目的，这点手续费仅仅是用于本程序的正常运行，望理解'],
                  check: false,
            }, {
                  title: '交易中途取消后，钱款会自动到微信钱包吗？',
                  id: 4,
                  des: ['如果卖家取消了交易或者您取消了订单，钱款都会原数退还至您在此小程序的钱包内，最后需要您手动提现一下才能转出到余额'],
                  check: false,
            }, {
                  title: '本程序的通知形式？',
                  id: 5,
                  des: ['对于买家下单时，我们会发送短信和邮件给卖家，通知他尽快发货','当交易状态中途取消时，仅以邮件通知对方','您可以在订单详情页面通过买（卖）家留下的联系方式第一时间联系，这样更能提高效率'],
                  check: false,
            }, ]
      },
      onReady() {},

      show(e) {
            var that = this;
            let ite = e.currentTarget.dataset.show;
            let list = that.data.list;
            if (!ite.check) {
                  list[ite.id].check = true;
            } else {
                  list[ite.id].check = false;
            }
            that.setData({
                  list: list
            })
      },
      //跳转页面
      go(e) {
            wx.navigateTo({
                  url: e.currentTarget.dataset.go
            })
      },
      onLoad() {

      },

})