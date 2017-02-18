//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/signin/signin.r160510",["lib","common","$"],function(require,exports,module){

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
//signin/src/Record.js
//signin/src/ad_link.js
//signin/src/mgr.js
//signin/src/picker/MobileSelectArea.js
//signin/src/picker/city_data.js
//signin/src/picker/dialog.js
//signin/src/signin.js
//signin/src/store.js
//signin/src/ui.js
//signin/src/view.tmpl.html

//js file list:
//signin/src/Record.js
//signin/src/ad_link.js
//signin/src/mgr.js
//signin/src/picker/MobileSelectArea.js
//signin/src/picker/city_data.js
//signin/src/picker/dialog.js
//signin/src/signin.js
//signin/src/store.js
//signin/src/ui.js
/**
 * 仿ExtJs中的Ext.data.Record，以便数据与视图的分离
 * @author xixinhuang
 * @date 16-03-29
 */
define.pack("./Record",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        events = lib.get('./events'),

        undefined;

    var id_seed = 0;
    var Record = function(data, id){
        this.data = data || {};
        // 生成唯一ID
        this.id = id || 'wy-record-'+(++id_seed);
    };
    Record.prototype = {
        /**
         * 更新属性，如果它有关联store，会触发store的update事件，也可以当作batch_set的别名使用（只会产生一次事件）：
         * Record.set('a', 1);
         * Record.set({a:1,b:2});
         * @param {String} name
         * @param {Mixed} value
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        set : function(name, value, prevent_events){
            if(name && typeof name === 'object'){
                return this.batch_set(name, prevent_events);
            }
            var data = this.data,
                old = data[name], olds;
            if(old !== value){
                data[name] = value;
                if(prevent_events !== true){
                    olds = {};
                    olds[name] = old;
                    this.notify_update(olds);
                }
            }
        },
        /**
         * 以数据对象形式批量更新属性，注意无视原型中的值
         * @param {Object} values
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        batch_set : function(values, prevent_events){
            var name, value, old,
                olds = {},
                modified = false,
                data = this.data;
            for(name in values){
                if(values.hasOwnProperty(name)){
                    value = values[name];
                    old = data[name];
                    if(old !== value){
                        data[name] = value;
                        olds[name] = old;
                        modified = true;
                    }
                }
            }
            if(prevent_events !== true && modified){
                this.notify_update(olds);
            }
        },
        /**
         * 获取属性值
         * @param {String} name
         * @return {Mixed} value
         */
        get : function(name){
            return this.data[name];
        },
        /**
         * 通知关联的store值有更新
         * @private
         */
        notify_update : function(olds){
            if (this.store && typeof this.store.update === "function") {
                this.store.update(this, olds);
            }
        },

        get_id: function () {
            return this.id;
        },

        get_name: function() {
            return this.get('name');
        },

        get_start_time: function() {
            return this.get('starttm');
        },

        get_end_time: function() {
            return this.get('endtm');
        },

        get_budget: function () {
            return this.get('budget').budget;
        },

        get_left: function() {
            return this.get('budget').left;
        },

        get_used: function() {
            return this.get('budget').used;
        },

        get_type: function() {
            return this.get('type');
        },

        get_prizeid: function() {
            return this.get('prizeid');
        },

        get_refer: function() {
            return this.get('refer');
        },

        get_score: function() {
            return this.get('score');
        }
    };

    $.extend(Record.prototype, events);

    return Record;
});/**
 * H5分享页顶部广告banner
 * @author xixinhuang
 * @date 2015-11-10
 */

