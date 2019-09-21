var request = require('request')
var auth = require('./auth.js')
const version = require('../../package.json').version

module.exports = function(args) {
  var config = args.config,
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

  seqId = seqId ? `${seqId}${new Date().getTime()}` : eventId
  params = Object.assign({}, params, {
    envName: config.envName,
    timestamp: new Date().valueOf(),
    eventId
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

  if (!config.secretId || !config.secretKey) {
    if (process.env.TENCENTCLOUD_RUNENV === 'SCF') {
      throw Error('missing authoration key, redeploy the function')
    }
    throw Error('missing secretId or secretKey of tencent cloud')
  }

  // Note: 云函数被调用时可能调用端未传递SOURCE，TCB_SOURCE 可能为空
  const TCB_SOURCE = process.env.TCB_SOURCE || ''
  const SOURCE =
    process.env.TENCENTCLOUD_RUNENV === 'SCF'
      ? `${TCB_SOURCE},scf`
      : `${TCB_SOURCE},not_scf`

  const authObj = {
    SecretId: config.secretId,
    SecretKey: config.secretKey,
    Method: method,
    pathname: '/admin',
    Query: params,
    Headers: Object.assign(
      {
        'user-agent': `tcb-admin-sdk/${version}`,
        'x-tcb-source': SOURCE
      },
      args.headers || {}
    )
  }

  var authorization = auth.getAuth(authObj)

  params.authorization = authorization

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

  var opts = {
    url: config.serviceUrl || url,
    method: args.method || 'get',
    // 先取模块的timeout，没有则取sdk的timeout，还没有就使用默认值
    timeout: args.timeout || config.timeout || 15000,
    headers: authObj.Headers,
    proxy: config.proxy
  }

  opts.url = `${opts.url}?eventId=${eventId}&seqId=${seqId}`

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
