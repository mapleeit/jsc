//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n/module/disk/disk.index",["lib","common","$","add_wy_appbox","main","i18n","weixin_css","disk_css"],function(require,exports,module){

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
//disk/src/disk.js
//disk/src/file/article_node.js
//disk/src/file/file_node.js
//disk/src/file/file_node_ui.js
//disk/src/file/plaintext_node.js
//disk/src/file/utils/all_file_map.js
//disk/src/file/utils/file_factory.js
//disk/src/file/utils/file_node_from_cgi.js
//disk/src/file/voice_node.js
//disk/src/file_list/file_list.js
//disk/src/file_list/file_processor/move/move.js
//disk/src/file_list/file_processor/move/ui.js
//disk/src/file_list/file_processor/remove/remove.js
//disk/src/file_list/file_processor/remove/ui.js
//disk/src/file_list/file_processor/vir_remove/vir_remove.js
//disk/src/file_list/menu/menu.js
//disk/src/file_list/rename/rename.js
//disk/src/file_list/rename/ui.js
//disk/src/file_list/selection/selection.js
//disk/src/file_list/share/share.js
//disk/src/file_list/share/ui.js
//disk/src/file_list/thumb/thumb.js
//disk/src/file_list/thumb/ui.js
//disk/src/file_list/ui.js
//disk/src/file_list/ui_abstract.js
//disk/src/file_list/ui_normal.js
//disk/src/file_list/ui_virtual.js
//disk/src/file_path/all_checker.js
//disk/src/file_path/file_path.js
//disk/src/file_path/ui.js
//disk/src/toolbar/status.js
//disk/src/toolbar/tbar.js
//disk/src/ui.js
//disk/src/view_switch/ui.js
//disk/src/view_switch/view_switch.js
//disk/src/disk.APPBOX.tmpl.html
//disk/src/disk.WEB.tmpl.html
//disk/src/file_list/file_processor/move/move.tmpl.html
//disk/src/file_list/rename/rename.tmpl.html
//disk/src/file_list/selection/selection.tmpl.html
//disk/src/file_list/share/share.tmpl.html
//disk/src/file_list/ui_normal.tmpl.html
//disk/src/file_list/ui_virtual.tmpl.html
//disk/src/file_path/all_checker.tmpl.html
//disk/src/file_path/file_path.APPBOX.tmpl.html
//disk/src/file_path/file_path.WEB.tmpl.html
//disk/src/view_switch/view_switch.APPBOX.tmpl.html
//disk/src/view_switch/view_switch.WEB.tmpl.html

//js file list:
//disk/src/disk.js
//disk/src/file/article_node.js
//disk/src/file/file_node.js
//disk/src/file/file_node_ui.js
//disk/src/file/plaintext_node.js
//disk/src/file/utils/all_file_map.js
//disk/src/file/utils/file_factory.js
//disk/src/file/utils/file_node_from_cgi.js
//disk/src/file/voice_node.js
//disk/src/file_list/file_list.js
//disk/src/file_list/file_processor/move/move.js
//disk/src/file_list/file_processor/move/ui.js
//disk/src/file_list/file_processor/remove/remove.js
//disk/src/file_list/file_processor/remove/ui.js
//disk/src/file_list/file_processor/vir_remove/vir_remove.js
//disk/src/file_list/menu/menu.js
//disk/src/file_list/rename/rename.js
//disk/src/file_list/rename/ui.js
//disk/src/file_list/selection/selection.js
//disk/src/file_list/share/share.js
//disk/src/file_list/share/ui.js
//disk/src/file_list/thumb/thumb.js
//disk/src/file_list/thumb/ui.js
//disk/src/file_list/ui.js
//disk/src/file_list/ui_abstract.js
//disk/src/file_list/ui_normal.js
//disk/src/file_list/ui_virtual.js
//disk/src/file_path/all_checker.js
//disk/src/file_path/file_path.js
//disk/src/file_path/ui.js
//disk/src/toolbar/status.js
//disk/src/toolbar/tbar.js
//disk/src/ui.js
//disk/src/view_switch/ui.js
//disk/src/view_switch/view_switch.js
/**
 *
 * @author jameszuo
 * @date 13-2-28
 */
define.pack("./disk",["lib","common","$","add_wy_appbox","./tmpl","main","./ui","./file_list.file_list","./file_path.file_path","./toolbar.tbar","./view_switch.view_switch"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        add_wy_appbox_event = common.get('./global.global_event').namespace('add_wy_appbox'),
        add_wy_appbox = require('add_wy_appbox'),
        tmpl = require('./tmpl'),

        slice = [].slice,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        downloader,//下载模块
        undefined;

    var disk = new Module('disk', {

        ui: require('./ui'),

        params_invoke_map: {
            path: 'set_path'
        },

        set_path: function (path) {
            require('./file_list.file_list').set_path(path);
        },

        /**
         * 渲染子模块
         * @param {Module} sub_module
         * @param {*} arg1
         * @param {*} arg2
         */
        render_sub: function (sub_module, arg1, arg2 /*...*/) {
            try {
                var args = slice.call(arguments, 1);
                sub_module.render.apply(sub_module, args);

                this.add_sub_module(sub_module);
            }
            catch (e) {
                console.error('disk.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
            }
            return this;
        }
    });

    disk.on('render', function () {
        var
            ui = this.ui,
            file_list = require('./file_list.file_list'),
            file_path = require('./file_path.file_path'),
            tbar = require('./toolbar.tbar'),
            view_switch = require('./view_switch.view_switch');

        if (constants.UI_VER === 'APPBOX') {
            this.render_sub(tbar, main_ui.get_$bar1())
                .render_sub(file_path, main_ui.get_$bar2())
                .render_sub(file_list, ui.get_$view())
                // 视图切换按钮嵌入在工具条上
                .render_sub(view_switch, tbar.get_$el());
        } else {
            this.render_sub(tbar, ui.get_$toolbar())
                .render_sub(file_list, ui.get_$view())
                .render_sub(file_path, ui.get_$bar())
                // 视图切换按钮嵌入在工具条上
                .render_sub(view_switch, tbar.get_$el());
        }


        //APPBOX添加微云到主面板引导页面启动
        if (constants.IS_APPBOX) {
            add_wy_appbox.get("./add_wy_appbox");
            add_wy_appbox_event.trigger('is_wy_in_appbox');
        }
    });

    return disk;

});/**
 * 文章
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.article_node",["$","./file.file_node"],function (require, exports, module) {
    var $ = require('$'),

        FileNode = require('./file.file_node'),

        undef;


    /**
     * 构造函数
     * @param options
     *   {String} title   标题
     *   {String} desc    摘要
     *   {String} url     链接
     *   {String} raw_url 原始链接
     *   {String} thumb   缩略图
     * @constructor
     */
    var ArticleNode = function (options) {
        options.is_dir = false;
        FileNode.call(this, options);

        this._title = options.title;
        this._url = options.url;
        this._raw_url = options.raw_url;
        this._thumb = options.thumb;
    };

    ArticleNode.prototype = $.extend({}, FileNode.prototype, {
        class_name: 'ArticleNode',

        _title: '',
        _desc: '',
        _url: '',
        _raw_url: '',
        _thumb: '',

        get_url: function () {
            return this._url;
        },

        get_raw_url: function () {
            return this._raw_url;
        },

        get_thumb: function () {
            return this._thumb;
        },

        get_title: function () {
            return this._title
        },

        get_desc: function () {
            return this._desc
        }

    });

    ArticleNode.is_instance = function (obj) {
        return obj && obj instanceof ArticleNode;
    };

    return ArticleNode;
});/**
 * 文件树形节点（继承自file_object）
 * 需要注意的是，.get_kid_nodes() 返回null时表示该节点未加载数据，返回[]表示无数据
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file.file_node",["lib","common","$","./file.utils.all_file_map","./file.file_node_ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        File = common.get('./file.file_object'),
        constants = common.get('./constants'),

        all_file_map = require('./file.utils.all_file_map'),
        FileNodeUI = require('./file.file_node_ui'),

        undefined;

    /**
     * 文件节点构造函数
     * @param options
     *  - 继承自File对象的属性
     *    {string}  id              文件ID
     *    {string}  name            文件名
     *    {boolean} is_dir          是否目录
     *    {string}  create_time     创建时间
     *    {string}  modify_time     修改时间
     *    {number}  size            大小（目录可不指定）
     *    {number}  cur_size        已上传的大小（目录可不指定）
     *    {string}  file_ver        文件版本（目录可不指定）
     *    {string}  file_md5        文件MD5（目录可不指定）
     *    {string}  file_sha        文件SHA1（目录可不指定）
     *    {string}  file_note       文件Note（目录可不指定）
     *  - FileNode自身属性
     *    {FileNode} parent         父目录
     *    {boolean} is_vir_dir      是否虚拟目录，默认false
     *    {Boolean} is_super        是否抽象根节点，默认false
     *    {Boolean} is_qq_disk_dir  是否QQ硬盘目录，默认false
     *    {Boolean} is_net_fav_dir  是否QQ硬盘目录，默认false
     *    {Boolean} has_image       是否可能包含图片
     *    {Boolean} has_video       是否可能包含视频
     *    {Boolean} has_text        是否可能包含文字
     *    {Boolean} has_voice       是否可能包含语音
     *    {Boolean} has_article     是否可能包含文章
     *    {Boolean} has_newsurl     是否包含来源路径，默认false， file_note中记录的appid判断
     * @constructor
     */
    var FileNode = function (options) {
        var me = this;
        File.apply(me, arguments);

        me._parent = me._kid_nodes = me._kid_map = me._kid_files = me._kid_dirs = null;
        me._is_super = options.is_super === true;
        me._is_vir_dir = !!options.is_vir_dir;
        // 为hash route作准备
        me._route_hash = options.route_hash;
        //是否有文件来源url      目前只需要判断文件是否来源于腾讯新闻  appid=30227

        me._has_newsurl = (options.file_note&&(options.file_note.indexOf(constants.OS_TYPES.QQNEWS)>0))? true:false;

        var id_suffix = me.get_id().substr(8);
        // 是QQ硬盘
        me._is_qq_disk_dir = id_suffix === constants.QQDISK_DIR_ID;
        // 是网络收藏夹
        me._is_net_fav_dir = id_suffix === constants.NET_FAV_DIR_ID;

        // 根目录、QQ硬盘、网络收藏夹不可移动、删除
        if (me._is_super || me._is_qq_disk_dir || me._is_net_fav_dir) {
//            me._is_movable = false;
//            me._is_removable = false;
        }
        // 虚拟目录不可
        if (me._is_vir_dir) {
            me._is_downable = false;
            me._is_removable = false;
            me._is_movable = false;
            me._is_renamable = false;
            me._is_draggable = false;
            me._is_droppable = false;
            me._is_selectable = false;
            me.set_modify_time('');
            me.set_create_time('');
        }
        // 破损文件不可
        if (me.is_broken_file()) {
            me._is_downable = false;
            me._is_movable = false;
            me._is_renamable = false;
            me._is_draggable = false;
            me._is_droppable = false;
        }

        me._has_image = !!options.has_image;
        me._has_video = !!options.has_video;
        me._has_text = !!options.has_text;
        me._has_voice = !!options.has_voice;
        me._has_article = !!options.has_article;

        me._ui = new FileNodeUI(me);
    };

    FileNode.prototype = $.extend({}, File.prototype, {

        _is_file_node_instance: true,
        class_name: 'FileNode',

        set_parent: function (parent) {
            this._parent = parent;
            this._pid = parent ? parent.get_id() : null;
        },

        // 判断节点是否在树上
        is_on_tree: function () {
            return all_file_map.get(this.get_id()) === this;
        },

        // 判断是否抽象根目录
        is_super: function () {
            return this._is_super;
        },

        // 判断是否是根目录
        is_root: function () {
            return this._parent && this._parent.is_super() && this.is_on_tree();
        },
        
        // 获取当前节点的hash router path，用于url hash导航
        get_route_hash : function(){
            return this._route_hash;
        },

        // 判断是否是虚拟目录
        is_vir_dir: function () {
            return this._is_vir_dir;
        },

        // 判断是否有跳转到来源URL
        has_newsurl: function () {
            return this._has_newsurl;
        },

        // 判断是否是虚拟目录或文件
        is_vir_node: function () {
            var node = this;
            do {
                if (node.is_vir_dir()) {
                    return true;
                }
            } while (node = node.get_parent());

            return false;
        },

        // 判断是否QQ硬盘目录
        is_qq_disk_dir: function () {
            return this._is_qq_disk_dir;
        },

        // 判断是否网络收藏夹目录
        is_net_fav_dir: function () {
            return this._is_net_fav_dir;
        },

        // 判断是否包含图片
        has_image: function () {
            return this._has_image
        },
        // 判断是否包含视频
        has_video: function () {
            return this._has_video
        },
        // 判断是否包含文字
        has_text: function () {
            return this._has_text
        },
        // 判断是否包含语音
        has_voice: function () {
            return this._has_voice
        },
        // 判断是否包含文章
        has_article: function () {
            return this._has_article
        },
        // 判断目录下是否有文件
        has_nodes: function () {
            return !!this._kid_nodes && this._kid_nodes.length > 0;
        },

        // 标记临时新建的节点成功创建，它将成为正常节点，反回修改前的节点id。如果没有变化，则不返回
        mark_create_success: function (data) {
            var old_id, new_id;
            if (this.is_tempcreate()) {
                old_id = this.get_id();
                new_id = data.id;
                this.set_name(data.name);
                this.set_create_time(data.create_time);
                this.set_modify_time(data.modify_time);
                this._is_tempcreate = false;

                // 当ID发生变化时，需要修正一些数据
                if (old_id !== new_id) {
                    this._id = new_id;
                    var par = this.get_parent(),
                        par_kid_map = this.get_parent().get_kid_map()

                    // 因为ID变化，所以需要重建父子关系
                    this.set_parent(par);
                    delete par_kid_map[old_id];
                    par_kid_map[new_id] = this;

                    all_file_map.remove(old_id);
                    all_file_map.set(new_id, this);
                    return old_id;
                }
            }
        },

        /**
         * 获取父节点
         */
        get_parent: function () {
            return this._parent;
        },

        /**
         * 获取子节点
         */
        get_kid_nodes: function () {
            return this._kid_nodes;
        },

        /**
         * 获取子节点map
         */
        get_kid_map: function () {
            return this._kid_map;
        },

        /**
         * 获取目录子节点
         */
        get_kid_dirs: function () {
            return this._kid_dirs;
        },

        /**
         * 获取文件子节点
         */
        get_kid_files: function () {
            return this._kid_files;
        },

        /**
         * 通过ID获取当前节点的子节点
         * @param {FileNode|String} id
         */
        get_node: function (id) {
            return id && this._kid_map ? this._kid_map[id] : null;
        },

        /**
         * 设置当前节点的子节点(覆盖)
         * @param {Array<FileNode>} files
         * @param {Array<FileNode>} dirs
         */
        set_nodes: function (dirs, files) {
            if (!files && !dirs) {
                return;
            }

            var me = this;

            me.clear_nodes();


            this._kid_nodes = [];
            this._kid_dirs = [];
            this._kid_files = [];
            this._kid_map = {};

            $.each([dirs, files], function (i, new_nodes) {
                if (new_nodes && new_nodes.length) {
                    $.each(new_nodes, function (j, node) {
                        me.append_node(node);

                        var kid_dirs = node.get_kid_dirs(),
                            kid_files = node.get_kid_files();

                        if ((kid_dirs && kid_dirs.length) || (kid_files && kid_files.length)) {
                            node.set_nodes(kid_files, kid_dirs);
                        }
                    });
                }
            });
        },

        /**
         * 添加子节点
         * @param {FileNode} node
         * @param {Boolean/Number/String/FileNode} before 插入到最前方，默认false，表示追加到后方。如果为数字，表示插入的位置。如果为字串，表示NodeId。
         */
        add_node: function (node, before) {
            // 如果已经在全局缓存中, 并且不在当前节点的子节点中, 则表示该节点是由其他位置移动到当前节点下, 需要从原节点中移除
            var id = node.get_id();
            var exists_node = all_file_map.get(id);
            if (exists_node && exists_node.get_parent() !== this) {   // 如果父节点已不再是当前节点, 需要同步节点所在位置
                exists_node.get_parent().remove_nodes([exists_node]);
            }

            // 写入全局缓存
            all_file_map.set(id, node);

            // 父节点指向当前节点
            node.set_parent(this);

            var kid_nodes = this._kid_nodes || (this._kid_nodes = []),
                kid_dirs = this._kid_dirs || (this._kid_dirs = []),
                kid_files = this._kid_files || (this._kid_files = []),
                kid_map = this._kid_map || (this._kid_map = {});


            // 替换要添加的节点已经在当前节点下了，则替换
            if (kid_map[id]) {
                replace_node(kid_nodes, node) && replace_node(node.is_dir() ? kid_dirs : kid_files, node);
            }
            // 不存在，则追加或插入
            else {
                kid_nodes.push(node);

                var insert_to = node.is_dir() ? kid_dirs : kid_files;
                // 插入
                if (insert_to.length > 0) {
                    if (typeof before === 'boolean') {
                        before = before ? 0 : insert_to.length;
                    }
                    if (typeof before === 'string') {
                        before = all_file_map.get(before);
                    }
                    if (FileNode.is_instance(before)) {
                        before = $.inArray(before, insert_to);
                    }
                    before = before >= 0 && before <= insert_to.length ? before : insert_to.length;
                    insert_to.splice(before, 0, node);
                }
                // 追加
                else {
                    insert_to.push(node);
                }
            }

            kid_map[id] = node;
        },

        /**
         * 在前方插入一个节点
         * @param {FileNode} node
         */
        prepend_node: function (node) {
            this.add_node(node, true);
        },

        /**
         * 在后方追加节点
         * @param {FileNode} node
         */
        append_node: function (node) {
            this.add_node(node, false);
        },

        /**
         * 标记节点是否为已修改
         * @param {Boolean} dirty 是否臧数据
         */
        set_dirty: function (dirty) {
            if (typeof dirty !== 'boolean') {
                console.error('无效的参数 dirty=', dirty);
            }
            this._is_dirty = !!dirty;
        },

        /**
         * 删除自身节点
         */
        remove: function () {
            var parent = this.get_parent();
            if (parent) {
                parent.remove_nodes(this);
            }
        },

        /**
         * 删除子节点
         * @param {FileNode|Array<FileNode>|Array<String>} rem_kid_nodes
         */
        remove_nodes: function (rem_kid_nodes) {
            if (!rem_kid_nodes) return;

            var kid_nodes = this._kid_nodes,
                kid_map = this._kid_map;

            if (kid_nodes && kid_nodes.length) {
                var kid_files = this._kid_files,
                    kid_dirs = this._kid_dirs;

                if (!(rem_kid_nodes instanceof Array)) {
                    rem_kid_nodes = [rem_kid_nodes];
                }

                // 转换array为set提高遍历速度
                var is_id_arr = typeof rem_kid_nodes[0] === 'string',
                    removal_nodes_set = is_id_arr ? collections.array_to_set(rem_kid_nodes) : collections.array_to_set(rem_kid_nodes, function (node) {
                        return node.get_id();
                    });

                $.each(rem_kid_nodes, function (i, rem_kid_node) {
                    // 递归清空其子节点
                    // rem_kid_node.clear_nodes(); // james: 取消递归清空子节点，会导致手动创建的FileNode（如微信）的子节点被删除，从而导致一些bug
                    // 断绝旧的父子关系
                    rem_kid_node.set_parent(null);
                    // 从全局缓存中删除
                    rem_kid_node.remove_from_global();
                });

                var i;

                // 从 kid_nodes、kid_map 中删除
                for (i = kid_nodes.length - 1; i >= 0; i--) {
                    var node = kid_nodes[i];
                    if (node.get_id() in removal_nodes_set) {
                        kid_nodes.splice(i, 1);
                        delete kid_map[node.get_id()];
                    }
                }

                // 从 kid_files 中删除
                if (kid_files && kid_files.length) {
                    for (i = kid_files.length - 1; i >= 0; i--) {
                        if (kid_files[i].get_id() in removal_nodes_set) {
                            kid_files.splice(i, 1);
                        }
                    }
                }

                // 从 kid_dirs 中删除
                if (kid_dirs && kid_dirs.length) {
                    for (i = kid_dirs.length - 1; i >= 0; i--) {
                        if (kid_dirs[i].get_id() in removal_nodes_set) {
                            kid_dirs.splice(i, 1);
                        }
                    }
                }

            }
        },

        /**
         * 清除当前节点的子节点
         */
        clear_nodes: function () {
            if (this._kid_nodes && this._kid_nodes.length) {
                $.each(this._kid_nodes, function (i, node) {
                    // 递归清空子节点
                    // node.clear_nodes(); // james: 取消递归清空子节点，会导致手动创建的FileNode（如微信）的子节点被删除，从而导致一些bug
                    node.set_parent(null);
                    node.remove_from_global();
                });
                this._kid_nodes = this._kid_map = this._kid_files = this._kid_dirs = null;
            }
        },

        remove_from_global: function () {
            all_file_map.remove(this.get_id());
            var kids = this.get_kid_nodes();
            if (kids && kids.length) {
                $.each(kids, function (i, kid) {
                    all_file_map.remove(kid.get_id());
                });
            }
        },

        get_ui: function () {
            return this._ui;
        }
    });


    /**
     * 判断一个对象是否是FileNode或其子类的实例
     * @param {Object} obj
     * @return {boolean}
     */
    FileNode.is_instance = function (obj) {
        if (!obj)
            return false;

        return obj._is_file_node_instance;
    };

    var replace_node = function (arr, node) {
        var id = node.get_id();
        for (var i = 0, l = arr.length; i < l; i++) {
            if (id === arr[i].get_id()) {
                arr.splice(i, 1, node);
                return true;
            }
        }
        return false;
    };

    return FileNode;
});/**
 * FileNode UI
 * @author jameszuo
 * @date 13-8-1
 */
define.pack("./file.file_node_ui",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        file_list_event = common.get('./global.global_event').namespace('disk/file_list'),

        undef;


    var FileNodeUI = function (file) {
        // is_selectable 是否可选中
        // is_selected 是否已选中
        // is_rendered 是否已渲染
        this._file = file;
    };

    FileNodeUI.prototype = {

        /**
         * 选中、取消选中文件
         * @param {Boolean} sel
         */
        set_selected: function (sel) {
            if (this.is_selectable() === false || this._is_selected === sel) {
                return false;
            }

            this._is_selected = sel;

            file_list_event.trigger('file_select_change', this._file, sel);

            return true;
        },

        /**
         * 判断文件是否已选中
         * @return {Boolean}
         */
        is_selected: function () {
            return !!this._is_selected;
        },

        /**
         * 标记文件是否已渲染
         * @param {Boolean} rend
         */
        set_rendered: function (rend) {
            this._is_rendered = rend;
        },

        /**
         * 判断文件是否已渲染
         * @return {Boolean}
         */
        is_rendered: function () {
            return this._is_rendered;
        },

        is_selectable: function () {
            return this._file.is_selectable();
        },

        get_file: function () {
            return this._file;
        }
    };

    $.extend(FileNodeUI.prototype, events);

    return FileNodeUI;
});/**
 * 文本
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.plaintext_node",["$","./file.file_node"],function (require, exports, module) {
    var $ = require('$'),

        FileNode = require('./file.file_node'),

        undef;


    /**
     * 构造函数
     * @param options
     *   {String} content  完整内容
     * @constructor
     */
    var PlaintextNode = function (options) {
        options.is_dir = false;
        FileNode.call(this, options);

        this._content = options.content;
    };

    PlaintextNode.prototype = $.extend({}, FileNode.prototype, {
        _content: '',
        class_name: 'PlaintextNode',

        get_content: function () {
            return this._content;
        }

    });

    PlaintextNode.is_instance = function (obj) {
        return obj && obj instanceof PlaintextNode;
    };

    return PlaintextNode;
});/**
 * 文件全局映射
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.utils.all_file_map",[],function (require, exports, module) {

    var map = {};

    module.exports = {

        /**
         * 通过文件ID获取文件实例
         * @param {String} id
         * @returns {FileObject|FileNode} FileObject的子类
         */
        get: function (id) {
            return map[id];
        },

        /**
         * 通过文件ID数组批量获取文件实例
         * @param {Array<String>} ids
         */
        get_all: function (ids) {
            var arr = [];
            if (ids && ids.length) {
                for (var i = 0, l = ids.length; i < l; i++) {
                    var f = this.get(ids[i]);
                    if (f) {
                        arr.push(f);
                    }
                }
            }
            return arr;
        },

        /**
         * 写入map
         * @param {String} id
         * @param {FileObject|FileNode} f
         */
        set: function (id, f) {
            map[id] = f;
            return f;
        },

        /**
         * 从map中删除
         * @param {String} id
         */
        remove: function (id) {
            var f = map[id];
            delete map[id];
            return f;
        }

    };

});/**
 * 文件工厂，用于生成各种类型的文件实例，并维持一个全局的缓存
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.utils.file_factory",["$","./file.utils.all_file_map","./file.file_node","./file.plaintext_node","./file.voice_node","./file.article_node"],function (require, exports, module) {
    var $ = require('$'),

        all_file_map = require('./file.utils.all_file_map'),

        FileNode = require('./file.file_node'),
        PlaintextNode = require('./file.plaintext_node'),
        VoiceNode = require('./file.voice_node'),
        ArticleNode = require('./file.article_node'),

        classes = {
            FileNode: FileNode,
            PlaintextNode: PlaintextNode,
            VoiceNode: VoiceNode,
            ArticleNode: ArticleNode
        },

        undef;

    module.exports = {

        /**
         * 生成指定类型的文件实例
         * @param {String} Class
         * @param {OBject} options
         * @returns {Class}
         */
        create: function (Class, options) {
            return new classes[Class](options);
        },

        /**
         * 通过CGI响应结果生成文件实例
         * @param {String|Function} type
         * @param {Object} data
         */
        create_from_cgi: function (type, data) {
            var Class = typeof type === 'string' ? classes[type] : type;
            return Class.from_cgi(data);
        }

    };

});/**
 *  从CGI返回结果中获取文件信息转换为文件对象
 * @author jameszuo
 * @date 13-6-27
 */
