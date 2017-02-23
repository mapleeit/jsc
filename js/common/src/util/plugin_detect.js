/**
 * 上传控件检测工具
 * 功能：1、获取上传控件的版本号，当未安装控件或老控件不存在版本号时为'0'
 *     2、判断当前使用的控件是否是最新的版本，当发布新的控件是要修改最新的版本号
 * @author hibincheng
 * @date 2013-08-22
 */
define(function(require, exports, module) {

    var $ = require('$'),
        constants = require('./constants'),
        lib = require('lib'),
        console = lib.get('./console'),

        IE_NEWEST_PLUGIN_VERSION = '1.0.3.20',//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION = '1.0.1.16',//webkit控件最新的版本号

        undefined;

    //IE
    function ie_plugin_version() {
        try {
            var plugin = new ActiveXObject("TXWYFTNActiveX.FTNUpload");
            return plugin.version || '0';
        } catch(e) {
            return '0';
        }
    }

    //chrome & firefox
    function webkit_plugin_version() {
        var nps = navigator.plugins,
            ret = '0';
        try {
            nps.refresh(false);//刷新控件表，不刷新页面
        } catch(e) {

        }
        $.each(nps || [], function(i, plugin) {//从控件列表中查找上传控件是否已经存在
            if(plugin.name.indexOf('Tencent FTN plug-in') > -1) {
                $.each(plugin, function(j, item) {
                    if(item.type === 'application/txftn-webkit') {
                        ret = plugin.description.split('#');
                        if(ret.length > 1) {
                            ret = $.trim(ret[1]);
                        } else {
                            ret = '0';
                        }
                        return false;//break
                    }
                });

                if(ret !== '0') {
                    return false;//break
                }
            }
        });

        return ret;
    }

    function is_newest_version() {
        var cur_version,
            newest_version;
        if(constants.IS_APPBOX){
            if(window.external.GetVersion){
                console.log(window.external.GetVersion());
                return true;
            }else{
                return false;
            }
        }
        if($.browser.msie || window.ActiveXObject !== undefined) {
            cur_version = parseInt(ie_plugin_version().split('.').join(''), 10);
            newest_version = parseInt(IE_NEWEST_PLUGIN_VERSION.split('.').join(''), 10);
        } else {
            cur_version = parseInt(webkit_plugin_version().split('.').join(''), 10);
            newest_version = parseInt(WEBKIT_NEWEST_PLUGIN_VERSION.split('.').join(''), 10);
        }

        if(cur_version >= newest_version) {
            return true;
        }

        return false;
    }

    //获得当前的上传控件版本
    function get_cur_upload_plugin_version() {
        if(constants.IS_APPBOX){
            if(window.external.GetVersion){
                return window.external.GetVersion();
            }else{
                return 0;
            }
        }
        if($.browser.msie || window.ActiveXObject !== undefined) {
            return parseInt(ie_plugin_version().split('.').join(''), 10);
        } else {
            return parseInt(webkit_plugin_version().split('.').join(''), 10);
        }
    }

    //获取控件的版本号，当老控件不存在版本时返回0
    return {
        IE_NEWEST_PLUGIN_VERSION: IE_NEWEST_PLUGIN_VERSION,//IE控件最新的版本号
        WEBKIT_NEWEST_PLUGIN_VERSION: WEBKIT_NEWEST_PLUGIN_VERSION,//webkit控件最新的版本号
        get_ie_plugin_version: ie_plugin_version,
        get_webkit_plugin_version: webkit_plugin_version,
        is_newest_version: is_newest_version,
        get_cur_upload_plugin_version: get_cur_upload_plugin_version
    };

});