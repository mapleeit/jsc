/**
 * 点击流统计配置表
 * @author jackbinwu
 * @date 13-5-7
 */
define(function (require, exports, module) {

    var
        lib = require('lib'),


        console = lib.get('./console').namespace('click_tj'),
        ops = require('./configs.ops');

    return {
        /**
         * 为需要点击统计的元素生成 HTML 属性名和属性值，包含这些属性的元素在点击时会自动统计
         * @param {String} op_name 参考 user_log 中的 click_ops
         * @returns {string}
         */
        make_tj_str: function (op_name) {
            var op_cfg = ops.get_op_config(op_name);
            if (op_cfg) {
                return 'data-tj-action="btn-adtag-tj" data-tj-value="' + op_cfg.op + '"';
            } else {
                return '';
            }
        },

        with_$el: function ($el, op_name) {
            var op_cfg = ops.get_op_config(op_name);
            if (op_cfg) {
                $el.attr('data-tj-action', 'btn-adtag-tj').attr('data-tj-value', op_cfg.op);
            }
        }
    };
});