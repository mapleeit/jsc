/**
 * H5分享页顶部广告banner
 * @author xixinhuang
 * @date 2015-11-10
 */

define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        cookie = lib.get('./cookie'),
        events = lib.get('./events'),
        user_log = common.get('./user_log'),
        urls = common.get('./urls'),
        user = common.get('./user'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),
        uin = cookie.get('uin'),

        boad_id = 2479,
        NEED_CNT = 5, //一次请求拉取几条广告

        undefined;

    var ad_link = {
        render: function() {
            //当访客没有登录态时，就采用分享者的uin来代替
            var me = this;

            //微信帐号不需要拉取qboss广告
            if(cookie.get('wx_login_ticket')) {
                return;
            }

            uin = parseInt(uin.replace(/^[oO0]*/, ''));
            var opt = {
                board_id: boad_id,
                need_cnt : NEED_CNT,
                uin: uin
            };

            var os = browser.android? 'android' : (browser.IOS? 'ios' : '');
            var qua, version = me.getAppVersion();
            if(browser.android && version && version > '3.6.6') {
                qua = cookie.get('qua');
            }
            if(qua && os) {
                opt.ext_env = 'qua|' + qua + ',' + 'os|' + os;
            } else if(os) {
                opt.ext_env = 'os|' + os;
            }

            this.load_ad(opt)
                .done(function(rspData) {
                    var ad;
                    if(rspData.data && rspData.data.count > 0 && rspData.data[boad_id] && (ad = rspData.data[boad_id].items) && ad.length > 0) {
                        me.init_ad_data(ad);
                        me.render_ad();
                        me._bind_events();
                    }
                });
        },

        render_ad: function() {
            this.sort_data();
            this._$ad = $(tmpl.ad_h5({
                list: this.list
            }));
            $('#frist .list').append(this._$ad);
        },

        //根据投放顺序进行排序
        sort_data: function() {
            this.list.sort(this.compare)
        },

        compare: function(item, next_item) {
            var bosstrace = item.bosstrace,
                next_bosstrace = next_item.bosstrace;
            if(bosstrace && next_bosstrace) {
                return bosstrace.localeCompare(next_bosstrace);
            }
            return true;
        },

        //保存广告数据
        init_ad_data: function(data) {
            var item,
                list = [],
                opt = {};
            for(var i=0; i<data.length; i++) {
                item = data[i];
                opt.bosstrace = item.bosstrace;
                opt.extdata = JSON.parse(item.extdata);
                opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
                opt.from = (browser.IOS || browser.android)? 3 : 2;  //from：  1 pc， 2 wap， 3 手机
                opt.uin = uin;
                this.reporter(opt);
                list.push(opt);
                opt = {};
            }
            if(this.list && $.isArray(this.list)) {
                this.list = this.list.concat(list);
            } else {
                this.list = list;
            }
        },

        _bind_events: function() {
            var me = this;
            this._$ad.on('click', function() {
                var id = $(this).attr('data-id');
                if(me.list[id]) {
                    me.list[id]['qboper'] = 2;
                    me.reporter(me.list[id]);

                    //对所有qboss广告，都同步一次weiyun登录态到qzone.qq.com
                    var s_url = encodeURIComponent(me.list[id].extdata['link']),
                        url = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=' + encodeURIComponent('http://weiyun.qzone.qq.com?from=1000&s_url=' + s_url);
                    window.open(url);
                }
            });
        },

        show_ad: function(){
            this._$ad && this._$ad.show();
        },

        hide_ad: function() {
            this._$ad && this._$ad.hide();
        },

        remove_ad: function() {
            this._$ad && this._$ad.remove();
        },

        reporter: function(data) {
            var report_url = urls.make_url(constants.HTTP_PROTOCOL + '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                from: data.from,
                uin: data.uin,
                bosstrace: data.bosstrace,
                qboper: data.qboper
            });
            //上报
            var img = new Image();
            img.id = 'item_' + data.bosstrace;
            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
            };
            img.src = report_url;
        },

        getAppVersion: function() {
            var REGEXP_APP_VERSION = /Android.*? Weiyun\/(\d\.\d\.\d)*/;
            var ua = navigator.userAgent,
                arr = ua.match(REGEXP_APP_VERSION);
            return (arr && arr.length>1)? arr[1] : '';
        },

        load_ad: function(opt) {
            var defer = $.Deferred();

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_multiple_strategy',
                data : opt,
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback" + (+new Date()),
                success: function(rep){
                    (rep && rep.code === 0) ? defer.resolve(rep) : defer.reject(rep);
                },
                error: function(rep){
                    defer.reject(rep);
                }
            });
            return defer;
        }
    }

    $.extend(ad_link, events);

    return ad_link;
});