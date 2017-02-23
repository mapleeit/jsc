//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/disk/disk.r20140122",["lib","common","$","main","i18n","offline_guide_css"],function(require,exports,module){

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
//disk/src/file_list/file_processor/move/chose_directory.js
//disk/src/file_list/file_processor/move/move.js
//disk/src/file_list/file_processor/move/ui.js
//disk/src/file_list/file_processor/remove/remove.js
//disk/src/file_list/file_processor/remove/ui.js
//disk/src/file_list/file_processor/vir_remove/vir_remove.js
//disk/src/file_list/menu/menu.js
//disk/src/file_list/offline/Select.js
//disk/src/file_list/offline/Store.js
//disk/src/file_list/offline/offline_columns.js
//disk/src/file_list/offline/offline_guide.js
//disk/src/file_list/offline/offline_opener.js
//disk/src/file_list/rename/rename.js
//disk/src/file_list/rename/ui.js
//disk/src/file_list/selection/selection.js
//disk/src/file_list/share/share.js
//disk/src/file_list/share/ui.js
//disk/src/file_list/sorter.js
//disk/src/file_list/thumb/thumb.js
//disk/src/file_list/thumb/ui.js
//disk/src/file_list/tree/Tree.js
//disk/src/file_list/tree/TreeLoader.js
//disk/src/file_list/tree/TreeNode.js
//disk/src/file_list/tree/TreeNodeUI.js
//disk/src/file_list/tree/TreeView.js
//disk/src/file_list/ui.js
//disk/src/file_list/ui_abstract.js
//disk/src/file_list/ui_normal.js
//disk/src/file_list/ui_offline.js
//disk/src/file_list/ui_virtual.js
//disk/src/file_path/all_checker.js
//disk/src/file_path/file_path.js
//disk/src/file_path/ui.js
//disk/src/toolbar/status.js
//disk/src/toolbar/tbar.js
//disk/src/ui.js
//disk/src/view_switch/ui.js
//disk/src/view_switch/view_switch.js
//disk/src/disk.tmpl.html
//disk/src/file_list/file_processor/move/move.tmpl.html
//disk/src/file_list/offline/offline_columns.tmpl.html
//disk/src/file_list/offline/offline_guide.tmpl.html
//disk/src/file_list/rename/rename.tmpl.html
//disk/src/file_list/selection/selection.tmpl.html
//disk/src/file_list/share/share.APPBOX.tmpl.html
//disk/src/file_list/tree/Tree.tmpl.html
//disk/src/file_list/ui_normal.tmpl.html
//disk/src/file_list/ui_offline.tmpl.html
//disk/src/file_list/ui_virtual.tmpl.html
//disk/src/file_path/all_checker.tmpl.html
//disk/src/file_path/file_path.tmpl.html
//disk/src/view_switch/view_switch.tmpl.html

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
//disk/src/file_list/file_processor/move/chose_directory.js
//disk/src/file_list/file_processor/move/move.js
//disk/src/file_list/file_processor/move/ui.js
//disk/src/file_list/file_processor/remove/remove.js
//disk/src/file_list/file_processor/remove/ui.js
//disk/src/file_list/file_processor/vir_remove/vir_remove.js
//disk/src/file_list/menu/menu.js
//disk/src/file_list/offline/Select.js
//disk/src/file_list/offline/Store.js
//disk/src/file_list/offline/offline_columns.js
//disk/src/file_list/offline/offline_guide.js
//disk/src/file_list/offline/offline_opener.js
//disk/src/file_list/rename/rename.js
//disk/src/file_list/rename/ui.js
//disk/src/file_list/selection/selection.js
//disk/src/file_list/share/share.js
//disk/src/file_list/share/ui.js
//disk/src/file_list/sorter.js
//disk/src/file_list/thumb/thumb.js
//disk/src/file_list/thumb/ui.js
//disk/src/file_list/tree/Tree.js
//disk/src/file_list/tree/TreeLoader.js
//disk/src/file_list/tree/TreeNode.js
//disk/src/file_list/tree/TreeNodeUI.js
//disk/src/file_list/tree/TreeView.js
//disk/src/file_list/ui.js
//disk/src/file_list/ui_abstract.js
//disk/src/file_list/ui_normal.js
//disk/src/file_list/ui_offline.js
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
define.pack("./disk",["lib","common","$","./tmpl","main","./ui","./file_list.file_list","./file_path.file_path","./toolbar.tbar","./view_switch.view_switch"],function (require, exports, module) {

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
        tmpl = require('./tmpl'),

        slice = [].slice,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;

    var disk = new Module('disk', {

        ui: require('./ui'),

        params_invoke_map: {
            path: 'set_path'
        },

        set_path: function (path) {
            require('./file_list.file_list').set_path(path);
        },

        set_init_data: function (usr, rsp_body) {
            require('./file_list.file_list').set_init_data(usr, rsp_body);
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
            file_list_ui = file_list.ui,
            file_path = require('./file_path.file_path'),
            tbar = require('./toolbar.tbar'),
            view_switch = require('./view_switch.view_switch');


        this.render_sub(tbar, main_ui.get_$bar1());
        this.render_sub(file_path, main_ui.get_$bar2());
        this.render_sub(view_switch, tbar.get_$el());
        this.render_sub(file_list, ui.get_$body());
        // 视图切换按钮嵌入在工具条上

        //APPBOX添加微云到主面板引导页面启动
        if (constants.IS_APPBOX) {
                require.async('add_wy_appbox', function (add_wy_appbox){
                    try {
                        add_wy_appbox.get("./add_wy_appbox");
                        add_wy_appbox_event.trigger('is_wy_in_appbox');
                    }catch (e) {

                    }
                });
        }
        
        // 当ui大小变动时，发出resize事件，使得main能动态调整主容器的大小
        this.listenTo(file_list_ui, 'frame_height_changed', function(){
            this.trigger('resize');
        });
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
     *    {String}  life_time       剩余有效时间
     *    {String}  belong_type     文件来源类型
     *    {String}  uin             文件来源UIN
     *    {String}  nickname        文件来源nickname
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
        me._belong_type = options.belong_type || '';
        me._uin = options.uin || '';
        me._nickname = options.nickname || '';
        me._has_image = !!options.has_image;
        me._has_video = !!options.has_video;
        me._has_text = !!options.has_text;
        me._has_voice = !!options.has_voice;
        me._has_article = !!options.has_article;
        me.set_life_time(options.life_time);
        me._ui = new FileNodeUI(me);
    };

    FileNode.prototype = $.extend({}, File.prototype, {
        set_life_time: function(life_time){
            if(life_time){
                this._life_time = life_time - 0;
            } else {
                this._life_time = 0;
            }
        },
        get_life_time: function(){
            return this._life_time;
        },
        //获取文件来源类型 数字标示
        get_down_type: function(){
            return this._belong_type === 'recv_list' ? 2 : 1;
        },
        //获取文件来源uin
        get_uin: function(){
            return this._uin;
        },
        //获取文件来源nickname
        get_nickname:function(){
            return this._nickname;
        },
        //离线文件目录
        is_offline_dir: function(){
            return this.is_vir_dir() && constants.OFFLINE_DIR === this.get_id().substr(8);
        },
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
        //判断是否 离线文件
        is_offline_node: function(){
            return this.get_parent() && this.get_parent().is_offline_dir() ;
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
         * 获取所有文件的完整路径
         * @returns {FileNode[]}
         */
        get_path_nodes: function () {
            var path = [this],
                p = this;
            while (p = p.get_parent()) {
                path.push(p);
            }
            path.reverse();
            return path;
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

    var route_hash_map;
    // 通过virtual_dir_id获取它的 route hash name
    function get_route_hash(id){
        var recursive;
        // 将constants中定义的各虚拟目录的id取出来，生成快查map
        if(!route_hash_map){
            route_hash_map = {};
            recursive = function(map){
                var name, node, children;
                for(name in map){
                    if(map.hasOwnProperty(name)){
                        node = map[name];
                        route_hash_map[node.id] = name;
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
        if(route_hash_map.hasOwnProperty(common_id)){
            return route_hash_map[common_id];
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
            var options = {
                is_dir: true,
                is_vir_dir: true,
                route_hash : obj.route_hash || get_route_hash(id),
                id: id,
                name: obj['dir_name'],
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
                    modify_time: obj['dir_mtime']
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
                    life_time:obj['file_life_time'],
                    belong_type:obj['belong_type'],
                    uin:obj['uin'],
                    nickname:obj['nickname'],
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
                    life_time:obj['file_life_time'],
                    belong_type:obj['belong_type'],
                    uin:obj['uin'],
                    nickname:obj['nickname'],
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
define.pack("./file_list.file_list",["lib","common","$","main","./file.file_node","./file.utils.file_factory","./file.utils.all_file_map","./file_list.offline.Store","./file.utils.file_node_from_cgi","i18n","./file_list.ui","./file_list.file_processor.remove.remove","./file_list.file_processor.move.move","./file_list.selection.selection","./view_switch.view_switch","./file_list.sorter"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/file_list'),
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
        // disk_event = common.get('./global.global_event').namespace('disk'),
        global_function = common.get('./global.global_function'),
        global_variable = common.get('./global.global_variable'),
        ret_msgs = common.get('./ret_msgs'),
        m_speed = common.get('./m_speed'),
        main_mod = require('main'),
    //main_ui = main_mod.get('./main.ui'),

        FileNode = require('./file.file_node'),
        file_factory = require('./file.utils.file_factory'),
        all_file_map = require('./file.utils.all_file_map'),
        offline_store = require('./file_list.offline.Store'),
        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),

        upload_event = common.get('./global.global_event').namespace('upload2'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.file_list',
        l_dir_name = 'disk.file_list.dir_name',
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

        curr_node, // 当前所在的目录节点
        last_node, // 上一次所在的目录节点 james 2013-6-5
        last_load_req, // 上一次请求的 request 实例

        first_loaded,

        GET_DIR_INFO_CGI = 'http://api.weiyun.com/get_home_list',//根据appid获取目录信息的cgi

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
                .listenTo(remove, 'has_removed', function (file_ids) {
                    var nodes = all_file_map.get_all(file_ids);
                    this.remove_nodes(nodes, true, true);
                })

                // 文件已从服务器上移动后，同步本地缓存
                .listenTo(move, 'has_moved', function (file_ids, par_id, dir_id) {
                    var file_nodes = all_file_map.get_all(file_ids);
                    this.move_nodes(file_nodes, dir_id);
                })

                // 切换视图后，排序
                .listenTo(view_switch, 'switch.ui_normal', function (is_grid, is_list, view_name, temp) {
                    if (!temp) {
                        var cur_node = this.get_cur_node();
                        if (cur_node) {
                            this._sort_cur_node(cur_node);
                            this.trigger('load', cur_node, false);
                        }
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

                // 强插
                me.trigger('external_insert_files', restore_ids, restore_msg, restore_is_ok);

                // 如果不是跳转打开目录，则重新加载
                if (routers.get_param('reload') !== '0') {
                    // 如果有还原文件，则刷新根目录
                    if (restore_ids && restore_ids.length > 0) {
                        me.load_root(false, false);
                    } else {
                        // 从内存中重新加载
                        me.reload(true, false, false);  // true -> false 和erric确认过，返回网盘时保持网盘当前状态，不跳转到根目录。james
                    }
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
                            me.load(enter_dir, from_cache, reset_ui);
                        })
                        .fail(function () {
                            me.load(node, from_cache, reset_ui);
                        });
                } else {
                    if (node)
                        me.load(node, from_cache, reset_ui);
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
         * 1: 离线文件目录
         * 2: 翻译国际化
         * @param [vir_dirs] 虚拟目录
         * @param [dirs] 正常目录
         */
        traversal_dir: function(vir_dirs,dirs){
            var me = this,node,len;
            if(vir_dirs && vir_dirs.length){
                len = vir_dirs.length;
                while(len){
                    len-=1;
                    node = vir_dirs[len];
                    node.set_name(_(l_dir_name,node.get_name()));
                    if(node.is_offline_dir()){
                        me.offline_dir = vir_dirs[len];
                    }
                }
            }
            if(dirs && dirs.length){
                len = dirs.length;
                while(len){
                    len -= 1;
                    node = dirs[len];
                    if(node){
                        node.set_name(_(l_dir_name,node.get_name()));
                    }
                }
            }
        },
        /**
         * 处理直出数据
         * @param {User} usr query_user.User
         * @param {Object} rsp_body 从CGI返回的body
         */
        set_init_data: function (usr, rsp_body) {
            this.init(usr);

            var _vir_dirs = file_node_from_cgi.vir_dirs_from_cgi(rsp_body['virtual_dirs']),
                _dirs = file_node_from_cgi.dirs_from_cgi(rsp_body['dirs']);

            this.traversal_dir(_vir_dirs,_dirs);

            var dirs = [].concat(_vir_dirs, _dirs),
                files = file_node_from_cgi.files_from_cgi(rsp_body['files']);

            root_node.set_nodes(dirs, files);
            root_node.set_dirty(false);
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
                    is_super: true
                });

                // 根节点
                root_node = file_factory.create('FileNode', {
                    id: user.get_main_key(),
                    name: _(l_key,'微云'),
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
                if (node.is_offline_dir()) {
                    // 上一次所在的节点
                    last_node = curr_node;
                    file_list.set_cur_node(node);
                    file_list.trigger('before_load', node, last_node, true);
                    file_list.trigger('before_async_load', node);
                    return offline_store.render(node,reset_ui);
                } else {
                    return this.load_vir_dir(node, 0, 400);
                }
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

                //排除正在上传的破损文件，防止被删除，导致上传失败
                var curr_upload_file = upload_event.trigger('get_curr_upload_file_id');
                files = $.map(files, function (file) {
                    if (file.get_id() !== curr_upload_file) {
                        return file;
                    }
                });

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
            var me = this;
            this.init();

            var data_handler = function (body) {
                var _vir_dirs = file_node_from_cgi.vir_dirs_from_cgi(body['virtual_dirs']),
                    _dirs = file_node_from_cgi.dirs_from_cgi(body['dirs']);

                me.traversal_dir(_vir_dirs,_dirs);

                var dirs = [].concat(_vir_dirs, _dirs),
                    files = file_node_from_cgi.files_from_cgi(body['files']);

                //排除正在上传的破损文件，防止被删除，导致上传失败
                var curr_upload_file = upload_event.trigger('get_curr_upload_file_id');
                files = $.map(files, function (file) {
                    if (file.get_id() !== curr_upload_file) {
                        return file;
                    }
                });

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
         *  加载离线文档目录
         */
        load_offline_dir: function(){
            this.offline_dir && this.load(this.offline_dir,true);
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

                // 重新排序 // TODO 优化，在fileNode中记录排序方式，在这里检查排序方式是否变化，若变化，则需要重新排序 - james
                var sorted = me._sort_data(node.get_kid_dirs(), node.get_kid_files());
                node.set_nodes(sorted[0], sorted[1]);

                def.resolve(node);

                me.trigger('load', node, reset_ui);
                me._mark_as_first_loaded();
//                disk_event.trigger('file_list_load', node);

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

                        // 排序
                        var sorted = me._sort_data(dirs_files[0], dirs_files[1]);

                        // 写入节点
                        node.set_nodes(sorted[0], sorted[1]);

                        def.resolve(node);

                        me.trigger('load', node, reset_ui);
//                        disk_event.trigger('file_list_load', node);
                    })
                    .fail(function (msg, ret) {
                        me.trigger('error', msg, ret);

                        def.reject(msg, ret);
                    })
                    .done(function () {
                        me.trigger('after_async_load');

                        // 首次加载列表
                        me._mark_as_first_loaded();

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
                    me.traversal_dir(_dirs);
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

                    last_load_req = null;
                });

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
                return me.load_root(from_cache, false);
            }

            var target_node = all_file_map.get(parent_id);
            if (!target_node) {
                console.error('file_list.load_path() 未找到id=' + parent_id + '的目录');
                return null;
            }

            // 如果已经在当前目录下了，则立刻回调
            if (me.get_cur_node() && path_nodes[path_nodes.length - 1] === me.get_cur_node().get_id()) {
                return me.load(curr_node, true, false);
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

            return me.load(last_kid, from_cache, false);
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
                    if (node && !reload_root && !me._path) {

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

        _mark_as_first_loaded: function () {
            if (!first_loaded) {
                first_loaded = 1;
                this.trigger('first_load_done');
            }
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
         * 在后方追加一个子节点
         * @param {FileNode} node
         * @param {Boolean} cover 是否覆盖重名文件
         * @param {String} target_dir_id 目标目录ID（如果是当前目录，会触发UI事件）
         */
//        append_node: function (node, cover, target_dir_id) {
//            this._add_node([node], cover, target_dir_id, false);
//        },

        /**
         * 在指定位置插入一些子节点，可以是任意位置...
         */
//        add_node: function (node, cover, target_dir_id, index) {
//            var cur_node = this.get_cur_node(), target_node;
//            if (!cur_node) {
//                throw '目录树未就绪';
//            }
//
//            if (!target_dir_id) {
//                if (cur_node) {
//                    target_dir_id = cur_node.get_id();
//                } else {
//                    target_dir_id = root_node.get_id();
//                }
//            }
//            target_node = all_file_map.get(target_dir_id);
//
//            if (target_node) {
//                target_node.set_dirty(true);
//                target_node.add_node(node, index);
//
//                // 如果是当前目录，会触发UI事件
//                if (cur_node && cur_node.get_id() === target_node.get_id()) {
//
//                    var dirs = [], files = [];
//                    (node.is_dir() ? dirs : files)[0] = node;
//
//                    this.trigger('add_node', dirs, files, index);
//                }
//            }
//        },

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
                    var
                        new_name_map = collections.array_to_set(nodes, function (node) {
                            return node.get_name();
                        }),
                        name_conflicted = collections.grep(target_node.get_kid_nodes(), function (node) {
                            return new_name_map.hasOwnProperty(node.get_name());
                        });

                    if (name_conflicted.length) {
                        this.remove_nodes(name_conflicted, false, false);
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

        _sort_cur_node: function (cur_node) {
            var dirs = cur_node.get_kid_dirs() || [], files = cur_node.get_kid_files() || [];
            var sorted = this._sort_data(dirs, files)
            cur_node.set_nodes(sorted[0], sorted[1]);
        },

        _sort_data: function (dirs, files) {
            var sort_meta = this._get_sort_meta();
            var dirs_files = this._get_sorter().sort_datas([dirs, files], sort_meta.field, sort_meta.dir);

            var files = dirs_files[1],
            // 取出虚拟目录，放到最前方
                dirs = dirs_files[0],
                vir_dirs = [],
                norm_dirs = [];

            for (var i = 0, l = dirs.length; i < l; i++) {
                var dir = dirs[i];
                (dir.is_vir_dir() ? vir_dirs : norm_dirs).push(dir);
            }
            dirs = vir_dirs.concat(norm_dirs);

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
                    var def = me.load(dir_QQ, load_from_cache, false); // false->刷新列表时不重置UI
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
                    }

                    cgi_report(ret);
                });
        },

        /**
         * 根据appid，获取对应目录的信息
         * @param {Number} appid
         * @private
         */
        _async_get_dir_info: function (appid) {

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
                .done(function (json) {

                    var data = json.data,
                        ret = json.ret,
                        msg;

                    if (!json.data || ret !== 0) {
                        console.error('获取(appid为：' + appid + ')对应目录失败:', ret);
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
        _enter_spec_dir: function (data, callback) {

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
        }

    });


    module.exports = file_list;
});/**
 *
 * @author jameszuo
 * @date 13-3-16
 */
define.pack("./file_list.file_processor.move.chose_directory",["lib","common","$","./file.utils.file_node_from_cgi","./tmpl","i18n","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),
        mini_tip = common.get('./ui.mini_tip'),
        event = common.get('./global.global_event').namespace('chose_directory_event'),

        file_list,

        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),
        tmpl = require('./tmpl'),
        long_long_ago = '1970-01-01 00:00:00',
        _ = require('i18n').get('./pack'),
        l_key = 'disk.move',

        MSG_ALREADY_IN = _(l_key,'文件已经在该文件夹下了'),
        MSG_NO_DEEP = _(l_key,'不能将文件移动到自身或其子文件夹下'),
        done_key,
        undefined;
    //
    var dir_dialog_ui = new Module('disk_dir_dialog_ui', {

        render: function (key) {
            done_key = key;
            if (this.has_render) {
                return;
            }
            file_list = require('./file_list.file_list');
            this.has_render = true;
            this
                .listenTo(event, 'error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(event, 'show_dialog', function (files) {
                    (new FileMoveBox(files)).show();
                });

        }
    });

    /**
     * 文件移动对话框
     * @param {Array<FileNode>} files
     * @constructor
     */
    var FileMoveBox = function (files) {

        var me = this;

        me._files = files;
        me._chosen_id = me._chosen_par_id = null;

        var root_dir = file_list.get_root_node(),
            root_id = root_dir.get_id(),
            root_par_id = root_dir.get_parent().get_id();

        me._$el = $(tmpl.file_move_box({
            files: files,
            root_dir: root_dir,
            oper_name:_(l_key,'另存为')
        }));

        me._dialog = new widgets.Dialog({
            klass: 'file-mv-box',
            title: _(l_key,'选择存储位置'),
            destroy_on_hide: true,
            content: me._$el,
            buttons: [ 'OK', 'CANCEL' ],
            handlers: {
                OK: function () {
                    if (me._chosen_id) {
                        me.close();
                        event.trigger(done_key+'_done', me._files, me._chosen_par_id, me._chosen_id);
                    } else {
                        me._dialog.error_msg(_(l_key,'请选中要存放的目录'));
                    }
                },
                CANCEL: function(){
                    me.close();
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
                    .listenTo(event, 'load_sub_dirs', function (dir_nodes, par_id) {
                        this.render_$dirs_dom(dir_nodes, par_id);
                    })
                    .listenTo(event, 'load_sub_dirs_error', function (msg) {
                        this._dialog.error_msg(msg);
                    })
                    .listenTo(event, 'before_load_sub_dirs', function (dir_id) {
                        this.mark_loading(dir_id, true);
                    })
                    .listenTo(event, 'after_load_sub_dirs', function (dir_id) {
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
        /**
         * 获取指定目录的子目录
         * @param {String} node_par_id
         * @param {String} node_id
         */
        load_sub_dirs: function (node_par_id, node_id) {
            event.trigger('before_load_sub_dirs', node_id);
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
                    event.trigger('load_sub_dirs', dirs, node_id);
                })
                .fail(function (msg, ret) {
                    event.trigger('load_sub_dirs_error', msg, ret);
                })
                .done(function () {
                    event.trigger('after_load_sub_dirs', node_id);
                });
        },
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
            this.load_sub_dirs(par_id, dir_id);
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

    return dir_dialog_ui;
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
         * @param {String} [op] op in ops
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
define.pack("./file_list.file_processor.move.ui",["lib","common","$","./tmpl","i18n","./file_list.file_processor.move.move","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        _ = require('i18n').get('./pack'),
        l_key = 'disk.move',
        MSG_ALREADY_IN = _(l_key,'文件已经在该文件夹下了'),
        MSG_NO_DEEP = _(l_key,'不能将文件移动到自身或其子文件夹下'),

        undefined;

    var ui = new Module('disk_file_move_ui', {

        render: function () {

            move = require('./file_list.file_processor.move.move');

            file_list = require('./file_list.file_list');

            this
                .listenTo(move, 'step', function (cursor, length) {
                    progress.show(text.format(_(l_key,'正在移动第{0}/{1}个文件'), [cursor, length]));
                })
                .listenTo(move, 'done', function () {
                    progress.hide();
                })
                .listenTo(move, 'all_moved', function () {
                    mini_tip.ok(_(l_key,'文件移动成功'));
                })
                .listenTo(move, 'error', function (msg) {
                    mini_tip.error(msg);
                })
                .listenTo(move, 'part_moved', function (msg) {
                    mini_tip.warn(_(l_key,'部分文件移动失败：') + msg);
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
            title: _(l_key,'选择存储位置'),
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
         * @param {String} type 什么类型的删除 'offline':离线文件 ，否则为网盘删除
         * @param {Object} [construct_args] 删除请求对象构造参数
         * @param {function}  [fn_tip_msg] 获取 删除时的提示消息 参数(1:待删除文件中的第一个文件名称,2: 待删除的文件长度，3: 待删除文件的量词描述 ), 返回 {title:'',up_msg:'',down_msg:'',escape_html:'boolean类型支持输入html'}
         */
        remove_confirm: function (files, op, white_mask, type, construct_args , fn_tip_msg) {
            var me = this,
                remover = function(){
                    return type === 'offline' ? new Offline_Remover(files, construct_args)
                        :  new Remover(files, op);
                }();
            this.trigger('remove_confirm', files, remover, function () {
                me._start_remove(remover, white_mask);
            }, function () {
                remover.destroy();
            },fn_tip_msg);

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
					var new_file = all_file_map.get(file.get_id());
                    availableFiles.push(new_file || file);
				});
                if (first.is_dir()) {
                    data['del_folders'] = $.map(availableFiles, function (file) {
                        return {
                            ppdir_key: file.get_ppid ? file.get_ppid() : file.get_parent().get_pid(),
                            pdir_key: file.get_pid(),
                            dir_key: file.get_id(),
                            flag: 1,
                            dir_name: encode(file.get_name())
                        };
                    });
                } else {
                    data['del_files'] = $.map(availableFiles, function (file) {
                        return {
                            ppdir_key: file.get_ppid ? file.get_ppid() : file.get_parent().get_pid(),
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

    /**
     * 离线文件删除类
     * @param {Array<FileNode>} files
     * @param {Object} construct_args
     * @constructor
     * @extends RequestTask
     */
    var Offline_Remover = function (files, construct_args) {

        var proc_options = {
            step_size: query_user.get_cached_user().get_files_remove_step_size(),
            files: files,
            ok_rets: [0, 1019, 1020], // 文件不存在时就认为删除成功
            url: 'http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg',
            cmd_parser: function (frag_files) {
                return 'delete_virtual_file';
            },
            data_parser: function (frag_files) {
                var data = {},
                    encode = encodeURIComponent;
                // fix bug 48711149 by zhangzhang, at 2013/05/16.
                // 文件上传完成后会刷新文件列表，所以这里的实例可能已经过期了，无法取得正确的父目录等，需要更新实例
                var availableFiles = [];
                $.each(frag_files, function (index, file) {
                    file = all_file_map.get(file.get_id());
                    if (file) {
                        availableFiles.push(file);
                    }
                });
                data['pdir_key'] = construct_args.pdir_key;
                data['files'] = $.map(availableFiles, function (file) {
                    return {
                        owner_type: file.get_down_type(),//离线文件 请求下载的类型：1表示下载发送的文件，2表示下载接收的文件
                        peer_uin: file.get_uin(),
                        file_id: file.get_id(),
                        file_name: encode(file.get_name()) || ''
                    };
                });
                return data;
            }
        };

        RequestTask.call(this, proc_options);
    };

    $.extend(Offline_Remover.prototype, RequestTask.prototype);

    return remove;
});/**
 * (批量)删除文件\目录
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_list.file_processor.remove.ui",["lib","common","$","i18n","./file_list.file_processor.remove.remove"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        progress = common.get('./ui.progress'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.remove',
        undefined;

    var ui = new Module('disk_file_remove_ui', {

        render: function () {

            var remove = require('./file_list.file_processor.remove.remove');

            var me = this;
            
            var full_width = 290;
            var measurer = text.create_measurer(document.body);

            me
                .listenTo(remove, 'remove_confirm', function (files, remover, on_yes, on_no,fn_tip_msg) {
                    var
                        unit = files.length > 1 ? '些' : '个',
                        tip_msgs,
                    // 文件、文件夹
                        thing = collections.any(files, function (f) {
                            return !f.is_dir();
                        }) ? '文件' : '文件夹';
                    if(fn_tip_msg){
                        tip_msgs = fn_tip_msg.call(null,files[0].get_name(),files.length,thing);//参数 待删除文件中的第一个文件名称，待删除的文件长度，待删除的文件 量词描述 ,是否避免html转义
                    }else{
                        var full_filenames = files[0].get_name(),
                            file_suffix = (files.length > 1 ? text.format(_(l_key,'等{0}个文件'),[files.length]) : ''),
                            file_suffix_length = file_suffix ? measurer.measure(file_suffix).width : 0,
                            filenames = measurer.ellipsis(full_filenames, full_width - file_suffix_length);
                        tip_msgs = {
                            title: _(l_key,'删除文件'),
                            up_msg: _(l_key,text.format('确定删除这{unit}{thing}吗？', { unit: unit, thing: thing })),
                            down_msg: {
                                text : filenames + file_suffix,
                                tip : full_filenames + file_suffix
                            }
                        };
                    }

                    widgets.confirm(
                        tip_msgs.title,
                        tip_msgs.up_msg,
                        tip_msgs.down_msg,
                        function () {

                            on_yes(remover);
                        },
                        function () {
                            on_no(remover);
                        },
                        null,
                        tip_msgs.escape_html
                    );
                })

                .listenTo(remove, 'all_removed', function () {
                    mini_tip.ok(_(l_key,'删除成功'));
                })

                .listenTo(remove, 'part_removed', function (msg) {
                    mini_tip.warn(_(l_key,'部分文件删除失败：') + msg);
                })

                .listenTo(remove, 'step', function (cursor, length, white_mask) {
                    var title = length === 1 ? _(l_key,'正在删除') : text.format(_(l_key,'正在删除第{0}/{1}个文件'), [cursor, length]);
                    progress.show(title, false, white_mask);
                })
                .listenTo(remove, 'done', function () {
                    progress.hide();
                })
                .listenTo(remove, 'error', function (msg) {
                    mini_tip.warn(_(l_key,'文件删除失败：') + msg);
                });
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

        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),
        _ = require('i18n').get('./pack'),
        l_key = 'common.remove',
        undef;


    var vir_remove = new Module('disk_file_list_vir_remove', {

        remove_confirm: function (node, thing, desc, op) {
            var me = this,
                files = [node],

                unit = files.length > 1 ? '些' : '个',

                msg = text.format(_(l_key,'确定删除这{unit}{thing}吗？'), { unit: unit, thing: thing }),

                def = $.Deferred();

            widgets.confirm(_(l_key,'删除文件'), msg, desc, function () {
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
define.pack("./file_list.menu.menu",["lib","common","$","i18n","./file_list.file_list","./file_list.ui_normal","./file_list.ui_offline","./file_list.menu.menu","./file_list.selection.selection","./file_list.rename.rename","./file_list.file_processor.remove.remove","./file_list.file_processor.move.move"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        _ = require('i18n').get('./pack'),
        l_key = 'disk.menu',

        selection,
        share,

        file_list,
        file_list_ui_normal,
        file_list_ui_offline,

        is_hover, // true 表示是‘更多菜单’，false 表示是右键菜单

        item_maps = {

            // 默认菜单
            contextmenu: {
                single_download: 1,
                package_download: 1,
                share: 1,
                //mail_share: 1,
                link_share: 1,
                move: 1,
                rename: 1,
                remove: 1
            },

            // 更多菜单
            more: {
                share: 1,
                //mail_share: 1,
                link_share: 1,
                move: 1,
                rename: 1,
                remove: 1
            },

            // 分享子菜单
            share: {
                //mail_share: 1,
                link_share: 1
            },

            // 离线文件
            offline: {
                download_offline: 1,
                remove_offline: 1,
                save_as_offline: 1
            }
        },

        hover_on_file_id, // hover菜单对应的文件ID

        undefined;

    if(constants.UI_VER === 'APPBOX') {//appbox先保留
        item_maps.contextmenu.mail_share = 1;
        item_maps.more.mail_share = 1;
        item_maps.share.mail_share = 1;
    }

    var menu = new Module('disk_file_menu', {

        render: function () {

            var me = this;
            file_list = require('./file_list.file_list');
            file_list_ui_normal = require('./file_list.ui_normal');
            file_list_ui_offline = require('./file_list.ui_offline');
            menu = require('./file_list.menu.menu');

            selection = require('./file_list.selection.selection');

            me.context_menu = me._create_context_menu();
            me.share_menu = me._create_share_menu();
            me.offline_menu = me._create_offline_menu();

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
                    me._downloader = mod.get('./downloader');
                });
            }
            return me._downloader;
        },
        /**
         * 显示离线文件右键菜单
         * @param {Number} x
         * @param {Number} y
         * @param {jQuery|HTMLElement} $on
         */
        show_offline_menu: function (x, y, $on) {
            is_hover = false;
            hover_on_file_id = null;

            // get_selected_files
            var files = file_list_ui_offline.get_selected_files(),
            // 菜单 id map
                item_id_map = this._get_item_id_map(files, item_maps.offline);

            // 显示菜单
            if (!$.isEmptyObject(item_id_map)) {
                this.offline_menu.show(x, y, item_id_map, $on);
            }
            else {
                this.offline_menu.hide();
            }
        },
        /**
         * 隐藏离线文件右键菜单
         */
        hide_offline_menu: function(){
            this.offline_menu.hide();
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

        get_offline_menu: function() {
            return this.offline_menu;
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
                    me.create_item('remove'),
                    me.create_item('move'),
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

        _create_offline_menu: function () {
            var me = this;
            var menu = new ContextMenu({
                has_icon: false,
                items: [
                    //下载//删除//另存为
                    me.create_item('download_offline'),
                    me.create_item('remove_offline'),
                    me.create_item('save_as_offline')
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
                        text: _(l_key,'分享'),
                        icon_class: 'ico-share',
                        group: 'share',
                        click: function() {
                            var files = me._get_target_files(false);
                            if (files.length) {
                                require.async('share_enter', function(mod) {
                                    var share_enter = mod.get('./share_enter');
                                    share_enter.start_share(files);
                                });
                            }
                            user_log('RIGHTKEY_MENU_SHARE');
                        }
                    };

                case 'mail_share':
                    return {
                        id: id,
                        text: _(l_key,'邮件分享'),
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
                        text: _(l_key,'链接分享'),
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
                        text: _(l_key,'重命名'),
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
                        text: _(l_key,'删除'),
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
                        text: _(l_key,'移动到'),
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
                        text: _(l_key,'下载'),
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
                        text: _(l_key,'下载'),
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

                case 'download_offline':
                    return {
                        id: id,
                        text: _(l_key,'下载'),
                        icon_class: 'ico-download',
                        group: 'download',
                        click: function (e) {
                            var files = file_list.get_selected_files();
                            if (files.length) {
                                file_list_ui_offline.download(files);
                                //user_log('OFFLINE_ITEM_DOWN');
                            }
                            menu.hide_offline_menu();
                        }
                    };

                case 'remove_offline':
                    return {
                        id: id,
                        text: _(l_key,'删除'),
                        icon_class: 'ico-del',
                        group: 'edit',
                        click: function () {
                            var files = file_list.get_selected_files();
                            if (files.length) {
                                file_list_ui_offline.remove_file(files);
                                //user_log('OFFLINE_ITEM_DEL');
                            }
                            menu.hide_offline_menu();
                        }
                    };
                case 'save_as_offline':
                    return {
                        id: id,
                        text: _(l_key,'另存为'),
                        icon_class: 'ico-saveas',
                        group: 'edit',
                        click: function () {
                            var files = file_list.get_selected_files();
                            if (files.length) {
                                file_list_ui_offline.save_as(files);
                                //user_log('OFFLINE_ITEM_SAVEAS');
                            }
                            menu.hide_offline_menu();
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
                delete usable_items['download_offline'];//离线文件不支持批量下载
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
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 */
define.pack("./file_list.offline.Select",["lib","common","$","./file_list.offline.Store"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        store,
        get_store = function () {
            return store || (store = require('./file_list.offline.Store'));
        },
        selected_class = 'ui-selected',//选中样式
        selected_cache = {},
        selected_length = 0;

    return {
        /**
         * 获取页面元素
         * @param file_id
         * @returns {*|jQuery}
         * @private
         */
        g_$item_by_db_id: $.noop,
        /**
         * @param fn file_id获取$dom的处理函数
         */
        init: function (fn) {
            this.g_$item_by_db_id = fn;
            selected_cache = {};
        },
        /**
         * 选中元素
         * @param file_id
         * @param {boolean} [no_ui]
         */
        select: function (file_id , no_ui) {

            if (!file_id) {
                return;
            }

            if(!no_ui){
                var $item = this.g_$item_by_db_id(file_id); //界面元素选中
                if ($item) {
                    $item.addClass(selected_class);
                }
            }

            var file = get_store().get_file_by_id(file_id);//节点对象选中
            if (file) {
                file.get_ui().set_selected(true);
            }

            if (!selected_cache[file_id]) { //缓存选中
                selected_cache[file_id] = file_id;
                selected_length+=1;
            }

        },
        /**
         * 反选元素
         * @param file_id
         * @param {boolean} [no_ui]
         */
        un_select: function (file_id,no_ui) {

            if (!file_id) {
                return;
            }
            if(!no_ui){
                var $item = this.g_$item_by_db_id(file_id);//界面元素反选
                if ($item) {
                    $item.removeClass(selected_class);
                }
            }

            var file = get_store().get_file_by_id(file_id);//节点对象反选
            if (file) {
                file.get_ui().set_selected(false);
            }

            if (selected_cache[file_id]) {//缓存反选
                delete selected_cache[file_id];
                selected_length-=1;
            }
        },
        /**
         * 反选其他，但选中自己
         * @param file_id
         */
        unselected_but: function (file_id) {
            for (var key in selected_cache) {
                this.un_select( key );//清除选中
            }
            this.select( file_id );
        },
        /**
         * 是否被选中
         * @param file_id
         * @returns {boolean}
         */
        is_selected: function (file_id) {
            return !!selected_cache[file_id];
        },
        /**
         * 全部清除
         */
        remove_all: function(){
            selected_cache = {};
            selected_length = 0;
        },
        /**
         * 删除的节点 更新缓存
         * @param remove_id_map
         */
        remove: function(remove_id_map){
           for(var key in remove_id_map){
               if (selected_cache[key]) {//缓存反选
                   delete selected_cache[key];
                   selected_length-=1;
               }
           }
        },
        /**
         * 获取选中的节点
         * @return {Array<File_Node>}
         */
        get_selected_files: function () {
            var ret = [];
            for (var key in selected_cache) {
                var node = get_store().get_file_by_id(key);
                if (node) {
                    ret.push(node);
                }
            }
            return ret;
        },
        get_selected_length: function(){
           return selected_length;
        }
    };
});
/**
 * 离线文件数据加载
 * @author trumpli
 * @date 13-3-4
 */
define.pack("./file_list.offline.Store",["lib","common","./file.utils.file_node_from_cgi","./file.utils.all_file_map","./view_switch.view_switch","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        console = lib.get('./console'),

        request = common.get('./request'),
        disk_event = common.get('./global.global_event').namespace('disk'),

        file_list,
        file_node_from_cgi = require('./file.utils.file_node_from_cgi'),
        all_file_map = require('./file.utils.all_file_map'),

        view_switch,
        request_dir;//要请求的数据 父目录FileNode对象

    var loader = {
        /**
         * 返回离线文件拉的列表请求头
         * @param node
         * @param offset
         * @param list_type  拉取的文件类型 0:全部，1表示下载发送的文件，2表示下载接收的文件
         * @returns {{url: string, cmd: string, body: {offline_list_type: *, pdir_key: *, dir_key: *, sort_type: number, list_type: number, offset: *, number: number}, cavil: boolean, resend: boolean}}
         */
        offline_header: function (node, offset, list_type) {
            return {
                'url': 'http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg',
                'cmd': 'get_virtual_dir_list',
                'body': {
                    offline_list_type: list_type,
                    pdir_key: node.get_pid(),
                    dir_key: node.get_id(),
                    sort_type: 0, // 0表示按照修改时间排序
                    list_type: 0, // 1=增量拉取，0=全量拉取
                    offset: offset, // 起始下标
                    number: 15 // 拉取文件个数
                },
                'cavil': true,
                'resend': true
            };
        },
        /**
         * 单次获取后台数据
         * @param type
         * @param offset
         * @returns {*}
         */
        request: function (type, offset) {
            this.JsonpRequest =
                request.get(this.offline_header(request_dir, offset, Store.data[type].list_type))
                    .ok(function (msg, body) {
                        var files = file_node_from_cgi.from_cgi(body, request_dir);
                        Store.append(type, (body['total'] || 0), files);
                    })
                    .fail(function (msg, ret) {
                        file_list.trigger('error', msg, ret);
                        Store.error();
                    });
        },
        destroy: function () {
            if (this.JsonpRequest) {
                this.JsonpRequest.destroy();
                this.JsonpRequest = null;
            }
        }
    };
    var Store = {
        /**
         * 初始化数据格式
         */
        init_data: function () {
            loader.destroy();
            this.data = {
                sort_filed: '',//排序类型
                has_init: false,
                total: 0,
                offset: 0,
                files: [],
                id_map: {},
                all: {
                    done: false,
                    list_type: 'sed_list',
                    offset: 0,//当前位置
                    total: 0//服务端总长度
                },
                sed: {
                    done: false,
                    list_type: 1,
                    offset: 0,//当前位置
                    total: 0//服务端总长度
                },
                rec: {
                    done: false,
                    list_type: 2,
                    offset: 0,//当前位置
                    total: 0//服务端总长度
                }
            };
        },
        get_total_length: function(){
            return this.data.total;
        },
        /**
         * ID获取File_Node对象
         * @param id
         * @returns {File_Node}
         */
        get_file_by_id: function (id) {
            return this.data.id_map[id];
        },
        /**
         * 返回全部File_Node对象
         * @returns {Array<File_Node>}
         */
        get_all_file: function(){
            return this.data.files;
        },
        /**
         * 加载数据入口
         * @param node
         * @param reset_ui
         */
        render: function (node, reset_ui) {
            this.from_refresh = reset_ui;
            if (!view_switch) {
                view_switch = require('./view_switch.view_switch');
                file_list = require('./file_list.file_list');
            }
            request_dir = node;
            this.init_data();
            this.call_loader();
        },
        remove_files: function (id_map) {
            var me = this,
                cut_num = 0;
            for (var len = me.data.offset - 1; len >= 0; len--) {
                var file = me.data.files[len];
                if (id_map[file.get_id()]) {
                    me.data.files.splice(len, 1);
                    cut_num += 1;
                }
            }
            me.data.offset -= cut_num;
            me.data.total -= cut_num;
        },
        /**
         * 按数目，返回要显示的数据
         * @param {number} [num] 拉取的数量
         * @param {boolean} [is_increment] 是否增量拉取
         */
        get_show_nodes: function (num, is_increment) {
            is_increment = typeof is_increment === 'boolean' ? is_increment : true;
            if (is_increment) {
                return this._get_increment_files(num);//增量拉取数据
            } else {
                return this._get_batch_files(num);//批量拉取数据
            }
        },
        /**
         * 增量获取数据 初始化位置从上次拉取的位置开始
         * @param num 要取的数量
         * @returns {Array<File_Node>|0|-1} 0: 没有数据 ; -1:数据已经读取完了; 否则返回的是请求批次的数据
         */
        _get_increment_files: function (num) {
            var me = this;
            if (me.data.total === 0) {
                return 0;
            }
            var cur_offset = me.data.offset;
            if (me.data.total === cur_offset) {
                return -1;
            }
            var ret = me.data.files.slice(cur_offset, num + cur_offset);
            me.data.offset = ret.length + me.data.offset;//调整偏移量
            return ret;
        },
        /**
         * 批量获取数据 初始化位置从0开始
         * @param num 要取的数量
         * @returns {Array<File_Node>|0|-1} 0: 没有数据 ; -1:数据已经读取完了; 否则返回的是请求批次的数据
         */
        _get_batch_files: function (num) {
            var me = this;
            if (me.data.total === 0) {
                return 0;
            }
            var ret = me.data.files.slice((me.data.offset = 0), num);
            me.data.offset = ret.length;//调整偏移量
            return ret;
        },
        /**
         * 所有的离线文件都已经显示完成
         * @returns {boolean}
         */
        is_all_show: function () {
            return this.data.total === this.data.offset;
        },
        /**
         * 是否没有数据
         * @returns {boolean}
         */
        is_empty: function () {
            return this.data.has_init && this.data.total === 0;
        },
        /**
         * 文件排序
         * @returns {boolean} 排序成功标识
         */
        sort: function () {
            var filed = view_switch.get_cur_view();
            if (filed === 'azlist' || filed === 'grid') {
                filed = 'name';
            } else {
                filed = 'time';
            }
            if (this.sort_filed === filed && this.data.total === 0) {//排序失败
                return false;
            }
            if (filed === 'name') {//按名称排序
                this.data.files.sort(function (f1, f2) {
                    var f1_name = f1.get_name().toLowerCase(),
                        f2_name = f2.get_name().toLowerCase();
                    return f1_name === f2_name ? 0 : (f1_name < f2_name ? -1 : 1);
                });
                this.sort_filed = 'name';
            } else if (filed === 'time') {//按时间排序
                this.data.files.sort(function (f1, f2) {
                    return f2.get_life_time() - f1.get_life_time();
                });
                this.sort_filed = 'time';
            }
            var files = this.data.files,
                len = files.length;
            while (len) {
                len -= 1;
                this.data.id_map[files[len].get_id()] = files[len];
            }
            return true;
        },
        /**
         * 数据加载出错 触发通用错误
         */
        error: function () {
            file_list.trigger('after_async_load');
        },
        /**
         * 销毁数据加载
         */
        destroy: function () {
            this.init_data();
            file_list.trigger('after_async_load');
        },
        silent_destroy: function () {
            this.init_data();
        },
        /**
         * 调用数据加载
         */
        call_loader: function () {
            var me = this;
            if (!me.data.sed.done) {//发送列表没有完成,获取发送数据
                loader.request('sed', 0);
            } else if (!me.data.rec.done) {//接收列表没有完成,获取接受数据
                loader.request('rec', 0);
            } else {//全部加载完成
                me.data.total = me.data.sed.total + me.data.rec.total;//计算总数
                me.data.has_init = true;
                me.sort();
                request_dir.set_nodes([], me.data.files);//添加到数结构中
                file_list.trigger('load', request_dir, request_dir, [], me.data.files, true, me.data.total);
                file_list.trigger('after_async_load');
                disk_event.trigger('file_list_load', request_dir);
            }
        },
        /**
         * 添加到数据集合中
         * @param type
         * @param total
         * @param files
         */
        append: function (type, total, files) {
            var me = this,
                who = me.data[type];
            who.total = total;
            who.offset = who.offset + files.length;
            me.data.files = me.data.files.concat(files);
            if (total > who.offset) {
                setTimeout(function () {
                    loader.request(type, who.offset);
                }, 10);
            } else {
                who.done = true;
                me.call_loader();
            }
        }
    };

    return Store;
});/**
 * 离线文件列表表头（非目录进入）
 * @author hibincheng
 * @date 2013-11-22
 */
define.pack("./file_list.offline.offline_columns",["lib","common","$","./file_list.file_list","main","./view_switch.view_switch","./file_list.file_processor.remove.remove","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        Scroller = common.get('./ui.scroller'),
        global_event = common.get('./global.global_event'),
        query_user = common.get('./query_user'),
        file_list = require('./file_list.file_list'),
        main_ui = require('main').get('./ui'),
        view_switch = require('./view_switch.view_switch'),
        remove = require('./file_list.file_processor.remove.remove'),

        tmpl = require('./tmpl'),
        offline_node, //增加对离线文件目录节点引用
        current_has_scrollbar,
        file_item_height = 47,//每行的高度

        undefined;

    var columns = new Module('offline_columns', {

        render: function($to) {
            if(!this.__rendered) {
                this._$el = $(tmpl.offline_columns());
                $to.append(this._$el).wrapInner(tmpl.offline_columns_wrap());
                this.__rendered = true;

                //this.toggle(view_switch.is_list_view() ? true : false);

                var me = this,
                    should_sync_size = true;

                main_ui.get_$bar2().hide();
                //离线文件是作为网盘的一部分，每次进入都会先在网盘目录，即使在之前已经隐藏了，但query_user load完后会再次显示（main_ui中操作）,所以只有在这里hack一下
                me.listenTo(query_user, 'done', function() {
                    main_ui.get_$bar2().hide();
                });

                me.listenTo(file_list, 'load', function(node) {
                    if(node.is_offline_dir()) {
                        var kids_cnt = node.get_kid_nodes().length;
                        offline_node = node;
                        if(kids_cnt) {
                            if(view_switch.is_list_view()) {
                                main_ui.get_$bar2().show();
                            }
                            me._sync_scrollbar_width_if(node);
                        } else {
                            main_ui.get_$bar2().hide();
                        }

                        if(should_sync_size) {
                            main_ui.sync_size();
                            should_sync_size = false;
                        }
                    }
                });
                me.listenTo(view_switch, 'switch', function(is_grid) {
                    if(is_grid) {
                        //me.toggle(false);
                        main_ui.get_$bar2().hide();
                        main_ui.sync_size();
                    } else {
                        //me.toggle(true);
                        if(offline_node && offline_node.get_kid_nodes().length) {
                            main_ui.get_$bar2().show();
                            main_ui.sync_size();
                        }
                    }
                });

                me.listenTo(remove, 'has_removed', function() {
                    var kids_cnt;
                    if(!offline_node) {
                        return;
                    }
                    kids_cnt = offline_node.get_kid_nodes().length;
                    if(!kids_cnt) {
                        main_ui.get_$bar2().hide();
                        main_ui.sync_size();
                        should_sync_size = true;
                    }
                    me._sync_scrollbar_width_if(offline_node);

                });

                me.listenTo(global_event, 'window_resize', function() {
                    offline_node && me._sync_scrollbar_width_if(offline_node);
                });
            }
        },
        /**
         * 根据数据多少来判断是否会出现滚动条，并同步到表头
         */
        _sync_scrollbar_width_if: function(offline_node) {
            var children_cnt = offline_node.get_kid_nodes().length,
                body_box_height = main_ui.get_$body_box().height();

            if(!children_cnt) {//无数据无需要操作
                return;
            }

            if(children_cnt * file_item_height > body_box_height) {//出现滚动条
                this._sync_scrollbar_width(true);
            } else {
                this._sync_scrollbar_width(false);
            }
        },

        _sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this._$el.css('paddingRight', padding_right + 'px').repaint();
            current_has_scrollbar = has_scrollbar;
        },

        toggle: function(visible) {
            if(this._$el) {
                this._$el[visible ? 'show': 'hide']();
                this._$el.parent().find('[data-file-check]')[visible ? 'show': 'hide']();
            }
        },

        destroy: function() {
            this.stopListening(file_list, 'load');
            this.stopListening(view_switch, 'switch');
            this.stopListening(remove, 'has_removed');
            this.stopListening(global_event, 'window_resize');
            this.stopListening(query_user, 'done');
            offline_node = null;
            if(this._$el) {
                this._$el.parent().find('[data-file-check]').css('display', '');
                this._$el.unwrap();
                this._$el.remove();
            }
            main_ui.get_$bar2().css('display', '');//退出离线文件，之前有做过根据是否有数据显示/隐藏表头的样式清空
            this.__rendered = false;
        },

        is_rendered: function() {
            return this.__rendered;
        }
    });

    return columns;
});/**
 * 离线文件初次使用引导
 * @author hibincheng
 * @date 2013-11-25
 */
define.pack("./file_list.offline.offline_guide",["lib","common","$","./file_list.ui_offline","./tmpl","offline_guide_css"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        remote_config = common.get('./remote_config'),
        ui_offline = require('./file_list.ui_offline'),
        tmpl = require('./tmpl'),

        enable_guide_key = 'is_offline_user_first_access', //是否要引导的key字段名


        undefined;

    require('offline_guide_css');
    var offline_guide = new Module('offline_guide', {

        render: function() {
            if(this._rendered) {
                return;
            }
            //remote_config.set(enable_guide_key, '');//字符串类型
            var me = this;
            var def = remote_config
                .get(enable_guide_key)
                .done(function(values) {
                    if(!values[0][enable_guide_key]) {
                        me._init_guide();
                    }
                });

            this.listenTo(ui_offline, 'offline_destroy', function() {
                def && def.abort();//退出离线文件了，异步请求还没返回，则要abort掉
            });

            this._rendered = true;
        },

        /**
         * 展示引导图
         * @private
         */
        _init_guide: function() {
            var $el = $(tmpl.offline_guide()).appendTo($('body')),
                me = this;

            widgets.mask.show('offline_guide_mask', $el);
            $el.show();
            $el.on('click', '[data-id=close]', function(e) {
                e.preventDefault();
                $el.remove();
                me.set_offline_guide_done();
                me.stopListening(ui_offline, 'offline_destroy');
                widgets.mask.hide('offline_guide_mask');
            });
        },
        /**
         * 在服务端保存已引导过了，下次不用再显示了
         */
        set_offline_guide_done: function() {
            remote_config.set(enable_guide_key, 'true');//字符串类型
        }
    });


    return offline_guide;
});/**
 * 从导航进入离线文件目录
 * @author hibincheng
 * @date 2013-11-22
 */
define.pack("./file_list.offline.offline_opener",["lib","common","$","./file_path.ui","./file_list.ui_offline","./file_list.offline.offline_columns","./file_list.offline.offline_guide"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        remote_config = common.get('./remote_config'),
        file_path_ui = require('./file_path.ui'),
        ui_offline = require('./file_list.ui_offline'),
        columns = require('./file_list.offline.offline_columns'),
        offline_guide = require('./file_list.offline.offline_guide'),

        undefined;

    var offline_opener = new Module('offline_opener', {

        init: function() {
            file_path_ui.toggle_$path(false);
            columns.render(file_path_ui.get_$path_warp());

            var me = this;
            //使用setTimeout hack，因为ui_offline会进入离线文件也会执行exit_dir 从而解决offline_destroy，这里采用异步使之在exit_dir后来绑定事件
            setTimeout(function() {
                me.listenToOnce(ui_offline, 'offline_destroy', function() {
                    file_path_ui.toggle_$path(true);
                    columns.destroy();//每次退出离线文件都把表头删除
                });
            }, 16);

            this._render_guide();

        },

        _render_guide: function() {
            offline_guide.render();
        }
    });

    return offline_opener;
});/**
 * 文件重命名
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file_list.rename.rename",["lib","common","$","i18n","./file_list.rename.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        _ = require('i18n').get('./pack'),
        l_key = 'disk.rename',
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
                    err = _(l_key,(renaming_node.is_dir() ? '文件夹' : '文件') + '名有冲突，请重新命名');
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
                return _(l_key,'文件夹路径过深，请重新创建');
            }
        }
    });

    return rename;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_list.rename.ui",["lib","common","$","./tmpl","i18n","./file_list.ui_normal","./file_list.rename.rename"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        _ = require('i18n').get('./pack'),
        l_key = 'disk.rename',
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
                    mini_tip.ok(node.is_tempcreate() ? _(l_key,'新建文件夹成功') : _(l_key,'更名成功'));
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
define.pack("./file_list.selection.selection",["lib","common","$","./ui","main","./tmpl","./file.file_node","./file.utils.all_file_map","./file_list.file_list","./file_list.ui_normal"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        events = lib.get('./events'),
        console = lib.get('./console'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        log_event = common.get('./global.global_event').namespace('log'),
        disk_event = common.get('./global.global_event').namespace('disk'),
//        file_list_event = common.get('./global.global_event').namespace('disk/file_list'),
        user_log = common.get('./user_log'),

        disk_ui = require('./ui'),
        main_ui = require('main').get('./ui'),
        scroller = main_ui.get_scroller(),

        tmpl = require('./tmpl'),
        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),

    // main_ui = require('main').get('./ui'),

        file_list,
        get_file_list = function () {
            return file_list || (file_list = require('./file_list.file_list'));
        },
        ui_normal,
        sel_box,

    // -----------------------------

        ITEM_FILTER = '[data-file-id]',
        FILTER_QUICK_DRAG = '[data-quick-drag]',

        NO_MOVE_FILTER = '[data-no-move]',

    // --- 华丽的分割线 --------------------------------------------

        dragdrop,

        doc = document,
        get_el_by_id = function (id) {
            return doc.getElementById(id)
        },
        foolie6 = $.browser.msie && $.browser.version < 7,

        undefined;

    var selection = new Module('disk_file_selection', {
        $list: null,

        render: function () {

            get_file_list();
            ui_normal = require('./file_list.ui_normal');

            var $lists = ui_normal.get_$lists();

            var SelectBox = common.get('./ui.SelectBox');
            sel_box = new SelectBox({
                ns: 'disk/file_list/selection',
                $el: $lists,
                $scroller: scroller.get_$el(),
                container_width: function () {
                    var $dir_list = ui_normal.get_$dir_list(),
                        $file_list = ui_normal.get_$file_list();
                    if ($dir_list.is(':visible'))
                        return $dir_list.width();
                    if ($file_list.is(':visible'))
                        return $file_list.width();
                    return scroller.get_$el().width();
                },
                enable_touch_size: function () {
                    // IE6 文件节点高度是固定的 - james asked by jinfu 2013-11-8
                    return !foolie6 && ui_normal.is_grid_view();
                },
                touch_size: !foolie6 ? function (el_id) {
                    var $item = $('#' + el_id),
                        $inner;
                    if ($item[0] && ($inner = $item.children())) {
                        return { width: $inner.width(), height: $inner.height() };
                    }
                } : null,
                keep_on: function ($tar) {
                    return !!$tar.closest('[data-file-check], ' + FILTER_QUICK_DRAG).length;
                },
                clear_on: function ($tar) {
                    return !$tar.closest('[data-file-id]').length;
                },
                before_start_select: function ($tar) {
                    if ($tar.is(FILTER_QUICK_DRAG))
                        return false;

                    // 在侧边栏按下鼠标时不处理，因为在滚动条按下鼠标时会同时触发滚动和框选行为 - james
                    var $sidebar = disk_ui.get_$sidebar(true);
                    if ($sidebar.is(':visible') && $tar.closest($sidebar)[0])
                        return false;

                    var $item = $tar.closest(ITEM_FILTER);
                    if ($item[0]) {
                        // 直接在文件名、图标上拖拽时，
                        var file = ui_normal.get_file_by_$el($item);
                        return !!file && !file.get_ui().is_selected();
                    }
                },
                is_selectable: function (el_id) {
                    var $item = $('#' + el_id);
                    if ($item[0]) {
                        var file = ui_normal.get_file_by_$el($item);
                        return !!file && file.get_ui().is_selectable();
                    }
                }
            });
            sel_box.enable();

            // TODO 框选增量变化
            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var cur_node = get_file_list().get_cur_node(), kid_nodes;
                if (cur_node && (kid_nodes = cur_node.get_kid_nodes())) {

                    for (var i = 0, l = kid_nodes.length; i < l; i++) {
                        var file = kid_nodes[i],
                            file_ui = file.get_ui(),
                            el_id = ui_normal.get_el_id(file.get_id()),
                            is_sel = el_id in sel_id_map,
                            is_unsel = el_id in unsel_id_map;

                        if (is_sel) {
                            file_ui.set_selected(true);
                        } else if (is_unsel) {
                            file_ui.set_selected(false);
                        }
                    }
                }

                this.trigger_changed();

                // 框选日志上报
                if (!$.isEmptyObject(sel_id_map)) {
                    user_log('BOX_SELECTION');
                }
            });
        },

        /**
         * 选中这些文件（请尽量传入批量文件，因为执行完成后会遍历一次DOM）
         * @param {Array<String>|Array<File>|Array<HTMLElement>} args 文件ID数组、文件实例数组、或文件DOM数组
         * @param {Boolean} flag 是否选中
         * @param {Boolean} [update_ui] 是否更新UI，默认true
         */
        toggle_select: function (args, flag, update_ui) {

            if (args.length) {

                var $items, files;

                // 传入的是DOM
                if (args[0] instanceof $ || (args[0].tagName && args[0].nodeType)) {
                    $items = args;
                    files = $.map($items, function ($item) {
                        return ui_normal.get_file_by_$el($item);
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

                    // 同步至 SelectBox
                    var sel_el_ids = $.map(files, function (file) {
                        return ui_normal.get_el_id(file.get_id());
                    });
                    sel_box.set_selected_status(sel_el_ids, flag);

                    this.trigger_changed();
                }
            }
        },

        set_dom_selected: function (files) {
            if (sel_box) {
                sel_box.set_dom_selected($.map(files, function (file) {
                    return ui_normal.get_el_id(file.get_id());
                }), true);
            }
        },

        trigger_changed: function () {
            var sel_meta = this.get_sel_meta();
            this.trigger('select_change', sel_meta);
            log_event.trigger('sel_files_len_change', sel_meta.files.length);
        },

        /**
         * 获取选中状态
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var node = get_file_list().get_cur_node(),
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
            var node = get_file_list().get_cur_node();
            return node && node.get_kid_nodes() ? collections.first(node.get_kid_nodes(), function (file) {
                return file.get_ui().is_selected();
            }) : null;
        },

        /**
         * 刷新框选
         */
        refresh_selection: function () {
            if (sel_box)
                sel_box.refresh();
        },

        /**
         * 判断是否有选中
         * @return {Boolean}
         */
        has_selected: function () {
            return sel_box && sel_box.has_selected();
        },

        /**
         * 启用框选
         */
        enable_selection: function () {
            if (sel_box)
                sel_box.enable();
        },

        /**
         * 禁用框选
         */
        disable_selection: function () {
            if (sel_box) {
                this.clear();
                sel_box.disable();
            }
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
            if (sel_box) {
                var node = p_node || get_file_list().get_cur_node(),
                    files;

                if (!node.is_vir_dir()) {
                    sel_box.clear_selected();

                    if (node && (files = node.get_kid_nodes())) {
                        for (var i = 0, l = files.length; i < l; i++) {
                            files[i].get_ui().set_selected(false);
                        }
                    }
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
            if (sel_box) {
                return $($.map(sel_box.get_selected_id_map(), function (_, el_id) {
                    return get_el_by_id(el_id);
                }));
            } else {
                return $();
            }
        },

        /**
         * 获取选中的文件对象
         * @return {FileNode[]}
         */
        get_selected_files: function () {
            return this.get_sel_meta().files;
        },

        /**
         * 判断指定的文件DOM是否已被选中
         * @param {jQuery|HTMLElement} $item
         */
        is_selected: function ($item) {
            if (sel_box) {
                return sel_box.is_selected($item);
            }
        },

        /**
         * 选中指定文件以外的文件
         * @param {jQuery|HTMLElement}
         */
        select_but: function ($item) {
            var cur_node = get_file_list().get_cur_node();
            if (sel_box && cur_node) {
                // 需要取消选中的元素
                var to_unsel_ids = [];
                // 需要被选中的元素
                var to_sel_id_map = {}, to_sel_ids = [];
                $.each($item, function (i, item) {
                    to_sel_id_map[item.id] = 1;
                    to_sel_ids.push(item.id);
                });

                // 如果要选中的ID出现在要取消选中的ID集合中，则需从要取消的集合中移除
                for (var el_id in sel_box.get_selected_id_map()) {
                    if (!(el_id in to_sel_id_map)) {
                        to_unsel_ids.push(el_id);
                    }
                }

                sel_box.batch(function () {
                    // 先取消选中
                    sel_box.set_selected_status(to_unsel_ids, false);
                    // 再选中
                    sel_box.set_selected_status(to_sel_ids, true);
                });
            }
        },

        _get_$items: function () {
            var $items = ui_normal.get_$lists().children()
            return $items;
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


                me.refresh(selection._get_$items());

                // 选中状态改变后，刷新 dragdrop
                me.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                    var items = [];
                    for (var el_id in sel_id_map) {
                        var item = get_el_by_id(el_id);
                        if (item)
                            items.push(item);
                    }
                    for (var el_id in unsel_id_map) {
                        var item = get_el_by_id(el_id);
                        if (item)
                            items.push(item);
                    }
                    me.refresh($(items));
                });

                me._enabled = true;
            },

            disable: function () {
                if (this._enabled) {
                    this._destroy(selection._get_$items());

                    this.stopListening(selection, 'select_change');

                    this._enabled = false;
                }
            },

            /**
             * 刷新拖拽状态
             * @param {jQuery} $items
             */
            refresh: function ($items) {
                var me = this;

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
                    var $dbview_ct = $('#_disk_sidebar');
                    $items.each(function (i, item) {
                        var $item = $(item),
                            is_selected = selection.is_selected($item),
                            handle = is_selected ? ITEM_FILTER : FILTER_QUICK_DRAG;

                        if ($item.data('data-draggable-handle') != handle) {

                            // console.log($item[0], handle);
                            if ($item.data('draggable')) {
                                $item.draggable('option', 'handle', handle);
                            } else {
                                $item.draggable({
                                    scope: 'move_file',
                                    handle: handle,
                                    scroll: false, // 不自动滚动
                                    // 要监听以下非直属容器的滚动，以便刷新droppable坐标缓存
                                    scrollingHooks : $dbview_ct,
                                    // cursor:'move',
                                    cursorAt: { top: -15, left: -15 },
                                    distance: 20,
                                    appendTo: 'body',
                                    helper: function (e) {
                                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
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

                var options = {
                    scope: 'move_file',
                    tolerance: 'pointer',
                    //                            accept: '.ui-item',
                    hoverClass: 'ui-dropping',

                    drop: function (e, ui) {
                        // 如果目标节点已被选中，则不允许丢放
                        var $item = $(e.target);
                        if (!selection.is_selected($item)) {

                            var $target_item = ui_normal.get_$item($item),
                                target_dir_id = $target_item.attr('data-file-id');

                            disk_event.trigger('drag_and_drop_files_to', target_dir_id);
                            user_log('DISK_DRAG_DIR'); //拖拽item到其他目录
                            return true;
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
                // TODO 检查是否需要这个判断 - james
//                var oe = e.originalEvent.originalEvent;
//                if ($(oe.target || oe.srcElement).is('[data-function]')) {
//                    return false;
//                }

                // selection.cancel_select();

                var $target_el = $(e.originalEvent.target),
                    $curr_item = ui_normal.get_$item($target_el);

                // 有的文件不允许拖拽
                if ($curr_item.is(NO_MOVE_FILTER)) {
                    return false;
                }

                // 如果是从文件名、图标开始拖拽，且当前文件未选中，那么需要清除非当前文件的选中
                var quick_drag = $target_el.closest(FILTER_QUICK_DRAG).length;
                if (quick_drag && !selection.is_selected($curr_item)) {
                    //清除非当前文件的选中
                    selection.select_but($curr_item);

                    // TODO 检查是否需要这个判断 - james
//                    // fix bug
//                    $(document).one('mouseup blur', function () {
//                        selectable.select_item($curr_item, true, true);
//                    });
                }

                // 修复拖拽下载时只能下载可见文件的bug - james
                var files = dragdrop._get_draggable_files();
                if (!files.length) {
                    return false;
                }

                // before_drag 事件返回false时终止拖拽
                var ret_val = selection.trigger('before_drag_files', files);
                if (ret_val === false) {
                    return false;
                }

                selection.trigger('drag_start', files);

                // helper
                ui.helper.html(tmpl.dragging_cursor({ files: files }));
            },

            _on_drag_stop: function () {
                selection.trigger('stop_drag');
            },

            /**
             * 获取可拖拽的文件 | 修复拖拽下载时只能下载可见文件的bug - james
             * @return {FileNode[]} draggable_files
             * @private
             */
            _get_draggable_files: function () {
                var node = get_file_list().get_cur_node();
                if (!node || !node.get_kid_nodes()) {
                    return $();
                }

                var draggable_files = [], no_drag_files = [];


                $.each(selection.get_sel_meta().files, function (i, file) {
                    var draggable = file.is_draggable();
                    if (draggable) {
                        draggable_files.push(file);
                    } else {
                        no_drag_files.push(file);
                    }
                });

                if (no_drag_files.length) {
                    selection.toggle_select(no_drag_files, false);
                }

                return draggable_files;
            },

            /**
             * 销毁 Drag & Drop
             */
            _destroy: function ($items) {
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
                return $('#_disk_ls_dd_helper');
            },

            cancel_drag: function () {

                var $helper = this._get_drag_helper();
                if ($helper[0]) {
                    $helper.remove();
                }

                $(document, document.body).trigger('mouseup'); // 修复jQueryUI draggable 的bug

                //this.refresh(selection.get_selected_$items());
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
define.pack("./file_list.share.share",["lib","common","$","i18n","./file_list.share.ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        _ = require('i18n').get('./pack'),
        l_key = 'common.share',
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
                return _(l_key,'邮件分享暂不支持文件夹');
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
                return '无效的参数';
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
                        weiyunfid: file.get_id() + ',' + (file.get_pid() || file.get_parent().get_id()),
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

                var _files = [], _dirs = [], file = files[0];
                $.each(files, function (i, f) {
                    if (f.is_dir()) {
                        _dirs.push({ dir_key: f.get_id(), dir_name: f.get_name() });
                    } else {
                        _files.push({ file_id: f.get_id(), file_name: f.get_name() });
                    }
                });

                //防止分享多余40个文件
                if (files.length > constants.LINK_SHARE_LIMIT) {
                    me.trigger('warn', text.format(_(l_key,'链接分享一次最多支持{0}个文件'),[constants.LINK_SHARE_LIMIT]));
                    //me.trigger('warn', '链接分享一次最多支持' + constants.LINK_SHARE_LIMIT + '个文件');
                    return;
                }

                request.post({
                    url: 'http://web.cgi.weiyun.com/wy_share.fcg',
                    cmd: 'add_share',
                    header: {"uin" : query_user.get_cached_user().get_uin()},
                    body: {
                        ppdir_key: file.get_parent && file.get_parent().get_pid(),
                        pdir_key: file.get_pid() || file.get_parent().get_id(),
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
                return _(l_key,'不能分享破损的文件');
            }
            else if (file.is_empty_file()) {
                return _(l_key,'不能分享空文件');
            }
            else if (size_limit > 0 && file.get_cur_size() > size_limit) {
                return text.format(_(l_key,'分享的文件应小于{0}'),File.get_readability_size(size_limit));
                //return '分享的文件应小于' + File.get_readability_size(size_limit);
            }
        }
    });

    return share;

});/**
 * 邮件\外链分享UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./file_list.share.ui",["lib","common","$","./tmpl","i18n","./file_list.share.share"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

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
        _ = require('i18n').get('./pack'),
        l_key = 'common.share',
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
                buttons: ['CLOSE'],
                content: tmpl.link_share_content()
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

                .on('hide', function () {
                    // 修复IE下操作flash节点后导致浏览器标题被改为hash的bug - james
                    document.title = doc_title;
                    doc_title = null;

                    me._destroy_copy();

                    me._$link = null;
                })

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
                    dialog.trigger('tip', _(l_key,'您的浏览器不支持该功能'), -50);
                    // me._show_manual_copy(cur_short_link);
                })

                // 复制成功
                .listenTo(me, 'copy_done', function () {
                    dialog.trigger('tip', _(l_key,'复制成功'));
                });
        },

        show_link_share_box: function (short_link, long_link, files) {

            cur_short_link = short_link;
            cur_long_link = long_link;

            var title;
            // 一个文件就显示完整名称；多个文件就显示第一个文件的无后缀名称 james 2013-6-7
            if (files.length === 1) {
                title = text.smart_sub(files[0].get_name(), 16);
            }
            else {
                var dir_len = 0,
                    file_len = 0;
                $.each(files, function (i, file) {
                    file.is_dir() ? dir_len++ : file_len++;
                });
                var _format = _(l_key,'{0}等' + [dir_len ? '{2}个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? '{1}个文件' : ''].join(''));
                title = text.format(_format,[text.smart_sub(files[0].get_name_no_ext(), 16),dir_len,file_len]);
                //title = text.smart_sub(files[0].get_name_no_ext(), 16) + '等' + [dir_len ? dir_len + '个文件夹' : '', (dir_len && file_len) ? '和' : '', file_len ? file_len + '个文件' : ''].join('');
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

            // this.stopListening(global_event, 'window_resize window_scroll');
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
                    path: 'http://imgcache.qq.com/club/weiyun/js/publics/jquery-plugins/jquery.zclip/ZeroClipboard.swf',
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
 * 文件列表排序
 * @author jameszuo
 * @date 13-10-31
 */
define.pack("./file_list.sorter",["lib"],function (require, exports, module) {
    var lib = require('lib'),
        Sorter = lib.get('./sorter');

    return new Sorter({
        // el: $column_model_to,
        cols: [
            { field: 'name', /* klass: 'filename', title: '名称', */val_get: function (it) {
                return it.get_name().toLowerCase();
            } },
            { field: 'modify_time', /*klass: 'datetime', title: '更新时间', */val_get: function (it) {
                return it.get_modify_time();
            } },
            { field: 'size', /*klass: 'size', title: '大小', */val_get: function (it) {
                return it.get_size();
            } }
        ],
        default_field: 'modify_time',
        default_order: 'desc',
//                visible: false,
//                klass: '',
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
 * 双屏目录树实现
 * @author cluezhang
 * @date 2013-10-22
 */
define.pack("./file_list.tree.Tree",["lib","$","./file_list.tree.TreeNode","./file_list.tree.TreeLoader","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('disk/Tree'),

        TreeNode = require('./file_list.tree.TreeNode'),
        TreeLoader = require('./file_list.tree.TreeLoader'),

        file_list = require('./file_list.file_list'),

        slice = Array.prototype.slice,


        undefined;

    var Tree = inherit(Event, {
        /**
         * 要处理的事情：
         * 1. 拖动、拖放
         * 2. 点击访问、展开、收缩、右键
         * 3. 新建目录时同步
         * 4. 删除时同步
         * 4.2 移动时同步
         * 5. load_path定位时同步
         * 6. 隐藏时，不应有任何dom开销（数据层面上的同步可以继续，但dom上的开销交由Tree统一处理吧）
         * 7. 选中状态，与当前目录同步。
         */
        constructor: function (cfg) {
            $.extend(this, cfg);
            this.map = {};
            this.root && this.register(this.root);
            this.loader = new TreeLoader();
            this.init_events();
        },

        init_events: function () {
            this.on('add', this.on_add, this);
            this.on('remove', this.on_remove, this);
            this.on('datachanged', this.on_datachanged, this);
        },
        on_add: function (parent, child, index) {
            this.register(child);
        },

        on_remove: function (parent, child, index) {
            this.unregister(child);
        },

        on_datachanged: function (node, old_child_nodes) {
            var me = this;
            $.each(old_child_nodes, function (index, node) {
                me.unregister(node);
            });
            $.each(node.child_nodes, function (index, node) {
                me.register(node);
            });
        },

        get_node_by_id: function (id) {
            return this.map[id];
        },

        node_trigger: function (node, event_name) {
            var args = slice.call(arguments, 0);
            this.trigger.apply(this, [event_name, node].concat(args.slice(2)));
        },
        register: function (node) {
            var tree = this,
                old_tree = node.tree;
            if (old_tree && old_tree.unregister) {
                old_tree.unregister(node);
            }
            node.cascade(function (node) {
                node.tree = tree;
                tree.map[node.id] = node;
            });
        },
        unregister: function (node) {
            var tree = this;
            node.cascade(function (node) {
                delete tree.map[node.id];
                node.tree = null;
            });
        },

        /**
         * 加载指定路径的目录
         * @param {String[]} [path_ids] 为空表示加载根目录，长度为1表示加载单目录
         * @returns {$.Deferred} 回调会带上参数 last_level_node
         */
        _resync_path: function (path_ids) {
            var me = this;

            // 读取多级目录
            return me.loader.load_path(path_ids)
                .done(function (nodes_map) {

                    var p_node = me.root,
                        last_level_node = p_node; // 最深一级的目录

                    // 因为路径总是从根节点开始，这里绕过根节点，从下标 1 开始处理
                    for (var path_i = 0, l = path_ids.length; path_i < l; path_i++) {
                        var dir_id = path_ids[path_i],
                            nodes = nodes_map[dir_id] || [],
                        // 下一级需要同步到的节点ID;
                            path_kid_id = path_ids[path_i + 1];

                        // 插入子节点
                        $.each(nodes, function (j, kid) {
//                            console.log('插入子节点' + kid.name + '到' + p_node.name + '中');
                            var id = kid['id'],
                                leaf = kid['leaf'],
                                name = kid['name'];

//                            console.debug(' - ' + name + '.leaf=' + leaf);
                            p_node.add_child({
                                id: id,
                                name: name,
                                leaf: leaf,
                                expanded: !leaf && path_kid_id && id === path_kid_id
                            });
                        });

                        // 插入子节点后，设置父节点为脏
//                        console.log('设置' + p_node.name + '为脏');
                        p_node.set_dirty(true);

                        // 下一级
                        p_node = me.get_node_by_id(path_kid_id);
                        if (p_node) {
                            last_level_node = p_node;
//                            console.log('父节点变更为' + p_node.name);
                        } else {
                            // CGI返回的数据不完整，无法继续处理
                            break;
                        }
                    }

                    me.trigger('resync_path', last_level_node);
                });
        },

        /**
         * 从服务端读取
         * @param {String[]} path_ids
         */
        update: function (path_ids) {

            // 读取根目录
            if (!path_ids || !path_ids.length) {
//                console.log('2 load root');
                return this.root.load();
            }

            // 读取单目录
            if (path_ids.length === 1) {
                var node = this.get_node_by_id(path_ids[0]);
//                console.log('3 load node');
                return node && node.load();
            }

            // 同步多级目录
//            console.log('4 resync path');
            return this._resync_path(path_ids);
        }
    });
    return Tree;
});/**
 * 节点数据加载
 * @author jameszuo
 * @date 13-11-13
 */
define.pack("./file_list.tree.TreeLoader",["lib","common","$","./file_list.tree.TreeNode","./file_list.file_list","./file.utils.all_file_map","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        request = common.get('./request'),
        m_speed = common.get('./m_speed'),

        console = lib.get('./console').namespace('disk/TreeLoader'),

        TreeNode = require('./file_list.tree.TreeNode'),
        file_list = require('./file_list.file_list'),
        all_file_map = require('./file.utils.all_file_map'),
        _ = require('i18n').get('./pack'),
        l_dir_name = 'disk.file_list.dir_name',
        i = 0,

        undef;

    var TreeLoader = function () {


    };


    TreeLoader.prototype = {

        load_path: function (path_ids) {
            var me = this,
                def = $.Deferred(),
                is_resync_path = path_ids.length > 1, // 多个ID认为是同步路径
                start = is_resync_path && new Date().getTime();

            request.get({
                url: 'http://api.weiyun.com/tree_view.fcg',
                cmd: '',
                cavil: true,
                resend: true,
                body: {
                    dir_keys: $.map(path_ids, function (id) {
                        return { dir_key: id };
                    })
                }
            })
                .ok(function (msg, body, header, data) {
                    /**
                     以  微云 > QQQ > QQ收到的文件  目录为例：

                     CGI返回的 data 数据格式示例
                     {
                         "data": {
                             "dirs": [{
                                 "dir_key": "b7914126f0a739ae12b58dcd423dce4a",
                                 "sub_dirs": [{
                                     "has_dir": 0,
                                     "dir_name": "QQQ",
                                     "sub_dir_key": "b7914126d9d3fe3e36e658415c178512"
                                 }, {
                                     "has_dir": 0,
                                     "dir_name": "QQ硬盘",
                                     "sub_dir_key": "b791412673cca77c86b4ff8a19058c8a"
                                 }, {
                                     "has_dir": 0,
                                     "dir_name": "抱走漫画",
                                     "sub_dir_key": "b7914126ddbad0890152dff5195c478b"
                                 }, {
                                     "has_dir": 0,
                                     "dir_name": "微信",
                                     "sub_dir_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                                     "virtual_flag": 1,
                                     "icon": "virtual_icon"
                                 }]
                             }, {
                                 "dir_key": "b7914126d9d3fe3e36e658415c178512",
                                 "sub_dirs": [{
                                     "has_dir": 0,
                                     "dir_name": "QQ收到的文件",
                                     "sub_dir_key": "b7914126702051fdd5fd79f516c96d91"
                                 }]
                             }, {
                                 "dir_key": "b7914126702051fdd5fd79f516c96d91"
                             }]
                         },
                         "ret": 0
                     }
                     */


                    /**
                     输出的 nodes_map 数据格式示例
                     {
                         'b7914126f0a739ae12b58dcd423dce4a': [  // 微云
                             {id: 'b7914126d9d3fe3e36e658415c178512', name: 'QQQ', leaf: false, is_vir: false},
                             {id: 'b791412673cca77c86b4ff8a19058c8a', name: 'QQ硬盘', leaf: false, is_vir: false},
                             {id: 'b7914126ddbad0890152dff5195c478b', name: '抱走漫画', leaf: true, is_vir: false,
                             {id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', name: '微信', leaf: true, is_vir: true, icon: 'weixin'}}
                         ],
                         'b7914126d9d3fe3e36e658415c178512': [  // QQQ
                             {id: 'b7914126702051fdd5fd79f516c96d91', name: 'QQ收到的文件', leaf: true}
                         ],
                         'b7914126702051fdd5fd79f516c96d91': [ ] // QQ收到的文件
                     }
                     */
                    var nodes_map = {},
                        data = data['data'] || {},
                        dirs = data['dirs'] || [];
                    $.each(dirs, function (i, dir) {
                        var dir_id = dir['dir_key'];
                        var sub_dirs = dir['sub_dirs'] || [];
                        var nodes = $.map(sub_dirs, function (kid, j) {
                            var id = kid[ 'sub_dir_key'];
                            var name = kid['dir_name'];
                            var has_dir = kid['has_dir'];
                            var is_vir = kid['virtual_flag'];
                            var icon = kid['virtual_icon'];

                            return {
                                id: id,
                                name: name,// || ('未命名' + i + '.' + j),
                                leaf: has_dir != 1,
                                is_vir: is_vir == 1,
                                icon: icon
                            };
                        });
                        nodes_map[dir_id] = nodes;
                    });

                    def.resolve(nodes_map);
//                    console.log('TreeLoader.load_path OK');
                })
                .fail(function (msg, ret) {
//                    console.log('TreeLoader.load_path fail');
                    def.reject(msg, ret);
                })
                .done(function () {
                    if (is_resync_path) {
                        var end = new Date().getTime();
                        m_speed.send_one('7830-4-1', 14, end - start);
                    }
                })

            return def;
        },

        load: function (node) {
            var id = node.get_id(),
                def = $.Deferred();

//            console.log('TreeLoader.load');

            this.load_path([id])
                .done(function (nodes_map) {
                    nodes_map = nodes_map || {};
                    var nodes = nodes_map[id] && nodes_map[id].length ? $.map(nodes_map[id], function (node_attr) {
                        return new TreeNode(node_attr);
                    }) : [];
                    if(node === node.tree.root && nodes && nodes.length){//根目录下的目录接受国际化翻译
                        $.each(nodes,function(){
                            this.name = _(l_dir_name,this.name);
                        });
                    }
                    def.resolve(nodes);
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });
            return def;
        }
    };

    return TreeLoader;
});/**
 * 树节点
 * @author cluezhang
 * @date 2013-10-22
 */
define.pack("./file_list.tree.TreeNode",["lib","$"],function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console').namespace('disk/TreeNode'),
        $ = require('$');

    var slice = Array.prototype.slice;
    var id_seed = 1000;


    var Tree_node = inherit(Object, {
        // attributes
        id: null,
        name: null,
        is_vir: false,
        loaded: false,
        loading: false,
        selected: false,
        expanded: false,

        // ...
        parent_node: null,
        load_def: null,

        /**
         * 构造函数
         * @param {String} cfg.id
         * @param {String} cfg.name
         * @param {Boolean} cfg.expand
         * @param {Boolean} cfg.leaf
         */
        constructor: function (cfg) {
            var me = this;

            me.child_nodes = [];
            $.extend(me, cfg);
            if (!me.id) {
                me.id = 'node-' + (++id_seed);
            }
            // 初始添加
            var children = me.children;
            if (children) {
                delete me.children;
                $.each(children, function (i, child) {
                    me.insert_child(child);
                });
            }
        },
        get_id: function () {
            return this.id;
        },
        get_name: function () {
            return this.name;
        },
        is_vir_dir: function () {
            return this.is_vir;
        },
        get_file: function () {
            return this.file;
        },
        is_root: function () {
            return this.tree && this.tree.root === this;
        },
        /**
         * 依赖于树的事件模型
         */
        trigger: function () {
            // 有可能当前节点还没有在tree上注册，所以最保险的就是找根节点，从而找到所属树
            var p = this;
            while (p.parent_node) {
                p = p.parent_node;
            }
            var args = [this],
                tree = p.tree;
            if (tree) {
                tree.node_trigger.apply(tree, args.concat(slice.call(arguments, 0)));
            }
        },
        create_node: function (data) {
            return new this.constructor(data);
        },
        add_child: function (nodes, index, prevent_event) {
            var me = this, child_nodes = me.child_nodes;
            if (typeof index !== 'number') {
                index = child_nodes.length; // 需要按照文件名排序，所以注释掉 - james
            }
            nodes = [].concat(nodes);
            $.each(nodes, function (n, node) {
                // 保证都是Tree_node对象
                if (!(node instanceof Tree_node)) {
                    node = me.create_node(node);
                }
                // 如果有旧的父节点，先移除之
                var old_parent = node.parent_node;
                if (old_parent) {
                    old_parent.remove_child(node);
                }
                // 如果已经在树上了，则替换之
                var exists_node = me.tree.get_node_by_id(node.id);
                if (exists_node) {
                    index = exists_node.index();
                    exists_node.remove();
                }

                // 添加
                node.parent_node = me;
                if (index >= child_nodes.length) { // 不知道当为最后一个元素时，splice会不会有优化。保险起见还是用push
                    child_nodes.push(node);
                } else {
                    child_nodes.splice(index, 0, node);
                }
                if (!prevent_event) {
                    me.trigger('add', node, index);
                }
                // 顺序添加，下一个节点的索引+1
                index++;
            });

            // 如果有节点，表示已经加载
            if (!this.loaded) {
                this.loaded = true;
                if (!prevent_event) {
                    this.trigger('update', {loaded: true});
                }
            }

            this.leaf = false;
            this.trigger('update', {leaf: true});
        },

        // 插入一个节点，自动排序
        insert_child: function (node) {
            var me = this,
                nodes = me.child_nodes,
                name = node.get_name(),
                index;

            // 通过文件名进行计算插入位置
            for (var i = 0, l = nodes.length; i < l - 1; i++) {
                var name_1 = nodes[i].get_name(),
                    name_2 = nodes[i + 1].get_name().toString(),
                    between = name_1.toString() < name.toString() && name.toString() < name_2.toString();
                if (between) {
                    index = i + 1;
                    break;
                }
            }
            return this.add_child(node, index);
        },
        remove_child: function (node, prevent_event) {
            var me = this, child_nodes = me.child_nodes;
            var index = $.inArray(node, child_nodes);
            if (index < 0) {
                return;
            }
            child_nodes.splice(index, 1);
            if (!prevent_event) {
                this.trigger('remove', node, index);
            }
            node.parent_node = null;
        },

        /**
         * 清除所有子节点
         */
        clear_children: function () {
            var old_child_nodes = this.child_nodes;
            this.child_nodes = [];
            this.trigger('datachanged', old_child_nodes);
        },

        /**
         * 获取路径
         * @returns {Array}
         */
        get_path_nodes: function () {
            var path_nodes = [];
            if (this === this.tree.root)
                return path_nodes;

            this.recursion(false, function (node) {
                path_nodes.push(node);
            });

            path_nodes.reverse();
//            console.log('recursion', $.map(path_nodes, function (r) {
//                return r.name;
//            }));

            return path_nodes;
        },

        /**
         * 递归获取节点
         * @param {Boolean} with_root 是否排除根节点，默认false
         * @param {Function} procc
         * @param {Object} scope scope of procc
         * @returns {Array}
         */
        recursion: function (with_root, procc, scope) {
            with_root = typeof with_root === 'boolean' ? with_root : false;
            scope = scope || this;

            var p = this;

            procc.call(scope, p);

            while (p = p.parent_node) {
                // 排除root
                if (!with_root && p === this.tree.root) {
                    break;
                }

                procc.call(scope, p);
            }
        },

        cascade: function (fn, scope, args) {
            var childs, i, len;
            if (fn.apply(scope || this, args || [this]) !== false) {
                childs = this.child_nodes;
                for (i = 0, len = childs.length; i < len; i++) {
                    childs[i].cascade(fn, scope, args);
                }
            }
        },
        is_expanded: function () {
            return this.expanded;
        },
        expand: function () {
            var me = this;
            if (me.expanded || me.leaf) {
                return;
            }

            me.expanded = true;

            if (!me.dirty && me.loaded) {
                me.trigger('update', {expanded: true});
            } else {
                me.load()
                    .done(function () {
                        me.trigger('update', {expanded: true});
                    })
                    .fail(function () {
                        me.expanded = false;
                        me.trigger('update', {expanded: true});
                    });
            }
        },
        collapse: function () {
            this.expanded = false;
            this.trigger('update', {expanded: true});
        },
        toggle: function () {
            this.expanded ? this.collapse() : this.expand();
        },
        set_name: function (name) {
            this.name = name;
            this.trigger('update', {name: true});
        },
        set_selected: function (selected) {
            this.selected = selected;
            this.trigger('update', {selected: true});

            if (selected) {
                this.expand();
            }
        },
        set_dirty: function (dirty) {
            this.dirty = dirty;
            this.trigger('update', {dirty: true});
        },
        remove: function () {
            if (this.parent_node) {
                this.parent_node.remove_child(this);
            }
        },
        load: function () {
            var me = this;
            me.loading = true;
            me.trigger('update', {loading: true});
            me.load_def = me.tree.loader.load(me)
                .done(function (child_nodes) {
                    me.add_child(child_nodes);
                })
                .always(function () {
                    me.loading = false;
                    me.trigger('update', {loading: true});
                });
            return me.load_def;
        },
        if_load: function () {
            return this.load_def || $.Deferred().reject();
        },
        index: function () {
            return this.parent_node ? $.inArray(this, this.parent_node.child_nodes) : -1;
        }
    });
    return Tree_node;
});/**
 * 树节点对应的UI相关操作
 * @author cluezhang
 * @date 2013-10-25
 */
define.pack("./file_list.tree.TreeNodeUI",["lib","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),

        tmpl = require('./tmpl');
    var TreeNodeUI = inherit(Event, {
        rendered: false,
        children_rendered: false,
        // 相对于父节点容器来说的本节点选择器
        node_selector: 'div.item',
        // 相对于本节点来说的子节点容器选择器
        ct_selector: 'div.item-box',
        /**
         * @cfg {Tree_node} node
         */
        constructor: function (node, view) {
            this.node = node;
            // 隶属的Tree_view
            this.view = view;
        },
        // 获取自身在父节点中的位置
        get_index: function () {
            var node = this.node,
                parent_node = node.parent_node;
            if (node.is_root()) {
                return 0;
            }
            return $.inArray(node, parent_node.child_nodes);
        },
        /**
         * 获取节点主体对应的dom
         * @param {Number} index (optional) 当事先知道节点在同级中的索引时，可以传递
         * @return {jQueryElement} $el
         * TODO 绑定 DOM id 优化性能，遍历性能较差 - james
         */
        get_$el: function (index) {
            var $el = this.$el;
            if (!$el) {
                var node = this.node,
                    view = this.get_tree_view(), parent_node, parent_ui;
                if (node.is_root()) {
                    $el = this.$el = $(view.get_$body().find('>:first'));
                } else {
                    parent_node = node.parent_node;
                    parent_ui = view.get_node_ui(parent_node);
                    if (typeof index !== 'number') {
                        index = this.get_index();
                    }
                    $el = this.$el = $(parent_ui.get_$children().get(index));
                }
            }
            return $el;
        },
        // 获取子节点应该放置的容器dom
        get_$children_ct: function () {
            return this.get_$el().find('+' + this.ct_selector);
        },
        // 获取节点对应的所有dom节点
        get_$els: function () {
            return this.get_$el().add(this.get_$children_ct());
        },
        // 获取子节点的dom集合，如果子节点有变动，需要调用clear_children_cache清空
        get_$children: function () {
            return this.$children || (this.$children = this.get_$children_ct().find('>' + this.node_selector));
        },
        /**
         * @private
         */
        clear_children_cache: function () {
            this.$children = null;
        },
        // 释放所占用dom节点，类似于unrender
        release: function (prevent_parent_reset) {
            var view, node = this.node;
            if (this.rendered) {
                view = this.get_tree_view();
                this.get_$els().remove();
                node.cascade(function (node) {
                    var ui = view.get_node_ui(node);
                    if (!ui.rendered) {
                        return false;
                    }
                    ui.rendered = false;
                    ui.children_rendered = false;
                    ui.clear_children_cache();
                    ui.$el = null;
                });
                if (!prevent_parent_reset && !node.is_root()) {
                    view.get_node_ui(this.node.parent_node).clear_children_cache();
                }
            }
        },
        // 重新创建相关dom，只对根节点有效
        render: function () {
            if (!this.node.is_root()) {
                return;
            }
            var node = this.node;
            this.get_tree_view().get_$body().html(this.get_html());
        },
        get_tree_view: function () {
            return this.view;
        },
        /**
         * 获取节点的html，并标记有生成html的节点为rendered
         * @param {Number} level (optional) 当前节点所处的层级，模板中要用到。可以不传，会自动计算
         * @param {Boolean} mark_rendered (optional) 是否自动标记输出了html的节点为rendered及children_rendered，默认为true
         */
        get_html: function (level, mark_rendered) {
            var node = this.node, p;
            if (typeof level !== 'number') {
                level = this.get_level();
            }
            mark_rendered = mark_rendered !== false;
            if (mark_rendered) {
                this.rendered = true;
            }
            // 如果处于展开，要递归调用子节点的get_html
            var children = node.expanded ? this.get_children_htmls(level, mark_rendered) : [];
            return tmpl.tree_node({
                node: node,
                level: level,
                children: children
            });
        },
        get_level: function () {
            var node = this.node, p, level = 0;
            p = node;
            while (p.parent_node) {
                level++;
                p = p.parent_node;
            }
            return level;
        },
        /**
         * 获取子节点的html数组
         * @param {Number} level (optional) 当前节点所处的层级，模板中要用到。可以不传，会自动计算
         * @param {Boolean} mark_rendered (optional) 是否自动标记输出了html的节点为rendered及children_rendered，默认为true
         * @private
         */
        get_children_htmls: function (level, mark_rendered) {
            if (typeof level !== 'number') {
                level = this.get_level();
            }
            mark_rendered = mark_rendered !== false;
            if (mark_rendered) {
                this.children_rendered = true;
            }
            var view = this.get_tree_view();
            return $.map(this.node.child_nodes, function (child) {
                var ui = view.get_node_ui(child);
                if (mark_rendered) {
                    ui.rendered = true;
                }
                return ui.get_html(level + 1, mark_rendered);
            });
        },
        /**
         * @cfg {Object} shortcuts (optional) 属性快捷更新映射，例如selected属性映射到一个快速切换selected样式的函数上
         */
        shortcuts: {
            expanded: function () {
                var expanded = this.node.expanded;
                if (expanded) {
                    this.render_children();
                }
                this.get_$el().toggleClass('item-open', expanded);
                this.get_$children_ct().toggleClass('itembox-open', expanded);
            },
            loading: function () {
                this.get_$el().toggleClass('item-loading', this.node.loading);
            },
            // 是否空目录
            leaf: function () {
                var leaf = this.node.leaf,
                    $el = this.get_$el();
                if (!leaf) {
                    var $span = $el.find('span');
                    if (!$span.next('i')[0]) {
                        $span.after('<i data-ico="true" class="ico"></i>');
                    }
                } else {
                    $el.find('i').remove();
                }
            },
            // 选中
            selected: function () {
                this.get_$el().toggleClass('list-selected', this.node.selected);
                // this.get_$el().find('span').text((this.node.selected ? '*' : '') + this.node.name);
            },
            // 选中样式
            name: function () {
                this.get_$el().find('span').text((this.node.selected ? '*' : '') + this.node.name);
            },
            // 正在拖拽到
            dropping: function () {
                this.get_$el().find('span').text((this.node.dropping ? '>' : '') + this.node.name);
            }
        },
        // private
        insert_html: function (index, html) {
            var $children_ct = this.get_$children_ct();
            var $childs = this.get_$children();
            var size = $childs.length;
            if (index <= 0) {
                $children_ct.prepend(html);
            } else if (index >= size) {
                $children_ct.append(html);
            } else {
                $childs.eq(index).before(html);
            }
            this.clear_children_cache();
        },
        // 子节点添加，按索引插入到指定位置
        on_add: function (child, index) {
            var node = this.node;
            if (!this.rendered || !this.children_rendered) {
                return;
            }
            var view = this.get_tree_view();
            var child_ui = view.get_node_ui(child);
            this.insert_html(index, child_ui.get_html());
        },
        // 有子节点移除，删除dom
        on_remove: function (child, index) {
            if (!this.rendered || !this.children_rendered) {
                return;
            }
            var view = this.get_tree_view();
            var child_ui = view.get_node_ui(child);
            child_ui.get_$el(index); // 让子节点找到自己对应的dom，并缓存
            child_ui.release();
        },
        // 局部更新dom信息，包含expanded、loading、leaf、selected、name
        on_update: function (changes) {
            if (!this.rendered) {
                return;
            }
            var property_name, shortcuts = this.shortcuts;
            for (property_name in changes) {
                if (changes.hasOwnProperty(property_name) && shortcuts.hasOwnProperty(property_name)) {
                    shortcuts[property_name].call(this);
                }
            }
        },
        // 完整更新子节点们
        on_datachanged: function (old_child_nodes) {
            if (!this.rendered) {
                return;
            }
            var view = this.get_tree_view();
            // clear
            this.get_$children_ct.html(this.get_children_htmls());
            $.each(old_child_nodes, function (index, node) {
                view.get_node_ui(node).release(true);
            });
            this.clear_children_cache();
        },
        render_children: function () {
            if (!this.rendered) {
                return;
            }
            if (this.children_rendered) {
                return;
            }
            return this.get_$children_ct().html(this.get_children_htmls());
        }
    });
    var ss = 1;
    return TreeNodeUI;
});/**
 * 类似于Grid - GridView？存放常用的视图操作接口
 * @author cluezhang
 * @date 2013-10-22
 */
define.pack("./file_list.tree.TreeView",["lib","common","$","./file_list.tree.TreeNodeUI","i18n","./file_list.file_list"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        collections = lib.get('./collections'),
        easing = lib.get('./ui.easing'),
        text = lib.get('./text'),
        user_log = common.get('./user_log'),
        $ = require('$'),

        TreeNodeUI = require('./file_list.tree.TreeNodeUI'),
        _ = require('i18n').get('./pack'),
        l_key = 'common.tree',
        l_move = 'disk.move',
        MSG_ALREADY_IN = _(l_move,'文件已经在该文件夹下了'),
        MSG_NO_DEEP = _(l_move,'不能将文件移动到自身或其子文件夹下'),

        undefined;

    var View = inherit(Event, {
        expander_selector: 'i',
        constructor: function (cfg) {
            $.extend(this, cfg);
            var init_tree = this.tree;
            if (init_tree) {
                this.tree = null;
                this.bind_tree(init_tree);
                this.visible = true;
            }
            this.init_events();
        },
        init_events: function () {
            var me = this,
                $el = me.get_$body();
            $el.on('click', function (e) {
                e.preventDefault();
                me.process_event('click', e);
            });
            $el.on('contextmenu', function (e) {
                e.preventDefault();
                me.process_event('contextmenu', e);
            });
            this.on('nodeclick', this.handle_click, this);
        },
        get_$body: function () {
            return this.$el;
        },
        bind_tree: function (new_tree) {
            var me = this,
                old_tree = me.tree,
                tree_events = {
                    add: me.on_add,
                    update: me.on_update,
                    remove: me.on_remove,
                    // expand: me.on_expand,
                    // collapse: me.on_collapse,
                    datachanged: me.on_datachanged//,
//                    resync_path: me.on_resync_path
                };
            $.each(tree_events, function (ev_name, fn) {
                old_tree && me.stopListening(old_tree, ev_name, fn);
                me.listenTo(new_tree, ev_name, fn);
            });
            me.tree = new_tree;
        },
        process_event: function (name, e) {
            this.trigger(name, e);
            var node = this.get_node(e.target);
            if (!node) {
                return;
            }
            this.trigger('node' + name, node, e);
        },
        handle_click: function (node, e) {
            e.preventDefault();
            if ($(e.target).is(this.expander_selector)) {
                node.toggle();
                user_log('DBVIEWTREE_ITEM_DELTA_CLICK');
                // 点击expander之后不触发click事件
                return false;
            }
            this.select(node);
            user_log('DBVIEWTREE_ITEM_CLICK');
        },
        /**
         * 确保在视野内
         * @param {TreeNode} node
         */
        ensure_visible: function (node) {
            var me = this;

            var $dom = me.get_node_ui(node).get_$el(),
                $list, scroll_top, offset_top, scroll_height, height, element_height;
            if ($dom[0]) {
                offset_top = $dom[0].offsetTop; // 要定位的记录所处的高度
                $list = me.get_$body();
                scroll_height = $list[0].scrollHeight; // 列表内容总高度
                scroll_top = $list[0].scrollTop; // 当前列表的滚动条高度
                height = $list.innerHeight(); // 列表高度
                element_height = $dom.height(); // 每条记录的高度
                // 如果不在最佳可视范围内，移动到使它显示在第3个位置
                if(offset_top > scroll_top + height - 1*element_height || offset_top < scroll_top + 2*element_height){
                    $list.scrollTop(offset_top - 3*element_height);
                }
            }
        },
        select: function (node, silent) {
            var old_node = this.selected_node;
            if (old_node) {
                old_node.set_selected(false);
            }
            if (node) {
                node.set_selected(true);
                if (!silent) {
                    this.trigger('node_selected', node);
                }
            }
            this.selected_node = node;
        },
        // 选中但是不触发事件（不加载网盘列表）
        select_silent: function (node) {
            this.select(node, true);
        },
        get_node: function (dom) {
            var $node_dom = $(dom).closest(TreeNodeUI.prototype.node_selector, this.get_$body());
            if (!$node_dom.length) {
                return null;
            }
            var id = $node_dom.attr('data-node-id');
            return this.tree.get_node_by_id(id);
        },
        get_node_ui: function (node) {
            var ui = node.ui;
            if (!ui) {
                ui = node.ui = new TreeNodeUI(node, this);
            }
            return ui;
        },
        hide: function () {
            var me = this;
            me.get_node_ui(this.tree.root).release();
            me.tree.root.clear_children();
            me.visible = false;
        },
        show: function () {
            var me = this;
            me.get_node_ui(me.tree.root).render();
            me.visible = true;
        },
        is_visible: function () {
            return !!this.visible;
        },
        on_add: function (parent, child, index) {
            // 添加节点
            this.get_node_ui(parent).on_add(child, index);
        },
        on_remove: function (parent, child, index) {
            // 删除节点
            this.get_node_ui(parent).on_remove(child, index);
        },
        on_update: function (node, changes) {
            // 更新节点信息
            this.get_node_ui(node).on_update(changes);
        },
        on_datachanged: function (node, old_child_nodes) {
            // 重置并渲染所有子节点
            this.get_node_ui(node).on_datachanged(old_child_nodes);
        },
//        on_resync_path: function (last_level_node) {
//            if (last_level_node) {
//                this.ensure_visible(last_level_node);
//            }
//        },
        /**
         * 启用丢放
         */
        refresh_drop: function (files) {
            var tree_view = this,
                file_list = require('./file_list.file_list');

            require.async('jquery_ui', function () {

                // 逐层刷新
                tree_view.tree.root.cascade(function (node) {
                    var node_ui = tree_view.get_node_ui(node),
                        $el = node_ui.get_$el();

                    if ($el.data('droppable'))
                        $el.droppable('destroy');

                    $el.droppable({
                        scope: 'move_file',
                        tolerance: 'pointer',
//                        accept: function () {
//                            console.log(new Date().getTime(), arguments);
//                            return false;
//                        },
                        hoverClass: 'list-dropping',
                        over: function (e, ui) {
                            var $el = $(this),
                                node_id = $el.attr('data-node-id'),
                                node = tree_view.tree.get_node_by_id(node_id),
                                check = check_droppable(node, files);

                            if (!node || check) {
                                $(this).removeClass('list-dropping');
                            }
                        },
                        drop: function (e, ui) {
                            var $el = $(this),
                                node_id = $el.attr('data-node-id'),
                                node = tree_view.tree.get_node_by_id(node_id);

                            if (!node)
                                return false;

                            // path_nodes = 要丢放到的目标目录的路径
                            // files = 正在拖拽的目录
                            // 如果 path_nodes 和 files 的已知子节点有任何交集，则不允许丢放
                            var err;
                            if (err = check_droppable(node, files)) {
                                tree_view.trigger('drop_files_error', err);
                                return false;
                            }

                            // 移动文件
                            tree_view.trigger('drop_files', node, files);
                            user_log('DBVIEWTREE_ITEM_DROP');
                        }
                    });
                });

            });

            var check_droppable = function (node, files) {
                var cur_node = file_list.get_cur_node();

                // 如果目标目录是虚拟目录，则不允许
                if (node.is_vir_dir())
                    return text.format( _(l_key,'不能移动到{0}中') , [ node.get_name() ] );
                    //return '不能移动到' + node.get_name() + '中';

                // 如果目标目录是文件所在目录，则提示
                if (cur_node.get_id() === node.get_id())
                    return MSG_ALREADY_IN;

                // 如果文件列表中选中的文件和要移动到的目录ID路径有交集，即表示将移动文件到自身或自身子目录下面，这是不允许的操作
                var file_id_map = collections.array_to_set(files, function (file) {
                        return file.get_id();
                    }),
                    deep = collections.any(node.get_path_nodes(), function (node) {
                        return node.get_id() in file_id_map;
                    });
                if (deep) {
                    return MSG_NO_DEEP;
                }
            };
        }
    });
    return View;
});/**
 * 文件列表UI逻辑
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file_list.ui",["lib","common","$","./file_path.file_path","./view_switch.view_switch","main","./toolbar.tbar","./file_list.file_list","./file_list.offline.offline_opener","./file_list.ui_offline","./file_list.ui_virtual","./file_list.ui_normal"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        console = lib.get('./console').namespace('disk/file_list/ui'),
        collections = lib.get('./collections'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        page_event = common.get('./global.global_event').namespace('page'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),

        file_path = require('./file_path.file_path'),
        view_switch = require('./view_switch.view_switch'),

        main_mod = require('main'),
        space_info = main_mod.get('./space_info.space_info'),
        main_ui = main_mod.get('./ui'),

        file_list,
        tbar = require('./toolbar.tbar'),

        ui_map = {}, // 所有的已加载的UI模块
        cur_ui, // cur_ui 始终是 ui_virtual 或 ui_normal 其中一个

        doc = document,

        undefined;

    var ui = new Module('disk_file_list_ui', {
        hook_task:{//挂载的任务列表
            //open_offline: function(){
            //    file_list.load_offline_dir();
            //}
        },
        /**
         * 执行挂载任务
         * @param task_name
         */
        do_hook_task: function(task_name){
            if(task_name){
                if(this.hook_task[task_name]){
                    this.hook_task[task_name].call();
                    delete this.hook_task[task_name];//删除执行过的挂载任务
                }
            } else {
                for(var key in this.hook_task){
                    this.hook_task[key].call();
                }
                this.hook_task = [];//删除全部挂载任务
            }
        },
        /**
         * 控制是否显示双屏
         * @param node
         */
        toggle_dbView: function(node){
            if(node.is_offline_dir()){//离线文件会再触发一次 load 这里做个hack
                return;
            }
            var show = false;//显示刷屏
            if( this.hook_task['open_offline'] ){
                //tbar.set_disable(false);//放开其他操作变更工具条
                show = true;//隐藏双屏
            }
            main_ui.get_$ui_root().toggleClass('hide-dbview',show);
        },
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
                .listenTo(global_event,'disk_open_offline',function(){

                    main_ui.get_$ui_root().toggleClass('hide-dbview',true);//隐藏双屏
                    tbar.toggle_toolbar('offline');//工具条提前置为 离线工具条
                    //tbar.set_disable(true);//禁止其他操作变更工具条

                    require('./file_list.offline.offline_opener').init();
                    this.hook_task.open_offline = function(){
                        file_list.load_offline_dir();
                    };
                })
                // 开始加载后显示UI
                .listenTo(file_list, 'before_load', function (node, last_node, reset_ui) {
                    // 是否虚拟目录并且不是可编辑的虚拟目录
                    $(doc.body).toggleClass('module-disk-vir-dir', (node.is_vir_dir() && !node.is_offline_dir()));
                    // 是否虚拟目录并且是可编辑的虚拟目录
                    var is_offline = node.is_vir_dir() && node.is_offline_dir();
                    main_ui.get_$ui_root().toggleClass('module-offline',is_offline);
                    main_ui.get_$ui_root().toggleClass('module-disk',!is_offline);

                    this.enter_dir(node, last_node, reset_ui);
                })

                // 读到文件列表后插入DOM
                .listenTo(file_list, 'load', function (node /* offset, size, total, ... */) {
                    if (file_list.is_cur_node(node)) {   // 健壮性判断
                        var me = this, args = $.makeArray(arguments);
                        // 插入节点
                        me.set_node_data.apply(me, args);

                        // 标题
//                        if (file_list.get_root_node() === node) {
//                            doc.title = node.get_name();
//                        } else {
//                            doc.title = node.get_name() + ' - 微云';
//                        }
                        this.toggle_dbView(node);
                        me.do_hook_task('open_offline');
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
            };

            // 刷新
            this.listenTo(global_event, 'disk_refresh', reload);
        },

        enter_dir: function (node, last_node, reset_ui) {
            var last_ui = cur_ui;

            cur_ui = this._get_ui(node);

            // 退出之前的目录 // TODO 重置空提示
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
            if(view_switch.toggle_ui(cur_ui.is_view_switchable())){
                // 视图切换显示出来后，高度和普通工具栏有些差别，只能恶心些地hack
                this.frame_height_changed();
            }

            // 调整头部高度
//            if (constants.UI_VER === 'WEB') {
//                global_event.trigger('page_header_height_changed');
//            }
        },

        set_node_data: function (/* ... */) {
            // 更新数据
            if (cur_ui) {
                cur_ui.set_node_data.apply(cur_ui, arguments);
            }

//            // 调整头部高度
//            if (constants.UI_VER === 'WEB') {
//                global_event.trigger('page_header_height_changed');
//            }
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
        frame_height_changed: function () {
            this.trigger('frame_height_changed');
        },

        _get_ui: function (node) {
            if (!node) {
                return null;
            }

            var ui, ui_name;
            if (node.is_vir_dir()) {
                if(node.is_offline_dir()){
                    ui_name = 'ui_offline';
                    ui = require('./file_list.ui_offline');
                } else {
                    ui_name = 'ui_virtual';
                    ui = require('./file_list.ui_virtual');
                }

            } else {
                ui_name = 'ui_normal';
                ui = require('./file_list.ui_normal');
            }

            if (!ui_map[ui_name]) {
                ui_map[ui_name] = ui;
                this.add_sub_module(ui);

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
            qqnews: 'icon-weixin icon-weixin-news',
            //离线文件
            offline: 'icon-offline'
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
         * @returns {boolean} 默认支持切换
         */
        is_view_switchable: function(){
            return true;
        },

        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} node
         * @param url_handler 获取预览地址的处理函数
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (node,url_handler) {
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
                        mod.get('./full_screen_preview').preview(node,url_handler);
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
        _get_status: function(is_vir_dir,files){
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
            return new Status(cfg);
        },
        /**
         * 更新工具条
         * @param {Boolean} [is_vir_dir] 当前目录是否是虚拟目录
         * @param {FileNode[]} [files] 选中的文件
         */
        update_tbar: function (is_vir_dir, files) {
            if (tbar || (tbar = require('./toolbar.tbar'))) {
                tbar.set_status('normal', this._get_status(is_vir_dir, files));
            }
        },
        /**
         * 更新工具条
         * @param {FileNode[]} [files] 选中的文件
         */
        update_offline_tbar: function (files) {
            if (tbar || (tbar = require('./toolbar.tbar'))) {
                tbar.set_status('offline', this._get_status(false, files));
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
define.pack("./file_list.ui_normal",["lib","common","$","./tmpl","./file.file_node","./file.utils.file_factory","./file.utils.all_file_map","./view_switch.view_switch","./file_list.rename.rename","main","./ui","./toolbar.tbar","./file_list.ui_abstract","./file_list.file_list","./file_list.ui","./file_list.menu.menu","./file_list.selection.selection","./file_list.file_processor.move.move","./file_list.file_processor.remove.remove","./file_path.all_checker","./file_list.thumb.thumb","./file_list.tree.Tree","./file_list.tree.TreeNode","./file_list.tree.TreeView"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console').namespace('disk/file_list/ui_normal'),
        events = lib.get('./events'),
        store = lib.get('./store'),
        routers = lib.get('./routers'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        disk_event = common.get('./global.global_event').namespace('disk'),
        page_event = common.get('./global.global_event').namespace('page'),
        global_function = common.get('./global.global_function'),
        global_variable = common.get('./global.global_variable'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        m_speed = common.get('./m_speed'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        file_type_map = common.get('./file.file_type_map'),
        FileObject = common.get('./file.file_object'),
        PagingHelper = common.get('./ui.paging_helper'),

        tmpl = require('./tmpl'),

        FileNode = require('./file.file_node'),
        file_factory = require('./file.utils.file_factory'),
        all_file_map = require('./file.utils.all_file_map'),

        downloader,
        drag_files,

    // 视图切换
        view_switch = require('./view_switch.view_switch'),

        rename = require('./file_list.rename.rename'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),
        disk_ui = require('./ui'),
    // 工具栏
        tbar = require('./toolbar.tbar'),

        FileListUIAbstract = require('./file_list.ui_abstract'),

    // 全选按钮
        all_checker,

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
    // 缩略图实例
        thumb,
    // 树
        tree, $tree,
        tree_view,

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

        scroller,
        paging_helper,

        scroll_listening = false, // 正在监听中
        speed_reported = false, // 网盘测速结果已上报
        ui_visible = false, // 当前UI是否已显示

        highlight_ids = {}, // 要高亮的文件ID set
    // selected_ids = {}, // 要选中的文件ID set

    // is_output_first_list = constants.IS_PHP_OUTPUT, // 直出的首屏不能清空（hack）- james

        item_width_thumb = 125,  // 文件元素宽度（缩略图）
        item_height_thumb = 123, // 文件元素高度（缩略图）
        item_width_list = 'auto',// 文件元素宽度（列表）
        item_height_list = 47,   // 文件元素高度（列表）

        doc = document, body = doc.body, $body = $(body),

    //is_renaming = 0,//文件重命名中
        undefined;

    var ui_normal = new FileListUIAbstract('disk_file_list_ui_normal', {
        _$list_to: null,
        _$file_list: null,
        _$dir_list: null,
        _$lists: null,
//        _column_model: null,

        /**
         * 渲染文件列表UI
         * @param $list_to
         */
        render: function ($list_to) {
            var me = this;

            file_list = require('./file_list.file_list');
            file_list_ui = require('./file_list.ui');
            menu = require('./file_list.menu.menu');
            selection = require('./file_list.selection.selection');
            move = require('./file_list.file_processor.move.move');

            require.async('downloader', function (mod) {
                downloader = mod.get('./downloader');
            });


            // 文件列表主体
            if (!constants.IS_PHP_OUTPUT) {
                $list_to.append(tmpl.file_list());
            }
            me._$list_to = $list_to;
            me._$views = $list_to.children('.dirs-view, .files-view');
            me._$dirs_view = me._$views.filter('.dirs-view');
            me._$files_view = me._$views.filter('.files-view');

            scroller = main_ui.get_scroller();

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


            // 树
            me._try_each([
                // 树
                '_watch_render_tree',
                // 工具栏
                '_render_toolbar',
                // 缩略图
                '_render_thumb',
                // 分页
                '_render_paging',
                // 打开目录、文件
                '_render_enter'
            ]);

            // 延迟200毫秒
            me._try_each([
                // 框选、拖拽移动
                '_render_selection',
                // 删除
                '_render_remove',
                // 移动
                '_render_move',
                // 重命名
                '_render_rename'
            ], 300);

            me._try_each([
                // 下载
                '_render_down',
                // 拖拽文件
                '_render_drag_files', //QQ2.0中拖拽下载和拖拽发送文件是一个模块
                // 右键菜单、更多菜单
                '_render_menu',
                // IE6
                '_render_ie6_fix',
                // 高亮
                '_render_hightlight',
                // 分享
                '_render_share'
            ], 700);


            me.on('close_create_dir', function () {
                if (this.is_activated() && ui_visible) {
                    this._update_list_view_status(null, null, true);
                }
            })
        },

        show: function ($parent) {
            if (ui_visible !== true) {
                this.render($parent);

                this.get_$views().show();

                if (all_checker) {
                    // 显示全选
                    all_checker.show();
                }

                view_switch.set_namespace('ui_normal');

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

            disk_ui.toggle_toolbar(constants.DISK_TOOLBAR.NORMAL);

            // 更新视图
            this._update_list_view_status(false, false, false);

            // 隐藏右键菜单，解决jQueryUI draggable 阻止了mousedown事件的兼容性问题 james TODO 验证是否必要
            menu.hide_all();

            // 特殊逻辑
            this._on_enter_dir(node);

            view_switch.set_namespace('ui_normal');

            this._update_paging_data();//todo 缩略图模式下，进入虚拟目录会触发 进入单行模式；再回到网盘时，会错乱网盘加载判断
        },

        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            if (thumb)
                thumb.clear_queue();

            // 清除已选中的文件
            if (selection) {
                selection.clear(last_node);
                selection.trigger_changed();
            }

            this._clear_$items(false);
            this._update_list_view_status(false, false, false);
        },

        set_node_data: function (node, reset_ui) {

            cur_node = node;

            this._set_node_data(cur_node, reset_ui);
        },

        _set_node_data: function (cur_node, reset_ui) {
            var dirs = cur_node.get_kid_dirs();
            var files = cur_node.get_kid_files();
            this._set_$items(dirs, files);

            // 更新视图
            this._update_list_view_status(dirs.length > 0, files.length > 0, true);

            /*if (reset_ui) {
                mini_tip.ok('文件列表已更新');
            }*/
        },

        append_$items: function (dirs, files, is_first_page) {
            this.add_$items(dirs, files, is_first_page);
        },

        prepend_$items: function (add_dirs, add_files) {
            var dirs = cur_node.get_

            // 插入节点需要重新渲染整个列表，现在需要对dirs、files进行排序，将要插入的节点移到dirs、files前方 - james
            for (var i = add_dirs.length; i >= 0; i--) {

            }

            /*
             var count = (dirs ? dirs.length : 0 ) + (files ? files.length : 0);
             if (count > 1) {
             console.warn('file_list_ui_normal.prepend_$items(...) 方法目前只支持追加一个文件，追加多个时排序会有问题');
             }
             */

            var $items;
            add_dirs || (add_dirs = []);
            add_files || (add_files = []);

            var p_dir = file_list.get_cur_node(),
                line_size = paging_helper.get_line_size();

            if (add_dirs.length) {
                $items = tmpl.file_item({ p_dir: p_dir, files: add_dirs, icon_map: this.get_icon_map() });
                this.get_$dir_list().prepend($items);
            }
            if (add_files.length) {
                $items = tmpl.file_item({ p_dir: p_dir, files: add_files, icon_map: this.get_icon_map() });
                this.get_$file_list().prepend($items);
            }

            this.trigger('add_$items', [].concat(add_dirs, add_files), add_dirs, add_files);

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

            // TODO 插入节点需要处理位移
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
            if (is_first_page || scroller.is_reach_bottom()) {
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
                add_dir_lines = 0, add_file_lines = 0,
                dir_count = 0, file_count = 0,

                line_size = calc_list_size ? paging_helper.get_line_size() : 0,
                line_count = calc_list_size ? paging_helper.get_line_count(is_first_page) : 0,

                p_dir = file_list.get_cur_node(),
                html;

            if (!(add_count > 0)) {
                add_count = calc_list_size ? line_size * line_count : fixed_list_size; // 每一批添加的文件个数
            }


            // 目录在前
            if (add_dirs_queue.length) {
                var step_size = add_count;

                if (step_size > 0) {
                    step_dirs = add_dirs_queue.splice(0, step_size);

                    html = tmpl.file_item({ p_dir: p_dir, files: step_dirs, icon_map: this.get_icon_map(), line_size: line_size });

                    this.get_$dir_list().append(html);
                    dir_count = step_dirs.length;
                    add_dir_lines = Math.ceil(dir_count / line_size);
                }
            }

            // 文件在后
            if (add_files_queue.length) {
                var is_list = view_switch.is_list_view(),
                    file_step_size = 0;

                if (is_list || !calc_list_size) {
                    file_step_size = add_count - dir_count;
                    // console.debug('列表模式，已添加目录' + dir_count + '个；文件' + file_step_size + '个');
                }
                else {
                    // 如果插入的目录行数不满足需求，则需要继续插入文件
                    var line_limit = line_count - add_dir_lines;
                    if (line_limit > 0) {
                        file_step_size = line_limit * line_size;
                    }
                }

                if (file_step_size > 0) {
                    step_files = add_files_queue.splice(0, file_step_size);
                    html = tmpl.file_item({ p_dir: p_dir, files: step_files, icon_map: this.get_icon_map(), line_size: line_size });
                    this.get_$file_list().append(html);
                    file_count = step_files.length;
                    add_file_lines = Math.ceil(file_count / line_size);
                }
            }
//            console.debug('缩略图模式，' + (add_dir_lines > 0 ? '已添加目录' + add_dir_lines + '行共' + dir_count + '个；' : '') + (add_file_lines > 0 ? '文件' + add_file_lines + '行共' + file_count + '个' : ''));

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
         * 从队列中移除指定的文件
         * @param {Object} id_set
         * @private
         */
        _remove_from_queue: function (id_set) {
            if (!(add_dirs_queue.length || add_files_queue.length)) {
                return;
            }

            var queues = [add_dirs_queue, add_files_queue];
            for (var i = 0; i < queues.length; i++) {
                var queue = $.grep(queues[i], function (file) {
                    return !id_set.hasOwnProperty(file.get_id());
                });
                queues[i] = queue;
            }

//            console.log('移除了' + (add_dirs_queue.length - queues[0].length) + '个目录');
//            console.log('移除了' + (add_files_queue.length - queues[1].length) + '个文件');

            add_dirs_queue = queues[0];
            add_files_queue = queues[1];
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
            if (scroller) {
                scroller.up();
            }
        },

        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                var add_when_scroll = function () {
                    // 判断滚动高度
                    if (scroller.is_reach_bottom()) {
                        this._add_$items_from_queue(false);
                    }
                };
                this.listenTo(scroller, 'scroll', add_when_scroll);
                this.listenTo(scroller, 'resize', add_when_scroll);
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
                this.stopListening(scroller, 'scroll resize');
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

            var me = this;

            // 取消要删除的文件的选中状态
            selection.toggle_select(file_nodes, false);

            // 从添加文件的队列中移除
            if (file_nodes.length) {
                var ids = collections.array_to_set(file_nodes, function (f) {
                    return f.get_id();
                });
                me._remove_from_queue(ids);
            }

            var remove_fn = function () {
                $(this).remove();
                me.trigger('remove_$items');

                // 剔除临时目录
                file_nodes = $.grep(file_nodes, function (file) {
                    return !file.is_tempcreate();
                });

                if (file_nodes.length) {
                    // 填充
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
        _set_$items: function (dirs, files) {
            this._clear_$items(true);
            this.append_$items(dirs, files, true);

            // 修复IE下可能出现滚动条高度未变化的问题 - james
            /* 滚动条内移后不会有这个问题 - james
             if ($.browser.msie) {
             scroller.go(0, 0);
             }*/

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
                $item = $('#' + this.get_el_id(arg));
            } else if (arg instanceof $ || arg.tagName) {
                $item = $(arg).closest('[data-file-id]');
            }
            return $item;
        },

        /**
         * 通过文件ID获取DOM ID
         * @param {String} file_id
         * @returns {String}
         */
        get_el_id: function (file_id) {
            return '_disk_file_item_' + file_id;
        },

        /**
         * 获取某些文件的DOM
         * @param {Array<String>} ids
         */
        get_$items: function (ids) {
            var me = this;
            return $.isArray(ids) ? $($.map(ids, function (id) {
                return me.get_$item(id).get(0);
            })) : me.get_$lists().children(); // lists > .list-wrap > .list
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
                $cur_item.children('.list').empty().html(tmpl.file_item({
                    files: [node],
                    icon_map: this.get_icon_map(),
                    only_content: true  // only_content -> 只生成文件DOM的内容部分，而不包括.list-wrap节点本身，这样可以保留一些状态（如选中状态：ui-selected）
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
                $file_name = $item.find('[data-name=file_name]'),
                ext = FileObject.get_ext(name) || '',
                name_no_ext = ('.' + ext) === name ? name : name.substr(0, name.length - (ext.length + 1)),
                can_ident = !node.is_dir() && file_type_map.can_identify(ext);

            $file_name.text(can_ident ? name_no_ext : name).css('display', ''); // $file_name.show()，这里改为删除display样式是因为.filename元素在列表模式下display=inline-block，在缩略图模式下display=block，如果直接.show()，会导致布局出错
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

        get_$list_parent: function () {
            return this._$list_to;
        },

        get_$list_sub_titles: function () {
            return this._$list_sub_titles;
        },

        /**
         * 标记某个文件DOM展开了菜单
         * @param el
         */
        mark_menu_on: function (el) {
            this.clear_menu_mark();

            var $item = this.get_$item(el);
            $item.children().addClass('list-menu-on');

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
                $item.removeClass('selected').find('[data-function="more"]').removeClass('actived');
                $item.children().removeClass('list-menu-on');
            }
        },

        /**
         * 设置需要高亮的文件
         * @param {Array<String>} ids
         */
        set_highlight_ids: function (ids) {
            ids = ids || [];
            $.extend(highlight_ids, collections.array_to_set(ids));
        },
        /**
         * 显示新建文件夹
         */
        show_create_dir: function () {
            var temp_node;
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

                // 插入节点
                file_list.prepend_node(temp_node);

                // this._update_list_view_status(null, null, false);

                // 定位并启用重命名
                this._ensure_visible(temp_node);
                rename.start_edit(temp_node, function (success, new_name, properties) {
                    var old_id;
                    if (success) { // 成功时，更新节点及UI
                        old_id = temp_node.mark_create_success(properties);
                        temp_node.set_tempcreate(false);
                        this.update_$item(temp_node, old_id);

                        this.trigger('after_dir_created', temp_node);

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

            var $items = this.get_$items(file_ids).children();
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

            var $items = $(items).children().addClass('hilight');
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

        /**
         * 判断列表是不是缩略图模式
         * @returns {Boolean}
         */
        is_grid_view: function () {
            return view_switch && view_switch.is_grid_view();
        },

        _get_sel_files: function () {
            return file_list.get_selected_files();
        },

        // 分页逻辑
        _render_paging: function () {
            var me = this;

            paging_helper = new PagingHelper({
                scroller: scroller
            });

            me._update_paging_data();

            // 切换视图时，判断是否需要补充列表 - james
            this.listenTo(view_switch, 'switch.ui_normal', function () {
                me._update_paging_data();
                if (scroller.is_reach_bottom()) {
                    this._add_$items_from_queue(false);
                }
                this._block_hoverbar_if();
            });
        },

        // 进入目录、预览文件、下载文件
        _render_enter: function () {

            var me = this,
                is_enter_event = function (e) {
                    return !$(e.target).closest('input, a, button, [data-function]')[0];
                },
                is_multi_key = function (e) {
                    return e.ctrlKey || e.shiftKey || e.metaKey;
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

                    if (!is_enter_event(e) || !ie_click_hacker.is_click_event(e))
                        return;

                    if (is_multi_key(e)) {
                        select_file_event(e);
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

                    var file = me.get_file_by_$el(e.target);
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

            // 点击checkbox勾选，而不是进入
            $lists
                .off('click.file_list_ck', '[data-file-check]')
                .on('click.file_list_ck', '[data-file-check]', select_file_event)

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

            // move = require('./file_list.file_processor.move.move');
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
                    move.start_move(files, target_node.get_parent().get_id(), target_node.get_id());
                }
            })
        },

        // 文件选择、移动模块
        _render_selection: function () {
            var me = this;

            all_checker = require('./file_path.all_checker');
            selection.render();
            selection.enable_selection();
            selection.enable_dragdrop();


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
                    this._block_hoverbar_if(sel_meta.files.length);
                })

                // 目前看来不需要这段同步代码，文件列表模板中对于已选中的文件节点，自动应用了 .ui-selected 样式 - james 2013.11.18
                // 插入DOM时，全选状态下自动选中
//                .on('add_$items', function (files) {
//                    var file = files[0];
//                    if (file && file.get_ui().is_selected() && !file.is_tempcreate()) {
//                        selection.set_dom_selected(files, true);
//                    }
//                })

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

            this
                // 添加文件DOM后，更新其dragdrop状态
                .on('add_$items update_$item', function (files) {
                    files = [].concat(files);

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
                })

                .on('show', function () {
                    selection.enable_selection();
                    selection.enable_dragdrop();
                })
                .on('hide', function () {
                    selection.disable_selection();
                    selection.disable_dragdrop();
                });

            this
                .listenTo(file_list_ui, 'activate', function () {
                    // file_list/ui 被隐藏时，禁用框选和拖拽
                    if (/*this.is_activated() && */ui_visible) {  // 这个this.is_activated()判断应该用不上 james
                        selection.enable_selection();
                        selection.enable_dragdrop();
                    }
                })
                .listenTo(file_list_ui, 'deactivate', function () {
                    selection.disable_selection();
                    selection.disable_dragdrop();
                });

            this.listenTo(file_list, 'activate deactivate', function () {
                // 显示、隐藏树
                this._update_tree_visible(true);
            });

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
                downloader = mod.get('./downloader');
            });
        },

        // 拖拽下载
        _render_drag_down: function () {
            // APPBOX 拖拽下载
            if (constants.IS_APPBOX) {
                var mouseleave = 'mouseleave.file_list_ddd_files';

                this
                    // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                    .listenTo(selection, 'before_drag_files', function (files) {

                        $body
                            .off(mouseleave)
                            .one(mouseleave, function (e) {

                                // 取消拖拽动作（取消移动文件动作）
                                selection.cancel_drag();

                                // 下载
                                if (downloader) {
                                    // 启动拖拽下载
                                    downloader.drag_down(files);
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

        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            // APPBOX 拖拽下载
            if (constants.IS_APPBOX) {
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
                    .listenTo(selection, 'before_drag_files', function (files) {

                        $body
                            .off(mouseleave)
                            .one(mouseleave, function (e) {

                                // 取消拖拽动作（取消移动文件动作）
                                selection.cancel_drag();

                                // 下载
                                if (can_drag_files && drag_files) {
                                    // 启动拖拽下载
                                    drag_files.set_drag_files(files, e);
                                } else {
                                    if (downloader) {
                                        // 启动拖拽下载
                                        downloader.drag_down(files, e);
                                        user_log('DISK_DRAG_DOWNLOAD');
                                    } else {
                                        console.log('downloader未初始化 -- 拖拽下载 不能触发');
                                    }
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


            var ctxt_menu = menu.get_context_menu();
            me
                // 菜单显示时给item标记
                .listenTo(ctxt_menu, 'show_on', function (el) {
                    this.mark_menu_on(el);
                        disk_ui.get_$body().addClass('block-hover');
                })
                // 菜单 隐藏时去掉标记
                .listenTo(ctxt_menu, 'hide', function () {
                    this.clear_menu_mark();
                    disk_ui.get_$body().removeClass('block-hover');
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
                                selection.select_but($on_item);
                                can_show = selection.has_selected();
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

            // 切换视图后排序  // 已改为直接对数据排序 - james
//            me.listenTo(view_switch, 'switch', function () {
//                if (me.is_activated() && ui_visible) {
//                    me.clear_$items();
//                    me._update_list_view_status();
//                    me._refill_$items();
//                }
//            });
        },

        // 文件列表头部模块
//        _render_column_header: function (/*$column_model_to*/) {
//
//            // 排序后也会返回两个集合
//            this.listenTo(cm, 'sorted', function (datas, field) {
//                this.trigger('sorted');
//
//                var dirs = datas[0],
//                    files = datas[1],
//                    node = file_list.get_cur_node();
//
//                if (node) {
//                    // 虚拟目录、目录不参与「大小」的排序
//                    if (field === 'size') {
//                        dirs = node.get_kid_dirs();
//                    }
//
//                    // 更新缓存
//                    node.set_nodes(dirs, files);
//                }
//            });
//        },

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

                        this.trigger('after_file_renamed', node);
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
                        $(this).children(':first').addClass(hover_class);
                    })
                    .on('mouseleave', '>div', function () {
                        $(this).children(':first').removeClass(hover_class);
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
                    refresh: function (e) {
                        global_event.trigger('disk_refresh');
                    },
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
                    //分享入口
                    share: function (e) {
                        var files = ui._get_sel_files();
                        ui._get_share_enter(function (share_enter) {
                            share_enter.start_share(files);
                        });
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
                })
                .on('click', '[data-function="share_enter"]', function (e) {
                    e.preventDefault();
                    var node = me.get_file_by_$el(this);

                    me._get_share_enter(function (share_enter) {
                        share_enter.start_share(node);
                    });
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

        _watch_render_tree: function () {
            if (tree_view) return;

            var me = this,
                root_dir = file_list.get_root_node();

            var init = function () {
                // 如果侧边栏在初始化时就已经打开，则立即初始化树
                if (view_switch.is_sidebar_view()) {
                    me._render_tree(root_dir);
                    me._update_tree_visible();
                }

                // 监听view_switch
                me.listenTo(view_switch, 'sidebar_view_change', function (active) {
                    if (active && !tree_view)
                        me._render_tree(root_dir);
                    me._update_tree_visible();
                });
            }

            if (root_dir) {
                init();
            } else {
                this.listenTo(file_list, 'init_root', function (sup_node, root_node) {
                    root_dir = root_node;
                    init();
                });
            }
        },

        /**
         * 更新树显示状态
         * @param {Boolean} [from_root] 是否从根目录加载，默认 false
         * @private
         */
        _update_tree_visible: function (from_root) {
            var me = this;
            from_root = typeof from_root === 'boolean' ? from_root : false;

            var visible = file_list.is_activated() && view_switch.is_sidebar_view();

            if (!tree_view) return;
            visible ? tree_view.show() : tree_view.hide();
            disk_ui.toggle_sidebar(visible);

            // 显示树时重新加载
            if (visible) {
                // 目录路径
                var root_node = file_list.get_root_node(),
                    path_ids = [];

                // 尝试获取当前目录的路囧
                if (root_node && !from_root) {
                    var super_id = root_node.get_pid();
                    var cur_node = file_list.get_cur_node();
                    if (cur_node) {
                        // 计算网盘文件列表路径（排除 super 节点）
                        path_ids = $.map(cur_node.get_path_nodes(), function (node) {
                            return node.get_id() != super_id ? node.get_id() : null;
                        });
                    }
                }

                if (!path_ids.length) {
                    tree.root.load();
                    return;
                }
                tree.update(path_ids).done(function(){
                    me._focus_dir_node(cur_node);
                });
            }
        },
        
        _focus_dir_node : function(node){
            var tree_node = tree.get_node_by_id(node.get_id());
            if (tree_node && tree_view.is_visible()) {
                tree_view.select_silent(tree_node);
                tree_view.ensure_visible(tree_node);
            }
        },

        _render_tree: function (root_dir) {

            if (tree_view) return;
            if (!root_dir) return;

            var Tree = require('./file_list.tree.Tree'),
                TreeNode = require('./file_list.tree.TreeNode'),
                TreeView = require('./file_list.tree.TreeView');


            var root_dir = file_list.get_root_node();
            var root_node = new TreeNode({
                id: root_dir.get_id(),
                name: root_dir.get_name(),
                expanded: true
            });
            tree = new Tree({
                root: root_node
            });
            tree_view = new TreeView({
                tree: tree,
                $el: this._get_$tree()
            });

            // ===== 事件绑定 ==========================

            // 点击树节点后，显示对应的目录文件列表
            this.listenTo(tree_view, 'node_selected', function (node) {
                var path_nodes = $.map(node.get_path_nodes(), function (node) {
                    return {
                        id: node.get_id(),
                        name: node.get_name(),
                        is_vir_dir: node.is_vir_dir(),
                        is_dir: true
                    };
                });

                file_list.load_by_path(path_nodes, true);
            });

            // 启动网盘的框选后，刷新树的丢放状态
            selection && this.listenTo(selection, 'drag_start', function (files) {
                tree_view.is_visible() && tree_view.refresh_drop(files);
            });

            // 丢放后，移动文件
            this.listenTo(tree_view, {
                'drop_files': function (node, files) {
                    var is_on_root = node === root_node,
                        pid = is_on_root ? file_list.get_root_node().get_pid() : node.parent_node.get_id();

                    move.start_move(files, pid, node.get_id());
                    user_log('DISK_DRAG_TO_TREE');
                },
                'drop_files_error': function (msg) {
                    mini_tip.warn(msg);
                }
            });

            // ===== 事件结束 ==========================

            // ===== 一些同步 ==========================

            // 新建文件夹后，同步到树
            this.on('after_dir_created', function (file) {
                var pdir_id = file.get_pid(),

                    exists_p_node = tree.get_node_by_id(pdir_id);

                // 如果目标父节点已经 load，则需要在目标父节点下新建一个子节点
                if (exists_p_node) {
                    exists_p_node.insert_child(new TreeNode({
                        id: file.get_id(),
                        name: file.get_name(),
                        leaf: true
                    }));
                    exists_p_node.expand();
                }
            });

            // 重命名文件夹后，同步到树
            this.on('after_file_renamed', function (file) {
                if (!file.is_dir()) return;

                var node = tree.get_node_by_id(file.get_id());
                if (node) {
                    node.set_name(file.get_name());
                }
            });

            // 删除文件夹后，同步到树
            this.listenTo(file_list, 'after_nodes_removed', function (files) {
                $.each(files, function (i, file) {
                    var node = tree.get_node_by_id(file.get_id());
                    if (node) {
                        node.remove();
                    }
                });
            });

            // 移动文件夹后，同步
            this.listenTo(file_list, 'after_nodes_moved', function (files, dir_id) {
                var target_node = tree.get_node_by_id(dir_id);
                if (target_node) {
                    $.each(files, function (i, file) {
                        var node = tree.get_node_by_id(file.get_id());
                        if (node) {
                            target_node.insert_child(node);
                        }
                    });
                }
            });

            // 点击目录时，同步选中目录树上对应的节点（静默选中，不触发同步行为）
            this.listenTo(file_list, 'before_load', function (node/*, last_node, reset_ui*/) {
                this._focus_dir_node(node);
            });
            // ===== 同步结束 ==========================


            // TODO 定位到当前所在目录 file_list.get_cur_node()
//            window.tree_view1 = tree_view;
//            window.tree1 = tree;
        },

        _get_$tree: function () {
            return disk_ui.get_$sidebar();
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
                // 当前目录下的图片
                    images = $.grep(file.get_parent().get_kid_files(), function (file) {
                        return file.is_image();
                    })/*,
                 sort_meta = me._get_sort_meta()*/;

                // 排序
                // images = cm.sort_datas([images], sort_meta.field, sort_meta.dir)[0];

                // 当前图片所在的索引位置
                var index = $.inArray(file, images);

                image_preview.start({
                    support_nav: true,
                    total: images.length,
                    index: index,
                    get_url: function (index) {
                        var file = images[index];
                        return file && file.is_on_tree() ? downloader.get_down_url(file, { abs: '1024*1024' }) : null;
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

        // 注意：这里获取列表文件个数需要依赖 main UI 的 scroller 容器是可见的
        _update_paging_data: function () {
            if (paging_helper) {
                paging_helper.set_item_width(view_switch.is_grid_view() ? item_width_thumb : item_width_list);
                paging_helper.set_item_height(view_switch.is_grid_view() ? item_height_thumb : item_height_list);
                paging_helper.set_is_list(view_switch.is_list_view());
            }
        },

//        _refill_$items: function () {
//            this._update_paging_data();
//            if (cur_node && this.is_activated() && ui_visible) {
//                this.set_node_data(cur_node, false);
//            }
//        },

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
                    var empty = !has_files && !has_dirs;
                    if (show_empty_tip !== false) {
                        disk_ui.set_is_empty(empty);
                        // this.get_$no_files_tip().toggle(!has_files && !has_dirs);
                    } else {
                        disk_ui.set_is_empty(false);
                        // this.get_$no_files_tip().hide();
                    }
                }

                this._last_has_dirs = has_dirs;
                this._last_has_files = has_files;
                this._last_is_grid_view = is_grid_view;
                this._last_show_empty_tip = show_empty_tip;
            }
        },

        /**
         * 进入一些特殊目录做一些特殊的事情
         * @param {FileNode} node
         * @private
         */
        _on_enter_dir: function (node) {
            if (node.get_name() === '微云相册' && this.get_should_switch_grid()) { //第一次进来才切换
                view_switch.set_cur_view('grid', true);
                this.set_should_switch_grid(false);
            }
        },

        set_should_switch_grid: function (flag) {
            this._should_switch_grid = flag;
        },

        get_should_switch_grid: function () {
            return this._should_switch_grid;
        },

        _try_each: function (fn_names, delay) {
            var me = this,
                each = function () {
                    $.each(fn_names, function (i, fn_name) {
                        if (!constants.IS_DEBUG) {
                            try {
                                me[fn_name]();
                            } catch (e) {
                                console.error('执行 ' + fn_name + ' 失败', e.message);
                            }
                        } else {
                            me[fn_name]();
                        }
                    });
                };

            if (delay) {
                setTimeout(each, delay);
            } else {
                each();
            }
        },

        _get_share_enter: function (callback) {
            require.async('share_enter', function (mod) {
                var share_enter = mod.get('./share_enter');
                callback.call(this, share_enter);
            });
        },

        /**
         * 是否屏蔽列表项的hoverbar
         * @param [selected_files_cnt] 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            selected_files_cnt = selected_files_cnt || this._get_sel_files().length;
            if(view_switch.is_grid_view() && selected_files_cnt > 1) {
                disk_ui.get_$body().removeClass('block-hover');
                return;
            }
            if(selected_files_cnt > 1) {
                disk_ui.get_$body().addClass('block-hover');
            } else {
                disk_ui.get_$body().removeClass('block-hover');
            }
        }
    });


    // 非批量模式下，才可拖拽上传
    // 虚拟目录下，不可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        var cur_node = file_list.get_cur_node();
        return cur_node.is_dir() && !cur_node.is_vir_dir();
    });

    return ui_normal;
});/**
 * 虚拟目录UI逻辑
 * @author jameszuo
 * @date 13-6-28
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./file_list.ui_offline",["lib","common","$","main","./tmpl","./view_switch.view_switch","./file_list.ui_abstract","./file.utils.all_file_map","./file_list.file_list","./toolbar.tbar","./file_list.file_processor.move.chose_directory","./file_list.offline.Store","./disk","./ui","./file_list.offline.Select","./file_path.all_checker","i18n","./file_list.thumb.thumb","./file_list.file_processor.remove.remove","./file_list.menu.menu"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        security = lib.get('./security'),

        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        ie_click_hacker = common.get('./ui.ie_click_hacker'),
        PagingHelper = common.get('./ui.paging_helper'),
        request = common.get('./request'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        functional = common.get('./util.functional'),
        global_event = common.get('./global.global_event'),
        progress = common.get('./ui.progress'),
        mini_tip = common.get('./ui.mini_tip'),
        chose_directory_event = common.get('./global.global_event').namespace('chose_directory_event'),
        SelectBox = common.get('./ui.SelectBox'),
        scroll_listening,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        tmpl = require('./tmpl'),

        view_switch = require('./view_switch.view_switch'),
        FileListUIAbstract = require('./file_list.ui_abstract'),
//        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),
        file_list = require('./file_list.file_list'),
        tbar = require('./toolbar.tbar'),
        chose_directory = require('./file_list.file_processor.move.chose_directory'),
        Store = require('./file_list.offline.Store'),
        disk = require('./disk'),
        disk_ui = require('./ui'),

        Select = require('./file_list.offline.Select'),
        all_checker = require('./file_path.all_checker'),
        checker_event = 'toggle_check_virtual',
        _ = require('i18n').get('./pack'),
        l_key = 'disk.offline',
        l_remove = 'disk.remove',
        cur_node,
        thumb,
        remove,
        downloader,
        page_helper,
        scroller = main_ui.get_scroller(),

        menu,// 菜单
        cst_url_cgi = "http://web.cgi.weiyun.com/weiyun_web_vircgi.fcg",
        $cur_view, // 当前所使用的界面（特殊界面 or 经典界面）
        $empty_tip,//离线文件空文件提示
        $all_list,
        id_prefix = '_disk_vdir_item_',
        is_visable = false;//是否显示

    var ui_offline = new FileListUIAbstract('disk_file_list_ui_offline', {
        /**
         * 返回对html安全的node_id
         * @param node_id
         * @returns {String}
         */
        get_html_node_id: function (node_id) {
            var id = node_id;
            id = id.replace(id_prefix,'');
            if (-1 !== id.indexOf('/')) {
                return id.replace(new RegExp('\/', 'g'), '-s-')
            }
            return id;
        },
        /**
         * 逆转html的node_id
         * @param html_node_id
         * @returns {String}
         */
        reverse_html_node_id: function (html_node_id) {
            var id = html_node_id;
            id = id.replace(id_prefix,'');
            if (-1 !== id.indexOf('-s-')) {
                return id.replace(new RegExp('-s-', 'g'), '/')
            }
            return id;
        },
        /**
         * 获取元素的对应的file_id
         * @param $el
         * @returns {String}
         */
        get_node_id: function ($el) {
            return this.reverse_html_node_id($el[0].id);
        },
        /**
         * 从dom中获取FileNode的ID
         * @param $el
         * @returns {jQuery}
         * @private
         */
        get_file_by_$el: function ($el) {
            var file_id = $($el).closest('[data-file-id]').attr('data-file-id');
            return all_file_map.get(this.reverse_html_node_id(file_id));
        },
        /**
         * 通过FileNode ID 查询 dom节点
         * @param file_id
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        get_$item: function (file_id) {
            var me = ui_offline , ret;
            if (typeof file_id === 'string') {
                ret = $('#'+ id_prefix + me.get_html_node_id(file_id));
            }
            return ret;
        },
        /**
         * 获取选中文件
         * @return {Array<File_Node>}
         */
        get_selected_files: function(){
            return Select.get_selected_files();
        }
    });

    $.extend(ui_offline,{
        // 变更指向的目录
        enter_dir: function (node) {
            var me = this;

            cur_node = node;
            //取消全选
            all_checker.toggle_check(false);
            //切换工具栏
            disk_ui.toggle_toolbar(constants.DISK_TOOLBAR.VIRTUAL_SHOW);
            //启用框选
            me.enable_selection();
            //初始化Select
            Select.init( me.get_$item );
            //修改checker事件宿主
            all_checker.set_change_event(checker_event);
            //监听 选择目录
            me.listenTo(chose_directory_event, 'offline_done', me._save_as.batch_save_as);
            //设置模式切换的命名空间
            view_switch.set_namespace('offline');
            //监听 切换视图模式
            me.listenTo(view_switch, 'switch.offline', function () {//监控视图模式带来的 高度变化/排序变化
                if (Store.sort()) {
                    this.set_$items(Store.get_show_nodes(this._get_page_size(), false));
                }
            });
            //标识可见
            is_visable = true;
        },
        //退出时操作
        _quit_job: function () {
            if(is_visable === false)
                return;
            // 隐藏离线文件空提示
            $empty_tip.hide();
            //取消全选
            all_checker.toggle_check(false);
            // 禁用框选
            this.disable_selection();
            //修改checker事件宿主
            all_checker.set_change_event(null);
            //停止监听 选择目录
            this.stopListening(chose_directory_event);
            //停止监听 切换视图模式
            this.stopListening(view_switch, 'switch.offline');
            //停止监听 退出网盘事件
            this.stopListening(disk, 'deactivate');
            //离线Store静默销毁
            Store.silent_destroy();
            //标识不可见
            is_visable = false;

            this.trigger('offline_destroy');
        },
        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            if (cur_node !== new_node) {
                this._clear_$items(true);
                this._quit_job();
            }
        },
        /**
         * 离线文件数据全部拉取，本地分批显示
         * @param node
         */
        set_node_data: function (node) {
            cur_node = node;
            //取消全选
            Select.remove_all();
            all_checker.toggle_check(false);
            var files = Store.get_show_nodes(this._get_page_size());
            this._start_listen_scroll();
            this._clear_$items(true);
            /*if (Store.from_refresh) {
                mini_tip.ok('列表已更新');
            }*/
            if (0 === files) {//没有数据
                this._show_empty();
            } else {
                this.append_$items(files);
            }
            this._update_list_view_status();
            this.on_seleted_change();//初始化选择变化

        },

        show: function () {
            $cur_view.show().siblings('[data-view]').hide();//隐藏兄弟视图，将当前视图展示出来
            all_checker.show();// 显示全选按钮
        },

        hide: function () {
            $cur_view.hide();
            this._stop_listen_scroll();
        },
        /**
         * 渲染
         * @param _$list_to
         */
        render: function (_$list_to) {
            var me = this;

            me.listenTo(disk, 'deactivate', function () {//监控网盘退出
                this._quit_job();
            });

            if(me._render_once){
                return;
            }

            me._render_once = true;

            _$list_to.append(tmpl.offline_dir_file_list());// 文件列表主体

            $cur_view = _$list_to.children('[data-view=offline]');
            $all_list = $cur_view.children('[data-type=file]');
            $empty_tip = $cur_view.find('[data-action=empty-offline-empty]');

            $.each(me.once_render, function () {
                this.call(me);
            });
        },
        /**
         * 初始化渲染仅仅渲染一次
         */
        once_render: {
            /**
             * 下载模块
             */
            downloader: function () {
                require.async('downloader', function (mod) {
                    downloader = mod.get('./downloader');
                });
            },
            /**
             * IE6 fix
             */
            ie6: function () {
                $all_list
                    .on('mouseenter', '[data-file-id]', function (e) {
                        $(this).addClass('hover');
                    })
                    .on('mouseleave', '[data-file-id]', function (e) {
                        $(this).removeClass('hover');
                    });
            },
            /**
             * 渲染缩略图
             */
            thumb: function () {
                var Thumb = require('./file_list.thumb.thumb');
                thumb = new Thumb({
                    cgi_url: cst_url_cgi,
                    cgi_cmd: 'batch_download_virtual_file',
                    cgi_data: function (files) {
                        return {
                            pdir_key: cur_node.get_id(),
                            files: $.map(files, function (file) {
                                return {
                                    owner_type: file.get_down_type(),//离线文件 请求下载的类型：1表示下载发送的文件，2表示下载接收的文件
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
                                var ret = parseInt(img_rsp['retcode']), url, file_id;
                                if (ret == 0) {
                                    if (img_rsp['download_url']) {//目前离线文件仅支持这种方式的缩略图
                                        url = img_rsp['download_url'] + '&size=128*128';
                                    }
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
                    .on('add_$items set_$items', function (files) {
                        thumb.push(files);
                    })

                    // 加载成功后显示图片
                    .listenTo(thumb, 'get_image_ok', function (file, img) {
                        set_image(file, img);
                    });

                var copy_attr_list = { unselectable: 1 },
                    set_image = function (file, img) {
                        if (!is_visable) {
                            return;
                        }
                        var $icon = me.get_$item(file.get_id()).find('i[data-ico]');

                        if ($icon[0] && img) {
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
            /**
             * 渲染 框选/勾选 模块
             */
            selection: function () {
                var me = this;

                me.sel_box = new SelectBox({//初始化框选
                    ns: 'offline',
                    $el: $all_list,
                    $scroller: main_ui.get_scroller().get_$el(),
                    clear_on: function ($tar) {
                        return !$tar.closest('[data-file-id]').length;
                    },
                    container_width: function () {
                        return $all_list.width();
                    }
                });

                me.sel_box.on('select_change', function (sel_id_map, unsel_id_map) {//监听框选变化
                    var safe_id , db_id;
                    for (safe_id in sel_id_map) {
                        db_id = this.reverse_html_node_id(safe_id);
                        Select.select( db_id );
                    }
                    for (safe_id in unsel_id_map) {
                        db_id = this.reverse_html_node_id(safe_id);
                        Select.un_select( db_id );
                    }
                    this.on_seleted_change();
                }, me);

                me.listenTo(all_checker,checker_event, function(checked){//监听全局勾选变化
                    var me = this,files,len;
                    if(!checked){//全不选中
                        files = me.get_selected_files();
                        len = files.length;
                        while( len ){
                            len-=1;
                            Select.un_select(files[len].get_id());
                        }
                    } else {//全部选中
                        files = Store.get_all_file();
                        len = files.length;
                        while( len ){
                            len-=1;
                            Select.select(files[len].get_id());
                        }
                        user_log('OFFLINE_ITEM_CHECKALL');
                    }
                    me.on_seleted_change();
                });
            },
            /**
             * 渲染 工具栏 模块
             */
            toolbar: function () {
                this.listenTo(tbar, {
                    offline_remove: function(){//批量删除
                        this._toolbar_handler.batch_remove();
                        user_log('OFFLINE_TOOLBAR_DELETE');
                    },
                    offline_save_as: function(){//批量另存为
                        this._toolbar_handler.batch_save_as();
                        user_log('OFFLINE_TOOLBAR_SAVEAS');
                    },
                    offline_refresh: function(){//刷新
                        this._toolbar_handler.refresh();
                        user_log('OFFLINE_TOOLBAR_REFRESH');
                    }
                },this);
            },
            /**
             * 渲染 文件删除 模块
             */
            remove: function () {
                remove = require('./file_list.file_processor.remove.remove');
                remove.render();
            },
            /**
             * 渲染 选择目录 模块
             */
            directory_dialog: function () {
                chose_directory.render('offline');
            },
            /**
             * 渲染 右键菜单 功能
             */
            menu: function () {
                var me = this,
                    has_listen_menu_event;
                menu = require('./file_list.menu.menu');
                $all_list
                    .on('mousedown.file_list_context_menu', '[data-file-id]', function (e) {
                        if (e.which !== 3 && e.which !== 0) {
                            return;
                        }
                        e.stopImmediatePropagation();
                        if (e.handleObj.type === 'contextmenu') {
                            e.preventDefault();
                        }

                        var $item = $(this),
                            db_id = me.get_node_id($item);

                        if (!Select.is_selected(db_id)) {
                            Select.unselected_but(db_id);//清除其他选中，并选中自己
                        }

                        if(!has_listen_menu_event) {
                            var offline_menu = menu.get_offline_menu();
                            me
                                // 菜单显示时给item标记
                                .listenTo(offline_menu, 'show_on', function (el) {
                                    disk_ui.get_$body().addClass('block-hover');
                                })
                                // 菜单 隐藏时去掉标记
                                .listenTo(offline_menu, 'hide', function () {
                                    disk_ui.get_$body().removeClass('block-hover');
                                });
                            has_listen_menu_event = true;
                        }

                        me.on_seleted_change();
                        menu.show_offline_menu(e.pageX, e.pageY, $item);
                    });

            },
            /**
             * 绑定 在文件行上的各种点击，执行的对应操作
             */
            enter: function () {
                var me = this,
                    is_enter_event = function (e) {
                        return !(e.ctrlKey || e.shiftKey || e.metaKey || !!$(e.target).closest('input, a, button, [data-function]')[0]); // 按下ctrl/shift点击时不打开目录、文件
                    },
                    enter_file = function (node, e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        // 如果是可预览的文档，则执行预览操作
                        if (me.is_preview_doc(node)) {
                            node.down_file = function () {//单独的下载
                                var node = this;
                                downloader.down_url(me._get_down_url(node, false), node.get_name(), node.get_size());
                            };
                            me.appbox_preview(node).fail(function () { // @see ui_virtual.js
                                me.preview_doc(node);                   // @see ui_virtual.js
                            });
                            user_log('ITEM_CLICK_DOC_PREVIEW');
                            return;
                        }
                        // 如果是图片，则执行预览操作
                        if (node.is_image()) {
                            me.appbox_preview(node,function () {
                                return me._get_image_preview_url(node, 1024);
                            }).fail(function () {
                                    me.preview_image(node);
                                });
                            user_log('ITEM_CLICK_IMAGE_PREVIEW');
                            return;
                        }
                        // 其他文件，下载
                        download_file(node, e);
                        user_log('OFFLINE_ITEM_DOWN');
                    },
                    download_file = function (node, e) {
                        me.download([node]);
                    },
                //勾选
                    select_file_event = function (e) {
                        e.stopPropagation();  // 阻止默认点选行为
                        var file = me.get_file_by_$el(this),
                            file_ui = file.get_ui();
                        Select[ file_ui.is_selected() ? 'un_select' : 'select' ](file.get_id());
                        me.on_seleted_change();
                        user_log('OFFLINE_ITEM_CHECKBOX');
                    },
                //另存为
                    save_as = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        me.save_as([me.get_file_by_$el(this)]);
                        user_log('OFFLINE_HOVERBAR_SAVEAS');
                    },
                //删除
                    remove = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        me._toolbar_handler.batch_remove([me.get_file_by_$el(this)]);
                        user_log('OFFLINE_HOVERBAR_DELETE');
                    },
                //点击文件、文件
                    click_file_event = function (e) {
                        e.preventDefault();

                        if (!is_enter_event(e) || !ie_click_hacker.is_click_event(e)) {
                            return;
                        }

                        var node = me.get_file_by_$el(this);
                        enter_file(node, e);

                        user_log('OFFLINE_ITEM_CLICK');//item点击上报
                    },
                //点击下载
                    down_file_event = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        var node = me.get_file_by_$el(this);
                        download_file(node, e);

                        // 修复IE下「下载」按钮点击后样式保持在按下状态的bug
                        $(e.target).toggle().toggle();
                        user_log('OFFLINE_HOVERBAR_DOWNLOAD');
                    };


                $all_list
                    // 各种打开
                    .on('click.file_list', '[data-action="enter"]', click_file_event)
                    // 下载
                    .on('click.file_list', '[data-action=download]', down_file_event)
                    // 另存为
                    .on('click.file_list', '[data-action=saveas]', save_as)
                    // 删除
                    .on('click.file_list', '[data-action=remove]', remove)
                    // 勾选
                    .on('click.file_list_ck', '[data-file-check]', select_file_event);
            }
        }
    });

    $.extend(ui_offline,{
        /**
         * 禁用框选
         */
        disable_selection: function () {
            if(this.sel_box){
                this.sel_box.disable();
            }
        },
        /**
         * 启用框选
         */
        enable_selection: function () {
            if(this.sel_box){
                this.sel_box.enable();
            }
        },
        /**
         * 勾选状态改变时，更新工具条特征
         */
        on_seleted_change: function(){
            if(  Store.get_total_length() > 0 && Select.get_selected_length() === Store.get_total_length() ){
                all_checker.toggle_check(true);//全选
            }   else {
                all_checker.toggle_check(false);//取消全选
            }
            this.update_offline_tbar( this.get_selected_files() );

            this._block_hoverbar_if(this.get_selected_files().length);
        },
        /**
         * 在列表后方追加元素
         * @param {Array<FileNode>} files
         */
        append_$items: function (files) {
            if (files.length) {
                $all_list.append(tmpl.file_item_offline({  files: files, icon_map: this.get_icon_map() }));
                this.trigger('add_$items', files);
            }
        },
        /**
         * 重新添加数据
         * @param files
         */
        set_$items: function (files) {
            this._clear_$items();
            this.append_$items(files);
        },
        /**
         * 下载 （目前仅支持单个文件下载）
         * @param nodes
         */
        download: function (nodes) {
            if (!downloader || !nodes.length) {
                return;
            }
            var node = nodes[0],
                down_url = this._get_down_url(node, false);

            downloader.down_url(down_url, node.get_name(), node.get_size());
        },
        /**
         * 批量另存为
         * @param files
         */
        save_as: function (files) {
            chose_directory_event.trigger('show_dialog', files);
        },
        /**
         * 删除文件
         * @param {FileNode} files
         * @private
         */
        remove_file: function (files) {
            return remove.remove_confirm(files, '', true, 'offline',
                {'pdir_key': cur_node.get_id()},
                function (file_name, del_length, thing) {
                    var tmp = del_length > 1 ? '等文件' : '',
                        down_msg = '',
                        up_msg = _(l_remove , del_length > 1 ? '确定删除这些文件吗？' : '确定删除这个文件吗？');
                    $.each(files, function (i, item) {
                        if (item.get_down_type() === 1) {
                            down_msg = '<span class="ui-title" style="font-size:12px;">'+_(l_key,"如果对方未接收，删除会导致对方接收失败")+'</span>';
                            return false;
                        }
                    });

                    return {
                        title: _(l_key,'确认删除'),
                        up_msg: up_msg,
                        down_msg: down_msg,
                        escape_html: false
                    };
                }
            );
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
                remove_id_map = {};
            if (file_nodes.length === 1) {
                remove_id_map[file_nodes[0].get_id()] = 1;
                var $dom = me.get_$item(file_nodes[0].get_id());

                $dom.animate(view_switch.is_list_view() ? {height: 1} : {width: 1}, {complete: function () {
                    $dom.remove();//dom删除
                }});
            } else {
                $.each(file_nodes, function (i, item) {
                    remove_id_map[item.get_id()] = 1;
                    var $dom = me.get_$item(item.get_id());
                    $dom.remove();//dom删除
                });
            }
            Store.remove_files(remove_id_map);
            Select.remove(remove_id_map);
            var files = Store.get_show_nodes(file_nodes.length);//追加节点
            if (files && files.length) {
                this.append_$items(files);
            }

            all_checker.toggle_check(false);//取消全选

            this.trigger('remove_$items');
            this._update_list_view_status();

        },
        /**
         * 获取图片预览地址
         * @param node
         * @param size 图片大小
         */
        _get_image_preview_url: function (node, size) {
            var $img = this.get_$item(node.get_id()).find('img'),
                ret;
            if ($img && $img[0]) {
                ret = $img[0].src.replace(/&size=\d*\*\d*/, '') + '&size=' + (size ? (size + '*' + size) : '1024*1024');
            } else {
                ret = this._get_down_url(node, true);
            }
            return ret;
        },
        /**
         * 预览图片
         * @param node
         */
        preview_image: function (node) {
            require.async(['image_preview'], function (image_preview_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    images = $.grep(node.get_parent().get_kid_files(), function (file) {// 当前目录下的图片
                        return file.is_image();
                    }),
                    index = $.inArray(node, images);// 当前图片所在的索引位置
                image_preview.start({
                    support_nav: true,
                    total: images.length,
                    index: index,
                    get_url: function (index, options) {
                        var file,
                            has_image = false;
                        for (var i = index + 1; i < options.total; i++) {
                            file = images[i];
                            if (file && file.is_image()) {
                                has_image = true;
                            }
                        }
                        file = images[index];
                        if (file && file.is_image() && file.is_on_tree()) {
                            return ui_offline._get_image_preview_url(file,1024);
                        }
                    },
                    download: function (index) {
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            var raw_url = ui_offline._get_down_url(file, false);
                            downloader.down_url(raw_url, file.get_name(), file.get_size());
                        }
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        if (file && file.is_on_tree()) {
                            var remover = ui_offline.remove_file([file]);
                            remover.on('has_ok', function (removed_file_ids) {
                                images.splice(index, 1);
                                callback();
                            });
                        } else {
                            callback();
                        }
                    }
                });
            });
        },
        // ====== 私有成员 =====================================================================
        /**
         * 清除当前目录下的所有文件DOM
         * @param {Boolean} [silent] 静默，默认false
         * @private
         */
        _clear_$items: function (silent) {

            if ($all_list)
                $all_list.empty();

            if (!silent) {
                this.trigger('clear_$items');
                this._update_list_view_status();
            }
        },
        /**
         * 用户点击工具栏的处理函数
         * @private
         */
        _toolbar_handler: {
            /**
             * 批量删除
             * @param {Array} [files]
             */
            batch_remove: function (files) {
                var me = ui_offline;
                me.remove_file(files || me.get_selected_files());
            },

            /**
             * 批量另存为
             */
            batch_save_as: function () {
                var me = ui_offline;
                me.save_as(me.get_selected_files());
            },
            /**
             * 刷新
             */
            refresh: function(){
                ui_offline._clear_$items();
                $empty_tip && $empty_tip.hide();
                Select.remove_all();
                Store.render( cur_node , true );
            }
        },
        /**
         * 获取数据分页大小
         * @returns {number}
         * @private
         */
        _get_page_size: function () {
            if (!page_helper) {
                page_helper = new PagingHelper({
                    scroller: scroller
                });
            }

            var is_thumb = view_switch.is_grid_view();
            page_helper.set_item_width(is_thumb ? 120 : 0);    // 缩略图模式文件宽度为136，其他模式宽度为0(自动)
            page_helper.set_item_height(is_thumb ? 120 : 47); // 缩略图模式文件高度为136，其他模式高度为100+
            page_helper.set_is_list(!is_thumb);

            var size = Math.max(page_helper.get_line_size() * page_helper.get_line_count(true), 10); // 最少10个
            return size;
        },
        /**
         * 没有数据时，修复为空提示的高度
         * @returns {*}
         * @private
         */
        _fix_empty_height: function () {
            return scroller.get_height();
        },
        /**
         * 窗口外观改变的监听函数集合
         */
        _window_change: {
            after: {//窗口属性改变后
                empty_tip: functional.throttle(function () {
                    setTimeout(function () {
                        var t_height = ui_offline._fix_empty_height();
                        if (Store.is_empty()) {
                            $empty_tip.animate({height: t_height});
                        } else {
                            $empty_tip.css({height: t_height});
                        }
                    }, 50);
                }, 50),
                table_list: function () {
                    // 判断滚动高度
                    if (!Store.is_all_show() && scroller.is_reach_bottom()) {
                        var files = Store.get_show_nodes(ui_offline._get_page_size());
                        if (files && files.length) {
                            if (all_checker.is_checked()) {
                                $.each(files, function () {
                                    this.get_ui().set_selected(true);
                                    Select.select(this.get_id());
                                });
                            }
                            ui_offline.append_$items(files);
                        }
                    }
                }
            }
        },
        /**
         * 启动监听滚动
         * @private
         */
        _start_listen_scroll: function () {
            if (!scroll_listening) {
                this.listenTo(scroller, 'resize', function (e) {
                    var fns = this._window_change.after;
                    for (var key in fns) {
                        fns[key].call();
                    }
                });
                this.listenTo(scroller, 'scroll', function (e) {
                    this._window_change.after.table_list();
                });
                scroll_listening = true;
            }
        },
        /**
         * 终止监听滚动
         * @private
         */
        _stop_listen_scroll: function () {
            if (scroll_listening) {
                this.stopListening(scroller, 'resize scroll');
                scroll_listening = false;
            }
        },
        /**
         * 获取文件的下载地址
         * @param {FileNode} node
         * @param {Boolean} [is_preview]
         * @param {int} [down_type]
         * @returns {*}
         * @private
         */
        _get_down_url: function (node, is_preview, down_type) {
            var down_name = downloader.get_down_name(node.get_name()),
                uin = query_user.get_uin(),
                skey = query_user.get_skey();

            var header = {
                    cmd: 'download_virtual_file',
                    appid: constants.APPID,
                    proto_ver: 20130708,
                    token: security.getAntiCSRFToken(),
                    uin: uin
                },
                body = {
                    file_owner: uin,
                    owner_type: node.get_down_type(),//离线文件 请求下载的类型：1表示下载发送的文件，2表示下载接收的文件
                    pdir_key: cur_node.get_id(),
                    file_id: node.get_id(),
                    file_name: encodeURIComponent(down_name),
                    abstract: (down_type || 0)//下载类型0:普通下载，1:缩略图下载，2:文档预览下载
                },
                params = {
                    data: {
                        req_header: header,
                        req_body: body
                    }
                };

                //这里简单判断是否是appbox，因为appbox有历史遗留问题，download接口支持不了cookie，uin和skey得带在url里面，by jkb
                if(constants.IS_APPBOX){
                    params.uin = uin;
                    params.skey = skey;
                }

                //打击盜链，by jkb
                var user = query_user.get_cached_user();
                params.checksum = user ? user.get_checksum() : '';

            // 预览时
            if (is_preview) {
                body.size = '640*640';
            }
            else {
                params.err_callback = constants.DOMAIN + '/web/callback/iframe_disk_down_fail.html';
            }
            return urls.make_url(cst_url_cgi, params);
        },
        /**
         * 另存为对象
         * @private
         */
        _save_as: {
            /**
             * 单个另存为
             * @param node
             * @param chose_pid
             * @param chose_id
             * @param index
             * @private
             */
            _handler: function (node, chose_pid, chose_id, index) {
                progress.show(text.format(this._msg, [index]));
                request.get({
                    'url': cst_url_cgi,
                    'cmd': 'copy_from_other_bid',
                    'body': {
                        'pdir_key': node.get_pid(),
                        'src_uin': node.get_uin(),
                        'src_fullpath': node.get_id(),
                        'src_appid': constants.OFFLINE_SRC_APPID,
                        'dst_ppdir_key': chose_pid,
                        'dst_pdir_key': chose_id,
                        'dst_filename': node.get_name()
                    }

                }).
                    ok(function () {
                        ui_offline._save_as._ok_length += 1;
                        var target_node = all_file_map.get(chose_id);
                        // 标记目标节点为脏的
                        if (target_node) {
                            target_node.set_dirty(true);
                        }
                    }).fail(function (msg, ret) {
                        var me = ui_offline._save_as;
                        me._er_length += 1;
                        if (!me._err_info) {//只存第一条错误信息
                            me._err_info = {
                                msg: msg,
                                ret: ret
                            };
                        }
                    }).done(function () {
                        var me = ui_offline._save_as,
                            cache = me._cache;
                        if (cache.length > 0) {
                            setTimeout(function () {
                                me._handler(cache.pop(), chose_pid, chose_id, (index + 1));
                            }, 10);
                        } else {
                            progress.hide();
                            if (me._ok_length) {

                                if (me._er_length) {
                                    mini_tip.warn(text.format(_(l_key,'{0}个文件成功另存到微云，{1}个文件另存失败'),[me._ok_length,me._er_length]));
                                    //mini_tip.warn(me._ok_length + '个文件成功另存到微云，' + me._er_length + '个文件另存失败');
                                } else {
                                    mini_tip.warn(text.format(_(l_key,'{0}个文件成功另存到微云'),[me._ok_length]));
                                    //mini_tip.ok(me._ok_length + '个文件成功另存到微云');
                                }
                            } else {
                                file_list.trigger('error', me._err_info.msg, me._err_info.ret);
                            }
                        }
                    });
            },
            /**
             * 批量另存为
             * @param files 待处理的离线文件
             * @param chose_pid 另存为的目录pid
             * @param chose_id 另存为的目录id
             * @private
             */
            batch_save_as: function (files, chose_pid, chose_id) {
                var me = this;
                me._save_as._cache = files;
                me._save_as._er_length = me._save_as._ok_length = 0;
                me._err_info = {};
                me._save_as._msg = text.format(_(l_key,'正在另存为{0}/{1}第个文件'),{1:files.length});
                //me._save_as._msg = '正在另存为{0}/' + files.length + '第个文件';
                me._save_as._handler(me._save_as._cache.pop(), chose_pid, chose_id, 1);
            }
        },
        /**
         * 显示空提示
         * @private
         */
        _show_empty: function () {
            $empty_tip.height(ui_offline._fix_empty_height()).show();
        },
        /**
         * 更新列表显示状态（是否显示空提示）
         * @private
         */
        _update_list_view_status: function () {
            if (!cur_node || !cur_node.get_kid_files() || cur_node.get_kid_files().length === 0) {
                this._show_empty();
                user_log('OFFLINE_EMPTY_FILES');
            } else {
                $empty_tip.hide();
                user_log('OFFLINE_HAS_FILES');
            }
        },
        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                disk_ui.get_$body().addClass('block-hover');
            } else {
                disk_ui.get_$body().removeClass('block-hover');
            }
        }

    });

    return ui_offline;
});/**
 * 虚拟目录UI逻辑
 * @author jameszuo
 * @date 13-6-28
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define.pack("./file_list.ui_virtual",["lib","common","$","./tmpl","./view_switch.view_switch","./file_list.ui_abstract","./file.file_node","./file.utils.all_file_map","./file_list.file_list","./file_list.ui","./ui","./toolbar.tbar","./file_path.all_checker","main","i18n","./file_list.file_processor.vir_remove.vir_remove","./file_list.thumb.thumb"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

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
        request = common.get('./request'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        PagingHelper = common.get('./ui.paging_helper'),

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

        main_ui = require('main').get('./ui'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.ui_virtual',
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
            _$list_to.append(tmpl.vir_dir_file_list({ empty_text: _(l_key,'没有了') }));

            $list_to = _$list_to;

            $body = $(doc.body);

            require.async('downloader', function (mod) {
                downloader = mod.get('./downloader');
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
            
            this._init_$doms();

            // 目前只有包含图片或视频的目录需要使用缩略图模式
            var is_thumb = node.has_image() || node.has_video();
            is_thumb ? view_switch.temp_to_thumb() : view_switch.temp_to_list();
        },

        // 退出指定的目录
        exit_dir: function (new_node, last_node) {
            if (cur_node !== new_node) {
                this._clear_$items(true);

                if (thumb)
                    thumb.clear_queue();

                // 加载更多按钮
                this._update_pager();

                // 隐藏空提示
                $cur_empty_tip.hide();

                // 退出临时UI
                view_switch.exit_temp_view();
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

            // 一些class
            $body.toggleClass('app-chat', cur_node.has_text() || cur_node.has_voice()).toggleClass('app-blog', cur_node.has_article());

            // 渲染打开行为
            this._render_enter();
            // 删除
            this._render_remove();
            // IE6 fix
            this._render_ie6();

            $cur_view && $cur_view.show();
            $sub_view && $sub_view.show();

            if (all_checker) {
                // 隐藏全选
                all_checker.hide();
            }

            // 更新列表高度
            file_list_ui.frame_height_changed();

            view_switch.set_namespace('ui_virtual');

            this.trigger('show');

            ui_visible = true;
        },

        hide: function () {
            if ($sub_view) {
                $sub_view.hide();
            }

            $cur_view && $cur_view.hide();
            $sub_view && $sub_view.hide();
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
        
        _init_$doms: function () {
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
        },

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
                                me.appbox_preview(node,me._get_down_url).fail(function () { // @see ui_virtual.js
                                    me.preview_doc(node);                   // @see ui_virtual.js
                                });
                                user_log('ITEM_CLICK_DOC_PREVIEW');
                                return;
                            }

                            // 如果是图片，则执行预览操作
                            if (node.is_image()) {
                                me.appbox_preview(node,me._get_down_url).fail(function () {
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

                    $(this).text(_(l_key,(expand ? '点击收起' : '点击展开'))).attr('data-action', expand ? 'text-collapse' : 'text-expand');
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
            /*$all_list
                .off('mouseenter mouseleave', '[data-file-id]')
                .on('mouseenter', '[data-file-id]', function (e) {
                    $(this).addClass('hover');
                })
                .on('mouseleave', '[data-file-id]', function (e) {
                    $(this).removeClass('hover');
                });*/
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
                                //msg: '您还没有安装flash播放器，请点击<a href="http://www.adobe.com/go/getflash" target="_blank">这里</a>安装',
                                msg: text.format(
                                    _(l_key,'您还没有安装flash播放器，请点击{0}这里{1}安装'),
                                    ['<a href="http://www.adobe.com/go/getflash" target="_blank">','</a>']
                                ),
                                button_text: _(l_key,'确定')
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
                    scroller: main_ui.get_scroller()
                });
            }

            var is_thumb = this.is_thumb_view(node);

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
            $cur_pager.html(_(l_key,(loading ? '加载中...' : '加载更多')));
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
                    ArticleNode: _(l_key,'文章'),
                    VoiceNode: _(l_key,'消息'),
                    PlaintextNode: _(l_key,'消息')
                },
                thing = thing_map[node.class_name] || _(l_key,(node.is_dir() ? '文件夹' : '文件')),
                ok_callback = function () {
                    mini_tip.ok(_(l_key,'删除成功'));
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
                $cur_dir_list.css('display', has_dirs ? '':'none');
                $cur_file_list.css('display', has_files ? '':'none');

                // 如果无文件和目录,则显示空提示
                if (show_empty_tip) {
                    var has_data = has_files || has_dirs;
                    $cur_empty_tip.toggle(!has_data).text(text.format(_(l_key,'您还没有保存任何{0}内容'),[cur_node.get_name()]));
                    //$cur_empty_tip.toggle(!has_data).text('您还没有保存任何' + cur_node.get_name() + '内容');
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
         *
         * !! 在 ui_virtual.tmpl.html 中有调用
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

        undef;


    var all_checker = {
        $el: null,
        rendered: false,
        default_event: 'toggle_check',
        cur_checked: false,  // 当前勾选状态        default_event: 'toggle_check',
        change_event: '',
        /**
         * 设置当前响应事件
         * @param event
         */
        set_change_event: function(event){
            this.change_event = event;
        },
        render: function ($to) {
            if (this.rendered) {
                return;
            }

            var me = this, $el;
            // 点击全选、取消全选
            if (constants.IS_PHP_OUTPUT) {
                $el = $('#_disk_all_checker');
            } else {
                $el = $(tmpl.all_checker());
                $el.prependTo($to.children(':first'));
            }
            me.$el = $el;

            $el.on('click', function (e) {
                e.preventDefault();

                var to_check = !me.cur_checked;

                me.toggle_check(to_check);

				me.trigger(me.change_event || me.default_event, to_check); // 这句不要移入 toggle_check() 方法中，那样会导致循环触发事件 james
            });

            me.rendered = true;
            me.render = $.noop;
        },

        /**
         * 设置全选按钮状态
         * @param {Boolean} to_check
         */
        toggle_check: function (to_check) {
            var me = this;
            if (!me.rendered) {
                return;
            }
            // 如果状态不变，则退出
            if (to_check === me.cur_checked) {
                return;
            }

            me.$el.toggleClass('checkalled', to_check);
            me.cur_checked = to_check;
        },

        is_checked: function () {
            return this.cur_checked;
        },

        hide: function () {
            this._toggle(false);
        },

        show: function () {
            this._toggle(true);
        },

        _toggle: function (visible) {
            if (this.rendered) {
                this.$el.parent().toggleClass('step-uncheck', !visible);
            }
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
         * @param {FileNode} last_lv_node 最后一级目录
         * @param {Boolean} enable 默认true
         */
        update: function (last_lv_node, enable) {
            enable = enable !== false;

            if (last_lv_node === cur_node && enable === last_enable) {
                return;
            }

            if (last_lv_node) {

                var nodes = [],
                    node = last_lv_node;

                while ((node.get_parent() && !node.get_parent().is_super()) && (node = node.get_parent())) { // 不包括super节点
                    nodes.push(node);
                }
                nodes.reverse();
                nodes.push(last_lv_node);

                cur_node = last_lv_node;
                last_enable = enable;

                this.ui.update_$nodes(last_lv_node, nodes, enable);
            }
        },

        toggle: function (visible) {
            this.ui.toggle(visible);
        }
    });

    return file_path;
});/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define.pack("./file_path.ui",["lib","common","$","main","./tmpl","./file_path.file_path","./file_list.file_list","./file_path.all_checker"],function (require, exports, module) {
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

        main = require('main').get('./main'),
        tmpl = require('./tmpl'),

        file_path,
        file_list,

        cur_node,
        visible,

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
            var $el;
            if (constants.IS_PHP_OUTPUT) {
                $el = $('#_disk_file_path');
            } else {
                $el = $(tmpl.file_path()).appendTo($to);
            }
            this._$el = $el;
            this._$inner = $el.find('[data-inner]');

            // 全选
            var all_checker = require('./file_path.all_checker');
            all_checker.render($el);

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
         * @param {FileNode} last_lv_node 目标目录
         * @param {FileNode[]} nodes 目录路径
         * @param {Boolean} [enable] 是否可点击，默认true
         */
        update_$nodes: function (last_lv_node, nodes, enable) {
            cur_node = last_lv_node;

            var me = this,
                $inner = me._$inner;
            var $paths = $(tmpl['file_path_items']({ target_node: last_lv_node, nodes: nodes, enable: !!enable }));
            $inner.empty().append($paths);
            // me._$inner = $paths;

            // 丢放（不能丢放到所在目录）（james：已知问题是，拖拽时，滚动页面，会导致目录路径的丢放焦点错位）
            var $droppable_nodes = $inner.find('[data-file-id][data-cur-node!=true]');
            require.async('jquery_ui', function () {
                if ($droppable_nodes.parent()[0]) {
                    $droppable_nodes.droppable(droppable_options);
                }
            });

            me._fix_some();
        },

        toggle: function (v) {
            visible = v;
            if (!visible)
                this._release_dom();
        },

        _release_dom: function () {
            var me = this;
            if (me._$inner) {
                me._$inner.empty();
            }
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
        },

        toggle_$path: function(visible) {
            this._$inner && this._$inner[visible ? 'show': 'hide']();
        },

        get_$path_warp: function() {
            return this._$el.children(':first');
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
define.pack("./toolbar.tbar",["lib","common","$","./tmpl","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('disk/tbar'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
    // ButtonGroup = common.get('./ui.toolbar.button_group'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.tbar',

        toolbar,
        status_map = {},
        nil = _(l_key,'请选择文件'),

        undef;


    return new Module('disk_tbar', {

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
                    // ====== 普通网盘工具栏按钮 ===================================
                    // 下载
                    new Button({
                        id: 'pack_down',
                        label: _(l_key,'下载'),
                        cls: 'btn-down',
                        icon: 'ico-down',
                        filter: 'normal',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_DOWN');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.get_count() > constants.PACKAGE_DOWNLOAD_LIMIT) {
                                return text.format(_(l_key,'打包下载一次最多支持{0}个文件'),[constants.PACKAGE_DOWNLOAD_LIMIT]);
                                //return '打包下载一次最多支持' + constants.PACKAGE_DOWNLOAD_LIMIT + '个文件';
                            } else if (status.has_no_down()) {
                                if (status.has_broken()) {
                                    return _(l_key,'不能下载破损的文件');
                                } else {
                                    return _(l_key,'部分文件不可下载');
                                }
                            }
                        }
                    }),
                    // 分享
                    new Button({
                        id: 'share',
                        label: _(l_key,'分享'),
                        cls: 'btn-share',
                        icon: 'ico-share',
                        filter: 'normal',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_SHARE');
                        },
                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.get_count() > constants.LINK_SHARE_LIMIT) {
                                return text.format(_(l_key,'链接分享一次最多支持{0}个文件'),[constants.LINK_SHARE_LIMIT]);
                                //return '链接分享一次最多支持' + constants.LINK_SHARE_LIMIT + '个文件';
                            } else if (status.has_broken()) {
                                return _(l_key,'不能分享破损的文件');
                            } else if (status.has_empty_file()) {
                                return _(l_key,'不能分享空的文件');
                            }
                        }
                    }),
                    // 移动
                    new Button({
                        id: 'move',
                        label: _(l_key,'移动到'),
                        cls: 'btn-move',
                        icon: 'ico-move',
                        filter: 'normal',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_MOVE');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.has_no_move()) {
                                if (status.has_broken()) {
                                    return _(l_key,'不能移动破损文件');
                                } else if (status.has_qq_disk()) {
                                    return _(l_key,'不能移动QQ硬盘目录');
                                } else {
                                    return _(l_key,'部分文件不可移动');
                                }
                            }
                        }
                    }),
                    /*  todo 国际版不需要这个重命名button
                    // 重命名
                    new Button({
                        id: 'rename',
                        label: _(l_key,'重命名'),
                        cls: 'btn-rename',
                        icon: 'ico-rename',
                        filter: 'normal',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_RENAME');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.get_count() > 1) {
                                return _(l_key,'只能对单个文件（夹）重命名');
                            } else {
                                if (status.has_no_rename()) {
                                    if (status.has_broken()) {
                                        return _(l_key,'不能对破损文件进行重命名');
                                    } else {
                                        return _(l_key,'部分文件不可重命名');
                                    }
                                }
                            }
                        }
                    }),
                    */
                    // 删除
                    new Button({
                        id: 'del',
                        label: _(l_key,'删除'),
                        cls: 'btn-del',
                        icon: 'ico-del',
                        filter: 'normal',
                        handler: default_handler,
                        before_handler: function () {
                            user_log('DISK_TBAR_DEL');
                        },

                        validate: function () {
                            var status = me.get_status(this.get_filter());

                            if (status.get_count() === 0) {
                                return nil;
                            } else if (status.has_no_del()) {
                                if (status.has_net_fav()) {
                                    return _(l_key,'不能删除网络收藏夹目录');
                                } else if (status.has_qq_disk()) {
                                    return _(l_key,'不能删除QQ硬盘目录');
                                } else {
                                    return _(l_key,'部分文件不可删除');
                                }
                            }
                        }
                    }),
                    // 新建文件夹
                    new Button({
                        id: 'mkdir',
                        label: _(l_key,'新建文件夹'),
                        cls: 'btn-mkdir',
                        icon: 'ico-mkdir',
                        filter: 'normal',
                        handler: default_handler
                    }),
                    //刷新按钮
                    new Button({
                        id: 'refresh',
                        //label: _(l_key,'刷新'),
                        btn_cls: 'btn-notext',
                        cls: 'btn-ref',
                        icon: 'ico-ref',
                        filter: 'normal',
                        handler: default_handler
                    }),

                    // ====== 离线文件 ============================================
                    // 删除
                    new Button({
                        id: 'offline_remove',
                        label: _(l_key,'删除'),
                        cls: 'btn-del',
                        icon: 'ico-del',
                        filter: 'offline',
                        handler: default_handler,
                        validate: function () {
                            var status = me.get_status(this.get_filter());
                            if (status.get_count() === 0) {
                                return nil;
                            }
                        }
                    }),
                    // 另存为
                    new Button({
                        id: 'offline_save_as',
                        label: _(l_key,'另存为'),
                        cls: 'btn-saveas',
                        icon: 'ico-saveas',
                        filter: 'offline',
                        handler: default_handler,
                        validate: function () {
                            var status = me.get_status(this.get_filter());
                            if (status.get_count() === 0) {
                                return nil;
                            }
                        }
                    }),
                    // 刷新
                    new Button({
                        id: 'offline_refresh',
                        //label: _(l_key,'刷新'),
                        btn_cls: 'btn-notext',
                        cls: 'btn-ref',
                        icon: 'ico-ref',
                        filter: 'offline',
                        handler: default_handler
                    })
                ];


            toolbar = new Toolbar({
                cls: 'disk-toolbar',
                apply_to: '#_disk_default_toolbar',
                btns: btns,
                filter_visible: true
            });
            toolbar.render($to);
        },

        /**
         * 更新工具栏状态
         * @param {String} filter
         * @param {Status} status
         */
        set_status: function (filter, status) {
            status_map[filter] = status;
        },

        get_status: function (filter) {
            return status_map[filter];
        },

        get_$el: function () {
            return toolbar.get_$el();
        },
        /**
         *
         * @param disable 禁用与否
         */
        //set_disable: function(disable){
        //    this._disable = disable;
        //},

        toggle_toolbar: function(filter) {
            if(this._disable){
                return;
            }
            toolbar.filter(filter);
        }
    });
});/**
 * 网盘主体UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./ui",["lib","common","$","./tmpl","./toolbar.tbar","main","./disk","./view_switch.view_switch","./file_list.file_list","./file_list.ui","./file_path.file_path"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

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
        upload_event = common.get('./global.global_event').namespace('upload2'),
        page_event = common.get('./global.global_event').namespace('page'),
//        disk_event = common.get('./global.global_event').namespace('disk'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),
        tbar = require('./toolbar.tbar'),

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),


        disk,
        view_switch,
        file_list,
        file_list_ui,
        file_path,

        undefined;


    var ui = new Module('disk_ui', {

        render: function () {
            disk = require('./disk');

            // 切换视图
            view_switch = require('./view_switch.view_switch');
            file_list = require('./file_list.file_list');
            file_list_ui = require('./file_list.ui');
            file_path = require('./file_path.file_path');

            this
                // 切换视图时更新UI
                .listenTo(view_switch, 'switch sidebar_view_change', function () {
                    this._update_view();
                })

                .listenTo(query_user, 'error', function (msg) {
                    mini_tip.error(msg);
                });
//
//                .listenTo(query_user, 'done', function (msg) {
//                    main_ui.sync_size();
//                });


            this
                .on('activate', function () {
                    this._update_view();
                    this.get_$body().show();

                    //document.title = '微云';
                })

                .on('deactivate', function () {
                    this.get_$body().hide();
                    this.toggle_toolbar(constants.DISK_TOOLBAR.HIDE);
                });

        },

        _update_view: function () {
            var $body = this.get_$body();

            $body.toggleClass('ui-thumbview', view_switch.is_grid_view())
                .toggleClass('ui-listview', view_switch.is_list_view());

            // 修复 bug #48664938 webkit没有重绘 // james与11.25取消这段代码的注释：切换树的显示、隐藏状态后，appbox里没有重绘
//            this._fix_wk_layout();
        },

        // --- 获取一些DOM元素 ---------

        get_$body: function () {
            this.init_$doms();
            return this._$body;
        },

        init_$doms: function () {
            if (!this._$body) {
                if (constants.IS_PHP_OUTPUT) {
                    this._$body = $('#_disk_body');
                } else {
                    this._$body = $(tmpl['body']({ module: this })).appendTo(main_ui.get_$body_box());
                }
            }
        },

        get_$view: function () {
            this.init_$doms();
            return $('#_disk_view');
        },

        get_$toolbar: function () {
            this.init_$doms();
            return $('#_disk_toolbar_container');
        },

        get_$view: function () {
            this.init_$doms();
            return $('#_disk_view');
        },

        /**
         * 控制网盘toolbar的如果显示逻辑
         * @param type
         */
        last_tbar_type: null,
        toggle_toolbar: function (type) {
            if (type === this.last_tbar_type) {
                return;
            }
            this.last_tbar_type = type;
            var normal, offline;
            switch (type) {
                case(constants.DISK_TOOLBAR.NORMAL):
                    normal = true;
                    offline = false;
                    break;
                case(constants.DISK_TOOLBAR.HIDE):
                    normal = false;
                    offline = false;
                    break;
                case(constants.DISK_TOOLBAR.VIRTUAL_SHOW):
                    normal = false;
                    offline = true;
                    break;
            }
            if (normal) {
                tbar.toggle_toolbar('normal');
            } else if(offline) {
                tbar.toggle_toolbar('offline');
            } else {
                tbar.toggle_toolbar(null);
            }

            if (disk) {
                disk.trigger('resize');
            }
        },

        set_is_empty: function (empty) {
            this.get_$body().toggleClass('ui-view-empty', empty);
        },

        get_$sidebar: function (no_construct) {
            var $bar = $('#_disk_sidebar');
            if (!no_construct && !$bar[0]) {
                $bar = $('<div id="_disk_sidebar" class="dbview-nav"></div>');
                main_ui.get_$body_box().after($bar);
            }
            return $bar;
        },

        toggle_sidebar: function (visible) {
            this.get_$sidebar().css('display', visible ? '' : 'none'); // 避免覆盖css中的设置- james
            main_ui.get_$main_content().toggleClass('dbview-module', visible);
            this._fix_wk_layout();
        },

        // 强制webkit重绘
        _fix_wk_layout: $.browser.webkit && $.browser.version < '30' ? function () {
            this.get_$body().toggle().toggle();
        } : $.noop
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
                        upload_event.trigger('start_upload_from_client', files, true);
                    });

                    user_log('upload_from_QQClient', undefined, undefined, {
                        os_type: constants.OS_TYPES.QQ
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

            //code by bondli 先把网盘列表和面包屑隐藏,解决视觉上多次跳转
            main_ui.get_$bar2().css('opacity',0);
            main_ui.get_$main_content().css('opacity',0);

            if (!disk.is_activated()) {
                routers.go({ m: 'disk' });
            }


            file_list.enter_qq_receive(true, function(){
                main_ui.get_$bar2().css('opacity',1);
                main_ui.get_$main_content().css('opacity',1);
            });
            user_log('view_from_QQClient', undefined, undefined, {
                os_type: constants.OS_TYPES.QQ
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
            else {
                main_ui.get_$bar2().css('opacity',1); //直出的时候隐藏了导航，这里给展示出来
                main_ui.get_$main_content().css('opacity',1);
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
 * for 普通网盘文件列表
 * @author jameszuo
 * @date 13-11-12
 */
define.pack("./view_switch.ui",["lib","common","$","i18n","./tmpl","./view_switch.view_switch"],function (require, exports, module) {
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
        PopPanel = common.get('./ui.pop_panel'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.view_switch',
        tmpl = require('./tmpl'),

        classes = {
            newestlist: 'vm-time',
            azlist: 'vm-az',
            grid: 'vm-thum'
        },

        undefined;


    var ui = new Module('disk_view_switch_ui', {

        render: function ($to) {
            if (this._rendered) return;

            var view_switch = require('./view_switch.view_switch'),
                cur_view = view_switch.get_cur_view(),
                $el = this._$el = $(tmpl['view_switch']({
                    cur_view: cur_view,
                    cur_cls: classes[cur_view] //,
                    // is_sidebar_view: view_switch.is_sidebar_view()
                }));

            $el.appendTo($to);


            var $base_btn = $el.children('[data-action="base_btn"]'),
                $list = $el.find('ul'),
                $combine = $base_btn.add($list);

            // hover时显示列表，移出时隐藏
            new PopPanel({
                host_$dom: $combine,
                $dom: $list,
                delay_time: 200
            });

            $el.on('click', function (e) {
                e.preventDefault();
            });

            var class_list = collections.values(classes).join(' ');

            // 点击视图列表中的item
            $el.on('click.view_switch', '[data-view]:not(.selected)', function (e) {

                var $btn = $(this),
                    view_name = $btn.attr('data-view');

                $btn.addClass('focus').siblings().removeClass('focus');
                $base_btn.removeClass(class_list).addClass(classes[view_name]);
                view_switch.set_cur_view(view_name, false);

                $list.hide();
            });

            // 点击切换侧边栏
            var $side_btn = this.$side_btn = $el.find('[data-action="sidebar"]');
            $side_btn.on('click', function () {
                view_switch.set_sidebar_view(!view_switch.is_sidebar_view());
            });

            this.set_sidebar_activated(view_switch.is_sidebar_view());

            // 修复 bug#48663950 chrome下没有显示“缩略图”和“列表”切换图标
            this._fix_chrome();

            this._rendered = 1;
        },

        set_sidebar_activated: function (active) {
            this.$side_btn && this.$side_btn.toggleClass('dbview-focus', active)
                // 修改此处的 wording 时，需要同步修改模板
                .attr('title', _(l_key,(active ? '隐藏' : '查看') + '目录树'));
        },

        toggle: function (visible) {
            this._$el.toggle(visible);
        },

        _fix_chrome: function () {
            if ($.browser.chrome) {
                var i_imgs = [],
                    $i_els = this._$el.find('i');

                $i_els.each(function (i, tag) {
                    i_imgs[i] = $(tag).css('background-image');
                });
                setTimeout(function () {
                    $i_els.each(function (i, tag) {
                        $(tag).css('background-image', i_imgs[i]);
                    });
                }, 1);
            }
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
        query_user = common.get('./query_user'),
        log_event = common.get('./global.global_event').namespace('log'),
        user_log = common.get('./user_log'),

        tmpl = require('./tmpl'),

        view_name_map_value = {
            grid: 1, // 缩略图
//            list: 2,
            azlist: 3, // 按名称排序的列表视图
            newestlist: 4 // 按最后修改时间排序的列表视图
        },
        view_value_map_name = (function () {
            var n, map = {};
            for (n in view_name_map_value) {
                if (view_name_map_value.hasOwnProperty(n)) {
                    map[view_name_map_value[n]] = n;
                }
            }
            return map;
        })(),

        default_view = 'grid',

        store_name = 'view_switch_type',
        sidebar_store_name = 'view_switch_sidebar'/* + uin */,

        cur_view = (function () {
            var view_value = store.get(store_name) || cookie.get(store_name);
            if (view_value && view_value_map_name.hasOwnProperty(view_value)) {
                return view_value_map_name[view_value];
            } else {
                return default_view;
            }
        })(),

        is_sidebar_view,

    // 最后一次使用的非“临时”视图
        last_not_temp_view = cur_view,

        undefined;


    var view_switch = new Module('disk_view_switch', {

        ui: require('./view_switch.ui'),

        _cur_visible : null,
        // 当成功进行切换时，返回true
        toggle_ui: function(visible){
            if(this._cur_visible === visible){
                return false;
            }
            this._cur_visible = visible;
            this.ui.toggle(visible);
            return true;
        },

        render: function () {
            var me = this;
            query_user.on_ready(function (user) {
                is_sidebar_view = !!store.get(sidebar_store_name + user.get_uin());
                me.ui.set_sidebar_activated(is_sidebar_view);
            });
            this._log();
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

        /**
         * 切换视图
         * @param {String} view_name
         * @param {Boolean} [is_temp]
         */
        set_cur_view: function (view_name, is_temp) {
            if (view_name !== cur_view && view_name_map_value.hasOwnProperty(view_name)) {

                cur_view = view_name;

                var is_grid = this.is_grid_view(),
                    is_list = this.is_list_view();

                if (!is_temp) {
                    last_not_temp_view = view_name;

                    // 存储
                    var value = view_name_map_value[view_name];
                    store.set(store_name, value);

                    this._log();
                }

                // 现在不触发全局switch事件了，通过namespace控制事件名，请监听 switch.ui_normal、switch.ui_virtual、switch.ui_offline 事件
                this.trigger('switch', is_grid, is_list, view_name);

                if (this.ns)
                    this.trigger('switch.' + this.ns, is_grid, is_list, view_name, is_temp);
            }
        },

        /**
         * 是否打开了侧边栏
         * @returns {boolean} 是否打开了侧边栏
         */
        is_sidebar_view: function () {
            if (typeof is_sidebar_view === 'boolean') {
                return is_sidebar_view;
            } else {
                var user = query_user.get_cached_user();
                return user ? !!store.get(sidebar_store_name + user.get_uin()) : false;
            }
        },

        /**
         * 切换侧边栏
         * @param {Boolean} active
         * @param {Boolean} [silent] 静默，默认false
         */
        set_sidebar_view: function (active, silent) {
            active = !!active;
            var old = is_sidebar_view;
            is_sidebar_view = active;
            if (!silent && old !== active) {
                this.ui.set_sidebar_activated(active);
                this.trigger('sidebar_view_change', active);

                var user = query_user.get_cached_user();
                if (user) {
                    var store_key = sidebar_store_name + user.get_uin();
                    active ? store.set(store_key, 1) : store.remove(store_key);
                }

                if(active) {
                    user_log('DBVIEWTREE_OPEN');
                } else {
                    user_log('DBVIEWTREE_CLOSE');
                }
            }
        },

        set_namespace: function (ns) {
            this.ns = ns;
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
//disk/src/disk.tmpl.html
//disk/src/file_list/file_processor/move/move.tmpl.html
//disk/src/file_list/offline/offline_columns.tmpl.html
//disk/src/file_list/offline/offline_guide.tmpl.html
//disk/src/file_list/rename/rename.tmpl.html
//disk/src/file_list/selection/selection.tmpl.html
//disk/src/file_list/share/share.APPBOX.tmpl.html
//disk/src/file_list/tree/Tree.tmpl.html
//disk/src/file_list/ui_normal.tmpl.html
//disk/src/file_list/ui_offline.tmpl.html
//disk/src/file_list/ui_virtual.tmpl.html
//disk/src/file_path/all_checker.tmpl.html
//disk/src/file_path/file_path.tmpl.html
//disk/src/view_switch/view_switch.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'body': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_disk_body" class="disk-view ui-view">\r\n\
        <!-- 文件列表 -->\r\n\
    </div>');

return __p.join("");
},

'file_move_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        $ = require('$'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),

        root_dir = data.root_dir,
        _ = require('i18n').get('./pack'),
        l_key = 'disk.move',
        len = data.files.length,
        first = data.files[0];
    __p.push('    <div class="file-mv-cnt">\r\n\
\r\n\
        <div class="_desc file-mv-desc">\r\n\
            <span class="fileimg"><i class="filetype icon-');
_p( first.get_type() );
__p.push('"></i></span>\r\n\
            <div class="fileinfo">\r\n\
                <span class="filename">');
_p( text.text(text.smart_sub(first.get_name(), 17)) );
__p.push('</span>');
 if(len > 1) { __p.push('                    <span class="filesum">');
_p(text.format(_(l_key,'等{0}个文件'),[len]));
__p.push('</span>');
 } __p.push('                <span class="filesize">');
_p(first.get_readability_size());
__p.push('</span>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <div class="ui-line"></div>\r\n\
\r\n\
        <div class="file-mv-body">\r\n\
            <h4 class="ui-title">');
_p((data.oper_name ? data.oper_name : _(l_key,'移动到')));
__p.push('：</h4>\r\n\
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

'offline_columns': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var _ = require('i18n').get('./pack'),
        l_key = 'disk.offline';
    __p.push('    <div class="offline-head" >\r\n\
        <span class="list name"><span class="list-wrap"><span class="list-inner">');
_p(_(l_key,'名称'));
__p.push('        </span></span></span>\r\n\
        <span class="list time"><span class="list-wrap"><span class="list-inner">');
_p(_(l_key,'过期时间'));
__p.push('        </span></span></span>\r\n\
        <span class="list source"><span class="list-wrap"><span class="list-inner">');
_p(_(l_key,'来源'));
__p.push('        </span></span></span>\r\n\
        <span class="list size"><span class="list-wrap"><span class="list-inner">');
_p(_(l_key,'大小'));
__p.push('        </span></span></span>\r\n\
    </div>');

}
return __p.join("");
},

'offline_columns_wrap': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="diff-by-offline"></div>');

}
return __p.join("");
},

'offline_guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

    var _ = require('i18n').get('./pack'),
    l_key = 'disk.offline';
    __p.push('    <div class="offline-guide" style="diplay:none;">\r\n\
        <div class="img"></div>\r\n\
        <a href="#" class="btn" data-id="close">');
_p(_(l_key,'我知道了'));
__p.push('</a>\r\n\
    </div>');

}
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
        constants = common.get('./constants'),
        _ = require('i18n').get('./pack'),
        l_key = 'common.share';
    __p.push('    <div class="ui-confirm-cnt">\r\n\
        <i class="icon-xbox icon-xbox-ok"></i>\r\n\
        <h4 class="ui-title ui-normal">');
_p(_(l_key,'获取下载链接成功！'));
__p.push('</h4>\r\n\
        <div class="ui-text share-info">\r\n\
\r\n\
            <!-- 链接 -->\r\n\
            <a data-function="link" class="ui-bold" href="#" target="_blank">#</a>\r\n\
\r\n\
            <div class="ui-copys">\r\n\
                <!-- 复制 -->\r\n\
                <div data-function="copy" class="ui-copy" style="width:55px;height:18px;">');
_p(_(l_key,'复制链接'));
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

'tree_node': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib'),
            text = lib.get('./text'),
            node = data.node,
            text_name = text.text(node.name),
            children = data.children,
            expanded = node.expanded,
            leaf = node.leaf,
            icon = node.icon;
    __p.push('    <div data-node-id="');
_p(node.id);
__p.push('" data-list="true" class="item ');
_p( expanded ? 'item-open' : '' );
__p.push(' ');
_p( icon );
__p.push('" style="padding-left:');
_p((data.level + 1)*14);
__p.push('px;"><a class="link" href="#"><span class="text ellipsis" title="');
_p(text_name);
__p.push('">');
_p(text_name);
__p.push('</span>');

        if(!leaf){__p.push('<i data-ico="true" class="ico"></i>');
}__p.push('</a></div>\r\n\
    <div class="item-box ');
_p(expanded ? 'itembox-open' : '' );
__p.push('">');
 if(children && children.length){ __p.push('            ');
 for(var i=0; i<children.length; i++){ __p.push('                ');
_p( children[i] );
__p.push('            ');
 } __p.push('        ');
 } __p.push('    </div>');

return __p.join("");
},

'file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var _  = require('i18n').get('./pack'),
        l_key = 'disk.ui_normal_tmpl';
    __p.push('    <!-- 空目录时的提示 -->\r\n\
    <div id="_disk_files_empty" class="g-empty sort-cloud-empty">\r\n\
        <div class="empty-box">\r\n\
            <div class="ico"></div>\r\n\
            <p class="title">');
_p(_(l_key,'暂无文件'));
__p.push('</p>\r\n\
            <p class="content">');
_p(_(l_key,'请点击左上角的“上传”按钮添加'));
__p.push('</p>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 目录 -->\r\n\
    <div class="dirs-view">\r\n\
\r\n\
        <!-- 目录标题（“文件夹”） -->\r\n\
        <div id="_disk_files_dir_title" class="ui-title-bar" style="display:none;">\r\n\
            <h3 class="ui-title">');
_p(_(l_key,'文件夹'));
__p.push('</h3>\r\n\
            <div class="ui-title-line"></div>\r\n\
        </div>\r\n\
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
_p(_(l_key,'文件'));
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

        $ = require('$'),
        text = lib.get('./text'),
        constants = common.get('./constants'),
        file_type_map = common.get('./file.file_type_map'),
        FileObject = common.get('./file.file_object'),

        click_tj = common.get('./configs.click_tj'),

        view_switch = require('./view_switch.view_switch'),

        click_enter_mode = constants.IS_APPBOX,

        p_dir = data.p_dir,
        files = data.files,
        only_content = data.only_content === true,
        show_thumb = data.show_thumb !== false,
        icon_map = data.icon_map,
        line_size = data.line_size,

        // 默认图片
        default_image = constants.RESOURCE_BASE + (view_switch.is_list_view() ? '/img/img-32.png' : '/img/img-70.png'),

        // 日期
        time_str_len = 'yyyy-MM-dd hh:mm'.length,
        _ = require('i18n').get('./pack'),
        l_key = 'disk.tbar',

        files_count = files.length;


    $.each(files, function (i, file) {
        var is_dir = file.is_dir(),
            is_broken = file.is_broken_file(),
            is_image = file.is_image(),
            is_removable = file.is_removable(),
            is_movable = file.is_movable(),
            is_downable = file.is_downable(),
            is_renamable = file.is_renamable(),
            is_selectable = file.is_selectable(),
            /*is_whole_click = true,*/   /*click_enter_mode || p_dir.is_vir_dir() || file.is_vir_dir(),*/
            is_selected = file.get_ui().is_selected(),
            create_time = (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len),

            icon_cls = is_broken ? 'icon-filebroken' : (icon_map[file.get_icon()] || file.get_icon() || (is_image ? 'icon-image' : ('icon-' + (file.get_type() || 'file')))),
            can_ident = !is_dir && file_type_map.can_identify(FileObject.get_ext(file.get_name()));

        /* 行开头 */
        /*if (line_size > 0 && i % line_size === 0) {
            __p.push('            <div class="row clear">');

        }*/

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
/*=is_whole_click ? 'data-whole-click':''*/__p.push('        class="list-wrap ');
_p( [
            is_broken?' ui-broken':'',
            is_removable?'':' ui-no-remove',
            is_movable?'':' ui-no-move',
            is_downable?'':' ui-no-down',
            is_renamable?'':' ui-no-rename',
            is_selectable?'':' ui-no-sel',
            /*is_whole_click?' ui-whole-click':'',*/
            is_selected?' ui-selected':''
        ].join('') );
__p.push('">\r\n\
        <div class="list clear">');

            }
        __p.push('            <label data-file-check class="checkbox"></label>\r\n\
            <span data-action="enter" class="img"><i data-quick-drag data-ico class="filetype ');
_p( icon_cls );
__p.push('"></i></span>\r\n\
            <span data-action="enter" class="name"><p class="text"><em><span data-quick-drag data-name="file_name" title="');
_p(text.text(file.get_name()));
__p.push('">');
_p(text.text(can_ident ? file.get_name_no_ext() : file.get_name()));
__p.push('</span></em></p></span>\r\n\
\r\n\
        <span data-action="enter" class="tool">');
 if (is_removable) { __p.push('                <a data-function="remove" title="');
_p(_(l_key,'删除'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('ITEM_DELETE'));
__p.push('><i class="ico-del"></i></a>');
 } __p.push('            ');
 if (is_renamable) { __p.push('                <a data-function="rename" title="');
_p(_(l_key,'重命名'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('ITEM_RENAME'));
__p.push('><i class="ico-rename"></i></a>');
 } __p.push('            ');
 if (is_movable) { __p.push('                <a data-function="move" title="');
_p(_(l_key,'移动到'));
__p.push('" href="#" hidefocus="on"><i class="ico-move"></i></a>');
 } __p.push('            ');
 if (!file.is_tempcreate() && !is_broken && !file.is_vir_dir()) { __p.push('                <a data-function="share_enter" title="');
_p(_(l_key,'分享'));
__p.push('" ');
_p(click_tj.make_tj_str('ITEM_SHARE'));
__p.push('  href="#" hidefocus="on"><i class="ico-share"></i></a>');
 } __p.push('            ');
 if (is_downable) { __p.push('                <a data-function="download" title="');
_p(_(l_key,'下载'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('ITEM_DOWNLOAD'));
__p.push('><i class="ico-download"></i></a>');
 } __p.push('        </span>\r\n\
\r\n\
            <span data-action="enter" class="size">');
_p( file.get_readability_size() );
__p.push('</span>\r\n\
            <span data-action="enter" class="time">');
_p( create_time );
__p.push('</span>');
 if (!only_content) { __p.push('        </div>\r\n\
    </div>');

        }

        /* 行结尾 */
        /*if (line_size > 0 && ((i>=(line_size-1) && (i+1) % line_size===0) || i === files_count-1)) {
            __p.push('            </div>');

        }*/
    });
    __p.push('');

return __p.join("");
},

'offline_dir_file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var _ = require('i18n').get('./pack'),
    l_key = 'disk.offline';
    __p.push('    <div data-view="offline" class="dirs-view-virtual offline-container" style="display: none;">\r\n\
        <div id="virtual_file_container" data-type="file" class="files"></div>\r\n\
        <div data-action="empty-offline-empty" style="display:none;position: relative;" class="g-empty offline-empty">\r\n\
            <div class="empty-box">\r\n\
                <div class="ico"></div>\r\n\
                <p class="title">');
_p(_(l_key,'暂无离线文件'));
__p.push('</p>\r\n\
                <p class="content">');
_p(_(l_key,'QQ收发的离线文件，在这里查看'));
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'file_item_offline': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.offline',
        l_tbar = 'disk.tbar',
        text = lib.get('./text'),

        constants = common.get('./constants'),
        click_tj = common.get('./configs.click_tj'),
        ui_offline = require('./file_list.ui_offline'),
        click_enter_mode = constants.IS_APPBOX,

        p_dir = data.p_dir,
        files = data.files,
        only_content = data.only_content === true,
        icon_map = data.icon_map,
        // 日期
        time_str_len = 'yyyy-MM-dd hh:mm'.length,

        get_single_time = function(time){
            if(!time || time <= 0 ){
                return ret;
            }
            var ret = Math.ceil( time/86400000 );
            return ret <= 1 ? _(l_key,'即将过期') : (ret+'天');
        };

    $.each(files, function (i, file) {
        var is_image = file.is_image(),
            is_removable = file.is_removable(),
            is_downable = file.is_downable(),
            is_selectable = file.is_selectable(),
            is_selected = file.get_ui().is_selected(),
            is_whole_click = true,   /*click_enter_mode || p_dir.is_vir_dir() || file.is_vir_dir(),*/
            icon_cls =  icon_map[file.get_icon()] || file.get_icon() || (is_image ? 'icon-image' : ('icon-' + (file.get_type() || 'file'))),
            op_class = [
                    is_removable?'':' ui-no-remove',
                    is_downable?'':' ui-no-down',
                    is_selectable?'':' ui-no-sel',
                    is_whole_click?' ui-whole-click':'',
                    is_selected?' ui-selected':''
                ].join(''),
            belong_text = _(l_key,(file.get_down_type() === 2 ? '来自： ' : '发给： ')) + text.text(file.get_nickname()),
            safe_id =  ui_offline.get_html_node_id(file.get_id());

    if (!only_content) {__p.push('    <div id="_disk_vdir_item_');
_p(safe_id);
__p.push('" ');
_p(click_tj.make_tj_str('OFFLINE_CLICK_ITEM'));
__p.push(' data-file-id="');
_p(safe_id);
__p.push('"');
_p(is_removable ? '':'data-no-remove');
__p.push(' ');
_p(is_downable ? '':'data-no-down');
__p.push(' ');
_p(is_whole_click ? 'data-whole-click':'');
__p.push('    class="list clear');
_p(op_class);
__p.push('">');
}__p.push('        <label data-file-check class="checkbox"></label>\r\n\
        <span data-action="enter" class="img"><i data-quick-drag data-ico class="filetype ');
_p( icon_cls );
__p.push('"></i></span>\r\n\
        <span data-action="enter" class="name ellipsis"><p class="text"><em data-quick-drag data-name="file_name">');
_p(text.text(file.get_name()));
__p.push('</em></p></span>\r\n\
        <span data-action="enter" class="tool">\r\n\
            <a data-action="saveas" title="');
_p(_(l_tbar,'另存为'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('OFFLINE_ITEM_SAVEAS'));
__p.push('><i class="ico-saveas"></i></a>');
if(is_removable){__p.push('            <a data-action="remove" title="');
_p(_(l_tbar,'删除'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('OFFLINE_ITEM_DEL'));
__p.push('><i class="ico-del"></i></a>');
}__p.push('            ');
if(is_downable){__p.push('            <a data-action="download" title="');
_p(_(l_tbar,'下载'));
__p.push('" href="#" hidefocus="on" ');
_p(click_tj.make_tj_str('OFFLINE_ITEM_DOWN'));
__p.push('><i class="ico-download"></i></a>');
}__p.push('        </span>\r\n\
        <span data-action="enter" class="time"><span>');
_p(get_single_time(file.get_life_time()));
__p.push('</span></span>\r\n\
        <span data-action="enter" class="source">');
_p(belong_text);
__p.push('</span>\r\n\
        <span data-action="enter" class="size">');
_p(file.get_readability_size() );
__p.push('</span>');
 if (!only_content) { __p.push('    </div>');
 } __p.push('    ');
});__p.push('');

return __p.join("");
},

'vir_dir_file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var _ = require('i18n').get('./pack'),
        l_key = 'disk.ui_virtual';
    __p.push('    ');
/* 虚拟目录的文件视图（如文章、文字等） */__p.push('    <div data-view="special" data-no-selection class="app-inner" style="display: none;">');
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
_p(_(l_key,'加载更多'));
__p.push('</a>\r\n\
        <p data-action="empty-tip" style="display:none;" class="empty-text"></p>\r\n\
    </div>');
/* 虚拟目录的经典视图（如微信、图片视频目录等） */__p.push('    <div data-view="classic" data-no-selection class="dirs-view-virtual" style="display: none;">');
/* 目录 */__p.push('        <div data-type="dir" class="dirs" style="display:none;"></div>');
/* 文件 */__p.push('        <div data-type="file" class="files" style="display:none;"></div>');
/* 加载更多 */__p.push('        <a data-action="more" href="#" class="load-more" style="visibility:hidden">');
_p(_(l_key,'加载更多'));
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

        _ = require('i18n').get('./pack'),
        l_key = 'disk.ui_virtual',
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
_p(_(l_key,'点击展开'));
__p.push('</a></div>');
 } __p.push('                        </div>\r\n\
                        <span class="feed-action"><a data-action="remove" class="icon-rm" href="#" title="');
_p(_(l_key,'删除'));
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
                            <span data-action="play-loading" class="audio-status" style="display:none;">正在载入...</span>\r\n\
                        </div>\r\n\
                        <span class="feed-action"><a data-action="remove" class="icon-rm" href="#" title="');
_p(_(l_key,'删除'));
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
_p(_(l_key,'删除'));
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
                    __p.push('\r\n\
                    <div id="_disk_vdir_item_');
_p(file.get_id());
__p.push('" data-action="enter" data-file-id="');
_p(file.get_id());
__p.push('" class="list-wrap">\r\n\
                        <div class="list clear list-nocheckbox">\r\n\
                            <span class="img"><i data-quick-drag data-ico class="filetype ');
_p( icon_cls );
__p.push('"></i></span>\r\n\
                            <span class="name"><p class="text"><em><span data-quick-drag data-name="file_name">');
_p(text.text(file.get_name()));
__p.push('</span></em></p></span>\r\n\
                            <span class="size">');
_p( file.get_readability_size() );
__p.push('</span>\r\n\
                            <span class="time">');
_p( (file.get_modify_time() || file.get_create_time()).substr(0, time_str_len) );
__p.push('</span>\r\n\
                        </div>\r\n\
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
_p(_(l_key,'来源'));
__p.push('" href="#" hidefocus="on"></a>');
 } else { __p.push('                                        <a class="icon-download" data-action="download" title="');
_p(_(l_key,'下载'));
__p.push('" href="#" hidefocus="on"></a>');
 } __p.push('                                    <a class="icon-del" data-action="remove" title="');
_p(_(l_key,'删除'));
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
        _ = require('i18n').get('./pack'),
        l_key = 'disk.date_time',
        time_values = date_time.readability(data);

    if (time_values[0] === 'today') {
      __p.push('<span class="feed-date">');
_p( _(l_key,time_values[1]) );
__p.push('</span><span class="feed-time">');
_p( time_values[2] );
__p.push('</span>');

    }
    else if (time_values[0] === 'yesterday') {
      __p.push('<span class="feed-date">');
_p( _(l_key,time_values[1]) );
__p.push('</span>');

    }
    else {
      __p.push('<span class="feed-day">');
_p( time_values[1] );
__p.push('</span><span class="feed-month">');
_p( _(l_key,time_values[2]) );
__p.push('</span>');

    }__p.push('');

return __p.join("");
},

'all_checker': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <label data-file-check class="checkall"></label>');

return __p.join("");
},

'file_path': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="inner">\r\n\
        <div class="wrap">\r\n\
            <div data-inner class="main-path">');
/* 内嵌 file_path_items */__p.push('            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'file_path_items': function(data){

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
                name = node.is_root() ? node.get_name():  text.text(text.smart_sub(node.get_name(), name_len));
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

'view_switch': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var lib = require('lib'),
        common = require('common'),
        _ = require('i18n').get('./pack'),
        l_key = 'disk.view_switch',
        click_tj = common.get('./configs.click_tj');
        cur_view = data.cur_view,
        cur_cls = data.cur_cls;
    __p.push('<div data-no-selection class="view-mode-dropdown">\r\n\
    <a data-action="sidebar" class="dbview-btn ');
_p(data.is_sidebar_view ? 'dbview-focus' : '');
__p.push('" title="');
_p( data.is_sidebar_view ? _(l_key,'隐藏目录树') : _(l_key,'查看目录树'));
__p.push('" href="#"></a>\r\n\
    <a data-action="base_btn" data-link="true" class="vm-btn ');
_p(cur_cls);
__p.push('" href="#"><i class="ico"></i></a>\r\n\
    <ul data-dropdown="true" class="view-mode-dropdown-box" style="display:none;">\r\n\
        <li data-view="newestlist" class="');
_p(cur_view === 'newestlist' ? 'focus' : '');
__p.push('" ');
_p(click_tj.make_tj_str('SWITCH_NEWESTLIST_MODE'));
__p.push('><a class="vm-time" href="#"><i class="ico"></i>');
_p(_(l_key,'按时间排序'));
__p.push('</a></li>\r\n\
        <li data-view="azlist" class="');
_p(cur_view === 'azlist' ? 'focus' : '');
__p.push('" ');
_p(click_tj.make_tj_str('SWITCH_AZLIST_MODE'));
__p.push('><a class="vm-az" href="#"><i class="ico"></i>');
_p(_(l_key,'按字母顺序'));
__p.push('</a></li>\r\n\
        <li data-view="grid" class="');
_p(cur_view === 'grid' ? 'focus' : '');
__p.push('" ');
_p(click_tj.make_tj_str('SWITCH_NEWTHUMB_MODE'));
__p.push('><a class="vm-thum" href="#"><i class="ico"></i>');
_p(_(l_key,'显示缩略图'));
__p.push('</a></li>\r\n\
    </ul>\r\n\
</div>');

return __p.join("");
}
};
return tmpl;
});
