//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/client/module/station/station.r160128",["lib","common","$"],function(require,exports,module){

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
//station/src/Mgr.js
//station/src/Remover.js
//station/src/View.js
//station/src/file/FileNode.js
//station/src/file/file_type_map.js
//station/src/file/parse.js
//station/src/header/column_model.js
//station/src/header/header.js
//station/src/header/station_info.js
//station/src/header/toolbar.js
//station/src/image_lazy_loader.js
//station/src/loader.js
//station/src/station.js
//station/src/store.js
//station/src/header/header.tmpl.html
//station/src/view.tmpl.html

//js file list:
//station/src/Mgr.js
//station/src/Remover.js
//station/src/View.js
//station/src/file/FileNode.js
//station/src/file/file_type_map.js
//station/src/file/parse.js
//station/src/header/column_model.js
//station/src/header/header.js
//station/src/header/station_info.js
//station/src/header/toolbar.js
//station/src/image_lazy_loader.js
//station/src/loader.js
//station/src/station.js
//station/src/store.js
/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./Mgr",["lib","common","$","./Remover"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        cookie = lib.get('./cookie'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        mini_tip = common.get('./ui.mini_tip'),

        file_qrcode,
        Remover = require('./Remover'),

        share_enter,
        undefined;

    var Mgr = inherit(Event, {

        step_num: 20,

        init: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },

        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    e.preventDefault();
                    this.process_action(action_name, record, e);
                }, this);
                this.listenTo(this.view, 'box_select', this.on_box_select, this);
            }
            //监听头部发出的事件（工具栏（取消分享）、表头（全选，排序操作））
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {

                    if(action_name === 'checkall' || action_name === 'change_checkall') {
                        this.process_action(action_name, data, e);
                        return;
                    }
                    var records = this.view.get_selected_files();
                    if(action_name !== 'refresh' && !records.length) {
                        console.warn('请选择文件');
                        return;
                    }
                    e = data;
                    this.process_action(action_name, records, e);
                }, this);
            }
        },

        // 分派动作
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                if(arguments.length > 2) {
                    this[fn_name](data, event);
                } else {
                    this[fn_name](data);//data == event;
                }
            }
        },
        /**
         * 框选处理，更改表头全选状态
         */
        on_box_select: function() {
            this.header.on_data_update(this.store);
        },
        /**
         * 全选操作
         * @param checkalled
         */
        on_checkall: function(checkalled) {
            this.view.select_all_files(checkalled);
            console.log('on_checkall');//保持原有逻辑，直接触发
        },

        /**
         * 刷新操作
         * @param e
         */
        on_refresh: function(e) {
            console.log('station_refresh');//保持原有逻辑，直接触发
            global_event.trigger('station_refresh', true);//保持原有逻辑，直接触发
        },

        on_open: function(records, e) {
            console.log('on_open');//保持原有逻辑，直接触发
            var cur_record = $.isArray(records) ? records[0] : records;
            //目录点击文件点支持图片预览
            if(!cur_record.is_image()) {
                this.on_download(records, e);
                return;
            }
            //todo 预览图片
        },

        preview_image: function(record) {
            console.log('预览图片');//保持原有逻辑，直接触发
        },

        on_delete: function(records, e) {
            console.log('on_delete');//保持原有逻辑，直接触发
            records = $.isArray(records) ? records : [records];
            var me = this;
            records = [].concat(records);
            //this.remover = this.remover || new Remover();
            Remover.remove_confirm(records).done(function() {
                console.log('remove_confirm complete');//保持原有逻辑，直接触发
                me.header.get_column_model().cancel_checkall();
                global_event.trigger('station_refresh', true);//删除文件后刷新页面
                me.header.update_info();
            });
        },

        on_share: function(records, e) {
            if(records.length == 0) {
                mini_tip.warn('请选择笔记');
                return
            }
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records, true);
                });
            } else {
                share_enter.start_share(records, true);
            }
        },

        on_download: function(records, e) {
            console.log('on_download');//保持原有逻辑，直接触发
            records = $.isArray(records) ? records : [records];
            var data = {},
                fileList = [],
                file;
            records.forEach(function(item) {
                file = {};
                file.fileName  = item.get_name();
                file.fileSize  = item.get_size();
                file.fileID    = item.get_id();
                file.pFolderID = item.get_pdir_key();
                fileList.push(file);
            });
            data.fileList = fileList;
            window.external.ClickDownload( JSON.stringify(data) );
        },

        on_qrcode: function(record, e) {
            record = $.isArray(record) ? record : [record];
            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(record, true);
                });
            } else {
                file_qrcode.show(record, true);
            }
        },

        on_select: function() {
            console.log('on_select');
            var is_checkalled = this.header.get_column_model().is_checkalled(),
                total_files_size = this.view.get_total_size(),
                select_files = this.view.get_selected_files();
            if(is_checkalled && select_files.length !== total_files_size) {
                this.header.get_column_model().cancel_checkall();
            } else if(!is_checkalled && select_files.length === total_files_size) {
                this.header.get_column_model().make_checkall();
            }
        },
        /**
         * 分批加载数据
         * @param offset 开始的下标
         * @param num 加数的数据量
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(offset, num, is_refresh) {
            var me = this;

            this.loader.load({
                start: offset,
                count: num,
                get_abstract_url: true
            }, function(rs) {
                if(offset === 0 || is_refresh) {
                    me.store.clear();
                    me.store.init(rs);
                    //var now = new Date();
                    //$('[data-id="bubbble_hint"]').text(rs.file_list.length + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + rs.file_list.length);
                    //me.store.init(rs);
                } else {
                    me.store.add(rs);
                }
            });
        }
    });

    //$.extend(Mgr, events);
    return Mgr;
});/**
 * 通用删除操作类
 */
