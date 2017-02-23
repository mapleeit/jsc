//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/server/mobile/modules/capacity_purchase/index",["lib","common","$","weiyun/mobile/lib/underscore","weiyun/mobile/lib/dateformat","weiyun/mobile/lib/prettysize"],function(require,exports,module){

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
//capacity_purchase/src/ar.js
//capacity_purchase/src/busiConfig.js
//capacity_purchase/src/capacity_purchase.js
//capacity_purchase/src/dom.js
//capacity_purchase/src/mgr.js
//capacity_purchase/src/view.js
//capacity_purchase/src/vm.js
//capacity_purchase/src/tmpl/body.tmpl.html
//capacity_purchase/src/tmpl/iap.tmpl.html

//js file list:
//capacity_purchase/src/ar.js
//capacity_purchase/src/busiConfig.js
//capacity_purchase/src/capacity_purchase.js
//capacity_purchase/src/dom.js
//capacity_purchase/src/mgr.js
//capacity_purchase/src/view.js
//capacity_purchase/src/vm.js
/**
 * Created by maplemiao on 21/11/2016.
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
        https_tool = common.get('./util.https_tool');

    var busiConfig = require('./busiConfig');

    // async request
    return new Module('ar', {
        /**
         * 购买方法
         * @param options
         * @param options.ruleid
         * @param options.buy_num
         * @public
         */
        buy : function(options) {
            var me = this;

            me._goods_info_ajax(options);
        },

        get_user_info_def: function () {
            return this._user_info_ajax();
        },

        get_space_info_def: function () {
            return this._space_info_ajax();
        },
        /**
         * 登录态相关信息
         */
        sessionInfo : {
            session_type: cookie.get('login_apptoken_type') === '1' ? 'qq' : 'weixin',
            access_token: cookie.get('login_apptoken_type') === '1' ? '' : cookie.get('access_token'),
            login_apptoken_type: cookie.get('login_apptoken_type'),
            login_apptoken: cookie.get('login_apptoken'),
            login_apptoken_uid : cookie.get('login_apptoken_uid')
        },
        /**
         * 营收活动平台配置相关信息，空间营收平台使用参数
         */
        actInfo : {
            // appid是计平那边支付需要的
            // appid是qzone营收平台那边给的传手机 1450008585，PC 1450008595
            appid: IS_MOBILE ? busiConfig.QZONE_ACT_PLATFORM_APPID_MOBILE : busiConfig.QZONE_ACT_PLATFORM_APPID_PC,
            // actid和ruleid是在活动平台由后台配置的，http://actboss.cm.com/
            actid: busiConfig.QZONE_ACT_PLATFORM_ACTID,
            ruleid: 0, // override
            login_type: 3 // login_type为3才根据10002来微云后台那边鉴权
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

        /**
         * 拉取用户信息
         * @return {*}
         * @private
         */
        _user_info_ajax: function () {
            var def = $.Deferred();

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
                cmd: 'DiskUserInfoGet',
                body: {
                    is_get_weiyun_flag: true
                }
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                def.reject({
                    cmd: 'DiskUserInfoGet',
                    msg: msg,
                    ret: ret
                })
            });

            return def;
        },

        /**
         * 拉取存储空间信息
         * @return {*}
         * @private
         */
        _space_info_ajax: function () {
            var def = $.Deferred();

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
                cmd: 'DiskUserConfigGet',
                body: {
                    get_space_info: true
                }
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                def.reject({
                    cmd: 'DiskUserConfigGet',
                    msg: msg,
                    ret: ret
                })
            });

            return def;
        },

        /**
         * 拉取商品信息
         * @param {Object} options
         * @param {number} options.ruleid
         * @param {number} options.buy_num
         * @private
         */
        _goods_info_ajax : function (options) {
            var me = this;
            var ruleid = options && options.ruleid,
                buy_num = options && options.buy_num;
            me.actInfo.ruleid = ruleid;
            var goods_params = {
                appid: me.actInfo.appid,
                actid: me.actInfo.actid,
                ruleid: ruleid,
                login_type: me.actInfo.login_type,
                buy_num: buy_num, // 购买数量
                g_tk: me._get_gtk()
            };

            $.ajax({
                type: 'get',
                url: 'https://h5.weiyun.com/proxy/domain/pay.qzone.qq.com/fcg-bin/fcg_open_qzact_pic_info_openid?',
                data : goods_params,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"goods_success_callback",
                success: function(resData){
                    if (resData.code === 0 ) {
                        var params = {
                            total_price: (resData.data || {}).total_price || 0
                        };
                        $.extend(params, goods_params);
                        me._order_ajax(params);
                    } else {
                        me.trigger('action', 'goods_info_ajax_error', resData);
                    }

                },
                error: function(ret, msg) {
                    me.trigger('action', 'goods_info_ajax_error', msg);
                }
            });
        },

        /**
         * 商品下单CGI
         * @param params
         * @private
         */
        _order_ajax : function (params) {
            var me = this;
            // 这个文案显示在购买页面上，显示商品介绍
            var order_params = {
                appid: me.actInfo.appid,
                g_tk: me._get_gtk(),
                actid: params.actid,
                ruleid: params.ruleid,
                buy_num: params.buy_num,
                req_price: params.total_price,
                login_type: params.login_type,
                pfkey: 'pfkey',
                aid: 'aid', // 这个是营收后台的aid，目前没有用到，属于预埋接口，我们自己定义就好。目前查询是根据ruleid去查的
                item_pic: 'REQUEST, but not used in h5, only be used on pc',   // 商品信息，自己根据需求添加
                item_name: (busiConfig.COUPON_RULEID_INFO_MAP[params.ruleid] || {}).name, // 商品信息，自己根据需求添加
                item_desc: (busiConfig.COUPON_RULEID_INFO_MAP[params.ruleid] || {}).desc, // 商品信息，自己根据需求添加
                openid: me.sessionInfo.login_apptoken_uid,
                openkey: me.sessionInfo.session_type === 'qq' ? me.sessionInfo.login_apptoken : me.sessionInfo.access_token,
                session_type: me.sessionInfo.session_type === 'qq' ? 'skey' : 'weixin'
            };

            $.ajax({
                type: 'get',
                url: 'https://h5.weiyun.com/proxy/domain/pay.qzone.qq.com/fcg-bin/fcg_open_qzact_pic_order_openid?',
                data: order_params,
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                jsonpCallback:"order_success_callback",
                success: function (resData) {
                    if (resData.code === 0) {
                        var successUrl = location.href;
                        resData = resData && resData.data || {};

                        location.href = urls.make_url('https://pay.qq.com/h5/index.shtml', {
                            openid :  me.sessionInfo.login_apptoken_uid,
                            sessionid : me.sessionInfo.session_type === 'qq' ? 'openid' : 'hy_gameid',
                            sessiontype : me.sessionInfo.session_type === 'qq' ? 'openkey' : 'wc_actoken',
                            openkey :  me.sessionInfo.session_type === 'qq' ? '' : me.sessionInfo.access_token,
                            _wv : 1031,
                            m : 'buy',
                            c : 'goods',
                            // pf: 计平需要的，这个页面填qzone_m-cloudlet_openid-html5-androidpay就可以，找营收后台问@xiaoshuitao
                            pf :  'qzone_m-cloudlet_openid-html5-androidpay',
                            params :  resData.url_params,
                            pu : successUrl,
                            dc : 'mcard,hfpay,yb'
                            // sandbox : 1
                        }, true);
                    } else {
                        me.trigger('action', 'order_ajax_error', resData);
                    }
                },
                error: function (ret, msg) {
                    me.trigger('action', 'order_ajax_error', msg);
                }
            });
        }
    });
});define.pack("./busiConfig",[],function(require, exports, module) {
    return {
        // 空间活动平台提供的appid，手机端和PC端做区分
        "QZONE_ACT_PLATFORM_APPID_MOBILE":1450008585,
        "QZONE_ACT_PLATFORM_APPID_PC":1450008595,
        // 空间活动平台配置的活动id
        "QZONE_ACT_PLATFORM_ACTID": 630,
        // 容量和ruleid的映射
        "SPACE_RULEID_MAP": {
            "20G": 3200,
            "50G": 3201,
            "200G": 3202,
            "1T": 3203
        },
        // ruleid和容量券购买页面标题、介绍的映射
        "COUPON_RULEID_INFO_MAP": {
            "3200": {
                "name": "微云20G容量",
                "desc": "购买微云20G容量，可在现有容量基础上叠加使用"
            },
            "3201": {
                "name": "微云50G容量",
                "desc": "购买微云50G容量，可在现有容量基础上叠加使用"
            },
            "3202": {
                "name": "微云200G容量",
                "desc": "购买微云200G容量，可在现有容量基础上叠加使用"
            },
            "3203": {
                "name": "微云1T容量",
                "desc": "购买微云1T容量，可在现有容量基础上叠加使用"
            }
        },

        // 顶部Bar ： 会员专享容量大小
        "VIP_INITIAL_CAPACITY": '3T'
    }
});/**
 * Created by maplemiao on 14/11/2016.
 */
