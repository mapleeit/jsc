//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/outlink_v2/outlink_v2.r160222",["lib","common","$"],function(require,exports,module){

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
//outlink_v2/src/FileNode.js
//outlink_v2/src/NoteNode.js
//outlink_v2/src/ad_banner/ad_link.js
//outlink_v2/src/file_path/all_checker.js
//outlink_v2/src/file_path/file_path.js
//outlink_v2/src/file_path/ui.js
//outlink_v2/src/header/header.js
//outlink_v2/src/header/space_info.js
//outlink_v2/src/header/user_info.js
//outlink_v2/src/image_lazy_loader.js
//outlink_v2/src/login.js
//outlink_v2/src/mgr.js
//outlink_v2/src/note.js
//outlink_v2/src/outlink.js
//outlink_v2/src/selection.js
//outlink_v2/src/store.js
//outlink_v2/src/ui.file_list.js
//outlink_v2/src/ui.js
//outlink_v2/src/ui.note.js
//outlink_v2/src/ui.photo.js
//outlink_v2/src/verify_code.js
//outlink_v2/src/ad_banner/ad.tmpl.html
//outlink_v2/src/file_path/all_checker.tmpl.html
//outlink_v2/src/file_path/file_path.tmpl.html
//outlink_v2/src/header/header.tmpl.html
//outlink_v2/src/view.tmpl.html

//js file list:
//outlink_v2/src/FileNode.js
//outlink_v2/src/NoteNode.js
//outlink_v2/src/ad_banner/ad_link.js
//outlink_v2/src/file_path/all_checker.js
//outlink_v2/src/file_path/file_path.js
//outlink_v2/src/file_path/ui.js
//outlink_v2/src/header/header.js
//outlink_v2/src/header/space_info.js
//outlink_v2/src/header/user_info.js
//outlink_v2/src/image_lazy_loader.js
//outlink_v2/src/login.js
//outlink_v2/src/mgr.js
//outlink_v2/src/note.js
//outlink_v2/src/outlink.js
//outlink_v2/src/selection.js
//outlink_v2/src/store.js
//outlink_v2/src/ui.file_list.js
//outlink_v2/src/ui.js
//outlink_v2/src/ui.note.js
//outlink_v2/src/ui.photo.js
//outlink_v2/src/verify_code.js
/**
 * 文件对象类
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./FileNode",["lib","common","$"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        prettysize = lib.get('./prettysize'),

        file_type_map = common.get('./file.file_type_map'),

    // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
    // 图片类型
        EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1 },

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
            this._name = opts.filename || opts.file_name;
            this._mtime = opts.file_mtime;
            this._ctime = opts.file_ctime;
            this._diff_version = opts.diff_version;
            this._file_size = opts.file_size;
            this._file_cursize = opts.file_cursize;
            this._file_sha = opts.file_sha;
            this._file_md5 = opts.file_md5;
            this._file_version = opts.file_version;
            this._lib_id = opts.lib_id;
            this._attr = opts.file_attr;
            this._ext_info = opts.ext_info;
            this._thumb_url = opts.thumb_url || opts.ext_info && opts.ext_info.thumb_url || '';
            this._readability_size = FileNode.get_readability_size(this._file_size);
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

        is_root: function() {
            return this._id === 'root';
        },

        is_dir: function() {
            return !!this._is_dir;
        },

        is_image: function() {
            var type = FileNode.get_type(this._name, false);
            return type in EXT_IMAGE_TYPES;
        },

        is_note: function() {
            return false;
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
            return this._readability_size;
        },

        get_modify_time: function() {
            return this._mtime;
        },

        get_create_time: function() {
            return this._ctime;
        },

        get_file_sha: function() {
            return this._file_sha;
        },

        get_file_md5: function() {
            return this._file_md5;
        },

        get_thumb_url: function(size) {
            if(this.is_image() && this._thumb_url) {
                if(size) {
                    size = size + '*' + size;
                    return this._thumb_url+ (this._thumb_url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
                } else {
                    return this._thumb_url;
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
            this.set_load_done(false);
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
        },

        set_load_done: function(done) {
            this._load_done = !!done;
        },

        is_load_done: function() {
            return this._load_done;
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
        // 没有后缀名的默认为file
        return 'file';
    };

    FileNode.is_image = function (name) {
        var type = FileNode.get_type(name, false);
        return type in EXT_IMAGE_TYPES;
    };

    FileNode.get_ext = function(name) {
        var m = (name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;

    }

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Boolean} [is_dir] 是否目录（目录会返回空字符串）
     * @param {Number} [decimal_digits] 保留小数位，默认1位
     */
    FileNode.get_readability_size = function (bytes, is_dir, decimal_digits) {
        if (is_dir)
            return '';

        if(bytes === -1){
            return '超过4G';
        }

        bytes = parseInt(bytes);
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

        return result + BYTE_UNITS[unit];
    };

    $.extend(FileNode.prototype, events);

    return FileNode;
});/**
 * 笔记对象类
 * @date 2015-07-29
 * @author hibincheng
 */
define.pack("./NoteNode",[],function(require, exports, module) {

    function NoteNode(opt) {
        this._id = opt.note_id;
        this._name = opt.note_title;
        this._create_time = opt.note_ctime;
        this._modify_time = opt.note_mtime;
    }

    NoteNode.prototype = {

        is_dir: function() {
            return false;
        },

        is_image: function() {
            return false;
        },

        is_note: function() {
            return true;
        },

        get_id: function() {
            return this._id;
        },

        get_pid: function() {
            if(this.get_parent()) {
                return this.get_parent().get_id();
            }

        },

        get_pdir_key: function() {
            return this.get_pid();
        },

        get_name: function() {
            return this._name;
        },

        get_create_time: function() {
            return this._create_time;
        },

        get_modify_time: function() {
            return this._modify_time;
        },

        get_type: function() {
            return 'note';
        },

        get_thumb_url: function() {
            return '';
        },


        //===========================

        set_parent: function(parent) {
            this._parent = parent;
        },

        get_parent: function() {
            return this._parent;
        }
    }

    return NoteNode;
});/**
 * web分享页底部广告banner
 * @author xixinhuang
 * @date 2015-11-10
 */

define.pack("./ad_banner.ad_link",["lib","common","$","./store","./tmpl"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),
        user_log = common.get('./user_log'),
        https_tool = common.get('./util.https_tool'),
        query_user = common.get('./query_user'),
        logger = common.get('./util.logger'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        uin = query_user.get_uin_num(),

        qboss_info,

        //block_uins = ['10001', '711029', '10321', '6508431', '10015', '10332', '542245351'], //头部广告显示 加上黑名单屏蔽 @hibincheng
        boad_id = 2425,

        undefined;

    var ad_link = {
        render: function() {
            var me = this;

            //if($.inArray(uin+'', block_uins) > -1) {//用户在黑名单中则不显示广告
            //    return;
            //}
            if(store.get_type() === 'note' || (store.get_type() == 'photo' && store.get_cur_node().get_kid_count() == 1)) {
                return;
            }

            if(qboss_info) {
                this._render_qboss_ad();
            } else {
                require.async('qboss', function(mod) {
                    qboss_info = mod.get('./qboss');
                    me._render_qboss_ad();
                });
            }
        },

        _render_qboss_ad: function() {
            var $container = $('#lay-main-con').length > 0? $('#lay-main-con') : $('#_outlink_body').parent(),
                share_info = store.get_share_info(),
                me = this;

            //当访客没有登录态时，就采用分享者的uin来代替
            uin = uin || share_info['share_uin'];

            qboss_info.get({
                board_id: boad_id,
                uin: uin
            }).done(function(repData){
                var ad;
                if(repData.data && repData.data.count > 0 && repData.data[boad_id] && (ad = repData.data[boad_id].items) && ad.length > 0){
                    if(ad[0] && ad[0].extdata) {
                        me._$ad = $(tmpl.ad_bottom()).appendTo($container);
                        me.trigger('show_ad');
                        me.init_ad_data(ad[0]);
                        qboss_info.report(me.opt);
                        me._bind_events();
                    }
                }
            }).fail(function(msg){
                //console.warn(msg);
            });
        },

        //保存广告数据
        init_ad_data: function(data) {
            var opt = {};
            opt.bosstrace = data.bosstrace;
            opt.extdata = JSON.parse(data.extdata);
            opt.qboper = 1;  //qboper：1曝光 ， 2点击， 3关闭
            opt.from = 1;    //from：  1 pc， 2 wap， 3 手机
            opt.uin = uin;

            this.opt = opt;
        },

        show_ad: function() {
            this._$ad && this._$ad.show();
            this.trigger('show_ad');
        },

        hide_ad: function() {
            this._$ad && this._$ad.hide();
            this.trigger('hide_ad');
        },

        remove_ad: function() {
            this._$ad && this._$ad.remove();
            this.trigger('remove_ad');
        },

        _bind_events: function() {
            var me = this,
                close_btn = this._$ad.find('[data-id=ad_close]'),
                link = this._$ad.find('[data-id=ad_img]');
            close_btn && close_btn.on('click', function() {
                me.remove_ad();
                me.opt['qboper'] = 3;
                qboss_info.report(me.opt);
            });
            link && link.attr('src', this.opt.extdata['img']);
            link && link.on('click', function() {
                me.opt['qboper'] = 2;
                qboss_info.report(me.opt);
                me.remove_ad();
                window.open(me.opt.extdata['link']);
            });
        }
    }

    $.extend(ad_link, events);

    return ad_link;
});/**
 * 文件列表全选
 * @author hibincheng
 * @date 15-05-31
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

        default_event: 'checkall',

        cur_checked: false,  // 当前勾选状态        default_event: 'toggle_check',

        render: function () {
            if (this.rendered) {
                return;
            }

            var me = this, $el;
            $el = me.$el = $('#outlink_checkall');

            $el.on('click', function (e) {
                e.preventDefault();

                var to_check = !me.cur_checked;

                me.toggle_check(to_check);

				me.trigger(me.default_event, to_check, e);
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
 * @author hibincheng
 * @date 15-05-31
 */
