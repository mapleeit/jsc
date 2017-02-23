
/**
 * 新版PC侧分享页
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
        store = require('./store'),

        undefined;

    var header = new Module('outlink.header', {

        render: function() {
            if(this._inited) {
                return;
            }

            this._render_user_info();

            this._render_toolbar();

            this._inited = true;
        },

        _render_user_info: function() {
            require('./header.user_info').render();
        },

        _render_toolbar: function() {
            var me = this;

            this.$toolbar = $('#outlink_toolbar').on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');

                me.trigger('action', action_name, e);
            });
        },

        show_btn: function(btn_name) {
            this.$toolbar.find('[data-action='+btn_name+']').show();
        },

        hide_btn: function(btn_name) {
            this.$toolbar.find('[data-action='+btn_name+']').hide();
        }

    });

    return header;
});