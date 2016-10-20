jsc
===

JavaScript Seajs Compiler.


##无模板，不前端

1. 按目录合并seajs模块，相对路径，一次合并到处运行，支持`seajs 1.0|1.1|1.2|1.3|1.3+`
1. 预编译html模板为`./tmpl.js`模块
1. 监听文件改变自动编译
1. 支持win7、linux
1. 对跨目录合并说No


##1分钟上手

1. 安装`node-v0.8+`，保证全局命令node可用
1. 保证`jsc/bin`下的命令全局可用，将`jsc/bin`添加到环境变量path中或其它方法(window、linux均可)
1. 打开命令行并进入到要合并的源代码目录
1. 输入`jsc`并 回车

##jsc原理分析

###功能
jsc作为seajs的打包工具，具体功能包括：
- js模块化合并；
- tmpl.html模板合并打包为js文件；


###合并规则I:
- jsc执行的目录下面没有搜索到src目录，则不会生成任何的js文件，jsc直接退出到listen阶段（详见jsc.js: if((fs.existsSync || path.existsSync)(modulePath + '/src')){）；
- 如果打包的目录下，没有_config文件，则createOut变量为空， 不会生成对应tmpl.js文件；（详见jsc.js：createTMPL()方法，只有存在createOut的时候，才写模板文件）；
- 如果要生成tmpl.js文件，甚至修改模板名称，必须要在src目录下面放置一个_config.js文件；则会生成tmpl.js，当然可以在_config.js中的name参数修改为自己的想要的名称；生成的模板文件与src目录平级；
- 另外_config.js文件中的tmpl的name参数的值，默认建议为'tmpl.js'，如果是其他值，比如'tmpl_test.js'，会导致生成的js文件为非正常的define方法；直接报错；详见：var code = res.join('').replace('.pack("./tmpl",[],' , '(').replace(/\r\n|\r|\n/g,"\r\n"); 这里的tmpl被替换了，如果是其他的值， 是无法被替换的；那最终的值：define.pack("./commonTmpl",[],function(require, exports, module){var tmpl = { ...
- jsc的打包可以支持jsc监听模式，和all一次性的执行所有的合并；唯一的区别在于all带有参数all=true；调用work方法的时候，会执行目录和目录下面的src的路径进行分析处理；理论上会执行多次jsc的打包；那么意味着后面生成的重复
	文件会覆盖前面生成的重复js文件；为了避免类似的问题，我已经处理了类似的问题，jsc执行更快；
- 如果不增加_config.js文件，则如果通过jsc或者all生成的时候，默认只会在当前目录下面生成index.js，这个文件是默认的output的文件名；打包了所有的模板和src目录下面的js文件；
- 通过jsc的打包方法，可以更加方便的修改_config.js的文件；比如对于直出模板，我们可能并不需要生产的index.js，那么可以在_config.js中，只添加tmpl的内容，不增加js的内容，那么js的文件将不复存在；


##致谢

1. 感谢`viktor`提供windows下鼠标右键功能
1. 感谢`fly`修改jsc支持windows平台
1. 感谢`link、dolly、kim`关注google论坛seajs最新动态
1. 感谢`朋友网前端团队`陪jsc走过的这几年和未来几年
1. 感谢`woods`推进jsc产生按配置文件打包的高级使用方式
1. 感谢`johnnie、shine`在新photo项目中推进jsc转型为相对路径打包
1. 感谢`相册团队`推进`去seajs root`化
1. 感谢`yuni`推进jsc产生全新的打包方式，支持seajs最新版本
1. 感谢`QQ空间QZFL团队`支持CMD规范
1. 感谢`玉伯`关于seajs的深入交流

##谁在用

1. 腾讯朋友(http://www.pengyou.com)
1. QQ相册



##高级合并功能
1. 推荐无配置文件的合并，当然，在不能满足需求的情况可使用高级合并功能
1. `src/`目录下放一个`_config.js`文件实现更灵活的合并，格式参见`jsc/demo._config.js`
1. 重写合并后的模块：`src/`目录下放一个同名模块即可
1. `src/`支持子目录：`*.js`：参与模块id的计算，以`.`分隔；`*.tmpl.html`：分类存放作用

##骨灰级玩家
1. `tmpl.js`可运行于`nodejs`，用于前台模版瞬间转换角色为后台模板，直出页面(http://n.pengyou.com/index.php?mod=group)


## License
jsc is available under the terms of the [MIT License].


##The end.
===