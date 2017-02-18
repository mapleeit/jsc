//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/search/search.r151015",["$","lib","common","main","disk","downloader"],function(require,exports,module){

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
//search/src/File_record.js
//search/src/Header.js
//search/src/Keyword_highlighter.js
//search/src/Loader.js
//search/src/Mgr.js
//search/src/Module.js
//search/src/Range_mgr.js
//search/src/Remover.js
//search/src/Searcher.js
//search/src/View.js
//search/src/search.js
//search/src/view.tmpl.html

//js file list:
//search/src/File_record.js
//search/src/Header.js
//search/src/Keyword_highlighter.js
//search/src/Loader.js
//search/src/Mgr.js
//search/src/Module.js
//search/src/Range_mgr.js
//search/src/Remover.js
//search/src/Searcher.js
//search/src/View.js
//search/src/search.js
/**
 * 将file_object与Record结合起来，以便复用接口。
 * @author cluezhang
 * @date 2013-8-14
 */
define.pack("./File_record",["$","lib","common"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),
        
        common = require('common'),
        File = common.get('./file.file_object');
    var Search_file = inherit(File, {
        constructor : function(cfg){
            this.ppid = '';
            this.in_album = cfg.in_album;
            Search_file.superclass.constructor.apply(this, arguments);
        },
        get_ppid : function(){
            return this.ppid;
        },
        // 是否是相册的文件
        is_in_album : function(){
            return this.in_album;
        }
    });
    var File_record = inherit(Record, {
        constructor : function(cfg, id){
            File_record.superclass.constructor.call(this, new Search_file(cfg), id);
        }
    });
    // 将File_object特有的方法添加到File_record中，并做兼容
    var file_record_prototype = File_record.prototype,
        file_prototype = Search_file.prototype, fn_name, fn,
        create_delegate = function(fn_name, fn){
            var is_setter = /^set_/.test(fn_name);
            return is_setter ? function(){
                    var ret = fn.apply(this.data, arguments);
                    this.notify_update(null);
                    return ret;
                } : function(){
                    return fn.apply(this.data, arguments);
                };
        };
    for(fn_name in file_prototype){
        if(/*file_prototype.hasOwnProperty(fn_name) && */!file_record_prototype.hasOwnProperty(fn_name)){
            fn = file_prototype[fn_name];
            file_record_prototype[fn_name] = typeof fn === 'function' ? create_delegate(fn_name, fn) : fn;
        }
    }
    return File_record;
});/**
 * 
 * @author cluezhang
 * @date 2013-9-16
 */
define.pack("./Header",["lib","./tmpl","$","main"],function(require, exports, module){
    var lib = require('lib'),
        tmpl = require('./tmpl'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),

        main_ui = require('main').get('./ui');

    var Header = inherit(Object, {
        searching : false,
        keyword : '',
        count : 0,
        constructor : function(cfg){
            $.extend(this, cfg);
            this.searcher.on('busy', this.update_state, this);
            this.searcher.on('idle', this.update_info, this);
            // 删除后数量有变化，要更新，此metachange是非标准事件，在Mgr中由外界帮它发的。
            // 未来再考虑标准化
            this.store.on('metachange', this.update_info, this);
        },
        update_info : function(keyword, store){
            this.set_state(this.searcher.busy || this.loader.is_requesting(), keyword || this.searcher.str, this.store.get_total_length());
        },
        update_state : function(keyword){
            this.set_state(this.searcher.busy ||this.loader.is_requesting(), keyword, this.count);
        },
        render : function($el){
            if(!this.rendered){
                this.$el = $('<div></div>').appendTo($el);
                this.rendered = true;
            }
            $el.show();
        },
        show : function(){
            this.$el.show();
        },
        hide : function(){
            this.$el.hide();
            main_ui.get_$bar2().hide();
        },
        set_state : function(searching, keyword, count){
            this.searching = searching;
            this.keyword = keyword;
            this.count = count;
            var $el = $(tmpl.header({
                searching : searching,
                keyword : keyword,
                count : count
            }));
            this.$el.replaceWith($el);
            this.$el = $el;
            main_ui.get_$bar2().show();
            main_ui.sync_size();
        }
    });
    return Header;
});/**
 * 
 * @author cluezhang
 * @date 2013-9-17
 */
define.pack("./Keyword_highlighter",["lib","./Range_mgr","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        RangeMgr = require('./Range_mgr'),
        $ = require('$');
    var emptyEncoder = function(v){ return v;};
    var escapeRe = function(s) {
        return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
    };
    var KeywordHighlighter = inherit(Object, {
        wrapBegin : "<span style='color:#FF0000'>",
        wrapEnd : "</span>",
        constructor : function(cfg){
            var me = this;
            $.extend(me, cfg);
            var matchers = [];
            $.each(this.keywords, function(index, keyword){
                matchers.push(new RegExp(escapeRe(keyword), "g"+(me.caseSensitive===true ? "" : "i")));
            });
            this.matchers = matchers;
        },
        highlight : function(content, encoderFn){
            content = "" + content; // 保证为字串
            var i, matcher, result, matchedStr,
                rangeMgr = new RangeMgr({
                    autoAdjacent : false
                }),
                matchers = this.matchers;
            // 遍历所有关键字匹配正则，逐一匹配
            for(i=0; i<matchers.length; i++){
                matcher = matchers[i];
                matcher.lastIndex = 0;
                // 每个关键字匹配上时，将它所处的范围添加到RangeMgr中，RangeMgr会自动进行合并
                // 这样的话"atesta"同时匹配"tes"(1~4)与"est"(2~5)时，会得到一个合并后的范围：1~5
                while( (result = matcher.exec(content)) !== null){
                    matchedStr = result[0];
                    if(matchedStr){
                        rangeMgr.addRange({
                            start : result.index,
                            end : result.index + matchedStr.length
                        });
                    }
                }
            }
            // 遍历完后，对高亮范围与外分别进行encode处理，再包装以高亮包装
            // 例如"atesta"高亮范围为1~5，则会处理为[encode("a"), "wrapBegin", encode("test"), "wrapEnd", encode("a")]
            var ranges = rangeMgr.getRanges(), range, start, end,
                outputs = [],
                cursor = 0; // 记录已经编码到哪里
            encoderFn = encoderFn || emptyEncoder;
            for(i=0; i<ranges.length; i++){
                range = ranges[i];
                start = range.start;
                end = range.end;
                // 编码高亮前的正文
                outputs.push( encoderFn( content.slice(cursor, start) ) );
                // 编码与包装高亮正文
                outputs.push(this.wrapBegin);
                outputs.push( encoderFn( content.slice(start, end) ) );
                outputs.push(this.wrapEnd);
                // 标记已编码到高亮结束处
                cursor = end;
            }
            // 收尾工作
            outputs.push( encoderFn( content.slice(cursor) ) );
            return outputs.join("");
        }
    });
    return KeywordHighlighter;
});/**
 * 
 * @author cluezhang
 * @date 2013-9-17
 */
