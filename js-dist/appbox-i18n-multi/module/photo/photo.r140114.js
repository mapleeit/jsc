//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/photo/photo.r140114",["lib","$","common","i18n","main"],function(require,exports,module){

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
//photo/src/Requestor.js
//photo/src/Switch_view.js
//photo/src/View_mode.js
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
//photo/src/time/imgReady.js
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
//photo/src/Requestor.js
//photo/src/Switch_view.js
//photo/src/View_mode.js
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
//photo/src/time/imgReady.js
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
                $ct : this.$ct
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
        
        Group_record = lib.get('./data.Record'),
        Photo_record = require('./photo.Record'),
        
        $ = require('$');
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
            
            var req = request[use_post ? 'post' : 'get']({
                url : url,
                cmd : cmd,
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
            return this._request(
                this.group_cgi,
                'create_group',
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
            return this._request(
                this.group_cgi,
                'delete_group',
                {},
                {
                    group_id : record.get('id'),
                    group_name : record.get('name')
                }
            );
        },
        rename_group : function(group_id, old_name, new_name){
            return this._request(
                this.group_cgi,
                'modify_group',
                {},
                {
                    group_id : group_id,
                    src_group_name : old_name,
                    dst_group_name : new_name
                }
            );
        },
        // 前端暂不用到
        set_group_album : function(group_id, cover_record){
            return this._request(
                this.group_cgi,
                'set_cover',
                {},
                {
                    group_id : group_id,
                    covers : [
                        {
                            file_id : cover_record.get_id()
                        }
                    ]
                }
            );
        },
        // 设置分组顺序
        set_group_orders : function(groups){
            var orders = [];
            $.each(groups, function(index, group){
                orders.push(group.get('id'));
            });
            return this._post(
                this.group_cgi,
                'set_order',
                {},
                {
                    order : orders
                }
            );
        },
        // 加载分组
        load_groups : function(){
            return this._request(
                this.group_cgi,
                'get_group',
                {},
                {},
                function(msg, body, header, data){
                    var groups = [];
                    $.each(body.pic_group, function(index, group){
                        groups.push(new Group_record({
                            id : group.group_id,
                            name : group.group_name,
                            create_time : group.group_ctime,
                            modify_time : group.group_mtime,
                            size : group.total,
                            cover : group.cover,
                            readonly : group.group_id === 1
                        }, group.group_id));
                    });
                    return [groups];
                }
            );
        },
        // 分步移动照片，不限定移动数量
        move_photo_threshold : 100,
        step_move_photos : function(records, old_group_id, group_id){
            var def = $.Deferred();
            
            var waiting_records = records.slice(0),
                me = this,
                success_records = [],
                failure_records = [],
                last_failure_msg;
            
            var next = function(){
                var todos;
                // 如果处理完了，返回结果
                if(!waiting_records.length){
                    if(success_records.length){
                        def.resolve(success_records, failure_records);
                    }else{
                        def.reject(last_failure_msg, failure_records);
                    }
                    return;
                }
                // 取出这次要处理的记录
                todos = waiting_records.slice(0, me.move_photo_threshold);
                waiting_records = waiting_records.slice(todos.length);
                
                me.move_photos(todos, old_group_id, group_id).done(function(){
                    success_records = success_records.concat(todos);
                }).fail(function(msg){
                    last_failure_msg = msg;
                    failure_records = success_records.concat(todos);
                }).always(function(){
                    def.notify(success_records, failure_records);
                    next();
                });
            };
            
            next();
            
            return def;
        },
        // 移动照片分组
        move_photos : function(records, old_group_id, group_id){
            var items = [];
            $.each(records, function(index, record){
                items.push({
                    pdir_key : record.get_pid(),
                    file_id : record.get_id(),
                    file_name : record.get_name()
                });
            });
            return this._post(
                this.group_cgi,
                'move_pic',
                {},
                {
                    src_group_id : old_group_id,
                    dst_group_id : group_id,
                    items : items
                }
            );
        },
        // 批量删除照片
        delete_photos : function(records){
            var items = [];
            $.each(records, function(index, record){
                items.push({
                    ppdir_key : record.get_ppid(),
                    pdir_key : record.get_pid(),
                    file_id : record.get_id(),
                    file_name : record.get_name(),
                    file_ver: record.get_file_ver()
                });
            });
            return this._post(
                this.default_cgi,
                'batch_file_delete',
                {},
                {
                    del_files : items
                }
            );
        },
        // 加载照片，如果不传group_id则加载全部
        load_photos : function(group_id, offset, size){
            return this._request(
                this.lib_cgi,
                'get_lib_list',
                {},
                {
                    lib_id : 2,
                    offset : offset,
                    count : size,
                    sort_type : 0,
                    group_id : group_id,
                    ext_names : []
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
                    if(body.list_item){
                        $.each(body.list_item, function(index, photo){
                            photos.push(new Photo_record({
                                id : photo.file_id,
                                create_time : photo.file_ctime,
                                file_md5 : photo.file_md5,
                                modify_time : photo.file_mtime,
                                name : photo.file_name,
                                file_sha : photo.file_sha,
                                size : photo.file_size,
                                cur_size : photo.file_size, // 默认没有破损 TODO 需后台确认
                                take_time : photo.file_ttime,
                                pid : photo.pdir_key,
                                ppid : photo.ppdir_key,
                                file_ver : photo.file_version
                            }));
                        });
                    }
                    // TODO 要返回总数，目前返回的是end标记
                    return [photos, body.end];
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
 * 分组视图中的 分组列表
 * @author cluezhang
 * @date 2013-11-27
 */
define.pack("./group.Group_panel",["lib","common","./View_mode","./group.Mgr","./group.View","$","i18n"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        
        View_mode = require('./View_mode'),
        Group_mgr = require('./group.Mgr'),
        Group_view = require('./group.View'),
        
        $ = require('$'),

        _ = require('i18n').get('./pack'),
        l_key = 'photo';

    var Module = inherit(View_mode, {
        create_view : function(){
            var me = this;
            var view = new Group_view({
                store : this.store,
                thumb_loader : this.thumb_loader,
                $ct: this.$ct
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
                mini_tip.ok(_(l_key,'列表已更新'));
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
define.pack("./group.Mgr",["lib","common","./Requestor","./group.detail.Store","./group.cover.View","./tmpl","i18n","$"],function(require, exports, module){
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

        _ =  require('i18n').get('./pack'),
        l_key = 'photo',

        $ = require('$');
    var requestor = new Requestor();
    var byte_len = function(str){
        return encodeURIComponent(str).replace(/%\w\w/g, 'a').length;
    };
    var group_name_validator = {
        verify : function(name){
            if(!name){
                return _(l_key,'不能为空');
            }
            if(byte_len(name)>512){
                return _(l_key,'过长');
            }
            if(/[\\:*?\/"<>|]/.test(name)){
                return _(l_key,'不能含有特殊字符');
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
                _(l_key,'删除分组'),
                _(l_key,'确定要删除这个分组吗？'),
                record.get('name'),
                function () {
                    requestor.delete_group(record).done(function(){
                        me.store.remove(record);
                        me.store.total_length --;
                        ds_event.trigger('remove', [record], {src:me.store});
                        mini_tip.ok(_(l_key,'删除成功'));
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
                    mini_tip.error(_(l_key,'组名')+ret);
                    editor.focus();
                }else{
                    requestor.rename_group(record.get('id'), old_value, value).done(function(){
                        mini_tip.ok(_(l_key,'修改成功'));
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
                    mini_tip.error(_(l_key,'组名')+ret);
                    editor.focus();
                }else{
                    requestor.create_group(value).done(function(record){
                        mini_tip.ok(_(l_key,'创建成功'));
                        def.resolve(record);
                    }).fail(function(msg){
                        me.common_request_fail(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel', def.reject, def);
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
                klass : 'box dirbox',
                title: _(l_key,'更改封面'),
                destroy_on_hide: true,
                content: $fragment_ct,
                tmpl : tmpl.dialog,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : _(l_key,'选定'),
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : _(l_key,'取消'),
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
                            mini_tip.ok(_(l_key,'设置成功'));
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
            dialog.show();
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
                mini_tip.ok(_(l_key,'排序成功'));
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
define.pack("./group.View",["lib","common","$","./tmpl","i18n","./group.drag_sort"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        
        $ = require('$');
    var View = lib.get('./data.View'),
        tmpl = require('./tmpl'),
        Editor = common.get('./ui.Editor');

    var _ = require('i18n').get('./pack'),
        l_key = 'photo';

    var Module = inherit(View, {
        dom_record_map_attr : 'data-record-id',
        enable_hovering : true,
        enable_context_menu : true,
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
            if(!$(event.target).closest(this.item_tool_selector+','+this.item_tool_menu_selector).length){
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
            $input.on('click', this._prevent_record_click);
            
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
                $input.off('click', this._prevent_record_click);
                me.off('destroy', editor.destroy, editor);
            });
            
            // 定位
            $dom[0].scrollIntoView();
            
            return editor;
        },
        _prevent_record_click : function(e){
            e.stopPropagation();
        },
        // --------------- 缩略图部分 -----------------
        default_empty_thumb_url : 'http://imgcache.qq.com/vipstyle/nr/box/img/photo-group-empty.png',
        default_fail_thumb_url : 'http://imgcache.qq.com/vipstyle/nr/box/img/file_img_70.png',
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
                if(!thumb_state){ // 没有进行处理
                    $item.data(thumb_state_attr, true);
                    record = me.get_record($item);
                    covers = record.get('cover');
                    if(!covers || !covers.length){
//                        $img_holder.css({height: me.thumb_height+'px', width: me.thumb_width+'px'}).attr('src', me.default_empty_thumb_url);
                        return;
                    }
                    cover = covers[0];
                    me.thumb_loader.get(cover.pdir_key, cover.file_id, '').done(function(url, img){
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
                    width : 150,
                    items: [
                        {
                            id: 'rename',
//                            icon_class: 'ico-rename',
                            group: 'edit',
                            text: _(l_key,'重命名'),
                            click: handler
                        },
                        {
                            id: 'delete',
//                            icon_class: 'ico-del',
                            group: 'edit',
                            text: _(l_key,'删除'),
                            click: handler
                        },
                        {
                            id: 'set_cover',
//                            icon_class: 'ico-todo',
                            group: 'edit',
                            text: _(l_key,'更改封面'),
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
            if(!me.drag_sort){
                me.drag_sort = require('./group.drag_sort');
            }
            if(me.rendered){
                me.drag_sort.render({
                    get_$items: function(){
                        return me.$el.find('.photo-group-list-wrap');
                    },
                    drag_class: 'photo-group-themove',
                    helper_class: 'photo-group-thedrag cursor-no-drop',
                    parent: me.$ct,
                    left_class: 'photo-group-left',//元素靠左的样式
                    right_class: 'photo-group-right',//元素靠右的样式
                    width: 152,//组元素宽度
                    height: 187,//组元素高度
                    callback: function(event, $source, $target ,is_before){
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
define.pack("./group.detail.Mgr",["lib","common","./photo.Mgr","./group.Mgr","./group.detail.groupdialog.View","./photo.Thumb_loader","./Requestor","./tmpl","$","i18n"],function(require, exports, module){
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
        
        $ = require('$'),

        _ = require('i18n').get('./pack'),
        l_key = 'photo';
    var /*group_thumb_loader = new Thumb_loader({
        width : 64,
        height : 64
    }), */requestor = new Requestor();
    var requestor = new Requestor();
    var Inner_mgr = inherit(Mgr, {
        on_set_group : function(records, event){
            if(!records.length){
                mini_tip.warn(_(l_key,'请选择图片'));
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
                mini_tip.ok(_(l_key,'设置成功'));
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
                klass : 'box dirbox',
                title: _(l_key,'更改分组'),
                destroy_on_hide: true,
                content: $fragment_ct,
                tmpl : tmpl.dialog,
                show_create_group : true,
                mask_bg: 'ui-mask-white',
                buttons: [
                    {
                        id : 'OK',
                        text : _(l_key,'选定'),
                        klass : 'g-btn-blue',
                        disabled : false,
                        visible : true,
                        submit : true
                    }, {
                        id : 'CANCEL',
                        text : _(l_key,'取消'),
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
                        var record = group_selection_view.get_selected();
                        if(!record){
                            warn(_(l_key,'请选择分组'));
                            return;
                        }
                        if(old_group_record.get('id') === record.get('id')){
                            warn(_(l_key,'请选择不同的分组'));
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
                progress.show("0/"+photos.length);
            }else{
                widgets.loading.show();
            }
            return requestor.step_move_photos(photos, old_group_id, new_group_id).progress(function(success_photos, failure_photos){
                if(show_progress){
                    progress.show(success_photos.length+"/"+photos.length);
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
                    mini_tip.warn(_(l_key,'部分图片更改分组失败'));
                }else{
                    mini_tip.ok(_(l_key,'更改分组成功'));
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
define.pack("./group.detail.Panel",["lib","common","./View_mode","./group.detail.View","./group.detail.Mgr","./group.detail.Store","./photo.Record","$","i18n"],function(require, exports, module){
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
        
        $ = require('$'),

        _ = require('i18n').get('./pack'),
        l_key = 'photo';
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
            view.on('opengroup', this.on_group_click, this);
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
            this.get_singleton('store').get_group();
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
                mini_tip.ok(_(l_key,'列表已更新'));
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
define.pack("./group.detail.Photo_view",["lib","common","$","./photo.View","./tmpl","i18n"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        user_log = common.get('./user_log'),
        
        $ = require('$');
    var View = require('./photo.View'),
        tmpl = require('./tmpl'),
        jquery_ui;

    var _ = require('i18n').get('./pack'),
        l_key = 'photo';

    var Module = inherit(View, {
        /**
         * @cfg {Boolean} draggable
         */
        draggable : false,
        draggable_key : 'test',
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
                tasks[index] = me.thumb_loader.get(record.get_pid(), record.get_id(), record.get_name()).done(function(url, img){
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
//                    icon_class: 'ico-download',
                    group: 'edit',
                    id: 'download',
                    text: _(l_key,'下载')
                },
                {
//                    icon_class: 'ico-del',
                    group: 'edit',
                    id: 'delete',
                    text: _(l_key,'删除')
                },
                {
//                    icon_class: 'ico-move',
                    group: 'edit',
                    id: 'set_group',
                    text: _(l_key,'更改分组')
                },
                {
//                    icon_class: 'ico-share',
                    group: 'edit',
                    id: 'share',
                    text: _(l_key,'分享')
                },
                {
                    id: 'set_as_cover',
//                    icon_class: 'ico-todo',
                    group: 'edit',
                    text: _(l_key,'设置为封面')
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
define.pack("./group.detail.groupdialog.View",["lib","common","./group.View","./tmpl","i18n","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        common = require('common'),
        user_log = common.get('./user_log'),
        View = require('./group.View'),
        tmpl = require('./tmpl'),
        _ = require('i18n').get('./pack'),
        l_key = 'photo',
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
                $(this).find('i').toggleClass(view.item_checked_class, value);
            },
            editing : function(value, view, record){
                var $text_ct = $(this).find('span'),
                    name = record.get('name');
                if(value){
                    $text_ct.empty().append($('<input style="text" value="'+_(l_key,'爱情')+'">').val(name));
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
            this.set_selected(record);
            event.preventDefault();
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
        default_empty_thumb_url : 'http://imgcache.qq.com/vipstyle/nr/box/img/photo-group-empty-min.png',
        default_fail_thumb_url : 'http://imgcache.qq.com/vipstyle/nr/box/img/file_img_70.png',
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
        item_hover_class : 'list-dropping',
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
            });
            // 主动更新拖拽坐标缓存，以使当前正在拖拽时不会出现无法响应drop的情况
            // 这里算是hack吧，不知道有没有更好的方法。
            last_droppable = last_droppable.data('droppable');
            $.ui.ddmanager.prepareOffsets(last_droppable);
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
        default_empty_thumb_url : 'http://imgcache.qq.com/vipstyle/nr/box/img/photo-group-empty-min.png',
        default_fail_thumb_url : 'http://imgcache.qq.com/vipstyle/nr/box/img/file_img_70.png',
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
define.pack("./group.drag_sort",["$","lib"],function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),
        MAX_DIS = Math.pow(2, 30),//足够遥远以至于不能到达
        uuid = 0;

    var Point = function (top, left, id) {
        this.top = top;
        this.left = left;
        this.id = id;
    };

    $.extend(Point.prototype, {
        /**
         * 获取靠左的元素
         * @param {String} except_id
         */
        get_left_point: function (except_id) {
            var array = sortable.map.y[this.top],//y轴上所有的坐标
                len = array.length;
            while (len) {
                len -= 1;
                if (array[len].left === this.left && array[len - 1] && except_id !== array[len - 1].id) {
                    return array[len - 1];
                }
            }
            return null;
        },
        /**
         * 获取靠右的元素
         * @param {String} except_id
         */
        get_right_point: function (except_id) {
            var array = sortable.map.y[this.top],//y轴上所有的坐标
                len = array.length;
            while (len) {
                len -= 1;
                if ( array[len].left === this.left && array[len + 1] && except_id !== array[len + 1].id ) {
                    return array[len + 1];
                }
            }
            return null;
        },
        /**
         * 添加靠右样式
         * @param except_id 排除坐标的id
         * @param them_class 靠边元素的样式
         * @param self_class 自身元素的样式
         */
        add_right_class: function (except_id, them_class, self_class) {
            var point = this.get_right_point(except_id);
            if (point) {
                $('#' + point.id).addClass(them_class);
            }
            if(except_id !== this.id) {
                $('#' + this.id).addClass(self_class);
            }
        },
        /**
         * 添加靠左样式
         * @param except_id 排除坐标的id
         * @param them_class 靠边元素的样式
         * @param self_class 自身元素的样式
         */
        add_left_class: function (except_id, them_class, self_class) {
            var point = this.get_left_point(except_id);
            if (point) {
                $('#' + point.id).addClass(them_class);
            }
            if(except_id !== this.id) {
                $('#' + this.id).addClass(self_class);
            }
        },
        /**
         * 移除样式
         * @param except_id
         * @param classs
         */
        remove_class: function (except_id, classs) {
            var r_point = this.get_right_point(except_id);
            r_point && $('#' + r_point.id).removeClass(classs);
            var l_point = this.get_left_point(except_id);
            l_point && $('#' + l_point.id).removeClass(classs);
            $('#' + this.id).removeClass(classs);
        }
    });

    var sortable = {
        /**
         * 初始化坐标系
         * @param width
         * @param height
         * @param diff
         */
        refresh: function (width, height , diff) {
            this.diff = diff;
            this.width = width;//定位元素宽度
            this.height = height;//定位元素高度
            this.map = {x: {}, y: {}};//坐标系
            this.x_step = [];//X轴含有的坐标点
            this.y_step = [];//X轴含有的坐标点
            this._sorted = false;//标识还没有排序
            this.reset_match();
        },
        /**
         * 重置匹配结果
         */
        reset_match: function(){
            this._match_left = false;//匹配到的方位 靠左，靠右
            this._match_point = null;//匹配的坐标点
        },
        /**
         * 添加一个坐标点
         * @param id
         * @param offset
         */
        add_point: function (id, offset) {

            offset.top += sortable.diff;
            offset.left += sortable.diff;

            var me = this, top = offset.top, left = offset.left,
                point = new Point(top, left, id);

            (me.map.y[top] ? me.map.y[top] : (me.map.y[top] = []) ).push(point);
            (me.map.x[left] ? me.map.x[left] : (me.map.x[left] = []) ).push(point);

            me._sorted = false;
        },
        /**
         * 排序 指定坐标
         * @param {HashMap<String,Array>} axes
         * @param {Array} step
         */
        sort_axis: function (axes, step) {
            for (var key in axes) {
                step.push(key - 0);//放入数组
                axes[key - 0].sort(function (y1, y2) {//子集升序排列
                    return y1 > y2;
                });
            }
            step.sort(function (y1, y2) {//升序排列
                return y1 > y2;
            });
        },
        /**
         * 排序 坐标轴
         */
        sort: function () {
            var me = this;
            if (!me._sorted) {
                me._sorted = true;
                me.sort_axis(me.map.y, me.y_step);
                me.sort_axis(me.map.x, me.x_step);
                //console.debug(me.y_step,me.x_step);
            }
        },
        get_end_point: function () {
            var me = this, y_max = me.get_y_max();
            return me.map.y[y_max][me.map.y[ y_max ].length - 1];
        },
        /**
         * 最近的坐标X轴或Y轴
         * @param array
         * @param num
         * @returns {Number}
         */
        get_near_key: function (array, num) {
            var diff = MAX_DIS,
                key,
                len = array.length;
            while (len) {
                len -= 1;
                if (Math.abs(array[len] - num) < diff) {
                    diff = Math.abs(array[len] - num);
                    key = array[len];
                }
            }
            return key;
        },
        /**
         * 最近的坐标点
         * @param points
         * @param key_name
         * @param search_value
         * @returns {*}
         */
        get_near_point: function (points, key_name, search_value) {
            if (!points || !points.length) {
                return null;
            }
            var diff = MAX_DIS,
                point,
                len = points.length;
            while (len) {
                len -= 1;
                var unit = points[len];
                if (unit[key_name] === search_value) {//已找到
                    return unit;
                }
                if (Math.abs(unit[key_name] - search_value) < diff) {
                    point = points[len];
                    diff = Math.abs(unit[key_name] - search_value);
                }
            }
            return point;
        },
        /**
         * 获取Y轴最大值
         * @returns {int}
         */
        get_y_max: function () {
            return this.y_step[ this.y_step.length - 1];
        },
        /**
         * 是否匹配选中的节点
         * @param offset
         * @returns {boolean}
         */
        is_match: function (offset) {
            var me = this, is_left = false , point = null;
            me.sort();
            var near_y = me.get_near_key(me.y_step, offset.top),
                near_x = me.get_near_key(me.x_step, offset.left),
                y_max = me.get_y_max(),
                near_y_point = me.get_near_point(me.map.y[near_y], 'left', near_x);

            if (offset.top > y_max) {//超过最大Y轴边界
                if (offset.top > y_max + me.height) {//完全超出
                    point = me.get_end_point();
                } else {//只超出一个身位
                    if (Math.abs(near_y_point.left - offset.left) > me.width) {//最近的Y轴元素的X轴超过一个身位
                        point = me.get_end_point();
                    }
                }
            }
            if (!point) {
                point = near_y_point;
            }

            is_left = near_y_point.left >= offset.left;

            if (me._match_point === point && me._match_left === is_left) {
                return false;
            }
            me._match_left = is_left;
            me._match_point = point;
            return true;

        },
        /**
         * 是否已经重置了排序
         * @param source_id 要改变的目的ID
         * @param point 匹配的坐标
         * @param is_left 匹配坐标的方位
         */
        is_reset_sort: function(source_id,point,is_left){
            if( point && point.id !== source_id ){
                if(is_left){
                    var lp = point.get_left_point(source_id);
                    if(!lp || (lp && lp.id !== source_id)){
                        return true;
                    }
                } else {
                    var rp = point.get_right_point(source_id);
                    if(!rp || (rp && rp.id !== source_id)){
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 获取批量的方位 靠左或靠右
         * @returns {boolean}
         */
        get_match_left: function () {
            return this._match_left;
        },
        get_match_point: function () {
            return this._match_point;
        }
    };

    return {
        render: function (opt) {
            var me = this;
            me.opt = $.extend({
                drag_class: null,
                parent: null,
                width: 0,
                height: 0,
                left_class: '',
                right_class: '',
                helper_class: '',
                get_$items: $.noop,
                get_html_id: function (dom) {//获取html id
                    if (!dom.id) {
                        dom.id = 'drag_sort_move_' + (uuid += 1);
                    }
                    return dom.id;
                },
                get_helper: function ($item) {//获取辅助参数
                    var clone = $item.clone().removeAttr('id');
                    clone[0].className = 'ui-draggable ' + me.opt.helper_class;
                    clone.find('img, .photo-group-loading').css('cursor', 'move');
                    return clone;
                },
                callback: $.noop
            }, opt);
            me.opt.slide_class = me.opt.left_class + ' ' + me.opt.right_class;
            require.async('jquery_ui', function () {
                if (me.timeoutid) {
                    clearTimeout(me.timeoutid);
                    me.timeoutid = null;
                }
                me.timeoutid = setTimeout(function () {
                    me._render_drag()
                }, 500);
            });
        },
        _render_drag: function () {
            var me = this;

            sortable.refresh(me.opt.width, me.opt.height , 20);

            $.each(me.opt.get_$items(), function (i, item) {
                var $item = $(item);
                sortable.add_point(me.opt.get_html_id($item[0]), $item.position());
                if ($item.data('render_drag')) {
                    return;
                }
                $item.data('render_drag', true)
                    .draggable({
                        scroll: false,
                        helper: function () {
                            return me.opt.get_helper($(this));
                        },
                        appendTo: me.opt.parent,
                        containment: 'parent',
                        start: function (e, ui) {//开始拖动
                            $(this).addClass(me.opt.drag_class);
                        },
                        drag: function (e, ui) {//拖动中
                            var position = ui.position;
                            if (!me._is_over_line(position)) {
                                var point_old = sortable.get_match_point();
                                if (sortable.is_match(position)) {
                                    //除旧
                                    if (point_old) {
                                        point_old.remove_class(this.id, me.opt.slide_class);
                                    }
                                    //迎新
                                    var point_new = sortable.get_match_point();
                                    if (sortable.get_match_left()) {//在匹配元素左边
                                        point_new.add_left_class(this.id, me.opt.right_class, me.opt.left_class);
                                    } else {//在匹配元素右边
                                        point_new.add_right_class(this.id, me.opt.left_class, me.opt.right_class);
                                    }
                                }
                            }
                        },
                        stop: function (e, ui) {//拖动结束
                            var $source = $(this).removeClass(me.opt.drag_class),
                                is_left = sortable.get_match_left(),
                                point = sortable.get_match_point();
                            if( point ){
                                point.remove_class(this.id,me.opt.slide_class);
                            }
                            if( sortable.is_reset_sort(this.id,point,is_left) ){
                                me.opt.callback(e, $source, $('#' + point.id), is_left);
                            }
                            sortable.reset_match();
                        }
                    });
            });
        },
        _is_over_line: function (offset) {
            if (offset.top > ( sortable.get_y_max() + sortable.height + 30 )) {
                return true;
            }
        }
    };
});/**
 * 搜索Module
 * @author cluezhang
 * @date 2013-9-12
 */
define.pack("./photo",["lib","$","main","common","i18n","./Requestor","./Switch_view","./Panel"],function(require, exports, module){
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

        _ = require('i18n').get('./pack'),
        l_key = 'photo',
        
        query_user = common.get('./query_user'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        Module = common.get('./Simple_module');
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
                        label: _(l_key,'新建分组'),
                        cls: 'btn-mkdir',
                        icon: 'ico-mkdir',
                        handler: create_handler('create_group')
                    }),
                    new Button({
                        id: 'set_group',
                        label: _(l_key,'更改分组'),
                        cls: 'btn-movegroup',
                        icon: 'ico-movegroup',
                        handler: create_handler('set_group')
                    }),
                    new Button({
                        id: 'batch_delete',
                        label: _(l_key,'删除'),
                        cls: 'btn-del',
                        icon: 'ico-del',
                        handler: create_handler('batch_delete')
                    }),
                    new Button({
                        id: 'refresh',
                        //label: _(l_key,'刷新'),
                        btn_cls: 'btn-notext',
                        cls: 'btn-ref',
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
        create_switch_view : function(){
            var me = this,
                main_view = me.main_view;
            var toolbar = this.get_singleton('toolbar');
            var default_mode = store.get(get_mode_store_key()) || 'time';
            var switch_view = new Switch_view({
                mode : default_mode,
                $ct : toolbar.get_$el()
            });
            switch_view.render();
            switch_view.on('switch', function(mode){
                // 持久化用户选择
                store.set(get_mode_store_key(), mode);
                main_view.switch_mode(mode);
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
            Module.prototype.on_activate.apply(this, arguments);
            this.asure_inited();
            scroller.on('scroll', this.if_reachbottom, this);
            scroller.on('resize', this.on_resize, this);
            
            this.main_view.activate();
            
            global_event.on('album_refresh', this.refresh, this);
        },
        on_deactivate : function(){
            global_event.off('album_refresh', this.refresh, this);
            
            this.main_view.deactivate();
            
            scroller.off('scroll', this.if_reachbottom, this);
            scroller.off('resize', this.on_resize, this);
            Module.prototype.on_deactivate.apply(this, arguments);
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
define.pack("./photo.Mgr",["lib","common","./Requestor","i18n","$"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        console = lib.get('./console'),
        
        common = require('common'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        
        ds_event = common.get('./global.global_event').namespace('datasource.photo'),
        
        Requestor = require('./Requestor'),

        _ = require('i18n').get('./pack'),
        l_key = 'photo',

        $ = require('$');
    var requestor = new Requestor();
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
            var me = this;
            var node = records[0];
            me.appbox_preview(node).fail(function () {
                me.preview_image(node);
            });
            return;
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
        when_remover_ready : function(){
            var def = $.Deferred(),
                me = this,
                remover = me.remover;
            
            if(remover){
                def.resolve(remover);
            }else{
                require.async('disk', function(disk){
                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
                    remover.render();
                    def.resolve(remover);
                });
            }
            
            return def;
        },
        get_delete_params : function(first_file_name, count){
            return {
                title: _(l_key,'删除图片'),
                up_msg : count>1 ? _(l_key,'确定要删除这些图片吗？') : _(l_key,'确定要删除这张图片吗？')
            }; 
        },
        do_delete : function(nodes, callback, scope){
            var me = this;
            nodes = [].concat(nodes);
//            if(nodes.length > 100){
//                mini_tip.warn('每次最多只能删除100张图片');
//                return;
//            }
//            widgets.confirm(
//                '删除图片',
//                nodes.length>1 ? '确定要删除这些图片吗？' : '确定要删除这张图片吗？',
//                '',
//                function () {
//                    requestor.delete_photos(nodes).done(function(){
//                        me.store.batch_remove(nodes);
//                        me.store.total_length -= nodes.length;
//                        me.store.trigger('metachange');
//                        mini_tip.ok('删除成功');
//                        if(callback){
//                            callback.call(scope, true);
//                        }
//                    }).fail(function(msg){
//                        if(msg !== requestor.canceled){
//                            mini_tip.error(msg);
//                        }
//                    });
//                },
//                $.noop,
//                null,
//                true
//            );
            
            this.when_remover_ready().done(function(remover){
                var remove_worker = me.remover.remove_confirm(nodes, null, false, undefined, undefined, me.get_delete_params);
                remove_worker.on('has_ok', function (removed_file_ids) {
                    me.store.batch_remove(nodes);
                    me.store.total_length -= nodes.length;
//                    me.store.trigger('metachange');
                    ds_event.trigger('remove', nodes, {src:me.store});
                    if(callback){
                        callback.call(scope, true);
                    }
                });
            });
        },
        on_batch_delete : function(records, e){
            if(!records.length){
                mini_tip.warn(_(l_key,'请选择图片'));
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
                    downloader = downloader_mod.get('./downloader');
                // 当前目录下的图片
                var images = [];
                var read_images = function(){
                    me.store.each(function(record){
//                        if(record.is_image()){
                            images.push(record);
//                        }
                    });
                };
                read_images();

                // 当前图片所在的索引位置
                var index = $.inArray(file, images);
                
                var options = {
                    support_nav: true,
                    endless : !me.store.is_complete(),
                    total: images.length,
                    index: index,
                    async_url_callback: function (index, is_nav, callback) {
                        var url;
                        // 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
                        var asure_loaded = function(index, callback, scope){
                            if(index < images.length){ // 已经加载过，直接回调
                                callback.call(scope, true);
                            }else if(!me.store.is_complete()){ // 未加载，尝试加载之
                                me.store.load_more().done(function(){
                                    images.splice(0, images.length);
                                    read_images();
                                    asure_loaded(index, callback, scope);
                                });
                            }else{ // 加载完了也没发现，表示无下一页，中止并更新
//                                mini_tip.warn('没有下一张了');
                                callback.call(scope, false);
                            }
                        };
                        
                        asure_loaded(index, function(success){
                            // 如果加载失败，表明没有下一页了，直接显示原图，状态更新后下一页就会消失掉
                            index = success ? index : index - 1;
                            // 更新状态
                            options.endless = !me.store.is_complete();
                            options.total = images.length;
                            // 回调，显示图片
                            callback(index, downloader.get_down_url(images[index], { abs: '1024*1024' }));
                        });
                        return true;
                    },
                    download: function (index, e) {
                        var file = images[index];
                        downloader.down(file, e);
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
                };
                image_preview.start(options);
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
            store.reload();
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
                return;
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
        constructor : function(host, pid, id, name){
            this.host = host;
            this.pid = pid;
            this.id = id;
            this.name = name;
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
        },
        get : function(pid, id, name){
            var def = $.Deferred();
            
            var task = this.get_task(pid, id, name);
            task.ready(def);
            
            this.buffer_load();
            
            return def;
        },
        get_task : function(pid, id, name){
            var map = this.maps.all;
            if(map.hasOwnProperty(pid) && map[pid].hasOwnProperty(id)){
                return map[pid][id];
            }
            var task = new Task(this, pid, id, name);
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
            var dtask = map[task.pid] || (map[task.pid] = {});
            dtask[task.id] = task;
        },
        remove_task_from_map : function(task, map){
            var dtask = map[task.pid];
            delete dtask[task.id];
            // 如果目录下没有任务了，清除
            var id, empty = true;
            for(id in dtask){
                if(dtask.hasOwnProperty(id)){
                    empty = false;
                    break;
                }
            }
            if(empty){
                delete map[task.pid];
            }
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
                if(!tasks){ // 没有任务了
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
            var pid, dtask, id, ids = [], tasks = [];
            for(pid in map){
                if(map.hasOwnProperty(pid)){
                    // 找到第一个目录，因为用put、remove方法，所以只要有属性就必定不为空
                    dtask = map[pid];
                    for(id in dtask){
                        if(dtask.hasOwnProperty(id)){
                            ids.push(id);
                            tasks.push(dtask[id]);
                            // img_view_bat一次只拉10个
                            if(tasks.length>=10){
                                break;
                            }
                        }
                    }
                    return tasks;
                }
            }
        },
        get_next_task : function(map){
            var pid, dtask, id, task;
            for(pid in map){
                if(map.hasOwnProperty(pid)){
                    // 找到第一个目录，因为用put、remove方法，所以只要有属性就必定不为空
                    dtask = map[pid];
                    for(id in dtask){
                        if(dtask.hasOwnProperty(id)){
                            return dtask[id];
                        }
                    }
                    // 如果运行到这里了，表明有问题。。。
                    break;
                }
            }
        },
        // private
        // 批量请求ftn下载地址，必须是同目录下的
        batch_request_ftn : function(tasks){
            var me = this;
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
            $.each(tasks, function(index, task){
                map[task.id] = task;
                task.start_requesting();
            });
            var req = request.get({
                cmd : 'img_view_bat',
                body : {
                    file_owner: user.get_uin(),
                    pdir_key: tasks[0].pid,
                    files: $.map(tasks, function (task, i) {
                        return {
                            file_id: task.id,
                            file_name: encodeURIComponent(task.name)
                        };
                    })
                },
                cavil : true
            });
            
            req.ok(function(msg, body, header, data){
                $.each(body['imgs'], function(index, img_rsp) {
                    var id = img_rsp['file_id'];
                    var task = map[id];
                    if(!task){
                        return;
                    }
                    delete map[id]; // 加载好了的就删掉
                    var ret = parseInt(img_rsp['ret'], 10), url;
                    if (ret === 0) {
                        var host = img_rsp['dl_svr_host'],
                            port = img_rsp['dl_svr_port'],
                            path = img_rsp['dl_encrypt_url'];
                        url = 'http://' + host + ':' + port + '/ftn_handler/' + path + '?size=' + me.width + '*' + me.height; // 64*64  /  128*128
                        task.finish_requesting(url);
                    }else{
                        task.fail_requesting();
                    }
                });
                // 如果cgi没有返回？
                var id;
                for(id in map){
                    if(map.hasOwnProperty(id)){
                        map[id].fail_requesting();
                    }
                }
            }).fail(function(){
                $.each(tasks, function(index, task){
                    task.fail_requesting();
                });
            }).done(function(){
                // 请求结束后继续加载
                me.cgi_requesting--;
                me.buffer_load();
            });
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
        }
    });
    return Module;
});/**
 * 
 * @author cluezhang
 * @date 2013-11-5
 */
define.pack("./photo.View",["lib","common","main","$","./photo.Thumb_loader","./tmpl","i18n"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('photo.all.view'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),
        Multi_selection_plugin = common.get('./dataview.Multi_selection_plugin'),
        
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        
        $ = require('$');
    var View = lib.get('./data.View'),
        Thumb_loader = require('./photo.Thumb_loader'),
        tmpl = require('./tmpl');

    var _ = require('i18n').get('./pack'),
        l_key = 'photo';

    var Module = inherit(View, {
        enable_box_select : true,
        enable_context_menu : true,
        enable_select : true,
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
            this.$empty_ui = $(tmpl.empty()).height(this.get_list_height()).insertAfter(this.$list);
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
                    icon_class: 'ico-download',
                    group: 'edit',
                    id: 'download',
                    text: _(l_key,'下载')
                },
                {
                    icon_class: 'ico-del',
                    group: 'edit',
                    id: 'delete',
                    text: _(l_key,'删除')
                },
                {
                    icon_class: 'ico-share',
                    group: 'edit',
                    id: 'share',
                    text: _(l_key,'分享')
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
            $dom.removeClass('photo-view-loading');
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
                    me.thumb_loader.get(record.get_pid(), record.get_id(), record.get_name()).done(function(url, img){
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
        }
        // --------------- 缩略图结束 -----------------
        
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
    var downloader,
        $ = require('$'),
        lib = require('lib'),
        date_time = lib.get('./date_time'),
        inherit = lib.get('./inherit'),
        Photo_Node = inherit(require('common').get('./file.file_object'), {
            constructor: function (cfg) {
                //转换成file_object的参数
                var props = {};
                props.id = cfg.file_id;
                props.pid = cfg.pdir_key;
                props.ppid = cfg.ppdir_key;
                props.name = cfg.file_name;
                props.size = cfg.file_size;
                props.cur_size = cfg.file_size;
                props.create_time = cfg.file_ctime;
                props.modify_time = cfg.file_mtime;
                props.file_md5 = cfg.file_md5;
                props.file_sha = cfg.file_sha;
                props.file_ver = cfg.file_version;
                Photo_Node.superclass.constructor.apply(this, [props]);
                this._checked = false;
                this.token_time = cfg.file_ttime;//拍摄时间
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
    require.async('downloader', function (mod) { //异步加载downloader
        downloader = mod.get('./downloader');
        Photo_Node.getDownUrl = function (node, size) { //初始化 ui 获取image图片的方法
            if (size) {
                return downloader.get_down_url([node], {abs: size}, true);
            }
            return downloader.get_down_url([node], true);
        };
    });
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
        /**
         * 获取缩略图地址
         * @param size
         * @returns {String}
         */
        get_thumb_url: function (size) {
            return this._thumb_url || ( this._thumb_url = Photo_Node.getDownUrl(this, size));
        },
        /**
         * 获取预览地址
         * @param size
         * @returns {String}
         */
        get_preview_url: function (size) {
            return this._preview_url || ( this._preview_url = Photo_Node.getDownUrl(this, size));
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
        /**
         * @param $to
         */
        render: function($to){
            $body = $to;
            selected_cache = {length:0};
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
            $el.addClass('photo-view-list-selected');
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
            $el.removeClass('photo-view-list-selected');
            delete selected_cache[file_id];
            selected_cache.length-=1;
            return true;
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
                var node = get_store().get_node_by_id(key);
                if( node && key !== file_id ){
                    node.toggle_check();//退出选中状态
                    this.un_select($body.find('[data-file-id='+key+']'),key);
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
                    var node = get_store().get_node_by_id(key);
                    if( node ){
                        ret.push(node);
                    }
                }
            }
            return ret;
        },
        set_selected_id: function(selected_id){
            if(!selected_cache.hasOwnProperty(selected_id)){
                selected_cache[selected_id] = selected_id;
                selected_cache.length +=1;
            }
        },
        set_unSelected_id: function(selected_id){
            if(selected_cache.hasOwnProperty(selected_id)){
                delete selected_cache[selected_id];
                selected_cache.length -=1;
            }
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
            this.array.push(node);
            this.length += 1;
        },
        /**
         * 删除节点
         * @param {HashMap<String,boolean>} id_map
         */
        remove_nodes: function (id_map) {
            var me = this,len = me.length;
            while(len){
                len-=1;
                if ( id_map.hasOwnProperty(me.array[len].get_id()) ) {
                    me.array.splice(len, 1);
                    me.length -= 1;
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
        }
    });
    return Time_Group;
});
/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define.pack("./time.cgi",["lib","$","common","./time.Photo_Node","./time.Time_Group"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),
        inherit = lib.get('./inherit'),

        request = require('common').get('./request'),

        Photo_Node = require('./time.Photo_Node'),
        Time_Group = require('./time.Time_Group');

    //数据加载器
    var loader = {
        header: function (offset) {
            return {
                'cavil': true,
                'url': 'http://web2.cgi.weiyun.com/lib_list.fcg',
                'cmd': 'get_lib_list',
                'body': {
                    "lib_id": 2,	//int型：1表示文档类；2表示图片类；3表示音乐类；4表示视频类
                    "offset": offset,	//int型：从0开始算
                    "count":200,//int型：每页要拉取的数量
                    "sort_type": 3,//int型：排序方式：0上传时间；1修改时间；2字母序；3拍摄时间
                    "group_id": 0	//int型：当拉取图片类某个分组时有效：1表示未分组
                }
            };
        },
        request: function (offset) {
            var me = this;
            me.destroy();
            me.JsonpRequest =
                request.get(me.header(offset))
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
            var data = body['list_item'] || {},
                ret = [];
            if(data && data.length){//有数据时
                ret = this._parse_data(data);
                ret.sort(function (node1, node2) {
                    return node2.get_token_date() - node1.get_token_date();
                });
            }
            this.num+= ret.length;
            if(body.end){//已经加载完成
                this._complete = true;
            }

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
define.pack("./time.imgReady",["common","lib"],function (require) {
    var functional = require('common').get('./util.functional'),
        console = require('lib').get('./console'),
        loader = (function () {
            var list = [], intervalId = null,

            // 用来执行队列
                tick = function () {
                    var i = 0;
                    for (; i < list.length; i++) {
                        list[i].end ? list.splice(i--, 1) : list[i]();
                    }
                    !list.length && stop();
                },

            // 停止所有定时器队列
                stop = function () {
                    clearInterval(intervalId);
                    intervalId = null;
                };
            /**
             * @param url 路径
             * @param file_id
             * @param {function} ready
             * @param {function} [load]
             * @param {function} error
             */
            return function (url, file_id, ready, load, error) {
                var onready, width, height, newWidth, newHeight,
                    img = new Image();
                img.file_id = file_id;
                img.src = url;

                // 如果图片被缓存，则直接返回缓存数据
                if (img.complete) {
                    ready.call(img);
                    load && load.call(img);
                    return;
                }

                width = img.width;
                height = img.height;

                // 加载错误后的事件
                img.onerror = function () {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                };

                // 图片尺寸就绪
                onready = function () {
                    newWidth = img.width;
                    newHeight = img.height;
                    if (newWidth !== width || newHeight !== height ||
                        // 如果图片已经在其他地方加载可使用面积检测
                        newWidth * newHeight > 1024
                        ) {
                        ready.call(img);
                        onready.end = true;
                    }
                };
                onready();

                // 完全加载完毕的事件
                img.onload = function () {
                    // onload在定时器时间差范围内可能比onready快
                    // 这里进行检查并保证onready优先执行
                    !onready.end && onready();

                    load && load.call(img);

                    // IE gif动画会循环执行onload，置空onload即可
                    img = img.onload = img.onerror = null;
                };

                // 加入队列中定期执行
                if (!onready.end) {
                    list.push(onready);
                    // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                }
            };
        })(),
        IMG_THUMB_MAP = {//将要显示缩略图
            length: 0,//总长度
            CONNECT_NUM: 5,//每次可同时获取img的个数
            DOING_NUM: 0,//正在获取链接的个数
            PIPE_CACHE: []//冗余数据
        },
        ok_handler,
        er_handler;

    var imgReady = {
        /**
         * 初始化
         * @param ok_fn
         * @param er_fn
         */
        render: function (ok_fn, er_fn) {
            this.destroy();
            ok_handler = ok_fn;
            er_handler = er_fn;
        },
        /**
         * 添加将要显示的图片信息
         * @param {String} src 图片地址
         * @param {String} file_id 节点ID
         */
        add_thumb: function (src, file_id) {
            IMG_THUMB_MAP.PIPE_CACHE.push(src);
            IMG_THUMB_MAP[src] = file_id;
            IMG_THUMB_MAP.length += 1;
        },
        /**
         * 触发加载请求
         */
        start_load: function () {
            imgReady._run_thumb();
        },
        /**
         * 销毁初始化的信息 和 添加的请求信息
         */
        destroy: function () {
            er_handler = ok_handler = function () {
            };
            IMG_THUMB_MAP = {
                length: 0,
                CONNECT_NUM: 3,//限制请求的最大下载数
                DOING_NUM: 0,
                PIPE_CACHE: []
            };
        },
        /**
         * 处理加载结果
         * @param src 地址
         * @param file_id 文件id
         * @param is_ok 是否成功
         * @private
         */
        _process_result: function (src, file_id, is_ok) {
            if (src) {
                if (is_ok) {
                    ok_handler.call(null, src, file_id);
                } else {
                    er_handler.call(null, src, file_id);
                }
                IMG_THUMB_MAP.DOING_NUM -= 1;
            } else {
                console.debug(is_ok, '  no found ', this.src, src, file_id);
            }
            imgReady._run_thumb();
        },
        _ready: function () {
            imgReady._process_result(this.src, this.file_id, true);
        },
        _error: function () {
            imgReady._process_result(this.src, this.file_id, false);
        },
        _run_thumb: function () {
            var diff = IMG_THUMB_MAP.CONNECT_NUM - IMG_THUMB_MAP.DOING_NUM;
            if (diff > 0 && IMG_THUMB_MAP.length > 0) {
                var url, urls = this._remove_thumb(diff);
                while (url = urls.shift()) {
                    IMG_THUMB_MAP.DOING_NUM += 1;
                    loader(url, IMG_THUMB_MAP[url], this._ready, null, this._error);
                }
            }
        },
        _remove_thumb: function (_num) {
            var num = _num,
                ret_key = [];
            if (IMG_THUMB_MAP.length < num) {
                num = _num = IMG_THUMB_MAP.length;
            }
            for (; num--; num > 0) {
                ret_key.push(IMG_THUMB_MAP.PIPE_CACHE.shift());
            }
            IMG_THUMB_MAP.length -= _num;
            return ret_key;
        }
    };
    return imgReady;
});/**
 * 文件菜单UI逻辑(包括文件的"更多"菜单和右键菜单)
 * @author trump
 * @date 13-11-09
 */
define.pack("./time.menu",["lib","common","./time.Select","i18n"],function (require, exports, module) {
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
                share_time: 1
            }
        },

        _ = require('i18n').get('./pack'),
        l_key = 'photo',

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
                        text: _(l_key,'分享'),
                        icon_class: 'ico-share',
                        group: 'edit',
                        click: function(e) {
                            photo_time_event.trigger('share_time');
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'remove_time':
                    return {
                        id: id,
                        text: _(l_key,'删除'),
                        icon_class: 'ico-del',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('remove_time');
                            menu.hide_photo_time_menu();
                        }
                    };
                case 'download_time':
                    return {
                        id: id,
                        text: _(l_key,'下载'),
                        icon_class: 'ico-download',
                        group: 'edit',
                        click: function (e) {
                            photo_time_event.trigger('download_time');
                            menu.hide_photo_time_menu();
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
            this.trigger_event(DELETE_STATE.OK, this._delete_nodes(nodes));
        },
        /**
         * 删除节点
         * @param nodes
         * @private
         */
        _delete_nodes: function (nodes) {
            var me = this,
                cache = me.cache,
                delete_file_ids = {};
            $.each(nodes, function (i, node) {
                delete_file_ids[node.get_id()] = 1;
            });

            for (var file_id in delete_file_ids) {//删除id_map中的节点映射关系
                if(cache.id_map[file_id]){
                    delete cache.id_map[file_id];
                    cache.node_length -= 1;//节点数减一
                }
            }

            var len = cache.sort_group.length;//删组
            while(len){
                len-=1;
                var group = cache.sort_group[len];
                if ( group.remove_nodes(delete_file_ids) === 0) {//删除包含的节点//删除时间组
                    me.trigger_event(DELETE_STATE.DELETE_TIME_GROUP, group.get_day_id());//触发其他删除连带动作
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
                if (delete_file_ids.hasOwnProperty(cache.id_array[len2].get_id())) {//删除id_array中的节点
                    cache.id_array.splice(len2, 1);//队列中删除
                }
            }
            return delete_file_ids;
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
                return;
            }
            var me = this,
                offset = me.cache.node_length;
            me.trigger_event(STATE.loader_loading);
            cgi.load_data(offset)//数据加载
                .done(function (sort_group, id_map,nodes) {
                    me.append_data(sort_group, id_map, nodes);
                    me.trigger_event(STATE.loader_done, (!me.cache.sort_group || !me.cache.sort_group.length) , offset === 0 , me.from_refresh);
                    callback && callback.call();
                })
                .fail(function (ops) {
                    if (ops && ops.hander_fail) {//手动触发失败，不进行事件转发
                        return;
                    }
                    me.trigger_event(STATE.loader_error, ops.msg, ops.ret);
                    callback && callback.call();
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
        }
    });
});
/**
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define.pack("./time.view",["lib","common","$","main","./tmpl","./time.Select","./time.menu","./time.imgReady","i18n","./time.store"],function (require, exports, module) {
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

        scroller = require('main').get('./ui').get_scroller(),

        downloader = $.noop,

        tmpl = require('./tmpl'),
        Select = require('./time.Select'),
        menu = require('./time.menu'),
        imgReady = require('./time.imgReady'),
        store,

        PADDING_LEFT = 146,
        LINE_HEIGHT = 0 ,
        IMG_THUMB_SIZE = '128*128',
        IMG_PREVIEW_SIZE = '1024*1024',
        item_class = 'photo-view-list',
        item_selected_class = 'photo-view-list-selected',
        cell_id_prefix = 'time_',
        row_id_prefix = 'day_',

        _ = require('i18n').get('./pack'),
        l_key = 'photo',

        undefined;

    require.async('downloader', function (mod) { //异步加载downloader
        downloader = mod.get('./downloader');
    });

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
        /**
         * 返回相册主题框架
         * @returns {jQuery}
         */
        get_$main: function () {
            return this.$main_box || {};
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
                if(group.is_dirty()){
                    $('#day_id_'+group.get_day_id()).remove();
                    group.set_dirty(false);
                }
                me.get_$body().append(tmpl.time_row(group));
                $.each(group.get_array(), function (i, node) {
                    imgReady.add_thumb(node.get_thumb_url(IMG_THUMB_SIZE), node.get_id());
                });
            });

            if (group_nodes.length > 0) {
                imgReady.start_load();
                me.refresh_SelectBox();
            }
        },
        /**
         * 刷新框选
         */
        refresh_SelectBox: function () {
            if (this.sel_box) {
                this.sel_box.refresh();
            }
        },
        get_time_height: function(){
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
                        mod.get('./full_screen_preview').preview(node, function () {
                            return  url_hander.call(node);
                        });
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
         * @param all_node
         * @param url_handler
         */
        web_preview: function (node, all_node, url_handler) {
            var me = this;
            require.async(['image_preview'], function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    images = all_node,
                    index = $.inArray(node, images);// 当前图片所在的索引位置
                image_preview.start({
                    support_nav: true,
                    total: images.length,
                    index: index,
                    get_url: function (index, options) {
                        var file = images[index];
                        if (file) {
                            return url_handler.call(file);
                        }
                    },
                    download: function (index) {
                        var file = images[index];
                        if (file) {
                            downloader.down_url(url_handler.call(file), file.get_name(), file.get_size());
                        }
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file,function(success){
                            if(success){
                                images.splice(index, 1);
                            }
                            callback();
                        },me);
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
                    me.web_preview(node, me.get_store().get_all_node_array(), function () {
                        return this.get_preview_url(IMG_PREVIEW_SIZE);
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
        download_files: function () {
            var files = Select.get_selected_nodes();
            if (files.length) {
                var file = files[0];
                downloader.down_url(file.get_down_url(), file.get_name(), file.get_size());
            }
        },
        when_remover_ready : function(){
            var def = $.Deferred(),
                me = this,
                remover = me.remover;

            if(remover){
                def.resolve(remover);
            }else{
                require.async('disk', function(disk){
                    var remover = me.remover = disk.get('./file_list.file_processor.remove.remove');
                    remover.render();
                    def.resolve(remover);
                });
            }
            return def;
        },
        get_delete_params : function(first_file_name, count){
            return {
                title: _(l_key,'删除图片'),
                up_msg : count>1 ? _(l_key,'确定要删除这些图片吗？') : _(l_key,'确定要删除这张图片吗？')
            };
        },
        do_delete : function(nodes, callback, scope){
            var me = this;
            nodes = [].concat(nodes);
            this.when_remover_ready().done(function(remover){
                var remove_worker = me.remover.remove_confirm(nodes, null, false, undefined, undefined, me.get_delete_params);
                remove_worker.on('has_ok', function (removed_file_ids) {
                    me.get_store().remove_data(nodes);
                    if(callback){
                        callback.call(scope, true);
                    }
                });
            });
        },
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
                mini_tip.warn(_(l_key,'请选择图片'));
            }
        },
        /**
         * 链接分享
         */
        link_share: function () {
            var files = Select.get_selected_nodes();
            if (files.length) {
                require.async('share_enter', function (share_enter) {
                    share_enter.get('./share_enter').start_share(files[0]);
                });
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
         * 窗口大小改变时，判断是否需要加载更多数据
         */
        resize: function () {
            var LINE_HEIGHT = this.get_$main().height();
            if (this.is_able_load() && this.get_time_height() <= LINE_HEIGHT) {
                this.load_html();
                return;
            }
        },
        /**
         * 滚动页面时加载更多数据
         */
        scroll: function () {
            if (this.is_able_load() && scroller.is_reach_bottom()) {
                this.load_html();
            }
        },
        /**
         * 工具条动作 批量删除
         */
        batch_delete: function () {
            this.remove_files();
        },
        /**
         * 框选改变
         * @param sel_id_map
         * @param unsel_id_map
         */
        update_selection: function (sel_id_map, unsel_id_map) {
            var store = this.get_store(), html_id;
            for (html_id in sel_id_map) {
                if (sel_id_map.hasOwnProperty(html_id)) {
                    var id = html_id.replace(cell_id_prefix, ''),
                        node = store.get_node_by_id(id);
                    if (node) {
                        node.set_checked();
                        Select.set_selected_id(id);
                    }
                }
            }
            for (html_id in unsel_id_map) {
                if (unsel_id_map.hasOwnProperty(html_id)) {
                    var id = html_id.replace(cell_id_prefix, ''),
                        node = store.get_node_by_id(id);
                    if (node) {
                        node.set_unChecked();
                        Select.set_unSelected_id(id);
                    }
                }
            }
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
         * 开始监听
         * @private
         */
        _start_listen: function () {
            var me = this;

            me.get_$body()
                .on('click', '.photo-view-list-checkbox', this.select_file)//勾选
                .on('click.photo-view-list', '[data-file-id]', this.preview_image)//预览
                .on('mousedown.file_list_context_menu', '.photo-view-list', this.right_mouse);//右键
            me.listenTo(scroller,{
                'scroll': me.scroll,
                'resize': me.resize
            });
            //图片加载
            imgReady.render(function (url, file_id) {//成功
                var self = $('#' + cell_id_prefix + file_id);
                if( self.data('image_ok') ){
                    return;
                }
                self.data('image_ok',true)
                    .removeClass('photo-view-loading')
                    .find('a').prepend('<img src="' + url + '"/>');
            }, function (url, file_id) {});//失败

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
            imgReady.destroy();
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
                }, 'download_time': function () {
                    me.download_files();
                }
            });


            var get_$els = function () {
                return me.get_$body().children();
            };
            me.sel_box = new SelectBox({
                ns: 'photo_times',
                get_$els: get_$els,
                $scroller: scroller.get_$el(),
                child_filter: '.' + item_class,
                selected_class: item_selected_class,
                clear_on: function ($tar) {
                    return $tar.closest('.' + item_class).length === 0;
                },
                container_width: function () {
                    return get_$els().eq(0).width();
                }
            });
            me.sel_box.on('select_change', me.update_selection, me);
        },
        /**
         * @param {jQuery} $to
         */
        render: function ($to) {
            var me = this;
            me.$main_box = $to;
            me._once_render();
            me.destroy();
        },
        /**
         * 销毁时的方法
         */
        destroy: function () {
            this._stop_listen();
            if (this._$body) {
                this._$body.parent().remove();
                this._$body = null;
            }
            this.remove_empty();
        },
        remove_empty: function(){
            if($('#photo_time_empty')[0]){
                $('#photo_time_empty').parent().remove();
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
        on_loader_done: function (is_empty,first_time,refresh) {
            widgets.loading.hide();
            if(first_time){
                this.get_$body().empty();
            }
            this.get_$body().parent().show();
            if (is_empty) {//没有数据
                this.get_$body().parent().hide();
                this.remove_empty();
                this.get_$main().append(tmpl.time_empty());
                return;
            }
            if(refresh){
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
            var me = this;
            progress.hide();
            for(var id in delete_id_map){
                var $el = me.get_$item_by_id(id);
                Select.un_select($el,id);
                $el.remove();
            }
            mini_tip.ok(_(l_key,'删除成功'));
        },
        /**
         * 删除失败
         */
        on_delete_fail: function (msg, ret) {
            progress.hide();
            mini_tip.error(msg || _(l_key,'删除失败'));
        },
        /**
         * 删除日期组
         * @param day_id
         */
        on_delete_time_group: function (day_id) {
            $('#' + row_id_prefix + day_id).remove();
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
__p.push('    <div id="photo-group" class="photo-group">\r\n\
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
        var _ = require('i18n').get('./pack'),
            l_key = 'photo';
    __p.push('    ');
 
    $.each(records, function(index, record){
     __p.push('        <div data-list="true" class="photo-group-list-wrap ');
_p(record.get('menu_active') ? 'photo-group-menu' : '');
__p.push('" data-record-id="');
_p(record.id);
__p.push('">\r\n\
            <div class="photo-group-list">\r\n\
                <div class="photo-group-img-border photo-group-loading"></div>\r\n\
                <div class="photo-group-list-text"><span data-textlen="100" class="text">');
_p(text.text(record.get('name')));
__p.push('</span>\r\n\
                    <span class="count">(');
_p(record.get('size'));
__p.push(')</span></div>\r\n\
                <div class="photo-group-list-edit"><input type="text" value=""></div>');
 if(!record.get('dummy')){ __p.push('                <a data-tool-link="true" class="photo-group-tool" href="#"><i></i></a>\r\n\
                <ul data-tool-menu="true" class="photo-group-toolmenu">');
 if(!record.get('readonly')){ __p.push('                    <li><a data-action="rename" href="#">');
_p(_(l_key,'重命名'));
__p.push('</a></li>\r\n\
                    <li><a data-action="delete" href="#">');
_p(_(l_key,'删除'));
__p.push('</a></li>');
 } __p.push('                    <li><a data-action="set_cover" href="#">');
_p(_(l_key,'更改封面'));
__p.push('</a></li>\r\n\
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

        var records = data.records;
        var id_perfix = data.id_perfix || 'photo-item-';
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
                <img src="http://imgcache.qq.com/vipstyle/nr/box/img/photo-group-empty-min.png">\r\n\
                <div class="mask"></div>\r\n\
                <i class="check"></i>\r\n\
            </a>\r\n\
        </li>');
 }); __p.push('');

return __p.join("");
},

'cover_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'photo';
    __p.push('    <div style="height: 30px;line-height: 30px;color: #adb2b9;font-size: 18px;text-align: center;">');
_p(_(l_key,'此分组中无图片'));
__p.push('    <div>');

return __p.join("");
},

'group_detail_panel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'photo';
    __p.push('    <div class="photo-view photo-group-detaile">\r\n\
        <div class="photo-group-back">\r\n\
            <a class="back"><span class="arr"></span><span class="arrinner"></span>');
_p( _(l_key,'返回'));
__p.push('</a>\r\n\
            <div class="text"></div>\r\n\
        </div>\r\n\
        <div class="photo-view-box"><div class="photo-view-box-inner"></div></div>\r\n\
        <div class="photo-group-aside"></div>\r\n\
        <a href="#" class="photo-group-aside-toggle"><span class="arr"></span></a>\r\n\
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

        var default_img_url = 'http://imgcache.qq.com/vipstyle/nr/box/img/photo-empty.png',
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

        var text = require('lib').get('./text');
        var records = data.records;
    __p.push('    ');
 
    $.each(records, function(index, record){
     __p.push('        <li class="list" data-record-id="');
_p(record.id);
__p.push('" title="');
_p(text.text(record.get('name')));
__p.push('">\r\n\
            <a class="link" href="#">\r\n\
                    <img src="http://imgcache.qq.com/vipstyle/nr/box/img/photo-group-empty-min.png" />\r\n\
                    <span class="ellipsis">');
_p(text.text(record.get('name')));
__p.push('</span>\r\n\
                    <i class="');
_p( record.get('checked') ? 'checked' : '' );
__p.push('"></i>\r\n\
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

        var text = require('lib').get('./text');
        var records = data.records;
        var _ = require('i18n').get('./pack'),
            l_key = 'photo';
    __p.push('    ');
 
    $.each(records, function(index, record){
     __p.push('        <li data-list="true" class="list" data-record-id="');
_p(record.id);
__p.push('">\r\n\
            <div class="list-inner ');
_p( record.get('selected') ? 'list-focus' : '' );
__p.push('">\r\n\
                <div class="img">\r\n\
                    <img src="http://imgcache.qq.com/vipstyle/nr/box/img/photo-group-empty-min.png" />\r\n\
                    <i class="mask"></i>\r\n\
                </div>\r\n\
                <div class="infor">\r\n\
                    <p class="title ellipsis">');
_p(text.text(record.get('name')) || '?');
__p.push('</p>\r\n\
                    <p class="size ellipsis">');
_p(text.format(_(l_key,'{0}张'),[record.get('size')?record.get('size'):0]));
__p.push('</p>\r\n\
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

        var cur = data.mode;
        var _ = require('i18n').get('./pack'),
            l_key = 'photo';
    __p.push('    <div class="view-mode-sort">\r\n\
        <span data-vm="time" ');
_p(cur==='time' ? 'class="on"' : '');
__p.push('><a title="');
_p(_(l_key,'时间轴'));
__p.push('" class="vm-l" href="#"><em>');
_p(_(l_key,'时间轴'));
__p.push('</em></a></span>\r\n\
        <span data-vm="group" ');
_p(cur==='group' ? 'class="on"' : '');
__p.push('><a title="');
_p(_(l_key,'分组'));
__p.push('" class="vm-m" href="#"><em>');
_p(_(l_key,'分组'));
__p.push('</em></a></span>\r\n\
        <span data-vm="all" ');
_p(cur==='all' ? 'class="on"' : '');
__p.push('><a title="');
_p(_(l_key,'全部'));
__p.push('" class="vm-r" href="#"><em>');
_p(_(l_key,'全部'));
__p.push('</em></a></span>\r\n\
    </div>');

return __p.join("");
},

'empty': function(data){

var __p=[],_p=function(s){__p.push(s)};

    var _ = require('i18n').get('./pack'),
        l_key = 'photo';
__p.push('    <div class="ui-view ui-view-empty">\r\n\
        <div class="g-empty sort-pic-empty">\r\n\
            <div class="empty-box">\r\n\
                <div class="ico"></div>\r\n\
                <p class="title">');
_p(_(l_key,'暂无图片'));
__p.push('</p>\r\n\
                <p class="content">');
_p(_(l_key,'请点击左上角的“上传”按钮添加'));
__p.push('</p>\r\n\
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
        text = lib.get('./text'),
        _ = require('i18n').get('./pack'),
        l_key = 'photo';
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
 if(data.config.show_create_group){ __p.push('                <a class="new-group" href="#">+');
_p(_(l_key,'新建分组'));
__p.push('</a>');
 } __p.push('                <div class="box-btns">');

                    $.each(data.buttons || [], function(i, btn) {
                    __p.push('                    <a  data-btn-id="');
_p( text.text(btn.id) );
__p.push('" class="g-btn g-btn-pad25 ');
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
__p.push('<div class="photo-view"></div>');

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
__p.push('" class="photo-view-list photo-view-loading ');
_p(record.get('selected') ? 'photo-view-list-selected' : '');
__p.push('">\r\n\
            <a href="#" class="photo-view-list-link" unselectable="on">\r\n\
                <span class="photo-view-list-checkbox"></span>\r\n\
                <span class="photo-view-list-mask"></span>\r\n\
            </a>\r\n\
        </div>');
 }); __p.push('');

return __p.join("");
},

'time_body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div style="height:100%">\r\n\
        <div id="photo-time-view" class="photo-view photo-module-timeline"></div>\r\n\
    </div>');

return __p.join("");
},

'time_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){

    var _ = require('i18n').get('./pack'),
        l_key = 'photo';
__p.push('\r\n\
<div style="height:100%" class="ui-view ui-view-empty">\r\n\
    <div class="g-empty sort-pic-empty" id="photo_time_empty">\r\n\
        <div class="empty-box">\r\n\
        <div class="ico"></div>\r\n\
        <p data-id="title" class="title">');
_p(_(l_key,'暂无图片'));
__p.push('</p>\r\n\
        <p data-id="content" class="content">');
_p(_(l_key,'请点击左上角的“上传”按钮添加'));
__p.push('</p>\r\n\
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
    </div>\r\n\
    <div class="photo-view-time-cover"></div>');
_p(html.join(''));
__p.push('</div>');

return __p.join("");
},

'time_cell': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="photo-view-list photo-view-loading" data-file-id="');
_p(data.get_id());
__p.push('" id="');
_p(('time_'+data.get_id()));
__p.push('">\r\n\
    <a href="javascript:void(0)" class="photo-view-list-link">\r\n\
        <span class="photo-view-list-checkbox"></span>\r\n\
        <span class="photo-view-list-mask"></span>\r\n\
    </a>\r\n\
</div>');

return __p.join("");
}
};
return tmpl;
});
