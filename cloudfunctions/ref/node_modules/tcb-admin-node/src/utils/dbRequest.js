const httpRequest = require('./httpRequest')

/**
 * 数据库模块的通用请求方法
 *
 * @author haroldhu
 * @internal
 */
class Request {
  /**
   * 初始化
   *
   * @internal
   * @param config
   */
  constructor(config) {
    this.config = config
  }

  /**
   * 发送请求
   *
   * @param api   - 接口
   * @param data  - 参数
   */
  async send(api, data) {
    const params = Object.assign({}, data, {
      action: api
    })

    const slowQueryWarning = setTimeout(() => {
      console.warn(
        'Database operation is longer than 3s. Please check query performance and your network environment.'
      )
    }, 3000)

    try {
      return await httpRequest({
        timeout: this.config.timeout,
        config: this.config.config,
        params,
        method: 'post',
        headers: {
          'content-type': 'application/json'
        }
      })
    } finally {
      clearTimeout(slowQueryWarning)
    }
  }
}

module.exports = Request