define.pack("./file_path.file_path",["lib","common","$","./file_path.ui","./file_path.all_checker","./store","./selection"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),

        ui = require('./file_path.ui'),
        all_checker = require('./file_path.all_checker'),
        store = require('./store'),
        selection = require('./selection'),

        cur_node,
        last_enable,

        last_win_width,

        undefined;

    var file_path = new Module('outlink.file_path', {

        render: function() {

            ui.render();
            // 全选
            all_checker.render();

            var me = this;
            this.listenTo(ui, 'click_path', function(dir_key, e) {
                me.trigger('action', 'click_path', dir_key, e);
                me.update(store.get(dir_key));
                all_checker.toggle_check(false);
            }).listenTo(all_checker, 'checkall', function(checked, e) {
                me.trigger('action', 'checkall', checked, e);
            });

            this.listenTo(global_event, 'window_resize', function(win_width) {
                last_win_width = win_width;
                this._resize_trigger_update();
            });



            this.listenTo(selection, 'selected', function(files, is_all) {
                this.toggle_checkall(is_all);
            }).listenTo(selection, 'unselected', function() {
                this.toggle_checkall(false);
            });

            var win_width = $(window).width();
            if(last_win_width && last_win_width !== win_width) { //第一次不会执行,没有保存win_width
                this._resize_trigger_update();
            }

            last_win_width = win_width;

            this.update(store.get_root_node(), true);
        },

        _resize_trigger_update: function() {
            var last_lv_node = cur_node;

            if(!cur_node) {
                return;
            }
            cur_node = null;
            this.update(last_lv_node);
        },

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

                while (node.get_parent() && (node = node.get_parent())) {
                    nodes.push(node);
                }
                nodes.reverse();
                nodes.push(last_lv_node);

                cur_node = last_lv_node;
                last_enable = enable;

                ui.update_$nodes(last_lv_node, nodes, enable);
            }
        },

        toggle_checkall: function(checkabll) {
            all_checker.toggle_check(checkabll);
        }
    });

    return file_path;
});/**
 *
 * @author hibincheng
 * @date 15-05-31
 */
define.pack("./file_path.ui",["lib","common","$","./tmpl","./file_path.file_path","./store"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        global_event = common.get('./global.global_event'),
        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        scr_reader_mode = common.get('./scr_reader_mode'),

        tmpl = require('./tmpl'),

        file_path,
        store,

        cur_node,
        visible,

        init_updated = false,

        undefined;

    var ui = new Module('disk_file_path_ui', {

        render: function ($to) {
            file_path = require('./file_path.file_path');
            store = require('./store');

            // 事件
            var $el = $('#outlink_path');
            this._$el = $el;
            this._$inner = $el.find('[data-inner]');

            var me = this;
            // 点击路径跳转
            $el.on('click', function (e) {
                e.preventDefault();
            });
            $el.on('click', '[data-more]', function(e) {
                me._toggle_path_menu();
                e.stopPropagation();
            });
            $el.on('click', '[data-file-id]', function (e) {
                e.preventDefault();
                var $target = $(this),
                    dir_id = $target.attr('data-file-id');

                me.trigger('click_path', dir_id, e);

            });

        },

        /**
         * 更新路径
         * @param {FileNode} last_lv_node 目标目录
         * @param {FileNode[]} nodes 目录路径
         * @param {Boolean} [enable] 是否可点击，默认true
         */
        update_$nodes: function (last_lv_node, nodes, enable) {
            var me = this,
                $inner = me._$inner;
            var $paths = me.measure_path(last_lv_node, nodes, enable);
            $inner.empty().append($paths);
            cur_node = last_lv_node;

            me._fix_some();
        },

        /**
         * 测量路径，当路径过深时，前面部分收起做为下拉菜单展示
         * @param last_lv_node
         * @param nodes
         * @param enable
         * @returns {*|jQuery|HTMLElement}
         */
        measure_path: function(last_lv_node, nodes, enable) {
            var $inner = this._$inner,
                $paths = $(tmpl['file_path_items']({ target_node: last_lv_node, nodes: nodes, enable: !!enable })),
                limit_width;
            if(scr_reader_mode.is_enable() || !cur_node) { //读屏模式全部路径显示 或第一次渲染（只能一层目录，cur_node没有保存则认为是第一次渲染）
               return $paths;
            }
            $inner.empty().append($paths);
            limit_width = this.get_$path_warp().width();
            var children = Array.prototype.slice.call($inner.children('a'));
            var cul_width = 0;
            while(children.length) {
                var node = children.pop();
                cul_width += $(node).outerWidth() - 15; //每个节点margin-left:-15px，所以相邻间重叠15px
                if(cul_width + 22 + 35 + 10 > limit_width) { //下拉菜单图标宽22px checkbox35px宽，留个10px空白
                    children.push(node);
                    break;
                }
            }

            var menu_nodes = nodes.slice(0, children.length);
            var nodes = nodes.slice(children.length);

            $paths = $(tmpl['file_path_items']({ target_node: last_lv_node, nodes: nodes, enable: !!enable, has_more: !!menu_nodes.length}));

            if(menu_nodes.length) {
                this._render_path_menu(menu_nodes, enable);
            } else {
                this._remove_path_menu();
            }
            return $paths;

        },

        _render_path_menu: function(menu_nodes, enable) {
            this._remove_path_menu();

            this._$path_menu = $(tmpl['path_menu']({nodes:menu_nodes, enable: enable}));
            this._$path_menu.appendTo(this.get_$path_warp());

            var me = this;
            $(document.body).on('click.file_path_menu', function(e) {
                var $target = $(e.target);
                if(!$target.closest(me._$path_menu).length) {
                    me._toggle_path_menu(false);
                }
            });
        },

        _remove_path_menu: function() {
            if(this._$path_menu) {
                this._$path_menu.remove();
                this._$path_menu = null;
                $(document.body).off('click.file_path_menu');
            }
        },

        _toggle_path_menu: function(visible) {
            if(arguments.length) {
                this._$path_menu.toggle(!!visible);
            } else {
                this._$path_menu.toggle();
            }
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
            if (this._fixed_some) return;

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

            this._fixed_some = 1;
        },

        toggle_$path: function(visible) {
            this._$inner && this._$inner[visible ? 'show': 'hide']();
        },

        get_$path_warp: function() {
            return this._$el.children(':first');
        }

    });

    return ui;

});
/**
 * 新版PC侧分享页
 */
define.pack("./header.header",["lib","common","./store","./header.user_info"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
        store = require('./store'),

        undefined;

    var header = new Module('outlink.header', {

        render: function() {
            if(this._inited) {
                return;
            }

            this._render_user_info();

            this._render_toolbar();

            this._inited = true;
        },

        _render_user_info: function() {
            require('./header.user_info').render();
        },

        _render_toolbar: function() {
            var me = this;

            this.$toolbar = $('#outlink_toolbar').on('click', '[data-action]', function(e) {
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');

                me.trigger('action', action_name, e);
            });
        },

        show_btn: function(btn_name) {
            this.$toolbar.find('[data-action='+btn_name+']').show();
        },

        hide_btn: function(btn_name) {
            this.$toolbar.find('[data-action='+btn_name+']').hide();
        }

    });

    return header;
});/**
 * 空间信息
 * @author yuyanghe
 * @date 13-9-21
 */
define.pack("./header.space_info",["lib","common","$","./header.user_info"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        user_info=require('./header.user_info'),

        get_total_space_size = common.get('./util.get_total_space_size'),

        undefined;

    var space_info = new Module('outlink_space_info', {
        _used_space:0,
        _total_space:0,
        _$text:null,
        _$bar: null,

        render: function () {
            // 文字
            var me=this;
            // 进度条
            this._$bar = $('#_main_space_info_bar');
            this.listenTo(user_info, 'load', function (used_space,total_space) {
                me._$used_space_text = $('#_used_space_info_text');
                me._$total_space_text = $('#_total_space_info_text');
                me._used_space=used_space;
                me._total_space= total_space;
                me._update_text();
                me._update_bar();
            });

        },
        // 文字
        _update_text: function () {
            this._$used_space_text.text(text.format('{used_space}', {
                used_space: get_total_space_size(this._used_space, 2)
            }));
            this._$total_space_text.text(text.format('{total_space}', {
                total_space: get_total_space_size(this._total_space, 2)
            }));
        },

        // 进度条
        _update_bar: function () {
            var percent = Math.floor((this._used_space / this._total_space *100));
            this._$bar
                .css('width', Math.min(percent, 100) + '%')
                .parent()
                .toggleClass('full', percent >= 90)
                .attr('title', percent + '%');
        },

        get_used_space: function(){
            return this._used_space;
        },
        get_total_space: function(){
            return this._total_space;
        }
    });

    return space_info;
});/**
 * 显示一些用户信息（昵称等）
 * @author yuyanghe
 * @date 13-9-17
 */
