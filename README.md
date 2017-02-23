（微云定制版本）

## 什么是jsc？

javascript seajs compiler.

## jsc是做什么的？

做了下面两件事：

### bundle js模块文件

其实就是一个js模块文件打包工具，比如原来需要加载a/b/c三个模块，浏览器需要加载三个请求。
那么jsc就是在本地把a/b/c三个模块合成一个abc模块，这个模块被加载之后会自动推入seajs的模块系统，从而实现在开发过程中分模块开发，最后上线是一个bundle文件。
这样浏览器就可以减少文件请求了。而减少文件请求是优化页面性能的重要一点。

### 模板解析

除了这个功能，还有一个就是实现了一个模板解析。


## 案例

关于具体案例，可以参考`test`目录

```
├── bower_components    // 第三方库
├── dist                // jsc打包之后的生成目录
├── index.html          // 页面入口
├── seajs_config        // seajs config
└── src                 // js代码
```

