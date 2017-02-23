/**
 * 文件列表模块
 * @author jameszuo
 * @date 13-3-4
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/file_list'),
        events = lib.get('./events'),
        security = lib.get('./security'),
        text = lib.get('./text'),
        routers = lib.get('./routers'),
        covert = lib.get('./covert'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        cgi_ret_report = common.get('./cgi_ret_report'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        global_event = common.get('./global.global_event'),
        // disk_event = common.get('./global.global_event').namespace('disk'),
        global_function = common.get('./global.global_function'),
        global_variable = common.get('./global.global_variable'),
        ret_msgs = common.get('./ret_msgs'),
	    logger = common.get('./util.logger'),
        main_mod = require('main'),

        FileNode = require('./file.file_node'),
        file_factory = require('./file.utils.file_factory'),
        all_file_map = require('./file.utils.all_file_map'),
        offline_store = require('./file_list.offline.Store'),
        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),

        upload_event = common.get('./global.global_event').namespace('upload2'),

    // 文件选取、拖拽模块
        selection,
    // 文件删除模块
        remove,
    // 文件移动模块
        move,
    // 切换视图
        view_switch,

    // 空间信息
    // space_info, // james 2013-6-5 space_info 移到main模块下了
        space_info = main_mod.get('./space_info.space_info'),

    // 排序
        sorter,


        long_long_ago = '2000-01-01 01:01:01',

        super_node,// 抽象根节点（root_node.parent_node）
        root_node, // 文件的根节点

        dir_QQ, // QQ 目录
        dir_QQ_recv, // QQ收到的文件目录

        page_size = 100, // 分页大小
        curr_page, // 当前页码
        curr_node, // 当前所在的目录节点
        last_node, // 上一次所在的目录节点 james 2013-6-5
        last_load_req, // 上一次请求的 request 实例

        async_loading = false, // 正在记载中
        first_loaded,

        GET_DIR_INFO_CGI = 'http://web2.cgi.weiyun.com/weiyun_other.fcg',//根据appid获取目录信息的cgi

        undefined;

    // 文件列表模块
    var file_list = new Module('disk_file_list', {

        ui: require('./file_list.ui'),

        render: function () {

            remove = require('./file_list.file_processor.remove.remove');
            move = require('./file_list.file_processor.move.move');
            selection = require('./file_list.selection.selection');
            view_switch = require('./view_switch.view_switch');

            this.add_sub_module(remove);
            this.add_sub_module(move);
            this.add_sub_module(selection);

            this
                // 文件已从服务器上删除后，同步本地缓存
                .listenTo(remove, 'has_removed', function (nodes) {
                    if(typeof nodes[0] === 'string') { //id 形式传入
                        nodes = all_file_map.get_all(nodes);
                    }
                    this.remove_nodes(nodes, true, true);
                })

                // 文件已从服务器上移动后，同步本地缓存
                .listenTo(move, 'has_moved', function (nodes, par_id, dir_id) {
                    if(typeof nodes[0] === 'string') { //id 形式传入
                        nodes = all_file_map.get_all(nodes);
                    }
                    this.move_nodes(nodes, dir_id);
                })

                // 切换视图后，排序
                .listenTo(view_switch, 'switch.ui_normal', function (rank, view_name, temp) {
                    if (!temp) {
                        var cur_node = this.get_cur_node();
                        if (cur_node) {
                            //this._sort_cur_node(cur_node, rank);
                            this.trigger('load', cur_node, cur_node.get_kid_dirs() , cur_node.get_kid_files() , 0);
                        }
                    }
                }).listenTo(view_switch, 'switch.rank', function (rank) {
                    var cur_node = this.get_cur_node();
                    if (cur_node) {
                        //this._sort_cur_node(cur_node, rank);
                        this.trigger('load', cur_node, cur_node.get_kid_dirs() , cur_node.get_kid_files() , 0);
                    }
                });

            this
                // 添加节点后更新空间信息（只是计算了追加进来的文件的大小，完全不准确 - james）
                .on('append_node prepend_node', function (dirs, files) {
                    var sum_size = 0;

                    files && files.length && $.each(files, function (i, node) {
                        sum_size += node.get_size();
                    });

                    if (sum_size > 0) {
                        space_info.add_used_space_size(sum_size);
                    }
                });

            // 激活时重新加载列表
            this.on('activate', function () {

                var me = this,
                    restore_ids = global_variable.del('recycle_restored_ids'),
                    restore_msg = global_variable.del('recycle_restored_msg'),
                    restore_is_ok = global_variable.del('recycle_restored_is_ok');

                 //强插
                me.trigger('external_insert_files', restore_ids, restore_msg, restore_is_ok);
                // 如果不是跳转打开目录，则重新加载
                if (routers.get_param('reload') !== '0') {
                    // 如果有还原文件，则刷新根目录
                    if (restore_ids && restore_ids.length > 0) {
                        me.load_root(false);
                    } else {
                        // 从内存中重新加载
                        me.reload(true, false, false);  // true -> false 和erric确认过，返回网盘时保持网盘当前状态，不跳转到根目录。james
                    }
                }
                routers.unset('reload');
            });

            // 卸载
            this.on('deactivate', function () {

            });
        },

        /**
         * 根据hash path设置当前的访问路径
         */
        set_path: function (path, from_cache, reset_ui) {
            var o, node, map, async_load_appid,
                me = this,
                map_dirs = constants.VIRTUAL_DIRS,
                pids, pnames, highlights, def;
//            this.set_cur_node(null);
            if (me.__rendered && me.__activated && (me._inited || me.init())) {
                node = root_node;
                if ($.isArray(path)) {
                    if (typeof path[0] === 'object') {
                        // path最后一个如果为数组，表明是要高亮的文件id列表
                        if ($.isArray(path[path.length - 1])) {
                            highlights = path.pop();
                        }
                        // 其它的就是从根目录开始的路径
                        pids = [];
                        pnames = [];
                        $.each(path, function (index, dir_cfg) {
                            pids.push(dir_cfg.id);
                            pnames.push(dir_cfg.name);
                        });
                        def = this.load_path(pids, pnames, !!from_cache);
                        if (highlights) {
                            def.done(function () {
                                // 恶心的规避，列表渲染有点延迟
                                setTimeout(function () {
                                    me.ui.highlight_$item(highlights);//高亮完成文件
                                }, 500);
                            });
                        }
                        me._path = null;
                        return;
                    } else {
                        $.each(path, function (index, name) {
                            node = node && collections.first(node.get_kid_dirs(), function (child) {
                                return child && child.get_route_hash() === name;
                            });
                            if (!node) {
                                async_load_appid = map_dirs[name] && map_dirs[name].appid;
                                if (map_dirs[name] && map_dirs[name].children) {
                                    map_dirs = map_dirs[name].children;
                                }
                                if (!async_load_appid) {
                                    return false;
                                }
                            }
                        });
                    }
                }

                node = node || root_node;
                me._path = null;

                if (async_load_appid) {//使用appid异步获取节点
                    me.enter_spec_dir_by_appid(async_load_appid)
                        .done(function (enter_dir) {
                            me.load(enter_dir, from_cache, 0, reset_ui);
                        })
                        .fail(function () {
                            me.load(node, from_cache, 0, reset_ui);
                        });
                } else {
                    if (node)
                        me.load(node, from_cache, 0, reset_ui);
                }
            } else {
                me._path = path;
            }
        },

        /**
         * 将当前的访问路径存储到hash中
         */
        store_path: function (path) {
//            setTimeout(function () {
//                path.unshift('disk');
//                routers.replace({
//                    m: path.join('.')
//                }, true);
//            }, 0);
        },
        /**
         * 设置离线文件目录 (屏蔽离线文件入口 todo)
         * @param vir_dirs
         */
        //set_offline_dir: function (vir_dirs) {
        //    var me = this;
        //    if (vir_dirs && vir_dirs.length) {
        //        var len = vir_dirs.length;
        //        while (len) {
        //            len -= 1;
        //            if (vir_dirs[len].is_offline_dir()) {
        //                me.offline_dir = vir_dirs[len];
        //                //vir_dirs.splice(len, 1); //屏蔽离线文件入口
        //                return;
        //            }
        //        }
        //    }
        //},
        /**
         * 处理直出数据
         * @param {User} usr query_user.User
         * @param {Object} rsp_body 从CGI返回的body
         */
        set_init_data: function (usr, rsp_body) {
            this.init(usr);

            var data = this._get_data_from_rsp(rsp_body),
                _vir_dirs = data.vdirs,
                _dirs = data.dirs,
                _files = data.files;

            //this.set_offline_dir(_vir_dirs);

            var dirs = [].concat(_vir_dirs, _dirs),
                files = _files;

            root_node.set_nodes(dirs, files);
            root_node.set_dirty(false);

            if (query_user.is_use_cgiv2()) {
                var all_kid_count = parseInt(rsp_body['total_dir_count'] + rsp_body['total_file_count']) || 0;
                root_node.set_kid_count(all_kid_count);
            }
            // this.load_root(true, false);
        },

        /**
         * 初始化根节点
         * @param {User} [user]
         * @returns {boolean}
         */
        init: function (user) {
            user = user || query_user.get_cached_user();

            // 没有root目录，就创建
            if (user && !root_node) {

                // 超级根节点
                super_node = file_factory.create('FileNode', {
                    id: user.get_root_key(),
                    is_super: true,
                    is_dir: true
                });

                // 根节点
                root_node = file_factory.create('FileNode', {
                    id: user.get_main_key(),
                    name: '微云',
                    create_time: long_long_ago,
                    modify_time: long_long_ago,
                    is_dir: true
                });

                this.set_cur_node(root_node, true);
                last_node = undefined;

                // 始终保持虚拟目录
                this._fill_root_node(root_node);

//            root_node.clear_nodes();
                super_node.set_nodes([root_node], null);

                this.trigger('init_root', super_node, root_node);

                this._inited = true;
                return true;
            }
        },

        // 填充虚拟目录的结构，以便hash router能在不加载根节点的情况下也能定位
        _fill_root_node: function (root_node) {
            var map = constants.VIRTUAL_DIRS,
                uin_perfix = query_user.get_uin_hex(),
                recursive = function (parent_node, map) {
                    var name, id_suffix, node_cfg, construct_cfg, node, types, i;
                    for (name in map) {
                        if (map.hasOwnProperty(name) && !map[name].async_load) {//非异步加载的节点才构造
                            node_cfg = map[name];
                            construct_cfg = {
                                dir_key: uin_perfix + node_cfg.id,
                                route_hash: name,
                                dir_name: node_cfg.name,
                                dir_data_type: node_cfg.types ? node_cfg.types.join('_') : undefined
                            };
                            node = file_node_from_cgi.vir_dir_from_cgi(construct_cfg);
                            node.set_dirty(true);
                            parent_node.append_node(node);
                            if (node_cfg.children) {
                                recursive(node, node_cfg.children);
                            }
                        }
                    }
                };
            root_node.set_dirty(true);
            recursive(root_node, map);
        },
        /**
         * 是否微信目录
         * @param node
         * @returns {boolean}
         */
        is_weixin_dir: function(node){
            return node.get_id() && node.get_id().indexOf(constants.VIRTUAL_DIRS.weixin.id) === 8;
        },
        /**
         * 读取指定目录下的文件列表
         * @param {FileNode|String} node 目标目录节点
         * @param {Boolean} from_cache 是否允许从cache中读取数据，默认false
         * @param {Number} page 页码，默认0
         * @param {Boolean} reset_ui 是否重置列表UI（默认true，reload的UI逻辑不一样）
         * @param {Number} [size] 拉取的文件个数，默认 page_size
         * @return {jQuery.Deferred}
         */
        load: function (node, from_cache, page, reset_ui, size) {
            page = page || 0;

            if (typeof node === 'string') {
                node = all_file_map.get(node);
            }

            if(page == 0) {
                view_switch.to_narmal();
            }

            // 转发根目录
            if (node.get_id() === this.get_root_node().get_id()) {
                return this.load_root(from_cache, page, reset_ui, size);
            }
            // 转发虚拟目录
            else if (node.is_vir_dir()) {
                if (node.is_offline_dir()) {
                    // 上一次所在的节点
                    last_node = curr_node;
                    file_list.set_cur_node(node);
                    file_list.trigger('before_load', node, last_node, page, true);
                    file_list.trigger('before_async_load', node, page);
                    return offline_store.render(node, page, reset_ui);
                } else if( this.is_weixin_dir(node) ){
                    //微信目录 ---> 中转站to跳转微云收藏界面
                    last_node = curr_node;
                    this.set_cur_node(node);
                    this.trigger('before_load', node, last_node, page, true);
                    this.trigger('load', node, last_node, [], [], true, 0);
                    return undefined;
                } else {
                    return this.load_vir_dir(node);
                }
            }

            if (!node) {
                console.error('file_list.load()无效的目录节点:', node);
                return null;
            }

            var data = this._get_v2_load_params(node, page, size);

            return this._load_node(this._load_data_handler, data, node, from_cache, page, reset_ui);
        },

        /**
         * 拉取当前目录的所有文件
         * @param node 当前目录
         * @param callback 回调方法
         * @returns {*}
         */
        load_all: function(node, callback) {
            if (typeof node === 'string') {
                node = all_file_map.get(node);
            }

            var me = this;
            if (!node) {
                console.error('file_list.load()无效的目录节点:', node);
                return null;
            }

            callback._limit_count = typeof callback._limit_count === 'undefined' ? Math.ceil(constants.CGI2_DISK_BATCH_LIMIT / constants.CGI2_DISK_LIST_PER_LIMIT) + 1 : callback._limit_count;

            var data = this._get_v2_load_params(node, curr_page+1, constants.CGI2_DISK_LIST_PER_LIMIT);

            var def = this._load_node(this._load_data_handler, data, node, false, curr_page+1, false);
            def.done(function() {
                callback._limit_count--;
                if(curr_node.has_more()) {//还有文件
                    if(!callback._limit_count) { //最多加载7次就能加载完3000个文件的，避免死循环
                        callback(true);
                    } else {
                        me.load_all(node, callback);
                    }
                } else {
                    callback(true);
                }
            }).fail(function() {
                callback(false);
            });

        },

        /**
         * 加载并初始化根目录
         * @param {Boolean} [from_cache] 是否允许从cache中读取数据，默认false
         * @param {Number} [page] 页码
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认true，reload的UI逻辑不一样）
         * @param {Number} [size] 拉取的文件个数，默认 page_size
         */
        load_root: function (from_cache, page, reset_ui, size) {
            var me = this;
            this.init();

            var data = me._get_v2_load_params(this.get_root_node(), page, size);
            //if(!page) { //重新拉时会去拉虚拟目录列表
            //    var vir_list_def = this.load_vir_dir_list();
            //}
            var def = this._load_node(this._load_data_handler, data, this.get_root_node(), from_cache, page, reset_ui);

            return def;
        },
        /**
         * 加载根目录下的虚拟目录列表
         * @returns {*}
         */
        load_vir_dir_list: function() {
            var virtual_list = [],
                me = this,
                def = $.Deferred();

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'VirtualDirDirList',
                pb_v2: true,
                cavil: true,
                body: {
                    pdir_key: query_user.get_cached_user().get_root_key(),
                    dir_key: query_user.get_cached_user().get_main_dir_key()
                }
            }).ok(function(msg, body) {
                virtual_list = body['VirtualDirItem_items'] || [];
            }).fail(function(msg, ret) {
                me.trigger('error', msg, ret);
            }).done(function() {
                def.resolve(virtual_list);
            });

            def.get_vir_list = function() {
                return virtual_list;
            }

            return def;
        },
        /**
         *  加载离线文档目录
         */
        load_offline_dir: function () {
            //yuyanghe 2013-12-30　点击左侧导航QQ离线文件时,如果离线文件目录不存在则默认创建一个.
            var me=this;
            if(!this.offline_dir){
                var id=query_user.get_uin_hex()+constants.OFFLINE_DIR;
                var options = {
                    is_dir: true,
                    is_vir_dir: true,
                    id: id,
                    name: 'QQ离线文件',
                    icon: 'offline',
                    is_sortable: false
                };
                me.offline_dir=file_factory.create('FileNode',options);
                me.offline_dir.set_parent(me.get_root_node());
            }
            this.offline_dir && this.load(this.offline_dir, true);
        },
        /**
         * 读取普通目录中的文件列表
         * @param {Function} data_handler({Array} body)
         * @param {Object} data 请求参数
         * @param {FileNode} node 目标目录节点
         * @param {Boolean} [from_cache] 是否允许从cache中读取数据，默认false
         * @param {Number} [page] 页码，默认0
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认false，reload的UI逻辑不一样）
         * @return {jQuery.Deferred}
         */
        _load_node: function (data_handler, data, node, from_cache, page, reset_ui, vir_list_def) {
            last_load_req && last_load_req.destroy();

//            console.debug('Start ' + view_switch.get_cur_view() + ' #' + page);
            page || (page = 0);
            reset_ui = reset_ui === true;
            from_cache = from_cache === true;

            var me = this,
                def = $.Deferred();
            // 上一次所在的节点
            last_node = curr_node;
            // 改变当前节点指向
            this.set_cur_node(node);
            this.set_cur_page(page);

            me.trigger('before_load', node, last_node, page, reset_ui);
//            disk_event.trigger('file_list_before_load', node, last_node, reset_ui);

            if (page > 0)
                from_cache = false;

            var load_done = false;

            // 已经加载过该目录的列表才有缓存可取，但如果这个目录被标记为脏目录了，就需要重新加载
            if (from_cache && node.get_kid_nodes() != null && !node.is_dirty()) {
                async_loading = false;

                // 重新排序 // TODO 优化，在fileNode中记录排序方式，在这里检查排序方式是否变化，若变化，则需要重新排序 - james
                var sorted = me._sort_data(node.get_kid_dirs(), node.get_kid_files(), view_switch.get_cur_rank());
                node.set_nodes(sorted[0], sorted[1]);

                def.resolve(node);

                me.trigger('load', node, node.get_kid_dirs(), node.get_kid_files(), page, reset_ui);
                me._mark_as_first_loaded();
//                disk_event.trigger('file_list_load', node);
                load_done = true;
            }

            if (!load_done) {
                async_loading = true;

                me.trigger('before_async_load', node, page);

                var params = {
                    url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
                    cmd: 'DiskDirBatchList',
                    pb_v2: true,
                    body: data,
                    cavil: true,
                    resend: true
                };

                var load_ok_fn = function(body, virtual_list) {

                    async_loading = false;
                    var result = body['dir_list'][0];
                    if(result['retcode']) {
                        var result_msg = result['retmsg'] || ret_msgs.get(result['retcode']);
                        me.trigger('error', result_msg, result['retcode']);
                        def.reject(result_msg, result['retcode']);
                        return;
                    }

                    page === 0 && node.set_dirty(false);
                    body['dir_list'][0]['VirtualDirItem_items'] = virtual_list;
                    var data = data_handler.call(me, body, node),
                        dirs_files = [data.dirs, data.files],
                        kid_count = data.count;

                    // 排序
                    //从后台拉取的数据，在前台都进行一次排序，因为后台按字母排序时区分了大小写再按ascii码排，而更友好的是不区分大小写按ascii码排，所以前台再前台进行排序（日后后台实现了可去掉这里的排序）
                    dirs_files = me._sort_data(dirs_files[0], dirs_files[1], view_switch.get_cur_rank());

                    var dirs = dirs_files[0], files = dirs_files[1];

                    // 写入节点
                    if (page === 0) {
                        node.set_nodes(dirs, files);
                    } else {
                        // 加载下一页时，过滤掉已经在当前目录下的文件
                        me._without_exists_kids(dirs, files);

                        (dirs.length || files.length) && node.add_nodes(dirs, files);
                    }

                    // 是否还有文件
                    // if (use_cgi2) {
                    node.set_kid_count(kid_count);
                    //}

                    def.resolve(node);

                    me.trigger('load', node, dirs, files, page, reset_ui);
//                        disk_event.trigger('file_list_load', node);
                };


                var req = request.xhr_get(params);

                req.ok(function (msg, body) {
//                        console.debug('OK ' + view_switch.get_cur_view() + ' #' + page);
                    if(vir_list_def) { //根目录要加载虚拟目录列表
                        if(vir_list_def.state() == 'resolved') { //虚拟目录列表比普通列表快加载完
                            load_ok_fn(body, vir_list_def.get_vir_list())
                        } else {
                            vir_list_def.done(function(virtual_list) {
                                load_ok_fn(body, virtual_list);
                            });
                        }
                    } else {
                        load_ok_fn(body);
                    }
                })
                    .fail(function (msg, ret) {
                        async_loading = false;
                        me.trigger('error', msg, ret);

                        def.reject(msg, ret);

		                try {
			                logger.write([
				                'disk error --------> file_list',
				                'disk error --------> msg: ' + msg,
				                'disk error --------> err: ' + ret,
				                'disk error --------> data: ' + JSON.stringify(data),
				                'disk error --------> time: ' + new Date()
			                ], 'disk_error', ret);
		                } catch(e) {}
                    })
                    .done(function () {
                        async_loading = false;
                        me.trigger('after_async_load', node);

                        // 首次加载列表
                        me._mark_as_first_loaded();
                        me._is_done = true;
                    });

                last_load_req = req;
            }

            return def;
        },

        /**
         * 读取虚拟目录下的文件列表
         * @param {FileNode|String} node 目标目录节点
         * @param {Number} [offset] 起始下标，默认0
         * @param {Number} [size] 拉取文件个数，默认400
         * @return {jQuery.Deferred}
         */
        load_vir_dir: function (node, offset, size) {
            last_load_req && last_load_req.destroy();

            offset = offset || 0;

            if (typeof node === 'string') {
                node = all_file_map.get(node);
            }

            if (!node) {
                console.error('file_list.load_vir_dir()无效的目录节点:', node);
                return null;
            }

            var data = {
                pdir_key: node.get_pid(),
                dir_key: node.get_id(),
                //dir_mtime: long_long_ago,
                sort_type: 0, // 0表示按照修改时间排序
                list_type: 0, // 1=增量拉取，0=全量拉取
                offset: offset, // 起始下标
                number: size || 400 // 拉取文件个数
            };

            var me = this,
                def = $.Deferred();

            // 上一次所在的节点
            last_node = curr_node;

            me.trigger('before_load', node, last_node, null, offset === 0);
            me.trigger('before_async_load', node);

            // 改变当前节点指向
            this.set_cur_node(node);

            var req = request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'VirtualDirDirList',
                body: data,
                cavil: true,
                resend: true,
                pb_v2: true
            })
                .ok(function (msg, body) {
                    var files = file_node_from_cgi.files_from_cgi2(body['FileItem_items'] || [], node),
                        total = body['total'] || 0,
                        is_reload = offset === 0,
                        _dirs = [],
                        _files = [];

                    $.each(files, function (i, file) {
                        (file.is_dir() ? _dirs : _files).push(file);
                    });

                    // 如果offset为0，则认为是重新加载
                    if (is_reload) {
                        node.set_nodes(_dirs, _files);
                    }
                    // offset 不为0，则追加到后面
                    else {
                        // 添加到后面，已存在的会被自动替换掉
                        $.each(files, function (i, file) {
                            node.append_node(file);
                        });
                    }

                    def.resolve(node);

                    me.trigger('load', node, last_node, _dirs, _files, is_reload, total);
//                    disk_event.trigger('file_list_load', node);
                })
                .fail(function (msg, ret) {
                    me.trigger('error', msg, ret);

                    def.reject(msg, ret);
                })
                .done(function () {
                    me.trigger('after_async_load');

                    // 首次加载列表
                    me._mark_as_first_loaded();
                });

            last_load_req = req;

            return def;
        },

        /**
         * 铺路
         * 传入构建一个目录路径所需的目录ID、目录名称数组，来进入这个目录。当目录不存在（未加载时）会自动创建，并标记父目录为脏。如果已在该目录下，则不刷新。
         * @param {Object[]|FileNode[]} path_nodes
         * @param {Boolean} [from_cache] 是否允许缓存中加载，默认true
         * @param {String} [parent_id] 父目录ID，为空表示根目录
         * @return {jQuery.Deferred} 返回jQuery.Deferred 对象
         */
        load_by_path: function (path_nodes, from_cache, parent_id) {
            var me = this,
                root_node = this.get_root_node();

            from_cache = typeof from_cache === 'boolean' ? from_cache : true;
            parent_id = parent_id || (root_node && root_node.get_id());

            if (!parent_id) {
                console.error('file_list.load_path() 无效的parent_id参数或根目录未初始化');
                return null;
            }

            path_nodes = FileNode.is_instance(path_nodes[0]) ? path_nodes : $.map(path_nodes, function (node) {
                return file_factory.create('FileNode', node);
            });

            // 未指定id路径时，回到根目录
            if (path_nodes.length === 0) {
                return me.load_root(from_cache, 0, true);
            }

            var target_node = all_file_map.get(parent_id);
            if (!target_node) {
                console.error('file_list.load_path() 未找到id=' + parent_id + '的目录');
                return null;
            }

            // 如果已经在当前目录下了，则立刻回调
            if (me.get_cur_node() && path_nodes[path_nodes.length - 1] === me.get_cur_node().get_id()) {
                return me.load(curr_node, true, 0, false);
                // return $.Deferred().resolve();
            }

            var last_kid;

            for (var i = 0, l = path_nodes.length; i < l; i++) {
                var node = path_nodes[i],
                    node_id = node.get_id();

                last_kid = target_node.get_node(node_id);

                if (!last_kid) {
                    last_kid = node;
                    target_node.append_node(last_kid);
                    target_node.set_dirty(true);
                }

                target_node = last_kid;
            }

            return me.load(last_kid, from_cache, 0, false);
        },

        /**
         * 铺路
         * 传入构建一个目录路径所需的目录ID、目录名称数组，来进入这个目录。当目录不存在（未加载时）会自动创建，并标记父目录为脏。如果已在该目录下，则不刷新。
         * @param {String[]} dir_ids
         * @param {String[]} dir_names
         * @param {Boolean} [from_cache] 是否允许缓存中加载，默认true
         * @param {String} [parent_id] 父目录ID，为空表示根目录
         * @return {jQuery.Deferred} 返回jQuery.Deferred 对象
         */
        load_path: function (dir_ids, dir_names, from_cache, parent_id) {
            var path_nodes = $.map(dir_ids, function (dir_id, i) {
                var dir_name = dir_names[i];
                return {
                    id: dir_id,
                    name: dir_name,
                    is_dir: true
                };
            });
            return this.load_by_path(path_nodes, from_cache, parent_id);
        },

        /**
         * 重新读取
         * @param {Boolean} from_cache 是否允许从cache中读取数据，默认false
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认true，reload的UI逻辑不一样）
         * @param {Boolean} [reload_to_root] 是否刷新至根目录（默认false）
         */
        reload: function (from_cache, reset_ui, reload_to_root) {
            var me = this;

            from_cache = from_cache === true;
            reload_to_root = reload_to_root === true;

            var node = this.get_cur_node();

            // 因为根目录的初始化需要从user属性中取一些目录key，所以这里在query_user的回调里初始化
            query_user
                .get(false, true)
                .ok(function () {

                    // 如果当前节点已存在，则加载其子节点
                    if (node && !reload_to_root && (!me._path || !me._path.length)) {

                        // 如果当前节点已脏，则从服务端更新
                        if (node.is_dirty()) {
                            from_cache = false;
                        }

                        // 根目录的加载逻辑有所不同  todo因为排序出现错乱，先去掉
                        if (node.get_id() === me.get_root_node().get_id()) {
                            me.load_root(from_cache, 0, reset_ui);
                        } else {
                            me.load(node, from_cache, 0, reset_ui);
                        }
                    }
                    // 不存在，就初始化
                    else {
                        //me.load_root(from_cache, reset_ui);
                        me.set_path(me._path, from_cache, reset_ui);
                    }
                });
        },

        load_next_page: function () {
            curr_page || (curr_page = 0);

            var cur_node = this.get_cur_node();
            if (cur_node) {
                // 如果 总记录数 < 页码 * 每页个数，则认为没有了
                var overflowed = cur_node.get_kid_count() < (curr_page + 1) * page_size;
                if (!overflowed && cur_node.has_more() && !this.is_loading()) {
                    return this.load(cur_node, true, curr_page + 1, false);
                }
            }
            return $.Deferred().reject();
        },

        get_page_size: function () {
            return page_size;
        },

        is_loading: function () {
            return async_loading
        },

        is_first_loaded: function () {
            return first_loaded;
        },

        /**
         * 插入多个子节点
         * @param {FileNode[]} nodes
         * @param {Boolean} [cover] 是否覆盖重名文件
         * @param {String} [target_dir_id] 目标目录ID（如果是当前目录，会触发UI事件）
         */
        prepend_nodes: function (nodes, cover, target_dir_id) {
            this._add_node(nodes, cover, target_dir_id, true);
        },

        /**
         * 在前方插入一个子节点
         * @param {FileNode} node
         * @param {Boolean} [cover] 是否覆盖重名文件
         * @param {String} [target_dir_id] 目标目录ID（如果是当前目录，会触发UI事件）
         */
        prepend_node: function (node, cover, target_dir_id) {
            this._add_node([node], cover, target_dir_id, true);
        },

        /**
         * 添加文件
         * @param {FileNode[]} nodes
         * @param {Boolean} cover 是否覆盖重名文件
         * @param {String} [target_dir_id] 目标目录ID，为空表示当前目录（如果是当前目录，会触发UI事件）
         * @param {Boolean} is_prepend 是否在前方插入，默认false
         * @private
         */
        _add_node: function (nodes, cover, target_dir_id, is_prepend) {
            var cur_node = this.get_cur_node(), target_node;
            if (!cur_node) {
                throw '目录树未就绪';
            }

            if (!target_dir_id) {
                if (cur_node) {
                    target_dir_id = cur_node.get_id();
                } else {
                    target_dir_id = root_node.get_id();
                }
            }

            target_node = all_file_map.get(target_dir_id);

            if (target_node) {

                // 覆盖重名
                if (cover && target_node.has_nodes()) {
	                var kid_nodes = target_node.get_kid_nodes(),
		                new_name_map,
		                name_conflicted;

	                if(kid_nodes) {
		                new_name_map = collections.array_to_set(nodes, function (node) {
			                return node.get_name();
		                });
		                name_conflicted = collections.grep(target_node.get_kid_nodes(), function (node) {
			                return new_name_map.hasOwnProperty(node.get_name());
		                });

		                if (name_conflicted.length) {
			                this.remove_nodes(name_conflicted, false, false);
		                }
	                }
                }


                // 分为目录和文件
                var dirs = [], files = [];
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    (node.is_dir() ? dirs : files).push(node);
                }

                target_node.set_dirty(true);

                // ==== 插入目标节点并标记为脏 ====
                // 前方插入
                if (is_prepend) {
                    var dir_index = dirs.length ? this.get_prepend_dir_index() : 0;
                    for (var i = 0, l = dirs.length; i < l; i++) {
                        target_node.add_node(dirs[i], dir_index);
                    }
                    for (var i = 0, l = files.length; i < l; i++) {
                        target_node.prepend_node(files[i]);
                    }
                    // 如果是当前目录，会触发UI事件
                    if (cur_node.get_id() === target_node.get_id()) {
                        //this.trigger(is_prepend, dirs, files); // ----> trigger('append_node') or trigger('prepend_node')
                        if (dirs.length) {
                            this.trigger('add_node', dirs, [], dir_index);
                        }
                        if (files.length) {
                            this.trigger('prepend_node', [], files);
                        }
                    }
                }
                // 后方插入
                else {
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        target_node.append_node(nodes[i]);
                    }
                    // 如果是当前目录，会触发UI事件
                    if (cur_node.get_id() === target_node.get_id()) {
                        //this.trigger(is_prepend, dirs, files); // ----> trigger('append_node') or trigger('prepend_node')
                        this.trigger('append_node', dirs, files);
                    }
                }
            }
        },

        _get_local_sort_meta: function (rank) {
            var field, dir,
                rank_map = {
                    'letter': 'name',
                    'time': 'modify_time'
                };

            if(curr_node.is_album_backup_dir()) {
                field = 'name';
                dir = 'desc';
            } else if(rank && rank_map[rank]){
                field = rank_map[rank];
                dir = 'desc';
            } else {
                field = 'modify_time';
                dir = 'desc';
            }
            return {
                field: field,
                dir: dir
            };
        },

        _sort_cur_node: function (cur_node, rank) {
            var dirs = cur_node.get_kid_dirs() || [], files = cur_node.get_kid_files() || [];
            var sorted = this._sort_data(dirs, files, rank);
            cur_node.set_nodes(sorted[0], sorted[1]);
        },

        _sort_data: function (dirs, files, rank) {
            //暂时去掉前台的排序算法，使用后台的排序
            //if(rank == 'time') {
            //    var sort_meta = this._get_local_sort_meta(rank);
            //    var dirs_files = this._get_sorter().sort_datas([dirs, files], sort_meta.field, sort_meta.dir);
            //    files = dirs_files[1];
            //    dirs = dirs_files[0];
            //}

            // 取出虚拟目录，放到最前方
            var vir_dirs = [], norm_dirs = [];
            for (var i = 0, l = dirs.length; i < l; i++) {
                var dir = dirs[i];
                (dir.is_vir_dir() ? vir_dirs : norm_dirs).push(dir);
            }
            dirs = vir_dirs.concat(norm_dirs);
            //直接采用后台反唇相讥
            return [dirs, files];
        },

        _get_sorter: function () {
            if (!sorter) {
                sorter = require('./file_list.sorter');
            }
            return sorter;
        },

        /**
         * 获取插入目录的位置（位于固定节点后方）
         * @returns {Number}
         */
        get_prepend_dir_index: function () {
            var cur_node = this.get_cur_node(), dirs;
            if (cur_node && (dirs = cur_node.get_kid_dirs())) {
                for (var i = 0, l = dirs.length; i < l; i++) {
                    if (dirs[i].is_sortable()) {
                        return i;
                    }
                }
                return dirs.length;
            }
            return 0;
        },

        /**
         * 进入『QQ收到的文件』目录的对外接口   (注：收到的QQ文件存储目录已变更到QQ目录下，需求单：http://tapd.oa.com/v3/QQdisk/prong/stories/view/1010030581055854167)
         * @param {Boolean} refresh 是否刷新该目录
         * @param {Function} callback ({FileNode} dir_QQ, {FileNode} dir_QQ_receive)
         */
        enter_qq_receive: function (refresh, callback) {
            callback = callback || $.noop;

            var me = this,
                load_from_cache = !refresh,
                load_then_callback = function () {
                    var def = me.load(dir_QQ, load_from_cache, 0, false); // false->刷新列表时不重置UI
                    if (def) {
                        def.done(function (node) {
                            callback(node, node.get_parent());
                        });
                    }
                },
                enter_then_callback = function () {
                    me._get_qq_receive(function () {
                        load_then_callback();
                    });
                };


            // 在文件列表首次加载完成后再进入
            if (this.is_first_loaded()) {
                // 如果已经在该目录下，则直接回调
                if (load_from_cache && dir_QQ && dir_QQ.get_id() === this.get_cur_node().get_id()) {
                    callback(dir_QQ);
                }
                // 如果已经存在但不在该目录下，则进入并回调
                else if (dir_QQ && dir_QQ.is_on_tree()) {
                    load_then_callback();
                }
                // 如果不存在，则请求CGI获取该目录的信息，然后进入并回调
                else {
                    enter_then_callback();
                }
            }
            // 未加载完成，则等待首次加载完成后再调用CGI获取该目录的信息，然后进入并回调
            else {
                this.once('load', function () {
                    enter_then_callback();
                });
            }
        },

        _get_qq_receive: function (ok) {
            var fn = arguments.callee;
            fn._ok_callbacks || (fn._ok_callbacks = []);
            ok && fn._ok_callbacks.push(ok);

            if (fn._loading) {  // 如果正在读取中，则退出
                return;
            }

            fn._loading = true;

            var me = this,
                ok_callback = function (dir_QQ) {
                    $.each(fn._ok_callbacks, function (i, cb) {
                        cb.call(me, dir_QQ);
                    });
                    delete fn._ok_callbacks;
                };

            request.xhr_get({
                url: GET_DIR_INFO_CGI,
                cmd: 'GetHomeDirInfo',
                pb_v2: true,
                body: {
                    third_appid_list : [30207]
                }
            })
                .ok(function (msg, body) {
                    var data = body.home_dir_list && body.home_dir_list[0] || {};
                    var
                    // 「QQ」目录
                        qq_dir_key = data['dir_key'],
                        qq_dir_name = data['dir_name'];
                    // 「QQ收到的文件」目录key
                    //    qq_recv_dir_key = data['dir_key'],
                    //    qq_recv_dir_name = data['dir_name'] || 'QQ收到的文件';

                    // QQ 目录
                    dir_QQ = all_file_map.get(qq_dir_key);
                    if (!dir_QQ) {
                        dir_QQ = file_factory.create('FileNode', {
                            is_dir: true,
                            id: qq_dir_key,
                            name: qq_dir_name,
                            create_time: long_long_ago,
                            modify_time: long_long_ago
                        });
                        me.get_root_node().append_node(dir_QQ);
                    }

                    // QQ收到的文件 目录
                    /*dir_QQ_recv = all_file_map.get(qq_recv_dir_key);
                     if (!dir_QQ_recv) {
                     dir_QQ_recv = file_factory.create('FileNode', {
                     is_dir: true,
                     id: qq_recv_dir_key,
                     name: qq_recv_dir_name || 'QQ收到的文件',
                     create_time: long_long_ago,
                     modify_time: long_long_ago
                     });
                     dir_QQ.append_node(dir_QQ_recv);
                     }


                     // james 2013-5-16 因为CGI没有返回"QQ"目录和"QQ收到的文件"目录的修改时间，这里设置该目录为脏，进入目录时会刷新
                     dir_QQ_recv.set_dirty(true); // 需要从CGI拉取“QQ收到的文件”目录的文件
                     */
                    dir_QQ.set_dirty(true);      // 需要从CGI拉取“QQ”目录的文件 ->“QQ收到的文件”
                    me.get_root_node().set_dirty(true); // 需要从CGI拉取根目录下的“QQ”目录
                    ok_callback(dir_QQ);
                }).fail(function(msg, ret) {
                    me.trigger('error', msg, ret);
                }).done(function() {
                    fn._loading = false;
                });
        },

        /**
         * 根据appid，获取对应目录的信息
         * @param {Number} appid
         * @private
         */
        _async_get_dir_info: function (appid) {

            var me = this,
                def = $.Deferred();


            request.xhr_get({
                url: GET_DIR_INFO_CGI,
                cmd: 'GetHomeDirInfo',
                pb_v2: true,
                body: {
                    third_appid_list: [appid]
                }
            })
                .ok(function (msg, body) {
                    def.resolve(body.home_dir_list && body.home_dir_list[0] || {});//获取数据成功，执行回调
                }).fail(function(msg, ret) {
                    me.trigger('error', msg, ret);
                    def.reject();
                });

            return def;
        },
        /**
         * 根据获取的目录信息，进入指定目录
         * @param {Object} data 目录信息
         * @param {Function} callback({FileNode}enter_dir) 进入目录后的回调函数
         * @private
         */
        _enter_spec_dir: function (data, callback) {

            var dir_key = data['dir_key'],
                dir_name = data['dir_name'],
                pdir_key = data['pdir_key'],
                pdir_name = data['pdir_name'],
                enter_dir,
                parent_dir,
                me = this,
                root_node = me.get_root_node();

            //要进入的目录
            enter_dir = all_file_map.get(dir_key) || file_factory.create('FileNode', {
                is_dir: true,
                id: dir_key,
                name: dir_name,
                create_time: long_long_ago,
                modify_time: long_long_ago
            });

            if (root_node.get_id() !== pdir_key) {//目前CGI返回的结果看，没有返回多层情况下的所有父目录的key，后续有需求要进入多层目录中的再改造
                //要进入的目录不是在根目录下，而是在根目录的子目录下
                parent_dir = all_file_map.get(pdir_key) || file_factory.create('FileNode', {
                    is_dir: true,
                    id: pdir_key,
                    name: pdir_name,
                    create_time: long_long_ago,
                    modify_time: long_long_ago
                });
                parent_dir.append_node(enter_dir);
                parent_dir.set_dirty(true);
                root_node.append_node(parent_dir);
            } else {
                root_node.append_node(enter_dir);//pdir_key === root_node.id
            }

            enter_dir.set_dirty(true);
            root_node.set_dirty(true);
            callback.call(me, enter_dir);
        },

        /**
         * 根据指定appid进入指定目录，用于第三方页面跳转到微云指定目录，如：http://www.weiyun.com/disk/index.html#m=disk.qqmail 跳到QQ邮箱目录
         * @param {Number} appid 标识要进入的目录
         * @returns {*}
         */
        enter_spec_dir_by_appid: function (appid) {

            var me = this,
                def = $.Deferred();

            if (!appid) {//没有对应的appid，则在根目录
                return;
            }


            me._async_get_dir_info(appid)
                .done(function (data) {
                    me._enter_spec_dir(data, function (node) {
                        def.resolve(node);//成功获取要进入的目录
                    });
                })
                .fail(function () {
                    def.reject();
                });

            return def;

        },


        /**
         * 获取当前打开的目录节点
         */
        get_cur_node: function () {
            return curr_node;
        },

        /**
         * 获取当前目录的ID
         * @returns {String}
         */
        get_cur_node_id: function () {
            return curr_node ? curr_node.get_id() : null;
        },

        /**
         * 当前目录是否是虚拟目录
         * @return {Boolean}
         */
        is_cur_vir_dir: function () {
            return curr_node ? curr_node.is_vir_dir() : false;
        },

        set_cur_node: function (node, silent) {
            curr_node = node;

            var hash_path, walk_node, hash;
            if (!silent) {
                // 记录路径到hash，当然只针对部分固定节点
                walk_node = node;
                hash_path = [];
                while (walk_node && walk_node !== root_node && (hash = walk_node.get_route_hash())) {
                    hash_path.push(hash);
                    walk_node = walk_node.get_parent();
                }
                if (walk_node === root_node) {
                    hash_path.reverse();
                    this.store_path(hash_path);
                }
            }
        },

        set_cur_page: function (page) {
            curr_page = page;
        },

        /**
         * 获取上一次所在的目录节点
         */
        get_last_node: function () {
            return last_node;
        },

        /**
         * 判断目标节点是否是当前节点
         * @param {FileNode|String} node
         */
        is_cur_node: function (node) {
            if (typeof node === 'string') {
                node = all_file_map.get(node);
            }

            return this.get_cur_node().get_id() === node.get_id();
        },

        /**
         * 获取根节点
         */
        get_root_node: function () {
            return root_node;
        },

        /**
         * 通过文件DOM获取FileNode
         * @param $item
         */
        get_node_by_$item: function ($item) {
            var file_id = $($item).attr('data-file-id');
            return all_file_map.get(file_id);
        },

        /**
         * 删除节点
         * @param {Array<FileNode>} file_nodes
         * @param {Boolean} [refresh_space_info] 刷新空间信息，默认false
         * @param {Boolean} [animate] 使用动画，默认false
         */
        remove_nodes: function (file_nodes, refresh_space_info, animate) {
            if (file_nodes.length) {
                // UI只处理当前目录下的文件（因为 _grep_kids() 方法中需要取得将要删除的节点的 parent，所以这几段代码的执行顺序不能乱改）
                var file_nodes_for_ui = this._grep_kids(file_nodes);

                // 删除节点
                $.each(file_nodes, function (i, node) {
                    node.remove();
                });

                this.trigger('after_nodes_removed', file_nodes_for_ui, refresh_space_info, animate);
            }
        },

        /**
         * 移动节点
         * @param {Array<FileNode>} file_nodes 要移动的节点
         * @param {String} dir_id 目标目录ID
         */
        move_nodes: function (file_nodes, dir_id) {
            if (file_nodes.length) {

                // UI只处理当前目录下的文件
                var file_nodes_for_ui = this._grep_kids(file_nodes);

                // 先处理UI再移除，防止找不到parent出错
                $.each(file_nodes, function (i, node) {
                    node.remove();
                });

                this.trigger('after_nodes_moved', file_nodes_for_ui, dir_id);

                // TODO 如果移动到的目标目录是当前目录，则重新刷新当前目录

                var target_node = all_file_map.get(dir_id);
                // 标记目标节点为脏的
                if (target_node) {
                    target_node.set_dirty(true);
                }
            }
        },

        /**
         * 获取已选中的文件列表
         * @return {Array<FileNode>} files
         */
        get_selected_files: function () {
            if (selection) {
                return selection.get_selected_files();
            } else {
                return [];
            }
        },

        get_1_sel_file: function () {
            if (selection) {
                return selection.get_1_sel_file();
            }
        },

        /**
         * 从服务器静默删除文件
         * @param {String} dir_id
         * @param {String} file_id
         * @param {String} file_name
         */
        silent_remove_file_in_serv: function (dir_id, file_id, file_name) {
            var target_dir = all_file_map.get(dir_id);
            if (target_dir) {
                remove.silent_remove(target_dir, file_id, file_name);
            }
        },

        /**
         * 根据文件名获取节点
         * @param {FileNode} p_node
         * @param {String} name
         * @param {Boolean} is_dir
         * @private
         */
        _get_node_by_name: function (p_node, name, is_dir) {
            var kid_nodes = is_dir ? p_node.get_kid_dirs() : p_node.get_kid_files();
            for (var i = kid_nodes.length - 1; i >= 0; i--) {
                var kid_node = kid_nodes[i];
                if (kid_node.get_name() === name) {
                    return kid_node;
                }
            }
        },

        _grep_kids: function (file_nodes) {
            var cur_node = this.get_cur_node();
            if (cur_node) {
                // 过滤掉不在当前目录下的文件
                return collections.grep(file_nodes, function (node) {
                    // 同时过滤掉那些废弃节点
                    var parent = node.get_parent();
                    if (!parent) {
                        return false;
                    }
                    return parent.get_id() === cur_node.get_id();
                });
            } else {
                return file_nodes;
            }
        },

        _mark_as_first_loaded: function () {
            if (!first_loaded) {
                first_loaded = true;
                this.trigger('first_load_done');
            }
        },

        /**
         * CGI 2.0 网盘文件目录拉取参数
         * @param {FileNode} node
         * @param {Number} [page] 默认0
         * @param {Number} [size] 拉取的文件个数，默认 page_size
         * @returns {Object} params
         * @private
         */
        _get_v2_load_params: function (node, page, size) {
            var is_root = this.get_root_node() === node,
                sort_meta = this._get_sort_meta(),
                offset = 0;

            page = page || 0;

            if (page === 0) {
                offset = 0;
            } else {
                // 计算已加载的文件个数（排除虚拟目录）
                var norm_dirs = $.grep(node.get_kid_dirs() || [], function (node) {
                        return !node.is_vir_dir()
                    }),
                    files = node.get_kid_files() || [];
                offset = norm_dirs.length + files.length;
            }


            var params = {
                get_type: 0, // int,拉取列表类型：0:所有,1:目录2:文件,其他所有
                start: offset,  // int,偏移量
                count: size || page_size, // int,分页大小（如果要返回摘要文件url, 则最大只能100个）
                sort_field: sort_meta[0],  // int,排序类型
                reverse_order: sort_meta[1],  // bool,true=逆序
	            get_abstract_url: true  // 2016.07.04 add by iscowei 返回图片/视频的缩略图url
            };


            if(node.is_album_backup_dir()) {
                params.sort_field = 1;
                params.reverse_order = true;
            }

                var pdir_key;

            if (is_root) {
                $.extend(params, {
                    dir_key: query_user.get_cached_user().get_main_key(true),
                    dir_name: query_user.get_cached_user().get_main_dir_name()
                });
                pdir_key = query_user.get_cached_user().get_root_key(true);
            }
            else {
                $.extend(params, {
                    dir_key: node.get_id(),
                    dir_name: node.get_name()
                });
                pdir_key = node.get_pid(true);
            }

            return {
                pdir_key: pdir_key,//父目录ID
                dir_list: [params]
            };
        },

        /**
         * 当前排序类型
         * @returns {*}
         * @private
         */
        _get_sort_meta: function() {
            return  {
                time: [2, false],   //  按时间倒序排序
                letter: [1, false] //  按文件名顺序排序
            }[view_switch.get_cur_rank()];  // 0-不排序(速度最快) 2-按修改时间排序；1-按名字排序,汉字基于拼音顺序(速度最慢)
        },

        _load_data_handler: function (body, node) {
            var data,
                _vir_dirs,
                _dirs,
                _files;

            body = body['dir_list'][0];
            data = this._get_data_from_rsp(body),
            _vir_dirs = data.vdirs;
            _dirs = data.dirs;
            _files = data.files;

            //// 指向QQ离线目录
            //if (this.get_root_node() === node) {
            //    this.set_offline_dir(_vir_dirs);
            //}

            var dirs = [].concat(_vir_dirs, _dirs),
                files = _files,
                count = parseInt(body['total_dir_count'] + body['total_file_count']) || 0;

            //排除正在上传的破损文件，防止被删除，导致上传失败
            var curr_upload_file = upload_event.trigger('get_curr_upload_file_id');
            if (curr_upload_file) {
                files = $.map(files, function (file) {
                    if (file.get_id() === curr_upload_file) {
                        // 匹配到正在上传的文件，目录下总文件个数减1
                        count--;
                    } else {
                        return file;
                    }
                });
            }

            curr_node.set_finish(body['finish_flag']); //设置是否已经加载完目录下的文件

            return {
                dirs: dirs,
                files: files,
                count: count
            };
        },

        _get_data_from_rsp: function (body) {
            var _vir_dirs = file_node_from_cgi.vir_dirs_from_cgi2(body['VirtualDirItem_items']);
            var _dirs = file_node_from_cgi.dirs_from_cgi2(body['dir_list']);
            var _files = file_node_from_cgi.files_from_cgi2(body['file_list']);
            return {
                vdirs: _vir_dirs,
                dirs: _dirs,
                files: _files
            };
        },

        /**
         * 过滤掉已经存在于当前目录下的文件
         * @param {FileNode[]} dirs
         * @param {FileNode[]} files
         * @private
         */
        _without_exists_kids: function (dirs, files) {
            var cur_node = this.get_cur_node();
            if (cur_node) {
                for (var i = arguments.length - 1; i >= 0; i--) {
                    var nodes = arguments[i];
                    for (var j = nodes.length - 1; j >= 0; j--) {
                        var node = nodes[j];
                        if (cur_node.get_node(node.get_id())) {
                            nodes.splice(j, 1);
                        }
                    }
                }
            }
        }

    });


    module.exports = file_list;
});