define.pack("./file.utils.file_node_from_cgi",["lib","common","./file.utils.file_factory"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),

        collections = lib.get('./collections'),

        file_factory = require('./file.utils.file_factory'),
        parse_file = common.get('./file.parse_file'),
        parse_int = parseInt,

        e = [],

        /**
         * CGI响应数据适配器
         */
            cgi_file_adapters = {
            ArticleNode: function (obj, p_node) {
                if (p_node.has_article() && 'title' in obj && 'content' in obj && 'thumb' in obj) {
                    return file_factory.create('ArticleNode', {
                        id: obj['msgid'],
                        title: obj['title'],
                        desc: obj['abstract'],
                        url: obj['content'],
                        raw_url: obj['raw_url'],
                        thumb: obj['thumb'],
                        create_time: obj['ctime']
                    });
                }
            },
            PlaintextNode: function (obj, p_node) {
                if (p_node.has_text() && 'content' in obj && obj['type'] == 1) {
                    return file_factory.create('PlaintextNode', {
                        id: obj['msgid'],
                        content: obj['content'],
                        create_time: obj['ctime']
                    });
                }
            },
            VoiceNode: function (obj, p_node) {
                if (p_node.has_voice() && 'tmlong' in obj && 'content' in obj && obj['type'] == 2) {
                    return file_factory.create('VoiceNode', {
                        id: obj['msgid'],
                        url: obj['content'],
                        duration: obj['tmlong'],
                        create_time: obj['ctime']
                    });
                }
            },
            FileNode: function (obj, p_node) {
                if ('file_id' in obj || 'dir_key' in obj || 'dir_attr' in obj || 'file_attr' in obj) {

                    var par_is_vir_dir = p_node.is_vir_dir(),
                        is_dir = 'dir_key' in obj || 'dir_attr' in obj;

                    // 父目录如果是虚拟目录，则其子目录均为虚拟目录
                    if (par_is_vir_dir && is_dir) {
                        return file_node_from_cgi.vir_dir_from_cgi(obj);
                    }
                    // 普通目录
                    else if (is_dir) {
                        return file_node_from_cgi.dir_from_cgi(obj);
                    }
                    // 普通文件
                    else {
                        return file_node_from_cgi.file_from_cgi(obj);
                    }
                }
            }
        };

    var vir_map;
    // 通过virtual_dir_id获取它的 route hash name
    function get_vir_config(id){
        var recursive;
        // 将constants中定义的各虚拟目录的id取出来，生成快查map
        if(!vir_map){
            vir_map = {};
            recursive = function(map){
                var name, node, children;
                for(name in map){
                    if(map.hasOwnProperty(name)){
                        node = map[name];
                        vir_map[node.id] = {
                            route_hash : name,
                            name : node.name
                        };
                        children = node.children;
                        if(children){
                            recursive(children);
                        }
                    }
                }
            };
            recursive(constants.VIRTUAL_DIRS);
        }
        
        var common_id = id.substring(8);
        if(vir_map.hasOwnProperty(common_id)){
            return vir_map[common_id];
        }
    }

    var file_node_from_cgi = {

        /**
         * CGI 返回的内容格式如下：
         *   {
         *       articles: [
         *          {
         *              ...
         *          }
         *       ],
         *       texts: [
         *          {
         *              ...
         *          }
         *       ],
         *       ...
         *   }
         * @param {Object} body CGI响应body
         * @param {FileNode} p_node 父目录
         */
        from_cgi: function (body, p_node) {
            var files = [];

            for (var p in body) {  // 遍历分组
                var arr = body[p] || e;

                if (arr instanceof Array) {
                    // window.console.log($.map(arr, function (a) { return a.msgid; }).join(', '));
                    for (var i = 0, l = arr.length; i < l; i++) {   // 遍历数据

                        for (var type in cgi_file_adapters) {              // 遍历适配器
                            var file = cgi_file_adapters[type](arr[i], p_node);    // 使用所有适配器尝试适配该文件
                            if (file) {
                                files.push(file);                   // 适配成功
                                break;                              // 退出适配器遍历
                            }
                        }
                    }
                }
            }
            return files;
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        vir_dir_from_cgi: function (obj) {
            var id = obj.dir_key;
            var vir_config = get_vir_config(id);
            var options = {
                is_dir: true,
                is_vir_dir: true,
                route_hash : obj.route_hash || vir_config && vir_config.route_hash,
                id: id,
                name: vir_config && vir_config.name || obj['dir_name'],
                create_time: obj['dir_ctime'],
                modify_time: obj['dir_mtime'],
                icon: obj['dir_icon'],
                is_sortable: false
            };

            var cgi_types = obj['dir_data_type'];
            if (cgi_types) {
                if (cgi_types.indexOf('picture') > -1) { // 包含图片
                    options.has_image = true;
                }
                if (cgi_types.indexOf('video') > -1) { // 包含视频
                    options.has_video = true;
                }
                if (cgi_types.indexOf('audio') > -1) { // 包含语音
                    options.has_voice = true;
                }
                if (cgi_types.indexOf('text') > -1) { // 包含文字
                    options.has_text = true;
                }
                if (cgi_types.indexOf('article') > -1) { // 包含文章w
                    options.has_article = true;
                }
            }
            return file_factory.create('FileNode', options);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        vir_dirs_from_cgi: function (arr) {
            return map(arr, function (obj) {
                return this.vir_dir_from_cgi(obj);
            }, this);
        },

        /**
         * 将cgi返回的目录数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        dir_from_cgi: function (obj) {
            var is_plain = !('dir_attr' in obj || 'file_attr' in obj);

            if (is_plain) {
                obj = {
                    is_dir: true,
                    id: obj['dir_key'],
                    name: obj['dir_name'],
                    create_time: obj['dir_ctime'],
                    modify_time: obj['dir_mtime']
                }
            } else {
                var attr = obj['dir_attr'];
                obj = {
                    is_dir: true,
                    id: obj['dir_key'],
                    name: attr['dir_name'],
                    create_time: obj['dir_ctime'],
                    modify_time: attr['dir_mtime']
                };
            }

            return file_factory.create('FileNode', obj);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        dirs_from_cgi: function (arr) {
            return map(arr, function (obj) {
                return this.dir_from_cgi(obj);
            }, this);
        },


        /**
         * 将cgi返回的文件数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        file_from_cgi: function (obj) {
            var is_plain = !('dir_attr' in obj || 'file_attr' in obj);

            if (is_plain) {
                obj = {
                    is_dir: false,
                    is_vir_dir: false,
                    id: obj['file_id'],
                    name: obj['file_name'],
                    size: parse_int(obj['file_size']) || 0,
                    cur_size: parse_int(obj['file_cur_size']) || 0,
                    create_time: obj['file_ctime'],
                    modify_time: obj['file_mtime'],
                    file_md5: obj['file_md5'],
                    file_sha: obj['file_sha'],
                    file_ver: obj['file_ver'],
                    file_note:obj['file_note']
                }
            } else {
                var attr = obj['file_attr'];
                obj = {
                    id: obj['file_id'],
                    name: attr['file_name'],
                    size: parse_int(obj['file_size']) || 0,
                    cur_size: parse_int(obj['file_cur_size']) || 0,
                    create_time: obj['file_ctime'],
                    modify_time: attr['file_mtime'],
                    file_md5: obj['file_md5'],
                    file_sha: obj['file_sha'],
                    file_ver: obj['file_ver'],
                    file_note:obj['file_note']
                };
            }

            return file_factory.create('FileNode', obj);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        files_from_cgi: function (arr) {
            return map(arr, function (obj) {
                return this.file_from_cgi(obj);
            }, this);
        }
    };

    var map = function (arr, fn, context) {
        var ret = [], l;
        if (arr && (l = arr.length)) {
            for (var i = 0; i < l; i++) {
                var obj = fn.call(context, arr[i]);
                if (obj != null) {
                    ret[i] = obj;
                }
            }
        }
        return ret;
    };

    return file_node_from_cgi;
});/**
 * 声音文件
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.voice_node",["$","./file.file_node"],function (require, exports, module) {
    var $ = require('$'),

        FileNode = require('./file.file_node'),

        undef;


    /**
     * 构造函数
     * @param options
     *   {String} url       下载地址
     *   {Number} duration  时长（秒）
     * @constructor
     */
    var VoiceNode = function (options) {
        options.is_dir = false;
        FileNode.call(this, options);

        this._url = options.url;
        this._duration = options.duration;
    };

    VoiceNode.prototype = $.extend({}, FileNode.prototype, {

        _url: '',
        _duration: 0,
        class_name: 'VoiceNode',

        get_url: function () {
            return this._url;
        },

        get_duration: function () {
            return this._duration;
        }

    });

    VoiceNode.is_instance = function (obj) {
        return obj && obj instanceof VoiceNode;
    };

    return VoiceNode;
});/**
 * 文件列表模块
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file_list.file_list",["lib","common","i18n","$","./file.file_node","./file.utils.file_factory","./file.utils.all_file_map","./file.utils.file_node_from_cgi","main","./file_list.ui","./file_list.file_processor.remove.remove","./file_list.file_processor.move.move","./file_list.selection.selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        security = lib.get('./security'),
        text = lib.get('./text'),
        routers = lib.get('./routers'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        cgi_ret_report = common.get('./cgi_ret_report'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        global_event = common.get('./global.global_event'),
        disk_event = common.get('./global.global_event').namespace('disk'),
        global_function = common.get('./global.global_function'),
        global_variable = common.get('./global.global_variable'),
        ret_msgs = common.get('./ret_msgs'),
        m_speed = common.get('./m_speed'),
        FileNode = require('./file.file_node'),

        file_factory = require('./file.utils.file_factory'),
        all_file_map = require('./file.utils.all_file_map'),
        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),

    // 文件选取、拖拽模块
        selection,
    // 文件删除模块
        remove,
    // 文件移动模块
        move,

    // 空间信息
    // space_info, // james 2013-6-5 space_info 移到main模块下了
        space_info = require('main').get('./space_info.space_info'),

        long_long_ago = '2000-01-01 01:01:01',

        super_node,// 抽象根节点（root_node.parent_node）
        root_node, // 文件的根节点

        dir_QQ, // QQ 目录
        dir_QQ_recv, // QQ收到的文件目录

        curr_node, // 当前所在的目录节点
        last_node, // 上一次所在的目录节点 james 2013-6-5
        last_load_req, // 上一次请求的 request 实例

        first_loaded,

    // 请求可能出现的错误类型
//        error_status = {
//            error: '网络错误, 请稍后再试',
//            timeout: '连接服务器超时, 请稍后再试',
//            parsererror: '服务器出现错误, 请稍后再试'
//        },

    // “微信”目录
        weixin_node,

        GET_DIR_INFO_CGI = 'http://api.weiyun.com/get_home_list',//根据appid获取目录信息的cgi

        undefined;

    // 文件列表模块
    var file_list = new Module('disk_file_list', {

        ui: require('./file_list.ui'),

        render: function () {

            remove = require('./file_list.file_processor.remove.remove');
            move = require('./file_list.file_processor.move.move');
            selection = require('./file_list.selection.selection');

            this.add_sub_module(remove);
            this.add_sub_module(move);
            this.add_sub_module(selection);

            this
                // 文件已从服务器上删除后，同步本地缓存
                .listenTo(remove, 'has_removed', function (file_ids) {
                    var nodes = all_file_map.get_all(file_ids);
                    this.remove_nodes(nodes, true, true);
                })

                // 文件已从服务器上移动后，同步本地缓存
                .listenTo(move, 'has_moved', function (file_ids, par_id, dir_id) {
                    var file_nodes = all_file_map.get_all(file_ids);
                    this.move_nodes(file_nodes, dir_id);
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
                    restore_is_ok = global_variable.del('recycle_restored_is_ok'),
                    load_from_cache = !restore_ids || restore_ids.length == 0;  // 无还原文件需要高亮时，从内存中读取数据；否则从服务器更新

                // 强插
                me.trigger('external_insert_files', restore_ids, restore_msg, restore_is_ok);

                // 如果不是跳转打开目录，则重新加载
                if (routers.get_param('reload') !== '0') {
                    // 从内存中重新加载
                    me.reload(load_from_cache, false, false);  // true -> false 和erric确认过，返回网盘时保持网盘当前状态，不跳转到根目录。james
                }
                routers.unset('reload');
            });
        },

        /**
         * 根据hash path设置当前的访问路径
         */
        set_path: function (path, from_cache, reset_ui) {
            var o, node, map, async_load_appid,
                me = this,
                map_dirs = constants.VIRTUAL_DIRS;
            if(me.__rendered && me.__activated && (me._inited || me.init())){
                node = root_node;
                if($.isArray(path)){
                    $.each(path, function(index, name){
                        node = node && collections.first(node.get_kid_dirs(), function(child){
                            return child && child.get_route_hash() === name;
                        });
                        if(!node){
                            async_load_appid = map_dirs[name] && map_dirs[name].appid;
                            if(map_dirs[name] && map_dirs[name].children) {
                                map_dirs = map_dirs[name].children;
                            }
                            if(!async_load_appid) {
                                return false;
                            }
                        }
                    });
                }

                node = node || root_node;
                me._path = null;

                if(async_load_appid) {//使用appid异步获取节点
                    me.enter_spec_dir_by_appid(async_load_appid)
                        .done(function(enter_dir) {
                            me.load(enter_dir, from_cache, reset_ui);
                        })
                        .fail(function() {
                            me.load(node, from_cache, reset_ui);
                        });
                } else {
                    if(node)
                        me.load(node, from_cache, reset_ui);
                }
            }else{
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

        init: function () {
            var user = query_user.get_cached_user();

            // 没有root目录，就创建
            if (user && !root_node) {
                this._init_root(user);
                this._inited = true;
                return true;
            }
        },

        /**
         * 初始化根节点
         * @private
         */
        _init_root: function (user) {
            // 超级根节点
            super_node = file_factory.create('FileNode', {
                id: user.get_root_key(),
                is_super: true
            });

            // 根节点
            root_node = file_factory.create('FileNode', {
                id: user.get_main_key(),
                name: _('{#folder#}微云'),
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
        },

        // 填充虚拟目录的结构，以便hash router能在不加载根节点的情况下也能定位
        _fill_root_node: function (root_node) {
            var map = constants.VIRTUAL_DIRS,
                uin_perfix = query_user.get_uin_hex(),
                recursive = function (parent_node, map) {
                    var name, id_suffix, node_cfg, construct_cfg, node, types, i;
                    for (name in map) {
                        if (map.hasOwnProperty(name) && !map[name].async_load){//非异步加载的节点才构造
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
         * 读取指定目录下的文件列表
         * @param {FileNode|String} node 目标目录节点
         * @param {Boolean} [from_cache] 是否允许从cache中读取数据，默认false
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认true，reload的UI逻辑不一样）
         * @return {jQuery.Deferred}
         */
        load: function (node, from_cache, reset_ui) {
            if (typeof node === 'string') {
                node = all_file_map.get(node);
            }

            // 转发根目录
            if (node.get_id() === this.get_root_node().get_id()) {
                return this.load_root(from_cache, reset_ui);
            }
            // 转发虚拟目录
            else if (node.is_vir_dir()) {
                return this.load_vir_dir(node, 0, 400);
            }

            if (!node) {
                console.error('file_list.load()无效的目录节点:', node);
                return null;
            }

            var data = {
                pdir_key: node.get_pid(),
                dir_key: node.get_id(),
                dir_mtime: long_long_ago,
                only_dir: 0
            };

            var data_handler = function (body) {
                var dirs = file_node_from_cgi.dirs_from_cgi(body['dirs']),
                    files = file_node_from_cgi.files_from_cgi(body['files']);

                return [dirs, files];
            };

            return this._load_node(null, 'get_dir_list', data_handler, data, node, from_cache, reset_ui);
        },

        /**
         * 加载并初始化根目录
         * @param {Boolean} [from_cache] 是否允许从cache中读取数据，默认false
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认true，reload的UI逻辑不一样）
         */
        load_root: function (from_cache, reset_ui) {
            this.init();

            var data_handler = function (body) {
                var _vir_dirs = file_node_from_cgi.vir_dirs_from_cgi(body['virtual_dirs']),
                    _dirs = file_node_from_cgi.dirs_from_cgi(body['dirs']);

                var dirs = [].concat(_vir_dirs, _dirs),
                    files = file_node_from_cgi.files_from_cgi(body['files']);

                return [dirs, files]
            };

            var def = this._load_node('http://web.cgi.weiyun.com/weiyun_web_root_dir_list_cgi.fcg', 'root_dir_list', data_handler, null, this.get_root_node(), from_cache, reset_ui);

            if (def && !first_loaded) {
                try {
                    m_speed.start('disk', 'root_list_show');
                }
                catch (e) {
                }
            }

            return def;
        },

        /**
         * 读取普通目录中的文件列表
         * @param {String} url 默认 web.cgi.weiyun.com/wy_web_jsonp.fcg
         * @param {String} cmd 命令字
         * @param {Function} data_handler({Array} body)
         * @param {Object} data 请求参数
         * @param {FileNode} node 目标目录节点
         * @param {Boolean} [from_cache] 是否允许从cache中读取数据，默认false
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认false，reload的UI逻辑不一样）
         * @return {jQuery.Deferred}
         */
        _load_node: function (url, cmd, data_handler, data, node, from_cache, reset_ui) {
            reset_ui = reset_ui === true;
            from_cache = from_cache === true;

            var me = this,
                def = $.Deferred();

            // 上一次所在的节点
            last_node = curr_node;
            // 改变当前节点指向
            this.set_cur_node(node);

            me.trigger('before_load', node, last_node, reset_ui);
//            disk_event.trigger('file_list_before_load', node, last_node, reset_ui);

            // 已经加载过该目录的列表才有缓存可取，但如果这个目录被标记为脏目录了，就需要重新加载
            if (from_cache && node.get_kid_nodes() != null && !node.is_dirty()) {

                def.resolve(node);

                me.trigger('load', node, last_node, reset_ui);
                disk_event.trigger('file_list_load', node);

            } else {

                me.trigger('before_async_load');

                if (last_load_req) { // 销毁未完成的请求
                    last_load_req.destroy();
                }

                last_load_req = request.get({
                    url: url,
                    cmd: cmd,
                    body: data,
                    cavil: true,
                    resend: true
                })
                    .ok(function (msg, body) {

                        node.set_dirty(false);

                        var dirs_files = data_handler.call(body, body, node);

                        // 写入节点
                        node.set_nodes(dirs_files[0], dirs_files[1]);

                        def.resolve(node);

                        me.trigger('load', node, last_node, reset_ui);
                        disk_event.trigger('file_list_load', node);
                    })
                    .fail(function (msg, ret) {
                        me.trigger('error', msg, ret);

                        def.reject(msg, ret);
                    })
                    .done(function () {
                        me.trigger('after_async_load');

                        // 首次加载列表
                        if (!first_loaded) {
                            first_loaded = true;
                            me.trigger('first_load_done');
                        }

                        last_load_req = null;
                    });
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
                dir_mtime: long_long_ago,
                sort_type: 0, // 0表示按照修改时间排序
                list_type: 0, // 1=增量拉取，0=全量拉取
                offset: offset, // 起始下标
                number: size || 400 // 拉取文件个数
            };

            var me = this,
                def = $.Deferred();

            // 上一次所在的节点
            last_node = curr_node;

            me.trigger('before_load', node, last_node, offset === 0);
            me.trigger('before_async_load', node);

            // 改变当前节点指向
            this.set_cur_node(node);

            if (last_load_req) { // 销毁未完成的请求
                last_load_req.destroy();
            }

            last_load_req = request.get({
                url: 'http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg',
                cmd: 'get_virtual_dir_list',
                body: data,
                cavil: true,
                resend: true
            })
                .ok(function (msg, body) {

                    var files = file_node_from_cgi.from_cgi(body, node),
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
                    disk_event.trigger('file_list_load', node);
                })
                .fail(function (msg, ret) {
                    me.trigger('error', msg, ret);

                    def.reject(msg, ret);
                })
                .done(function () {
                    me.trigger('after_async_load');

                    // 首次加载列表
                    if (!first_loaded) {
                        first_loaded = true;
                        me.trigger('first_load_done');
                    }

                    last_load_req = null;
                });

            return def;
        },

        /**
         * 铺路
         * 传入构建一个目录路径所需的目录ID、目录名称数组，来进入这个目录。当目录不存在（未加载时）会自动创建，并标记父目录为脏。如果已在该目录下，则不刷新。
         * @param {Array<String>} dir_ids
         * @param {Array<String>} dir_names
         * @param {String} [parent_id] 父目录ID，为空表示根目录
         * @return {jQuery.Deferred} 返回jQuery.Deferred 对象
         */
        load_path: function (dir_ids, dir_names, parent_id) {
            var me = this,
                root_node = this.get_root_node();

            parent_id = parent_id || (root_node && root_node.get_id());

            if (!parent_id) {
                console.error('file_list.load_path() 无效的parent_id参数或根目录未初始化');
                return null;
            }

            // 未指定id路径时，回到根目录
            if (!dir_ids || dir_ids.length === 0) {
                return me.load_root(false, false);
            }

            var target_node = all_file_map.get(parent_id);
            if (!target_node) {
                console.error('file_list.load_path() 未找到id=' + parent_id + '的目录');
                return null;
            }

            // 如果已经在当前目录下了，则立刻回调
            if (dir_ids[dir_ids.length - 1] === me.get_cur_node().get_id()) {
                return me.load(curr_node, true, false);
                // return $.Deferred().resolve();
            }

            var last_kid;
            dir_names = dir_names || [];

            for (var i = 0, l = dir_ids.length; i < l; i++) {
                var dir_id = dir_ids[i],
                    dir_name = dir_names[i] || dir_id[i];

                last_kid = target_node.get_node(dir_id);

                if (!last_kid) {
                    last_kid = file_factory.create('FileNode', {
                        id: dir_id,
                        name: dir_name,
                        is_dir: true
                    });
                    target_node.append_node(last_kid);
                    target_node.set_dirty(true);
                }

                target_node = last_kid;
            }

            return me.load(last_kid, false, false);
        },

        /**
         * 重新读取
         * @param {Boolean} from_cache 是否允许从cache中读取数据，默认false
         * @param {Boolean} [reset_ui] 是否重置列表UI（默认true，reload的UI逻辑不一样）
         * @param {Boolean} [reload_root] 是否刷新至根目录（默认false）
         */
        reload: function (from_cache, reset_ui, reload_root) {
            var me = this;

            from_cache = from_cache === true;
            reload_root = reload_root === true;

            var node = this.get_cur_node();

            // 因为根目录的初始化需要从user属性中取一些目录key，所以这里在query_user的回调里初始化
            query_user
                .get(false, true)
                .ok(function () {

                    // 如果当前节点已存在，则加载其子节点
                    if (node && !reload_root) {

                        // 如果当前节点已脏，则从服务端更新
                        if (node.is_dirty()) {
                            from_cache = false;
                        }

                        // 根目录的加载逻辑有所不同
                        if (node.get_id() === me.get_root_node().get_id()) {
                            me.load_root(from_cache, reset_ui);
                        } else {
                            me.load(node, from_cache, reset_ui);
                        }
                    }
                    // 不存在，就初始化
                    else {
                        //me.load_root(from_cache, reset_ui);
                        me.set_path(me._path, from_cache, reset_ui);
                    }
                });
        },


        is_first_loaded: function () {
            return first_loaded;
        },

        /**
         * 在前方插入一个子节点
         * @param {FileNode} node
         * @param {Boolean} cover 是否覆盖重名文件
         * @param {String} target_dir_id 目标目录ID（如果是当前目录，会触发UI事件）
         */
        prepend_node: function (node, cover, target_dir_id) {
            var index = node.is_dir() ? this.get_prepend_dir_index() : 0;
            if (index >= 0) {
                this._add_node(node, cover, target_dir_id, 'add_node', [index]);
            } else {
                this._add_node(node, cover, target_dir_id, 'prepend_node');
            }
        },

        /**
         * 在后方追加一个子节点
         * @param {FileNode} node
         * @param {Boolean} cover 是否覆盖重名文件
         * @param {String} target_dir_id 目标目录ID（如果是当前目录，会触发UI事件）
         */
        append_node: function (node, cover, target_dir_id) {
            this._add_node(node, cover, target_dir_id, 'append_node');
        },

        /**
         * 在指定位置插入一个子节点，可以是任意位置...
         */
        add_node: function (node, cover, target_dir_id, index) {
            this._add_node(node, cover, target_dir_id, 'add_node', [index]);
        },

        /**
         * 添加文件
         * @param {FileNode} node
         * @param {Boolean} cover 是否覆盖重名文件
         * @param {String} [target_dir_id] 目标目录ID，为空表示当前目录（如果是当前目录，会触发UI事件）
         * @param {String} method 追加方式(append_node | prepend_node | add_node)
         * @param {Array} method_argus (optional) 对应method的额外参数，例如method为add_node，除node参数外，还可传递index
         * @private
         */
        _add_node: function (node, cover, target_dir_id, method, method_argus) {
            if (!target_dir_id) {
                if (curr_node) {
                    target_dir_id = curr_node.get_id();
                } else {
                    target_dir_id = root_node.get_id();
                }
            }

            var cur_node = this.get_cur_node(),
                target_node = all_file_map.get(target_dir_id);

            if (target_node) {

                // 覆盖重名
                if (cover) {
                    var cover_node = this._get_node_by_name(target_node, node.get_name(), node.is_dir());
                    if (cover_node) {
                        this.remove_nodes([cover_node], false, false);
                    }
                }

                // 插入目标节点并标记为脏
                target_node[method].apply(target_node, [node].concat(method_argus));
                target_node.set_dirty(true);

                // 如果是当前目录，会触发UI事件
                if (cur_node && cur_node.get_id() === target_node.get_id()) {

                    var dirs = [], files = [];
                    (node.is_dir() ? dirs : files)[0] = node;

                    //this.trigger(method, dirs, files); // ----> trigger('append_node') or trigger('prepend_node')
                    this.trigger.apply(this, [method, dirs, files].concat(method_argus));
                    // global_event.trigger('disk_file_list_add_nodes', [].concat(dirs, files));
                }
            }
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
         * 进入『QQ收到的文件』目录的对外接口
         * @param {Boolean} refresh 是否刷新该目录
         * @param {Function} callback ({FileNode} dir_QQ, {FileNode} dir_QQ_receive)
         */
        enter_qq_receive: function (refresh, callback) {
            callback = callback || $.noop;

            var me = this,
                load_from_cache = !refresh,
                load_then_callback = function () {
                    var def = me.load(dir_QQ_recv, load_from_cache, false); // false->刷新列表时不重置UI
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
                if (load_from_cache && dir_QQ_recv && dir_QQ_recv.get_id() === this.get_cur_node().get_id()) {
                    callback(dir_QQ, dir_QQ_recv);
                }
                // 如果已经存在但不在该目录下，则进入并回调
                else if (dir_QQ && dir_QQ.is_on_tree() && dir_QQ_recv && dir_QQ_recv.is_on_tree()) {
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
                ok_callback = function (dir_QQ, dir_QQ_recive) {
                    $.each(fn._ok_callbacks, function (i, cb) {
                        cb.call(me, dir_QQ, dir_QQ_recive);
                    });
                    delete fn._ok_callbacks;
                },
                cgi_report = function (ret) {
                    clearTimeout(timer);

                    // 上报返回码
                    cgi_ret_report.report(cgi, '', ret);
                },

                cgi = 'http://api.weiyun.com/get_home_list',

                timer = setTimeout(function () { // 5 秒超时
                    fn._loading = false;
                    if (req) {
                        req.abort();
                        me.trigger('error', ret_msgs.get(ret_msgs.TIMEOUT_CODE), ret_msgs.TIMEOUT_CODE);
                        cgi_report(ret_msgs.TIMEOUT_CODE);
                    }
                }, 5000);

            var req = $.ajax({
                url: urls.make_url(cgi, {
                    appid: 30207,
                    token: security.getAntiCSRFToken(),
                    real_source: 30207,
                    auto_create: 1,
                    req_type: 'JSONP'
                }),
                dataType: 'jsonp',
                just_plain_url: true
            })
                .done(function (json) {
                    fn._loading = false;

                    var data = json.data,
                        ret = json.ret;

                    if (!json.data || ret !== 0) {
                        console.error('获取「QQ收到的文件」目录失败:', ret);
                        var msg = ret_msgs.get(ret);
                        me.trigger('error', msg, ret);
                    }
                    else {
                        var
                        // 「QQ」目录
                            qq_dir_key = data['parent_dir_key'],
                            qq_dir_name = data['pdir_name'],
                        // 「QQ收到的文件」目录key
                            qq_recv_dir_key = data['dir_key'],
                            qq_recv_dir_name = data['dir_name'] || 'QQ收到的文件';

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
                        dir_QQ_recv = all_file_map.get(qq_recv_dir_key);
                        if (!dir_QQ_recv) {
                            dir_QQ_recv = file_factory.create('FileNode', {
                                is_dir: true,
                                id: qq_recv_dir_key,
                                name: qq_recv_dir_name || _('QQ收到的文件'),
                                create_time: long_long_ago,
                                modify_time: long_long_ago
                            });
                            dir_QQ.append_node(dir_QQ_recv);
                        }


                        // james 2013-5-16 因为CGI没有返回"QQ"目录和"QQ收到的文件"目录的修改时间，这里设置该目录为脏，进入目录时会刷新
                        dir_QQ_recv.set_dirty(true); // 需要从CGI拉取“QQ收到的文件”目录的文件
                        dir_QQ.set_dirty(true);      // 需要从CGI拉取“QQ”目录的文件 ->“QQ收到的文件”
                        me.get_root_node().set_dirty(true); // 需要从CGI拉取根目录下的“QQ”目录

                        ok_callback(dir_QQ, dir_QQ_recv);
                    }

                    cgi_report(ret);
                });
        },

        /**
         * 根据appid，获取对应目录的信息
         * @param {Number} appid
         * @private
         */
        _async_get_dir_info: function(appid) {

            var me = this,
                def = $.Deferred(),
                req,
                timer;

            timer = setTimeout(function () { // 5 秒超时
                if (req) {
                    req.abort();
                    me.trigger('error', ret_msgs.get(ret_msgs.TIMEOUT_CODE), ret_msgs.TIMEOUT_CODE);
                    // 上报返回码
                    cgi_ret_report.report(GET_DIR_INFO_CGI, '', ret_msgs.TIMEOUT_CODE);
                    clearTimeout(timer);
                    def.reject();
                }
            }, 5000);


            req = $.ajax({
                url: urls.make_url(GET_DIR_INFO_CGI, {
                    appid: appid,
                    token: security.getAntiCSRFToken(),
                    real_source: 10006,
                    auto_create: 1,
                    req_type: 'JSONP'
                }),
                dataType: 'jsonp',
                just_plain_url: true
            })
                .done(function(json) {

                    var data = json.data,
                        ret = json.ret,
                        msg;

                    if (!json.data || ret !== 0) {
                        console.error('获取(appid为：'+appid+')对应目录失败:', ret);
                        msg = ret_msgs.get(ret);
                        me.trigger('error', msg, ret);
                        def.reject();
                    } else {
                        def.resolve(data);//获取数据成功，执行回调
                    }

                    // 上报返回码
                    cgi_ret_report.report(GET_DIR_INFO_CGI, '', ret);
                    clearTimeout(timer);
                });

            return def;
        },
        /**
         * 根据获取的目录信息，进入指定目录
         * @param {Object} data 目录信息
         * @param {Function} callback({FileNode}enter_dir) 进入目录后的回调函数
         * @private
         */
        _enter_spec_dir : function(data, callback) {

            var dir_key = data['dir_key'],
                dir_name = data['dir_name'] || default_dir_name,
                pdir_key = data['parent_dir_key'],
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

            if(root_node.get_id() !== pdir_key) {//目前CGI返回的结果看，没有返回多层情况下的所有父目录的key，后续有需求要进入多层目录中的再改造
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
        enter_spec_dir_by_appid : function(appid) {

            var me = this,
                def = $.Deferred();

            if(!appid) {//没有对应的appid，则在根目录
                return;
            }


            me._async_get_dir_info(appid)
                .done(function(data) {
                    me._enter_spec_dir(data, function(node) {
                        def.resolve(node);//成功获取要进入的目录
                    });
                })
                .fail(function() {
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
        }

    });


    module.exports = file_list;
});/**
 * 文件移动（包括批量移动、拖拽移动）
 * @author jameszuo
 * @date 13-3-16
 */
define.pack("./file_list.file_processor.move.move",["lib","common","$","./file.utils.file_node_from_cgi","./tmpl","./file_list.file_processor.move.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        request = common.get('./request'),
        RequestTask = common.get('./request_task'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),

        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),

        tmpl = require('./tmpl'),

        long_long_ago = '1970-01-01 00:00:00',

        undefined;

    var move = new Module('disk_file_move', {

        ui: require('./file_list.file_processor.move.ui'),

        /**
         * 显示『移动到』目录选择对话框
         * @param {Array<FileNode>} files
         * @param {String} op op in ops
         */
        show_move_to: function (files, op) {
            this.trigger('show_move_to', files, op);
        },

        /**
         * 移动文件到指定目录中
         * @param {Array<FileNode>} files
         * @param {String} par_id 目标目录ID
         * @param {String} dir_id 目标父目录ID
         * @param {String} op op in ops
         */
        start_move: function (files, par_id, dir_id, op) {
            var me = this,
                mover = new Mover(files, par_id, dir_id, op);

            mover
                .on('start', function () {
                    me.trigger('start');
                })
                .on('step', function (cursor, length) {
                    me.trigger('step', cursor, length);
                })
                .on('has_ok', function (ok_ids) {
                    me.trigger('has_moved', ok_ids, par_id, dir_id);
                    global_event.trigger('disk_file_move_has_moved');
                })
                .on('all_ok', function (msg) {
                    me.trigger('all_moved', msg);
                    global_event.trigger('disk_file_move_all_moved');
                })
                .on('part_ok', function (msg) {
                    me.trigger('part_moved', msg);
                })
                .on('error', function (msg) {
                    me.trigger('error', msg);
                })
                .on('done', function () {
                    me.trigger('done');
                })
                .start();
        },

        /**
         * 获取指定目录的子目录
         * @param {String} node_par_id
         * @param {String} node_id
         */
        load_sub_dirs: function (node_par_id, node_id) {
            var me = this;

            me.trigger('before_load_sub_dirs', node_id);

            request.get({
                cmd: 'get_dir_list',
                cavil: true,
                resent: true,
                body: {
                    pdir_key: node_par_id,
                    dir_key: node_id,
                    dir_mtime: long_long_ago,
                    only_dir: 1
                }
            })
                .ok(function (msg, body) {

                    var dirs = file_node_from_cgi.dirs_from_cgi(body['dirs']);

                    me.trigger('load_sub_dirs', dirs, node_id);
                })
                .fail(function (msg, ret) {
                    me.trigger('load_sub_dirs_error', msg, ret);
                })
                .done(function () {
                    me.trigger('after_load_sub_dirs', node_id);
                });
        }

    });

    /**
     * 文件删除类
     * @param {Array<FileNode>} files
     * @param {String} target_par_id
     * @param {String} target_dir_id
     * @param {String} op
     * @constructor
     * @extends RequestTask
     */
    var Mover = function (files, target_par_id, target_dir_id, op) {

        var proc_options = {
            step_size: query_user.get_cached_user().get_files_move_step_size(),
            files: files,
            op: op,
            cmd_parser: function (frag_files) {
                var first = frag_files[0];
                return first.is_dir() ? 'batch_folder_move' : 'batch_file_move';
            },
            data_parser: function (frag_files) {
                var data = {},
                    encode = encodeURIComponent,
                    first = frag_files[0];

                if (first.is_dir()) {
                    data['move_folders'] = $.map(frag_files, function (file) {
                        return {
                            dir_key: file.get_id(),
                            src_pdir_key: file.get_parent().get_id(),
                            src_ppdir_key: file.get_parent().get_parent().get_id(),
                            dst_pdir_key: target_dir_id,
                            dst_ppdir_key: target_par_id,
                            folder_name: encode(file.get_name())
                        };
                    });
                } else {
                    data['move_files'] = $.map(frag_files, function (file) {
                        return {
                            file_id: file.get_id(),
                            src_pdir_key: file.get_parent().get_id(),
                            src_ppdir_key: file.get_parent().get_parent().get_id(),
                            dst_pdir_key: target_dir_id,
                            dst_ppdir_key: target_par_id,
                            file_attr: {
                                file_name: encode(file.get_name())
                            },
                            src_file_name: encode(file.get_name())
                        };
                    });
                }
                return data;
            }
        };

        RequestTask.call(this, proc_options);
    };

    $.extend(Mover.prototype, RequestTask.prototype);

    return move;
});/**
 *
 * @author jameszuo
 * @date 13-3-16
 */
define.pack("./file_list.file_processor.move.ui",["lib","common","i18n","$","./tmpl","./file_list.file_processor.move.move","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),

        file_list,

        tmpl = require('./tmpl'),

    // move 模块
        move,

        MSG_ALREADY_IN = _('文件已经在该文件夹下了'),
        MSG_NO_DEEP = _('不能将文件移动到自身或其子文件夹下'),

        undefined;

    var ui = new Module('disk_file_move_ui', {

        render: function () {

            move = require('./file_list.file_processor.move.move');

            file_list = require('./file_list.file_list');

            this
                .listenTo(move, 'step', function (cursor, length) {
                    progress.show(_('正在移动第{0}/{1}个文件', cursor, length));
                })
                .listenTo(move, 'done', function () {
                    progress.hide();
                })
                .listenTo(move, 'all_moved', function () {
                    mini_tip.ok(_('文件移动成功'));
                })
                .listenTo(move, 'error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(move, 'part_moved', function (msg) {
                    mini_tip.warn(_('部分文件移动失败：') + msg);
                })
                .listenTo(move, 'show_move_to', function (files, op) {
                    var box = new FileMoveBox(files, op);
                    box.show();

                    // 有移动成功的文件，则隐藏对话框
                    box
                        .listenTo(move, 'start', function () {
                            box.close();
                        });
                })

                .listenTo(move, 'show_view', function () {
                    this.show();
                });

        }
    });

    /**
     * 文件移动对话框
     * @param {Array<FileNode>} files
     * @param {String} op in ops
     * @constructor
     */
    var FileMoveBox = function (files, op) {

        var me = this;

        me._files = files;
        me._chosen_id = me._chosen_par_id = null;

        var root_dir = file_list.get_root_node(),
            root_id = root_dir.get_id(),
            root_par_id = root_dir.get_parent().get_id();

        me._$el = $(tmpl.file_move_box({
            files: files,
            root_dir: root_dir
        }));

        me._dialog = new widgets.Dialog({
            klass: 'file-mv-box',
            title: _('选择{0}个文件的存储位置', files.length),
            destroy_on_hide: true,
            content: me._$el,
            buttons: [ 'OK', 'CANCEL' ],
            handlers: {
                OK: function () {
                    if (me._chosen_id) {
                        move.start_move(me._files, me._chosen_par_id, me._chosen_id, op);
                    }
                }
            }
        });

        me._dialog
            .on('render', function () {

                this.get_$body()

                    // 点击目录名选中并展开
                    .on('click', 'li[data-file-id]', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var $dir = $(e.target).closest('[data-file-id]'),
                            par_id = $dir.attr('data-file-pid'),
                            dir_id = $dir.attr('data-file-id');

                        me.toggle_expand($dir);
                        me.set_chosen(par_id, dir_id);
                    });

                // 显示对话框时，监听拉取子目录列表事件
                me
                    .listenTo(move, 'load_sub_dirs', function (dir_nodes, par_id) {
                        this.render_$dirs_dom(dir_nodes, par_id);
                    })
                    .listenTo(move, 'load_sub_dirs_error', function (msg) {
                        this._dialog.error_msg(msg);
                    })
                    .listenTo(move, 'before_load_sub_dirs', function (dir_id) {
                        this.mark_loading(dir_id, true);
                    })
                    .listenTo(move, 'after_load_sub_dirs', function (dir_id) {
                        this.mark_loading(dir_id, false);
                    });
            })
            .on('show', function () {
                // 读取一级目录
                me.expand_load(root_par_id, root_id);
            })

            // 隐藏对话框时销毁一些东西
            .on('hide', function () {

                me._$el.remove();
                me._files = this._chosen_id = this._chosen_par_id = this._$el = null;

                // 关闭对话框时，监听拉取子目录列表事件
                me.off().stopListening();
            });

        // 选择目录前的判断
        me.on('chosen', function (par_id, dir_id) {
            var cur_node = file_list.get_cur_node(),
                cur_dir_id = cur_node ? cur_node.get_id() : undefined,
                err;

            // 如果点的目录是文件所在目录，则提示
            if (dir_id == cur_dir_id) {
                err = MSG_ALREADY_IN;
            }
            // 如果点的目录是文件所在目录或其子目录，则提示
            else {
                var
                // 选中的节点DOM
                    $node = this.get_$node(dir_id),
                // 要移动到的目录ID路径
                    chosen_pids = collections.array_to_set($node.parentsUntil(me._$el, '[data-file-id]').andSelf(), function (it) {
                        return it.getAttribute('data-file-id');
                    }),
                // 如果文件列表中选中的文件和要移动到的目录ID路径有交集，即表示将移动文件到自身或自身子目录下面，这是不允许的操作
                    joined = collections.any(me._files, function (file) {
                        return file.get_id() in chosen_pids;
                    });
                if (joined) {
                    err = MSG_NO_DEEP;
                }
            }
            if (err) {
                me._dialog.error_msg(err);
            } else {
                me._dialog.hide_msg();
            }
            // 设置确定按钮是否可用
            me._dialog.set_button_enable('OK', !err);
        });
    };

    FileMoveBox.prototype = $.extend({

        show: function () {
            this._dialog.show();
            this.trigger('show');
        },

        close: function () {
            if (this._dialog) {
                this._dialog.hide();
            }
            this.off().stopListening();
        },

        /**
         * 渲染子目录DOM
         * @param {Array<File>} dirs
         * @param {String} dir_par_id
         */
        render_$dirs_dom: function (dirs, dir_par_id) {
            var $dir = this.get_$node(dir_par_id);
            if ($dir[0]) {

                // 箭头。
                var $arrow = $dir.children('a');
                if (dirs.length > 0) {

                    // 标记节点为已读取过
                    $dir.attr('data-loaded', 'true');

                    // 插入DOM
                    var $dirs_dom = $(tmpl.file_move_box_node_list({
                        files: dirs,
                        par_id: dir_par_id
                    }));

                    // 箭头
                    $arrow.addClass('expand');
                    // 展开
                    $dirs_dom.hide().appendTo($dir).slideDown('fast');
                }
                // 没有子节点就
                else {
                    // 隐藏箭头（如果移除箭头会导致滚动条抖一下）
                    $arrow.children('._expander').css('visibility', 'hidden');
                }
            }
        },

        /**
         * 展开节点
         * @param {String} par_id
         * @param {String} dir_id
         */
        expand_load: function (par_id, dir_id) {
            move.load_sub_dirs(par_id, dir_id);
        },

        /**
         * 展开、收起文件夹
         * @param {jQuery|HTMLElement} $dir
         */
        toggle_expand: function ($dir) {
            $dir = $($dir);

            var par_id = $dir.attr('data-file-pid'),
                dir_id = $dir.attr('data-file-id'),

                $ul = $dir.children('ul'),
                loaded = 'true' === $dir.attr('data-loaded');

            // 已加载过
            if (loaded) {
                var $arrow = $dir.children('a'),
                    expanded = $arrow.is('.expand');

                if (expanded) {
                    $ul.stop(false, true).slideUp('fast', function () {
                        $arrow.removeClass('expand');
                    });
                } else {
                    $ul.stop(false, true).slideDown('fast');
                    $arrow.addClass('expand');
                }
            }
            else {
                // 有 UL 节点表示已加载
                this.expand_load(par_id, dir_id);
            }
        },

        /**
         * 设置指定节点ID为已选中的节点
         * @param {String} par_id
         * @param {String} dir_id
         */
        set_chosen: function (par_id, dir_id) {
            if (this._chosen_id === dir_id && this._chosen_par_id === par_id) {
                return;
            }

            // 清除现有的选择
            if (this._chosen_id) {
                this.get_$node(this._chosen_id).children('a').removeClass('selected');
            }

            this._chosen_id = dir_id;
            this._chosen_par_id = par_id;
            this.get_$node(dir_id).children('a').addClass('selected');

            this.trigger('chosen', par_id, dir_id);
        },

        get_$node: function (dir_id) {
            return $('#_file_move_box_node_' + dir_id);
        },

        mark_loading: function (dir_id, loading) {
            this.get_$node(dir_id).children('a').toggleClass('loading', !!loading);
        }

    }, events);

    return ui;
});/**
 * (批量)删除文件\目录
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_list.file_processor.remove.remove",["lib","common","$","./file.utils.all_file_map","./file_list.file_processor.remove.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        ret_msgs = common.get('./ret_msgs'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),
        RequestTask = common.get('./request_task'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        all_file_map = require('./file.utils.all_file_map'),

        undefined;

    var remove = new Module('disk_file_remove', {

        ui: require('./file_list.file_processor.remove.ui'),

        /**
         * 删除文件前的确认框
         * @param {FileNode|Array<FileNode>} files
         * @param {String} op
         * @param {Boolean} [white_mask] 是否使用白色背景，默认false
         */
        remove_confirm: function (files, op, white_mask) {
            var me = this;

            var remover = new Remover(files, op);

            this.trigger('remove_confirm', files, remover, function () {
                me._start_remove(remover, white_mask);
            }, function () {
                remover.destroy();
            });

            return remover;
        },

        /**
         * 直接开始删除文件（不弹框确认）
         * @param {FileNode|Array<FileNode>} files
         * @param {String} op
         * @param {Boolean} [white_mask] 是否使用白色背景，默认false
         */
        start_remove: function (files, op, white_mask) {
            var remover = new Remover(files, op);

            this._start_remove(remover, white_mask);

            return remover;
        },

        /**
         * 静默删除
         * @param {FileNode} target_dir
         * @param {String} file_id
         * @param {String} file_name
         */
        silent_remove: function (target_dir, file_id, file_name) {
            if (target_dir) {
                var target_par = target_dir.get_parent();
                if (target_par) {
                    var file_data = {
                        ppdir_key: target_par.get_id(),
                        pdir_key: target_dir.get_id(),
                        file_id: file_id,
                        file_ver: '',
                        file_name: encodeURIComponent(file_name)
                    };

                    request.get({
                        cmd: 'batch_file_delete',
                        body: {
                            del_files: [file_data]
                        }
                    });

                    this.trigger('has_removed', [file_id]);
                }
            }
        },

        /**
         * 开始删除
         * @param {Remover} remover
         * @param {Boolean} [white_mask] 是否使用白色背景，默认false
         */
        _start_remove: function (remover, white_mask) {

            var me = this;

            remover
                .on('has_ok', function (removed_file_ids) {
                    me.trigger('has_removed', removed_file_ids);
                    global_event.trigger('disk_file_remove_has_removed');
                })
                .on('all_ok', function (msg) {
                    me.trigger('all_removed', msg);
                    global_event.trigger('disk_file_remove_all_removed');
                })
                .on('part_ok', function (msg) {
                    me.trigger('part_removed', msg);
                })
                .on('step', function (cursor, len) {
                    me.trigger('step', cursor, len, white_mask);
                })
                .on('done', function () {
                    me.trigger('done');
                })
                .on('error', function (msg) {
                    me.trigger('error', msg);
                })
                .start();
        }
    });

    /**
     * 文件删除类
     * @param  {Array<FileNode>} files
     * @param  {String} op
     * @constructor
     * @extends RequestTask
     */
    var Remover = function (files, op) {

        var proc_options = {
            step_size: query_user.get_cached_user().get_files_remove_step_size(),
            files: files,
            op: op,
            ok_rets: [0, 1019, 1020], // 文件不存在时就认为删除成功
            cmd_parser: function (frag_files) {
                var first = frag_files[0];
                return first.is_dir() ? 'batch_folder_delete' : 'batch_file_delete';
            },
            data_parser: function (frag_files) {
                var data = {},
                    encode = encodeURIComponent,
                    first = frag_files[0];
                // fix bug 48711149 by zhangzhang, at 2013/05/16.
                // 文件上传完成后会刷新文件列表，所以这里的实例可能已经过期了，无法取得正确的父目录等，需要更新实例
				var availableFiles = [];
				$.each(frag_files, function(index, file){
					file = all_file_map.get(file.get_id());
					if(file){
						availableFiles.push(file);
					}
				});
                if (first.is_dir()) {
                    data['del_folders'] = $.map(availableFiles, function (file) {
                        return {
                            ppdir_key: file.get_parent().get_pid(),
                            pdir_key: file.get_pid(),
                            dir_key: file.get_id(),
                            flag: 1,
                            dir_name: encode(file.get_name())
                        };
                    });
                } else {
                    data['del_files'] = $.map(availableFiles, function (file) {
                        return {
                            ppdir_key: file.get_parent().get_pid(),
                            pdir_key: file.get_pid(),
                            file_id: file.get_id(),
                            file_ver: file.get_file_ver() || '',
                            file_name: encode(file.get_name())
                        };
                    });
                }
                return data;
            }
        };

        RequestTask.call(this, proc_options);
    };

    $.extend(Remover.prototype, RequestTask.prototype);

    return remove;
});/**
 * (批量)删除文件\目录
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_list.file_processor.remove.ui",["lib","common","i18n","$","./file_list.file_processor.remove.remove"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),

        undefined;

    var ui = new Module('disk_file_remove_ui', {

        render: function () {

            var remove = require('./file_list.file_processor.remove.remove');

            var me = this;
            
            me
                .listenTo(remove, 'remove_confirm', function (files, remover, on_yes, on_no) {
                    var
                        is_plural = files.length > 1,

                    // 文件、文件夹
                        is_file = collections.any(files, function (f) {
                            return !f.is_dir();
                        });
                    var wording = is_file ? 
                        (is_plural ? _('这些文件') : _('这个文件')) :
                        (is_plural ? _('这些文件夹') : _('这个文件夹'));
                    var ext_wording = /*is_plural ? */
                        (is_file ? _('{#delete_targets#}{0}  等{1}个文件') : _('{#delete_targets#}{0}  等{1}个文件夹'));/* :
                        '';*/
                    var filename = text.smart_sub(files[0].get_name(), 10);
                    widgets.confirm(
                        _('删除文件'),
                        'Are you sure you want to delete '+(files.length>1?files.length:'this')+' item'+(files.length>1?'s':'')+'?',
//                        _('确定删除{0}吗？', _(ext_wording, filename, files.length)/*wording*/),
                        undefined, //_(ext_wording, filename, files.length),
                        function () {

                            on_yes(remover);
                        },
                        function () {
                            on_no(remover);
                        }
                    );
                })

                .listenTo(remove, 'all_removed', function () {
                    mini_tip.ok(_('删除成功'));
                })

                .listenTo(remove, 'part_removed', function (msg) {
                    mini_tip.warn(_('部分文件删除失败：{0}', msg));
                })

                .listenTo(remove, 'step', function (cursor, length, white_mask) {
                    var is_plural = length > 1;
                    var wording = is_plural ? _('正在删除第{0}/{1}个文件') : _('正在删除&nbsp;&nbsp;');
                    progress.show(_(wording, cursor, length), false, white_mask);
                })
                .listenTo(remove, 'done', function () {
                    progress.hide();
                })
                .listenTo(remove, 'error', function (msg) {
                    mini_tip.warn(_('文件删除失败：') + msg);
                })
        }
    });

    return ui;
});/**
 * 删除虚拟文件
 * @author jameszuo
 * @date 13-7-4
 */
