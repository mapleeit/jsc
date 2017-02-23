## 2016-12-9
* 1. 主要处理加载更多的问题；
* 2. 代码主要在page目录下和common下面；API等是微信库主动提供的；
* 3. 账号：2403618756
     密码：cONTROL8228553
* 4. http://qzone.oa.com/weiyun/WeCon
* 5. 微信官网文档：https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html?t=20161122
* 6. 模版template:

** 6.1 定义模板:使用name属性，作为模板的名字。然后在<template/>内定义代码片段，如：

        <!--
          index: int
          msg: string
          time: string
        -->
        <template name="msgItem">
          <view>
            <text> {{index}}: {{msg}} </text>
            <text> Time: {{time}} </text>
          </view>
        </template>
        
** 6.2 使用模板：使用 is 属性(is 属性可以使用 Mustache 语法，来动态决定具体需要渲染哪个模板：)，
        声明需要的使用的模板，然后将模板所需要的 data 传入，如：
        
        <template is="msgItem" data="{{...item}}"/>
        Page({
          data: {
            item: {
              index: 0,
              msg: 'this is a template',
              time: '2016-09-15'
            }
          }
        })
        
* 7. 数据绑定：WXML 中的动态数据均来自对应 Page 的 data。

** 7.1 简单绑定：数据绑定使用 Mustache 语法（双大括号）将变量包起来，可以作用于：

        <view> {{ message }} </view>
        Page({
          data: {
            message: 'Hello MINA!'
          }
        })

** 7.2 组件属性(需要在双引号之内)：

        <view id="item-{{id}}"> </view>
        Page({
          data: {
            id: 0
          }
        })
        
** 7.3 控制属性(需要在双引号之内)        
        
        <view wx:if="{{condition}}"> </view>
        Page({
          data: {
            condition: true
          }
        })
        
        
** 7.4 关键字(需要在双引号之内)     
   true：boolean 类型的 true，代表真值。
   false： boolean 类型的 false，代表假值。
   
        <checkbox checked="{{false}}"> </checkbox>
   
   
