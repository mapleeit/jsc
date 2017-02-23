/**
 * appbox 添加微云到主面板
 * @author yuyanghe
 * @date 13-8-6
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        main_ui,
        undefined;

    var ui = new Module('add_wy_appbox_ui', {

        render: function () {

        },
        /*  安装浮窗显示
         *  @params 浮动窗口的对象
         */
        show: function ($Item) {
            this._$el=$Item;
            this._$el.stop(false, true).fadeIn('fast');
            center.listen(this._$el);
            main_ui = require('main').get('./ui');
            if (main_ui && main_ui.is_visible && main_ui.is_visible()) {
                widgets.mask.show('upload_install');
            }
        },

        hide: function () {
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });
                widgets.mask.hide('upload_install');
                this._$el=null;
            }
            return false;
        }

    });

    return ui;
});




