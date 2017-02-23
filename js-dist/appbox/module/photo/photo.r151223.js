//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/photo/photo.r151223",["lib","$","common","main","file_qrcode","jump_path"],function(require,exports,module){

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
//photo/src/Composite_view_mode.js
//photo/src/Panel.js
//photo/src/Remover.js
//photo/src/Requestor.js
//photo/src/Switch_view.js
//photo/src/View_mode.js
//photo/src/axisMap.js
//photo/src/group/Group_panel.js
//photo/src/group/Mgr.js
//photo/src/group/Panel.js
//photo/src/group/Record.js
//photo/src/group/Store.js
//photo/src/group/View.js
//photo/src/group/cover/View.js
//photo/src/group/detail/Mgr.js
//photo/src/group/detail/Panel.js
//photo/src/group/detail/Photo_view.js
//photo/src/group/detail/Store.js
//photo/src/group/detail/Titlebar.js
//photo/src/group/detail/View.js
//photo/src/group/detail/groupdialog/View.js
//photo/src/group/detail/grouplist/View.js
//photo/src/group/drag_sort.js
//photo/src/photo.js
//photo/src/photo/Mgr.js
//photo/src/photo/Panel.js
//photo/src/photo/Record.js
//photo/src/photo/Store.js
//photo/src/photo/Thumb_loader.js
//photo/src/photo/View.js
//photo/src/time/Panel.js
//photo/src/time/Photo_Node.js
//photo/src/time/Select.js
//photo/src/time/Time_Group.js
//photo/src/time/cgi.js
//photo/src/time/menu.js
//photo/src/time/store.js
//photo/src/time/view.js
//photo/src/group/View.tmpl.html
//photo/src/group/cover/View.tmpl.html
//photo/src/group/detail/Panel.tmpl.html
//photo/src/group/detail/View.tmpl.html
//photo/src/group/detail/groupdialog/View.tmpl.html
//photo/src/group/detail/grouplist/View.tmpl.html
//photo/src/main.tmpl.html
//photo/src/photo/View.tmpl.html
//photo/src/time/View.tmpl.html

//js file list:
//photo/src/Composite_view_mode.js
//photo/src/Panel.js
//photo/src/Remover.js
//photo/src/Requestor.js
//photo/src/Switch_view.js
//photo/src/View_mode.js
//photo/src/axisMap.js
//photo/src/group/Group_panel.js
//photo/src/group/Mgr.js
//photo/src/group/Panel.js
//photo/src/group/Record.js
//photo/src/group/Store.js
//photo/src/group/View.js
//photo/src/group/cover/View.js
//photo/src/group/detail/Mgr.js
//photo/src/group/detail/Panel.js
//photo/src/group/detail/Photo_view.js
//photo/src/group/detail/Store.js
//photo/src/group/detail/Titlebar.js
//photo/src/group/detail/View.js
//photo/src/group/detail/groupdialog/View.js
//photo/src/group/detail/grouplist/View.js
//photo/src/group/drag_sort.js
//photo/src/photo.js
//photo/src/photo/Mgr.js
//photo/src/photo/Panel.js
//photo/src/photo/Record.js
//photo/src/photo/Store.js
//photo/src/photo/Thumb_loader.js
//photo/src/photo/View.js
//photo/src/time/Panel.js
//photo/src/time/Photo_Node.js
//photo/src/time/Select.js
//photo/src/time/Time_Group.js
//photo/src/time/cgi.js
//photo/src/time/menu.js
//photo/src/time/store.js
//photo/src/time/view.js
/**
 * 显示模式（View_mode）的组合模式（Composite），它本身是一个显示模式，但同时也含几个子模式
 * @author cluezhang
 * @date 2013-11-27
 */
define.pack("./Composite_view_mode",["lib","./View_mode","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        View_mode = require('./View_mode'),
        $ = require('$');
    var toolbar_event_name = 'toolbar_meta_changed';
    var Module = inherit(View_mode, {
        /**
         * @cfg {String} mode 当前的模式
         */
        mode : null,
        /**
         * 获取子模式的实例
         * @param {String} mode_name
         * @return {View_mode} mode
         */
        get_mode_instance : function(mode_name){
            return this.get_singleton('mode_'+mode_name);
        },
        /**
         * @return {View_mode} mode
         */
        get_current_mode_instance : function(){
            if(this.mode){
                return this.get_mode_instance(this.mode);
            }
            return null;
        },
        /**
         * 切换子模块
         * @param {String} mode_name
         */
        switch_mode : function(mode_name){
            var old_mode_name = this.mode,
                old_mode, mode;
            if(old_mode_name && (old_mode = this.get_mode_instance(old_mode_name))){
                if(this.activated){
                    this.on_mode_deactivate(old_mode_name, old_mode);
                }
                this.mode = null;
            }
            mode = this.get_mode_instance(mode_name);
            if(mode){
                if(this.activated){
                    this.on_mode_activate(mode_name, mode);
                }
                this.mode = mode_name;
            }
        },
        /**
         * 当有子模块切换走时调用
         * @private
         */
        on_mode_deactivate : function(mode_name, mode){
            mode.off(toolbar_event_name, this.delegate_toolbar_change, this);
            this.trigger('modedeactivate', mode_name, mode);
            mode.deactivate();
        },
        /**
         * 当有子模块切换来时调用
         * @private
         */
        on_mode_activate : function(mode_name, mode){
            mode.set_size(this.size);
            mode.activate();
            this.trigger('modeactivate', mode_name, mode);
            mode.on(toolbar_event_name, this.delegate_toolbar_change, this);
            this.delegate_toolbar_change(mode.get_toolbar_meta());
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                this.on_mode_activate(this.mode, mode);
            }
        },
        on_deactivate : function(){
            var mode = this.get_current_mode_instance();
            if(mode){
                this.on_mode_deactivate(this.mode, mode);
            }
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        delegate_toolbar_change : function(meta){
            this.trigger(toolbar_event_name, meta);
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.on_refresh.apply(mode, arguments);
            }
        },
        on_resize : function(){
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.set_size(this.size);
            }
            Module.superclass.on_resize.apply(this, arguments);
        },
        on_reachbottom : function(){
            Module.superclass.on_reachbottom.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.on_reachbottom();
            }
        },
        on_toolbar_act : function(){
            Module.superclass.on_toolbar_act.apply(this, arguments);
            var mode = this.get_current_mode_instance();
            if(mode){
                mode.on_toolbar_act.apply(mode, arguments);
            }
        },
        get_toolbar_meta : function(){
            var mode = this.get_current_mode_instance();
            if(mode){
                return mode.get_toolbar_meta.apply(mode, arguments);
            }
        }
    });
    return Module;
});/**
 * 相册主面板
 * @author cluezhang
 * @date 2013-11-27
 */
define.pack("./Panel",["lib","./Composite_view_mode","./group.Panel","./photo.Panel","./time.Panel","./photo.Thumb_loader","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        Composite_view_mode = require('./Composite_view_mode'),
        View_mode_group = require('./group.Panel'),
        View_mode_all = require('./photo.Panel'),
        View_mode_time = require('./time.Panel'),
        Thumb_loader = require('./photo.Thumb_loader'),
        
        $ = require('$');
    var Module = inherit(Composite_view_mode, {
        /**
         * @cfg {jQueryElement} $ct
         */
        create_thumb_loader : function(){
            return new Thumb_loader({
                width : 128,
                height : 128
            });
        },
        // 存储分组信息的store，除了分组列表外，它还会提供给其它地方使用，比如上传图片选择分组列表。
        create_group_store : function(){
            var me = this;
            return new Store({
                reload : function(){
                    var def = $.Deferred(), store = this;
                    me.get_singleton('group_loader').load().done(function(records){
                        store.load(records);
                        def.resolve();
                    }).fail(function(){
                        def.reject();
                    });
                    return def;
                }
            });
        },
        // -------------- 各视图的创建 ----------------
        create_mode_time : function(){
            return new View_mode_time({
                $ct : this.$ct,
                thumb_loader : this.get_singleton('thumb_loader')
            });
        },
        create_mode_group : function(){
            return new View_mode_group({
                $ct : this.$ct,
                thumb_loader : this.get_singleton('thumb_loader')
            });
        },
        create_mode_all : function(){
            return new View_mode_all({
                $ct : this.$ct,
                thumb_loader : this.get_singleton('thumb_loader')
            });
        }
        // ---------------视图创建结束 ----------------
    });
    return Module;
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
        mini_tip = common.get('./ui.mini_tip'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),

        undefined;

    var Remover = inherit(Event, {

        /**
         * 先弹框提示，确认后再删除
         * @param {Array<FileNode>} files
         * @param {String} desc 描述
         * @returns {*}
         */
        remove_confirm: function(files, desc) {
            var me = this,
                def = $.Deferred();

            files = [].concat(files);
            desc = desc || (files.length>1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？');
            widgets.confirm(
                '删除图片',
                desc,
                '已删除的图片可以在回收站找到',
                function () {
                    progress.show("正在删除0/"+files.length);
                    me
                        .do_remove(files)
                        .progress(function(success_files){
                            progress.show("正在删除" + success_files.length+"/"+files.length);
                        }).done(function(success_files, failure_files){
                            if(!success_files.length && failure_files.length) {//全部不成功
                                mini_tip.warn('图片删除失败');
                            }if(failure_files.length){
                                mini_tip.warn('部分图片删除失败:' + this.get_part_fail_msg());
                            }else{
                                mini_tip.ok('删除图片成功');
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
 * 用于相册的cgi接口封装
 * @author cluezhang
 * @date 2013-11-8
 */
define.pack("./Requestor",["lib","common","./photo.Record","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        
        Group_record = lib.get('./data.Record'),
        date_time = lib.get('./date_time'),
        Photo_record = require('./photo.Record'),
        
        $ = require('$');
    var Processor = inherit(Object, {
        constructor : function(options){
            $.extend(this, options);
        },
        empty : function(){
            return this.records.length<=0;
        }
    });

    var lib_v3_enable = false;
    query_user.on_ready(function(user) {
        if(user.is_lib3_user()) {
            lib_v3_enable = true;
        }
    });

    var Requestor = inherit(Event, {
        canceled : {},
        group_cgi : 'http://web2.cgi.weiyun.com/pic_group.fcg',
        lib_cgi : 'http://web2.cgi.weiyun.com/lib_list.fcg',
        default_cgi : 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        _get : function(url, cmd, header, body, post_process){
            return this._request(url, cmd, header, body, post_process, false);
        },
        _post : function(url, cmd, header, body, post_process){
            return this._request(url, cmd, header, body, post_process, true);
        },
        /*jshint maxparams:6*/
        _request : function(url, cmd, header, body, post_process, use_post){
            var def = $.Deferred(), me = this;
            var pb_v2 = cmd.indexOf('_') < 0 ? true : false;
            var req = request[use_post ? 'xhr_post' : 'xhr_get']({
                url : url,
                cmd : cmd,
                pb_v2: pb_v2,
                header : header,
                body : body,
                cavil : true
            });
            
            def.abort = function(){
                if(def.state() === 'pending'){
                    // 提前reject，后面request fail里的reject会自动无视
                    def.reject(me.canceled);
//                    request.abort();
                    req.destroy();
                }
            };
            req.ok(function(msg, body, header, data){
                var args;
                if(post_process){
                    args = post_process.apply(this, arguments);
                }else{
                    args = $.makeArray(arguments);
                }
                def.resolve.apply(def, args);
            }).fail(function(msg, ret, body, header, data){
                def.reject(msg, ret, body, header, data);
            });
            
            return def;
        },
        // 创建分组
        create_group : function(name){
            var cmd = lib_v3_enable ? 'LibCreatePicGroup' : 'create_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {
                    group_name : name
                },
                function(msg, body, header, data){
                    return [new Group_record({
                        id : body.group_id,
                        name : body.group_name,
                        create_time : new Date(),
                        modify_time : new Date(),
                        size : 0
                    }, body.group_id)];
                }
            );
        },
        // 删除分组
        delete_group : function(record){
            var cmd = lib_v3_enable ? 'LibDeletePicGroup' : 'delete_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {
                    group_id : record.get('id'),
                    group_name : record.get('name')
                }
            );
        },
        rename_group : function(group_id, old_name, new_name){
            var cmd = lib_v3_enable ? 'LibModPicGroup' : 'modify_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {
                    group_id : group_id,
                    src_group_name : old_name,
                    dst_group_name : new_name
                }
            );
        },
        //
        set_group_album : function(group_id, cover_record){
            var cmd = lib_v3_enable ? 'LibSetGroupCover' : 'set_cover';

            var body = {
                group_id : group_id,
                covers : [
                    {
                        file_id : cover_record.get_id()
                    }
                ]
            }
            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg';
                body = {
                    group_id: group_id,
                    file_id: cover_record.get_id(),
                    pdir_key: cover_record.get_pid()
                };
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                body
            );
        },
        // 设置分组顺序
        set_group_orders : function(groups){
            var orders = [];
            $.each(groups, function(index, group){
                orders.push(group.get('id'));
            });
            var cmd = lib_v3_enable ? 'LibSetGroupOrder' : 'set_order';

            var body = {
                order : orders
            };
            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg';
                body = {
                    group_id_list: orders
                }
            }

            return this._post(
                this.group_cgi,
                cmd,
                {},
                body
            );
        },
        // 加载分组
        load_groups : function(){
            var cmd = lib_v3_enable ? 'LibGetPicGroup' : 'get_group';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.group_cgi,
                cmd,
                {},
                {},
                function(msg, body, header, data){
                    var groups = [],
                        pic_group;
                    pic_group = lib_v3_enable ? body.groups : body.pic_group;
                    $.each(pic_group, function(index, group){
                        groups.push(new Group_record({
                            id : group.group_id,
                            name : group.group_name,
                            create_time : group.group_ctime,
                            modify_time : group.group_mtime,
                            size : lib_v3_enable ? group.total_count: group.total,
                            cover : lib_v3_enable ? [group.file_item] : group.cover,
                            readonly : group.group_id === 1
                        }, group.group_id));
                    });
                    return [groups];
                }
            );
        },
        // 分步移动照片，不限定移动数量
        move_photo_threshold : 100,
        Move_processor : inherit(Processor, {
            get_next : function(){
                var records = this.records;
                var todos = records.slice(0, this.max);
                this.records = records.slice(todos.length);
                return todos;
            },
            process : function(records){
                return this.requestor.move_photos(records, this.old_group_id, this.group_id);
            }
        }),
        step_move_photos : function(records, old_group_id, group_id){
            return this.step_process(new this.Move_processor({
                max : this.move_photo_threshold,
                requestor : this,
                records : records,
                old_group_id : old_group_id,
                group_id : group_id
            }));
        },
        // 移动照片分组
        move_photos : function(records, old_group_id, group_id){
            var items = [];
            $.each(records, function(index, record){
                if(lib_v3_enable) {
                    items.push({
                        pdir_key : record.get_pid(),
                        file_id : record.get_id(),
                        filename : record.get_name()
                    });
                } else {
                    items.push({
                        pdir_key : record.get_pid(),
                        file_id : record.get_id(),
                        file_name : record.get_name()
                    });
                }
            });
            var cmd = lib_v3_enable ? 'LibBatchMovePicToGroup' : 'move_pic';

            if(lib_v3_enable) {
                this.group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._post(
                this.group_cgi,
                cmd,
                {},
                {
                    src_group_id : old_group_id,
                    dst_group_id : group_id,
                    items : items
                },
                // 可能有部分成功
                function(msg, body, header, data){
                    var success = [], fails = [];
                    var results = lib_v3_enable ? body.items : body.results;
                    if(results){ // 当返回了各子项的结果时，区别对待
                        $.each(results, function(index, result){
                            // 判断返回码
                            var ret = parseInt(result.result || result.op_retcode, 10);
                            if(ret === 0){
                                success.push(records[index]);
                            }else{
                                fails.push(records[index]);
                            }
                        });
                    }else{ // 当没有返回各子项结果，当作全成功
                        success = records;
                    }
                    return [success, fails];
                }
            );
        },
        step_process : function(processor){
            var def = $.Deferred();
            
            var me = this,
                success_records = [],
                failure_records = [],
                last_failure_msg;
            
            var next = function(){
                var todos;
                // 如果处理完了，返回结果
                if(processor.empty()){
                    if(success_records.length){
                        def.resolve(success_records, failure_records);
                    }else{
                        def.reject(last_failure_msg, failure_records);
                    }
                    return;
                }
                // 取出这次要处理的记录
                todos = processor.get_next();
                
                processor.process(todos).done(function(succ, fail){
                    success_records = success_records.concat(succ);
                    failure_records = failure_records.concat(fail);
                }).fail(function(msg){
                    last_failure_msg = msg;
                    failure_records = failure_records.concat(todos);
                }).always(function(){
                    def.notify(success_records, failure_records);
                    next();
                });
            };
            
            next();
            
            return def;
        },
        Delete_processor : inherit(Processor, {
            max : 10,
            get_next : function(){
                var me = this,
                    records = me.records,
                    todos = [],
                    lefts = [],
                    pdir_key = records[0].get_pid();
                $.each(records, function(index, record){
                    if(record.get_pid() === pdir_key){
                        todos.push(record);
                    }else{
                        lefts.push(record);
                    }
                    if(todos.length >= me.max){
                        lefts = lefts.concat(records.slice(index+1));
                        return false;
                    }
                });
                me.records = lefts;
                
                return todos;
            },
            process : function(records){
                return this.requestor.delete_photos(records);
            }
        }),
        step_delete_photos : function(records){
            return this.step_process(new this.Delete_processor({
                requestor : this,
                records : records
            }));
        },
        // 批量删除照片 private 
        delete_photos : function(records){
            var items = [];
            $.each(records, function(index, record){
                items.push({
                    ppdir_key : record.get_ppid(),
                    pdir_key : record.get_pid(),
                    file_id : record.get_id(),
                    file_name : encodeURIComponent(record.get_name()),
                    file_ver: record.get_file_ver()
                });
            });
            return this._post(
                this.default_cgi,
                'batch_file_delete',
                {},
                {
                    del_files : items
                },
                // 可能有部分成功
                function(msg, body, header, data){
                    var success = [], fails = [];
                    if(body.results){ // 当返回了各子项的结果时，区别对待
                        $.each(body.results, function(index, result){
                            // 判断返回码，1020文件不存在也作为成功
                            var ret = parseInt(result.result, 10);
                            if(ret === 0 || ret === 1020){
                                success.push(records[index]);
                            }else{
                                fails.push(records[index]);
                            }
                        });
                    }else{ // 当没有返回各子项结果，当作全成功
                        success = records;
                    }
                    return [success, fails];
                }
            );
        },
        // 加载照片，如果不传group_id则加载全部
        load_photos : function(group_id, offset, size){
            var cmd = lib_v3_enable ? 'LibPageListGet' : 'get_lib_list';

            if(lib_v3_enable) {
                this.lib_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return this._request(
                this.lib_cgi,
                cmd,
                {},
                {
                    lib_id : 2,
                    offset : offset,
                    count : size,
                    sort_type : 1,
                    group_id : group_id || 0,
	                get_abstract_url: true  // 2016.07.04 add by iscowei 返回图片/视频的缩略图url
                },
                function(msg, body, header, data){
                    var photos = [];
                    /*
                     *  "file_ctime": 1347262430000,
    "file_id": "a7490880-006f-43ec-b908-5cf2f281b262",
    "file_md5": "ebd13e0f23436b9c9db7bb9b66cddf0d",
    "file_mtime": 1347262431000,
    "file_name": "20120522155129806.JPG",
    "file_sha": "67fe8dc8e31997c0a4be7694ae9c6f9baa7fc41a",
    "file_size": 1898066,
    "file_ttime": 1337560283000,
    "pdir_key": "e01985017023fa68fb65097660cf0cf0"
    
    id: obj['file_id'],
                    name: attr['file_name'],
                    size: parse_int(obj['file_size']) || 0,
                    cur_size: parse_int(obj['file_cur_size']) || 0,
                    create_time: obj['file_ctime'],
                    modify_time: attr['file_mtime'],
                    life_time:obj['file_life_time'],
                    belong_type:obj['belong_type'],
                    uin:obj['uin'],
                    nickname:obj['nickname'],
                    file_md5: obj['file_md5'],
                    file_sha: obj['file_sha'],
                    file_ver: obj['file_ver'],
                    file_note:obj['file_note']
                     */
                    var list_items = lib_v3_enable ? body.FileItem_items: body.list_item;
                    if(list_items){
                        $.each(list_items, function(index, photo){
                            photos.push(new Photo_record({
                                id : photo.file_id,
                                create_time : photo.file_ctime,
                                file_md5 : photo.file_md5,
                                modify_time : photo.file_mtime,
                                name : photo.file_name || photo.filename,
                                file_sha : photo.file_sha,
                                size : photo.file_size,
                                cur_size : photo.file_size, // 默认没有破损 TODO 需后台确认
                                take_time : photo.file_ttime || photo.ext_info && photo.ext_info.take_time && date_time.timestamp2date(photo.ext_info.take_time),
                                pid : photo.pdir_key,
                                ppid : photo.ppdir_key,
                                file_ver : photo.file_version,
	                            ext_info : photo.ext_info
                            }));
                        });
                    }
                    var end = lib_v3_enable ? body.finish_flag : body.end;
                    // TODO 要返回总数，目前返回的是end标记
                    return [photos, end];
                }
            );
        }
    });
    return Requestor;
});/**
 * 相册视频切换
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./Switch_view",["lib","$","./tmpl"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var tmpl = require('./tmpl');
    var Module = inherit(Event, {
        mode_attr : 'data-vm',
        active_class : 'on',
        /**
         * @cfg {String} mode 初始时所处的模式
         */
        /**
         * @event switch 当模式切换时触发
         * @param {String} mode 可以为time、group、all三种模式
         */
        constructor : function(cfg){
            $.extend(this, cfg);
            // 初始视图
            var mode = this.mode;
            if(mode){
                this.mode = '';
                this.set_mode(mode, true);
            }
        },
        render : function(){
            var $el, me;
            if(!this.rendered){
                me = this;
                $el = this.$el = $(tmpl.view_switch({
                    mode : me.mode
                })).appendTo(this.$ct);
                this.rendered = true;
                
                $el.on('click', '['+this.mode_attr+']', function(e){
                    e.preventDefault(); // 增强健壮性，防止set_mode出错后进行了hash跳转，从而跳到网盘了
                    var $dom = $(this);
                    me.set_mode($dom.attr(me.mode_attr));
                });
            }
        },
        /**
         * 更改当前的模式
         * @param {String} mode
         * @param {Boolean} silent (optional) 是否静默操作，即不触发事件
         */
        set_mode : function(mode, silent){
            var old_mode = this.mode;
            if(mode !== old_mode){
                this.mode = mode;
                if(this.rendered){
                    this.$el.find('['+this.mode_attr+'="'+mode+'"]').addClass(this.active_class).siblings().removeClass(this.active_class);
                }
                this.trigger('switch', mode);
            }
        },
        /**
         * 获取当前处于的模式
         * @return {String} mode
         */
        get_mode : function(){
            return this.mode;
        }
    });
    return Module;
});/**
 * 将每个视图抽象出来，规定好接口，供总的相册使用
 * 目前考虑到要有的接口有：
 * deactivate/activate  在切换走后，为了性能可以考虑全部重绘，当然保留dom也行，看内部实现
 * on_toolbar_act  当工具栏点击后，通知视图内部进行操作处理
 * get_toolbar_meta  获取工具栏配置，比如哪些按钮显示，其它的都隐藏
 * toolbar_meta_change  当工具栏配置变化时，发出事件，供外部进行调整
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./View_mode",["lib","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @event toolbar_meta_changed 当工具栏配置变化时，发出事件，供外部进行调整
         * @param {Object} meta
         */
        /**
         * @cfg {jQueryElement} $ct 放置的容器
         */
        constructor : function(cfg){
            $.extend(this, cfg);
            this._singletons = {};
        },
        get_singleton : function(name){
            var singletons = this._singletons,
                o = null, fn_name;
            if(singletons.hasOwnProperty(name)){
                o = singletons[name];
            }else{
                fn_name = 'create_'+name;
                if(typeof this[fn_name] === 'function'){
                    o = singletons[name] = this['create_'+name]();
                }
            }
            return o;
        },
        release_singleton : function(name){
            var singletons = this._singletons, o;
            if(singletons.hasOwnProperty(name)){
                o = singletons[name];
                if(o && o.destroy){
                    o.destroy();
                }
                delete singletons[name];
            }
        },
        activate : function(){
            if(this.activated){
                return;
            }
            this.activated = true;
            this.on_activate();
            this.trigger('activate');
        },
        on_activate : $.noop,
        deactivate : function(){
            if(!this.activated){
                return;
            }
            this.activated = false;
            this.on_deactivate();
            this.trigger('deactivate');
        },
        on_deactivate : $.noop,
        refresh : function(){
            if(!this.activated){
                return;
            }
            this.on_refresh();
        },
        on_refresh : $.noop,
        on_reachbottom : $.noop,
        /**
         * 当外容器大小变动时调用，以便视图调整
         */
        set_size : function(size){
            this.size = size;
            this.on_resize();
        },
        on_resize : $.noop,
        /**
         * 当工具栏点击后，通知视图内部进行操作处理，由管理工具栏的父模块进行调用
         * @param {String} act
         */
        on_toolbar_act : $.noop,
        /**
         * 获取工具栏配置，比如哪些按钮显示，其它的都隐藏
         * @return {Object} meta
         */
        get_toolbar_meta : $.noop
    });
    return Module;
});/**
 * @author trump
 * @date 2013-11-13
 */
