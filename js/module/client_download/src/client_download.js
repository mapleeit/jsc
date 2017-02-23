/**
 * 下载客户端
 * @author jameszuo
 * @date 13-4-1
 */
define(function (require, exports, module) {
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