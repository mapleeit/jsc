/**
 * 微云app的schema配置
 * @author xixinhuang
 * @date 2015-12-24
 */
define(function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        store   = require('./store'),

        undefined;

    var app_cfg = new Module('outlink.app_cfg', {
        config_data: null,

        default_app_cfg: {
            android: {
                published: true,
                packageName:"com.qq.qcloud",
                packageUrl: "weiyunweb://android",
                scheme: "weiyunweb",
                url: window.location.protocol + "//www.weiyun.com"	//这个是302到跳转页，不是直接到apk
            },
            ios: {
                published: true,
                packageName: "com.tencent.weiyun",
                packageUrl: "weiyunaction://ios",
                scheme: "weiyun",
                url: window.location.protocol + "//www.weiyun.com"
            },
            appid: 'wx786ab81fe758bec2'
        },

        //这里给IOS使用，浏览器中检测手机是否安装了微云app。后续可能删除
        get_ios_schema: function(file) {
            var share_info = store.get_share_info(),
                share_key = share_info['share_key'],
                pdir_key =  file.get_pdir_key(),
                uin = share_info['share_uin'],
                file_id = file.get_id(),
                file_name = file.get_name(),
                file_size = file.get_size(),
                time = file.get_duration() || 0,
                thumb_url = file.get_video_thumb(1024);
            if(thumb_url) {
                thumb_url = thumb_url.slice(0, thumb_url.length-5);
            }

            var schema_url = 'weiyunaction://outlink_video/?share_key=' + share_key +'&pdir_key=' + pdir_key +'&file_owner=' + uin + '&file_id=' + file_id
                + '&file_name=' + encodeURIComponent(file_name) + '&file_size=' + file_size +'&duration=' + time +'&thumb_url=' + thumb_url;

            return schema_url;
        },

        get_config_data: function(callback) {
            var me = this;
            if(this.config_data) {
                callback(this.get_download_url());
                return;
            }
            require.async(constants.HTTP_PROTOCOL + '//imgcache.qq.com/qzone/qzactStatics/configSystem/data/65/config1.js', function(config_data) {
                if(!config_data) {
                    return;
                }
                me.config_data = config_data;
                callback(me.get_download_url());
            });
        },

        get_download_url: function() {
            var data = this.config_data;
            if(browser.IPAD) {
                return data.ipad['download_url'];
            } else if(browser.IOS){
                return data.iphone['download_url'];
            } else if(browser.android){
                return data.android['download_url'];
            }
        },

        //只针对IOS：注册一个新的schema来判断app的版本号，目前可以界定的版本是3.7
        get_version_cfg: function() {
            var version_cfg = this.default_app_cfg;
	        if(!browser.QQ) {
		        version_cfg.ios['packageUrl'] = 'weiyunsharedir://ios';
		        version_cfg.ios['scheme'] = 'weiyunsharedir';
	        }
            return version_cfg;
        },

        start_local_server: function() {
            //location.href = 'weiyun://action/start_local_server';

            var me = this;
            setTimeout(function() {
                window.onerror = function(event) {
                    alert('error' + event);
                }
                //$.ajax({
                //    type: 'GET',
                //    url: 'localhost:8080?method=get_version',
                //    success: function(result) {
                //       alert(JSON.stringify(result));
                //    },
                //    error: function(result) {
                //        alert(JSON.stringify(result));
                //    }
                //});
                var android_conn = new WebSocket('ws://localhost:5656');

                android_conn.onmessage = function(event) {
                    alert(event.data);
                }
                android_conn.onopen = function(event) {
                    android_conn.send({'method': 'get_version'});
                    android_conn.close();
                }
                android_conn.onclose = function(event) {
                    //alert(event.data);
                    alert('onclose')
                }
                android_conn.onerror = function(event) {
                    //alert(event.data);
                    alert('onerror')
                }
            }, 1000);
        },

        set_visibility: function(is_hidden) {
            this.is_visibility = !is_hidden;
            this.time = +new Date();
            var me = this;

            setTimeout(function() {
                me.is_visibility = true;
                me.time = 0;
            }, 5000);
        },
        /*
        * 判断页面可见性，需满足条件：1）设置过is_visibility; 2）时间在500ms内; 3) is_visibility属性为false，即不可见
        * */
        get_visibility: function() {
            var now = +new Date();
            if(this.time && (now - this.time < 500) && !this.is_visibility) {
                this.is_visibility = true;
                this.time = 0;
                return false;
            } else {
                return true;
            }
        },

        get_app_cfg: function(file){
            this.default_app_cfg.ios['packageUrl'] = this.get_ios_schema(file);
            //this.default_app_cfg.ios['packageUrl'] = 'weiyunaction://ios';
            //this.default_app_cfg.ios['scheme'] = 'weiyun';
            return this.default_app_cfg;
        }
    });

    return app_cfg;

});