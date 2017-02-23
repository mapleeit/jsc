/**
 * 组内的图片
 * @author cluezhang
 * @date 2013-11-6
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        user_log = common.get('./user_log'),
        
        $ = require('$');
    var View = require('./photo.View'),
        tmpl = require('./tmpl'),
        jquery_ui;
    var Module = inherit(View, {
        /**
         * @cfg {Boolean} draggable
         */
        draggable : false,
        draggable_key : 'test',
        empty_type: 'folder',
        set_draggable : function(draggalbe){
            this.draggable = draggalbe;
            this.update_draggable();
        },
        list_tpl : function(){
            return tmpl.group_detail_list();
        },
        list_selector : 'div',
        set_size : function(size){
            this.size = size;
            if(!this.rendered){
                return;
            }
            var height = this.list_height = size.height;
            if(this.$empty_ui){
                this.$empty_ui.height(height);
            }
        },
        after_render : function(){
            Module.superclass.after_render.apply(this, arguments);
            var me = this;
            
            // 大写要自己设置
            if(this.size){
                this.set_size(this.size);
            }
            
            // 如果启用拖拽，则在记录上按下时，不能框选
            if(this.enable_select && this.enable_box_select){
                this.listenTo(this.selection, 'before_box_select', function($tar){
                    return !this.draggable || !this.get_record($tar);
                }, this);
            }
        },
        // ----------------------拖动-----------------
        when_draggable_ready : function(){
            var def = $.Deferred();
            
            if(jquery_ui){
                def.resolve();
            }else{
                require.async('jquery_ui', function(){
                    def.resolve();
                });
            }
            
            return def;
        },
        on_add : function(){
            Module.superclass.on_add.apply(this, arguments);
            this.update_draggable();
        },
        on_update : function(){
            Module.superclass.on_update.apply(this, arguments);
            this.update_draggable();
        },
        refresh : function(){
            Module.superclass.refresh.apply(this, arguments);
            this.update_draggable();
        },
        update_draggable : function(){
            if(!this.rendered || !this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me.$list.children(me.item_selector);
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $(tmpl.group_photo_drag_helper());
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },
        handle_start_drag : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.draggable || !record){
                return false;
            }
            var photos = [];
            // 如果拖动的图片已经选中，则表示拖动所有选中的图片
            if(record.get('selected')){
                photos = this.get_selected();
            }else{ // 反之，只拖动当前一张，并清除选中
                this.store.each(function(rec){
                    rec.set('selected', rec === record);
                });
                photos = [record];
            }

            ui.helper.html(tmpl.group_photo_drag_helper_content({ records : photos }));
            ui.helper.data('records', photos);
            
            var me = this,
                tasks = this.dragging_thumb_tasks = [],
                imgs = ui.helper.find('img');
            $.each(imgs, function(index, dom){
                var record = photos[index];
                tasks[index] = me.thumb_loader.get(record.get_pid(), record.get_id(), record.get_name(), record.get_thumb_url()).done(function(url, img){
                    var $img = $(img), $replace_img;
                    if(!$img.data('used')){
                        $img.data('used', true);
                        $replace_img = $img;
                    }else{
                        $replace_img = $('<img />').attr('src', url);
                    }
                    var $dom = $(dom);
                    $replace_img.attr('class', $dom.attr('class'));
                    $dom.replaceWith($replace_img);
                });
            });
        },
        handle_stop_drag : function(){
            $.each(this.dragging_thumb_tasks, function(index, task){
                task.reject();
            });
        },
        // ------------------- 拖动 结束 -----------------
        get_context_menu_cfg : function(){
            return [
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'download',
                    text: '下载'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'delete',
                    text: '删除'
                },
                {
                    id: 'set_as_cover',
                    icon_class: 'ico-null',
                    group: 'edit',
                    text: '设置为封面'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'set_group',
                    text: '更改分组'
                },
                {
                    icon_class: 'ico-null',
                    group: 'edit',
                    id: 'jump',
                    text: '查看所在目录'
                },
                {
                    icon_class: 'ico-dimensional-menu',
                    group: 'edit',
                    id: 'qrcode',
                    split: true,
                    text: '获取二维码'
                },
                {
                    icon_class: 'ico-share',
                    group: 'edit',
                    id: 'share',
                    split: true,
                    text: '分享'
                }
            ];
        }
    });
    return Module;
});