define.pack("./file_list.file_processor.vir_remove.vir_remove",["lib","common","$","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        _ = require('i18n'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),

        undef;


    var vir_remove = new Module('disk_file_list_vir_remove', {

        remove_confirm: function (node, thing, desc, op) {
            var me = this,
                files = [node],
                is_plural = files.length > 1,

                msg = is_plural ? _('确定删除这些{0}吗？', thing) : _('确定删除这个{0}吗？', thing);

                def = $.Deferred();

            widgets.confirm(_('删除文件'), msg, desc, function () {
                me.remove(node, op, def);
            }, function () {
                def.reject()
            });

            return def;
        },

        remove: function (node, op, def) {
            def = def || $.Deferred();

            var data = {
                ppdir_key: node.get_parent().get_pid(),
                pdir_key: node.get_pid(),
                files: [
                    {
                        file_id: node.get_id(),
                        file_name: node.get_name() || ''
                    }
                ]
            };

            request.get({
                url: 'http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg',
                cmd: 'delete_virtual_file',
                body: data,
                cavil: true,
                resend: true
            })
                .ok(function (msg, body) {

                    node.remove();

                    def.resolve();
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });

            if (op) {
                user_log(op);
            }

            return def;
        }

    });

    return vir_remove;
});/**
 * 文件菜单UI逻辑(包括文件的"更多"菜单和右键菜单)
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_list.menu.menu",["lib","common","i18n","$","./file_list.file_list","./file_list.ui_normal","./file_list.menu.menu","./file_list.selection.selection","./file_list.share.share","./file_list.rename.rename","./file_list.file_processor.remove.remove","./file_list.file_processor.move.move"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        ContextMenu = common.get('./ui.context_menu'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        log_event = common.get('./global.global_event').namespace('log'),

        click_tj = common.get('./configs.click_tj'),
        mini_tip = common.get('./ui.mini_tip'),


        selection,
        share,

        file_list,
        file_list_ui_normal,

        is_hover, // true 表示是‘更多菜单’，false 表示是右键菜单

        item_maps = {

            // 默认菜单
            contextmenu: {
                single_download: 1,
                package_download: 1,
                share: 1,
                mail_share: 1,
                link_share: 1,
                move: 1,
                rename: 1,
                remove: 1
            },

            // 更多菜单
            more: {
                share: 1,
                mail_share: 1,
                link_share: 1,
                move: 1,
                rename: 1,
                remove: 1
            },

            // 分享子菜单
            share: {
                mail_share: 1,
                link_share: 1
            }
        },

        hover_on_file_id, // hover菜单对应的文件ID

        undefined;

    var menu = new Module('disk_file_menu', {

        render: function () {

            var me = this;

            file_list = require('./file_list.file_list');
            file_list_ui_normal = require('./file_list.ui_normal');
            menu = require('./file_list.menu.menu');

            selection = require('./file_list.selection.selection');
            share = require('./file_list.share.share');

            me.context_menu = me._create_context_menu();
            me.share_menu = me._create_share_menu();

            $.each([me.context_menu, me.share_menu], function (i, menu) {
                menu
                    .on('before_render', function ($on) {
                        var file = file_list_ui_normal.get_file_by_$el($on);
                        hover_on_file_id = file ? file.get_id() : null;
                    })
                    .on('hide', function () {
                        hover_on_file_id = null;
                    });
            });

            me
                .listenTo(me.context_menu, 'show show_on', function () {
                    log_event.trigger('contextmenu_toggle', true);
                })
                .listenTo(me.context_menu, 'hide', function () {
                    log_event.trigger('contextmenu_toggle', false);
                });

            me.get_downloader();
        },

        _downloader: null,
        get_downloader: function () {
            var me = this;
            if (!me._downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    me._downloader = mod;
                });
            }
            return me._downloader;
        },

        /**
         * 显示"文件的"更多"菜单
         * @param {jQuery|HTMLElement} el
         */
        show_more_menu: function (el) {

            is_hover = true;

            var file = file_list_ui_normal.get_file_by_$el($(el)),
            // 菜单 id map
                item_id_map = this._get_item_id_map([file], item_maps.more);

            if (!$.isEmptyObject(item_id_map)) {
                this.context_menu.show_on(el, file_list_ui_normal.get_$list_parent(), item_id_map, 70, -19, 18);
            }
            else {
                this.context_menu.hide();
            }
            // this.share_menu.hide();
        },

        /**
         * 显示分享菜单
         * @param {jQuery|HTMLElement} el
         */
        show_share_menu: function (el) {

            is_hover = true;

            var file = file_list_ui_normal.get_file_by_$el($(el)),
            // 菜单 id map
                item_id_map = this._get_item_id_map([file], item_maps.share);

            if (!$.isEmptyObject(item_id_map)) {
                this.share_menu.show_on(el, file_list_ui_normal.get_$list_parent(), item_id_map, 20, 0, 25, false);
            }
            else {
                this.share_menu.hide();
            }
            this.context_menu.hide();
        },

        /**
         * 隐藏分享菜单
         */
        hide_share_menu: function () {
            this.share_menu.hide();
        },

        get_context_menu: function () {
            return this.context_menu;
        },

        get_share_menu: function () {
            return this.share_menu;
        },

        /**
         * 显示右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        show_context_menu: function (x, y, $on) {

            is_hover = false;

            var files = file_list.get_selected_files(),
            // 菜单 id map
                item_id_map = this._get_item_id_map(files, item_maps.contextmenu);

            // 显示菜单
            if (!$.isEmptyObject(item_id_map)) {
                this.context_menu.show(x, y, item_id_map, $on);
            }
            else {
                this.context_menu.hide();
            }
            this.share_menu.hide();
        },

        hide_all: function () {
            var share_menu = this.get_share_menu();
            if (share_menu) {
                share_menu.hide();
            }
            var context_menu = this.get_context_menu();
            if (context_menu) {
                context_menu.hide();
            }
        },

        _create_context_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                items: [
                    me.create_item('single_download'),
                    me.create_item('package_download'),
                    me.create_item('move'),
                    me.create_item('remove'),
                    me.create_item('rename'),
                    me.create_item('share')
                ]
            });

            return menu;
        },

        _create_share_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    me.create_item('link_share'),
                    me.create_item('mail_share')
                ],
                hide_on_click: false
            });

            return menu;
        },

        create_item: function (id) {
            var me = this;

            switch (id) {

                case 'share':
                    return {
                        id: id,
                        text: _('分享'),
                        icon_class: 'ico-share',
                        group: 'share',
                        items: [
                            this.create_item('link_share'),
                            this.create_item('mail_share')
                        ]
                    };

                case 'mail_share':
                    return {
                        id: id,
                        text: _('邮件分享'),
                        group: 'share',
                        after_render: function ($item) {
                            var file = me._get_target_files(true)[0];
                            if (file) {
                                // 判断是否允许分享
                                var err = share.is_sharable(file);
                                if (!err) {
                                    var share_url = share.get_mail_url(file);
                                    $item.children('a').attr('href', share_url).attr('target', '_blank');
                                }
                            }
                        },
                        click: function () {
                            var file = me._get_target_files(true)[0];
                            if (file) {
                                var err = share.is_sharable(file);
                                if (err) {
                                    mini_tip.warn(err);
                                }
                            }
                            user_log(is_hover ? 'MORE_MENU_MAIL_SHARE' : 'RIGHTKEY_MENU_MAIL_SHARE');
                        }
                    };

                case 'link_share':
                    return {
                        id: id,
                        text: _('链接分享'),
                        group: 'share',
                        click: function () {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                var err = share.is_link_sharable(files);
                                if (!err) {
                                    share.link_share(files);
                                } else {
                                    mini_tip.warn(err);
                                }
                            }
                            user_log(is_hover ? 'MORE_MENU_LINK_SHARE' : 'RIGHTKEY_MENU_LINK_SHARE');
                        }
                    };

                case 'rename':
                    return {
                        id: id,
                        text: _('重命名'),
                        icon_class: 'ico-rename',
                        group: 'edit',
                        click: function () {
                            var file = me._get_target_files(false)[0];
                            if (file) {
                                var rename = require('./file_list.rename.rename');
                                rename.start_edit(file);
                            }
                            user_log(is_hover ? 'MORE_MENU_RENAME' : 'RIGHTKEY_MENU_RENAME');
                        }
                    };

                case 'remove':
                    return {
                        id: id,
                        text: _('删除'),
                        icon_class: 'ico-del',
                        group: 'edit',
                        click: function () {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                var remove = require('./file_list.file_processor.remove.remove');
                                remove.remove_confirm(files, '', true);
                                user_log('RIGHTKEY_MENU_DELETE');
                            }
                            user_log(is_hover ? 'MORE_MENU_DELETE' : 'RIGHTKEY_MENU_DELETE');
                        }
                    };

                case 'move':
                    return {
                        id: id,
                        text: _('移动'),
                        icon_class: 'ico-move',
                        group: 'edit',
                        click: function () {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                var move = require('./file_list.file_processor.move.move');
                                if (move) {
                                    move.show_move_to(files);
                                }
                            }
                            !is_hover && user_log('RIGHTKEY_MENU_MOVE');
                        }
                    };

                case 'package_download':
                    return {
                        id: id,
                        text: _('下载'),
                        icon_class: 'ico-download',
                        group: 'download',
                        click: function (e) {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                if (me.get_downloader()) {
                                    me.get_downloader().down(files, e);
                                }
                            }
                            !is_hover && user_log('RIGHTKEY_MENU_DOWNLOAD');
                        }
                    };

                case 'single_download':
                    return {
                        id: id,
                        text: _('下载'),
                        icon_class: 'ico-download',
                        group: 'download',
                        click: function (e) {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                if (me.get_downloader()) {
                                    me.get_downloader().down(files, e);
                                }
                            }
                            !is_hover && user_log('RIGHTKEY_MENU_DOWNLOAD');
                        }
                    };
            }
        },

        /**
         * 获取可显示的菜单选项
         * @param {Array<FileNode>} files
         * @param {Object} usable_items
         * @return {Object} 可用的菜单 ID map
         */
        _get_item_id_map: function (files, usable_items) {
            if (!files || !files.length) {
                return null;
            }

            usable_items = $.extend({}, usable_items);

            var
            // 包含破损文件
                has_broken = false,
            // 有不允许删除的文件
                has_no_del = false,
            // 有不允许移动的文件
                has_no_move = false,
            // 包含不允许重命名的文件
                has_no_rename = false,
            // 包含不允许下载的文件
                has_no_down = false,
            // 多个文件、目录
                multi = files.length > 1,
            // 有目录
                has_dir = false,
            // 只有一个『文件』
                only_1_file = !multi && !files[0].is_dir();

            $.each(files, function (i, file) {
                if (file.is_broken_file()) {
                    has_broken = true;
                }
                if (!file.is_removable()) {
                    has_no_del = true;
                }
                if (!file.is_movable()) {
                    has_no_move = true;
                }
                if (!file.is_renamable()) {
                    has_no_rename = true;
                }
                if (!file.is_downable()) {
                    has_no_down = true;
                }
                if (file.is_dir()) {
                    has_dir = true;
                }
            });

            // 破损文件只能删除
            if (has_broken) {
                usable_items = {remove: 1};
            }

            // 不能删除
            if (has_no_del) {
                delete usable_items['remove'];
            }

            // 不能移动
            if (has_no_move) {
                delete usable_items['move'];
            }

            // 不能重命名
            if (has_no_rename) {
                delete usable_items['rename'];
            }

            // 包含不可下载的文件
            if (has_no_down) {
                delete usable_items['single_download'];
                delete usable_items['package_download'];
            }

            // 包含目录
            if (has_dir) {
                delete usable_items['mail_share'];
            }

            // 包含目录或选中了多个文件，就不显示『下载』、『邮件分享』、『外链分享』
            if (has_dir || multi) {
                delete usable_items['single_download'];
                delete usable_items['mail_share'];
            }

            // 包含多个文件、目录，隐藏『重命名』
            if (multi) {
                delete usable_items['rename'];
            }
            // 只有1个，且只有1个文件，不显示『打包下载』
            else if (only_1_file) {
                delete usable_items['package_download'];
            }

            // 链接分享文件个数限制
            if (files.length > constants.LINK_SHARE_LIMIT) {
                delete usable_items['link_share'];
            }

            // 下载文件个数限制
            if (files.length > constants.PACKAGE_DOWNLOAD_LIMIT) {
                delete usable_items['package_download'];
            }

            // 如果没有邮件分享和链接分享，则不显示分享菜单
            if (!usable_items['mail_share'] && !usable_items['link_share']) {
                delete usable_items['share'];
            }

            return usable_items;
        },

        /**
         * 获取hover的文件
         * @private
         */
        _get_hover_file: function () {
            if (hover_on_file_id) {
                var cur_node = file_list.get_cur_node();
                return cur_node.get_node(hover_on_file_id);
            }
        },

        /**
         * 获取当前操作对应的文件
         * @param {Boolean} single 只要一个文件就够了
         * @private
         */
        _get_target_files: function (single) {
            var file, files;
            if (is_hover) {
                file = this._get_hover_file();
                file && (files = [file]);
            } else {
                if (single) {
                    file = file_list.get_1_sel_file();
                    file && (files = [file]);
                } else {
                    files = file_list_ui_normal._get_sel_files();
                }
            }
            return files || [];
        }
    });


    return menu;
});/**
 * 文件重命名
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file_list.rename.rename",["lib","common","i18n","$","./file_list.rename.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),

        constants = common.get('./constants'),
        request = common.get('./request'),
        Module = common.get('./module'),
        File = common.get('./file.file_object'),

        renaming_node, // 当前正在编辑的FileNode
        renaming_callback, // 当前绑定的回调
        renaming_scope, // 回调的this作用域

        deep_limit = constants.DIR_DEEP_LIMIT, // 创建目录的层级上限

        undefined;

    var rename = new Module('disk_file_rename', {

        ui: require('./file_list.rename.ui'),

        render: function () {
            this.on('deactivate', function () {
                this.close_edit();
            });
        },

        /**
         * 判断当前重命名模块是否处于空闲状态。因为它是单例的，有可能正在进行编辑或异步保存，这时要避免执行。
         * @return {Boolean} idle
         */
        is_idle : function(){
            // 考虑到健壮性，还是去掉正在编辑结点的判断，只判断异步保存。
            // 因为这里的start_edit是会同步调用close_edit的，不会出现冲突问题。
            return !this._saving;// && !renaming_node;
        },

        /**
         * 开始编辑文件名
         * @param {FileNode} node
         * @param {Function} callback (optional) 编辑完成的回调，参数为success、name、properties
         * @param {Object} scope (optional) callback的执行域
         */
        start_edit: function (node, callback, scope) {
            // rename操作是异步的，可能会导致一个rename的save进行中，另一个rename开始了，而最后的回调却修改了后rename的那个
            // 这里防止异常，应同时只允许一个rename正在进行
            if(this._saving){
                return;
            }

            // 未渲染,则渲染
            this.render();

            // 先取消已启动的改名动作
            this.close_edit();

            renaming_node = node;
            renaming_callback = callback;
            renaming_scope = scope;

            this.trigger('start', renaming_node);
        },

        /**
         * 取消|结束正在进行中的编辑(已发出的请求无法取消)
         * @param {String} new_name 新文件名(为空表示撤销)
         * @param {Object} properties 新的文件属性，仅在创建时有效
         */
        close_edit: function (new_name, properties) {
            if (renaming_node) {

                new_name = new_name || renaming_node.get_name();

                this.trigger('done', renaming_node, new_name);

                if(renaming_callback && $.isFunction(renaming_callback)){
                    renaming_callback.call(renaming_scope, !!new_name, new_name, properties);
                }

                renaming_node = null;
            }
        },

        /**
         * 尝试保存文件名(可能被拒绝, 要做好心理准备)
         * @param {String} new_name
         * @param {Boolean} keep_focus 出现错误时，是否保持输入状态
         */
        try_save: function (new_name, keep_focus) {
            if (renaming_node) {

                var changed = renaming_node.is_tempcreate() || new_name && new_name !== renaming_node.get_name();

                if (changed) {
                    var err = this._check_name(new_name);
                    if(!err && renaming_node.is_tempcreate()){
                        err = this._check_deep(renaming_node.get_parent());
                    }
                    if (err) {

                        // 这里触发deny事件，表示不允许改为这个文件名，请重新输入；触发error事件，表示修改失败，然后就没有然后了。
                        // this.trigger('deny', renaming_node, err);
                        this.trigger('error', err);

                        if (!keep_focus) {
                            this.close_edit();
                        }
                    } else {

                        this.trigger('temp_save', renaming_node, new_name);

                        // 真正的保存
                        this._try_save(new_name);
                    }
                } else {
                    this.close_edit();
                }
            }
        },

        /**
         * 请求CGI保存文件名
         * @param {String} new_name
         */
        _try_save: function (new_name) {
            var me = this;

            if(me._saving) {
                return false;
            }

            var
                data = {
                    ppdir_key: renaming_node.get_parent().get_parent().get_id(),
                    pdir_key: renaming_node.get_parent().get_id()
                },
                cmd,
                encode = encodeURIComponent;

            if (renaming_node.is_dir()) {
                if(renaming_node.is_tempcreate()){
                    cmd = 'dir_create';
                }else{
                    cmd = 'dir_attr_mod';
                    data.dir_key = renaming_node.get_id();
                }
                data.dir_attr = {
                    dir_name: encode(new_name),
                    dir_note: ''
                };
            } else {
                cmd = 'file_attr_mod';
                data.file_id = renaming_node.get_id();
                data.file_attr = {
                    file_name: encode(new_name),
                    file_note: '',
                    file_mtime: date_time.now_str()
                };
            }

            request.post({
                cmd: cmd,
                body: data,
                cavil: true
            })

                .ok(function (msg, body) {
                    var old_name = renaming_node.get_name();
                    var properties = null;
                    if(renaming_node.is_tempcreate()){
                        properties  = {
                            id : body.dir_key,
                            name : new_name,
                            create_time : body.dir_ctime,
                            modify_time : body.dir_mtime
                        };
                    }
                    me.trigger('ok', renaming_node, old_name, new_name);
                    me.close_edit(new_name, properties);
                })

                .fail(function (msg) {
                    me.trigger('error', msg);
                    me.close_edit();
                })

                .done(function () {
                    me._saving = false;
                });

            me._saving = true;
        },

        /**
         * 检查文件名是否有效
         * @param {String} new_name
         */
        _check_name: function (new_name) {
            var err = File.check_name(new_name);
            if (!err) {
                new_name = new_name.toLowerCase();
                var siblings = renaming_node.get_parent().get_kid_nodes();
                var name_conflict = collections.any(siblings, function (sib_node) {
                    if (sib_node !== renaming_node && sib_node.get_name().toLocaleLowerCase() === new_name) {
                        return true;
                    }
                });
                if (name_conflict) {
                    err = renaming_node.is_dir() ? 
                        _('文件夹名有冲突，请重新命名') :
                        _('文件名有冲突，请重新命名');
                }
            }
            return err;
        },

        _check_deep: function (dir_node) {
            var par_len = 0;
            while (dir_node = dir_node.get_parent()) {
                par_len++;
            }
            if (par_len > deep_limit) {
                return _('文件夹路径过深，请重新创建');
            }
        }
    });

    return rename;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_list.rename.ui",["lib","common","i18n","$","./tmpl","./file_list.ui_normal","./file_list.rename.rename"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',

        $body,

        file_list_ui_normal,
        rename,

        undefined;

    var ui = new Module('disk_file_rename_ui', {

        render: function () {

            file_list_ui_normal = require('./file_list.ui_normal');
            rename = require('./file_list.rename.rename');

            $body = $(document.body);


            this
                .listenTo(rename, 'start', function (node) {
                    var
                        $editor = this._get_$editor(),
                        $input = $editor.find('input[type=text]'),
                        $item = file_list_ui_normal.get_$item(node.get_id()),
                        $file_name = $item.find('[data-name=file_name]');

                    $file_name
                        // 隐藏文件名
                        .hide()
                        // 插入文件名编辑器
                        .after($editor.css('display', ''));

                    // 写入当前值, 并设置焦点
                    $input
                        .val(node.get_name())

                        .on(key_event + '.file_rename', function (e) {
                            if (e.which === 13) {
                                var val = $.trim(this.value);
                                // 新建文件时，没输入任何字符并按下回车时，不做任何处理 james 2013-6-5
                                if (val) {
                                    rename.try_save(val, true);
                                }
                            } else if (e.which == 27) {
                                rename.close_edit();
                            }
                        });

                    if (node.is_dir()) {
                        $input.focus().select();
                    } else {
                        this._select_text_before($input, '.');
                    }

                    // 在外部点击时停止编辑
                    setTimeout(function () {
                        $body.on('mousedown.file_rename', function (e) {
                            if (!$(e.target).is($input)) {
                                var val = $.trim($input.val());
                                // 新建文件时，没输入任何字符并点击外部时，忽略此次新建操作 james 2013-6-5
                                if (node.is_tempcreate() && !val) {
                                    rename.close_edit();
                                }
                                else {
                                    rename.try_save(val, false);
                                }
                            }
                        });
                    }, 0);
                })

                .listenTo(rename, 'ok', function (node, old_name, new_name) {
                    mini_tip.ok(node.is_tempcreate() ? _('新建文件夹成功') : _('更名成功'));
//                    mini_tip.ok(text.format('{type}已改名为{new_name}', {
//                        type: node.is_dir() ? '文件夹':'文件',
//                        old_name: text.smart_sub(old_name, 10),
//                        new_name: text.smart_sub(new_name, 10)
//                    }));
                })

                // 重命名动作结束(无论成功与否都会触发)
                .listenTo(rename, 'done', function () {
                    this.destroy();
                })

                .listenTo(rename, 'deny', function (node, err) {

                    mini_tip.error(err);

                    this._get_$editor().find('input').focus();
                })

                .listenTo(rename, 'error', function (err) {

                    mini_tip.error(err);
                })

                // 暂时保存
                .listenTo(rename, 'temp_save', function (node, name) {
                    // 暂时隐藏编辑框
                    var $editor = this._get_$editor();
                    $editor.hide();
                    $editor.find('input').toggle().toggle();  // 解决shaque IE7下元素隐藏后光标仍在闪的bug - james 2013-5-11
                });
        },

        destroy: function () {
            var $editor = this._get_$editor();

            // 移除文本框(事件会同时移除)
            $editor.hide().remove();      // 先 hide() 再 remove() 解决shaque IE7下元素隐藏后光标仍在闪的bug - james 2013-5-11

            this._$editor = null;

            $body.off('mousedown.file_rename');
        },

        /**
         * 获取编辑器
         * @return {*}
         * @private
         */
        _get_$editor: function () {
            if (!this._$editor) {
                this._$editor = $(tmpl.rename_editor());
            }
            return this._$editor;
        },

        /**
         * 选中文件名而不包括扩展名
         * @param {jQuery|HTMLElement} $input
         * @param {String} sep
         * @private
         */
        _select_text_before: function ($input, sep) {
            var input = $($input)[0],
                text = $input.val(),
                before = (text.lastIndexOf(sep) == -1) ? text.length : text.lastIndexOf(sep);

            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(0, before);
            }
            else if (input.createTextRange) {
                var text_range = input.createTextRange();
                text_range.collapse(true);
                text_range.moveEnd('character', before);
                text_range.moveStart('character', 0);
                text_range.select();
            }
            else {
                input.select();
            }
        }

    });

    return ui;
});/**
 * 批量选择文件
 * @author jameszuo
 * @date 13-1-15 上午10:42
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./file_list.selection.selection",["lib","common","$","./tmpl","./file.file_node","./file.utils.all_file_map","main","./file_list.file_list","./file_list.ui_normal"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),

        Selectable = lib.get('./ui.selectable'), // lib.ui.Selectable
        events = lib.get('./events'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        log_event = common.get('./global.global_event').namespace('log'),
        disk_event = common.get('./global.global_event').namespace('disk'),
        file_list_event = common.get('./global.global_event').namespace('disk/file_list'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),
        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),

        main_ui = require('main').get('./ui'),

        file_list,
        file_list_ui_normal,

    // -----------------------------

        SELECTED_CLASS = 'ui-selected',
        ITEM_FILTER = '[data-file-id]',
        FILTER_QUICK_DRAG = '[data-quick-drag]',

        FILTER_CHECKBOX = '', // ':checkbox',
//        CONTAINER = '#_box_container',

    // 在这些元素上点击鼠标不会取消已选择
        KEEP_SELECT_ON = '[data-no-selection], object, embed, [data-file-check]',

        KEEP_SELECT_ON_BATCH_MODE = KEEP_SELECT_ON + ', .' + SELECTED_CLASS,

    // 点击这些元素时，不执行选中或取消选中
        CLICK_CANCEL = 'input, textarea, button, a' + (KEEP_SELECT_ON ? ' ,' + KEEP_SELECT_ON : ''),
    // 框选这些元素时，不执行选中或取消选中
        SELECT_CANCEL = '[data-function], ' + CLICK_CANCEL,

    // 批量模式下点击这些元素时，不执行选中或取消选中
        CLICK_CANCEL_BATCH_MODE = CLICK_CANCEL,
    // 批量模式下框选这些元素时，不执行选中或取消选中
        SELECT_CANCEL_BATCH_MODE = CLICK_CANCEL,


        NO_MOVE_FILTER = '[data-no-move]',

    // --- 华丽的分割线 --------------------------------------------

        selectable,
        dragdrop,

        all_selected = false, // 是否已“全选”
        all_sel_files = [],   // 选中的文件（可能为用户手动选中的，和全选选中的）
        manual_sel_files = [],   // 用户手动选中的文件

        doc = document,

        get_by_el_id = function (id) {
            return doc.getElementById(id);
        },

        undefined;

    var selection = new Module('disk_file_selection', {
        $list: null,

        render: function () {

            file_list = require('./file_list.file_list');
            file_list_ui_normal = require('./file_list.ui_normal');


            // selectable
            selectable = new Selectable({
                // delegater: main_ui.get_$ui_root(),
                target: file_list_ui_normal.get_$lists(),
                child_filter: ITEM_FILTER,
                checkbox: FILTER_CHECKBOX,
                keep_select_on: KEEP_SELECT_ON,
                select_cancel: SELECT_CANCEL
            });

            this.listenTo(selectable, 'select_change', function (change_status) {
                var new_sel_id_set = change_status.new_sel_id_set,
                    org_sel_id_set = change_status.org_sel_id_set,
                // 已取消选中的id
                    unsel_id_arr = [];

                // 对比新旧，找出已取消的
                for (var id in org_sel_id_set) {
                    if (!(id in new_sel_id_set)) {
                        unsel_id_arr.push(id);
                    }
                }

                var
                // 已选中的文件
                    sel_files = $.map(new_sel_id_set, function (el_id) {
                        return file_list_ui_normal.get_file_by_$el($('#' + el_id));
                    }),
                // 之前选中的文件
                    org_files = $.map(org_sel_id_set, function (el_id) {
                        return file_list_ui_normal.get_file_by_$el($('#' + el_id));
                    });

                // selectable 的这个选中事件是由DOM修改后触发的，所以这里设置文件UI的选中状态时，就静默设置即可。 james
                $.each(org_files, function (i, file) {
                    file.get_ui().set_selected(false);
                });
                $.each(sel_files, function (i, file) {
                    file.get_ui().set_selected(true);
                });

                selection.trigger_changed();
            });

            this.listenTo(selectable, 'clear', function (sel_ids) {
                var changed = false;

                if (sel_ids && sel_ids.length) {
                    for (var i = 0, l = sel_ids.length; i < l; i++) {
                        var el_id = sel_ids[i],
                            file = file_list_ui_normal.get_file_by_$el($('#' + el_id));
                        if (file && file.get_ui().set_selected(false)) {
                            changed = true;
                        }
                    }
                }

                var cur_node = file_list.get_cur_node(),
                    files;
                if (cur_node && (files = cur_node.get_kid_nodes())) {
                    for (var i = 0, l = files.length; i < l; i++) {
                        var file = files[i];
                        if (file && file.get_ui().set_selected(false)) {
                            changed = true;
                        }
                    }
                }

                if (changed) {
                    selection.trigger_changed();
                }
            });

            // 框选日志上报
            selectable.on('box_selection_stop', function () {
                if (selectable.has_selected()) {
                    user_log('BOX_SELECTION');
                }
            });
        },

        manual_select: function (args, flag) {
            this.toggle_select(args, flag, false);
        },

        /**
         * 选中这些文件（请尽量传入批量文件，因为执行完成后会遍历一次DOM）
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} flag 是否选中
         * @param {Boolean} update_ui 是否更新UI，默认true
         */
        toggle_select: function (args, flag, update_ui) {
            update_ui = typeof update_ui === 'boolean' ? update_ui : true;


            if (args.length) {

                var $items, files;

                // 传入的是DOM
                if (args[0] instanceof $ || (args[0].tagName && args[0].nodeType)) {
                    $items = args;
                    files = $.map($items, function ($item) {
                        return file_list_ui_normal.get_file_by_$el($item);
                    });
                }
                // 传入的是文件或ID数组
                else {
                    var file_ids;
                    // 传入的是File实例数组
                    if (FileNode.is_instance(args[0])) {
                        files = args;
                    }
                    // 传入的是ID数组
                    else if (typeof args[0] == 'string') {
                        file_ids = args;
                        files = all_file_map.get_all(file_ids);
                    }
                }

                if (files && files.length) {

                    $.each(files, function (i, file) {
                        file.get_ui().set_selected(flag);
                    });

                    // 更新UI
                    if (update_ui) {
                        this.update_ui_selection(files);
                    }

                    // 同步到selectable（依赖UI更新）
                    selectable.check_changed();

                    this.trigger_changed();
                }
            }
        },

        update_ui_selection: function (files) {
            $.each(files, function (i, file) {
                if (file.get_ui().is_rendered()) {
                    var $item = file_list_ui_normal.get_$item(file.get_id());
                    $item.toggleClass('ui-selected', file.get_ui().is_selected());
                }
            });
        },

        trigger_changed: function () {
            var sel_meta = this.get_sel_meta();
            this.trigger('select_change', sel_meta);
            global_event.trigger('disk_selected_files', sel_meta.files.length);
            log_event.trigger('sel_files_len_change', sel_meta.files.length);
        },

        /**
         * 获取选中状态
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var node = file_list.get_cur_node(),
                all_files,
                meta = {
                    files: [],
                    is_all: false
                };

            if (node && (all_files = node.get_kid_nodes())) {

                // 可选中的文件个数
                var selable_count = 0;

                // 这段代码做了2个事情：1. 计算是否已全选；2. 找出已选中的文件
                $.each(all_files, function (i, file) {
                    var file_ui = file.get_ui(),
                        selable = file_ui.is_selectable(),
                        selted = file_ui.is_selected();
                    if (selable) {
                        selable_count++;
                    }
                    if (selted) {
                        meta.files.push(file);
                    }
                });

                // 已全选
                meta.is_all = all_files.length > 0 && meta.files.length > 0 && selable_count === meta.files.length;
            }
            return meta;
        },

        /**
         * 获取一个选中的文件
         */
        get_1_sel_file: function () {
            var node = file_list.get_cur_node();
            return node && node.get_kid_nodes() ? collections.first(node.get_kid_nodes(), function (file) {
                return file.get_ui().is_selected();
            }) : null;
        },

        /**
         * 刷新框选
         */
        refresh_selection: function () {
            selectable.refresh();
        },

        /**
         * 刷新框选
         */
        is_selecting: function () {
            return selectable.is_selecting();
        },

        /**
         * 启用框选
         */
        enable_selection: function () {
            selectable.enable();
        },

        /**
         * 禁用框选
         */
        disable_selection: function () {
            this.clear();
            selectable.disable();
        },

        /**
         * 启用拖拽
         */
        enable_dragdrop: function () {
            dragdrop.enable();
        },

        /**
         * 禁用拖拽
         */
        disable_dragdrop: function () {
            dragdrop.disable();
        },

        /**
         * 刷新可拖拽的元素状态
         * @param {jQuery|HTMLElement} $items
         */
        refresh_drag: function ($items) {
            dragdrop.refresh_drag($items);
        },

        /**
         * 刷新可丢放的元素状态
         * @param {jQuery|HTMLElement} $items
         */
        refresh_drop: function ($items) {
            dragdrop.refresh_drop($items);
        },

        /**
         * 清除选中
         * @param {FileNode} [p_node] 目标目录
         */
        clear: function (p_node) {
            selectable.clear_selected();
            var node = p_node || file_list.get_cur_node(),
                files;
            if (node && (files = node.get_kid_nodes())) {
                for (var i = 0, l = files.length; i < l; i++) {
                    files[i].get_ui().set_selected(false);
                }
            }
        },
        /**
         * 取消拖拽动作
         */
        cancel_drag: function () {
            dragdrop.cancel_drag();
        },

        /**
         * 获取选中的文件DOM
         * @return {jQuery|HTMLElement}
         */
        get_selected_$items: function () {
            return selectable.get_selected_$items();
        },

        /**
         * 获取选中的文件对象
         * @return {FileNode[]}
         */
        get_selected_files: function () {
            return this.get_sel_meta().files;
        },

        /**
         * 获取已选中且已插入DOM中的文件对象
         * @param {jQuery|HTMLElement} [$items] 获取这些文件DOM对应的File实例，可选
         * @return {*}
         */
        get_sel_dom_files: function ($items) {
            var ids = $.map($items || this.get_selected_$items(), function (item) {
                return $(item).attr('data-file-id');
            });
            return all_file_map.get_all(ids);
        },

        _update_selected_files: function (sel_ids) {
            var cur_node = file_list.get_cur_node();
            if (cur_node) {

                // 全选方式
                if (all_selected) {

                    manual_sel_files = [];

                    all_sel_files = $.grep(cur_node.get_kid_nodes(), function (file) {
                        if (file.get_id() in sel_ids) {
                            manual_sel_files.push(file);
                        }
                        return file.is_selectable();
                    });
                }

                // 手动选择方式
                else {
                    all_sel_files = manual_sel_files = all_file_map.get_all(sel_ids);
                }
            }
        },


        /**
         * 设置是否是批量操作模式（批量模式下显示checkbox、不需要按住ctrl即可多选、不可拖拽）
         * @param {Boolean} _batch  是否批量模式
         * @param {string} _without CSS过滤器(排除不允许选中的文件)
         * @param {String} _clear_on_blur 点击外部时，清除选中，默认true
         */
        set_batch_mode: (function () {
            var batch_mode, batch_without, clear_on_blur;

            return function (_batch, _without, _clear_on_blur) {
                if (typeof _clear_on_blur !== 'boolean') {
                    _clear_on_blur = true;
                }


                if (batch_mode === _batch && batch_without === _without && clear_on_blur === _clear_on_blur) {
                    return;
                }

                var click_cancel = _batch ? CLICK_CANCEL_BATCH_MODE : CLICK_CANCEL,
                    select_cancel = _batch ? SELECT_CANCEL_BATCH_MODE : SELECT_CANCEL,
                    keep_select = (_batch ? KEEP_SELECT_ON_BATCH_MODE : KEEP_SELECT_ON);

                if (keep_select) {
                    if (_without) {
                        keep_select += ',' + _without;
                    }
                } else {
                    keep_select = _without;
                }

                selectable.set_clear_on_blur(_clear_on_blur);
                selectable.set_select_cancel(click_cancel, select_cancel);
                selectable.set_keep_select_on(keep_select);
                selectable.set_ctrl_multi(!_batch);

                selectable.set_filter(file_list_ui_normal.get_$lists(), ITEM_FILTER + (_without ? ':not(' + _without + ')' : ''));

                batch_mode = _batch;
                batch_without = _without;
            }
        })(),

        /**
         * 判断指定的文件DOM是否已被选中
         * @param {jQuery|HTMLElement} item
         */
        is_selected: function (item) {
            return selectable.is_selected.apply(selectable, arguments);
        },

        /**
         * 判断是否有选中的文件
         */
        has_selected: function () {
            return selectable.has_selected.apply(selectable, arguments);
        },

        /**
         * 判断指定的文件是否可以被选中
         */
        is_can_select: function () {
            return selectable.is_can_select.apply(selectable, arguments);
        },

        /**
         * 过滤掉不可选中的文件
         */
        filter_can_select: function () {
            return selectable.filter_can_select.apply(selectable, arguments);
        },

        /**
         * 选中指定文件以外的文件
         */
        select_but: function () {
            return selectable.select_but.apply(selectable, arguments);
        },

        /**
         * 标识是否已全部选中
         * @param {Boolean} selected
         */
        set_all_selected: function (selected) {
            all_selected = !!selected;
            this._update_selected_files(this._get_sel_rend_file_ids());
        }
    });

    selection.once('render', function () {
        dragdrop = {

            _enabled: false,

            enable: function () {
                var me = this;

                if (me._enabled) {
                    return;
                }

                me.refresh();

                // 选中状态改变后，刷新 dragdrop
                me.listenTo(file_list_event, 'file_select_change', function (file, sel) {
                    if (file.get_ui().is_rendered()) {
                        var $item = file_list_ui_normal.get_$item(file.get_id());
                        if ($item[0]) {
                            me.refresh($item);
                        }
                    }
                });

                me._enabled = true;
            },

            disable: function () {
                if (this._enabled) {
                    this._destroy();

                    this.stopListening(file_list_event, 'file_select_change');

                    this._enabled = false;
                }
            },

            /**
             * 刷新拖拽状态
             * @param items
             */
            refresh: function (items) {
                var me = this;
                var $items = items ? $(items) : selectable.get_$items();  // 全部文件

                // 可拖拽的节点
                me.refresh_drag($items);


                // 可丢放的节点
                me.refresh_drop($items.filter(function (i, item) {
                    var file_id = item.getAttribute('data-file-id'),
                        file_node = all_file_map.get(file_id);
                    return file_node && file_node.is_droppable();
                }));
            },

            /**
             * 更新元素的可拖拽状态
             * @param $items
             */
            refresh_drag: function ($items) {
                if (!$items || !$items.length) {
                    return;
                }

                var me = this;

                require.async('jquery_ui', function () {
                    $items.each(function (i, item) {
                        var $item = $(item),
                            is_selected = selection.is_selected($item),
                            handle = is_selected ? ITEM_FILTER : FILTER_QUICK_DRAG;

                        if ($item.data('data-draggable-handle') != handle) {

                            if ($item.data('draggable')) {
                                $item.draggable('option', 'handle', handle);
                            } else {
                                $item.draggable({
                                    scope: 'move_file',
                                    handle: handle,
                                    // cursor:'move',
                                    cursorAt: { top: -15, left: -15 },
                                    distance: 10,
                                    appendTo: 'body',
                                    helper: function (e) {
                                        return $('<div id="_selection_draggable_helper" class="drag-helper"/>');
                                    },
                                    start: $.proxy(me._on_drag_start, me),
                                    stop: $.proxy(me._on_drag_stop, me)
                                });
                            }

                            $item.data('data-draggable-handle', handle);
                        }
                    });
                });
            },

            refresh_drop: function ($items) {
                if (!$items || !$items.length) {
                    return;
                }

                var dir_list_el = $items[0].parentNode;
                var options = {
                    scope: 'move_file',
                    tolerance: 'pointer',
                    //                            accept: '.ui-item',
                    hoverClass: 'ui-dropping',

                    drop: function (e, ui) {

                        // 如果丢放的目标不是目录列表，则禁止（解决滚动页面后，拖拽到列表头部时仍指向被滚动到上方的目录的bug）
                        var oe = e.originalEvent.originalEvent,
                            o_target = $(oe.target || oe.srcElement);
                        if (o_target.closest(dir_list_el)[0]) {

                            // 如果目标节点已被选中，则不允许丢放
                            var $item = $(e.target);
                            if (!selection.is_selected($item)) {

                                var $target_item = $(e.target).closest(ITEM_FILTER),
                                    target_dir_id = $target_item.attr('data-file-id');

                                disk_event.trigger('drag_and_drop_files_to', target_dir_id);
                                user_log('DISK_DRAG_DIR'); //拖拽item到其他目录
                                return true;
                            }
                        }
                        user_log('DISK_DRAG_RELEASE'); //拖拽item后放手
                        return false;
                    }
                };


                require.async('jquery_ui', function () {
                    $items.droppable(options);
                });
            },

            _on_drag_start: function (e, ui) {
                var oe = e.originalEvent.originalEvent;
                if ($(oe.target || oe.srcElement).is('[data-function]')) {
                    return false;
                }

                var $target = $(e.originalEvent.target),
                    $curr_item = $target.closest(ITEM_FILTER);

                // 未完成的文件不允许拖拽
                if ($curr_item.is(NO_MOVE_FILTER)) {
                    return false;
                }

                // 如果是从文件名、图标开始拖拽，且当前文件未选中，那么需要清除非当前文件的选中
                var from_enter = $target.closest(FILTER_QUICK_DRAG).length;
                if (from_enter && !selection.is_selected($curr_item)) {
                    //清除非当前文件的选中
                    selection.clear();
                    selection.select_but($curr_item);
                    // fix bug
                    $(document).one('mouseup blur', function () {
                        selectable.select_item($curr_item, true, true);
                    });
                }


                var $sel_items = dragdrop._get_draggable_items();
                if (!$sel_items.length) {
                    return false;
                }
                var files = selection.get_sel_dom_files($sel_items);
                if (!files.length) {
                    return false;
                }

                var curr_file = files[collections.indexOf($sel_items.get(), $curr_item[0])];

                // before_drag 事件返回false时终止拖拽
                var ret_val = selection.trigger('before_drag_files', $curr_item, curr_file, $sel_items, files);
                if (ret_val === false) {
                    return false;
                }

                // helper
                ui.helper.html(tmpl.dragging_cursor({ files: files }));
            },

            _on_drag_stop: function () {
                selection.trigger('stop_drag');
            },

            /**
             * 获取可拖拽的DOM
             * @return {jQuery|HTMLElement[]}
             * @private
             */
            _get_draggable_items: function () {
                var node = file_list.get_cur_node();
                if (!node || !node.get_kid_nodes()) {
                    return $();
                }

                var no_drag_$items = [],
                    draggable_$items = [];

                $.each(selection.get_sel_meta().files, function (i, file) {
                    if (file.get_ui().is_rendered()) {
                        var $item = file_list_ui_normal.get_$item(file.get_id());
                        if (file.is_draggable()) {
                            draggable_$items.push($item[0]);
                        } else {
                            no_drag_$items.push($item[0]);
                        }
                    }
                });
                if (no_drag_$items.length) {
                    selection.toggle_select(no_drag_$items, false);
                }

                return $(draggable_$items);
            },

            /**
             * 销毁 Drag & Drop
             */
            _destroy: function (items) {
                var $items = items ? $(items) : selectable.get_$items();

                $items.each(function (i, item) {
                    var $item = $(item),
                        data = $item.data();

                    if (data['draggable']) {
                        $item.draggable('destroy').removeData('data-draggable-handle');
                    }
                    if (data['droppable']) {
                        $item.droppable('destroy');
                    }
                });
            },

            _get_drag_helper: function () {
                return $('#_selection_draggable_helper');
            },

            cancel_drag: function () {

                var $helper = this._get_drag_helper();
                if ($helper[0]) {
                    $helper.remove();
                }

                $(document, document.body).trigger('mouseup'); // 修复jQueryUI的bug

                this.refresh(selectable.get_selected_$items());
            }
        };
        $.extend(dragdrop, events);
    });

    return selection;
});
/**
 * 邮件\外链分享逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./file_list.share.share",["lib","common","i18n","$","./file_list.share.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        ret_msgs = common.get('./ret_msgs'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),

    // 可分享的文件字节数上限，0表示不限制
        size_limit = 0,

        File = common.get('./file.file_object'),

        undefined;

    var share = new Module('share', {

        ui: require('./file_list.share.ui'),

        /**
         * 判断文件是否可以分享
         * @param {File} file 文件对象
         * @return {String} err 如果不允许分享，则返回错误消息
         */
        is_sharable: function (file) {
            if (file.is_dir()) {
                // 文件夹不允许分享, UI上有逻辑判断, 一般情况下不会出现对文件夹调用该方法的情况, 但为了健壮起见, 这里这么搞一下子
                return _('邮件分享暂不支持文件夹');
            }
            else {
                return this._validate(file);
            }
        },

        /**
         * 判断文件是否可以分享
         * @param {Array<File>} files 文件集合
         * @return {String} err 如果不允许分享，则返回错误消息
         */
        is_link_sharable: function (files) {
            if (!files) {
                return _('无效的参数');
            }

            if (File.is_instance(files)) {
                files = [files];
            }

            for (var i = 0, l = files.length; i < l; i++) {
                var f = files[i];
                if (!f.is_dir()) {
                    var err = this._validate(f);
                    if (err) {
                        return err;
                    }
                }
            }
        },

        /**
         * 获取邮件分享链接
         * @param {File} file 文件对象
         */
        get_mail_url: function (file) {
            if (file && !file.is_dir()) {

                var uin = query_user.get_uin(),
                    skey = query_user.get_skey();

                return urls.make_url('http://jump.weiyun.qq.com/set_cookie.php', {
                    uin: uin,
                    skey: skey,
                    url: encodeURIComponent(urls.make_url('http://mail.qq.com/cgi-bin/login', {
                        weiyunfid: file.get_id() + ',' + file.get_parent().get_id(),
                        ADUIN: uin,
                        lc: 'zh_CN',
                        vt: 'passport',
                        target: 'weiyunsend',
                        vm: 'pt'
                    }, false))
                }, false);
            } else {
                return '#';
            }
        },

        /**
         * 外链分享
         * @param {FileNode[]} files 文件对象
         */
        link_share: function (files) {
            var err = this.is_link_sharable(files);
            if (!err) {

                var me = this;

                // 延迟渲染
                me.render();

                var _files = [], _dirs = [], p_dir = files[0].get_parent();
                $.each(files, function (i, f) {
                    if (f.is_dir()) {
                        _dirs.push({ dir_key: f.get_id(), dir_name: f.get_name() });
                    } else {
                        _files.push({ file_id: f.get_id(), file_name: f.get_name() });
                    }
                });

                //防止分享多余40个文件
                if (files.length > constants.LINK_SHARE_LIMIT) {
                    me.trigger('warn', _('链接分享一次最多支持{0}个文件', constants.LINK_SHARE_LIMIT));
                    return;
                }

                request.post({
                    url: 'http://web.cgi.weiyun.com/wy_share.fcg',
                    cmd: 'add_share',
                    header: {"uin" : query_user.get_cached_user().get_uin()},
                    body: {
                        ppdir_key: p_dir.get_pid(),
                        pdir_key: p_dir.get_id(),
                        files: _files,
                        dirs: _dirs
                    },
                    cavil: true,
                    resend: true
                })

                    .ok(function (ret, body) {
                        me.trigger('link_shared', body['short_url'], body['raw_url'], files);
                    })

                    .fail(function (msg) {
                        me.trigger('error', msg);
                    });

            } else {
                this.trigger('warn', err);
            }
        },

        /**
         * 校验
         * @param {File} file
         * @returns {string}
         * @private
         */
        _validate: function (file) {
            if (file.is_broken_file()) {
                return _('不能分享破损的文件');
            }
            else if (file.is_empty_file()) {
                return _('不能分享空文件');
            }
            else if (size_limit > 0 && file.get_cur_size() > size_limit) {
                return _('分享的文件应小于{0}', File.get_readability_size(size_limit));
            }
        }
    });

    return share;

});/**
 * 邮件\外链分享UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./file_list.share.ui",["lib","common","i18n","$","./tmpl","./file_list.share.share"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),

        cur_short_link,
        cur_long_link,

        share,

        support_input_copy = false, // 不支持复制时，是否显示一个文本框
        ie = $.browser.msie,
        ie6 = ie && $.browser.version < 7,
        doc_title,

        undefined;

    var ui = new Module('disk_file_share_ui', {

        render: function () {

            share = require('./file_list.share.share');

            var me = this;

            this
                // 文件已分享
                .listenTo(share, 'link_shared', function (short_link, long_link, files) {
                    this.show_link_share_box(short_link, long_link, files);
                })

                .listenTo(share, 'warn', function (err) {
                    mini_tip.warn(err);
                })

                .listenTo(share, 'error', function (err) {
                    mini_tip.error(err);
                });

            // UI 事件
            var dialog = this._link_share_dialog = new widgets.Dialog({
                empty_on_hide: true,
                buttons: ['OK'],
                content: tmpl.link_share_content(),
                handlers : {
                    OK : function(){
                        dialog.hide();
                        // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug - james
                        document.title = doc_title;
                        doc_title = null;
    
                        me._destroy_copy();
    
                        me._$link = null;
                    }
                }
            });

            dialog
                .on('show', function () {
                    doc_title = document.title;

                    var $body = this.get_$body(),
                        $btn = $body.find('[data-function=copy]'),
                        $link = me._$link = $body.find('a[data-function=link]');

                    // 链接
                    $link.attr('href', cur_short_link).text(cur_short_link);

                    var support_copy = me._render_copy($btn, cur_short_link);

                    if (!support_copy && !support_input_copy) { // 如果不支持点击复制，则隐藏链接
                        $btn.hide();
                    }
                })
                .on('after_show', function ($dialog) {
                    // james 2013-5-16 修复有些webkit内核appbox不显示复制按钮的bug
                    if(constants.IS_WEBKIT_APPBOX) {
                        $dialog.css('opacity', .9999);
                    }
                })

//                .on('hide', function () {
//                    // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug - james
//                    document.title = doc_title;
//                    doc_title = null;
//
//                    me._destroy_copy();
//
//                    me._$link = null;
//                })

                .on('tip', function (msg, left) {
                    var $tip = dialog.get_$body().find('[data-function="tip"]').css({
                        left: left ? (left + 'px') : ''
                    });

                    $tip
                        .html(tmpl.link_share_copy_error({ msg: msg }))
                        .stop()
                        .fadeIn(100)
                        .delay(3000)
                        .fadeOut(100);
                })

                // 不支持
                .listenTo(me, 'copy_error', function () {
                    dialog.trigger('tip', _('您的浏览器不支持该功能'), -50);
                    // me._show_manual_copy(cur_short_link);
                })

                // 复制成功
                .listenTo(me, 'copy_done', function () {
                    dialog.trigger('tip', _('复制成功'));
                });
        },

        show_link_share_box: function (short_link, long_link, files) {

            cur_short_link = short_link;
            cur_long_link = long_link;

            var title;
            // 一个文件就显示完整名称；多个文件就显示第一个文件的无后缀名称 james 2013-6-7
            if (files.length === 1) {
                title = text.smart_sub(files[0].get_name(), 20);
            }
            else {
                var dir_len = 0,
                    file_len = 0;
                $.each(files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                if(dir_len>0){
                    wording = file_len>0 ? _('{0}等{1}个文件夹和{2}个文件') : _('{0}等{1}个文件夹');
                }else{
                    wording = _('{0}等{2}个文件');
                }

                title = _(wording, text.smart_sub(files[0].get_name_no_ext(), 16), dir_len, file_len, dir_len+file_len);
            }


            var dialog = this._link_share_dialog;
            dialog.set_content(tmpl.link_share_content());
            dialog.set_title(title);
            dialog.show();
        },

        hide_link_share_box: function () {
            var dialog = this._link_share_dialog;
            if (dialog) {
                dialog.hide();
            }
        },

        _render_copy: function ($btn, text) {
            this._destroy_copy();

            // appbox 下的IE内核和IE6优先使用IE内置的剪切板
            if((constants.IS_APPBOX && ie) || ie6) {
                // 依次尝试 ie > flash > netscape
                return this._render_ie_copy.apply(this, arguments)
                    || this._render_flash_copy.apply(this, arguments)
                    || this._render_input_copy.apply(this, arguments);
            } else {
                // 依次尝试 flash > ie > netscape
                return this._render_flash_copy.apply(this, arguments)
                    || this._render_ie_copy.apply(this, arguments)
                    || this._render_input_copy.apply(this, arguments);
            }
        },

        _destroy_copy: function () {

            this.stopListening(global_event, 'window_resize window_scroll');
        },


        _render_flash_copy: function ($btn, text) {
            if (!this._has_flash()) {
                return false;
            }

            var me = this;

            // 加载剪切板
            require.async('zclip', function () {
                // 设置要复制的文字
                $btn.attr('data-clipboard-text', text);

                $btn.zclip({
                    path: 'http://imgcache.qq.com/club/weiyun/js-i18n/lib/jquery-plugins/jquery.zclip/ZeroClipboard-en.swf',
                    copy: text,
                    afterCopy: function () {
                        me.trigger('copy_done');

                        // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug - james
                        document.title = doc_title;
                    }
                });
                // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug - james
                document.title = doc_title;
            });

//            me.$el.css('opacity', 1);

            return true;
        },

        _render_ie_copy: function ($btn, text) {
            if ($.browser.msie && window.clipboardData) {
                var me = this;
                $btn
                    .off('click')
                    .on('click', function () {
                        var ie_clipboard = window.clipboardData;

                        setTimeout(function () {
                            if (ie_clipboard.getData('Text') === text) {
                                me.trigger('copy_done');
                            } else {
                                me.trigger('copy_error');
                            }
                        }, 50);

                        ie_clipboard.setData('Text', text);
                    });
                return true;
            }
            return false;
        },

        _render_input_copy: function ($btn, text) {
            if (support_input_copy) {
                var me = this;

                $btn.on('click', function (e) {
                    e.preventDefault();

                    me._show_manual_copy(text);
                });
                return true;
            } else {
                return false;
            }
        },

        /**
         * 不支持点击复制的情况下，给出一个文本框让用户手动复制 @james
         * @private
         */
        _show_manual_copy: function (text) {
            if (support_input_copy) {
                var me = this,
                    $link = me._$link,
                    $input = $link.next('input');

                if (!$input[0]) {
                    $input = $('<input class="ui-bold"/>').width($link.width()).height($link.height()).val(text);

                    $input.on('focusout', function () {
                        $link.show();
                        $input.hide();
                    });

                    $link.hide().after($input);
                }

                $link.hide();
                $input.show().focus();
                $input[0].select();
            }
        },

        __has_flash: undefined,

        _has_flash: function () {
            if (this.__has_flash !== undefined) {
                return this.__has_flash;
            }

            var hasFlash = false;
            try {
                if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                    hasFlash = true;
                }
            }
            catch (error) {
                if (navigator.mimeTypes["application/x-shockwave-flash"]) {
                    hasFlash = true;
                }
            }

            // for appbox
            if (!hasFlash) {
                hasFlash = window.external && window.external.FlashEnable && window.external.FlashEnable();
            }

            return this.__has_flash = !!hasFlash;
        }
    });

    return ui;

});/**
 * 文件列表缩略图
 * @author jameszuo
 * @date 13-3-8
 */
