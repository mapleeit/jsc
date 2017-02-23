/**
 * vip ad module
 * 广告模块是独立模块，自己控制data module和UI change
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        urls = common.get('./urls'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),
        logger = common.get('./util.logger'),
        tmpl = require('./tmpl');

    var uin = parseInt(cookie.get('uin').replace(/^[oO0]*/, ''));
    var BOARD_ID = 2513, // qboss
        NEED_CNT = 3;

    var ad = new Module('ad', {
        init: function () {
            var me = this;

            // dom
            me._$ad_container = $('.j-ad-container');

            // status
            me._is_sliding = false; // 是否在轮播
            me._sliding_interval_id = null;
            me._sliding_interval_time = 5000; // 轮播周期
            me._current_slide_index = 1;
            me._screen_width = document.body.clientWidth;
            me._valid_slide_ratio = 0.2;

            me._opt = {
                board_id : BOARD_ID,
                need_cnt: NEED_CNT,
                uin: uin,
                ext_env: me._get_ext_env()
            };
            me.load();
        },

        load: function () {
            var me = this;

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_multiple_strategy',
                data: me._opt,
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback"  + (+new Date()),
                success: function(res){
                    me.on_success(res);
                },
                error: function(res){
                    me.on_fail(res);
                }
            });
        },

        on_success: function (res) {
            var me = this;

            if (res && res.code === 0) { // success
                var ad;
                if(res.data && res.data.count > 0 && res.data[me._opt.board_id] && (ad = res.data[me._opt.board_id].items) && ad.length > 0) {
                    me.init_ad_data(ad);
                    me.render_ad();
                    me._bind_events();
                } else { // 广告为空
                    me._hide_ad_container();
                }
            } else {
                me.on_fail(res);
            }
        },

        on_fail: function (res) {
            var me = this;

            me._hide_ad_container();

            logger.write([
                'ad error   --------> qboss ad',
                'ad error   --------> msg: ' + res.message,
                'ad error   --------> code: ' + res.code,
                'ad error   --------> subcode:' + res.subcode,
                'ad error   --------> time: ' + new Date()
            ], 'wy_h5_vip_qboss', res.code);
        },

        //保存广告数据
        init_ad_data: function(data) {
            var me = this;

            var item,
                list = [];
            for(var i = 0; i < data.length; i++) {
                var opt = {};

                item = data[i];
                opt.bosstrace = item.bosstrace;
                opt.extdata = JSON.parse(item.extdata);
                opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭，但本页用不到关闭
                opt.from = (browser.IOS || browser.android)? 3 : 2;  //from：  1 pc， 2 wap， 3 手机
                opt.uin = me._opt.uin;
                list.push(opt);

                me.reporter(opt); // 初始化时每一个广告上报曝光
            }
            if(me.list && $.isArray(me.list)) {
                me.list = me.list.concat(list);
            } else {
                me.list = list;
            }
        },

        render_ad: function() {
            var me = this;

            // add DOM
            me._$ad = $(tmpl.ad({ // 并不是真的DOM节点
                list: me.list
            }));
            me._$ad_container.append(this._$ad).show();

            // sliding animation
            if (me.list.length > 1) {
                me._stop_sliding_interval();
                me._start_sliding_interval();
            }
        },

        _bind_events: function () {
            var me = this;

            var screenXStart,
                screenXEnd;

            if (me._$ad_container) {
                me._$ad_container
                    .on('touchstart', function (e) {
                        var targetTouches = e.targetTouches;

                        me._stop_sliding_interval();

                        screenXStart = targetTouches[0].screenX; // 只记录一个手指的位置变化即可
                    })
                    .on('touchend', function (e) {
                        var changedTouches = e.changedTouches;

                        screenXEnd = changedTouches[0].screenX;
                        var moveX = screenXEnd - screenXStart;

                        if (moveX > (me._screen_width * me._valid_slide_ratio)) {
                            me._current_slide_index ++;
                            me._update_slide();
                        } else if (moveX < -(me._screen_width * me._valid_slide_ratio)) {
                            me._current_slide_index --;
                            me._update_slide();
                        }

                        me._start_sliding_interval();
                    })
                    .on('click', function (e) {
                        var $current_ad = $(this).find("[data-index='"+ (me._current_slide_index - 1) +"']");
                        var opt = {};
                        $.extend(opt, me.list[me._current_slide_index - 1]);

                        opt.qboper = 2; // 设置上报字段为点击
                        me.reporter(opt);

                        //对所有qboss广告，都同步一次weiyun登录态到qzone.qq.com
                        var s_url = $current_ad.attr('data-link'),
                            url = constants.HTTP_PROTOCOL + '//ptlogin2.weiyun.com/ho_cross_domain?&tourl=' + encodeURIComponent(constants.HTTP_PROTOCOL + '//weiyun.qzone.qq.com?from=1000&s_url=' + s_url);
                        window.open(url);
                    })
            }
        },

        // 上报
        reporter: function (data) {
            var report_url = urls.make_url(constants.HTTP_PROTOCOL + '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                from: data.from,
                uin: data.uin,
                bosstrace: data.bosstrace,
                qboper: data.qboper
            });
            // 用img发请求
            var img = new Image();

            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
            };
            img.src = report_url;
        },

        _start_sliding_interval: function () {
            var me = this;

            me._sliding_interval_id = setInterval(function () {
                me._current_slide_index ++;
                me._update_slide();
            }, me._sliding_interval_time);
        },

        _update_slide: function () {
            var me = this;

            me._current_slide_index = (me._current_slide_index % me.list.length) ? (me._current_slide_index % me.list.length) : me.list.length;
            var left = (-(me._current_slide_index - 1) * 100 + '%');
            me._$ad_container.find('.j-pic-ul').css('left', left);
            me._update_circle_status();
        },

        _stop_sliding_interval: function () {
            var me = this;

            if (me._sliding_interval_id) {
                clearInterval(me._sliding_interval_id);
            }
        },

        _get_app_version: function() {
            var REGEXP_APP_VERSION = /Android.*? Weiyun\/(\d\.\d\.\d)*/;
            var ua = navigator.userAgent,
                arr = ua.match(REGEXP_APP_VERSION);
            return (arr && arr.length>1)? arr[1] : '';
        },

        _get_ext_env: function () {
            var me = this;
            var os = browser.android ? 'android' : (browser.IOS? 'ios' : '');
            var qua, version = me._get_app_version();
            if(browser.android && version && version > '3.6.6') {
                qua = cookie.get('qua');
            }
            if(qua && os) {
                return ('qua|' + qua + ',' + 'os|' + os);
            } else if(os) {
                return ('os|' + os);
            }
        },

        // 更新轮播图下方的导航按钮
        _update_circle_status: function () {
            var me = this;

            if (me._$ad_container) {
                me._$ad_container.find('.j-circle-ul li').removeClass('act');
                me._$ad_container.find('.j-circle-ul [data-index="' + (me._current_slide_index - 1) +'"]').addClass('act');
            }
        },

        _hide_ad_container: function () {
            var me = this;

            me._$ad_container && me._$ad_container.hide();
        }
    });

    return ad;
});