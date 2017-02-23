/**
 * 修复IE在一个元素下按下鼠标后，移动至另一元素上后，弹起鼠标会触发click事件的bug
 * @author jameszuo
 * @date 13-6-17
 */
define(function (require, exports, module) {
    var $ = require('$'),
        ie = $.browser.msie;

    if (ie) {
        var mouse_down_time,
            during = 400,
            D = Date,
            undef;

        $(function () {
            $(document.body).on('mousedown', function () {
                mouse_down_time = new D().getTime();
            });
        });

        return {
            is_click_event: function () {
                return new D().getTime() - mouse_down_time < during;
            }
        };
    }
    else {
        return {
            is_click_event: function () {
                return true;
            }
        };
    }
});