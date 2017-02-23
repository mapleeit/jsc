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
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        uin = cookie.get('uin'),

        boad_id = 2426,

        undefined;

    var ad_link = {
        render: function() {
            //当访客没有登录态时，就采用分享者的uin来代替
            var share_info = store.get_share_info(),
                me = this;

            uin = parseInt(uin.replace(/^[oO0]*/, '')) || share_info['share_uin'];

            if(typeof uin == "string") {
                uin = parseInt(uin.slice(1));
            }

            var opt = {
                    board_id: boad_id,
                    uin: uin
                };

            this.load_ad(opt)
                .done(function(rspData) {
                var ad;
                if(rspData.data && rspData.data.count > 0 && rspData.data[boad_id] && (ad = rspData.data[boad_id].items) && ad.length > 0) {
                    if (ad[0] && ad[0].extdata) {
                        me.init_ad_data(ad[0]);
                        me.render_ad();
                        me.reporter();
                        me._bind_events();
                    }
                }
            });
        },

        render_ad: function() {
            var background_url = this.opt.extdata['img'];
            this._$ad = $(tmpl.ad_h5());
            this._$ad.css('background-image', 'url(' + background_url + ');');
            $('#banner').after(this._$ad);
        },

        //保存广告数据
        init_ad_data: function(data) {
            var opt = {};
            opt.bosstrace = data.bosstrace;
            opt.extdata = JSON.parse(data.extdata);
            opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
            opt.from = (browser.IOS || browser.android)? 3 : 2;  //from：  1 pc， 2 wap， 3 手机
            opt.uin = uin;

            this.opt = opt;
        },

        _bind_events: function() {
            var me = this,
                close_btn = this._$ad.find('[data-id=ad_close]');
            close_btn && close_btn.on('click', function(e) {
                e.stopPropagation();
                me.remove_ad();
                me.opt['qboper'] = 3;
                me.reporter();
            });
            this._$ad.on('click', function() {
                me.opt['qboper'] = 2;
                me.reporter();
                me.remove_ad();
                window.open(me.opt.extdata['link']);
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

        reporter: function() {
            var opt = this.opt;
            var report_url = urls.make_url(constants.HTTP_PROTOCOL + '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                from: opt.from,
                uin: opt.uin,
                bosstrace: opt.bosstrace,
                qboper: opt.qboper
            });
            //上报
            var img = new Image();

            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
            };
            img.src = report_url;
        },

        load_ad: function(opt) {
            var defer		= $.Deferred();

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_strategy',
                data :{
                    board_id: opt.board_id,
                    uin: opt.uin
                },
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback",
                success: function(rep){
                    (rep && rep.code === 0) ? defer.resolve(rep) : defer.reject(rep);
                },
                error: function(rep){
                    defer.reject(rep);
                }
            });

            return defer.promise();
        }
    }

    $.extend(ad_link, events);

    return ad_link;
});