define.pack("./Remover",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        mini_tip = common.get('./ui.mini_tip'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        //progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        update_cookie = common.get('./update_cookie'),

        undefined;

    var Remover = new Module('Remover', {

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
                '中转站文件删除后无法从回收站找回',
                function () {
                    console.log('remove_confirm');
                    me.do_remove(files).done(function(success_files, failure_files){
                        console.log('删除文件成功');
                        def.resolve(success_files, failure_files);
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
            var data = this.get_step_data();
            this.step_remove(data, def);
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
                ppdir_key = file_group[0].get_ppid();
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
                        pdir_key: pdir_key,
                        dir_key: file.get_id(),
                        dir_name: file.get_name()
                    };
                });

            }
            if(step_files.length) {
                step_file_list = $.map(step_files, function (file) {
                    return {
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
        step_remove: function(data, def) {
            var me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskDirFileBatchDeleteEx',
                pb_v2: true,
                cavil: true,
                body: data
            }).ok(function(msg, body) {
                if(me.is_remove_all()) {
                    def.resolve(me.succ_list, me.fail_list);
                    me.destroy();
                } else {
                    var data = me.get_step_data();
                    me.step_remove(data, def);
                }
            }).fail(function(msg, ret) {
                if(ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065) {
                    update_cookie.update(function() {
                        me.step_remove(data, def);
                    });
                } else {
                    mini_tip.error(msg);
                    def.reject(msg, ret);
                }
            }).done(function() {

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
            return this.one_fail_result.retmsg || '未知错误';
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
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./View",["$","lib","common","./store","./tmpl","./header.column_model","./image_lazy_loader"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        global_event = common.get('./global.global_event'),
        global_function = common.get('./global.global_function'),

        Module = common.get('./module'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        column_model = require('./header.column_model'),
        image_lazy_loader = require('./image_lazy_loader'),

        action_property_name = 'data-action',
        padding_left = 10,
        scroller,
        undefined;

    var View = new Module('station.View', {
        _inited: false,
        render: function() {
            if(this._inited) {
                return;
            }
            $(tmpl.station_list()).appendTo(this.get_$main_box());
            $(tmpl.view_empty()).appendTo(this.get_$view_ct());

            this.bind_events();
            this._inited = true;
        },

        bind_events: function() {
            var me = this;
            this.listenTo(store, 'add', function(files) {
                me.on_add(files);
            }).listenTo(store, 'refresh_done', function(files) {
                me.on_refresh(files);
            }).listenTo(store, 'before_refresh', function() {
                me.remove_all();
            });

            var station_refresh = function(size){
                global_event.trigger('station_refresh', size);
            };
            global_function.register('station_refresh', station_refresh);
        },

        adjust_area: function(){
            this.get_$main().find('.inner').css('padding-left', padding_left + 'px');
            this.get_$station_header().find('.inner').css('padding-left', padding_left + 'px');
            this.get_$station_toolbar().css('padding-left', padding_left + 'px');
            this.adjust_height();
        },

        adjust_height: function() {
            var bar_height = this.get_$bar1_ct().height(),
                header_height = this.get_$station_header().height(),
                win_height = $(window).height(),
                height = win_height - bar_height - header_height - 27;
            this.get_$main().css('height', height + 'px');
        },

        on_refresh: function(files) {
            var me = this;
            if(files && files.length) {
                var file_list = $(tmpl.file_item(files)),
                    $container = this.get_$view_ct().find('#_station_view_list .files');
                file_list.appendTo($container);
                image_lazy_loader.init($container);

                this.get_$view_empty().css('display', 'none');
                this.get_$view_empty().removeClass('ui-view-empty');
                this.get_$station_header().css('display', 'block');
                this.adjust_area();

                this.files = files;
                this.$file_list = $container.children();
                this.$file_list.each(function(i, item) {
                    //me.select_file(i, item);
                    $(item).on('click', '['+action_property_name+']' ,function(e){
                        e.preventDefault();
                        var $target = $(e.target).closest('['+action_property_name+']', $(item));
                        if($target.attr(action_property_name) === 'select') {
                            me.select_file(item);
                        }
                        me.trigger('action', $target.attr(action_property_name), me.files[i], e);
                    });
                    //预览文件，主要是图片
                    //$(item).on('click', function(e){
                    //    e.preventDefault();
                    //    var is_data_action = !!$(e.target).closest('[' + action_property_name + ']').length;
                    //    if (is_data_action) {
                    //        return;
                    //    }
                    //    me.trigger('action', 'open', me.files[i], e);
                    //});
                });
            } else if(files && files.length === 0) {
                this.remove_all();
                this.get_$view_empty().css('display', 'block');
                this.get_$view_ct().addClass('ui-view-empty');
                this.adjust_area();
            }
        },

        on_add: function(files) {
            var is_checkalled = column_model.is_checkalled(),
                me = this;
            if(files && files.length) {
                var file_list = $(tmpl.file_item(files)),
                    $container = this.get_$view_ct().find('#_station_view_list .files');

                file_list.appendTo($container);
                //image_lazy_loader.init($container);
                files.forEach(function(item) {
                    me.files.push(item);
                });
                file_list.each(function(i, item) {
                    if(item.nodeType === 1) {
                        is_checkalled && $(item).addClass('ui-selected');
                        me.$file_list.push(item);
                        $(item).on('click', '['+action_property_name+']' ,function(e){
                            e.preventDefault();
                            var $target = $(e.target).closest('['+action_property_name+']', $(item));
                            if($target.attr(action_property_name) === 'select') {
                                me.select_file(item);
                            }
                            me.trigger('action', $target.attr(action_property_name), me.files[i], e);
                        });
                    }
                });
                this.adjust_area();
            }
        },

        select_file: function(item) {
            if($(item).hasClass('ui-selected')) {
                $(item).removeClass('ui-selected');
            } else {
                $(item).addClass('ui-selected');
            }
            this._block_hoverbar_if(this.get_selected_files().length);
        },

        select_all_files: function(select_all_files) {
            this.$file_list && this.$file_list.each(function(i, item) {
                if(select_all_files) {
                    if(!$(item).hasClass('ui-selected')) {
                        $(item).addClass('ui-selected');
                    }
                } else{
                    if($(item).hasClass('ui-selected')) {
                        $(item).removeClass('ui-selected');
                    }
                }
            });
            var selected_files_cnt = select_all_files? this.$file_list.length : 0;
            this._block_hoverbar_if(selected_files_cnt);
        },

        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                this.get_$view_ct().addClass('block-hover');
            } else {
                this.get_$view_ct().removeClass('block-hover');
            }
        },

        remove_all: function() {
            this.$file_list && this.$file_list.remove();
            this.files = null;
        },

        _handle_item_click: function (e) {
            console.log('_handle_item_click');
        },

        get_selected_files: function() {
            var selected_files = [],
                me = this;
            $.each(this.$file_list, function(i, item) {
                if($(item).hasClass('ui-selected')) {
                    selected_files.push(me.files[i]);
                }
            });

            return selected_files;
        },

        get_total_size: function() {
            return this.files? this.files.length : 0;
        },

        get_scroller: function () {
            if (!scroller) {
                var Scroller = common.get('./ui.scroller'),
                scroller = new Scroller(this.get_$main_box());
            }
            return scroller;
        },

        get_$view_empty: function () {
             return this.$view_empty || (this.$view_empty = $('#_station_view_empty'));
        },

        get_$ct_list: function() {
            return this._$ct_list || (this._$ct_list = $('#_disk_files_file_list'));
        },

        get_$view_ct: function () {
            return this.$view_ct || (this.$view_ct = $('#_station_body'));
        },

        get_$main: function() {
            return this._$main || (this._$main = $('#_main_content'));
        },

        get_$main_box: function() {
            return this._$main_box || (this._$main_box = $('#_main_box'));
        },

        get_$disk_body: function() {
            return this._$disk_body || (this._$disk_body= $('#_disk_body'));
        },

        get_$station_header: function() {
            return this._$station_header || (this._$station_header = $('#_main_station_header'));
        },

        get_$station_toolbar: function() {
            return this._$station_toolbar || (this._$station_toolbar = $('#_station_toolbar'));
        },

        get_$bar1_ct: function() {
            return this.$bar1_ct || (this.$bar1_ct = $('#_main_bar1'));
        },

        get_$load_more: function () {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        }
    });

    return View;
});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./file.FileNode",["lib","$","./file.file_type_map"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        events = lib.get('./events'),
        //prettysize = lib.get('./prettysize'),

        file_type_map = require('./file.file_type_map'),

    // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
    // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1 },

    // 视频文档类型
        EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },

        PREVIEW_DOC_TYPE = ['xls', 'xlsx', 'doc', 'docx', 'rtf', 'ppt', 'pptx', 'pdf', 'txt'],

        COMPRESS_TYPE = ['rar','zip','7z'],

        EXT_REX = /\.([^\.]+)$/,
        NAME_NO_EXT_RE = new RegExp('(.+)(\\.(\\w+))$'),

        undefined;

    function FileNode(opts) {
        var is_dir = !!opts.dir_key;
        this._is_dir = is_dir;
        if(is_dir) {
            this._ppdir_key = opts.ppdir_key || '';
            this._pdir_key = opts.pdir_key;
            this._id = opts.dir_key;
            this._name = opts.dir_name;
            this._mtime = opts.dir_mtime;
            this._ctime = opts.dir_ctime;
            this._file_size = 0;
            this._diff_version = opts.diff_version;
            this._attr = opts.dir_attr;
            this._ext_info = opts.ext_info;
        } else {
            this._ppdir_key = opts.ppdir_key;
            this._pdir_key = opts.pdir_key;
            this._id =  opts.file_id;
            this._name = opts.filename;
            this._mtime = opts.file_mtime;
            this._ctime = opts.file_ctime;
            this._remain_time = opts.remain_time;
            this._expire_time = opts.expire_time;
            this._valid_time = opts.valid_time;
            this._diff_version = opts.diff_version;
            this._file_size = opts.file_size;
            this._file_cursize = opts.file_cursize;
            this._file_sha = opts.file_sha;
            this._file_md5 = opts.file_md5;
            this._file_version = opts.file_version;
            this._lib_id = opts.lib_id;
            this._attr = opts.file_attr;
            this._ext_info = opts.ext_info;
            this._readability_size = 0; //prettysize(this._file_size);
        }
        this._type = FileNode.get_type(this._name, is_dir);
        this._ext = FileNode.get_ext(this._name);

        /******************以下属性用于目录树*************************/
        this._kid_dirs = [];
        this._kid_files = [];
        this._kid_nodes = [];
        this._kid_map = {};
    }

    FileNode.prototype = {

        is_dir: function() {
            return !!this._is_dir;
        },

        is_image: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_IMAGE_TYPES;
        },

        is_video: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_VIDEO_TYPES;
        },

        is_preview_doc: function() {
            return $.inArray(this._type.toLowerCase(), PREVIEW_DOC_TYPE) > -1;
        },

        is_compress: function() {
            return $.inArray(this._type.toLowerCase(), COMPRESS_TYPE) > -1;
        },

        is_broken: function() {
            return this._file_cursize < this._file_size;
        },

        is_empty_file: function() {
            return this._file_size === 0;
        },

        get_id: function() {
            return this._id;
        },

        get_pid: function() {
            return this.get_pdir_key();
        },

        get_ppid: function() {
            return this.get_ppdir_key();
        },

        get_pdir_key: function() {
            return this._pdir_key || this.get_parent() && this.get_parent().get_id();
        },

        get_ppdir_key: function() {
            return this._ppdir_key;
        },

        get_name: function() {
            return this._name;
        },

        get_type: function() {
            return this._type;
        },

        get_ext: function() {
            return this._ext;
        },

        get_size: function() {
            return this._file_size;
        },

        get_readability_size: function() {
            return FileNode.get_readability_size(this._file_size, false, 1);
        },

        get_modify_time: function() {
            return this._mtime;
        },

        get_create_time: function() {
            return this._ctime;
        },

        get_remain_time: function() {
            return this._remain_time;
        },

        get_file_sha: function() {
            return this._file_sha;
        },

        get_file_md5: function() {
            return this._file_md5;
        },

        get_thumb_url: function(size) {
            if(this.is_image() && this._ext_info['thumb_url']) {
                if(size) {
                    size = size + '*' + size;
                    return this._ext_info['thumb_url'] + (this._ext_info['thumb_url'].indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
                } else {
                    return this._ext_info['thumb_url'];
                }
            }
            return '';
        },

        /******************以下方法用于目录树*************************/

        set_parent: function(parent) {
            this._parent = parent;
        },

        get_parent: function() {
            return this._parent;
        },

        add_node: function(node) {
            node.set_parent(this);
            this._kid_nodes.push(node);
            if(node.is_dir()) {
                this._kid_dirs.push(node);
            } else {
                this._kid_files.push(node);
            }
            this._kid_map[node.get_id()] = node;
        },

        add_nodes: function(nodes) {
            var me = this;
            $.each(nodes || [], function(i, node) {
                me.add_node(node);
            });
        },

        remove_node: function(node) {

        },

        remove_nodes: function(nodes) {
            var me = this;
            $.each(nodes || [], function(i, node) {
                me.remove_node(node);
            });
        },

        remove_all: function() {
            var nodes = this.get_kid_nodes();
            this.remove_nodes(nodes);
        },

        get_kid_dirs: function() {
            return this._kid_dirs;
        },

        get_kid_files: function() {
            return this._kid_files;
        },

        get_kid_nodes: function() {
            return this._kid_nodes;
        },

        get_kid_count: function() {
            return this._kid_nodes.length;
        },

        get_kid_images: function() {
            var kid_files = this.get_kid_files(),
                images = [];

            $.each(kid_files, function(i, file) {
                if(file.is_image()) {
                    images.push(file);
                }
            });

            return images;
        }


    };

    /**
     * 获取文件类型（ 不是后缀名，如 a.wps 的get_type() 会返回 doc ）
     * @param {String} name
     * @param {Boolean} is_dir
     * @return {String}
     */
    FileNode.get_type = function (name, is_dir) {
        var ext;
        if (is_dir) {
            return file_type_map.get_folder_type();
        } else {
            ext = !is_dir ? FileNode.get_ext(name) : null;
            if (ext) {
                return file_type_map.get_type_by_ext(ext);
            }
        }
        return 'file';
    };

    FileNode.get_readability_size = function (bytes, is_dir, decimal_digits) {
        if (is_dir)
            return '';

        if(bytes === -1){
            return '超过4G';
        }

        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 1;

        if (!bytes)
            return '0B';

        var unit = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        var size = bytes / Math.pow(1024, unit);
        var decimal_mag = Math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = Math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35
        var int_size = parseInt(decimal_size);
        var result = decimal_size !== int_size ? decimal_size : int_size; // 如果没有小数位，就显示为整数（如1.00->1)

        /*
         // 这是旧的需求实现：12.345G要显示为12.34G；12.00G要显示为12G - james
         var decimal_size = (math.floor(size * 100) / 100);  // 12.345 -> 12.34

         // 如果小数位有值，则保留2位；小数位为0，则不保留 @james
         if (decimal_size !== parse_int(decimal_size)) {
         result = decimal_size.toFixed(2);
         }
         // 整数
         else {
         result = parse_int(size);
         }*/

        return result + BYTE_UNITS[unit];
    };

    FileNode.is_image = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    FileNode.get_ext = function(name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;

    }

    $.extend(FileNode.prototype, events);

    return FileNode;
});define.pack("./file.file_type_map",[],function (require, exports, module) {

    var defaults = 'file',
        folder_type = 'folder',
        type_map = {
            doc: ['doc', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt: ['ppt', 'pptm'],
            bmp: ['bmp', 'exif', 'raw'],
            '3gp': ['3gp', '3g2', '3gp2', '3gpp'],
            mpe: ['mpe', 'mpeg4'],
            asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa'],
            wav: ['wav', 'ram', 'ra', 'au'],
            c: ['c', 'cpp', 'h', 'cs', 'plist'],
            '7z': ['7z', 'z', '7-zip'],
            ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg: ['jpg', 'jpeg', 'tif', 'tiff', 'webp'],
            rmvb: ['rmvb'],
            rm: ['rm'],
            hlp: ['hlp', 'cnt'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
            exec: ['exec', 'dll'],
            pdf: ['pdf'],
            txt: ['txt', 'text'],
            msg: ['msg'],
            rp: ['rp'],
            vsd: ['vsd'],
            ai: ['ai'],
            eps: ['eps'],
            log: ['log'],
            xmin: ['xmin'],
            psd: ['psd'],
            png: ['png'],
            gif: ['gif'],
            mod: ['mod'],
            mov: ['mov'],
            avi: ['avi'],
            swf: ['swf'],
            flv: ['flv'],
            wmv: ['wmv'],
            wma: ['wma'],
            mp3: ['mp3'],
            mp4: ['mp4'],
            ipa: ['ipa'],
            apk: ['apk'],
            ipe: ['ipe'],
            exe: ['exe'],
            msi: ['msi'],
            bat: ['bat'],
            fla: ['fla'],
            html: ['html'],
            htm: ['htm'],
            asp: ['asp'],
            xml: ['xml'],
            chm: ['chm'],
            rar: ['rar'],
            zip: ['zip'],
            tar: ['tar'],
            cab: ['cab'],
            uue: ['uue'],
            jar: ['jar'],
            iso: ['iso'],
            dmg: ['dmg'],
            bak: ['bak'],
            tmp: ['tmp'],
            ttf: ['ttf'],
            otf: ['opt'],
            old: ['old'],
            docx: ['docx'],
            wps: ['wps'],
            xlsx: ['xlsx'],
            pptx: ['pptx'],
            dps: ['dps'],
            et:  ['et'],
            key: ['key'],
            numbers: ['numbers'],
            pages: ['pages'],
            keynote: ['keynote'],
            mkv: ['mkv'],
            mpg: ['mpg'],
            mpeg: ['mpeg'],
            dat: ['dat'],
            f4a: ['f4a'],
            webm: ['webm'],
            ogg: ['ogg'],
            acc: ['acc'],
            m4a: ['m4a'],
            wave: ['wave'],
            midi: ['midi'],
            ape: ['ape'],
            aac: ['aac'],
            aiff: ['aiff'],
            mid: ['mid'],
            xmf: ['xmf'],
            rtttl: ['rtttl'],
            flac: ['flac'],
            amr: ['amr'],
            ttc: ['ttc'],
            fon: ['fon'],
            dmg: ['dmg'],
            document: ['document'],
            image: ['image'],
            video: ['video'],
            audio: ['audio'],
            compress: ['compress'],
            unknow: ['unknow'],
            filebroken: ['filebroken']
        },
        all_map = {},
        can_ident = {},
        _can_ident = [ // revert to map later
            'doc', 'xls', 'ppt', 'bmp', '3gp', 'mpe', 'asf', 'wav', 'c',
            '7z', 'zip', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf',
            'docx', 'wps', 'xlsx', 'pptx', 'dps', 'et', 'key', 'numbers', 'pages', 'keynote', 'mkv', 'mpg',
            'mpeg', 'dat', 'f4a', 'webm', 'ogg', 'acc', 'm4a', 'wave', 'midi', 'ape', 'aac', 'aiff', 'mid',
            'xmf', 'rtttl', 'flac', 'amr', 'ttc', 'fon', 'dmg'
        ];



    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident.length; i < l; i++) {
        var sub_types = type_map[_can_ident[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident[sub_types[j]] = 1;
        }
    }

    var getWords = function (str, num) {
        try {
            var index = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                    index += 2;
                } else {
                    index++;
                }
                if (index > num) {
                    return ( str.substr(0, i) + '..' );
                }
            }
            return str;
        } catch (e) {
            return str;
        }
    };

    return {

        get_type_by_ext: function (type) {
            return all_map[type] || defaults;
        },
        get_folder_type: function () {
            return folder_type;
        },
        can_identify: function (type) {
            return !!can_ident[type];
        },
        /**
         * 修复长文件名，如 「这是一个很长很长很长的文件名.txt」会被修复为「这是一个...文件名.txt」
         * @param {String} file_name
         * @param {Number} type
         * @returns {*}
         */
        revise_file_name: function (file_name, type) {
            switch (type) {
                case 1 :
                    return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
                case 2 :
                    return file_name.length > 17 ? [ file_name.substring(0, 7), '...', file_name.substring(file_name.length - 7) ].join('') : file_name;
            }

        }
    };

});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./file.parse",["lib","common","$","./file.FileNode"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        FileNode = require('./file.FileNode'),

        undefined;

    var parser = new Module('file.parser', {

        parse: function(data) {
            var list = [];

            if(data.file_list && data.file_list.length > 0) {
                list = list.concat(data.file_list);
            }

            var nodes = [];
            if(list.length > 0) {
                $.each(list || [], function(i, item) {
                    nodes.push(new FileNode(item));
                });
            }

            return nodes;
        }
    });

    return parser;
});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./header.column_model",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        undefined;

    var column_model = new Module('column_model', {

        render: function($ct) {

            if(!this.rendered) {
                this.$el = $(tmpl.columns()).appendTo($ct);
                this._$ct = $ct;
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', this.$el);
                if($target.is('[data-action=checkall]')) {
                    $target.toggleClass(checkalled_class);
                    checkalled = !checkalled;
                    //console.log('column_model/_bind_action:' + action_property_name);
                    me.trigger('action', 'checkall', checkalled, e);
                } else {
                    me.trigger('action', $target.attr(action_property_name), e);
                    //console.log('column_model/_bind_action:' + action_property_name);
                }
            });
        },
        /**
         * 更改全选，当选择/取消选择一条记录时，动态更改全选状态
         * @param {Boolean} new_checkalled
         */
        checkall: function(new_checkalled) {
            if(new_checkalled !== checkalled) {
                this.get_$checkall().toggleClass(checkalled_class, new_checkalled);
                checkalled = new_checkalled;
                console.log('column_model/checkall:' + new_checkalled);
                this.trigger('action', 'change_checkall', new_checkalled);
            }
        },
        //取消全选
        cancel_checkall: function() {
            if(this.is_checkalled()) {
                this.get_$checkall().toggleClass(checkalled_class, false);
                checkalled = false;
            }
        },

        make_checkall: function() {
            if(!this.is_checkalled()) {
                this.get_$checkall().toggleClass(checkalled_class, true);
                checkalled = true;
            }
        },

        //是否已全选
        is_checkalled: function() {
            return checkalled;
        },

        update: function() {

        },

        show: function() {
            this.$el.show();
            if(constants.UI_VER === 'WEB') {
                this._$ct.show();
            }
        },

        hide: function() {
            this.$el.hide();
            if(constants.UI_VER === 'WEB') {
                this._$ct.hide();
            }
        },

        get_$checkall: function() {
            return this.$checkall || (this.$checkall = this.$el.find('[data-action=checkall]'));
        }
    });

    return column_model;

});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./header.header",["lib","common","$","./tmpl","./header.toolbar","./header.station_info","./header.column_model"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        tmpl = require('./tmpl'),

        toolbar = require('./header.toolbar'),
        station_info = require('./header.station_info'),
        cm = require('./header.column_model'),

        file_item_height = 47,//文件列表中每一项的高度

        undefined;

    var header = new Module('header', {

        bind_store: function(store) {
            var old_store = this.store;
            if(old_store) {
                old_store.off('datachanged', this._detect_data_empty, this);
                old_store.off('clear', this._detect_hide_column_model, this);
                old_store.off('update', this.on_data_update, this);
            }

            store.on('datachanged', this._detect_data_empty, this);
            store.on('clear', this._detect_hide_column_model, this);
            store.on('update', this.on_data_update, this);
            this.store = store;
        },

        _detect_hide_column_model: function() {
            this.get_column_model().hide();
        },

        //检查数据是否为空了
        _detect_data_empty: function() {
            var store_size = this.store.size(),
                cm = this.get_column_model(),
                tbar = this.get_toolbar();
            if(!this.is_activated()) {
                return;
            }
            if(store_size === 0) {//无数据时，不显示工具栏和表头
                //tbar.hide();
                cm.hide();
            } else {
               // tbar.show();
                cm.show();
            }
        },


        on_data_update: function(store) {
            var checkalled = true,
                column_model = this.get_column_model();

            store.each(function(item) {
                if(!item.get('selected')) {//找到一个不是选中，则不是全选 // TODO 建议使用 collections.any()
                    checkalled = false;
                    return false; //break
                }
            });

            column_model.checkall(checkalled);
        },

        render: function($top_ct, $bar1_ct, $column_ct) {

            this.$toolbar_ct = $bar1_ct;
            this.$column_model_ct = $column_ct;

            this._render_toolbar($bar1_ct);

            this._render_column_model($column_ct);

            this._bind_action();
        },

        update_info: function() {
            console.log('update_info');
            //station_info.update_info();
        },

        _render_toolbar: function($bar1_ct) {
            //toolbar.render($bar1_ct);
        },

        _render_column_model: function($bar2_ct) {
            //cm.render($bar2_ct);
        },

        _bind_action: function() {
            var me = this,
                array_concat = Array.prototype.concat;
            //把toolbar,cm的action事件统一向外抛
            this.listenTo(cm, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
                //console.log('toolbar/_bind_action:' + arguments);
            });
            this.listenTo(toolbar, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
                //console.log('header/_bind_action:' + arguments);
            });
        },

        get_column_model: function() {
            return cm;
        },

        get_toolbar: function() {
            return toolbar;
        },
        show: function(){
           this.get_$column_model_ct().show();
            this._activated = true;
        },
        hide: function() {
            this.get_$column_model_ct().hide();
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        get_$toolbar_ct: function() {
            return this.$toolbar_ct;
        },

        get_$toolbar: function() {
            return this.$toolbar || (this.$toolbar = $('#_station_toolbar'));
        },

        get_$column_model_ct: function() {
            return this.$column_model_ct;
        },

        destroy: function() {
            this.bind_store(null);
        }
    });

    return header;
});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./header.station_info",["lib","common","$","./file.FileNode","./loader","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        request = common.get('./request'),
        File = require('./file.FileNode'),
        Loader = require('./loader'),

        tmpl = require('./tmpl'),

        undefined;
    var loader = new Loader();
    var station_info = new Module('header._station_info', {

        render: function($ct) {
            if(this._rendered) {
                return;
            }
            var me = this;

            this.$info_ct = $(tmpl.station_info()).appendTo($ct);

            loader.load_station_info().done(function(data) {
                me.show_info(data);
            });

            this._rendered = true;

        },

        update_info: function() {
            var me = this;
            loader.load_station_info().done(function(data) {
                me.show_info(data);
            });
        },

        show_info: function(data) {

            $(tmpl.bubbble({
                max_date: Math.ceil(data.temporary_file_max_valid_time / (60*60*24)),
                max_single_file_size: File.get_readability_size(data.max_single_file_size),
                file_total: data.file_total
            })).appendTo(this.get_$info_ct());

            var $bubbble = this.$info_ct.find('[data-id=station_bubbble]');
            this.$info_ct.find('[data-id=bubbble_hint]').hover(function(e) {
                $bubbble.show();
            }, function(e) {
                $bubbble.hide();
            });
        },

        get_$info_ct: function() {
            return this.$info_ct;
        }
    });
    return station_info;

});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./header.toolbar",["lib","common","$","./header.station_info","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),

        tation_info = require('./header.station_info'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        undefined;

    var toolbar = new Module('header.toolbar', {

        render: function($ct) {
            if(!this.rendered) {
                this.$el = $(tmpl.toolbar()).appendTo($ct);
                tation_info.render(this.$el);
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                //console.log('toolbar/_bind_action:' + action_property_name);
                me.trigger('action', $target.attr(action_property_name), e);
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return toolbar;

});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./image_lazy_loader",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),
        https_tool = common.get('./util.https_tool'),

        undefined;

    var lazy_loader = {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = window.pageYOffset;

            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        var src = https_tool.translate_url($img.attr('data-src'));
                        src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'size=64*64';
                        image_loader.load(src).done(function(img) {
                            $img.css({
                                'backgroundImage': "url('"+img.src+"')",
                                'backgroundPosition': 0
                            });
                            $img.attr('data-loaded', 'true');
                        })
                    }
                }
            });
        }
    };

    $.extend(lazy_loader, events);

    return lazy_loader;
});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./loader",["lib","common"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        update_cookie = common.get('./update_cookie'),

        //Record = require('./File_record'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/temporary_file.fcg',
        DEFAULT_CMD = 'TemporaryFileDiskDirList',

    //排序类型
        SORT_TYPE = {
            TIME: 0,//时间序
            NAME: 1 //名称序
        },

        undefined;

    var loader = inherit(Event, {
        /**
         * 加载文件节点
         * @param {Object} cfg 详细配置如下：
         *      offset : {Number} 起始位置
         *      num : {Number} 加载条数
         *      sort_type : {String} 排序方式，目前需要支持a-z名称排序（name）与最后修改时间（time）
         *      sub_type : {String} (可选) 子分类，用于文档进行
         * @param {Function} callback 加载完成后的回调，需传入2个参数：
         *      success : {Boolean} 是否成功
         *      records_arr : {Array<Record>} 文件节点
         *      msg : {String} 如果失败，需要在这里给出具体错误文本
         * @param {Object} scope (optional) callback调用的this对象
         */
        load : function(cfg, callback, scope){

            //有before_load方法时 则进行拦截处理请求
            if(this.before_load && this.before_load.call(this, cfg) === false) {
                return;
            }

            this
                ._load(cfg, callback)
                .done(function(records_arr, total) {
                    callback.call(scope || this, records_arr, total);
                });

        },
        /**
         * 加载文件节点的实际请求方法
         * @param cfg
         * @private
         */
        _load: function(cfg, callback) {

            var def = $.Deferred(),
                is_refresh = cfg.start === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }

            me._loading = true;
            me._last_load_req = request
                .xhr_post({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    re_try:3,
                    pb_v2: true,
                    body: {
                        start: cfg.start || 0,
                        count: cfg.count || 20,
                        get_abstract_url: true
                    }
                })
                .ok(function(msg, body) {
                    me._all_load_done = !!body.finish_flag;//是否已加载完
                    if(body.total_file_count == 0) {//总数为空时，后台竞然返回的end字段为false，这里再作下判断
                        me._all_load_done = true;
                    }

                    def.resolve(body);
                    me.trigger('load', body);
                })
                .fail(function(msg, ret) {
                    if(ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065) {
                        update_cookie.update(function() {
                            me.load(cfg, callback);
                        });
                    } else {
                        me.trigger('error', msg, ret);
                    }
                    def.reject(msg, ret);
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        load_station_info: function() {
            var def = $.Deferred(),
                me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskUserInfoGet',
                pb_v2: true
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
                console.log('拉取用户中转站信息失败');
                def.reject();
            });
            return def;
        },

        is_first_loaded: function() {
            return this._first_loaded;
        },

        is_loading: function() {
            return this._loading;
        },

        is_all_load_done: function() {
            return this._all_load_done;
        },
        /**
         * 对cgi返回的数据进行再处理，目前有当已全选时，要选中后续加载的每条记录
         * @param {Object} file
         */
        format_file: function(file) {
            if(this.get_checkalled()) {
                file.selected = true;
            }
        },

        set_checkalled: function(checkalled) {
            this._checkalled = checkalled;
            console.log('checkall:',checkalled)
        },

        get_checkalled: function() {
            return this._checkalled;
        },

        abort: function() {
            this._last_load_req && this._last_load_req.destroy();
        }
    });

    return loader;
});/**
 * 文件中转站模块
 * @author xixinhuang
 * @date 2015-11-08
 */
