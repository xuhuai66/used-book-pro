const Db = require('@cloudbase/database').Db
const storage = require('./src/storage')
const functions = require('./src/functions')
const auth = require('./src/auth')
const wx = require('./src/wx')
const Request = require('./src/utils/dbRequest')

function Tcb(config) {
  this.config = config ? config : this.config
}

Tcb.prototype.init = function({
  secretId,
  secretKey,
  sessionToken,
  env,
  proxy,
  timeout,
  serviceUrl,
  version,
  headers = {},
  credentials,
  isHttp
} = {}) {
  if ((secretId && !secretKey) || (!secretId && secretKey)) {
    throw Error('secretId and secretKey must be a pair')
  }

  this.config = {
    get secretId() {
      return this._secretId ? this._secretId : process.env.TENCENTCLOUD_SECRETID
    },
    set secretId(id) {
      this._secretId = id
    },
    get secretKey() {
      return this._secretKey
        ? this._secretKey
        : process.env.TENCENTCLOUD_SECRETKEY
    },
    set secretKey(key) {
      this._secretKey = key
    },
    get sessionToken() {
      if (this._sessionToken === undefined) {
        //默认临时密钥
        return process.env.TENCENTCLOUD_SESSIONTOKEN
      } else if (this._sessionToken === false) {
        //固定秘钥
        return undefined
      } else {
        //传入的临时密钥
        return this._sessionToken
      }
    },
    set sessionToken(token) {
      this._sessionToken = token
    },
    envName: env,
    proxy: proxy,
    isHttp: isHttp,
    headers: Object.assign({}, headers)
  }

  this.config.secretId = secretId
  this.config.secretKey = secretKey
  this.config.timeout = timeout || 15000
  this.config.serviceUrl = serviceUrl
  this.config.credentials = credentials
  this.config.sessionToken = sessionToken
    ? sessionToken
    : secretId && secretKey
    ? false
    : undefined

  if (version) {
    this.config.headers['x-sdk-version'] = version
  }

  return new Tcb(this.config)
}

Tcb.prototype.database = function(dbConfig) {
  Db.reqClass = Request
  return new Db({ ...this, ...dbConfig })
}

/**
 * @returns string
 */
Tcb.prototype.getCurrentEnv = function() {
  return process.env.TCB_ENV || process.env.SCF_NAMESPACE
}

function each(obj, fn) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn(obj[i], i)
    }
  }
}

function extend(target, source) {
  each(source, function(val, key) {
    target[key] = source[key]
  })
  return target
}

extend(Tcb.prototype, functions)
extend(Tcb.prototype, storage)
extend(Tcb.prototype, wx)
extend(Tcb.prototype, auth)

module.exports = new Tcb()
