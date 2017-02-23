/**
 *
 * @author jameszuo
 * @date 13-3-5
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
        constants = common.get('./constants'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        main = require('main').get('./main'),
        tmpl = require('./tmpl'),

        file_path,

        cur_node,
        visible,

        init_updated = false,

        undefined;

    var ui = new Module('photo_file_path_ui', {

        path_selector: '_photo_file_path',

        render: function ($to) {
            file_path = require('./file_path.file_path');
            // 事件
            var $el = $('#' + this.path_selector);
            if (!$el[0]) {
                $el = $(tmpl.file_path()).appendTo($to);
            }
            this._$el = $el;
            this._$inner = $el.find('[data-inner]');

            // 全选
            var me = this;
            // 点击路径跳转
            $el.on('click', function (e) {
                e.preventDefault();
            });
            $el.on('click', '[data-more]', function(e) {
                e.stopPropagation();
            });
            $el.on('click', '[data-file-id]', function (e) {
                var $target = $(this),
                    dir_id = $target.attr('data-file-id');

                file_path.trigger('click_path', dir_id);
            });
            $el.show();
        },

        /**
         * 更新路径
         * @param {FileNode} last_lv_node 目标目录
         * @param {FileNode[]} nodes 目录路径
         * @param {Boolean} [enable] 是否可点击，默认true
         */
        update_$nodes: function (last_lv_node, enable) {
            var me = this,
                $inner = me._$inner;
            var $paths = me.measure_path(last_lv_node, enable);
            $inner.empty().append($paths);
            // me._$inner = $paths;

            cur_node = last_lv_node;
            if (scr_reader_mode.is_enable()) {
                // 自动聚焦到路径上（首次打开目录不聚焦）
                if (init_updated) {
                    setTimeout(function () {
                        $inner.find('a[data-cur]').focus();
                    }, 50);
                }
                init_updated = true;
            }
        },

        /**
         * 测量路径，当路径过深时，前面部分收起做为下拉菜单展示
         * @param last_lv_node
         * @param nodes
         * @param enable
         * @returns {*|jQuery|HTMLElement}
         */
        measure_path: function(last_lv_node, enable) {
            return $(tmpl['file_path_items']({ target_node: last_lv_node, enable: !!enable }));
        },

        back: function() {
            if(this._$el && this._$el.find('.item') && this._$el.find('.item').length > 1) {
                this._$el.find('.cur').remove();
                this._$el.find('.item').addClass('cur');
            }
        },

        toggle: function (visible) {
            if(visible) {
                this._$el.show();
            } else {
                this._$el.hide();
            }
        },

        _release_dom: function () {
            var me = this;
            if (me._$inner) {
                me._$inner.empty();
            }
        },

        remove_$path: function() {
            this.__rendered = false;
            this._$el && this._$el.remove();
        },

        toggle_$path: function(visible) {
            this._$inner && this._$inner[visible ? 'show': 'hide']();
        },

        get_$path_warp: function() {
            return this._$el.children(':first');
        }

    });

    return ui;

});