define.pack("./station",["$","lib","common","./image_lazy_loader","./header.header","./store","./Mgr","./View","./file.parse","./loader"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        global_event = common.get('./global.global_event'),
        update_cookie = common.get('./update_cookie'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        cookie = lib.get('./cookie'),
        image_lazy_loader = require('./image_lazy_loader'),
        header = require('./header.header');

    var store = require('./store'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        parse = require('./file.parse'),
        Loader = require('./loader'),

        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        is_from_nav = true,
        scroller,
        last_upload_refresh_time,
        refresh_flag,                  //刷新标志
        refresh_interval = 1000 * 5,  //每次刷新间隔时间
        BIG_FILE_SIZE = 1024 * 20,
        inited = false,

        undefined;
    var loader = new Loader();
    var mgr = new Mgr();
    header.bind_store(store);//绑定数据源

    var station = new Module('client._station', {
        render: function(data) {
            var me = this;

            this.render_bar();
            View.render();
            store.init(data);
            mgr.init({
                header: header,
                view: View,
                store: store,
                loader: loader,
                step_num: STEP_NUM
            });
            //update_cookie.init();

            first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);
            window.onresize = function() {
                var height = $(window).height(),
                    width = $(window).width();
                //global_event.trigger('window_resize', width, height);
                me.on_win_resize(width, height);
            };

            scroller = View.get_scroller();

            this.listenTo(global_event, 'station_refresh', function(size) {
                me.on_refresh(true, size);
            });

            this.listenTo(scroller, 'scroll', this.on_win_scroll);
            this.speed_time_report();
        },

        async: function() {
            this.render([]);
        },

        /**
         * 刷新操作，大文件立即刷新，小文件隔10秒刷新一次
         */
        on_refresh: function(is_refresh_now, size) {
            var me = this;
            if(is_refresh_now) {
               this.do_refresh();
            } else if(!last_upload_refresh_time) {
                var now_time = new Date().getTime();
                last_upload_refresh_time = now_time;
                refresh_flag = false;
                this.do_refresh();
            } else if(!this.can_refresh() && !refresh_flag) {
                var now_time = new Date().getTime(),
                    next_refresh_time = refresh_interval - (now_time - last_upload_refresh_time);
                refresh_flag = true;
                setTimeout(function() {
                    me.do_refresh();
                }, next_refresh_time);
            } else if(this.can_refresh() && refresh_flag) {
                var now_time = new Date().getTime();
                last_upload_refresh_time = now_time;
                refresh_flag = false;
                this.do_refresh();
            }
        },

        do_refresh: function() {
            location.reload();
            //Mgr.load_files(0, STEP_NUM, is_from_nav === false ? false : true);
            //header.get_column_model().cancel_checkall();
            //header.update_info();
        },

        //上传多文件，减少闪动，每隔一段时间刷新
        can_refresh: function() {
            var now = new Date().getTime();
            if(!last_upload_refresh_time && (now - last_upload_refresh_time) > refresh_interval) {
                return true;
            }
            return false;
        },

        render_bar: function() {
            //this.$top_ct = $('#_main_top');
            //this.$bar1_ct = $('#_main_bar1');
            //this.$column_ct = $('#_main_station_header');
            //this.$body_ct = $('#_main_box');
            //header.render(this.$top_ct, this.$bar1_ct, this.$column_ct);
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            console.log('share on_win_resize' + first_page_num +':'+ width +':'+ height);
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT);
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                console.log('share first_page_num' + first_page_num);//从后加载
                mgr.load_files(View.get_total_size(), STEP_NUM, false);
            }

            //header.sync_scrollbar_width_if();//同步滚动条宽度到表头
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                console.log('station on_win_scroll');
                mgr.load_files(View.get_total_size(), STEP_NUM, false);
            }
            image_lazy_loader.load_image();
        },

        /*
        * 测速上报到华佗
        * */
        speed_time_report: function() {
            var render_time = +new Date();
            //延时以便获取performance数据
            setTimeout(function() {
                //huatuo_speed.store_point('client', 20, g_serv_taken);
                //huatuo_speed.store_point('client', 21, g_css_time - g_start_time);
                //huatuo_speed.store_point('client', 22, (g_end_time - g_start_time) + g_serv_taken);
                //huatuo_speed.store_point('client', 23, g_js_time - g_end_time);
                //huatuo_speed.store_point('client', 24, (render_time - g_start_time) + g_serv_taken);
                //huatuo_speed.report('client', true);
            }, 1000);
        }
    });

    return station;
});/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define.pack("./store",["lib","common","$","./file.FileNode","./file.parse"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        FileNode = require('./file.FileNode'),
        parser = require('./file.parse'),
        events = lib.get('./events'),

        nodes,
        node_map = {},

        undefined;

    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }

            if(data) {
                nodes = this.format2nodes(data);
            }

            this._inited = true;
            //this.trigger('before_refresh');
            this.trigger('refresh_done', nodes);
        },

        add: function(data) {
            if(data) {
                nodes = this.format2nodes(data);
                this.trigger('add', nodes);
            }
        },

        refresh: function() {
            //cur_node.remove_all();
            //this._load_done = false;
            //this.load_more(true);
        },

        clear: function() {
            nodes = null;
            node_map = {};
            this._inited = false;
            this.trigger('before_refresh');
        },

        format2nodes: function(data) {
            var nodes = parser.parse({
                file_list: data.file_list
            });

            this._load_done = !!data.finish_flag;

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            return nodes;
        },

        is_load_done: function() {
            return !!this._load_done;
        },

        is_requesting: function() {
            return !!this._requesting;
        },


        get: function(file_id) {
            return node_map[file_id];
        }
    };
    $.extend(store, events);

    return store;
});
//tmpl file list:
//station/src/header/header.tmpl.html
//station/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'station_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="info-box trans-file-info" style="">\r\n\
        <div data-id="bubbble_hint" class="content"><i class="ui-icon icon-hint"></i>中转文件信息</div>\r\n\
    </div>\r\n\
    </div>');

