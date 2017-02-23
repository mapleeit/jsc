//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/downloader/downloader.r160119",["lib","common","$"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//downloader/src/Thumb_loader.js
//downloader/src/downloader.js
//downloader/src/thumb_url_loader.js
//downloader/src/view.tmpl.html

//js file list:
//downloader/src/Thumb_loader.js
//downloader/src/downloader.js
//downloader/src/thumb_url_loader.js
/**
 * 通用的缩略图加载，原网盘的加载与文件列表耦合太高。时间轴的加载是单例，存在风险。
 * @author cluezhang
 * @date 2013-11-10
 */
define.pack("./Thumb_loader",["lib","common","$"],function(require, exports, module){
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
});/**
 * 下载
 * @author jameszuo
 * @date 13-3-27
 */
define.pack("./downloader",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('downloader'),
        text = lib.get('./text'),
        security = lib.get('./security'),
        url_parser = lib.get('./url_parser'),
        cookie = lib.get('./cookie'),
	    covert = lib.get('./covert'),

        query_user = common.get('./query_user'),
        progress = common.get('./ui.progress'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        stat_log = common.get('./stat_log'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        urls = common.get('./urls'),
        session_event = common.get('./global.global_event').namespace('session'),
        logic_error_code = common.get('./configs.logic_error_code'),
        mini_tip = common.get('./ui.mini_tip'),
        FileObject = common.get('./file.file_object'),
        request = common.get('./request'),
        global_var = common.get('./global.global_variable'),
        https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        os = common.get('./util.os'),

        tmpl = require('./tmpl'),

    // 单文件下载URL模板
        url_tpl_single = 'http://download.cgi.weiyun.com/wy_down.fcg',
        thumb_tpl_single = 'http://download.cgi.weiyun.com/imgview.fcg',

    // 打包下载URL模板
        url_tpl_zip = 'http://sync.box.qq.com/pack_dl.fcg',

        down_fail_callback_url = constants.DOMAIN + '/web/callback/iframe_disk_down_fail.html',

    // 是否使用location跳转方式下载
        use_redirect_download = false,
        ie6_down_name_len = 16,

        shaque_ie = $.browser.msie,
        shaque_ie6 = shaque_ie && $.browser.version < 7,


        encode = encodeURIComponent,

        re_cn_char = /[^\x00-\xff]/, // 全角字符

        pack_default_size = -1, // 打包下载无法取得文件大小时的默认值
        pack_down_limit = 100, // 打包下载不能超过40个文件
        pack_file_name_len = 28, // 打包下载文件名长度上限
        pack_file_ext = 'zip', // 打包下载的文件类型

    // webkit 下，这些字符会被替换为全角
        sbc_map = {
            '#': 1,
            '?': 1,
            '&': 1,
            "'": 1,
            '%': 1,
            ';': 1,
            ',': 1
        },
        plugin_route = {
            package_size: '1',//用1字节作为 打包下载的标识
            /**
             * 调用控件下载
             * @param {string} url
             * @param {string} size
             * @param {string} name
             * @param {string} icon
             * @param {boolean} is_pack_down 是否打包下载
             */
            call_download: function (url, size, name, icon, is_pack_down) {
                if (is_pack_down) {
                    size = this.package_size;
                }
                //QQ1.97及以前版本不允许下载大于4G的文件
                if (!window.external.GetVersion && size >= Math.pow(2, 30) * 4) {
                    setTimeout(function () {
                        window.external.MsgBox_Confirm('提示', '你的QQ版本暂不支持下载4G以上的文件。', 0);
                    }, 0);
                }
                else {
                    // 可使用cookie方式下载
                    if (common_util.can_use_cookie(url)) {
                        // 请求CGI取得FTN地址
                        this._down_from_ftn(url, size, name, icon);
                    }
                    // 不支持cookie，请求发往CGI服务器并302跳转到FTN下载（url中会包含uin/skey等信息）
                    else {
                        window.external.ClickDownload(url, size, name, icon);
                    }
                }
            },
            /**
             * 调用控件的拖拽下载
             * @param {string} name
             * @param {string} size
             * @param {string} url
             * @param {string} ico
             * @param {boolean} is_pack_down 是否打包下载
             */
            call_drag_download: function (name, size, url, ico, is_pack_down) {
                if (is_pack_down) {
                    size = this.package_size;
                }
                if ($.browser.msie) {// 旧版本IE内核
                    external.DragMultiFileDownload([
                        [ name, size, url ]
                    ]);
                } else {
                    // webkit 内核
                    external.DragMultiFileDownload(url + '/?', size, name, ico);
                }
            },

            /**
             * 从FTN直接下载文件
             * @private
             */
            _down_from_ftn: function (url, size, name, icon) {
                downloader.get_ftn_url_from_cgi(url)
                    .done(function (url, cookie_name, cookie_value) {
                        cookie.set(cookie_name, cookie_value, {
                            domain: constants.MAIN_DOMAIN,
                            path: '/',
                            expires: cookie.minutes(10)
                        });
                        console.debug([
                            '调用客户端接口 ClickDownload()，下载FTN文件 ',
                            'url=' + url,
                            'cookie_name=' + cookie_name,
                            'cookie_value=' + cookie_value
                        ].join('<br>'));
                        if (cookie.get(cookie_name) !== cookie_value) {
                            console.error('FTN cookie 写入失败！');
                        }
                        external.ClickDownload(url, size, name, icon, document.cookie);
                    })
                    .fail(function (msg, ret) {
                        console.error('获取FTN下载地址失败, msg=' + msg + ', ret=' + ret);
                        mini_tip.warn(msg);
                    });
            }
        };

    var downloader_v2 = {
        /**
         * 下载
         * @param {Array<FileObject>|FileObject} files
         * @param {jQuery.Event} e
         */
        down: function (files, e, xuanfeng) {
            e.preventDefault();
            if (!files || !common_util.is_user_trigger(e) || !common_util.check_down_cookie()) {
                console.warn('downloader.down()参数无效, !files || !is_user_trigger: ' + !common_util.is_user_trigger(e) + ' || !check_down_cookie: ' + !common_util.check_down_cookie());
	            logger.report({
		            report_console_log: true
	            });
                return false;
            }

            if (FileObject.is_instance(files)) {
                files = [files];
            }

            if (!(files instanceof Array)) {
                console.warn([
                    'downloader.down()参数无效, !(files instanceof Array)',
                    'typeof files: ' + typeof(files),
                    'file name: ' + (files && files._name) ? files._name : '',
                    'file size: ' + (files && files._size) ? files._size : '',
                    'file type: ' + (files && files._type) ? files._type : '',
                    'file pid: ' + (files && files._pid) ? files._pid : '',
                    'file id: ' + (files && files._id) ? files._id : ''
                ].join('\n'));

                logger.report({
                    report_console_log: true
                });

                var result = logic_error_code.is_logic_error_code('download', 1000500)? 2 : 1;
                logger.monitor('js_download_error', 1000500, result);
                return false;
            }

            // 过滤掉破损文件和非FileObject参数
            files = $.grep(files, function (file) {
                return !(file.is_broken_file() || !FileObject.is_instance(file));
            });

            if (!files.length) {
                console.warn('downloader.down()没有可下载的文件');
	            logger.report({
		            report_console_log: true
	            });
                return false;
            }


            var total_size = 0,
                has_dir = false;
            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    has_dir = true;
                    return false;
                }
                total_size += file.get_size();
            });
            var is_pack_down = files.length > 1,
                pack_down_limit = query_user.get_cached_user() && query_user.get_cached_user().get_files_packpage_download_size() || 100,
                is_limit = files.length > pack_down_limit || total_size > constants.FILE_DOWNLOAD_LIMIT,
                text = files.length > pack_down_limit? '您选择的文件过多' : (total_size > constants.FILE_DOWNLOAD_LIMIT? '您选择的文件过大' : '');

          /*  if(has_dir){
                //PC不支持下载文件夹，这里先给错误提示
                mini_tip.error('不支持下载文件夹');
                console.warn('downloader.down()不支持下载文件夹');
                logger.report({
                    report_console_log: true
                });
                return false;
            } else */
            if(is_limit && !constants.IS_APPBOX && os.name !== 'mac') {
                //单个大文件或者超过50个文件，都呼起PC起来下载
                this.download_by_client(files, text);
                return;
            }

            if (is_pack_down && !constants.IS_WEBKIT_APPBOX) {
                progress.show('正在获取下载地址', 2, true, 'getting_down_url');
            }

            //return this._down_files(files);
            var me = this;
            this.pre_down(files).done(function(opt) {
                console.log('disk go_down_file' + JSON.stringify(opt));
	            if(xuanfeng) {  //启动旋风下载标识
		            opt.xuanfeng = xuanfeng;
	            }
                me.go_down_file(files, opt);
                common_util.pre_down_report(0, files);

                //成功的也全部上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);
            }).fail(function(msg, ret) {
                common_util.pre_down_report(ret, files);
				//日志上报
	            var console_log = [];
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
	            console_log.push('pre_down error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
	            if(files && files.length) {
		            for(var i=0, len=files.length; i<len; i++) {
			            console_log.push('error --------> files[' + i + ']  name: ' + files[i]._name + ', type: ' + files[i]._type + ', size: ' + files[i]._readability_size + ', md5: ' + files[i]._file_md5 + ', sha: ' + files[i]._file_sha);
		            }
	            }
	            logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        /**
         * 超过1G或者超过100个文件，呼起PC客户端起来下载
         * @param files
         */
        download_by_client: function(files, text) {
            //超过一百个，需要做批量分享，和批量操作
            var me = this;
            require.async(constants.HTTP_PROTOCOL + '//imgcache.qq.com/qzone/qzactStatics/configSystem/data/65/config1.js', function(config_data) {
                var os_name = os.name === 'mac'? 'mac_sync' : os.name,
                    download_url = (config_data && config_data[os_name] && config_data[os_name]['download_url']) || 'http://www.weiyun.com/download.html';
                me.get_share_key(files).done(function(share_key) {
                    var uin = query_user.get_uin_num(),
                        schema_url = "weiyun://download/?uin=" + uin + "&share_key=" + share_key;
                    if(!me._$download_dialog) {
                        me._$download_dialog = $(tmpl.download_dialog({text: text}));
                        me._$download_dialog.appendTo(document.body);
                    } else {
                        me._$download_dialog.find('[data-id=title]').text(text);
                    }
                    me._$download_dialog.find('#download_client').attr('href', download_url);
                    me._$download_dialog.find('#open_client').attr('href', schema_url);
                    me._$download_dialog.show();
                    me._$download_dialog.find('#close_dialog').on('click', function() {
                        me._$download_dialog.hide();
                    });
                });
            });
        },

        get_share_key: function(files) {
            var me = this,
                REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
                def = $.Deferred();

            var _files = [],
                _dirs = [];

            $.each(files, function (i, f) {
                if (f.is_dir()) {
                    _dirs.push({
                        pdir_key: f.get_pid(),
                        dir_key: f.get_id(),
                        dir_name: f.get_name()
                    });
                } else {
                    _files.push({
                        pdir_key: f.get_pid(),
                        file_id: f.get_id(),
                        filename: f.get_name(),
                        file_size: f.get_size()
                    });
                }
            });

            var req_body;
            req_body = {
                dir_list: _dirs,
                file_list: _files
            }

           request.xhr_post({
                    url: REQUEST_CGI,
                    cmd: 'ClipBoardTrans',
                    body: req_body,
                    cavil: true,
                    pb_v2: true
                }).ok(function (msg, body) {
                    var link = body['trans_key'];
                    def.resolve(link);
                }).fail(function (msg, ret) {
                   mini_tip.error(msg);
                   def.reject(msg);
                }).done(function () {
                });

            return def;
        },

        /**
         * 预下载（先向cgi拉取下载url）
         * @param files
         */
        pre_down: function(files) {
            var is_pack_down = files.length > 1 || (files.length === 1 && files[0].is_dir()),
                def = $.Deferred(),
                me = this;

            if(files[0].get_parent && files[0].get_parent().is_offline_dir && files[0].get_parent().is_offline_dir()) {
	            console.log('down_vfiles');
                this._down_vfiles(files)
                    .done(function(opt) {
                        opt.ftn_url = me.get_real_down_url(files, opt);
                        def.resolve(opt);
                    }).fail(function(msg, ret) {
                        def.reject(msg, ret);
                    });
            } else if(!is_pack_down) {
	            console.log('down_single_file');
                this._down_single_file(files)
                    .done(function(opt) {
                        opt.ftn_url = me.get_real_down_url(files, opt);
                        def.resolve(opt);
                    }).fail(function(msg, ret) {
                        def.reject(msg, ret);
                    });
            } else {
	            console.log('pack_down_files');
                this._pack_down_files(files)
                    .done(function(opt) {
                        opt.ftn_url = me.get_real_down_url(files, opt);
                        def.resolve(opt);
                    }).fail(function(msg, ret) {
                        def.reject(msg, ret);
                    });
            }

            return def;
        },

        _down_single_file: function(files) {

            var params_list = [],
                def = $.Deferred();

            $.each(files, function(i, file) {
                params_list.push({
                    file_id: file.get_id(),
                    filename: file.get_name(),
                    pdir_key: file.get_pid()
                });
            });

            var is_temporary_file = files[0].is_temporary && files[0].is_temporary(),
                url, cmd;
            if(is_temporary_file) {
                url = 'http://web2.cgi.weiyun.com/temporary_file.fcg';
                cmd = 'TemporaryFileDiskFileBatchDownload';
            } else {
                url = 'http://web2.cgi.weiyun.com/qdisk_download.fcg';
                cmd = 'DiskFileBatchDownload';
            }
            request.xhr_post({
                url: url,
                cmd: cmd,
                cavil: true,
                pb_v2: true,
                body: {
                    file_list: params_list
                }
            }).ok(function(msg , body) {
                var ftn_opt = body['file_list'][0];
                if(!ftn_opt.retcode) {
                    def.resolve(ftn_opt);
                } else {
                    mini_tip.warn(ftn_opt.retmsg || ret_msgs.get(ftn_opt.retcode) || '请求下载失败');
                    def.reject(ftn_opt.retmsg, ftn_opt.retcode);
                }
            }).fail(function(msg, ret) {
                mini_tip.warn(msg || '请求下载失败');
                def.reject(msg, ret);
            });

            return def;
        },

        _pack_down_files: function(files) {
            var first_file = files[0],
                zip_filename = common_util.get_zip_name(files),
                pdir_key = first_file.get_pid(),
                pdir_name = first_file.get_parent && first_file.get_parent().get_name() || '',
                dir_params_list = [],
                file_params_list = [];

            var def = $.Deferred(),
                me = this;

            if (!constants.IS_WEBKIT_APPBOX) {
                progress.show('正在获取下载地址', 2, true, 'getting_down_url');
            }

            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    dir_params_list.push({
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    });
                } else {
                    file_params_list.push({
                        file_id: file.get_id(),
                        filename: file.get_name(),
                        pdir_key: file.get_pid()
                    });
                }
            });

            var is_temporary_file = files[0].is_temporary && files[0].is_temporary(),
                url, cmd;
            if(is_temporary_file) {
                url = 'http://web2.cgi.weiyun.com/temporary_file.fcg';
                cmd = 'TemporaryFileDiskFilePackageDownload';
            } else {
                url = 'http://web2.cgi.weiyun.com/qdisk_download.fcg';
                cmd = 'DiskFilePackageDownload';
            }

            request.xhr_post({
                url: url,
                cmd: cmd,
                cavil: true,
                pb_v2: true,
                body: {
                    pdir_list: [{
                        pdir_key: pdir_key,
                        pdir_name: pdir_name,
                        file_list: file_params_list,
                        dir_list: dir_params_list
                    }],
                    zip_filename: common_util.fix_down_file_name(zip_filename)
                }
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                if((ret === 22073 || ret === 22077 || ret === 22078) && !constants.IS_APPBOX && os.name !== 'mac') {
                    var text = '您选择的文件包含文件夹';
                    switch(ret) {
                        case 22073:
                            text = '您选择的文件夹过多';
                            break;
                        case 22077:
                            text = '您选择的文件夹包含子文件夹';
                            break;
                        case 22078:
                            text = '您选择的文件夹内文件过多';
                            break;
                    }
                    me.download_by_client(files, text);
                } else {
                    mini_tip.warn(msg || '请求下载失败');
                }
                def.reject(msg, ret);
            }).done(function() {
                // 隐藏下载进度
                progress.hide_if(true, 'getting_down_url');
            });

            return def;

        },

        /**
         * 虚拟目录文件下载
         * @param files
         * @private
         */
        _down_vfiles: function(files) {
            if(files.length > 1 || files[0].is_dir()) {
                console.warn('虚拟目录文件不支持打包下载');
                return;
            }
            var params_list = [],
                def = $.Deferred();

            $.each(files, function(i, file) {
                params_list.push({
                    file_id: file.get_id(),
                    filename: file.get_name(),
                    owner_type: file.is_offline_node() && file.get_down_type()
                });
            });

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
                cmd: 'VirtualDirBatchFileDownload',
                cavil: true,
                pb_v2: true,
                body: {
                    pdir_key: files[0].get_pid(),
                    abstract: 0,
                    download_list: params_list
                }
            }).ok(function(msg , body) {
                var ftn_opt = body['ret_list'][0];
                if(!ftn_opt.retcode) {
                    def.resolve(ftn_opt);
                } else {
                    mini_tip.warn(ftn_opt.retmsg || ret_msgs.get(ftn_opt.retcode) || '请求下载失败');
                    def.reject(ftn_opt.retmsg, ftn_opt.retcode);
                }

            }).fail(function(msg, ret) {
                mini_tip.warn(msg || '请求下载失败');
                def.reject(msg, ret);
            });

            return def;
        },

        /**
         * 拼装成真正的ftn下载地址
         * @param files
         * @param ftn_opt
         * @returns {*}
         */
        get_real_down_url: function(files, ftn_opt) {
            var path,
                server_name,
                fname,
                fid,
                is_package = false,
                url;

            fid = $.map(files, function(file) {
                return file.get_id();
            });
            fid = fid.join(',');

            if(ftn_opt.download_url) {//虚拟目录文件下载会使用
                url = ftn_opt.download_url;
            }
            else {
                server_name = ftn_opt.server_name;
                if(files.length > 1 || files[0].is_dir()) { //打包下载
                    fname = common_util.get_zip_name(files);
                    path = ftn_opt.down_header + ftn_opt.down_body;
                    url = 'http://' + server_name + (ftn_opt.server_port ? ':' + ftn_opt.server_port : '') + '/ftn_handler/' + path;
                    is_package = true;
                } else {
                    fname = files[0].get_name();
                    path = ftn_opt.encode_url;
                }
                if(!is_package) {
                    url = 'http://' + server_name + (ftn_opt.server_port ? ':' + ftn_opt.server_port : '') + '/ftn_handler/' + path + '/';
                    url = urls.make_url(url, {
                        fname: fname,
                        cv: constants.APPID,
                        cn: 0
                    });
                }
            }

            url = https_tool.translate_download_url(url);
            if(constants.IS_APPBOX) {//APPBOX才会有用到
                this.save_fid_map(url.split('/')[4], fid);//key:down_key,value:fid
            }

            return url;
        },
        /**
         * 保存fid，用于appbox数据上报
         * @param key
         * @param fid
         */
        save_fid_map: function(key, fid) {
            global_var.set(key, fid);
        },

        /**
         * 到ftn下载文件
         * @param {Object} files 要下载的文件对象
         * @param {Object} ftn_opt 文件下载的参数
         * @private
         */
        go_down_file: function(files, ftn_opt) {
            var me = this,
	            $frame,
                result,
                cookie_name = ftn_opt.cookie_name,
                cookie_value = ftn_opt.cookie_value;

            var url = ftn_opt.ftn_url;

            cookie.set(cookie_name, cookie_value, {
                domain: constants.MAIN_DOMAIN,
                path: '/'
            });

            if(!cookie.get(cookie_name)) {
                //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                logger.report('weiyun_predownload', {
                    desc: 'there are no cookie',
                    appobx: constants.IS_APPBOX ? true : false
                });

                result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                logger.monitor('js_download_error', 1000501, result);
            } else if(cookie.get(cookie_name) !== cookie_value) {
                //正常来说，设置的cookie值应该会跟本地的一致，这里设置失败导致不一致的原因需要定位，所以也上报逻辑错误，先看下数据
                logger.report('weiyun_predownload', {
                    desc: cookie_value + ' cookie set fail',
                    appobx: constants.IS_APPBOX ? true : false
                });

                result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                logger.monitor('js_download_error', 1000502, result);
            }

            if(constants.IS_APPBOX) { // APPBOX 使用控件下载
                var args = common_util.get_down_args_for_client(files);
                external.ClickDownload(url + '/?', args.size, args.name, args.ico, document.cookie);
                console.log('cgi2.0 - appbox 控件下载：', url);
	            logger.report({
		            report_console_log: true
	            });

                return;
            } else if(constants.IS_QZONE && $.browser.msie) {
                //IE下在iframe内设置cookie会有问题，而且无法再用iframe方式下载，这里直接用location.href
                window.location.href = ftn_opt.xuanfeng ? me.covert_xuanfeng_url(url) : url;
                console.debug('qzone内嵌版微云使用location.href方式下载');
                logger.report({
                    report_console_log: true
                });
                return;
            }


            console.log('cgi2.0 - 浏览器下载：', url);

            //WEB 使用iframe or location.href跳转下载
            $frame = common_util.get_$down_iframe();
            // 如果上面的方式被IE阻止，则使用跳转方式
            try {
                if (cookie.get(cookie_name) !== cookie_value) {
                    console.error('FTN cookie 写入失败！');
                    throw 'cookie set fail';
                }
                $frame.attr('src', ftn_opt.xuanfeng ? me.covert_xuanfeng_url(url) : url);
                console.debug('使用iframe.src方式下载');
            }
            catch (x) {
                console.warn('使用iframe.src方式下载失败');
                window.location.href = ftn_opt.xuanfeng ? me.covert_xuanfeng_url(url) : url;
                console.debug('使用location.href方式下载');
            }

	        logger.report({
		        report_console_log: true
	        });
        },
        /**
         * 压缩包里的文件下载还在用这个老的方式，直接转成老的downloader处理了
         * @param url
         * @param name
         * @param size
         * @param ico
         */
        down_url_standard_post: function (url, name, size, ico) {
            downloader.down_url_standard_post.apply(downloader, arguments);
        },

        get_down_name: function(name) {
            return common_util.get_down_name(name);
        },

	    covert_xuanfeng_url: function(url) {
		    return 'qqdl://' + covert.toBase64(url);
	    }
    };

    var downloader = {
        /**允许外部扩展FileObject
         setFileNode: function( fileNode){
            FileObject = fileNode;
        },
         **/

        /**
         * 下载
         * @param {Array<FileObject>|FileObject} files
         * @param {jQuery.Event} e
         */
        down: function (files, e) {
            //引导升级吧，老的cgi不再维护
            var desc = '为了有更好的下载体验请<a href="http://im.qq.com/pcqq/" target="_blank">升级QQ</a>，或使用<a href="http://www.weiyun.com/disk/index.html" target="_blank">网页版</a>下载文件。';
            widgets.confirm('提示', '您的QQ版本过老', desc, $.noop, $.noop, ['确定'], false);
            return;

            if (!files || !common_util.is_user_trigger(e) || !common_util.check_down_cookie()) {
                console.warn('downloader.down()参数无效');
                return false;
            }

            if (FileObject.is_instance(files)) {
                files = [files];
            }

            if (!(files instanceof Array)) {
                console.warn('downloader.down()参数无效');
                return false;
            }

            // 过滤掉破损文件和非FileObject参数
            files = $.grep(files, function (file) {
                return !(file.is_broken_file() || !FileObject.is_instance(file));
            });

            if (!files.length) {
                console.warn('downloader.down()没有可下载的文件');
                return false;
            }


            e.preventDefault();

            var is_pack_down = files.length > 1 || (files.length === 1 && files[0].is_dir());
            if (is_pack_down && files.length > pack_down_limit) {
                mini_tip.warn('打包下载不能超过' + pack_down_limit + '个文件');
                return false;
            }

            if (is_pack_down && !constants.IS_WEBKIT_APPBOX) {
                progress.show('正在获取下载地址', 2, true, 'getting_down_url');
            }

            return this._down_files(files);
        },
        /**
         * 拖拽下载
         * @param {Array<FileObject>} files
         */
        drag_down: function (files) {
            if (!common_util.check_down_cookie() || !files || !files.length) {
                return false;
            }

            var args = downloader._get_down_args_for_client(files);
            setTimeout(function () {
                try {
                    plugin_route.call_drag_download(args.name, args.size, args.url, args.ico, args.is_pack_down);
                }
                catch (e) {
                    console.error('拖拽下载失败 ', e.message);
                }
            }, 10);
        },

        /**
         * 下载指定URL的文件
         * @param {String} url
         * @param {String} name
         * @param {Number} size
         */
        down_url: function (url, name, size) {

            var by_client_ok = false;

            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    var type = FileObject.get_type(name);
                    // 需要在URL最后加一个#。这么做是因为webkit appbox中下载文件时，会在URL后面追加一个"/文件名"，会生成一个不合法的URL，在最后放一个#可以避免这一问题。@james
                    plugin_route.call_download(url + '#', size + '', name, 'ico-' + (type || 'file'));
                    by_client_ok = true;
                }
                catch (e) {
                }
            }
            if (!by_client_ok) {
                var url_obj = url_parser.parse(url);

                url = urls.make_url(url_obj.get_url(), $.extend(url_obj.get_params(), { err_callback: down_fail_callback_url }));

                this._down_url(url, true);
            }
        },

        /**
         * @deprecated 已废弃  (实际上压缩包里的文件下载还在用，日哦，日后得改造)
         */
        down_url_standard_post: function (url, name, size, ico) {    //强制使用标准post, 参数放到body里
            console.debug('down_url_standard_post2');
            var by_client_ok = false;

            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    if (size === "0" || size === 0) {
                        size = "-1";
                    }
                    // 需要在URL最后加一个#。这么做是因为webkit appbox中下载文件时，会在URL后面追加一个"/文件名"，会生成一个不合法的URL，在最后放一个#可以避免这一问题。@james
                    var ret = plugin_route.call_download(url + '#', size + '', name, 'ico-' + ico);
                    console.debug('url= ' + url, size, name, ico);
                    console.error('ret= ' + ret);
                    by_client_ok = true;
                }
                catch (e) {
                }
            }

            if (!by_client_ok) {
                var url_obj = url_parser.parse(url);

                url = urls.make_url(url_obj.get_url(), $.extend({}, { err_callback: down_fail_callback_url }, url_obj.get_params()));

                this._down_url_standard_post(url, true);
            }
        },

        /**
         * 执行下载
         * @param {Array<FileObject>} files
         * @private
         */
        _down_files: function (files) {

            var by_client_ok = false;
            var me=this;
            // appbox 使用客户端API
            if (constants.IS_WEBKIT_APPBOX) {
                try {
                    var args = downloader._get_down_args_for_client(files);
                    // 需要在URL最后加一个#。这么做是因为webkit appbox中下载文件时，会在URL后面追加一个"/文件名"，会生成一个不合法的URL，在最后放一个#可以避免这一问题。@james
                    plugin_route.call_download(args.url + '#', args.size, args.name, args.ico, args.is_pack_down);
                    by_client_ok = true;
                }
                catch (e) {
                }
            }


            if (!by_client_ok) {
                // 如果使用客户端API下载失败，或非QQ客户端，则使用form+iframe下载


                var url = this.get_down_url(files, {
                    err_callback: down_fail_callback_url
                });

                this._down_url(url, files.length === 1);
            }
            common_util.pre_down_report(0, files);
            return true;
        },

        _down_url: function (url, is_single_file) {
            // james 20130527: IE下单文件使用location跳转，多文件使用form+iframe
            if (use_redirect_download) {
                window.location.href = url;
                return console.debug('IE单文件下载请使用location.href方式');
            }
            else {
                var
                    $frame = common_util.get_$down_iframe(),
                    $form = this._get_$down_form(),
                    _url_obj,
                    _url,
                    _url_param;

                if (!is_single_file) {     //多文件打包下载.
                    _url_obj = url_parser.parse(url);
                    _url = _url_obj.get_url() + '?post=1';
                    _url_param = _url_obj.get_params();
                } else {
                    _url = url;
                    _url_param = {};
                }

                try {
                    $form
                        .empty()
                        .attr('action', _url)
                        .attr('target', $frame.attr('name'))
                        .attr('method', 'POST');

                    //http://sync.box.qq.com/pack_dl.fcg
                    //http://sync.box.qq.com/pack_dl.fcg

                    $.each(_url_param, function (name, value) {
                        $('<input type="hidden" name="' + name + '"/>').val(value).appendTo($form);
                    });

                    $form[0].submit();

                    console.debug('使用form+iframe方式下载');
                }
                catch (e) {
                    console.warn('使用form+iframe方式下载失败');
                    // 如果上面的方式被IE阻止，则使用跳转方式
                    try {
                        $frame.attr('src', url);
                        console.debug('使用iframe.src方式下载');
                    }
                    catch (x) {
                        console.warn('使用iframe.src方式下载失败');
                        window.location.href = url;
                        console.debug('使用location.href方式下载');
                    }
                }
            }
        },

        /**
         * @deprecated 已废弃
         */
        _down_url_standard_post: function (url, is_single_file) {
            // james 20130527: IE下单文件使用location跳转，多文件使用form+iframe
            if (use_redirect_download) {
                window.location.href = url;
                return console.debug('IE单文件下载请使用location.href方式');
            }
            else {

                var
                    $frame = common_util.get_$down_iframe(),
                    $form = this._get_$down_form(),
                    _url_obj,
                    _url,
                    _url_param;

                _url_obj = url_parser.parse(url);
                _url = _url_obj.get_url() + '?post=1';
                _url_param = _url_obj.get_params();

                try {
                    $form
                        .empty()
                        .attr('action', _url)
                        .attr('target', $frame.attr('name'))
                        .attr('method', 'POST');

                    $.each(_url_param, function (name, value) {
                        $('<input type="hidden" name="' + name + '"/>').val(value).appendTo($form);
                    });

                    $form[0].submit();

                    console.debug('使用form+iframe方式下载');
                }
                catch (e) {
                    console.warning('使用form+iframe方式下载失败');
                    // 如果上面的方式被IE阻止，则使用跳转方式
                    try {
                        $frame.attr('src', url);
                        console.debug('使用iframe.src方式下载');
                    }
                    catch (x) {
                        console.warning('使用iframe.src方式下载失败');
                        window.location.href = url;
                        console.debug('使用location.href方式下载');
                    }
                }
            }
        },
        /**
         * @deprecated 已废弃 获取下载的URL
         * @param fileid
         * @param pdir
         * @param file_name
         * @returns {String} url（了扩展字段以外，只对文件名编码）
         */
        get_down_url2: function (fileid, pdir, file_name) {
            var _url = url_tpl_single,
                params = {
                    fid: fileid,
                    pdir: pdir,
                    fn: common_util.fix_down_file_name(file_name),
                    uin: query_user.get_uin_num(),
                    skey: query_user.get_skey(),
                    err_callback: down_fail_callback_url
                },

                url = urls.make_url(_url, params, false); // enc_value=false

            url += ('&ver=' + (constants.IS_APPBOX ? 12 : 11));
            //添加 sec_enc=1 作为转码标识 ,防止中文名被转码     by trump     just for safari
            if ($.browser.safari) {
                url += '&sec_enc=1';
            }
            return url;
        },
        /**
         * 获取下载的URL
         * @param {Array<FileObject>} files
         * @param {Object} [ex_params] 扩展参数（会对键值进行编码）
         * @param {Boolean} [params_uin_skey] 是否在GET参数中带上uin、skey
         * @returns {String} url（了扩展字段以外，只对文件名编码）
         */
        get_down_url: function (files, ex_params, params_uin_skey) {

            if (!files) {
                return '#';
            }
            if (FileObject.is_instance(files)) {
                files = [files];
            }

            var params,
                file_name,
                tpl_url,
                file_name_field,
            // 单文件
                single_file = files.length === 1 && !files[0].is_dir();

            if (single_file) {
                var file = files[0];

                tpl_url = url_tpl_single;
                if(ex_params){
                    //预览支持gif动画
                    if(file.is_image()){
                        if(  (FileObject.get_type(file.get_name()) || '').toLowerCase() === 'gif' && ex_params['abs'] === '1024*1024' ){
                            delete ex_params['abs'];
                        } else if( ex_params['thumb']  ){
                            tpl_url = thumb_tpl_single;
                            delete ex_params['thumb'];
                        }
                    }
                }
                file_name = common_util.trim_file_name(common_util.get_down_name(file.get_name()));
                file_name_field = 'fn';
                params = {
                    fid: file.get_id(),
                    pdir: file.get_pid() || file.get_parent().get_id()
                };
            }
            // 打包
            else {
                var _dirs = [], _files = [];
                $.each(files, function (i, f) {
                    (f.is_dir() ? _dirs : _files).push(f.get_id());
                });

                tpl_url = url_tpl_zip;
                file_name = common_util.get_zip_name(files);
                file_name_field = 'zn';
                params = {
                    fid: _files.join(','),
                    dir: _dirs.join(','),
                    pdir: files[0].get_pid() || files[0].get_parent().get_id()
                };
            }

            // 文件名参数特殊处理
            params[file_name_field] = common_util.fix_down_file_name(file_name);

            // 如果无法通过cookie下载，则带上uin/skey在GET参数里
            if (!common_util.can_use_cookie(tpl_url) || params_uin_skey) {
                params.uin = query_user.get_uin_num();
                params.skey = query_user.get_skey();
            }
            params.appid = constants.APPID;
            //QQ1.98才加上token验证
            //if(window.external.GetVersion){
            params.token = security.getAntiCSRFToken();
            //}

            // 打击盗链 - james
            var user = query_user.get_cached_user();
            params.checksum = user ? user.get_checksum() : '';

            // 扩展参数（不允许覆盖已有的参数）
            if (ex_params) {
                $.each(ex_params, function (ex_key, ex_val) {
                    if (!(ex_key in params) && ex_val != undefined) {
                        params[encode(ex_key)] = encode(ex_val);
                    }
                });
            }

            var url = urls.make_url(tpl_url, params, false); // enc_value=false

            // ver 参数要放到最后，这是appbox的一个bug导致的（appbox的下载API会在URL后面加上'/<file_name>'） @james
            url += ('&ver=' + (constants.IS_APPBOX ? 12 : 11));
            //添加 sec_enc=1 作为转码标识 ,防止中文名被转码     by trump     just for safari
            if ($.browser.safari) {
                url += '&sec_enc=1';
            }
            return url;
        },

        /**
         * 通过CGI获取下载地址
         * @param {String} url
         * @return {$.Deferred}
         */
        get_ftn_url_from_cgi: function (url) {
            var def = $.Deferred();

            // 去除URL中的err_callback参数，并添加redirect=0参数
            var url_obj = url_parser.parse(url),
                params = url_obj.get_params();

            delete params['err_callback'];
            params['redirect'] = 0;

            //获取fileid追加到存储的地址上，让客户端得到
            var fileid = params['fid'];

            url = urls.make_url(url_obj.get_url(), params);

            console.debug('请求CGI获取FTN地址 ' + url);

            request.xhr_get({
                url: url,
                just_plain_url: true,
                re_try: 0,
                safe_req: true,
                data_adapter: function (rsp_data, headers) {
                    var ret = parseInt('ret' in rsp_data ? rsp_data.ret : headers['X-ERRNO']) || 0;
                    rsp_data = ret == 0 ? {
                        rsp_header: { ret: ret },
                        rsp_body: {
                            cookie_name: rsp_data['cookie_name'],
                            cookie_value: rsp_data['cookie_value'],
                            url: rsp_data['url']
                        }
                    } : {
                        rsp_header: { ret: ret },
                        rsp_body: {}
                    };
                    return rsp_data;
                }
            })
                .ok(function (msg, body) {
                    console.debug('FTN地址已取得 url=' + body.url + ', cookie_name=' + body.cookie_name + ', cookie_value=' + body.cookie_value);
                    //追加fileid到存储url上
                    var ftn_url = body.url + '&fid=' + fileid;
                    def.resolve(ftn_url, body.cookie_name, body.cookie_value);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });
            return def;
        },

        /**
         * iframe 下载错误的回调
         * @param {Number} ret 错误码
         * @param {String} [msg] 错误消息
         */
        down_fail_callback: function (ret, msg) {
            // 会话超时 和 独立密码验证失败 特殊处理
            if (ret_msgs.is_sess_timeout(ret)) {
                session_event.trigger('session_timeout');
            } else if (ret === ret_msgs.INVALID_INDEP_PWD) {
                session_event.trigger('invalid_indep_pwd');
            } else if (ret === ret_msgs.ACCESS_FREQUENCY_LIMIT) {
                mini_tip.warn(msg ? text.text(msg) : ret_msgs.get(ret));
            } else {
                // 显示错误提示
                mini_tip.error(msg ? text.text(msg) : ret_msgs.get(ret));
                if (ret === ret_msgs.FILE_NOT_EXIST) {
                    session_event.trigger('downloadfile_not_exist');
                }
            }

            // 隐藏下载进度
            progress.hide_if(true, 'getting_down_url');
        },

        /**
         * 获取QQ客户端下载所需的参数
         * @param {Array<FileObject>} files
         * @return {Object} 包含了 url, size, name, ico 的对象
         * @private
         */
        _get_down_args_for_client: function (files) {
            var args,
                is_single_down = files.length === 1 && !files[0].is_dir(),

                down_url = this.get_down_url(files);

            // 只有一个文件时，取文件属性
            if (is_single_down) {
                //code by bondli 空文件下载的支持
                var file_size = files[0].get_size() + '';
                if (file_size == 0) file_size = "-1";

                args = {
                    url: down_url,
                    //size: files[0].get_size() + '',
                    size: file_size,
                    name: files[0].get_name(),
                    ico: 'ico-' + (files[0].get_type() || 'file')
                };
            }
            // 是目录或包含多个文件时，取「压缩」后的属性
            else {
                var total_size = 0;
                $.each(files, function (i, f) {
                    total_size += f.get_size();
                });

                // 我们无法取得目录的大小，所以如果size为0，则给一个 -1 表示未知文件大小
                if (total_size === 0) {
                    total_size = pack_default_size;
                }
                args = {
                    url: down_url,
                    name: common_util.get_zip_name(files) + '.' + pack_file_ext,
                    size: total_size + '',
                    ico: 'ico-' + pack_file_ext
                };
            }
            args.is_pack_down = !is_single_down;//是否打包下载
            // 修复客户端下载 400 Bad Request 的bug
            //args.name = args.name.replace(/\s/g, '_');
            //QQ1.98后修正了文件名空格问题
            if (!window.external.GetVersion) {
                args.name = args.name.replace(/\s/g, '_');
            }

            return args;
        },

        _get_$down_form: function () {
            return this._$down_form || (this._$down_form = $('<form method="GET" enctype="application/x-www-form-urlencoded"></form>').appendTo($downloader_ct));
        },
        get_down_name: function(name) {
            return common_util.get_down_name(name);
        }
    };

    var common_util = {


        get_$down_iframe: function () {
            return $down_iframe;
        },

        get_$down_els: function () {
            return $downloader_ct;
        },

        /**
         * 检查是否是用户行为
         * @param {jQuery.Event} e jQuery事件实例
         */
        is_user_trigger: function (e) {
            if (e instanceof $.Event) {
                return true;
            } else {
                console.error('该方法只能由用户行为触发，请传入jQuery.Event实例以确保该操作可以正常工作');
                return false;
            }
        },
        /**
         * 下载前的cookie检查
         * @returns {boolean}
         */
        check_down_cookie: function () {
            var is_sign_in = !!query_user.check_cookie();

            if (!is_sign_in) {
                session_event.trigger('session_timeout');
            }

            return is_sign_in;
        },
        /**
         * 获取QQ客户端下载所需的参数
         * @param {Array<FileObject>} files
         * @return {Object} 包含了 url, size, name, ico 的对象
         * @private
         */
        get_down_args_for_client: function (files) {
            var args,
                is_single_down = files.length === 1 && !files[0].is_dir();
            // 只有一个文件时，取文件属性
            if (is_single_down) {
                //code by bondli 空文件下载的支持
                var file_size = files[0].get_size() + '';
                if (file_size == 0) file_size = "-1";

                args = {
                    //size: files[0].get_size() + '',
                    size: file_size,
                    name: files[0].get_name(),
                    ico: 'ico-' + (files[0].get_type() || 'file')
                };
            }
            // 是目录或包含多个文件时，取「压缩」后的属性
            else {
                var total_size = 0;
                $.each(files, function (i, f) {
                    total_size += f.get_size();
                });

                // 我们无法取得目录的大小，所以如果size为0，则给一个 -1 表示未知文件大小
                if (total_size === 0) {
                    total_size = pack_default_size;
                }
                args = {
                    name: common_util.get_zip_name(files) + '.' + pack_file_ext,
                    size: total_size + '',
                    ico: 'ico-' + pack_file_ext
                };
            }
            args.is_pack_down = !is_single_down;//是否打包下载
            // 修复客户端下载 400 Bad Request 的bug
            //args.name = args.name.replace(/\s/g, '_');
            //QQ1.98后修正了文件名空格问题
            if (!window.external.GetVersion) {
                args.name = args.name.replace(/\s/g, '_');
            }

            return args;
        },

        get_zip_name: function (files) {
            var zip_name_len = shaque_ie6 ? ie6_down_name_len : pack_file_name_len,
                file_name = files[0].get_name_no_ext(),
                zip_name;

            if (files.length === 1) {
                zip_name = text.smart_sub(file_name, zip_name_len);
            }
            else {
                var suffix = ['等', '十', '个文件'];
                // 将文件名“张三的简历深圳web前端等10个文件”调整为“张三的简历深圳..等10个文件”
                file_name = text.smart_sub(file_name, zip_name_len - suffix[0].length - suffix[1].length - suffix[2].length);
                zip_name = text.format('{first_name}{suffix_0}{count}{suffix_2}', { first_name: file_name, count: files.length, suffix_0: suffix[0], suffix_2: suffix[2] });
            }
            //console.log('zip_name', zip_name);
            return zip_name;
        },
        // 整理下载的文件名
        get_down_name: function (name) {

            if (!/\./.test(name)) {
                return this.fix_ext(name, '');
            }

            var idx = name.lastIndexOf('.'),
                ext = name.substring(idx + 1),
                sub = name.substring(0, idx);

            if (re_cn_char.test(ext)) {
                return this.fix_ext(name, '');
            } else {
                return this.fix_ext(sub, ['.', ext].join(''));
            }
        },

        /**
         * 文件名特殊处理
         * 目前只编码文件名（考虑到存储侧对于chrome的下载请求输出头部文件名的问题，且chrome会自动编码，这里对chrome就只编码URL特殊字符）
         * james
         */
        fix_down_file_name: function (file_name) {
            if ($.browser.webkit && !constants.IS_WEBKIT_APPBOX) {
                return text.to_dbc(file_name, sbc_map);
            } else {
                return encode(file_name);
            }
        },

        /*
         * IE下，url最大长度限定为20xx左右，这里限定文件名只使用1500字节，避免IE10下出错。
         * 其它浏览器限定7000，基本都是够用的
         */
        trim_file_name : function(full_name){
            var limit = $.browser.msie ? 1500 : 7000;
            var ext_index = full_name.lastIndexOf('.'),
                name = full_name,
                ext = '',
                ellipsis_tail = '...';
            if(ext_index>=0){
                name = full_name.slice(0, ext_index);
                ext = full_name.slice(ext_index);
                limit -= encode(ext).length;
            }
            // 二分法定位最合适切割点
            var full_size = encode(name).length, start, end, guess, guessValue, cut_index;
            if(full_size <= limit){
                cut_index = name.length;
            }else{
                limit -= encode(ellipsis_tail).length;
                start = 0;
                end = name.length;
                while(end > start){
                    guess = Math.ceil((start + end)/2);
                    guessValue = encode(name.slice(0, guess)).length;
                    if(guessValue > limit){
                        end = guess-1;
                        guess--;
                    }else if(guessValue < limit){
                        start = guess;
                    }else{
                        break;
                    }
                }
                cut_index = guess;
            }
            return name.slice(0, cut_index) + (cut_index<name.length ? ellipsis_tail : '') + ext;
        },

        // 后缀名处理
        fix_ext: function (s, ext) {
            if (shaque_ie) {
                if (shaque_ie6 && text.byte_len(s) > 2 * ie6_down_name_len) {
                    //s = text.smart_sub(s, ie6_down_name_len) + '..';
                    s = text.smart_sub(s, ie6_down_name_len - 2) + '..' + s.substring(s.length - 2);
                }
                if ('' == ext) {
                    ext = '.-';
                }
            }
            return s + ext;
        },
        // 判断appbox的控件是否支持传入cookie
        supported_cookie: function () {
            try {
                if (!constants.IS_APPBOX)
                // 非appbox这里返回true
                    return true;

                // 1.97以下版本的控件没有 GetVersion 方法，不支持传入cookie
                if (!external.GetVersion)
                    return false;

                // 新版本可以支持
                if (external.GetVersion() >= 5287)
                    return true;
            } catch (e) {
            }
            return false;
        },
        // 判断是否是同域
        is_same_domain: function (url) {
            // return new RegExp('^https?:\\/\\/(\\w+\\.)*' + document.domain.replace(/\./, '\\.') + '\\/.?').test(url);
            return url.indexOf(url_tpl_single) === 0;
        },
        // 请求下载地址时能否在cookie中带上验证信息
        can_use_cookie: function (url) {
            return this.supported_cookie() && this.is_same_domain(url);
        },

        /**
         * 预下载数据上报
         * @param files
         */
        pre_down_report: function(ret_code, files) {
            //下载行为 上报到41表     yuyanghe 2013-12-27
            var Download_info=function(){
                this.file_size;
                this.file_name;
                this.file_id;
                this.file_ext;
                this.is_package;
            }

            var download_info=new Download_info(),
                me = this;

            if (files.length == 1 && !files[0].is_dir()) {
                download_info.is_package=false;
                download_info.file_name = me.get_down_name(files[0].get_name());
                download_info.file_size = files[0].get_size();
                var idx = files[0].get_name().lastIndexOf('.');
                if (idx > 0) {
                    download_info.file_ext = files[0].get_name().substring(idx + 1);
                }
                download_info.file_id = files[0].get_id();
            } else {
                download_info.is_package=true;
                download_info.file_name = common_util.get_zip_name(files);
                $.each(files, function (i, f) {
                    download_info.file_size += f.get_size();
                });
                download_info.file_ext = 'zip';
            }

            download_info.ret_code = ret_code;
            stat_log.pre_download_stat_report_41(download_info);
        }
    };

    var $downloader_ct,
        $down_iframe;

    function create_$down_iframe() {
        $downloader_ct = $('<div data-id="downloader" style="display:none;"></div>').appendTo(document.body);
        $down_iframe = $('<iframe name="_download_iframe" src="' + constants.DOMAIN + '/set_domain.html"></iframe>').appendTo($downloader_ct);
    }

    // 提前加载iframe
    $(function () {
        create_$down_iframe();
    });

    downloader.supported_cookie = downloader_v2.supported_cookie = common_util.supported_cookie;
    if(common_util.supported_cookie()) {
        return downloader_v2;
    } else { //appbox 1.97及之前的老版本采用老的downloader
        return downloader;
    }

});/**
 * 缩略图url加载器，有别于Thumb_loader，这个只是向cgi请求图片的缩略图Url,不进行缩略图加载
 * @author hibincheng
 * @date 2014-06-28
 */