define.pack("./header.user_info",["lib","common","$","./login","./tmpl","./header.space_info"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        security = lib.get('./security'),
        cookie = lib.get('./cookie'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        urls = common.get('./urls'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        Pop_panel = common.get('./ui.pop_panel'),
        session_event = common('./global.global_event').namespace('session'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        login = require('./login'),
        tmpl = require('./tmpl'),

        win = window,
        outlink_appid=30111,
        undefined;


    var user_info = {

        render: function () {
            var me=this;

            me.show_user_info();
            $('#outlink_login').on('click', function(e) {
                session_event.trigger('session_timeout');
            });

            this.listenTo(login, 'login_done', this.show_user_info);

            this._render_logo();
        },

        show_user_info: function(){
            var me=this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/qdisk_get.fcg'),
                cmd: 'DiskUserInfoGet',
                cavil: false,
                pb_v2: true,
                header: {appid: outlink_appid},
                body: {
                    show_migrate_favorites: true,
                    show_qqdisk_migrate: true,
	                is_get_weiyun_flag: true
                }
            }).done(function (msg, ret,body,header) {
                    if(ret==0){
                        query_user._set_user_from_cgi_rsp(header, body);
                        me._render_face(query_user.get_uin_num());
                        me.set_nickname(body.nick_name);
                        me._render_logout();
                        me._render_feedback();
                        me.trigger('load',body.used_space,body.total_space)
                    }else if(ret==1031){   //设置了独立密码的用户
                        me._render_face(query_user.get_uin_num());
                        me.set_nickname(body.nick_name);
                        me._render_logout();
                        me._render_feedback();
                        //获取用户空间信息
                        request.xhr_get({
                            cmd: 'get_timestamp',
                            header: {source:outlink_appid,appid: outlink_appid},
                            body: {
                            //    local_timestam:	"1", 	// 上次获取的系统时间戳，字符串（格式：64位整型）
                                local_mac:"0"				// 设备本地mac，当后面各项有上报时，此字段为必填，字符串
                            }
                        }).ok(function (msg, body) {
                                me.trigger("load",body.used_space,body.total_space);
                            })
                    }
            });
        },

        /**
         * 更新昵称
         * @param nickname
         */

        set_nickname: function (nickname) {
            var _nickname =   nickname;
            if ($.browser.msie && $.browser.version < 7) {
                _nickname = text.smart_sub(7);
            }
            $('#_main_nick_name').text(_nickname);

        },

        /**
         * 头像、头像的菜单
         * @param uin
         */

        _render_face: function (uin) {
            this.$user_info =this.$user_info || $(tmpl.user_info()).appendTo('#outlink_header');

            require('./header.space_info').render();

            var $face = $('#header-user'),
                $face_menu = $('#_main_face_menu'),
                $face_img = this.$user_info.find('img');

            new Pop_panel({
                host_$dom: this.$user_info,
                $dom: $face_menu,
                show: function () {
                    $face_menu.show();
                    $face.addClass('hover');

                },
                hide: function () {
                    $face_menu.hide();
                    $face.removeClass('hover');
                },
                delay_time: 300
            });

            //先显示默认头像
            $face.show();
            //隐藏登录按钮
            $('#outlink_login').hide();

            var cur_user = query_user.get_cached_user();
	        var avatar = cur_user.get_avatar();
	        if(avatar) {
		        $face_img.attr('src', cur_user.get_avatar().replace(/^http:|^https:/, ''));
	        } else {
		        // 获取头像
		        this._get_face_by_uin(uin).done(function (url) {
			        $face_img.attr('src', url.replace(/^http:|^https:/, ''));
		        });
	        }
        },

        _render_logout: function () {
            var me = this;

            // 退出按钮
            $('#outlink_login_out').on('click', function (e) {
                e.preventDefault();
                me._logout();
            });
        },

        _render_logo: function() {
            $('#outlink_header').on('click', '.logo', function() {
                if(query_user.check_cookie()) {
                    window.open(window.location.protocol + '//www.weiyun.com/disk/index.html');
                } else {
                    window.open(window.location.protocol + 'http://www.weiyun.com');
                }
            })
        },

        _render_feedback: function() {
            var me = this,
                ss_tag = (constants.IS_APPBOX) ? 'appbox_disk' : 'web_disk';
            //var url = urls.make_url('http://support.qq.com/write.shtml', {fid: 943, SSTAG: ss_tag, WYTAG: aid.WEIYUN_APP_WEB_DISK});
            $('#_main_feedback').on('click', function(e) {
                e.preventDefault();
                document.domain = 'weiyun.com';
                var $iframe = $('<iframe frameborder="0" src="about:blank" data-name="iframe"></iframe>');
                $iframe.css({
                    'zIndex': '1000',
                    'width' : '100%',
                    'height': '488px'
                }).attr('src', 'http://www.weiyun.com/feedback.html?web');

                me.$ct = $('<div data-no-selection class="full-pop" style="z-index: 1000; position: fixed; left: 50%; top: 50%"></div>');
                me.$ct.css({
                    "width": "478px",
                    "height": "490px",
                    "margin-left": "-239px",
                    "margin-top":  "-245px"
                });
                me.$ct.appendTo(document.body);
                $iframe.appendTo(me.$ct);

                me.add_full_mask();
                me._bind_feedback_events();
                me.$ct.show();
            });
        },

        add_full_mask: function() {
            this.$mask = $('<div class="full-mask"></div>').appendTo(document.body);
        },

        _bind_feedback_events: function() {
            var me = this;
            var onmessage = function(e) {
                var data = e.data;
                if(data.action === 'close') {
                    me.$ct && me.$ct.remove();
                    me.$ct = null;

                    me.$mask && me.$mask.remove();
                    me.$mask = null;
                } else if(data.action === 'send_succeed') {
                    me.$ct.find('iframe').css('height', '198px');
                    me.$ct.css({
                        "width": "399px",
                        "height": "202px",
                        "margin-left": "-200px",
                        "margin-top":  "-101px"
                    });
                }
            }
            if (typeof window.addEventListener != 'undefined') {
                window.addEventListener('message', onmessage, false);
            } else if (typeof window.attachEvent != 'undefined') {
                window.attachEvent('onmessage', onmessage);
            }
        },

        _logout: function () {
            if(typeof pt_logout !== 'undefined') {
                pt_logout.logoutQQCom(function() {
                    query_user.destroy();
                    location.reload();
                });
            } else {
                require.async(constants.HTTP_PROTOCOL + '//ui.ptlogin2.qq.com/js/ptloginout.js', function() {
                    pt_logout.logoutQQCom(function() {
                        query_user.destroy();
                        location.reload();
                    });
                });
            }
            /*$('#outlink_login').show();
            this.$user_info.remove();
            this.$user_info = null;*/
        },

        _get_face_by_uin: function (uin) {
            var def = $.Deferred();
            /*初始化 头像信息*/
            $.ajax({
                url: urls.make_url(window.location.protocol + '//ptlogin2.weiyun.com/getface', {
                    appid: 527020901,
                    imgtype: 3,
                    encrytype: 0,
                    devtype: 0,
                    keytpye: 0,
                    uin: uin,
                    r: Math.random()
                }),
                dataType: 'jsonp',
                jsonp: false
            });

            win.pt = {
                setHeader: function (json) {
                    for (var key in json) {
                        if (json[key]) {
                            def.resolve(json[key]);
                            break;
                        }
                    }
                    if ('resolved' !== def.state()) {
                        def.reject();
                    }
                    win.pt = null;
                    try {
                        delete window.pt;
                    } catch (e) {
                    }
                }
            };
            return def;
        }
    };

    $.extend(user_info, events);

    return user_info;
});/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./image_lazy_loader",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        image_loader = lib.get('./image_loader'),
        global_event = common.get('./global.global_event'),

        undefined;

    var lazy_loader = {

        init: function(img_container, scroller) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            this.listenTo(scroller, 'scroll', function() {
                me.load_image();
            })

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
                me = this;

            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        var thumb_url = me.get_thumb_url($img.attr('data-src'), 64);
                        image_loader.load(thumb_url).done(function(img) {
                            $img.css({
                                'backgroundImage': "url('"+img.src+"')",
                                'backgroundPosition': 0
                            });
                            $img.attr('data-loaded', 'true');
                        });
                    }
                }
            });
        },

        get_thumb_url: function(url, size) {
            if(!url) {
                return '';
            }

            if(size) {
                size = size + '*' + size;
                return url + (url.indexOf('?') > -1 ? '&size=' + size : '?size=' + size);
            } else {
                return url;
            }
        }
    };

    $.extend(lazy_loader, events);

    return lazy_loader;
});/**
 * 新版PC侧分享页
 */
