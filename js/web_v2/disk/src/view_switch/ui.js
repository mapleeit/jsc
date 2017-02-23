/**
 * for 普通网盘文件列表
 * @author jameszuo
 * @date 13-11-12
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        view_switch,
        cur_view,
        cur_rank,

        undefined;


    var ui = new Module('disk_view_switch_ui', {

        render: function ($to) {
            if (this._rendered) return;

            view_switch = require('./view_switch.view_switch');
            cur_rank = view_switch.get_cur_rank();
            cur_view = view_switch.get_cur_view();

            var $el = this._$el = $(tmpl['view_switch']({
                    cur_view: cur_view,
                    cur_rank: cur_rank
                }));

            $el.appendTo($to);

            // 点击视图列表中的item
            $el.on('click', '[data-action]', function (e) {
                e.preventDefault();
                var $btn = $(this),
                    data_name = $btn.attr('data-name');
                if($btn.hasClass('cur')) {
                    return;
                }
                $btn.closest('[data-id]').find('.cur').removeClass('cur');
                $btn.addClass('cur');
                if(view_switch.get_view_value_map()[data_name]) {
                    view_switch.set_cur_view(data_name, false);
                } else {
                    view_switch.set_cur_rank(data_name);
                }
            });

            this._rendered = true;
        },

        toggle: function (visible) {
            if(visible) {
                this._$el.show();
            } else if(!visible) {
                this._$el.hide();
            }
        },

        destroy: function() {
            this._rendered = false;
            this._$el && this._$el.remove();
        },

        toggle_mode: function(mode_name, disable) {

        }
    });

    return ui;
});