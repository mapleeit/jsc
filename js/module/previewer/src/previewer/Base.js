/**
 * 最基本的预览，直接显示一个全屏的iframe。
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Loader = require('./loader.Base'),
        iframe_load_helper = require('./iframe_load_helper'),
        $ = require('$');
    var Module = inherit(Event, {
        background : '#808080',
        loaded : false,
        /**
         * @cfg {String} iframe_layout 如何设定iframe大小，共有3种值：
         * none : 什么都不做，没有iframe时适用（例如Txt预览）
         * fit : 将它设定为 100%大小，容器不带滚动条，只有1个iframe并自带布局时适用（例如ppt？）
         * auto : 尝试读取内容大小，并自动通知外界当前内容大小。
         */
        iframe_layout : 'auto',
        /**
         * @cfg {jQueryElement} $container
         */
        /**
         * @cfg {Loader} loader
         */
        Loader : Loader,
        constructor : function(cfg){
            $.extend(this, cfg);
            this.loader = new this.Loader({
                properties : this.properties
            });
            this.init_dom();
            this.init_container();
            switch(this.iframe_layout){
                case 'fit':
                    this.on('iframeloaded', this.fit_iframe, this);
                    break;
                case 'auto':
                    this.accumulate_size = {
                        width : 0,
                        height : 0
                    };
                    this.on('iframebeforeload', this.set_iframe_noscrolling, this);
                    this.on('iframeloaded', this.adjust_iframe, this);
                    break;
                // case 'none':
                default:
                    break;
            }
        },
        init_container : function(){
            // fit不带滚动条，其它的都带
            var has_scrollbar = this.has_scrollbar = this.iframe_layout !== 'fit';
            this.$container.css({
                overflow : has_scrollbar ? 'auto' : 'visible',
                backgroundColor : this.background
            });
        },
        /**
         * @private
         */
        fit_iframe : function($iframe){
            $iframe.css({
                height : '100%',
                width : '100%'
            });
        },
        /**
         * @private
         */
        set_iframe_noscrolling : function($iframe){
            $iframe.attr('scrolling', 'no').css('overflow', 'hidden');
        },
        /**
         * @private
         */
        adjust_iframe : function($iframe){
            var size = this.get_iframe_size($iframe),
                accumulate_size = this.accumulate_size;
            $iframe.width(size.width).height(size.height);
            var old_total_width = accumulate_size.width,
                old_total_height = accumulate_size.height,
                total_width, total_height;
            total_width = accumulate_size.width = Math.max(old_total_width, size.width);
            total_height = accumulate_size.height = old_total_height + size.height;
            
            // 当为auto布局时，要外界配合进行大小调整，以避免显示过多空白区域
            if(this.iframe_layout === 'auto'){
                this.trigger('contentresize', total_width, total_height, this.has_scrollbar);
            }
        },
        get_iframe_size : function($iframe){
            var $content, width, height;
            try{
                $content = $iframe.contents();
                width = $content.width();
                height = $content.height();
            }catch(e){
                // 当跨域后，返回一个万金油大小
                return {
                    width : 700,
                    height : 500
                };
            }
            return {
                width : width,
                height : height
            };
        },
        init_dom : function(){
            this.$content = this.$container;
        },
        init : function(){
            var me = this;
            var def = this.do_load();
//            if(def){
                def.fail(function(type, errorno){
                    me.show_failure(type, errorno);
                });
//            }
            return def;
        },
        // private
        do_load : function(){
            var me = this;
            var def = me.loader.get();
//            if(def){
                def.done(function(response){
                    me.do_render(response);
                });
//            }
            return def;
        },
        do_render : function(response){
            var me = this,
                files = response.files,
                host = 'http://' + response.host,
                url_prefix = response.url_prefix,
                iframe_srcs = [];
            if(!/^\//.test(url_prefix)){
                url_prefix = '/' + url_prefix;
            }
            $.each(files, function(index, file){
                me.add_iframe(host + url_prefix + file);
            });
        },
        add_iframe : function(src){
            var me = this,
                $iframe = $('<iframe frameborder="0"></iframe>').css({
                    'visibility': 'hidden',
                    'width': 'auto',
                    'height': 'auto'
                }).attr('src', src).appendTo(me.$content);
            
//            if(!me.loaded){
                me.trigger('iframebeforeload', $iframe);
                iframe_load_helper.hook($iframe).done(function(){
                    $iframe.css('visibility', '');
                    if(!me.loaded){
                        me.loaded = true;
                        me.trigger('load');
                    }
                    me.trigger('iframeloaded', $iframe);
                }).progress(function(state){
                    if(state === 'contentDetected'){
                        me.trigger('iframecontentdetected', $iframe);
                    }
                });
//            }
            
            return $iframe;
        },
        show_failure : function(){
            this.trigger('failure');
        },
        destroy : function(){
            this.stopListening();
            this.on_destroy();
        },
        on_destroy : function(){
            this.$content.empty();
            this.loader.abort();
        }
    });
    return Module;
});