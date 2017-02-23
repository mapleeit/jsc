/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        inherit = lib.get('./inherit'),

        Module = common.get('./module'),
        request = common.get('./request'),

        cgi = require('./time.cgi'),

        STATE = {
            loader_loading: 'loader_loading',//加载中
            loader_done: 'loader_done',//加载完成
            loader_error: 'loader_error',//加载出错
            loader_quit: 'loader_quit'//退出状态
        },

        DELETE_STATE = {
            OK: 'delete_ok',//删除成功
            FAIL: 'delete_fail',//删除失败
            DELETE_TIME_GROUP: 'delete_time_group'
        };

    var Store = new Module('photo_time_store', {
        /**
         * 删除数据
         * @param nodes
         */
        remove_data: function (nodes) {
            var ret = this._delete_nodes(nodes);
            this.trigger_event(DELETE_STATE.OK, ret.file_ids);
            this.trigger_event(DELETE_STATE.DELETE_TIME_GROUP, ret.group_ids);//触发其他删除连带动作

            //先触发事件，因为事件的监听方法还会用到nodes，所以store的cache最后清理 （这是一个妥协处理， 不然改造影响比较大）
            var cache = this.cache;
            for (var file_id in ret.file_ids) {//删除id_map中的节点映射关系
                if(cache.id_map[file_id]){
                    delete cache.id_map[file_id];
                    cache.node_length -= 1;//节点数减一
                }
            }
        },
        /**
         * 删除节点
         * @param nodes
         * @private
         */
        _delete_nodes: function (nodes) {
            var me = this,
                cache = me.cache,
                ret = {
                    file_ids:{},
                    group_ids:[]
                };
            $.each(nodes, function (i, node) {
                ret.file_ids[node.get_id()] = 1;
            });

            /*for (var file_id in ret.file_ids) {//删除id_map中的节点映射关系
                if(cache.id_map[file_id]){
                    delete cache.id_map[file_id];
                    cache.node_length -= 1;//节点数减一
                }
            }*/

            var len = cache.sort_group.length;//删组
            while(len){
                len-=1;
                var group = cache.sort_group[len];
                if ( group.remove_nodes(ret.file_ids) === 0) {//删除包含的节点//删除时间组
                    ret.group_ids.push(group.get_day_id());
                    cache.sort_group.splice(len, 1);//队列中删除
                    cache.group_length -= 1;//时间组数减一
                    if (len === cache.offset && cache.offset > 1) {
                        cache.offset -= 1;
                    }
                }
            }

            var len2 = cache.id_array.length;//删节点数组
            while(len2){
                len2-=1;
                if (ret.file_ids.hasOwnProperty(cache.id_array[len2].get_id())) {//删除id_array中的节点
                    cache.id_array.splice(len2, 1);//队列中删除
                }
            }
            return ret;
        },
        /**
         * 数据添加到cache中
         * @param sort_group 排序后的分组
         * @param id_map ID map
         * @param nodes
         */
        append_data: function (sort_group, id_map, nodes) {
            var cache = this.cache;
            if (cache.node_length > 0 && nodes.length > 0) {//非初次加载数据 ，新加载的有数据
                var last_ind = cache.group_length - 1,
                    last_group = cache.sort_group[last_ind];
                if (last_group.get_day_id() === sort_group[0].get_day_id()) {//上批次的最后一个分组 和 新分组的第一个分组 day_id 相同;
                    sort_group[0].each(function(node){
                        last_group.add_node(node);
                    });
                    last_group.set_dirty(true);
                    sort_group.shift();
                }
            }
            cache.sort_group = cache.sort_group.concat(sort_group);//合并分组
            cache.group_length = cache.sort_group.length;//分组长度
            for (var key in id_map) {//节点ID HashMap
                cache.id_map[key] = id_map[key];
            }
            cache.id_array = cache.id_array.concat(function () {//节点ID Array
                var ret = [];
                for(var i =0 ,j = nodes.length;i <j;i ++){
                    ret.push(nodes[i]);
                }
                return ret;
            }());
            cache.node_length += nodes.length;//节点长度
        },
        /**
         * 加载更多数据
         */
        load_more: function (callback) {
            if(cgi.is_complete()){
                callback && callback.call(this,true);
                return;
            }
            var me = this,
                offset = me.cache.node_length;
            me.trigger_event(STATE.loader_loading);
            cgi.load_data(offset)//数据加载
                .done(function (sort_group, id_map,nodes) {
                    me.append_data(sort_group, id_map, nodes);
                    me.trigger_event(STATE.loader_done, (!me.cache.sort_group || !me.cache.sort_group.length) , offset === 0 , me.from_refresh);
                    callback && callback.call(me,true);
                })
                .fail(function (ops) {
                    if (ops && ops.hander_fail) {//手动触发失败，不进行事件转发
                        return;
                    }
                    me.trigger_event(STATE.loader_error, ops.msg, ops.ret);
                    callback && callback.call(me,false);
                });
        },
        /**
         * 数据重置
         */
        reset_data: function () {
            cgi.destroy();
            this.cache = {
                sort_group: [],
                id_map: {},
                id_array: [],
                node_length: 0,
                group_length: 0,
                offset: 0//已被读取的位置
            };
        },
        /**
         * 事件触发
         */
        trigger_event: function () {
            var event = Array.prototype.shift.call(arguments);
            if (STATE[event]) {
                this.state = STATE[event];
            }
            this.trigger('change', event, arguments);
        }
    });
    //监听外部方法
    $.extend(Store, {
        on_delete: function () {
            //删除数据
        }
    });
    return $.extend(Store, {
        /**
         * 外部初始化接口
         * @param {boolean} refresh 来自刷新
         */
        render: function (refresh) {
            this.from_refresh = refresh;
            this.reset_data();
            this.load_more();
        },
        /**
         * 分批加载数据
         * @param width     容器宽度
         * @param height    容器高度
         * @param cell_wh   单元格高度、宽度
         * @param group_dis 组间距
         */
        get_more: function (width, height, cell_wh, group_dis) {
            var max_h = 2 * height,//最大输出高度
                cur_h = 0,//当前新元素占据的高度
                num_per_row = Math.floor(width / cell_wh),//每一行能容纳的文件数
                array = this.cache.sort_group,
                offset = this.cache.offset;
            var ret_ary = [],
                row_height;

            if(offset > 0 && array[offset -1].is_dirty()){
                offset = this.cache.offset = offset - 1;
            }
            while (array[offset]) {
                row_height = Math.floor(array[offset].length / num_per_row);
                if (!row_height) {
                    row_height = 1;
                }
                cur_h += row_height * cell_wh;
                cur_h += group_dis;
                ret_ary.push(array[offset]);
                offset += 1;
                if (cur_h >= max_h) {
                    break;
                }
            }
            this.cache.offset = offset;
            if (this.cache.offset >= this.cache.group_length && !cgi.is_complete()) {
                Store.load_more();
            }
            return ret_ary;
        },
        /**
         * 缩略图call more
         **/
        thumb_load_more: function(callback){
            Store.load_more(function(is_ok){
                if(is_ok){
                    callback.call(null,{
                        nodes: Store.get_all_node_array(),
                        complete: cgi.is_complete(),
                        total: Store.get_all_node_array().length
                    });
                } else {
                    callback.call(null,{ fail: true });
                }
            });
        },
        /**
         * 获取所有Node长度
         * @returns {*}
         */
        node_length: function () {
            return this.cache.node_length;
        },
        /**
         * 数组的方式获取所有Node
         * @returns {Array<Node>}
         */
        get_all_node_array: function () {
            return this.cache.id_array;
        },
        /**
         * 按ID获取Node对象
         * @param id
         * @returns {*}
         */
        get_node_by_id: function (id) {
            return this.cache.id_map[id];
        },
        /**
         * 正在加载中
         * @returns {boolean}
         */
        is_loading: function () {
            return this.state === STATE.loader_loading;
        },
        /**
         * 加载是否完成
         * @returns {boolean}
         */
        is_complete: function () {
            return (this.state === STATE.loader_done || this.state === STATE.loader_error);
        },
        /**
         * 退出时的处理
         */
        destroy: function () {
            this.reset_data();
            this.trigger_event(STATE.loader_quit);
        },
        /**
         * 是否已经全部输出到界面上了 ，并且 cgi已经全部加载完成
         * @returns {boolean}
         */
        is_all_show: function () {
            return (this.cache.offset >= this.cache.sort_group.length) && cgi.is_complete();
        },
        /**
         * 根据节点查找所在的时间分组
         * @param node
         * @returns {*}
         */
        get_group_by_node: function(node) {
            var day_id = node.get_day_id();
            var sort_group = this.cache.sort_group || [],
                des_group;
            $.each(sort_group, function(i, group) {
                if(group.get_day_id() === day_id) {
                    des_group = group;
                    return false; // to break;
                }
            });

            return des_group;
        },

        /**
         * 获取所有唯一的节点，即过滤掉同一时间组下相同的照片（相同的照片只保留一张用于显示）
         * @returns {Array}
         */
        get_all_unique_nodes: function() {
            var ret = [];
            $.each(this.cache.sort_group, function(i, group) {
                ret = ret.concat(group.get_array());
            });
            return ret;
        }
    });
});