define.pack("./Loader",["lib","./File_record","common","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        security = lib.get('./security'),
        
        Record = require('./File_record'),
        
        common = require('common'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        constants = common.get('./constants'),
        progress = common.get('./ui.progress'),

        store,
        
        $ = require('$');
    var load_finish = false;
    var requesting  = false;
    var dir_len = 32;
    
    // 原common/request模块格式固定了，不适用于这里简单的请求
    // 同时也比较难改造
    // 为了简化，这里不再做返回码判断，错误直接返回为空。

    var crontab = {

        start: function(keyword, offset, size, loaded_count) {
            if(this.loading) {
                return;
            }
            //progress.show('更多结果还在搜索中，请稍候！');
            this.keyword = keyword;
            this.offset = offset + loaded_count;
            this.size = size - loaded_count;

            this.load(this.keyword, this.offset, this.size);

            this.loading = true;
        },

        load: function(keyword, offset, size) {
            var me = this;
            requesting = true;
            var req = request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/user_library.fcg',
                cmd: 'Lib3LibSearch',
                pb_v2: true,
                cavil : true,
                body: {
                    key_word: keyword,
                    offset: offset,
                    count: size
                }
            });

            this.req = req;

            req.ok(function(msg, body, header, data){
                me.loading = false;
                var records = [], total_length = 0;
                load_finish = body.finish_flag;

                records = formatData(body);
                if(size > records.length && !load_finish) {
                    crontab.start(keyword, offset, size, records.length);
                } else {
                    requesting = false;
                    //process.hide();
                }
                // cgi目前有bug，如果有破损文件，会导致总数计算错误
                // 这里进行修正，如果未返回预期的大小就判断为已加载完
                if(records.length !== size){
                    total_length = offset + records.length;
                }else{
                    total_length = body.total_number;
                }
                if(store.get_total_length() == 0) {
                    store.load(records, total_length);
                } else {
                    store.add(records);
                }
                // 如果总数变了，更新。正常情况这个数不应该变
                if(total_length !== store.get_total_length()){
                    store.total_length = total_length;
                    store.trigger('metachange');
                } else if(load_finish) {//加载完成
                    store.trigger('metachange');
                }
            }).fail(function(){
                requesting = false;
                me.loading = false;
            });
        },

        stop: function() {
            this.loading = false;
            this.req && this.req.destroy();
        }
    };

    var formatData = function(data) {
        var records = [];
        //先列出文件夹，后列出文件
        if(data.DirItem_items) {
            $.each(data.DirItem_items, function (i, dir) {
                records.push(new Record({
                    id : dir.dir_key,
                    pid : dir.pdir_key,
                    name : dir.dir_name,
                    create_time : dir.dir_mtime,
                    modify_time: dir.dir_mtime,
                    is_dir : true
                }));
            });
        }

        if(data.FileItem_items) {
            $.each(data.FileItem_items, function (i, file) {
                records.push(new Record({
                    id: file.file_id,
                    pid: file.pdir_key,
                    name: file.filename,
                    create_time: file.file_ctime,
                    modify_time: file.file_mtime,
                    size: file.file_size,
                    in_album: file.source > 0,
                    cur_size: file.file_size, // 搜索是不会列出破损文件的
	                ext_info : file.ext_info,
                    file_sha: file.file_sha
                }));
            });
        }

        return records;
    }
    
    var Loader = inherit(Event, {

        set_store: function(st) {
            store = st;
        },

        reset: function() {
            crontab.stop();
            requesting = false;
        },

        load : function(keyword, offset, size){
            var me = this;
            offset = offset || 0;
            size = size || 100;

            crontab.stop();//关闭定时任务
            requesting = true;
            // 后台最大支持100条
            var req = request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/user_library.fcg',
                cmd: 'Lib3LibSearch',
                pb_v2: true,
                cavil : true,
                body: {
                    key_word: keyword,
                    offset: offset,
                    count: size
                }
            });
            
            var def = $.Deferred();
            
            def.abort = function(){
                if(def.state() === 'pending'){
                    // 提前reject，后面request fail里的reject会自动无视
                    def.reject('canceled');
//                    request.abort();
                    req.destroy();
                }
                crontab.stop();//关闭定时任务
            };
            req.ok(function(msg, body, header, data){
                requesting = false;
                var records = [], total_length = 0;
                load_finish = body.finish_flag;

                records = formatData(body);
                if(size > records.length && !load_finish) {
                    crontab.start(keyword, offset, size, records.length);
                }
                // cgi目前有bug，如果有破损文件，会导致总数计算错误
                // 这里进行修正，如果未返回预期的大小就判断为已加载完
                if(records.length !== size){
                    total_length = offset + records.length;
                }else{
                    total_length = body.total_number;
                }
                def.resolve(records, total_length);
            }).fail(function(){
                requesting = false;
                def.reject();
            });
            return def;
        },

        is_load_done: function() {
            return !!load_finish;
        },

        is_requesting: function() {
            return !!requesting;
        }
    });
    return Loader;
});/**
 * 各操作实现
 * @author cluezhang
 * @date 2013-9-22
 */
