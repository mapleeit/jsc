/**
 * 外链工具类
 * User: yuyanghe
 * Date: 13-9-21
 * Time: 下午7:12
 * To change this template use File | Settings | File Templates.
 */


define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        collections = lib.get('./collections'),
        Module = common.get('./module'),
        File = common.get('./file.file_object'),

        math = Math,

        undefined;

    var util = new Module('outlink_util', {
        /**
         * 检测文件是否是图片
         * @param _name
         * @returns {*}
         */
        is_image: function (_name) {
            try {
                var me = this;
                var type = me._get_suffix(_name);
                type = me._switch_type(type);
                var images = ["jpg", "jpeg", "gif", "png", "bmp"];
                if (!type) {   //无后缀名时直接返回 false
                    return false;
                }
                return collections.contains(images, type);
            } catch (e) {
                return false;
            }
        },
        /**
         *获取文件后缀名样式
         */

        get_file_icon_class: function (_name) {
            return File.get_type(_name, false);
        },
        /**
         * 获取后缀名
         * @param _name
         */
        _get_suffix: function (_name) {
            var EXT_REX = /\.([^\.]+)$/;
            var m = (_name || '').match(EXT_REX);
            return m ? m[1].toLowerCase() : null;
        },

        //检查分享单个文件时的后缀名是否是常见文件
        xsschecktype: function (_name) {
            var me=this;
            try {
                var type = this._get_suffix(_name);
                if (!type) {   //无后缀名时直接返回 false
                    return false;
                }
                type = me._switch_type(type);
                var _fileTypeArr = ["html", "htm", "shtml", "mhtml", "hta"];
                return collections.contains(_fileTypeArr, type);
            } catch (e) {
                return false;
            }
        },

        _switch_type: function (type){
            type = type.toLowerCase();
            type = type.replace(/docx|docm|dot[xm]?/g, "doc");
            type = type.replace(/pptx|ptm/g, "ppt");
            type = type.replace(/xls[xm]?|xl[tx|tm|am|sb]+/g, "xls");
            type = type.replace(/jpeg/g, "jpg");
            return type;
        },

        /**
         * 格式化长文件名
         * @param file_name
         * @returns {*}
         */
        format_file_name : function (file_name) {
            var max_pre_length = 16,
                max_suffix_length = 10,
                file_name_pre,
                file_name_suffix;

            if (file_name.length > max_pre_length + max_suffix_length) {
                file_name_pre = file_name.substr(0, max_pre_length);
                file_name_suffix = file_name.substr(file_name.length - max_suffix_length);
                var format_name = file_name_pre + '...' + file_name_suffix;
                return format_name;
            }
            return file_name;
        },

        /**
         * 获取share_key
         */
        get_share_key:function (){
            return window.location.href.substr(window.location.href.indexOf("?") + 1).split('&')[0];
        },
        /**
         * 获取share_pwd
         */
        get_share_pwd:function (){
            return window.location.href.substr(window.location.href.indexOf("?") + 1).split('&')[1];
        },
        /**
         * 获取失败信息
         */
        get_err_msg:function(ret){
            var msg=null;
            switch (ret){
                case 1013:
                case 1024:
                    msg = '网络问题，请稍候重试。';
                    break;
                case 1020:
                    msg = '保存失败，文件已被删除或移动。';
                    break;
                case 1028:
                    msg = '保存失败，文件数超过单目录最大限制。';
                    break;
                case 1053:
                    msg = '您的网盘空间不足，未能保存这些文件。';
                    break;
                case 1119:
                    msg = '您的网盘空间已满，未能保存这些文件。';
                    break;

                case 102030: 
                    msg = '操作过于频繁，请稍后重试。';
                    break;

                case 102031: 
                    msg = '保存失败，您一次转存的文件太多。';
                    break;
                case 20003:
                    msg = '外链使用次数已用完，请联系分享者重新分享。';
                    break;
                case 114503:
                    msg = '该文件可能存在风险。';
                    break;
                default:
                    msg = '系统错误，请稍候重试。';
                    break;
            }
            return msg;
        },

        //调整图片大小
        fix_size: function ($preload_img, contains_size) {

            var img = $preload_img[0],
                img_width = img.width,
                img_height = img.height,
                img_url = img.src;

            var win_width = contains_size.width,
                win_height = contains_size.height,
                padding = contains_size.padding,
                new_img_width = math.min(img_width, win_width - padding),
                new_img_height = math.min(img_height, win_height - padding),
                limit_side, // height / width
                limit_size = '',
                size = {};

            if(img_width < win_width && img_height < new_img_height){
                return {"width": img_width, "height":img_height};
            }


            if (new_img_width === img_width && new_img_height === img_height) {
                size['width'] = img_width;
                size['height'] = img_height;
            } else {
                // 如果同时限制了高度和宽度，则只使用跟浏览器长宽比例变化大的哪一个边
                if (new_img_width < img_width && new_img_height < img_height) {
                    limit_side = 'height';
                    limit_size = new_img_height;

                    if ((img_width / new_img_width) > (img_height / new_img_height)) {
                        limit_side = 'width';
                        limit_size = new_img_width;
                    }

                } else {
                    if (new_img_width < img_width) {
                        limit_side = 'width';
                        limit_size = new_img_width;
                    }
                    else if (new_img_height < img_height) {
                        limit_side = 'height';
                        limit_size = new_img_height;
                    }
                }

                size[limit_side] = limit_size;
                if (limit_side === 'width') {
                    size['height'] = math.round(img_height / img_width * limit_size);
                } else {
                    size['width'] = math.round(img_width / img_height * limit_size);
                }
            }

            return size;
        },
        //文件大小由B转换为KB或MB
        switchSize: function(size) {
            var result = '',
                s;
            if(size < 1024) {
                result = size + 'B';
            } else if((s = size / 1024) && s < 1024) {
                result = Math.floor(s) + 'KB';
            } else {
                result = Math.floor(s / 1024) + 'MB';
            }
            return result;
        },
        isAllPic: function(fileList) {
            if(!$.isArray(fileList)) {
                fileList = [];
            }
            var isAllPic = true;
            for(var i = 0, len = fileList.length; i < len; i++) {
                if(!util.is_image(fileList[i].file_name) || !fileList[i].thumb_url) {//只要有一个文件不是图片即可,没有图片url也不能算全图片
                    isAllPic = false;
                    break;
                }
            }
            return isAllPic;
        }

    });

    return util;
});