"use strict";

define.pack("./capacity_purchase",["lib","common","$","./ar","./view","./mgr"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls');
    var ar = require('./ar'),
        view = require('./view'),
        mgr = require('./mgr');


    return new Module('capacity_purchase', {
        init: function (syncData) {
            document.domain = 'weiyun.com';

            view.init(syncData);
            mgr.init({
                view: view,
                ar: ar
            });
        }
    });
});/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define.pack("./dom",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module');

    return new Module('dom', {
        get_$purchase_btn: function() {
            var me = this;

            return me.$purchase_btn || (me.$purchase_btn = $('.j-purchase-btn'));
        },

        get_$body_container: function() {
            var me = this;

            return me.$body_container || (me.$body_container = $('#body_container'));
        },

        get_$question: function() {
            var me = this;

            return me.question || (me.question = $('.j-question'));
        },

        get_$question_dropdown: function() {
            var me = this;

            return me.question_dropdown || (me.question_dropdown = $('.j-question-dropdown'));
        }
    })
});/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define.pack("./mgr",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Mgr = lib.get('./Mgr');

    return new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
            this.observe(this.ar);
        },

        on_buy_btn: function (options) {
            this.ar.buy(options);
        },

        on_goods_info_ajax_error: function (msg) {
            this.view.reminder.error('商品信息拉取失败，请稍后重试！');
        },

        on_order_ajax_error: function (msg) {
            this.view.reminder.error('商品下单失败，请稍后重试！');
        }
    });
});/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define.pack("./view",["lib","common","$","./ar","./dom","./busiConfig","./vm","./tmpl","weiyun/mobile/lib/underscore"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets');

    var ar = require('./ar'),
        dom = require('./dom'),
        busiConfig = require('./busiConfig'),
        vm = require('./vm'),
        tmpl = require('./tmpl');

    var _ = require('weiyun/mobile/lib/underscore');

    return new Module('view', {
        init: function (syncData) {
            var me = this;

            me.reminder = widgets.reminder;

            me._bind_events();
            me.data_dirty_check(syncData);
        },

        _bind_events: function () {
            var me = this;

            dom.get_$body_container().on('touchend', '.j-purchase-btn, .j-question, .j-top-div', function (e) {
                    if ($(this).hasClass('j-purchase-btn')) {
                        var type = $(this).closest('li').data('type');
                        me.trigger('action', 'buy_btn', {
                            ruleid: busiConfig.SPACE_RULEID_MAP[type],
                            buy_num: 1
                        })
                    } else if ($(this).hasClass('j-question')) {
                        var $dropdown = $(this).find('.j-question-dropdown');
                        $dropdown.toggleClass('show');
                    } else {
                        $dropdown = dom.get_$question_dropdown();
                        if ($dropdown.hasClass('show')) {
                            $dropdown.toggleClass('show');
                        }
                    }

                });
        },

        /**
         * 异步拉取数据，检查数据是否过时，需要更新UI
         * @private
         */
        data_dirty_check: function (syncData) {
            var me = this;
            
            $.when(ar.get_user_info_def(), ar.get_space_info_def())
                .done(function (r1, r2) {
                    var asyncData = vm({
                        userInfo: r1,
                        spaceInfo: r2
                    });

                    // 数据变脏则重绘页面
                    !_.isEqual(asyncData, syncData) && me.repaint(asyncData);
                })
                .fail(function (err) {
                    // 异步拉取失败，静默处理
                })
        },

        repaint: function (asyncData) {
            var me = this;

            $('#body_container').html(tmpl.bodyHTML(asyncData));
        }
    });
});/**
 * Created by maplemiao on 22/11/2016.
 */
