/**
 * 上传按钮下拉框选择
 * @author jameszuo
 * @date 13-3-21
 */
define(function (require, exports, module) {
    var $ = require('$'),
        Pop_panel = require('common').get('./ui.pop_panel'),
        panel;

    return {
        render: function (o) {
            var $dropdown_menu = $('#upload_dropdown_menu');
            panel = new Pop_panel({
                $dom: $dropdown_menu,//弹层对象
                host_$dom: o.host,
                show: function () {
                    var offset = this.o.host_$dom.offset();
                    var height = this.o.host_$dom.height();
                    $dropdown_menu.css({
                        top: offset.top+height-1,
                        left: offset.left
                    }).show();
                },
                hide: function () {
                    $dropdown_menu.hide();
                },
                delay_time: 50//延时50毫秒消失
            });
        },
        hide: function () {
            panel.hide();
        }
    };
});