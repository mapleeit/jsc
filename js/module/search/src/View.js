/**
 * 列表视图
 * @author cluezhang
 * @date 2013-9-11
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        text = lib.get('./text'),
        
        common = require('common'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        
        tmpl = require('./tmpl'),
        Highlighter = require('./Keyword_highlighter'),
        
        // 缩略图一定会用到，所以这里引用之
        downloader = require('downloader'),
        
        $ = require('$'),
        
        Buffer_view = lib.get('./data.Buffer_view');
    var View = inherit(Buffer_view, {
        enable_empty_ui : true,
        /**
         * @cfg {Object} shortcuts (optional) 属性快捷更新映射，例如selected属性映射到一个快速切换selected样式的函数上
         */
        shortcuts : {
            menu_active : function(value){
                $(this).toggleClass('list-menu-on', value);
            },
            menu_hover : function(value){
                $(this).toggleClass('list-menu-on', value);
            }
        },
        empty_tpl : function(){
            return '<div tabindex="0" hidefocus="on">没有可显示的数据</div>';
        },
        list_tpl : function(){
            return tmpl.list();
        },
        tpl : function(record){
            return this.get_html([record]);
        },
        /**
         * 设置高亮关键字
         * @param {String} keyword
         */
        set_keyword : function(keyword){
            this.keyword = keyword;
            var highlighter = new Highlighter({
                keywords : [keyword],
                caseSensitive : false, // 后台是否区分大小写
                wrapBegin : '<span class="k">',
                wrapEnd : "</span>"
            });
            this.highlight = function(str){
                return highlighter.highlight(str, text.text);
            };
        },
        get_keyword : function(){
            return this.keyword;
        },
        get_html : function(records){
            var me = this;
            return tmpl.items({
                records : records,
                highlight : this.highlight
            });
        },
        list_selector : 'div[data-id=_search_view_list]',
        item_selector : 'div[data-list]',
        constructor : function(){
            View.superclass.constructor.apply(this, arguments);
            // 空的高亮函数
            this.highlight = function(str){
                return str;
            };
        },
        after_render : function(){
            View.superclass.after_render.apply(this, arguments);
            this.on('recordcontextmenu', this.show_context_menu, this);
            
            // IE6 hover hack
            this._render_ie6_fix();
        },
        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.$list.on('mouseenter', me.item_selector, function () {
                        $(this).addClass(hover_class);
                    }).on('mouseleave', '>div', function () {
                        $(this).removeClass(hover_class);
                    });
            }
        },
        on_clear: function() {
            View.superclass.on_clear.apply(this, arguments);
            this.thumb_loader && this.thumb_loader.destroy();
            this.thumb_loader = null;
        },
        // 以下是列表中涉及到内容变更的地方，进行自适应高度调节
        on_add : function(){
            View.superclass.on_add.apply(this, arguments);
            this.update_thumb();
        },
        on_remove : function(){
            View.superclass.on_remove.apply(this, arguments);
        },
        refresh : function(){
            View.superclass.refresh.apply(this, arguments);
            this.update_thumb();
        },

        update_thumb: function() {
            if(!this.rendered){
                return;
            }
            var me = this;

            this.get_thumb_loader().done(function(thumb_loader) {
                var thumb_state_attr = 'data-thumb-hooked';
                var $items = me.$list.find(me.item_selector + ' [data-thumb]');
                $items.each(function(){
                    var $item = $(this), record;
                    var thumb_state = $item.data(thumb_state_attr);
                    if(!thumb_state){ // 没有进行处理
                        $item.data(thumb_state_attr, true);
                        record = me.get_record($item);
                        thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                            var $img = $(img), $replace_img;
                            if(!$img.data('used')){
                                $img.data('used', true);
                                $replace_img = $img;
                            }else{
                                $replace_img = $('<img />').attr('src', url);
                            }
                            $replace_img.attr({
                                'unselectable': 'on',
                                'tabindex': '-1'
                            });
                            $item.replaceWith($replace_img);
                        });
                    }
                });
            });
        },

        get_thumb_loader: function() {
            var def = $.Deferred(),
                me = this;

            if(!me.thumb_loader) {
                require.async('downloader', function(mod) {
                    var Thumb_loader = mod.get('./Thumb_loader');
                    me.thumb_loader = new Thumb_loader({
                        width: 32,
                        height: 32
                    });
                    def.resolve(me.thumb_loader);
                });
            } else {
                def.resolve(me.thumb_loader);
            }

            return def;
        },
        /**
         * 自适应列表高度，当内容不够时撑开到屏幕大小，超出时自动扩张
         */
        /*adjust_height : function(){
            if(!this.rendered){
                return;
            }
            // 当为空白时，目标是空白节点
            var $el = this.empty_ui_visible ? this.$empty_ui : this.$list;
            // 计算屏幕可显示高度
            var container_height = $(window).height() - $el.offset().top - 12; // 12为与底部保持安全距离
            // 计算内容高度
            $el.height('auto'); // 计算前先重置高度
            var scroll_height = $el[0].scrollHeight;
            // 如果内容高度不够，帮它撑着。否则自动展开
            if(scroll_height < container_height){
                $el.height(container_height);
            }else{
                $el.height('auto');
            }
        },*/
        /**
         * 显示空白界面
         * @protected
         */
        show_empty_ui : function(){
            this.$empty_ui = $(tmpl.empty()).appendTo(this.$el.addClass('ui-view-empty'));
            this.$list.hide();
        },
        /**
         * 隐藏空白界面
         * @protected
         */
        hide_empty_ui : function(){
            this.$el.removeClass('ui-view-empty');
            this.$empty_ui.remove();
            this.$list.show();
        },
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_context_menu : function(record, e){
            e.preventDefault();
            user_log('SEARCH_LIST_CONTEXT_MENU');
            this.context_record = record;
            
            var visible_menu = {
                download : 1,
                'delete' : 1,
                share : 1,
                open_folder : 1,
                qrcode:1
            };
//            // 文件夹无法邮件分享
//            if(record.is_dir()){
//                delete visible_menu['mail_share'];
//            }

            var menu = this.get_context_menu();
            menu.show(e.pageX, e.pageY, visible_menu);
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_record, e, {src:'contextmenu'});
                };
                menu = this.context_menu = new ContextMenu({
//                    width : 160,
                    items: [
                        {
                            id: 'download',
                            text: '下载',
                            icon_class: 'ico-null',
                            click: handler
                        },
                        {
                            id: 'delete',
                            text: '删除',
                            icon_class: 'ico-null',
                            click: handler
                        },
                        {
                            id: 'open_folder',
                            text: '打开文件所在目录',
                            icon_class: 'ico-null',
                            click: handler
                        },
                        {
                            id: 'qrcode',
                            text: '获取二维码',
                            icon_class: 'ico-dimensional-menu',
                            split: true,
                            click: handler
                        },
                        {
                            id: 'share',
                            text: '分享',
                            icon_class: 'ico-share',
                            split: true,
                            click: handler
                        }
                    ]
                });
                // 两个菜单互斥
                menu.on('show', function(){
                    me.$list.addClass('block-hover');
                });
                menu.on('hide', function(){
                    me.$list.removeClass('block-hover');
                });
            }
            return menu;
        }
    });
    return View;
});