const request = require('request')
const auth = require('./auth.js')
const version = require('../../package.json').version

module.exports = function(args) {
  let config = args.config,
    params = args.params,
    method = args.method || 'get',
    protocol = config.isHttp === true ? 'http' : 'https'

  let seqId = process.env.TCB_SEQID || ''

  const eventId =
    new Date().valueOf() +
    '_' +
    Math.random()
      .toString()
      .substr(2, 5)

  seqId = seqId ? `${seqId}-${new Date().getTime()}` : eventId
  params = Object.assign({}, params, {
    envName: config.envName,
    timestamp: new Date().valueOf(),
    eventId,
    wxCloudApiToken: process.env.WX_API_TOKEN || '',
    // 对应服务端 wxCloudSessionToken
    tcb_sessionToken: process.env.TCB_SESSIONTOKEN || ''
  })

  for (let key in params) {
    if (params[key] === undefined) {
      delete params[key]
    }
  }
  // file 和 wx.openApi带的requestData 需避开签名
  let file = null
  if (params.action === 'storage.uploadFile') {
    file = params['file']
    delete params['file']
  }

  let requestData = null
  if (params.action === 'wx.openApi') {
    requestData = params['requestData']
    delete params['requestData']
  }

  const isInSCF = process.env.TENCENTCLOUD_RUNENV === 'SCF'

  if (!config.secretId || !config.secretKey) {
    if (isInSCF) {
      throw Error('missing authoration key, redeploy the function')
    }
    throw Error('missing secretId or secretKey of tencent cloud')
  }

  // Note: 云函数被调用时可能调用端未传递SOURCE，TCB_SOURCE 可能为空
  const TCB_SOURCE = process.env.TCB_SOURCE || ''
  const SOURCE = isInSCF ? `${TCB_SOURCE},scf` : ',not_scf'

  const authObj = {
    SecretId: config.secretId,
    SecretKey: config.secretKey,
    Method: method,
    pathname: '/admin',
    Query: params,
    Headers: Object.assign(
      config.headers || {},
      {
        'user-agent': `tcb-admin-sdk/${version}`,
        'x-tcb-source': SOURCE
      },
      args.headers || {}
    )
  }

  params.authorization = auth.getAuth(authObj)

  file && (params.file = file)
  requestData && (params.requestData = requestData)
  config.sessionToken && (params.sessionToken = config.sessionToken)
  params.sdk_version = version

  let url = protocol + '://tcb-admin.tencentcloudapi.com/admin'

  if (process.env.TENCENTCLOUD_RUNENV === 'SCF') {
    url = 'http://tcb-admin.tencentyun.com/admin'
  }

  if (params.action === 'wx.api' || params.action === 'wx.openApi') {
    url = protocol + '://tcb-open.tencentcloudapi.com/admin'
  }

  const opts = {
    url: config.serviceUrl || url,
    method: args.method || 'get',
    // 先取模块的timeout，没有则取sdk的timeout，还没有就使用默认值
    timeout: args.timeout || config.timeout || 15000,
    headers: authObj.Headers,
    proxy: config.proxy
  }

  if (opts.url.includes('?')) {
    opts.url = `${opts.url}&eventId=${eventId}&seqId=${seqId}`
  } else {
    opts.url = `${opts.url}?&eventId=${eventId}&seqId=${seqId}`
  }

  if (params.action === 'storage.uploadFile') {
    opts.formData = params
    opts.formData.file = {
      value: params.file,
      options: {
        filename: params.path
      }
    }
  } else if (args.method == 'post') {
    if (params.action === 'wx.openApi') {
      opts.formData = params
      opts.encoding = null
    } else {
      opts.body = params
      opts.json = true
    }
  } else {
    opts.qs = params
  }

  if (args.proxy) {
    opts.proxy = args.proxy
  }
  return new Promise(function(resolve, reject) {
    request(opts, function(err, response, body) {
      args && args.callback && args.callback(response)

      if (err === null && response.statusCode == 200) {
        let res
        try {
          res = typeof body === 'string' ? JSON.parse(body) : body
          // wx.openApi 调用时，需用content-type区分buffer or JSON
          if (params.action === 'wx.openApi') {
            const { headers } = response
            if (headers['content-type'] === 'application/json; charset=utf-8') {
              res = JSON.parse(res.toString()) // JSON错误时buffer转JSON
            }
          }
        } catch (e) {
          res = body
        }
        return resolve(res)
      } else {
        return reject(err)
      }
    })
  })
}
