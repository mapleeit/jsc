/**
 * IE6 居中
 * @author jameszuo
 * @date 13-1-29
 */
define(function (require, exports, module) {
    var lib = require('lib'),


        $ = require('$'),
        collections = lib.get('./collections'),

        console = lib.get('./console'),

        $win = $(window),

        ie6 = $.browser.msie && $.browser.version < 7,

        listen,
        stop_listen,
        update,

        undefined;

    if (ie6) {


        update = function (el, fix_x, fix_y) {
            setTimeout(function () {  // 解决有时位置错误的bug
                var $el = $(el);
                if ($el.is(':visible')) {
                    var wh = get_width_height($el),
                        win_width = $win.width(),
                        win_height = $win.height(),
                        fix_x = fix_x || 0;
                        fix_y = fix_y || 0;

                    $el.css({
                        position: 'absolute',
                        left: (win_width - wh[0] + fix_x) / 2,
                        top: (win_height - wh[1] + fix_y) / 2 + $win.scrollTop(),
                        margin: 'auto'
                    });
                }
            }, 0);
        };

        listen = function (el, fix_x, fix_y) {

            stop_listen(el);

            var $el = $(el),
                center_id = $el.data('center_id');

            if (!center_id) {
                $el.data('center_id', center_id = random());
            }

            var event_names = ['resize.ui.center_' + center_id/*, 'scroll.ui.center_' + center_id*/].join(' ');

            $win.bind(event_names, function (e) {
                update($el, fix_x, fix_y);
            });
            update($el, fix_x, fix_y);
        };

        stop_listen = function (el) {
            var $el = $(el),
                center_id = $el.data('center_id');

            if (center_id) {
                $el.removeData('center_id');

                var event_names = ['resize.ui.center_' + center_id/*, 'scroll.ui.center_' + center_id*/].join(' ');
                $win.unbind(event_names);
            }
        };

    }


    // not ie6
    else {

        listen = update = function (el, fix_x, fix_y) {
            setTimeout(function () {  // 解决有时位置错误的bug
                var $el = $(el);
                if ($el.is(':visible')) {
                    var wh = get_width_height($el),
                        fix_x = fix_x || 0;
                        fix_y = fix_y || 0;

                    $el.css({
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        marginLeft: -(wh[0] / 2 + fix_x) + 'px',
                        marginTop: -(wh[1] / 2 + fix_y) + 'px'
                    });
                }
            }, 0);
        };
        stop_listen = $.noop;
    }

    var
        random = function () {
            return new Date().getTime() + Math.round(Math.random() * 1000000);
        },
        get_width_height = function ($el) {
            var w = $el.outerWidth(),// + (parseInt($el.css('padding-left')) || 0) + ( + parseInt($el.css('padding-right')) || 0),
                h = $el.outerHeight();// + (parseInt($el.css('padding-top')) || 0) + ( + parseInt($el.css('padding-bottom')) || 0);
            return [w, h];
        };

    return {

        listen: listen,
        stop_listen: stop_listen,
        update: update

    };

});