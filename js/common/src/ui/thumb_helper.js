/**
 * 缩略图样式调整，根据屏幕宽度重新算width
 * @author jameszuo
 * @date ${DATE}
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),

        default_options = {
            container: null,
            item_selector: null,
            height_selector: null,
            box_width: 0
        },

        undefined;


    var ThumbHelper = function (opts) {
        if (opts.container) {
            opts.container = $(opts.container);
        } else {
            throw '无效的参数，须指定$container';
        }
        this._options = $.extend({}, default_options, opts);
    };

    ThumbHelper.prototype = {

        /**
         * 获取文件DOM节点列表
         * @returns {DOM} 文件列表
         */
        get_$list: function () {
            this.$list = this._options.container.find(this._options.item_selector);
            return this.$list;
        },

        is_empty: function() {
            return this._options.container && this.get_$list().length === 0;
        },

        /**
         * 判断是box是否有变化
         * @returns {Boolean} is_change
         * @param {Number} box_width
         * @param {Boolean} is_refresh
         */
        is_change: function(box_width, is_refresh) {
            if(!is_refresh && this._options.box_width === box_width) {
                return false;
            }
            this._options.box_width = box_width;
            return true;
        },

        /**
         * 活动每个item项的width值，每个item的宽度范围为180~200px，margin为15px
         * @returns {Number} 宽度
         * @param {Number} box_width
         */
        get_item_width: function(box_width) {
            box_width = box_width - 20; //预留20px空白
            if(box_width < 0) {
                return 200;
            }
            var max = Math.floor(box_width / 195),
                min = Math.floor(box_width / 215),
                count = Math.abs(max - min) > 0? max : min,
                item_width = Math.round(box_width / count);
            return item_width > 215? 200 : item_width-15;
        },

        /**
         * 屏幕窗口大小变化，重新计算
         * @param {Number} box_width
         * @param {boolean} is_refresh 强制刷新
         */
        update_item_width: function(box_width, is_refresh) {
            if(!this.is_empty() && this.is_change(box_width, is_refresh)) {
                var me = this,
                    list = this.get_$list(),
                    item_width = this.get_item_width(box_width),
                    item_height = Math.round(item_width * 0.75);

                $.each(list, function(index, item) {
                    $(item).css('width', item_width + 'px');
                    if(me._options.height_selector && $(item).find(me._options.height_selector).length > 0) {
                        $(item).find(me._options.height_selector).css('height', item_height + 'px');
                    }
                });
            }
        },

        set_$container: function (container) {
            this._options.container = $(container);
            this.$list = null;
        },

        destroy: function() {

        }
    };


    return ThumbHelper;
});