define.pack("./Mgr",["lib","common","main","disk","./Remover","$"],function(require, exports, module) {
	var lib = require('lib'),
		inherit = lib.get('./inherit'),
		Event = lib.get('./Event'),

		console = lib.get('./console'),
		text = lib.get('./text'),
		routers = lib.get('./routers'),
		security = lib.get('./security'),

		common = require('common'),
		constants = common.get('./constants'),
		user_log = common.get('./user_log'),
		urls = common.get('./urls'),
		request = common.get('./request'),
		query_user = common.get('./query_user'),

		progress = common.get('./ui.progress'),
		widgets = common.get('./ui.widgets'),
		mini_tip = common.get('./ui.mini_tip_v2'),
		preview_dispatcher = common.get('./util.preview_dispatcher'),
		offline_event = common.get('./global.global_event').namespace('offline_download'),

		main = require('main').get('./main'),

		disk = require('disk'),
		Remover = require('./Remover'),

		$ = require('$');
	var Mgr = inherit(Object, {
		constructor: function(cfg) {
			$.extend(this, cfg);

			this.view.on('action', this.process_action, this);
			this.view.on('recordclick', this.handle_record_click, this);
			this.view.on('afterrender', this.init_operators, this);
		},
		init_operators: function() {
			var me = this;
			require.async('downloader', function(downloader) {
				me.downloader = downloader.get('./downloader');
			});
			require.async('file_qrcode', function(file_qrcode) {
				me.file_qrcode = file_qrcode.get('./file_qrcode');
			});
		},
		// 直接点击记录
		handle_record_click: function(node, event) {
			// 如果可预览，预览之
			var me = this;
			// 文档预览
			// 如果是可预览的文档，则执行预览操作
			if(preview_dispatcher.is_preview_doc(node)) {
				preview_dispatcher.preview(node);
				user_log('ITEM_CLICK_DOC_PREVIEW');
				return;
			}

			// 如果是图片，则执行预览操作
			if(node.is_image()) {
				me.appbox_preview(node).fail(function() {
					me.preview_image(node);
				});
				user_log('ITEM_CLICK_IMAGE_PREVIEW');
				return;
			}

			// 视频预览，
			// 如果是视频，则跳到云播页面进行播放
			if(node.is_video()) {
				window.open('//www.weiyun.com/video_preview?' +
					'videoID=' + node.get_id() +
					'&dirKey=' + node.get_pid() +
					'&pdirKey=34cc7db8f338fdcb41c5dfa52b9ed888');

				user_log('ITEM_CLICK_VIDEO_PREVIEW');
				return;
			}

			// 压缩包预览
			if(node.is_compress_file() && !($.browser.msie && $.browser.version < 8)) {
				me.preview_zip_file(node);                   // @see ui_virtual.js
				user_log('ITEM_CLICK_ZIP_PREVIEW');
				return;
			}

			// 目录则打开
			if(node.is_dir()) {
				me.on_open_folder(node, event);
				return;
			}

			// 如果不能，下载之
			this.on_download(node, event);
			event.preventDefault();
		},
		// 分派动作
		process_action: function(action_name, data, event, extra) {
			var fn_name = 'on_' + action_name;
			if(typeof this[fn_name] === 'function') {
				this[fn_name](data, event, extra);
			}
			event.preventDefault();
			// 不再触发recordclick
			return false;
		},

		on_enter: function(node, event) {
			this.handle_record_click(node, event);
		},
		// 删除
		on_delete: function(node, event) {
			this.do_delete(node);
			console.log('on_delete');
		},
		do_delete: function(node, callback, scope) {
			var me = this;
			this.remover = this.remover || new Remover();
			this.remover.remove_confirm([node]).done(function() {
				me.store.remove(node);
				me.store.total_length--;
				me.store.trigger('metachange');
				if(callback) {
					callback.call(scope, true);
				}
			});
		},
		// 下载
		on_download: function(node, event) {
			// 其他文件，下载
			var me = this;
			if(me.downloader) {
				me.downloader.down(node, event);
			}
			user_log('ITEM_CLICK_DOWNLOAD');
			console.log('on_download');
		},
		// 对于种子文件，点击"打开"，可以跳转离线下载
		on_offline_download: function(node, event, extra) {
			offline_event.trigger('menu_selected_offline_download', node);
		},
		//文件二维码
		on_qrcode: function(node, event, extra) {
			var me = this;
			var from_menu = extra.src === 'contextmenu';
			if(me.file_qrcode) {
				me.file_qrcode.show([node]);
			}

			if(from_menu) {
				user_log('FILE_QRCODE_SEARCH_RIGHT');
			} else {
				user_log('FILE_QRCODE_SEARCH_ITEM');
			}

		},
		// 分享
		on_share: function(record, event, extra) {
			require.async('share_enter', function(mod) {
				var share_enter = mod.get('./share_enter');
				share_enter.start_share(record);
				user_log('RIGHTKEY_MENU_SHARE');
			});
		},
		// 打开所属的目录
		//
		on_open_folder: function(node, event) {
			// 如果是相册，跳转并刷新
			if(node.is_in_album()) {
				main.async_render_module('photo', {reload: true});
				routers.replace({
					m: 'photo'
				}, true);
			} else {
				return this.do_open_folder(node, event);
			}
		},
		do_open_folder: function(node, event) {
			// 异步查询
			progress.show('正在打开');
			var dir_key = node.is_dir() ? node.get_id() : node.get_pid();
			request.xhr_get({
				url: 'http://web2.cgi.weiyun.com/user_library.fcg',
				cmd: 'LibDirPathGet',
				cavil: true,
				pb_v2: true,
				body: {
					dir_key: dir_key
				}
			}).ok(function(msg, body) {
				var path = [];
				if(body.items) {
					$.each(body.items, function(index, o) {
						path.push({
							name: o.dir_name,
							id: o.dir_key
						});
					});
				}
				path.shift();  // cgi返回的目录含微云根目录，不需要
				path.push([node.get_id()]); // 目标文件(夹)要高亮显示

				main.async_render_module('disk', {
					path: path
				});
				routers.replace({
					m: 'disk'
				}, true);
			})
				.fail(function(msg, ret) {
					mini_tip.error(msg);
				})
				.done(function() {
					progress.hide();
				});
		},
		/**
		 * 尝试使用 appbox 的全屏预览功能
		 * @param {FileNode} node
		 * @returns {jQuery.Deferred}
		 * @private
		 */
		appbox_preview: function(node) {
			var ex = window.external,
				def = $.Deferred(),
			// 判断 appbox 是否支持全屏预览
				support = constants.IS_APPBOX && (
					(ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
					(ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
					);

			if(support) {
				require.async('full_screen_preview', function(mod) {
					try {
						var full_screen_preview = mod.get('./full_screen_preview');
						full_screen_preview.preview(node);
						def.resolve();
					} catch(e) {
						console.warn('全屏预览失败，则使用普通预览, file_name=' + node.get_name());
						def.reject();
					}
				});
			} else {
				def.reject();
			}
			return def;
		},

		/**
		 * 压缩包预览
		 * @param {FileObject} file
		 * @private
		 */
		preview_zip_file: function(file) {
			require.async('ftn_preview', function(mod) {
				var ftn_preview = mod.get('./ftn_preview');
				ftn_preview.compress_preview(file);
			});
			//require.async('compress_file_iframe', function (mod) {
			//    var compress_file_iframe = mod.get('./compress_file_iframe'),
			//        iframe = compress_file_iframe.create_preview({
			//            file: file,
			//            max_width: constants.IS_APPBOX ? 670 : 915
			//        });
			//
			//    iframe.set_title(file.get_name());
			//    iframe.show();
			//});
		},

		/**
		 * 图片预览（重写 FileListUIModule 的默认实现）
		 * @overwrite
		 * @param {FileObject} file
		 * @private
		 */
		preview_image: function(file) {
			var me = this;

			require.async(['image_preview', 'downloader'], function(image_preview_mod, downloader_mod) {
				var image_preview = image_preview_mod.get('./image_preview'),
					downloader = downloader_mod.get('./downloader');
				// 当前目录下的图片
				var images = [];
				var read_images = function() {
					me.store.each(function(record) {
						if(record.is_image()) {
							images.push(record);
						}
					});
				};
				read_images();


				// 当前图片所在的索引位置
				var index = $.inArray(file, images);

				var options = {
					complete: me.store.is_complete(),
					total: images.length,
					index: index,
					images: images,
					load_more: function(callback) {
						// 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
						if(!me.store.is_complete()) { // 未加载，尝试加载之
							me.store.load_more().done(function() {
								images.splice(0, images.length);
								read_images();
								callback({
									'total': images.length,
									'complete': me.store.is_complete()
								});
							}).fail(function() {
								callback({ 'fail': true });
							});
						}
						//加载完了
						else {
							callback({
								'total': images.length,
								'complete': me.store.is_complete()
							});
						}
					},
					download: function(index, e) {
						var file = images[index];
						downloader.down(file, e);
					},
					/*remove: function (index, callback) {
					 var file = images[index];
					 me.do_delete(file, function(success){
					 if(success){
					 images.splice(index, 1);
					 }
					 callback();
					 });
					 },
					 code: function(index){
					 if(me.file_qrcode){
					 var file = images[index];
					 if(file){
					 me.file_qrcode.show([file]);
					 }
					 }
					 },*/
					share: function(index) {
						var file = images[index];
						if(file) {
							require.async('share_enter', function(mod) {
								var share_enter = mod.get('./share_enter');
								share_enter.start_share(file);
								user_log('RIGHTKEY_MENU_SHARE');
							});
						}
					}
				};
				image_preview.start(options);
			});
		}
	});
	return Mgr;
});/**
 * 库分类模块类，这里用于兼容原有的common/module与现有的代码
 * @author cluezhang
 * @date 2013-8-12
 */
define.pack("./Module",["lib","common","$","main"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        common = require('common'),
        OldModule = common.get('./module'),
        global_event = common.get('./global.global_event'),
        
        $ = require('$');
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module : true,
        render : $.noop,
        activate : $.noop,
        deactivate : $.noop
    };
    
    var Module = inherit(Event, {
        active : false,
        constructor : function(cfg){
            $.extend(this, cfg);
            var store = new Store();
        },
        get_list_view : function(){
            var view = this.list_view;
            if(!view.rendered){
                view.render(this.$body_ct);
            }
            return view;
        },
        get_list_header: function() {
            var header = this.list_header;
            if(!header.rendered){
                header.render(this.$bar1);
            }
            return header;
        },
        activate : function(){
            if(!this.active){
                this.active = true;
                this.on_activate();
                this.trigger('activate');
            }
        },
        on_activate : function(){
            this.get_list_header().show(); // 使用css控制 - james
            this.get_list_view().show();
        },
        deactivate : function(){
            if(this.active){
                this.active = false;
                this.on_deactivate();
                this.trigger('deactivate');
            }
        },
        on_deactivate : function(){
            this.get_list_view().hide();
            this.get_list_header().hide();// 使用css控制 - james
        },
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function($header, $body){
//                        me.$header_ct = $header;
//                        me.$body_ct = $body;
                        var main_ui = require('main').get('./ui');
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$bar1 = main_ui.get_$bar2();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate : function(){
                        me.activate();
                    },
                    deactivate : function(){
                        me.deactivate();
                    },
                    get_ext_module : function(){
                        return me;
                    }
                });
            }
            return module;
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-9-17
 */
define.pack("./Range_mgr",["lib","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    /**
     * RangeMgr用于管理范围，基于整数，例如：
     * 创建一个RangeMgr实例，依次添加[1,3], [5,10], [11,12], [15,18], [17,19]
     * 最后getRanges，会返回[1,3], [5,12], [15,19]
     */
    var RangeMgr = inherit(Object, {
        /**
         * @param {Boolean} autoAdjacent 是否自动连接相临的自然数范围，比如[1,4]与[5,8]就是相连，会连接成[1,8]。默认为true
         */
        autoAdjacent : true,
        constructor : function(cfg){
            $.extend(this, cfg);
            this._ranges = [];
        },
        /**
         * 添加范围
         * @param {Object} range 有start与end属性，start必须小于等于end
         */
        addRange : function(affectRange){
            var ranges = this._ranges || [], i, range, autoAdjacent = this.autoAdjacent;
            // 逐个进行判断
            var merged = false, tmp, pos = null;
            for(i=0; i<ranges.length; i++){
                range = ranges[i];
                if(this._isRangeConflict(range, affectRange) || autoAdjacent && this._isRangeAdjacent(range, affectRange)){
                    if(merged){ // 已经合并过，再次合并，并移除此记录
                        tmp = this._mergeRange(range, affectRange);
                        affectRange.start = tmp.start;
                        affectRange.end = tmp.end;
                        ranges.splice(i, 1);
                        i--;
                    }else{ // 没合并过，先合并
                        affectRange = ranges[i] = this._mergeRange(range, affectRange);
                        merged = true;
                    }
                }else if(merged){ // 已经合并过，又无冲突，表明已合并完毕
                    break;
                }else if(affectRange.end < range.start){ // 如果小于当前对比值，则放在它前，形成范围由小至大的顺序
                    pos = i;
                }
            }
            if(!merged){
                // 当没有指定位置，表示没有找到比它小的范围，即新加的范围为最大
                if(pos === null){
                    ranges.push(affectRange);
                }else{
                    ranges.splice(pos, 0, affectRange);
                }
            }
        },
        /**
         * 获取所有的范围，从小到大
         * @return {Array} ranges
         */
        getRanges : function(){
            return this._ranges || [];
        },
        /**
         * 判断是否与当前的范围集有冲突
         * @return {Boolean} conflict
         */
        isConflict : function(range){
            var i, ranges = this._ranges;
            for(i=0; i<ranges.length; i++){
                if(this._isRangeConflict(range, ranges[i])){
                    return true;
                }
            }
            return false;
        },
        /**
         * 清空范围集
         */
        clear : function(){
            this._ranges = [];
        },
        // private
        // 判断两个范围是否有交集
        _isRangeConflict : function(range1, range2){
            return !(
                range1.start<range2.start && range1.end<range2.start || 
                range1.start>range2.end && range1.end>range2.end
            );
            // !(start1<start2 && end1<start2) && !(start1>end2 && end2>end2)
            // (start1>=start2 || end1>=start2) && (start1<=end2 || end2<=end2)
        },
        // private
        // 判断两个范围是否连接
        _isRangeAdjacent : function(range1, range2){
            return range1.start-range2.end === 1 || range1.start-range2.end === -1 ||
                range1.end-range2.start === 1 || range1.end-range2.start === -1;
        },
        // private
        // 此方法并不进行是否可合并判断，需注意使用
        _mergeRange : function(range1, range2){
            var start, end;
            // 取最小
            start = range1.start < range2.start ? range1.start : range2.start;
            // 取最大
            end = range1.end > range2.end ? range1.end : range2.end;
            return {
                start : start,
                end : end
            };
        }
    });
    return RangeMgr;
});/**
 * 通用删除操作类
 */
define.pack("./Remover",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),

        ret_msgs = common.get('./ret_msgs'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),

        undefined;

    var Remover = inherit(Event, {

        /**
         * 先弹框提示，确认后再删除
         * @param {Array<FileNode>} files
         * @returns {*}
         */
        remove_confirm: function(files) {
            var me = this,
                def = $.Deferred();

            files = [].concat(files);
            widgets.confirm(
                '删除文件',
                    files.length>1 ? '确定要删除这些文件吗？' : files[0].is_dir() ? '确定要删除这个文件夹吗？' : '确定要删除这个文件吗？',
                '已删除的文件可以在回收站找到',
                function () {
                    progress.show("正在删除0/"+files.length);
                    me
                        .do_remove(files)
                        .progress(function(success_files){
                            progress.show("正在删除" + success_files.length+"/"+files.length);
                        }).done(function(success_files, failure_files){
                            if(!success_files.length && failure_files.length) {//全部不成功
                                mini_tip.warn('文件删除失败');
                            }if(failure_files.length){
                                mini_tip.warn('部分文件删除失败:' + this.get_part_fail_msg());
                            }else{
                                mini_tip.ok('删除文件成功');
                            }
                            def.resolve(success_files, failure_files);
                        }).fail(function(msg){
                            if(msg !== me.canceled){
                                mini_tip.error(msg);
                            }
                        }).always(function(){
                            progress.hide();
                        });
                },
                $.noop,
                null,
                true
            );

            return def;
        },

        /**
         * 正式开始删除
         * @param files
         * @returns {*}
         */
        do_remove: function(files) {
            this.init_remove(files);
            var def = $.Deferred();
            this.step_remove(def);
            return def;
        },

        /**
         * 删除前的初始化工作
         * @param files
         */
        init_remove: function(files) {
            var cur_user = query_user.get_cached_user();
            this.step = cur_user && cur_user.get_files_remove_step_size() || 10;
            this.ok_rets = [0, 1019, 1020, 1026];
            this.total_files = files;
            this.succ_list = [];
            this.fail_list = [];
            this.serialize_files(files);
        },

        serialize_files: function(total_files) {
            var files_map = {};

            $.each(total_files, function(i, file) {
                var pid = file.get_pid();
                files_map[pid] = files_map[pid] || [];
                files_map[pid].push(file);
            });

            this.files_map = files_map;
        },
        /**
         * 每次批量删除时的参数，每次删除只能对同目录下的文件进行操作
         * @returns {{ppdir_key: *, pdir_key: *, dir_list: *, file_list: *}}
         */
        get_step_data: function() {
            var step_dirs = [],
                step_files = [],
                step_dir_list,
                step_file_list,
                pdir_key,
                ppdir_key;

            var step = this.step;
            for(var o in this.files_map) {
                var file_group = this.files_map[o],
                    tmp_file;
                pdir_key = file_group[0].get_pid();
                ppdir_key = file_group[0].get_parent && file_group[0].get_parent() && file_group[0].get_parent().get_pid() || '';
                while(step--) {
                    tmp_file = file_group.pop();
                    if(tmp_file.is_dir()) {
                        step_dirs.push(tmp_file);
                    } else {
                        step_files.push(tmp_file);
                    }
                    if(!file_group.length) {
                        delete this.files_map[o];
                        break;
                    }
                }
                break;
            }

            if(step_dirs.length) {
                step_dir_list = $.map(step_dirs, function (file) {
                    return {
                        ppdir_key: ppdir_key,
                        pdir_key: pdir_key,
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
                        ppdir_key: ppdir_key,
                        pdir_key: pdir_key,
                        file_id: file.get_id(),
                        filename: file.get_name()
                    };
                });
            }

            this.step_dirs = step_dirs;
            this.step_files = step_files;

            return {
                dir_list: step_dir_list,
                file_list: step_file_list
            };
        },

        /**
         * 批量删除操作
         * @param def
         */
        step_remove: function(def) {
            var data = this.get_step_data(),
                me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_delete.fcg',
                cmd: 'DiskDirFileBatchDeleteEx',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                var succ_list = [],
                    fail_list = [];

                if(body.dir_list && body.dir_list.length) {
                    $.each(body.dir_list, function(i, dir) {
                        var true_dir = me.step_dirs[i];
                        if(me.is_remove_ok(dir)) {
                            succ_list.push(true_dir);
                        } else {
                            me.set_one_fail_result(dir);
                            fail_list.push(true_dir);
                        }
                    });
                }
                if(body.file_list && body.file_list.length) {
                    $.each(body.file_list, function(i, file) {
                        var true_file = me.step_files[i];
                        if(me.is_remove_ok(file)) {
                            succ_list.push(true_file);
                        } else {
                            me.set_one_fail_result(file);
                            fail_list.push(true_file);
                        }
                    });
                }
                me.save_has_remove(succ_list, fail_list);
                def.notify(me.succ_list, me.fail_list);

            }).fail(function(msg, ret) {
                def.reject(msg, ret);
            }).done(function() {
                if(me.is_remove_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.destroy();
                } else {
                    me.step_remove(def);
                }
            });
        },

        is_remove_ok: function(file_result) {
            return file_result.retcode in this.ok_rets;
        },

        is_remove_all: function() {
            return $.isEmptyObject(this.files_map);
        },

        save_has_remove: function(succ_list, fail_list) {
            this.succ_list = succ_list.concat(this.succ_list);
            this.fail_list = fail_list.concat(this.fail_list);
        },

        set_one_fail_result: function(result) {
            if(this.one_fail_result) {
                return;
            }
            this.one_fail_result = result;
        },
        /**
         * 删除时有部分失败时的错误提示
         * @returns {string|*|string}
         */
        get_part_fail_msg: function() {
            return this.one_fail_result.retmsg || ret_msgs.get(this.one_fail_result.retcode) || '未知错误';
        },

        destroy: function() {
            delete this.total_files;
            delete this.step_dirs;
            delete this.step_files;
            delete this.succ_list;
            delete this.fail_list;
            delete this.files_map;
        }

    });

    return Remover;
});/**
 * 搜索对外接口对象
 * @author cluezhang
 * @date 2013-9-11
 */
