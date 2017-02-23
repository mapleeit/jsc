//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/server/mobile/modules/sign_in/index",["lib","common","$","weiyun/mobile/lib/underscore","weiyun/mobile/lib/dateformat"],function(require,exports,module){

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
//sign_in/src/ar.js
//sign_in/src/busiConfig.js
//sign_in/src/dom.js
//sign_in/src/mgr.js
//sign_in/src/picker/MobileSelectArea.js
//sign_in/src/picker/city_data.js
//sign_in/src/picker/dialog.js
//sign_in/src/router.js
//sign_in/src/signin.js
//sign_in/src/store.js
//sign_in/src/view.js
//sign_in/src/vm.js
//sign_in/src/tmpl/addr_mgr/addr_mgr.tmpl.html
//sign_in/src/tmpl/addr_mgr/edit_addr.tmpl.html
//sign_in/src/tmpl/captcha/captcha.tmpl.html
//sign_in/src/tmpl/goods_detail/exchange_success.tmpl.html
//sign_in/src/tmpl/goods_detail/goods_detail.tmpl.html
//sign_in/src/tmpl/history/history.tmpl.html
//sign_in/src/tmpl/index/index.tmpl.html
//sign_in/src/tmpl/index/more_prize.tmpl.html
//sign_in/src/tmpl/personal_center/personal_center.tmpl.html

