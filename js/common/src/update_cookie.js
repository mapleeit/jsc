/**
 * PC内嵌页维持登录态
 * 分两种方案：1、常规方案：定时发出CGI请求维持本页面的登录态
 *             2、获取客户端的ckey，构造iframe获取skey，并更新其他页面
 * 为了保证方案2不要刷新太频繁
 * @author xixinhuang
 * @date 2016-03-15
 */

define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        global_function = require('./global.global_function'),
        global_event = require('./global.global_event'),
        query_user = require('./query_user'),
        mini_tip = require('./ui.mini_tip'),
        constants = require('./constants'),
        reportMD = require('./report_md'),
        ret_msgs = require('./ret_msgs'),
        request = require('./request'),
        Module = require('./module'),
        cookie = lib.get('./cookie'),

        heartbeat, // 心跳 timeout ID
        heartbeat_interval = 20 * 60 * 1000, // 心跳间隔时间
        last_update_time,  //记录获取ckey时间，防止死循环
        iframe,
        callback,
        undefined;

    var update_cookie = new Module('update_cookie', {
        // 维持心跳
        try_keep_login: function() {
            var me = this;
            clearTimeout(heartbeat);
            heartbeat = setTimeout(function() {
                me.keep_request().done(function(data) {
                    //mini_tip.warn('try_keep_login' + JSON.stringify(data));
                    //常规更新skey，上报模调统计
                    reportMD(277000034, 177000191);
                }).fail(function(msg, ret) {
                    //维持心跳期间出现登录态失效，也需要更新cookie
                    if(ret_msgs.is_sess_timeout(ret)) {
                        update_cookie.update(function() {
                            //mini_tip.warn(ret + ':' + msg + 'update cookie complete!');
                        });
                    }
                });
                me.try_keep_login();
            }, heartbeat_interval)
        },

        start: function () {
            if (this._ready)
                return;

            this.try_keep_login();

            this._ready = true;
        },

        keep_request: function() {
            var def = $.Deferred(),
                me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                cmd: 'DiskUserConfigGet',
                pb_v2: true
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
                //mini_tip.warn('拉取用户中转站信息失败');
                def.reject(msg, ret);
            });
            return def;
        },

        init: function() {
            this.start();
            this.bind_events();
        },

        reload: function() {
            var ckey = this.get_ckey(),
                uin = query_user.get_uin_num(),
                url = 'http://ptlogin2.weiyun.com/wyclient_jump?pt_clientver=5425&pt_src=1&keyindex=18&ptlang=2052&from=3031&clientuin=' + uin + '&clientkey=' + ckey;
            if(ckey && uin) {
                location.href = url;
            }
        },

        update: function(_callback) {
            callback = _callback;

            if(parseInt(cookie.get('wy_uf')) === 1) {
                this.refresh_wx_cookie(true);
                return;
            }

            var me = this,
                ckey = this.get_ckey(),
                tourl = 'http://www.weiyun.com/pc_inner.html',
                uin = query_user.get_uin_num();

            if(!ckey || !uin) {
                return;
            }

            document.domain = 'weiyun.com';
            var url = 'http://ptlogin2.weiyun.com/jump?keyindex=18&clientuin='+ uin + '&clientkey=' + ckey + '&u1=' + encodeURIComponent(tourl);

            iframe = document.createElement('iframe');
            iframe.src = url;
            $(iframe).appendTo(document.body);
            iframe.onload = function(){
                me._ready = true;
                me.start();
            };

            iframe.onerror = iframe.onabort = function(){
                //alert('onerror')
            };
        },

        get_ckey: function() {
            var now = +new Date();
            if(last_update_time && (now - last_update_time<1000)) {
                //防止skey获取不到的时候进入死循环
                return;
            }
            last_update_time = +new Date();

            if(window.external && window.external.GetCkey) {
                return window.external.GetCkey();
            }
            return '';
        },

        /**
         * 更新微信登录态
         * @param is_refresh 是否通知其他页面刷新登录态
         */
        refresh_wx_cookie: function(is_refresh) {
            var wxticket = this.get_wxticket();
            if(wxticket) {
                this.reset_cookies(JSON.parse(wxticket));
            }
            if(callback) {
                callback();
                callback = null;
            }

            if(is_refresh && window.external && window.external.RefreshSkey) {
                window.external.RefreshSkey(wxticket);
            }
        },

        get_wxticket: function() {
            var now = +new Date();
            if(last_update_time && (now - last_update_time<1000)) {
                //防止skey获取不到的时候进入死循环
                return;
            }
            last_update_time = +new Date();

            if(window.external && window.external.GetWXToken) {
                return window.external.GetWXToken();
            }
            return '';
        },

        bind_events: function() {
            var me = this;
            var onmessage = function(e) {
                var obj = me.get_cookies(e.data);
                me.reset_cookies(obj);
                if(callback) {
                    callback();
                    callback = null;
                }
                if(iframe) {
                    document.body.removeChild(iframe);
                    iframe = null;
                }
                if(window.external && window.external.RefreshSkey) {
                    window.external.RefreshSkey(e.data);
                }

                //获取ckey更新登录态，上报模调统计
                reportMD(277000034, 177000192);
            }
            if (typeof window.addEventListener != 'undefined') {
                window.addEventListener('message', onmessage, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.attachEvent('onmessage', onmessage);
            }

            var refresh_skey_by_client = function(cookie_from_client){
                if(parseInt(cookie.get('wy_uf')) === 1) {
                    me.refresh_wx_cookie(false);
                } else {
                    me.refresh_cookie(cookie_from_client);
                }
            };
            global_function.register('refresh_skey_by_client', refresh_skey_by_client);
        },

        refresh_cookie: function(cookie_from_client) {
            var obj = this.get_cookies(cookie_from_client);
            this.reset_cookies(obj);
        },

        reset_cookies: function(obj) {
            var opition = {
                raw: true,
                domain: constants.MAIN_DOMAIN,
                path: '/'
            };
            for(var key in obj) {
                cookie.set(key, obj[key], opition);
            }
        },

        get_cookies: function(cookie_str) {
            var key,
                res = {},
                cookies = cookie_str.split('; ');
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                key = parts.shift();
                res[key] = parts.join('');
            }

            return res;
        }
    });

    return update_cookie;
});