define.pack("./axisMap",["$","lib"],function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),

        UN_REACHABLE = Math.pow(2, 30);//足够遥远以至于不能到达
    /**
     * 节点搜索工具对象
     * @type {{_int_css: Function, _first_visible_child: Function, _real_xy: Function, for_common_cell: Function, for_points: Function}}
     */
    var search = {
        _int_css: function ($el, attr_name) {
            return parseInt($el.css(attr_name)) || 0;
        },
        _first_visible_child: function ($els, filter) {
            for (var i = 0, l = $els.length; i < l; i++) {
                var el = $els[i],
                    n = el.firstChild;

                if (!n)
                    continue;

                for (; n; n = n.nextSibling) {
                    if (filter) {
                        if ($(n).is(filter))
                            return n;

                    } else {
                        if (n.nodeType === 1)
                            return n;
                    }
                }
            }
        },
        _real_xy: function (opt, list_par) {
            var me = this,
                $list_par = $(list_par),
                list_par_offs = $list_par.offset();
            var xy = {
                x: (list_par_offs.left + opt.$scroller.scrollLeft()) + me._int_css($list_par, 'paddingLeft'),
                y: (list_par_offs.top + opt.$scroller.scrollTop()) + me._int_css($list_par, 'paddingTop')
            };

            return xy;
        },

        for_common_cell: function (opt) {
            var first_cell = this._first_visible_child(opt.$els.filter(':visible'), opt.child_filter);
            if (!first_cell || !first_cell.id) {
                return null;
            }
            var $first_cell = $(first_cell);
            return {
                width: $first_cell.outerWidth() + this._int_css($first_cell, 'marginLeft') + this._int_css($first_cell, 'marginRight'),
                height: $first_cell.outerHeight() + this._int_css($first_cell, 'marginTop') + this._int_css($first_cell, 'marginBottom')
            };
        },
        /**
         * 重新计算所有单元格的位置（通过第一个单元格推算）
         * @param opt {
         *      {
         *          $scroller:'产生滚动条jQuery Object',
         *          $els: '匹配元素的父级元素jQuery Object',
         *          container_width:'计算容器宽度的function',
         *          child_filter:'匹配元素的选择器'
         *      }
         *  }
         */
        for_points: function (opt) {
            var me = this,
                out_size = me.for_common_cell(opt);
            if (!out_size) {
                return;
            }
            var points = [],
                cell_height = out_size.height, // 行高度
                cell_width = out_size.width, // 单元格宽度
                container_width = opt.container_width,

                list_par, // 列表容器
                list_xy,  // 列表位置
                row_index = 0, cell_index = 0; // 当前正在计算的行索引

            // 便利子元素计算位置
            var iter_cell = function (cell) {
                // 跨父容器后相对于新父节点计算位置
                if (list_par != cell.parentNode) {
                    list_par = cell.parentNode;
                    row_index = 0; // 跨父容器后，重置行索引
                    cell_index = 0;
                    list_xy = me._real_xy(opt, list_par);
                }

                // 如果超出宽度，折行。此时 row_index++, cell_index=0
                var x1 , y1;
                if (cell_width * (cell_index + 1) > container_width) {
                    row_index++;
                    cell_index = 0;
                    x1 = 0;
                } else {
                    x1 = cell_width * cell_index;
                }
                y1 = cell_height * row_index;

                points.push(new Point({
                    left: x1 + list_xy.x,
                    top: y1 + list_xy.y,
                    id: cell.id
                }));
                cell_index++;
            };

            if (opt.child_filter) {
                $.each(opt.$els, function (i, $el) {
                    $.each($($el).children(opt.child_filter), function (j, cell) {
                        iter_cell(cell);
                    });
                });
            }


            return points;
        }
    };

    var Point = function (opt) {
        this._top = opt.top;
        this._left = opt.left;
        this._id = opt.id;
    };

    $.extend(Point.prototype, {
        get_id: function () {
            return this._id;
        },
        get_top: function () {
            return this._top;
        },
        get_left: function () {
            return this._left;
        }
    });

    var AxisMap = function (opt) {
        this.o = $.extend({
            ns: 'common',
            $el: '',
            get_$els: null,
            $scroller: '',
            container_width: $.noop,
            child_filter: ''
        }, opt);
    };

    //私有方法
    $.extend(AxisMap.prototype, {
        /**
         * 获取最靠近的坐标X轴或Y轴
         * @param axis {Array<Number>}
         * @param target {Number}
         * @return {int}
         */
        _get_near_axis: function (axis, target) {
            var pos = axis.length - 1,
                max = axis[pos],
                min = axis[0];
            if (target >= max)
                return max;
            if (target <= min)
                return min;

            var diff = 0;
            while (diff >= 0 && pos > 0) {
                pos -= 1;
                diff = axis[pos] - target;
            }
            if (diff > 0) {
                return min;
            }
            if (axis[pos + 1]) {
                if (axis[pos + 1] - target < Math.abs(diff)) {
                    return axis[pos + 1];
                }
            }
            return axis[pos];
        },
        /**
         * 获取最后一点坐标点
         * @return {Point}
         * @private
         */
        _get_last_point: function () {
            var me = this, y_max = me.get_y_max();
            return me._get_map().y_axis[y_max][me._get_map().y_axis[y_max - 1]];
        },
        /**
         * 传入坐标点中的最近的坐标点
         * @param points
         * @param key_name
         * @param search_value
         * @returns {*}
         */
        _get_near_point: function (points, key_name, search_value) {
            if (!points || !points.length) {
                return null;
            }
            var diff = UN_REACHABLE,
                method_name = key_name === 'left' ? 'get_left' : 'get_top',
                match,
                point,
                len = points.length;
            while (len) {
                len -= 1;
                point = points[len];
                var match_val = point[method_name].call(point);
                if (match_val === search_value) {//已找到
                    return point;
                }
                if (Math.abs(match_val - search_value) < diff) {
                    match = points[len];
                    diff = Math.abs(match_val - search_value);
                }
            }
            return match;
        },
        /**
         * 坐标集合
         */
        _get_map: function () {
            return this._map;
        },
        /**
         * 计算坐标系
         * @param points {Array<Point>}
         */
        _paint_axis: function (points) {
            //清空坐标系
            this.x_step = [];//X轴含有的坐标点
            this.y_step = [];//X轴含有的坐标点
            this._map = {x_axis: {}, y_axis: {}};
            this.ids = [];

            if (!points || !points.length)
                return;

            //添加坐标点
            var len = points.length;
            while (len) {
                len -= 1;
                var point = points[len], top = point.get_top(), left = point.get_left();
                this.ids.push(point.get_id());
                (this._get_map().y_axis[top] ? this._get_map().y_axis[top] : (this._get_map().y_axis[top] = []) ).push(point);
                (this._get_map().x_axis[left] ? this._get_map().x_axis[left] : (this._get_map().x_axis[left] = []) ).push(point);
            }

            //排序坐标点
            this._sort_axis(this._get_map().y_axis, this.y_step, 'get_left');
            this._sort_axis(this._get_map().x_axis, this.x_step, 'get_top');
        },
        /**
         * 排序指定坐标
         * [4:{...},2:{...},1:{...},7:{...},9:{...},8:{...}] ==> [1,2,4,7,8,9]
         * @param axis {HashMap<String,Array>}
         * @param axis_step {Array}
         * @param get_fn {String}
         */
        _sort_axis: function (axis, axis_step, get_fn) {
            for (var key in axis) {
                axis_step.push(key - 0);//放入数组
                axis[key - 0].sort(function (y1, y2) {//子集升序排列
                    return y1[get_fn].call(y1) > y2[get_fn].call(y2) ? 1 : -1;
                });
            }
            axis_step.sort(function (y1, y2) {//升序排列
                return y1 > y2 ? 1 : -1;
            });
        }

    });

    //销毁、重绘地图
    $.extend(AxisMap.prototype, {
        /**
         * 销毁坐标地图
         */
        destroy: function () {
            delete this.x_step;
            delete this.y_step;
            delete this._map;
        },
        /**
         * 重绘坐标地图
         */
        re_paint: function () {
            var opt = {//搜索参数
                    container_width: this.o.container_width.call(this),
                    $scroller: this.o.$scroller,
                    $els: this.o.$el || this.o.get_$els.call(this),
                    child_filter: this.o.child_filter
                },
                points = search.for_points(opt),
                outSize = search.for_common_cell(opt);

            if (points) {
                this._paint_axis(points);
                this.width = outSize.width;
                this.height = outSize.height;
            }
            return this;
        }
    });

    //匹配元素的方法
    $.extend(AxisMap.prototype, {
        /**
         * 获取靠左的元素
         * @param point {Point} 坐标点
         * @param [except_id] {String} 排除节点ID
         * @return {null|Point}
         */
        get_left_point: function (point, except_id) {
            var y_axis = this._get_map().y_axis[point.get_top()],//对应y轴上所有的坐标
                y_len = y_axis.length,
                left_point;
            while (y_len) {
                y_len -= 1;
                if (y_axis[y_len].get_left() === point.get_left()) {
                    if (y_axis[y_len - 1] && (!except_id || except_id !== y_axis[y_len - 1].get_id())) {
                        left_point = y_axis[y_len - 1];
                    }
                    break;
                }
            }
            return left_point;
        },
        /**
         * 获取靠右的元素
         * @param point {Point} 坐标点
         * @param except_id {String} 排除节点ID
         * @return {null|Point}
         */
        get_right_point: function (point, except_id) {
            var y_axis = this._get_map().y_axis[point.get_top()],//对应y轴上所有的坐标
                y_len = y_axis.length,
                left_point;
            while (y_len) {
                y_len -= 1;
                if (y_axis[y_len].get_left() === point.get_left()) {
                    if (y_axis[y_len + 1] && (!except_id || except_id !== y_axis[y_len + 1].get_id())) {
                        left_point = y_axis[y_len + 1];
                    }
                    break;
                }
            }
            return left_point;
        },
        /**
         * 获取坐标范围内的坐标点id(优先y轴比较)
         * @param max_x
         * @param min_x
         * @param max_y
         * @param min_y
         */
        match_range: function (max_x, min_x, max_y, min_y) {
            var id_array = [], y_step = this.y_step, y_len = y_step.length, ind = 0, step;
            min_y -= (this.height - 10);//像素的偏差
            while (ind < y_len) {
                step = y_step[ind];
                ind += 1;
                if (step < min_y) {
                    continue;
                }
                if (step > max_y) {
                    break;
                }
                $.each(this._get_map().y_axis[step],function(i,point){
                    var left = point.get_left();
                    if (left <= max_x && left >= min_x) {
                        id_array.push(point.get_id());
                    }
                });
            }
            return id_array;
        },
        /**
         * 匹配选中的节点
         * @param offset
         */
        point_match: function (offset) {
            var me = this, point = null, map = me._get_map();
            var near_y = me._get_near_axis(me.y_step, offset.top),
                near_x = me._get_near_axis(me.x_step, offset.left),
                y_max = me.get_y_max(),
                near_y_point = me._get_near_point(map.y_axis[near_y], 'left', near_x);
            if (offset.top > y_max) {//超过最大Y轴边界
                if (offset.top > y_max + me.height) {//完全超出
                    point = me._get_last_point();
                } else {//只超出一个身位
                    if (Math.abs(near_y_point.get_left() - offset.left) > me.width) {//最近的Y轴元素的X轴超过一个身位
                        point = me._get_last_point();
                    }
                }
            }
            if (!point) {
                point = near_y_point;
            }
            return {
                'point': point,
                'left': (point.get_left() >= offset.left)
            };
        }
    });

    //排序检测
    $.extend(AxisMap.prototype, {
        /**
         * 获取Y轴最大值
         * @return {int}
         */
        get_y_max: function () {
            return this.y_step[ this.y_step.length - 1];
        },
        /**
         * 获取x轴最大值
         * @return {int}
         */
        get_x_max: function () {
            return this.x_step[ this.x_step.length - 1];
        }
    });

    return {
        get_instance: function (opt) {
            return new AxisMap(opt);
        }
    }
});/**
 * 分组视图中的 分组列表
 * @author cluezhang
 * @date 2013-11-27
 */