"use strict";

define.pack("./vm",["weiyun/mobile/lib/dateformat","weiyun/mobile/lib/prettysize","./busiConfig"],function(require, exports, module) {
    var dateformat = require('weiyun/mobile/lib/dateformat'),
        prettysize = require('weiyun/mobile/lib/prettysize');

    var busiConfig = require('./busiConfig');
    return function (data) {
        data = data || {};
        var userInfo = data.userInfo || {};
        var spaceInfo = (data.spaceInfo || {}).space_info || {};

        var vipInfo = userInfo.weiyun_vip_info || {};

        var __isVip = vipInfo.weiyun_vip || false,
            __totalSpace = spaceInfo.total_space || 10 * Math.pow(1024, 3),
            __usedSpace = userInfo.used_space || 0,
            __remainSpace = (__totalSpace - __usedSpace) <= 0 ? 0 : (__totalSpace - __usedSpace),
            __initialSpace = (spaceInfo.normal_init_space || {}).space_size || 10 * Math.pow(1024, 3),
            __vipSpace = (spaceInfo.vip_init_space || {}).space_size || 0,
            __oldSpace = (spaceInfo.vip_present_space || {}).space_size || 0,
            __buySpace = spaceInfo.space_coupon_total_space || 0,

            // 会员总共初始容量组成：初始容量 + 会员特权赠送容量
            __vipInitialSpace = __initialSpace + __vipSpace,

            __initialPercent = Math.round((__initialSpace / __totalSpace) * 100),
            __vipPercent = Math.round((__vipSpace/ __totalSpace) * 100),
            __oldPercent = Math.round((__oldSpace / __totalSpace) * 100),
            __buyPercent = 100 - __initialPercent - __vipPercent - __oldPercent,

            __initialExpire = (spaceInfo.normal_init_space || {}).end_time === -1 ? '长期有效' : (dateformat((spaceInfo.normal_init_space || {}).end_time, 'yyyy-mm-dd') + '到期'),
            __vipExpire = (spaceInfo.vip_init_space || {}).end_time === -1 ? '长期有效' : (dateformat((spaceInfo.vip_init_space || {}).end_time, 'yyyy-mm-dd') + '到期'),
            __oldExpire = (spaceInfo.vip_present_space || {}).end_time === -1 ? '长期有效' : (dateformat((spaceInfo.vip_present_space || {}).end_time, 'yyyy-mm-dd') + '到期'),

            undefined;

        // 如果总容量大于1G，则用G为单位显示，否则就prettysize自动处理
        var __totalSpaceText = maxPrettysizeG(__totalSpace),
            __remainSpaceText = maxPrettysizeG(__remainSpace);

        // 视图层渲染使用的模型
        var __buyListModel = {
            // space_price_map
            '20G': 20,
                '50G': 45,
                '200G': 160,
                '1T': 600
        },
        // ios使用的价格
        __buyListModelIAP = {
            // space_price_map
            '20G': 25,
                '50G': 45,
                '200G': 163,
                '1T': 618
        },
        __spaceBarModel = {
            'initial': 'width:' + __initialPercent + '%',
                'vip': 'width:' + __vipPercent + '%',
                'old': 'width:' + __oldPercent + '%',
                'buy': 'width:' + __buyPercent + '%'
        },
        __spaceDetailModel = {
            'initial': {
                'show': __initialSpace !== 0,
                    'spaceText' : '免费容量：' + maxPrettysizeG(__initialSpace),
                    'expire': __initialExpire
            },
            'vip': {
                'show': __vipSpace !== 0,
                    'spaceText' : '会员特权：' + maxPrettysizeG(__vipSpace),
                    'expire': __vipExpire
            },
            'old': {
                'show': __oldSpace !== 0,
                    'spaceText' : '赠送容量：' + maxPrettysizeG(__oldSpace),
                    'expire': __oldExpire
            },
            'buy': getBuyList()
        };

        /**
         * 最大单位到G，无T及T以上单位
         * @param spaceNum
         */
        function maxPrettysizeG(spaceNum) {
            var result;
            if (spaceNum >= Math.pow(1024, 4)) {
                result = (spaceNum / Math.pow(1024, 3)).toFixed(2);
                result = (result.indexOf('.0') === result.length - 3) ? result.slice(0, -3) : result;
                result += 'G';
            } else {
                result = prettysize(spaceNum, true, true);
            }

            return result;
        }
        /**
         * 整理由购买容量券所产生的购买条目视图模型
         * 如果两张券在同一天到期，那么合并显示；如果不是同一天到期，分开显示
         * @return {Array}
         */
        function getBuyList() {
            var __spaceCouponList = spaceInfo.space_coupon_list || [];
            var tempObj = {},
                item, key, i, len;
            for (i = 0, len = __spaceCouponList.length; i < len; i++ ) {
                item = __spaceCouponList[i];
                key = dateformat(item['end_time'], 'yyyy-mm-dd');
                if (tempObj[key]) {
                    tempObj[key] = {
                        space_size: item['space_size'] + tempObj[key]['space_size'],
                        extra_id: item['extra_id'] + ',' + tempObj[key]['extra_id'],
                        add_time: item['add_time'] + ',' + tempObj[key]['add_time']
                    }
                } else {
                    tempObj[key] = {
                        space_size: item['space_size'],
                        extra_id: item['extra_id'],
                        add_time: item['add_time']
                    }
                }
            }
            var buyList = [];
            for (key in tempObj) {
                item = tempObj[key];
                buyList.push({
                    show: item.space_size !== 0,
                    expire: key + '到期',
                    spaceText: '购买容量：' + maxPrettysizeG(item.space_size),
                    space_size: item.space_size,
                    extra_id: item.extra_id,
                    add_time: item.add_time
                })
            }
            return buyList;
        }

        return {
            // data : data,

            __isVip : __isVip,
            __totalSpace : __totalSpace,
            __usedSpace : __usedSpace,
            __remainSpace : __remainSpace,
            __initialSpace : __initialSpace,
            __vipSpace : __vipSpace,
            __oldSpace : __oldSpace,
            __buySpace : __buySpace,

            // 会员总共初始容量组成：初始容量 + 会员特权赠送容量
            __vipInitialSpace : __vipInitialSpace,

            __initialPercent : __initialPercent,
            __vipPercent : __vipPercent,
            __oldPercent : __oldPercent,
            __buyPercent : __buyPercent,

            __initialExpire : __initialExpire,
            __vipExpire : __vipExpire,
            __oldExpire : __oldExpire,

            __totalSpaceText: __totalSpaceText,
            __remainSpaceText: __remainSpaceText,

            // 视图层渲染使用的模型
            __buyListModel : __buyListModel,
            // ios使用的价格
            __buyListModelIAP : __buyListModelIAP,
            __spaceBarModel : __spaceBarModel,
            __spaceDetailModel : __spaceDetailModel,

            VIP_INITIAL_CAPACITY : busiConfig.VIP_INITIAL_CAPACITY
        };
    }
});
//tmpl file list:
//capacity_purchase/src/tmpl/body.tmpl.html
//capacity_purchase/src/tmpl/iap.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'bodyHTML': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var data = data || {};

    var key, item, i, len, it;
    __p.push('\r\n\
    <div class="act-buy-space j-top-div">\r\n\
        <div class="top-bar bBor">');
 if (data.__isVip) {__p.push('            <h4 class="text">尊贵的会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>\r\n\
            <a href="//h5.weiyun.com/vip?from=capacity_purchase" class="link">续费会员</a>');
 } else { __p.push('            <h4 class="text">会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>\r\n\
            <a href="//h5.weiyun.com/vip?from=capacity_purchase" class="link">开通会员</a>');
 } __p.push('        </div>\r\n\
        <div class="remain-wrap ');
