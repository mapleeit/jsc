/**
 * 发送邮件验证码
 * @author hibincheng
 * @date 2013-12-16
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        lowie9 = $.browser.msie && $.browser.version < 9,

        undefined;

    var verify_code = new Module('verify_code', {

        render: function() {
            if(this._rendered) {
                return;
            }

            var $el = this._$el = $('#_verify_code_cnt'),
                me = this;

            $el.on('click', '[data-action=change_verify_code]', function(e) {
                e.preventDefault();
                me.change_verify_code();
            });

            this._rendered = true;
        },

        //显示验证码
        show: function() {
            if(!this._rendered) {
                this.render();
            }
            this._has_verify_code = true;
            this.change_verify_code();
            this._$el.show();
        },

        hide: function() {
            if(!this._rendered) {
                return;
            }
            this._$el.hide();
            this._$el.find('[data-id=verify_code_text]').val('');
            this._has_verify_code = false;
        },
        //换一个验证码
        change_verify_code: function() {
            var url;
            if(!this.has_verify_code()) {
                return;
            }
            url = constants.BASE_VERIFY_CODE_URL + Math.random();
            this._$el.find('img').attr('src', url);
        },
        /**
         * 是否有验证码，当验证码显示时有，隐藏当作没
         * @returns {boolean}
         */
        has_verify_code: function() {
            return !!this._has_verify_code;
        }
    });

    return verify_code;
});