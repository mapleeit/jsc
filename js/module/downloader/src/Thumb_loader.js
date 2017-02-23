/**
 * 通用的缩略图加载，原网盘的加载与文件列表耦合太高。时间轴的加载是单例，存在风险。
 * @author cluezhang
 * @date 2013-11-10
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('downloader.Thumb_loader'),
        
        image_loader = lib.get('./image_loader'),
        
        common = require('common'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        BATCH_DOWNLOAD_LIMIT_COUNT, //批量下载文件数限制
        
        $ = require('$');
    var STATE = {
        Initial : 'initial', // 刚创建
        Pending : 'pending', // 待命
        Loading : 'loading', // 请求ftn地址
        Loaded : 'loaded', // 请求ftn完毕，等待缓存
        Caching : 'caching', // 缓存中
        Fetched : 'fetched', // 完成
        FtnFail : 'ftnfail', // 申请ftn下载地址失败
        CacheFail : 'cachefail' // 从ftn加载失败
    };
    var Task = inherit(Object, {
        cgifail : 0,
        imgfail : 0,
        constructor : function(host, pid, id, name, url){
            this.host = host;
            this.pid = pid;
            this.id = id;
            this.name = name;
	        if(url) {
		        this.url = url;
	        }
            this.defs = []; // 监听的人
            this.state = STATE.Initial;
        },
        change_state : function(state){
            var old_state = this.state, defs, me;
            if(state === old_state){
                return;
            }
            this.state = state;
            this.notify_state_change(state, old_state);
        },
        // 开始任务
        start : function(){
//            if(this.state!==STATE.Initial){
//                return;
//            }
            this.change_state(STATE.Pending);
        },
        // 开始请求ftn地址
        start_requesting : function(){
//            if(this.state!==STATE.Pending){
//                return;
//            }
            this.change_state(STATE.Loading);
        },
        // 成功取得ftn地址
        finish_requesting : function(url){
//            if(this.state!==STATE.Loading){
//                return;
//            }
            this.url = url;
            // 记录ftn生成地址的时间
            this.loaded_time = new Date();
            this.change_state(STATE.Loaded);
        },
        // 请求ftn地址失败
        fail_requesting : function(){
//            if(this.state!==STATE.Loading){
//                return;
//            }
            this.cgifail++;
            if(this.cgifail>=1){
                return this.totally_fail_requesting();
            }
            this.change_state(STATE.Pending);
        },
        // 放弃请求ftn地址，判定为抢救无效
        totally_fail_requesting : function(){
//            if(this.state!==STATE.Loading){
//                return;
//            }
            this.change_state(STATE.FtnFail);
            var defs = this.defs;
            this.defs = [];
            $.each(defs, function(index, def){
                def.reject();
            });
        },
        // 开始使用img加载图片
        start_caching : function(){
            if(this.state!==STATE.Loaded){
                return;
            }
            this.change_state(STATE.Caching);
        },
        // img成功加载图片
        finish_caching : function(img){
            if(this.state!==STATE.Caching){
                return;
            }
            this.img = img;
            this.change_state(STATE.Fetched);
            var defs = this.defs, me = this;
            this.defs = [];
            $.each(defs, function(index, def){
                def.resolve(me.url, me.img);
            });
        },
        // img加载图片失败
        fail_caching : function(){
            if(this.state!==STATE.Caching){
                return;
            }
            this.imgfail++;
            if(this.imgfail>=3){
                return this.totally_fail_caching();
            }
            this.change_state(STATE.Loaded);
        },
        // img加载图片失败，判定为抢救无效
        totally_fail_caching : function(){
            if(this.state!==STATE.Caching){
                return;
            }
            this.change_state(STATE.CacheFail);
            var defs = this.defs;
            this.defs = [];
            $.each(defs, function(index, def){
                def.reject();
            });
        },
        notify_state_change : function(state, old_state){
            this.host.on_task_state_change(this, state, old_state);
        },
        // 注册回调
        ready : function(def){
            var last_time = this.loaded_time;
            // 如果过了11.5小时，ftn提供的地址已经失败，需要重新拉。（ftn目前的失效时间是12小时）
            if(last_time && (new Date() - last_time) > 11.5*60*60*1000){
                this.start();
            }
            switch(this.state){
                case STATE.Fetched:
                    def.resolve(this.url, this.img);
                    break;
                case STATE.FtnFail:
                case STATE.CacheFail:
                    def.reject();
                    break;
                default:
                    this.defs.push(def);
                    break;
            }
        }
    });
    var Module = inherit(Event, {
        width : 128,
        height : 128,
        buffer : 1,
        constructor : function(cfg){
            $.extend(this, cfg);
            this.cgi_requesting = 0; // 并发的cgi请求数
            this.img_requesting = 0; // 并发的ftn img请求数
            this.maps = {
                all : {}, // 所有任务
                pending : {}, // 还没有开始请求的
                loaded : {} // 还没有用imgLoader缓存的
            };
            BATCH_DOWNLOAD_LIMIT_COUNT = query_user.get_cached_user() && query_user.get_cached_user().get_files_download_count_limit() || 10;
            this.requesting_queue = {};
        },
        reset_size: function(width, height) {
            this.width = width;
            this.height = height;
        },
        get : function(pid, id, name, url){
            var def = $.Deferred();
            
            var task = this.get_task(pid, id, name, url);
            task.ready(def);
            
            this.buffer_load();
            
            return def;
        },
        get_task : function(pid, id, name, url){
            var map = this.maps.all;
            if(map.hasOwnProperty(pid) && map[pid].hasOwnProperty(id)){
                return map[pid][id];
            }
            var task = new Task(this, pid, id, name, url);
            // 立即开始排队
            task.start();
            return task;
        },
        on_task_state_change : function(task, state, old_state){
            var map, dtask;
            switch(state){
                case STATE.Pending: // 准备请求，放到pending中，等待请求ftn地址
                    this.put_task_to_map(task, this.maps.pending);
                    break;
                case STATE.Loaded: // 加载完成，放到loaded中，等待缓存
                    this.put_task_to_map(task, this.maps.loaded);
                    break;
                case STATE.Fetched: // 加载完成，啥也不用干
                    break;
            }
            switch(old_state){
                case STATE.Initial: // 刚创建，放到all
                    this.put_task_to_map(task, this.maps.all);
                    break;
                 case STATE.Pending: // 结束加载等待，从pending中移除
                    this.remove_task_from_map(task, this.maps.pending);
                    break;
                case STATE.Loaded: // 结束缓存等待，从loaded中移除
                    this.remove_task_from_map(task, this.maps.loaded);
                    break;
            }
        },
        put_task_to_map : function(task, map){
            map[task.id] = task;
        },
        remove_task_from_map : function(task, map){
            delete map[task.id];
        },
        buffer_load : function(){
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout($.proxy(this.do_load, this), this.buffer);
        },
        // 从ftn加载
        do_load : function(){
            var tasks, task;
            while(this.can_request()){
                // 从pending待请求列表中取一个目录的任务
                tasks = this.get_next_directory_task(this.maps.pending);
                if(!tasks.length){ // 没有任务了
                    break;
                }
                this.batch_request_ftn(tasks);
            }
            while(this.can_cache()){
                task = this.get_next_task(this.maps.loaded);
                if(!task){
                    break;
                }
                this.cache_img(task);
            }
        },
        get_next_directory_task : function(map){
            var id, tasks = [];
            for(id in map){
                if(map.hasOwnProperty(id)){
                    tasks.push(map[id]);
                    // img_view_bat一次只拉10个
                    if(tasks.length>=BATCH_DOWNLOAD_LIMIT_COUNT){
                        break;
                    }
                }
            }
            return tasks;
        },
        get_next_task : function(map){
            var id;
            for(id in map){
                if(map.hasOwnProperty(id)){
                    return map[id];
                }
            }
        },
        get_req_data: function(tasks) {
            var data;

            if(this.is_virtual) {
                data = {
                    pdir_key: tasks[0].pid,
                    abstract: 1,
                    download_list: $.map(tasks, function(task, i) {
                        return {
                            file_id: task.id,
                            filename: task.name
                        };
                    })
                };
            } else {
                data = {
                    need_thumb: true,
                    file_list: $.map(tasks, function (task, i) {
                        return {
                            file_id: task.id,
                            filename: task.name,
                            pdir_key: task.pid
                        };
                    })
                };
            }

            return data;
        },

        make_real_url: function(rsp_item) {
            var me = this,
                url,
                host = rsp_item['server_name'],
                port = rsp_item['server_port'],
                path = rsp_item['encode_url'];
            if(rsp_item.download_url) {
                url = rsp_item.download_url;
            } else {
                url = 'http://' + host + ':' + port + '/ftn_handler/' + path;
            }

            url = https_tool.translate_url(url);

            return url + (url.indexOf('?') > -1 ? '&' : '?') +  'size=' + me.width + '*' + me.height; // 64*64  /  128*128
        },
        // private
        // 批量请求ftn下载地址，必须是同目录下的
        batch_request_ftn : function(tasks){
            var me = this;
	        var req, timestamp;
            var user = query_user.get_cached_user();
            if(!user){
                me.user_no_ready = true;
                query_user.on_ready(function(){
                    me.user_no_ready = false;
                    me.buffer_load();
                });
                return;
            }
            this.cgi_requesting++;
            var map = {};
	        var reqTask = [];
            $.each(tasks, function(index, task){
	            if(task.url) {
		            task.finish_requesting(task.url + (task.url.indexOf('?') > -1 ? '&' : '?') + 'size=' + me.width + '*' + me.height);
	            } else {
		            map[task.id] = task;
		            task.start_requesting();
		            reqTask.push(task);
	            }
            });

	        if(reqTask.length) {
		        timestamp = + new Date;

		        req = request.xhr_post({
			        url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
			        cmd: this.is_virtual ? 'VirtualDirBatchFileDownload' : 'DiskFileBatchDownload',
			        cavil: true,
			        pb_v2: true,
			        body: this.get_req_data(reqTask)
		        });

		        req.ok(function(msg, body) {
			        $.each(body['file_list'], function(index, img_rsp) {
				        var id = img_rsp['file_id'];
				        var task = map[id];
				        if(!task) {
					        return;
				        }
				        delete map[id]; // 加载好了的就删掉
				        var ret = parseInt(img_rsp['retcode'], 10), url;
				        if(ret === 0) {
					        url = me.make_real_url(img_rsp);
					        task.finish_requesting(url);
				        } else {
					        task.fail_requesting();
				        }
			        });
			        // 如果cgi没有返回？
			        var id;
			        for(id in map) {
				        if(map.hasOwnProperty(id)) {
					        map[id].fail_requesting();
				        }
			        }
		        }).fail(function() {
			        $.each(tasks, function(index, task) {
				        task.fail_requesting();
			        });
		        }).done(function() {
			        // 请求结束后继续加载
			        me.cgi_requesting--;
			        me.buffer_load();
			        delete me.requesting_queue[timestamp];
		        });

		        me.requesting_queue[timestamp] = req;
	        } else {
		        // 请求结束后继续加载
		        me.cgi_requesting--;
		        me.buffer_load();
	        }
        },
        // 限制并发
        can_request : function(){
            return !this.user_no_ready && this.cgi_requesting < 3;
        },
        cache_img : function(task){
            this.img_requesting++;
            
            var me = this;
            task.start_caching();
            image_loader.load(task.url).done(function(img){
                task.finish_caching(img);
            }).fail(function(){
                task.fail_caching();
            }).always(function(){
                me.img_requesting--;
                me.buffer_load();
            });
        },
        // 限制并发
        can_cache : function(){
            return this.img_requesting < 25;
        },

        destroy: function() {
            $.map(this.requesting_queue, function(req) {
               req && req.destroy();
            });
        }
    });
    return Module;
});