/**
 * 新版PC分享页
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        FileNode = require('./file.FileNode'),
        NoteNode = require('./file.NoteNode'),
        root_node, //文件目录根节点
        cur_node,  //当前目录节点
        node_map = {},

        undefined;

    function parse(data) {
        var list = [];
        var note_list = [];
        if(data.dir_list && data.dir_list.length > 0) {
            list = list.concat(data.dir_list);
        }

        if(data.file_list && data.file_list.length > 0) {
            list = list.concat(data.file_list);
        }

        if(data.note_list && data.note_list.length > 0) {
            note_list = data.note_list;
        }

        var nodes = [];
        if(list.length > 0) {
            $.each(list || [], function(i, item) {
                nodes.push(new FileNode(item));
            });
        }

        if(note_list.length > 0) {
            $.each(note_list, function(i, note) {
                nodes.push(new NoteNode(note));
            });
        }

        return nodes;
    }

    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }
            this.share_info = data;
            root_node = new FileNode({
                dir_name: '微云分享',
                pdir_key: '_',
                dir_key: data['pdir_key'] || 'root'
            });
            cur_node = root_node;
            node_map[cur_node.get_id()] = cur_node;

            if(data) {
                this.format2nodes(data);
            }

            cur_node.set_load_done(true);
            var dir_len = data.dir_list? data.dir_list.length : 0,
                file_len = data.file_list? data.file_list.length : 0,
                note_len = data.note_list? data.note_list.length : 0;

            if((dir_len + file_len + note_len) === 1) {
                this._single_file = true;
            } else {
                this._single_file = false;
            }

            this._inited = true;
        },

        refresh: function() {
            cur_node.remove_all();
            this.load_more(true);
        },

	    get_vip_info: function() {
		    var defer = $.Deferred();

		    request.xhr_get({
			    url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
			    cmd: 'DiskUserInfoGet',
			    cavil: false,
			    pb_v2: true,
			    header: { appid: 30111 },
			    body: {
				    is_get_weiyun_flag: true
			    }
		    }).done(function(msg, ret, body, header) {
			    if(ret == 0) {
				    defer.resolve(body.weiyun_vip_info ? body.weiyun_vip_info.weiyun_vip : null);
			    } else if(ret == 1031) {   //设置了独立密码的用户
				    defer.resolve(body.weiyun_vip_info ? body.weiyun_vip_info.weiyun_vip : null);
			    } else {
				    defer.reject(null);
			    }
		    }).fail(function() {
			    defer.reject(null);
		    });

		    return defer;
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

            this.abort_load();
            //有子节点说明已加载过
            if(cur_node.get_kid_count()) {
                this.trigger('refresh_done', cur_node.get_kid_nodes(), store);
            } else {
                this.load_more(true);
            }
        },

        load_more: function(is_refresh) {

            if(this._requesting || !is_refresh && cur_node.is_load_done()) {
                return;
            }
            this._requesting = true;

            var me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            this.req = request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareDirList',
                pb_v2: true,
                use_proxy: false,
                body: {
                    dir_key: cur_node.get_id(),
                    get_virtual_dir: false,
                    get_type: 0,
                    start: cur_node.get_kid_nodes().length,
                    count: 50,
                    sort_field: 2,
                    reverse_order: false,
                    get_abstract_url: true
                }
            }).ok(function(msg, body) {
                me._requesting = false;
                var nodes = me.format2nodes(body);
                if(is_refresh) {
                    me.trigger('refresh_done', nodes, store);
                } else {
                    me.trigger('load_done', nodes, store);
                }

            }).fail(function(msg, ret) {
                me._requesting = false;
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        abort_load: function() {
            this._requesting = false;
            this.req && this.req.destroy();
        },

        format2nodes: function(data) {
            var nodes = parse({
                dir_list: data.dir_list,
                file_list: data.file_list,
                note_list: data.note_list
            });

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            cur_node.add_nodes(nodes);
            cur_node.set_load_done(data.finish_flag);
            return nodes;
        },

        set_cur_node: function(node) {
            cur_node = node;
        },

        is_load_done: function() {
            return !!cur_node.is_load_done();
        },

        is_single_file: function() {
            return !!this._single_file;
        },

        get_root_node: function() {
            return root_node;
        },

        get_cur_node: function() {
            return cur_node;
        },

        get: function(file_id) {
            if(typeof file_id == 'string') {
                return node_map[file_id];
            }
            return file_id;

        },

        get_type: function() {
            return this.type = this.type || (this.type = this.share_info.type);
        },

        get_share_info: function() {
            return this.share_info;
        },

        get_share_name: function() {
            return this.share_name = this.share_name || (this.share_name = this.share_info.share_name);
        },

        get_sid: function() {
            return this.share_info['sid'];
        }
    };

    $.extend(store, events);

    return store;
});