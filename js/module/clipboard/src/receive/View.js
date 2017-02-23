/**
 * 剪贴板模块 接收tab 列表视图
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        View = lib.get('./data.View'),
        console = lib.get('./console').namespace('clipboard'),
        ContextMenu = common.get('./ui.context_menu'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),

        undefined;

    var View = inherit(View, {

        name: 'receive_list',

        enable_empty_ui: true,

        constructor: function() {
            View.superclass.constructor.apply(this, arguments);
            this.init_highlight();
        },

        list_tpl : function(){
            return tmpl.receive_list();
        },

        tpl : function(file){
            return tmpl.receive_list_item([file]);
        },

        get_html : function(files){
            return tmpl.receive_list_item(files);
        },

        render: function($render_to) {
            this._$ct = $(tmpl.receive_view()).appendTo($render_to);
            View.superclass.render.call(this, this._$ct.find('[data-id=list_wrap]'));
        },

        after_render : function(){
            View.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            this.render_ie6_fix();

            this.init_copy();

            this
                .listenTo(global_event, 'enter_clipboard_list', function() {
                    //初始化复制工具
                    if (!this.copy) {
                        this.init_copy();
                    }
                })
                .listenTo(global_event, 'exit_clipboard_list', function() {
                    //因为contextmenu有复制且菜单是在body下的，所以事件是绑定在body上，为避免影响到其它模块的复制功能，所以切换模块时要进行销毁
                    this.copy && this.copy.destroy();
                    this.copy = null;
                });

        },

        show_empty_ui: function() {
            //this._$ct.addClass('clip-empty');
            if(!this._$empty) {
                this._$empty = $(tmpl.view_empty()).appendTo(this._$ct);
            }
            this._$empty.show();
        },

        hide_empty_ui: function() {
            this._$empty && this._$empty.hide();
        },

        // ie6 鼠标hover效果
        render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.$list
                    .on('mouseenter', me.item_selector, function () {
                        $(this).addClass(hover_class);
                    }).on('mouseleave', me.item_selector, function () {
                            $(this).removeClass(hover_class);
                    });
            }
        },

        /**
         * 初始化复制操作
         * @private
         */
        init_copy: function () {
            var me = this;

            if (!Copy.can_copy()) {
                return;
            }
            //因contextmenu是在body中的，所以不能使用container_selector
            this.copy = new Copy({
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function () {
                    var $target = me.copy.get_$cur_target(),
                        $list_item,
                        record,
                        record_id = $target.attr('record-id'),
                        content;

                    if (record_id) {//菜单上的“复制”按钮
                        record = me.store.get(record_id);
                    } else {
                        $list_item = $target.closest(me.item_selector);
                        record = me.get_record($list_item);
                    }

                    content = record.get('content');
                    user_log('CLIPBOARD_RECEIVE_CONTEXTMENU_COPY');
                    return content;

                }, this)
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok('复制成功');
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn('您的浏览器不支持该功能');
                });
        },

        init_highlight: function() {
            var me = this;
            this.listenTo(global_event, 'enter_clipboard_list', function() {
                if(me.rendered) { //已渲染列表
                    me.highlight_unread_item();
                } else {
                    me.on('afterrender', function() {
                        me.highlight_unread_item();
                    });
                }
            });
        },

        /**
         * 高亮未读的消息
         */
        highlight_unread_item: function() {
            var me = this,
                highlight_item = [];
            this.store.each(function(rd) {
                if(rd.get('unread')) {
                    me.get_dom(rd).addClass('ui-selected');
                    highlight_item.push(rd);
                }
            });

            setTimeout(function() {
               $.each(highlight_item, function(i, rd) {
                    me.get_dom(rd).removeClass('ui-selected');
                    rd.set('unread', false, true);
                });
            }, 5000);
        },
        /**
         * 右键点击记录时弹出菜单
         * @private
         * @param {Record_file} record
         * @param {jQueryEvent} e
         */
        show_ctx_menu : function(record, e){
            /*
             * 这里右键如果点击的是已选中记录，则是批量操作。
             * 如果是未选中记录，则单选它执行单操作
             */
            e.preventDefault();
            this.context_record = record;

            var menu = this.get_context_menu();


            menu.show(e.pageX, e.pageY);
            if (Copy.can_copy()) {
                menu.$el.find('[data-item-id="copy"] a')
                    .attr('data-clipboard-target', true)
                    .attr('record-id', record.id);
            }

            var me = this;
            me.is_menu_on = true;
            menu.once('hide', function(){
                record.set('menu_active', false);
                me.is_menu_on = false;
            });
        },
        /**
         * 获取右键菜单
         * @private
         */
        get_context_menu : function(){
            var menu = this.context_menu,
                items,
                me ,
                handler;
            if(!menu){
                me = this;
                handler = function(e) {
                    me.trigger('action', this.config.id, me.context_record, e, {src:'contextmenu'});
                };
                items = this.get_context_menu_cfg();
                $.each(items, function(index, item){
                    item.click = handler;
                });
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });

                menu.on('show_on', function() {
                    var $target_dom = me.get_dom(me.context_record);
                    $target_dom && $target_dom.addClass('list-hover');
                });
                menu.on('hide', function() {
                    var $target_dom = me.get_dom(me.context_record);
                    $target_dom && $target_dom.removeClass('list-hover');
                })
            }
            return menu;
        },
        get_context_menu_cfg : function(){
            var cfg = [
                {
                    id: 'delete',
                    text: '删除',
                    icon_class: 'ico-null'
                }
            ];

            if(Copy.can_copy()) {
                cfg.unshift({
                    id: 'copy',
                    text: '复制',
                    icon_class: 'ico-null'
                });
            }



            return cfg;
        },

        show: function() {
            this._$ct.show();
        },

        hide: function() {
            this._$ct.hide();
        },

        destroy: function() {
            View.superclass.destroy.apply(this, arguments);
            this._$ct.remove();
            this.context_menu = null;
        }
    });

    return View;
});