/**
 * 新版PC侧分享页
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
        store = require('./store'),
        verify_code = require('./verify_code'),

        undefined;

    var ui = new Module('outlink.ui', {

        render: function() {
            this._render_secret();
        },

        _render_secret: function() {
            var me = this;
            var share_info = store.get_share_info();
            if(!share_info['need_pwd']) {
                return;
            }
            if(share_info['retry']) {
                $('#_password_cnt').addClass('err');
                $('#outlink_login_err').text(share_info['msg'] || '密码错误');
            }
            //访问密码
            $('#outlink_pwd_ok').on('click', function(e) {
                var pwd = $('#outlink_pwd').val(),
                    verify_code = me.get_verify_code_text();
                if(!pwd) {
                    $('#_password_cnt').addClass('err');
                    $('#outlink_login_err').text('密码为空');
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
            $('#outlink_login_pass_access').on('focus', 'input', function(e) {
                me.clear();
            });
        },

        set_pwd_err_text: function(text) {
            $('#_password_cnt').addClass('err');
            $('#outlink_login_err').text(text);
        },

        set_need_verify_code: function() {
            this._need_verify_code = true;
            this._$el = $('#_verify_code_cnt');
        },

        clear: function() {
            $('#_password_cnt').removeClass('err');
            $('#outlink_login_err').text('');

            if(this._$el) {
                this._$el.find('[data-id=verify_code_text]').val('');
                this._$el.removeClass('err');
                this._$el.find('[data-id=tip]').text('');
            }
        },

        is_need_verify_code: function() {
            return !!this._need_verify_code;
        },

        get_verify_code_text: function() {
            var val;
            if(!this.is_need_verify_code()) {
                return;
            }
            val = this._$el.find('[data-id=verify_code_text]').val();
            return $.trim(val);
        },

        set_verify_err_text: function(text) {
            if(!this.is_need_verify_code()) {
                return;
            }
            this._$el.addClass('err');
            this._$el.find('[data-id=tip]').text(text);
        },

        validate: function() {
            var code;
            if(!this.is_need_verify_code()) {
                return true;
            }

            code = this.get_verify_code_text();
            if(code.length < 4) {
                this.set_verify_err_text('请输入正确的验证码')
                return false;
            }
            return true;
        }
    });

    return ui;
});