define.pack("./group.Group_panel",["lib","common","./View_mode","./group.Mgr","./group.View","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        
        View_mode = require('./View_mode'),
        Group_mgr = require('./group.Mgr'),
        Group_view = require('./group.View'),
        
        $ = require('$');
    var Module = inherit(View_mode, {
        create_view : function(){
            var me = this;
            var view = new Group_view({
                store : this.store,
                thumb_loader : this.thumb_loader,
                $ct: this.$ct,
                enable_drag_sort: true
            });
            view.on('opengroup', function(record){
                me.trigger('entergroup', record);
                user_log('ALBUM_GROUP_ENTER');
            });
            var mgr = this.get_singleton('mgr');
            view.on('action', mgr.process_action, mgr);
            return view;
        },
        create_mgr : function(){
            var mgr = new Group_mgr({
                store : this.store,
                thumb_loader : this.thumb_loader
            });
            return mgr;
        },
        // 当处于编辑时，要锁住外界触发的组列表更新
        is_editing : function(){
            return this.get_singleton('view').is_editing();
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            this.store.reload().done(function(){
                mini_tip.ok('列表已更新');
            });
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            this.store.reload();
            this.get_singleton('view').render(this.$ct);
        },
        on_deactivate : function(){
            this.release_singleton('view');
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        on_resize : function(){
            Module.superclass.on_resize.apply(this, arguments);
            this.get_singleton('view').refresh_drag_sort();
        },
        on_toolbar_act : function(act, e){
            var records, mgr, view;
            mgr = this.get_singleton('mgr');
            view = this.get_singleton('view');
            mgr.process_action(act, view.get_selected ? view.get_selected() : [], e, view.get_action_extra());
        },
        get_toolbar_meta : function(){
            return {
                create_group : 1
            };
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-11-7
 */
define.pack("./group.Mgr",["lib","common","./Requestor","./group.detail.Store","./group.cover.View","./tmpl","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        ds_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        
        Requestor = require('./Requestor'),
        Group_record = lib.get('./data.Record'),
        Group_detail_store = require('./group.detail.Store'),
        Group_cover_view = require('./group.cover.View'),
        tmpl = require('./tmpl'),
        
        $ = require('$');
    var requestor = new Requestor();
    var byte_len = function(str){
        return encodeURIComponent(str).replace(/%\w\w/g, 'a').length;
    };
    var group_name_validator = {
        verify : function(name){
            if(!name){
                return '不能为空';
            }
            if(byte_len(name)>512){
                return '过长';
            }
            if(/[\\:*?\/"<>|]/.test(name)){
                return '不能含有特殊字符';
            }
            return true;
        }
    };
    var Mgr = inherit(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        report: function(action,event){
            var self = $(event.currentTarget),
                is_menu = !!self.attr('data-action');
            switch(action){
                case('rename'):
                    if(is_menu){
                        user_log('ALBUM_GROUP_RIGHT_RENAME');
                        return;
                    }
                    user_log('ALBUM_GROUP_HOVEBAR_RENAME');
                    return;
                case('delete'):
                    if(is_menu){
                        user_log('ALBUM_GROUP_RIGHT_DEL');
                        return;
                    }
                    user_log('ALBUM_GROUP_HOVEBAR_DEL');
                    return;
                case('set_cover'):
                    if(is_menu){
                        user_log('ALBUM_GROUP_RIGHT_SET_COVER');
                        return;
                    }
                    user_log('ALBUM_GROUP_HOVEBAR_SET_COVER');
                    return;
            }
        },
        // 分派动作
        process_action : function(action_name, data, event, extra){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this.report(action_name,event);
                this[fn_name]([].concat(data), event, extra);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        common_request_fail : function(msg){
            if(msg !== requestor.canceled){
                mini_tip.error(msg);
            }
        },
        on_delete : function(records, event){
            var record = records[0],
                me = this;
            widgets.confirm(
                '删除分组',
                '确定要删除这个分组吗？',
                record.get('name'),
                function () {
                    requestor.delete_group(record).done(function(){
                        me.store.remove(record);
                        me.store.total_length --;
                        ds_event.trigger('remove', [record], {src:me.store});
                        mini_tip.ok('删除成功');
                    }).fail(function(msg){
                        if(msg !== requestor.canceled){
                            mini_tip.error(msg);
                        }
                    });
                },
                $.noop,
                null,
                true
            );
        },
        // 重命名分组
        on_rename : function(records, event, info){
            if(this.rename_task){
                //this.rename_task.reject();
                return;
            }
            var me = this,
                record = records[0],
                old_value = record.get('name'),
                def = this.rename_task = $.Deferred(),
                view = info.view;
            var editor = view.start_edit(record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    requestor.rename_group(record.get('id'), old_value, value).done(function(){
                        mini_tip.ok('修改成功');
                        def.resolve(value);
                    }).fail(function(msg){
                        me.common_request_fail(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(value){
                record.set('name', value);
                ds_event.trigger('update', record, {
                    src : me.store,
                    changes : {
                        name:1
                    }
                });
            }).always(function(){
                editor.destroy();
                me.rename_task = null;
            });
        },
        // 创建分组
        on_create_group : function(records, event, info){
            if(this.create_task){
                //this.create_task.reject();
                return;
            }
            var me = this,
                def = this.create_task = $.Deferred(),
                view = info.view,
                store = me.store,
                // 占位分组，仅用于新建
                old_value = '',
                dummy_record = new Group_record({
                    name : old_value,
                    dummy : true
                });
            store.add(dummy_record, 0);
            store.total_length++;
            var editor = view.start_edit(dummy_record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    requestor.create_group(value).done(function(record){
                        mini_tip.ok('创建成功');
                        def.resolve(record);
                    }).fail(function(msg){
                        me.common_request_fail(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(record){
                store.add(record, 0);
                store.total_length++;
                ds_event.trigger('add', [record], {
                    index : 0,
                    src : me.store
                });
            }).fail(function(){
                
            }).always(function(){
                store.remove(dummy_record);
                me.store.total_length--;
                editor.destroy();
                me.create_task = null;
            });
            
            return def;
        },
        // 设置封面
        on_set_cover : function(records, event){
            var me = this;
            var group_record = records[0];
            var $fragment_ct = $('<div></div>');
            // 当前的封面
            var old_cover = group_record.get('cover');
            old_cover = old_cover ? old_cover[0] : null;
            var cover_store = new Group_detail_store({
                group_record : group_record,
                page_size : 20
            });
            
            cover_store.reload();
            var view = new Group_cover_view({
                store : cover_store,
                initial_cover : old_cover,
                thumb_loader : this.thumb_loader
            });
            view.on('reachbottom', cover_store.load_more, cover_store);
            view.render($fragment_ct);
            // 显示错误消息
            var $msg_ct, warn = function(msg){
                if($msg_ct){
                    $msg_ct.stop().text(msg).show(0).delay(5000).hide(0);
                }else{
                    mini_tip.warn(msg);
                }
            };
            var dialog=  new widgets.Dialog({
//                out_look_2_0 : true,
                klass : 'full-pop-medium',
                title: '更改封面',
                destroy_on_hide: true,
                content: $fragment_ct,
                //tmpl : tmpl.dialog,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : '选定',
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : '取消',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : true
                    }/*, {
                        id : 'CREATE',
                        text : '创建分组',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : false
                    }*/
                ],
                handlers: {
                    OK: function (e) {
                        e.preventDefault();
                        var record = view.get_checked();
                        if(!record){
                            // 如果界面上没有选择直接点确定，什么也不做
                            dialog.hide();
                            return;
                        }
                        var group_id = group_record.get('id');
                        requestor.set_group_album(group_id, record).done(function(){
                            group_record.set('cover', [{
                                pdir_key : record.get_pid(),
                                file_id : record.get_id()
                            }]);
                            ds_event.trigger('update', group_record, {
                                src : me.store,
                                changes : {
                                    cover : 1
                                }
                            });
                            dialog.hide();
                            user_log('ALBUM_GROUP_SET_COVER_CHOSE_PIC');
                            mini_tip.ok('设置成功');
                        }).fail(function(msg){
                            if(msg !== requestor.canceled){
                                warn(msg); // TODO 移到按钮右侧显示
                            }
                        });
                    }
                }
            });
            dialog.once('render', function(){
                // 初始化消息提示
                $msg_ct = dialog.$el.find('.edit-cover-msg');
            });
            dialog.once('destroy', function(){
                view.destroy();
            });
            view.once('refresh', function() {
                dialog.show();
            });

            return dialog;
        },
        //拖动排序
        on_drag_sort: function(records, event, info){
            var me = this,
                source = records[0],
                target = records[1];
            me.store.remove(source);
            me.store.add(source , me.store.indexOf(target) +(info.is_before ? 0 : 1));
            requestor.set_group_orders(me.store.slice(0)).done(function(){
                mini_tip.ok('排序成功');
            }).fail(function(msg){
                    if(msg !== requestor.canceled){
                        mini_tip.error(msg);
                    }
                    me.store.reload();
                });
        }
    });
    return Mgr;
});/**
 * 组视图界面
 * 有GroupMgr, InGroupMgr, GroupStore, GroupView, InGroupStore, InGroupView
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./group.Panel",["lib","$","common","./View_mode","./Composite_view_mode","./Requestor","./group.Store","./group.Group_panel","./group.detail.Panel"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        Scroller = common.get('./ui.scoller'),
        ds_photo_event = common.get('./global.global_event').namespace('datasource.photo'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        
        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record');
    var View_mode = require('./View_mode'),
        Composite_view_mode = require('./Composite_view_mode'),
        Requestor = require('./Requestor'),
        
        Group_store = require('./group.Store');
    var Group_panel = require('./group.Group_panel'),
        Detail_panel = require('./group.detail.Panel');
    var requestor = new Requestor();
    var Module = inherit(Composite_view_mode, {
        create_group_store : function(){
            var store = new Group_store({
                
            });
            var me = this,
                last_refresh_time = new Date(),
                timer,
                timer_time = 0,
                handle_group_changed = function(records, meta){
                    // 如果是group_store自身触发的事件，bypass
                    if(meta.src === store){
                        return;
                    }
                    buffer_group_reload(1500);
                },
                buffer_group_reload = function(delay){
                    // 如果上次刷新在3秒内，则到第3秒才刷新
                    // 如果在3秒开外，则delay秒后刷新（此时间看后台的反应速度）
                    delay = delay || 1500;
                    var wait_time = Math.max(delay, 3000 - (new Date() - last_refresh_time));
                    var will_time = new Date() + wait_time;
                    // 如果本次预计刷新的时间比原定时间还要提前，无视掉
                    // 因为原定时间可能是考虑到后台更新延时
                    if(will_time <timer_time){
                        return;
                    }
                    clearTimeout(timer);
                    
                    timer = setTimeout(group_change_handler, wait_time);
                    timer_time = will_time;
                },
                group_change_handler = function(records, meta){
                    if(me.activated){
                        // 如果正在编辑，延后
                        if(me.mode === 'list' && me.get_mode_instance('list').is_editing()){
                            buffer_group_reload();
                        }else{
                            store.reload();
                        }
                    }
                };
            // 当外界的数据有变动时，更新之
            // 秒传时，add事件可能会很频繁
            store.listenTo(ds_photo_event, 'add remove move update', handle_group_changed);
            store.listenTo(ds_photogroup_event, 'add update', handle_group_changed);
//            store.reload();
            return store;
        },
        create_mode_list : function(){
            var mode = new Group_panel({
                store : this.get_singleton('group_store'),
                $ct : this.$ct,
                thumb_loader : this.thumb_loader
            });
            
            mode.on('entergroup', this.enter_group, this);
            
            return mode;
        },
        create_mode_detail : function(){
            var mode = new Detail_panel({
                group_store : this.get_singleton('group_store'),
                $ct : this.$ct,
                thumb_loader : this.thumb_loader
            });
            
            mode.on('back', this.back_to_list, this);
            
            return mode;
        },
        enter_group : function(record){
            this.get_mode_instance('detail').set_group(record);
            this.switch_mode('detail');
        },
        back_to_list : function(){
            this.switch_mode('list');
        },
        on_activate : function(){
            this.switch_mode('list');
            Module.superclass.on_activate.apply(this, arguments);
        },
        // private
        // 获取当前进入的组记录，如果是列表则返回null
        get_current_group : function(){
            if(this.mode === 'detail'){
                return this.get_mode_instance('detail').get_group();
            }
            return null;
        }
    });
    return Module;
});/**
 * 相片分组的数据对象，暂定有以下属性：
 * id 后台唯一id
 * name 分组名
 * create_time 创建时间
 * modify_time 修改时间
 * size 分组下有多少张图片
 * 
 * @author cluezhang
 * @date 2013-11-4
 */
define.pack("./group.Record",["lib"],function(require, exports, module){
    // 它目前没有特殊方法，直接用原生的Record
    var lib = require('lib');
    return lib.get('./data.Record');
});/**
 * 图片分组store
 * @author cluezhang
 * @date 2013-11-8
 */
define.pack("./group.Store",["lib","common","./Requestor","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        
        Requestor = require('./Requestor'),
        
        $ = require('$');
    var requestor = new Requestor();
    var Module = inherit(Store, {
        reload : function(){
            var me = this;
            widgets.loading.show();
            return requestor.load_groups().done(function(records, total){
                me.load(records, total);
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                widgets.loading.hide();
            });
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./group.View",["lib","common","$","main","./tmpl","./group.drag_sort"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        $ = require('$');
    var scroller = require('main').get('./ui').get_scroller();
    var View = lib.get('./data.View'),
        tmpl = require('./tmpl'),
        Editor = common.get('./ui.Editor');
    var Module = inherit(View, {
        dom_record_map_attr : 'data-record-id',
        enable_hovering : true,
        enable_context_menu : true,
        enable_drag_sort: false,
        list_tpl : function(){
            return tmpl.group_list();
        },
        list_selector : 'div.photo-group-box',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.group_items({
                records : records
            });
        },
        item_selector : 'div[data-list]',
        item_hover_class : 'photo-group-list-hover',
        item_menu_class : 'photo-group-menu',
        item_editing_class : 'photo-group-list-editing',
        item_tool_selector : 'a.photo-group-tool',
        item_tool_menu_selector : 'ul.photo-group-toolmenu',
        item_tool_hover_class : 'photo-group-tool-hover',
        item_tool_menu_hover_class : 'photo-group-toolmenu-hover',
        shortcuts : {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            },
            hovering : function(value, view){
                $(this).toggleClass(view.item_hover_class, value);
            },
            toolhovering : function(value, view){
                var $dom = $(this);
                $dom.find(view.item_tool_selector).toggleClass(view.item_tool_hover_class, value);
                $dom.find(view.item_tool_menu_selector).toggleClass(view.item_tool_menu_hover_class, value);
            },
            editing : function(value, view){
                $(this).toggleClass(view.item_editing_class, value);
            },
            selected : $.noop,
            checked : $.noop
        },
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 点击浮动层上的按钮后，浮动层本身隐藏
            if(this.enable_hovering){
                this.on('action', function(action, records){
                    records = [].concat(records);
                    $.each(records, function(index, record){
                        record.set('toolhovering', false);
                    });
                });
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            this.on('recordclick', this._if_enter_group, this);
            if(this.enable_hovering){
                this.$list.on('mouseenter', '>'+this.item_selector, function(){
                    // hovering时，不响应
                    if(me.context_record){
                        return;
                    }
                    var record = me.get_record(this);
                    record.set('hovering', true);
                });
                this.$list.on('mouseleave',  '>'+this.item_selector, function(){
                    var record = me.get_record(this);
                    record.set('hovering', false);
                });
                this.$list.on('mouseenter', this.item_tool_selector+','+this.item_tool_menu_selector, function(){
                    // hovering时，不响应
                    if(me.context_record){
                        return;
                    }
                    var record = me.get_record(this);
                    record.set('toolhovering', true);
                });
                this.$list.on('mouseleave', this.item_tool_selector+','+this.item_tool_menu_selector, function(){
                    var record = me.get_record(this);
                    record.set('toolhovering', false);
                });
            }
            if(this.enable_context_menu){
                this.on('recordcontextmenu', this.show_context_menu, this);
            }
        },
        // 点击浮动菜单时不触发进入分组
        _if_enter_group : function(record, event){
            event.preventDefault();
            if(!$(event.target).closest(this.item_tool_selector+','+this.item_tool_menu_selector).length && !this.is_editing()){
                this.trigger('opengroup', record, event);
            }
        },
        is_editing : function(){
            var records = this.store.slice(), i, record;
            for(i=0; i<records.length; i++){
                record = records[i];
                if(record.data.editing){
                    return true;
                }
            }
        },
        /**
         * 开始编辑某个分组，返回一个editor对象，有save及cancel事件，表示用户触发保存、取消；完成编辑则调用destroy方法
         * @param {Record} record
         * @return {Editor} editor
         */
        start_edit : function(record){
            var $dom = this.get_dom(record),
                $input;
            // 初始值设置
            var old_value = record.get('name');
            // 状态切换
            record.set('editing', true);
            // 防止record click触发
            $input = $dom.find('input');
            $input.val(old_value);
           // $input.on('click', this._prevent_record_click);

            // 开始编辑
            var editor = new Editor({
                initial_value : old_value,
                $input : $input
            });
            var me = this;
            this.on('destroy', editor.destroy, editor);
            // 编辑结束后回滚事件
            editor.on('destroy', function(){
                record.set('editing', false);
               // $input.off('click', this._prevent_record_click);
                me.off('destroy', editor.destroy, editor);
            });
            
            // 定位
            $dom[0].scrollIntoView();
            
            return editor;
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty.png',
        default_fail_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/file_img_70.png',
        thumb_width : 128,
        thumb_height : 128,
        on_update : function(){
            Module.superclass.on_update.apply(this, arguments);
            this.update_thumb();
            this.update_ellipsis();
        },
        on_remove: function(){
            Module.superclass.on_remove.apply(this, arguments);
            this.refresh_drag_sort();
        },
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_thumb();
            this.update_ellipsis();
            this.refresh_drag_sort();
        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_thumb();
            this.update_ellipsis();
            this.refresh_drag_sort();
        },
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('.photo-group-img-border').removeClass('photo-group-loading').empty().append($img);
        },
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.$list.children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record, covers, cover/*, $img_holder = $item.find('img')*/;
                var thumb_state = $item.data(thumb_state_attr);
	            var coverUrl;
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
                    covers = record.get('cover');
                    if(!covers || !covers.length){
//                        $img_holder.css({height: me.thumb_height+'px', width: me.thumb_width+'px'}).attr('src', me.default_empty_thumb_url);
                        return;
                    }
                    cover = covers[0];
                    if(!cover.file_id) {
                        return
                    }
	                if(cover.ext_info) {
		                coverUrl = constants.IS_HTTPS ? cover.ext_info.https_url : cover.ext_info.thumb_url;
	                }
                    me.thumb_loader.get(cover.pdir_key, cover.file_id, '', coverUrl).done(function(url, img){
                        var $img = $(img);
                        if(!$img.data('used')){
                            $img.data('used', true);
//                            $img_holder.replaceWith($img);
                        }else{
                            $img = $('<img />').attr('src', url);
//                            $img_holder.attr('src', url);
                        }
                        me.update_record_dom_thumb(record, $item, $img);
                    });/*.fail(function(){
                        $img_holder.css({height: me.thumb_height+'px', width: me.thumb_width+'px'}).attr('src', me.default_fail_thumb_url);
                    });*/
                }
            });
        },
        // IE6下字体缩略
        update_ellipsis : function(){
            if(!$.browser.msie || $.browser.version>6 || !this.rendered){
                return;
            }
            var ellipsis_state_attr = 'data-ellipsis-hooked',
                max_len_attr = 'data-textlen';
            var $items = this.$list.children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var ellipsis_state = $item.data(ellipsis_state_attr);
                if(!ellipsis_state){ // 没有进行处理
                    $item.data(ellipsis_state_attr, true);
                    $item.find('['+max_len_attr+']').each(function(){
                        var $dom = $(this),
                            max_len = $dom.attr(max_len_attr);
                        if($dom.width()>max_len){
                            $dom.css('width', max_len + 'px');
                        }
                    });
                }
            });
        },
        // --------------- 缩略图结束 -----------------
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_context_menu : function(record, e){
            e.preventDefault();
            
            var visibles;
            if(record.get('readonly')){
                visibles = {
                    set_cover : 1
                };
            }
            
            this.context_record = record;
            if(this.enable_hovering){
                record.set('hovering', false);
                record.set('toolhovering', false);
            }

            var menu = this.get_context_menu(), me = this;
            menu.show(e.pageX, e.pageY, visibles);
            record.set('menu_active', true);
            menu.once('hide', function(){
                me.context_record = null;
                record.set('menu_active', false);
            });
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
                    me.trigger('action', this.config.id, me.context_record, e, me.get_action_extra({src:'contextmenu'}));
                };
                menu = this.context_menu = new ContextMenu({
                    items: [
                        {
                            id: 'rename',
                            icon_class: 'ico-null',
                            group: 'edit',
                            text: '重命名',
                            click: handler
                        },
                        {
                            id: 'delete',
                            icon_class: 'ico-null',
                            group: 'edit',
                            text: '删除',
                            click: handler
                        },
                        {
                            id: 'set_cover',
                            icon_class: 'ico-null',
                            group: 'edit',
                            text: '更改封面',
                            click: handler
                        }
                    ]
                });
            }
            return menu;
        },
        /**
         * 刷新拖动分组
         */
        refresh_drag_sort: function(){
            var me = this;
            return;//3.0不能对分组排序了
            if(!me.drag_sort){
                me.drag_sort = require('./group.drag_sort');
            }
            if(me.rendered && me.enable_drag_sort){
                me.drag_sort.render({
                    $el: me.$list,
                    child_filter: '.photo-group-list-wrap',
                    drag_class: 'photo-group-themove',
                    helper_class: 'photo-group-thedrag cursor-no-drop',
                    parent: me.$ct,
                    width: 152,//组元素宽度
                    height: 187,//组元素高度
                    get_parent_all_height: function(){
                        return $('#photo-group').height();
                    },
                    $scroller: scroller.get_$el(),
                    left_class: 'photo-group-left',//元素靠左的样式
                    right_class: 'photo-group-right',//元素靠右的样式
                    success: function(event, $source, $target ,is_before){
                        me.trigger('action', 'drag_sort',
                            [me.get_record( $source ),me.get_record( $target )],
                            {preventDefault: $.noop},
                            me.get_action_extra({is_before : is_before}));
                    }
                });
            }
        }
    });
    return Module;
});/**
 * 分组 -> 设置封面视图
 * @author cluezhang
 * @date 2013-11-15
 */
define.pack("./group.cover.View",["lib","common","./photo.View","./tmpl","./photo.Thumb_loader","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        Scroller = common.get('./ui.scroller'),
        
        Photo_view = require('./photo.View'),
        
        tmpl = require('./tmpl'),
        Thumb_loader = require('./photo.Thumb_loader'),
        
        $ = require('$');
    var Module = inherit(Photo_view, {
        enable_box_select : true,
        enable_context_menu : true,
        enable_select : true,
        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        thumb_size : 64,
        // 初始封面
        initial_cover : null,
        list_tpl : function(){
            return tmpl.group_cover_list();
        },
        list_selector : 'ul',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.group_cover_items({
                records : records,
                id_perfix : this.record_dom_map_perfix
            });
        },
        item_selector : 'li',
        item_checked_class : 'checked',
        shortcuts : {
            checked : function(checked, view){
                $(this).toggleClass(view.item_checked_class, checked);
            }
        },
        /**
         * @cfg {Object} old_cover 当前设置的封面
         */
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 当找到初始封面时，设定为已选中
            if(this.initial_cover){
                this.listenTo(this.store, 'datachanged add', this.mark_initial_cover, this);
                this.mark_initial_cover(); // 如果store已经加载过，执行一次
            }
        },
        // 初始时标记选中状态
        mark_initial_cover : function(){
            var me = this,
                initial_cover = me.initial_cover;
            me.store.each(function(record){
                if(record.get_pid() === initial_cover.pdir_key && record.get_id() === initial_cover.file_id){
                    // 找到了
                    me.set_checked(record);
                    return false;
                }
            });
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            // 点击选择
            this.on('recordclick', this.handle_click, this);
            // 滚动加载更多
            var scroller = this.scroller = new Scroller(this.$list);
            scroller.on('scroll', this.if_reachbottom, this);
        },
        if_reachbottom : function(){
            if(this.scroller.is_reach_bottom()){
                this.trigger('reachbottom');
            }
        },
        // ------------- 这里的空白页面不能用那个通用的图片了，自己加个空白说明吧
        list_height : 60,
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.cover_empty()).height(this.get_list_height()).insertAfter(this.$list);
            this.$list.hide();
        },
        // 点击选择封面
        handle_click : function(record, event){
            event.preventDefault();
            this.set_checked(record);
        },
        set_checked : function(record){
            if(this.initial_cover){
                this.initial_cover = null;
                this.store.off('add datachanged', this.mark_initial_cover, this);
            }
            var old_record = this.checked_record;
            if(old_record && old_record !== record){
                old_record.set('checked', false);
            }
            this.checked_record = record;
            record.set('checked', true);
        },
        get_checked : function(){
            return this.checked_record;
        },
        // 如何更新缩略图
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            if(this.scroller){
                this.scroller.destroy();
            }
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-11-8
 */
define.pack("./group.detail.Mgr",["lib","common","./photo.Mgr","./group.Mgr","./group.detail.groupdialog.View","./photo.Thumb_loader","./Requestor","./tmpl","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        progress = common.get('./ui.progress'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        ds_group_event = common.get('./global.global_event').namespace('datasource.photogroup'),
        
        Mgr = require('./photo.Mgr'),
        Group_mgr = require('./group.Mgr'),
        
        Group_dialog_view = require('./group.detail.groupdialog.View'),
        Thumb_loader = require('./photo.Thumb_loader'),
        Requestor = require('./Requestor'),
        tmpl = require('./tmpl'),
        
        $ = require('$');
    var /*group_thumb_loader = new Thumb_loader({
        width : 64,
        height : 64
    }), */requestor = new Requestor();
    var requestor = new Requestor();
    var Inner_mgr = inherit(Mgr, {
        on_set_group : function(records, event){
            if(!records.length){
                mini_tip.warn('请选择图片');
                return;
            }
//            if(records.length>=100){
//                mini_tip.warn('一次最多只能修改100张图片');
//                return;
//            }
            // 多张移动分组
            this.moving_records = records;
            this.get_move_dialog().show();
        },
        on_set_as_cover : function(records, event){
            var me = this,
                group_record = me.store.get_group(),
                group_id = group_record.get('id'),
                record = records[0];
            requestor.set_group_album(group_id, record).done(function(){
                group_record.set('cover', [{
                    pdir_key : record.get_pid(),
                    file_id : record.get_id()
                }]);
                ds_group_event.trigger('update', group_record, {
                    src : me.store,
                    changes : {
                        cover : 1
                    }
                });
                mini_tip.ok('设置成功');
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            });
        },
        get_move_dialog : function(){
            var me = this;
            var $fragment_ct = $('<div style="overflow-y:auto;"></div>');
            var group_selection_view = new Group_dialog_view({
                store : this.group_store,
                thumb_loader : this.thumb_loader
            });
            var group_selection_mgr = new Group_mgr({
                store : this.group_store
            });
            group_selection_view.render($fragment_ct);
            var old_group_record = me.store.get_group();
            // 显示错误消息
            var $msg_ct, warn = function(msg){
                if($msg_ct){
                    $msg_ct.stop().text(msg).show(0).delay(5000).hide(0);
                }else{
                    mini_tip.warn(msg);
                }
            };
            var dialog=  new widgets.Dialog({
//                out_look_2_0 : true,
                klass : 'full-pop-medium',
                title: '更改分组',
                destroy_on_hide: true,
                content: $fragment_ct,
                //tmpl : tmpl.dialog,
                show_create_group : true,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : '选定',
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : '取消',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : true
                    }/*, {
                        id : 'CREATE',
                        text : '创建分组',
                        klass : 'g-btn-gray',
                        disabled : false,
                        visible : false
                    }*/
                ],
                handlers: {
                    OK: function (e) {
                        e.preventDefault();
                        if(group_selection_view.is_editing()){
                            return;
                        }
                        var record = group_selection_view.get_selected();
                        if(!record){
                            warn('请选择分组');
                            return;
                        }
                        if(old_group_record.get('id') === record.get('id')){
                            warn('请选择不同的分组');
                            return;
                        }
                        me.do_move_photos(me.moving_records, record).done(function(){
                            dialog.hide();
                        });
                    }
                }
            });
            // 绑定新建分组
            dialog.once('render', function(){
                // 初始化消息提示
//                $msg_ct = dialog.$el.find('.edit-cover-msg');
                dialog.$el.on('click', 'a.new-group', function(e){
                    e.preventDefault();
                    // 复用分组列表的新建分组逻辑
                    var task = group_selection_mgr.on_create_group([], e, {
                        store : me.group_store,
                        view : group_selection_view
                    });
                    // 有可能当前正在创建，不用管
                    if(task){
                        // 新建完后自动选中！
                        task.done(function(record){
                            group_selection_view.set_selected(record);
                        });
                    }
                });
            });
            dialog.once('destroy', function(){
                group_selection_view.destroy();
            });
            dialog.show();
            return dialog;
        },
        do_move_photos : function(photos, record){
            var me = this,
                old_group_id = me.store.get_group().get('id'),
                new_group_id = record.get('id');
            // 如果要分批操作，才显示progress
            var show_progress = photos.length > requestor.move_photo_threshold;
            if(show_progress){
                progress.show("正在移动0/"+photos.length);
            }else{
                widgets.loading.show();
            }
            return requestor.step_move_photos(photos, old_group_id, new_group_id).progress(function(success_photos, failure_photos){
                if(show_progress){
                    progress.show("正在移动" + success_photos.length+"/"+photos.length);
                }
            }).done(function(success_photos, failure_photos){
                me.store.batch_remove(success_photos);
                me.store.total_length -= success_photos.length;
                ds_event.trigger('move', success_photos, {
                    old_group_id : old_group_id,
                    new_group_id : new_group_id,
                    src : me.store
                });
                if(failure_photos.length){
                    mini_tip.warn('部分图片更改分组失败');
                }else{
                    mini_tip.ok('更改分组成功');
                }
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                if(show_progress){
                    progress.hide();
                }else{
                    widgets.loading.hide();
                }
            });
        }
    });
    return Inner_mgr;
});/**
 * 重构后的分组详情面板
 * @author cluezhang
 * @date 2013-11-27
 */
define.pack("./group.detail.Panel",["lib","common","./View_mode","./group.detail.View","./group.detail.Mgr","./group.detail.Store","./photo.Record","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        Scroller = common.get('./ui.scoller'),
        ds_photo_event = common.get('./global.global_event').namespace('datasource.photo'),
        
        View_mode = require('./View_mode'),
        Group_detail_view = require('./group.detail.View'),
        Group_detail_mgr = require('./group.detail.Mgr'),
        Group_detail_store = require('./group.detail.Store'),
        Photo_record = require('./photo.Record'),
        
        $ = require('$');
    var Module = inherit(View_mode, {
        create_store : function(){
            var store = new Group_detail_store({
            });
            // 先只管上传新增的吧
            store.listenTo(ds_photo_event, 'add', function(files, meta){
                if(meta.src === store){
                    return;
                }
                var group_id = meta.group_id;
                var current_group = store.get_group();
                // 如果分组不符合，无视掉
                if(!current_group || current_group.get('id') !== group_id){
                    return;
                }
                // 如果数据全面，则直接插入。如果数据不全（Form上传的没有file_id），则刷新。
                var records = []; // records为null表示数据不全
                $.each(files, function(index, file){
                    if(!file.id){
                        records = null;
                        return false;
                    }
                    records.push(new Photo_record(file));
                });
                buffer_add(records);
            });
            // 延时更新函数
            var timer,
                buffered_records = [], // 如果是数组，就是要添加到列表中的图片；如果是null，表示数据不全，需要reload全盘更新
                last_refresh_time = new Date();
            var buffer_add = function(records){
                // 如果已经要刷新了，就无视掉缓冲了
                if(buffered_records !== null){
                    if(records === null){
                        buffered_records = null;
                    }else{
                        buffered_records = buffered_records.concat(records);
                    }
                }
                clearTimeout(timer);
                // 如果上次刷新在3秒内，则到3秒才刷新
                // 如果在3秒开外，则半秒后刷新
                var wait_time = Math.max(500, 3000 - (new Date() - last_refresh_time));
                timer = setTimeout(do_add, wait_time);
            };
            var do_add = function(){
                if(buffered_records === null){
                    store.reload();
                }else{
                    buffered_records.reverse(); // 每次添加到最前面，所以要倒序添加
                    store.add(buffered_records, 0);
                    buffered_records = [];
                }
            };
            return store;
        },
        create_view : function(){
            var view = new Group_detail_view({
                inner_photo_store : this.get_singleton('store'),
                group_store : this.group_store,
                photo_thumb_loader : this.thumb_loader,
                group_thumb_loader : this.thumb_loader,
                $ct : this.$ct,
                size : this.size
            });
            var me = this;
            view.on('back', function(){
                me.trigger('back');
            }, this);
            view.on('opengroup', function(record, e){
                me.set_group(record);
                user_log('ALBUM_GROUP_CLICK_SHORTCUT');
            });
            view.on('reachbottom', this.on_self_reachbottom, this);
            var mgr = this.get_singleton('mgr');
            view.on('action', mgr.process_action, mgr);
            view.on('dropmove', mgr.do_move_photos, mgr);
            return view;
        },
        create_mgr : function(){
            var mgr = new Group_detail_mgr({
                store : this.get_singleton('store'),
                group_store : this.group_store, // 供分组移动使用
                thumb_loader : this.thumb_loader
            });
            return mgr;
        },
        set_group : function(record){
            this.get_singleton('store').set_group(record);
        },
        get_group : function(){
            return this.get_singleton('store').get_group();
        },
        on_self_reachbottom : function(){
            this.get_singleton('store').load_more();
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            this.get_singleton('store').reload();
            this.get_singleton('view').render(this.$ct);
        },
        on_deactivate : function(){
            this.release_singleton('view');
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            this.get_singleton('store').reload().done(function(){
                mini_tip.ok('列表已更新');
            });
            // 如果侧边栏展开了，则连分组信息一起刷新
            if(this.get_singleton('view').aside_visible){
                this.group_store.reload();
            }
        },
        on_resize : function(){
            Module.superclass.on_resize.apply(this, arguments);
            this.get_singleton('store').page_size = this.get_page_size();
            this.get_singleton('view').set_size(this.size);
        },
        /**
         * 获取每张图占位大小，用于计算每页可显示的张数
         * @return {Object} size 有width与height属性
         */
        get_element_size : function(){
            return {
                width : 140,
                height : 140
            };
        },
        get_page_size : function(){
            var view_size = this.size,
                element_size = this.get_element_size();
            return Math.round(view_size.width*view_size.height / ( element_size.width*element_size.height ));
        },
        on_toolbar_act : function(act, e){
            var records, mgr, view;
            mgr = this.get_singleton('mgr');
            view = this.get_singleton('view');
            mgr.process_action(act, view.get_selected ? view.get_selected() : [], e, view.get_action_extra());
        },
        get_toolbar_meta : function(){
            return {
                set_group : 1,
                batch_delete : 1
            };
        }
    });
    return Module;
});/**
 * 组内的图片
 * @author cluezhang
 * @date 2013-11-6
 */
define.pack("./group.detail.Photo_view",["lib","common","$","./photo.View","./tmpl"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        user_log = common.get('./user_log'),
        
        $ = require('$');
    var View = require('./photo.View'),
        tmpl = require('./tmpl'),
        jquery_ui;
    var Module = inherit(View, {
        /**
         * @cfg {Boolean} draggable
         */
        draggable : false,
        draggable_key : 'test',
        empty_type: 'folder',
        set_draggable : function(draggalbe){
            this.draggable = draggalbe;
            this.update_draggable();
        },
        list_tpl : function(){
            return tmpl.group_detail_list();
        },
        list_selector : 'div',
        set_size : function(size){
            this.size = size;
            if(!this.rendered){
                return;
            }
            var height = this.list_height = size.height;
            if(this.$empty_ui){
                this.$empty_ui.height(height);
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            
            // 大写要自己设置
            if(this.size){
                this.set_size(this.size);
            }
            
            // 如果启用拖拽，则在记录上按下时，不能框选
            if(this.enable_select && this.enable_box_select){
                this.listenTo(this.selection, 'before_box_select', function($tar){
                    return !this.draggable || !this.get_record($tar);
                }, this);
            }
        },
        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_draggable();
        },
        on_update : function(){
            Module.superclass.on_update.apply(this, arguments);
            this.update_draggable();
        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_draggable();
        },
        update_draggable : function(){
            if(!this.rendered || !this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $(tmpl.group_photo_drag_helper());
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },
        handle_start_drag : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.draggable || !record){
                return false;
            }
            var photos = [];
            // 如果拖动的图片已经选中，则表示拖动所有选中的图片
            if(record.get('selected')){
                photos = this.get_selected();
            }else{ // 反之，只拖动当前一张，并清除选中
                this.store.each(function(rec){
                    rec.set('selected', rec === record);
                });
                photos = [record];
            }

            ui.helper.html(tmpl.group_photo_drag_helper_content({ records : photos }));
            ui.helper.data('records', photos);
            
            var me = this,
                tasks = this.dragging_thumb_tasks = [],
                imgs = ui.helper.find('img');
            $.each(imgs, function(index, dom){
                var record = photos[index];
                tasks[index] = me.thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                    var $img = $(img), $replace_img;
                    if(!$img.data('used')){
                        $img.data('used', true);
                        $replace_img = $img;
                    }else{
                        $replace_img = $('<img />').attr('src', url);
                    }
                    var $dom = $(dom);
                    $replace_img.attr('class', $dom.attr('class'));
                    $dom.replaceWith($replace_img);
                });
            });
        },
        handle_stop_drag : function(){
            $.each(this.dragging_thumb_tasks, function(index, task){
                task.reject();
            });
        },
        // ------------------- 拖动 结束 -----------------
        get_context_menu_cfg : function(){
            return [
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'download',
                    text: '下载'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'delete',
                    text: '删除'
                },
                {
                    id: 'set_as_cover',
                    icon_class: 'ico-null',
                    group: 'edit',
                    text: '设置为封面'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'set_group',
                    text: '更改分组'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'jump',
                    text: '查看所在目录'
                },
                {
                    icon_class: 'ico-dimensional-menu',
                    group: 'edit',
                    id: 'qrcode',
                    split: true,
                    text: '获取二维码'
                },
                {
                    icon_class: 'ico-share',
                    group: 'edit',
                    id: 'share',
                    split: true,
                    text: '分享'
                }
            ];
        }
    });
    return Module;
});/**
 * 分组详细页面中，图片列表store
 * @author cluezhang
 * @date 2013-11-15
 */
