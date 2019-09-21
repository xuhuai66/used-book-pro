function getUserInfo() {
  const openId = process.env.WX_OPENID || ''
  const appId = process.env.WX_APPID || ''
  const uid = process.env.TCB_UUID || ''

  return {
    openId,
    appId,
    uid
  }
}

exports.auth = function() {
  return { getUserInfo }
}
