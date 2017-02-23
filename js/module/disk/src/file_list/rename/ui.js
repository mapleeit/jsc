/**
 *
 * @author jameszuo
 * @date 13-3-5
 */
define(function (require, exports, module) {
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
                    mini_tip.ok(node.is_tempcreate() ? '新建文件夹成功' : '更名成功');
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
});