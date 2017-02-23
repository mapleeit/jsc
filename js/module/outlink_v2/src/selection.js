/**
 * 列表选择器模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        store = require('./store'),

        sel_box,
        undefined;

    var cache = [],
        cache_map = {};

    var selection = {

        init: function(enable_box_select) {
            enable_box_select && this._init_box_selection();
        },

        _init_box_selection: function() {
            var SelectBox = common.get('./ui.SelectBox');
            var $list = $('#_file_list');
            sel_box = new SelectBox({
                ns: 'share',
                $el: $list,
                $scroller: $('#lay-main-con'),
                all_same_size: true,
                keep_on: function($tar) {
                    return $tar.is('label');
                },
                clear_on: function($tar) {
                    return $tar.closest('[data-file-id]').length === 0;
                },
                container_width: function() {
                    return $list.width();
                }
            });

            sel_box.enable();

            var me = this;
            this.listenTo(sel_box, 'select_change', function(sel_id_map, unsel_id_map) {
                var sel_ids = [],
                    unsel_ids = [];
                for(var id in sel_id_map) {
                    if(sel_id_map.hasOwnProperty(id) && sel_id_map[id]) {
                        sel_ids.push(id);
                    }
                }

                for(var id in unsel_id_map) {
                    if(unsel_id_map.hasOwnProperty(id) && unsel_id_map[id]) {
                        unsel_ids.push(id);
                    }
                }

                if(sel_ids.length) {
                    me._select_files(sel_ids);
                }

                if(unsel_ids.length) {
                    me._unselect_files(unsel_ids);
                }
            });
        },

        _select_files: function(files, slient) {
            $.each(files, function(i, file) {
                file = typeof file === 'string' ? store.get(file) : file;
                cache_map[file.get_id()] = file;
                cache.push(file);
            });

            !slient && this.trigger('selected', files, this.is_all_select());
        },

        _unselect_files: function(files, slient) {
            $.each(files, function(i, file) {
                file = typeof file === 'string' ? store.get(file) : file;
                cache_map[file.get_id()] = undefined;
                $.each(cache, function(i, item) {
                    if(item.get_id() === file.get_id()) {
                        cache.splice(i, 1);
                        return false;
                    }
                });
                sel_box && sel_box.set_selected_status([file.get_id()], false);
            });

            !slient && this.trigger('unselected', files);
        },

        _change_checkbox: function(files, select) {
            var file_ids = [];
            if(!sel_box) {
                return;
            }
            $.each(files, function(i, file) {
                var file_id = typeof file === 'string' ? file : file.get_id();
                file_ids.push(file_id);
            });
            sel_box.set_selected_status(file_ids, !!select);
        },

        select: function(files, slient) {
            files = $.isArray(files) ? files: [files];
            this._select_files(files, slient);
            this._change_checkbox(files, true);
        },

        unselect: function(files, slient) {
            files = $.isArray(files) ? files: [files];
            this._unselect_files(files, slient);
            this._change_checkbox(files, false);
        },

        toggle_select: function(file) {
            if((typeof file === 'string') && cache_map[file] ||  file.get_id && cache_map[file.get_id()]) {
                this.unselect(file);
            } else {
                this.select(file);
            }
        },

        clear: function() {
            cache = [];
            cache_map = {};
            sel_box && sel_box.clear_selected();
        },

        get_selected: function() {
            return cache;
        },

        get_sel_box: function() {
            return sel_box;
        },

        is_all_select: function() {
            var is_all_select = false;
            //判断是否已经到达全选
            if(store.get_cur_node().get_kid_count() === cache.length) {
                is_all_select = true;
            }
            return is_all_select;
        },

        is_empty: function() {
            return this.get_selected().length === 0;
        }
    };

    $.extend(selection, events);

    return selection;
});