define.pack("./Searcher",["lib","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        $ = require('$');
    
    var Searcher = inherit(Event, {
        busy : false,
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * @event busy 当前是否正在进行搜索
         */
        /**
         * @event idle 当前是否空闲
         */
        /**
         * 改变状态，同时发出事件
         * @private
         */
        alter_state : function(busy, str){
            busy = !!busy;
            // 当关键字发生变化时，同样发出事件
            if(busy !== this.busy || str !== this.str){
                this.busy = busy;
                this.str = str;
                this.trigger(busy ? 'busy' : 'idle', str);
            }
        },
        /**
         * 执行搜索，如果重复调用，自动取消上一次的未完成搜索
         * @param {String} str 要搜索的字符串，如果字符串为空表示取消搜索
         */
        search : function(str){
            if(!str){
                this.cancel();
                return;
            }
            if(this.busy){
                this.do_cancel();
            }
            this.alter_state(true, str);
            var def = this.do_search(str), me = this;
            def.always(function(state){
                if(def.state()!=='rejected' || state !== 'canceled'){
                    me.alter_state(false, str);
                }
            });
        },
        /**
         * 取消搜索，进入完成状态
         */
        cancel : function(){
            if(this.busy){
                this.do_cancel();
                this.alter_state(false);
            }
        },
        /**
         * 执行搜索，to be override
         * @private
         */
        do_search : $.noop,
        /**
         * 取消当前的搜索
         * @private
         */
        do_cancel : $.noop
    });
    return Searcher;
});/**
 * 列表视图
 * @author cluezhang
 * @date 2013-9-11
 */
