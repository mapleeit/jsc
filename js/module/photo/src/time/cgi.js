/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        inherit = lib.get('./inherit'),

        request = common.get('./request'),
        query_user = common.get('./query_user'),

        Photo_Node = require('./time.Photo_Node'),
        Time_Group = require('./time.Time_Group');

    var lib_v3_enable = false,
        url,
        cmd;
    query_user.on_ready(function(user) {
        lib_v3_enable = query_user.get_cached_user().is_lib3_user();
        url = lib_v3_enable ? 'http://web2.cgi.weiyun.com/user_library.fcg' : 'http://web2.cgi.weiyun.com/lib_list.fcg';
        cmd = lib_v3_enable ? 'LibPageListGet' : 'get_lib_list';
    });
    //数据加载器
    var loader = {
        header: function (offset) {
            return {
                'cavil': true,
                'url': url,
                'cmd': cmd,
                'pb_v2': lib_v3_enable,
                'body': {
                    "lib_id": 2,	//int型：1表示文档类；2表示图片类；3表示音乐类；4表示视频类
                    "offset": offset,	//int型：从0开始算
                    "count":200,//int型：每页要拉取的数量
                    "sort_type": 3,//int型：排序方式：0上传时间；1修改时间；2字母序；3拍摄时间
                    "group_id": 0,	//int型：当拉取图片类某个分组时有效：1表示未分组
	                "get_abstract_url": true  // 2016.07.04 add by iscowei 返回图片/视频的缩略图url
                }
            };
        },
        request: function (offset) {
            var me = this;
            me.destroy();
            me.JsonpRequest =
                request.xhr_get(me.header(offset))
                    .ok(function (msg, body) {
                        cgi_server.load_ok(body);
                    })
                    .fail(function (msg, ret) {
                        cgi_server.load_er(msg, ret);
                        setTimeout(function () {
                            me.destroy();
                        }, 10);
                    });
        },
        destroy: function () {
            if (this.JsonpRequest) {
                this.JsonpRequest.destroy();
                this.JsonpRequest = null;
            }
        }
    };

    var cgi_server = {
        /**
         * 是否全部加载完成
         * @return {boolean}
         */
        is_complete: function(){
            return this._complete;
        },
        /**
         * 数据加载请求
         * @param offset 请求的偏移量
         * @return $.Deferred
         */
        load_data: function (offset) {
            this.dfd = $.Deferred();
            this._complete = false;
            loader.request(offset);
            return this.dfd;
        },
        /**
         * 外部调用，手动结束任务；
         */
        destroy: function () {
            loader.destroy();
            this._complete = false;
            if (this.dfd) {
                this.dfd.reject({
                    hander_fail: true
                });
            }
        },
        /**
         * 加载失败
         * @param msg
         * @param ret
         */
        load_er: function (msg, ret) {
            this.dfd.reject({
                msg: msg,
                ret: ret
            });
        },
        /**
         * 加载成功
         * @param body
         */
        load_ok: function(body){
            var data = [],
                ret = [];
            if(lib_v3_enable) {
                data = lib_v3_enable ? body.FileItem_items: body.list_item ;
            }
            if(data && data.length){//有数据时
                ret = this._parse_data(data);
                ret.sort(function (node1, node2) {
                    return node2.get_token_date() - node1.get_token_date();
                });
            }
            this.num+= ret.length;
            this._complete = lib_v3_enable ? !!body.finish_flag : !!body.end;//是否已加载完;

            this.dfd.resolve(
                this._sort_group(ret),
                this._get_id_map(ret),
                ret
            );
        },
        /**
         * 数据转换
         * @param ary
         * @returns {Array}
         */
        _parse_data: function (ary) {
            var ret = [];
            for (var i = 0 , j = ary.length; i < j; i++) {
                ret.push(new Photo_Node(ary[i]));
            }
            return ret;
        },
        /**
         * 返回排序分组后的数据
         * @param data
         * @return [Array<Time_Group>]
         */
        _sort_group: function (data) {
            if (!data || !data.length)
                return [];
            //按天分组
            var group = {};
            for (var i = 0, j = data.length; i < j; i++) {
                var node = data[i],
                    day_id = node.get_day_id();
                if (!group[day_id]) {
                    group[day_id] =
                        new Time_Group({
                            'token_time': node.get_token_time()
                        });
                }
                group[day_id].add_node(node);//嫁接
            }
            //按拍摄时间排序
            var sort_array = [];
            for (var key in group) {
                sort_array.push(group[key]);
            }
            sort_array.sort(function (g1, g2) {
                return g2.get_day_id() - g1.get_day_id();
            });
            return sort_array;
        },
        /**
         * 返回f_id -> Photo_Node 的Map格式
         * @param {Array<Photo_Node>} data
         */
        _get_id_map: function (data) {
            var ret = {};
            for (var key in data) {
                ret[data[key].get_id()] = data[key];
            }
            return ret;
        }
    };

    return cgi_server;
});