define.pack("./group.detail.Store",["./photo.Store"],function(require, exports, module){
    return require('./photo.Store');
});/**
 * 子分组视图里的titlebar
 * @author cluezhang
 * @date 2013-11-22
 */
define.pack("./group.detail.Titlebar",["lib","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {String} title 初始标题
         */
        /**
         * @cfg {Boolean} border 是否初始显示分隔样式（用于图片列表往下拖后划清界限）
         */
        /**
         * @event back 当点击返回时触发
         */
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * 更新标题
         * @param {String} title 参考{@link #title}
         */
        set_title : function(ttile){
            // TODO
        },
        /**
         * 设置是否显示分隔线
         * @param {Boolean} border 参考{@link #border}
         */
        set_border : function(border){
            // TODO
        },
        /**
         * 渲染节点
         */
        render : function($el){
            // TODO
        },
        /**
         * 回收
         */
        destroy : function(){
            // TODO
        }
    });
    return Module;
});/**
 * 分组详情面板，含以下逻辑：
 * 渲染主框架，可destroy
 * 渲染并管理InnerPhotoView、AsideGroupList、TitleBar
 * 代理PhotoView、AsideGroupList、TitleBar的动作事件，传递给外部？
 * @author cluezhang
 * @date 2013-11-22
 */
define.pack("./group.detail.View",["lib","./group.detail.Photo_view","./group.detail.grouplist.View","./group.detail.Titlebar","common","./tmpl","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        store = lib.get('./store'),
        
        Photo_view = require('./group.detail.Photo_view'),
        Group_list = require('./group.detail.grouplist.View'),
        Titlebar = require('./group.detail.Titlebar'),
        
        common = require('common'),
        user_log = common.get('./user_log'),
        Scroller = common.get('./ui.scroller'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        
        tmpl = require('./tmpl'),
        
        get_aside_toggle_key = function(){
            return 'photo-group-detail-aside' + query_user.get_uin_num();
        },
        
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {Store} inner_photo_store
         */
        /**
         * @cfg {Thumb_loader} photo_thumb_loader
         */
        /**
         * @cfg {Store} group_store
         */
        /**
         * @cfg {Thumb_loader} group_thumb_loader
         */
        /**
         * @event toggle 切换aside_visible时触发
         * @param {Boolean} aside_visible
         */
        /**
         * @event reachbottom 图片列表拖动到最底下时触发
         */
        /**
         * @cfg {Boolean} aside_visible 初始时侧边栏是否显示
         */
        /**
         * @cfg {Object} size 初始时它的大小是多少
         */
        titlebar_selector : '.photo-group-back',
        main_list_selector : '.photo-view-box',
        photo_view_selector : '.photo-view-box-inner',
        group_list_selector : '.photo-group-aside',
        aside_toggle_selector : '.photo-group-aside-toggle',
        back_selector : '.photo-group-back>.back',
        
        aside_class : 'photo-view-group-aside',
        
        dragdrop_key : 'group_photo_draggable',
        
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        set_size : function(size){
            // 分发大小，同步到inner_photo_view当中
            this.size = size;
            if(!this.rendered){
                return;
            }
            var photo_view = this.get_photo_view(true),
                photo_view_height = size.height - this.$titlebar.height();
            this.$photo_list_ct.height(photo_view_height);
            if(photo_view){
                photo_view.set_size({
                    width : size.width, // TODO 或可考虑减掉侧边栏
                    height : photo_view_height
                });
            }
            this.handle_view_change();
        },
        /**
         * @private
         * 更新是否要显示分隔符
         */
        if_show_border : function(){
            if(!this.rendered){
                return;
            }
            // IE6下修改正在滚动的节点的父节点样式，会导致滚动中断。改为直接style修改。
            if(this.$photo_list_ct.scrollTop() > 0){
                this.$main_list_ct.css({
                    'border-top': '1px #d8dce5 solid'
                });
            }else{
                this.$main_list_ct.css({
                    'border-top': '1px #fff solid'
                });
            }
//            this.$el.toggleClass('photo-view-box-bordertop', this.$photo_list_ct.scrollTop() > 0);
        },
        /**
         * 渲染到指定容器中
         * @param {jQueryElement} $ct
         */
        render : function($ct){
            // 根据是否展开侧边栏，来决定是否进行构造
            var $el = this.$el = $(tmpl.group_detail_panel()).appendTo($ct);
            this.$titlebar = $el.find(this.titlebar_selector);
            this.$main_list_ct = $el.find(this.main_list_selector);
            this.$photo_list_ct = $el.find(this.photo_view_selector);
            this.$group_list_ct = $el.find(this.group_list_selector);
            
            var scroller = this.scroller = new Scroller(this.$photo_list_ct);
            
            this.rendered = true;
            
            // 更新当前分组标题
            this.handle_group_change();
            
            // 渲染图片列表
            var photo_view = this.get_photo_view();
            photo_view.render(this.$photo_list_ct);
            
            // 根据展开情况来选择是否渲染右侧分组列表
            // 从持久化store中取上次保存的值。如果没有，则用默认值。
            var default_aside_visible = store.get(get_aside_toggle_key());
            switch(default_aside_visible){
                case 'true':
                    default_aside_visible = true;
                    break;
                case 'false':
                    default_aside_visible = false;
                    break;
                default:
                    default_aside_visible = this.aside_visible;
                    break;
            }
            this.set_aside_visible(default_aside_visible);
            if(this.aside_visible){
                this.render_group_list();
            }
            
            // 更新大小 （这里放在图片列表后执行，以便使它高度正确初始化）
            if(this.size){
                this.set_size(this.size);
            }
            
            // 后续事件绑定
            var me = this;
            me.$el.on('click', me.back_selector, function(e){
                e.preventDefault();
                me.trigger('back');
                user_log('ALBUM_GROUP_DETAIL_RETURN');
            });
            me.$el.on('click', me.aside_toggle_selector, function(e){
                e.preventDefault();
                me.trigger('toggle');
                // 手工改动，要发日志
                me.set_aside_visible(undefined, true);
            });
            scroller.on('scroll', this.handle_view_change, this);
            this.inner_photo_store.on('groupchanged', this.handle_group_change, this);
        },
        handle_view_change : function(){
            if(!this.rendered){
                return;
            }
            if(this.scroller.is_reach_bottom()){
                this.trigger('reachbottom');
            }
            this.if_show_border();
        },
        render_group_list : function(){
            if(!this.rendered){
                return;
            }
            var group_list = this.get_group_list();
            if(!group_list.rendered){
                group_list.render(this.$group_list_ct.empty());
            }
        },
        destroy_group_list : function(){
            var group_list = this.group_list;
            if(group_list){
                group_list.destroy();
                // 放置一个空白列表，避免背景透明导致titlebar的边框显示出来了。 临时hack
                this.$group_list_ct.html(tmpl.detail_group_list());
                this.group_list = null;
            }
        },
        /**
         * @private
         * 切换则边栏分组列表显示
         */
        set_aside_visible : function(aside_visible, manual_switch){
            if(typeof aside_visible !== 'boolean'){
                aside_visible = !this.aside_visible;
            }
            aside_visible = !!aside_visible;
            this.aside_visible = aside_visible;
            store.set(get_aside_toggle_key(), aside_visible);
            if(this.rendered){
                this.$el.toggleClass(this.aside_class, aside_visible);
                if(aside_visible){
                    this.render_group_list();
                }else{
                    this.destroy_group_list();
                }
                // WEBKIT Appbox的动画有bug，只能恶心的hack
                if(constants.IS_WEBKIT_APPBOX){
                    var me = this;
                    setTimeout(function(){
//                        me.get_photo_view().$el.repaint();
//                        me.$photo_list_ct.repaint();
                        var record = me.inner_photo_store.get(0);
                        if(record){
                            record.set('force_update_view', Math.random());
                        }
                    }, 600);
                }
            }
            if(this.photo_view){
                this.photo_view.set_draggable(aside_visible);
            }
            if(this.group_list){
                this.group_list.set_droppable(aside_visible);
            }
            // 上报
            if(manual_switch){
                user_log(aside_visible ? 'ALBUM_GROUP_OPEN_SHORTCUT' : 'ALBUM_GROUP_CLOSE_SHORTCUT');
            }
        },
        handle_group_change : function(){
            if(!this.rendered){
                return;
            }
            var group_record = this.inner_photo_store.get_group();
            this.$titlebar.find('.text').text(group_record.get('name'));
            // 标记当前的record为选中
            this.group_record = group_record;
            var group_list = this.get_group_list(true);
            if(group_list){
                group_list.set_group_record(group_record);
            }
        },
        transfer_action : function(action, records, event, extra){
            this.trigger('action', action, records, event, extra);
        },
        get_photo_view : function(dont_construct){
            var photo_view = this.photo_view;
            if(!photo_view && !dont_construct){
                photo_view = this.photo_view = new Photo_view({
                    store : this.inner_photo_store,
                    thumb_loader : this.photo_thumb_loader,
                    scroller : this.scroller,
                    draggable_key : this.dragdrop_key,
                    draggable : this.aside_visible
                });
                photo_view.on('action', this.transfer_action, this);
            }
            return photo_view;
        },
        change_group : function(record, event, extra){
            this.trigger('opengroup', record, event, extra);
        },
        get_group_list : function(dont_construct){
            var group_list = this.group_list;
            if(!group_list && !dont_construct){
                group_list = this.group_list = new Group_list({
                    store : this.group_store,
                    thumb_loader : this.group_thumb_loader,
                    group_record : this.inner_photo_store.get_group(),
                    droppable_key : this.dragdrop_key,
                    droppable : this.aside_visible
                });
                group_list.on('recordclick', this.change_group, this);
                group_list.on('dropmove', function(photos, group_record, e){
                    this.trigger('dropmove', photos, group_record, e);
                    user_log('ALBUM_GROUP_DRAG_TO_SHORTCUT');
                }, this);
            }
            return group_list;
        },
        get_selected : function(){
            return this.get_photo_view().get_selected();
        },
        get_action_extra : function(){
            return this.get_photo_view().get_action_extra();
        },
        /**
         * 销毁所有dom
         */
        destroy : function(){
            this.destroy_group_list();
            if(this.photo_view){
                this.photo_view.destroy();
                this.photo_view = null;
            }
            this.$el.remove();
            if(this.last_group_record){
                this.last_group_record.set('selected', false);
                this.last_group_record = null;
            }
            if(this.scroller){
                this.scroller.destroy();
                this.scroller = null;
            }
        }
    });
    return Module;
});/**
 * 更改分组时弹出的精简分组列表
 * @author cluezhang
 * @date 2013-11-10
 */
define.pack("./group.detail.groupdialog.View",["lib","common","./group.View","./tmpl","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        View = require('./group.View'),
        tmpl = require('./tmpl'),
        
        $ = require('$');
    var Module = inherit(View, {
        enable_hovering : false,
        enable_context_menu : false,
        list_tpl : function(){
            return tmpl.detail_group_dialog_list();
        },
        list_selector : 'ul',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.detail_group_dialog_items({
                records : records
            });
        },
        item_selector : 'li.list',
        item_checked_class : 'checked',
        shortcuts : {
            checked : function(value, view){
                $(this).find('a').toggleClass(view.item_checked_class, value);
            },
            editing : function(value, view, record){
                var $text_ct = $(this).find('span'),
                    name = record.get('name');
                if(value){
                    $text_ct.empty().append($('<input style="text" value="爱情">').val(name));
                }else{
                    $text_ct.text(name);
                }
            }
        },
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            // 当store刷新后，重新设定选中项
            this.listenTo(this.store, 'datachanged', this.mark_initial_selected, this);
            this.mark_initial_selected(); // 如果store已经加载过，执行一次
        },
        // 初始化选中
        mark_initial_selected : function(){
            var me = this,
                initial_record = this.get_selected();
            if(!initial_record){
                return;
            }
            me.store.each(function(record){
                if(record.get('id') === initial_record.get('id')){
                    // 找到了
                    me.set_selected(record);
                    return false;
                }
            });
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            this.on('recordclick', this.handle_click, this);
        },
        handle_click : function(record, event){
            event.preventDefault();
            if(record.get('dummy')){
                return; // 正在新建的记录不能选
            }
            this.set_selected(record);
            user_log('ALBUM_GROUP_SET_COVER_CHOSE_PIC');
        },
        set_selected : function(record){
            var old_record = this.selected_record;
            if(old_record){
                old_record.set('checked', false);
            }
            this.selected_record = record;
            record.set('checked', true);
        },
        get_selected : function(){
            return this.selected_record;
        },
        on_destroy : function(){
            var record = this.selected_record;
            if(record){
                record.set('checked', false);
            }
            Module.superclass.on_destroy.apply(this, arguments);
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png',
        default_fail_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/file_img_70.png',
        thumb_width : 64,
        thumb_height : 64,
        update_record_dom_thumb : function(record, $dom, $img){
            $dom.find('img').replaceWith($img);
        },
        update_ellipsis : $.noop
        // --------------- 缩略图结束 -----------------
    });
    return Module;
});/**
 * 分组详细视图里，分组列表
 * @author cluezhang
 * @date 2013-11-13
 */
