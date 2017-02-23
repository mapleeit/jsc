//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/server/mobile/modules/pop_pay/index",["lib","common","$","weiyun/mobile/lib/browser","weiyun/mobile/lib/underscore","weiyun/mobile/lib/dateformat","weiyun/mobile/common/payAids"],function(require,exports,module){

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
//pop_pay/src/ar.js
//pop_pay/src/dom.js
//pop_pay/src/mgr.js
//pop_pay/src/pop_pay.js
//pop_pay/src/view.js
//pop_pay/src/vm.js
//pop_pay/src/tmpl/body.tmpl.html

//js file list:
//pop_pay/src/ar.js
//pop_pay/src/dom.js
//pop_pay/src/mgr.js
//pop_pay/src/pop_pay.js
//pop_pay/src/view.js
//pop_pay/src/vm.js
/**
 * Created by maplemiao on 21/11/2016.
 */
"use strict";

define.pack("./ar",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls'),
        request = common.get('./request'),
        https_tool = common.get('./util.https_tool');

    // async request
    return new Module('ar', {
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
        get_$pay_btn: function() {
            var me = this;

            return me.$pay_btn || (me.$pay_btn = $('.j-pay-btn'));
        },

        get_$price_list: function() {
            var me = this;

            return me.$price_list || (me.$price_list = $('.j-price-list'));
        },

        get_$banner: function() {
            var me = this;

            return me.$banner || (me.$banner = $('.j-banner'));
        },

        get_$price_num: function() {
            var me = this;

            return me.$price_num || (me.$price_num = $('.j-price-num'));
        },

        get_$other_input: function() {
            var me = this;

            return me.$other_input || (me.$other_input = $('.j-other-input'));
        }
    })
});/**
 * Created by maplemiao on 22/01/2017.
 */
"use strict";

define.pack("./mgr",["lib","common","$","weiyun/mobile/lib/browser"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');
    var Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        urls = common.get('./urls');

    var browser = require('weiyun/mobile/lib/browser');

    return new Mgr('mgr', {
        init: function (cfg) {
            $.extend(this, cfg);
            this.observe(this.view);
            this.observe(this.ar);
        },

        on_pay_btn: function (options) {
            var month = options.month || '1',
                monthProductidMap = {
                    '1' : '1', // 1个月的productid为1
                    '3' : '2', // 3个月的为2
                    '6' : '3', // 6个月的为3
                    '12' : '4' // 12个月的为4
                };
            var is_weixin_account = (cookie.get('wy_uf') === '1') || cookie.get('wx_login_ticket');

            if (browser().IOS_WEIYUN) { // ios iap
                location.href = 'weiyun://arouse/' + month + 'month';
            } else if (is_weixin_account) { // android weixin
                urls.redirect(window.location.protocol + '//pay.qq.com/h5/index.shtml', {
                    m: 'buy',
                    c: 'subscribe',
                    service: 'wyhyh5',
                    appid: '1450005554',
                    aid: window.WEIYUN_AID,
                    wxAppid2: 'wx786ab81fe758bec2',
                    pf: 'desktop_m_guest-2001-android-2011-h5_weixin_month_card',
                    openid: cookie.get('openid'),
                    sessionid: 'hy_gameid',
                    sessiontype: 'wc_actoken',
                    openkey: cookie.get('access_token'),
                    as: '1',
                    _newservice: '1',
                    productid: monthProductidMap[month] || 1
                });
            } else { // android qq
                urls.redirect(window.location.protocol + '//pay.qq.com/h5/index.shtml', {
                    m: 'buy',
                    c: 'wyclub',
                    aid: window.WEIYUN_AID,
                    n: month,
                    as: '1'
                });
            }
        }
    });
});/**
 * Created by maplemiao on 22/01/2017.
 */
"use strict";

