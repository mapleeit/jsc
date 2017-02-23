/**
 * 网盘缩略图加载模块
 * @author hibincheng
 * @date 2014-06-28
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        collections = lib.get('./collections'),
        Module = common.get('./module'),
        FileNode = require('./file.file_node'),
        all_file_map = require('./file.utils.all_file_map'),

        thumb_loader, //缩略图加载器

        undefined;

    var thumb = new Module('disk_thumb', {

        push: function(files) {
            var images = this._get_img_nodes(files),
                is_virtual,
                me = this;

            if(!images.length) {
                return;
            }
            is_virtual = images[0].is_vir_node();
            this.get_loader(is_virtual, function(loader) {
                $.each(images, function(i, image) {
                    loader
                        .get(image.get_pid(), image.get_id(), image.get_name(), image.get_thumb_url())
                        .done(function(url, img) {
                            var $img = $(img), $replace_img;
                            if(!$img.data('used')){
                                $img.data('used', true);
                                $replace_img = $img;
                            }else{
                                $replace_img = $('<img />').attr('src', url);
                            }
                            me.trigger('get_image_ok', image, $replace_img);
                        });
                });
            });
        },
        /**
         * 异步获取图片加载器
         * @param callback
         */
        get_loader: function(is_virtual, callback) {
            if(!thumb_loader) {
                require.async('downloader', function(mod) {
                    var Thumb_loader = mod.get('./Thumb_loader');
                    thumb_loader = new Thumb_loader({
                        //is_virtual: is_virtual,
                        width: is_virtual ? 128 : 64,
                        height: is_virtual ? 128 : 64
                    });

                    callback(thumb_loader);
                });
            } else {
                callback(thumb_loader);
            }
        },

        /**
         * 取得真正的图片节点
         * @param file_args
         * @returns {*}
         * @private
         */
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
        },

        clear_queue: function() {
            thumb_loader && thumb_loader.destroy();
            thumb_loader = null;
        }
    });

    return thumb;
});