** 7.5 运算: 可以在 {{}} 内进行简单的运算，支持的有如下几种方式：
       
       (1)  三元运算:
            <view hidden="{{flag ? true : false}}"> Hidden </view>
            
       (2)  算数运算     
            <view> {{a + b}} + {{c}} + d </view>
            Page({
              data: {
                a: 1,
                b: 2,
                c: 3
              }
            })
            view中的内容为 3 + 3 + d。
            
       (3） 逻辑判断
            <view wx:if="{{length > 5}}"> </view>
            
       (4)  字符串运算
            <view>{{"hello" + name}}</view>
            Page({
              data:{
                name: 'MINA'
              }
            })
       
       (5)  数据路径运算
            <view>{{object.key}} {{array[0]}}</view>
            Page({
              data: {
                object: {
                  key: 'Hello '
                },
                array: ['MINA']
              }
            })
            
       (6)  组合:也可以在 Mustache 内直接进行组合，构成新的对象或者数组
       
       (7)  数组:
            <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>
            Page({
              data: {
                zero: 0
              }
            })
            最终组合成数组[0, 1, 2, 3, 4]。
            
       (8)  对象   
            <template is="objectCombine" data="{{for: a, bar: b}}"></template>
            Page({
              data: {
                a: 1,
                b: 2
              }
            })
            也可以用扩展运算符 ... 来将一个对象展开
            <template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>
            Page({
              data: {
                obj1: {
                  a: 1,
                  b: 2
                },
                obj2: {
                  c: 3,
                  d: 4
                }
              }
            })
            最终组合成的对象是 {a: 1, b: 2, c: 3, d: 4, e: 5}。
            
       (9)  如果对象的 key 和 value 相同，也可以间接地表达。
            <template is="objectCombine" data="{{foo, bar}}"></template>
            Page({
              data: {
                foo: 'my-foo',
                bar: 'my-bar'
              }
            })
            
            注意：上述方式可以随意组合，但是如有存在变量名相同的情况，后边的会覆盖前面，如：
            <template is="objectCombine" data="{{...obj1, ...obj2, a, c: 6}}"></template>
            Page({
              data: {
                obj1: {
                  a: 1,
                  b: 2
                },
                obj2: {
                  b: 3,
                  c: 4
                },
                a: 5
              }
            })
            最终组合成的对象是 {a: 5, b: 3, c: 6}。

* 8 条件渲染
** 8.1 wx:if: 在框架中，我们用 wx:if="{{condition}}" 来判断是否需要渲染该代码块：
        也可以用 wx:elif 和 wx:else 来添加一个 else 块：
        
        <view wx:if="{{condition}}"> True </view>
        
        <view wx:if="{{length > 5}}"> 1 </view>
        <view wx:elif="{{length > 2}}"> 2 </view>
        <view wx:else> 3 </view>
        
** 8.2 block wx:if     
        注意： <block/> 并不是一个组件，它仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性。
        
** 8.3 wx:if vs hidden
    因为 wx:if 之中的模板也可能包含数据绑定，所有当 wx:if 的条件值切换时，框架有一个局部渲染的过程，
        因为它会确保条件块在切换时销毁或重新渲染。
    同时 wx:if 也是惰性的，如果在初始渲染条件为 false，框架什么也不做，在条件第一次变成真的时候才开始局部渲染。
        相比之下，hidden 就简单的多，组件始终会被渲染，只是简单的控制显示与隐藏。
    
====> 一般来说，wx:if 有更高的切换消耗而 hidden 有更高的初始渲染消耗。
    
====> 因此，如果需要频繁切换的情景下，用 hidden 更好，如果在运行时条件不大可能改变则 wx:if 较好。
    
* 9 列表渲染    
** 9.1 wx:for
    在组件上使用wx:for控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件。
    默认数组的当前项的下标变量名默认为index，数组当前项的变量名默认为item
    
        <view wx:for="{{array}}">
          {{index}}: {{item.message}}
        </view>
        
        Page({
          data: {
            array: [{
              message: 'foo',
            }, {
              message: 'bar'
            }]
          }
        })
    
    使用 wx:for-item 可以指定数组当前元素的变量名，
    使用 wx:for-index 可以指定数组当前下标的变量名：
    
    
* 10 事件：什么是事件
** 事件是视图层到逻辑层的通讯方式。
** 事件可以将用户的行为反馈到逻辑层进行处理。
** 事件可以绑定在组件上，当达到触发事件，就会执行逻辑层中对应的事件处理函数。
** 事件对象可以携带额外信息，如 id, dataset, touches。
    
* 10.1 事件分类
    冒泡事件：当一个组件上的事件被触发后，该事件会向父节点传递。
    非冒泡事件：当一个组件上的事件被触发后，该事件不会向父节点传递。
    
* 10.2 事件绑定： 事件绑定的写法同组件的属性，以 key、value 的形式。
** key 以bind或catch开头，然后跟上事件的类型，如bindtap, catchtouchstart
** value 是一个字符串，需要在对应的 Page 中定义同名的函数。不然当触发事件的时候会报错。
** bind事件绑定不会阻止冒泡事件向上冒泡，catch事件绑定可以阻止冒泡事件向上冒泡。

* 11 引用
* 11.1 import 的作用域
import 有作用域的概念，即只会 import 目标文件中定义的 template，而不会 import 目标文件 import 的 template。
如：C import B，B import A，在C中可以使用B定义的template，在B中可以使用A定义的template，
但是C不能使用A定义的template。

* 11.2 include
include可以将目标文件除了<template/>的整个代码引入，相当于是拷贝到include位置，如：
        
        <!-- index.wxml -->
        <include src="header.wxml"/>
        <view> body </view>
        <include src="footer.wxml"/>
        
        <!-- header.wxml -->
        <view> header </view>
        <!-- footer.wxml -->
        <view> footer </view>
        
===> navigator: 
        // var index = e.currentTarget.dataset.index;   //会返回当前点击的元素信息；
        // wx.navigateTo({
        //     url : '../' + global.navPage[index] + '/index'
        // });
        // return;        