define.pack("./pop_pay",["lib","common","$","./ar","./view","./mgr"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls');
    var ar = require('./ar'),
        view = require('./view'),
        mgr = require('./mgr');


    return new Module('pop_pay', {
        init: function (syncData) {
            window.WEIYUN_AID = syncData.aid || '';
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

define.pack("./view",["lib","common","$","./ar","./dom","./vm","./tmpl","weiyun/mobile/lib/underscore"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets');

    var ar = require('./ar'),
        dom = require('./dom'),
        vm = require('./vm'),
        tmpl = require('./tmpl');

    var _ = require('weiyun/mobile/lib/underscore');

    return new Module('view', {
        init: function (syncData) {
            var me = this;

            me._bind_events();
        },

        _bind_events: function () {
            var me = this;

            var oldPrice = dom.get_$price_num().text();

            dom.get_$pay_btn().on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var month = dom.get_$price_list().find('li.cur').data('month');
                month = month === 'other' ? dom.get_$other_input().val() : month;

                me.trigger('action', 'pay_btn', {
                    month: month
                });
            });

            dom.get_$price_list().on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var $thisLi = $(e.target).closest('li');

                oldPrice = dom.get_$price_num().text();

                if ($thisLi.length) {
                    $thisLi.addClass('cur').siblings().removeClass('cur');

                    if ($thisLi.data('month') !== 'other') {
                        dom.get_$other_input().blur();
                        dom.get_$price_num().text($thisLi.data('price'));
                    } else if (!/^[1-9]\d{0,2}/.test(dom.get_$other_input().val())) { // 若不是有效数字 1-999
                        dom.get_$other_input().val('').focus();
                    } else {
                        dom.get_$other_input().focus();
                        dom.get_$price_num().text(dom.get_$other_input().val() * 10);
                    }
                }
            });

            dom.get_$other_input().on('keydown', function (e) {
                if (e.key && !/(\d|Backspace)/.test(e.key)) {
                    e.preventDefault();
                }

                if (e.key !== 'Backspace' && $(this).val().length === 3) { // 最多三位数
                    e.preventDefault();
                }
            });

            dom.get_$other_input().on('keyup', function (e) {
                if ($(this).val() === '0') {
                    $(this).val('其他');

                    var month = Number(oldPrice) / 10;
                    dom.get_$price_list().find('[data-month="' + month + '"]').addClass('cur').siblings().removeClass('cur');
                    dom.get_$price_num().text(oldPrice);
                    $(this).blur();
                } else if ($(this).val() === '') {
                    // nothing
                } else {
                    oldPrice = $(this).val() * 10;
                    dom.get_$price_num().text($(this).val() * 10);
                }
            });

            dom.get_$other_input().on('blur', function (e) {
                if (!$(this).val()) {
                    $(this).val('其他');

                    var month = Number(oldPrice) / 10;
                    dom.get_$price_list().find('[data-month="' + month + '"]').addClass('cur').siblings().removeClass('cur');
                    dom.get_$price_num().text(oldPrice);
                }
            });
        }
    });
});/**
 * 工具函数，无状态
 * 产生视图渲染所用到的数据模型
 * Created by maplemiao on 22/01/2017.
 */
"use strict";


define.pack("./vm",["weiyun/mobile/lib/underscore","weiyun/mobile/lib/dateformat","weiyun/mobile/common/payAids","weiyun/mobile/lib/browser"],function(require, exports, module) {
    var _ = require('weiyun/mobile/lib/underscore'),
        dateformat = require('weiyun/mobile/lib/dateformat');
    var payAids = require('weiyun/mobile/common/payAids');

    return function vm(data, wy_uf) {
        var browser = require('weiyun/mobile/lib/browser')();

        data = data || {};
        var userInfo = data.userInfo || {};
        var onlineConfig = data.onlineConfig || {};

        var AndroidPriceListModel = [{
            text: _.escape('12个月'),
            month: '12',
            price: 120,
            cur_class: true
        }, {
            text: _.escape('6个月'),
            month: '6',
            price: 60,
            cur_class: false
        }, {
            text: _.escape('3个月'),
            month: '3',
            price: 30,
            cur_class: false
        }, {
            text: _.escape('其他'),
            month: 'other',
            price: 'other',
            cur_class: false
        }];

        var IOSPriceListModel = [{
            text: _.escape('12个月'),
            month: '12',
            price: 118,
            cur_class: true
        }, {
            text: _.escape('6个月'),
            month: '6',
            price: 60,
            cur_class: false
        }, {
            text: _.escape('3个月'),
            month: '3',
            price: 30,
            cur_class: false
        }, {
            text: _.escape('1个月'),
            month: '1',
            price: 12,
            cur_class: false
        }];

        var aid = payAids.aid;
        var banner_img_url = (function () {
            var aid_img_maplist = onlineConfig.aid_img_maplist;
            var mapObj = {};
            for (var i = 0, len = aid_img_maplist.length; i < len; i++ ) {
                var item = aid_img_maplist[i];
                var pair = item.split('::');

                mapObj[pair[0]] = pair[1];
            }

            if (!mapObj['default']) {
                // 若是配置中缺少默认banner图，需要在本地开发时候就暴露出来
                console.error('Missing default img url in online config');
            }

            return mapObj[aid] || mapObj['default'];
        })();
        var need_show_link = (function () {
            switch (onlineConfig.act_info.show_link_account) {
                case 'qq':
                    return wy_uf === '0';
                    break;
                case 'weixin':
                    return wy_uf === '1';
                    break;
                case 'all':
                    return true;
                    break;
                default:
                    return false;
            }
        })();

        return {
            // 首页vm模型
            getModel: function () {
                return {
                    _rawData: data,
                    // 支付渠道统计
                    aid: aid,
                    wy_uf: wy_uf,

                    nick_name : _.escape(userInfo.nick_name || ''),
                    uin: userInfo.uin || '',
                    price_list: browser.ANDROID ? AndroidPriceListModel : IOSPriceListModel,
                    init_price: browser.ANDROID ? '120' : '118',

                    // online config start
                    banner_img_url: _.escape(banner_img_url),
                    act_info: {
                        plain_text: _.escape(onlineConfig.act_info.plain_text),
                        link: "weiyun://newwebview/fullscreen?url=" + encodeURIComponent('https://jump.weiyun.com/?from=3060&r_url=' + encodeURIComponent(onlineConfig.act_info.link)),
                        link_text: _.escape(onlineConfig.act_info.link_text),
                        need_show_link: need_show_link
                    }
                    // online config end

                }
            }
        }
    }
});

//tmpl file list:
//pop_pay/src/tmpl/body.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <section class="app-pop pop-pay">\r\n\
        <section class="pop-inner">\r\n\
            <section class="hd">\r\n\
                <!-- [ATTENTION!!] 换banner的时候，换的是 style="background-image:url()"" -->\r\n\
                <b class="banner j-banner" style="background-image: url(');
_p(data.banner_img_url);
__p.push(')">微云会员</b>\r\n\
            </section>\r\n\
\r\n\
            <section class="bd">\r\n\
                <ul class="list j-price-list">');

                    for (var i = 0, len = data.price_list.length; i < len; i++) {
                        var item = data.price_list[i];
                    __p.push('                        ');
 if (item.month === 'other') { __p.push('                        <li class="item trblBor ');
_p(item.cur_class ? 'cur' : '');
__p.push('" data-month="');
_p(item.month);
__p.push('" data-price="');
_p(item.price);
__p.push('"><input class="input-txt j-other-input" type="tel" value="');
_p(item.text);
__p.push('"></li>');
 } else { __p.push('                        <li class="item trblBor ');
_p(item.cur_class ? 'cur' : '');
__p.push('" data-month="');
_p(item.month);
__p.push('" data-price="');
_p(item.price);
__p.push('">');
_p(item.text);
__p.push('</li>');
 } __p.push('                    ');
 } __p.push('                </ul>\r\n\
                <p class="txt">');
_p(data.act_info.plain_text);
 if (data.act_info.need_show_link) { __p.push('<a href="');
_p(data.act_info.link);
__p.push('" class="link">');
_p(data.act_info.link_text);
 } __p.push('</a></p>\r\n\
                <div class="price bBor">\r\n\
                    <p class="num"><strong class="j-price-num">');
_p(data.init_price);
__p.push('</strong>元</p>\r\n\
                    <div class="ticket">暂无抵用券</div>\r\n\
                </div>\r\n\
                <p class="user bBor">');
_p(data.nick_name);
 if (data.wy_uf === '0') { __p.push('(');
_p(data.uin);
__p.push(')');
 } __p.push('</p>\r\n\
            </section>\r\n\
\r\n\
            <section class="ft">\r\n\
                <button class="btn btn-active j-pay-btn">立即开通</button>\r\n\
            </section>\r\n\
        </section>\r\n\
    </section>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">console.log(');
_p(JSON.stringify(data));
__p.push(');</scr');
__p.push('ipt>\r\n\
\r\n\
    <scr');
__p.push('ipt type="text/javascript">\r\n\
        window.IS_TEST_ENV = ');
_p((plug('config') || {}).isTest);
__p.push(';\r\n\
        window.APPID = ');
_p(require('weiyun/util/appid')());
__p.push(';\r\n\
        window.g_start_time = +new Date();\r\n\
    </scr');
__p.push('ipt>');
_p(require('weiyun/util/inline').js(['seajs', 'configs_mobile']));
__p.push('    <scr');
__p.push('ipt type="text/javascript">\r\n\
        seajs.use([\'$\', \'lib\',  \'common\', \'pop_pay\'], function($, lib, common, index){\r\n\
            index.get(\'./pop_pay\').init(');
_p(JSON.stringify(data));
__p.push(');\r\n\
        });\r\n\
    </scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//imgcache.gtimg.cn/club/platform/lib/pay/smartpay.js?_bid=193\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\' src=\'//img.weiyun.com/club/weiyun/js/publics/tcss/tcss.ping.js\'></scr');
__p.push('ipt>\r\n\
    <scr');
__p.push('ipt type=\'text/javascript\'>\r\n\
        (function() {\r\n\
            if (typeof pgvMain == \'function\') {\r\n\
                pgvMain("", {\r\n\
                    tagParamName: \'WYTAG\',\r\n\
                    virtualURL: \'/pop_pay\',\r\n\
                    virtualDomain: "h5.weiyun.com"\r\n\
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
