/**
 * 多页、内容分批加载的文档预览
 * @author cluezhang
 * @date 2013-12-10
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Base = require('./previewer.Base'),
        tmpl = require('./tmpl'),
        $ = require('$');
    var Module = inherit(Base, {
        automatic_load : 0,
        iframe_layout : 'auto', // 自动加载的话，一般都是iframe自行撑开
        max_automatic_load : 3, // 后手，如果自动加载更多达到此限制后，就中止，防止异常逻辑。
        constructor : function(cfg){
            Module.superclass.constructor.apply(this, arguments);
            // 绑定if loading逻辑
            var me = this;
            me.scroll_handler = function(){
                me.if_loadmore();
            };
            me.$container.on('scroll', me.scroll_handler);
            
            // 第一次加载成功后，显示加载更多的界面
            this.on('load', this.update_loadmore_visible, this);
        },
        init_dom : function(){
            var $ct = this.$container;
            $ct.html(tmpl.dynamic_preview());
            
            var find_previewer_el = function(name){
                return $ct.find('[data-name=preview-'+name+']');
            };
            
            this.$loadmore = find_previewer_el('loadmore');
            this.$loadmore_ct = find_previewer_el('loadmore-container');
            this.$content = find_previewer_el('content');
        },
        update_loadmore_visible : function(){
            this.$loadmore.toggle(!this.loader.is_complete());
        },
        /**
         * 当容器大小改变时触发，此时显示区域大小变动，可能可以加载更多的内容。
         * @param {Number} width
         * @param {Number} height
         */
        on_resize : function(width, height){
            this.if_loadmore();
        },
        /**
         * 加载更多内容
         * @private
         * @param {Boolean} automatic 标识是否为自动触发的加载，见{@link #if_loadmore}的参数
         */
        loadmore : function(automatic){
            var me = this,
                loader = me.loader;
            if(loader.is_loading() || loader.is_complete()){
                return;
            }
            var def = me.do_load();
            
//            if(def){
                def.done(function(){
                    me.update_loadmore_visible();
                    if(automatic){
                        me.automatic_load ++;
                        if(me.automatic_load > me.max_automatic_load){
                            return;
                        }
                    }
                    setTimeout(function(){
                        me.if_loadmore(true);
                    }, 1000);
                });
//            }
            
            return def;
        },
        /**
         * 是否滚动条拖到最下了，要加载更多？
         * @private
         * @param {Boolean} automatic 是否为自动触发的加载，如果是自动触发的则会限定最大递归加载次数。如果是人为的，则无限制。
         */
        if_loadmore : function(automatic){
            var me = this,
                $ct = me.$container,
                $loadmore = me.$loadmore,
                loader = me.loader;
            if(loader.is_complete()){
                return;
            }
            if($loadmore.offset().top <= $ct.offset().top + $ct.height() + 100){
                this.loadmore(automatic);
            }
        },
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            this.$container.off('scroll', this.scroll_handler);
        }
    });
    
    return Module;
});