define.pack("./login",["lib","common"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        session_event = common('./global.global_event').namespace('session'),

        undefined;

	var qq_login,
		qq_login_ui;
    var login = new Module('outlink.login', {

        init: function() {
            this.listenTo(session_event, 'session_timeout', this.to_login);
        },

        to_login: function() {
            var me = this;
	        if(qq_login) {
		        qq_login.show();
	        } else {
		        require.async('qq_login', function(mod) {
			        qq_login = mod.get('./qq_login');
				    qq_login_ui = qq_login.ui;

			        me
				        .stopListening(qq_login)
				        .stopListening(qq_login_ui)
				        .listenTo(qq_login, 'qq_login_ok', function() {
					        me.trigger('login_done');
				        })
				        .listenToOnce(qq_login_ui, 'show', function() {
					        widgets.mask.show('qq_login', null, true);
				        })
				        .listenToOnce(qq_login_ui, 'hide', function() {
					        widgets.mask.hide('qq_login');

					        me.stopListening(qq_login_ui);
				        });

			        qq_login.show();
		        });
	        }
        }

    });

    return login;
});/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define.pack("./mgr",["lib","common","$","./ad_banner.ad_link","./selection","./store","./login","./note","./tmpl","./verify_code"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),
        url_parser = lib.get('./url_parser'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        logic_error_code = common.get('./configs.logic_error_code'),
        preview_dispatcher = common.get('./util.preview_dispatcher'),
	    https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        cookie = lib.get('./cookie'),

        ad_link = require('./ad_banner.ad_link'),
        selection = require('./selection'),
        store = require('./store'),
        login = require('./login'),
        note = require('./note'),
        tmpl = require('./tmpl'),
        verify_code = require('./verify_code'),

        
        share_enter,
        downloader,
        file_qrcode,

        ftn_preview,
        undefined;

    var mgr = {

        init: function(cfg) {
            $.extend(this, cfg);
            login.init();
	        this.listenTo(login, 'login_done', this.on_restore);
            this.bind_events();
        },

        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e, extra){
                    this.process_action(action_name, record, e, extra);
                    return false;// 不再触发recordclick
                }, this);
//                this.listenTo(this.view, 'recordclick', this.handle_record_click, this);
            }
            //监听头部发出的事件（工具栏等）
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, e) {
                    var records = selection.get_selected();
                    this.process_action(action_name, records, e);
                }, this);
            }

            if(this.file_path) {
                this.listenTo(this.file_path, 'action', function(action_name, data) {
                    this.process_action(action_name, data);
                });
            }

        },
        // 分派动作
        process_action : function(action_name){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name].apply(this, [].slice.call(arguments, 1));
            }
        },

        //全选
        on_checkall: function(to_check) {
            var kid_nodes = store.get_cur_node().get_kid_nodes();
            if(to_check){
                selection.clear();
                selection.select(kid_nodes);
            } else{
                selection.unselect(kid_nodes, true);
            }
        },

        //定位到某个目录
        on_click_path: function(dir_key) {
            store.load_dir_kid(dir_key);
            this.header.show_btn('download');
            if(dir_key === store.get_root_node().get_id()) {
                ad_link.show_ad();
            }
        },

        //打开
        on_enter: function(file_id) {
            var node = store.get(file_id),
                share_info = store.get_share_info(),
                me = this;
            if(node.is_dir()) {
                this.file_path.update(node, true);
                store.load_dir_kid(file_id);
                ad_link.hide_ad();
            } else if(node.is_note()) {
                this.preview_note(node);
            } else if(preview_dispatcher.is_preview_doc(node) && share_info.share_flag != 12) {
                node._share_key = share_info.share_key;
                node._share_pwd = share_info.pwd;
                node.down_file = function (e) {
                    me.on_download([node], e);
                }
                preview_dispatcher.preview(node);
            } else if(this.is_compress_file(node)  && !($.browser.msie && $.browser.version < 8)) {
                this.preview_zip_file(node);
            } else if(node.is_image()) {
                this.preview_image(node);
            } else {
                this.on_download([node]);
            }
        },

        //下载
        on_download: function(files, e) {
            if(!files || !files.length) {
                mini_tip.warn('请选择文件');
                return;
            }

            var total_size = 0;

            var has_note = false,
                has_dir = false;
            $.each(files, function(i, file) {
                if(file.is_note()) {
                   has_note = true;
                   return false;
                } else if(file.is_dir()) {
                    has_dir = true;
                    return false;
                }
                total_size += file.get_size();
            });

            if(has_note) {
                mini_tip.warn('您选择的文件中包含笔记，无法进行下载。');
                return;
            //} else if(has_dir) {
            //    mini_tip.warn('您选择的文件中包含文件夹，无法进行下载。');
            //    return;
            }

            var share_info = store.get_share_info(),
                data = {},
                referer = 0,
                me = this;

            data.share_key = share_info['share_key'];
            data.pwd = share_info['pwd'];
            data.pack_name = files.length > 1 ? files[0].get_name() + '等' + files.length + '个文件' : files[0].get_name();
            data.pdir_key = files[0].get_pdir_key();

            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    data.dir_list = data.dir_list || [];
                    data.dir_list.push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else {
                    data.file_list = data.file_list || [];
                    data.file_list.push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            });

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunSharePartDownload',
                use_proxy: false,
                cavil: true,
                pb_v2: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: data
            }).ok(function(msg, body) {
                var result;
                cookie.set(body.cookie_name, body.cookie_value, {
                    domain: constants.MAIN_DOMAIN,
                    path: '/',
                    expires: cookie.minutes(10)
                });

                if(!cookie.get(body.cookie_name)) {
                    //本地没有设置FTN5K时，下载会报错，这里需要上报错误
                    result = logic_error_code.is_logic_error_code('download', 1000501)? 2 : 1;
                    logger.monitor('js_download_error', 1000501, result);
                } else if(cookie.get(body.cookie_name) !== body.cookie_value) {
                    console.error('FTN cookie 写入失败！');
                    //这里把cookie设置失败的也上报上来统计
                    result = logic_error_code.is_logic_error_code('download', 1000502)? 2 : 1;
                    logger.monitor('js_download_error', 1000502, result);
                }
                me.do_download(body.download_url);

                //成功的也上报, 方便统计和设置告警
                logger.monitor('js_download_error', 0, 0);

            }).fail(function(msg, ret) {
                mini_tip.error(msg);

                //日志上报
                var console_log = [];
                console_log.push('pre_down error', 'error --------> ret: ' + ret, 'error --------> msg: ' + msg);
                if(files && files.length) {
                    for(var i=0, len=files.length; i<len; i++) {
                        console_log.push('error --------> files[' + i + ']  name: ' + files[i]._name + ', type: ' + files[i]._type + ', size: ' + files[i]._readability_size + ', file_id: ' + files[i]._id);
                    }
                }
                var result = logic_error_code.is_logic_error_code('download', ret)? 2 : 1;
                logger.write(console_log, 'download_error', ret);
                logger.monitor('js_download_error', ret, result);
            });
        },

        do_download: function(download_url) {
            var params = download_url.split(':');
            var index = (params[2] && params[2].indexOf('/') > -1)? params[2].indexOf('/') : 0;
            var port = constants.IS_HTTPS? 443 : params[2].slice(0, index);
            var url = constants.HTTP_PROTOCOL + this.translate_host(params[1]) + ':'  + port + params[2].slice(index);
            this.get_$down_iframe().attr('src', url);
        },

        translate_host:function (host) {
            if(!host) {
                return host;
            }

            if(host.indexOf('.ftn.') > -1) {
                return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
            }

            return host.replace(/\.qq\.com/, '.weiyun.com');
        },

	    //登录后重试转存
	    on_restore: function() {
			if(this.need_restore) {
				if(this.restore_file) {
					this.on_store(this.restore_file);
				} else {
					this.on_store();
				}
			}
	    },

        //转存
        on_store: function(files) {
            var share_type = store.get_type();
            if(share_type == "note"){
                this.on_store_note();
            } else{
                this.on_store_file(files);
            }
        },

        on_store_note: function(){
	        var me = this;
            var share_info = store.get_share_info(),
                referer = 0,
                data = {};

            data.share_key = share_info['share_key'];
            data.pwd = share_info['pwd'];

            request.xhr_post({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareSaveData',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: data
            }).ok(function(msg, body) {
                var dialog = new widgets.Dialog({
                    title: '提示',
                    empty_on_hide: true,
                    destroy_on_hide: true,
                    content: tmpl.store_dialog({
                        path: '/笔记'
                    }),
                    buttons: [ {id: 'CANCEL', text: '关闭', klass: 'g-btn-gray', visible: true} ]
                });
                dialog.show();
            }).fail(function(msg, ret, body, header) {
	            //登录后重新发起转存请求
	            if(ret === 190011) {
		            me.need_restore = 1;
	            }
                mini_tip.error(msg || header.retmsg);
            });
        },

        on_store_file: function(files){
	        var me = this;
            if(!files || !files.length) {
                mini_tip.warn('请选择文件');
                return;
            }

            var share_info = store.get_share_info(),
                data = {},
                me = this;

            data.share_key = share_info['share_key'];
            data.pwd = share_info['pwd'];

            //data.src_pdir_key = share_info['pdir_key'];
            $.each(files, function(i, file) {
                if(file.is_dir()) {
                    data.dir_list = data.dir_list || [];
                    data.dir_list.push({
                        dir_key: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                } else if(file.is_note()) {
                    data.note_list = data.note_list || [];
                    data.note_list.push({
                        note_id: file.get_id()
                    });
                } else {
                    data.file_list = data.file_list || [];
                    data.file_list.push({
                        file_id: file.get_id(),
                        pdir_key: file.get_pdir_key()
                    });
                }
            });

            request.xhr_post({
	            url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunSharePartSaveData',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: data,
	            resend: true
            }).ok(function(msg, body) {
                var dialog = new widgets.Dialog({
                    title: '提示',
                    empty_on_hide: true,
                    destroy_on_hide: true,
                    content: tmpl.store_dialog({
                        path: '/微云'
                    }),
                    buttons: [ {id: 'CANCEL', text: '关闭', klass: 'g-btn-gray', visible: true} ]
                });
                dialog.show();
            }).fail(function(msg, ret, body, header) {
	            //登录后重新发起转存请求
	            if(ret === 190011) {
					me.need_restore = 1;
		            me.restore_file = files;
	            }
	            mini_tip.error(msg || header.retmsg);
            });
        },

        //二维码
        on_qrcode: function() {
            var share_info = store.get_share_info(),
                share_key = share_info['share_key'];
            var qrcode_src = window.location.protocol + '//www.weiyun.com/php/phpqrcode/qrcode.php?data=http%3A%2F%2Fshare.weiyun.com/' +
                share_key+ '&level=4&size=2';
            var dialog = new widgets.Dialog({
                title: '二维码下载',
                empty_on_hide: true,
                destroy_on_hide: true,
                content: tmpl.qrcode_dialog({
                    qrcode_src: qrcode_src
                }),
                buttons: []
            });
            dialog.show();
        },

        on_secret_view: function(data) {
            var me = this,
                verify_sig = cookie.get('verifysession'),
                share_info = store.get_share_info(),
                req_body = {
                    os_info: constants.OS_NAME,
                    browser: constants.BROWSER_NAME,
                    share_key: location.pathname.replace('/',''),
                    share_pwd: data['pwd']
                };

            if (data.verify_code && verify_sig) {//有验证码需要加上
                req_body.verify_code = data.verify_code;
                req_body.verify_sig = verify_sig;
            }
            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg') + (share_info['sid'] ? '?sid='+share_info['sid'] : ''),
                cmd: 'WeiyunShareView',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: req_body
            }).ok(function(msg, body) {
                cookie.set('sharepwd', data['pwd']);
                location.reload();
            }).fail(function(msg, ret) {
                if (ret == 114303) {      //114303  代表密码错误
                    if (me.view.is_need_verify_code()) {  //需要验证码时，错误后需要刷新下验证码至最新
                        verify_code.change_verify_code();
                    }
                    me.view.set_pwd_err_text('密码错误');
                } else if (ret == 114304) { // 输入错误次数频率过高，需要输入验证码
                    verify_code.show();
                    me.view.set_need_verify_code();
                    me.view.set_pwd_err_text('密码错误次数过多，请输入验证码');
                } else if (ret == 114305) { //验证码错误
                    verify_code.change_verify_code();
                    me.view.set_verify_err_text('验证码错误');
                } else {
                    if (verify_code.has_verify_code()) {
                        verify_code.change_verify_code();
                    }
                    me.view.set_pwd_err_text(msg);
                }
            });
        },

        is_compress_file: function(file) {
            var compress_type_map = {'zip':1, 'rar': 1, '7z': 1};
            return compress_type_map[file.get_type()];
        },

        preview_zip_file: function (file) {
            var me = this,
                share_info = store.get_share_info();
            file._share_key = share_info['share_key'];
            file._share_pwd = share_info['pwd'];

            if(!ftn_preview) {
                require.async('ftn_preview', function(mod) {
                    ftn_preview = mod.get('./ftn_preview');
                    ftn_preview.compress_preview(file);
                    me._bind_compress_events();
                });
            } else {
                ftn_preview.compress_preview(file);
            }

        },

        //因为分享页的下载与网盘下载不同，这里要使用分享外链的下载方式
        _bind_compress_events: function() {
            var me = this;
            this.listenTo(ftn_preview, 'download', function(file) {
                me.on_download([file], null);
            });
        },

        preview_image: function(node) {
            var me = this;
            require.async(['image_preview', 'downloader', 'file_qrcode'], function(image_preview_mod, downloader_mod, file_qrcode_mod) {
                var file_qrcode = file_qrcode_mod.get('./file_qrcode'),
                    image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                var cur_img_list = store.get_cur_node().get_kid_images();
                // 当前图片所在的索引位置
                var index = $.inArray(node, cur_img_list);
                image_preview.start({
                    total: cur_img_list.length,
                    index: index,
                    get_thumb_url: function(index) {//返回预览时的图片地址
                        return cur_img_list[index] && cur_img_list[index].get_thumb_url(64);
                    },
                    get_url: function(index) {//返回预览时的图片地址
                        return cur_img_list[index] && cur_img_list[index].get_thumb_url(1024);
                    },
                    download: function(index, e) {
                        var file = cur_img_list[index];
                        me.on_download([file], e);
                    }
                });
            });
        },

        preview_note: function(node) {
            var share_info = store.get_share_info();
            var me = this;
            progress.show('加载数据中，请稍候。');
            request.xhr_get({
	            url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareNoteView',
                pb_v2: true,
                cavil: true,
                header: {
                    device_info: JSON.stringify({browser: constants.BROWSER_NAME})
                },
                body: {
                    share_key: share_info['share_key'],
                    pwd: share_info['pwd'],
                    note_id: node.get_id()
                }
            }).ok(function(msg, body) {
                if(body.note_info) {
                    note.preview(node, {
                        note_summary: body.note_info['note_summary'],
                        note_content: body.note_info['html_content'],
                        note_article_url: body.note_info['article_url']
                    });

                    me.header.hide_btn('download');
                    me.file_path.update(node, true);
                } else {
                    mini_tip.error('获取笔记内容失败。');
                }
            }).fail(function(msg ,ret) {
                mini_tip.error(msg || '获取笔记内容失败。');
            }).done(function() {
                progress.hide();
            });
        },

        get_$down_iframe: function() {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        }
    };

    $.extend(mgr, events);

    return mgr;
});/**
 * 笔记预览
 */
