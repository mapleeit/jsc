/**
 * 在APPBOX中阻止一些浏览器默认行为
 * @author jameszuo
 * @date 13-1-10 下午3:57
 */
define(function (require, exports, module) {

    var
        lib = require('lib'),


        $ = require('$'),
        console = lib.get('./console'),

        constants = require('./constants'),

        doc = document,
        $body = $(doc.body),

        INPUTS = 'input, textarea', // 在这些元素上显示默认菜单

        undefined;

    // appbox 阻止一些按键
    if (constants.IS_APPBOX) {
        var
            PREVENT_CTRL_KEYS = {
                65: 0, // ctrl+A 全选
                70: 0, // ctrl+F 查找
                78: 0, // ctrl+N 新建窗口
                80: 0 // ctrl+P 打印
            },
            PREVENT_KEYS = {
                116: 0 // F5 刷新
            },
            K_BACKSPACE = 8;

        $body.on({
            // 阻止按键
            keydown: function (e) {
                var k = e.which;
                var tag_name = e.target && e.target.tagName.toUpperCase();
                if (k in PREVENT_KEYS // 直接阻止的按键
                    || (e.ctrlKey && (k in PREVENT_CTRL_KEYS)) // ctrl组合键
                    || k === K_BACKSPACE && !(tag_name === 'INPUT' || tag_name === 'TEXTAREA')) { // 退格键
                    e.preventDefault();
                }
            }
        });
    }


    $body
        // 在不可拖拽元素下拖拽时阻止
        .on('dragstart', function (e) {
            if ($(e.target).closest('.ui-draggable').length === 0) {
                e.preventDefault();
            }
        });

    // 拦截浏览器右键
    $(doc).on('contextmenu.file_list_context_menu', function (e) {
        var $target = $(e.target);
        // 文本框中按下右键时不阻止
        if (!$target.is(INPUTS)) {
            e.preventDefault();
        }
    });

});