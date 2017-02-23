/**
 * 文件列表分页助手
 * @author jameszuo
 * @date ${DATE}
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),

        console = lib.get('./console').namespace('paging'),

        global_event = require('./global.global_event'),

        M = Math,

        min_line_count_list = 6,
        min_line_count_thumb = 2,

        default_options = {
            scroller: null, // common/ui/Scroller
            $container: null,
            item_width: 0,
            item_height: 0
        },

        undef;


    var PagingHelper = function (opts) {
        var o = this._options = $.extend({}, default_options, opts);
        if (o.scroller) {
            o.$container = o.scroller.get_$el();
        } else if (o.$container) {
            o.$container = $(o.$container);
        } else {
            throw '无效的参数，须指定scroller或$container';
        }
    };

    PagingHelper.prototype = {

        /**
         * 获取每行可显示的文件个数（列表模式请设置 item_width 为 0）
         * @returns {Number} 文件个数
         */
        get_line_size: function () {
            var o = this._options,
                line_size;

            // 每行应显示的文件个数（列表模式或item_width为0或'auto'时每行显示1个）
            if (o.is_list || !(o.item_width > 0)) {
                line_size = 1;
            } else {
                var ct_width = o.$container.width() - 20;
                line_size = M.max(M.floor(ct_width / o.item_width), 1);
            }
            // console.log('line_size', line_size);
            return line_size;
        },

        /**
         * 获取每页可显示的文件行数
         * @returns {Number} 行数
         * @param {Boolean} is_first_page
         */
        get_line_count: function (is_first_page) {
            var
                o = this._options,
                min_line_count = o.is_list ? min_line_count_list : min_line_count_thumb,
                line_count = is_first_page ? M.floor(o.$container.height() / o.item_height) + min_line_count : min_line_count;
            // console.log('line_count', line_count);
            // 行数
            return  line_count;
        },

        set_is_list: function (is_list) {
            this._options.is_list = is_list;
        },

        set_item_width: function (item_width) {
            this._options.item_width = item_width;
            if (item_width === 0 || item_width === 'auto') {  // item_width 为0时认为是列表模式
                this._options.is_list = true;
            }
        },

        set_item_height: function (item_height) {
            this._options.item_height = item_height;
        },

        set_$container: function ($container) {
            this._options.$container = $($container);
        }
    };


    return PagingHelper;
});