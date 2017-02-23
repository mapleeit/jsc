/**
 * 文件列表UI抽象父类
 * @author jameszuo
 * @date 13-6-28
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
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
            //    iframe.set_title(file.get_name());
            //    iframe.show();
            //});
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
                if (!file.is_movable()  || (file.is_upload_by_tpmini() && !file.has_uploaded_by_tpmini())) {
                    cfg.has_no_move = true;
                }
                if (!file.is_renamable() || (file.is_upload_by_tpmini() && !file.has_uploaded_by_tpmini())) {
                    cfg.has_no_rename = true;
                }
                if (!file.is_downable() || (file.is_upload_by_tpmini() && !file.has_uploaded_by_tpmini())) {
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
});