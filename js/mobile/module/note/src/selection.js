/**
 * 列表选择器模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        store = require('./store'),
        undefined;

    var cache = [],
        cache_map = {};

    var selection = new Module('note.selection', {

        select: function(file) {
            cache_map[file.get_id()] = file;
            cache.push(file);
        },

        unselect: function(file) {
            cache_map[file.get_id()] = undefined;
            $.each(cache, function(i, item) {
                if(item.get_id() === file.get_id()) {
                    cache.splice(i, 1);
                }
            })
        },

        toggle_select: function(file) {
            if(typeof file === 'string') {
                file = store.get(file);
            }

            if(cache_map[file.get_id()]) {
                this.unselect(file);
            } else {
                this.select(file);
            }
        },

        clear: function() {
            cache = []
            cache_map = {};
        },

        get_selected: function() {
            return cache;
        },

        is_empty: function() {
            return this.get_selected().length === 0;
        }
    });

    return selection;
});