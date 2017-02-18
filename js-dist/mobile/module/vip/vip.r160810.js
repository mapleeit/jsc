//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/vip/vip.r160810",["lib","common","$"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//vip/src/ad/ad.js
//vip/src/mgr.js
//vip/src/store.js
//vip/src/ui.js
//vip/src/vip.js
//vip/src/ad/ad.tmpl.html

//js file list:
//vip/src/ad/ad.js
//vip/src/mgr.js
//vip/src/store.js
//vip/src/ui.js
//vip/src/vip.js
/**
 * vip ad module
 * 广告模块是独立模块，自己控制data module和UI change
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define.pack("./ad.ad",["lib","common","$","./tmpl"],function(require, exports, module){
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
});/**
 * vip mgr module
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define.pack("./mgr",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
        
    var Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        user = common.get('./user'),
        pay_params = common.get('./configs.pay_params'),
        browser = common.get('./util.browser'),

        undefined;

    var mgr = new Mgr('mgr', {
        init: function (cfg) {
            var me = this;

            $.extend(this, cfg);
            me.observe(me.ui);
        },

        on_pay: function (month) {
            /**
             * 这里非常复杂，涉及六个端：
             * android_weixin
             * android_qq
             * ios_weixin
             * ios_qq
             * h5_weixin
             * h5_qq
             *
             * update:
             * 现在ios的两个都走的iap支付，不是h5这边负责了
             */
            location.href = pay_params.get_pay_url({
                n: month
            });
        }
    });

    return mgr;
});/**
 * vip store module
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define.pack("./store",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
        
    var Module = lib.get('./Module'),
    
        undefined;
        
    var store = new Module('store', {
        init: function (data) {
            var me = this;

            me.data = data;
        },


        //区分会员页还是等级页
        is_grow: function() {
            return this.data['type'] === 'grow';
        },

        get_level_info: function() {
            return this.data['vipLevelInfo'] || {};
        },

        get_score_list: function() {
            return this.data['growthScoreList'] || {};
        }
    });

    return store;
});/**
 * vip ui module
 * @author : maplemiao
 * @time : 2016/8/10
 **/

define.pack("./ui",["lib","common","$","./store"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        constants = common.get('./constants'),
        store = require('./store');
        
    var Module = lib.get('./Module'),

        undefined;
        
    var ui = new Module('ui', {
        render: function () {
            var me = this;
            if(store.is_grow()) {
                me.set_avatar_center();
            } else {
                me.show_growth();
            }
            me._bind_events();
        },

        //设置头像屏幕水平居中
        set_avatar_center: function() {
            var $dom = $('.level-now')[0],
                $avatar = $('.avatar-wrap')[0];
            if($dom && $avatar) {
                var windowWidth = $(window).width(),
                    offsetLeft = $dom.offsetLeft,
                    offsetWidth = $avatar.offsetWidth,
                    scrollLeft = Math.round(offsetLeft - (windowWidth/2 - offsetWidth) );

                $('.hd-wrap')[0].scrollLeft = scrollLeft;
            }
        },

        show_growth: function() {
            var width,
                left_width = 26;
            var line_width = $('.grow-line').width();
            var growthScoreList = store.get_score_list();
            var level_info = store.get_level_info();
            var level = level_info.level;
            if(level == 8) {
                $('.grow-line .inner').css('width', '100%');
            } else {
                width = Math.round((line_width-left_width*2) * (level_info.current_score - growthScoreList[level]) / growthScoreList[level + 1]) + 26;
                $('.grow-line .inner').css('width', width + 'px');
            }
        },

        _bind_events: function () {
            var me = this;
            $('.j-grow-btn').on('click', function () {
                location.href = constants.HTTP_PROTOCOL + '//h5.weiyun.com/vip?grow';
            });

            $('.j-pay-btn').on('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).addClass('touch');
            });

            $('.j-pay-btn').on('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).removeClass('touch');
                var month = $(this).attr('data-id');
                me.trigger('action', 'pay', month);
            });
        }
    });

    return ui;
});/**
 * H5会员页面
 * @author : maplemiao
 * @time : 2016/8/10
 **/
define.pack("./vip",["lib","common","$","./store","./ui","./ad.ad","./mgr"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
        
    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        user = common.get('./user'),
        store = require('./store'),
        ui = require('./ui'),
        ad = require('./ad.ad'),
        mgr = require('./mgr'),
    
        undefined;
        
    var vip = new Module('vip', {
        init: function (data) {
            store.init(data);
            ui.render();
            mgr.init({
                ui: ui,
                store: store
            });

            // 兼容微信账号登陆：微信账号登陆无uin，拉取不到qboss的广告数据，不加载广告模块
            if (!cookie.get('skey') && cookie.get('wx_login_ticket')) {
                return;
            } else {
                // 广告独立模块
                ad.init();
            }
        },

        iap_init: function () {
            var pay = (function() {
                var cfg = {
                    1: 'weiyun://arouse/1month',
                    3: 'weiyun://arouse/3month',
                    6: 'weiyun://arouse/6month',
                    12: 'weiyun://arouse/12month'
                };
                var schema_url = 'weiyun://arouse/1month';
                var _init = function() {
                    bind_events();
                };
                var bind_events = function() {
                    $('.j-iap-pay-btn').on('click', function() {
                        var month = $(this).attr('data-id');
                        schema_url = cfg[month] || 'weiyun://arouse/1month';
                        location.href = schema_url;
                    });
                    $('.j-grow-btn').on('click', function() {
                        location.href = location.protocol + '//h5.weiyun.com/vip?grow&ios';
                    });
                };
                return {
                    init: _init
                };
            })();
            pay.init();

            // 兼容微信账号登陆：微信账号登陆无uin，拉取不到qboss的广告数据，不加载广告模块
            if (!cookie.get('skey') && cookie.get('wx_login_ticket')) {

            } else {
                // 广告独立模块
                ad.init();
            }
        }
    });

    return vip;
});
//tmpl file list:
//vip/src/ad/ad.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'ad': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib');
        var text = lib.get('./text');
        var data = data || {};
        var list = data.list;
        var list_count = list.length;
    __p.push('    <ul class="banner-list clearfix j-pic-ul" style="width:');
_p(list_count);
__p.push('00%;">');

            for (var i = 0; i < list_count; i++) {
                var item = list[i];
                var ext_data = item && item.extdata;
        __p.push('            <li class="item">\r\n\
                <div class="pic" data-index="');
_p(i);
__p.push('" data-link="');
_p(text.text(ext_data && (ext_data.url || ext_data.link)));
__p.push('" style="background-image: url(');
_p(text.text(ext_data && (ext_data.picture1 || ext_data.img)).replace(/^http:|^https:/, ''));
__p.push(')"></div>\r\n\
            </li>');

            }
        __p.push('    </ul>');
 if (list_count > 1) {__p.push('    <ul class="circle-list j-circle-ul">');
 for (var i = 0; i < list_count; i++) { __p.push('            <li data-index="');
_p(i);
__p.push('" class="circle ');
_p(i == 0 ? 'act' : '');
__p.push('"></li>');
 } __p.push('    </ul>');
 } __p.push('');

return __p.join("");
}
};
return tmpl;
});
