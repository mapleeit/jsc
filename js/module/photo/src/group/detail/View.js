/**
 * 分组详情面板，含以下逻辑：
 * 渲染主框架，可destroy
 * 渲染并管理InnerPhotoView、AsideGroupList、TitleBar
 * 代理PhotoView、AsideGroupList、TitleBar的动作事件，传递给外部？
 * @author cluezhang
 * @date 2013-11-22
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        store = lib.get('./store'),
        
        Photo_view = require('./group.detail.Photo_view'),
        Group_list = require('./group.detail.grouplist.View'),
        Titlebar = require('./group.detail.Titlebar'),
        
        common = require('common'),
        user_log = common.get('./user_log'),
        Scroller = common.get('./ui.scroller'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        
        tmpl = require('./tmpl'),
        
        get_aside_toggle_key = function(){
            return 'photo-group-detail-aside' + query_user.get_uin_num();
        },
        
        $ = require('$');
    var Module = inherit(Event, {
        /**
         * @cfg {Store} inner_photo_store
         */
        /**
         * @cfg {Thumb_loader} photo_thumb_loader
         */
        /**
         * @cfg {Store} group_store
         */
        /**
         * @cfg {Thumb_loader} group_thumb_loader
         */
        /**
         * @event toggle 切换aside_visible时触发
         * @param {Boolean} aside_visible
         */
        /**
         * @event reachbottom 图片列表拖动到最底下时触发
         */
        /**
         * @cfg {Boolean} aside_visible 初始时侧边栏是否显示
         */
        /**
         * @cfg {Object} size 初始时它的大小是多少
         */
        titlebar_selector : '.photo-group-back',
        main_list_selector : '.photo-view-box',
        photo_view_selector : '.photo-view-box-inner',
        group_list_selector : '.photo-group-aside',
        aside_toggle_selector : '.photo-group-aside-toggle',
        back_selector : '.photo-group-back>.back',
        
        aside_class : 'photo-view-group-aside',
        
        dragdrop_key : 'group_photo_draggable',
        
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        set_size : function(size){
            // 分发大小，同步到inner_photo_view当中
            this.size = size;
            if(!this.rendered){
                return;
            }
            var photo_view = this.get_photo_view(true),
                photo_view_height = size.height - this.$titlebar.height();
            this.$photo_list_ct.height(photo_view_height);
            if(photo_view){
                photo_view.set_size({
                    width : size.width, // TODO 或可考虑减掉侧边栏
                    height : photo_view_height
                });
            }
            this.handle_view_change();
        },
        /**
         * @private
         * 更新是否要显示分隔符
         */
        if_show_border : function(){
            if(!this.rendered){
                return;
            }
            // IE6下修改正在滚动的节点的父节点样式，会导致滚动中断。改为直接style修改。
            if(this.$photo_list_ct.scrollTop() > 0){
                this.$main_list_ct.css({
                    'border-top': '1px #d8dce5 solid'
                });
            }else{
                this.$main_list_ct.css({
                    'border-top': '1px #fff solid'
                });
            }
//            this.$el.toggleClass('photo-view-box-bordertop', this.$photo_list_ct.scrollTop() > 0);
        },
        /**
         * 渲染到指定容器中
         * @param {jQueryElement} $ct
         */
        render : function($ct){
            // 根据是否展开侧边栏，来决定是否进行构造
            var $el = this.$el = $(tmpl.group_detail_panel()).appendTo($ct);
            this.$titlebar = $el.find(this.titlebar_selector);
            this.$main_list_ct = $el.find(this.main_list_selector);
            this.$photo_list_ct = $el.find(this.photo_view_selector);
            this.$group_list_ct = $el.find(this.group_list_selector);
            
            var scroller = this.scroller = new Scroller(this.$photo_list_ct);
            
            this.rendered = true;
            
            // 更新当前分组标题
            this.handle_group_change();
            
            // 渲染图片列表
            var photo_view = this.get_photo_view();
            photo_view.render(this.$photo_list_ct);
            
            // 根据展开情况来选择是否渲染右侧分组列表
            // 从持久化store中取上次保存的值。如果没有，则用默认值。
            var default_aside_visible = store.get(get_aside_toggle_key());
            switch(default_aside_visible){
                case 'true':
                    default_aside_visible = true;
                    break;
                case 'false':
                    default_aside_visible = false;
                    break;
                default:
                    default_aside_visible = this.aside_visible;
                    break;
            }
            this.set_aside_visible(default_aside_visible);
            if(this.aside_visible){
                this.render_group_list();
            }
            
            // 更新大小 （这里放在图片列表后执行，以便使它高度正确初始化）
            if(this.size){
                this.set_size(this.size);
            }
            
            // 后续事件绑定
            var me = this;
            me.$el.on('click', me.back_selector, function(e){
                e.preventDefault();
                me.trigger('back');
                user_log('ALBUM_GROUP_DETAIL_RETURN');
            });
            me.$el.on('click', me.aside_toggle_selector, function(e){
                e.preventDefault();
                me.trigger('toggle');
                // 手工改动，要发日志
                me.set_aside_visible(undefined, true);
            });
            scroller.on('scroll', this.handle_view_change, this);
            this.inner_photo_store.on('groupchanged', this.handle_group_change, this);
        },
        handle_view_change : function(){
            if(!this.rendered){
                return;
            }
            if(this.scroller.is_reach_bottom()){
                this.trigger('reachbottom');
            }
            this.if_show_border();
        },
        render_group_list : function(){
            if(!this.rendered){
                return;
            }
            var group_list = this.get_group_list();
            if(!group_list.rendered){
                group_list.render(this.$group_list_ct.empty());
            }
        },
        destroy_group_list : function(){
            var group_list = this.group_list;
            if(group_list){
                group_list.destroy();
                // 放置一个空白列表，避免背景透明导致titlebar的边框显示出来了。 临时hack
                this.$group_list_ct.html(tmpl.detail_group_list());
                this.group_list = null;
            }
        },
        /**
         * @private
         * 切换则边栏分组列表显示
         */
        set_aside_visible : function(aside_visible, manual_switch){
            if(typeof aside_visible !== 'boolean'){
                aside_visible = !this.aside_visible;
            }
            aside_visible = !!aside_visible;
            this.aside_visible = aside_visible;
            store.set(get_aside_toggle_key(), aside_visible);
            if(this.rendered){
                this.$el.toggleClass(this.aside_class, aside_visible);
                if(aside_visible){
                    this.render_group_list();
                }else{
                    this.destroy_group_list();
                }
                // WEBKIT Appbox的动画有bug，只能恶心的hack
                if(constants.IS_WEBKIT_APPBOX){
                    var me = this;
                    setTimeout(function(){
//                        me.get_photo_view().$el.repaint();
//                        me.$photo_list_ct.repaint();
                        var record = me.inner_photo_store.get(0);
                        if(record){
                            record.set('force_update_view', Math.random());
                        }
                    }, 600);
                }
            }
            if(this.photo_view){
                this.photo_view.set_draggable(aside_visible);
            }
            if(this.group_list){
                this.group_list.set_droppable(aside_visible);
            }
            // 上报
            if(manual_switch){
                user_log(aside_visible ? 'ALBUM_GROUP_OPEN_SHORTCUT' : 'ALBUM_GROUP_CLOSE_SHORTCUT');
            }
        },
        handle_group_change : function(){
            if(!this.rendered){
                return;
            }
            var group_record = this.inner_photo_store.get_group();
            this.$titlebar.find('.text').text(group_record.get('name'));
            // 标记当前的record为选中
            this.group_record = group_record;
            var group_list = this.get_group_list(true);
            if(group_list){
                group_list.set_group_record(group_record);
            }
        },
        transfer_action : function(action, records, event, extra){
            this.trigger('action', action, records, event, extra);
        },
        get_photo_view : function(dont_construct){
            var photo_view = this.photo_view;
            if(!photo_view && !dont_construct){
                photo_view = this.photo_view = new Photo_view({
                    store : this.inner_photo_store,
                    thumb_loader : this.photo_thumb_loader,
                    scroller : this.scroller,
                    draggable_key : this.dragdrop_key,
                    draggable : this.aside_visible
                });
                photo_view.on('action', this.transfer_action, this);
            }
            return photo_view;
        },
        change_group : function(record, event, extra){
            this.trigger('opengroup', record, event, extra);
        },
        get_group_list : function(dont_construct){
            var group_list = this.group_list;
            if(!group_list && !dont_construct){
                group_list = this.group_list = new Group_list({
                    store : this.group_store,
                    thumb_loader : this.group_thumb_loader,
                    group_record : this.inner_photo_store.get_group(),
                    droppable_key : this.dragdrop_key,
                    droppable : this.aside_visible
                });
                group_list.on('recordclick', this.change_group, this);
                group_list.on('dropmove', function(photos, group_record, e){
                    this.trigger('dropmove', photos, group_record, e);
                    user_log('ALBUM_GROUP_DRAG_TO_SHORTCUT');
                }, this);
            }
            return group_list;
        },
        get_selected : function(){
            return this.get_photo_view().get_selected();
        },
        get_action_extra : function(){
            return this.get_photo_view().get_action_extra();
        },
        /**
         * 销毁所有dom
         */
        destroy : function(){
            this.destroy_group_list();
            if(this.photo_view){
                this.photo_view.destroy();
                this.photo_view = null;
            }
            this.$el.remove();
            if(this.last_group_record){
                this.last_group_record.set('selected', false);
                this.last_group_record = null;
            }
            if(this.scroller){
                this.scroller.destroy();
                this.scroller = null;
            }
        }
    });
    return Module;
});