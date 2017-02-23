/**
 * 文件列表缩略图
 * @author jameszuo
 * @date 13-3-8
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/thumb'),
        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),

        request = common.get('./request'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),


        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),
    //downloader = require('./downloader.downloader'),


        encode = encodeURIComponent,

        batch_size = 8, // 每次请求X个，CGI 每次最多只接受10个，如果需要改动超过10个，请和CGI确认
        image_caches = {}, // 图片缓存 key=图片文件ID，value=Image
        queue_files = [], // 需要处理的文件ID队列
        queue_id_map = {}, // 用来防止重复
        error_map = {}, // 已失败的文件，key=文件ID，value=失败次数
        retry_times = 1, // 失败后的重试次数
        doing = false, // 是否正在处理队列中的文件


        get_speed_started = false, // 已测速
        get_speed_done = false, // 已测速

        parse_int = parseInt,

        options = {
            size: 64,
            cgi_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',  // 默认是 wy_web_jsonp.fcg
            cgi_cmd: 'img_view_bat',
            cgi_data: function (files) {
                var user = query_user.get_cached_user();
                if (user) {
                    return {
                        file_owner: user.get_uin(),
                        pdir_key: files[0].get_parent().get_id(),
                        files: $.map(files, function (file, i) {
                            return {
                                file_id: file.get_id(),
                                file_name: encode(file.get_name())
                            }
                        })
                    }
                }
            },
            cgi_response: function (files, body) {
                var size = this._options.size;
                return $.map(body['imgs'], function (img_rsp) {
                    var ret = parse_int(img_rsp['ret']), file_id, url;
                    if (ret === 0) {
                        var host = img_rsp['dl_svr_host'],
                            port = img_rsp['dl_svr_port'],
                            path = img_rsp['dl_encrypt_url'];
                        url = 'http://' + host + ':' + port + '/ftn_handler/' + path + '?size=' + size + '*' + size; // 64*64  /  128*128
                        url = https_tool.translate_url(url);
                        file_id = img_rsp['file_id'];
                    }
                    return new ImageMeta(ret, file_id, url);
                })
            }
        },

        undefined;

    var Thumb = function (_options) {
        this._options = $.extend({}, options, _options);
    };

    $.extend(Thumb.prototype, {
        // ui: require('./file_list.thumb.ui'),

        /**
         * 添加到队列中
         * @param {String|Array<String|File|FileNode} file_args
         */
        push: function (file_args) {
            return this._add(file_args, false);
        },

        /**
         * 插入到队列前方
         * @param {String|Array<String|File|FileNode} file_args
         */
        insert: function (file_args) {
            return this._add(file_args, true);
        },

        _add: function (file_args, is_insert) {
            var files = this._get_img_nodes(file_args);

            if (!files || !files.length) {
                return;
            }

            // 加入队列
            queue_files = is_insert ? files.concat(queue_files) : queue_files.concat(files);
            // map
            $.each(files, function (i, file) {
                queue_id_map[file.get_id()] = 1;
            });

            if (!doing) {
                this.start();
            }
        },

        start: function () {
            doing = true;
            this._cgi_apply_next();
        },

        stop: function () {
            doing = false;
        },

        clear_queue: function () {
            queue_files = [];
            queue_id_map = {};
            doing = false;
        },

        /**
         * 申请下载
         * @param {FileNode} [file] 需要单独处理的文件，为空表示队列方式
         * @private
         */
        _cgi_apply_next: function (file) {

            var me = this;

            var user = query_user.get_cached_user();
            if (user) {

                // 是否从队列中取
                var is_from_queue = !file;

                if (!file && !queue_files.length) {
                    return me.stop();
                }

                // 从队列中取出N个需要处理的文件，然后请求CGI，回调后，下载图片

                var files;
                if (file) {
                    files = [file];
                } else {
                    // 从队列中取出需要处理的文件
                    files = me._get_files_from_queues();
                }

                // 过滤掉缓存中已有的图片
                files = me._without_cached(files);

                // 都在缓存中了，就处理下一批
                if (!files.length) {
                    return me._cgi_apply_next();
                }


                // ID map
                var req_ids = [];

                $.each(files, function (i, file) {
                    req_ids.push(file.get_id());
                });

                // cgi 参数
                var cgi_data = me._options.cgi_data.call(me, files);

                // 申请下载
                request.xhr_post({
                    url: me._options.cgi_url,
                    cmd: me._options.cgi_cmd,
                    body: function () {
                        return cgi_data;
                    }
                }).ok(function (msg, body) {
                        var img_rsps = me._options.cgi_response.call(me, files, body);

                        me._fill_images_by_rsp(req_ids, img_rsps);

                    })
                    .fail(function (msg, ret, body, header) {
                        console.error(msg, ret);
                    })
                    .done(function () {
                        if (is_from_queue) {
                            me._cgi_apply_next();
                        }
                    });


                // 队列里没有了，就标记为停止
                if (!queue_files.length) {
                    me.stop();
                }
            }
        },

        _without_cached: function (files) {
            if (files.length) {
                var me = this,
                    no_cached_files = [];

                $.each(files, function (i, file) {
                    var img = me.get_cache(file.get_id());

                    if (img) {
                        me.trigger('get_image_ok', file, img);
                    }
                    else {
                        no_cached_files.push(file);
                    }
                });

                return no_cached_files;
            }
            return files;
        },

        /**
         * 从队列中取文件
         * @returns {Array<FileNode>}
         * @private
         */
        _get_files_from_queues: function () {
            var node_on_tree = collections.first(queue_files,function (f) {  // 取第一个在树上的节点，用来在后面取在同一目录下的文件进行处理（CGI要求所发送的文件属于同一目录下，而 queue_files 可能包含不属于同一目录下的文件） james 2013-6-7
                    return f.is_on_tree();
                }),
                parent_node = node_on_tree ? node_on_tree.get_parent() : null,
                files_fragm = [];

            if (parent_node) {
                var todo_files = [];
                $.each(queue_files, function (i, queue_file) {
                    if (queue_file.is_on_tree()) {  // 忽略没有挂在树上的节点 james 2013-6-7
                        var parent = queue_file.get_parent();
                        if (parent === parent_node && files_fragm.length < batch_size) {
                            files_fragm.push(queue_file);
                        } else {
                            todo_files.push(queue_file);
                        }
                    }
                });

                queue_files = todo_files;
            } else {
                queue_files = [];
            }

            return files_fragm;
        },

        /**
         * 填充图片内容
         * @param req_ids
         * @param img_rsps
         * @private
         */
        _fill_images_by_rsp: function (req_ids, img_rsps) {
            var me = this,
                failed_ids = [];

            // 下载图片
            if (img_rsps && img_rsps.length) {
                $.each(img_rsps, function (i, img_rsp) {

                    var is_ok = img_rsp.get_ret() === 0;
                    if (is_ok) {

                        var file_id = img_rsp.get_file_id(),
                            file_node = all_file_map.get(file_id);

                        if (file_node) {
                            // 下载图片
                            me._get_thumb_async(file_node, img_rsp.get_url(), function (img_el, is_ok) {
                                // 成功
                                if (is_ok) {
                                    // 写入缓存
                                    me.set_cache(file_node.get_id(), img_el);

                                    me.trigger('get_image_ok', file_node, img_el);
                                }
                                // 失败
                                else {
                                    me.trigger('get_image_error', file_node);
                                }
                            });
                        }
                    }
                    // 找出失败了的图片
                    else {
                        failed_ids.push(req_ids[i]); // 失败的插入到列表前方以便重试
                    }
                });
            }

            // 将失败的图片插入队列前方 // 暂时去掉重试逻辑 - james 2013-7-5
            if (failed_ids.length) {
                var
                // 重试失败的图片
                    retry_failed_ids = [],
                // 如果重试次数超过限制，则忽略
                    to_fix_ids = collections.grep(failed_ids, function (file_id) {
                        var retried = error_map[file_id] || (error_map[file_id] = 0);
                        if (retried > retry_times) { // 达到重试次数上限
                            retry_failed_ids.push(file_id);
                            return false;
                        } else {
                            error_map[file_id]++;
                            return true;
                        }
                    });

                // 需要重新加载的ID
                if (to_fix_ids.length) {
                    console.debug('缩略图加载失败 ' + to_fix_ids.length + ' 个：', error_map, ' 已重试');
                    me.insert(to_fix_ids);
                }

                // 重试后错误的ID
                if (retry_failed_ids.length) {
                    $.each(retry_failed_ids, function (i, file_id) {
                        var file_node = all_file_map.get(file_id);
                        me.trigger('get_image_error', file_node);
                    });
                }
            }
        },


        /**
         * 从服务端拉取缩略图
         * @param {FileNode} file
         * @param {String} url
         * @param {Function} callback ({Image} img, {Boolean} is_ok) img加载完成或失败后回调
         * @private
         */
        _get_thumb_async: function (file, url, callback) {
            if (file) {
                var me = this;

                image_loader.load(url)
                    .done(function (img) {
                        callback.call(me, img, true);
                    })
                    .fail(function (img) {
                        callback.call(me, img, false);
                    });
            }
        },


        /**
         * 更新图片缓存
         * @param {String} file_id
         * @param {HTMLImageElement} image
         */
        set_cache: function (file_id, image) {
            image_caches[file_id] = image;
        },

        /**
         * 获取缓存中的图像
         * @param {String} file_id
         * @returns {Image}
         */
        get_cache: function (file_id) {
            return image_caches[file_id];
        },

        destroy: function () {
            // 删除游离的 Image 对象
            var div = $('<div style="display:none;"/>').appendTo(document.body);
            for (var file_id in image_caches) {
                var image = image_caches[file_id];
                div.append(image);
            }
            div.remove();
        },

        _get_img_nodes: function (file_args) {
            var files;

            // String file id
            if (typeof file_args === 'string') {
                files = [all_file_map.get(file_args)];
            }
            // Array
            else if ($.isArray(file_args)) {
                // Array file id
                if (typeof file_args[0] === 'string') {
                    files = $.map(file_args, function (file_id) {
                        return all_file_map.get(file_id);
                    });
                }
                // Array File|FileNode
                else {
                    files = file_args;
                }
            }
            // File || FileNode
            else if (FileNode.is_instance(file_args)) {
                files = [file_args];
            }

            if (files.length) {
                // 过滤破文件
                files = collections.grep(files, function (file) {
                    return !(!file.is_image() || file.is_broken_file() || file.is_empty_file());
                });
            }

            return files;
        }
    }, events);

    var ImageMeta = function (ret, file_id, url) {
        this._ret = ret;
        this._file_id = file_id;
        this._url = url;
    };
    ImageMeta.prototype = {
        get_ret: function () {
            return this._ret
        },
        get_file_id: function () {
            return this._file_id;
        },
        get_url: function () {
            return this._url;
        }
    };


    Thumb.ImageMeta = ImageMeta;
    return Thumb;
});