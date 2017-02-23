/**
 * 上传按钮下拉框选择
 * @author jameszuo
 * @date 13-3-21
 */
define(function (require, exports, module) {
    var $ = require('$'),
        common = require('common'),
        Pop_panel = common.get('./ui.pop_panel'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        panel;

    return {
        render: function () {
            // 针对读屏软件不显示上传文件夹和超大文件菜单 - james
            if (scr_reader_mode.is_enable()) return;

            var $dropdown_menu = $('#upload_dropdown_menu');
            panel = new Pop_panel({
                $dom: $dropdown_menu,//弹层对象
                host_$dom: $('#upload_dropdown_inner'),//弹层的依覆对象
                show: function () {
                    $dropdown_menu.show();
                },
                hide: function () {
                    $dropdown_menu.hide();
                },
                delay_time: 50//延时50毫秒消失
            });
        },
        hide: function () {
            panel && panel.hide();
        }
    };
});