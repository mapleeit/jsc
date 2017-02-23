/**
 * 离线文件列表表头（非目录进入）
 * @author hibincheng
 * @date 2013-11-22
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        Scroller = common.get('./ui.scroller'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        file_list = require('./file_list.file_list'),
        main_ui = require('main').get('./ui'),
        view_switch = require('./view_switch.view_switch'),
        remove = require('./file_list.file_processor.remove.remove'),

        tmpl = require('./tmpl'),
        offline_node, //增加对离线文件目录节点引用
        current_has_scrollbar,
        file_item_height = 47,//每行的高度

        undefined;

    var columns = new Module('offline_columns', {

        render: function($to) {
            if(!this.__rendered) {
                this._$el = $(tmpl.offline_columns());
                $to.append(this._$el).wrapInner(tmpl.offline_columns_wrap());
                this.__rendered = true;

                //this.toggle(view_switch.is_list_view() ? true : false);

                var me = this,
                    should_sync_size = true;

                main_ui.get_$bar2().hide();
                //离线文件是作为网盘的一部分，每次进入都会先在网盘目录，即使在之前已经隐藏了，但query_user load完后会再次显示（main_ui中操作）,所以只有在这里hack一下
                me.listenTo(query_user, 'done', function() {
                    main_ui.get_$bar2().hide();
                });

                me.listenTo(file_list, 'load', function(node) {
                    if(node.is_offline_dir()) {
                        var kids_cnt = node.get_kid_nodes().length;
                        offline_node = node;
                        if(kids_cnt) {
                            if(view_switch.is_list_view()) {
                                main_ui.get_$bar2().show();
                            }
                            me._sync_scrollbar_width_if(node);
                        } else {
                            main_ui.get_$bar2().hide();
                        }

                        if(should_sync_size) {
                            main_ui.sync_size();
                            should_sync_size = false;
                        }
                    }
                });
                me.listenTo(view_switch, 'switch', function(is_grid) {
                    if(is_grid) {
                        //me.toggle(false);
                        main_ui.get_$bar2().hide();
                        main_ui.sync_size();
                    } else {
                        //me.toggle(true);
                        if(offline_node && offline_node.get_kid_nodes().length) {
                            main_ui.get_$bar2().show();
                            main_ui.sync_size();
                        }
                    }
                });

                me.listenTo(remove, 'has_removed', function() {
                    var kids_cnt;
                    if(!offline_node) {
                        return;
                    }
                    kids_cnt = offline_node.get_kid_nodes().length;
                    if(!kids_cnt) {
                        main_ui.get_$bar2().hide();
                        main_ui.sync_size();
                        should_sync_size = true;
                    }
                    me._sync_scrollbar_width_if(offline_node);

                });

                me.listenTo(global_event, 'window_resize', function() {
                    offline_node && me._sync_scrollbar_width_if(offline_node);
                });
            }
        },
        /**
         * 根据数据多少来判断是否会出现滚动条，并同步到表头
         */
        _sync_scrollbar_width_if: function(offline_node) {
            var children_cnt = offline_node.get_kid_nodes().length,
                body_box_height = main_ui.get_$body_box().height();

            if(!children_cnt) {//无数据无需要操作
                return;
            }

            if(children_cnt * file_item_height > body_box_height) {//出现滚动条
                this._sync_scrollbar_width(true);
            } else {
                this._sync_scrollbar_width(false);
            }
        },

        _sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this._$el.css('paddingRight', padding_right + 'px').repaint();
            current_has_scrollbar = has_scrollbar;
        },

        toggle: function(visible) {
            if(this._$el) {
                this._$el[visible ? 'show': 'hide']();
                this._$el.parent().find('[data-file-check]')[visible ? 'show': 'hide']();
            }
        },

        destroy: function() {
            this.stopListening(file_list, 'load');
            this.stopListening(view_switch, 'switch');
            this.stopListening(remove, 'has_removed');
            this.stopListening(global_event, 'window_resize');
            this.stopListening(query_user, 'done');
            offline_node = null;
            if(this._$el) {
                this._$el.parent().find('[data-file-check]').css('display', '');
                this._$el.unwrap();
                this._$el.remove();
            }
            main_ui.get_$bar2().css('display', '');//退出离线文件，之前有做过根据是否有数据显示/隐藏表头的样式清空
            this.__rendered = false;
        },

        is_rendered: function() {
            return this.__rendered;
        }
    });

    return columns;
});