/**
 * 节点数据加载
 * @author jameszuo
 * @date 13-11-13
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        request = common.get('./request'),

        console = lib.get('./console').namespace('disk/TreeLoader'),

        TreeNode = require('./file_list.tree.TreeNode'),
        file_list = require('./file_list.file_list'),
        all_file_map = require('./file.utils.all_file_map'),

        i = 0,

        undef;

    var TreeLoader = function () {


    };


    TreeLoader.prototype = {

        load_path: function (path_ids) {
//            console.log('TreeLoader.load_path');
            var me = this,
                def = $.Deferred(),
                is_resync_path = path_ids.length > 1, // 多个ID认为是同步路径
                start = is_resync_path && new Date().getTime();

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'GetTreeView',
                cavil: true,
                pb_v2: true,
                body: {
                    pdir_key_list: path_ids
                }
            })
                .ok(function (msg, body, header, data) {
                    /**
                     以  微云 > QQQ > QQ收到的文件  目录为例：

                     CGI返回的 data 数据格式示例
                     {
                         "data": {
                             "dirs": [{
                                 "dir_key": "b7914126f0a739ae12b58dcd423dce4a",
                                 "sub_dirs": [{
                                     "has_dir": 0,
                                     "dir_name": "QQQ",
                                     "sub_dir_key": "b7914126d9d3fe3e36e658415c178512"
                                 }, {
                                     "has_dir": 0,
                                     "dir_name": "QQ硬盘",
                                     "sub_dir_key": "b791412673cca77c86b4ff8a19058c8a"
                                 }, {
                                     "has_dir": 0,
                                     "dir_name": "抱走漫画",
                                     "sub_dir_key": "b7914126ddbad0890152dff5195c478b"
                                 }, {
                                     "has_dir": 0,
                                     "dir_name": "微信",
                                     "sub_dir_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                                     "virtual_flag": 1,
                                     "icon": "virtual_icon"
                                 }]
                             }, {
                                 "dir_key": "b7914126d9d3fe3e36e658415c178512",
                                 "sub_dirs": [{
                                     "has_dir": 0,
                                     "dir_name": "QQ收到的文件",
                                     "sub_dir_key": "b7914126702051fdd5fd79f516c96d91"
                                 }]
                             }, {
                                 "dir_key": "b7914126702051fdd5fd79f516c96d91"
                             }]
                         },
                         "ret": 0
                     }
                     */


                    /**
                     输出的 nodes_map 数据格式示例
                     {
                         'b7914126f0a739ae12b58dcd423dce4a': [  // 微云
                             {id: 'b7914126d9d3fe3e36e658415c178512', name: 'QQQ', leaf: false, is_vir: false},
                             {id: 'b791412673cca77c86b4ff8a19058c8a', name: 'QQ硬盘', leaf: false, is_vir: false},
                             {id: 'b7914126ddbad0890152dff5195c478b', name: '抱走漫画', leaf: true, is_vir: false,
                             {id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', name: '微信', leaf: true, is_vir: true, icon: 'weixin'}}
                         ],
                         'b7914126d9d3fe3e36e658415c178512': [  // QQQ
                             {id: 'b7914126702051fdd5fd79f516c96d91', name: 'QQ收到的文件', leaf: true}
                         ],
                         'b7914126702051fdd5fd79f516c96d91': [ ] // QQ收到的文件
                     }
                     */
                    var nodes_map = {},
                        dirs = body['tree_view_list'] || [];
                    $.each(dirs, function (i, dir) {
                        var dir_id = dir['pdir_key'];
                        var sub_dirs = dir['tree_view_dir_list'] || [];
                        var nodes = $.map(sub_dirs, function (kid, j) {
                            var id = kid[ 'dir_key'];
                            var name = kid['dir_name'];
                            var has_dir = kid['has_sub_dir'];
                            var is_vir = kid['virtual_flag'];
                            var icon = kid['virtual_icon'];

                            return {
                                id: id,
                                name: name,// || ('未命名' + i + '.' + j),
                                leaf: has_dir != 1,
                                is_vir: is_vir == 1,
                                icon: icon
                            };
                        });
                        nodes_map[dir_id] = nodes;
                    });

                    def.resolve(nodes_map);
//                    console.log('TreeLoader.load_path OK');
                })
                .fail(function (msg, ret) {
//                    console.log('TreeLoader.load_path fail');
                    def.reject(msg, ret);
                })
                .done(function () {

                })

            return def;
        },

        load: function (node) {
            var id = node.get_id(),
                def = $.Deferred();

//            console.log('TreeLoader.load');

            this.load_path([id])
                .done(function (nodes_map) {
                    nodes_map = nodes_map || {};
                    var nodes = nodes_map[id] && nodes_map[id].length ? $.map(nodes_map[id], function (node_attr) {
                        return new TreeNode(node_attr);
                    }) : [];
                    def.resolve(nodes);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });
            return def;
        }
    };

    return TreeLoader;
});