define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        cookie = lib.get('./cookie'),
        urls = common.get('./urls'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        tmpl = require('./tmpl'),
        request = common.get('./request'),
        undefined;

    var BOARD_ID = 2559, // qboss
        NEED_CNT = 3;

    var ad_link = {

        render : function() {
            this._render_qboss_ad();
        },

        _render_qboss_ad: function() {
            var uin = query_user.get_uin_num();

            //微信帐号不需要拉取qboss广告或未登录的不展示qboss广告位
            if(cookie.get('wy_uf') == '1' || !uin) {
                return;
            }

            var opt = {
                board_id: BOARD_ID,
                need_cnt : NEED_CNT,
                uin: uin
            };
            var me = this;

            this.load_ad(opt)
                .done(function(rspData) {
                    var ad;
                    if(rspData.data && rspData.data.count > 0 && rspData.data[BOARD_ID] && (ad = rspData.data[BOARD_ID].items) && ad.length > 0) {
                        me.init_ad_data(ad);
                        me.render_ad();
                        me._bind_events();
                    }
                });
        },

        render_ad: function() {
            this.sort_data();
            this._$ad = $(tmpl.ad_qboss({
                list: this.list
            }));
            $('#ad_container').append(this._$ad);
            $('.banner-wrap').show();
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
                opt = {},
                uin = query_user.get_uin_num();

            for(var i=0; i<data.length; i++) {
                item = data[i];
                opt.bosstrace = item.bosstrace;
                opt.extdata = JSON.parse(item.extdata);
                opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
                opt.from = 1;  //from：  1 pc， 2 wap， 3 手机
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
            this._$ad.on('click', '[data-id]', function() {
                var id = $(this).attr('data-id');
                if(me.list[id]) {
                    me.list[id]['qboper'] = 2;
                    me.reporter(me.list[id]);
                    var s_url = encodeURIComponent(me.list[id].extdata['url'] || me.list[id].extdata['link']),
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
    };

    $.extend(ad_link, events);

    return ad_link;
});
