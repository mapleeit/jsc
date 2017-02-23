/**
 * 离线文件数据加载
 * @author trumpli
 * @date 13-3-4
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        console = lib.get('./console'),
        covert = lib.get('./covert'),

        request = common.get('./request'),
        disk_event = common.get('./global.global_event').namespace('disk'),

        file_list,
        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),
        all_file_map = require('./file.utils.all_file_map'),

        view_switch,
        request_dir;//要请求的数据 父目录FileNode对象

    var loader = {
        /**
         * 返回离线文件拉的列表请求头
         * @param node
         * @param offset
         * @param list_type  拉取的文件类型 0:全部，1表示下载发送的文件，2表示下载接收的文件
         * @returns {{url: string, cmd: string, body: {offline_list_type: *, pdir_key: *, dir_key: *, sort_type: number, list_type: number, offset: *, number: number}, cavil: boolean, resend: boolean}}
         */
        offline_header: function (node, offset, list_type) {
            return {
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                'cmd': 'VirtualDirDirList',
                'body': {
                    offline_list_type: list_type,
                    pdir_key: node.get_pid(),
                    dir_key: node.get_id(),
                    sort_type: 0, // 0表示按照修改时间排序
                    list_type: 0, // 1=增量拉取，0=全量拉取
                    offset: offset, // 起始下标
                    number: 100 // 拉取文件个数
                },
                pb_v2: true,
                'cavil': true,
                'resend': true
            };
        },
        /**
         * 单次获取后台数据
         * @param type
         * @param offset
         * @returns {*}
         */
        request: function (type, offset) {
            this.JsonpRequest =
                request.xhr_get(this.offline_header(request_dir, offset, Store.data[type].list_type))
                    .ok(function (msg, body) {
                        var files = type === 'send_list' ? body['OfflineFileSendItem_items'] : body['OfflineFileRecvItem_items'];
                        files = files || []
                        if(files && files.length) {
                            files = file_node_from_cgi.offline_files_from_cgi2(files, type);
                        }
                        Store.append(type, (body['total'] || 0), files);
                    })
                    .fail(function (msg, ret) {
                        file_list.trigger('error', msg, ret);
                        Store.error();
                    });
        },
        destroy: function () {
            if (this.JsonpRequest) {
                this.JsonpRequest.destroy();
                this.JsonpRequest = null;
            }
        }
    };
    var Store = {
        /**
         * 初始化数据格式
         */
        init_data: function () {
            loader.destroy();
            this.data = {
                sort_filed: '',//排序类型
                has_init: false,
                total: 0,
                offset: 0,
                files: [],
                id_map: {},
                all: {
                    done: false,
                    list_type: 'sed_list',
                    offset: 0,//当前位置
                    total: 0//服务端总长度
                },
                send_list: {
                    done: false,
                    list_type: 1,
                    offset: 0,//当前位置
                    total: 0//服务端总长度
                },
                recv_list: {
                    done: false,
                    list_type: 2,
                    offset: 0,//当前位置
                    total: 0//服务端总长度
                }
            };
        },
        get_total_length: function(){
            return this.data.total;
        },
        /**
         * ID获取File_Node对象
         * @param id
         * @returns {File_Node}
         */
        get_file_by_id: function (id) {
            return this.data.id_map[id];
        },
        /**
         * 返回全部File_Node对象
         * @returns {Array<File_Node>}
         */
        get_all_file: function(){
            return this.data.files;
        },
        /**
         * 加载数据入口
         * @param node
         * @param reset_ui
         */
        render: function (node, reset_ui) {
            this.from_refresh = reset_ui;
            if (!view_switch) {
                view_switch = require('./view_switch.view_switch');
                file_list = require('./file_list.file_list');
            }
            request_dir = node;
            this.init_data();
            this.call_loader();
        },
        remove_files: function (id_map) {
            var me = this,
                cut_num = 0;
            for (var len = me.data.offset - 1; len >= 0; len--) {
                var file = me.data.files[len];
                if (id_map[file.get_id()]) {
                    me.data.files.splice(len, 1);
                    cut_num += 1;
                }
            }
            me.data.offset -= cut_num;
            me.data.total -= cut_num;
        },
        /**
         * 按数目，返回要显示的数据
         * @param {number} [num] 拉取的数量
         * @param {boolean} [is_increment] 是否增量拉取
         */
        get_show_nodes: function (num, is_increment) {
            is_increment = typeof is_increment === 'boolean' ? is_increment : true;
            if (is_increment) {
                return this._get_increment_files(num);//增量拉取数据
            } else {
                return this._get_batch_files(num);//批量拉取数据
            }
        },
        /**
         * 增量获取数据 初始化位置从上次拉取的位置开始
         * @param num 要取的数量
         * @returns {Array<File_Node>|0|-1} 0: 没有数据 ; -1:数据已经读取完了; 否则返回的是请求批次的数据
         */
        _get_increment_files: function (num) {
            var me = this;
            if (me.data.total === 0) {
                return 0;
            }
            var cur_offset = me.data.offset;
            if (me.data.total === cur_offset) {
                return -1;
            }
            var ret = me.data.files.slice(cur_offset, num + cur_offset);
            me.data.offset = ret.length + me.data.offset;//调整偏移量
            return ret;
        },
        /**
         * 批量获取数据 初始化位置从0开始
         * @param num 要取的数量
         * @returns {Array<File_Node>|0|-1} 0: 没有数据 ; -1:数据已经读取完了; 否则返回的是请求批次的数据
         */
        _get_batch_files: function (num) {
            var me = this;
            if (me.data.total === 0) {
                return 0;
            }
            var ret = me.data.files.slice((me.data.offset = 0), num);
            me.data.offset = ret.length;//调整偏移量
            return ret;
        },
        /**
         * 所有的离线文件都已经显示完成
         * @returns {boolean}
         */
        is_all_show: function () {
            return this.data.total === this.data.offset;
        },
        /**
         * 是否没有数据
         * @returns {boolean}
         */
        is_empty: function () {
            return this.data.has_init && this.data.total === 0;
        },
        /**
         * 文件排序
         * @returns {boolean} 排序成功标识
         */
        sort: function () {
            var filed = view_switch.get_cur_view();
            if (filed === 'azlist' || filed === 'grid') {
                filed = 'name';
            } else {
                filed = 'time';
            }
            if (this.sort_filed === filed && this.data.total === 0) {//排序失败
                return false;
            }
            if (filed === 'name') {//按名称排序
                this.data.files.sort(function (f1, f2) {
                    var f1_name = f1.get_name().toLowerCase(),
                        f2_name = f2.get_name().toLowerCase();
                    return f1_name === f2_name ? 0 : (f1_name < f2_name ? -1 : 1);
                });
                this.sort_filed = 'name';
            } else if (filed === 'time') {//按时间排序
                this.data.files.sort(function (f1, f2) {
                    return f2.get_life_time() - f1.get_life_time();
                });
                this.sort_filed = 'time';
            }
            var files = this.data.files,
                len = files.length;
            while (len) {
                len -= 1;
                this.data.id_map[files[len].get_id()] = files[len];
            }
            return true;
        },
        /**
         * 数据加载出错 触发通用错误
         */
        error: function () {
            file_list.trigger('after_async_load');
        },
        /**
         * 销毁数据加载
         */
        destroy: function () {
            this.init_data();
            file_list.trigger('after_async_load');
        },
        silent_destroy: function () {
            this.init_data();
        },
        /**
         * 调用数据加载
         */
        call_loader: function () {
            var me = this;
            if (!me.data.send_list.done) {//发送列表没有完成,获取发送数据
                loader.request('send_list', 0);
            } else if (!me.data.recv_list.done) {//接收列表没有完成,获取接受数据
                loader.request('recv_list', 0);
            } else {//全部加载完成
                me.data.total = me.data.send_list.total + me.data.recv_list.total;//计算总数
                me.data.has_init = true;
                me.sort();
                request_dir.set_nodes([], me.data.files);//添加到数结构中
                file_list.trigger('load', request_dir, request_dir, [], me.data.files, true, me.data.total);
                file_list.trigger('after_async_load');
                disk_event.trigger('file_list_load', request_dir);
            }
        },
        /**
         * 添加到数据集合中
         * @param type
         * @param total
         * @param files
         */
        append: function (type, total, files) {
            var me = this,
                who = me.data[type];
            who.total = total;
            who.offset = who.offset + files.length;
            me.data.files = me.data.files.concat(files);
            if (total > who.offset) {
                setTimeout(function () {
                    loader.request(type, who.offset);
                }, 10);
            } else {
                who.done = true;
                me.call_loader();
            }
        }
    };

    return Store;
});