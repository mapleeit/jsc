/**
 * 多选模块
 * @author hibincheng
 * @date 2015-02-04
 */
define(function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        undefined;

    var select_items = [],
        select_map = {};

    var select_mode = new Module('select_mode', {

        select: function(item) {
            if(!select_map[item]) {
                select_items.push(item);
                select_map[item] = 1;
            }
        },

        unselect: function(item) {
            var index = select_map[item];
            if(select_map[item]) {
                for(var i= 0,len = select_items.length; i < len; i++) {
                    if(select_items[i] === item) {
                        select_items.splice(i, 1);
                        break;
                    }
                }
                delete  select_map[item];
            }
        },

        toggle_select: function(item) {
            if(select_map[item]) {
                this.unselect(item);
            } else {
                this.select(item);
            }
        },

        get_selected_items: function() {
            return select_items;
        },

        is_empty: function() {
            return select_items.length === 0;
        },

        clear: function() {
            select_items = [];
            select_map = {};
        }
    });

    return select_mode;
});