define.pack("./View",["lib","common","./tmpl","./Keyword_highlighter","disk","downloader","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        text = lib.get('./text'),
        
        common = require('common'),
        blank_tip = common.get('./ui.blank_tip'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
	    urls = common.get('./urls'),
	    query_user = common.get('./query_user'),
        
        tmpl = require('./tmpl'),
        Highlighter = require('./Keyword_highlighter'),
	    file_list = require('disk').get('./file_list.file_list'),
        
        // 缩略图一定会用到，所以这里引用之
        downloader = require('downloader'),

        is_load_done = false,    //是否搜索结束，来判断是否展示空页面
        
        $ = require('$'),
        
        Buffer_view = lib.get('./data.Buffer_view');
    var View = inherit(Buffer_view, {
        enable_empty_ui : true,
        /**
         * @cfg {Object} shortcuts (optional) 属性快捷更新映射，例如selected属性映射到一个快速切换selected样式的函数上
         */
        shortcuts : {
            menu_active : function(value){
                $(this).toggleClass('list-menu-on', value);
            },
            menu_hover : function(value){
                $(this).toggleClass('list-menu-on', value);
            }
        },
        empty_tpl : function(){
            return '<div tabindex="0" hidefocus="on">没有可显示的数据</div>';
        },
        list_tpl : function(){
            return tmpl.list();
        },
        tpl : function(record){
            return this.get_html([record]);
        },
        /**
         * 设置高亮关键字
         * @param {String} keyword
         */
        set_keyword : function(keyword){
            this.keyword = keyword;
            var highlighter = new Highlighter({
                keywords : [keyword],
                caseSensitive : false, // 后台是否区分大小写
                wrapBegin : '<span class="include-searched-word">',
                wrapEnd : "</span>"
            });
            this.highlight = function(str){
                return highlighter.highlight(str, text.text);
            };
        },
        get_keyword : function(){
            return this.keyword;
        },
        get_html : function(records){
            var me = this;
            return tmpl.items({
                records : records,
                highlight : this.highlight
            });
        },
        list_selector : 'ul[data-id=_search_view_list]',
        item_selector : 'li[data-list]',
        constructor : function(){
            View.superclass.constructor.apply(this, arguments);
            // 空的高亮函数
            this.highlight = function(str){
                return str;
            };
        },
        after_render : function(){
            View.superclass.after_render.apply(this, arguments);
            this.on('recordcontextmenu', this.show_context_menu, this);
            
            // IE6 hover hack
            this._render_ie6_fix();
        },
        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.$list.on('mouseenter', me.item_selector, function () {
                        $(this).addClass(hover_class);
                    }).on('mouseleave', '>div', function () {
                        $(this).removeClass(hover_class);
                    });
            }
        },
        on_clear: function() {
            View.superclass.on_clear.apply(this, arguments);
            this.thumb_loader && this.thumb_loader.destroy();
            this.thumb_loader = null;
        },
        // 以下是列表中涉及到内容变更的地方，进行自适应高度调节
        on_add : function(){
            View.superclass.on_add.apply(this, arguments);
            this.update_thumb();
        },
        on_remove : function(){
            View.superclass.on_remove.apply(this, arguments);
        },
        refresh : function(){
            View.superclass.refresh.apply(this, arguments);
            this.update_thumb();
        },
        set_load_load: function(flag) {
            is_load_done = flag;
        },
        update_thumb: function() {
            if(!this.rendered){
                return;
            }
            var me = this;

            this.get_thumb_loader().done(function(thumb_loader) {
                var thumb_state_attr = 'data-thumb-hooked';
                var $items = me.$list.find(me.item_selector + ' [data-thumb]');
                $items.each(function(){
                    var $item = $(this), record;
                    var thumb_state = $item.data(thumb_state_attr);
                    if(!thumb_state){ // 没有进行处理
                        $item.data(thumb_state_attr, true);
                        record = me.get_record($item);
                        thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                            var $img = $(img), $replace_img;
                            if(!$img.data('used')){
                                $img.data('used', true);
                                $replace_img = $img;
                            }else{
                                $replace_img = $('<img />').attr('src', url);
                            }
                            $replace_img.attr({
                                'unselectable': 'on',
                                'tabindex': '-1'
                            });
                            $replace_img.addClass('icon icon-m icon-pic-m');
                            $item.replaceWith($replace_img);
                        });
                    }
                });
            });
        },

        get_thumb_loader: function() {
            var def = $.Deferred(),
                me = this;

            if(!me.thumb_loader) {
                require.async('downloader', function(mod) {
                    var Thumb_loader = mod.get('./Thumb_loader');
                    me.thumb_loader = new Thumb_loader({
                        width: 32,
                        height: 32
                    });
                    def.resolve(me.thumb_loader);
                });
            } else {
                def.resolve(me.thumb_loader);
            }

            return def;
        },
        /**
         * 自适应列表高度，当内容不够时撑开到屏幕大小，超出时自动扩张
         */
        /*adjust_height : function(){
            if(!this.rendered){
                return;
            }
            // 当为空白时，目标是空白节点
            var $el = this.empty_ui_visible ? this.$empty_ui : this.$list;
            // 计算屏幕可显示高度
            var container_height = $(window).height() - $el.offset().top - 12; // 12为与底部保持安全距离
            // 计算内容高度
            $el.height('auto'); // 计算前先重置高度
            var scroll_height = $el[0].scrollHeight;
            // 如果内容高度不够，帮它撑着。否则自动展开
            if(scroll_height < container_height){
                $el.height(container_height);
            }else{
                $el.height('auto');
            }
        },*/
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            if(is_load_done) {
                this.$searching_ui && this.$searching_ui.remove();
                this.$empty_ui = blank_tip.show({
                    id: 'j-search-empty',
                    to: this.$el,
                    icon_class: 'icon-nosearch',
                    title: '',
                    content: '抱歉，未找到匹配文件'
                });
                this.set_load_load(false);
            } else {
                this.$searching_ui = $(tmpl.searching()).appendTo(this.$el);
            }
            this.$list.hide();
        },
        /**
         * 隐藏空白界面
         * @protected
         */
        hide_empty_ui : function(){
            this.$searching_ui && this.$searching_ui.remove();
            this.$empty_ui && this.$empty_ui.remove();
            this.$list.show();
        },
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_context_menu : function(record, e){
            e.preventDefault();
            user_log('SEARCH_LIST_CONTEXT_MENU');
            this.context_record = record;

            var visible_menu = {
                download : 1,
                'delete' : 1,
                share : 1,
                open_folder : 1,
                qrcode:1
            };


	        //灰度用的变量
	        var query = urls.parse_params(),
		        cur_uin = query_user.get_uin_num();
	        //if((query.offline || parseInt(cur_uin) % 10 < 5) && record.is_torrent_file()) {
	        if(record.is_torrent_file()) {
		        visible_menu.offline_download = 1;
	        }
//            // 文件夹无法邮件分享
//            if(record.is_dir()){
//                delete visible_menu['mail_share'];
//            }

            var menu = this.get_context_menu();
            menu.show(e.pageX, e.pageY, visible_menu);
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                me ,
                handler;

            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_record, e, {src:'contextmenu'});
                };
                menu = this.context_menu = new ContextMenu({
//                    width : 160,
                    items: [
                        {
                            id: 'download',
                            text: '下载',
                            icon_class: 'ico-null',
                            click: handler
                        },
	                    {
		                    id: 'offline_download',
		                    text: '打开',
		                    icon_class: 'ico-null',
		                    click: handler
	                    },
                        {
                            id: 'delete',
                            text: '删除',
                            icon_class: 'ico-null',
                            click: handler
                        },
                        {
                            id: 'open_folder',
                            text: '打开文件所在目录',
                            icon_class: 'ico-null',
                            click: handler
                        },
                        {
                            id: 'qrcode',
                            text: '获取二维码',
                            icon_class: 'ico-dimensional-menu',
                            split: true,
                            click: handler
                        },
                        {
                            id: 'share',
                            text: '分享',
                            icon_class: 'ico-share',
                            split: true,
                            click: handler
                        }
                    ]
                });
                // 两个菜单互斥
                menu.on('show', function(){
                    me.$list.addClass('block-hover');
                });
                menu.on('hide', function(){
                    me.$list.removeClass('block-hover');
                });
            }
            return menu;
        }
    });
    return View;
});/**
 * 搜索Module
 * @author cluezhang
 * @date 2013-9-12
 */