return __p.join("");
},

'bubbble': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 气泡浮层 (如果需要更宽，请在bubble-box上赋宽度值) -->\r\n\
    <div data-id="station_bubbble" class="bubble-box trans-file-info-bubble" style="display:none;">\r\n\
        <div class="bubble-i">\r\n\
            <p>文件数：<span class="data">');
_p(data.file_total);
__p.push('个</span></p>\r\n\
            <p>单文件大小限制：<span class="data">');
_p(data.max_single_file_size);
__p.push('</span></p>\r\n\
            <p>最大保存天数：<span class="data">');
_p(data.max_date);
__p.push('天</span></p>\r\n\
        </div>\r\n\
        <b class="bubble-trig ui-trigbox ui-trigbox-tr">\r\n\
            <b class="ui-trig"></b>\r\n\
            <b class="ui-trig ui-trig-inner"></b>\r\n\
        </b>\r\n\
        <!-- <span class="bubble-close">×</span> -->\r\n\
    </div>');

return __p.join("");
},

'toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_station_toolbar" class="toolbar-btn clear transfer-files-toolbar">\r\n\
        <!-- .inner项hover状态使用.hover样式 -->\r\n\
        <!-- .inner项不可用状态使用.disable样式 -->\r\n\
        <div class="btn-message">\r\n\
            <a data-action="download" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-down"></i><span class="text">下载</span></span></a>\r\n\
            <a data-action="share" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-share"></i><span class="text">分享</span></span></a>\r\n\
            <!--<a data-action="rename" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-rename"></i><span class="text">重命名</span></span></a>-->\r\n\
            <a data-action="delete" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled"><i class="ico ico-del"></i><span class="text">删除</span></span></a>\r\n\
            <a data-action="refresh" class="g-btn g-btn-gray" href="#"><span class="btn-inner enabled minpad"><i class="ico ico-ref"></i></span></a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'columns': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="inner" style="">\r\n\
        <div class="files-head">\r\n\
            <!-- list-hover 为ie6下hover样式 -->\r\n\
                <span class="list name"><span class="wrap"><span class="inner">\r\n\
                    文件名<label class="checkall" data-action="checkall" data-no-selection=""></label>\r\n\
                </span></span></span>\r\n\
                <span class="list private-countdown"><span class="wrap"><span class="inner">\r\n\
                    剩余时间\r\n\
                </span></span></span>\r\n\
                <span class="list private-size"><span class="wrap"><span class="inner">\r\n\
                    文件大小\r\n\
                </span></span></span>\r\n\
                <span class="list private-date"><span class="wrap"><span class="inner">\r\n\
                    中转时间\r\n\
                </span></span></span>\r\n\
            <span class="list private-qrcode"><span class="wrap"><span class="inner"></span></span></span>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'station_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_station_body"  class="disk-view ui-view ui-listview" data-label-for-aria="中转站内容区域">\r\n\
        <div id="_station_view_list">\r\n\
            <!-- 文件列表 -->\r\n\
            <div class="files"></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$');
    var lib = require('lib');
    var common = require('common');
    var date_time = lib.get('./date_time');
    var records = data;
    var id_perfix = 'station-item-';
    var me = this;

    $.each(records, function(i, file) {
    var file_name = file.get_name();
    var is_image = file.is_image();
    var remain_day = file.get_remain_time();
    var warn_class = remain_day < 2? 'state-warn' : '';
    var icon_class = 'icon-' + (file.get_type() ? file.get_type() : 'file');
    __p.push('    <div data-file-id data-record-id="');
_p(file.id);
__p.push('" data-list="file" class="list list-more clear" id="');
_p(id_perfix + file._id);
__p.push('">\r\n\
        <label class="checkbox" data-action="select" tabindex="0" aria-label="');
_p(file_name);
__p.push('"></label>\r\n\
            <span class="img">');
 if(is_image) { __p.push('                <i data-src="');
_p(file.get_thumb_url(32));
__p.push('" class="filetype ');
_p(icon_class);
__p.push('"></i>');
 } else { __p.push('                <i class="filetype ');
_p(icon_class);
__p.push('"></i>');
 } __p.push('            </span>\r\n\
            <span class="name">\r\n\
                <p class="text"><em title="');
_p(file_name);
__p.push('" data-name="file_name">');
_p(file_name);
__p.push('</em></p></span>\r\n\
                <span class="tool"><span class="inner">\r\n\
                    <a data-action="delete" class="link-del" title="删除" href="#"><i class="ico-del"></i></a>\r\n\
                    <!--<a data-action="rename" class="link-rename" title="重命名" href="#"><i class="ico-rename"></i></a>-->\r\n\
                    <a data-action="share" class="link-share" title="分享" href="#"><i class="ico-share"></i></a>\r\n\
                    <a data-action="download" class="link-download" title="下载" href="#"><i class="ico-download"></i></a>\r\n\
                </span></span>\r\n\
        <span class="private-item private-countdown ');
_p(warn_class);
__p.push('"><span class="inner">剩余');
_p(remain_day);
__p.push('天</span></span>\r\n\
        <span class="private-item private-size"><span class="inner">');
_p(file.get_readability_size());
__p.push('</span></span>\r\n\
        <span class="private-item private-date"><span class="inner">');
_p(date_time.timestamp2date_ymdhm(file.get_create_time() || new Date()));
__p.push('</span></span>\r\n\
        <span class="private-item private-qrcode"><a data-action="qrcode" class="link-dimensional" title="二维码" href="#"><i class="ico-dimensional"></i></a></span>\r\n\
    </div>');
 }); __p.push('');

return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_station_view_empty" class="g-empty transfer-files-empty" aria-label="文件中转站没有内容" tabindex="0">\r\n\
        <div class="empty-box">\r\n\
            <p class="content">腾讯微云于2016年5月27日升级【文件中转站】，现已不再提供文件临时存储功能。欢迎继续使用微云更加稳定，安全，快速的永久云存储服务。</p>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
