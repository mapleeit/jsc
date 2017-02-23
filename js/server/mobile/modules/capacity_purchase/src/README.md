# 各个文件负责模块介绍

## _config.js

`_config.js`是`jsc`打包所使用的配置文件。

## ar.js
`ar.js`是`async request`的缩写，封装了所有异步请求。
 
## capacity_purchase.js
`capacity_purchase.js`，所有文件目录名称相同的`js`文件，都是项目的主入口文件。
 
## busiConfig.js
`busiConfig.js`，是与业务相关的配置文件，是一些文字描述等等的映射。

## dom.js
`dom.js`，是所有获取`dom`的相关接口，一般形如：

```javascript
var get_$purchase_btn = function() {
    var me = this;

    return me.$purchase_btn || (me.$purchase_btn = $('.j-purchase-btn'));
}
```
返回结果是`jQuery`对象。

## mgr.js
`mgr.js`，是所有事件集合处理地，监听所有其他模块抛出的事件，然后做出相应处理。
至于这个东西是什么的缩写，对不起，是远古流传下来的东西了，我也猜不来是什么。我猜是message g** response。

## view.js
`view.js`是视图模块，绑定处理元素的点击事件。


## tmpl/

这个里面特别说明，iap页面是ios使用的，苹果支付不能走正常的H5支付。
这里面有两点不同：
1. 支付是走scheme呼起客户端内置的iap支付
2. 所有跳转的页面都不能包含支付相关的，所以就直接去掉链接了
3. 本项目中的iap页面所有异步脚本直接直出出来了