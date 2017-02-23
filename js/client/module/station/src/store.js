/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        FileNode = require('./file.FileNode'),
        parser = require('./file.parse'),
        events = lib.get('./events'),

        nodes,
        node_map = {},

        undefined;

    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }

            if(data) {
                nodes = this.format2nodes(data);
            }

            this._inited = true;
            //this.trigger('before_refresh');
            this.trigger('refresh_done', nodes);
        },

        add: function(data) {
            if(data) {
                nodes = this.format2nodes(data);
                this.trigger('add', nodes);
            }
        },

        refresh: function() {
            //cur_node.remove_all();
            //this._load_done = false;
            //this.load_more(true);
        },

        clear: function() {
            nodes = null;
            node_map = {};
            this._inited = false;
            this.trigger('before_refresh');
        },

        format2nodes: function(data) {
            var nodes = parser.parse({
                file_list: data.file_list
            });

            this._load_done = !!data.finish_flag;

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            return nodes;
        },

        is_load_done: function() {
            return !!this._load_done;
        },

        is_requesting: function() {
            return !!this._requesting;
        },


        get: function(file_id) {
            return node_map[file_id];
        }
    };
    $.extend(store, events);

    return store;
});