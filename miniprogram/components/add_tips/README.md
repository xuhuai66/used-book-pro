# add-tips
> **微信小程序UI插件**
> 用于提示用户首次进入小程序时，点击右上角菜单进行【添加到我的小程序】操作

## 文档
首先，把这个仓库下载/克隆到你的小程序目录，比如`/components/weplug-add-tips/`    
然后，在首页`index.json`配置文件中，引入该组件：
``` json
{
  "usingComponents": {
    "add-tips": "/components/weplug-add-tips/index"
  }
}
```
最后，在首页`index.wxml`文件中，调用该组件即可：
``` wxml
<add-tips />
```

## 参数
你可以传递两个参数进行自定义操作：

### 1. text：提示的文字内容
``` wxml
<add-tips text="点击添加到小程序" />
```

### 2. duration：提示关闭时间（单位秒）
``` wxml
<add-tips duration="10" />
```

## 截图
![](https://i.loli.net/2019/03/29/5c9e0b1924201.png)

## 你也可以扫一扫小程序进行体验效果：
![](https://i.loli.net/2019/03/29/5c9e0b6bbd8f4.jpg)