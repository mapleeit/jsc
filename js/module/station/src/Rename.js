/**
 * 通用重命名操作类
 */
define(function(require, exports, module) {
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
        File = common.get('./file.file_object'),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',
        undefined;

    var Rename = inherit(Event, {

        start: function(file, $file_name, e) {
            var ori_name = file.get_name();
            var me = this;
            this.$file_name = $file_name;
            me.start_rename(file, function(new_name) {
                if(ori_name !== new_name) {//有变化才修改
                    me.do_rename(file, new_name);
                } else {
                    me.remove_rename_editor();
                }
            });

            this.renaming = true;
        },
        /**
         * 开始重命名
         * @param {File_record} file 文件对象
         * @param {Function} rename_callback 实际重命名回调方法
         */
        start_rename: function(file, rename_callback) {
            var file_name = file.get_name();
            var $input;
            var $editor = this.$editor = this.get_$rename_editor();
            $input = this.$editor.find('input[type=text]');

            var me = this;
            this.$file_name
                .hide()
                .after($editor.show());

            var auto_blur_handler = function(e){
                if(!$(e.target).is($input)){
                    $input.blur();
                }
            }, $body = $(document.body);
            $body.on('mousedown', auto_blur_handler);
            $input.val(file_name).focus()
                .on(key_event + '.rename', function(e) {
                    if (e.which === 13) {//ENTER
                        var val = $.trim(this.value),
                            dotLastIndex = val.lastIndexOf('.');
                        if(!val || dotLastIndex === 0 && val.length > 1) {
                            return;
                        }

                        if(file_name === val) {//未修改
                            me.remove_rename_editor();
                            return;
                        }
                        var err = File.check_name(val);
                        if(err) {
                            mini_tip.error(err);
                            return;
                        }
                        rename_callback(val);

                    } else if (e.which == 27) { //ESC
                        me.remove_rename_editor();
                    }
                })
                .on('blur.rename', function(e) {
                    var val = $.trim(this.value),
                        err = File.check_name(val),
                        dotLastIndex = val.lastIndexOf('.');
                    if(err) {
                        mini_tip.error(err);
                        me.remove_rename_editor();
                    } else if(val && val !== file_name && !(dotLastIndex === 0 && val.length > 1)) {
                        rename_callback(val);
                    } else {
                        me.remove_rename_editor();
                    }
                    $body.off('mousedown', auto_blur_handler);
                });

            me._select_text_before($input, '.');//聚焦选中

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
        },

        /**
         *真正重命名
         * @param {File_record} file 文件对象
         * @param {String} new_name 新的文件名
         */
        do_rename: function(file, new_name) {
            var me = this,
                data = {
                    ppdir_key: '',
                    pdir_key: file.get_pid(),
                    file_list: [{
                        file_id: file.get_id(),
                        filename: new_name,
                        src_filename: file.get_name()
                    }]
                };
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskFileBatchRename',
                cavil: true,
                pb_v2: true,
                body: data
            })
                .ok(function(msg, body) {
                    var result = body['file_list'] && body['file_list'][0] || {};
                    if(result.retcode) {
                        mini_tip.warn(result.retmsg || '更名失败');
                        return;
                    }
                    mini_tip.ok('更名成功');
                    file.set('filename', new_name);
                })
                .fail(function(msg, ret) {
                    mini_tip.warn(msg || '更名失败');
                })
                .done(function() {
                    me.remove_rename_editor();
                });

        },

        remove_rename_editor: function() {
            this.$file_name.show();
            this.$editor.remove();
            this.renaming = false;
        },

        get_$rename_editor: function() {
            return $('<span class="fileedit" style=""><input class="ui-input" type="text" value=""></span>');
        }
    });

    return Rename;
});