define.pack("./note",["lib","common","./file_path.file_path","./selection","./tmpl"],function(require, exports, modules) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),

        file_path = require('./file_path.file_path'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),

        cur_note,

        undefined;

    var note = new Module('outlink.note', {

        preview: function(note, extra) {
            if(this._rendered) {
                return;
            }
            if(extra.note_article_url) {
                window.open(extra.note_article_url);
                return;
            }

            var $con = this.get_$con();
            $con.hide();
            this.$ct = $(tmpl.note({
                title: note.get_name(),
                time: note.get_modify_time(),
                content: extra.note_content,
                article_url: extra.note_article_url
            })).insertAfter($con);

            // 给所有a标签的href加上U镜检查
            this.UMirrorCheck(this.$ct);

            this.bind_events();
            cur_note = note;
            selection.select(note);

            selection.get_sel_box().disable();
            $(document).off('contextmenu.file_list_context_menu');
            $(document.body).css('overflow', 'auto');
            this._rendered = true;
        },

        /**
         * U镜检查
         * 替换所有$dom中a标签的href
         * @param $dom
         */
        UMirrorCheck: function ($dom) {
            $dom.find('a').each(function (index) {
                var originURL = $(this).attr('href');
                // 防止嵌套添加
                if (!/^(http:|https:)?\/\/www\.urlshare\.cn\/umirror_url_check/.test(originURL)) {
                    $(this).attr('href', '//www.urlshare.cn/umirror_url_check?plateform=mqq.weiyun&url=' + encodeURIComponent(originURL));
                }
            })
        },

        render_article: function(artcile_url) {
            var $article_iframe = $('#_note_article_frame'),
                width = $(window).width(),
                height = $(window).height();
            $article_iframe.attr('src', artcile_url).css({
                width: '100%',
                height: height
            });
        },

        bind_events: function() {
            var me = this;
            this.listenTo(file_path, 'action', function(action_name) {
                if(action_name == 'click_path') {
                    me.destroy();
                }
            });
        },

        destroy: function() {
            this.stopListening(file_path);
            this.$ct.remove();
            this.$ct = null;
            this.get_$con().show();
            this._rendered = false;
            selection.unselect(cur_note);
            cur_note = null;
            selection.get_sel_box().enable();
            $(document.body).css('overflow', '');
        },

        get_$con: function() {
            return $('#lay-main-con');
       }
    });

    return note;
});/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define.pack("./outlink",["lib","common","./store","./header.header","./ad_banner.ad_link","./mgr","./ui.file_list","./file_path.file_path","./ui.photo","./ui"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
	    huatuo_speed = common.get('./huatuo_speed'),
        store = require('./store'),
        header = require('./header.header'),
        ad_link = require('./ad_banner.ad_link'),
        file_path,
        mgr = require('./mgr'),

        ui,
        undefined;

    var outlink = new Module('outlink_v2', {

        /**
         * 页面初始化
         * @param {Object} serv_rsp 直出的数据
         */
        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }
            store.init(serv_rsp);
            header.render();
            ad_link.render();

            var share_type = store.get_type();
            if(share_type == 'file_list') {
                ui = require('./ui.file_list');
                file_path = require('./file_path.file_path');
                file_path.render();
            } else if(share_type == 'photo') {
                ui = require('./ui.photo');
                if (store.get_cur_node().get_kid_count() > 1) {
                    file_path = require('./file_path.file_path');
                    file_path.render();
                }
            } else {
                ui = require('./ui');
            }

            ui.render();

            mgr.init({
                header: header,
                file_path: file_path,
                view: ui
            });

            if(share_type == 'file_list' || share_type == 'photo') {
                // 初始化一些全局兼容性修正
                common.get('./init.init')();
            }

            this.speed_time_report();

            require.async(['dimensional_code_css', 'link_css'])
        },

        /**
         * 测速上报
         */
        speed_time_report: function() {
	        //测速点上报
	        var flag = '21254-1-28';

	        $(document).ready(function () {
                huatuo_speed.store_point(flag, 23, window.g_dom_ready_time - (huatuo_speed.base_time || windows.g_start_time)); // dom ready
                huatuo_speed.store_point(flag, 24, new Date() - (huatuo_speed.base_time || windows.g_start_time)); // active
                huatuo_speed.report(flag, true);
            });
        }
    });

    return outlink;
});/**
 * 列表选择器模块
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./selection",["lib","common","./store"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        store = require('./store'),

        sel_box,
        undefined;

    var cache = [],
        cache_map = {};

    var selection = {

        init: function(enable_box_select) {
            enable_box_select && this._init_box_selection();
        },

        _init_box_selection: function() {
            var SelectBox = common.get('./ui.SelectBox');
            var $list = $('#_file_list');
            sel_box = new SelectBox({
                ns: 'share',
                $el: $list,
                $scroller: $('#lay-main-con'),
                all_same_size: true,
                keep_on: function($tar) {
                    return $tar.is('label');
                },
                clear_on: function($tar) {
                    return $tar.closest('[data-file-id]').length === 0;
                },
                container_width: function() {
                    return $list.width();
                }
            });

            sel_box.enable();

            var me = this;
            this.listenTo(sel_box, 'select_change', function(sel_id_map, unsel_id_map) {
                var sel_ids = [],
                    unsel_ids = [];
                for(var id in sel_id_map) {
                    if(sel_id_map.hasOwnProperty(id) && sel_id_map[id]) {
                        sel_ids.push(id);
                    }
                }

                for(var id in unsel_id_map) {
                    if(unsel_id_map.hasOwnProperty(id) && unsel_id_map[id]) {
                        unsel_ids.push(id);
                    }
                }

                if(sel_ids.length) {
                    me._select_files(sel_ids);
                }

                if(unsel_ids.length) {
                    me._unselect_files(unsel_ids);
                }
            });
        },

        _select_files: function(files, slient) {
            $.each(files, function(i, file) {
                file = typeof file === 'string' ? store.get(file) : file;
                cache_map[file.get_id()] = file;
                cache.push(file);
            });

            !slient && this.trigger('selected', files, this.is_all_select());
        },

        _unselect_files: function(files, slient) {
            $.each(files, function(i, file) {
                file = typeof file === 'string' ? store.get(file) : file;
                cache_map[file.get_id()] = undefined;
                $.each(cache, function(i, item) {
                    if(item.get_id() === file.get_id()) {
                        cache.splice(i, 1);
                        return false;
                    }
                });
                sel_box && sel_box.set_selected_status([file.get_id()], false);
            });

            !slient && this.trigger('unselected', files);
        },

        _change_checkbox: function(files, select) {
            var file_ids = [];
            if(!sel_box) {
                return;
            }
            $.each(files, function(i, file) {
                var file_id = typeof file === 'string' ? file : file.get_id();
                file_ids.push(file_id);
            });
            sel_box.set_selected_status(file_ids, !!select);
        },

        select: function(files, slient) {
            files = $.isArray(files) ? files: [files];
            this._select_files(files, slient);
            this._change_checkbox(files, true);
        },

        unselect: function(files, slient) {
            files = $.isArray(files) ? files: [files];
            this._unselect_files(files, slient);
            this._change_checkbox(files, false);
        },

        toggle_select: function(file) {
            if((typeof file === 'string') && cache_map[file] ||  file.get_id && cache_map[file.get_id()]) {
                this.unselect(file);
            } else {
                this.select(file);
            }
        },

        clear: function() {
            cache = [];
            cache_map = {};
            sel_box && sel_box.clear_selected();
        },

        get_selected: function() {
            return cache;
        },

        get_sel_box: function() {
            return sel_box;
        },

        is_all_select: function() {
            var is_all_select = false;
            //判断是否已经到达全选
            if(store.get_cur_node().get_kid_count() === cache.length) {
                is_all_select = true;
            }
            return is_all_select;
        },

        is_empty: function() {
            return this.get_selected().length === 0;
        }
    };

    $.extend(selection, events);

    return selection;
});/**
 * 新版PC分享页
 * @author hibincheng
 * @date 2015-03-19
 */
