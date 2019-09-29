const http = require('http')
const request = require('request')
const auth = require('./auth.js')
const tracing = require('./tracing')
const utils = require('./utils')
const version = require('../../package.json').version

module.exports = utils.warpPromise(doRequest)

function doRequest(args) {
  const config = args.config
  const method = args.method || 'get'
  const protocol = config.isHttp === true ? 'http' : 'https'
  const isInSCF = process.env.TENCENTCLOUD_RUNENV === 'SCF'

  if (!config.secretId || !config.secretKey) {
    if (isInSCF) {
      throw Error('missing authoration key, redeploy the function')
    }
    throw Error('missing secretId or secretKey of tencent cloud')
  }

  const tracingInfo = tracing.generateTracingInfo()
  const seqId = tracingInfo.seqId
  const eventId = tracingInfo.eventId

  const params = Object.assign({}, args.params, {
    envName: config.envName,
    timestamp: new Date().valueOf(),
    eventId,
    wxCloudApiToken: process.env.WX_API_TOKEN || '',
    // 对应服务端 wxCloudSessionToken
    tcb_sessionToken: process.env.TCB_SESSIONTOKEN || ''
  })
  utils.filterUndefined(params)

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

  // Note: 云函数被调用时可能调用端未传递 SOURCE，TCB_SOURCE 可能为空
  const TCB_SOURCE = process.env.TCB_SOURCE || ''
  const SOURCE = isInSCF ? `${TCB_SOURCE},scf` : ',not_scf'

  const headers = {
    'user-agent': `tcb-admin-sdk/${version}`,
    'x-tcb-source': SOURCE
  }

  const authObj = {
    SecretId: config.secretId,
    SecretKey: config.secretKey,
    Method: method,
    pathname: '/admin',
    Query: params,
    Headers: Object.assign({}, headers)
  }

  params.authorization = auth.getAuth(authObj)

  file && (params.file = file)
  requestData && (params.requestData = requestData)
  config.sessionToken && (params.sessionToken = config.sessionToken)
  params.sdk_version = version

  let url = protocol + '://tcb-admin.tencentcloudapi.com/admin'

  if (isInSCF) {
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
    headers: Object.assign({}, config.headers, args.headers, headers),
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
      if (err) {
        return reject(err)
      }

      if (response.statusCode === 200) {
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
        // 避免非 200 错误导致一直不返回
        const e = new Error(`
          ${response.statusCode} ${http.STATUS_CODES[response.statusCode]}
        `)
        e.statusCode = response.statusCode
        reject(e)
      }
    })
  })
}