define.pack("./file_list.thumb.thumb",["lib","common","$","./file.file_node","./file.utils.all_file_map"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/thumb'),
        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),

        request = common.get('./request'),
        query_user = common.get('./query_user'),
        m_speed = common.get('./m_speed'),


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
            cgi_url: null,  // 默认是 wy_web_jsonp.fcg
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

                me._speed_test_start();


                var request_method = files.length < 5 ? request.get : request.post; // request.get({}); request.post({});
                // 申请下载
                request_method.call(request, {
                    url: me._options.cgi_url,
                    cmd: me._options.cgi_cmd,
                    body: function () {
                        return cgi_data;
                    }
                }).ok(function (msg, body) {
                        var img_rsps = me._options.cgi_response.call(me, files, body);

                        me._fill_images_by_rsp(req_ids, img_rsps);

                        me._speed_test_done();
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
            var first_parent = collections.first(queue_files,function (f) {  // 取第一个在树上的节点，用来在后面取在同一目录下的文件进行处理（CGI要求所发送的文件属于同一目录下，而 queue_files 可能包含不属于同一目录下的文件） james 2013-6-7
                    return f.is_on_tree();
                }).get_parent(),
                do_files = [],
                todo_files = [];

            $.each(queue_files, function (i, queue_file) {
                if (queue_file.is_on_tree()) {  // 忽略没有挂在树上的节点 james 2013-6-7
                    var parent = queue_file.get_parent();
                    if (parent && parent === first_parent && do_files.length < batch_size) {
                        do_files.push(queue_file);
                    } else {
                        todo_files.push(queue_file);
                    }
                }
            });

            queue_files = todo_files;

            return do_files;
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

        // 测速
        _speed_test_start: function () {
            try {
                // 只测一次
                if (!get_speed_started) {
                    get_speed_started = true;
                    m_speed.start('disk', 'thumb');
                }
            }
            catch (e) {
            }
        },

        // 测速
        _speed_test_done: function () {// 测速
            try {
                // 只测一次
                if (!get_speed_done) {
                    get_speed_done = true;
                    m_speed.done('disk', 'thumb');
                }
            }
            catch (e) {
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
});/**
 * 文件列表缩略图UI
 * @author jameszuo
 * @date 13-3-11
 */
define.pack("./file_list.thumb.ui",["lib","common","$","./tmpl","./file_list.file_list","./file_list.ui_normal","./view_switch.view_switch","./file_list.thumb.thumb"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),

        Module = common.get('./module'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        file_list = require('./file_list.file_list'),
        file_list_ui_normal = require('./file_list.ui_normal'),
        view_switch = require('./view_switch.view_switch'),

        default_images = {
            'http://imgcache.qq.com/vipstyle/nr/box/img/img-70.png':1,
            'http://imgcache.qq.com/vipstyle/nr/box/img/img-32.png':1
        },

        thumb,
        undefined;

    var ui = new Module('disk_file_list_thumb_ui', {

        // 当一个进程已经在处理，另一个进程需要启动时，通过改变这个变量来终止前一个进程
        _process_id: 0,

        render: function () {
            thumb = require('./file_list.thumb.thumb');

            this
                // 加载成功后显示图片
                .listenTo(thumb, 'get_image_ok', function (file, img) {
                    this.set_$item_img(file, img);
                })
                // 图片加载失败后设置一个默认图片
                .listenTo(thumb, 'get_image_error', function (file) {
                    file_list_ui_normal.mark_$item_img_notfound(file);
                });
        },

        /**
         * 设置图片
         * @param {File} file
         * @param {Image} img
         */
        set_$item_img: function (file, img) {
            var $item = file_list_ui_normal.get_$item(file.get_id()),
                $item_img = $item.find('img');

            if ($item_img[0]) {
                var src = img.src;
                $item_img[0].src = src;
                $item_img.toggleClass('default', src in default_images);
            }
        }

    });

    return ui;
});/**
 * 文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file_list.ui",["lib","common","i18n","$","./file_path.file_path","./view_switch.view_switch","main","./toolbar.tbar","./file_list.file_list","./file_list.ui_virtual","./file_list.ui_normal"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        console = lib.get('./console').namespace('disk/file_list/ui'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        page_event = common.get('./global.global_event').namespace('page'),
        global_event = common.get('./global.global_event'),
        scroller = common.get('./ui.scroller'),
        user_log = common.get('./user_log'),

        file_path = require('./file_path.file_path'),
        view_switch = require('./view_switch.view_switch'),

        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),

        file_list,
        tbar = require('./toolbar.tbar'),

        ui_map = {}, // 所有的已加载的UI模块
        cur_ui, // cur_ui 始终是 ui_virtual 或 ui_normal 其中一个

        doc = document,

        undefined;

    var ui = new Module('disk_file_list_ui', {
        /**
         * 渲染文件列表UI
         */
        render: function ($list_to) {
            file_list = require('./file_list.file_list');

            this._$list_to = $list_to;

            this
                // 已在网盘下的非根目录时，点击左侧“网盘导航”时返回到根目录
                .listenTo(global_event, 'disk_reenter', function () {
                    var cur_node = file_list.get_cur_node();
                    if (!cur_node.is_root()) {
                        file_list.load_root(true, false);
                    }
                })

                // 开始加载后显示UI
                .listenTo(file_list, 'before_load', function (node, last_node, reset_ui) {

                    if (constants.UI_VER === 'APPBOX') {
                        // 是否虚拟目录
                        $(doc.body).toggleClass('module-disk-vir-dir', node.is_vir_dir());
                    }

                    this.enter_dir(node, last_node, reset_ui);
                })

                // 读到文件列表后插入DOM
                .listenTo(file_list, 'load', function (node /* last_node, offset, size, total, ... */) {
                    if (file_list.is_cur_node(node)) {   // 健壮性判断

                        var me = this, args = $.makeArray(arguments);
                        // 插入节点
                        me.set_node_data.apply(me, args);

                        // 标题
                        if (file_list.get_root_node() === node) {
                            doc.title = _('微云');
                        } else {
                            doc.title = node.get_name() + ' - ' + _('微云');
                        }
                    }
                })

                // before_load -> 显示loading
                .listenTo(file_list, 'before_async_load', function () {
                    widgets.loading.show();
                })

                // after_load -> 隐藏loading
                .listenTo(file_list, 'after_async_load', function () {
                    widgets.loading.hide();
                })

                // 错误提示
                .listenTo(file_list, 'error', function (msg, ret) {
                    mini_tip.error(msg);
                })

                // 插入、追加节点后同步插入到DOM中
                .listenTo(file_list, 'prepend_node', function (dirs, files) {
                    if (cur_ui) {
                        cur_ui.prepend_$items(dirs, files);
                    }
                })

                .listenTo(file_list, 'append_node', function (dirs, files) {
                    if (cur_ui) {
                        cur_ui.append_$items(dirs, files, false);
                    }
                })

                .listenTo(file_list, 'add_node', function (dirs, files, index) {
                    if (cur_ui) {
                        cur_ui.insert_$items(dirs, files, index);
                    }
                })

                // 删除文件数据后更新DOM
                .listenTo(file_list, 'after_nodes_removed', function (nodes, refresh_space_info, animate) {
                    if (cur_ui) {
                        cur_ui.remove_$items(nodes, animate);
                    }
                    if (refresh_space_info) {
                        space_info.refresh();
                    }
                })

                // 移动文件数据后更新DOM
                .listenTo(file_list, 'after_nodes_moved', function (nodes) {
                    if (cur_ui) {
                        cur_ui.remove_$items(nodes, true);
                    }
                })

                // 外部插入的文件高亮（如回收站还原文件）
                .listenTo(file_list, 'external_insert_files', function (ids, msg, is_ok) {
                    // 目前只有普通UI模块(ui_normal)有高亮逻辑，先这么写着 - james 2013-7-1
                    if (ids && ids.length && ui_map['ui_normal']) {
                        ui_map['ui_normal'].set_highlight_ids(ids);
                    }

                    // 提示
                    if (msg) {
                        if (is_ok) {
                            mini_tip.ok(msg);
                        } else {
                            mini_tip.warn(msg);
                        }
                    }
                })

                // 点击路径跳转
                .listenTo(file_path, 'click_path', function (dir_id) {
                    file_list.load(dir_id, true);
                });

            var reload = function () {
                file_list.reload(false, true, false);

                // 返回顶部
                scroller.go(0, 0);

                user_log('disk_file_list_reload');
            };

            // 刷新
            this.listenTo(global_event, 'disk_refresh', reload);
        },

        enter_dir: function (node, last_node, reset_ui) {
            var last_ui = cur_ui;

            cur_ui = this._get_ui(node);

            // 退出之前的目录
            if (last_ui) {
                last_ui.exit_dir(node, last_node);
            }

            // 切换UI
            if (last_ui && last_ui !== cur_ui) {
                // last_ui.hide();
                this.toggle_ui(last_ui, false);
                last_ui.reset();
            }

            // 渲染目录（如果已渲染过，不会重复执行）
            cur_ui.render(this._get_$list_parent());

            cur_ui.activate();

            // 进入目录
            cur_ui.enter_dir(node, last_node);

            // 显示、渲染指定的UI
            this.toggle_ui(cur_ui, true);

            // 更新路径
            file_path.update(node);

            // 显示、隐藏视图切换
            view_switch.ui.toggle(cur_ui.is_view_switchable());

            // 调整头部高度
            if (constants.UI_VER === 'WEB') {
                global_event.trigger('page_header_height_changed');
            }
        },

        set_node_data: function (/* ... */) {
            // 更新数据
            if (cur_ui) {
                cur_ui.set_node_data.apply(cur_ui, arguments);
            }

            // 调整头部高度
            if (constants.UI_VER === 'WEB') {
                global_event.trigger('page_header_height_changed');
            }
        },

        /**
         * 显示、隐藏文件列表
         * @param {FileListUIModule} ui
         * @param {Boolean} visible
         */
        toggle_ui: function (ui, visible) {
            visible ? ui.show() : ui.hide();
        },

        /**
         * 选中指定ID的文件元素（仅默认UI）
         * @param {Array<String>|String} file_ids
         */
        highlight_$item: function (file_ids) {
            var ui_normal = ui_map['ui_normal'];
            if (this.is_activated() && ui_normal && ui_normal === cur_ui) {
                return cur_ui.highlight_item(file_ids);
            }
            return false;
        },

        /**
         * 标记列表高度已变化
         */
        list_height_changed: function () {
            this.trigger('list_height_changed');
        },

        _get_ui: function (node) {
            if (!node) {
                return null;
            }

            var ui, ui_name;
            if (node.is_vir_dir()) {
                ui_name = 'ui_virtual';
                ui = require('./file_list.ui_virtual');
            } else {
                ui_name = 'ui_normal';
                ui = require('./file_list.ui_normal');
            }

            if (!ui_map[ui_name]) {
                ui_map[ui_name] = ui;
                this.add_sub_module(ui);

                // 监听文件列表事件（添加、删除元素）
                this.listenTo(ui, 'add_$items remove_$items clear_$items list_resized', function () {
                    this.trigger('list_height_changed');
                });

                // 文件添加到DOM后，更新缓存
                this.listenTo(ui, 'add_$items', function (files) {
                    $.each(files, function (i, file) {
                        file.get_ui().set_rendered(true);
                    });
                });
                // 清空后
                this.listenTo(ui, 'clear_$items', function () {
                    var node = file_list.get_cur_node(),
                        files;
                    if (node && (files = node.get_kid_nodes())) {
                        $.each(files, function (i, file) {
                            var ui = file.get_ui();
                            ui.set_rendered(false);
                        });
                    }
                })
            }

            return ui;
        },

        _get_$list_parent: function () {
            return this._$list_to;
        }
    });


    // 非批量模式下，才可拖拽上传
    // 虚拟目录下，不可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        var cur_node = file_list.get_cur_node();
        return !!cur_node && !cur_node.is_vir_dir();
    });

    return ui;
});/**
 * 文件列表UI抽象父类
 * @author jameszuo
 * @date 13-6-28
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./file_list.ui_abstract",["lib","common","$","./toolbar.status","./toolbar.tbar"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        Module = common.get('./module'),
        constants = common.get('./constants'),

        Status = require('./toolbar.status'),
        tbar,

        icon_map = {
            // 微信
            weixin: 'icon-weixin icon-weixin-dir',
            // 文字
            text: 'icon-weixin icon-weixin-msgs',
            // 文字 & 语音
            text_audio: 'icon-weixin icon-weixin-msgs',
            // 图片
            picture: 'icon-weixin icon-weixin-img',
            // 图片 & 视频
            picture_video: 'icon-weixin icon-weixin-img',
            // 文章
            article: 'icon-weixin icon-weixin-blog',
            // QQ新闻
            qqnews: 'icon-weixin icon-weixin-news'
        },

        undef;

    var FileListUIModule = function (module_name, options) {
        var me = this;

        Module.apply(me, arguments);

        $.each(me, function (prop, val) {
            if (!val) {
                me[prop] = val;
            }
        });
    };

    FileListUIModule.prototype = $.extend({}, Module.prototype, {

        enter: $.noop,
        exit: $.noop,

        /**
         * 更新目录数据
         * @param {FileNode} node
         * @param {FileNode} last_node
         * @param {Object} body CGI响应包体
         */
        set_node_data: $.noop,

        /**
         * 重置列表 DOM 和 UI （显示为空白）
         */
        reset: $.noop,
        /**
         * 显示UI
         */
        show: $.noop,
        /**
         * 隐藏UI
         */
        hide: $.noop,

        /**
         * 在列表前方插入元素
         * @param {Array<FileNode>} dirs
         * @param {Array<FileNode>} files
         */
        prepend_$items: $.noop,
        /**
         * 在列表后方追加元素
         * @param {Array<FileNode>} dirs
         * @param {Array<FileNode>} files
         * @param {Boolean} is_first_page
         */
        append_$items: $.noop,
        /**
         * 在列表后方追加元素
         * @param {Array<FileNode>} dirs
         * @param {Array<FileNode>} files
         * @param {Number} index
         */
        insert_$items: $.noop,
        /**
         * 删除元素
         * @param {Array<FileNode>} nodes
         * @param {Boolean} animate
         */
        remove_$items: $.noop,
        /**
         * 设置需要高亮的文件
         * @param {Array<String>} ids
         */
        set_highlight_ids: $.noop,
        /**
         * 是否可以切换视图模式
         */
        is_view_switchable: $.noop,

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
         * 压缩包预览
         * @param {FileObject} file
         * @private
         */
        preview_zip_file: function (file) {
            require.async('compress_file_iframe', function (mod) {
                var compress_file_iframe = mod.get('./compress_file_iframe'),
                    iframe = compress_file_iframe.create_preview({
                        file: file,
                        max_width: constants.IS_APPBOX ? 670 : 915
                    });

                iframe.set_title(file.get_name());
                iframe.show();
            });
        },

        /**
         * 判断文件是否可以预览
         * @param {FileNode} file
         */
        is_preview_doc: function (file) {
            var size_limit;
            return file.is_preview_doc()
                && (!(size_limit = constants.DOC_PREVIEW_SIZE_LIMIT[file.get_type()])
                || file.get_size() < size_limit);
        },

        /**
         * 文档预览
         * @param {FileObject} file
         * @private
         */
        preview_doc: function (file) {
            require.async('doc_preview', function (mod) {
                var doc_preview = mod.get('./doc_preview');
                doc_preview.preview(file);
            });
        },

        get_icon_map: function () {
            return icon_map;
        },

        /**
         * 更新工具条
         * @param {Boolean} [is_vir_dir] 当前目录是否是虚拟目录
         * @param {FileNode[]} [files] 选中的文件
         */
        update_tbar: function (is_vir_dir, files) {
            if (tbar || (tbar = require('./toolbar.tbar'))) {

                files = files || [];
                var length = files.length,
                    cfg = {
                        is_vir_dir: is_vir_dir,
                        has_broken: false,
                        has_no_del: false,
                        has_no_move: false,
                        has_no_rename: false,
                        has_no_down: false,
                        has_multi: length > 1,
                        has_dir: false,
                        has_qq_disk: false,
                        has_net_fav: false,
                        has_empty_file: false,
                        only_1_file: length === 1 && !files[0].is_dir(),
                        count: length
                    };

                for (var i = 0, l = length; i < l; i++) {
                    var file = files[i];
                    if (file.is_broken_file()) {
                        cfg.has_broken = true;
                    }
                    if (!file.is_removable()) {
                        cfg.has_no_del = true;
                    }
                    if (!file.is_movable()) {
                        cfg.has_no_move = true;
                    }
                    if (!file.is_renamable()) {
                        cfg.has_no_rename = true;
                    }
                    if (!file.is_downable()) {
                        cfg.has_no_down = true;
                    }
                    if (file.is_dir()) {
                        cfg.has_dir = true;
                    }
                    if (file.is_qq_disk_dir()) {
                        cfg.has_qq_disk = true;
                    }
                    if (file.is_net_fav_dir()) {
                        cfg.has_net_fav = true;
                    }
                    if (file.is_empty_file()) {
                        cfg.has_empty_file = true;
                    }
                }

                var status = new Status(cfg);
                tbar.set_status(status);
                // tbar.update();
            }
        }

    });

    return FileListUIModule;
});/**
 * 文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-4
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./file_list.ui_normal",["lib","common","i18n","$","./tmpl","./file.file_node","./file.utils.file_factory","./file.utils.all_file_map","./view_switch.view_switch","./file_path.file_path","./file_path.all_checker","./file_list.rename.rename","main","./ui","./toolbar.tbar","./file_list.ui_abstract","./file_list.file_list","./file_list.ui","./file_list.menu.menu","./file_list.file_processor.remove.remove","./file_list.file_processor.move.move","./file_list.selection.selection","./file_list.thumb.thumb","./file_list.share.share"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/file_list/ui'),
        events = lib.get('./events'),
        store = lib.get('./store'),
        routers = lib.get('./routers'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        scroller = common.get('./ui.scroller'),
        global_event = common.get('./global.global_event'),
        disk_event = common.get('./global.global_event').namespace('disk'),
        page_event = common.get('./global.global_event').namespace('page'),
        global_function = common.get('./global.global_function'),
        global_variable = common.get('./global.global_variable'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        Paging_Helper = common.get('./ui.paging_helper'),
        mini_tip = common.get('./ui.mini_tip'),
        m_speed = common.get('./m_speed'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),

        tmpl = require('./tmpl'),

        FileNode = require('./file.file_node'),
        file_factory = require('./file.utils.file_factory'),
        all_file_map = require('./file.utils.all_file_map'),

        downloader,

    // 视图切换
        view_switch = require('./view_switch.view_switch'),

    // 路径
        file_path = require('./file_path.file_path'),
    // 全选按钮
        all_checker = require('./file_path.all_checker'),

        rename = require('./file_list.rename.rename'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        disk_ui = require('./ui'),
    // 工具栏
        tbar = require('./toolbar.tbar'),

        FileListUIAbstract = require('./file_list.ui_abstract'),

    // 文件列表
        file_list,
        file_list_ui,
    // 文件删除
        remove,
    // 文件移动
        move,
    // 菜单
        menu,
    // 框选/点选
        selection,
    // 列表标题
        ColumnModel,
        cm,
    // 缩略图实例
        thumb,

    // 列表勾选模式
        check_mode = true,
    // 动态计算文件列表每次写入DOM的文件个数
        calc_list_size = true,
    // 固定写入DOM的文件个数
        fixed_list_size = 200,

        set_timeout = setTimeout,

    // 要添加的目录队列
        add_dirs_queue = [],
    // 要添加的文件队列
        add_files_queue = [],
    // 当前目录
        cur_node,

        paging_helper,

        scroll_listening = false, // 正在监听中


        is_batch_mode = false, // 当前是否是批量模式
        batch_op_type, // 批量操作模式
        batch_without = '', // 不可选中的css过滤器

    // 当前目录下可选择的文件个数
        selectable_count = 0,
    // 当前目录下不可选择的文件个数
        unselectable_count = 0,


        speed_reported = false, // 网盘测速结果已上报

        highlight_ids = {}, // 要高亮的文件ID set
        selected_ids = {}, // 要选中的文件ID set

        ui_visible = false, // 当前UI是否已显示


        doc = document, body = doc.body, $body = $(body),

    //is_renaming = 0,//文件重命名中
        undefined;

    var ui_normal = new FileListUIAbstract('disk_file_list_ui_normal', {
        _$list_to: null,
        _$file_list: null,
        _$dir_list: null,
        _$lists: null,
        _column_model: null,

        /**
         * 渲染文件列表UI
         * @param $list_to
         */
        render: function ($list_to) {
            var me = this;

            file_list = require('./file_list.file_list');
            file_list_ui = require('./file_list.ui');
            menu = require('./file_list.menu.menu');

            require.async('downloader', function (mod) {
                downloader = mod;
            });


            // 文件列表主体
            $list_to.append(tmpl.file_list());
            me._$list_to = $list_to;
            me._$views = $list_to.children('.dirs-view, .files-view');
            me._$dirs_view = me._$views.filter('.dirs-view');
            me._$files_view = me._$views.filter('.files-view');


            var
            // 目录列表
                $dir_list = me._$dir_list = $('#_disk_files_dir_list'),
            // 文件列表
                $file_list = me._$file_list = $('#_disk_files_file_list'),
            // 两个列表
                $lists = me._$lists = $dir_list.add($file_list),

            // 列表子标题
                $list_sub_titles = me._$list_sub_titles = $('#_disk_files_file_title, #_disk_files_dir_title'),

            // 空的提示
                $no_files_tip = me._$no_files_tip = $('#_disk_files_empty');

            // 缩略图
            me._render_thumb();
            // 列表头、排序
            me._render_column_header();
            // 分页
            me._render_paging();
            // 打开目录、文件
            me._render_enter();
            // 延迟200毫秒
            set_timeout(function () {
                // 框选、拖拽移动
                me._render_selection();
                // 删除
                me._render_remove();
                // 移动
                me._render_move();
                // 重命名
                me._render_rename();
                // 延迟200毫秒
                set_timeout(function () {
                    // 下载
                    me._render_down();
                    // 拖拽下载
                    me._render_drag_down();
                    // 右键菜单、更多菜单
                    me._render_menu();
                    // IE6
                    me._render_ie6_fix();
                    // 高亮
                    me._render_hightlight();
                    // 工具栏
                    me._render_toolbar();
                    // 分享
                    me._render_share();
                }, 0);
            }, 0);

            me
                // 切换至批量模式时，禁止点击路径
                .on('on_batch_mode', function (is_batch_mode) {
                    var enable = !is_batch_mode;
                    file_path.update(cur_node, enable);
                })
                // 监听这些会导致列表状态变化的事件
                .on('add_$items', function () {
                    if (this.is_activated() && ui_visible) {
                        // this._update_list_view_status(null, null, true);
                        file_list_ui.list_height_changed();
                    }
                })
                .on('close_create_dir', function () {
                    if (this.is_activated() && ui_visible) {
                        this._update_list_view_status(null, null, true);
                        file_list_ui.list_height_changed();
                    }
                })
//                .on('show', function () {
//                    if (this.is_activated() && ui_visible) {
//                        this.trigger('list_height_changed');
//                        this._update_list_view_status();
//                    }
//                })
        },

        show: function ($parent) {
            if (ui_visible !== true) {
                this.render($parent);

                this.get_$views().show();

                if (all_checker) {
                    // 显示全选
                    all_checker.show();
                }

                this.trigger('show');

                ui_visible = true;
            }
        },

        hide: function () {
            if (ui_visible !== false) {
                this.get_$views().hide();
                this.trigger('hide');

                ui_visible = false;
            }
        },

        // 变更指向的目录
        enter_dir: function (node) {
            cur_node = node;

            // 更新视图
            this._update_list_view_status(false, false, false);
            file_list_ui.list_height_changed();

            // 隐藏右键菜单，解决jQueryUI draggable 阻止了mousedown事件的兼容性问题 james
            menu.hide_all();
        },

        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            // if (reset_ui) {
            if (thumb)
                thumb.clear_queue();
            // }

            // 清除已选中的文件
            if (selection) {
                selection.clear(last_node);
                selection.trigger_changed();
            }


            selectable_count = unselectable_count = 0;

            // this._clear_$items(false);
        },

        set_node_data: function (node, last_node, reset_ui) {
            cur_node = node;

            var sort_meta = this._get_sort_meta(),
                dirs = node.get_kid_dirs() || [],
                files = node.get_kid_files() || [],
                datas = cm.sort_datas([dirs, files], sort_meta.field, sort_meta.dir);

            dirs = datas[0] || [];
            files = datas[1] || [];

            this._set_$items(node, last_node, dirs, files);

            // 更新视图
            this._update_list_view_status(dirs.length > 0, files.length > 0, true);

            // “网络硬盘收藏夹”或“QQ硬盘”首次打开的提示
            // this._show_guide_tips_if(node); // 时隔太久，和erric确认过，去掉这个特性


            // 已选中的文件个数
            selectable_count = this._get_selectable_count();
            unselectable_count = node.get_kid_nodes().length - selectable_count;

            if (reset_ui) {
                mini_tip.ok(_('文件列表已更新'));
            }
        },

        append_$items: function (dirs, files, is_first_page) {
            this.add_$items(dirs, files, is_first_page);
        },

        prepend_$items: function (dirs, files) {
            var count = (dirs ? dirs.length : 0 ) + (files ? files.length : 0);
            if (count > 1) {
                console.warn('file_list_ui_normal.prepend_$items(...) 方法目前只支持追加一个文件，追加多个时排序会有问题');
            }

            var files_html;
            dirs || (dirs = []);
            files || (files = []);

            var p_dir = file_list.get_cur_node();

            if (dirs.length) {
                files_html = tmpl.file_item({ p_dir: p_dir, files: dirs, icon_map: this.get_icon_map() });
                this.get_$dir_list().prepend(files_html);
            }
            if (files.length) {
                files_html = tmpl.file_item({ p_dir: p_dir, files: files, icon_map: this.get_icon_map() });
                this.get_$file_list().prepend(files_html);
            }

            this.trigger('add_$items', [].concat(dirs, files), dirs, files);

            this._update_list_view_status(null, null, false);
        },

        insert_$items: function (dirs, files, index) {
            /*
             * 按通用的文件夹文件显示方案，目录与文件是分开的，这里默认一次insert只能添加一种类型，要么是文件夹，要么是文件
             * 即dirs和files同时只能有一个有数据
             * index也是针对一种类型
             */
            /*
             * --- 插入完成后的渲染设置---
             * 当要插入的位置的参考节点位于UI中时，也直接渲染到UI
             * 当位于缓存中时（缓存不能为空，为空则当作在UI中），直接插入到缓存中，后续不归这里管了
             */
            /*
             * 其实这里还是有逻辑冲突，这里插入的位置也只是UI上的位置，下次刷新界面时，可能就因为有排序从而位置改变
             * 目前无解决方法，除非修改排序机制
             */
            var nodes, target_el, target_cache,
                rendered_dirs = [],
                rendered_files = [],
                target_rendered;
            if (dirs && dirs.length) {
                nodes = dirs;
                target_el = this.get_$dir_list();
                target_cache = add_dirs_queue;
                target_rendered = rendered_dirs;
            } else if (files && files.length) {
                nodes = files;
                target_el = this.get_$file_list();
                target_cache = add_files_queue;
                target_rendered = rendered_files;
            } else {
                return; // 错误，没有dirs或files
            }
            // 计算已渲染的节点数
            var ui_elements = target_el.children(), ui_size = ui_elements.length;

            if (index < ui_size) { // 插入的位置处于已渲染UI中
                $(ui_elements[index]).before(tmpl.file_item({ files: nodes, icon_map: this.get_icon_map() }));
                Array.prototype.splice.apply(target_rendered, [0, 0].concat(nodes));
            } else { // 插入的位置处于缓存中
                if (target_cache.length) { // 如果有缓存，不用管，直接插入，反正是有人去渲染的
                    Array.prototype.splice.apply(target_cache, [index - ui_size, 0].concat(nodes));
                } else { // 如果没有缓存，渲染到UI最后面
                    target_el.append(tmpl.file_item({ files: nodes, icon_map: this.get_icon_map() }));
                    Array.prototype.splice.apply(target_rendered, [0, 0].concat(nodes));
                }
            }
            this.trigger('add_$items', target_rendered, rendered_dirs, rendered_files);

            this._update_list_view_status(null, null, false);
        },

        /**
         * 添加文件DOM（队列方式，延迟添加）
         * @param {FileNode} dirs
         * @param {FileNode} files
         * @param {Boolean} is_first_page 是否是首屏（首屏加载 add_items_first_page 个文件）
         */
        add_$items: function (dirs, files, is_first_page) {
//            console.debug('添加文件队列 ' + dirs.length + '目录, ' + files.length + '文件,' + (is_first_page ? '首屏' : '非首屏'));

            if (dirs && dirs.length) {
                add_dirs_queue = add_dirs_queue.concat(dirs);
            }
            if (files && files.length) {
                add_files_queue = add_files_queue.concat(files);
            }

            // 首屏要立刻插入 or 判断高度来决定是否要立刻插入
            this.fill_$items(is_first_page);

            // 如果scroll事件没有在监听，则这里启动监听
            if (!scroll_listening) {
                this._start_listen_scroll();
            }
        },

        /**
         * 通过判断滚动高度来决定是否要立刻插入文件DOM
         * @param {Boolean} [is_first_page] 是否首屏
         */
        fill_$items: function (is_first_page) {
            if (is_first_page || paging_helper.is_reach_bottom()) {
                this._add_$items_from_queue(is_first_page);
            }
        },

        /**
         * 从队列中取文件并插入DOM
         * @param {Boolean} [is_first_page] 是否首屏
         * @param {Number} [add_count] 添加的个数
         */
        _add_$items_from_queue: function (is_first_page, add_count) {
            if (!add_dirs_queue.length && !add_files_queue.length) {
                this._stop_listen_scroll();
                this.trigger('add_$items', []);
                return;
            }

            var me = this,
                step_dirs,
                step_files,
                files_html,
                line_size = calc_list_size ? paging_helper.get_line_size() : 0,
                line_count = calc_list_size ? paging_helper.get_line_count(is_first_page) : 0;

            if (!(add_count > 0)) {
                add_count = calc_list_size ? line_size * line_count : fixed_list_size; // 每一批添加的文件个数
            }

            var dir_count = 0,
                p_dir = file_list.get_cur_node();

            // 目录在前
            if (add_dirs_queue.length) {
                var step_size = add_count;

                if (step_size > 0) {
                    step_dirs = add_dirs_queue.splice(0, step_size);

                    files_html = tmpl.file_item({ p_dir: p_dir, files: step_dirs, icon_map: this.get_icon_map() });
                    this.get_$dir_list().append(files_html);
                    dir_count = step_dirs.length;
                }
            }

            // 文件在后
            if (add_files_queue.length) {
                var is_list = view_switch.is_list_view(),
                    file_step_size;

                if (is_list || !calc_list_size) {
                    file_step_size = add_count - dir_count;
                    console.debug('列表模式，已添加目录' + dir_count + '个；文件' + file_step_size + '个');
                }
                else {
                    var is_break_line = dir_count < add_count, // 是否已折行，如第一行目录为10个，第二行为8个，则认为折行了
                        add_dir_lines = Math.ceil(dir_count / line_size);  // 已添加的目录行数，不满1行按1行计算
                    file_step_size = is_break_line ? line_size * (line_count - add_dir_lines) : add_count;
                    console.debug('缩略图模式，已添加目录' + add_dir_lines + '行共' + dir_count + '个；文件' + file_step_size + '个');
                }

                if (file_step_size > 0) {
                    step_files = add_files_queue.splice(0, file_step_size);
                    files_html = tmpl.file_item({ p_dir: p_dir, files: step_files, icon_map: this.get_icon_map() });
                    this.get_$file_list().append(files_html);
                }
            }

            if (!step_dirs) {
                step_dirs = [];
            }
            if (!step_files) {
                step_files = [];
            }

//            console.debug('添加文件队列 本次处理了' + step_dirs.length + '目录，' + step_files.length + '文件；剩余' + add_dirs_queue.length + '目录，' + add_files_queue.length + '文件');

            this.trigger('add_$items', [].concat(step_dirs, step_files), step_dirs, step_files);


            // 如果队列中没有了，则停止监听滚动
            if (!add_dirs_queue.length && !add_files_queue.length) {
                me._stop_listen_scroll();
            }
        },

        /**
         * 定位到某节点，使它保持在显示状态？只对已渲染的节点有效。。。
         * 以后实现更改后，此功能也需要重写。
         */
        _ensure_visible: function (node) {
            if (!node) {
                return;
            }
            var $item = this.get_$item(node && node.get_id());
            if (!$item) {
                return; // 可能没有渲染出来
            }
            var win = $(window),
                position = $item.offset(),
                file_list_position = this.get_$list_parent().offset(),
            // 可视区域计算方法为：文件列表的初始offset高度为窗口内可视的起始
            // 结束呢仍不变，假定底部没有东西遮着。
                max_visible_top = position.top - file_list_position.top,
                min_visible_top = position.top - win.height() + $item.height(),
                top = win.scrollTop(),
                need_scroll = false;
            if (top < min_visible_top) {
                top = min_visible_top;
                need_scroll = true;
            } else if (top > max_visible_top) {
                top = max_visible_top;
                need_scroll = true;
            }
            if (need_scroll) {
                scroller.go(top);
            }
        },

        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                this.listenTo(global_event, 'window_scroll window_resize', function (e) {

                    // 判断滚动高度
                    if (paging_helper.is_reach_bottom()) {
                        this._add_$items_from_queue(false);
                    }

                });
                scroll_listening = true;
            }
        },

        /**
         * 终止追加元素的进程
         * @private
         */
        _stop_listen_scroll: function () {
            if (scroll_listening) {
                // clear_timeout(add_items_timer);
                this.stopListening(global_event, 'window_scroll');
                scroll_listening = false;
                add_dirs_queue = [];
                add_files_queue = [];
//                console.debug('添加文件队列 进程已终止');
            }
        },

        /**
         * 删除文件DOM
         * @param {FileNode} file_nodes
         * @param {Boolean} animate 动画(只支持单文件) 1
         */
        remove_$items: function (file_nodes, animate) {
            if (!file_nodes || !file_nodes.length)
                return;

            // 取消要删除的文件的选中状态
            selection.toggle_select(file_nodes, false);

            var me = this,
                remove_fn = function () {
                    $(this).remove();
                    me.trigger('remove_$items');

                    // 剔除临时目录
                    file_nodes = $.grep(file_nodes, function (file) {
                        return !file.is_tempcreate();
                    });

                    // 填充
                    if (file_nodes.length) {
                        me._add_$items_from_queue(false, file_nodes.length);
                    }
                    me._update_list_view_status(null, null, true);
                };

            if (file_nodes.length == 1) {
                var first = file_nodes[0],
                    id = first.get_id(),
                    $item = me.get_$item(id);

                if (animate) {
                    $item.fadeOut('fast', remove_fn);
                } else {
                    remove_fn.apply($item);
                }
            } else {

                var ids;
                if (FileNode.is_instance(file_nodes[0])) {
                    ids = collections.map(file_nodes, function (file) {
                        return file.get_id();
                    });
                } else {
                    ids = file_nodes;
                }

                var items = [];
                $.each(ids, function (i, id) {
                    var item = me.get_$item(id)[0];
                    if (item) {
                        items.push(item);
                    }
                });
                remove_fn.apply(items);
            }
        },

        /**
         * 替换文件
         */
        _set_$items: function (node, last_node, dirs, files) {
            this._clear_$items(true);
            this.append_$items(dirs, files, true);

            // 修复IE下可能出现滚动条高度未变化的问题 - james
            if ($.browser.msie) {
                scroller.go(0, 0);
            }

            // 测速
            try {
                if (!speed_reported) {
                    m_speed.done('disk', 'root_list_show');

                    // 延迟N秒后上报(要拉取缩略图)
                    set_timeout(function () {
                        m_speed.send('disk');
                    }, 5000);
                    speed_reported = true;
                }
            }
            catch (e) {
            }
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        _clear_$items: function (silent) {
            if (!this.is_rendered()) return;

            this._stop_listen_scroll();

            var $dir_list = this.get_$dir_list(),
                $file_list = this.get_$file_list();

            if ($dir_list)
                $dir_list.empty();
            if ($file_list)
                $file_list.empty();

            // 强制更新文件列表UI
            // this._update_list_view_status(silent ? false : null, silent ? false : null, silent ? false : null);
//            this._update_list_view_status();

            if (!silent) {
                this.trigger('clear_$items');
            }
        },

        /**
         * 重置列表 DOM 和 UI （显示为空白）
         */
        reset: function () {
            this._clear_$items(false);
        },

        /**
         * 获取某个文件的DOM
         * @param {String|jQuery|HTMLElement} arg
         */
        get_$item: function (arg) {
            var $item;
            if (typeof arg === 'string') {
                $item = $('#_disk_file_item_' + arg);
            } else if (arg instanceof $ || arg.tagName) {
                $item = $(arg).closest('[data-file-id]');
            }
            return $item;
        },

        /**
         * 获取某些文件的DOM
         * @param {Array<String>} ids
         */
        get_$items: function (ids) {
            var me = this,
                items = $.map(ids, function (id) {
                    return me.get_$item(id).get(0);
                });
            return $(items);
        },

        /**
         * 重建某个文件的DOM
         * @param {FileNode|File} node
         * @param {String} old_id (optional) 如果文件节点的ID有改变，则传递此项。默认为空。
         */
        update_$item: function (node, old_id) {
            var $cur_item = this.get_$item(old_id || node.get_id());

            if (old_id) {
                $cur_item.after(tmpl.file_item({
                    files: [node],
                    icon_map: this.get_icon_map()
                }));
                $cur_item.remove();
            } else {
                // 替换内容
                $cur_item.empty().html(tmpl.file_item({
                    files: [node],
                    icon_map: this.get_icon_map(),
                    only_content: true  // only_content -> 只生成文件DOM的内容部分，而不包括.ui-item节点本身，这样可以保留一些状态（如选中状态：ui-selected）
                }));
            }
            this.trigger('update_$item', node);
        },

        /**
         * 更新文件DOM显示名称
         * @param {FileNode|File} node
         * @param {String} name
         */
        show_$item_name: function (node, name) {
            var $item = this.get_$item(node.get_id()),
                $file_name = $item.find('[data-name=file_name]');

            $file_name.text(name).css('display', ''); // $file_name.show()，这里改为删除display样式是因为.filename元素在列表模式下display=inline-block，在缩略图模式下display=block，如果直接.show()，会导致布局出错
        },

        /**
         * 获取文件\目录列表DOM
         */
        get_$lists: function () {
            return this._$lists;
        },

        get_$dir_list: function () {
            return this._$dir_list;
        },

        get_$file_list: function () {
            return this._$file_list;
        },

        get_$views: function () {
            return this._$views;
        },

        get_$dirs_view: function () {
            return this._$dirs_view;
        },

        get_$files_view: function () {
            return this._$files_view;
        },

        get_$list_parent: function () {
            return this._$list_to;
        },

        get_$list_sub_titles: function () {
            return this._$list_sub_titles;
        },

        get_$no_files_tip: function () {
            return this._$no_files_tip;
        },

        /**
         * 标记某个文件DOM展开了菜单
         * @param el
         */
        mark_menu_on: function (el) {
            this.clear_menu_mark();

            var $item = this.get_$item(el);
            $item.addClass('list-menu-on');

            this._last_menu_on_item = $item;
        },

        // 上一个展开了菜单的元素
        _last_menu_on_item: null,

        /**
         * 清除展开菜单的标记
         */
        clear_menu_mark: function () {
            var $item = this._last_menu_on_item;
            if ($item) {
                $item.removeClass('selected list-menu-on').find('[data-function="more"]').removeClass('actived');
            }
        },

        /**
         * 设置是否是批量模式
         * @param {Boolean} _batch 是否批量
         * @param {string} _op_type 操作类型（可选值包括 'default', 'down', 'move', 'remove'）
         * @param {string} _without css排除过滤器
         */
        _set_batch_mode: function (_batch, _op_type, _without) {
            if (is_batch_mode === _batch && batch_op_type === _op_type && batch_without === _without) {
                return;
            }

            is_batch_mode = _batch;
            batch_op_type = _op_type;
            batch_without = _without;

            this.trigger('on_batch_mode', is_batch_mode, batch_op_type, batch_without);
            global_event.trigger('disk_batch_mode', is_batch_mode, batch_op_type);
        },
        /**
         * 设置需要高亮的文件
         * @param {Array<String>} ids
         */
        set_highlight_ids: function (ids) {
            ids = ids || [];
            $.extend(highlight_ids, collections.array_to_set(ids));
        },
        is_view_switchable: function () {
            return true;
        },
        /**
         * 显示新建文件夹
         */
        show_create_dir: function () {
            var temp_node, target_index = 0;
            // 还要判断当前重命名模块已就绪
            if (cur_node && rename.is_idle()) {
//                create_dir.render();
//                create_dir.show();
                // 先创建一个临时节点
                temp_node = file_factory.create('FileNode', {
                    is_dir: true,
                    id: '_TEMP_ONLY_FOR_CREATE_',
                    name: '', // 或可考虑改为“新建文件夹”，就和Microsoft Windows一样
                    is_tempcreate: true
                });
                // 找到第一个非固定节点（例如微信就属于固定节点，永远在普通目录前）
                target_index = file_list.get_prepend_dir_index();
                // 插入节点
                file_list.add_node(temp_node, false, cur_node.get_id(), target_index);

                this._update_list_view_status(null, null, false);

                // 定位并启用重命名
                this._ensure_visible(temp_node);
                rename.start_edit(temp_node, function (success, new_name, properties) {
                    var old_id;
                    if (success) { // 成功时，更新节点及UI
                        old_id = temp_node.mark_create_success(properties);
                        temp_node.set_tempcreate(false);
                        this.update_$item(temp_node, old_id);
                    } else { // 当重命名失败，即新建失败时，移除临时节点
                        // 有时立即删除的话，可能后面有其它逻辑会尝试找此节点从而出错。延迟使得删除在下个时间片执行
                        file_list.remove_nodes([temp_node]);
                    }

                    this._update_list_view_status(null, null, true);
                }, this);
            }
        },

        /**
         * 获取已选中的文件DOM列表
         */
        get_selected_$items: function () {
            return selection.get_selected_$items();
        },

        /**
         * 标记文件DOM被选中的（队列方式）
         * @param {Array<String>} file_ids
         */
        mark_items_selected: function (file_ids) {
            selected_ids = collections.array_to_set(file_ids);
        },

        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return all_file_map.get(file_id);
        },

        /**
         * 高亮指定文件ID元素
         * @param {Array<String>|String} file_ids
         */
        highlight_item: function (file_ids) {
            if (typeof file_ids === 'string') {
                file_ids = [file_ids];
            }

            var $items = this.get_$items(file_ids);
            if ($items.length) {
                $items.addClass('hilight');
                set_timeout(function () {
                    $items.removeClass('hilight');
                }, 6000);
            } else {
                highlight_ids = $.extend(highlight_ids, collections.array_to_set(file_ids));
            }
        },

        /**
         * 高亮元素
         * @param {Object<String, String>} id_set
         * @param {Array<FileNode>} files
         */
        highlight_items: function (id_set, files) {
            var me = this,
                items = [],
                highlighted = [];

            for (var i = 0, l = files.length; i < l; i++) {
                var file_id = files[i].get_id();
                if (file_id in id_set) {
                    var $item = me.get_$item(file_id);
                    if ($item) {
                        items.push($item[0]);
                        highlighted.push(file_id);
                    }
                }
            }

            var $items = $(items).addClass('hilight');
            set_timeout(function () {
                $items.removeClass('hilight');
            }, 6000);

            return highlighted;
        },

        /**
         * 显示、隐藏文件列表
         * @param {Boolean} visible
         */
        toggle: function (visible) {
            this._$views.toggle(visible);
        },

        is_batch_mode: function () {
            return is_batch_mode;
        },

        /**
         * 选中指定ID的文件元素
         * @param {String|jQuery|HTMLElement} arg
         */
        select_$item: function (arg) {
            if (this.is_activated() && ui_visible) {
                var $item = this.get_$item(arg);
                if ($item[0]) {
                    return selection.select_but($item);
                }
            }
            return false;
        },

        _get_sel_files: function () {
            var files = file_list.get_selected_files(),
                sort_meta = this._get_sort_meta(),
                sorted = cm.sort_datas([files], sort_meta.field, sort_meta.dir);
            return sorted[0] || [];
        },

        /**
         * 根据视图方式获取排序参数
         * @returns {{field: String, dir: String}}
         * @private
         */
        _get_sort_meta: function () {
            var view_name = view_switch.get_cur_view(),
                field, dir;

            switch (view_name) {
                case 'azlist':
                    field = 'name';
                    dir = 'asc';
                    break;
                case 'newestlist':
                case 'grid':
                    field = 'modify_time';
                    dir = 'desc';
                    break;
                case 'list':
                default:
                    field = 'name';
                    dir = 'asc';
                    break;
            }
            return {
                field: field,
                dir: dir
            };
        },

        // 分页逻辑
        _render_paging: function () {
            var
                item_width_thumb = 120,  // 文件元素宽度（缩略图）
                item_height_thumb = 101, // 文件元素高度（缩略图）
                item_width_list = 'auto',// 文件元素宽度（列表）
                item_height_list = 52;   // 文件元素高度（列表）

            paging_helper = new Paging_Helper({
                $container: this.get_$list_parent(),
                item_width: view_switch.is_grid_view() ? item_width_thumb : item_width_list,
                item_height: view_switch.is_grid_view() ? item_height_thumb : item_height_list,
                fixed_height: 0,
                is_list: view_switch.is_list_view()
            });

            if (constants.UI_VER === 'WEB') {
            this.listenTo(global_event, 'page_header_height_changed', function () {
                var height = main_ui.get_fixed_header_height();
                paging_helper.set_fixed_height(height);
            });
            }

            this.listenTo(view_switch, 'switch', function (is_grid, is_list) {
                paging_helper.set_item_width(is_grid ? item_width_thumb : item_width_list);
                paging_helper.set_item_height(is_grid ? item_height_thumb : item_height_list);
                paging_helper.set_is_list(is_list);
            });
        },

        // 进入目录、预览文件、下载文件
        _render_enter: function () {

            var me = this,
                is_enter_event = function (e) {
                    return !(e.ctrlKey || e.shiftKey || e.metaKey || !!$(e.target).closest('input, a, button, [data-function]')[0]); // 按下ctrl/shift点击时不打开目录、文件
                },

                enter_file = function (node, e) {
                    if (node.is_broken_file() || node.is_tempcreate()) {
                        return;
                    }

                    // 目录
                    if (node.is_dir()) {
                        file_list.load(node, true);
                    }
                    // 文件
                    else {
                        // 如果是可预览的文档，则执行预览操作
                        if (me.is_preview_doc(node)) {
                            me.appbox_preview(node).fail(function () { // @see ui_virtual.js
                                me.preview_doc(node);                   // @see ui_virtual.js
                            });
                            user_log('ITEM_CLICK_DOC_PREVIEW');
                            return;
                        }

                        // 如果是图片，则执行预览操作
                        if (node.is_image()) {
                            me.appbox_preview(node).fail(function () {
                                me.preview_image(node);
                            });
                            user_log('ITEM_CLICK_IMAGE_PREVIEW');
                            return;
                        }

                        // 压缩包预览
                        if (node.is_compress_file()) {
                            me.preview_zip_file(node);                   // @see ui_virtual.js
                            user_log('ITEM_CLICK_ZIP_PREVIEW');
                            return;
                        }

                        // 其他文件，下载
                        download_file(node, e);
                        user_log('ITEM_CLICK_DOWNLOAD');
                    }
                },

                download_file = function (node, e) {
                    // 未完成的文件才可下载
                    if (node.is_broken_file()) {
                        // do nothing
                    }
                    else {
                        if (downloader) {
                            downloader.down(node, e);
                        } else {
                            console.log('downloader未初始化 -- down_file事件不能促发下载');
                        }
                    }
                },

            // 点击文件、文件
                click_file_event = function (e) {
                    e.preventDefault();

                    if (is_batch_mode || !is_enter_event(e) || !ie_click_hacker.is_click_event(e)) {
                        return;
                    }

                    // 阻止选中文件
                    e.stopPropagation();

                    var node = me.get_file_by_$el(this);
                    enter_file(node, e);
                },

            // 勾选
                select_file_event = function (e) {
                    e.stopPropagation();  // 阻止默认点选行为

                    var file = me.get_file_by_$el(this);
                    if (file.get_ui().is_selectable()) {
                        var to_sel = !file.get_ui().is_selected();

                        selection.toggle_select([file], to_sel);
//                        selection.trigger_changed();

                        if (menu) {
                            menu.get_context_menu().hide();
                        }

                        // log
                        user_log(view_switch.is_list_view() ? 'ITEM_CLICK_LIST_CHECKBOX' : 'ITEM_CLICK_THUMB_CHECKBOX');
                    }
                },

            // 点击下载
                down_file_event = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var node = me.get_file_by_$el(this);
                    download_file(node, e);

                    // 修复IE下「下载」按钮点击后样式保持在按下状态的bug
                    $(e.target).toggle().toggle();
                };

            var $lists = this.get_$lists();

            $lists
                .off('click.file_list', '[data-action="enter"]')
                .on('click.file_list', '[data-action="enter"]', click_file_event);

            // 选择模式下，点击checkbox勾选，而不是进入
            if (check_mode) {
                $lists
                    .off('click.file_list_ck', '[data-file-check]')
                    .on('click.file_list_ck', '[data-file-check]', select_file_event)
            }

            $lists
                .off('click.file_list', '[data-function=download]')
                .on('click.file_list', '[data-function=download]', down_file_event);
        },

        // 文件删除模块
        _render_remove: function () {

            var me = this;

            // 删除文件模块
            remove = require('./file_list.file_processor.remove.remove');
            remove.render();

            // 删除事件
            me.get_$lists().on('click.file_list', '[data-function="remove"]', function (e) {
                e.preventDefault();

                var node = me.get_file_by_$el(this);
                remove.remove_confirm([node]);
            });
        },

        // 文件移动模块
        _render_move: function () {

            var me = this;

            move = require('./file_list.file_processor.move.move');
            move.render();

            // 点击移动按钮
            this.get_$lists().on('click.file_list', '[data-function="move"]', function (e) {
                e.preventDefault();

                var node = me.get_file_by_$el(this);
                move.show_move_to([node]);
            });

            // 拖拽并丢放文件
            this.listenTo(disk_event, 'drag_and_drop_files_to', function (target_dir_id) {
                var files = me._get_sel_files(),
                    target_node = all_file_map.get(target_dir_id);

                // 判断是否允许丢放
                if (target_node.is_droppable()) {
                    move.start_move(files, target_node.get_parent().get_id(), target_node.get_id(), 'disk_drag_file_move');
                }
            })
        },

        // 文件选择、移动模块
        _render_selection: function () {
            selection = require('./file_list.selection.selection');
            selection.render({
                lists: this.get_$lists(),
                drop_list: this.get_$dir_list()
            });

            var me = this;

            // 勾选模式
            if (check_mode) {
                selection.set_batch_mode(false, '[data-no-sel]');
                selection.enable_dragdrop('[data-no-sel]');

                // 全选事件
                me
                    .listenTo(all_checker, 'toggle_check', function (to_check) {
                        var node = file_list.get_cur_node(),
                            files;
                        if (node && (files = node.get_kid_nodes())) {
                            selection.toggle_select(files, to_check);
                        }

                        // log
                        user_log('DISK_TBAR_ALL_CHECK');
                    })

                    // 手动选中文件
                    .listenTo(selection, 'select_change', function (sel_meta) {
                        // 更新全选按钮状态
                        all_checker.toggle_check(sel_meta.is_all);

                        // 更新工具栏按钮的显示状态
                        this.update_tbar(false, sel_meta.files);
                    })

                    // 插入DOM时，全选状态下自动选中
                    .on('add_$items', function (files) {
                        var file = files[0];
                        if (file && file.get_ui().is_selected() && !file.is_tempcreate()) {
                            selection.update_ui_selection(files);
                        }
                    })

                    // 删除文件后，如果当前目录下已无文件，则取消全选
                    .listenTo(file_list, 'after_nodes_removed', function (files) {
                        // 更新全选按钮状态
                        if (files.length && all_checker.is_checked() && !cur_node.has_nodes()) {
                            all_checker.toggle_check(false);
                        }
                    });


                // 激活 ui_normal 时，增加 selection-view 类以显示列表为checkbox勾选操作模式
                this.on('show', function () {
                    disk_ui.get_$body().addClass('selection-view');
                });
                if (ui_visible === true) {
                    disk_ui.get_$body().addClass('selection-view');
                }

            }

            this
                // 添加文件DOM后，更新其dragdrop状态
                .on('add_$items update_$item', function (files) {
                    files = [].concat(files);
                    if (!is_batch_mode) {

                        var drag_els = [], // 文件 + 目录
                            drop_els = []; // 目录
                        $.each(files, function (i, f) {
                            var item_el = me.get_$item(f.get_id())[0];
                            if (item_el) {
                                drag_els.push(item_el);
                                if (f.is_droppable()) {
                                    drop_els.push(item_el);
                                }
                            }
                        });

                        var $drag_els = $(drag_els),
                            $drop_els = $(drop_els);

                        selection.refresh_drag($drag_els);
                        selection.refresh_drop($drop_els);
                        selection.refresh_selection();
                    }
                })

                // 批量模式下禁用拖拽
                .on('on_batch_mode', function (is_batch, op_type, without) {
                    selection.set_batch_mode(is_batch, without);
                    if (is_batch) {
                        selection.disable_dragdrop();
                    } else {
                        selection.enable_dragdrop(without);
                    }
                })

                .on('show', function () {
                    selection.enable_selection();

                    // 批量模式禁用拖拽
                    if (is_batch_mode) {
                        selection.disable_dragdrop();
                    } else {
                        selection.enable_dragdrop();
                    }
                })
                .on('hide', function () {
                    selection.disable_selection();
                    selection.disable_dragdrop();
                });

            // file_list/ui 被隐藏时，禁用框选和拖拽
            this
                .listenTo(file_list_ui, 'activate', function () {
                    if (/*this.is_activated() && */ui_visible) {  // 这个this.is_activated()判断应该用不上 james
                        selection.enable_selection();

                        // 批量模式禁用拖拽
                        if (is_batch_mode) {
                            selection.disable_dragdrop();
                        } else {
                            selection.enable_dragdrop();
                        }
                    }
                })
                .listenTo(file_list_ui, 'deactivate', function () {
                    selection.disable_selection();
                    selection.disable_dragdrop();
                });

            // 排序后清除选中
//            this.on('sorted', function () {
//                selection.clear();
//            });

            // 按下ctrl键时，给body增加 ctrl-key-pressed 类，鼠标移动至文件列表上时cursor会显示为默认，而不是可点击状态
            $(document)
                .on('keydown', function (e) {
                    if (e.ctrlKey || e.shiftKey) {
                        $body.addClass('ctrl-shift-pressed');
                    }
                })
                .on('keyup', function (e) {
                    if (e.which === 17 || e.which === 16) {
                        $body.removeClass('ctrl-shift-pressed');
                    }
                })
                .on('mouseenter', function (e) {
                    if (!e.ctrlKey && !e.shiftKey) {
                        $body.removeClass('ctrl-shift-pressed');
                    }
                });
        },

        // 下载
        _render_down: function () {
            require.async('downloader', function (mod) { //异步加载downloader
                downloader = mod;
            });
        },

        // 拖拽下载
        _render_drag_down: function () {
            // APPBOX 拖拽下载
            if (constants.IS_APPBOX) {
                var mouseleave = 'mouseleave.file_list_ddd_files';

                this
                    // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                    .listenTo(selection, 'before_drag_files', function ($cur_item, cur_file, $sel_items, files) {

                        $body
                            .off(mouseleave)
                            .one(mouseleave, function (e) {

                                // 取消拖拽动作（取消移动文件动作）
                                selection.cancel_drag();

                                // 下载
                                if (downloader) {
                                    // 启动拖拽下载
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                } else {
                                    console.log('downloader未初始化 -- 拖拽下载 不能触发');
                                }
                            });
                    })
                    // 拖拽停止时取消上面的事件
                    .listenTo(selection, 'stop_drag', function () {
                        $body.off(mouseleave);
                    });
            }

            this.listenTo(file_list, 'rebuild_file_list', function () {
                // 取消拖拽动作
                selection.cancel_drag();
            });
        },

        // 菜单模块
        _render_menu: function () {

            // 菜单模块
            menu.render();

            var me = this;

            var enable_menu = function () {

                disable_menu();

                var ctxt_menu = menu.get_context_menu();
                me
                    // 菜单显示时给item标记
                    .listenTo(ctxt_menu, 'show_on', function (el) {
                        this.mark_menu_on(el);
                    })
                    // 菜单 隐藏时去掉标记
                    .listenTo(ctxt_menu, 'hide', function () {
                        this.clear_menu_mark();
                    });

                // 文件的"更多"菜单
                me.get_$file_list()
                    .on('click.file_list', '[data-function="more"]', function (e) {
                        e.preventDefault();

                        var $on_el = $(this);
                        // var $item = $on_el.closest('[data-file-id]');

                        // 清除非当前文件的选中
                        // if (selection.select_but($item)) {
                        menu.show_more_menu($on_el);
                        // } // 现在不再更改文件的选中状态 james
                    });


                // 右键菜单 ----------------------------------
                me.get_$lists()
                    .off('mousedown.file_list_context_menu')// contextmenu.file_list_context_menu')
                    .on('mousedown.file_list_context_menu'/* contextmenu.file_list_context_menu'*/, '[data-file-id]', function (e) {
                        //code by bondli 增加e.which===0的时候也是右键，这个是因为IE6/7/8下装了soso工具栏导致的bug
                        if (e.which === 3 || e.which === 0) { // 右键

                            // 点击的不是功能按钮才处理
                            if ($(e.target).closest('input, textarea, [data-function]').length == 0) {
                                var can_show = true,
                                    $on_item = $(this);

                                // - 在已选中的文件上点击时, 不作任何改变
                                if (selection.is_selected($on_item)) {
                                    can_show = true;
                                }

                                // - 在未选中的文件上点击时, 选中该文件, 并清除其他选中
                                else {
                                    // 如果选中成功, 则允许显示
                                    can_show = selection.select_but($on_item);
                                }

                                if (can_show) {
                                    e.stopImmediatePropagation();
                                    menu.show_context_menu(e.pageX, e.pageY, $on_item);
                                    user_log('RIGHTKEY_MENU');
                                }

                                // 如果是 contextmenu 事件，则阻止浏览器默认菜单
                                if (e.handleObj.type === 'contextmenu') {
                                    e.preventDefault();
                                }
                            }

                        }
                    });
            };

            var disable_menu = function () {
                me.stopListening(menu.get_context_menu());

                // 文件的"更多"菜单
                me.get_$file_list().off('click.file_list', '[data-function="more"]');

                // 右键菜单 ----------------------------------
                me.get_$lists()
                    .off('mousedown.file_list_context_menu'/* contextmenu.file_list_context_menu'*/);
            };

            var toggle_enable_menu = function (is_batch_mode) {
                if (is_batch_mode) {
                    disable_menu();
                } else {
                    enable_menu();
                }
            };

            me.on('on_batch_mode', toggle_enable_menu);

            // 切换视图后排序
            me.listenTo(view_switch, 'switch', function () {
                if (this.is_activated() && ui_visible) {
                    this._update_list_view_status();
                    // 排序改变
                    var sort_meta = me._get_sort_meta();
                    cm.sort(sort_meta.field, sort_meta.dir);

                    // 切换视图后重绘
                    var node = file_list.get_cur_node();
                    me._set_$items(node, node, node.get_kid_dirs(), node.get_kid_files());
                }
            });

            toggle_enable_menu(is_batch_mode);
        },

        // 文件列表头部模块
        _render_column_header: function ($column_model_to) {
            ColumnModel = common.get('./ui.column_model.column_model');

            cm = new ColumnModel({
                el: $column_model_to,
                cols: [
                    { field: 'name', klass: 'filename', title: _('名称'), val_get: function (it) {
                        return it.get_name().toLowerCase();
                    } },
                    { field: 'modify_time', klass: 'datetime', title: _('更新时间'), val_get: function (it) {
                        return it.get_modify_time();
                    } },
                    { field: 'size', klass: 'size', title: _('大小'), val_get: function (it) {
                        return it.get_size();
                    } }
                ],
                default_field: 'modify_time',
                default_order: 'desc',
                visible: false,
                klass: '',
                get_datas: function (field) {
                    var node = file_list.get_cur_node();
                    // 对两个集合进行排序
                    if (node) {
                        var dirs_data = node.get_kid_dirs(),
                            files_data = node.get_kid_files();

                        // 目录不参与「大小」的排序
                        if (field === 'size') {
                            dirs_data = [];
                        }

                        return [dirs_data, files_data];
                    }
                    return [];
                },
                // 有些特殊节点的排序也要特殊处理，例如微信节点就要永远在前。
                before_comparator: function (node1, node2) {
                    // sortable为false的节点优先级最高，永远在最前，同时它们之间也固定顺序。其它节点照常
                    var fixed1 = !node1.is_sortable(),
                        fixed2 = !node2.is_sortable();
                    if (fixed1) {
                        if (fixed2) {
                            return false; // 同为固定节点，顺序不变，同时中止后续ColumnModel比较
                        }
                        return -1; // 固定节点优先于普通节点，node1 在 node2 之前
                    } else {
                        if (fixed2) {
                            return 1; // 固定节点优先于普通节点，node1 在 node2 之后
                        }
                        return 0; // 同为非固定节点，交给后续ColumnModel比较方法
                    }
                }
            });
            cm.render();

            // 排序后也会返回两个集合
            this.listenTo(cm, 'sorted', function (datas, field) {
                this.trigger('sorted');

                var dirs = datas[0],
                    files = datas[1],
                    node = file_list.get_cur_node();

                if (node) {
                    // 虚拟目录、目录不参与「大小」的排序
                    if (field === 'size') {
                        dirs = node.get_kid_dirs();
                    }

                    // 更新缓存
                    node.set_nodes(dirs, files);
                }
            });

            // 显示列表头 ----------------------------------
//            this.listenTo(file_list, 'load', function () {
//                this.toggle_column_model(view_switch.is_list_view());
//            });
        },

        // 文件重命名模块
        _render_rename: function () {

            var me = this;

            me
                // 在服务器返回响应之前，临时显示一下
                .listenTo(rename, 'temp_save', function (node, new_name) {
                    if (node.get_name() !== new_name) {
                        this.show_$item_name(node, new_name);
                    }
                })
                // 修改完成，或取消修改后的回调
                .listenTo(rename, 'done', function (node, new_name) {
                    if (node.is_tempcreate()) { // 对于创建操作，直接在回调中处理后续流程，与重命名的更新分开。因为会涉及到id更新
                        return;
                    }
                    // 如果名称发生了变化，则重建文件DOM
                    if (node.get_name() !== new_name) {
                        node.set_name(new_name);
                        this.update_$item(node);
                    }
                    // 如果名称未变化，则显示文件名即可
                    else {
                        this.show_$item_name(node, node.get_name());
                    }
                })
                // 无效的修改操作，显示原文件名
                .listenTo(rename, 'deny', function (node) {
                    this.show_$item_name(node, node.get_name());
                });

            // 目录重命名
            this.get_$lists()
                .on('click.file_list', '[data-function="rename"]', function (e) {
                    e.preventDefault();

                    var node = me.get_file_by_$el(this);
                    rename.start_edit(node);
                });
        },

        // 缩略图
        _render_thumb: function () {
            var me = this;

            var Thumb = require('./file_list.thumb.thumb');
            thumb = new Thumb();

            me
                // 文件列表增加文件DOM后刷新缩略图
                .on('add_$items set_$items update_$item', function (files) {
                    thumb.push(files);
                })

                // 加载成功后显示图片
                .listenTo(thumb, 'get_image_ok', function (file, img) {
                    set_image(file, img);
                });


            var default_images = {
                    'http://imgcache.qq.com/vipstyle/nr/box/img/img-70.png': 1,
                    'http://imgcache.qq.com/vipstyle/nr/box/img/img-32.png': 1
                },
                copy_attr_list = { unselectable: 1 },
                set_image = function (file, img) {
                    var $item = me.get_$item(file.get_id());
                    var $icon = $item.find('i[data-ico]');
                    if ($icon[0]) {
                        var $img_copy = $(img).clone();

                        $.each($icon[0].attributes, function (i, attr) {
                            if (attr.nodeName.indexOf('data-') === 0) {
                                $img_copy.attr(attr.nodeName, $icon.attr(attr.nodeName));
                            }
                        });
                        $.each(copy_attr_list, function (attr_name) {
                            $img_copy.attr(attr_name, $icon.attr(attr_name));
                        });

                        $img_copy[0].className = $icon[0].className;
                        $img_copy[0].style.cssText = $icon[0].style.cssText;
                        $img_copy.addClass('default');
                        $img_copy.attr('unselectable', 'on');

                        $icon.replaceWith($img_copy);
                    }
                };
        },

        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.get_$lists()
                    .on('mouseenter', '>div', function () {
                        $(this).addClass(hover_class);
                    })
                    .on('mouseleave', '>div', function () {
                        $(this).removeClass(hover_class);
                    });
            }
        },

        _render_hightlight: function () {
            this
                // 追加元素后，高亮相应文件
                .on('add_$items', function (files) {
                    if (!$.isEmptyObject(highlight_ids)) {
                        var highlighted = this.highlight_items(highlight_ids, files);

                        // 剔除已高亮的文件
                        for (var i = 0, l = highlighted.length; i < l; i++) {
                            delete highlight_ids[highlighted[i]];
                        }
                    }
                });
        },

        _render_toolbar: function () {
            var ui = this;
            this.update_tbar(false);
            this
                // 动态工具栏事件
                .listenTo(tbar, {
                    // 新建文件夹
                    mkdir: function (e) {
                        ui.show_create_dir();
                        user_log('TOOLBAR_MANAGE_MKDIR');
                    },
                    // 打包下载
                    pack_down: function (e) {
                        var files = ui._get_sel_files();
                        if (downloader && files.length) {
                            downloader.down(files, e);
                        }
                        user_log('TOOLBAR_DOWNLOAD');
                    },
                    // 链接分享
                    link_share: function (e) {
                        var share = require('./file_list.share.share'),
                            files = ui._get_sel_files();
                        if (files.length) {
                            var err = share.is_link_sharable(files);
                            if (!err) {
                                share.link_share(files);
                            } else {
                                mini_tip.warn(err);
                            }
                        }
                    },
                    // 邮件分享
                    mail_share: function (e) {
                        var share = require('./file_list.share.share'),
                            file = ui._get_sel_files()[0];
                        if (file) {
                            // 判断是否允许分享
                            var err = share.is_sharable(file);
                            if (!err) {
                                var share_url = share.get_mail_url(file);
                                window.open(share_url);
                            }
                        }
                    },
                    // 删除
                    del: function (e) {
                        var files = ui._get_sel_files();
                        if (files.length) {
                            remove.remove_confirm(files, 'TOOLBAR_MANAGE_DELETE');
                        }
                    },
                    // 移动
                    move: function (e) {
                        var files = ui._get_sel_files();
                        if (files.length) {
                            if (move) {
                                move.show_move_to(files, 'TOOLBAR_MANAGE_MOVE');
                            }
                        }
                    },
                    // 重命名
                    rename: function (e) {
                        var files = ui._get_sel_files();
                        if (files.length) {
                            rename.start_edit(files[0]);
                            // TODO 统计码
                        }
                    }
                });
        },

        // 列表中的分享菜单
        _render_share: function () {
            var me = this,
                hover_timer;

            me.get_$lists()
                // 分享菜单
                .on('mouseenter', '[data-function="share"]', function (e) {
                    clearTimeout(hover_timer);

                    menu.show_share_menu(this);
                })
                .on('mouseleave', '[data-function="share"]', function (e) {
                    hover_timer = setTimeout(function () {
                        menu.hide_share_menu();
                    }, 200);
                })
                .on('click', '[data-function="share"]', function (e) {
                    e.preventDefault();
                    menu.show_share_menu(this);
                });


            var share_menu = menu.get_share_menu();
            me.listenTo(share_menu, {
                mouseenter: function () {
                    clearTimeout(hover_timer);
                },
                mouseleave: function () {
                    hover_timer = setTimeout(function () {
                        menu.hide_share_menu();
                    }, 200);
                },
                // 菜单显示时给item标记
                show_on: function (el) {
                    this.mark_menu_on(el);
                },
                // 菜单 隐藏时去掉标记
                hide: function () {
                    this.clear_menu_mark();
                }
            });
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
                    downloader = downloader_mod,
                // 当前目录下的图片
                    images = $.grep(file.get_parent().get_kid_files(), function (file) {
                        return file.is_image();
                    }),

                    sort_meta = me._get_sort_meta();

                // 排序
                images = cm.sort_datas([images], sort_meta.field, sort_meta.dir)[0];

                // 当前图片所在的索引位置
                var index = $.inArray(file, images);

                image_preview.start({
                    support_nav: true,
                    total: images.length,
                    index: index,
                    get_url: function (index) {
                        var file = images[index];
                        return file && file.is_on_tree() ? downloader.get_down_url(file, { abs: '640*640' }) : null;
                    },
                    download: function (index, e) {
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            downloader.down(file, e);
                        }
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            var remover = remove.remove_confirm([file], null, false);
                            remover.on('has_ok', function (removed_file_ids) {
                                // 从images中排除
                                var file_id = removed_file_ids[0];
                                for (var i = 0, l = images.length; i < l; i++) {
                                    if (file_id === images[i].get_id()) {
                                        images.splice(i, 1);
                                        break;
                                    }
                                }

                                callback();
                            });
                        } else {
                            callback();
                        }
                    }/*,
                     raw: function (index) {
                     var file = images[index];
                     return downloader.get_down_url(file, {
                     abs: 2000
                     });
                     }*/
                });
            });
        },

        /**
         * 获取可选择的文件个数
         * @return {Number}
         * @private
         */
        _get_selectable_count: function () {
            var count = 0,
                node = file_list.get_cur_node(), files;

            if (!node || !(files = node.get_kid_nodes())) {
                return count;
            }

            for (var i = 0, l = files.length; i < l; i++) {
                if (files[i].get_ui().is_selectable()) {
                    count++;
                }
            }
            return count;
        },

        _last_has_dirs: undefined,
        _last_has_files: undefined,
        _last_is_grid_view: undefined,
        _last_show_empty_tip: undefined,

        /**
         * 更新列表显示状态（是否显示列表子标题、是否显示文件列表、是否显示目录列表、是否显示空提示）
         * @param {Boolean|Null} [_has_dirs] 是否主观认为有目录，默认false
         * @param {Boolean|Null} [_has_files] 是否主观认为有文件，默认false
         * @param {Boolean|Null} [show_empty_tip] 是否显示空提示，默认true
         */
        _update_list_view_status: function (_has_dirs, _has_files, show_empty_tip) {
            if (!this.is_rendered()) return;

            var
                is_grid_view = view_switch.is_grid_view(),

            // 真的有目录，而不是主观认为有目录（新建文件夹时，如果没有真的文件夹，则需要假装一个有目录的情况）
                real_has_dirs = cur_node && cur_node.get_kid_dirs() && cur_node.get_kid_dirs().length > 0,
                real_has_files = cur_node && cur_node.get_kid_files() && cur_node.get_kid_files().length > 0,

                has_dirs = !!(typeof _has_dirs === 'boolean' ? _has_dirs : real_has_dirs),
                has_files = !!(typeof _has_files === 'boolean' ? _has_files : real_has_files);

            // show_empty_tip = show_empty_tip !== false;

            if (this._last_has_dirs !== has_dirs || this._last_has_files !== has_files || this._last_is_grid_view !== is_grid_view || this._last_show_empty_tip !== show_empty_tip) {

                // 如果无文件或无目录,则隐藏两者的子标题
                this.get_$list_sub_titles().toggle(is_grid_view && has_files && has_dirs);

                // 如果无文件，则隐藏文件列表；无目录，则隐藏目录列表
                this.get_$file_list().toggle(has_files);
                this.get_$dir_list().toggle(has_dirs);

                // 如果无文件和目录,则显示空提示
                if (typeof show_empty_tip === 'boolean') {
                    if (show_empty_tip !== false) {
                        this.get_$no_files_tip().toggle(!has_files && !has_dirs);
                    } else {
                        this.get_$no_files_tip().hide();
                    }
                }

                this._last_has_dirs = has_dirs;
                this._last_has_files = has_files;
                this._last_is_grid_view = is_grid_view;
                this._last_show_empty_tip = show_empty_tip;
            }
        }
    });


    // 非批量模式下，才可拖拽上传
    // 虚拟目录下，不可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        var cur_node = file_list.get_cur_node();
        return !is_batch_mode && cur_node.is_dir() && !cur_node.is_vir_dir();
    });

    return ui_normal;
});/**
 * 虚拟目录UI逻辑
 * @author jameszuo
 * @date 13-6-28
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./file_list.ui_virtual",["weixin_css","lib","common","i18n","$","./tmpl","./view_switch.view_switch","./file_list.ui_abstract","./file.file_node","./file.utils.all_file_map","./file_list.file_list","./file_list.ui","./ui","./toolbar.tbar","./file_path.all_checker","./file_list.file_processor.vir_remove.vir_remove","./file_list.thumb.thumb"],function (require, exports, module) {

    require('weixin_css');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        date_time = lib.get('./date_time'),
        easing = lib.get('./ui.easing'),
        security = lib.get('./security'),

        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        PagingHelper = common.get('./ui.paging_helper'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        view_switch = require('./view_switch.view_switch'),
        FileListUIAbstract = require('./file_list.ui_abstract'),
        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),
        file_list = require('./file_list.file_list'),
        file_list_ui = require('./file_list.ui'),
        disk_ui = require('./ui'),

        tbar = require('./toolbar.tbar'),
        all_checker = require('./file_path.all_checker'),

        cur_node,
        thumb,
        vir_remove,
        downloader,
        page_helper,

        $list_to, // 列表父容器
        $cur_view, // 当前所使用的界面（特殊界面 or 经典界面）
        $sub_view, //
        $cur_dir_list, // 目录
        $cur_file_list, // 文件
        $cur_empty_tip, // 空提示
        $all_list,
        $cur_pager,

        $voice_player, // 语音播放元素

        playing_voice, // 正在播放的文件
        cur_is_classic = false, // 当前是否是经典界面
        appended_ids = {}, // 已添加到DOM中的文件ID
        cur_total = 0, // 当前目录文件的总个数

        ui_visible,

        doc = document, $body,
        parse_int = parseInt,

    // URL匹配正则
        re_url = new RegExp("((http|https|ftp)\\:\\/\\/|\\bw{3}\\.)[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z\\u00C0-\\u017F0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*", 'gi'),
    // URL协议头
        re_protocol = /^(?:(?:http|https|ftp):\/\/)/i,
    // 全角字符
        re_double_words = /[^\x00-\xFF]/,

        undefined;

    var ui_virtual = new FileListUIAbstract('disk_file_list_ui_virtual', {

        render: function (_$list_to) {

            // 文件列表主体
            _$list_to.append(tmpl.vir_dir_file_list({ empty_text: _('没有了') }));

            $list_to = _$list_to;

            $body = $(doc.body);

            require.async('downloader', function (mod) {
                downloader = mod;
            });

            // 缩略图
            this._render_thumb();
            // 分页
            this._render_pager();
            // 勾选
            this._render_selection();
        },

        // 变更指向的目录
        enter_dir: function (node) {
            cur_node = node;

            // 目前只有包含图片或视频的目录需要使用缩略图模式
            var is_thumb = node.has_image() || node.has_video();
            is_thumb ? view_switch.temp_to_thumb() : view_switch.temp_to_list();

            file_list_ui.list_height_changed();
        },

        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            if (cur_node !== new_node) {
                this._clear_$items(true);

                if (thumb)
                    thumb.clear_queue();

                // 退出临时视图
                view_switch.exit_temp_view();

                // 加载更多按钮
                this._update_pager();

                // 隐藏空提示
                $cur_empty_tip.hide();
            }
        },

        set_node_data: function (node, last_node, dirs, files, is_reload, total) {
            cur_node = node;
            cur_total = total;

            // 更新“加载更多”按钮
            this._update_pager(total);

            if (is_reload) {
                this._set_$items(dirs, files);
            } else {
                // 追加到列表中
                this.append_$items(dirs, files);
                this._loading(false);
            }

            // 更新视图
            this._update_list_view_status(true);
        },

        show: function () {
            // 除文字、语音或文章的目录以外，使用经典界面
            var is_classic = cur_is_classic = !(cur_node.has_text() || cur_node.has_voice() || cur_node.has_article() || cur_node.has_image() || cur_node.has_video());

            $cur_view = $list_to.children('[data-view=' + (is_classic ? 'classic' : 'special') + ']'); // 经典界面（如微信目录、图片视频目录） // 特殊界面（如文章、语音文字等）

            if (is_classic) {
                $cur_dir_list = $cur_view.find('[data-type=dir]'); // 经典界面的目录
                $cur_file_list = $cur_view.find('[data-type=file]'); // 经典界面的文件
                $sub_view = null;
            } else {
                $sub_view = $cur_view.children('[data-sub-view="' + (this.is_thumb_view(cur_node) ? 'thumb' : 'list') + '"]');
                $cur_dir_list = $sub_view.children('[data-type=dir]');
                $cur_file_list = $sub_view.children('[data-type=file]');
            }
            $cur_empty_tip = $cur_view.find('[data-action=empty-tip]');
            $all_list = $cur_dir_list.add($cur_file_list);
            $cur_pager = $cur_view.find('[data-action="more"]');

            $cur_view.siblings('[data-view]').hide();
            if ($sub_view) {
                $sub_view.siblings('[data-sub-view]').hide();
            }

            // 一些class
            $body.toggleClass('app-chat', cur_node.has_text() || cur_node.has_voice()).toggleClass('app-blog', cur_node.has_article());

            // 渲染打开行为
            this._render_enter();
            // 删除
            this._render_remove();
            // IE6 fix
            this._render_ie6();

            $cur_view.show();
            if ($sub_view) {
                $sub_view.show();
            }

            if (all_checker) {
                // 隐藏全选
                all_checker.hide();
            }

            this.trigger('show');

            ui_visible = true;

        },

        hide: function () {
            $cur_view.hide();
            if ($sub_view) {
                $sub_view.hide();
            }

            $cur_view = $sub_view = $cur_dir_list = $cur_file_list = $cur_empty_tip = $all_list = $cur_pager = null;

            this.trigger('hide');

            ui_visible = false;
        },

        /**
         * 在列表后方追加元素
         * @param {Array<FileNode>} dirs
         * @param {Array<FileNode>} files
         */
        append_$items: function (dirs, files) {
            var me = this,
            // 替换已存在于DOM中的文件
                filter = function (file) {
                    if (appended_ids[file.get_id()]) {
                        me._update_$item(file);
                    } else {
                        return true;
                    }
                };

            dirs = $.grep(dirs, filter);
            files = $.grep(files, filter);

            if (dirs.length) {
                var dirs_html = tmpl.vir_dir_file_item({ files: dirs, icon_map: this.get_icon_map() }); // get_icon_map in "ui_abstract.js"
                $cur_dir_list.append(dirs_html);

                $.each(dirs, function (i, file) {
                    appended_ids[file.get_id()] = 1;
                });
            }

            if (files.length) {
                var files_html = tmpl.vir_dir_file_item({ files: files, icon_map: this.get_icon_map() });
                $cur_file_list.append(files_html);

                $.each(files, function (i, file) {
                    appended_ids[file.get_id()] = 1;
                });
            }

            this.trigger('add_$items', files);
        },

        /**
         * 删除文件DOM
         * @param {FileNode} file_nodes
         * @param {Boolean} animate 动画(只支持单文件)
         */
        remove_$items: function (file_nodes, animate) {
            if (!file_nodes || !file_nodes.length)
                return;


            var me = this,
                remove_fn = function (ids) {
                    $.each(ids, function (i, id) {
                        delete appended_ids[id];
                    });
                    $(this).remove();
                    me.trigger('remove_$items');
                    me._update_list_view_status(true);
                };

            if (file_nodes.length == 1) {
                var first = file_nodes[0],
                    id = first.get_id(),
                    $item = me.get_$item(id);

                if (animate) {
                    $item.fadeOut('fast', remove_fn);
                } else {
                    remove_fn.call($item, [id]);
                }
            } else {

                var ids;
                if (FileNode.is_instance(file_nodes[0])) {
                    ids = collections.map(file_nodes, function (file) {
                        return file.get_id();
                    });
                } else {
                    ids = file_nodes;
                }

                var items = [];
                $.each(ids, function (i, id) {
                    var item = me.get_$item(id)[0];
                    if (item) {
                        items.push(item);
                    }
                });
                remove_fn.call(items, ids);
            }
        },

        /**
         * 是否可以切换视图模式
         */
        is_view_switchable: function () {
            return false;
        },

        /**
         * 当前是否是缩略图模式
         */
        is_thumb_view: function (node) {
            return !!node && node.has_image() || node.has_video();
        },

        // ====== 私有成员 =====================================================================

        _update_$item: function (node) {
            var $item = this._get_$item(node);
            if ($item) {
                $item.replaceWith(tmpl.vir_dir_file_item({ files: [node], icon_map: this.get_icon_map() }));
                console.log('update_$item ok -> ' + node.get_id());

                this.trigger('update_$item', node);
            }
        },

        _set_$items: function (dirs, files) {
            this._clear_$items(true);
            this.append_$items(dirs, files);
        },

        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         */
        _clear_$items: function (silent) {
            if (!this.is_rendered()) return;

            if ($all_list)
                $all_list.empty();

            appended_ids = {};

            if (!silent) {
                this.trigger('clear_$items');
                this._update_list_view_status(true);
            }
        },

        /**
         * 加载若干个文件
         * @param {Number} [size] 默认动态计算
         * @private
         * @return {jQuery.Deferred}
         */
        _load_more: function (size) {
            var offset = cur_node.get_kid_nodes() ? cur_node.get_kid_nodes().length : 0;
            if (offset < cur_total) {
                size = size || this._get_page_size(cur_node);
                return file_list.load_vir_dir(cur_node, offset, size);
            }
        },

        // 打开目录、播放语音、预览文章、预览图片、播放视频等
        _render_enter: function () {
            var me = this,
                is_enter_event = function (e) {
                    return !(e.ctrlKey || e.shiftKey || e.metaKey || !!$(e.target).closest('input, a, button, [data-function]')[0]); // 按下ctrl/shift点击时不打开目录、文件
                },
                enter_file = function (node, e) {
                    // 目录
                    if (node.is_dir()) {
                        file_list.load_vir_dir(node, 0, me._get_page_size(node));
                    }
                    // 文件
                    else {
                        // 未完成的文件才可打开
                        if (node.is_broken_file()) {
                            // do nothing
                        }
                        else {
                            // 文章
                            if (node.class_name === 'ArticleNode') {
                                require.async('third_party_iframe', function (m) {
                                    var third_party_iframe = m.get('./third_party_iframe');
                                    var preview = third_party_iframe.create_preview({
                                        //title: node.get_title(),
                                        url: node.get_raw_url()
                                    });
                                    preview.show();
                                });
                                return;
                            }

                            // 如果是可预览的文档，则执行预览操作
                            if (me.is_preview_doc(node)) {
                                me.appbox_preview(node).fail(function () { // @see ui_virtual.js
                                    me.preview_doc(node);                   // @see ui_virtual.js
                                });
                                user_log('ITEM_CLICK_DOC_PREVIEW');
                                return;
                            }

                            // 如果是图片，则执行预览操作
                            if (node.is_image()) {
                                me.appbox_preview(node).fail(function () {
                                    me.preview_image(node);
                                });
                                user_log('ITEM_CLICK_IMAGE_PREVIEW');
                                return;
                            }

                            // 压缩包预览
                            if (node.is_compress_file()) {
                                me.preview_zip_file(node);                   // @see ui_virtual.js
                                user_log('ITEM_CLICK_ZIP_PREVIEW');
                                return;
                            }

                            // 其他文件，下载
                            download_file(node, e);
                            user_log('ITEM_CLICK_DOWNLOAD');
                        }
                    }
                },
                download_file = function (node, e) {
                    // 未完成的文件才可下载
                    if (node.is_broken_file()) {
                        // do nothing
                    }
                    else {
                        if (downloader) {
                            var url = me._get_down_url(node, false);

                            downloader.down_url(url, node.get_name(), node.get_size());
                        } else {
                            console.log('downloader未初始化 -- down_file事件不能促发下载');
                        }
                    }
                },

            // 点击文件、文件
                click_file_event = function (e) {
                    e.preventDefault();

                    if (!is_enter_event(e) || !ie_click_hacker.is_click_event(e)) {
                        return;
                    }

                    var node = me._get_file_by_$el(this);
                    enter_file(node, e);
                },

            // 点击下载
                down_file_event = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var node = me._get_file_by_$el(this);
                    download_file(node, e);

                    // 修复IE下「下载」按钮点击后样式保持在按下状态的bug
                    $(e.target).toggle().toggle();
                },
             //点击来源
                to_newsurl_event = function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var node = me._get_file_by_$el(this);
                    var url="http://wx.cgi.weiyun.com/tnews_picupload.fcg?" +
                        "cmd=get_news_url&fileid="+node.get_id();
                    window.open(url);
                };

            // 各种打开
            $all_list
                .off('click.file_list', '[data-action="enter"]')
                .on('click.file_list', '[data-action="enter"]', click_file_event);

            $cur_file_list
                // 下载
                .off('click.file_list', '[data-action=download]')
                .on('click.file_list', '[data-action=download]', down_file_event)
                // 来源
                .off('click.file_list', '[data-action=newsurl]')
                .on('click.file_list', '[data-action=newsurl]', to_newsurl_event)
                // 文字展开、收起
                .off('click.file_list', '[data-action="text-expand"],[data-action="text-collapse"]')
                .on('click.file_list', '[data-action="text-expand"],[data-action="text-collapse"]', function (e) {
                    e.preventDefault();
                    var expand = $(this).attr('data-action') === 'text-expand';

                    me._toggle_text_expand($(this).closest('[data-file-id]').attr('data-file-id'), expand);

                    $(this).text(expand ? _('点击收起') : _('点击展开')).attr('data-action', expand ? 'text-collapse' : 'text-expand');
                })

                // 播放语音
                .off('click.file_list', '[data-action="play-voice"]')
                .on('click.file_list', '[data-action="play-voice"]', function (e) {
                    e.preventDefault();

                    var voice_node = me._get_file_by_$el(this);
                    if (voice_node) {
                        me._play_voice(voice_node);
                    }
                });
        },

        // 文件删除模块
        _render_remove: function () {

            var me = this;

            // 删除文件模块
            vir_remove = require('./file_list.file_processor.vir_remove.vir_remove');
            vir_remove.render();

            // 删除事件
            $all_list
                .off('click.file_list', '[data-action="remove"]')
                .on('click.file_list', '[data-action="remove"]', function (e) {
                    e.preventDefault();

                    var node = me._get_file_by_$el(this);
                    me._remove_file(node);
                });
        },

        // 分页
        _render_pager: function () {
            var me = this;

            $list_to.children('[data-view]')
                .off('click.file_list', '[data-action="more"]')
                .on('click.file_list', '[data-action="more"]', function (e) {
                    e.preventDefault();

                    me._loading(true);

                    me._load_more();
                });
        },

        // 缩略图
        _render_thumb: function () {
            var Thumb = require('./file_list.thumb.thumb');

            thumb = new Thumb({
                cgi_url: 'http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg',
                cgi_cmd: 'batch_download_virtual_file',
                cgi_data: function (files) {
                    return {
                        pdir_key: cur_node.get_id(),
                        files: $.map(files, function (file) {
                            return {
                                file_id: file.get_id(),
                                file_name: file.get_name()
                            };
                        })
                    };
                },
                cgi_response: function (files, body) {
                    var imgs = body['files'];
                    if (imgs) {
                        return $.map(imgs, function (img_rsp) {
                            var ret = parse_int(img_rsp['retcode']), url, file_id;
                            if (ret == 0) {
                                var host = img_rsp['dl_svr_host'],
                                    port = img_rsp['dl_svr_port'],
                                    path = img_rsp['dl_encrypt_url'];
                                url = 'http://' + host + ':' + port + '/ftn_handler/' + path + '?size=128*128';
                                file_id = img_rsp['file_id'];
                            }
                            return new Thumb.ImageMeta(ret, file_id, url);
                        })
                    }
                }
            });

            var me = this;
            me
                // 文件列表增加文件DOM后刷新缩略图
                .on('add_$items set_$items update_$item', function (files) {
                    thumb.push(files);
                })

                // 加载成功后显示图片
                .listenTo(thumb, 'get_image_ok', function (file, img) {
                    set_image(file, img);
                })
                // 图片加载失败后设置一个默认图片
                .listenTo(thumb, 'get_image_error', function (file) {
                    set_image(file);
                });


            var default_image = 'http://imgcache.qq.com/vipstyle/nr/box/img/img-70.png',
                set_image = function (file, img) {
                    var $item = me._get_$item(file.get_id()),
                        $item_img;
                    if ($item && ($item_img = $item.find('img'))[0]) {
                        if (img) {
                            $item_img.attr('src', img.src);
                        } else {
                            $item_img.attr('src', default_image);
                        }
                        $item_img.css('visibility', '');
                    }
                };
        },

        // 工具栏