define.pack("./store",["lib","common","$","./FileNode","./NoteNode"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        request = common.get('./request'),
	    https_tool = common.get('./util.https_tool'),
        FileNode = require('./FileNode'),
        NoteNode = require('./NoteNode'),
        root_node, //文件目录根节点
        cur_node,  //当前目录节点
        node_map = {},

        undefined;

    function parse(data) {
        var list = [];
        var note_list = [];

        if(data.dir_list && data.dir_list.length > 0) {
            list = list.concat(data.dir_list);
        }

        if(data.file_list && data.file_list.length > 0) {
            list = list.concat(data.file_list);
        }
        if(data.note_list && data.note_list.length > 0) {
            note_list = data.note_list;
        }

        var nodes = [];
        if(list.length > 0) {
            $.each(list || [], function(i, item) {
                nodes.push(new FileNode(item));
            });
        }

        if(note_list.length > 0) {
            $.each(note_list, function(i, note) {
                nodes.push(new NoteNode(note));
            });
        }

        return nodes;
    }

    var store = {

        init: function(data) {
            if(this._inited) {
                return;
            }
            this.share_info = data;
            root_node = new FileNode({
                dir_name: '微云分享',
                pdir_key: '_',
                dir_key: data['pdir_key'] || 'root'
            });
            cur_node = root_node;
            node_map[cur_node.get_id()] = cur_node;

            if(data) {
                this.format2nodes(data);
            }

            cur_node.set_load_done(true);

            this._inited = true;
        },

        refresh: function() {
            cur_node.remove_all();
            this.load_more(true);
        },

        load_dir_kid: function(dir_key) {
            if(dir_key === 'root') {
                cur_node = root_node;
            } else {
                cur_node = store.get(dir_key);
            }

            if(!cur_node) {
                return;
            }
            //有子节点说明已加载过
            if(cur_node.get_kid_count()) {
                this.trigger('refresh_done', cur_node.get_kid_nodes(), store);
            } else {
                this.load_more(true);
            }
        },

        load_more: function(is_refresh) {
            if(this._requesting || !is_refresh && cur_node.is_load_done()) {
                return;
            }
            this._requesting = true;

            var me = this;
            if(is_refresh) {
                me.trigger('before_refresh');
            } else {
                me.trigger('before_load');
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://web2.cgi.weiyun.com/outlink.fcg'),
                cmd: 'WeiyunShareDirList',
                pb_v2: true,
                //use_proxy: true,
                body: {
                    dir_key: cur_node.get_id(),
                    get_virtual_dir: false,
                    get_type: 0,
                    start: cur_node.get_kid_nodes().length,
                    count: 100,
                    sort_field: 2,
                    reverse_order: false,
                    get_abstract_url: true
                }
            }).ok(function(msg, body) {
                me._requesting = false;
                var nodes = me.format2nodes(body);
                if(is_refresh) {
                    me.trigger('refresh_done', nodes, store);
                } else {
                    me.trigger('load_done', nodes, store);
                }

            }).fail(function(msg, ret) {
                me._requesting = false;
                me.trigger('load_fail', msg, ret, is_refresh);
            }).done(function() {
                me._requesting = false;
            });
        },

        format2nodes: function(data) {
            var nodes = parse({
                dir_list: data.dir_list,
                file_list: data.file_list,
                note_list: data.note_list
            });

            $.each(nodes, function(i, node) {
                node_map[node.get_id()] = node;
            });

            cur_node.add_nodes(nodes);
            cur_node.set_load_done(data.finish_flag);
            return nodes;
        },

        set_cur_node: function(node) {
            cur_node = node;
        },

        is_load_done: function() {
            return !!cur_node.is_load_done();
        },

        get_root_node: function() {
            return root_node;
        },

        get_cur_node: function() {
            return cur_node;
        },

        get: function(file_id) {
            return node_map[file_id];
        },

        get_type: function() {
            return this.type = this.type || (this.type = this.share_info.type);
        },

        get_share_info: function() {
            return this.share_info;
        }
    };

    $.extend(store, events);

    return store;
});/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define.pack("./ui.file_list",["lib","common","./store","./selection","./image_lazy_loader","./ad_banner.ad_link","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        collections = lib.get('./collections'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        Scroller = common.get('./ui.scroller'),
        ContextMenu = common.get('./ui.context_menu'),
        store = require('./store'),
        selection = require('./selection'),
        image_lazy_loader = require('./image_lazy_loader'),
        ad_link = require('./ad_banner.ad_link'),
        tmpl = require('./tmpl'),
        reach_bottom_px = 300,   // 距离页面底部300px时加载文件


        undefined;

    var file_list = new Module('outlink.file_list', {

        render: function() {
            if(this._inited) {
                return;
            }

            this.scroller = new Scroller(this.get_$main_box());

            this.bind_events();

            this.ajaust_size();

            selection.init(true);
            image_lazy_loader.init(this.get_$ct_list(), this.scroller);

            $('html').css('overflow', 'hidden');//避免出现滚动条
            this._inited = true;
        },

        bind_events: function() {

            var me = this;
            this.listenTo(store, 'before_refresh', function() {
                me.get_$ct_list().empty();
                widgets.loading.show();
            }).listenTo(store, 'refresh_done', function(files) {
                me.on_refresh(files);
                widgets.loading.hide();
                selection.clear();
            }).listenTo(store, 'before_load', function() {
            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
            }).listenTo(store, 'load_fail', function(msg, ret) {
                mini_tip.warn(msg);
                widgets.loading.hide();
            });

            this.listenTo(ad_link, 'show_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height - 100)+ "px");
            }).listenTo(ad_link, 'hide_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height + 100) + "px");
            }).listenTo(ad_link, 'remove_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height + 100) + "px");
            });

            this.get_$ct_list().on('click', '[data-file-id]', function(e) {
                var $target = $(e.target),
                    file_id = $target.closest('[data-file-id]').attr('data-file-id');

                if($target.is('.checkbox')) {
                    selection.toggle_select(file_id);
                } else {
                    me.trigger('action', 'enter', file_id, e);
                }
            }).on('contextmenu', function(e) {
                me.show_ctx_menu(e);
            });

            this.listenTo(this.scroller, 'scroll', function() {
                if(me.is_reach_bottom()) {
                    store.load_more();
                }
            });

            this.listenTo(global_event, 'window_resize', function() {
                me.ajaust_size();
            });
        },

        show_ctx_menu: function(e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                is_temporary = store.get_share_info()['share_flag'] == 12,
                $target_item = $(e.target).closest('[data-file-id]'),
                target_file_id = $target_item.attr('data-file-id'),
                selected_items = selection.get_selected();

            var target_in_selected = collections.any(selected_items, function(item) {
                if(item.get_id() === target_file_id) {
                    return true;
                }
            });

            //目标不在选择文件里
            if(!target_in_selected) {
                selection.clear();
                selection.select(target_file_id);
                selected_items = selection.get_selected();
            }

            var has_note = false;
            $.each(selected_items, function(i, item) {
                if(item.is_note()) {
                    has_note = true;
                    return false;
                }
            });

            var x = e.pageX,
                y = e.pageY;
            if(has_note) {
                items = [{
                    id: 'store',
                    text: '保存到微云',
                    icon_class: 'ico-null',
                    click: default_handle_item_click
                }];
            } else {
                items = [{
                    id: 'download',
                    text: '下载',
                    icon_class: 'ico-null',
                    click: default_handle_item_click
                },{
                    id: 'store',
                    text: is_temporary ? '保存到中转站' : '保存到微云',
                    icon_class: 'ico-null',
                    click: default_handle_item_click
                }];
            }

            menu = new ContextMenu({
                items: items
            });

            $target_item.addClass('context-menu');

            menu.show(x, y);
            //item click handle
            function default_handle_item_click(e) {
                me.trigger('action', this.config.id, selected_items, e);
            }
        },

        ajaust_size: function() {
            var top_h = $('#top').height(),
                win_h = $(window).height();

            this.get_$main().height(win_h - top_h);
        },

        on_refresh: function(files) {
            this.get_$ct_list().empty();
            if(!files || !files.length) {
                this.view_empty();
            } else {
                this.get_$disk_view().removeClass('ui-view-empty');
                this.get_$ct_list().append(tmpl.file_list(files)).show();
                image_lazy_loader.load_image();
                //if(this.get_$main_box().height() < $(window).height() - this.get_$top().height() && !store.get_cur_node().is_load_done()) {
                if(this.is_reach_bottom()) {
                    store.load_more();
                }
            }
        },

        on_add: function(files) {
            if(!files || !files.length) {
                return;
            }
            this.get_$ct_list().append(tmpl.file_list(files));
        },

        view_empty: function() {
            this.get_$ct_list().hide();
            this.get_$disk_view().addClass('ui-view-empty');
        },

        note_preview: function(note, extra) {

        },

        is_reach_bottom: function() {
            var $list = this.get_$ct_list(),
                $main = this.get_$main_box();

            var main_h = $main.height(),
                scroll_top = $main[0].scrollTop,
                list_h = $list[0].scrollHeight;

            if(main_h + scroll_top > list_h - reach_bottom_px) {
                return true;
            }

            return false;
        },

        get_$top: function() {
            return this._$top = this._$top || (this._$top = $('#top'));
        },

        get_$ct_list: function() {
           return this._$ct_list = this._$ct_list || (this._$ct_list = $('#_file_list'));
        },

        get_$main: function() {
           return this._$main = this._$main || (this._$main = $('#lay-main-con'));
        },

        get_$main_box: function() {
            return this._$main_box = this._$main_box || (this._$main_box = $('#_main_box'));
        },

        get_$disk_view: function() {
            return this._$disk_view = this._$disk_view || (this._$disk_view = $('#_disk_view'));
        }
    });

    return file_list;
});/**
 * 新版PC侧分享页
 */
