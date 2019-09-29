const config = require("config.js");
App({
      openid: '',
      userinfo:'',
      canReflect:true,
      onLaunch: function() {
            if (!wx.cloud) {
                  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
            } else {
                  wx.cloud.init({
                       env: JSON.parse(config.data).env,
                        traceUser: true,
                  })
            }
           this.systeminfo=wx.getSystemInfoSync();
      }
})