//js file list:
//sign_in/src/ar.js
//sign_in/src/busiConfig.js
//sign_in/src/dom.js
//sign_in/src/mgr.js
//sign_in/src/picker/MobileSelectArea.js
//sign_in/src/picker/city_data.js
//sign_in/src/picker/dialog.js
//sign_in/src/router.js
//sign_in/src/signin.js
//sign_in/src/store.js
//sign_in/src/view.js
//sign_in/src/vm.js
/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define.pack("./ar",["lib","common","$","./busiConfig"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls'),
        request = common.get('./request'),
        https_tool = common.get('./util.https_tool'),
        constants = common.get('./constants');

    var busiConfig = require('./busiConfig');

    // async request
    return new Module('ar', {

        /**
         * 限时兑换
         * @param rule_id
         */
        exchange: function(rule_id) {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/activity.qzone.qq.com/fcg-bin/fcg_open_qzact_exchange_weiyun?login_type=3&actid=360&ruleid=' + rule_id + '&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if (result.code === 0) {
                        def.resolve(result.data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneExchangeAJAX'
                        })
                    }
                }
            });

            return def;
        },

        /**
         * 抽奖
         * @param rule_id
         * @return {*}
         */
        lottery: function (rule_id) {
            if(this.isloading){
                return;
            }
            this.isloading = true;

            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/activity.qzone.qq.com/fcg-bin/fcg_open_qzact_lottery_weiyun?login_type=3&actid=360&ruleid=' + rule_id + '&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                url : _url,
                data: {},
                dataType: 'jsonp',
                timeout: 10000,
                success: function(result){
                    me.isloading = false;
                    if (result.code === 0) {
                        def.resolve(result.data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneLotteryAJAX'
                        })
                    }
                }
            });

            return def;
        },

        save_address: function(data) {
            $.extend(data, {
                login_type: 3,  // login_type为3的前提下，根据cookie里的那个appid为10002的情况下才去你们微云那边鉴权。
                format: 'json', // 确定回包为json，不加的话会返回jsonp
                actid: 360      // 活动id
            });
            if(this.isloading){
                return;
            }
            this.isloading = true;
            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/p/activity/fcg-bin/fcg_open_qzact_set_addr?g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                type: 'POST',
                url : _url,
                data: data,
                timeout: 10000,
                success: function(result){
                    result = JSON.parse(result);
                    me.isloading = false;
                    if(result.code === 0) {
                        def.resolve(data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneSetAddressAJAX'
                        });
                    }
                }
            });

            return def;
        },

        get_history: function () {
            if(this.isloading){
                return;
            }
            this.isloading = true;
            var def = $.Deferred();
            var gtk = this._get_gtk(),
                wx_gtk = this._get_wxtk(),
                _url = constants.HTTP_PROTOCOL + '//h5.weiyun.com/proxy/domain/activity.qzone.qq.com/fcg-bin/fcg_open_qzact_record?login_type=3&actid=360&g_tk=' + gtk + '&wx_tk='+ wx_gtk,
                me = this;

            $.ajax({
                type: 'GET',
                url : _url,
                data: {
                    format: 'json'
                },
                timeout: 10000,
                success: function(result){
                    result = JSON.parse(result);
                    me.isloading = false;
                    if(result.code === 0) {
                        def.resolve(result.data);
                    } else {
                        def.reject({
                            msg: result.message,
                            ret: result.code,
                            cmd: 'qzoneGetHistoryAJAX'
                        });
                    }
                }
            });

            return def;
        },

        // private method

        /**
         * 计算gtk
         * @return {number}
         * @private
         */
        _get_gtk : function() {
            var hash = 5381, skey = cookie.get('skey');

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
        }


    });
});define.pack("./busiConfig",[],function(require, exports, module) {
    return {
        "giftClassSlash" : '-',
        'indexShowCategories' : ['人气推荐', '腾讯公仔'],
        'numLimitMap' : {
            '人气推荐' : 3,
            '腾讯公仔' : 4
        }
    }
});/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define.pack("./dom",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Module = lib.get('./Module');

    return new Module('dom', {
        // common
        get_$body: function() {
            var me = this;

            return me.$body || (me.$body = $('.base_main_div'));
        },

        get_$all_container: function() {
            var me = this;

            return $('.j-container');
        },

        // index
        get_$index_container: function() {
            var me = this;

            return me.$index_container || (me.$index_container = $('.j-index-container'));
        },

        get_$personal_center: function() {
            var me = this;

            return me.$personal_center || (me.$personal_center = $('.j-personal-center'));
        },

        get_$item_gift: function() {
            var me = this;

            return me.$item_gift || (me.$item_gift = $('.j-item-gift'));
        },

        get_$more_bar: function() {
            var me = this;

            return me.$more_bar || (me.$more_bar = $('.j-more-bar'));
        }
    });
});/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define.pack("./mgr",["lib","common","$","./router","./dom","./ar","./vm","./store","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Mgr = lib.get('./Mgr'),
        logger = common.get('./util.logger');

    var router = require('./router'),
        dom = require('./dom'),
        ar = require('./ar'),
        vm = require('./vm'),
        store = require('./store'),
        tmpl = require('./tmpl');

    // 空奖品ID
    var EMPTY_PRIZE_ID = 13144;

    return new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
            this.observe(this.ar);
            this.observe(this.store);
            this.observe(this.router);

            this.data = this.store.get_data();

            this.console_log = [];
        },

        // hash change
        on_hash_change: function (hash) {
            var me = this;
            this.console_log.push('[HASH_CHANGE]: ' + hash);

            switch (hash) {
                case "sign_in":
                    this.view.hide_all_container();
                    this.view.render_$sign_in();

                    break;
                case "more_prize":
                    this.view.hide_all_container();
                    this.view.render_$more_prize(this.data);

                    break;
                case "goods_detail":
                    this.view.hide_all_container();
                    this.view.render_$goods_detail(this.data);

                    // 进入详情页则记录详情页面物品信息
                    this.console_log.push(
                        '[goods_detail]: ',
                        '__prizeid:' + this.store.get('__prizeid'),
                        '__ruleid:' + this.store.get('__ruleid')
                    );

                    break;
                case "exchange_success":
                    this.view.hide_all_container();
                    this.view.render_$exchange_success(this.data, true);

                    break;
                case "history":
                    // 页面中有操作可能导致history数据变更，故先脏检查
                    ar.get_history().done(function (data) {
                        var isDirty = !_.isEqual(data, me.data.qzRecords);

                        // 若脏，则更新数据
                        if (isDirty) {
                            me.data.qzRecords = data;
                            me.store.update('qzRecords', data);
                        }

                        me.view.hide_all_container();
                        me.view.render_$history(me.data, isDirty);
                    }).fail(function (err) {
                        me.console_log.push(
                            '[GO_HISTORY_GET_AJAX]: ',
                            '（前往"我的物品"时进行脏检查，拉取数据失败）',
                            'err info: ' + JSON.stringify(err)
                        );
                        logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
                    });

                    break;
                case "personal_center":
                    this.view.hide_all_container();
                    this.view.render_$personal_center();

                    break;
                case "address_manage":
                    this.view.hide_all_container();
                    this.view.render_$address_manage(this.data);

                    break;
                case "edit_address":
                    this.view.hide_all_container();
                    this.view.render_$edit_address(this.data);

                    break;
            }
        },

        on_go_goods_detail: function (prizeid, ruleid, pathway) {
            this.store.set('__prizeid', prizeid);
            this.store.set('__ruleid', ruleid);
            this.store.set('__pathway', pathway);

            router.go('goods_detail');
        },

        on_go_exchange_success: function (prizeid, ruleid, pathway) {
            this.store.set('__prizeid', prizeid);
            this.store.set('__ruleid', ruleid);
            this.store.set('__pathway', pathway);

            router.go('exchange_success');
        },

        on_go_sign_in: function () {
            router.go('sign_in');
        },

        on_go_personal_center: function () {
            router.go('personal_center');
        },

        on_go_address_manage: function () {
            router.go('address_manage');
        },

        on_go_edit_address: function (e) {
            if ($(e.target).closest('button').hasClass('disable')) {
                return;
            }
            router.go('edit_address');
        },

        on_go_history: function () {
            router.go('history');
        },

        on_go_more_prize: function () {
            router.go('more_prize');
        },

        /**
         * 删除地址
         * @param e
         */
        on_remove_address: function (e) {
            var me = this;
            // 无删除cgi，只能置0，置空也不行
            var data = {
                addr: '0',
                city: '北京市',
                id_number: '',
                mail: '',
                name: '0',
                phone: '0',
                post: '0',
                province: '北京'
            };

            ar.save_address(data).done(function (data) {
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);

                store.update('address', data);
                me.view.render_$address_manage(store.get_data(), true);
                me.view.render_$edit_address(store.get_data(), true, true);
            }).fail(function (err) {
                me.view.reminder.error('删除地址失败：' + err.msg);
                me.console_log.push(
                    '[delete_address_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },

        /**
         * 保存编辑好的地址
         * @param e
         */
        on_confirm_edit_address: function (e) {
            var me = this;
            // 禁止点击
            if ($(e.target).hasClass('disable')) {
                return;
            }

            ar.save_address(store.get('address')).done(function (data) {
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);

                me.view.render_$address_manage(store.get_data(), true);
                me.view.render_$exchange_success(store.get_data(), true);
                router.back();
            }).fail(function (err) {
                me.view.reminder.error('保存地址失败：' + err.msg);
                me.console_log.push(
                    '[save_address_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },

        /**
         * 点击"兑换"弹出确认兑换弹框
         */
        on_popup_exchange_dialog: function (e) {
            var me = this;
            me.view.show_exchange_dialog(e);
        },

        /**
         * 收回兑换弹框
         * @param e
         */
        on_withdraw_exchange_dialog: function (e) {
            var me = this;
            me.view.hide_exchange_dialog(e);
        },

        /**
         * 确认兑换
         */
        on_confirm_exchange: function (e) {
            var me = this;
            var err;

            if ($(e.target).closest('.j-exchange-confirm').hasClass('disable')) {
                return;
            }

            // check score
            if (err = me._check_score()) {
                me.console_log.push(
                    '[confirm_exchange_check_score]:',
                    'need_score: ' + err.need_score,
                    'have_score: ' + err.have_score
                );
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 655012, 2);
                me.view.reminder.error(err.msg);
                return;
            }

            ar.exchange(this.store.get('__ruleid')).done(function (data) {
                // status change
                var costScore = Number($(e.target).closest('.j-dialog').find('.j-exchange-price-list .act').text());
                store.set('signInInfo', {
                    total_point: store.get('signInInfo').total_point - costScore
                });

                me.router.go('exchange_success');
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);
            }).fail(function (err) {
                me.view.reminder.error('兑换失败：' + err.msg);

                me.console_log.push(
                    '[confirm_exchange_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },

        on_confirm_lottery: function (e) {
            var me = this,
                err;
            var $dialog = $(e.target).closest('.j-dialog');

            if ($(e.target).closest('.j-exchange-confirm').hasClass('disable')) {
                return;
            }

            // check score
            if (err = me._check_score()) {
                me.console_log.push(
                    '[confirm_lottery_check_score]:',
                    'need_score: ' + err.need_score,
                    'have_score: ' + err.have_score
                );
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 655022, 2);
                me.view.reminder.error(err.msg);
                return;
            }

            // yes :
            ar.lottery(this.store.get('__ruleid')).done(function (data) {
                // status change
                var costScore = Number($dialog.find('.j-exchange-price-list .act').text()),
                    newTotalPoint = store.get('signInInfo').total_point - costScore;
                store.set('signInInfo', {
                    total_point: newTotalPoint
                });
                $dialog.find('.j-total-point').text('（你的金币剩余'+ newTotalPoint +'）');
                var indexSigninText = dom.get_$index_container().find('.j-signin-text').text();
                dom.get_$index_container().find('.j-signin-text').text(indexSigninText.split('：')[0] + '：' + newTotalPoint);


                if (data) {
                    var item = data[0];
                }

                if (item.prizeid === EMPTY_PRIZE_ID) {
                    // 未抽中
                    me.view.render_lottery_fail_pop();
                } else {
                    me.on_go_exchange_success(item.prizeid, item.ruleid, 'lottery');
                }
                // me.router.go('exchange_success');
                logger.dcmdWrite(me.console_log, 'sign_in_monitor', 0, 0);
            }).fail(function (err) {
                me.view.reminder.error('兑换失败：' + err.msg);

                me.console_log.push(
                    '[confirm_lottery_error]:',
                    'err.msg: ' + err.msg,
                    'err.ret: ' + err.ret,
                    'err.cmd: ' + err.cmd
                );

                logger.dcmdWrite(me.console_log, 'sign_in_monitor', err.ret, 1);
            });
        },


        // private method
        _validate: function (data) {
            if(data.name === '0') {
                return 'name';
            } else if(data.phone === '0') {
                return 'phone';
            } else if(data.addr === '0') {
                return 'addr';
            }
            return '';
        },

        /**
         * 兑换时检查拥有积分是否大于兑换需要积分
         * @private
         */
        _check_score: function () {
            var me = this;
            var costScore = Number($('.j-exchange-price-list').find('.act').text());
            if (me.store.get('signInInfo').total_point < costScore) {
                return {
                    msg: '您的积分不足',
                    have_score: me.store.get('signInInfo').total_point,
                    need_score: costScore
                };
            }
        }
    });
});define.pack("./picker.MobileSelectArea",["$","./picker.dialog"],function(require, exports, module) {
    var $ = require('$');

    require("./picker.dialog");

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
            var level = parseInt(this.settings.level);
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
});define.pack("./picker.dialog",["$"],function(require, exports, module) {
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
        var html, action;
        if (settings.type === "alert") {
            var alert = new Dialog();
            html = '<div class="ui-alert-title">' + settings.content + '</div>';
            action = '';
            if (settings.button) {
                if (typeof settings.button == 'boolean') {
                    settings.button = '确定';
                }
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
            html = '<div class="ui-confirm-title">' + settings.content + '</div>';
            action = '';
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
    };
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
    };
    var Dialog = function() {
        var rnd = Math.random().toString().replace('.', '');
        this.id = 'dialog_' + rnd;
        this.settings = {};
        this.settings.closeTpl = $('<span class="ui-dialog-close js-dialog-close">x</span>');
        this.settings.titleTpl = $('<div class="ui-dialog-title"></div>');
        this.timer = null;
        this.showed = false;
        this.mask = $();
    };
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
            //noinspection JSJQueryEfficiency
            $('body').append('<div class="ui-dialog" id="' + this.id + '"></div>');
            this.dialogContainer = $('#' + this.id);
            var zIndex = this.settings.zIndex || 10;
            this.dialogContainer.css({
                'zIndex': zIndex
            });
            if (this.settings.className) {
                this.dialogContainer.addClass(this.settings.className);
            }
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
            }
            $(this.dialogContainer).on('click', '.js-dialog-close', function() {
                _this.hide();
                return false;
            });
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
    };
    return Dialog;
});/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";


define.pack("./router",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        events = lib.get('./events'),

        undefined;

    var router = new Module('router', {

        init: function(root_path) {
            var me = this;
            if(root_path) {
                location.hash = '#' + root_path;
            }

            $(window).on('hashchange', function(e) {
                if(location.hash) {
                    me.trigger('action', 'hash_change', location.hash.slice(1));
                }
            });
        },

        go: function(path) {
            location.hash = '#' + path;
        },

        back: function () {
            window.history.back();
        }
    });

    return router;
});/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";


define.pack("./signin",["$","lib","common","./store","./ar","./view","./mgr","./router"],function (require, exports, module) {

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
        store = require('./store'),
        ar = require('./ar'),
        view = require('./view'),
        mgr = require('./mgr'),
        router = require('./router'),

        undefined;

    var signin = new Module('signin', {

        init: function(data) {
            // hash init
            var paths = location.pathname.split('/'),
                cur_path = paths && paths[paths.length-1],
                hash = location.hash? location.hash.slice(1) : '';
            router.init(cur_path);
            if (hash) {
                router.go(hash);
            }

            store.init(data);
            view.render();
            mgr.init({
                view: view,
                ar: ar,
                store: store,
                router: router
            });
        }
    });


    return signin;
});/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";


define.pack("./store",["lib","common","$","./vm"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        events = lib.get('./events'),

        undefined;

    var vm = require('./vm');

    var cache;

    var store = new Module('store', {

        init: function(data) {
            cache = data;
        },

        get_data: function () {
            return cache;
        },

        set: function (key, value) {
            cache[key] = value;
        },

        get: function (key) {
            return cache[key];
        },

        update: function (key, value) {
            if (!cache[key]) {
                this.set(key, value);
            } else {
                if (typeof value === 'object') {
                    this.set(key, $.extend(this.get(key), value))
                } else {
                    this.set(key, value);
                }
            }
        }

    });

    return store;
});/**
 * Created by maplemiao on 09/12/2016.
 */
"use strict";

define.pack("./view",["lib","common","$","./dom","./tmpl","./vm","./store","./picker.city_data","./picker.MobileSelectArea"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var widgets = common.get('./ui.widgets'),
        Module = lib.get('./Module');

    var dom = require('./dom'),
        tmpl = require('./tmpl'),
        vm = require('./vm'),
        store = require('./store');

    var city_data = require('./picker.city_data'),
        MobileSelectArea = require('./picker.MobileSelectArea');

    return new Module('view', {
        render: function (data) {
            if(this._rendered) {
                return;
            }

            this.reminder = widgets.reminder;
            this.confirm = widgets.confirm;

            this._bind_events();
            this.render_$sign_in();
            this._rendered = true;
        },

        render_$sign_in: function () {
            var me = this;

            me.$sign_in = me.$sign_in || dom.get_$index_container();
            me.$sign_in.show();
        },

        render_$more_prize: function (data) {
            var me = this;

            if (me.$more_prize) {
                me.$more_prize.show();
            } else {
                me.$more_prize = $(tmpl.more_prize(vm(data).getMorePrizeListModel()));
                me.$more_prize.appendTo(dom.get_$body());
                me.$more_prize.show();
            }
        },

        render_$goods_detail: function (data) {
            var me = this;

            if (me.$goods_detail) {
                me.$goods_detail.remove();
            }

            me.$goods_detail = $(tmpl.goods_detail(vm(data).getGoodsDetailModel()));
            me.$goods_detail.appendTo(dom.get_$body());
            me.$goods_detail.show();
        },

        render_$exchange_success: function (data, updateFlag) {
            var me = this;

            if (me.$exchange_success) {
                if (updateFlag) {
                    var $new = $(tmpl.exchange_success(vm(data).getExchangeSuccessModel()));
                    me.$exchange_success.replaceWith($new);
                    me.$exchange_success = $new;
                }

                me.$exchange_success.show();
            } else {
                me.$exchange_success = $(tmpl.exchange_success(vm(data).getExchangeSuccessModel()));
                me.$exchange_success.appendTo(dom.get_$body());
                me.$exchange_success.show();
            }
        },

        render_$personal_center: function (data) {
            var me = this;

            if (me.$personal_center) {
                me.$personal_center.show();
            } else {
                me.$personal_center = $(tmpl.personal_center());
                me.$personal_center.appendTo(dom.get_$body());
                me.$personal_center.show();
            }
        },

        render_$address_manage: function (data, updateFlag) {
            var me = this;

            if (me.$address_manage) {
                if (updateFlag) {
                    var $new = $(tmpl.addr_mgr(vm(data).getAddressModel()));
                    me.$address_manage.replaceWith($new);
                    me.$address_manage = $new;
                }
                me.$address_manage.show();
            } else {
                me.$address_manage = $(tmpl.addr_mgr(vm(data).getAddressModel()));
                me.$address_manage.appendTo(dom.get_$body());
                me.$address_manage.show();
            }
        },

        render_$edit_address: function (data, updateFlag, hideFlag) {
            var me = this;

            if (me.$edit_address) {
                if (updateFlag) {
                    var $new = $(tmpl.edit_addr(vm(data).getAddressModel()));
                    me.$edit_address.replaceWith($new);
                    me.$edit_address = $new;
                    me._render_picker();
                }
                if (!hideFlag) {
                    me.$edit_address.show();
                }
            } else {
                me.$edit_address = $(tmpl.edit_addr(vm(data).getAddressModel()));
                me.$edit_address.appendTo(dom.get_$body());
                me.$edit_address.show();
                me._render_picker();
            }
        },

        render_$history: function (data, updateFlag) {
            var me = this;

            if (me.$history) {
                if (updateFlag) {
                    var $new = $(tmpl.history(vm(data).getHistoryModel()));
                    me.$history.replaceWith($new);
                    me.$history = $new;
                }
                me.$history.show();
            } else {
                me.$history = $(tmpl.history(vm(data).getHistoryModel()));
                me.$history.appendTo(dom.get_$body());
                me.$history.show();
            }
        },

        hide_all_container: function() {
            dom.get_$all_container().hide();
        },

        _bind_events: function () {
            var me = this;
            // common
            dom.get_$body().on('click', '[data-action]', function (e) {
                var $target = $(e.target);
                var actionName = $target.closest('[data-action]').data('action');
                switch (actionName) {
                    case "go_goods_detail":
                        me.trigger('action', actionName, $(this).data('prize-id'), $(this).data('rule-id'), $(this).data('pathway'));
                        break;

                    case "go_exchange_success":
                        me.trigger('action', actionName, $(this).data('prize-id'), $(this).data('rule-id'), $(this).data('pathway'));
                        break;

                    default:
                        // alert(actionName);
                        me.trigger('action', actionName, e);
                }
            });

            // address manage
            dom.get_$body().on('input', '.j-edit-address', function (e) {
                var $this = $(this);
                var province_city = $this.find('.j-address-province-city').val().split(' ');

                var data = {
                    name : $this.find('.j-address-name').val(),
                    addr : $this.find('.j-address-detail').val(),
                    phone: $this.find('.j-address-phone').val(),
                    province : province_city[0],
                    city: province_city[1],
                    id_number: '',
                    mail: '',
                    post: '0'
                };

                if (!me._validate(data)) {
                    store.update('address', data);
                    $this.closest('.j-container').find('.j-add-address-btn').removeClass('disable');
                } else {
                    $this.closest('.j-container').find('.j-add-address-btn').addClass('disable');
                }
            });
        },

        show_exchange_dialog: function(e) {
            $(e.target).closest('.j-container').find('.j-dialog').show();
        },

        hide_exchange_dialog: function(e) {
            $(e.target).closest('.j-container').find('.j-dialog').hide();
        },

        render_lottery_fail_pop: function () {
            var $pop = $('.j-pop');
            $pop.show();

            $pop.on('click', '.j-pop-mask', function (e) {
                $pop.hide();
            });
            $pop.on('click', '.j-pop-btn', function (e) {
                $pop.hide();
            });

        },

        // private method
        _validate: function (data) {
            if(!data.name) {
                return 'name';
            } else if(!data.phone) {
                return 'phone';
            } else if(!data.addr) {
                return 'addr';
            }
            return '';
        },

        _render_picker: function () {
            // address manage, place picker
            var selectArea = new MobileSelectArea();
            selectArea.init({
                trigger: $('#txt_area'),
                value: $('#hd_area').val(),
                level: 2,
                default: 1,
                data: city_data.data,
                callback: function () {
                    // 触发更改事件，走到event handler
                    this.trigger.trigger('input');
                }
            });
        },
    });
});/**
 * 工具函数，无状态
 * 产生视图渲染所用到的数据模型
 * Created by maplemiao on 05/12/2016.
 */
"use strict";


define.pack("./vm",["weiyun/mobile/lib/underscore","weiyun/mobile/lib/dateformat","./busiConfig"],function(require, exports, module) {
    var _ = require('weiyun/mobile/lib/underscore'),
        dateformat = require('weiyun/mobile/lib/dateformat');
    var busiConfig = require('./busiConfig');

    return function vm(data) {
        data = data || {};
        data.signInInfo = data.signInInfo || {};
        data.userInfo = data.userInfo || {};
        data.goodsList = data.goodsList || {};
        data.address = data.address || {};
        data.qzRecords = data.qzRecords || {};
        data.wyRecords = data.wyRecords || {};
        data.onlineConfig = data.onlineConfig || {};
        data.exchangeTime = data.exchangeTime || {}; // 限时兑换的时间

        /**
         * 根据ruleid拿取图片url
         * 依赖data.onlineConfig
         * @param ruleid
         * @return {string}
         * @private
         */
        function _getImageURL(ruleid) {
            data.onlineConfig.array = data.onlineConfig.array || [];

            var object = _.find(data.onlineConfig.array, function (obj) {
                return obj.ruleid === String(ruleid);
            });

            var url = (object || {}).img_url;

            return url || 'http://10.100.64.102/qz-proj/wy-h5/img/gift-11291.jpg';
        }

        /**
         * 获取限时兑换的限制时间
         * @param ruleid
         * @private
         */
        function _getLimitTime(ruleid) {
            data.exchangeTime.rule_list = data.exchangeTime.rule_list || [];

            return _.find(data.exchangeTime.rule_list, function (item) {
                return item.rule_id == ruleid;
            });
        }

        // underscore未提供深拷贝，hack。
        // https://github.com/jashkenas/underscore/issues/162
        // 注意：不能clone原型和方法
        function _deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        /**
         * 把兑换规则按照规则"分类{slash}名称"整理
         * @private
         */
        function _getRuleClassList(goodsList) {
            goodsList = goodsList || {};
            var list = _deepClone(goodsList);
            list = list.rule || {};

            var key, item, name, category,
                ruleClassList = {},
                slash = busiConfig.giftClassSlash;

            for (key in list) {
                if (list.hasOwnProperty(key)) {
                    item = list[key];

                    // "分类{slash}名称"
                    name = item.name || '';

                    // 忽略没有正确命名的规则
                    if (!name.split(slash)[1]) {
                        continue;
                    }

                    category = name.split(slash)[0] || '';
                    name = name.split(slash)[1] || '';

                    if (!ruleClassList[category]) {
                        ruleClassList[category] = [];
                        ruleClassList[category].push(_.extend(item, {
                            'ruleid': key,
                            'name': name,
                            'category': category,
                            'tlimit': _getLimitTime(key)
                        }));
                    } else {
                        ruleClassList[category].push(_.extend(item, {
                            'ruleid': key,
                            'name': name,
                            'category': category,
                            'tlimit': _getLimitTime(key)
                        }));
                    }
                }
            }

            return ruleClassList;
        }

        /**
         * 获取首页顶部签到模块数据展示模型
         * @param signInInfo
         */
        function getSignInModel(signInInfo) {
            signInInfo = signInInfo || {};
            var has_signed_in = signInInfo.has_signed_in || false,
                sign_in_count = signInInfo.sign_in_count || 0,
                total_point = signInInfo.total_point || 0;
            var i, signInList = [];
            for (i = 0; i < 7; i++) {
                signInList.push({
                    'index' : i,
                    'text' : (i + 1) === sign_in_count ? '今天' : '第' + (i + 1) + '天',
                    'score': i * 5 + 5,
                    'signed': (i + 1) <= sign_in_count
                });
            }

            return {
                __hasSignedIn: has_signed_in,
                __signInCount : sign_in_count,
                __totalPoint: total_point,
                __signInListModel : signInList
            }
        }

        /**
         * 获取首页奖品数据模型
         * @param goodsList
         * @param onlineConfig
         */
        function getIndexGiftListModel(goodsList, onlineConfig) {
            goodsList = goodsList || {};
            var ruleClassList = _getRuleClassList(goodsList) || {};

            var i, j, len, item, it, numLimit, obj,
                indexGiftListModel = {},
                indexShowCategories = busiConfig.indexShowCategories;
            var rules = goodsList.rule || {};

            for (i = 0, len = indexShowCategories.length; i < len; i++) {
                item = indexShowCategories[i];

                it = ruleClassList[item];
                if (!it) {
                    return {};
                }
                for (j = 0; j < it.length; j++ ) {
                    if (it[j]) {
                        var beginTime = !!it[j].tlimit ? it[j].tlimit.begin_time : '00:00:00',
                            endTime = !!it[j].tlimit ? it[j].tlimit.end_time : '24:00:00',
                            totalLeft = (it[j].budget || {}).left || 0,
                            dailyLeft = (it[j].daily_budget || {}).left || 0,
                            isEmpty = totalLeft === 0 || dailyLeft === 0,
                            timeValid = beginTime < dateformat(+new Date(), 'HH:MM:ss') && dateformat(+new Date(), 'HH:MM:ss') < endTime;

                        obj = {
                            'pathway': (rules[it[j].ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                            'is_empty': isEmpty,
                            'left' : totalLeft,
                            'daily_left' : dailyLeft,
                            'image_url': _getImageURL(it[j].ruleid),
                            'prizeid': it[j].prizeid || -1,
                            'ruleid' : it[j].ruleid || '',
                            'name': it[j].name || '',
                            'score': it[j].score || 0,
                            'limit': !!it[j].tlimit,
                            'limit_begin_time': beginTime,
                            'limit_end_time' : endTime,
                            'time_valid': timeValid // 处于有效时间内，即begin_time & end_time之间
                        };

                        if (!indexGiftListModel[item]) {
                            indexGiftListModel[item] = [];
                            indexGiftListModel[item].push(obj);
                        } else {
                            numLimit = (busiConfig.numLimitMap || {})[item] || 4;
                            if (indexGiftListModel[item].length < numLimit) {
                                indexGiftListModel[item].push(obj);
                            }
                        }
                    }
                }
            }
            return indexGiftListModel;
        }

        /**
         * 获取"查看更多"页面数据模型
         * @param goodsList
         * @return {Array}
         */
        function getMorePrizeListModel(goodsList) {
            goodsList = goodsList || {};
            var ruleClassList = _getRuleClassList(goodsList) || {};

            var j, item, it, key,
                result,
                // 当前已空礼品
                currentEmptyList = [],
                // 当前时间未到还不能兑换或者抽取的礼品
                currentInvalidList = [],
                // 当前可以兑换的礼品
                currentValidList = [];
            var rules = goodsList.rule || {};

            for (key in ruleClassList) {
                if (ruleClassList.hasOwnProperty(key)) {
                    item = ruleClassList[key];

                    for (j = 0; j < item.length; j++) {
                        it = item[j];

                        var beginTime = !!it.tlimit ? it.tlimit.begin_time : '00:00:00',
                            endTime = !!it.tlimit ? it.tlimit.end_time : '24:00:00',
                            totalLeft = (it.budget || {}).left || 0,
                            dailyLeft = (it.daily_budget || {}).left || 0,
                            isEmpty = totalLeft === 0 || dailyLeft === 0,
                            timeValid = beginTime < dateformat(+new Date(), 'HH:MM:ss') && dateformat(+new Date(), 'HH:MM:ss') < endTime;


                        it = {
                            'pathway': (rules[it.ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                            'is_empty' : isEmpty,
                            'left' : totalLeft,
                            'daily_left' : dailyLeft,
                            'image_url': _getImageURL(it.ruleid),
                            'prizeid': it.prizeid || -1,
                            'ruleid' : it.ruleid || '',
                            'name': it.name || '',
                            'score': it.score || 0,
                            'limit': !!it.tlimit,
                            'limit_begin_time': beginTime,
                            'limit_end_time' : endTime,
                            'time_valid': timeValid // 处于有效时间内，即begin_time & end_time之间
                        };

                        if (isEmpty) {
                            currentEmptyList.push(it);
                        } else {
                            if (timeValid) {
                                currentValidList.push(it);
                            } else {
                                currentInvalidList.push(it);
                            }
                        }
                    }
                }
            }

            result = currentValidList.concat(_.sortBy(currentInvalidList, 'limit_begin_time'), currentEmptyList);

            return result;
        }


        /**
         * 获取奖品详情页数据模型
         * @param goodsList
         * @param signInInfo
         */
        function getGoodsDetailModel(goodsList, signInInfo) {
            goodsList = goodsList || {};
            signInInfo = signInInfo || {};
            var ruleClassList = _getRuleClassList(goodsList) || {};
            var list = _.flatten(_.values(ruleClassList), true);

            // 这里不会有一个奖品既出现在兑换里面，也出现在抽奖里面
            // 有这种需求需要奖品上架两次
            var thisItem = _.pick(list, function (value, key, object) {
                return value.prizeid === Number(data.__prizeid);
            });

            // 如果真的大于1，那说明产品配置有问题，挑第一个展示
            thisItem = thisItem[_.keys(thisItem)[0]];

            if (!thisItem) {
                return;
            }

            var pathway = thisItem.type === 4 ? 'lottery' : 'exchange',
                beginTime = !!thisItem.tlimit ? thisItem.tlimit.begin_time : '00:00:00',
                endTime = !!thisItem.tlimit ? thisItem.tlimit.end_time : '24:00:00',
                totalLeft = (thisItem.budget || {}).left || 0,
                dailyLeft = (thisItem.daily_budget || {}).left || 0,
                isEmpty = totalLeft === 0 || dailyLeft === 0,
                timeValid = beginTime < dateformat(+new Date(), 'HH:MM:ss') && dateformat(+new Date(), 'HH:MM:ss') < endTime;
            return {
                goodsInfo: {
                    pathway : pathway,
                    is_empty: isEmpty,
                    image_url : _getImageURL(thisItem.ruleid),
                    time_valid : timeValid,
                    name : thisItem.name,
                    score: pathway === 'lottery' ? thisItem.limit[0].count_num : thisItem.score, // 抽奖每次消耗的积分使用limit.count_num
                    limit: !!thisItem.tlimit,
                    limit_begin_time: beginTime,
                    limit_end_time: endTime,
                    rule_title: pathway === 'exchange' ? '兑换规则' : '抽奖规则',
                    rule_text: pathway === 'exchange'
                        ? '本商品为分时段限时兑换礼品，每日到达指定时间方可兑换。'
                        : '本商品采用抽奖玩法获得，每次参与抽奖需要支付一定的金币。'
                },
                signInInfo: {
                    total_score: signInInfo.total_point || 0
                }
            };
        }

        function getExchangeSuccessModel(goodsList, address) {
            goodsList = goodsList || {};
            address = address || {};

            var ruleClassList = _getRuleClassList(goodsList) || {};
            var list = _.flatten(_.values(ruleClassList), true);

            var has_address = address.name && address.name !== '0',
                name = has_address ? _.escape(address.name) : '',
                addr = has_address ? _.escape(address.province + address.city + address.addr) : '',
                phone = has_address ? _.escape(address.phone) : '',
                province = has_address ? _.escape(address.province) :'',
                city = has_address ? _.escape(address.city) : '',
                detail = has_address ? _.escape(address.addr) : '';

            // 这里不会有一个奖品既出现在兑换里面，也出现在抽奖里面
            // 有这种需求需要奖品上架两次
            var thisItem = _.pick(list, function (value, key, object) {
                return value.prizeid === Number(data.__prizeid);
            });

            // 如果真的大于1，那说明产品配置有问题，挑第一个展示
            thisItem = thisItem[_.keys(thisItem)[0]];

            if (!thisItem) {
                return;
            }

            return {
                goodsInfo: {
                    pathway : thisItem.type === 4 ? 'lottery' : 'exchange',
                    image_url : _getImageURL(thisItem.ruleid),
                    name : thisItem.name,
                    score: thisItem.score,
                    limit_time: (thisItem.tlimit || {}).begin_time || '',
                    rule_title: '兑换规则',
                    rule_text: '本商品采用倒计时开放兑换玩法，倒计时结束时所有用户可以进行兑换'
                },
                addressInfo: {
                    name: name,
                    phone: phone,
                    address: addr,
                    province: province,
                    city: city,
                    detail: detail,
                    has_address: has_address
                }
            }
        }

        /**
         * 获取地址页数据模型
         * @param address
         * @return {{name: string, phone: string, address: string, province: string, city: string, detail: string, has_address: boolean}}
         */
        function getAddressModel(address) {
            address = address || {};
            var has_address = address.name && address.name !== '0',
                name = has_address ? _.escape(address.name) : '',
                addr = has_address ? _.escape(address.province + address.city + address.addr) : '',
                phone = has_address ? _.escape(address.phone) : '',
                province = has_address ? _.escape(address.province) :'',
                city = has_address ? _.escape(address.city) : '',
                detail = has_address ? _.escape(address.addr) : '';
            return {
                name: name,
                phone: phone,
                address: addr,
                province: province,
                city: city,
                detail: detail,
                has_address: has_address
            }
        }

        /**
         * 获取"我的物品"历史记录页面数据模型
         * @param qzRecords
         * @param wyRecords
         * @param goodsList
         * @return {Array}
         */
        function getHistoryModel(qzRecords, wyRecords, goodsList) {
            var result = [],
                list,
                i, j, len, item;

            goodsList = goodsList || {};
            var rules = _deepClone(goodsList).rule || {};

            var wrapVip = function wrapVip(obj) {
                return {
                    is_old: true,
                    name : obj.prizename,
                    img_url: _getImageURL(obj.ruleid), // url
                    pathway: (rules[obj.ruleid] || {}).type === 4 ? 'lottery' : 'exchange', // lottery or exchange
                    ruleid: obj.ruleid,
                    prizeid: obj.prizeid
                }
            };

            var wrapVirtualPrize = function wrapVirtualPrize(obj) {
                return {
                    is_old: Number(obj.time) < 1482768000, // 2016.12.27 00:00:00这个时间点之后兑换的礼品都是新版本的
                    name : obj.prizename,
                    img_url: _getImageURL(obj.ruleid), // url
                    pathway: (rules[obj.ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                    ruleid: obj.ruleid,
                    prizeid: obj.prizeid
                }
            };

            var wrapRealPrize = function wrapRealPrize(obj) {
                return {
                    is_old: Number(obj.time) < 1482768000, // 2016.12.27 00:00:00这个时间点之后兑换的礼品都是新版本的
                    name : obj.prizename,
                    img_url: _getImageURL(obj.ruleid), // url
                    pathway: (rules[obj.ruleid] || {}).type === 4 ? 'lottery' : 'exchange',
                    ruleid: obj.ruleid,
                    prizeid: obj.prizeid
                }
            };

            list = _deepClone(qzRecords.list || []);
            // 联合两个记录，格式化微云会员兑换记录
            for (i = 0, len = (wyRecords.records || []).length; i < len; i++) {
                item = wyRecords.records[i];
                list = list.concat({
                    time: item.redeem_time,
                    prizename: '微云会员（1个月）',
                    cost_point: item.cost_point,
                    goods_id: item.goods_id,
                    // 微云会员没走营收活动平台，自定义为1000001
                    prizeid: 1000001,
                    ruleid: 1000001,
                    type: 111 //虚拟物品 401， 实物 105， 微云会员 111
                })
            }
            // 按时间排序
            list = _.sortBy(list, 'time').reverse();

            // 生成数据模型
            for (i = 0, len = list.length; i < len; i++) {
                item = list[i];
                switch (item.type) {
                    case 111:
                        result.push(wrapVip(item));
                        break;
                    case 401:
                        result.push(wrapVirtualPrize(item));
                        break;
                    case 105:
                        result.push(wrapRealPrize(item));
                        break;
                }
            }

            return result;
        }

        return {
            // 首页vm模型
            getIndexModel: function () {
                return {
                    __signInModel: getSignInModel(data.signInInfo),
                    __giftListModel: getIndexGiftListModel(data.goodsList)
                }
            },

            getMorePrizeListModel: function () {
                return {
                    __morePrizeListModel: getMorePrizeListModel(data.goodsList)
                }
            },

            getGoodsDetailModel: function () {
                return {
                    __goodsDetailModel: getGoodsDetailModel(data.goodsList, data.signInInfo)
                }
            },

            getExchangeSuccessModel: function () {
                return {
                    __exchangeSuccessModel: getExchangeSuccessModel(data.goodsList, data.address)
                }
            },

            getAddressModel: function () {
                return {
                    __addressModel: getAddressModel(data.address)
                }
            },

            getHistoryModel: function () {
                return {
                    __historyModel: getHistoryModel(data.qzRecords, data.wyRecords, data.goodsList)
                }
            }
        }
    }
});
//tmpl file list:
//sign_in/src/tmpl/addr_mgr/addr_mgr.tmpl.html
//sign_in/src/tmpl/addr_mgr/edit_addr.tmpl.html
//sign_in/src/tmpl/captcha/captcha.tmpl.html
//sign_in/src/tmpl/goods_detail/exchange_success.tmpl.html
//sign_in/src/tmpl/goods_detail/goods_detail.tmpl.html
//sign_in/src/tmpl/history/history.tmpl.html
//sign_in/src/tmpl/index/index.tmpl.html
//sign_in/src/tmpl/index/more_prize.tmpl.html
//sign_in/src/tmpl/personal_center/personal_center.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'addr_mgr': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __addressModel = data.__addressModel || {};

        var i, j, key, len, list, item;
    __p.push('    <div class="app-checkin-address j-container" style="display: none">\r\n\
        <ul class="address-list" style="display:');
_p(__addressModel.has_address ? 'block' : 'none');
__p.push(';">\r\n\
            <li class="item">\r\n\
                <div class="address-wrap tBor bBor">\r\n\
                    <div class="content bBor">\r\n\
                        <div class="name-phone"><span class="name">');
_p(__addressModel.name);
__p.push('</span><span class="phone">');
_p(__addressModel.phone);
__p.push('</span></div>\r\n\
                        <div class="address"><span>');
_p(__addressModel.address);
__p.push('</span></div>\r\n\
                    </div>\r\n\
                    <div class="bottom">\r\n\
                        <div class="edit" data-action="go_edit_address"><i class="icon icon-edit"></i><span>编辑</span></div>\r\n\
                        <div class="trash" data-action="remove_address"><i class="icon icon-trash"></i><span>删除</span></div>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </li>\r\n\
        </ul>\r\n\
\r\n\
        <div class="no-address" style="display:');
_p(__addressModel.has_address ? 'none' : 'block');
__p.push(';">\r\n\
            <div class="no-address-bg"><p class="text">请添加新地址</p></div>\r\n\
        </div>\r\n\
        <div class="btn-wrap btn-add tBor">\r\n\
            <!-- 不可点击.disable -->\r\n\
            <button class="btn ');
_p(__addressModel.has_address ? 'disable' : '');
__p.push('" data-action="go_edit_address"><span>添加新地址</span></button>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'edit_addr': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __addressModel = data.__addressModel || {};
    __p.push('\r\n\
    <div class="app-checkin-edit j-container" style="display: none">\r\n\
    <ul class="edit-wrap j-edit-address">\r\n\
        <li class="item bBor tBor">\r\n\
            <span class="term">收货人</span>\r\n\
            <input class="content j-address-name" type="text" placeholder="" value="');
_p(__addressModel.name);
__p.push('">\r\n\
        </li>\r\n\
        <li class="item bBor">\r\n\
            <span class="term">联系方式</span>\r\n\
            <input class="content j-address-phone" type="tel" placeholder="" value="');
_p(__addressModel.phone);
__p.push('">\r\n\
        </li>\r\n\
        <li class="item bBor">\r\n\
            <span class="term">所在地区</span>\r\n\
            <!--<input type="text" class="info-input j-address-province-city" id="txt_area" value="');
_p(__addressModel.province ? __addressModel.province : '北京');
__p.push(' ');
_p(__addressModel.city ? __addressModel.city : '北京市');
__p.push('" readonly="readonly" data-value="1,1">-->\r\n\
            <input type="text" data-id="city" class="info-input content j-address-province-city" id="txt_area" value="');
_p(__addressModel.province ? __addressModel.province : '北京');
__p.push(' ');
_p(__addressModel.city ? __addressModel.city : '北京市');
__p.push('"/>\r\n\
            <input type="hidden" id="hd_area" value="1,1"/>\r\n\
        <li class="item bBor">\r\n\
            <span class="term">详细地址</span>\r\n\
            <input class="content j-address-detail" type="text" placeholder="" value="');
_p(__addressModel.detail);
__p.push('">\r\n\
        </li>\r\n\
    </ul>\r\n\
    <div class="btn-wrap tBor">\r\n\
        <!-- 不可点击.disable -->\r\n\
        <button class="btn j-add-address-btn ');
_p(__addressModel.has_address ? '' : 'disable');
__p.push('" data-action="confirm_edit_address"><span>确认</span></button>\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'captcha': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var isHttps = data.isHttps || false;
    __p.push('    <scr');
__p.push('ipt src="');
_p(isHttps ? 'https://ssl.captcha.qq.com/template/TCapIframeApi.js?clientype=1&apptype=1&aid=543009514&rand=' + Math.random()
            : 'http://captcha.qq.com/template/TCapIframeApi.js?clientype=1&apptype=1&aid=543009514&rand=' + Math.random());
__p.push('"></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        window.capInit && capInit(document, {\r\n\
            callback: function(retJson) {\r\n\
                if (retJson.ret === 0) { // 验证成功\r\n\
                    var ticket = retJson.ticket;\r\n\
                    location.href += \'?captcha_ticket=\' + ticket;\r\n\
                }\r\n\
            },\r\n\
            showHeader: false\r\n\
        });\r\n\
    </scr');
__p.push('ipt>');

return __p.join("");
},

'exchange_success': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};

        var __exchangeSuccessModel = data.__exchangeSuccessModel || {};
        var goodsInfo = __exchangeSuccessModel.goodsInfo || {};
        var addressInfo = __exchangeSuccessModel.addressInfo || {};
        var i, j, key, len, list, item;
    __p.push('<div class="app-checkin-order-result j-container" style="display: none">\r\n\
    <div class="result-wrap success">\r\n\
        <div class="result"><i class="icon icon-result"></i></div>\r\n\
        <p class="tip">');
_p(goodsInfo.pathway === 'lottery' ? '恭喜，抽中奖品' : '兑换成功');
__p.push('</p>\r\n\
        <p class="text">您可以在我的物品页面中查看兑换记录</p>\r\n\
    </div>\r\n\
    <ul class="shop-list">\r\n\
        <li class="item">\r\n\
            <div class="pic"><div class="info" style="background-image:url(');
_p(goodsInfo.image_url);
__p.push(')"></div></div>\r\n\
            <div class="main">\r\n\
                <p class="text">');
_p(goodsInfo.name);
__p.push('</p>\r\n\
                <div class="integral-num"><i class="icon icon-coin"></i><span class="num">');
_p(goodsInfo.score);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="right"><p class="text">X1</p></div>\r\n\
        </li>\r\n\
    </ul>');
 if (addressInfo.has_address) { __p.push('    <div class="address-wrap">\r\n\
        <div class="personal">\r\n\
            <div class="name"><span>收件人：');
_p(addressInfo.name);
__p.push('</span></div>\r\n\
            <div class="num"><span>');
_p(addressInfo.phone);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="address"><span>配送地址：');
_p(addressInfo.address);
__p.push('</span></div>\r\n\
        <div class="way"><span>配送方式：快递（暂不支持修改）</span></div>\r\n\
    </div>\r\n\
    <div class="btn-wrap tBor">\r\n\
        <button class="btn" data-action="go_sign_in"><span>返回商城</span></button>\r\n\
    </div>');
 } else { __p.push('    <div class="btn-wrap tBor">\r\n\
        <button class="btn" data-action="go_edit_address"><span>填写地址</span></button>\r\n\
    </div>');
 } __p.push('</div>\r\n\
');

return __p.join("");
},

'goods_detail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __goodsDetailModel = data.__goodsDetailModel || {};
        var goodsInfo = __goodsDetailModel.goodsInfo || {};
        var signInInfo = __goodsDetailModel.signInInfo || {};

        var i, j, key, len, list, item;
    __p.push('<div class="app-checkin-order j-container" style="display: none">\r\n\
    <div class="inner">\r\n\
        <div class="pic">\r\n\
            <div class="info" style="background-image:url(');
_p(goodsInfo.image_url);
__p.push(')"></div>');
 if (!goodsInfo.time_valid) { __p.push('            <p class="tip">');
_p(goodsInfo.limit_begin_time);
__p.push('开抢</p>');
 } __p.push('        </div>\r\n\
        <div class="infor">\r\n\
            <div class="main">\r\n\
                <p class="text">');
_p(goodsInfo.name);
__p.push('</p>\r\n\
                <div class="integral-num"><i class="icon icon-coin"></i><span class="num">');
_p(goodsInfo.score);
__p.push('</span></div>\r\n\
            </div>\r\n\
            <div class="right"><p class="text">X1</p></div>\r\n\
        </div>\r\n\
        <div class="address j-address" data-action="go_address_manage"><span>收货地址</span><i class="icon icon-more"></i></div>\r\n\
        <div class="rule">\r\n\
            <h4>');
_p(goodsInfo.rule_title);
__p.push('</h4>\r\n\
            <p>');
_p(goodsInfo.rule_text);
__p.push('</p>\r\n\
        </div>\r\n\
        <div class="btn-wrap tBor j-exchange-btn" data-action="popup_exchange_dialog"><button class="btn"><span>');
_p(goodsInfo.pathway === 'lottery' ? '参与抽奖' : '兑换');
__p.push('</span></button></div>\r\n\
    </div>\r\n\
\r\n\
    <!-- 弹窗浮层 -->\r\n\
    <div class="dialog j-dialog" style="display: none;">\r\n\
        <div class="box j-dialog-box">\r\n\
            <div class="hd"><button class="btn btn-close" data-action="withdraw_exchange_dialog"><i class="icon icon-close"></i></button></div>\r\n\
            <div class="bd">\r\n\
                <div class="infor">\r\n\
                    <div class="pic"><div class="info" style="background-image:url(');
_p(goodsInfo.image_url);
__p.push(')"></div></div>\r\n\
                    <div class="main">\r\n\
                        <p class="text">');
_p(goodsInfo.name);
__p.push('</p>\r\n\
                        <div class="integral-num"><i class="icon icon-coin"></i><span class="num">');
_p(goodsInfo.score);
__p.push('</span></div>\r\n\
                    </div>\r\n\
                    <div class="right"><p class="text">X1</p></div>\r\n\
                </div>\r\n\
                <div class="pay">\r\n\
                    <h5 class="title">');
_p(goodsInfo.pathway === 'lottery' ? '抽奖' : '兑换');
__p.push('支付<span class="j-total-point">（你的金币剩余');
_p(signInInfo.total_score);
__p.push('）</span></h5>\r\n\
                    <div class="price j-exchange-price-list">\r\n\
                        <!-- 选中态.act -->\r\n\
                        <span class="num act">');
_p(goodsInfo.score);
__p.push('</span>\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="btn-wrap tBor">\r\n\
                    <!-- 不可点击.disable -->\r\n\
                    <button class="btn j-exchange-confirm ');
_p(signInInfo.total_score < goodsInfo.score ? 'disable' : '' );
__p.push('" data-action="');
_p(goodsInfo.pathway === 'lottery' ? 'confirm_lottery' : 'confirm_exchange');
__p.push('"><span>');
_p(goodsInfo.pathway === 'lottery' ? '参与抽奖' : '兑换');
__p.push('</span></button>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="mask j-dialog-mask" data-action="withdraw_exchange_dialog"></div>\r\n\
    </div>\r\n\
\r\n\
    <!-- 抽奖未抽中弹窗 -->\r\n\
    <div class="pop j-pop" style="display: none;">\r\n\
        <div class="box">\r\n\
            <div class="bd">\r\n\
                <p class="text">好遗憾！差点就抽中了</p>\r\n\
            </div>\r\n\
            <div class="ft">\r\n\
                <button class="btn j-pop-btn"><span>继续加油</span></button>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="mask j-pop-mask"></div>\r\n\
    </div>\r\n\
</div>\r\n\
');

return __p.join("");
},

'history': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __historyModel = data.__historyModel || [];

        var i, j, key, item, len;
    __p.push('    <div class="app-checkin-history j-container" style="display: none">\r\n\
        <ul class="shop-list">');
 for (i = 0, len = __historyModel.length; i < len; i++) {
                item = __historyModel[i];
            __p.push('            <li class="item" ');
_p( item.is_old ? '' : 'data-action="go_exchange_success"');
__p.push(' data-prize-id="');
_p(item.prizeid);
__p.push('" data-rule-id="');
_p(item.ruleid);
__p.push('" data-pathway="');
_p(item.pathway);
__p.push('">\r\n\
                <div class="pic"><img src="');
_p(item.img_url);
__p.push('"></div>\r\n\
                <div class="main">\r\n\
                    <p class="text">');
_p(item.name);
__p.push('</p>\r\n\
                    <span class="lottery">');
_p(item.pathway === 'lottery' ? '抽奖获得' : '兑换获得');
__p.push('</span>\r\n\
                </div>\r\n\
                <!--<div class="right">-->\r\n\
                    <!--<p class="express">顺丰速递</p>-->\r\n\
                    <!--<p class="express-num">运单号:754855823238</p>-->\r\n\
                <!--</div>-->\r\n\
            </li>');
 } __p.push('            <!--<li class="item">-->\r\n\
                <!--<div class="pic"><img src="../img/checkin-exchange-gift/gift-s-11290.jpg"></div>-->\r\n\
                <!--<div class="main">-->\r\n\
                    <!--<p class="text">QQ猴年公仔QQ猴年公仔QQ猴年公仔</p>-->\r\n\
                    <!--<span class="lottery">抽奖获得</span>-->\r\n\
                <!--</div>-->\r\n\
                <!--<div class="right">-->\r\n\
                    <!--<p class="express">准备配送</p>-->\r\n\
                <!--</div>-->\r\n\
            <!--</li>-->\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'index': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var rawData = data.rawData || {};
        var vmData = data.vmData || {};
        var __signInModel = vmData.__signInModel || {},
            __giftListModel = vmData.__giftListModel || {};

        var i, j, key, len, list, item;
    __p.push('    <scr');
__p.push('ipt type="text/javascript"> console.log(');
_p(JSON.stringify(data));
__p.push(')</scr');
__p.push('ipt>\r\n\
<div class="app-checkin-exchange j-index-container j-container" style="display: none">\r\n\
    <div class="hd">\r\n\
        <button class="btn btn-personal j-personal-center" data-action="go_personal_center"><i class="icon icon-personal"></i></button>\r\n\
        <div class="infor">\r\n\
            <i class="icon icon-calendar"></i>\r\n\
            <h2 class="text">今日已签到</h2>\r\n\
            <p class="sub-text j-signin-text">已连续签到');
_p(__signInModel.__signInCount);
__p.push('天，总金币：');
_p(__signInModel.__totalPoint);
__p.push('</p>\r\n\
        </div>\r\n\
        <div class="checkin-list">\r\n\
            <ul>');
 for (i = 0, len = __signInModel.__signInListModel.length; i < len; i++ ) {
                    item = __signInModel.__signInListModel[i];
                __p.push('                <li class="item-checkin ');
_p(__signInModel.__signInCount > i + 1 ? 'on' : '');
__p.push(' ');
_p(__signInModel.__signInCount === i + 1 ? 'act' : '');
__p.push('">\r\n\
                    <div class="num"><span>+');
_p(item.score);
__p.push('</span></div>\r\n\
                    <span class="day">');
_p(item.text);
__p.push('</span>\r\n\
                </li>');
 } __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="bd">');

            for (key in __giftListModel) {
                if (__giftListModel.hasOwnProperty(key)) {
                    list = __giftListModel[key];
        __p.push('        <div class="box ');
_p(key === '人气推荐' ? 'gift-hot' : 'gift-exchange' );
__p.push('">\r\n\
            <div class="box-hd bBor"><h4>');
_p(key);
__p.push('</h4></div>\r\n\
            <div class="box-bd">\r\n\
                <ul class="gift-list clearfix">');
 for (i = 0, len = list.length; i < len; i++) {
                        item = list[i];
                    __p.push('                    <li class="item-gift rBor j-item-gift ');
_p( item.is_empty ? 'soldout' : '');
__p.push('" data-prize-id="');
_p(item.prizeid);
__p.push('" data-rule-id="');
_p(item.ruleid);
__p.push('" data-action="go_goods_detail" data-pathway="');
_p(item.pathway);
__p.push('">\r\n\
                        <div class="pic">\r\n\
                            <div class="info" style="background-image:url(');
_p(item.image_url);
__p.push(')"></div>');
 if (!item.time_valid) { __p.push('                            <p class="tip">');
_p(item.limit_begin_time);
__p.push('开抢</p>');
 } __p.push('                            ');
 if (item.is_empty) { __p.push('                            <div class="mask"><span>已抢光</span></div>');
 } __p.push('                        </div>\r\n\
                        <div class="title"><span>');
_p(item.name);
__p.push('</span></div>\r\n\
                        <div class="gift-num">');
 if (item.pathway === 'exchange') { __p.push('                            <i class="icon icon-coin"></i><span class="num">');
_p(item.score);
__p.push('</span>');
 } else if (item.pathway === 'lottery') { __p.push('                            <span class="lottery">抽奖获得</span>');
 } __p.push('                        </div>\r\n\
                    </li>');
 } __p.push('                </ul>\r\n\
            </div>\r\n\
        </div>');

                }
            }
        __p.push('        <div class="more-bar j-more-bar" data-action="go_more_prize">\r\n\
            <span>查看更多</span>\r\n\
            <i class="icon icon-more"></i>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>\r\n\
\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    var pvClickSend = function (tag) {\r\n\
        if (typeof(pgvSendClick) == "function") {\r\n\
            pgvSendClick({\r\n\
                hottag: tag,\r\n\
                virtualDomain: \'www.weiyun.com\'\r\n\
            });\r\n\
        }\r\n\
    };\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/mobile/sign_in#sign_in\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type="text/javascript">\r\n\
    window.IS_TEST_ENV = ');
_p((plug('config') || {}).isTest);
__p.push(';\r\n\
    window.IS_MOBILE = ');
_p(window['g_weiyun_info'].is_mobile);
__p.push(';\r\n\
    window.APPID = ');
_p(require('weiyun/util/appid')());
__p.push(';\r\n\
    window.g_serv_taken = ');
_p(new Date() - window['g_weiyun_info'].serv_start_time);
__p.push(';\r\n\
    window.g_start_time = +new Date();\r\n\
</scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\', \'lib\',  \'common\', \'sign_in\'], function($, lib, common, index){\r\n\
        index.get(\'./signin\').init(');
_p(JSON.stringify(rawData));
__p.push(');\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
');

return __p.join("");
},

'more_prize': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        data = data || {};
        var __morePrizeListModel = data.__morePrizeListModel || [];

        var i, j, key, len, list, item;
    __p.push('<div class="app-checkin-detail j-container" style="display: none">\r\n\
    <div class="box gift-exchange">\r\n\
        <div class="box-bd">\r\n\
            <ul class="gift-list clearfix">');
 for (i = 0, len = __morePrizeListModel.length; i < len; i++) {
                    item = __morePrizeListModel[i] || {};
                __p.push('                <!-- 礼品抢光.soldout -->\r\n\
                <li class="item-gift rBor ');
_p(item.is_empty? 'soldout' : '');
__p.push('" data-prize-id="');
_p(item.prizeid);
__p.push('" data-rule-id="');
_p(item.ruleid);
__p.push('" data-action="go_goods_detail">\r\n\
                    <div class="pic">\r\n\
                        <div class="info" style="background-image:url(');
_p(item.image_url);
__p.push(')"></div>');
 if (!item.time_valid) { __p.push('                        <p class="tip">');
_p(item.limit_begin_time);
__p.push('开抢</p>');
 } __p.push('                        <!-- 礼品抢光加上这个结构 -->');
 if (item.is_empty) { __p.push('                        <div class="mask"><span>已抢光</span></div>');
 } __p.push('                    </div>\r\n\
                    <div class="title"><span>');
_p(item.name);
__p.push('</span></div>\r\n\
                    <div class="gift-num">');
 if (item.pathway === 'exchange') { __p.push('                        <i class="icon icon-coin"></i><span class="num">');
_p(item.score);
__p.push('</span>');
 } else if (item.pathway === 'lottery') { __p.push('                        <span class="lottery">抽奖获得</span>');
 } __p.push('                    </div>\r\n\
                </li>');
 } __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>');

return __p.join("");
},

'personal_center': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="app-checkin-personal j-container" style="display: none">\r\n\
        <div class="information-list">\r\n\
            <div class="item" data-action="go_history">\r\n\
                <div class="text"><span>我的物品</span><i class="icon icon-more"></i></div>\r\n\
            </div>\r\n\
            <div class="item" data-action="go_address_manage">\r\n\
                <div class="text"><span>收货地址</span><i class="icon icon-more"></i></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