//        _render_toolbar: function () {
//            this.update_dyn_bar(true);   // 现在不需要动态控制按钮的显示了 james
//        },

        // 勾选状态
        _render_selection: function () {
            // 激活 ui_normal 时，增加 selection-view 类以显示列表为checkbox勾选操作模式
            this.on('show', function () {
                disk_ui.get_$body().removeClass('selection-view');
            });
            if (ui_visible === true) {
                disk_ui.get_$body().removeClass('selection-view');
            }
        },

        // IE6 fix
        _render_ie6: function () {
            $all_list
                .off('mouseenter mouseleave', '[data-file-id]')
                .on('mouseenter', '[data-file-id]', function (e) {
                    $(this).addClass('hover');
                })
                .on('mouseleave', '[data-file-id]', function (e) {
                    $(this).removeClass('hover');
                });
        },

        //预览图片
        preview_image: function (node) {
            var me = this;

            require.async(['image_preview'], function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    files = node.get_parent().get_kid_files(),
                // 当前图片所在的索引位置
                    index = $.inArray(node, files);

                image_preview.start({
                    support_nav: true,
                    total: cur_total,
                    index: index,
                    get_url: function (index, options) {
                        var file;
                        // 从当前下标到结束搜索，如果没有图片了，且有更多文件，则需要加载下一页
                        var has_image = false, has_more = false;
                        for (var i = index + 1; i < options.total; i++) {
                            file = files[i];
                            if (!file) {
                                has_more = true;
                            } else if (file.is_image()) {
                                has_image = true;
                            }
                        }
                        if (!has_image && has_more) {
                            var def = me._load_more();
                            if (def) {
                                def.done(function () {
                                    image_preview._update_status();
                                });
                            }
                        }

                        file = files[index];
                        if (file && file.is_image() && file.is_on_tree()) {
                            return me._get_down_url(file, true);
                        }
                    },
                    has_next: function (options) {
                        for (var i = options.index; i < options.total; i++) {
                            var file = files[i + 1];
                            if (file && file.is_image() && file.is_on_tree()) {
                                return true;
                            }
                        }
                        return false;
                    },
                    download: function (index) {
                        var file = files[index];
                        if (file && file.is_on_tree()) {
                            var raw_url = me._get_down_url(file, false);
                            downloader.down_url(raw_url, file.get_name(), file.get_size());
                        }
                    },
                    //判断是否存了来源url
                    has_newsurl: function(index){
                        var file = files[index];
                        return file.has_newsurl();
                    },
                    //跳转到来源url
                    goto: function (index) {
                        var file = files[index];
                        if (file && file.is_on_tree()){
                            var url="http://wx.cgi.weiyun.com/tnews_picupload.fcg?" +
                                "cmd=get_news_url&fileid="+file.get_id();
                            window.open(url);
                        }
                    },
                    remove: function (index, callback) {
                        var file = files[index];
                        if (file && file.is_on_tree()) {
                            me._remove_file(file).done(function () {
                                callback()
                            });
                        } else {
                            callback();
                        }
                    }
                });
            });
        },

        _get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return all_file_map.get(file_id);
        },

        _get_$item: function (node_or_id) {
            var id;
            if (typeof node_or_id === 'string') {
                id = node_or_id;
            } else if (FileNode.is_instance(node_or_id)) {
                id = node_or_id.get_id();
            }
            var $item = id ? $('#_disk_vdir_item_' + id) : null;
            return $item && $item[0] ? $item : null;
        },

        /**
         * 折叠、展开文字
         * @param {String} text_id
         * @param {Boolean} expand
         * @private
         */
        _toggle_text_expand: function (text_id, expand) {
            var me = this,
                $el = this._get_$item(text_id),
                $texts = $el.find('[data-name="short-text"], [data-name="long-text"]'),
                $short = $texts.eq(0),
                $long = $texts.eq(1);

            $short.toggle(!expand);
            $long.toggle(expand);
            $el.toggleClass('text-expanded', expand);

            me.trigger('list_resized');
        },


        _play_voice: function (voice_node) {
            var me = this,
                url = voice_node.get_url(),

                $msg = me._get_$item(voice_node.get_id()),
                $play = $msg.find('[data-action="play-voice"]'),
                $play_time = $play.siblings('[data-action="play-time"]'),
                $play_loading = $play.siblings('[data-action="play-loading"]');

            if (playing_voice) {
                var $last_msg = me._get_$item(playing_voice.get_id()),
                    $last_play = $last_msg.find('[data-action="play-voice"]'),
                    $last_play_time = $last_play.siblings('[data-action="play-time"]'),
                    $last_play_loading = $last_play.siblings('[data-action="play-loading"]')

                $last_play.removeClass('audio-playing');
                $last_play_loading.hide();
                $last_play_time.show();
            }

            playing_voice = voice_node;

            var title = doc.title;

            require.async('jquery_jplayer', function () {

                me._get_$voice_player()

                    // 错误处理
                    .off($.jPlayer.event.error)
                    .on($.jPlayer.event.error, function (ev) {
                        var err_type = ev.jPlayer.error.type;
                        if (err_type == $.jPlayer.error.FLASH || err_type == $.jPlayer.error.FLASH_DISABLED || err_type == $.jPlayer.error.NO_SOLUTION) {
                            widgets.alert.warn({
                                msg: _('您还没有安装flash播放器，请点击<a href="http://www.adobe.com/go/getflash" target="_blank">这里</a>安装'),
                                button_text: _('确定')
                            });
                        }
                    })


                    .jPlayer('destroy')
                    .jPlayer({

                        swfPath: constants.DOMAIN + '/web/flash/',
                        supplied: "mp3",
                        solution: 'flash',//"html,flash",
                        wmode: "window",

                        // 就绪时
                        ready: function () {
                            $(this).jPlayer("setMedia", { mp3: url }).jPlayer('play'); // 自动播放

                            // 开始播放后显示 loading
                            $play_time.hide();
                            $play_loading.show();
                        },
                        // 播放中
                        progress: function () {
                            $play.addClass('audio-playing');
                            $play_loading.hide();

                            doc.title = title;
                        },
                        ended: function () {  // 结束
                            $play.removeClass('audio-playing');
                            $play_loading.hide();
                            $play_time.show();

                            playing_voice = undefined;
                        }
                    });
            });

        },

        _get_$voice_player: function () {
            return $voice_player || ($voice_player = $('<div data-jplayer style="width:0;height:0;position:absolute;"/>').appendTo(doc.body));
        },

        // 获取数据分页大小
        _get_page_size: function (node) {
            if (!page_helper) {
                page_helper = new PagingHelper({
                    $container: null,
                    item_width: 0,
                    item_height: 0,
                    fixed_height: $cur_view.offset().top
                });
            }

            var is_thumb = this.is_thumb_view(node);

            page_helper.set_$container($cur_view);
            page_helper.set_item_width(is_thumb ? 136 : 0);    // 缩略图模式文件宽度为136，其他模式宽度为0(自动)
            page_helper.set_item_height(is_thumb ? 136 : 106); // 缩略图模式文件高度为136，其他模式高度为100+
            page_helper.set_is_list(!is_thumb);

            var size = Math.max(page_helper.get_line_size() * page_helper.get_line_count(true), 10); // 最少10个
            //console.log('get_page_size=', size);
            return size;
        },

        // 显示分页条（special） or 更新页码（classic & list）
        _update_pager: function (total) {
            var kid_len = cur_node.get_kid_nodes() ? cur_node.get_kid_nodes().length : 0;
            $cur_pager.css('visibility', (!!total && kid_len < total) ? '' : 'hidden');
        },

        _loading: function (loading) {
            $cur_pager.html(loading ? _('加载中...') : _('加载更多'));
        },

        _set_$item_img: function (file, src) {
            var $item = this._get_$item(file.get_id()),
                $img = $item.find('img');

            if ($img[0]) {
                if (src) {
                    $img.attr('src', src).removeClass('default');
                } else {
                    $img.attr('src', 'http://imgcache.qq.com/vipstyle/nr/box/img/img-70.png');
                }
            }
        },

        /**
         * 获取文件的下载地址
         * @param {FileNode} node
         * @param {Boolean} is_preview
         * @returns {*}
         * @private
         */
        _get_down_url: function (node, is_preview) {
            var down_name = downloader.get_down_name(node.get_name()),
                uin = query_user.get_uin(),
                skey = query_user.get_skey(),

                header = {
                    cmd: 'download_virtual_file',
                    appid: constants.APPID,
                    proto_ver: 20130708,
                    token: security.getAntiCSRFToken(),
                    uin: uin
                },
                body = {
                    file_owner: uin,
                    pdir_key: cur_node.get_id(),
                    file_id: node.get_id(),
                    file_name: down_name
                },
                params = {
                    data: {
                        req_header: header,
                        req_body: body
                    },
                    uin: uin,
                    skey: skey
                };

            // 预览时
            if (is_preview) {
                body.size = '640*640';
            }
            else {
                params.err_callback = constants.DOMAIN + '/web/callback/iframe_disk_down_fail.html';
            }

            return urls.make_url('http://webcgi.weiyun.qq.com/weiyun_web_vircgi.fcg', params);
        },

        /**
         * 删除文件
         * @param {FileNode} node
         * @private
         */
        _remove_file: function (node) {
            var me = this;
            var thing_map = {
                    ArticleNode: _('文章'),
                    VoiceNode: _('{#voice#}消息'),
                    PlaintextNode: _('{#plaintext#}消息')
                },
                thing = thing_map[node.class_name] || (node.is_dir() ? _('文件夹') : _('文件')),
                ok_callback = function () {
                    mini_tip.ok(_('删除成功'));
                    me._get_$item(node).fadeOut('fast', function () {
                        $(this).remove();

                        me._load_more(1);
                    });
                };

            var def = vir_remove.remove_confirm(node, thing, node.get_name())
                .done(function () {
                    ok_callback();
                })

                .fail(function (msg, ret) {
                    if (ret === 10005) {
                        ok_callback();
                    }
                    else if (msg) {
                        mini_tip.error(msg);
                    }
                });

            return def;
        },


        // ============ 列表高度调整 ===========================
        _last_has_dirs: undefined,
        _last_has_files: undefined,
        _last_show_empty_tip: undefined,

        /**
         * 更新列表显示状态（是否显示列表子标题、是否显示文件列表、是否显示目录列表、是否显示空提示）
         * @param {Boolean} [show_empty_tip] 是否显示空提示，默认true
         */
        _update_list_view_status: function (show_empty_tip) {
            if (!this.is_rendered()) return;

            var
                has_dirs = cur_node && cur_node.get_kid_dirs() && cur_node.get_kid_dirs().length > 0,
                has_files = cur_node && cur_node.get_kid_files() && cur_node.get_kid_files().length > 0;

            show_empty_tip = show_empty_tip !== false;

            if (this._last_has_dirs !== has_dirs || this._last_has_files !== has_files || this._last_show_empty_tip !== show_empty_tip) {

                // 如果无文件，则隐藏文件列表；无目录，则隐藏目录列表
                $cur_file_list.toggle(has_files);
                $cur_dir_list.toggle(has_dirs);

                // 如果无文件和目录,则显示空提示
                if (show_empty_tip) {
                    var has_data = has_files || has_dirs;
                    $cur_empty_tip.toggle(!has_data).text(_('您还没有保存任何{0}内容', cur_node.get_name()));
                    if ($sub_view) {
                        $sub_view.toggle(has_data);
                    }
                } else {
                    $cur_empty_tip.hide();
                }

                $cur_pager.toggle(has_files || has_dirs);

                this._last_has_dirs = has_dirs;
                this._last_has_files = has_files;
                this._last_show_empty_tip = show_empty_tip;
            }
        },

        /**
         * 修复用户产生的文本消息（HTML转义 + URL添加链接）
         * @param {String} str 需要处理的用户文本
         * @param {Number} [len] 截取长度（参考.smart_sub()方法），可选
         */
        fix_user_text: function (str, len) {
            if (!str || !(typeof str === 'string')) return '';

            var me = this;

            // 首先要将文本和URL分离开，然后对文本进行HTML转义，对URL进行修复
            // 如“你好www.g.cn世界”，需要拆分为 "你好", "www.g.cn", "世界"
            var texts = [],
                is_urls = {}, // { 1: String, 3: String } 保存所有的URL以及URL在文本数组中出现的索引位置
                last_end = 0,
                i = 0;

            var match;
            while (match = re_url.exec(str)) {
                var url = match[0],
                    start = match.index,
                    end = start + url.length,
                    left_text = str.substring(last_end, start);

                texts.push(left_text);  // 取URL左侧的文字
                texts.push(url);
                is_urls[texts.length - 1] = url;

                last_end = end;
                i++;
            }
            // 取URL右侧的文字
            if (last_end < str.length - 1) {
                texts.push(str.substr(last_end));
            }

            // 先截断
            if (len > 0) {
                texts = me._smart_sub_arr(texts, len);
            }


            texts = $.map(texts, function (str, i) {
                var url;
                // 生成链接（如果URL被截断了，则不处理链接）
                if (i in is_urls && str === (url = is_urls[i])) {
                    if (!re_protocol.test(url)) {
                        url = 'http://' + url;
                    }
                    return '<a href="' + url + '" target="_blank">' + str + '</a>'; // 这里用text作为文本，是因为它有可能由"www.weiyun.com"被截断为"www.wei.."
                }
                else {
                    // 字符串HTML转义
                    return text.text(str);
                }
            });

            return texts.join('');
        },

        /**
         * 按照字符数截断字符串数组(1个全角字符=2个半角字符, 可能会有误差)
         * @param {Array<String>} str
         * @param {Number} len
         * @return {Array<String>} str
         */
        _smart_sub_arr: function (str, len) {
            var arr = str,
                results = [],
                stop_arr_index = -1,
                stop_chr_index = -1,
                chr_index = -1,
                index = 0;

            len *= 2;

            for (var m = 0, n = arr.length; m < n; m++) {
                var s = arr[m];
                for (var i = 0, l = s.length; i < l; i++) {
                    chr_index++;
                    if (re_double_words.test(s.charAt(i))) {
                        index += 2;
                    } else {
                        index++;
                    }
                    if (index > len) {
                        stop_chr_index = i;
                        break;
                    }
                }
                if (stop_chr_index !== -1) {
                    stop_arr_index = m;
                    break;
                }
            }

            if (stop_arr_index !== -1 && stop_chr_index !== -1) {
                results = arr.slice(0, stop_arr_index);
                results.push(arr[stop_arr_index].substr(0, stop_chr_index) + '..');
            } else {
                results = arr;
            }

            return results;
        }

    });

    return ui_virtual;
});/**
 * 文件列表全选
 * @author jameszuo
 * @date 13-7-31
 */
