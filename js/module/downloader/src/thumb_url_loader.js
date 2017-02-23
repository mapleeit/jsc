/**
 * 缩略图url加载器，有别于Thumb_loader，这个只是向cgi请求图片的缩略图Url,不进行缩略图加载
 * @author hibincheng
 * @date 2014-06-28
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        ret_msgs = common.get('./ret_msgs'),
        https_tool = common.get('./util.https_tool'),
	    constants = common.get('./constants'),

        requesting_cnt = 0,           //当前正在请求数

        batch_limit = query_user.get_cached_user() && query_user.get_cached_user().get_files_download_count_limit(),

        req_queue,
        thumb_urls,
        thumb_urls_cache = {},

        undefined;

    var loader = new Module('thumb_url_loader', {

        /**
         * 获取缩略图url,该url不加?size=，使用时自行在后面加?size参数加载指定大小的缩略图
         * @param {Array<FileNode | Object>} images 必要3个参数：file_id file_name pdir_key
         * @returns {*}
         */
        get_urls: function(images) {
            if(!$.isArray(images)) {
                images = [images];
            }



            var params_list = [],
                no_cache_images = [],
                def = $.Deferred();

            thumb_urls = {};
            req_queue = [];
            $.map(images, function(file) {
                var file_id = file.get_id && file.get_id() || file.file_id;
	            var url;
                if(thumb_urls_cache[file_id]) {
	                thumb_urls[file_id] = thumb_urls_cache[file_id];
                } else if(url = file.get_thumb_url()) {
	                thumb_urls[file_id] = url;
                } else {
                    no_cache_images.push(file);
                }
            });
            //直接从缓存中取，无需向cgi拉取
            if(!no_cache_images.length) {
                def.resolve(thumb_urls);
                return def;
            }

            $.each(no_cache_images, function(i, file) {
                params_list.push({
                    file_id: file.get_id && file.get_id() || file.file_id,
                    filename: file.get_name && file.get_name() || file.file_name,
                    pdir_key: file.get_pid && file.get_pid() || file.pdir_key || file.pid
                });
            });

            this.abort_all_request();
            while(params_list.length) {
                var cur_params_list = params_list.slice(0, batch_limit);
                params_list = params_list.slice(cur_params_list.length);
                requesting_cnt++;
                this._start_load(cur_params_list, def);
            }

            return def;
        },

        _start_load: function(params_list, def) {
            var me = this;

            var req = request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
                cmd: 'DiskFileBatchDownload',
                cavil: true,
                pb_v2: true,
                body: {
                    need_thumb: true,
                    file_list: params_list
                }
            }).ok(function(msg , body) {
                var ftn_list = body['file_list'] || [],
                    urls = {};

                requesting_cnt--;
                $.each(ftn_list, function(i, item) {
                    if(!item.retcode) {
                        var url;
                        if(item.download_url) {
                            url = item.download_url;
                        } else {
                            url = 'http://' + item.server_name + (item.server_port ? ':' + item.server_port: '') + '/ftn_handler/' + item.encode_url;
                        }
                        urls[item.file_id] = https_tool.translate_url(url);
                    }
                });

                $.extend(thumb_urls, urls);
                me._cache_urls(urls);
                if(!requesting_cnt) {
                    def.resolve(thumb_urls);
                    req_queue = [];
                }
            }).fail(function(msg, ret) {
                me.abort_all_request();
                def.reject(msg, ret);
                mini_tip.warn(msg || ret_msgs.get(ret) || '获取图片预览地址失败');
            });

            req_queue.push(req);

        },

        _cache_urls: function(urls) {
            $.extend(thumb_urls_cache, urls);
        },

        /**
         * 清掉所有的请求
         */
        abort_all_request: function() {
            $.each(req_queue, function(i, req) {
                req && req.destroy();
            });

            requesting_cnt = 0;

            req_queue = [];
        }
    });

    return loader;
});