define.pack("./search",["lib","$","main","common","./Searcher","./View","./Loader","./Header","./Mgr","./Module"],function(require, exports, module){
    var lib = require('lib'),
        $ = require('$'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        
        Store = lib.get('./data.Store'),
//        Record = lib.get('./data.Record'),
        routers = lib.get('./routers'),

        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        
        common = require('common'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        search_event = global_event.namespace('search'),
        scroller = common.get('./ui.scroller'),
        
        Searcher = require('./Searcher'),
        View = require('./View'),
        Loader = require('./Loader'),
        Header = require('./Header'),
        Mgr = require('./Mgr'),
        Module = require('./Module');
        
    // 正在进行的请求
    var requesting;
    var cancel_requesting = function(){
        if(requesting){
            requesting.abort();
            requesting = null;
        }
    };
    var store = new Store({
        /**
         * 将store清空，并置为未搜索状态（以免首屏显示无结果UI）
         */
        reset : function(){
            this.loaded = false;
            this.clear();
        },
        load_more : function(){
            var me = this;
            cancel_requesting();
            return requesting = loader.load(view.get_keyword(), store.size()).done(function(records, total_length){
                view.set_load_load(loader.is_load_done());
                store.add(records);
                // 如果总数变了，更新。正常情况这个数不应该变
                if(total_length !== store.get_total_length()){
                    store.total_length = total_length;
                    store.trigger('metachange');
                }
            }).fail(function(state){
                if(state !== 'canceled'){
                    // 什么也不干
                }
            }).always(function(state){
                requesting = null;
            });
        },
        /**
         * 是否加载完成
         * @return {Boolean} complete
         */
        is_complete : function(){
            return loader.is_load_done();
        }
    });
    var view_size, initial_view_size;
    var get_view_size = function(){
        return Math.ceil($(window).height() / 50);  // 目前一条记录有50px高
    };
    var get_init_size = function(view_size){
        return Math.round(view_size * 2.5);
    };
    view_size = get_view_size();
    initial_view_size = get_init_size(view_size);
    
    var view = new View({
        store : store,
        visible_count : initial_view_size,
        /**
         * 重置界面
         */
        reset : function(){
            this.set_visible_count(initial_view_size);
        },
        /**
         * 扩展显示的记录数
         */
        expand : function(){
            this.set_visible_count(this.visible_count + view_size);
        },
        /**
         * 当刷新时，重置滚动条，重置显示条
         */
        refresh : function(){
            this.reset();
            scroller.go(0, 0);
            View.prototype.refresh.apply(this, arguments);
        }
    });
    var loader = new Loader();
    loader.set_store(store);
    var mgr = new Mgr({
        store : store,
        view : view
    });
    return new Module({
        name : 'search',
        list_view : view,
        get_list_header : function(){
            if(!this.list_header){
                this.list_header = new Header({
                    searcher : this.get_searcher(),
                    store : store,
                    loader: loader
                });
            }
            return Module.prototype.get_list_header.apply(this, arguments);
        },
        on_activate : function(){
            Module.prototype.on_activate.apply(this, arguments);
            if(!this.last_mod){ // 表示不是由搜索触发的，可能是hash trigger，此时要复原
                routers.replace({
                    m : 'disk'
                });
            }

            this.listenTo(main_ui.get_scroller(), 'resize scroll', this.expand_view);
            // global_event.on('window_scroll window_resize', this.expand_view, this);
//            global_event.on('window_resize', view.adjust_height, view);
//            view.adjust_height();
        },
        on_deactivate : function(){
            this.stopListening(main_ui.get_scroller(), 'resize scroll');
//            global_event.off('window_scroll window_resize', this.expand_view, this);
//            global_event.off('window_resize', view.adjust_height, view);
            Module.prototype.on_deactivate.apply(this, arguments);
            this.get_searcher().cancel();
            store.reset();
            view.reset();
            loader.reset();
        },
        expand_view : function(){
            // 如果没有到底部，什么也不干
            if(!main_ui.get_scroller().is_reach_bottom()){
                return;
            }
            var me = this;
            // 如果是resize，要更新界面可显示条数
            view_size = get_view_size();
            initial_view_size = get_init_size(view_size);
            // 如果显示区域小于等于目前加载的记录数，扩展之
            var loaded_size = store.size();
            var cur_view_size = view.get_visible_count();
            if(cur_view_size <= loaded_size){
                view.expand();
                // 如果扩展后，发现store没有加载完，并处于空闲状态，加载之
                if(!requesting && !store.is_complete()){
                    store.load_more();
                }
            }
        },
        get_searcher : function(){
            var me = this;
            return me.searcher || (me.searcher = new Searcher({
                do_search : function(str){
                    // 搜索时，切换到搜索模块
	                search_event.trigger('before_search_begin');
                    if(!me.active){
                        me.last_mod = main.get_cur_mod_alias();
                        main.async_render_module('search');
                        routers.replace({
                            m : 'search'
                        }, true);
                        search_event.trigger('search_begin');
                    }
                    cancel_requesting();
                    requesting = loader.load(str).done(function(records, total_length){
                        // 加载完成后，更新视图，填充数据
                        view.set_load_load(loader.is_load_done());
                        view.set_keyword(str);
                        store.load(records, total_length);
                    }).fail(function(state){
                        // 人工取消时什么都不变
                        if(state !== 'canceled'){
                            // 其它错误当作空显示
                            store.load([]);
                        }
                    }).always(function(state){
                        requesting = null;
                    });
                    return requesting;
                },
                cancel : function(){
                    Searcher.prototype.cancel.apply(this, arguments);
                    var mod;
                    // 取消时，如果当前是搜索模块，返回前一个模块
                    if(me.active){
                        mod = me.last_mod || 'disk';
                        main.async_render_module(mod);
                        routers.replace({
                            m : mod
                        }, true);
                    }
                },
                do_cancel : function(){
                    // 中断正在进行的请求
                    cancel_requesting();
                }
            }));
        }
    }).get_common_module();
});
//tmpl file list:
//search/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var text = require('lib').get('./text');
    __p.push('    <div class="act-panel-inner cleafix" tabindex="0">\r\n\
        <p class="tit">');
_p( (data.searching && data.count==0)? '' : (data.count ? ('共'+data.count+'个结果') : '无结果') );
__p.push('</p>\r\n\
    </div>');

return __p.join("");
},

'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_search_body" class="mod-list-group mod-list-group-search" data-label-for-aria="搜索结果内容区域">\r\n\
        <div class="list-group-bd">\r\n\
            <ul data-id="_search_view_list" class="list-group files">\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var records = data.records,
            highlight = data.highlight,
            time_str_len = 'yyyy-MM-dd hh:mm'.length,
            downloader = require('downloader').get('./downloader'),
            common = require('common'),
            click_tj = common.get('./configs.click_tj'),
            constants = common.get('./constants'),
            lib = require('lib'),
            text = lib.get('./text'),
            default_image = constants.RESOURCE_BASE + '/img/img-32.png',
            i;
    __p.push('    ');
 
    $.each(records, function(index, file){
        var is_dir = file.is_dir(),
            is_broken = file.is_broken_file(),
            is_image = file.is_image(),
            is_removable = file.is_removable(),
            is_movable = file.is_movable(),
            is_downable = file.is_downable(),
            is_whole_click = true,
            create_time = (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len),
            name = file.get_name(),

            icon_cls = 'icon-' + (file.get_type() ? file.get_type() : 'nor');
    __p.push('        <li data-list="');
_p(is_dir ? 'dir' : 'file');
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('" class="list-group-item" ');
_p(click_tj.make_tj_str('SEARCH_LIST_CLICK'));
__p.push('>\r\n\
            <div class="item-tit">');
 if(is_image) { __p.push('                <div data-action="enter" class="thumb"><i data-thumb class="icon icon-m icon-pic-m"></i></div>');
 } else { __p.push('                <div data-action="enter" class="thumb"><i class="icon icon-m ');
_p(icon_cls);
__p.push('-m"></i></div>');
 } __p.push('                <div data-action="enter" class="info">\r\n\
                    <span class="tit ellipsis" data-quick-drag data-name="file_name" title="');
_p(name);
__p.push('"><s style="display:none;">文件</s>');
_p(highlight(name));
__p.push('</span>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div data-action="enter" class="item-info">\r\n\
                <span class="item-info-list">\r\n\
                <span class="mod-act-list tool">\r\n\
                    <a data-action="download" data-tj-action="btn-adtag-tj" title="下载" tabindex="0" hidefocus="on" class="act-list" title="下载" href="#"><i class="icon icon-down"></i></a>\r\n\
                    <a data-action="share" hidefocus="on" tabindex="0" class="act-list" title="分享链接" href="#"><i class="icon icon-share"></i></a>\r\n\
                    <a data-action="qrcode" tabindex="0" class="act-list" title="二维码" href="#"><i class="icon icon-code"></i></a>\r\n\
                </span>\r\n\
             </span>\r\n\
                <span class="item-info-list item-info-size">\r\n\
                    <span class="txt txt-size">');
_p( file.get_readability_size(true) );
__p.push('</span>\r\n\
                </span>\r\n\
                <span class="item-info-list">\r\n\
                    <span class="txt txt-time">');
_p((file.get_modify_time() || file.get_create_time()).slice(0, time_str_len) );
__p.push('</span>\r\n\
                </span>\r\n\
            </div>\r\n\
        </li>');
 }); __p.push('');

return __p.join("");
},

'searching': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="mod-status">\r\n\
        <div class="page-loading-search">\r\n\
            <!-- 页面 loading -->\r\n\
            <div class="load-more">\r\n\
                <i class="icon-page-loading-search"></i>\r\n\
                <p class="txt">正在搜索...</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
