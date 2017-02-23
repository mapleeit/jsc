/**
 * 重构后的分组详情面板
 * @author cluezhang
 * @date 2013-11-27
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        Scroller = common.get('./ui.scoller'),
        ds_photo_event = common.get('./global.global_event').namespace('datasource.photo'),
        
        View_mode = require('./View_mode'),
        Group_detail_view = require('./group.detail.View'),
        Group_detail_mgr = require('./group.detail.Mgr'),
        Group_detail_store = require('./group.detail.Store'),
        Photo_record = require('./photo.Record'),
        
        $ = require('$');
    var Module = inherit(View_mode, {
        create_store : function(){
            var store = new Group_detail_store({
            });
            // 先只管上传新增的吧
            store.listenTo(ds_photo_event, 'add', function(files, meta){
                if(meta.src === store){
                    return;
                }
                var group_id = meta.group_id;
                var current_group = store.get_group();
                // 如果分组不符合，无视掉
                if(!current_group || current_group.get('id') !== group_id){
                    return;
                }
                // 如果数据全面，则直接插入。如果数据不全（Form上传的没有file_id），则刷新。
                var records = []; // records为null表示数据不全
                $.each(files, function(index, file){
                    if(!file.id){
                        records = null;
                        return false;
                    }
                    records.push(new Photo_record(file));
                });
                buffer_add(records);
            });
            // 延时更新函数
            var timer,
                buffered_records = [], // 如果是数组，就是要添加到列表中的图片；如果是null，表示数据不全，需要reload全盘更新
                last_refresh_time = new Date();
            var buffer_add = function(records){
                // 如果已经要刷新了，就无视掉缓冲了
                if(buffered_records !== null){
                    if(records === null){
                        buffered_records = null;
                    }else{
                        buffered_records = buffered_records.concat(records);
                    }
                }
                clearTimeout(timer);
                // 如果上次刷新在3秒内，则到3秒才刷新
                // 如果在3秒开外，则半秒后刷新
                var wait_time = Math.max(500, 3000 - (new Date() - last_refresh_time));
                timer = setTimeout(do_add, wait_time);
            };
            var do_add = function(){
                if(buffered_records === null){
                    store.reload();
                }else{
                    buffered_records.reverse(); // 每次添加到最前面，所以要倒序添加
                    store.add(buffered_records, 0);
                    buffered_records = [];
                }
            };
            return store;
        },
        create_view : function(){
            var view = new Group_detail_view({
                inner_photo_store : this.get_singleton('store'),
                group_store : this.group_store,
                photo_thumb_loader : this.thumb_loader,
                group_thumb_loader : this.thumb_loader,
                $ct : this.$ct,
                size : this.size
            });
            var me = this;
            view.on('back', function(){
                me.trigger('back');
            }, this);
            view.on('opengroup', function(record, e){
                me.set_group(record);
                user_log('ALBUM_GROUP_CLICK_SHORTCUT');
            });
            view.on('reachbottom', this.on_self_reachbottom, this);
            var mgr = this.get_singleton('mgr');
            view.on('action', mgr.process_action, mgr);
            view.on('dropmove', mgr.do_move_photos, mgr);
            return view;
        },
        create_mgr : function(){
            var mgr = new Group_detail_mgr({
                store : this.get_singleton('store'),
                group_store : this.group_store, // 供分组移动使用
                thumb_loader : this.thumb_loader
            });
            return mgr;
        },
        set_group : function(record){
            this.get_singleton('store').set_group(record);
        },
        get_group : function(){
            return this.get_singleton('store').get_group();
        },
        on_self_reachbottom : function(){
            this.get_singleton('store').load_more();
        },
        on_activate : function(){
            Module.superclass.on_activate.apply(this, arguments);
            this.get_singleton('store').reload();
            this.get_singleton('view').render(this.$ct);
        },
        on_deactivate : function(){
            this.release_singleton('view');
            Module.superclass.on_deactivate.apply(this, arguments);
        },
        on_refresh : function(){
            Module.superclass.on_refresh.apply(this, arguments);
            this.get_singleton('store').reload().done(function(){
                mini_tip.ok('列表已更新');
            });
            // 如果侧边栏展开了，则连分组信息一起刷新
            if(this.get_singleton('view').aside_visible){
                this.group_store.reload();
            }
        },
        on_resize : function(){
            Module.superclass.on_resize.apply(this, arguments);
            this.get_singleton('store').page_size = this.get_page_size();
            this.get_singleton('view').set_size(this.size);
        },
        /**
         * 获取每张图占位大小，用于计算每页可显示的张数
         * @return {Object} size 有width与height属性
         */
        get_element_size : function(){
            return {
                width : 140,
                height : 140
            };
        },
        get_page_size : function(){
            var view_size = this.size,
                element_size = this.get_element_size();
            return Math.round(view_size.width*view_size.height / ( element_size.width*element_size.height ));
        },
        on_toolbar_act : function(act, e){
            var records, mgr, view;
            mgr = this.get_singleton('mgr');
            view = this.get_singleton('view');
            mgr.process_action(act, view.get_selected ? view.get_selected() : [], e, view.get_action_extra());
        },
        get_toolbar_meta : function(){
            return {
                set_group : 1,
                batch_delete : 1
            };
        }
    });
    return Module;
});