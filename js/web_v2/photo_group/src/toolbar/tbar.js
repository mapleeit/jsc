/**
 * 工具条（编辑态）
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('disk/tbar'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        toolbar,
        status_map = {},
        nil = '请选择文件',

        undef;


    return new Module('photo_group_tbar', {

        /**
         * 渲染工具栏
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this,
                default_handler = function (e) {   //  this -> Button / ButtonGroup
                    if (this.is_enable()) {
                        me.trigger(this.get_id(), e);
                    }
                },

                btns = [
                    // 下载
                    new Button({
                        id: 'pack_down',
                        label: '下载',
                        icon: 'ico-down',
                        filter: 'single',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('TOOLBAR_DOWNLOAD');
                        },

                        validate: function () {

                        }
                    }),
                    // 删除
                    new Button({
                        id: 'del',
                        label: '删除',
                        icon: 'ico-del',
                        filter: 'single',
                        focusing: false,
                        handler: default_handler,
                        before_handler: function () {
                            user_log('TOOLBAR_MANAGE_DELETE');
                        },

                        validate: function () {

                        }
                    })
                ];


            $(tmpl.editbar()).appendTo($to.empty());
            this._$editbar = $to;

            toolbar = new Toolbar({
                cls: 'disk-toolbar',
                apply_to: '#_main_bar1',
                btns: btns,
                filter_visible: true
            });
            toolbar.render($to);
            toolbar.filter('single');
        },

        /**
         * 更新工具栏状态
         * @param {String} filter
         * @param {Status} status
         */
        set_status: function (filter, status) {
            status_map[filter] = status;
        },

        get_status: function (filter) {
            return status_map[filter];
        },

        //标识编辑态bar是否可见
        set_visibility: function(visibility) {
            if(!this._visibility || this._visibility !== visibility) {
                this._visibility = visibility;
            }
        },

        get_visibility: function() {
            return !!this._visibility;
        },

        on_activate: function() {
            this.activate();
            this.__rendered = false;
        },

        on_deactivate: function() {
            this.clear_$editbar();
            this.deactivate();
        },

        clear_$editbar: function() {
            this._$editbar && this._$editbar.empty();
        },

        get_$el: function () {
            return toolbar.get_$el();
        },

        toggle_toolbar: function(filter) {
            toolbar.filter(filter);
        }
    });
});