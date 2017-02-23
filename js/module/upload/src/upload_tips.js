/**
 * 上传控件上面的小黄条tips
 * @author svenzeng
 * @date 13-3-1
 */
define(function (require, exports, module) {

    var common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Cache = require('./tool.upload_cache'),
        constants = common.get('./constants'),
        aid = common.get('./configs.aid'),

        ie = $.browser.msie,
        safari = $.browser.safari,
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        install_tip = (function () {
            if(constants.IS_APPBOX){
                return '当前的上传方式成功率较低，建议安装最新版的QQ，上传更稳定并支持查看进度。<a target="_blank" href="http://im.qq.com/qq/">立即安装</a>';
            }
            var href, wording;
            if (safari || !gbIsWin) {//非safari，window 显示插件安装
                href = 'http://www.adobe.com/go/getflashplayer';
                wording = 'Flash';
            } else {
                href = 'http://www.weiyun.com/plugin_install.html' ;
                wording = '极速上传';
            }
            return '当前的上传方式成功率较低，建议安装' + wording + '控件，更稳定并支持查看进度。<a href="' + href + '" target="_blank">立即安装</a>';
        })();

    var stack = [
        /**
         *1:表单上传时，判断是否显示小黄条
         *2:条件 form，总数小于7条;
         */
        function ($parent) {
            if (upload_route.type === 'upload_form' && Cache.length() < 7) {//显示提示信息
                if (!$parent[0].has_show_install) {
                    $parent.html(install_tip).removeClass('upbox-video-err').show()[0].has_show_install = true;
                }
            } else {//隐藏提示信息
                if ($parent[0].has_show_install) {
                    $parent.hide()[0].has_show_install = false;
                }
            }
        }
    ];
    return {
        public_tip: function ($parent) {
            $.each(stack, function () {
                this($parent);
            });
        }
    }
});