define.pack("./thumb_url_loader",["lib","common","$"],function(require, exports, module) {
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
//tmpl file list:
//downloader/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'download_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div id="_download_dialog" class="wy-pop-wrapper">\r\n\
    <div class="wy-mask"></div>\r\n\
\r\n\
    <!-- 下载客户端 -->\r\n\
    <div class="dw-app">\r\n\
        <!-- [ATTENTION!!] 关闭按钮 -->\r\n\
        <div id="close_dialog" class="close-wrapper">\r\n\
            <i class="icon-close"></i>\r\n\
        </div>\r\n\
        <!-- banner -->\r\n\
        <b class="banner"><i class="bgimg"></i></b>\r\n\
        <!-- text -->\r\n\
        <div class="txt-wrapper">\r\n\
            <p data-id="title" class="hl">');
_p(data.text);
__p.push('</p>\r\n\
            <p class="exp">请使用微云客户端传输</p>\r\n\
            <div class="btn-group">\r\n\
                <a id="download_client"  class="btn btn-active" href="javascript:void(0)" onclick="javascript:pvClickSend(\'weiyun.download.pc.package\');">立即下载</a>\r\n\
                <a id="open_client" class="btn" href="javascript:void(0)" onclick="javascript:pvClickSend(\'weiyun.launch.pc.download\');">打开客户端</a>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
</div>');

return __p.join("");
}
};
return tmpl;
});
