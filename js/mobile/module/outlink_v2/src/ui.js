/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        huatuo_speed = common.get('./huatuo_speed'),
        browser = common.get('./util.browser'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        ui_file_list = require('./ui.file_list'),
        ui_photo = require('./ui.photo'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    var ui = new Module('outlink.ui', {

        render: function() {
            if(store.get_share_info()['need_pwd']) {
                this.render_secret();
                return;
            }
            this.render_note();

            this.bind_action();

        },

        bind_action: function() {
            var me = this;
            this.get_$ct().on(target_action, '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action'),
                    file_id = $target.closest('[data-id=item]').attr('id');

                me.trigger('action', action_name, file_id, e);
            });
        },

        render_secret: function() {
            var me = this;
            if(store.share_info['retry']) {
                cookie.unset('sharepwd');
                widgets.reminder.error(store.share_info['msg'] || '密码错误');
            }

            var is_num_word_key = function(key) {
                if(key > 47 && key < 58 || key > 64 && key < 91 || key > 95 && key < 106) {
                    return true;
                }
                return false;
            }

            this.get_$ct().on('click', '[data-action=secret_view]', function(e) {
                var $inputs = me.get_$ct().find('input[type=password]'),
                    verify_code = me.get_verify_code_text(),
                    pwd = $inputs.val();

                if(!pwd) {
                    widgets.reminder.error('密码不能为空');
                    return;
                } else if(pwd.length !== 4 && pwd.length !== 6) {
                    widgets.reminder.error('请输入完整密码');
                    return;
                }
                var _data = {
                    pwd: pwd
                };
                if(me.is_need_verify_code()) {
                    _data.verify_code = verify_code;
                }
                if(me.validate()) {
                    me.trigger('action', 'secret_view', _data, e);
                }
            });
            this.get_$verify().on('focus', 'input', function(e) {
                me.clear();
            });
        },

        render_note: function() {
            this.get_$ct().find('[data-id=content] img').addClass('.note-img');
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$pwd: function() {
            return this.$pwd = this.$pwd || (this.$pwd = $('.pw-input'));
        },

        get_$verify: function() {
            return this.$verify = this.$verify || (this.$verify = $('#_verify_code_cnt'));
        },

        clear: function() {
            this.get_$ct().find('[data-id=verify_code_text]').val('');
            this.get_$ct().find('[data-id=tip]').text('');
        },

        set_pwd_err_text: function(text) {
            this.get_$ct().find('[data-id=password-tip]').text(text);
        },

        set_need_verify_code: function() {
            this._need_verify_code = true;
        },

        is_need_verify_code: function() {
            return !!this._need_verify_code;
        },

        get_verify_code_text: function() {
            var val;
            if(!this.is_need_verify_code()) {
                return;
            }
            val = this.get_$verify().find('[data-id=verify_code_text]').val();
            return $.trim(val);
        },

        set_verify_err_text: function(text) {
            if(!this.is_need_verify_code()) {
                return;
            }
            this.get_$verify().addClass('err');
            this.get_$verify().find('[data-id=tip]').text(text);
        },

        validate: function() {
            var code;
            if(!this.is_need_verify_code()) {
                return true;
            }

            code = this.get_verify_code_text();
            if(code.length < 4) {
                this.set_verify_err_text('请输入正确的验证码');
                return false;
            }
            return true;
        }
    });

    return ui;
});