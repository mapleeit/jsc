/**
 * 外链管理工具栏模块
 * @author hibincheng
 * @date 2013-9-4
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        is_web_ui = constants.UI_VER === 'WEB',

        undefined;

    var toolbar = new Module('share_manage_toolbar', {

        render: function($ct) {
            if(!this.rendered) {
                if(is_web_ui) {
                    this.$el = $(tmpl.web_toolbar()).appendTo($ct);
                } else {
                    this.$el = $(tmpl.appbox_toolbar()).appendTo($ct);
                }
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                me.trigger('action', $target.attr(action_property_name), e);
            });
        },

        show: function() {
            this.$el.show();
            if(!is_web_ui) {//appbox
                this.get_$appbox_share_info_ct().show();
                this.get_$appbox_kill_btn().show();
                this.get_$appbox_share_info_empty().hide();
            }
        },

        hide: function() {
            if(!is_web_ui) {//appbox
                this.$el.show();
                this.get_$appbox_share_info_ct().hide();
                this.get_$appbox_kill_btn().hide();
                this.get_$appbox_share_info_empty().show();
            } else {
                this.$el.hide();
            }
        },

        get_$appbox_share_info_ct: function() {
            return this.$appbox_share_info_ct || (this.$appbox_share_info_ct = this.$el.find('[data-id=share_count_ct]'));
        },

        get_$appbox_share_info_empty: function() {
            return this.$share_info_empty || (this.$share_info_empty = this.$el.find('[data-id=share_info_empty]'));
        },

        get_$appbox_kill_btn: function() {
            return this.$kill_btn || (this.$kill_btn = this.$el.find('[data-action=bat_cancel_share]'));
        }
    });

    return toolbar;

});