define.pack("./group.detail.grouplist.View",["lib","common","./group.View","./tmpl","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        View = require('./group.View'),
        tmpl = require('./tmpl'),
        
        jquery_ui,
        
        $ = require('$');
    var Module = inherit(View, {
        enable_hovering : false,
        enable_context_menu : false,
        droppable : false,
        droppable_key : 'test',
        set_droppable : function(droppable){
            this.droppable = droppable;
            this.update_droppable();
        },
        list_tpl : function(){
            return tmpl.detail_group_list();
        },
        list_selector : 'ul',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.detail_group_items({
                records : records
            });
        },
        item_selector : 'li.list',
        item_selected_class : 'list-focus',
        item_hover_class : 'list-hover',
        item_dropping_class : 'list-dropping',
        shortcuts : {
            selected : function(value, view){
                $(this).find('>div').toggleClass(view.item_selected_class, value);
            },
            hovering : function(value, view, record){
                $(this).find('>div').toggleClass(view.item_hover_class, value && !record.get('selected'));
            }
        },
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            this.set_group_record(this.group_record);
            
            // 当store更新后，保持选中状态
            var me = this;
            me.listenTo(me.store, 'datachanged', function(){
                var record = me.group_record;
                if(record && record.get){
                    record = me.store.get(''+record.get('id'));
                    me.set_group_record(record);
                }
            });
        },
        set_group_record : function(group_record){
            var old_record = this.group_record;
            if(old_record){
                old_record.set('selected', false);
            }
            group_record.set('hovering', false);
            group_record.set('selected', true);
            this.group_record = group_record;
            this.update_droppable();
        },
        /**
         * 定位到当前选中的节点
         */
        focus : function(){
            if(!this.rendered){
                return;
            }
            var $dom = this.get_dom(this.group_record), $list, offset_top, scroll_height, height, element_height;
            if($dom){
                //$dom[0].scrollIntoView();
                offset_top = $dom[0].offsetTop; // 要定位的记录所处的高度
                $list = this.$list;
                scroll_height = $list[0].scrollHeight; // 列表内容总高度
                height = $list.innerHeight(); // 列表高度
                element_height = $dom.height(); // 每条记录的高度
                if(offset_top > height - 3*element_height){ // 如果不在可视范围内，移动到使它显示在第3个位置
                    $list.scrollTop(offset_top - 3*element_height);
                }
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            this.on('recordclick', this.handle_click, this);
            this.$list.on('mouseenter', this.item_selector, function(){
                me.get_record(this).set('hovering', true);
            }).on('mouseleave', this.item_selector, function(){
                me.get_record(this).set('hovering', false);
            });
            this.focus();
        },
//        handle_click : function(record, event){
//            var old_record = this.selected_record;
//            if(old_record){
//                old_record.set('selected', false);
//            }
//            this.selected_record = record;
//            record.set('selected', true);
//            record.set('hovering', false);
//            event.preventDefault();
//        },
//        get_selected : function(){
//            return this.selected_record;
//        },
        on_destroy : function(){
            var record = this.group_record;
            if(record){
                record.set('selected', false);
            }
            Module.superclass.on_destroy.apply(this, arguments);
        },
        // ----------------------拖动-----------------
        when_droppable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_droppable();
        },
//        on_update : function(){
//            Module.superclass.on_update.apply(this, arguments);
//            this.update_droppable();
//        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_droppable();
        },
        update_droppable : function(){
            if(!this.rendered || !this.droppable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this, last_droppable;
            this.when_droppable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $.each($items, function(index, dom){
                    var record = me.get_record(dom, true);
                    var $dom = $(dom).children();
                    // 销毁旧的droppable
                    if($dom.data('droppable')){
                        $dom.droppable('destroy');
                    }
                    if(record === me.group_record){
                        // 显示为禁止样
                        last_droppable = $dom.droppable({
                            scope: me.droppable_key,
                            tolerance: 'pointer',
                            hoverClass: false,
                            drop: function(){
                                return false;
                            },
                            over : function(e, ui){
                                ui.helper.addClass('photo-list-thedrag-disabled');
                            },
                            out : function(e, ui){
                                ui.helper.removeClass('photo-list-thedrag-disabled');
                            }
                        });
                    }else{
                        last_droppable = $dom.droppable({
                            scope: me.droppable_key,
                            tolerance: 'pointer',
                            hoverClass: 'list-dropping',
                            drop: $.proxy(me.handle_drop, me),
                            over : function(e, ui){
                                ui.helper.addClass('photo-list-thedrag-enabled');
                            },
                            out : function(e, ui){
                                ui.helper.removeClass('photo-list-thedrag-enabled');
                            }
                        });
                    }
                });
                // 主动更新拖拽坐标缓存，以使当前正在拖拽时不会出现无法响应drop的情况
                // 这里算是hack吧，不知道有没有更好的方法。
                last_droppable = last_droppable.data('droppable');
                $.ui.ddmanager.prepareOffsets(last_droppable);
            });
        },
        handle_drop : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.droppable || !record){
                return false;
            }
            // 如果是当前分组，无视掉
            if(record === this.group_record){
                return false;
            }
            var photos = ui.helper.data('records');

            this.trigger('dropmove', photos, record, e);
        },
        handle_over : function(e, ui){
            
        },
        handle_out : function(e, ui){
            
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png',
        default_fail_thumb_url : constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/file_img_70.png',
        thumb_width : 64,
        thumb_height : 64,
        update_record_dom_thumb : function(record, $dom, $img){
//            $dom.find('div.img').prepend($img);
            $dom.find('img').replaceWith($img);
        },
        update_ellipsis : $.noop
        // --------------- 缩略图结束 -----------------
    });
    return Module;
});/**
 * @author trump
 * @date 2013-11-13
 */
define.pack("./group.drag_sort",["$","lib","common","./axisMap"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        DragRun = common.get('./ui.dragRun'),
        dragRun,
        axis_map,
        drag_sort = {
            render: function (opt) {
                var me = this;
                if (me.timeoutid) {
                    clearTimeout(me.timeoutid);
                    me.timeoutid = null;
                }
                me.timeoutid = setTimeout(function () {
                    me._render_opt(opt);
                    me._render_map();
                    me._render_drag();
                }, 100);
            },
            /**
             * 初始化参数
             * @param opt
             */
            _render_opt: function (opt) {
                var me = this;
                me.opt = $.extend({
                    parent: null,//拖动外层(position:relative方便定位)
                    $el: null,//匹配元素的直接父元素
                    $scroller: '',//滚动条

                    child_filter: '',//元素匹配的过滤器
                    drag_class: '',//被拖动元素的样式
                    helper_class: '',//被拖动元素的辅助样式
                    left_class: '',//靠左样式
                    right_class: '',//靠右样式

                    width: 0,//元素宽度
                    height: 0,//元素高度
                    get_parent_all_height: $.noop,
                    get_helper: function ($item) {//获取辅助参数
                        return $item.clone().removeAttr('id');
                    },
                    success: $.noop//排序完成后的回调函数

                }, opt);
                me.opt.slide_class = me.opt.left_class + ' ' + me.opt.right_class;
            },
            /**
             * 初始化地图
             */
            _render_map: function () {
                var me = this;
                me.old_match = {
                    point: null,
                    left: false
                };
                if (!axis_map) {
                    axis_map = require('./axisMap').get_instance({
                        ns: 'photo_group',
                        $el: me.opt.$el,
                        $scroller: me.opt.$scroller,
                        child_filter: me.opt.child_filter,
                        container_width: function () {
                            return me.opt.$el.width();
                        }
                    });
                }
                axis_map.re_paint();
            },
            /**
             * 初始化拖拽
             */
            _render_drag: function () {
                if (!dragRun) {
                    var me = this;
                    dragRun = new DragRun({
                        scroll: true,//支持滚动条
                        moveRange: function () {//设置滚动范围
                            var height = me.opt.get_parent_all_height(),
                                pHeight = me.opt.parent.height();
                            height = height < pHeight ? (pHeight - me.opt.height -10) : height;
                            return {
                                minX: 0,
                                maxX: me.opt.parent.width() - me.opt.width - 10,
                                minY: 0,
                                maxY: height
                            };
                        },
                        childFilter: me.opt.child_filter,
                        start: function (e, offset) {
                            me._on_start.call(this, offset);
                        },
                        drag: function ( offset) {
                            me._on_drag.call(this, offset);
                        },
                        stop: function (e, offset) {
                            me._on_stop.call(this, e);
                        },
                        helper: function () {
                            return me.opt.get_helper($(this));
                        },
                        $parent: me.opt.parent
                    });
                }
            },

            /**
             * 添加靠右样式
             * @param point
             * @param except_id 排除坐标的id
             * @param them_class 靠边元素的样式
             * @param self_class 自身元素的样式
             */
            add_right_class: function (point, except_id, them_class, self_class) {
                var r_point = axis_map.get_right_point(point, except_id);
                if (r_point) {
                    $('#' + r_point.get_id()).addClass(them_class);
                }
                if (except_id !== point.get_id()) {
                    $('#' + point.get_id()).addClass(self_class);
                }
            },
            /**
             * 添加靠左样式
             * @param point
             * @param except_id 排除坐标的id
             * @param them_class 靠边元素的样式
             * @param self_class 自身元素的样式
             */
            add_left_class: function (point, except_id, them_class, self_class) {
                var l_point = axis_map.get_left_point(point, except_id);
                if (l_point) {
                    $('#' + l_point.get_id()).addClass(them_class);
                }
                if (except_id !== point.get_id()) {
                    $('#' + point.get_id()).addClass(self_class);
                }
            },
            /**
             * 移除样式
             * @param point
             * @param except_id
             * @param classs
             */
            remove_class: function (point, except_id, classs) {
                var r_point = axis_map.get_right_point(point, except_id);
                r_point && $('#' + r_point.get_id()).removeClass(classs);

                var l_point = axis_map.get_left_point(point, except_id);
                l_point && $('#' + l_point.get_id()).removeClass(classs);

                $('#' + point.get_id()).removeClass(classs);
            },
            /**
             * on start
             */
            _on_start: function (offset) {
                $(this).addClass(drag_sort.opt.drag_class);
            },
            /**
             * on drag
             * @param offset
             */
            _on_drag: function (offset) {
                var me = drag_sort,
                    new_match = axis_map.point_match(offset);
                if (me.old_match.point !== new_match.point || me.old_match.left !== new_match.left) {
                    //除旧
                    if (me.old_match.point) {
                        me.remove_class(me.old_match.point, this.id, me.opt.slide_class);
                    }
                    if(this.id !== new_match.point.get_id()){
                        //迎新
                        if (new_match.left) {//在匹配元素左边
                            var lp = axis_map.get_left_point(new_match.point);
                            if(!lp || lp.get_id() !== this.id){//左节点不是被拖动节点
                                me.add_left_class(new_match.point, this.id, me.opt.right_class, me.opt.left_class);
                            }
                        } else {//在匹配元素右边
                            var rp = axis_map.get_right_point(new_match.point);
                            if(!rp || rp.get_id() !== this.id){//右节点不是被拖动节点
                                me.add_right_class(new_match.point, this.id, me.opt.left_class, me.opt.right_class);
                            }
                        }
                    }
                }
                me.old_match = new_match;
            },
            /**
             * on stop
             * @param e
             */
            _on_stop: function (e) {
                var me = drag_sort,
                    $source = $(this).removeClass(me.opt.drag_class),
                    left = me.old_match.left,
                    point = me.old_match.point;
                if (point) {
                    me.remove_class(point, this.id, me.opt.slide_class);
                    if (point.get_id() !== this.id) {
                        me.opt.success(e, $source, $('#' + point.get_id()), left);
                    }
                }
                me.old_match = {
                    point: null,
                    left: false
                };
            }
        };

    return drag_sort;
});/**
 * 搜索Module
 * @author cluezhang
 * @date 2013-9-12
 */
define.pack("./photo",["lib","$","main","common","./Requestor","./Switch_view","./Panel"],function(require, exports, module){
    var lib = require('lib'),
        $ = require('$'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        
        routers = lib.get('./routers'),
        store = lib.get('./store'),

        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        
        common = require('common'),
        
        query_user = common.get('./query_user'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        Module = common.get('./Simple_module'),
        scr_reader_mode = common.get('./scr_reader_mode');
    var Requestor = require('./Requestor'),
        Switch_view = require('./Switch_view'),
        Main_panel = require('./Panel');
        
    var get_mode_store_key = function(){
            return 'photo_view_mode' + query_user.get_uin_num();
        },
        toolbar_act_event = 'toolbar_act',
        
        scroller = main_ui.get_scroller();
    return new Module({
        name : 'photo',
        main_view : new Main_panel({
            $ct : main_ui.get_$body_box()
        }),
        create_toolbar : function(){
            var me = this,
                create_handler = function(act){
                    return function(e){
                        //console.debug(act);
                        switch(act){
                            case('create_group'):
                                user_log('ALBUM_GROUP_TOOL_NEW');
                                break;
                            case('set_group'):
                                user_log('ALBUM_GROUP_TOOL_CHANGE');
                                break;
                            case('batch_delete'):
                                user_log('ALBUM_GROUP_TOOL_DEL');
                                break;
                        }
                        me.main_view.on_toolbar_act(act, e);
                    };
                };
            var toolbar = new Toolbar({
                cls: 'toolbar-btn clear photo-toolbar',
                btns: [
                    new Button({
                        id: 'create_group',
                        label: '新建分组',
                        icon: 'ico-mkdir',
                        handler: create_handler('create_group')
                    }),
                    new Button({
                        id: 'set_group',
                        label: '更改分组',
                        icon: 'ico-movegroup',
                        handler: create_handler('set_group')
                    }),
                    new Button({
                        id: 'batch_delete',
                        label: '删除',
                        icon: 'ico-del',
                        handler: create_handler('batch_delete')
                    }),
                    new Button({
                        id: 'refresh',
                        label: '',
                        icon: 'ico-ref',
                        handler: function() {
                            me.refresh();
                        }
                    })
                ]
            });
            toolbar.render(main_ui.get_$bar1());
            // 这里的resize是通知main模块调整总容器高度的。
            this.get_module_adapter().trigger('resize');
            return toolbar;
        },

        /**
         * 获取要进入的视图模式，可通过hash：albumn.all、albumn.time、albumn.group 定位到哪个tab
         * @returns {*}
         */
        get_init_view_mode: function() {
            var mode;
            var hashs = routers.get_param('m').split('.'),
                last_hash = hashs[hashs.length-1],
                modes = ['all', 'group', 'time']; //目录就两级吧

            // 视图模式（针对读屏模式只启用全部视图）- james
            if(scr_reader_mode.is_enable()) {
                mode = 'all';
            } else if($.inArray(last_hash, modes) > -1) {
                mode = last_hash;
            } else {
                mode = store.get(get_mode_store_key()) || 'time';
            }
            return mode;
        },

        create_switch_view : function(){
            var me = this,
                main_view = me.main_view;
            var toolbar = this.get_singleton('toolbar');

            var default_mode = this.get_init_view_mode();
            var switch_view = new Switch_view({
                mode : default_mode,
                $ct : toolbar.get_$el()
            });
            switch_view.render();
            switch_view.on('switch', function(mode){
                // 持久化用户选择
                store.set(get_mode_store_key(), mode);
                main_view.switch_mode(mode);
                me.store_hash(mode);
                // log
                switch(mode){
                    case 'all':
                        user_log('ALBUM_MODE_ALL');
                        break;
                    case 'time':
                        user_log('ALBUM_MODE_TIME');
                        break;
                    case 'group':
                        user_log('ALBUM_MODE_GROUP');
                        break;
                }
            });
            // 初始时进行一次视图切换
            main_view.switch_mode(switch_view.get_mode());
            return switch_view;
        },
        /**
         * 将当前的访问路径存储到hash中
         */
        store_hash: function (mode) {
            var path = ['album']
           setTimeout(function () {
               path.push(mode);
               routers.replace({
                   m: path.join('.')
               }, true);
            }, 0);
        },
        
        // 保证界面已渲染，事件已绑定
        asure_inited : function(){
            if(this.rendered){
                return;
            }
            this.get_singleton('toolbar');
            var switch_view = this.get_singleton('switch_view');
            this.rendered = true;
            
            var main_view = this.main_view;
            // 初始大小
            main_view.set_size(this.get_view_size());
            // 设置初始时模式的工具栏
            this.set_toolbar_meta(main_view.get_toolbar_meta());
            // 绑定后续模式切换后工具栏的变动
            main_view.on('toolbar_meta_changed', this.set_toolbar_meta, this);
            // 绑定toolbar传入
            this.on(toolbar_act_event, main_view.on_toolbar_act, main_view);
            
            // 模式切换后，触发是否要加载更多的判断
            main_view.on('modeactivate', this.if_reachbottom, this);
        },
        on_activate : function(){
	        //测速
	        try{
		        var flag = '21254-1-10';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
            Module.prototype.on_activate.apply(this, arguments);
            this.asure_inited();
            scroller.on('scroll', this.if_reachbottom, this);
            scroller.on('resize', this.on_resize, this);
            
            this.main_view.activate();
            
            global_event.on('album_refresh', this.refresh, this);
            if(location.search.indexOf('s=ic') != -1) {//只有从空间个人中心过来的才出现tip
                $('#_main_logout').hide();//产品确定，去掉 退出 按钮
                this.add_tip();
            }
        },
        add_tip: function() {
            var self = this;
            if(-1 != location.search.indexOf('flag=first')) {
                if($('div#qzone_wy_tip').length == 0) {
                    $('<div id="qzone_wy_tip" class="lay-alert" style="position:relative;"><div class="inner"><div class="wy-alert wy-alert-warning wy-alert-dismissible" role="alert"><a href="javascript:;" class="close close-tip" aria-label="Close"><span aria-hidden="true">×</span></a>您在手机QQ空间“照片备份”中的照片已存到微云，微云文件全部仅自己可见。</div></div></div>').insertBefore($('#_main_content'));
                    self.bindTipEvent();
                } else {
                    $('div#qzone_wy_tip').show();
                }
                setTimeout(function() {
                    self.tip_slow_vanish();
                }, 10000);
            } else if(-1 != location.search.indexOf('flag=hasdot')){
                if($('div#qzone_wy_tip').length == 0) {
                    $('<div id="qzone_wy_tip" class="lay-alert" style="position:relative;"><div class="inner"><div class="wy-alert wy-alert-warning wy-alert-dismissible" role="alert"><a href="javascript:;" class="close close-tip" aria-label="Close"><span aria-hidden="true">×</span></a>您有新备份到微云的照片，快用微云网页版查看管理吧！</div></div></div>').insertBefore($('#_main_content'));
                    self.bindTipEvent();
                } else {
                    $('div#qzone_wy_tip').show();
                }
                setTimeout(function() {
                    self.tip_slow_vanish();
                }, 10000);
            }
        },
        bindTipEvent: function() {
            var self = this;
            $('a.close-tip').on('click', function() {
                self.tip_slow_vanish();
                return false;
            });
        },
        hide_tip: function() {
            $('div#qzone_wy_tip').hide();
        },
        tip_slow_vanish: function() {//产品逻辑：点击tip的叉，tip慢慢消失
            $('div#qzone_wy_tip').slideUp();
        },
        on_deactivate : function(){
            global_event.off('album_refresh', this.refresh, this);
            
            this.main_view.deactivate();
            
            scroller.off('scroll', this.if_reachbottom, this);
            scroller.off('resize', this.on_resize, this);
            Module.prototype.on_deactivate.apply(this, arguments);
            this.hide_tip();
        },
        on_resize : function(){
            this.main_view.set_size(this.get_view_size());
            this.if_reachbottom();
        },
        /**
         * 获取可视范围的大小
         * @return {Object} size 有width与height属性，数字，像素
         */
        get_view_size : function(){
//            var $ct = $(window);//this.$ct;
            // 坑爹，activate时main_ui还处于display:none状态，只好取它父节点的大小了
            var $ct = main_ui.get_$body_box();
            return {
                width : $ct.innerWidth() - parseInt($ct.css('padding-left'), 10) - parseInt($ct.css('padding-right'), 10),
                height : $ct.height() - parseInt($ct.css('padding-top'), 10) - parseInt($ct.css('padding-bottom'), 10)
            };
        },
        if_reachbottom : function(){
            if(scroller.is_reach_bottom()){
                this.main_view.on_reachbottom();
            }
        },
        refresh : function(){
            user_log('NAV_ALBUM_REFRESH');
            this.main_view.refresh();
        },
        /**
         * 获取当前正处于的分组信息，如果为null则没有进分组
         */
        get_group : function(){
            var main_view = this.main_view, group;
            if(main_view.mode === 'group'){
                group = main_view.get_current_mode_instance().get_current_group();
                if(group){
                    return group;
                }
            }
            return null;
        },
        /**
         * 获取当前正处于的分组id，如果为null则没有进分组
         * @returns {*}
         */
        get_group_id : function(){
            var group = this.get_group();
            return group ? group.get('id') : null;
        },
        /**
         * 获取当前正处于的分组name，如果为null则没有进分组
         * @returns {*}
         */
        get_group_name : function(){
            var group = this.get_group();
            return group ? group.get('name') : null;
        },
        set_toolbar_meta : function(meta){
            meta = meta || {};
            var toolbar = this.get_singleton('toolbar');
            meta.refresh = true;
            $.each(toolbar.get_btns(), function(index, btn){
                btn[meta.hasOwnProperty(btn.get_id()) ? 'show' : 'hide']();
            });
        }
    }).get_common_module();
});/**
 * 
 * @author cluezhang
 * @date 2013-11-7
 */
define.pack("./photo.Mgr",["lib","common","./Remover","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        console = lib.get('./console'),
        
        common = require('common'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        
        Remover = require('./Remover'),
        
        $ = require('$');
    var Mgr = inherit(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
            this.init_operators();
        },
        init_operators : function(){
            var me = this;
            require.async('downloader', function(downloader){
                me.downloader = downloader.get('./downloader');
            });
            require.async('file_qrcode', function(file_qrcode){
                me.file_qrcode = file_qrcode.get('./file_qrcode');
            });
        },
        // 分派动作
        process_action : function(action_name, data, event, extra){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name]([].concat(data), event, extra);
            }
            event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        on_open : function(records, event){
            if (scr_reader_mode.is_enable()) {
                return this.on_download(records, event);
            }

            var me = this;
            var node = records[0];
            me.appbox_preview(node).fail(function () {
                me.preview_image(node);
            });
            return;
        },
        on_qrcode : function(records, event){
            var me = this;
            if(me.file_qrcode){
                me.file_qrcode.show(records);
                user_log('FILE_QRCODE_PHOTO_RIGHT');
            }
        },
        on_download : function(records, event){
            // 其他文件，下载
            var me = this;
            if(me.downloader){
                me.downloader.down(records[0], event);
            }
        },
        // 删除
        on_delete : function(nodes, event){
            this.do_delete(nodes);
        },
        on_jump: function(records, event, extra) {
            var record = records[0];
            var from_menu = extra.src === 'contextmenu';
            event.preventDefault();
            if(records.length == 1) {
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
            }
        },
//        when_remover_ready : function(){
//            var def = $.Deferred(),
//                me = this,
//                remover = me.remover;
//            
//            if(remover){
//                def.resolve(remover);
//            }else{
//                require.async('disk', function(disk){
//                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
//                    remover.render();
//                    def.resolve(remover);
//                });
//            }
//            
//            return def;
//        },
//        get_delete_params : function(first_file_name, count){
//            return {
//                title : '删除图片',
//                thing : '图片',
//                single_unit : '张',
//                multi_unit : '些',
//                up_msg : count>1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？'
//            }; 
//        },

        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },
        do_delete: function(nodes, callback, scope) {
            var remover = this.get_remover(),
                me = this;
            remover.remove_confirm(nodes).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.store.total_length -= success_nodes.length;
                ds_event.trigger('remove', success_nodes, {
                    src : me.store
                });
                if(callback){
                    callback.call(scope, true);
                }
            });
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn('请选择图片');
                return;
            }
            this.do_delete(records);
        },
        on_share : function(records){
            require.async('share_enter', function(share_enter){
                share_enter.get('./share_enter').start_share(records[0]);
            });
        },
        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} node
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (node) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
                        (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
                    );

            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        full_screen_preview.preview(node);
                        def.resolve();
                    } catch (e) {
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
         * 图片预览（重写 FileListUIModule 的默认实现）
         * @overwrite
         * @param {FileObject} file
         * @private
         */
        preview_image: function (file) {
            var me = this;

            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前目录下的图片
                var images = [];
                var read_images = function(){
                    me.store.each(function(record){
                        images.push(record);
                    });
                };
                read_images();
                image_preview.start({
                    complete : me.store.is_complete(),
                    total: images.length,
                    index: $.inArray(file, images),// 当前图片所在的索引位置
                    images: images,
                    load_more: function( callback ){
                        // 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
                        if(!me.store.is_complete()){ // 未加载，尝试加载之
                            me.store.load_more().done(function(){
                                images.splice(0, images.length);
                                read_images();

                                callback({
                                    'total': images.length,
                                    'complete': me.store.is_complete(),
                                    'images': images
                                });

                            }).fail(function(){
                                callback({ 'fail': true });
                            });
                        }
                        //加载完了
                        else{
                            callback({
                                'total': images.length,
                                'complete': me.store.is_complete(),
                                'images': images
                            });
                        }
                    },
                    download: function (index, e) {
                        var file = images[index];
                        downloader.down(file, e);
                    },
                    code: function(index){
                        var file = images[index];
                        if(me.file_qrcode){
                            me.file_qrcode.show([file]);
                        }
                    },
                    share: function(index){
                        require.async('share_enter', function(share_enter){
                            share_enter.get('./share_enter').start_share(images[index]);
                        });
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file, function(success){
                            if(success){
                                images.splice(index, 1);
                            }
                            callback();
                        });
                    }
                });
            });
        }
    });
    return Mgr;
});/**
 * 组视图界面
 * 有GroupMgr, InGroupMgr, GroupStore, GroupView, InGroupStore, InGroupView
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./photo.Panel",["lib","$","common","./View_mode","./photo.Mgr","./photo.View","./photo.Store","./Requestor"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),
        
        common = require('common'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        
        Record = lib.get('./data.Record');
    var View_mode = require('./View_mode'),
        Mgr = require('./photo.Mgr'),
        View = require('./photo.View'),
        Store = require('./photo.Store'),
        Requestor = require('./Requestor');
    var requestor = new Requestor();
    var Module = inherit(View_mode, {
        /**
         * 获取每张图占位大小，用于计算每页可显示的张数
         * @return {Object} size 有width与height属性
         */
        get_element_size : function(){
            return {
                width : 140,
                height : 140
            };
        },
        get_page_size : function(){
            var view_size = this.size,
                element_size = this.get_element_size();
            return Math.round(view_size.width*view_size.height / ( element_size.width*element_size.height ));
        },
        create_store : function(){
            var store = new Store({
                page_size : this.get_page_size()
            });
            return store;
        },
        create_view : function(){
            var me = this;
            var view = new View({
                store : this.get_singleton('store'),
                thumb_loader : this.thumb_loader,
                $ct : this.$ct,
                list_height : this.size ? this.size.height : 'auto'
            });
            view.on('action', me.on_view_action, me);
            return view;
        },
        create_mgr : function(){
            var mgr = new Mgr({
                store : this.get_singleton('store')
            });
            return mgr;
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            this.get_singleton('view').render(this.$ct);
            this.get_singleton('mgr'); // 初始化mgr，因为下载模块要提前加载，否则会因为异步而无法触发
            this.get_singleton('store').reload();
        },
        on_deactivate : function(){
            // 销毁界面
            this.release_singleton('view');
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            this.get_singleton('store').reload().done(function(){
                //mini_tip.ok('列表已更新');
            });
            // TODO 可考虑将view的可视条数重置
        },
        on_resize : function(){
            Module.superclass.on_resize.apply(this, arguments);
            this.get_singleton('store').page_size = this.get_page_size();
            this.get_singleton('view').set_size(this.size);
        },
        on_reachbottom : function(){
            this.get_singleton('store').load_more();
        },
        on_view_action : function(act, records, event, info){
            var mgr = this.get_singleton('mgr');
            mgr.process_action(act, records, event, info);
            return false;
        },
        get_toolbar_meta : function(){
            return {
                batch_delete : 1
            };
        },
        on_toolbar_act : function(act, e){
            var mgr = this.get_singleton('mgr');
            var view = this.get_singleton('view');
            mgr.process_action(act, view.get_selected(), e);
        }
    });
    return Module;
});/**
 * 将file_object与Record结合起来，以便复用接口。
 * @author cluezhang
 * @date 2013-8-14
 */
