define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        logger = common.get('./util.logger'),
        router = lib.get('./router'),
        tmpl = require('./tmpl'),

        undefined;

    var mgr = new Mgr('sign.mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            mgr.observe(cfg.ui);
        },

        on_sign_in: function() {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            var REQUEST_CGI = 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
                me = this;

            request.xhr_get({
                url: REQUEST_CGI,
                cmd: "WeiyunDailySignIn",
                cavil: true,
                pb_v2: true,
                body: {}
            }).ok(function (msg, body) {
                me.store.update_info(body);
                logger.write(['xhr_get success ---> WeiyunDailySignIn '], 'h5_session_timeout', 0);
            }).fail(function (msg, ret) {
                logger.write(['ajax error ---> WeiyunDailySignIn '], 'h5_session_timeout', ret);
                if(ret === -2021) {
                    return;
                } else {
                    me.show_tips(msg, ret);
                }
            }).done(function() {
                me.isloading = false;
            });
        },

        on_confirm: function(good_id) {
            if(good_id == '1') {
                this.exchange_wyvip(good_id);
            } else {
                this.do_exchange(good_id);
            }
        },

        on_edit: function() {
            var addr = this.store.get_addr();
            this.ui.render_addr(addr);
        },

        //qzone活动平台上，不能删除地址，因为重置数据为0，代表地址数据已清空
        on_delete: function() {
            var _data = {
                login_type: 3,
                actid: 360,
                addr: '0',
                city: '0',
                id_number: '',
                mail: '',
                name: '0',
                phone: '0',
                post: '0',
                province: '0'
            };
            this.save_address(_data);
        },

        on_create: function() {
            this.ui.render_addr({});
        },

        on_exchange: function(good_id) {
            var good = this.store.get_good_by_id(good_id) || {},
                me = this;

            this.get_address().done(function(addr) {
                me.store.set_addr(addr);
                me.ui.check_order(good, addr);
            });
        },

        do_exchange: function(good_id) {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = 'http://h5.weiyun.com/p/activity/fcg-bin/fcg_open_qzact_exchange_weiyun?login_type=3&actid=360&ruleid=' + good_id + '&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if(result.code === 0) {
                        me.do_refresh();
                        me.ui.update_dianping(good_id);
                        logger.write(['ajax success ---> fcg_open_qzact_exchange_weiyun '], 'h5_session_timeout', 0);
                    } else {
                        me.isloading = false;
                        var info = me.store.get_info();
                        me.ui.show_result(info, false);
                        me.show_tips(result.message, result.code);
                        logger.write(['ajax error ---> fcg_open_qzact_exchange_weiyun '], 'h5_session_timeout', result.code);
                    }
                }
            });
        },

        do_refresh: function(){
            var REQUEST_CGI = 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
                me = this;

            request.xhr_get({
                url: REQUEST_CGI,
                cmd: "WeiyunCheckSignIn",
                cavil: true,
                pb_v2: true,
                body: {}
            }).ok(function (msg, body) {
                me.store.set_total_point(body.total_point);
                logger.write(['xhr_get success ---> WeiyunCheckSignIn '], 'h5_session_timeout', 0);
            }).fail(function (msg, ret) {
                me.show_tips(msg, ret);
                logger.write(['xhr_get error ---> WeiyunCheckSignIn '], 'h5_session_timeout', ret);
            }).done(function() {
                me.isloading = false;
            });
        },

        exchange_wyvip: function(good_id) {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            good_id = parseInt(good_id);
            var REQUEST_CGI = 'http://web2.cgi.weiyun.com/weiyun_activity.fcg',
                me = this;

            request.xhr_get({
                url: REQUEST_CGI,
                cmd: "WeiyunActRedeemGoods",
                cavil: true,
                pb_v2: true,
                body: { goods_id: good_id}
            }).ok(function (msg, body) {
                me.store.set_total_point(body.total_point);
                logger.write(['xhr_get success ---> WeiyunActRedeemGoods '], 'h5_session_timeout', 0);
            }).fail(function (msg, ret) {
                var info = me.store.get_info();
                me.ui.show_result(info, false);
                me.show_tips(msg, ret);
                logger.write(['xhr_get error ---> WeiyunActRedeemGoods '], 'h5_session_timeout', ret);
            }).done(function() {
                me.isloading = false;
            });
        },

        on_get_records: function() {
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = 'http://h5.weiyun.com/p/activity/fcg-bin/fcg_open_qzact_record?login_type=3&actid=360&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    if(result.code === 0) {
                        me.ui.show_records(result.data);
                        logger.write(['ajax success ---> fcg_open_qzact_record '], 'h5_session_timeout', 0);
                    } else {
                        me.show_tips(result.message, result.code);
                        logger.write(['ajax error ---> fcg_open_qzact_record '], 'h5_session_timeout', result.code);
                    }
                }
            });
        },

        on_retry: function() {
            this.ui.retry();
        },

        _get_gtk: function() {
            var hash = 5381,
                skey = cookie.get('skey');
            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },

        _get_wxtk: function() {
            var hash = 5381,
                skey = cookie.get('wx_login_ticket');
            for(var i=0,len=skey.length;i<len;++i)
            {
                hash += (hash<<5) + skey.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },

        get_address: function() {
            if(this.isloading){
                return;
            }
            var defer = $.Deferred();
            this.isloading = true;
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = 'http://h5.weiyun.com/p/activity/fcg-bin/fcg_open_qzact_get_addr?login_type=3&actid=360&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if(result.code === 0) {
                        logger.write(['ajax success ---> fcg_open_qzact_record '], 'h5_session_timeout', 0);
                        defer.resolve(result.data);
                    } else {
                        logger.write(['ajax error ---> fcg_open_qzact_record '], 'h5_session_timeout', result.code);
                        defer.reject();
                    }
                }
            });
            return defer;
        },

        save_address: function(data) {
            if(this.isloading){
                return;
            }
            this.isloading = true;
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = 'http://h5.weiyun.com/p/activity/fcg-bin/fcg_open_qzact_set_addr?g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                type: 'POST',
                url : _url,
                data: data,
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if(result.code === 0) {
                        me.ui.show_addr(data);
                        logger.write(['ajax success ---> fcg_open_qzact_record '], 'h5_session_timeout', 0);
                    } else {
                        me.show_tips(result.message, result.code);
                        logger.write(['ajax error ---> fcg_open_qzact_record '], 'h5_session_timeout', result.code);
                    }

                }
            });
        },

        on_save_address: function(data) {
            this.save_address(data);
        },

        show_tips: function(msg, ret) {
            var tips_text = '兑换失败';
            if(ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065) {
                window.location.href = "http://ui.ptlogin2.weiyun.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&s_url="+encodeURIComponent(location.href)+"&style=9&hln_css=http://w5.qq.com/img/logo.png";
                return;
            } else if(msg) {
                tips_text = msg;
            } else {
                tips_text = '系统繁忙，请稍后再试';
            }
            this.ui._err_msg(tips_text);
        }
    });

    return mgr;
});