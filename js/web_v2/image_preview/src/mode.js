/**
 * 图片预览
 * @author trumpli
 * @date 14-1-03
 */
define(function (require, exports, module) {
    var $ = require('$'),
        events = require('lib').get('./events'),
        event = require('common').get('./global.global_event').namespace('image_preview_event'),
        sub_mode = function (o) {
            var me = this;
            $.extend(me, o, events);
            if (me.watch_ns) {
                var len = me.watch_ns.length;
                while (len) {
                    len -= 1;
                    sub_mode.watch.call(me, me.watch_ns[len]);
                }
            }
        };
    sub_mode.watch = function (ns) {
        this.listenTo(event, ns, function () {
            var fn_name = Array.prototype.shift.call(arguments),
                match_name = ns + '_watch';
            if (this[match_name][fn_name]) {
                this[match_name][fn_name].apply(this, arguments);
            }
        });
    };
    $.extend(sub_mode.prototype, {
        get_ctx: function () {
            return this;
        },
        invoke: function (ns, args) {
            ns = ns.split('.');
            var ctx = this.get_ctx()[ns[0]];
            if (ctx) {
                args = args || [];
                if (typeof ctx === 'function') {
                    ctx.apply(this, args);
                } else if (ns[1] && typeof ctx[ns[1]] === 'function') {
                    ctx[ns[1]].apply(this, args);
                }
            }
        },
        happen: function () {
            Array.prototype.unshift.call(arguments, this.ns);
            event.trigger.apply(event, arguments);
        }
    });
    return sub_mode;
});