define.pack("./photo.Record",["$","lib","common"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),
        
        common = require('common'),
        File = common.get('./file.file_object');
    var Photo_file = inherit(File, {
        constructor : function(cfg){
            this.ppid = cfg.ppid;
            this.take_time = cfg.take_time;
            Photo_file.superclass.constructor.apply(this, arguments);
        },
        get_ppid : function(){
            return this.ppid;
        },
        // 获取拍摄时间
        get_take_time : function(){
            return this.in_album;
        }
    });
    var File_record = inherit(Record, {
        constructor : function(cfg, id){
            File_record.superclass.constructor.call(this, new Photo_file(cfg), id);
        }
    });
    // 将File_object特有的方法添加到File_record中，并做兼容
    var file_record_prototype = File_record.prototype,
        file_prototype = Photo_file.prototype, fn_name, fn,
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
 * @date 2013-11-8
 */
define.pack("./photo.Store",["lib","common","./Requestor","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        Store = lib.get('./data.Store'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        
        Requestor = require('./Requestor'),
        
        $ = require('$');
    var requestor = new Requestor();
    var Module = inherit(Store, {
        page_size : 100,
        group_id : 0,
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            this.set_group(this.group_record);
        },
        set_group : function(group_record){
            this.group_record = group_record;
            this.group_id = group_record ? group_record.get('id') : 0;
            if(this.loaded){
                this.loaded = false;
                this.clear();
                this.reload();
            }
            this.trigger('groupchanged', group_record);
        },
        get_group : function(){
            return this.group_record;
        },
        reload : function(initial_size){
            var me = this;
            if(me.loading){
                return me.loading;
            }
            widgets.loading.show();
            // 首屏加载2.5倍屏幕
            me.loading = requestor.load_photos(this.group_id, 0, initial_size || Math.round(this.page_size*2.5)).done(function(records, end){
                me.load(records, end ? null : Number.MAX_VALUE);
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        },
        // 
        load_more : function(){
            if(this.loading || this.is_complete()){
                return this.loading;
            }
            var me = this;
            widgets.loading.show();
            me.loading = requestor.load_photos(this.group_id, this.size(), this.page_size).done(function(records, end){
                me.add(records);
                // 中间有改动？更新总数
//                if(total !== me.get_total_length()){
                if(end){
                    me.total_length = me.size();
                    me.trigger('metachanged');
                }
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        }
    });
    return Module;
});/**
 * 通用的缩略图加载，原网盘的加载与文件列表耦合太高。时间轴的加载是单例，存在风险。
 * @author cluezhang
 * @date 2013-11-10
 */
define.pack("./photo.Thumb_loader",["lib","common","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('photo.Thumb_loader'),
        
        image_loader = lib.get('./image_loader'),
        
        common = require('common'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        
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

    var BATCH_DOWNLOAD_LIMIT_COUNT; //批量下载文件数限制
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

            this.prefer_ids = [];//优化加载的图片的文件ids
            BATCH_DOWNLOAD_LIMIT_COUNT = query_user.get_cached_user() && query_user.get_cached_user().get_files_download_count_limit() || 10;
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
            if(map.hasOwnProperty(id)){
                return map[id];
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
            var id, tasks = [], me = this;
            $.each(this.prefer_ids, function(i, id) {
                if(map[id]) {
                    tasks.push(map[id]);
                    me.prefer_ids.splice(i, 1);
                }

                if(tasks.length >= BATCH_DOWNLOAD_LIMIT_COUNT) {
                    return false
                }
            });

            if(tasks.length >= BATCH_DOWNLOAD_LIMIT_COUNT) {
                return tasks;
            }

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
            var id, me = this, task;
            $.each(this.prefer_ids, function(i, id) {
                if(map[id]) {
                    task = map[id];
                    me.prefer_ids.splice(i, 1);
                    return false;
                }
            });

            if(task) {
                return task;
            }

            for(id in map){
                if(map.hasOwnProperty(id)){
                    return map[id];
                }
            }
        },
        // private
        // 批量请求ftn下载地址，必须是同目录下的
        batch_request_ftn : function(tasks){
            var me = this;
	        var req;
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
		        req = request.xhr_post({
			        url: 'http://web2.cgi.weiyun.com/qdisk_download.fcg',
			        cmd: 'DiskFileBatchDownload',
			        cavil: true,
			        pb_v2: true,
			        body: {
				        need_thumb: true,
				        file_list: $.map(tasks, function(task, i) {
					        return {
						        file_id: task.id,
						        filename: task.name,
						        pdir_key: task.pid
					        };
				        })
			        }
		        });

		        req.ok(function(msg, body, header, data) {
			        $.each(body['file_list'], function(index, img_rsp) {
				        var id = img_rsp['file_id'];
				        var task = map[id];
				        if(!task) {
					        return;
				        }
				        delete map[id]; // 加载好了的就删掉
				        var ret = parseInt(img_rsp['retcode'], 10), url;
				        if(ret === 0) {
					        var host = img_rsp['server_name'],
						        port = img_rsp['server_port'],
						        path = img_rsp['encode_url'];
					        if(img_rsp.download_url) {
						        url = img_rsp.download_url + (img_rsp.download_url.indexOf('?') > -1 ? '&' : '?') + 'size=' + me.width + '*' + me.height;
					        } else {
						        url = 'http://' + host + ':' + port + '/ftn_handler/' + path + '?size=' + me.width + '*' + me.height; // 64*64  /  128*128
					        }
					        url = https_tool.translate_url(url);
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
		        });
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
        /**
         * 设置优先加载图片的文件ids,用于优化加载指定图片
         * @param id_arr
         */
        set_prefer: function(id_arr) {
            this.prefer_ids = (id_arr || []).concat(this.prefer_ids); // 新加入的ids放前面优先处理
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./photo.View",["lib","common","main","$","./photo.Thumb_loader","./tmpl"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('photo.all.view'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        Multi_selection_plugin = common.get('./dataview.Multi_selection_plugin'),
	    huatuo_speed = common.get('./huatuo_speed'),
        
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),

        constants = common.get('./constants'),
        jquery_ui,
        drag_files,
        
        $ = require('$');
    var View = lib.get('./data.View'),
        Thumb_loader = require('./photo.Thumb_loader'),
        tmpl = require('./tmpl');

    var Module = inherit(View, {
        enable_box_select : true,
        enable_context_menu : true,
        enable_select : true,

        //拖拽的支持
        draggable : false,
        draggable_key : 'all_photo',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        thumb_size : 128,
        constructor : function(){
            Module.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            if(!this.thumb_loader){
                this.thumb_loader = new Thumb_loader({
                    width : this.thumb_size,
                    height : this.thumb_size
                });
            }
            var selection, selection_cfg, Selection;
            if(this.enable_select){
                selection_cfg = {
                    checkbox_selector : '.photo-view-list-checkbox',
                    item_selected_class : this.item_selected_class
                };
                Selection = this.enable_box_select ? Box_selection_plugin : Multi_selection_plugin;
                selection = new Selection(selection_cfg);
                selection.init(this);
                this.selection = selection;
            }
        },
        list_tpl : function(){
            return tmpl.photo_list();
        },
        list_selector : '.photo-view',
        tpl : function(record){
            return this.get_html([record]);
        },
        get_html : function(records){
            var me = this;
            return tmpl.photo_items({
                records : records,
                id_perfix : this.record_dom_map_perfix
            });
        },
        item_selector : 'div[data-list]',
        item_selected_class : 'photo-view-list-selected',
        item_menu_class : 'photo-view-list-menu',
        shortcuts : {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            }
        },
        get_selected : function(){
            if(this.enable_select){
                return this.selection.get_selected();
            }
        },
        cancel_selected : function(e){
            if(this.enable_select){
                this.selection.clear();
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            if(this.enable_context_menu){
                this.on('recordcontextmenu', this.show_context_menu, this);
            }
            // 直接点击时打开
            this.selection.on('before_select_click', function(record, e){
                this.trigger('action', 'open', record, e, this.get_action_extra());
                return false;
            }, this);

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {
                var me = this;
                // 如果启用拖拽，则在记录上按下时，不能框选
                this.selection.on('before_box_select', function($tar){
                    return !me.draggable || !me.get_record($tar);
                });

                this.set_draggable(true);

                me._render_drag_files();

            }
        },

        set_size : function(size){
            this.list_height = size.height;
            if(this.$empty_ui){
                this.$empty_ui.height(this.get_list_height());
            }
        },
        get_list_height : function(){
            return this.list_height - parseInt(this.$el.css('padding-top'), 10) - parseInt(this.$el.css('padding-bottom'), 10) - 10;
        },
        
        // ------------- 空白界面 ---------------
        enable_empty_ui : true,
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.empty(this.empty_type)).height(this.get_list_height()).insertAfter(this.$list);
            this.$list.hide();
        },
        /**
         * 隐藏空白界面
         * @protected
         */
        hide_empty_ui : function(){
            this.$empty_ui.remove();
            this.$list.show();
        },
        // ------------ 空白界面结束 --------------
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_context_menu : function(record, e){
            /*
             * 这里右键如果点击的是已选中记录，则是批量操作。
             * 如果是未选中记录，则单选它执行单操作
             */
            e.preventDefault();
            this.context_record = record;

            var menu = this.get_context_menu(),
                records;
            
            if(record.get('selected')){
                records = this.get_selected();
            }else{
                this.cancel_selected();
                record.set('selected', true);
                records = [record];
            }
            
            this.context_records = records;
            
            var visibles = records.length>1 ? {
                'delete' : 1,
                set_group : 1
            } : undefined;
            
            menu.show(e.pageX, e.pageY, visibles);
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
            });
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                items,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_records, e, me.get_action_extra({src:'contextmenu'}));
                };
                items = this.get_context_menu_cfg();
                $.each(items, function(index, item){
                    item.click = handler;
                });
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });
            }
            return menu;
        },
        get_context_menu_cfg : function(){
            return [
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'download',
                    text: '下载'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'delete',
                    text: '删除'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'jump',
                    text: '查看所在目录'
                },
                {
                    icon_class: 'ico-dimensional-menu',
                    group: 'edit',
                    id: 'qrcode',
                    split: true,
                    text: '获取二维码'
                },
                {
                    icon_class: 'ico-share',
                    group: 'edit',
                    id: 'share',
                    split: true,
                    text: '分享'
                }
            ];
        },
        // --------------- 缩略图及文本缩略部分 -----------------
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_thumb();
        },
        on_update : function(){
            Module.superclass.on_update.apply(this, arguments);
            this.update_thumb();
        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_thumb();
        },
        update_record_dom_thumb : function(record, $dom, $img){
            var $img_ct = $dom.find('>.photo-view-list-link');
            $img_ct.removeClass('photo-view-loading');
            $img_ct.find('img').remove().end().prepend($img);
        },
        update_thumb : function(){
            if(!this.rendered){
                return;
            }
            var thumb_state_attr = 'data-thumb-hooked';
            var $items = this.$list.children(this.item_selector), me = this;
            $items.each(function(){
                var $item = $(this), record;
                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
//                    console.log('try load thumb of '+record.get_name());
                    me.thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                        var $img = $(img), $replace_img;
                        if(!$img.data('used')){
                            $img.data('used', true);
                            $replace_img = $img;
                        }else{
                            $replace_img = $('<img />').attr('src', url);
                        }
                        $replace_img.attr('unselectable', 'on');
                        me.update_record_dom_thumb(record, $item, $replace_img);
                    });/*.fail(function(){
                        $item.find('img').replaceWith($('<img />').attr('src', 'http://imgcache.qq.com/vipstyle/nr/box/img/preview/ico_fail_min104470.png'));
                    });*/
                }
            });
            this.update_draggable();
            //认为已加载到数据并渲染完DOM
            if($items.length) {
	            //测速
	            try{
		            var flag = '21254-1-10';
		            if(window.g_start_time) {
			            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			            huatuo_speed.report();
		            }
	            } catch(e) {

	            }
            }
        },
        // --------------- 缩略图结束 -----------------

        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },

        update_draggable : function(){
            if(!this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },

        handle_start_drag : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.draggable || !record){
                return false;
            }
            var items = [];
            // 如果拖动的文件已经选中，则表示拖动所有选中的文件
            if(record.get('selected')){
                items = this.get_selected();
            }else{ // 反之，只拖动当前一个，并清除选中
                this.store.each(function(rec){
                    rec.set('selected', rec === record);
                });
                items = [record];
            }

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if(items.length>1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files : items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag : function(){
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
            var mouseleave = 'mouseleave.file_list_ddd_files',
                can_drag_files = false;

            try {
                if (window.external.DragFiles) {
                    require.async('drag_files', function (mod) { //异步加载drag_files
                        drag_files = mod.get('./drag_files');
                    });
                    can_drag_files = true;
                }
            } catch (e) {
                console.error(e.message);
            }


            this
                // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        }
        
    });
    return Module;
});/**
 * 组视图界面
 * @author trump
 * @date 2013-11-06
 */
define.pack("./time.Panel",["lib","common","$","./View_mode","./time.store","./time.view"],function (require, exports, module) {
    var inherit = require('lib').get('./inherit'),
        user_log = require('common').get('./user_log'),
        $ = require('$');

    var Module = inherit(require('./View_mode'), {
        inspect: function () {
            var me = this;
            if (me.store) {
                return;
            }
            me.store = require('./time.store');
            me.view = require('./time.view');
            me.view.set_thumb_loader(this.thumb_loader);
            me.listenTo(me.store, 'change', function (event, args) {
                var view_fn = this.view[ 'on_' + event ];
                if (typeof view_fn == 'function') {
                    view_fn.apply(this.view, args);
                }
            });
            me.listenTo(me.view, 'change', function (event, args) {
                var store_fn = this.store['on_' + event];
                if (typeof store_fn == 'function') {
                    store_fn.apply(this.store, args);
                }
            });
        },
        on_activate: function () {
            var me = this;
            me.inspect();
            me.view.render(me.$ct);
            me.store.render();
        },
        on_deactivate: function () {
            this.store.destroy();
            this.view.destroy();
        },

        get_toolbar_meta: function () {
            return {
                batch_delete: 1
            };
        },
        on_toolbar_act: function (act) {
            if(this.view[act]){
                this.view[act].call(this.view);
            }
        },
        on_refresh : function(){
            var me = this;
            Module.superclass.on_refresh.apply(this, arguments);
            me.store.render(true);
        }
    });
    return Module;
});/**
 * User: trumpli
 * Date: 13-11-7
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */
define.pack("./time.Photo_Node",["$","lib","common"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
	    common = require('common'),
        date_time = lib.get('./date_time'),
        inherit = lib.get('./inherit'),
	    constants = common.get('./constants'),
        Photo_Node = inherit(common.get('./file.file_object'), {
            constructor: function (cfg) {
                //转换成file_object的参数
                var props = {};
                props.id = cfg.file_id;
                props.pid = cfg.pdir_key;
                props.ppid = cfg.ppdir_key;
                props.name = cfg.file_name || cfg.filename;
                props.size = cfg.file_size;
                props.cur_size = cfg.file_size;
                props.create_time = cfg.file_ctime;
                props.modify_time = cfg.file_mtime;
                props.file_md5 = cfg.file_md5;
                props.file_sha = cfg.file_sha;
                props.file_ver = cfg.file_version;
                Photo_Node.superclass.constructor.apply(this, [props]);
	            if(cfg.ext_info && (cfg.ext_info.thumb_url || cfg.ext_info.https_url)) {
		            this.set_thumb_url(cfg.ext_info.thumb_url, cfg.ext_info.https_url);
	            }
                this._checked = false;
                this.token_time = cfg.file_ttime || cfg.ext_info && cfg.ext_info.take_time;//拍摄时间
                if(typeof this.token_time === 'number') {
                  this.token_time = date_time.timestamp2date(this.token_time);
                }
                this.tdate = date_time.parse_str(this.token_time);
                this.pid = cfg.pdir_key;
                this.ppid = cfg.ppdir_key;
            }
        });
    /**
     * 返回下载地址
     * @param node
     * @param size
     * @returns {string}
     */
    Photo_Node.getDownUrl = function (node, size) {
        return '';
    };
   /* require.async('downloader', function (mod) { //异步加载downloader
        downloader = mod.get('./downloader');
        Photo_Node.getDownUrl = function (node, size) { //初始化 ui 获取image图片的方法
            if (size) {
                return downloader.get_down_url([node], {abs: size , thumb: true}, true);
            }
            return downloader.get_down_url([node], {}, true);
        };
    });*/
    $.extend(Photo_Node.prototype, {
        get_ppid: function() {
            return this.ppid;
        },
        get_pid: function(){
            return this.pid;
        },
        /**
         * 10 -> '10' ; 1 -> '01'
         * @param num
         * @returns {string}
         * @private
         */
        _ten: function (num) {
            return num < 10 ? '0' + num : num;
        },
        /**
         * 获取日期ID
         * @returns {String}
         */
        get_day_id: function () {
            if( this.day_id){
                return this.day_id;
            }
            return (this.day_id =  this.tdate.getFullYear() + '' + this._ten(this.tdate.getMonth() + 1) + '' + this._ten(this.tdate.getDate()));
        },
        /**
         * 获取拍摄时间
         * @returns {*}
         */
        get_token_time: function () {
            return this.token_time;
        },
        get_token_date: function(){
            return this.tdate;
        },
        /**
         * 节点反选
         * @returns {boolean}
         */
        toggle_check: function () {
            return this._checked = !this._checked;
        },
        set_checked: function(){
            this._checked = true;
        },
        set_unChecked: function(){
            this._checked = false;
        },
	    set_thumb_url: function(thumb_url, https_url) {
		    this._thumb_url = thumb_url;
		    this._https_url = https_url;
	    },
        /**
         * 获取缩略图地址
         * @param size
         * @returns {String}
         */
        get_thumb_url: function (size, order) {
	        if(order == 'http') {
		        return this._thumb_url || (this._thumb_url = Photo_Node.getDownUrl(this, size));
	        } else if(order == 'https') {
		        return this._https_url;
	        } else {
		        return constants.IS_HTTPS ? this._https_url : (this._thumb_url || ( this._thumb_url = Photo_Node.getDownUrl(this, size)));
	        }
        },
        /**
         * 获取预览地址
         * @param size
         * @returns {String}
         */
        get_preview_url: function (size) {
            var urls = !this._preview_url || (this._preview_url = {});
            return urls[size] || (urls[size] = Photo_Node.getDownUrl(this, size));
        },
        /**
         * 获取下载地址
         * @returns {String}
         */
        get_down_url: function () {
            return this._down_url || ( this._down_url = Photo_Node.getDownUrl(this));
        }
    });
    return Photo_Node;
});
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 * To change this template use File | Settings | File Templates.
 */
