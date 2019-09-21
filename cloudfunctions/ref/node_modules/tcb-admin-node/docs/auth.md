### 获取auth的引用

```js
const app = require('tcb-admin-node');
const auth = app.auth();
```

#### 获取用户信息

```js
const {
  openId,
  appId,
  uid,
  customUserId
} = auth.getUserInfo()
```

#### 获取客户端IP
```js
const ip = auth.getClientIP()
```

#### 获取自定义登录的登录凭据ticket

```js
const uid = '123456' // 开发者自定义的用户唯一id

const ticket = auth.createTicket(uid, {
  refresh: 3600 * 1000, // access_token的刷新时间
})
```
