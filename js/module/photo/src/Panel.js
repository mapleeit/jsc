/**
 * 相册主面板
 * @author cluezhang
 * @date 2013-11-27
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        Composite_view_mode = require('./Composite_view_mode'),
        View_mode_group = require('./group.Panel'),
        View_mode_all = require('./photo.Panel'),
        View_mode_time = require('./time.Panel'),
        Thumb_loader = require('./photo.Thumb_loader'),
        
        $ = require('$');
    var Module = inherit(Composite_view_mode, {
        /**
         * @cfg {jQueryElement} $ct
         */
        create_thumb_loader : function(){
            return new Thumb_loader({
                width : 128,
                height : 128
            });
        },
        // 存储分组信息的store，除了分组列表外，它还会提供给其它地方使用，比如上传图片选择分组列表。
        create_group_store : function(){
            var me = this;
            return new Store({
                reload : function(){
                    var def = $.Deferred(), store = this;
                    me.get_singleton('group_loader').load().done(function(records){
                        store.load(records);
                        def.resolve();
                    }).fail(function(){
                        def.reject();
                    });
                    return def;
                }
            });
        },
        // -------------- 各视图的创建 ----------------
        create_mode_time : function(){
            return new View_mode_time({
                $ct : this.$ct,
                thumb_loader : this.get_singleton('thumb_loader')
            });
        },
        create_mode_group : function(){
            return new View_mode_group({
                $ct : this.$ct,
                thumb_loader : this.get_singleton('thumb_loader')
            });
        },
        create_mode_all : function(){
            return new View_mode_all({
                $ct : this.$ct,
                thumb_loader : this.get_singleton('thumb_loader')
            });
        }
        // ---------------视图创建结束 ----------------
    });
    return Module;
});