define.pack("./file_path.all_checker",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        $el,
        cur_checked, // 当前勾选状态

        undef;


    var all_checker = {

        render: function ($to) {

            var me = this;
            // 点击全选、取消全选
            me.get_$el()
                .prependTo(constants.UI_VER === 'APPBOX' ? $to.children(':first') : $to)
                .on('click', function (e) {
                    e.preventDefault();

                    var to_check = !cur_checked;

                    me.toggle_check(to_check);

                    me.trigger('toggle_check', to_check); // 这句不要移入 toggle_check() 方法中，那样会导致循环触发事件 james
                });
        },


        /**
         * 设置全选按钮状态
         * @param {Boolean} to_check
         */
        toggle_check: function (to_check) {
            // 如果状态不变，则退出
            if (to_check === cur_checked) {
                return;
            }

            this.get_$el().toggleClass('checkalled', to_check);

            cur_checked = to_check;
        },

        is_checked: function () {
            return cur_checked;
        },


        get_$el: function () {
            return $el || ($el = $(tmpl.all_checker()));
        },

        hide: function () {
            this._toggle(false);
        },

        show: function () {
            this._toggle(true);
        },

        _toggle: function (visible) {
            this.get_$el().parent().toggleClass('step-uncheck', !visible);
        }
    };

    $.extend(all_checker, events);

    return all_checker;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_path.file_path",["lib","common","$","./file.utils.all_file_map","./file_path.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),

        all_file_map = require('./file.utils.all_file_map'),

        cur_node,
        last_enable,

        undefined;

    var file_path = new Module('disk_file_path', {

        ui: require('./file_path.ui'),


        /**
         * 更新路径
         * @param {Array<FileNode>} target_node
         * @param {Boolean} enable 默认true
         */
        update: function (target_node, enable) {
            enable = enable !== false;

            if (target_node === cur_node && enable === last_enable) {
                return;
            }

            if (target_node) {

                var nodes = [],
                    node = target_node;

                while ((node.get_parent() && !node.get_parent().is_super()) && (node = node.get_parent())) { // 不包括super节点
                    nodes.push(node);
                }
                nodes.reverse();
                nodes.push(target_node);

                cur_node = target_node;
                last_enable = enable;

                this.ui.update_$nodes(target_node, nodes, enable);
            }
        }
    });

    return file_path;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_path.ui",["lib","common","$","./tmpl","./file_path.file_path","./file_list.file_list","./file_path.all_checker"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        global_event = common.get('./global.global_event'),
        disk_event = common.get('./global.global_event').namespace('disk'),
        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        uiv = constants.UI_VER,

        file_path,
        file_list,

        droppable_options = {
            scope: 'move_file',
            tolerance: 'pointer',
//            accept: '.ui-item',
            hoverClass: 'ui-dropping',

            drop: function (e, ui) {

                var target_dir_id = $(e.target).closest('[data-file-id]').attr('data-file-id');

                disk_event.trigger('drag_and_drop_files_to', target_dir_id);
                user_log('DISK_DRAG_BREAD');
            }
        },

        undefined;

    var ui = new Module('disk_file_path_ui', {

        render: function ($to) {
            file_path = require('./file_path.file_path');
            file_list = require('./file_list.file_list');

            // 事件
            var $el = this._$el = $(tmpl['file_path_' + uiv]()).appendTo($to);
            this._$inner = uiv === 'APPBOX' ? $('#_disk_file_path_inner') : $el.find('table');

            // 全选
            var all_checker = require('./file_path.all_checker');
            all_checker.render($el);

            // 更新路径DOM
            this.listenTo(file_path, 'update', function (target_node, nodes, enable) {
                this.update_$nodes(target_node, nodes, enable);
            });

            // 点击路径跳转
            $el.on('click', function (e) {
                e.preventDefault();
            });
            $el.on('click', '[data-file-id]', function (e) {
                var dir_id = $(this).attr('data-file-id'),
                    is_root = file_list.get_root_node().get_id() === dir_id;

                file_path.trigger('click_path', dir_id);

                user_log(is_root ? 'DISK_BREAD_WEIYUN' : 'DISK_BREAD_DIR');
            });
        },

        /**
         * 更新路径
         * @param {FileNode} target_node 目标目录
         * @param {FileNode[]} nodes 目录路径
         * @param {Boolean} [enable] 是否可点击，默认true
         */
        update_$nodes: function (target_node, nodes, enable) {
            var me = this,
                $el = me._$el,
                $inner = me._$inner;

            var $paths = $(tmpl['file_path_items_' + uiv]({ target_node: target_node, nodes: nodes, enable: !!enable }));
            $inner.empty().append($paths);

            // me._$inner = $paths;

            // 丢放（不能丢放到所在目录）（james：已知问题是，拖拽时，滚动页面，会导致目录路径的丢放焦点错位）
            var $droppable_nodes = $el.find('[data-file-id][data-cur-node!=true]');
            require.async('jquery_ui', function () {
                if ($droppable_nodes.parent()[0]) {
                    $droppable_nodes.droppable(droppable_options);
                }
            });

            me._fix_some();
        },

        _fix_some: function () {
            var $el = this._$el,
                b = $.browser;

            // IE6 hover伪类hack
            if (b.msie && b.version < 7) {
                $el
                    .on('mouseenter', 'td', function () {
                        $(this).addClass('hover');
                    })
                    .on('mouseleave', 'td', function () {
                        $(this).removeClass('hover');
                    });
            }
            // IE、Opera active伪类hack
            var active_el;
            if (b.msie || b.opera) {
                var $body = $(document.body);
                $el.on('mousedown', 'td', function () {
                    active_el = $(this);
                    active_el.addClass('active');
                    $body.one('mouseup', function () {
                        if (active_el) {
                            active_el.removeClass('active');
                            active_el = null;
                        }
                    });
                });
            }
        }

    });

    return ui;

});/**
 * 工具条的状态
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./toolbar.status",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        undef;

    var Status = function (o) {
        this._is_vir_dir = !!o.is_vir_dir;
        this._has_broken = !!o.has_broken;
        this._has_no_del = !!o.has_no_del;
        this._has_no_move = !!o.has_no_move;
        this._has_no_rename = !!o.has_no_rename;
        this._has_no_down = !!o.has_no_down;
        this._has_multi = !!o.has_multi;
        this._has_dir = !!o.has_dir;
        this._has_qq_disk = !!o.has_qq_disk;
        this._has_net_fav = !!o.has_net_fav;
        this._has_empty_file = !!o.has_empty_file;
        this._only_1_file = !!o.only_1_file;
        this._count = o.count || 0;
    };
    Status.prototype = {
        /**
         * 判断是否是虚拟目录
         * @returns {Boolean}
         */
        is_vir_dir: function () {
            return this._is_vir_dir;
        },
        /**
         * 包含破损文件
         * @returns {Boolean}
         */
        has_broken: function () {
            return this._has_broken;
        },
        /**
         * 有不允许删除的文件
         * @returns {Boolean}
         */
        has_no_del: function () {
            return this._has_no_del;
        },
        /**
         * 有不允许移动的文件
         * @returns {Boolean}
         */
        has_no_move: function () {
            return this._has_no_move;
        },
        /**
         * 包含不允许重命名的文件
         * @returns {Boolean}
         */
        has_no_rename: function () {
            return this._has_no_rename;
        },
        /**
         * 包含不允许下载的文件
         * @returns {Boolean}
         */
        has_no_down: function () {
            return this._has_no_down;
        },
        /**
         * 多个文件、目录
         * @returns {Boolean}
         */
        has_multi: function () {
            return this._has_multi;
        },
        /**
         * 有目录
         * @returns {Boolean}
         */
        has_dir: function () {
            return this._has_dir;
        },
        /**
         * 有QQ硬盘目录
         * @returns {Boolean}
         */
        has_qq_disk: function () {
            return this._has_qq_disk;
        },
        /**
         * 有网络收藏夹目录
         * @returns {Boolean}
         */
        has_net_fav: function () {
            return this._has_net_fav;
        },
        /**
         * 包含空文件
         * @returns {Boolean}
         */
        has_empty_file: function () {
            return this._has_empty_file;
        },
        /**
         * 只有一个『文件』
         * @returns {Boolean}
         */
        only_1_file: function () {
            return this._only_1_file;
        },
        /**
         * 获取选中文件的个数
         * @return Number
         */
        get_count: function () {
            return this._count;
        }
    };

    return Status;
});/**
 * 工具条
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./toolbar.tbar",["lib","common","$","i18n","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'), 
        $ = require('$'),
        _ = require('i18n'),

        console = lib.get('./console').namespace('disk/tbar'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        ButtonGroup = common.get('./ui.toolbar.button_group'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        toolbar,
        status,
        nil = _('请选择文件'),

        undef;


    var tbar = new Module('disk_tbar', {

        /**
         * 渲染工具栏
         * @param {jQuery|HTMLElement} $to
         */
        render: function ($to) {
            var me = this,
                default_handler = function (e) {   //  this -> Button / ButtonGroup
                    if (this.is_enable()) {
                        me.trigger(this.get_id(), e);
                    }
                },

                btns = [
                    // 下载
                    new Button({
                        id: 'pack_down',
                        label: _('下载'),
                        cls: 'btn-down',
                        icon: 'ico-down',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_DOWN');
                        },

                        validate: function () {
                            
                            if (status.get_count() === 0) {
                                return [nil, 'ok'];
                            } else if (status.get_count() > constants.PACKAGE_DOWNLOAD_LIMIT) {
                                return _('打包下载一次最多支持{0}个文件', constants.PACKAGE_DOWNLOAD_LIMIT);
                            } else if (status.has_no_down()) {
                                if (status.has_broken()) {
                                    return _('不能下载破损的文件');
                                } else {
                                    return _('部分文件不可下载');
                                }
                            }
                        }
                    }),

                    // 删除
                    new Button({
                        id: 'del',
                        label: _('删除'),
                        cls: 'btn-del',
                        icon: 'ico-del',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_DEL');
                        },

                        validate: function () {
                            
                            if (status.get_count() === 0) {
                                return [nil, 'ok'];
                            } else if (status.has_no_del()) {
                                if (status.has_net_fav()) {
                                    return _('不能删除网络收藏夹目录');
                                } else if (status.has_qq_disk()) {
                                    return _('不能删除QQ硬盘目录');
                                } else {
                                    return _('部分文件不可删除');
                                }
                            }
                        }
                    }),

                    // 移动
                    new Button({
                        id: 'move',
                        label: _('移动'),
                        cls: 'btn-move',
                        icon: 'ico-move',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_MOVE');
                        },

                        validate: function () {
                            
                            if (status.get_count() === 0) {
                                return [nil, 'ok'];
                            } else if (status.has_no_move()) {
                                if (status.has_broken()) {
                                    return _('不能移动破损文件');
                                } else if (status.has_qq_disk()) {
                                    return _('不能移动QQ硬盘目录');
                                } else {
                                    return _('部分文件不可移动');
                                }
                            }
                        }
                    }),

                    // 重命名
                    new Button({
                        id: 'rename',
                        label: _('重命名'),
                        cls: 'btn-rename',
                        icon: 'ico-rename',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_RENAME');
                        },

                        validate: function () {
                            
                            if (status.get_count() === 0) {
                                return [nil, 'ok'];
                            } else if (status.get_count() > 1) {
                                return _('只能对单个文件（夹）重命名');
                            } else {
                                if (status.has_no_rename()) {
                                    if (status.has_broken()) {
                                        return _('不能对破损文件进行重命名');
                                    } else {
                                        return _('部分文件不可重命名');
                                    }
                                }
                            }
                        }
                    }) ,

                    new ButtonGroup({
                        id: 'shares',
                        label: _('分享'),
                        cls: 'btn-share',
                        icon: 'ico-share',

                        buttons: [
                            // 链接分享
                            new Button({
                                id: 'link_share',
                                label: _('链接分享'),
                                cls: 'btn-link',
                                icon: 'ico-link',
                                handler: default_handler,
                                before_handler: function () {
                                    user_log('DISK_TBAR_LINK_SHARE');
                                },

                                validate: function () {
                                    
                                    if (status.get_count() === 0) {
                                        return [nil, 'ok'];
                                    } else if (status.get_count() > constants.LINK_SHARE_LIMIT) {
                                        return _('链接分享一次最多支持{0}个文件', constants.LINK_SHARE_LIMIT);
                                    } else if (status.has_broken()) {
                                        return _('不能分享破损的文件');
                                    } else if (status.has_empty_file()) {
                                        return _('不能分享空的文件');
                                    }
                                }
                            }),
                            // 邮件分享
                            new Button({
                                id: 'mail_share',
                                label: _('邮件分享'),
                                cls: 'btn-mail',
                                icon: 'ico-mail',
                                handler: default_handler,
                                before_handler: function () {
                                    user_log('DISK_TBAR_MAIL_SHARE');
                                },

                                validate: function () {
                                    
                                    if (status.get_count() === 0) {
                                        return [nil, 'ok'];
                                    } else if (status.has_dir()) {
                                        return _('暂不支持通过邮件分享文件夹');
                                    } else if (status.get_count() > constants.MAIL_SHARE_LIMIT) {
                                        return constants.MAIL_SHARE_LIMIT === 1 ? _('暂不支持通过邮件批量分享文件') : _('邮件分享一次最多支持{0}个文件', constants.MAIL_SHARE_LIMIT);
                                    } else if (status.has_broken()) {
                                        return _('不能分享破损的文件');
                                    } else if (status.has_empty_file()) {
                                        return _('不能分享空的文件');
                                    }
                                }
                            })
                        ]
                    }),

                    // 新建文件夹
                    new Button({
                        id: 'mkdir',
                        label: _('新建'),
                        cls: 'btn-mkdir',
                        icon: 'ico-mkdir',
                        handler: default_handler
                    })
                ];

            toolbar = new Toolbar({
                cls: 'disk-toolbar',
                btns: btns
            });
            toolbar.render($to);
        },

        /**
         * 更新工具栏状态
         * @param {Status} s
         */
        set_status: function (s) {
            status = s;
        },

        get_$el: function () {
            return toolbar.get_$el();
        }
    });

    return tbar;
});/**
 * 网盘主体UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./ui",["disk_css","lib","common","i18n","$","./tmpl","main","./disk","./view_switch.view_switch","./file_list.file_list","./file_list.ui"],function (require, exports, module) {

    require('disk_css');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),
        global_function = common.get('./global.global_function'),
        upload_event = common.get('./global.global_event').namespace('upload'),
        page_event = common.get('./global.global_event').namespace('page'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),
        uiv = constants.UI_VER,
        web_ui = uiv === 'WEB',

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        disk,
        view_switch,
        file_list,
        file_list_ui,

        $win = $(window),

        bottom_fix = constants.UI_VER === 'APPBOX' ? 10 : 0,
        bottom_padding,

        undefined;


    var ui = new Module('disk_ui', {

        render: function () {
            disk = require('./disk');

            // 切换视图
            view_switch = require('./view_switch.view_switch');
            file_list = require('./file_list.file_list');
            file_list_ui = require('./file_list.ui');

            if (web_ui) {
                this.get_$header().appendTo(main_ui.get_$header_box());
            }
            this.get_$body().appendTo(main_ui.get_$body_box());

            this
                // 切换视图时
                .listenTo(view_switch, 'switch', function () {
                    this._update_view();
                })

                // 切换至批量模式时
                .listenTo(global_event, 'disk_batch_mode', function (batch, op_type) {
                    this._set_selection_view(batch, op_type);
                })

                .listenTo(query_user, 'error', function (msg) {
                    mini_tip.error(msg);
                })

                // 列表删除文件、重绘时，更新最小高度
                .listenTo(file_list_ui, 'list_height_changed', function () {
                    this._fix_view_height_delay();
                });


            this
                .on('activate', function () {
                    this._update_view();

                    if (web_ui) {
                        this.get_$header().show();
                        // 调整头部高度
                        global_event.trigger('page_header_height_changed');
                    }

                    this.get_$body().show();

                    this.listenTo(global_event, 'window_resize', function () {
                        this._fix_view_height_delay();
                    });
                    this._fix_view_height();

                    document.title = _('微云');
                })

                .on('deactivate', function () {
                    if (web_ui) {
                        this.get_$header().hide();
                        // 调整头部高度
                        global_event.trigger('page_header_height_changed');
                    }
                    this.get_$body().hide();

                    this.stopListening(global_event, 'window_resize');
                });
        },

        _update_view: function () {
            var $view = this.get_$view();

            $view.toggleClass('ui-thumbview', view_switch.is_grid_view())
                .toggleClass('ui-listview', view_switch.is_list_view());

            // 修复 bug #48664938 webkit没有重绘
            if ($.browser.webkit) {
                $view.toggle().toggle();
            }
        },

        _set_selection_view: function (batch, op_type) {
            this.get_$body().toggleClass('selection-view', !!batch);

            var view = this.get_$view()[0];

            var org_class = view.className,
                new_class = org_class.replace(new RegExp('\\s*view\\-when\\-\\w+\\s*', 'g'), ' ');

            if(op_type) {
                new_class += ' view-when-' + op_type;
            }

            if(org_class !== new_class) {
//                console.debug('before _set_selection_view', org_class);
                view.className = new_class;
//                console.debug('after _set_selection_view', new_class);
            }
        },

        // --- 获取一些DOM元素 ---------

        get_$header: function () {
            if (!this._$header) {
                this._$header = $(tmpl['header_' + uiv]({ module: this }));
            }
            return this._$header;
        },

        get_$body: function () {
            if (!this._$body) {
                this._$body = $(tmpl['body_' + uiv]({ module: this }));
            }
            return this._$body;
        },

        get_$view: function () {
            return $('#_disk_view');
        },

        get_$toolbar: function () {
            return $('#_disk_toolbar_container');
        },

        get_$column_model: function () {
            return $('#_disk_list_column_model');
        },

        get_$space_info: function () {
            return $('#_disk_space_info');
        },

        get_$view_switch: function () {
            return $('#_disk_view_switch');
        },

        get_$bar: function () {
            return $('#_disk_bar');
        },

        get_header_placeholder: function () {
            return $('#_header_placeholder');
        },


        _fix_view_timer: null,
        _fix_view_height_delay: function () {
            clearTimeout(this._fix_view_timer);
            this._fix_view_timer = setTimeout($.proxy(this._fix_view_height, this), 0);
        },
        // 调整视图高度
        _fix_view_height: function () {
            var $view = this.get_$view(),
                $body = this.get_$body();
            $view.css('height', '');

            var offset_top = $view.offset().top,
                view_out_height = $view.outerHeight(true),
                view_height = $view.height(),
                win_height = $win.height(),
                new_height = '';

            if (typeof bottom_padding !== 'number') {
                bottom_padding = bottom_fix + (parseInt($body.css('padding-bottom')) || 0) + (parseInt($body.css('margin-bottom')) || 0) || 0;
            }

            var view_bottom = offset_top + view_out_height;

            if (view_bottom < win_height - bottom_padding) {
                new_height = view_height + (win_height - view_bottom - bottom_padding);
            }
            $view.css('height', new_height);
        }
    });



    ui.once('render', function () {

        var hack_uploaded_2_wy = false;

        // 客户端上传接口(拖拽上传、上传到微云)
        var inter_upload_files = function (file_num, file_path, source) {

            var files = file_num > 1 ? file_path.split('*') : file_path.split('\r\n');

            if (!files || files.length === 0) {
                return false;
            }


            var is_upload_2_wy = source === 'AIO' || routers.get_param('action') === 'qq_receive';

            // 上传到微云
            if (is_upload_2_wy) {

                hack_uploaded_2_wy = true;

                setTimeout(function () {
                    // 进入QQ收到的文件目录后，开始上传
                    file_list.enter_qq_receive(false, function () {
                        upload_event.trigger('start_upload_from_client', files);
                    });

                    user_log('upload_from_QQClient', undefined, undefined, {
                        os_type : constants.OS_TYPES.QQ
                    }); //code by bondli 修正qq传文件统计ID
                }, 100);
            }
            // 直接上传
            else if (source === 'DragDrop') {   //拖拽上传
                user_log('DISK_DRAG_UPLOAD');
                return upload_event.trigger('start_upload_from_client', files);
            }
        };

        // 进入 QQ收到的文件 目录
        var inter_enter_qq_receive = function () {

            if (!disk.is_activated()) {
                routers.go({ m: 'disk' });
            }


            file_list.enter_qq_receive(true);
            user_log('view_from_QQClient', undefined, undefined, {
                os_type : constants.OS_TYPES.QQ
            });
        };


        // 等用户加载完成后，注册并启动这些事件
        var start_listening = function () {

            // 注册接口（如果客户端已调用过对应的接口，则会自动执行调用历史）
            global_function.register('WYCLIENT_EnterOfflineDir', inter_enter_qq_receive);
            global_function.register('WYCLIENT_UploadFiles', inter_upload_files);


            // 客户端有个问题，调用「上传到微云」和「到微云中查看」的参数是一样的，
            // 所以这里做了个hack，在客户端执行上传到微云的接口后，设置hack_uploaded_2_wy为true来防止重复进入「QQ收到的文件」
            // @james


            // 进入QQ收文件目录
            if (routers.get_param('action') === 'qq_receive' && !hack_uploaded_2_wy) {
                inter_enter_qq_receive();
            }
        };

        if (query_user.get_cached_user()) {
            start_listening();
        } else {
            query_user.once('load', start_listening);
        }
    });



    // 网盘激活时，才可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        if (!ui.get_$body().is(':visible')) {
            return false;
        }
    });

    return ui;
});/**
 * 切换视图UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./view_switch.ui",["lib","common","$","./tmpl","./view_switch.view_switch"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),


        undefined;

    var ui = new Module('disk_view_switch_ui', {

        render: function ($to) {
            var view_switch = require('./view_switch.view_switch'),
                $el = this._$el = $(tmpl['view_switch_' + constants.UI_VER]({
                    cur_view: view_switch.get_cur_view()
                }));

            $el.appendTo($to);

            // 点击时切换
            $el.on('click.view_switch_ui', '[data-view]:not(.selected)', function (e) {
                e.preventDefault();

                var $btn = $(this),
                    view_name = $btn.attr('data-view');

                $btn.addClass('current on').siblings().removeClass('current on');

                view_switch.set_cur_view(view_name);

            });

            // 修复 bug#48663950 chrome下没有显示“缩略图”和“列表”切换图标
            if ($.browser.chrome) {
                $el.find('i').each(function(i, tag_i) {
                    var $i = $(tag_i),
                        org_bg = $i.css('background-image');

                    if(org_bg){
                        setTimeout(function () {
                            $i.css('background-image', org_bg);
                        }, 1);
                    }
                });
            }
        },

        toggle: function (visible) {
            this._$el.toggle(visible);
        }
    });

    return ui;
});/**
 * 视图切换
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./view_switch.view_switch",["lib","common","$","./tmpl","./view_switch.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        cookie = lib.get('./cookie'),
        store = lib.get('./store'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        log_event = common.get('./global.global_event').namespace('log'),

        tmpl = require('./tmpl'),

        view_name_map_value = {
            grid: 1, // 缩略图
//            list: 2,
            azlist : 3, // 按名称排序的列表视图
            newestlist : 4 // 按最后修改时间排序的列表视图
        },
        view_value_map_name = (function(){
            var n, map = {};
            for(n in view_name_map_value){
                if(view_name_map_value.hasOwnProperty(n)){
                    map[view_name_map_value[n]] = n;
                }
            }
            return map;
        })(),

        default_view = 'grid',

        store_name = 'view_switch_type',

        cur_view = (function () {
            var view_value = store.get(store_name) || cookie.get(store_name);
            if (view_value && view_value_map_name.hasOwnProperty(view_value)) {
                return view_value_map_name[view_value];
            } else {
                return default_view;
            }
        })(),

        // 最后一次使用的非“临时”视图
        last_not_temp_view = cur_view,

        undefined;

    var view_switch = new Module('disk_view_switch', {

        ui: require('./view_switch.ui'),

        render: function () {
            this._log();
        },

        get_view_map: function () {
            return view_name_map_value;
        },

        temp_to_list: function () {
            this.set_cur_view('azlist', true);
        },

        temp_to_thumb: function () {
            this.set_cur_view('grid', true);
        },

        exit_temp_view: function () {
            this.set_cur_view(last_not_temp_view, false);
        },

        set_cur_view: function (view_name, temp) {
            if (view_name !== cur_view && view_name_map_value.hasOwnProperty(view_name)) {

                cur_view = view_name;

                var is_grid = this.is_grid_view();

                if(!temp) {
                    last_not_temp_view = view_name;

                    // 存储
                    var value = view_name_map_value[view_name];
                    store.set(store_name, value);

                    this._log();
                }

                this.trigger('switch', is_grid, this.is_list_view(), view_name);
            }
        },

        get_cur_view: function () {
            return cur_view;
        },

        is_list_view: function () {
            var mode = this.get_cur_view();
            return mode === 'list' || mode === 'newestlist' || mode === 'azlist';
        },

        is_grid_view: function () {
            return this.get_cur_view() == 'grid';
        },

        _log: function () {
            log_event.trigger('view_type_change', view_name_map_value[cur_view]);
        }

    });

    return view_switch;

});
//tmpl file list:
//disk/src/disk.APPBOX.tmpl.html
//disk/src/disk.WEB.tmpl.html
//disk/src/file_list/file_processor/move/move.tmpl.html
//disk/src/file_list/rename/rename.tmpl.html
//disk/src/file_list/selection/selection.tmpl.html
//disk/src/file_list/share/share.tmpl.html
//disk/src/file_list/ui_normal.tmpl.html
//disk/src/file_list/ui_virtual.tmpl.html
//disk/src/file_path/all_checker.tmpl.html
//disk/src/file_path/file_path.APPBOX.tmpl.html
//disk/src/file_path/file_path.WEB.tmpl.html
//disk/src/view_switch/view_switch.APPBOX.tmpl.html
//disk/src/view_switch/view_switch.WEB.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'body_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_disk_body" class="box_mod_datalist">\r\n\
        <div id="_disk_view" class="disk-view ui-view">\r\n\
            <!-- 文件列表 -->\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'header_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="header-att disk-header-att">\r\n\
        <!-- 工具条s -->\r\n\
        <div id="_disk_toolbar_container" class="box_mod_maintools"></div>\r\n\
\r\n\
        <!-- web: 全选 + 面包屑；appbox：面包屑 + 视图切换 -->\r\n\
        <div id="_disk_bar" class="addrbar"></div>\r\n\
\r\n\
        <!-- 列表头 -->\r\n\
        <div id="_disk_list_column_model"></div>\r\n\
    </div>');

return __p.join("");
},

'body_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_disk_body" class="box_mod_datalist">\r\n\
        <div id="_disk_view" class="disk-view ui-view">\r\n\
            <!-- 文件列表 -->\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'file_move_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        _ = require('i18n'),
        $ = require('$'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        root_dir = data.root_dir,

        len = data.files.length,
        first = data.files[0];
    __p.push('    <div class="file-mv-cnt">\r\n\
<!--\r\n\
        <div class="_desc file-mv-desc">\r\n\
            <span class="fileimg"><i class="filetype icon-');
_p( first.get_type() );
__p.push('"></i></span>\r\n\
            <div class="fileinfo">\r\n\
                <span class="filename">');
_p( text.text(text.smart_sub(first.get_name(), 17)) );
__p.push('</span>');
 if(len > 1) { __p.push('                    <span class="filesum">');
_p( _('等 {0} 个文件', len) );
__p.push('</span>');
 } __p.push('                <span class="filesize">');
_p(first.get_readability_size());
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div class="ui-line"></div>-->\r\n\
\r\n\
        <div class="file-mv-body">\r\n\
            <h4 class="ui-title">');
_p( _('移动到：') );
__p.push('</h4>\r\n\
            <ul class="_tree ui-tree">');
_p( tmpl.file_move_box_node({
                    file: root_dir,
                    par_id: root_dir.get_parent().get_id()
                }) );
__p.push('            </ul>\r\n\
        </div>\r\n\
\r\n\
    </div>');

return __p.join("");
},

'file_move_box_node_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        files = data.files,
        par_id = data.par_id;
    __p.push('    <ul class="ui-tree-sub">');
 $.each(files, function (i, file) {
            _p( tmpl.file_move_box_node({
                file: file,
                par_id: par_id
            }) );

        }); __p.push('    </ul>');

return __p.join("");
},

'file_move_box_node': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        common = require('common'),
        click_tj = common.get('./configs.click_tj');

        file = data.file,
        par_id = data.par_id;
    __p.push('    <li id="_file_move_box_node_');
_p( file.get_id() );
__p.push('" data-file-id="');
_p( file.get_id() );
__p.push('" data-file-pid="');
_p( par_id || '' );
__p.push('">\r\n\
        <a href="#" hidefocus="on"><i class="_expander" ');
_p(click_tj.make_tj_str('TOOLBAR_MANAGE_MOVE_EXPAND_DIR'));
__p.push('></i>');
_p( text.text(file.get_name()) );
__p.push('</a>\r\n\
    </li>');

return __p.join("");
},

'rename_editor': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <span class="fileedit" style="display:none;">\r\n\
        <input class="ui-input" type="text" value=""/>\r\n\
    </span>');

return __p.join("");
},

'dragging_cursor': function(data){

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

'link_share_content': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var common = require('common'),
        _ = require('i18n'),
        constants = common.get('./constants');
    __p.push('    <div class="ui-confirm-cnt">\r\n\
        <i class="icon-xbox icon-xbox-ok"></i>\r\n\
        <h4 class="ui-title ui-normal">');
_p(_('获取下载链接成功！'));
__p.push('</h4>\r\n\
        <div class="ui-text share-info">\r\n\
\r\n\
            <!-- 链接 -->\r\n\
            <a data-function="link" class="ui-bold" href="#" target="_blank">#</a>\r\n\
\r\n\
            <div class="ui-copys">\r\n\
                <!-- 复制 -->\r\n\
                <div data-function="copy" class="ui-copy" style="width:55px;height:18px;">');
_p(_('复制链接'));
__p.push('</div>\r\n\
\r\n\
                <!-- 提示 -->\r\n\
                <div data-function="tip" style="display: none;" class="ui-copy-ok">\r\n\
                    <!--#link_share_copy_error-->\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'link_share_copy_error': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var text = require('lib').get('./text');
    __p.push('    ');
_p(text.text(data.msg));
__p.push('<i class="ui-darr"></i><i class="ui-darr ui-darr-white"></i>');

return __p.join("");
},

'file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n');
    __p.push('    <!-- 目录 -->\r\n\
    <div class="dirs-view">\r\n\
\r\n\
        <!-- 目录标题（“文件夹”） -->\r\n\
        <div id="_disk_files_dir_title" class="ui-title-bar" style="display:none;">\r\n\
            <h3 class="ui-title">');
_p(_('文件夹'));
__p.push('</h3>\r\n\
            <div class="ui-title-line"></div>\r\n\
        </div>\r\n\
\r\n\
        <!-- 空目录时的提示 -->\r\n\
        <div id="_disk_files_empty" class="dirs-empty">');
_p(_('该文件夹为空，您可以点击"上传"按钮或者使用微云客户端上传文件。'));
__p.push('</div>\r\n\
\r\n\
        <!-- 目录列表 -->\r\n\
        <div id="_disk_files_dir_list" class="dirs">\r\n\
            <!-- 嵌套模板 file_item -->\r\n\
        </div>\r\n\
    </div>\r\n\
\r\n\
    <!-- 文件 -->\r\n\
    <div class="files-view">\r\n\
\r\n\
        <!-- 标题（“文件”） -->\r\n\
        <div id="_disk_files_file_title" class="ui-title-bar" style="display:none;">\r\n\
            <h3 class="ui-title">');
_p(_('文件'));
__p.push('</h3>\r\n\
            <div class="ui-title-line"></div>\r\n\
        </div>\r\n\
\r\n\
        <!-- 文件列表 -->\r\n\
        <div id="_disk_files_file_list" class="files">\r\n\
            <!-- 嵌套模板 file_item -->\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        $ = require('$'),
        text = lib.get('./text'),
        constants = common.get('./constants'),

        click_tj = common.get('./configs.click_tj'),

        view_switch = require('./view_switch.view_switch'),

        click_enter_mode = constants.IS_APPBOX,

        p_dir = data.p_dir,
        files = data.files,
        only_content = data.only_content === true,
        show_thumb = data.show_thumb !== false,
        icon_map = data.icon_map,

        // 默认图片
        default_image = constants.RESOURCE_BASE + (view_switch.is_list_view() ? '/img/img-32.png' : '/img/img-70.png'),

        // 日期
        time_str_len = 'yyyy-MM-dd hh:mm'.length;


    $.each(files, function (i, file) {
        var is_dir = file.is_dir(),
            is_broken = file.is_broken_file(),
            is_image = file.is_image(),
            is_removable = file.is_removable(),
            is_movable = file.is_movable(),
            is_downable = file.is_downable(),
            is_renamable = file.is_renamable(),
            is_selectable = file.is_selectable(),
            is_whole_click = true,   /*click_enter_mode || p_dir.is_vir_dir() || file.is_vir_dir(),*/
            is_selected = file.get_ui().is_selected(),
            create_time = (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len),

            icon_cls = is_broken ? 'icon-filebroken' : (icon_map[file.get_icon()] || file.get_icon() || (is_image ? 'icon-image' : ('icon-' + (file.get_type() || 'file'))));

        if (!only_content) {
    __p.push('    <div id="_disk_file_item_');
_p(file.get_id());
__p.push('" data-file-id="');
_p(file.get_id());
__p.push('"');
_p(is_removable ? '':'data-no-remove');
__p.push(' ');
_p(is_movable ? '':'data-no-move');
__p.push(' ');
_p(is_downable ? '':'data-no-down');
__p.push('        ');
_p(is_renamable ? '':'data-no-rename');
__p.push(' ');
_p(is_selectable ? '':'data-no-sel');
__p.push(' ');
_p(is_whole_click ? 'data-whole-click':'');
__p.push('        class="list clear');
_p( [
            is_broken?' ui-broken':'',
            is_removable?'':' ui-no-remove',
            is_movable?'':' ui-no-move',
            is_downable?'':' ui-no-down',
            is_renamable?'':' ui-no-rename',
            is_selectable?'':' ui-no-sel',
            is_whole_click?' ui-whole-click':'',
            is_selected?' ui-selected':''
        ].join('') );
__p.push('">');

        }
    __p.push('        <label data-file-check class="checkbox"></label>\r\n\
        <span data-action="enter" class="img" ');
