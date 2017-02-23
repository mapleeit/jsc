//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/client_download/client_download.r0903",["lib","common","$"],function(require,exports,module){

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
//client_download/src/client_download.js
//client_download/src/client_download.tmpl.html

//js file list:
//client_download/src/client_download.js
/**
 * 下载客户端
 * @author jameszuo
 * @date 13-4-1
 */
define.pack("./client_download",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        errors = {
            6: '发送速率过快，请稍后再试，您还可以通过右侧二维码的方式快速安装微云。',
            7: '发送速率过快，请稍后再试，您还可以通过右侧二维码的方式快速安装微云。'
        },
        error_default = '网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。',
        error_invalid_num = '您输入的电话号码有误，请重新输入。',

        type_map_flag = {
            android: 1,
            ios: 2
        },

        re_mob_num = new RegExp('^1[358]\\d{9}$'),

        last_phone_num,
        last_type,

        undefined;

    var client_download = {

        show: function (type) {

            var me = this,
                $el = me._get_$el(type);

            if (!$el.is(':visible')) {
                $el.fadeIn('fast');
            }

            me._$input.focus();

            widgets.mask.show('client_download');

            // 事件
            $el
                // 关闭
                .on('click', '[data-action=X]', function (e) {
                    e.preventDefault();
                    me.close();
                })
                // 发送短信
                .on('click', '[data-action=send]', function (e) {
                    e.preventDefault();

                    send();
                })
                // 回车发送
                .on('keydown', '[data-action=phone_num]', function (e) {
                    if (e.which === 13) {
                        send();
                    }
                })
                // 重新发送
                .on('click', '[data-action=again]', function (e) {
                    e.preventDefault();

                    me._send_msg(last_phone_num, last_type, function () {
                        me._$err_after.hide();
                    }, function (err) {
                        me._$err_after.hide().html(err).slideDown('fast');
                    });
                });

            me.listenTo(global_event, 'press_key_esc', function () {
                me.close();
            });


            var send = function () {

                var phone_num = $.trim(me._$input.val());

                // 检查手机号码
                if (me._is_valid_num(phone_num)) {

                    last_phone_num = phone_num;
                    last_type = type;

                    me._send_msg(phone_num, type, function () {

                        me._$err_before.hide();
                        me._$before_send.hide();
                        me._$after_send.show();

                    }, function (err) {
                        me._$err_before.hide().html(err).slideDown('fast');
                    });
                }
                // 无效的手机号
                else {
                    me._$err_before.hide().html(error_invalid_num).slideDown('fast');
                    me._$input.focus();
                }
            };
        },

        close: function () {
            var me = this;

            last_phone_num = last_type = null;

            if (me._$el) {
                me._$el.fadeOut('fast', function () {
                    me._$el.remove();

                    $.each(me, function (prop) {
                        if (me[prop] instanceof jQuery) {
                            delete me[prop];
                        }
                    });
                });
                widgets.mask.hide('client_download');
            }
            me.stopListening(global_event, 'press_key_esc');
        },

        _get_$el: function (type) {
            var me = this;

            var $el = me._$el = $(tmpl.client_download_dialog({
                type: type
            }));

            $el.hide().appendTo(document.body);

            me._$before_send = $el.find('[data-name=before_send]');
            me._$input = me._$before_send.find('input[data-action=phone_num]');
            me._$err_before = me._$before_send.find('p[data-action=error]');

            me._$after_send = me._$before_send.siblings('[data-name=after_send]');
            me._$err_after = me._$after_send.find('p[data-action=error]');

            return me._$el;
        },

        // 发送验证码到手机
        _send_msg: function (phone_num, type, ok_fn, fail_fn) {
            var flag = type_map_flag[type];

            $.getJSON('http://www.weiyun.com/php/msgsend.php', {number: phone_num, flag: flag, source: constants.IS_APPBOX ? 'appbox' : 'web'}, function (data) {
                if (data.ret == 0) {
                    ok_fn();
                } else {
                    fail_fn(errors[data.ret] || error_default);
                }
            });
        },

        // 重新发送


        // 检查是否是合法的手机号码
        _is_valid_num: function (phone_num) {
            return re_mob_num.test(phone_num);
        }
    };

    $.extend(client_download, events);

    return client_download;
});
//tmpl file list:
//client_download/src/client_download.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'client_download_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),
        $ = require('$'),

        name_map = {
            ios: 'iPhone',
            android: 'Android'
        },

        type = data.type;
    __p.push('    <div data-no-selection class="get_app_layer">\r\n\
        <del data-action="X"></del>\r\n\
\r\n\
        <h2>微云');
_p(name_map[type]);
__p.push('版</h2>\r\n\
        <div class="get_url_area">\r\n\
            <div class="register_area">\r\n\
\r\n\
                <!-- 发送前 -->\r\n\
                <div data-name="before_send" class="register_form">\r\n\
                    <h3>方法一：短信获取下载地址</h3>\r\n\
                    <p class="des">请填写手机号，下载地址将发送到您的手机上。</p>\r\n\
                    <input data-action="phone_num" class="text" type="tel" placeholder="请输入手机号码">\r\n\
                    <a data-action="send" class="button" href="#">发送短信</a>\r\n\
                    <p data-action="error" style="display: none;" class="error_des"></p>\r\n\
                </div>\r\n\
\r\n\
                <!-- 发送后 -->\r\n\
                <div data-name="after_send" style="display: none;" class="register_success">\r\n\
                    <p class="des">您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。</p>\r\n\
                    <h3>方法一：手机短信获取</h3>\r\n\
                    <a data-action="X" class="button" href="#">完成</a>\r\n\
                    <a data-action="again" href="#" style="margin-left: 15px;">再次发送短信</a><p></p>\r\n\
                    <p data-action="error" style="display: none;" class="error_des"></p>\r\n\
                </div>');
 if (type === 'ios') { __p.push('                    <div class="get_apk">\r\n\
                        <h3>方法二：前往App Store下载</h3>\r\n\
                        <p class="des"><a href="http://itunes.apple.com/cn/app/id522700349?mt=8&ls=1" target="_blank">连接到 iTunes Store</a></p>\r\n\
                    </div>');
 } else if (type === 'android') { __p.push('                    <div class="get_apk">\r\n\
                        <h3>方法二：下载安装包</h3>\r\n\
                        <p class="des">\r\n\
                            <a href="http://www.weiyun.com/d/?d=android&s=');
_p(constants.IS_APPBOX ? 'appbox' : 'web' );
__p.push('" target="download_android_client">点击开始下载</a>\r\n\
                            <iframe src="" name="download_android_client" style="display:none;"></iframe>\r\n\
                        </p>\r\n\
                    </div>');
 } __p.push('\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div class="get_code_area">\r\n\
            <h3>方法三：二维码获取</h3>\r\n\
            <p class="des">使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。</p>\r\n\
            <img src="http://imgcache.qq.com/vipstyle/nr/box/portal/demoImg/weiyunQR');
_p(constants.IS_APPBOX ? '-appbox' : '' );
__p.push('.png">\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
