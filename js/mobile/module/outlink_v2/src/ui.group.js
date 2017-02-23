/**
 * ui模块-共享文件夹
 * @author xixinhuang
 * @date 2016-06-27
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        router = lib.get('./router'),
        browser = common.get('./util.browser'),
        store = require('./store'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),

        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',

        undefined;

    common.get('./polyfill.rAF');

    var ui = new Module('ui.group', {

        render: function() {
            this._$ct = $('#container');
            this.bind_events();
        },

        bind_events: function() {
            var me = this;
            this.get_$ct().on(target_action, '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(action_name === 'confirm') {
                    location.href = 'http://www.weiyun.com/';
                } else if(action_name === 'cancel') {
                    me.get_$tips().hide();
                }
                me.trigger('action', action_name, e);
            });
        },

        show_tips: function() {
            this.get_$tips().show();
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$tips: function() {
            return this.$tips = this.$tips || (this.$tips = this.get_$ct().find('[data-id=tips]'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});