_p(data.__remainSpace < Math.pow(1024, 3) ? 'warning' : '');
__p.push('">\r\n\
            <h2 class="title">\r\n\
                <span>剩余</span>\r\n\
            </h2>\r\n\
            <div class="remain-num"><span>');
_p(data.__remainSpaceText);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="space-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>总容量');
_p(data.__totalSpaceText);
__p.push('</span>\r\n\
            </h2>\r\n\
            <div class="space-bar">\r\n\
                <ul>');

                    for (key in data.__spaceBarModel) {
                    if (data.__spaceBarModel.hasOwnProperty(key)) {
                        item = data.__spaceBarModel[key];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('" style="');
_p(item);
__p.push('"></li>');

                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <div class="space-detail">\r\n\
                <ul>');

                    for (key in data.__spaceDetailModel) {
                    if (data.__spaceDetailModel.hasOwnProperty(key)) {
                        item = data.__spaceDetailModel[key];
                    
                        // buy list
                    if (Array.isArray(item)) {
                    for (i = 0, len = item.length; i < len; i ++) {
                        it = item[i];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('"');
_p(it.show ? '' : 'style="display: none;"');
__p.push('                        data-extraid-list="');
_p(it.extra_id);
__p.push('"\r\n\
                    >\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(it.spaceText);
__p.push('</span>\r\n\
                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(it.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');

                    }
                    } else {__p.push('                    <li class="item ');
_p(key);
__p.push('" ');
_p(item.show ? '' : 'style="display: none;"');
__p.push('>\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(item.spaceText);
__p.push('</span>');
 if (key === 'old') { __p.push('                            <i class="icon icon-question j-question">疑问\r\n\
                                <b class="mod-bubble-dropdown with-border top-left question-dropdown j-question-dropdown">\r\n\
                                    <b class="txt-dropdown">\r\n\
                                        <b>赠送容量在实行新的服务策略后对免费用户已取消，您是会员用户，我们将继续为您保留，感谢您对微云的支持。</b>\r\n\
                                    </b>\r\n\
                                    <b class="bubble-arrow-border"></b>\r\n\
                                    <b class="bubble-arrow"></b>\r\n\
                                </b>\r\n\
                            </i>');
 } __p.push('                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(item.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');
 } 
                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <ul>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="buy-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>购买容量</span>\r\n\
            </h2>\r\n\
            <ul class="buy-list">');

                for (key in data.__buyListModel) {
                if (data.__buyListModel.hasOwnProperty(key)) {
                    item = data.__buyListModel[key];
                __p.push('                <li class="item trblBor" data-type="');
_p(key);
__p.push('">\r\n\
                    <div class="main">\r\n\
                        <div class="space"><span>');
_p(key);
__p.push('</span></div>\r\n\
                        <div class="price"><span class="num">');
_p(item);
__p.push('</span><span>元/年</span></div>\r\n\
                    </div>\r\n\
                    <div class="right">\r\n\
                        <button class="btn j-purchase-btn"><span>购买</span></button>\r\n\
                    </div>\r\n\
                </li>');

                }}
                __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
_p(require('weiyun/util/inline').css(['app-act-buy-space'], true));
__p.push('    ');
_p(require('weiyun/util/inline').css(['g-err','g-component'], true));
__p.push('\r\n\
    <div id="body_container">');
_p(tmpl.bodyHTML(data));
__p.push('    </div>\r\n\
\r\n\
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
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\',  \'common\', \'capacity_purchase\'], function($, lib, common, index){\r\n\
            var capacityPurchase = index.get(\'./capacity_purchase\');\r\n\
            capacityPurchase.init(');
_p(JSON.stringify(data));
__p.push(');\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/h5/capacity_purchase.html\',\r\n\
                    virtualDomain: "www.weiyun.com"\r\n\
                });\r\n\
            }\r\n\
        })();\r\n\
    </scr');
__p.push('ipt>');

return __p.join("");
},

'iap': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    const prettysize = require('weiyun/util/prettysize');

    var data = data || {};

    var key, item, i, len, it;
    _p(require('weiyun/util/inline').css(['app-act-buy-space'], true));
__p.push('    ');
_p(require('weiyun/util/inline').css(['g-err','g-component'], true));
__p.push('    <div class="act-buy-space j-top-div">\r\n\
        <div class="top-bar bBor">');
 if (data.__isVip) {__p.push('            <h4 class="text">尊贵的会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>');
 } else { __p.push('            <h4 class="text">会员专享初始容量');
_p(data.VIP_INITIAL_CAPACITY);
__p.push('</h4>');
 } __p.push('        </div>\r\n\
        <div class="remain-wrap ');
_p(data.__remainSpace < Math.pow(1024, 3) ? 'warning' : '');
__p.push('">\r\n\
            <h2 class="title">\r\n\
                <span>剩余</span>\r\n\
            </h2>\r\n\
            <div class="remain-num"><span>');
_p(data.__remainSpaceText);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="space-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>总容量');
_p(data.__totalSpaceText);
__p.push('</span>\r\n\
            </h2>\r\n\
            <div class="space-bar">\r\n\
                <ul>');

                    for (key in data.__spaceBarModel) {
                    if (data.__spaceBarModel.hasOwnProperty(key)) {
                        item = data.__spaceBarModel[key];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('" style="');
_p(item);
__p.push('"></li>');

                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <div class="space-detail">\r\n\
                <ul>');

                    for (key in data.__spaceDetailModel) {
                    if (data.__spaceDetailModel.hasOwnProperty(key)) {
                        item = data.__spaceDetailModel[key];
                    
                        // buy list
                    if (Array.isArray(item)) {
                    for (i = 0, len = item.length; i < len; i ++) {
                        it = item[i];
                    __p.push('                    <li class="item ');
_p(key);
__p.push('"');
_p(it.show ? '' : 'style="display: none;"');
__p.push('                        data-extraid-list="');
_p(it.extra_id);
__p.push('"\r\n\
                    >\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(it.spaceText);
__p.push('</span>\r\n\
                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(it.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');

                    }
                    } else {__p.push('                    <li class="item ');
_p(key);
__p.push('" ');
_p(item.show ? '' : 'style="display: none;"');
__p.push('>\r\n\
                        <div class="main">\r\n\
                            <i class="point"></i>\r\n\
                            <span class="space">');
_p(item.spaceText);
__p.push('</span>');
 if (key === 'old') { __p.push('                            <i class="icon icon-question j-question">疑问\r\n\
                                <b class="mod-bubble-dropdown with-border top-left question-dropdown j-question-dropdown">\r\n\
                                    <b class="txt-dropdown">\r\n\
                                        <b>赠送容量在实行新的服务策略后对免费用户已取消，您是会员用户，我们将继续为您保留，感谢您对微云的支持。</b>\r\n\
                                    </b>\r\n\
                                    <b class="bubble-arrow-border"></b>\r\n\
                                    <b class="bubble-arrow"></b>\r\n\
                                </b>\r\n\
                            </i>');
 } __p.push('                        </div>\r\n\
                        <div class="right">\r\n\
                            <span class="sub-text">');
_p(item.expire);
__p.push('</span>\r\n\
                        </div>\r\n\
                    </li>');
 } 
                    }}
                    __p.push('                </ul>\r\n\
            </div>\r\n\
            <ul>\r\n\
            </ul>\r\n\
        </div>\r\n\
        <div class="buy-wrap">\r\n\
            <h2 class="title">\r\n\
                <span>购买容量</span>\r\n\
            </h2>\r\n\
            <ul class="buy-list">');

                for (key in data.__buyListModelIAP) {
                if (data.__buyListModelIAP.hasOwnProperty(key)) {
                    item = data.__buyListModelIAP[key];
                __p.push('                <li class="item trblBor" data-type="');
_p(key);
__p.push('">\r\n\
                    <div class="main">\r\n\
                        <div class="space"><span>');
_p(key);
__p.push('</span></div>\r\n\
                        <div class="price"><span class="num">');
_p(item);
__p.push('</span><span>元/年</span></div>\r\n\
                    </div>\r\n\
                    <div class="right">\r\n\
                        <button class="btn j-purchase-btn" data-price="');
_p(item);
__p.push('"><span>购买</span></button>\r\n\
                    </div>\r\n\
                </li>');

                }}
                __p.push('            </ul>\r\n\
        </div>\r\n\
    </div>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('<scr');
__p.push('ipt type="text/javascript">\r\n\
    seajs.use([\'$\'], function($){\r\n\
        $(\'.j-purchase-btn\').on(\'touchend\', function (e) {\r\n\
            e.stopPropagation();\r\n\
            e.preventDefault();\r\n\
\r\n\
            var $this = $(this);\r\n\
\r\n\
            // 跳转ios客户端给的支付scheme\r\n\
            location.href = \'weiyun://arouse/capacity/\' + $this.closest(\'li\').data(\'type\').toLowerCase();\r\n\
        });\r\n\
\r\n\
        $(\'.j-question\').on(\'touchend\', function (e) {\r\n\
            e.stopPropagation();\r\n\
            e.preventDefault();\r\n\
\r\n\
            var $dropdown = $(this).find(\'.j-question-dropdown\');\r\n\
            $dropdown.toggleClass(\'show\');\r\n\
        });\r\n\
\r\n\
        $(\'.j-top-div\').on(\'touchend\', function (e) {\r\n\
            e.stopPropagation();\r\n\
            e.preventDefault();\r\n\
\r\n\
            $dropdown = $(\'.j-question-dropdown\');\r\n\
            if ($dropdown.hasClass(\'show\')) {\r\n\
                $dropdown.toggleClass(\'show\');\r\n\
            }\r\n\
        });\r\n\
    });\r\n\
</scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
<scr');
__p.push('ipt>\r\n\
    (function() {\r\n\
        if (typeof pgvMain == \'function\') {\r\n\
            pgvMain("", {\r\n\
                tagParamName: \'WYTAG\',\r\n\
                virtualURL: \'/h5/capacity_purchase.html?iap\',\r\n\
                virtualDomain: "www.weiyun.com"\r\n\
            });\r\n\
        }\r\n\
    })();\r\n\
</scr');
__p.push('ipt>');

return __p.join("");
}
};
return tmpl;
});
