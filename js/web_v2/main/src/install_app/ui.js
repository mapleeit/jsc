/**
 * 安装客户端UI逻辑
 * @author bondli
 * @date 13-11-05
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        user_log = common.get('./user_log'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        https_tool = common.get('./util.https_tool'),
        request = common.get('./request'),

        tmpl = require('./tmpl'),

        widgets = common.get('./ui.widgets'),

        main_ui = require('./ui'),

        os_names = {
            'android': '微云Android版',
            'iphone': '微云iPhone版',
            'ipad': '微云iPad版'
        },
        config_data,
        curr_os_name, //当前要下载系统类型

        undefined;

    var ui = new Module('install_app_ui', {

        render: function (data) {
            config_data = data;
            this.get_$el().appendTo(main_ui.get_$aside_wrap()).hide();
            this._init_click();
        },

        //初始化图标点击事件
        _init_click: function () {
            var me = this;
            this.get_$el().on('click', 'a[data-action]', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $el = $(this),
                    app_alias = $el.attr('data-action');

                if (app_alias) {
                    me.show_download(app_alias);
                }
            });
        },

        // --- 获取一些DOM元素 ---------

        get_$el: function () {
            return this._$el || ( this._$el = $(tmpl.install_app()) );
        },

        _to_download: function(os_name) {
            switch(os_name) {
                case 'android':
                    window.open(config_data.android && config_data.android.download_url);
                    user_log('GUIDE_INSTALL_ANDROID_CLICK_DOWN');
                    break;
                case 'iphone':
                    window.open(config_data.iphone && config_data.iphone.download_url);
                    user_log('GUIDE_INSTALL_IPHONE_CLICK_DOWN');
                    break;
                case 'ipad':
                    window.open(config_data.ipad && config_data.ipad.download_url);
                    user_log('GUIDE_INSTALL_IPAD_CLICK_DOWN');
                    break;
                case 'windows':
                    window.open(config_data.windows && config_data.windows.download_url);
                    break;
                case 'mac':
                    window.open(config_data.mac_sync && config_data.mac_sync.download_url);
                    break;
            }
        },

        _send_sms: function(phone_num) {
            var def = $.Deferred();
            /*var msg_url = 'http://www.weiyun.com/php/msgsend.php';
            msg_url = https_tool.translate_url(msg_url);
            $.get(msg_url, {number:phone_num, flag:1}, function (data){
                if(data.ret == '0') {
                    def.resolve();
                }else {
                    def.reject(data && data.ret);
                }
            }, 'json');*/
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'SmsSend',
                pb_v2: true,
                body: {
                    phone_number: phone_num,
                    sms_type: 0
                }
            }).done(function() {
                def.resolve();
            }).fail(function() {
                def.reject(6);
            });

            return def;
        },

        _create_dialog: function() {
            var me = this;
            var dialog = new widgets.Dialog({
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.download_dialog,
                mask_bg: 'ui-mask-white',
                handlers: {}
            });
            dialog.render_if();
            var $el = dialog.get_$el();
            $el
                .on('click', '[data-action=appdown]', function(e) {
                    e.preventDefault();
                    var os_name = $(this).attr('data-id');
                    me._to_download(os_name);
                })
                .on('click', '[data-action=send]', function(e) {
                    e.preventDefault();
                    var num = $el.find('input[data-id=phone_num]').val();
                    var $sms_err = $el.find('[data-id=sms_error]');
                    if(!(/^1[358]\d{9}$/.test(num))){
                        $sms_err.text('手机号码输入有误，请重新输入。').show();
                        return;
                    } else {
                        $sms_err.hide();
                    }
                    me._send_sms(num)
                        .done(function() {
                            $el.find('[data-id=sms_normal]').hide();
                            $el.find('[data-id=sms_info]').show();
                        })
                        .fail(function(err_code) {
                            if(err_code == '6' || err_code == '7') {
                                $sms_err.text('发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。').show();
                            } else {
                                $sms_err.text('网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。').show();
                            }
                        });
                    if(curr_os_name === 'android') {
                        user_log('GUIDE_INSTALL_ANDROID_SEND_BTN');
                    } else if(curr_os_name === 'iphone') {
                        user_log('GUIDE_INSTALL_IPHONE_SEND_BTN');
                    }
                })
                .on('click', '[data-action=resend]', function(e) {
                    e.preventDefault();
                    $el.find('[data-id=sms_info]').hide();
                    $el.find('[data-id=sms_normal]').show();
                });

            return dialog;
        },

        _get_dialog: function(os_name) {
            var dialog = this._dialog,
                me = this;

            if(!dialog) {
                dialog = this._dialog = me._create_dialog();
            }
            dialog.set_title(os_names[os_name]);
            dialog.set_content(tmpl[os_name+'_content']);
            return dialog;
        },


        show_download: function(os_name) {
            if(!os_name || !os_names[os_name]) {
                return;
            }
            curr_os_name = os_name;
            var dialog = this._get_dialog(os_name);
            dialog.show();
        },

        show_install_guide: function() {

            var dialog = new widgets.Dialog({
                empty_on_hide: false,
                destroy_on_hide: true,
                tmpl: tmpl.install_guide,
                mask_bg: 'ui-mask-white',
                handlers: {}
            });
            dialog.render_if();
            dialog.show();
            var $el = dialog.get_$el();
            var me = this;
            $el.on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]');
                var name = $target.attr('data-id');
                var action = $target.attr('data-action');
                if(action == 'close') {
                    dialog.hide();
                } else {
                    name && me._to_download(name);
                }
            });
        }

    });


    return ui;
});