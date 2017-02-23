/**
 * 基于文档预览有office预览和永中预览两套方案，而office预览能支持的文件和浏览器有限，所以当office预览不支持时降级采用永中预览
 * 后续图片和压缩包预览都可以整进来作为统一的入口，然后再分派对应的预览模块进行预览
 * @author hibincheng
 * @date 2014-05-12
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),
        routers = lib.get('./routers'),

        Module =require('./module'),
        constants = require('./constants'),
        File = require('./file.file_object'),
        widgets = require('./ui.widgets'),
        query_user = require('./query_user'),
	    huatuo_speed = require('./huatuo_speed'),

        OFFICE_PREVIEW_TYPES = { xls: 1, xlsx: 1,  doc: 1, docx: 1,  ppt: 1, pptx: 1},//微软预览支持的文件类型
        FTN_PREVIEW_TYPES = { xls: 1, xlsx: 1, doc: 1, docx: 1, rtf: 1, ppt: 1, pptx: 1, pdf: 1,txt: 1 },
        ie67 = $.browser.msie && $.browser.version < 8,//ie67不支持office预览
        ie8 = $.browser.msie && ($.browser.version == 8),
        MB_1 = 1024 * 1024,

        doc_preview,   //永中预览模块
        office_preview, //office预览模块
        ftn_preview,    //ftn预览模块

        downloader, //下载模块

        undefined;

    var user_uin = query_user.get_uin_num() + '';
    var alpha_user = query_user.is_alpha_user();

    var can_use_ftn = function() {
        //return $.inArray(user_uin.split('').pop(), uin_suffix) > -1 || $.inArray(user_uin, white_list) > -1;  //灰度帐号
        return true;
    };

    var preview_dispatcher = new Module('preview_dispatcher', {

        is_preview_doc: function(file) {
           var file_name = file.get_name(),
                type_support = this.is_preview_by_name(file_name);
           //离线文件暂时不让预览
           if(file.is_offline_node && file.is_offline_node()) {
               return false;
           }
           return type_support;
        },

        /**
         * 根据扩展名判断该文件是否是可预览类型
         * @param file_name
         */
        is_preview_by_name: function(file_name) {
            //直接获取后缀名来判断，因为使用get_type() xlsm会被认为xls，但xlsm还不能预览
            var type = (File.get_ext(file_name, false) || '').toLowerCase();
            if(ie67) { //ie67不支持
                return false;
            }
            return (type in OFFICE_PREVIEW_TYPES) || (type in FTN_PREVIEW_TYPES);
        },

        //判断是否支持微软预览，此次避免影响现有的预览类型
        can_ms_preview: function(file) {
            var type = (File.get_ext(file.get_name(), false) || '').toLowerCase();
            if(ie67) { //ie67不支持
                return false;
            }
            //离线文件暂时不让预览
            if(file.is_offline_node && file.is_offline_node()) {
                return false;
            }
            return (type in OFFICE_PREVIEW_TYPES);
        },

        preview: function(file) {
            var me = this,
                type = (file.get_type() || '').toUpperCase(),
                limit_size = (type === 'XLS' || type == 'XLSX')? constants.DOC_PREVIEW_SIZE_LIMIT['XLS'] : constants.DOC_PREVIEW_SIZE_LIMIT['DEFAULT'],
                limit_mb = limit_size/MB_1,
                is_pass_limit = file.get_size() > limit_size;

            /*if(is_pass_limit) { // office预览，超过大小限制，则采用提示下载
                this.guide_to_download(file, limit_mb);
                return;
            }*/
            //压缩包内文档暂不支持预览
            /*if(file.is_compress_inner_node && file.is_compress_inner_node()) {//压缩包内文件预览，则不尝试appbox全屏预览
                me.preview_doc(file);
            }*/
            me.appbox_preview(file).fail(function() {
                me.preview_doc(file);
            });
        },
        /**
         * 尝试使用 appbox 的全屏预览功能
         * @param {FileNode} file
         * @returns {jQuery.Deferred}
         * @private
         */
        appbox_preview: function (file) {
            var ex = window.external,
                def = $.Deferred(),
            // 判断 appbox 是否支持全屏预览
                support = constants.IS_APPBOX && (
                    ex.PreviewDocument && ex.IsCanPreviewDocument && ex.IsCanPreviewDocument(file.get_name()));
            if (support) {
                require.async('full_screen_preview', function (mod) {
                    try {
                        var full_screen_preview = mod.get('./full_screen_preview');
                        full_screen_preview.preview(file);
                        def.resolve();
                    } catch (e) {
                        console.warn('全屏预览失败，则使用普通预览, file_name=' + file.get_name());
                        def.reject();
                    }
                });
            } else {
                def.reject();
            }
            return def;
        },

        /**
         * 文档预览
         * @param {FileObject} file
         * @private
         */
        preview_doc: function (file) {
            if(can_use_ftn() || (file.get_type() || '').toLowerCase() == 'txt') {
                if(ftn_preview) {
                    ftn_preview.preview(file);
                } else {
                    //测速
                    var js_css_start = new Date();
                    require.async('ftn_preview', function(mod) {//测速
	                    try{
		                    var flag = '21254-1-16';
		                    huatuo_speed.store_point(flag, 2, new Date() - js_css_start);
		                    huatuo_speed.report();
	                    } catch(e) {

	                    }
                        ftn_preview = mod.get('./ftn_preview');
                        ftn_preview.preview(file);
                    });
                }
            } else {
                if(office_preview) {
                    office_preview.preview(file);
                } else {
                    require.async('office_preview', function (mod) {
                        office_preview = mod.get('./office_preview');
                        office_preview.preview(file);
                    });
                }
            }
        },

        /**
         * 大于限制预览大小即提示下载
         * @param {FileNode} file
         * @param {Number} limit_mb 预览文件限制大小
         */
        guide_to_download: function(file, limit_mb) {
            widgets.confirm('温馨提示', '您访问的文件大于' + limit_mb + 'MB，暂时无法在线预览，请下载后在电脑中打开。', '', function(e) {
                if(file.is_compress_inner_node && file.is_compress_inner_node() && file.down_file) {//压缩包内文件，使用自身的下载方法
                    file.down_file();
                    return;
                }
                if(!downloader) {
                    require.async('downloader', function(mod) {
                        downloader = mod.get('./downloader');
                        downloader.down(file, e);
                    });
                } else {
                    downloader.down(file, e);
                }
            }, $.noop, ['下载', '取消']);
        }
    });

    return preview_dispatcher;
});