define.pack("./ui",["lib","common","./store","./verify_code"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),
        store = require('./store'),
        verify_code = require('./verify_code'),

        undefined;

    var ui = new Module('outlink.ui', {

        render: function() {
            this._render_secret();
        },

        _render_secret: function() {
            var me = this;
            var share_info = store.get_share_info();
            if(!share_info['need_pwd']) {
                return;
            }
            if(share_info['retry']) {
                $('#_password_cnt').addClass('err');
                $('#outlink_login_err').text(share_info['msg'] || '密码错误');
            }
            //访问密码
            $('#outlink_pwd_ok').on('click', function(e) {
                var pwd = $('#outlink_pwd').val(),
                    verify_code = me.get_verify_code_text();
                if(!pwd) {
                    $('#_password_cnt').addClass('err');
                    $('#outlink_login_err').text('密码为空');
                    return;
                }
                var _data = {
                    pwd: pwd
                };
                if(me.is_need_verify_code()) {
                    _data.verify_code = verify_code;
                }
                if(me.validate()) {
                    me.trigger('action', 'secret_view', _data, e);
                }
            });
            $('#outlink_login_pass_access').on('focus', 'input', function(e) {
                me.clear();
            });
        },

        set_pwd_err_text: function(text) {
            $('#_password_cnt').addClass('err');
            $('#outlink_login_err').text(text);
        },

        set_need_verify_code: function() {
            this._need_verify_code = true;
            this._$el = $('#_verify_code_cnt');
        },

        clear: function() {
            $('#_password_cnt').removeClass('err');
            $('#outlink_login_err').text('');

            if(this._$el) {
                this._$el.find('[data-id=verify_code_text]').val('');
                this._$el.removeClass('err');
                this._$el.find('[data-id=tip]').text('');
            }
        },

        is_need_verify_code: function() {
            return !!this._need_verify_code;
        },

        get_verify_code_text: function() {
            var val;
            if(!this.is_need_verify_code()) {
                return;
            }
            val = this._$el.find('[data-id=verify_code_text]').val();
            return $.trim(val);
        },

        set_verify_err_text: function(text) {
            if(!this.is_need_verify_code()) {
                return;
            }
            this._$el.addClass('err');
            this._$el.find('[data-id=tip]').text(text);
        },

        validate: function() {
            var code;
            if(!this.is_need_verify_code()) {
                return true;
            }

            code = this.get_verify_code_text();
            if(code.length < 4) {
                this.set_verify_err_text('请输入正确的验证码')
                return false;
            }
            return true;
        }
    });

    return ui;
});/**
 * 新版PC侧分享页
 */
define.pack("./ui.note",["lib","common"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),

        undefined;

    var note = new Module('outlink.note', {

        render: function() {}

    });

    return note;
});/**
 * 新版PC侧分享页
 * @author hibincheng
 * @date 2015-05-29
 */
define.pack("./ui.photo",["lib","common","./store","./selection","./ad_banner.ad_link","./image_lazy_loader","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        collections = lib.get('./collections'),
        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        Scroller = common.get('./ui.scroller'),
        ContextMenu = common.get('./ui.context_menu'),
        store = require('./store'),
        selection = require('./selection'),
        ad_link = require('./ad_banner.ad_link'),
        image_lazy_loader = require('./image_lazy_loader'),
        tmpl = require('./tmpl'),
        reach_bottom_px = 300,   // 距离页面底部300px时加载文件


        undefined;

    var file_list = new Module('outlink.file_list', {

        render: function() {
            if(this._inited) {
                return;
            }
            if(store.get_cur_node().get_kid_count() > 1) {
                this.scroller = new Scroller(this.get_$main());

                this.bind_events();

                this.ajaust_size();

                selection.init(true);

                $('html').css('overflow', 'hidden');//避免出现滚动条
            } else {
                selection.select(store.get_cur_node().get_kid_files());
                this.show_one_img();
            }

            this._inited = true;
        },

        bind_events: function() {

            var me = this;
            this.listenTo(store, 'before_refresh', function() {
                me.get_$ct_list().empty();
                widgets.loading.show();
            }).listenTo(store, 'refresh_done', function(files) {
                me.on_refresh(files);
                widgets.loading.hide();
                selection.clear();
            });

            this.listenTo(ad_link, 'show_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height - 100)+ "px");
            }).listenTo(ad_link, 'hide_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height + 100) + "px");
            }).listenTo(ad_link, 'remove_ad', function() {
                var height = parseInt(me.get_$main().css("height"));
                me.get_$main().css("height", (height + 100) + "px");
            });

            this.get_$ct_list().on('click', '[data-file-id]', function(e) {
                var $target = $(e.target),
                    file_id = $target.closest('[data-file-id]').attr('data-file-id');

                if($target.is('.checkbox')) {
                    selection.toggle_select(file_id);
                } else {
                    me.trigger('action', 'enter', file_id, e);
                }
            }).on('contextmenu', function(e) {
                me.show_ctx_menu(e);
            });

            this.listenTo(global_event, 'window_resize', function() {
                me.ajaust_size();
            });
        },

        show_ctx_menu: function(e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                is_temporary = store.get_share_info()['share_flag'] == 12,
                $target_item = $(e.target).closest('[data-file-id]'),
                target_file_id = $target_item.attr('data-file-id'),
                selected_items = selection.get_selected();

            var target_in_selected = collections.any(selected_items, function(item) {
                if(item.get_id() === target_file_id) {
                    return true;
                }
            });

            //目标不在选择文件里
            if(!target_in_selected) {
                selection.clear();
                selection.select(target_file_id);
                selected_items = selection.get_selected();
            }

            var x = e.pageX,
                y = e.pageY;

            items = [{
                id: 'download',
                text: '下载',
                icon_class: 'ico-null',
                click: default_handle_item_click
            },{
                id: 'store',
                text: is_temporary ? '保存到中转站' : '保存到微云',
                icon_class: 'ico-null',
                click: default_handle_item_click
            }];

            menu = new ContextMenu({
                items: items
            });

            $target_item.addClass('context-menu');

            menu.show(x, y);
            //item click handle
            function default_handle_item_click(e) {
                me.trigger('action', this.config.id, selected_items, e);
            }
        },

        //控制单个大图的样式
        show_one_img: function() {
            var top_h = $('#top').height(),
                win_h = $(window).height(),
                //box_width = $(window).width(),
                box_height = win_h - top_h,
                $img_box = $('#_outlink_body'),
                $prew_img = $('#prew_img');

            $img_box.height(box_height);
            //$prew_img.css('max-height', box_height);
            //$prew_img.css('max-width', box_width);

            if($prew_img.height() > 0) {
                //prew_img有高度说明已经load完毕，直接设置margin-top,否则先隐藏
                var blank_height = (box_height - $prew_img.height());
                if(blank_height > 0) {
                    $prew_img.css('margin-top', blank_height / 3);
                }
            } else {
                $prew_img.css('display', 'none');
                $prew_img[0].onload = function(e) {
                    var blank_height = (box_height - $prew_img.height());
                    if(blank_height > 0) {
                        $prew_img.css('margin-top', blank_height / 3);
                    }
                    $prew_img.css('display', 'inline-block');
                }
            }
        },

        ajaust_size: function() {
            var top_h = $('#top').height(),
                win_h = $(window).height();

            this.get_$main().height(win_h - top_h);
        },

        get_$ct_list: function() {
            return this._$ct_list = this._$ct_list || (this._$ct_list = $('#_file_list'));
        },

        get_$main: function() {
            return this._$main = this._$main || (this._$main = $('#lay-main-con'));
        },

        get_$main_box: function() {
            return this._$main_box = this._$main_box || (this._$main_box = $('#_main_box'));
        }
    });

    return file_list;
});/**
 * 发送邮件验证码
 * @author hibincheng
 * @date 2013-12-16
 */