define.pack("./time.Select",["lib","common","$","./time.store"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        store,
        get_store= function(){
           return store || (store = require('./time.store'));
        },

        $body,
        selected_cache = {
            length:0
        };

    return {
        cell_id_prefix : 'time_',
        get_dom_id : function(file_id){
            return this.cell_id_prefix + file_id;
        },
        get_file_id : function(dom_id){
            if(dom_id && dom_id.indexOf(this.cell_id_prefix) === 0){
                return dom_id.slice(this.cell_id_prefix.length);
            }
        },
        /**
         * @param $to
         */
        render: function($to){
            $body = $to;
            selected_cache = {length:0};
        },
        bind_select_box : function(sel_box){
            var old_sel_box = this.sel_box;
            if(old_sel_box){
                old_sel_box.off('select_change', this.handle_selection_change, this);
            }
            this.sel_box = sel_box;
            // 绑定后进行一次同步
            var file_id, selecteds = [];
            for(file_id in selected_cache){
                if(selected_cache.hasOwnProperty(file_id)){
                    selecteds.push(this.get_dom_id(file_id));
                }
            }
            sel_box.clear_selected();
            sel_box.set_selected_status(selecteds, true);
            
            sel_box.on('select_change', this.handle_selection_change, this);
        },
        handle_selection_change : function(sel_id_map, unsel_id_map){
            var store = get_store(), html_id;
            for (html_id in sel_id_map) {
                if (sel_id_map.hasOwnProperty(html_id)) {
                    var id = this.get_file_id(html_id),
                        node = store.get_node_by_id(id);
                    if (node) {
                        node.set_checked();
                        if(!selected_cache.hasOwnProperty(id)){
                            selected_cache[id] = id;
                            selected_cache.length +=1;
                        }
                    }
                }
            }
            for (html_id in unsel_id_map) {
                if (unsel_id_map.hasOwnProperty(html_id)) {
                    var id = this.get_file_id(html_id),
                        node = store.get_node_by_id(id);
                    if (node) {
                        node.set_unChecked();
                        if(selected_cache.hasOwnProperty(id)){
                            delete selected_cache[id];
                            selected_cache.length -=1;
                        }
                    }
                }
            }
        },
        /**
         * 选中元素
         * @param $el
         * @param file_id
         */
        select: function ($el,file_id) {
            if(selected_cache[file_id]){
                return true;
            }
            var sel_box = this.sel_box;
            if(sel_box){
                sel_box.set_selected_status([this.get_dom_id(file_id)], true);
            }else{
                $el.addClass('photo-view-list-selected');
            }
            selected_cache[file_id] = file_id;
            selected_cache.length+=1;
            return true;
        },
        /**
         * 反选元素
         * @param $el
         * @param file_id
         */
        un_select: function ($el,file_id) {
            if(!file_id){
                return true;
            }
            var sel_box = this.sel_box;
            if(sel_box){
                sel_box.set_selected_status([this.get_dom_id(file_id)], false);
            }else{
                $el.removeClass('photo-view-list-selected');
            }
            delete selected_cache[file_id];
            selected_cache.length-=1;
            return true;
        },
        clear : function(){
            selected_cache = {
                length : 0
            };
        },
        /**
         * 是否被选中
         * @param file_id
         * @returns {boolean}
         */
        is_selected: function(file_id){
            return !!selected_cache[file_id];
        },
        /**
         * 反选其他，但选中自己
         * @param file_id
         */
        unselected_but: function(file_id){
            for(var key in selected_cache){
                if(selected_cache.hasOwnProperty(key)){
                    var node = get_store().get_node_by_id(key);
                    if( node && key !== file_id ){
                        node.toggle_check();//退出选中状态
                        this.un_select($body.find('[data-file-id='+key+']'),key);
                    }
                }
            }
            this.select($body.find('[data-file-id='+file_id+']'),file_id);
        },
        /**
         * 返回选中的个数
         * @returns {number}
         */
        get_selected_length: function(){
            return selected_cache.length;
        },
        /**
         * 获取选中的节点
         * @return {Array<Poto_Node>}
         */
        get_selected_nodes: function(){
            var ret = [];
            if(selected_cache.length){
                for(var key in selected_cache){
                    if(selected_cache.hasOwnProperty(key)){
                        var node = get_store().get_node_by_id(key);
                        if( node ){
                            ret.push(node);
                        }
                    }
                }
            }
            return ret;
        }
    };
});
/**
 * User: trumpli
 * Date: 13-11-7
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */
define.pack("./time.Time_Group",["$","lib"],function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        date_time = lib.get('./date_time'),
        Time_Group = function (opt) {
            this.same_photo_map = {};
            this.array = [];
            this.length = 0;
            this.offset = 0;//已被读取的位置
            var date = date_time.parse_str(opt.token_time);
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.date = date.getDate();
            this._is_dirty = false;
            this.day_id = this.year + '' + this._ten(this.month) + '' + this._ten(this.date);
        };
    $.extend(Time_Group.prototype, {
        /**
         * 标记为需要没有完成输出
         * @param dirty
         */
        set_dirty: function(dirty){
           this._is_dirty = dirty;
        },
        /**
         * 返回是否全部输出
         * @returns {boolean}
         */
        is_dirty: function(){
            return this._is_dirty;
        },
        /**
         * 10 -> '10' ; 1 -> '01'
         * @param num
         * @returns {string}
         * @private
         */
        _ten: function (num) {
            return num < 10 ? '0' + num : num;
        },
        /**
         * 获取日期ID
         * @returns {String}
         */
        get_day_id: function () {
            return this.day_id;
        },
        get_year: function () {
            return this.year;
        },
        get_month: function () {
            return this.month;
        },
        get_date: function () {
            return this.date;
        },
        /**
         * 添加节点
         * @param {Photo_Node} node
         */
        add_node: function (node) {
            var file_sha = node.get_file_sha();
            if(!this.same_photo_map[file_sha]) {
                this.array.push(node);
                this.length += 1;
            }

            this.same_photo_map[file_sha] = this.same_photo_map[file_sha] || [];
            this.same_photo_map[file_sha].push(node);
        },
        /**
         * 删除节点
         * @param {HashMap<String,boolean>} id_map
         */
        remove_nodes: function (id_map) {
            var me = this,len = me.length;
            while(len){
                len-=1;
                var cur_node = me.array[len];
                if ( id_map.hasOwnProperty(cur_node.get_id()) ) {
                    var file_sha = cur_node.get_file_sha(),
                        same_nodes = me.same_photo_map[file_sha],
                        same_nodes_len = same_nodes.length;
                    //要判断相同的照片是否删除完
                    $.each(same_nodes, function(i, node) {
                        if(id_map.hasOwnProperty(node.get_id())) {
                            same_nodes_len--;
                        }
                    });
                    if(same_nodes_len <= 0) {
                        me.array.splice(len, 1);
                        me.length -= 1;
                        me.same_photo_map[file_sha] = [];
                    }
                }
            }
            /**

             for (var len = me.length - 1; len >= 0; len--) {
                if ( id_map.hasOwnProperty(me.array[len].get_id()) ) {
                    me.array.splice(len, 1);
                    me.length -= 1;
                }
            }
             */
            return me.length;
        },
        /**
         * 重置
         */
        reset: function () {
            this.offset = 0;
        },
        get_array: function () {
            return this.array;
        },
        each: function(fn){
            for(var i = 0 ,j = this.array.length;i<j;i++){
                fn.call(null,this.array[i]);
            }
        },

        get_same_nodes_by_sha: function(file_sha) {
            return this.same_photo_map[file_sha];
        },

        has_del_same_nodes: function(node) {
            var file_sha = node.get_file_sha();
            if(!this.get_same_nodes_by_sha(file_sha).length) {
                return true;
            }

            return false;
        }
    });
    return Time_Group;
});
/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define.pack("./time.cgi",["lib","common","$","./time.Photo_Node","./time.Time_Group"],function (require, exports, module) {
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
/**
 * 文件菜单UI逻辑(包括文件的"更多"菜单和右键菜单)
 * @author trump
 * @date 13-11-09
 */
define.pack("./time.menu",["lib","common","./time.Select"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        photo_time_event = common.get('./global.global_event').namespace('photo_time_event'),
        click_tj = common.get('./configs.click_tj'),

        Select = require('./time.Select'),
        item_maps = {
            //时间轴
            time: {
                download_time: 1,
                remove_time: 1,
                share_time: 1,
                qrcode: 1,
                jump: 1
            }
        },
        undefined;
    var menu = new Module('photo_file_menu', {

        render: function () {
            var me = this;
            me.photo_time_menu = me._create_photo_time_menu();
        },

        /**
         * 显示相册时间轴右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        show_photo_time_menu: function (x, y, $on) {
            var visible_items = $.extend({}, item_maps.time);
            if( Select.get_selected_length() > 1 ){
                delete visible_items['download_time'];
                delete visible_items['share_time'];
                delete visible_items['qrcode'];
                delete visible_items['jump'];
            }
            this.photo_time_menu.show(x, y, visible_items, $on);
        },
        /**
         * 隐藏相册时间轴右键菜单
         */
        hide_photo_time_menu: function(){
            this.photo_time_menu.hide();
        },

        _create_photo_time_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    me.create_item('download_time'),
                    me.create_item('remove_time'),
                    me.create_item('jump'),
                    me.create_item('qrcode'),
                    me.create_item('share_time')
                ],
                hide_on_click: false
            });

            return menu;
        },

        create_item: function (id) {
            switch (id) {
                case 'share_time':
                    return {
                        id: id,
                        text: '分享',
                        icon_class: 'ico-share',
                        split: true,
                        group: 'edit',
                        click: function(e) {
                            photo_time_event.trigger('share_time');
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'remove_time':
                    return {
                        id: id,
                        text: '删除',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('remove_time');
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'download_time':
                    return {
                        id: id,
                        text: '下载',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('download_time', e);
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'jump':
                    return {
                        id: id,
                        text: '查看所在目录',
                        icon_class: 'ico-null',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('jump');
                            menu.hide_photo_time_menu();
                            //user_log('FILE_QRCODE_PHOTO_RIGHT');
                        }
                    };
                case 'qrcode':
                    return {
                        id: id,
                        text: '获取二维码',
                        icon_class: 'ico-dimensional-menu',
                        group: 'edit',
                        split: true,
                        click: function (e) {
                            photo_time_event.trigger('qrcode_file');
                            menu.hide_photo_time_menu();
                            user_log('FILE_QRCODE_PHOTO_RIGHT');
                        }
                    };
            }
        }
    });
    return menu;
});/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 * To change this template use File | Settings | File Templates.
 */
define.pack("./time.store",["lib","common","$","./time.cgi"],function (require, exports, module) {
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
/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define.pack("./time.view",["lib","common","$","main","./tmpl","./time.Select","./time.menu","./Remover","./time.store","./axisMap","file_qrcode","jump_path"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        photo_time_event = common.get('./global.global_event').namespace('photo_time_event'),
        progress = common.get('./ui.progress'),
        SelectBox = common.get('./ui.SelectBox'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),

        scroller = require('main').get('./ui').get_scroller(),

        downloader = $.noop,

        tmpl = require('./tmpl'),
        Select = require('./time.Select'),
        menu = require('./time.menu'),
        store,
        PADDING_LEFT = 146,
        LINE_HEIGHT = 0 ,
        IMG_THUMB_SIZE = '128*128',
        IMG_PREVIEW_SIZE = '1024*1024',
        item_class = 'photo-view-list',
        item_selected_class = 'photo-view-list-selected',
        cell_id_prefix = 'time_',
        row_id_prefix = 'day_id_',

        jquery_ui,
        drag_files,
        Remover = require('./Remover'),

        undefined;

    require.async('downloader', function (mod) { //异步加载downloader
        downloader = mod.get('./downloader');
    });
    
    Select.cell_id_prefix = cell_id_prefix;

    var View = new Module('photo_time_view', {});

    //私有方法
    $.extend(View, {
        /**
         * 获取文件对象
         * @param {String} file_id
         * @returns {*}
         */
        get_node: function (file_id) {
            return this.get_store().get_node_by_id(file_id);
        },
        /**
         * 是否可以继续加载数据
         * @returns {boolean}
         */
        is_able_load: function () {
            if (this.get_store().is_all_show() || this.get_store().is_loading()) {
                return false;
            }
            return true;
        },
        /**
         * 获取jQuery元素 按文件id
         * @param file_id
         * @returns {*|jQuery|HTMLElement}
         */
        get_$item_by_id: function (file_id) {
            return $('#' + cell_id_prefix + file_id);
        },
        /**
         * 获取元素对象的Node
         * @param el
         * @returns {*}
         */
        get_file_by_el: function (el) {
            return this.get_store().get_node_by_id(this.get_$item_id(el));
        },
        /**
         * 获取元素对应的$Dom对象
         * @param el
         * @returns {*|jQuery}
         */
        get_$item: function (el) {
            return $(el).closest('[data-file-id]');
        },
        /**
         * 获取元素的对应的file_id
         * @param el
         * @returns {String}
         */
        get_$item_id: function (el) {
            return this.get_$item(el).attr('data-file-id');
        },
        /**
         * @returns {store}
         */
        get_store: function () {
            return store || (store = require('./time.store'));
        },
        /**
         * 计算出符合阅读的文件名
         * @param {String} file_name
         * @returns {String} name
         */
        get_realable_name: function (file_name) {
            var append_str = file_name.slice(file_name.length - 6),
                cut_len = 16;
            file_name = text.smart_sub(file_name.slice(0, file_name.length - 6), cut_len) + append_str;//截取一个合理长度一行能显示的字条
            return file_name;
        },
        /**
         * 事件触发
         */
        trigger_event: function () {
            var event = Array.prototype.shift.call(arguments);
            this.trigger('change', event, arguments);
        },
        /**
         * 返回时间戳的页面主体框架； 开启事件监控
         * @returns {jQuery} $body
         */
        get_$body: function () {
            var me = this;
            if (me._$body) {
                return me._$body;
            }
            me.get_$main().append(tmpl.time_body());
            me._$body = $('#photo-time-view');
            Select.render(me._$body);
            me._start_listen();
            return me._$body;
        },
        get_$els: function () {
            return View.get_$body().children();
        },
        /**
         * 返回相册主题框架
         * @returns {jQuery}
         */
        get_$main: function () {
            return this.$main_box || {};
        },
        /**
         * 节点坐标地图
         */
        get_axis_map: function () {
            var me = this;
            if (!me.axis_map) {
                me.axis_map = require('./axisMap').get_instance({
                    ns: 'photo_times',
                    get_$els: me.get_$els,
                    $scroller: scroller.get_$el(),
                    child_filter: '.' + item_class,
                    //$static_position: me.get_$body(),
                    container_width: function () {
                        return me.get_$els().eq(0).width();
                    }
                });
            }
            return me.axis_map;
        },
        /**
         * 加载html
         */
        load_html: function () {
            var me = this;
            var group_nodes = me.get_store().get_more(
                (me.get_$main().width() - PADDING_LEFT),
                (LINE_HEIGHT = me.get_$main().height()), 140, 15);
            //构造html
            $.each(group_nodes, function (i, group) {
                if (group.is_dirty()) {
                    $('#day_id_' + group.get_day_id()).remove();
                    group.set_dirty(false);
                }
                me.get_$body().append(tmpl.time_row(group));
                me.update_thumb(group);
            });

            if (group_nodes.length > 0) {
                me.refresh_SelectBox();
            }
            me.get_axis_map().re_paint();

            //测速
	        try{
		        var flag = '21254-1-10';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        update_thumb: function(group) {
            var me = this;

            $.each(group.get_array(), function(i, node) {
                var thumb_state_attr = 'data-thumb-hooked';

                var $item = $('#' + cell_id_prefix + node.get_id());

                var thumb_state = $item.data(thumb_state_attr);
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    me.thumb_loader.get(node.get_pid(), node.get_id(), node.get_name(), node.get_thumb_url()).done(function(url, img){
                        var $img = $(img), $replace_img;
                        if(!$img.data('used')){
                            $img.data('used', true);
                            $replace_img = $img;
                        }else{
                            $replace_img = $('<img />').attr('src', url);
                        }
                        $replace_img.attr({
                            'unselectable': 'on'
                        });

                        $item.find('a')
                             .removeClass('photo-view-loading')
                             .prepend($replace_img);
                    });
                    }
            });
        },
        /**
         * 刷新框选
         */
        refresh_SelectBox: function () {
            Select.clear();
            if (this.sel_box) {
                this.sel_box.refresh();
            }
        },
        get_time_height: function () {
            return $('#photo-time-view').height();
        }
    });

    //处理用户手动触发事件
    $.extend(View, {
        /**
         * appbox全屏预览
         * @param node
         * @param url_hander
         * @returns {*}
         */
        appbox_preview: function (node, url_hander) {
            var ex = window.external,
                def = $.Deferred(),
                support = constants.IS_APPBOX && (
                    (ex.PreviewImage && ex.IsCanPreviewImage && ex.IsCanPreviewImage(node.get_name())) ||
                        (ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(node.get_name()))
                    );
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        mod.get('./full_screen_preview').preview(node);
                        def.resolve();
                    } catch (e) {
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
         * web 预览
         * @param node
         * @param url_handler
         */
        web_preview: function (node, url_handler) {
            var me = this;
            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    images = me.get_store().get_all_unique_nodes(),
                    index = $.inArray(node, images);// 当前图片所在的索引位置

                image_preview.start({
                    complete: me.get_store().is_all_show(),
                    load_more: function (callback) {
                        me.get_store().thumb_load_more(function (ret) {
                            if (!ret.fail) {
                                images = me.get_store().get_all_unique_nodes();
                                callback.call(null, ret);
                            } else {
                                callback.call(null, ret);
                            }
                        });
                    },
                    total: images.length,
                    index: index,
                    images: images,
                    code: function (index) {
                        var file = images[index];
                        if (file) {
                            me.qrcode_file(file);
                        }
                    },
                    share: function (index) {
                        var file = images[index];
                        if (file) {
                            me.link_share(file);
                        }
                    },
                    download: function (index, e) {
                        var file = images[index];
                        if (file) {
                            me.download_files(file, e);
                        }
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file, function (success) {
                            if (success) {
                                images.splice(index, 1);
                            }
                            callback();
                        }, me);
                    }
                });
            });
        },
        /**
         * 文件预览
         * @param e
         */
        preview_image: function (e) {
            e.preventDefault();
            if (!ie_click_hacker.is_click_event(e)) {
                return;
            }
            var me = View,
                node = me.get_file_by_el(this);
            me.appbox_preview(node,function () {
                return this.get_down_url();
            }).fail(function () {
                    me.web_preview(node, function (size) {
                        return this.get_preview_url(size || IMG_PREVIEW_SIZE);
                    });
                });

        },
        /**
         * 勾选文件
         * @param e
         */
        select_file: function (e) {
            e.stopPropagation();
            var me = View,
                file = me.get_file_by_el(this);
            Select[ file.toggle_check() ? 'select' : 'un_select'](me.get_$item(this), file.get_id());
        },
        /**
         * 文件下载
         */
        download_files: function (file, e) {
            var item = file;
            if (!item) {
                if (Select.get_selected_nodes().length) {
                    item = Select.get_selected_nodes()[0];
                }
            }
            if (item) {
                downloader.down(item, e);
            }
        },
        /**
         * 文件二维码
         */
        qrcode_file: function (file) {
            if (!file) {
                if (Select.get_selected_nodes().length) {
                    require('file_qrcode').get('./file_qrcode').show(Select.get_selected_nodes())
                }
            } else {
                require('file_qrcode').get('./file_qrcode').show([file]);
            }
        },
        /**
         * 跳转到具体路径
         */
        jump: function(file) {
            if (!file) {
                if (Select.get_selected_nodes().length == 1) {
                    var files = Select.get_selected_nodes();
                    require('jump_path').get('./jump_path').jump(files[0]);
                }
            } else{
                require('jump_path').get('./jump_path').jump(file);
            }
        },

        when_remover_ready: function () {
            var def = $.Deferred(),
                me = this,
                remover = me.remover;

            if (remover) {
                def.resolve(remover);
            } else {
                require.async('disk', function (disk) {
                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
                    remover.render();
                    def.resolve(remover);
                });
            }
            return def;
        },
        get_delete_params: function (first_file_name, count) {
            return {
                title: '删除图片',
                up_msg: count > 1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？'
            };
        },
        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },
        do_delete: function(nodes, callback, scope) {
            var remover = this.get_remover(),
                me = this;

            nodes = [].concat(nodes);
            var all_nodes = [],
                store = this.get_store(),
                del_nodes_map = {},
                tip_same_num = 0,
                many_node_has_same = 0;
            $.each(nodes, function(i, node) {
                var group = store.get_group_by_node(node),
                    node_file_sha = node.get_file_sha(),
                    same_nodes = group.get_same_nodes_by_sha(node_file_sha);
                all_nodes = all_nodes.concat(same_nodes);
                del_nodes_map[node_file_sha] = same_nodes.length;
                many_node_has_same++;
                if(same_nodes.length > 1) {
                    tip_same_num = same_nodes.length;
                }

            });
            var desc = all_nodes.length > 1 ? many_node_has_same > 1 ? '确定要删除这些图片吗？' : '共有' +tip_same_num+'张相同图片，确定全部删除吗？' : '确定要删除这张图片吗？';
            remover.remove_confirm(all_nodes, desc).done(function(success_nodes, failure_nodes) {
                me.get_store().remove_data(success_nodes);
                if (callback) {
                    callback.call(scope, true);
                }

                var should_reflash = false;
                if(failure_nodes.length) {
                    $.each(failure_nodes, function(i, node) {
                        if(del_nodes_map[node.get_file_sha()] > 1) { //如果有部分节点删除失败，且失败的节点有相同的照片，则进行页面刷新处理，重新拉数据渲染
                            should_reflash = true;
                            return false;
                        }
                    });
                    should_reflash && store.render(true);//刷新操作
                }
            });
        },
        /*do_delete: function (nodes, callback, scope) {
            var me = this;
            nodes = [].concat(nodes);
            var delete_nodes_len,
                all_nodes = [],
                store = this.get_store(),
                del_nodes_map = {},
                tip_same_num = 0,
                many_node_has_same = 0;
            $.each(nodes, function(i, node) {
                var group = store.get_group_by_node(node),
                    node_file_sha = node.get_file_sha(),
                    same_nodes = group.get_same_nodes_by_sha(node_file_sha);
                all_nodes = all_nodes.concat(same_nodes);
                del_nodes_map[node_file_sha] = same_nodes.length;
                many_node_has_same++;
                if(same_nodes.length > 1) {
                    tip_same_num = same_nodes.length;
                }

            });
            delete_nodes_len = all_nodes.length;
            widgets.confirm(
                '删除图片',

                '已删除的图片可以在回收站找到',
                function () {
                    progress.show("正在删除0/" + delete_nodes_len);
                    requestor.step_delete_photos(all_nodes).progress(function (success_nodes, failure_nodes) {
                        progress.show("正在删除" + success_nodes.length + "/" + delete_nodes_len);
                    }).done(function (success_nodes, failure_nodes) {
                            me.get_store().remove_data(success_nodes);
//                        ds_event.trigger('remove', success_nodes, {
//                            src : me.store
//                        });
                            if (failure_nodes.length) {
                                mini_tip.warn('部分图片删除失败');
                            } else {
                                mini_tip.ok('删除图片成功');
                            }
                            if (callback) {
                                callback.call(scope, true);
                            }

                            var should_reflash = false;
                            if(failure_nodes.length) {
                                $.each(failure_nodes, function(i, node) {
                                   if(del_nodes_map[node.get_file_sha()] > 1) { //如果有部分节点删除失败，且失败的节点有相同的照片，则进行页面刷新处理，重新拉数据渲染
                                       should_reflash = true;
                                       return false;
                                   }
                                });
                                should_reflash && store.render(true);//刷新操作
                            }
                        }).fail(function (msg) {
                            if (msg !== requestor.canceled) {
                                mini_tip.error(msg);
                            }
                        }).always(function () {
                            progress.hide();
                        });
                },
                $.noop,
                null,
                true
            );
//            this.when_remover_ready().done(function(remover){
//                var remove_worker = me.remover.remove_confirm(nodes, null, false, undefined, undefined, me.get_delete_params);
//                remove_worker.on('has_ok', function (removed_file_ids) {
//                    me.get_store().remove_data(nodes);
//                    if(callback){
//                        callback.call(scope, true);
//                    }
//                });
//            });
        },*/
        /**
         * 删除文件
         */
        remove_files: function () {
            var me = View,
                files = Select.get_selected_nodes(),
                len = files.length;
            if (len > 0) {
                me.do_delete(files);
            } else {
                mini_tip.warn('请选择图片');
            }
        },
        /**
         * 链接分享
         */
        link_share: function (file) {
            if (file) {
                require.async('share_enter', function (share_enter) {
                    share_enter.get('./share_enter').start_share(file);
                });
            } else {
                var files = Select.get_selected_nodes();
                if (files.length) {
                    require.async('share_enter', function (share_enter) {
                        share_enter.get('./share_enter').start_share(files[0]);
                    });
                }
            }
        },
        /**
         * 右键监听
         * @param e
         */
        right_mouse: function (e) {
            if (e.which !== 3 && e.which !== 0) {
                return;
            }
            e.stopImmediatePropagation();
            if (e.handleObj.type === 'contextmenu') {
                e.preventDefault();
            }
            var me = View,
                $on_item = me.get_$item(this),
                file_id = me.get_$item_id(this);
            if (!Select.is_selected(file_id)) {
                Select.unselected_but(file_id);//清除其他选中，并选中自己
            }
            menu.show_photo_time_menu(e.pageX, e.pageY, $on_item);//显示右键菜单
        },
        /**
         * 调整加载顺序
         * @param [repaint] {boolean}
         */
        adjust_load_order: function (repaint) {
            var me = this;
            if (me._adjust_inter) {
                clearTimeout(me._adjust_inter);
            }
            me._adjust_inter = setTimeout(function () {
                if (repaint) {
                    me.get_axis_map().re_paint();
                }
                var min_y = me.get_$main().offset().top + scroller.get_$el().scrollTop();
                var id_array = me.get_axis_map().match_range(10000000, -10000000, min_y + scroller.get_height(), min_y);
                /*$.each(id_array, function (i, id) {
                    if (!$('#' + id).data('image_ok')) {
                        img_ready.priority_sort(id.replace('time_', ''));
                        return false;
                    }
                })*/
                id_array = $.map(id_array, function(id) {
                    return id.slice(5); //去掉前面的'time_'
                });
                me.thumb_loader.set_prefer(id_array);
            }, 50);

        },
        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         */
        resize: function () {
            if (this.is_able_load() && this.get_time_height() <= this.get_$main().height()) {
                this.load_html();
            }
            this.adjust_load_order(true);
        },
        /**
         * 滚动页面时加载更多数据
         */
        scroll: function () {
            if (this.is_able_load() && scroller.is_reach_bottom()) {
                this.load_html();
                this.adjust_load_order(true);
            } else {
                this.adjust_load_order();
            }
        },
        /**
         * 工具条动作 批量删除
         */
        batch_delete: function () {
            this.remove_files();
        },
        
        /**
         * 禁用框选
         */
        disable_selection: function () {
            this.sel_box && this.sel_box.enable();
        },
        /**
         * 启用框选
         */
        enable_selection: function () {
            this.sel_box && this.sel_box.disable();
        }
    });

    //暴露的外部方法
    $.extend(View, {
        /**
         * 设置缩略图加载器
         * @param thumb_loader
         */
        set_thumb_loader: function(thumb_loader) {
            this.thumb_loader = thumb_loader;
        },
        /**
         * 开始监听
         * @private
         */
        _start_listen: function () {
            var me = this;

            me.get_$body()
                .on('click', '.photo-view-list-checkbox', this.select_file)//勾选
                .on('click.photo-view-list', '[data-file-id]', this.preview_image)//预览
                .on('mousedown.file_list_context_menu', '.photo-view-list', this.right_mouse);//右键
            me.listenTo(scroller, {
                'scroll': me.scroll,
                'resize': me.resize
            });

            this.disable_selection();
        },
        /**
         * 停止监听
         * @private
         */
        _stop_listen: function () {
            var me = this;
            me.off();
            me.stopListening(scroller);
            me.enable_selection();
        },
        /**
         * 初始化一次
         * @private
         */
        _once_render: function () {
            var me = this;
            if (me._view_rendered) {
                return;
            }
            me._view_rendered = true;
            menu.render();
            me.listenTo(photo_time_event, {
                'share_time': function () {
                    me.link_share();
                }, 'remove_time': function () {
                    me.remove_files();
                }, 'download_time': function (e) {
                    me.download_files(null, e);
                }, 'qrcode_file': function () {
                    me.qrcode_file();
                }, 'jump': function() {
                    me.jump();
                }
            });


            me.sel_box = new SelectBox({
                ns: 'photo_times',
                get_$els: me.get_$els,
                $scroller: scroller.get_$el(),
                child_filter: '.' + item_class,
                selected_class: item_selected_class,
                clear_on: function ($tar) {
                    return $tar.closest('.' + item_class).length === 0;
                },
                container_width: function () {
                    return me.get_$els().eq(0).width();
                }
            });
            Select.bind_select_box(me.sel_box);
        },
        /**
         * @param {jQuery} $to
         */
        render: function ($to) {
            var me = this;
            me.$main_box = $to;
            me._once_render();
            me.destroy();

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {

                // 如果启用拖拽，则在记录上按下时，不能框选
                //me.sel_box.on('before_box_select', function($tar){
                //    return !me.draggable || !me.get_record($tar);
                //});

                me.set_draggable(true);

                me._render_drag_files();

            }
        },

        //拖拽的支持
        draggable: false,
        draggable_key: 'photo',
        set_draggable: function (draggable) {
            this.draggable = draggable;
        },

        // ----------------------拖动-----------------
        when_draggable_ready: function () {
            var def = $.Deferred();

            if (jquery_ui) {
                def.resolve();
            } else {
                require.async('jquery_ui', function () {
                    def.resolve();
                });
            }

            return def;
        },

        update_draggable: function ($item) {
            if (!this.draggable)
                return;
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function () {

                var $items = $item ? [$item] : $('.photo-view-box').children('.photo-view-list');
                $.each($items, function () {
                    var $self = $(this);
                    if (!$self.data('has_drag')) {
                        $self.data('has_drag', true);
                        $self.draggable({
                            scope: me.draggable_key,
                            cursorAt: { bottom: -15, right: -15 },
                            distance: 20,
                            appendTo: 'body',
                            scroll: false,
                            helper: function (e) {
                                return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                            },
                            start: $.proxy(me.handle_start_drag, me),
                            stop: $.proxy(me.handle_stop_drag, me)
                        });
                    }
                });
            });
        },

        handle_start_drag: function (e, ui) {
            if (!this.draggable) {
                return false;
            }

            var $target_el = $(e.originalEvent.target),
                $curr_item = $target_el.closest('[data-file-id]'),
                curr_item_id = this.get_$item_id($curr_item);

            // 如果是从文件名、图标开始拖拽，且当前文件未选中，那么需要清除非当前文件的选中
            if (!Select.is_selected(curr_item_id)) {
                Select.unselected_but(curr_item_id);
            }

            var items = Select.get_selected_nodes();

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if (items.length > 1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files: items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag: function () {
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
            var mouseleave = 'mouseleave.file_list_ddd_files',
                can_drag_files = false;

            try {
                if (window.external.DragFiles) {
                    require.async('drag_files', function (mod) { //异步加载drag_files
                        drag_files = mod.get('./drag_files');
                    });
                    can_drag_files = true;
                }
            } catch (e) {
                console.error(e.message);
            }


            this
                // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        },

        /**
         * 销毁时的方法
         */
        destroy: function () {
            this._adjust_inter && clearTimeout(this._adjust_inter);
            this._stop_listen();
            if (this._$body) {//移除时间轴实体层
                this._$body.parent().remove();
                this._$body = null;
            }
            this.remove_$empty();
        },
        add_$empty: function () {
            if (!this._$empty) {
                this.get_$main().append(this._$empty = $(tmpl.time_empty()));
            }
        },
        remove_$empty: function () {
            if (this._$empty) {
                this._$empty.remove();
                this._$empty = null;
            }
        }
    });

    //监听外部方法(Store)
    $.extend(View, {
        /**
         * 显示加载进度条
         */
        on_loader_loading: function () {
            widgets.loading.show();
        },
        /**
         * 数据加载成功
         * @param {boolean} is_empty 没有数据
         * @param {boolean} first_time
         * @param {boolean} refresh
         */
        on_loader_done: function (is_empty, first_time, refresh) {
            widgets.loading.hide();
            if (first_time || is_empty) {
                this.get_$body().empty();
                this.remove_$empty();
            }
            this.get_$body().parent().show();
            if (is_empty) {//没有数据
                this.get_$body().parent().hide();
                this.add_$empty();
                return;
            }
            if (refresh) {
                //mini_tip.ok('列表已更新');
            }
            this.load_html();
        },
        /**
         * 加载出错
         * @param msg
         * @param ret
         */
        on_loader_error: function (msg, ret) {
            widgets.loading.hide();
            mini_tip.error(msg);
        },
        /**
         * 删除成功
         */
        on_delete_ok: function (delete_id_map) {
            var me = this,
                store = this.get_store();
            progress.hide();
            for (var id in delete_id_map) {
                var node = store.get_node_by_id(id);
                var group = store.get_group_by_node(node);
                var $el;
                if(group && group.has_del_same_nodes(node)) { //同时间组下相同的照片已经删除完才进行DOM节点移除
                    $el = me.get_$item_by_id(id);
                    if($el.length) { // 有可能是相同的照片未显示在DOM上的
                        Select.un_select($el, id);
                        $el.remove();
                    }
                }
            }
            mini_tip.ok('删除成功');
        },
        /**
         * 删除失败
         */
        on_delete_fail: function (msg, ret) {
            progress.hide();
            mini_tip.error(msg || '删除失败');
        },
        /**
         * 删除日期组
         * @param day_ids
         */
        on_delete_time_group: function (day_ids) {
            console.debug(day_ids)
            for (var i = 0 , j = day_ids.length; i < j; i++) {
                $('#' + row_id_prefix + day_ids[i]).remove();
            }

            //全部删除，则在显示空白页
            if(!this.get_store().cache.sort_group.length) {
                this.get_$body().parent().hide();
                this.remove_$empty();
                this.add_$empty();
            }
        }
    });

    return View;
});

//tmpl file list:
//photo/src/group/View.tmpl.html
//photo/src/group/cover/View.tmpl.html
//photo/src/group/detail/Panel.tmpl.html
//photo/src/group/detail/View.tmpl.html
//photo/src/group/detail/groupdialog/View.tmpl.html
//photo/src/group/detail/grouplist/View.tmpl.html
//photo/src/main.tmpl.html
//photo/src/photo/View.tmpl.html
//photo/src/time/View.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'group_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="photo-group" class="photo-group" data-label-for-aria="图片文件列表内容区域">\r\n\
        <div class="photo-group-box clear" style="position:relative">\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'group_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var text = require('lib').get('./text');
        var records = data.records;
    __p.push('    ');
 
    $.each(records, function(index, record){
     __p.push('        <div data-list="true"  id="group_items_');
_p(record.id);
__p.push('" class="photo-group-list-wrap ');
_p(record.get('menu_active') ? 'photo-group-menu' : '');
__p.push('" data-record-id="');
_p(record.id);
__p.push('">\r\n\
            <div class="photo-group-list">\r\n\
                <div class="photo-group-img-border photo-group-loading"></div>\r\n\
                <div class="photo-group-img-mask"></div>\r\n\
                <div class="photo-group-list-text"><span data-textlen="100" class="text">');
_p(text.text(record.get('name')));
__p.push('</span><span class="count">(');
_p(record.get('size'));
__p.push(')</span></div>\r\n\
                <div class="photo-group-list-edit"><input type="text" value=""></div>');
 if(!record.get('dummy')){ __p.push('                <a data-tool-link="true" class="photo-group-tool" href="#"><i></i></a>\r\n\
                <ul data-tool-menu="true" class="photo-group-toolmenu">');
 if(!record.get('readonly')){ __p.push('                    <li><a data-action="rename" href="#">重命名</a></li>\r\n\
                    <li><a data-action="delete" href="#">删除</a></li>');
 } __p.push('                    <li><a data-action="set_cover" href="#">更改封面</a></li>\r\n\
                </ul>');
 } __p.push('            </div>\r\n\
        </div>');
 }); __p.push('');

return __p.join("");
},

'group_cover_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <ul class="edit-cover clear">\r\n\
\r\n\
    </ul>');

return __p.join("");
},

