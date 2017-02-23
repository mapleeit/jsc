/**
 * Created by maplemiao on 18/02/2017.
 */
"use strict";

window.seajs &&
seajs.config({

    // 别名配置
    alias: {
        'jquery': 'vendor/jquery/dist/jquery.js',
        'zepto': 'vendor/zepto/dist/zepto.js'
    },

    // 路径配置
    paths: {
        'vendor': './bower_components'
    },

    // 变量配置
    vars: {
        // 'locale': 'zh-cn'
    },

    // 映射配置
    // 常用于本地调试
    map: [
        // ['http://example.com/js/app/', 'http://localhost/js/app/']
    ],

    // 调试模式
    debug: false,

    // Sea.js 的基础路径
    base: 'http://example.com/path/to/base/',

    // 文件编码
    charset: 'utf-8'
});