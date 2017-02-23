# 个人中心

其实这个目录下面就是web端中的个人中心，目前有四个模块：
1. 首页
2. 特权介绍
3. 成长体系
4. 购买容量

# 模板结构
> 模板比较复杂，分开来说一下

## main.tmpl.html
盛放的是主体框架模板。

## header.tmpl.html
存放最顶部导航栏部分的模板。

## vip/ grow/ privilege/ capacity_purchase
这些目录下存放的分别是各个模块下的body模板部分。

## footer.tmpl.html
脚部模板。

## error.tmpl.html
错误页面，后端返回`ret!==0 || ret !== 190011 || ret!== 190051`时触发。