_p(click_tj.make_tj_str(is_dir ? 'FOLDER_ICON': 'FILE_ICON'));
__p.push('><i data-quick-drag data-ico class="filetype ');
_p( icon_cls );
__p.push('"></i></span>\r\n\
        <span data-action="enter" class="name ellipsis" ');
_p(click_tj.make_tj_str(is_dir ? 'FOLDER_NAME' : 'FILE_NAME'));
__p.push('><p class="text"><em><span data-quick-drag data-name="file_name">');
_p(text.text(file.get_name()));
__p.push('</span></em></p></span>\r\n\
\r\n\
        <span data-action="enter" class="tool">');
 if (!file.is_tempcreate() && !is_broken && !file.is_vir_dir()) { __p.push('                <a data-function="share" class="share_menu" href="#" hidefocus="on"><i class="ico-share"></i><i class="ico-point-bottom"></i></a>');
 } __p.push('            ');
 if (is_downable) { __p.push('                <a data-function="download" title="');
_p(_('下载'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('ITEM_DOWNLOAD'));
__p.push('><i class="ico-download"></i></a>');
 } __p.push('            ');
 if (is_removable) { __p.push('                <a data-function="remove" title="');
_p(_('删除'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('ITEM_DELETE'));
__p.push('><i class="ico-del"></i></a>');
 } __p.push('            ');
 if (is_movable) { __p.push('                <a data-function="move" title="');
_p(_('移动'));
__p.push('" href="#" hidefocus="on"><i class="ico-move"></i></a>');
 } __p.push('            ');
 if (is_renamable) { __p.push('                <a data-function="rename" title="');
_p(_('重命名'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('ITEM_RENAME'));
__p.push('><i class="ico-rename"></i></a>');
 } __p.push('        </span>\r\n\
\r\n\
        <span data-action="enter" class="size">');
_p( file.get_readability_size() );
__p.push('</span>\r\n\
        <span data-action="enter" class="time">');
_p( create_time );
__p.push('</span>');
 if (!only_content) { __p.push('    </div>');
 } __p.push('    ');

    });
    __p.push('');

return __p.join("");
},

