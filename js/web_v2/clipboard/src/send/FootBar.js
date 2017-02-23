/**
 * 剪贴板模块 发送tab 底部工具栏
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),

        tmpl = require('./tmpl'),

        undefined;

    var FootBar = inherit(Event, {

        name: 'footbar',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($ct) {
            if(this._rendered) {
                return;
            }

            this._$ct = $ct;
            $(tmpl.footbar()).appendTo($ct);
            this.bind_events();
            this._rendered = true;
        },

        bind_events: function() {
            var me = this;
            this._$ct.on('click', '[data-action]', function(e) {
                var $target = $(this),
                    action_name = $target.attr('data-action');
                e.preventDefault();
                if(action_name === 'send') {
                    if($target.is('.disabled')) { //禁用状态
                        return;
                    }
                    me.toggle_send_btn(false);
                } else if(action_name === 'clear') {
                    me.toggle_clear_btn(false);
                }
                me.trigger('action', action_name, null, e); //mgr 处理
            });
        },
        /**
         *
         * @param {Boolean} is_show 是否显示发送按钮
         */
        toggle_send_btn: function(is_show) {
            if(is_show) {
                this.get_$send_btn().show();
                this.get_$sending_btn().hide();
            } else {
                this.get_$send_btn().hide();
                this.get_$sending_btn().show();
            }
        },

        /**
         * 显示/隐藏清除按钮 由mgr判断编辑器中是否有内容来调用
         * @param is_show
         */
        toggle_clear_btn: function(is_show) {
            if(is_show) {
                this.get_$clear_btn().show();
                this.get_$send_btn().removeClass('disabled').css('opacity', '1');
            } else {
                this.get_$clear_btn().hide();
                this.get_$send_btn().addClass('disabled').css('opacity', '0.5');
            }
        },

        /**
         * 发送是否成功后对发送按钮进行控制，由mgr调用
         * @param is_succ
         */
        on_send_succ: function(is_succ) {
            var me = this;
            if(is_succ) {
                this.get_$send_btn().hide();
                this.get_$sending_btn().hide();
                setTimeout(function() {
                    me.toggle_send_btn(true);
                }, 3000);
            } else {
                me.toggle_send_btn(true);
            }
        },

        is_activated: function() {
            return this._is_activated;
        },

        activate: function() {
            this._is_activated = true;
        },
        deactivate: function() {
            this._is_activated = false;
        },

        get_$clear_btn: function() {
            return this._$clear_btn || (this._$clear_btn = this._$ct.find('[data-action=clear]'));
        },

        get_$send_btn: function() {
            return this._$send_btn || (this._$send_btn = this._$ct.find('[data-action=send]'));
        },

        get_$sending_btn: function() {
            return this._$sending_btn || (this._$sending_btn = this._$ct.find('[data-id=sending]'));
        }
    });

    return FootBar;
});