/**
 * 库分类文件列表操作逻辑处理
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        Group_record = lib.get('./data.Record'),
        global_event = common.get('./global.global_event'),

        coverStore = require('./cover.Store'),
        coverView = require('./cover.View'),
        groupStore = require('./group.Store'),
        groupView = require('./group.View'),
        Remover = require('./Remover'),
        share_enter,
        downloader,
        file_qrcode,

        DEFAULT_PAGE_SIZE = 100,
        undefined;

    var byte_len = function(str){
        return encodeURIComponent(str).replace(/%\w\w/g, 'a').length;
    };
    var group_name_validator = {
        verify : function(name){
            if(!name){
                return '不能为空';
            }
            if(byte_len(name)>512){
                return '过长';
            }
            if(/[\\:*?\/"<>|]/.test(name)){
                return '不能含有特殊字符';
            }
            return true;
        }
    };

    var Mgr = inherit(Event, {

        step_num: 20,

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },

        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                    return false;// 不再触发recordclick
                }, this);
            }
            //数据加载器相关事件
            if(this.loader) {
                this
                    .listenTo(this.loader,'error', function(msg) {
                        mini_tip.error(msg);
                    }, this)
                    .listenTo(this.loader, 'before_load', function() {
                        this.view.on_beforeload();
                    }, this)
                    .listenTo(this.loader, 'after_load', function() {
                        this.view.on_load();
                    })
                    .listenTo(this.loader, 'before_refresh', function() {
                        widgets.loading.show();
                        this.view.on_before_refresh();
                    })
                    .listenTo(this.loader, 'after_refresh', function() {
                        widgets.loading.hide();
                        this.view.on_refresh();
                    });
            }
        },
        // 分派动作
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name]([].concat(data), event);
            }
            event && event.preventDefault();
            // 不再触发recordclick
            return false;
        },
        // 删除
        on_delete : function(nodes, callback){
            this.do_delete(nodes, callback);
        },

        get_remover: function() {
            return this.remover || (this.remover = new Remover());
        },

        do_delete: function(records, callback, scope) {
            var remover = this.get_remover(),
                me = this;
            remover.remove_confirm(records).done(function(success_nodes) {
                me.store.batch_remove(success_nodes);
                me.store.total_length -= success_nodes.length;
                me.view.cancel_sel();
                if(callback && typeof callback === 'function') {
                    callback.call(scope, true);
                }
            });
        },
        //删除分组
        on_remove: function(records, event) {
            var record = records[0],
                me = this;
            widgets.confirm(
                '删除分组',
                '确定要删除这个分组吗？',
                record.get('name'),
                function () {
                    me.loader.delete_group(record).done(function(){
                        mini_tip.ok('删除成功');
                        me.load_groups();
                    }).fail(function(msg){
                        mini_tip.error(msg);
                    });
                },
                $.noop,
                null,
                true
            );
        },

        on_switch_group: function() {
            this.view.back_to_group();
            this.load_groups();
        },

        on_switch_whole: function() {
            this.store.clear();
            this.store.total_length++;
            this.view.show_detail();
            this.load_all_files();
        },
        // 设置封面，弹出选择框
        on_set_cover : function(groups, event){
            var group_record = groups[0];
            var old_cover = group_record.get('cover');
            old_cover = old_cover ? old_cover[0] : null;
            var cover_store = new coverStore({
                loader: this.loader,
                group_record : group_record,
                page_size : DEFAULT_PAGE_SIZE
            });

            cover_store.reload();
            var view = new coverView({
                store : cover_store,
                initial_cover : old_cover
            });
            view.on('reachbottom', cover_store.load_more, cover_store);
            view.set_cover();
        },

        //设置为封面
        on_set_as_cover : function(records, event){
            var me = this,
                group_record = me.group_store.get_cur_group(),
                group_id = group_record.get('id'),
                record = records[0];
            this.loader.set_group_album(group_id, record).done(function(){
                group_record.set('cover', [{
                    pdir_key : record.get_pid(),
                    file_id : record.get_id()
                }]);
                mini_tip.ok('设置成功');
            }).fail(function(msg){
                mini_tip.error(msg);
            });
        },

        //更改分组，弹出选择框
        on_set_group: function(records, event) {
            if(!records.length){
                mini_tip.warn('请选择图片');
                return;
            }
            var group_store = new groupStore({
                loader: this.loader,
                old_group: this.group_store.get_cur_group(),
                groups: this.group_store.get_groups(),
                photo_records : records
            });

            var view = new groupView({
                initial_record: this.group_store.get_cur_group(),
                store : group_store
            });
            this._dialog = view.move_photos_dialog();
        },

        //更改分组
        on_move_photos: function(data) {
            var me = this;
            var photos = data.photos,
                old_group_id = data.old_group_id,
                new_group_id = data.new_group_id;
            me.do_move_photos(photos, old_group_id, new_group_id).done(function(){
                me._dialog && me._dialog.hide();
                me.view.cancel_sel();
            });
        },

        do_move_photos: function(photos, old_group_id, new_group_id) {
            var me = this,
                show_progress = photos.length > 100;
            if(show_progress){
                progress.show("正在移动0/"+photos.length);
            }else{
                widgets.loading.show();
            }
            return this.loader.step_move_photos(photos, old_group_id, new_group_id).progress(function(success_photos, failure_photos){
                if(show_progress){
                    progress.show("正在移动" + success_photos.length+"/"+photos.length);
                }
            }).done(function(success_photos, failure_photos){
                me.store.batch_remove(success_photos);
                //me.view.cancel_sel();
                if(failure_photos.length){
                    mini_tip.warn('部分图片更改分组失败');
                }else{
                    mini_tip.ok('更改分组成功');
                }
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                if(show_progress){
                    progress.hide();
                }else{
                    widgets.loading.hide();
                }
            });
        },

        // 直接点击记录
        on_open : function(records, e){
            var record = records[0];
            if(e.target && e.target.tagName.toUpperCase() === 'INPUT') {//得命名时，点击文本框，不进行预览
                return;
            }
            e.preventDefault();
            this.preview_image(record);
        },

        /**
         * 图片预览（重写 FileListUIModule 的默认实现）
         * @overwrite
         * @param {FileObject} file
         * @private
         */
        preview_image: function (file) {
            var me = this;

            require.async(['image_preview', 'downloader'], function (image_preview_mod, downloader_mod) {
                var image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前目录下的图片
                var images = [];
                var read_images = function(){
                    me.store.each(function(record){
                        images.push(record);
                    });
                };
                read_images();
                image_preview.start({
                    complete : me.store.is_complete(),
                    total: images.length,
                    index: $.inArray(file, images),// 当前图片所在的索引位置
                    images: images,
                    load_more: function( callback ){
                        // 如果第N张图片未加载，则尝试加载，此方法可能会递归调用，直到全部加载完
                        if(!me.store.is_complete()){ // 未加载，尝试加载之
                            me.load_files().done(function(){
                                images.splice(0, images.length);
                                read_images();

                                callback({
                                    'total': images.length,
                                    'complete': me.store.is_complete(),
                                    'images': images
                                });

                            }).fail(function(){
                                callback({ 'fail': true });
                            });
                        }
                        //加载完了
                        else{
                            callback({
                                'total': images.length,
                                'complete': me.store.is_complete(),
                                'images': images
                            });
                        }
                    },
                    download: function (index, e) {
                        var file = images[index];
                        downloader.down(file, e);
                    },
                    share: function(index){
                        require.async('share_enter', function(share_enter){
                            share_enter.get('./share_enter').start_share(images[index]);
                        });
                    },
                    remove: function (index, callback) {
                        var file = images[index];
                        me.do_delete(file, function(success){
                            if(success){
                                images.splice(index, 1);
                            }
                            callback();
                        });
                    }
                });
            });
        },

        on_rename: function(records, e) {
            if(this.rename_task){
                return;
            }
            this.rename_task = true;

            var me = this,
                store = me.group_store,
                record = records[0],
                old_value = record.get('name'),
                def = $.Deferred(),
                view = this.view;
            var editor = view.start_edit(record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    me.loader.rename_group(record.get('id'), old_value, value).done(function(){
                        mini_tip.ok('修改成功');
                        def.resolve(value);
                    }).fail(function(msg){
                        mini_tip.error(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(value){
                record.set('name', value);
                store.update_group(record);
                view.update_group(record);
            }).always(function(){
                editor.destroy();
                me.rename_task = false;
            });
        },
        /**
         *真正重命名
         * @param {File_record} record 文件对象
         * @param {String} new_name 新的文件名
         */
        do_rename: function(record, new_name) {
            var view = this.view,
                data = {
                    ppdir_key: '',
                    pdir_key: record.get_pid(),
                    file_list: [{
                        file_id: record.get_id(),
                        filename: new_name,
                        src_filename: record.get_name()
                    }]
                };
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: 'DiskFileBatchRename',
                cavil: true,
                pb_v2: true,
                body: data
            })
                .ok(function(msg, body) {
                    var result = body['file_list'] && body['file_list'][0] || {};
                    if(result.retcode) {
                        mini_tip.warn(result.retmsg || '更名失败');
                        return;
                    }
                    mini_tip.ok('更名成功');
                    record.set_name(new_name);
                })
                .fail(function(msg, ret) {
                    mini_tip.warn(msg || '更名失败');
                })
                .done(function() {
                    view.remove_rename_editor();
                });

        },
        //on_create_group
        on_create_group: function() {
            if(this.loading){
                return;
            }
            this.loading = true;

            var me = this,
                def = $.Deferred(),
                view = me.view,
                store = me.group_store,
            // 占位分组，仅用于新建
                old_value = '',
                dummy_record = new Group_record({
                    name : old_value,
                    dummy : true
                });
            //store.add_group(dummy_record);
            var editor = view.start_edit(dummy_record);
            // 用户尝试保存
            editor.on('save', function(value){
                // 合法性判断
                var ret = group_name_validator.verify(value);
                if(ret !== true){
                    mini_tip.error('组名'+ret);
                    editor.focus();
                }else{
                    me.loader.save_group(value).done(function(record){
                        mini_tip.ok('创建成功');
                        def.resolve(record);
                    }).fail(function(msg){
                        mini_tip.error(msg);
                        editor.focus();
                    });
                }
            });
            // 用户尝试取消
            editor.on('cancel destroy', def.reject, def);
            def.done(function(records){
                store.add_group(records);
                view.add_group(records);
            }).fail(function(){

            }).always(function(){
                store.remove();
                editor.destroy();
                me.loading = null;
            });

            return def;
        },

        on_enter_group: function(group) {
            var me = this;
            this.loader.load_photos( group[0].get('id'), 0, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                global_event.trigger('switch_mode', group[0]);
                me.view.show_detail();
                me.group_store.set_cur_group(group[0]);
                me.store.load(records, is_finish ? null : Number.MAX_VALUE);
            }).fail(function(msg){
                mini_tip.error(msg);
            });
        },

        /**
         * 分享文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         */
        on_share: function(records, e) {
            e.preventDefault();
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records);
                });
            } else {
                share_enter.start_share(records);
            }
        },
        /**
         * 下载文件操作
         * @param {File_record} record 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} from_menu 是否从右键菜单发出的事件
         */
        on_download: function(records, e) {
            e.preventDefault();
            if(!downloader) {
                require.async('downloader', function (mod) {//异步加载downloader
                    downloader = mod.get('./downloader');
                    downloader.down(records, e);
                });
            } else {
                downloader.down(records, e);
            }
        },
        /**
         * 获取二维码操作
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_qrcode: function(records, e) {
            e.preventDefault();

            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {//file_qrcode
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(records);
                });
            } else {
                file_qrcode.show(records);
            }
        },
        /**
         * 右键跳转至具体路径
         * @param {File_record} records 文件对象
         * @param {jQuery.event} e
         * @param {Boolean} extra 是否从右键菜单发出的事件
         */
        on_jump: function(records, e) {
            var record = records[0];
            e.preventDefault();
            if(records.length == 1) {
                require.async('jump_path', function (mod) {
                    var jump_path = mod.get('./jump_path');
                    jump_path.jump(record.data);
                });
            }
        },

        /**
         * 刷新操作
         */
        on_refresh: function() {
            global_event.trigger(this.module_name + '_refresh');
        },

        /**
         * 计算出符合阅读的文件名
         * @param {String} file_name
         * @returns {String} name
         */
        get_realable_name: function(file_name) {
            var append_str = file_name.slice(file_name.length-6),
                cut_len = 16;

            file_name = text.smart_sub(file_name.slice(0, file_name.length-6), cut_len) + append_str;//截取一个合理长度一行能显示的字条
            return file_name;
        },

        /**
         * 图片全部模式下，加载数据
         * @param is_refresh 是否是刷新列表
         */
        load_all_files: function(is_refresh) {
            if(this.store.is_complete()) {
                if(this.store.size() === 0) {
                    this.view._init_view_empty();
                }
                return ;
            }
            var me = this,
                offset = this.store.size();

            this.loader.load_photos(null, offset, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                if(offset === 0) {//开始下标从0开始表示重新加载
                    me.store.load(records, is_finish ? null : Number.MAX_VALUE);
                } else {
                    me.store.add(records);
                }
            }).fail(function(msg){
                //todo
            });
        },
        /**
         * 分批加载数据,用于图片预览，加载更多
         * @param is_refresh 是否是刷新列表
         */
        load_files: function() {
            var me = this,
                def = $.Deferred(),
                offset = this.store.size(),
                cur_group =  this.group_store.get_cur_group(),
                record_id = cur_group? cur_group.get('id') : null;

            this.loader.load_photos(record_id, offset, DEFAULT_PAGE_SIZE).done(function(records, is_finish){
                if(offset === 0) {//开始下标从0开始表示重新加载
                    me.store.load(records, is_finish ? null : Number.MAX_VALUE);
                } else {
                    me.store.add(records);
                }
                def.resolve();
            }).fail(function(msg){
                def.reject();
            });
            return def;
        },

        /**
         * 图片分组模式下，加载数据
         */
        load_groups: function() {
            var me = this,
                store = me.group_store,
                view = me.view,
                loader = me.loader;
            loader.load_groups().done(function(rs) {
                store.init_group(rs);
                view.group_render();
            });
        }
    });
    return Mgr;
});