'vir_dir_file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
/* 虚拟目录的文件视图（如文章、文字等） */
        var _ = require('i18n');
    __p.push('    <div data-view="special" data-no-selection class="app-inner" style="display: none;">');
/* 列表模式 */__p.push('        <div data-sub-view="list" class="feeds" style="display:none;">');
/* 目录（预留） */__p.push('            <ul data-type="dir" style="display:none;">');
/* message_item */__p.push('</ul>');
/* 文件 */__p.push('            <ul data-type="file" style="display:none;">');
/* message_item */__p.push('</ul>\r\n\
        </div>');
/* 缩略图模式 */__p.push('        <div data-sub-view="thumb" class="app-inner media-inner" style="display:none;">');
/* 目录（预留） */__p.push('            <div data-type="dir" class="dirs medias" style="display:none"></div>');
/* 文件 */__p.push('            <div data-type="file" class="files medias" style="display:none"></div>\r\n\
        </div>');
/* 加载更多 */__p.push('        <a data-action="more" href="#" class="load-more" style="visibility:hidden">');
_p(_('加载更多'));
__p.push('</a>\r\n\
        <p data-action="empty-tip" style="display:none;" class="empty-text"></p>\r\n\
    </div>');
/* 虚拟目录的经典视图（如微信、图片视频目录等） */__p.push('    <div data-view="classic" data-no-selection class="dirs-view-virtual" style="display: none;">');
/* 目录 */__p.push('        <div data-type="dir" class="dirs" style="display:none;"></div>');
/* 文件 */__p.push('        <div data-type="file" class="files" style="display:none;"></div>');
/* 加载更多 */__p.push('        <a data-action="more" href="#" class="load-more" style="visibility:hidden">');
_p(_('加载更多'));
__p.push('</a>\r\n\
        <p data-action="empty-tip" style="display:none;" class="empty-text"></p>\r\n\
    </div>');

return __p.join("");
},

'vir_dir_file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n'),

        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),

        text = lib.get('./text'),
        date_time = lib.get('./date_time'),

        view_switch = require('./view_switch.view_switch'),

        ui_virtual = require('./file_list.ui_virtual'),

        ui_ver = constants.UI_VER,

        icon_map = data.icon_map,

        // 默认图片
        default_image = constants.RESOURCE_BASE + (view_switch.is_list_view() ? '/img/img-32.png' : '/img/img-70.png'),

        text_short_len = 128, // 字节

        // 日期
        time_str_len = 'yyyy-MM-dd hh:mm'.length,

        undef;

    for (var i=0,l=data.files.length; i<l; i++) {
        var file = data.files[i],
            icon = icon_map[file.get_icon()] || file.get_icon() || '',
            file_name = text.text(file.get_name());

        switch (file.class_name) {

        /* 文字 */
            case 'PlaintextNode':
                var short_text = ui_virtual.fix_user_text(file.get_content(), text_short_len),
                    long_text = ui_virtual.fix_user_text(file.get_content());
              __p.push('<li id="_disk_vdir_item_');
_p( file.get_id() );
__p.push('" data-file-id="');
_p( file.get_id() );
__p.push('" class="feed-item ');
_p( i % 2 ? '':'odd');
__p.push('">\r\n\
                    <span class="aside">');
_p( this._date_time(file.get_create_time()) );
__p.push('                    </span>\r\n\
                    <div class="feed-cnt">\r\n\
                        <div class="feed-original">');
/* 短文本 */__p.push('                            <div data-name="short-text" class="ui-text">');
_p( short_text );
__p.push('</div>');
/* 长文本，默认隐藏 */__p.push('                            <div data-name="long-text" style="display:none;" class="ui-text">');
_p( long_text );
__p.push('</div>');
 if (short_text.length !== long_text.length || short_text !== long_text) { __p.push('                                <div class="feed-foot"><a data-action="text-expand" href="#">');
_p(_('点击展开'));
__p.push('</a></div>');
 } __p.push('                        </div>\r\n\
                        <span class="feed-action"><a data-action="remove" class="icon-rm" href="#" title="');
_p(_('删除'));
__p.push('">&times;</a></span>\r\n\
                    </div>\r\n\
                </li>');

            break;

        /* 语音 */
            case 'VoiceNode':
                var duration = file.get_duration(),
                    voice_width = 50,
                    bar_width = (duration<=30) ? (voice_width+(duration*5)) : (voice_width+(30*5)+(duration-30)*2);
              __p.push('                <li id="_disk_vdir_item_');
_p( file.get_id() );
__p.push('" data-file-id="');
_p( file.get_id() );
__p.push('" class="feed-item ');
_p( i % 2 ? '':'odd');
__p.push('">\r\n\
                    <span class="aside">');
_p( this._date_time(file.get_create_time()) );
__p.push('                    </span>\r\n\
                    <div class="feed-cnt">\r\n\
                        <div class="feed-original">\r\n\
                            <a data-action="play-voice" hidefocus="on" href="#" style="width:');
_p( bar_width );
__p.push('px;" class="audio"><i></i></a>\r\n\
                            <span data-action="play-time" class="audio-len">');
_p( duration );
__p.push('\'\'</span>\r\n\
                            <span data-action="play-loading" class="audio-status" style="display:none;">');
_p(_('正在载入...'));
__p.push('</span>\r\n\
                        </div>\r\n\
                        <span class="feed-action"><a data-action="remove" class="icon-rm" href="#" title="');
_p(_('删除'));
__p.push('">&times;</a></span>\r\n\
                    </div>\r\n\
                </li>');

            break;

        /* 文章 */
            case 'ArticleNode':
              __p.push('                <li id="_disk_vdir_item_');
_p( file.get_id() );
__p.push('" data-action="enter" data-file-id="');
_p( file.get_id() );
__p.push('" class="feed-item ');
_p( i % 2 ? '':'odd');
__p.push('">\r\n\
                    <span class="aside">');
_p( this._date_time(file.get_create_time()) );
__p.push('                    </span>\r\n\
                    <div class="feed-cnt">\r\n\
                        <div data-action="open" class="feed-original">\r\n\
                            <div class="ui-title">');
_p( text.text(file.get_title()) );
__p.push('</div>\r\n\
                            <div class="ui-text">');
_p( text.text(file.get_desc()) );
__p.push('</div>\r\n\
                        </div>\r\n\
                        <span class="feed-action"><a data-action="remove" class="icon-rm" href="#" title="');
_p(_('删除'));
__p.push('">&times;</a></span>\r\n\
                    </div>\r\n\
                </li>');

                break;

        /* 其他（目前目录、文件、图片和视频属于这个分类） */
            default:
                var is_dir = file.is_dir(),
                    is_image = file.is_image(),
                    is_video = file.get_type() === 'mp4';

                if (is_dir) {
                    var icon_cls = icon || 'icon-folder';
                    __p.push('                    <div id="_disk_vdir_item_');
_p(file.get_id());
__p.push('" data-action="enter" data-file-id="');
_p(file.get_id());
__p.push('" class="list clear list-nocheckbox">\r\n\
                        <span class="img"><i data-quick-drag data-ico class="filetype ');
_p( icon_cls );
__p.push('"></i></span>\r\n\
                        <span class="name ellipsis"><p class="text"><em><span data-quick-drag data-name="file_name">');
_p(text.text(file.get_name()));
__p.push('</span></em></p></span>\r\n\
                        <span class="size">');
_p( file.get_readability_size() );
__p.push('</span>\r\n\
                        <span class="time">');
_p( (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len) );
__p.push('</span>\r\n\
                    </div>');
 } else { __p.push('                    <div id="_disk_vdir_item_');
_p( file.get_id() );
__p.push('" data-action="enter" class="ui-item" data-file-id="');
_p( file.get_id() );
__p.push('">\r\n\
                        <span class="filemain">');
/*<label class="filecheck"></label>*/__p.push('                            <!-- code by fixed ie6 bug -->\r\n\
                            <span class="fileie6">\r\n\
                                <span data-tj-value="52301" data-tj-action="btn-adtag-tj" class="fileimg"><!-- 图标 -->');
 if (is_image) { __p.push('                                        <img src="http://imgcache.qq.com/vipstyle/nr/box/img/img-70.png" unselectable="on" style="visibility:hidden"/>');
 } else if (is_video) { __p.push('                                        <img src="http://imgcache.qq.com/vipstyle/nr/box/web/images/wx-video-default.png" unselectable="on"/>');
 } else { __p.push('                                        <i class="filetype ');
_p( icon );
__p.push('"></i>');
 } __p.push('                                </span>');
 if (!(is_image || is_video)) { /* 文件名 */ __p.push('                                    <span data-tj-value="52302" data-tj-action="btn-adtag-tj" title="');
_p( file_name );
__p.push('" class="filename" data-name="file_name">');
_p( file_name );
__p.push('</span>');
 } __p.push('                            </span>');
 if (!file.is_dir()) { __p.push('                                <!-- 文件功能菜单 -->\r\n\
                                <span class="filemenu">');
 if (file.has_newsurl()) { __p.push('                                        <a class="icon-goto" data-action="newsurl" title="');
_p(_('来源'));
__p.push('" href="#" hidefocus="on"></a>');
 } else { __p.push('                                        <a class="icon-download" data-action="download" title="');
_p(_('下载'));
__p.push('" href="#" hidefocus="on"></a>');
 } __p.push('                                    <a class="icon-del" data-action="remove" title="');
_p(_('删除'));
__p.push('" href="#" hidefocus="on"></a>\r\n\
                                </span>');
 } __p.push('                        </span>\r\n\
                    </div>');

                }
                break;
        }
    }
    __p.push('');

return __p.join("");
},

'_date_time': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('  ');
var lib = require('lib'),
        date_time = lib.get('./date_time'),
        time_values = date_time.readability(data);

    if (time_values[0] === 'today') {
      __p.push('<span class="feed-date">');
_p( time_values[1] );
__p.push('</span><span class="feed-time">');
_p( time_values[2] );
__p.push('</span>');

    }
    else if (time_values[0] === 'yesterday') {
      __p.push('<span class="feed-date">');
_p( time_values[1] );
__p.push('</span>');

    }
    else {
      __p.push('<span class="feed-day">');
_p( time_values[1] );
__p.push('</span><span class="feed-month">');
_p( time_values[2] );
__p.push('</span>');

    }__p.push('');

return __p.join("");
},

'all_checker': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <label data-file-check class="checkall"></label>');

return __p.join("");
},

'file_path_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\r\n\
    <div class="inner">\r\n\
        <div class="wrap">\r\n\
            <div id="_disk_file_path_inner" class="main-path">');
/* 内嵌 file_path_items */__p.push('            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'file_path_items_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        text = lib.get('./text'),

        file_list = require('./file_list.file_list'),

        common = require('common'),
        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),

        name_len = constants.UI_VER === 'WEB' ? 10 : 5,
        target_node = data.target_node, // 目标目录
        nodes = data.nodes, // 当前目录的所有父节点列表
        enable = data.enable !== false, // 是否可点击
        disable_class = 'ui-bread-current',
        z_index_start = constants.DIR_DEEP_LIMIT + 1;

    if (nodes && nodes.length) {
        $.each(nodes, function (i, node) {
            var first = i <= 0,
                is_cur = target_node === node,
                name = text.text(text.smart_sub(node.get_name(), name_len));
            __p.push('            <a ');
 if (!is_cur) { __p.push(' data-file-id="');
_p( node.get_id() );
__p.push('" ');
 } __p.push(' style="z-index:');
_p( z_index_start - i );
__p.push(';" class="path ');
_p( is_cur ? 'current':'' );
__p.push('" href="#" hidefocus="on">');
_p( name );
__p.push('</a>');

        });
    }
    __p.push('');

return __p.join("");
},

'file_path_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="step">\r\n\
        <table class="step-inner"></table>\r\n\
    </div>');

return __p.join("");
},

'file_path_items_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        text = lib.get('./text'),

        file_list = require('./file_list.file_list'),

        common = require('common'),
        click_tj = common.get('./configs.click_tj'),

        name_len = 10,
        nodes = data.nodes, // 当前目录的所有父节点列表
        enable = data.enable !== false, // 是否可点击
        disable_class = 'ui-bread-current';

    if (nodes && nodes.length) {
        __p.push('        <tbody><tr>');

        var cur_node = file_list.get_cur_node();
        if (cur_node) {
            var cur_dir_id = cur_node.get_id();
            $.each(nodes, function (i, node) {
                var name = text.text(text.smart_sub(node.get_name(), name_len)),
                    // 是否是第一个，样式显示需要
                    first = i <= 0,
                    // 是否最末级
                    leaf = i === nodes.length - 1,
                    // 是否是当前目录
                    is_cur = node.get_id() === cur_dir_id;


                __p.push('<td class="');
_p( leaf ? 'current':'' );
__p.push(' ');
_p( enable ? '':'disabled' );
__p.push('" data-cur-node="');
_p(is_cur);
__p.push('" ');
 if(enable && !leaf){__p.push(' data-file-id="');
_p(node.get_id());
__p.push('" ');
} __p.push('>');

                if(first){
                    __p.push('                        <a hidefocus="on" class="step-text" ');
_p(click_tj.make_tj_str('DISK_BREAD_WEIYUN'));
__p.push('>');
_p(name);
__p.push('                        </a>\r\n\
                        <i class="border"></i>');

                }else{
                    __p.push('                        <a hidefocus="on" class="step-arr" ');
_p(click_tj.make_tj_str('DISK_BREAD_DIR'));
__p.push('>\r\n\
                            <span class="step-text">');
_p(name);
__p.push('</span>\r\n\
                        </a>');

                }
                __p.push('</td>');

            });
        }
        __p.push('        </tr></tbody>');

    }
    __p.push('');

return __p.join("");
},

'view_switch_APPBOX': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
    _ = require('i18n'),
    common = require('common'),
    click_tj = common.get('./configs.click_tj');
    cur_view = data.cur_view;
    __p.push('    <div data-no-selection class="view-mode">\r\n\
        <span data-view="newestlist" title="');
_p(_('按时间排序'));
__p.push('"    class="');
_p( 'newestlist' === cur_view ? 'on':'' );
__p.push('"  ');
_p(click_tj.make_tj_str('SWITCH_NEWESTLIST_MODE'));
__p.push('><a class="vm-l vm-time" hidefocus="on" href="#"><i></i></a></span>\r\n\
        <span data-view="azlist"     title="');
_p(_('按A-Z顺序排序'));
__p.push('" class="');
_p( 'azlist' === cur_view ? 'on':'' );
__p.push('"      ');
_p(click_tj.make_tj_str('SWITCH_AZLIST_MODE'));
__p.push('    ><a class="vm-m vm-a-z"  hidefocus="on" href="#"><i></i></a></span>\r\n\
        <span data-view="grid"       title="');
_p(_('显示缩略图'));
__p.push('"    class="');
_p( 'grid' === cur_view ? 'on':'' );
__p.push('"        ');
_p(click_tj.make_tj_str('SWITCH_NEWTHUMB_MODE'));
__p.push('  ><a class="vm-r vm-thum" hidefocus="on" href="#"><i></i></a></span>\r\n\
    </div>');

return __p.join("");
},

'view_switch_WEB': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        _ = require('i18n'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj');
        cur_view = data.cur_view;
    __p.push('    <div data-no-selection class="view-mode">\r\n\
        <span data-view="newestlist"  class="');
_p( 'newestlist' === cur_view ? 'on':'' );
__p.push('" ');
_p(click_tj.make_tj_str('SWITCH_NEWESTLIST_MODE'));
__p.push(' ><a title="');
_p(_('按时间排序'));
__p.push('" class="vm-l vm-time" href="#" hidefocus="on"><i></i></a></span>\r\n\
        <span data-view="azlist"      class="');
_p( 'azlist' === cur_view ? 'on':'' );
__p.push('"     ');
_p(click_tj.make_tj_str('SWITCH_AZLIST_MODE'));
__p.push('     ><a title="');
_p(_('按A-Z顺序排序'));
__p.push('" class="vm-m vm-a-z" href="#" hidefocus="on"><i></i></a></span>\r\n\
        <span data-view="grid"        class="');
_p( 'grid' === cur_view ? 'on':'' );
__p.push('"       ');
_p(click_tj.make_tj_str('SWITCH_NEWTHUMB_MODE'));
__p.push('   ><a title="');
_p(_('显示缩略图'));
__p.push('" class="vm-r vm-thum" href="#" hidefocus="on"><i></i></a></span>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