'group_cover_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');
        var records = data.records;
        var id_perfix = data.id_perfix || 'photo-item-';
        var empty_group_img = constants.HTTP_PROTOCOL + "//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png"
    __p.push('    ');
 
    $.each(records, function(index, record){
     __p.push('        <li class="list ');
_p(record.get('selected') ? 'checked' : '');
__p.push('" id="');
_p(id_perfix+record.id);
__p.push('" data-record-id="');
_p(record.id);
__p.push('" >\r\n\
            <a class="link" href="#">\r\n\
                <img src="');
_p(empty_group_img);
__p.push('">\r\n\
                <div class="mask"></div>\r\n\
                <i class="check"></i>\r\n\
            </a>\r\n\
        </li>');
 }); __p.push('');

return __p.join("");
},

'cover_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div style="height: 30px;line-height: 30px;color: #adb2b9;font-size: 18px;text-align: center;">\r\n\
        此分组中无图片\r\n\
    <div>');

return __p.join("");
},

'group_detail_panel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="photo-view photo-group-detaile">\r\n\
        <div class="photo-group-back">\r\n\
            <a class="back" href="#"><i class="ico ico-return"></i><span class="return">返回</span></a>\r\n\
            <div class="text"></div>\r\n\
        </div>\r\n\
        <div class="photo-view-box"><div class="photo-view-box-inner"></div></div>\r\n\
        <div class="photo-group-aside"></div>\r\n\
        <a href="#" id="photo-group-aside-toggle" class="photo-group-aside-toggle"><span class="g-arrow"><span class="sub"></span></span></a>\r\n\
    </div>');

return __p.join("");
},

'group_detail_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="clear"></div>');

return __p.join("");
},

'group_photo_drag_helper': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="photo-list-thedrag">\r\n\
    </div>');

return __p.join("");
},

'group_photo_drag_helper_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');
        var default_img_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-empty.png',
            count = data.records.length, i,
            max_thumb = Math.min(count, 3);
    __p.push('    <div class="ico-box">');
 for(i=0; i<max_thumb; i++){ __p.push('            <img class="');
_p('img'+(i+1));
__p.push('" src="');
_p(default_img_url);
__p.push('">');
 } __p.push('    </div>\r\n\
    <div class="count">');
_p(count);
__p.push('</div>');

return __p.join("");
},

'detail_group_dialog_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <ul class="edit-group clear"></ul>');

return __p.join("");
},

'detail_group_dialog_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');
        var default_img_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png';
        var text = require('lib').get('./text');
        var records = data.records;
    __p.push('    ');
 
    $.each(records, function(index, record){
     __p.push('        <li class="list" data-record-id="');
_p(record.id);
__p.push('" title="');
_p(text.text(record.get('name')));
__p.push('">\r\n\
            <a class="link ');
_p( record.get('checked') ? 'checked' : '' );
__p.push('" href="#">\r\n\
                    <img src="');
_p(default_img_url);
__p.push('" />\r\n\
                    <span class="ellipsis">');
_p(text.text(record.get('name')));
__p.push('</span>\r\n\
                    <div class="mask"></div>\r\n\
                    <i class="check"></i>\r\n\
            </a>\r\n\
        </li>');
 }); __p.push('');

return __p.join("");
},

'detail_group_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <ul class="photo-group-aside-inner">\r\n\
    </ul>');

return __p.join("");
},

'detail_group_items': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var constants = require('common').get('./constants');
        var default_img_url = constants.HTTP_PROTOCOL + '//img.weiyun.com/vipstyle/nr/box/img/photo-group-empty-min.png';
        var text = require('lib').get('./text');
        var records = data.records;
    __p.push('    ');
 
    $.each(records, function(index, record){
        var text_name = text.text(record.get('name'));
     __p.push('        <li data-list="true" class="list" data-record-id="');
_p(record.id);
__p.push('">\r\n\
            <div class="list-inner ');
_p( record.get('selected') ? 'list-focus' : '' );
__p.push('">\r\n\
                <div class="img">\r\n\
                    <i class="bg"></i>\r\n\
                    <img src="');
_p(default_img_url);
__p.push('" tabindex="0" aria-label="');
_p(text_name);
__p.push('" hidefocu="on" />\r\n\
                    <i class="mask"></i>\r\n\
                </div>\r\n\
                <div class="infor">\r\n\
                    <p class="title ellipsis">');
_p(text_name || '?');
__p.push('</p>\r\n\
                    <p class="size ellipsis">');
_p(record.get('size') || 0);
__p.push('张</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </li>');
 }); __p.push('');

return __p.join("");
},

'toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="toolbar-btn clear photo-toolbar"><div class="inner"></div></div>');

return __p.join("");
},

'view_switch': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var cur = data.mode; __p.push('    <div class="view-mode-sort">\r\n\
        <span data-vm="time" ');
_p(cur==='time' ? 'class="on"' : '');
__p.push('><a title="拍摄时间" aria-label="按拍摄时间排序" class="vm-l" href="#" tabindex="-1" hidefocus="on"><em>拍摄时间</em></a></span>\r\n\
        <span data-vm="group" ');
_p(cur==='group' ? 'class="on"' : '');
__p.push('><a title="分组" class="vm-m" href="#" tabindex="-1" hidefocus="on"><em>分组</em></a></span>\r\n\
        <span data-vm="all" ');
_p(cur==='all' ? 'class="on"' : '');
__p.push('><a title="全部" aria-label="默认排序" class="vm-r" href="#" tabindex="-1" hidefocus="on"><em>全部</em></a></span>\r\n\
    </div>');

return __p.join("");
},

'empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="ui-view ui-view-empty">\r\n\
        <div class="g-empty ');
_p((data==='folder' ? 'sort-folder-empty' : 'sort-pic-empty'));
__p.push('">\r\n\
            <div class="empty-box" tabindex="0">\r\n\
                <div class="ico"></div>\r\n\
                <p class="title">暂无图片</p>\r\n\
                <p class="content">请点击左上角的“上传”按钮添加</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var $ = require('$'),
    lib = require('lib'),
    text = lib.get('./text');
    __p.push('    <div  data-no-selection class="box dirbox __ ');
_p( text.text(data.config.klass) );
__p.push('">\r\n\
        <div class="box-inner">\r\n\
            <div class="box-head">\r\n\
                <h3 class="box-title __title">');
_p(text.text(data.config.title) );
__p.push('</h3>\r\n\
            </div>\r\n\
            \r\n\
            <div class="box-body __content">\r\n\
                \r\n\
            </div>\r\n\
            \r\n\
            <div class="box-foot clear">');
 if(data.config.show_create_group){ __p.push('                <a class="new-group" href="#">+新建分组</a>');
 } __p.push('                <div class="box-btns">');

                    $.each(data.buttons || [], function(i, btn) {
                    __p.push('                    <a  data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn ');
_p( text.text(btn.klass) );
__p.push('" href="#">\r\n\
                        <span class="btn-inner">');
_p( text.text(btn.text) );
__p.push('</span>\r\n\
                    </a>');

                    });
                    __p.push('                </div>\r\n\
                <div class="edit-cover-msg" style="display:none;"></div>\r\n\
            </div>\r\n\
            \r\n\
        </div>\r\n\
        <!-- .box-inner -->\r\n\
        <a class="box-close" data-btn-id="CANCEL" href="#!/close/"><span class="hidden-text">×</span></a>\r\n\
        \r\n\
    </div>');

return __p.join("");
},

'group_header': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('');

return __p.join("");
},

'photo_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="photo-view" data-label-for-aria="图片文件列表内容区域"></div>');

return __p.join("");
},

'photo_items': function(data){

var __p=[],_p=function(s){__p.push(s)};

        var text = require('lib').get('./text');
        var records = data.records;
        var id_perfix = data.id_perfix || 'photo-item-';
    
    $.each(records, function(index, record){
        var thumb_url = ''; // TODO 缩略图地址
     __p.push('<div data-list="true" id="');
_p(id_perfix+record.id);
__p.push('" data-record-id="');
_p(record.id);
__p.push('" class="photo-view-list ');
_p(record.get('selected') ? 'photo-view-list-selected' : '');
__p.push('">\r\n\
            <a tabindex="0" aria-label="');
_p(record.get_name());
__p.push('" hidefocus="on" href="#" class="photo-view-list-link photo-view-loading" unselectable="on">\r\n\
                <span class="photo-view-list-checkbox"></span>\r\n\
                <span class="photo-view-list-mask"></span>\r\n\
            </a>\r\n\
        </div>');
 }); __p.push('');

return __p.join("");
},

'drag_cursor': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),

        length = data.files.length,
        files = data.files.slice(0, 4);
    __p.push('    <div class="icons">');
 $.each(files, function (i, file) { __p.push('            <i class="icon icon');
_p( i );
__p.push(' filetype icon-');
_p( file.get_type() );
__p.push('"></i>');
 }); __p.push('    </div>\r\n\
    <span class="sum">');
_p( length );
__p.push('</span>\r\n\
');

return __p.join("");
},

'time_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div style="height:100%" data-label-for-aria="图片文件列表内容区域">\r\n\
        <div id="photo-time-view" class="photo-view photo-module-timeline"></div>\r\n\
    </div>');

return __p.join("");
},

'time_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('<div style="height:100%" class="ui-view ui-view-empty">\r\n\
    <div class="g-empty sort-pic-empty" id="photo_time_empty">\r\n\
        <div class="empty-box" tabindex="0">\r\n\
        <div class="ico"></div>\r\n\
        <p data-id="title" class="title">暂无图片</p>\r\n\
        <p data-id="content" class="content">请点击左上角的“上传”按钮添加</p>\r\n\
    </div>\r\n\
    </div>\r\n\
</div>');

}
return __p.join("");
},

'time_row': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var $ = require('$'),
        tmpl = require('./tmpl'),
        html = [];
    $.each(data.get_array(),function(i,item){
        html.push( tmpl.time_cell(item) );
    });
__p.push('<div class="photo-view-box clear" id="day_id_');
_p(data.get_day_id());
__p.push('">\r\n\
    <div class="time">\r\n\
        <p class="d">');
_p(data.get_date());
__p.push('</p>\r\n\
        <p class="m">');
_p((data.get_year()+'.'+data.get_month()));
__p.push('</p>\r\n\
    </div>');
_p(html.join(''));
__p.push('</div>');

return __p.join("");
},

'time_cell': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="photo-view-list" data-file-id="');
_p(data.get_id());
__p.push('" id="');
_p(('time_'+data.get_id()));
__p.push('">\r\n\
    <a tabindex="0" aria-label="');
_p(data.get_name());
__p.push('" hidefocus="on" href="javascript:void(0)" class="photo-view-list-link photo-view-loading">\r\n\
        <span class="photo-view-list-checkbox"></span>\r\n\
        <span class="photo-view-list-mask"></span>\r\n\
    </a>\r\n\
</div>');

return __p.join("");
},

'drag_cursor': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),

        length = data.files.length,
        files = data.files.slice(0, 4);
    __p.push('    <div class="icons">');
 $.each(files, function (i, file) { __p.push('            <i class="icon icon');
_p( i );
__p.push(' filetype icon-');
_p( file.get_type() );
__p.push('"></i>');
 }); __p.push('    </div>\r\n\
    <span class="sum">');
_p( length );
__p.push('</span>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
