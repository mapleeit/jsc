/**
 * 子分组视图里的titlebar
 * @author cluezhang
 * @date 2013-11-22
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {String} title 初始标题
         */
        /**
         * @cfg {Boolean} border 是否初始显示分隔样式（用于图片列表往下拖后划清界限）
         */
        /**
         * @event back 当点击返回时触发
         */
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * 更新标题
         * @param {String} title 参考{@link #title}
         */
        set_title : function(ttile){
            // TODO
        },
        /**
         * 设置是否显示分隔线
         * @param {Boolean} border 参考{@link #border}
         */
        set_border : function(border){
            // TODO
        },
        /**
         * 渲染节点
         */
        render : function($el){
            // TODO
        },
        /**
         * 回收
         */
        destroy : function(){
            // TODO
        }
    });
    return Module;
});