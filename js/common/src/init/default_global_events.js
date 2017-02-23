/**
 * 一些默认事件（如窗口resize、按下esc等）
 * @author jameszuo
 * @date 13-3-19
 */
define(function (require, exports, module) {

    var
        $ = require('$'),
        lib = require('lib'),

        events = lib.get('./events'),

        global_event = require('./global.global_event'),
        functional = require('./util.functional'),
        os = require('./util.os'),

        $win = $(window),
        $doc = $(document),

        BEFORE_WINDOW_RESIZE= 'before_window_resize',
        WINDOW_RESIZE = 'window_resize',
        WINDOW_RESIZE_REAL_TIME = 'window_resize_real_time',
        WINDOW_SCROLL = 'window_scroll',
        PRESS_KEY_ESC = 'press_key_esc',
        PAGE_UNLOAD = 'page_unload',

        resize_timer,
        rt_resize_timer,
        scroll_timer,
        win_width = $win.width(),
        win_height = $win.height(),

        is_windows = os.name.indexOf('windows') > -1,

        undefined;

    // 监听 window.resize 事件，并广播
    $win
        .on('resize.default_events', function () {
            var w = $win.width(),
                h = $win.height();

            if (w === 0 || h === 0) {  // hack appbox 最小化时会触发resize事件的bug
                return;
            }


            clearTimeout(resize_timer);

            resize_timer = setTimeout(function () {
                global_event.trigger(BEFORE_WINDOW_RESIZE);
                var new_width = $win.width(),
                    new_height = $win.height();

                if (win_width != new_width || win_height != new_height) {

                    win_width = new_width;
                    win_height = new_height;

                    global_event.trigger(WINDOW_RESIZE, win_width, win_height);
                }
            }, 200);

            clearTimeout(rt_resize_timer);
            rt_resize_timer = setTimeout(function () {
                global_event.trigger(WINDOW_RESIZE_REAL_TIME, $win.width(), $win.height());
            }, 60);
        })

        .on('scroll.default_events', is_windows ? function () {

            clearTimeout(scroll_timer);

            // windows 性能较差，延迟200毫秒后处理
            scroll_timer = setTimeout(function () {

                global_event.trigger(WINDOW_SCROLL);

            }, 200);
        } : function () {
            global_event.trigger(WINDOW_SCROLL);
        })

        .one('unload.default_events', function () {
            global_event.trigger(PAGE_UNLOAD);
        });

    // 监听 esc 事件，并广播
    $doc
        .on(($.browser.msie && $.browser.version < 7) ? 'keypress.default_events' : 'keydown.default_events', function (e) {
            if (e.which === 27) {
                global_event.trigger(PRESS_KEY_ESC);
            }
        });

});