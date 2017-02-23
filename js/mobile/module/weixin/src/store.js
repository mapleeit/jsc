/**
 * 微信公众号模块
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        FileNode = require('./file.FileNode'),
        parser = require('./file.parser'),
        account = require('./account'),

        root_node, //文件目录根节点
        cur_node,  //当前目录节点
        node_map = {},

        undefined;

    var store = new Module('weixin.store', {

        init: function(data) {
            if(this._inited) {
                return;
            }
            root_node = new FileNode({
                name: '微云',
                pdir_key: account.get_root_key(),
                dir_key: account.get_main_key()
            });
            cur_node = root_node;
            node_map[cur_node.get_id()] = cur_node;

            if(data) {
                this.format2nodes(data);
            }

            this._inited = true;
        },

        refresh: function() {
            cur_node.remove_all();
            this._load_done = false;
            this.load_more(true);
        },

        share_restore: function() {
            this.trigger('restore');
        },

        load_dir_kid: function(dir_key) {
            if(dir_key === 'root') {
                cur_node = root_node;
            } else {
                cur_node = store.get(dir_key);
            }

            if(!cur_node) {
                return;
            }
            //有子节点说明已加载过
            if(cur_node.get_kid_count()) {
                this.trigger('refresh_done', cur_node.get_kid_nodes(), store);
            } else {
                this.load_more(true);
            }
        },

        load_more: function(is_refresh) {
            if(this._requesting || !is_refresh && this.is_load_done()) {
                return;
            }
            this._requesting = true;

            var me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
                cmd: 'DiskDirBatchList',
                body: {
                    pdir_key: cur_node.get_pdir_key(),
                    dir_list: [{
                        dir_key: cur_node.get_id(),
                        get_virtual_dir: false,
                        get_type: 0,
                        start: cur_node.get_kid_nodes().length,
                        count: 50,
                        sort_field: 2,
                        reverse_order: false,
                        get_abstract_url: true
                    }]
                }
            }).ok(function(msg, body) {
                var data = body['dir_list'][0];
                var nodes = me.format2nodes(data);
                if(is_refresh) {
                    me.trigger('refresh_done', nodes, store);
                } else {
                    me.trigger('load_done', nodes, store);
                }

            }).fail(function(msg, ret) {
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        format2nodes: function(data) {
            var nodes = parser.parse({
                dir_list: data.dir_list,
                file_list: data.file_list
            });

            this._load_done = !!data.finish_flag;

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            cur_node.add_nodes(nodes);
            return nodes;
        },

        set_cur_node: function(node) {
            cur_node = node;
        },

        is_load_done: function() {
            return !!this._load_done;
        },

        is_requesting: function() {
            return !!this._requesting;
        },

        is_root_node: function() {
            return cur_node === root_node;
        },

        get_root_node: function() {
            return root_node;
        },

        get_cur_node: function() {
            return cur_node;
        },

        get: function(file_id) {
            return node_map[file_id];
        }
    });

    return store;
});