define.pack("./verify_code",["lib","common","$"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        constants = common.get('./constants'),
        Module = common.get('./module'),
        lowie9 = $.browser.msie && $.browser.version < 9,

        undefined;

    var verify_code = new Module('verify_code', {

        render: function() {
            if(this._rendered) {
                return;
            }

            var $el = this._$el = $('#_verify_code_cnt'),
                me = this;

            $el.on('click', '[data-action=change_verify_code]', function(e) {
                e.preventDefault();
                me.change_verify_code();
            });

            this._rendered = true;
        },

        //显示验证码
        show: function() {
            if(!this._rendered) {
                this.render();
            }
            this._has_verify_code = true;
            this.change_verify_code();
            this._$el.show();
        },

        hide: function() {
            if(!this._rendered) {
                return;
            }
            this._$el.hide();
            this._$el.find('[data-id=verify_code_text]').val('');
            this._has_verify_code = false;
        },
        //换一个验证码
        change_verify_code: function() {
            var url;
            if(!this.has_verify_code()) {
                return;
            }
            url = constants.BASE_VERIFY_CODE_URL + Math.random();
            this._$el.find('img').attr('src', url);
        },
        /**
         * 是否有验证码，当验证码显示时有，隐藏当作没
         * @returns {boolean}
         */
        has_verify_code: function() {
            return !!this._has_verify_code;
        }
    });

    return verify_code;
});
//tmpl file list:
//outlink_v2/src/ad_banner/ad.tmpl.html
//outlink_v2/src/file_path/all_checker.tmpl.html
//outlink_v2/src/file_path/file_path.tmpl.html
//outlink_v2/src/header/header.tmpl.html
//outlink_v2/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'ad_bottom': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div data-id="ad_container" class="lay-footer">\r\n\
        <i data-id="ad_close" class="icon icon-ad-close"></i>\r\n\
        <img data-id="ad_img" src="" alt="" class="ad-poster">\r\n\
    </div>');

}
return __p.join("");
},

'all_checker': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <label data-file-check class="checkall"></label>');

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
        scr_reader_mode = common.get('./scr_reader_mode'),

        name_len = constants.UI_VER === 'WEB' ? 10 : 5,
        target_node = data.target_node, // 目标目录
        nodes = data.nodes, // 当前目录的所有父节点列表
        enable = data.enable !== false, // 是否可点击
        has_more = !!data.has_more,
        z_index_start = (nodes && nodes.length || constants.DIR_DEEP_LIMIT) + 1,
        path = [],

        read_mode = scr_reader_mode.is_enable();

        if(has_more) {
    __p.push('            <a data-more style="z-index:');
_p(z_index_start+1);
__p.push(';" class="path more" href="#"><span>«</span></a>');

        }
    if (nodes && nodes.length) {
        $.each(nodes, function (i, node) {
            var first = i <= 0,
                is_cur = target_node === node,
                name = text.text(text.smart_sub(node.get_name(), name_len)),
                aria_label = read_mode?(is_cur ? '当前':'进入') + '路径：' + path.join('。'):'';
            path.push(name);
            __p.push('            <a ');
 if (!is_cur) { __p.push(' data-file-id="');
_p( node.get_id() );
__p.push('" ');
 } else {__p.push('data-cur');
} __p.push('                tabindex="0" hidefocus="on"\r\n\
                style="z-index:');
_p( z_index_start - i );
__p.push(';"\r\n\
                class="path ');
_p( is_cur ? 'current':'' );
__p.push('"\r\n\
                href="#"><span>');
_p(read_mode?aria_label:'');
_p( name );
__p.push('</span></a>');

        });
    }
    __p.push('');

return __p.join("");
},

'path_menu': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var lib = require('lib'),
            $ = require('$'),
            text = lib.get('./text'),

            common = require('common'),
            scr_reader_mode = common.get('./scr_reader_mode'),
            constants = common.get('./constants'),
            dir_deep = constants.DIR_DEEP_LIMIT + 2,

            nodes = data.nodes, // 当前目录的所有父节点列表
            enable = data.enable !== false, // 是否可点击

            read_mode = scr_reader_mode.is_enable();
    __p.push('    <div class="content-menu" style="z-index: ');
_p(dir_deep);
__p.push(';display:none;">\r\n\
        <ul class="ico-mod path-mod">');
 $.each(nodes, function(i, node) {
                name = text.text(node.get_name());
            __p.push('                <li><a data-file-id="');
_p( node.get_id() );
__p.push('" href="javascript:void(0);" tabindex="0" hidefocus="on"><i class="ico-folder"></i><span>');
_p( name);
__p.push('</span></a></li>');
 }); __p.push('        </ul>\r\n\
    </div>');

}
return __p.join("");
},

'user_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="user">\r\n\
        <div id="header-user" class="normal" style="display: block;">\r\n\
            <div class="inner">\r\n\
                <img class="user-icon" src="//q1.qlogo.cn/g?b=qq&amp;k=lLFap7ascukvnLAddfIv7Q&amp;s=100&amp;t=0" style="cursor: pointer;">\r\n\
                <i class="ico"></i>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <!-- 用户信息于旧版保持一致 -->\r\n\
    <div id="_main_face_menu"  data-no-selection class="ui-pop ui-pop-user hide">\r\n\
        <div class="ui-pop-head">\r\n\
            <span id="_main_nick_name" class="user-nick">...</span>\r\n\
            <div id="_main_space_info">\r\n\
                <div class="ui-text quota-info">\r\n\
                    <label>已使用：</label>\r\n\
                    <span id="_used_space_info_text">0G</span>\r\n\
                </div>\r\n\
                <div class="ui-text quota-info">\r\n\
                    <label>总容量：</label>\r\n\
                    <span id="_total_space_info_text">0G</span>\r\n\
                </div>\r\n\
                <div class="ui-quota" title="1%">\r\n\
                    <div id="_main_space_info_bar" class="ui-quota-bar" style="width: 1%;"></div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <ul class="ui-menu">\r\n\
            <!--<li><a id="_main_client_down" href="http://www.weiyun.com/download.html?WYTAG=weiyun.share.pc" target="_blank" tabindex="-1">下载客户端</a></li>-->\r\n\
            <li><a id="_main_feedback" href="javascript:void(0)" tabindex="-1">反馈</a></li>\r\n\
            <li><a id="outlink_login_out" href="javascript:void(0)" tabindex="0">退出</a></li>\r\n\
        </ul>\r\n\
        <i class="ui-arr"></i>\r\n\
        <i class="ui-arr ui-tarr"></i>\r\n\
    </div>');

return __p.join("");
},

'store_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="popshare-box popshare-pass-manage">\r\n\
        <div class="success">\r\n\
            <div class="msg"><i class="ico"></i>保存成功！</div>\r\n\
            <p class="pass">保存目录：');
_p(data.path);
__p.push('</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'qrcode_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="popshare popshare-qr-box">\r\n\
        <div class="img"><img id="out_link_qr_code_prew" src="');
_p(data.qrcode_src);
__p.push('"></div>\r\n\
        <div class="txt">扫描二维码，将文件下载到手机</div>\r\n\
    </div>');

return __p.join("");
},

'file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- 高级浏览器使用:hover选择器，ie6请使用鼠标悬停添加list-hover样式 -->\r\n\
    <!-- 选中样式list-selected -->\r\n\
    <!-- 拖入接收容器样式list-dropping -->\r\n\
    <!-- 不可选样式list-unselected -->\r\n\
    <!-- 不带复选框模式list-nocheckbox-->\r\n\
    <!-- 当前列表，用于右键和单行菜单模式list-menu-on-->');

    var lib = require('lib');
    var common = require('common');
    var $ = require('$');
    var text = lib.get('./text');

    var list = data;
    $.each(list, function(i, file){
        var is_dir = !!file.is_dir();
        var id = file.get_id();
        var file_name = file.get_name();
        var file_type = file.get_type();
        var thumb_url = is_dir ? '' : file.get_thumb_url();
    __p.push('    <div id="');
_p(id);
__p.push('" data-list="true" data-file-id="');
_p(id);
__p.push('" class="list-wrap share-file">\r\n\
        <div class="list clear">\r\n\
            <label class="checkbox"></label>\r\n\
            <span class="img">\r\n\
                <i data-src="');
_p(thumb_url);
__p.push('" class="filetype icon-');
_p(file_type);
__p.push('"></i>\r\n\
            </span>\r\n\
            <span class="name"><p class="text"><em>');
_p(text.text(file_name));
__p.push('</em></p></span>\r\n\
        </div>\r\n\
    </div>');

    });
    __p.push('');

return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
},

'note': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib');
        var date_time = lib.get('./date_time');
        var text = lib.get('./text');
    __p.push('    <div class="share-file-list files-view files-view-rich">');
 if(!data.article_url) { __p.push('            <div class="header">\r\n\
                <h1 class="headline">');
_p(text.text(data.title));
__p.push('</h1>\r\n\
                <div class="time" data-id="outlink_share_time">');
_p(date_time.timestamp2date(data.time));
__p.push('</div>\r\n\
            </div>\r\n\
            <div class="content ui-selected">');
_p(data.content);
__p.push('</div>');
 } else { __p.push('            <iframe frameborder="0" id="_note_article_frame" name="_note_article_frame" src=""/>');
 } __p.push('    </div>');

return __p.join("");
}
};
return tmpl;
});