define.pack("./ad_link",["lib","common","$","./tmpl"],function(require, exports, module) {

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
});define.pack("./mgr",["lib","common","./tmpl"],function(require, exports, module) {
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
});define.pack("./picker.MobileSelectArea",["$","./picker.dialog"],function(require, exports, module) {
    var $ = require('$');
    var Dialog = require("./picker.dialog");

    var MobileSelectArea = function() {
        var rnd = Math.random().toString().replace('.', '');
        this.id = 'scroller_' + rnd;
        this.scroller;
        this.data;
        this.index = 0;
        this.value = [0, 0, 0];
        this.oldvalue;
        this.oldtext=[];
        this.text = ['', '', ''];
        this.level = 3;
        this.mtop = 30;
        this.separator = ' ';
    };
    MobileSelectArea.prototype = {
        init: function(settings) {
            this.settings = $.extend({
                eventName: 'click'
            }, settings);
            this.trigger = $(this.settings.trigger);
            this.settings.default == undefined ? this.default = 1 : this.default = 0; //0为空,1时默认选中第一项
            level = parseInt(this.settings.level);
            this.level = level > 0 ? level : 3;
            this.trigger.attr("readonly", "readonly");
            this.value = (this.settings.value && this.settings.value.split(",")) || [0, 0, 0];
            this.text = this.settings.text || this.trigger.val().split(' ') || ['', '', ''];
            this.oldvalue = this.value.concat([]);
            this.oldtext = this.text.concat([]);
            this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
            // this.promise = this.getData();
            this.bindEvent();
        },
        getData: function() {
            var _this = this;
            var dtd = $.Deferred();
            if (typeof this.settings.data == "object") {
                this.data = this.settings.data;
                dtd.resolve();
            } else {
                $.ajax({
                    dataType: 'json',
                    cache: true,
                    url: this.settings.data,
                    type: 'GET',
                    success: function(result) {
                        _this.data = result.data;
                        dtd.resolve();
                    },
                    accepts: {
                        json: "application/json, text/javascript, */*; q=0.01"
                    }
                });
            }
            return dtd;
        },
        bindEvent: function() {
            var _this = this;
            this.trigger[_this.settings.eventName](function(e) {
                var dlgContent = '';
                for (var i = 0; i < _this.level; i++) {
                    dlgContent += '<div></div>';
                };
                $.confirm('<div class="ui-scroller-mask"><div id="' + _this.id + '" class="ui-scroller">' + dlgContent + '<p></p></div></div>', null, function(t, c) {
                    if (t == "yes") {
                        _this.submit()
                    }
                    if (t == 'no') {
                        _this.cancel();
                    }
                    this.dispose();
                }, {
                    width: 320
                });
                _this.scroller = $('#' + _this.id);
                _this.getData().done(function() {
                    _this.format();
                });
                var start = 0,
                    end = 0
                _this.scroller.children().bind('touchstart', function(e) {
                    start = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                });
                _this.scroller.children().bind('touchmove', function(e) {
                    end = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                    var diff = end - start;
                    var dl = $(e.target).parent();
                    if (dl[0].nodeName != "DL") {
                        return;
                    }
                    var top = parseInt(dl.css('top') || 0) + diff;
                    dl.css('top', top);
                    start = end;
                    return false;
                });
                _this.scroller.children().bind('touchend', function(e) {
                    end = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                    var diff = end - start;
                    var dl = $(e.target).parent();
                    if (dl[0].nodeName != "DL") {
                        return;
                    }
                    var i = $(dl.parent()).index();
                    var top = parseInt(dl.css('top') || 0) + diff;
                    if (top > _this.mtop) {
                        top = _this.mtop;
                    }
                    if (top < -$(dl).height() + 60) {
                        top = -$(dl).height() + 60;
                    }
                    var mod = top / _this.mtop;
                    var mode = Math.round(mod);
                    var index = Math.abs(mode) + 1;
                    if (mode == 1) {
                        index = 0;
                    }
                    _this.value[i] = $(dl.children().get(index)).attr('ref');
                    _this.value[i] == 0 ? _this.text[i] = "" : _this.text[i] = $(dl.children().get(index)).html();
                    for (var j = _this.level - 1; j > i; j--) {
                        _this.value[j] = 0;
                        _this.text[j] = "";
                    }
                    if (!$(dl.children().get(index)).hasClass('focus')) {
                        _this.format();
                    }
                    $(dl.children().get(index)).addClass('focus').siblings().removeClass('focus');
                    dl.css('top', mode * _this.mtop);
                    return false;
                });
                return false;
            });
        },
        format: function() {
            var _this = this;
            var child = _this.scroller.children();
            this.f(this.data);
            console.log(_this.text)
        },
        f: function(data) {
            var _this = this;
            var item = data;
            if (!item) {
                item = [];
            };
            var str = '<dl><dd ref="0">——</dd>';
            var focus = 0,
                childData, top = _this.mtop;
            if (_this.index !== 0 && _this.value[_this.index - 1] == "0" && this.default == 0) {
                str = '<dl><dd ref="0" class="focus">——</dd>';
                _this.value[_this.index] = 0;
                _this.text[_this.index] = "";
                focus = 0;
            } else {
                if (_this.value[_this.index] == "0") {
                    str = '<dl><dd ref="0" class="focus">——</dd>';
                    focus = 0;
                }
                if (item.length > 0 && this.default == 1) {
                    str = '<dl>';
                    var pid = item[0].pid || 0;
                    var id = item[0].id || 0;
                    focus = item[0].id;
                    childData = item[0].child;
                    if (!_this.value[this.index]) {
                        _this.value[this.index] = id;
                        _this.text[this.index] = item[0].name;
                    }
                    str += '<dd pid="' + pid + '" class="' + cls + '" ref="' + id + '">' + item[0].name + '</dd>';
                }
                for (var j = _this.default, len = item.length; j < len; j++) {
                    var pid = item[j].pid || 0;
                    var id = item[j].id || 0;
                    var cls = '';
                    if (_this.value[_this.index] == id) {
                        cls = "focus";
                        focus = id;
                        childData = item[j].child;
                        top = _this.mtop * (-(j - _this.default));
                    };
                    str += '<dd pid="' + pid + '" class="' + cls + '" ref="' + id + '">' + item[j].name + '</dd>';
                }
            }
            str += "</dl>";
            var newdom = $(str);
            newdom.css('top', top);
            var child = _this.scroller.children();
            $(child[_this.index]).html(newdom);
            _this.index++;
            if (_this.index > _this.level - 1) {
                _this.index = 0;
                return;
            }
            _this.f(childData);
        },
        submit: function() {
            this.oldvalue = this.value.concat([]);
            this.oldtext = this.text.concat([]);
            if (this.trigger[0].nodeType == 1) {
                this.trigger.val(this.text.join(this.separator));
                this.trigger.attr('data-value', this.value.join(','));
            }
            if(this.value.join('') === '11') {
                this.trigger.val('北京 北京市');
            }
            this.trigger.next('input').val(this.value.join(','));
            this.settings.callback && this.settings.callback.call(this, this.scroller, this.text, this.value);
        },
        cancel: function() {
            this.value = this.oldvalue.concat([]);
            this.text = this.oldtext.concat([]);
        }
    };
    return MobileSelectArea;
});define.pack("./picker.city_data",["$"],function(require, exports, module) {
    var $ = require('$'),

        undefined;

    var city_data = {
        "data": [
            {
                "id": 1,
                "name": "北京",
                "child": [
                    {
                        "id": 1,
                        "name": "北京市"
                    }
                ]
            },
            {
                "id": 1874,
                "name": "辽宁",
                "child": [
                    {
                        "id": 1875,
                        "name": "沈阳市"
                    },
                    {
                        "id": 1974,
                        "name": "铁岭市"
                    },
                    {
                        "id": 1969,
                        "name": "盘锦市"
                    },
                    {
                        "id": 1961,
                        "name": "辽阳市"
                    },
                    {
                        "id": 1953,
                        "name": "锦州市"
                    },
                    {
                        "id": 1946,
                        "name": "葫芦岛市"
                    },
                    {
                        "id": 1938,
                        "name": "阜新市"
                    },
                    {
                        "id": 1930,
                        "name": "抚顺市"
                    },
                    {
                        "id": 1923,
                        "name": "丹东市"
                    },
                    {
                        "id": 1912,
                        "name": "大连市"
                    },
                    {
                        "id": 1904,
                        "name": "朝阳市"
                    },
                    {
                        "id": 1897,
                        "name": "本溪市"
                    },
                    {
                        "id": 1889,
                        "name": "鞍山市"
                    },
                    {
                        "id": 1982,
                        "name": "营口市"
                    }
                ]
            },
            {
                "id": 1989,
                "name": "内蒙古",
                "child": [
                    {
                        "id": 1990,
                        "name": "呼和浩特市"
                    },
                    {
                        "id": 2083,
                        "name": "锡林郭勒盟"
                    },
                    {
                        "id": 2071,
                        "name": "乌兰察布市"
                    },
                    {
                        "id": 2067,
                        "name": "乌海市"
                    },
                    {
                        "id": 2058,
                        "name": "通辽市"
                    },
                    {
                        "id": 2044,
                        "name": "呼伦贝尔市"
                    },
                    {
                        "id": 2035,
                        "name": "鄂尔多斯市"
                    },
                    {
                        "id": 2022,
                        "name": "赤峰市"
                    },
                    {
                        "id": 2012,
                        "name": "包头市"
                    },
                    {
                        "id": 2004,
                        "name": "巴彦淖尔市"
                    },
                    {
                        "id": 2000,
                        "name": "阿拉善盟"
                    },
                    {
                        "id": 2096,
                        "name": "兴安盟"
                    }
                ]
            },
            {
                "id": 2103,
                "name": "宁夏",
                "child": [
                    {
                        "id": 2104,
                        "name": "银川市"
                    },
                    {
                        "id": 2111,
                        "name": "固原市"
                    },
                    {
                        "id": 2117,
                        "name": "石嘴山市"
                    },
                    {
                        "id": 2121,
                        "name": "吴忠市"
                    },
                    {
                        "id": 2126,
                        "name": "中卫市"
                    }
                ]
            },
            {
                "id": 2130,
                "name": "青海",
                "child": [
                    {
                        "id": 2131,
                        "name": "西宁市"
                    },
                    {
                        "id": 2139,
                        "name": "果洛藏族自治州"
                    },
                    {
                        "id": 2146,
                        "name": "海北藏族自治州"
                    },
                    {
                        "id": 2151,
                        "name": "海东地区"
                    },
                    {
                        "id": 2158,
                        "name": "海南藏族自治州"
                    },
                    {
                        "id": 2164,
                        "name": "海西蒙古族藏族自治州"
                    },
                    {
                        "id": 2170,
                        "name": "黄南藏族自治州"
                    },
                    {
                        "id": 2175,
                        "name": "玉树藏族自治州"
                    }
                ]
            },
            {
                "id": 2182,
                "name": "山东",
                "child": [
                    {
                        "id": 2183,
                        "name": "济南市"
                    },
                    {
                        "id": 2324,
                        "name": "枣庄市"
                    },
                    {
                        "id": 2311,
                        "name": "烟台市"
                    },
                    {
                        "id": 2298,
                        "name": "潍坊市"
                    },
                    {
                        "id": 2293,
                        "name": "威海市"
                    },
                    {
                        "id": 2286,
                        "name": "泰安市"
                    },
                    {
                        "id": 2281,
                        "name": "日照市"
                    },
                    {
                        "id": 2268,
                        "name": "青岛市"
                    },
                    {
                        "id": 2255,
                        "name": "临沂市"
                    },
                    {
                        "id": 2246,
                        "name": "聊城市"
                    },
                    {
                        "id": 2243,
                        "name": "莱芜市"
                    },
                    {
                        "id": 2230,
                        "name": "济宁市"
                    },
                    {
                        "id": 2220,
                        "name": "菏泽市"
                    },
                    {
                        "id": 2214,
                        "name": "东营市"
                    },
                    {
                        "id": 2202,
                        "name": "德州市"
                    },
                    {
                        "id": 2194,
                        "name": "滨州市"
                    },
                    {
                        "id": 2331,
                        "name": "淄博市"
                    }
                ]
            },
            {
                "id": 2340,
                "name": "山西",
                "child": [
                    {
                        "id": 2341,
                        "name": "太原市"
                    },
                    {
                        "id": 2451,
                        "name": "阳泉市"
                    },
                    {
                        "id": 2436,
                        "name": "忻州市"
                    },
                    {
                        "id": 2429,
                        "name": "朔州市"
                    },
                    {
                        "id": 2415,
                        "name": "吕梁市"
                    },
                    {
                        "id": 2397,
                        "name": "临汾市"
                    },
                    {
                        "id": 2385,
                        "name": "晋中市"
                    },
                    {
                        "id": 2378,
                        "name": "晋城市"
                    },
                    {
                        "id": 2366,
                        "name": "大同市"
                    },
                    {
                        "id": 2352,
                        "name": "长治市"
                    },
                    {
                        "id": 2457,
                        "name": "运城市"
                    }
                ]
            },
            {
                "id": 2471,
                "name": "陕西",
                "child": [
                    {
                        "id": 2472,
                        "name": "西安市"
                    },
                    {
                        "id": 2562,
                        "name": "延安市"
                    },
                    {
                        "id": 2547,
                        "name": "咸阳市"
                    },
                    {
                        "id": 2535,
                        "name": "渭南市"
                    },
                    {
                        "id": 2530,
                        "name": "铜川市"
                    },
                    {
                        "id": 2522,
                        "name": "商洛市"
                    },
                    {
                        "id": 2510,
                        "name": "汉中市"
                    },
                    {
                        "id": 2497,
                        "name": "宝鸡市"
                    },
                    {
                        "id": 2486,
                        "name": "安康市"
                    },
                    {
                        "id": 2576,
                        "name": "榆林市"
                    }
                ]
            },
            {
                "id": 2589,
                "name": "四川",
                "child": [
                    {
                        "id": 2590,
                        "name": "成都市"
                    },
                    {
                        "id": 2722,
                        "name": "绵阳市"
                    },
                    {
                        "id": 2732,
                        "name": "内江市"
                    },
                    {
                        "id": 2738,
                        "name": "南充市"
                    },
                    {
                        "id": 2748,
                        "name": "攀枝花市"
                    },
                    {
                        "id": 2754,
                        "name": "遂宁市"
                    },
                    {
                        "id": 2760,
                        "name": "雅安市"
                    },
                    {
                        "id": 2769,
                        "name": "宜宾市"
                    },
                    {
                        "id": 2780,
                        "name": "资阳市"
                    },
                    {
                        "id": 2715,
                        "name": "眉山市"
                    },
                    {
                        "id": 2707,
                        "name": "泸州市"
                    },
                    {
                        "id": 2689,
                        "name": "凉山彝族自治州"
                    },
                    {
                        "id": 2610,
                        "name": "阿坝藏族羌族自治州"
                    },
                    {
                        "id": 2624,
                        "name": "巴中市"
                    },
                    {
                        "id": 2629,
                        "name": "达州市"
                    },
                    {
                        "id": 2637,
                        "name": "德阳市"
                    },
                    {
                        "id": 2644,
                        "name": "甘孜藏族自治州"
                    },
                    {
                        "id": 2663,
                        "name": "广安市"
                    },
                    {
                        "id": 2669,
                        "name": "广元市"
                    },
                    {
                        "id": 2677,
                        "name": "乐山市"
                    },
                    {
                        "id": 2785,
                        "name": "自贡市"
                    }
                ]
            },
            {
                "id": 2792,
                "name": "西藏",
                "child": [
                    {
                        "id": 2793,
                        "name": "拉萨市"
                    },
                    {
                        "id": 2802,
                        "name": "阿里地区"
                    },
                    {
                        "id": 2810,
                        "name": "昌都地区"
                    },
                    {
                        "id": 2822,
                        "name": "林芝地区"
                    },
                    {
                        "id": 2830,
                        "name": "那曲地区"
                    },
                    {
                        "id": 2841,
                        "name": "日喀则地区"
                    },
                    {
                        "id": 2860,
                        "name": "山南地区"
                    }
                ]
            },
            {
                "id": 2873,
                "name": "新疆",
                "child": [
                    {
                        "id": 2874,
                        "name": "乌鲁木齐市"
                    },
                    {
                        "id": 2975,
                        "name": "五家渠市"
                    },
                    {
                        "id": 2971,
                        "name": "吐鲁番地区"
                    },
                    {
                        "id": 2970,
                        "name": "图木舒克市"
                    },
                    {
                        "id": 2962,
                        "name": "塔城地区"
                    },
                    {
                        "id": 2961,
                        "name": "石河子市"
                    },
                    {
                        "id": 2956,
                        "name": "克孜勒苏柯尔克孜自治州"
                    },
                    {
                        "id": 2951,
                        "name": "克拉玛依市"
                    },
                    {
                        "id": 2938,
                        "name": "喀什地区"
                    },
                    {
                        "id": 2929,
                        "name": "和田地区"
                    },
                    {
                        "id": 2925,
                        "name": "哈密地区"
                    },
                    {
                        "id": 2916,
                        "name": "昌吉回族自治州"
                    },
                    {
                        "id": 2912,
                        "name": "博尔塔拉蒙古自治州"
                    },
                    {
                        "id": 2902,
                        "name": "巴音郭楞蒙古自治州"
                    },
                    {
                        "id": 2894,
                        "name": "阿勒泰地区"
                    },
                    {
                        "id": 2893,
                        "name": "阿拉尔市"
                    },
                    {
                        "id": 2883,
                        "name": "阿克苏地区"
                    },
                    {
                        "id": 2976,
                        "name": "伊犁哈萨克自治州"
                    }
                ]
            },
            {
                "id": 2987,
                "name": "云南",
                "child": [
                    {
                        "id": 2988,
                        "name": "昆明市"
                    },
                    {
                        "id": 3121,
                        "name": "昭通市"
                    },
                    {
                        "id": 3111,
                        "name": "玉溪市"
                    },
                    {
                        "id": 3107,
                        "name": "西双版纳傣族自治州"
                    },
                    {
                        "id": 3098,
                        "name": "文山壮族苗族自治州"
                    },
                    {
                        "id": 3087,
                        "name": "思茅市"
                    },
                    {
                        "id": 3077,
                        "name": "曲靖市"
                    },
                    {
                        "id": 3072,
                        "name": "怒江傈僳族自治州"
                    },
                    {
                        "id": 3063,
                        "name": "临沧市"
                    },
                    {
                        "id": 3057,
                        "name": "丽江市"
                    },
                    {
                        "id": 3043,
                        "name": "红河哈尼族彝族自治州"
                    },
                    {
                        "id": 3039,
                        "name": "迪庆藏族自治州"
                    },
                    {
                        "id": 3033,
                        "name": "德宏傣族景颇族自治州"
                    },
                    {
                        "id": 3020,
                        "name": "大理白族自治州"
                    },
                    {
                        "id": 3009,
                        "name": "楚雄彝族自治州"
                    },
                    {
                        "id": 3003,
                        "name": "保山市"
                    },
                    {
                        "id": 3294,
                        "name": "普洱市"
                    }
                ]
            },
            {
                "id": 3133,
                "name": "浙江",
                "child": [
                    {
                        "id": 3134,
                        "name": "杭州市"
                    },
                    {
                        "id": 3218,
                        "name": "温州市"
                    },
                    {
                        "id": 3208,
                        "name": "台州市"
                    },
                    {
                        "id": 3201,
                        "name": "绍兴市"
                    },
                    {
                        "id": 3194,
                        "name": "衢州市"
                    },
                    {
                        "id": 3182,
                        "name": "宁波市"
                    },
                    {
                        "id": 3172,
                        "name": "丽水市"
                    },
                    {
                        "id": 3162,
                        "name": "金华市"
                    },
                    {
                        "id": 3154,
                        "name": "嘉兴市"
                    },
                    {
                        "id": 3148,
                        "name": "湖州市"
                    },
                    {
                        "id": 3230,
                        "name": "舟山市"
                    }
                ]
            },
            {
                "id": 3235,
                "name": "香港",
                "child": [
                    {
                        "id": 3236,
                        "name": "九龙"
                    },
                    {
                        "id": 3237,
                        "name": "香港岛"
                    },
                    {
                        "id": 3238,
                        "name": "新界"
                    }
                ]
            },
            {
                "id": 3239,
                "name": "澳门",
                "child": [
                    {
                        "id": 3240,
                        "name": "澳门半岛"
                    },
                    {
                        "id": 3241,
                        "name": "离岛"
                    }
                ]
            },
            {
                "id": 3242,
                "name": "台湾",
                "child": [
                    {
                        "id": 3243,
                        "name": "台北市"
                    },
                    {
                        "id": 3256,
                        "name": "台东县"
                    },
                    {
                        "id": 3257,
                        "name": "台南市"
                    },
                    {
                        "id": 3258,
                        "name": "台南县"
                    },
                    {
                        "id": 3259,
                        "name": "台中市"
                    },
                    {
                        "id": 3260,
                        "name": "台中县"
                    },
                    {
                        "id": 3261,
                        "name": "桃园县"
                    },
                    {
                        "id": 3262,
                        "name": "新竹市"
                    },
                    {
                        "id": 3263,
                        "name": "新竹县"
                    },
                    {
                        "id": 3264,
                        "name": "宜兰县"
                    },
                    {
                        "id": 3265,
                        "name": "云林县"
                    },
                    {
                        "id": 3255,
                        "name": "台北县"
                    },
                    {
                        "id": 3254,
                        "name": "屏东县"
                    },
                    {
                        "id": 3244,
                        "name": "高雄市"
                    },
                    {
                        "id": 3245,
                        "name": "高雄县"
                    },
                    {
                        "id": 3246,
                        "name": "花莲县"
                    },
                    {
                        "id": 3247,
                        "name": "基隆市"
                    },
                    {
                        "id": 3248,
                        "name": "嘉义市"
                    },
                    {
                        "id": 3249,
                        "name": "嘉义县"
                    },
                    {
                        "id": 3250,
                        "name": "金门县"
                    },
                    {
                        "id": 3251,
                        "name": "苗栗县"
                    },
                    {
                        "id": 3252,
                        "name": "南投县"
                    },
                    {
                        "id": 3253,
                        "name": "澎湖县"
                    },
                    {
                        "id": 3266,
                        "name": "彰化县"
                    }
                ]
            },
            {
                "id": 3267,
                "name": "欧洲",
                "child": [
                    {
                        "id": 3268,
                        "name": "法国"
                    },
                    {
                        "id": 3269,
                        "name": "比利时"
                    },
                    {
                        "id": 3270,
                        "name": "英国"
                    },
                    {
                        "id": 3271,
                        "name": "德国"
                    },
                    {
                        "id": 3272,
                        "name": "意大利"
                    },
                    {
                        "id": 3279,
                        "name": "希腊"
                    },
                    {
                        "id": 3280,
                        "name": "瑞典"
                    }
                ]
            },
            {
                "id": 1763,
                "name": "江西",
                "child": [
                    {
                        "id": 1764,
                        "name": "南昌市"
                    },
                    {
                        "id": 1859,
                        "name": "宜春市"
                    },
                    {
                        "id": 1856,
                        "name": "新余市"
                    },
                    {
                        "id": 1843,
                        "name": "上饶市"
                    },
                    {
                        "id": 1837,
                        "name": "萍乡市"
                    },
                    {
                        "id": 1824,
                        "name": "九江市"
                    },
                    {
                        "id": 1819,
                        "name": "景德镇市"
                    },
                    {
                        "id": 1805,
                        "name": "吉安市"
                    },
                    {
                        "id": 1786,
                        "name": "赣州市"
                    },
                    {
                        "id": 1774,
                        "name": "抚州市"
                    },
                    {
                        "id": 1870,
                        "name": "鹰潭市"
                    }
                ]
            },
            {
                "id": 1643,
                "name": "江苏",
                "child": [
                    {
                        "id": 1644,
                        "name": "南京市"
                    },
                    {
                        "id": 1748,
                        "name": "扬州市"
                    },
                    {
                        "id": 1738,
                        "name": "盐城市"
                    },
                    {
                        "id": 1726,
                        "name": "徐州市"
                    },
                    {
                        "id": 1717,
                        "name": "无锡市"
                    },
                    {
                        "id": 1710,
                        "name": "泰州市"
                    },
                    {
                        "id": 1704,
                        "name": "宿迁市"
                    },
                    {
                        "id": 1692,
                        "name": "苏州市"
                    },
                    {
                        "id": 1683,
                        "name": "南通市"
                    },
                    {
                        "id": 1675,
                        "name": "连云港市"
                    },
                    {
                        "id": 1666,
                        "name": "淮安市"
                    },
                    {
                        "id": 1658,
                        "name": "常州市"
                    },
                    {
                        "id": 1756,
                        "name": "镇江市"
                    }
                ]
            },
            {
                "id": 21,
                "name": "上海",
                "child": [
                    {
                        "id": 22,
                        "name": "上海市"
                    }
                ]
            },
            {
                "id": 42,
                "name": "天津",
                "child": [
                    {
                        "id": 43,
                        "name": "天津市"
                    }
                ]
            },
            {
                "id": 62,
                "name": "重庆",
                "child": [
                    {
                        "id": 63,
                        "name": "重庆市"
                    }
                ]
            },
            {
                "id": 104,
                "name": "安徽",
                "child": [
                    {
                        "id": 105,
                        "name": "合肥市"
                    },
                    {
                        "id": 211,
                        "name": "芜湖市"
                    },
                    {
                        "id": 206,
                        "name": "铜陵市"
                    },
                    {
                        "id": 200,
                        "name": "宿州市"
                    },
                    {
                        "id": 195,
                        "name": "马鞍山市"
                    },
                    {
                        "id": 187,
                        "name": "六安市"
                    },
                    {
                        "id": 179,
                        "name": "黄山市"
                    },
                    {
                        "id": 172,
                        "name": "淮南市"
                    },
                    {
                        "id": 167,
                        "name": "淮北市"
                    },
                    {
                        "id": 158,
                        "name": "阜阳市"
                    },
                    {
                        "id": 149,
                        "name": "滁州市"
                    },
                    {
                        "id": 144,
                        "name": "池州市"
                    },
                    {
                        "id": 138,
                        "name": "巢湖市"
                    },
                    {
                        "id": 133,
                        "name": "亳州市"
                    },
                    {
                        "id": 125,
                        "name": "蚌埠市"
                    },
                    {
                        "id": 113,
                        "name": "安庆市"
                    },
                    {
                        "id": 219,
                        "name": "宣城市"
                    }
                ]
            },
            {
                "id": 227,
                "name": "福建",
                "child": [
                    {
                        "id": 228,
                        "name": "福州市"
                    },
                    {
                        "id": 242,
                        "name": "龙岩市"
                    },
                    {
                        "id": 250,
                        "name": "南平市"
                    },
                    {
                        "id": 261,
                        "name": "宁德市"
                    },
                    {
                        "id": 271,
                        "name": "莆田市"
                    },
                    {
                        "id": 277,
                        "name": "泉州市"
                    },
                    {
                        "id": 290,
                        "name": "三明市"
                    },
                    {
                        "id": 303,
                        "name": "厦门市"
                    },
                    {
                        "id": 310,
                        "name": "漳州市"
                    }
                ]
            },
            {
                "id": 322,
                "name": "甘肃",
                "child": [
                    {
                        "id": 323,
                        "name": "兰州市"
                    },
                    {
                        "id": 411,
                        "name": "武威市"
                    },
                    {
                        "id": 403,
                        "name": "天水市"
                    },
                    {
                        "id": 394,
                        "name": "庆阳市"
                    },
                    {
                        "id": 386,
                        "name": "平凉市"
                    },
                    {
                        "id": 376,
                        "name": "陇南市"
                    },
                    {
                        "id": 367,
                        "name": "临夏回族自治州"
                    },
                    {
                        "id": 359,
                        "name": "酒泉市"
                    },
                    {
                        "id": 356,
                        "name": "金昌市"
                    },
                    {
                        "id": 355,
                        "name": "嘉峪关市"
                    },
                    {
                        "id": 346,
                        "name": "甘南藏族自治州"
                    },
                    {
                        "id": 338,
                        "name": "定西市"
                    },
                    {
                        "id": 332,
                        "name": "白银市"
                    },
                    {
                        "id": 416,
                        "name": "张掖市"
                    }
                ]
            },
            {
                "id": 423,
                "name": "广东",
                "child": [
                    {
                        "id": 424,
                        "name": "广州市"
                    },
                    {
                        "id": 500,
                        "name": "汕头市"
                    },
                    {
                        "id": 508,
                        "name": "汕尾市"
                    },
                    {
                        "id": 513,
                        "name": "韶关市"
                    },
                    {
                        "id": 524,
                        "name": "深圳市"
                    },
                    {
                        "id": 531,
                        "name": "阳江市"
                    },
                    {
                        "id": 536,
                        "name": "云浮市"
                    },
                    {
                        "id": 542,
                        "name": "湛江市"
                    },
                    {
                        "id": 552,
                        "name": "肇庆市"
                    },
                    {
                        "id": 561,
                        "name": "中山市"
                    },
                    {
                        "id": 491,
                        "name": "清远市"
                    },
                    {
                        "id": 483,
                        "name": "梅州市"
                    },
                    {
                        "id": 437,
                        "name": "潮州市"
                    },
                    {
                        "id": 441,
                        "name": "东莞市"
                    },
                    {
                        "id": 442,
                        "name": "佛山市"
                    },
                    {
                        "id": 448,
                        "name": "河源市"
                    },
                    {
                        "id": 455,
                        "name": "惠州市"
                    },
                    {
                        "id": 461,
                        "name": "江门市"
                    },
                    {
                        "id": 469,
                        "name": "揭阳市"
                    },
                    {
                        "id": 475,
                        "name": "茂名市"
                    },
                    {
                        "id": 482,
                        "name": "梅州市"
                    },
                    {
                        "id": 562,
                        "name": "珠海市"
                    }
                ]
            },
            {
                "id": 566,
                "name": "广西",
                "child": [
                    {
                        "id": 567,
                        "name": "南宁市"
                    },
                    {
                        "id": 675,
                        "name": "梧州市"
                    },
                    {
                        "id": 670,
                        "name": "钦州市"
                    },
                    {
                        "id": 659,
                        "name": "柳州市"
                    },
                    {
                        "id": 652,
                        "name": "来宾市"
                    },
                    {
                        "id": 647,
                        "name": "贺州市"
                    },
                    {
                        "id": 635,
                        "name": "河池市"
                    },
                    {
                        "id": 617,
                        "name": "桂林市"
                    },
                    {
                        "id": 611,
                        "name": "贵港市"
                    },
                    {
                        "id": 606,
                        "name": "防城港市"
                    },
                    {
                        "id": 598,
                        "name": "崇左市"
                    },
                    {
                        "id": 593,
                        "name": "北海市"
                    },
                    {
                        "id": 580,
                        "name": "百色市"
                    },
                    {
                        "id": 683,
                        "name": "玉林市"
                    }
                ]
            },
            {
                "id": 690,
                "name": "贵州",
                "child": [
                    {
                        "id": 691,
                        "name": "贵阳市"
                    },
                    {
                        "id": 702,
                        "name": "安顺市"
                    },
                    {
                        "id": 709,
                        "name": "毕节地区"
                    },
                    {
                        "id": 718,
                        "name": "六盘水市"
                    },
                    {
                        "id": 723,
                        "name": "黔东南苗族侗族自治州"
                    },
                    {
                        "id": 740,
                        "name": "黔南布依族苗族自治州"
                    },
                    {
                        "id": 753,
                        "name": "黔西南布依族苗族自治州"
                    },
                    {
                        "id": 762,
                        "name": "铜仁地区"
                    },
                    {
                        "id": 773,
                        "name": "遵义市"
                    }
                ]
            },
            {
                "id": 788,
                "name": "海南",
                "child": [
                    {
                        "id": 789,
                        "name": "海口市"
                    },
                    {
                        "id": 805,
                        "name": "琼海市"
                    },
                    {
                        "id": 806,
                        "name": "琼中黎族苗族自治县"
                    },
                    {
                        "id": 807,
                        "name": "三亚市"
                    },
                    {
                        "id": 808,
                        "name": "屯昌县"
                    },
                    {
                        "id": 809,
                        "name": "万宁市"
                    },
                    {
                        "id": 810,
                        "name": "文昌市"
                    },
                    {
                        "id": 811,
                        "name": "五指山市"
                    },
                    {
                        "id": 812,
                        "name": "西沙群岛"
                    },
                    {
                        "id": 804,
                        "name": "南沙群岛"
                    },
                    {
                        "id": 803,
                        "name": "陵水黎族自治县"
                    },
                    {
                        "id": 802,
                        "name": "临高县"
                    },
                    {
                        "id": 794,
                        "name": "白沙黎族自治县"
                    },
                    {
                        "id": 795,
                        "name": "保亭黎族苗族自治县"
                    },
                    {
                        "id": 796,
                        "name": "昌江黎族自治县"
                    },
                    {
                        "id": 797,
                        "name": "澄迈县"
                    },
                    {
                        "id": 798,
                        "name": "儋州市"
                    },
                    {
                        "id": 799,
                        "name": "定安县"
                    },
                    {
                        "id": 800,
                        "name": "东方市"
                    },
                    {
                        "id": 801,
                        "name": "乐东黎族自治县"
                    },
                    {
                        "id": 813,
                        "name": "中沙群岛的岛礁及其海域"
                    }
                ]
            },
            {
                "id": 814,
                "name": "河北",
                "child": [
                    {
                        "id": 815,
                        "name": "石家庄市"
                    },
                    {
                        "id": 960,
                        "name": "邢台市"
                    },
                    {
                        "id": 945,
                        "name": "唐山市"
                    },
                    {
                        "id": 937,
                        "name": "秦皇岛市"
                    },
                    {
                        "id": 926,
                        "name": "廊坊市"
                    },
                    {
                        "id": 914,
                        "name": "衡水市"
                    },
                    {
                        "id": 894,
                        "name": "邯郸市"
                    },
                    {
                        "id": 882,
                        "name": "承德市"
                    },
                    {
                        "id": 865,
                        "name": "沧州市"
                    },
                    {
                        "id": 839,
                        "name": "保定市"
                    },
                    {
                        "id": 980,
                        "name": "张家口市"
                    }
                ]
            },
            {
                "id": 998,
                "name": "河南",
                "child": [
                    {
                        "id": 999,
                        "name": "郑州市"
                    },
                    {
                        "id": 1154,
                        "name": "周口市"
                    },
                    {
                        "id": 1147,
                        "name": "许昌市"
                    },
                    {
                        "id": 1136,
                        "name": "信阳市"
                    },
                    {
                        "id": 1123,
                        "name": "新乡市"
                    },
                    {
                        "id": 1113,
                        "name": "商丘市"
                    },
                    {
                        "id": 1106,
                        "name": "三门峡市"
                    },
                    {
                        "id": 1099,
                        "name": "濮阳市"
                    },
                    {
                        "id": 1088,
                        "name": "平顶山市"
                    },
                    {
                        "id": 1074,
                        "name": "南阳市"
                    },
                    {
                        "id": 1068,
                        "name": "漯河市"
                    },
                    {
                        "id": 1052,
                        "name": "洛阳市"
                    },
                    {
                        "id": 1041,
                        "name": "开封市"
                    },
                    {
                        "id": 1029,
                        "name": "焦作市"
                    },
                    {
                        "id": 1028,
                        "name": "济源市"
                    },
                    {
                        "id": 1022,
                        "name": "鹤壁市"
                    },
                    {
                        "id": 1012,
                        "name": "安阳市"
                    },
                    {
                        "id": 1165,
                        "name": "驻马店市"
                    }
                ]
            },
            {
                "id": 1176,
                "name": "黑龙江",
                "child": [
                    {
                        "id": 1177,
                        "name": "哈尔滨市"
                    },
                    {
                        "id": 1291,
                        "name": "绥化市"
                    },
                    {
                        "id": 1282,
                        "name": "双鸭山市"
                    },
                    {
                        "id": 1265,
                        "name": "齐齐哈尔市"
                    },
                    {
                        "id": 1260,
                        "name": "七台河市"
                    },
                    {
                        "id": 1249,
                        "name": "牡丹江市"
                    },
                    {
                        "id": 1237,
                        "name": "佳木斯市"
                    },
                    {
                        "id": 1227,
                        "name": "鸡西市"
                    },
                    {
                        "id": 1220,
                        "name": "黑河市"
                    },
                    {
                        "id": 1211,
                        "name": "鹤岗市"
                    },
                    {
                        "id": 1207,
                        "name": "大兴安岭地区"
                    },
                    {
                        "id": 1197,
                        "name": "大庆市"
                    },
                    {
                        "id": 1302,
                        "name": "伊春市"
                    }
                ]
            },
            {
                "id": 1320,
                "name": "湖北",
                "child": [
                    {
                        "id": 1321,
                        "name": "武汉市"
                    },
                    {
                        "id": 1422,
                        "name": "宜昌市"
                    },
                    {
                        "id": 1414,
                        "name": "孝感市"
                    },
                    {
                        "id": 1404,
                        "name": "襄樊市"
                    },
                    {
                        "id": 1397,
                        "name": "咸宁市"
                    },
                    {
                        "id": 1396,
                        "name": "仙桃市"
                    },
                    {
                        "id": 1395,
                        "name": "天门市"
                    },
                    {
                        "id": 1392,
                        "name": "随州市"
                    },
                    {
                        "id": 1383,
                        "name": "十堰市"
                    },
                    {
                        "id": 1382,
                        "name": "神农架林区"
                    },
                    {
                        "id": 1381,
                        "name": "潜江市"
                    },
                    {
                        "id": 1372,
                        "name": "荆州市"
                    },
                    {
                        "id": 1366,
                        "name": "荆门市"
                    },
                    {
                        "id": 1359,
                        "name": "黄石市"
                    },
                    {
                        "id": 1348,
                        "name": "黄冈市"
                    },
                    {
                        "id": 1339,
                        "name": "恩施土家族苗族自治州"
                    },
                    {
                        "id": 1335,
                        "name": "鄂州市"
                    },
                    {
                        "id": 3295,
                        "name": "襄阳市"
                    }
                ]
            },
            {
                "id": 1436,
                "name": "湖南",
                "child": [
                    {
                        "id": 1437,
                        "name": "长沙市"
                    },
                    {
                        "id": 1558,
                        "name": "张家界市"
                    },
                    {
                        "id": 1548,
                        "name": "岳阳市"
                    },
                    {
                        "id": 1536,
                        "name": "永州市"
                    },
                    {
                        "id": 1529,
                        "name": "益阳市"
                    },
                    {
                        "id": 1520,
                        "name": "湘西土家族苗族自治州"
                    },
                    {
                        "id": 1514,
                        "name": "湘潭市"
                    },
                    {
                        "id": 1501,
                        "name": "邵阳市"
                    },
                    {
                        "id": 1495,
                        "name": "娄底市"
                    },
                    {
                        "id": 1482,
                        "name": "怀化市"
                    },
                    {
                        "id": 1469,
                        "name": "衡阳市"
                    },
                    {
                        "id": 1457,
                        "name": "郴州市"
                    },
                    {
                        "id": 1447,
                        "name": "常德市"
                    },
                    {
                        "id": 1563,
                        "name": "株洲市"
                    }
                ]
            },
            {
                "id": 1573,
                "name": "吉林",
                "child": [
                    {
                        "id": 1574,
                        "name": "长春市"
                    },
                    {
                        "id": 1585,
                        "name": "白城市"
                    },
                    {
                        "id": 1591,
                        "name": "白山市"
                    },
                    {
                        "id": 1598,
                        "name": "吉林市"
                    },
                    {
                        "id": 1608,
                        "name": "辽源市"
                    },
                    {
                        "id": 1613,
                        "name": "四平市"
                    },
                    {
                        "id": 1620,
                        "name": "松原市"
                    },
                    {
                        "id": 1626,
                        "name": "通化市"
                    },
                    {
                        "id": 1634,
                        "name": "延边朝鲜族自治州"
                    }
                ]
            }
        ]
    };

    return city_data;
});
define.pack("./picker.dialog",["$"],function(require, exports, module) {
    var $ = require('$');

    $.fn.Dialog = function(settings) {
        var list = [];
        $(this).each(function() {
            var dialog = new Dialog();
            var options = $.extend({
                trigger: $(this)
            }, settings);
            dialog.init(options);
            list.push(dialog);
        });
        return list;
    };
    $.Dialog = function(settings) {
        if (settings.type === "alert") {
            var alert = new Dialog();
            var html = '<div class="ui-alert-title">' + settings.content + '</div>';
            var action = '';
            if (settings.button) {
                if (typeof settings.button == 'boolean') {
                    settings.button = '确定';
                };
                action = '<p class="ui-dialog-action"><button class="ui-alert-submit  js-dialog-close">' + settings.button + '</button></p>';
            } else if (!settings.timer) {
                settings.timer = 3000;
            }
            html += action;
            var alertOptions = $.extend({
                target: html,
                animate: true,
                show: true,
                mask: true,
                className: "ui-alert",
                afterHide: function(c) {
                    this.dispose();
                    settings.callback && settings.callback();
                }
            }, settings);
            alert.init(alertOptions);
            if (settings.timer) {
                setTimeout(function() {
                    alert.dispose();
                    settings.callback && settings.callback();
                }, settings.timer);
            }
            alert.touch(alert.mask, function() {
                alert.hide();
                settings.callback && settings.callback();
            });
        }
        if (settings.type === "confirm") {
            var dialog = new Dialog();
            var html = '<div class="ui-confirm-title">' + settings.content + '</div>';
            var action = '';
            if (!settings.buttons) {
                settings.buttons = [{
                    'yes': '确定'
                }, {
                    'no': '取消'
                }];
            };
            var btnstr = '';
            for (var i = 0, l = settings.buttons.length; i < l; i++) {
                var item = settings.buttons[i];
                if (item.yes) {
                    btnstr += '<td><button class="ui-confirm-submit " data-type="yes">' + item.yes + '</button></td>';
                }
                if (item.no) {
                    btnstr += '<td><button class="ui-confirm-no" data-type="no">' + item.no + '</button></td>';
                }
                if (item.close) {
                    btnstr += '<td><button class="ui-confirm-close js-dialog-close" data-type="close">' + item.close + '</button></td>';
                }
            }
            action = '<table class="ui-dialog-action"><tr>' + btnstr + '</tr></table>';
            html += action;
            var options = $.extend({
                target: html,
                animate: true,
                show: true,
                fixed:true,
                mask: true,
                className: "ui-alert",
                afterHide: function(c) {
                    this.dispose();
                },
                beforeShow: function(c) {
                    dialog.touch($('.ui-confirm-submit', c), function() {
                        settings.callback && settings.callback.call(dialog, 'yes', c);
                    });
                    dialog.touch($('.ui-confirm-no', c), function() {
                        settings.callback && settings.callback.call(dialog, 'no', c);
                    });
                    dialog.touch($('.ui-confirm-close', c), function() {
                        settings.callback && settings.callback.call(dialog, 'close', c);
                    });
                }
            }, settings);
            dialog.init(options);
        }
    };
    /*alert*/
    $.alert = function(content, button, callback, timer, settings) {
        var options = {};
        var defaults = {
            zIndex: 100,
            type: 'alert'
        };
        if (typeof content == 'object') {
            options = $.extend(defaults, content);
        } else {
            options = $.extend(defaults, {
                content: content,
                button: button,
                timer: timer,
                callback: callback
            });
        }
        $.Dialog($.extend(options, settings));
    }
    /*
     buttons :[{yes:"确定"},{no:'取消'},{close:'关闭'}]
     */
    $.confirm = function(content, buttons, callback, settings) {
        var options = {};
        var defaults = {
            zIndex: 100,
            type: 'confirm'
        };
        if (typeof content == 'object') {
            options = $.extend(defaults, content);
        } else {
            options = $.extend(defaults, {
                content: content,
                buttons: buttons,
                callback: callback
            });
        }
        $.Dialog($.extend(options, settings));
    }
    var Dialog = function() {
        var rnd = Math.random().toString().replace('.', '');
        this.id = 'dialog_' + rnd;
        this.settings = {};
        this.settings.closeTpl = $('<span class="ui-dialog-close js-dialog-close">x</span>');
        this.settings.titleTpl = $('<div class="ui-dialog-title"></div>');
        this.timer = null;
        this.showed = false;
        this.mask = $();
    }
    Dialog.prototype = {
        init: function(settings) {
            var _this = this;
            this.settings = $.extend({
                fixed: false//是否固定位置�?
            }, this.settings, settings);
            if (this.settings.mask) {
                this.mask = $('<div class="ui-dialog-mask"/>');
                $('body').append(this.mask);
            }
            $('body').append('<div class="ui-dialog" id="' + this.id + '"></div>');
            this.dialogContainer = $('#' + this.id);
            var zIndex = this.settings.zIndex || 10;
            this.dialogContainer.css({
                'zIndex': zIndex
            });
            if (this.settings.className) {
                this.dialogContainer.addClass(this.settings.className);
            };
            this.mask.css({
                'zIndex': zIndex - 1
            });
            if (this.settings.closeTpl) {
                this.dialogContainer.append(this.settings.closeTpl);
            }
            if (this.settings.title) {
                this.dialogContainer.append(this.settings.titleTpl);
                this.settings.titleTpl.html(this.settings.title);
            }
            this.bindEvent();
            if (this.settings.show) {
                this.show();
            }
        },
        touch: function(obj, fn) {
            var move;
            $(obj).on('click', click);

            function click(e) {
                return fn.call(this, e);
            }
            $(obj).on('touchmove', function(e) {
                move = true;
            }).on('touchend', function(e) {
                e.preventDefault();
                if (!move) {
                    var returnvalue = fn.call(this, e, 'touch');
                    if (!returnvalue) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                move = false;
            });
        },
        bindEvent: function() {
            var _this = this;
            if (this.settings.trigger) {
                $(this.settings.trigger).click(function() {
                    _this.show()
                });
                _this.touch($(this.settings.trigger), function() {
                    _this.show()
                });
            };
            $(this.dialogContainer).on('click', '.js-dialog-close', function() {
                _this.hide();
                return false;
            })
            // $(window).resize(function() {
            // 	_this.setPosition();
            // });
            // $(window).scroll(function() {
            // 	_this.setPosition();
            // })
            $(document).keydown(function(e) {
                if (e.keyCode === 27 && _this.showed) {
                    _this.hide();
                }
            });
            $(this.dialogContainer).on('hide', function() {
                _this.hide();
            })
        },
        dispose: function() {
            this.dialogContainer.remove();
            this.mask.remove();
            this.timer && clearInterval(this.timer);
        },
        hide: function() {
            var _this = this;
            if (_this.settings.beforeHide) {
                _this.settings.beforeHide.call(_this, _this.dialogContainer);
            }
            this.showed = false;
            this.mask.hide();
            this.timer && clearInterval(this.timer);
            if (this.settings.animate) {
                this.dialogContainer.removeClass('zoomIn').addClass("zoomOut");
                setTimeout(function() {
                    _this.dialogContainer.hide();
                    if (typeof _this.settings.target === "object") {
                        $('body').append(_this.dialogContainer.hide());
                    }
                    if (_this.settings.afterHide) {
                        _this.settings.afterHide.call(_this, _this.dialogContainer);
                    }
                }, 500);
            } else {
                this.dialogContainer.hide();
                if (typeof this.settings.target === "object") {
                    $('body').append(this.dialogContainer)
                }
                if (this.settings.afterHide) {
                    this.settings.afterHide.call(this, this.dialogContainer);
                }
            }
        },
        show: function() {
            if (typeof this.settings.target === "string") {
                if (/^(\.|\#\w+)/gi.test(this.settings.target)) {
                    this.dailogContent = $(this.settings.target);
                } else {
                    this.dailogContent = $('<div>' + this.settings.target + '</div>')
                }
            } else {
                this.dailogContent = this.settings.target;
            }
            this.mask.show();
            this.dailogContent.show();
            this.height = this.settings.height || 'auto' //this.dialogContainer.height();
            this.width = this.settings.width || 'auto' //this.dialogContainer.width();
            this.dialogContainer.append(this.dailogContent).show().css({
                height: this.height,
                width: this.width
            });
            if (this.settings.beforeShow) {
                this.settings.beforeShow.call(this, this.dialogContainer);
            }
            this.showed = true;
            $(this.settings.trigger).blur();

            this.setPosition();
            var _this = this;
            // $.alert(this.settings.clientWidth)
            this.timer && clearInterval(this.timer);
            if (this.settings.fixed) {
                this.timer = setInterval(function() {
                    _this.setPosition();
                }, 1000);
            }
            if (this.settings.animate) {
                this.dialogContainer.addClass('zoomIn').removeClass('zoomOut').addClass('animated');
            }
        },
        setPosition: function() {
            if (this.showed) {
                var _this = this;
                this.dialogContainer.show();
                this.height = this.settings.height;
                this.width = this.settings.width;
                if (isNaN(this.height)) {
                    this.height = (this.dialogContainer.outerHeight && this.dialogContainer.outerHeight()) || this.dialogContainer.height();
                }
                if (isNaN(this.width)) {
                    this.width = (this.dialogContainer.outerWidth && this.dialogContainer.outerWidth()) || this.dialogContainer.width();
                }
                var clientHeight = this.settings.clientHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var clientWidth = this.settings.clientWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var ml = this.width / 2;
                var mt = this.height / 2;
                var left = clientWidth / 2 - ml;
                var top = clientHeight / 2 - mt;
                left = Math.floor(Math.max(0, left));
                top = Math.floor(Math.max(0, top));
                var position = 'absolute';
                if(_this.settings.fixed){
                    position='fixed';
                }
                _this.dialogContainer.css({
                    position: position,
                    top: top,
                    left: left
                });
            }
        }
    }
    return Dialog;
});/**
 * H5签到模块
 * @author xixinhuang
 * @date 16-03-28
 */
define.pack("./signin",["$","lib","common","./tmpl","./store","./ad_link","./ui","./mgr"],function (require, exports, module) {

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        user = common.get('./user'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        tmpl = require('./tmpl'),
        store = require('./store'),
        ad_link = require('./ad_link'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var signin = new Module('signin', {

        render: function(data) {
            store.init(data);
            ui.render();
            ad_link.render();
            mgr.init({
                ui: ui,
                store: store
            });
        }
    });


    return signin;
});define.pack("./store",["lib","common","$","./Record"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        events = lib.get('./events'),
        Record = require('./Record'),
        request = common.get('./request'),

        note_map = {},
        undefined;

    var store = new Module('signin.store', {

        init: function(data) {
            if(this._inited) {
                return;
            }

            var qzGoods = data.goodsList && data.goodsList['data'];
            if(qzGoods && qzGoods.rule) {
                this.goods = this.format2nodes(qzGoods.rule);
            }

            this.wyGoods = data.wyGoodsList || [];
            this.wyInfo = data.data || {};
            this.addr = data.addr? data : [];

            var _data = {
                info: this.wyInfo,
                goods: this.goods,
                wyGoods: this.wyGoods
            }
            this.trigger('load_done', _data , store);
            this._inited = true;
        },

        format2nodes: function(items) {

            var recordList = [];
            for(var key in items) {
                var item = items[key],
                    record = new Record(item, key);
                note_map[record.get_id()] = record;
                recordList.push(record);
            }

            return recordList;
        },

        update_info: function(info) {
            this.wyInfo = info;
            this.trigger('refresh', this.wyInfo, store);
        },

        get_all_records: function() {
            return this.records;
        },

        get_good_by_id: function(id) {
            return note_map[id];
        },

        get_all_goods: function() {
            return this.goods;
        },

        get_wy_goods: function () {
            return this.wyGoods.goods_list[0];
        },

        get_info: function() {
            return this.wyInfo;
        },

        get_addr: function() {
            return this.addr;
        },

        set_addr: function(addr) {
            this.addr = addr;
        },

        has_signed_in: function() {
            return !!this.wyInfo['has_signed_in'];
        },

        get_sign_in_count: function() {
            return this.wyInfo['sign_in_count'];
        },

        get_point_rank: function() {
            return this.wyInfo['point_rank'];
        },

        get_add_point: function() {
            var app_point = this.wyInfo['has_signed_in']? this.wyInfo['add_point'] : 0;
            return app_point;
        },

        get_total_point: function() {
            return this.wyGoods['total_point'];
        },

        set_total_point: function(total_point) {
            this.wyGoods['total_point'] = total_point;
            this.wyInfo['total_point'] = total_point;
            this.trigger('update', this.wyInfo, store);
        },

        get_id: function() {
            return this.wyGoods.goods_list[0]['id'];
        },

        get_thumbnail: function() {
            return this.wyGoods.goods_list[0]['thumbnail'];
        },

        get_name: function() {
            return this.wyGoods.goods_list[0]['name'];
        },

        get_price: function() {
            return this.wyGoods.goods_list[0]['price'];
        },

        get_cost_point: function() {
            return this.wyGoods.goods_list[0]['cost_point'];
        },

        get_detail_desc: function() {
            return this.wyGoods.goods_list[0]['detail_desc'];
        },

        get_detail_url: function() {
            return this.wyGoods.goods_list[0]['detail_url'];
        },

        is_requesting: function() {
            return !!this._requesting;
        },

        is_inited: function() {
            return !!this._inited;
        }
    });

    $.extend(store, events);

    return store;
});/**
 * H5签到页UI逻辑
 * @author jameszuo
 * @date 13-3-25
 */
define.pack("./ui",["lib","common","$","./picker.city_data","./picker.MobileSelectArea","./tmpl","./store","./mgr"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        Module = lib.get('./Module'),
        router = lib.get('./router'),
        dateformat  = lib.get('./dateformat'),
        widgets = common.get('./ui.widgets'),
        browser = common.get('./util.browser'),
        session_event = common.get('./global.global_event').namespace('session_event'),

        city_data = require('./picker.city_data'),
        MobileSelectArea = require('./picker.MobileSelectArea'),

        tmpl = require('./tmpl'),
        store = require('./store'),
        mgr = require('./mgr'),

        cities = {'北京':1,'上海':1,'天津':1,'重庆':1},
        undefined;

    var ui = new Module('sign_ui', {

        render: function () {
            if(this._rendered) {
                return;
            }

            this._$err = $('.error-dialog');
            var paths = location.pathname.split('/'),
                cur_path = paths && paths[paths.length-1],
                hash = location.hash? location.hash.slice(1) : '';
            router.init(cur_path);
            if(hash) {
                router.go(hash);
            }
            this._bind_events();
            this._rendered = true;
        },

        _bind_events: function() {
            var me = this;
            $('#act_personal').on('touchend', '[data-id]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-id]'),
                    action_name = $target.attr('data-id'),
                    jump_map = {
                        'address': '//h5.weiyun.com/activities/address',
                        'records': '//h5.weiyun.com/activities/records',
                        'rule': 'https://kf.qq.com/touch/sappfaq/160413VVZJve1604136vQ3aA.html?scene_id=kf1524'
                    };
                location.href = jump_map[action_name];
            });

            $('.personal-center').on('touchend', function(e){
                location.href = '//h5.weiyun.com/activities/personal'
            });

            $(document.body).on('touchend', '[data-action]', function(e) {
                //e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');

                var item_id = $(this).attr('data-id'),
                    item_name = $(this).attr('data-name');

                switch(action_name) {
                    case 'sign_in':
                        if(store.has_signed_in()){
                            $("#frist").hide();
                            $("#second").show();
                        }else{
                            me.trigger('action','sign_in');
                        }
                        router.go('gift');
                        break;

                    case 'save_address':
                        me.check_addr();
                        break;

                    //case 'act_vip':
                    //    location.href = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://act.qzone.qq.com%2FmobileAct%2Findex.html%3FactId%3D57046b0a1eaecca610506491';
                    //    break;

                    case 'exchange':
                        if(!$(this).hasClass('not-enough') && item_id) {
                            me.trigger('action', action_name, item_id);
                        } else if(!$(this).hasClass('not-enough') && item_name) {
                            me.do_exchange($target);
                        }
                        break;

                    case 'cancel':
                        $('.num-dialog').hide();
                        break;

                    case 'confirm':
                        if(item_name === 'confirm') {
                            me.trigger('action', 'confirm', item_id);
                        } else {
                            $('.success-dialog').hide();
                        }
                        break;

                    default:
                        me.trigger('action', action_name);
                }
            });

            this.listenTo(store, 'update', function(info) {
                me.show_result(info, true);
            }).listenTo(store, 'load_done', function(data) {
                me.render_goods(data);
            }).listenTo(store, 'load_fail', function(msg, ret) {
                me._err_msg(msg);
            }).listenTo(store, 'refresh', function(info) {
                me.refresh(info);
            });

            this.listenTo(router, 'change', function(to, from) {
                if(from === 'activities' && to === 'gift') {
                    this.hide();
                    $("#frist").hide();
                    $("#second").show();
                } else if(from === 'gift' && to === 'gift') {
                    this.hide();
                    $("#frist").hide();
                    $("#second").show();
                } else if(from === 'gift'){
                    this.hide();
                    $("#frist").show();
                    $("#second").hide();
                }
            });
        },

        do_exchange: function(cur_btn) {
            var data_name = cur_btn.attr('data-name'),
                $parent = cur_btn.parent(),
                _text = '消耗' + $parent.find('.num').text() + '积分兑换' + $parent.find('.description').text();
            $('.num-dialog [data-name=confirm_text]').text(_text);
            $('.num-dialog [data-name=confirm]').attr('data-id', data_name);
            $('.num-dialog').show();

            var success_msg = data_name == '1'? '已开通' + $parent.find('.description').text() : '已兑换' + $parent.find('.description').text();
            $('.success-dialog .tips').text(success_msg);
        },

        hide: function() {
            $('.num-dialog').hide();
            $('#check_order').hide();
            $('#order_result').hide();
        },

        check_order: function(good, addr) {
            if(!this._$el) {
                this._$el = $(tmpl.order({
                    good: good,
                    addr: addr
                })).appendTo(document.body);
            } else {
                var city = addr.city==='0'? '' : addr.city;
                var province = (addr.province && addr.province !== '0')? (cities[addr.province]? '' : addr.province + '省') : '';
                var head_url = '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/gift-' + good.get_prizeid() + '.jpg';
                this._$el.find('.trblBor img').attr('src', head_url);
                this._$el.find('.main p.text').text(good.get_name());
                this._$el.find('.integral-num .num').text(good.get_score());
                this._$el.find('.personal .name span').text('收件人：' + addr.name);
                this._$el.find('.personal .num span').text(addr.phone);
                this._$el.find('.personal .address span').text(province + city + addr.addr);
                this._$el.find('#confirm_order').css('data-id',good.get_id());
            }
            if(!$('.information-list').hasClass('disable')) {
                $('.information-list').on('touchend', function(e){
                    location.href = '//h5.weiyun.com/activities/address'
                });
                $('.information-list').addClass('disable');
            }

            $('#second').hide();
            $('#check_order').show();

            var me = this;
            $('#confirm_order').on('click', function() {
                var item_id = $(this).attr('data-id');
                me.trigger('action', 'confirm', item_id);
            });
        },

        show_result: function(info, is_succeed) {
            var $check_order = $('#check_order'),
                $order_result = $('#order_result');

            if(is_succeed) {
                var text = '拥有<span class="integral-num integral-num-1" style="width: auto;">' + info.total_point + '</span>积分';
                $('#total_point').html(text);

                $order_result.find('.result-wrap').removeClass('fail').addClass('success');
                $order_result.find('#remain_score').text(info.total_point);
                $order_result.find('.result-wrap .tip').text('兑换成功，我们会尽快发货');
                $order_result.find('.shop-list').show();
                $order_result.find('.address-wrap').show();
                this.update(info.total_point);
            } else {
                $order_result.find('.result-wrap').removeClass('success').addClass('fail');
                $order_result.find('.result-wrap .tip').text('未完成兑换');
                $order_result.find('.shop-list').hide();
                $order_result.find('.address-wrap').hide();
            }

            if($('.num-dialog').css('display') !== 'none') {
                $('.num-dialog').toggle(false);
                $('.success-dialog').toggle(is_succeed);
            } else {
                $check_order.hide();
                $order_result.show();
            }
        },

        render_addr: function(addr) {
            addr.city = addr.city==='0'? '' : addr.city;
            var city = (addr.province || addr.city)? (addr.province + ' ' + addr.city) : '',
                $show_address = $('#show_address'),
                $edit_address = $('#edit_address');
            $edit_address.find('[data-id=name] .info').text(addr.name || '');
            $edit_address.find('[data-id=phone] .info').text(addr.phone || '');
            $edit_address.find('[data-id=city]').attr('value', city);
            $edit_address.find('[data-id=addr] .info').text(addr.addr || '');
            $edit_address.find('.red').removeClass('red');
            $edit_address.find('[data-id]').focus(function() {
                 $(this).removeClass('red');
            });
            $show_address.hide();
            $edit_address.show();

            if(!$edit_address.hasClass('disable')) {
                var selectArea = new MobileSelectArea();
                selectArea.init({trigger:$('#txt_area'),value:$('#hd_area').val(),level:2, default: 1,data: city_data.data});
                $edit_address.addClass('disable');
            }
        },

        show_addr: function(addr) {
            addr.city = addr.city==='0'? '' : addr.city;
            var province = (addr.province && addr.province !== '0')? (cities[addr.province]? '' : addr.province + '省') : '';
            var $show_address = $('#show_address'),
                $edit_address = $('#edit_address');
            $show_address.find('[data-id=name]').text(addr.name || '');
            $show_address.find('[data-id=phone]').text(addr.phone || '');
            $show_address.find('[data-id=addr]').text((province + addr.city + addr.addr) || '');

            if(addr.name === '0') {
                $show_address.find('[data-id=no_address]').show();
                $show_address.find('[data-id=address_info]').hide();
            } else {
                $show_address.find('[data-id=no_address]').hide();
                $show_address.find('[data-id=address_info]').show();
            }
            $edit_address.hide();
            $show_address.show();
        },

        check_addr: function() {
            var $edit_address = $('#edit_address'),
                area = $('.info-input')[0].value.split(' '),
                _data = {
                login_type: 3,
                actid: 360,
                addr: $edit_address.find('[data-id=addr]').text(),
                city: (area.length>1 && area[1])? area[1] : '0',
                id_number: '',
                mail: '',
                name: $edit_address.find('[data-id=name]').text(),
                phone: $edit_address.find('[data-id=phone]').text(),
                post: '0',
                province: area.length? area[0] : '0'
            };
            if(!this.validate(_data)) {
                this.trigger('action', 'save_address', _data);
            } else {
                var err_msg = this.validate(_data);
                $edit_address.find('[data-id=' + err_msg + ']').addClass('red');
            }
        },

        validate: function(data) {
            if(!data.name) {
                return 'name';
            } else if(!this.is_phone_number(data.phone)) {
                return 'phone';
            } else if(!data.province || (cities[data.province] &&  data.city === '0')) {
                return 'city';
            } else if(! data.addr) {
                return 'addr';
            }
            return '';
        },

        is_phone_number: function(num) {
            var reg_mobile = /^1\d{10}$/,
                reg_phone = /^0\d{2,3}-?\d{7,8}$/;
            if(reg_mobile.test(num) || reg_phone.test(num)) {
                return true;
            }
            return false;
        },

        //加减积分
        refresh: function(info) {
            var sign_in_count = parseInt(info.sign_in_count);
            var total_point = '' + info.total_point;

            var dom,
                list = [],
                pre_point = (info.total_point - info.add_point) + '',
                pre_len = pre_point.length,
                len = total_point.length,
                count = len - pre_len;

            for(var i=0; i<len; i++) {
                var num1 = i >= count? pre_point[i - count] : '',
                    is_diff = (!num1 || num1 !== total_point[i])? 'animate' : '';
                dom = '<span class="integral-num '+ is_diff + ' integral-num-' + (i + 1) +
                    '"><span class="num1">' + num1 + '</span><span class="num2">' + total_point[i] + '</span></span>';
                list.push(dom);
            }
            if(list.length) {
                $('#total_point').html('拥有' + list.join('') + '积分');
            }
            $('#checkret').text('今日已获得' + info.add_point + '积分');
            $('.checkin-box .box-title span').text(sign_in_count);
            $('.item_' + sign_in_count).addClass('on').addClass('animate');

            $("#frist").hide();
            $("#second").show();

            this.update(total_point);
        },

        retry: function() {
            $('#order_result').hide();
            $('#second').show();
        },

        update: function(total_point) {
            var good_list = $('.good');
            good_list.forEach(function(item) {
                var cost_point = parseInt($(item).find('.num').text()),
                    btn_text = $(item).find('[data-action]').text();
                if(total_point >= cost_point && btn_text === '兑换') {
                    $(item).find('[data-action]').removeClass('not-enough');
                } else {
                    $(item).find('[data-action]').addClass('not-enough');
                }
            });
        },

        //点评券只能兑换一次
        update_dianping: function(good_id) {
            var $good = $('[data-name="' + good_id +'"]');
            if($good.length) {
                $good.addClass('not-enough');
                $good.find('span').text('已兑换');
            }
        },

        _err_msg: function (tips_text) {
            var me = this;
            this._$err.find('.text').text(tips_text);
            this._$err.show();
            setTimeout(function() {
                me._$err.hide();
            }, 2000);
        }
    });

    return ui;
});
//tmpl file list:
//signin/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'act_personal': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="personal" class="app-checkin-personal" style="display: none">\r\n\
        <div class="information-list">\r\n\
            <div class="item tBor">\r\n\
                <div class="text"><span>收货地址</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
            <div class="item tBor bBor">\r\n\
                <div class="text"><span>兑换记录</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
            <div class="item rule tBor bBor">\r\n\
                <div class="text"><span>兑换规则</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'order': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="check_order" class="app-checkin-order" style="display: none">');

            var good = data.good;
            var addr = data.addr || {};
            addr.city = addr.city==='0'? '' : addr.city;
            var has_addr = (addr.name && addr.name != '0')? 'none' : '';
            var head_url = '//qzonestyle.gtimg.cn/qz-proj/wy-h5/img/gift-' + good.get_prizeid() + '.jpg';
            var cities = {'北京':1,'上海':1,'天津':1,'重庆':1};
            var province = (addr.province && addr.province !== '0')? (cities[addr.province]? '' : addr.province + '省') : '';
        __p.push('        <ul class="shop-list tBor">\r\n\
            <li class="item bBor">\r\n\
                <div class="pic trblBor"><img src="');
_p(head_url);
__p.push('"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">');
_p(good.get_name());
__p.push('</p>\r\n\
                    <p class="integral-num"><span class="num">');
_p(good.get_score());
__p.push('</span><span>积分</span></p>\r\n\
                </div>\r\n\
                <div class="right"><p class="text">X1</p></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
        <div class="address-wrap tBor bBor" style="');
_p((addr.name && addr.name !== '0')? '' : 'display: none');
__p.push('">\r\n\
            <div class="personal">\r\n\
                <div class="name"><span>收件人：');
_p(addr.name);
__p.push('</span></div>\r\n\
                <div class="num"><span>');
_p(addr.phone);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="address"><span>配送地址：');
_p(province + addr.city + addr.addr);
__p.push('</span></div>\r\n\
            <div class="way"><span>配送方式：快递（暂不支持修改）</span></div>\r\n\
        </div>\r\n\
        <div id="confirm_order" data-id="');
_p(good.get_id());
__p.push('" class="confirm-wrap tBor" style="');
_p((addr.name && addr.name !== '0')? '' : 'display: none');
__p.push('"><div class="btn"><span>提交订单</span></div></div>\r\n\
        <div class="information-list" style="');
_p((addr.name && addr.name !== '0')? 'display: none' : '' );
__p.push('">\r\n\
            <div class="item tBor bBor">\r\n\
                <div class="text"><span>您还没有添加地址</span><i class="icon icon-personal-more"></i></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
\r\n\
    <div id="order_result" class="app-checkin-order-result" style="display: none">\r\n\
        <!-- 兑换成功添加类名success，失败fail-->\r\n\
        <div class="result-wrap success">\r\n\
            <div class="result"></div>\r\n\
            <p class="tip">兑换成功，我们会尽快发货</p>\r\n\
            <p class="remain">积分余额：<span id="remain_score">85</span></p>\r\n\
            <div data-action="retry" class="again-btn"><span>重新兑换</span></div>\r\n\
        </div>\r\n\
        <ul class="shop-list tBor">\r\n\
            <li class="item bBor">\r\n\
                <div class="pic trblBor"><img src="');
_p(head_url);
__p.push('"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">');
_p(good.get_name());
__p.push('</p>\r\n\
                    <p class="integral-num"><span class="num">');
_p(good.get_score());
__p.push('</span><span>积分</span></p>\r\n\
                </div>\r\n\
                <div class="right"><p class="text">X1</p></div>\r\n\
            </li>\r\n\
        </ul>\r\n\
        <div class="address-wrap tBor bBor">\r\n\
            <div class="personal">\r\n\
                <div class="name"><span>收件人：');
_p(addr.name);
__p.push('</span></div>\r\n\
                <div class="num"><span>');
_p(addr.phone);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="address"><span>配送地址：');
_p(province + addr.city + addr.addr);
__p.push('</span></div>\r\n\
            <div class="way"><span>配送方式：快递（暂不支持修改）</span></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'ad_h5': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var background_url,
            list = data.list;
        for(var i=0; i<list.length; i++) {
            background_url = list[i].extdata['img'];
    __p.push('        <li data-id="');
_p(i);
__p.push('" class="item normal" role="button" style="background-image: url(');
_p(background_url.replace(/^http:|^https:/, ''));
__p.push(');"></li>');
 } __p.push('');

}
return __p.join("");
}
};
return tmpl;
});
