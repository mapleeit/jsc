/**
 * 库分类（文档、视频、音频）列表视图类
 * @author hibincheng
 * @date 2013-10-31
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        image_loader = lib.get('./image_loader'),
        blank_tip = common.get('./ui.blank_tip'),
        ContextMenu = common.get('./ui.context_menu'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),
        Box_selection_plugin = common.get('./dataview.Box_selection_plugin'),

        tmpl = require('./tmpl'),
        global_event = common.get('./global.global_event'),
        SelectBox = common.get('./ui.SelectBox'),
        
        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),

        key_event = ($.browser.msie && $.browser.version < 7) ? 'keypress' : 'keydown',

        jquery_ui,
        drag_files,

        undefined;

    var File_view = inherit(View, {

        module_name: '',
        list_selector : '',
        item_selector : 'li[data-file-id]',
        action_property_name : 'data-action',
        
        enable_box_select : true,
        enable_select : true,

        //拖拽的支持
        draggable : false,
        draggable_key : 'lib_categories',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

        // 已经在dom上加了data属性来映射，方便快速查找
        dom_record_map_attr : 'data-record-id',
        scroller : main_ui.get_scroller(),
        constructor : function(){
            File_view.superclass.constructor.apply(this, arguments);
            this.record_dom_map_perfix = this.id + '-';
            this.select_box_namespace = 'lib/'+this.module_name;
            
            var selection = this.selection = new Box_selection_plugin();
            selection.init(this);
        },

        list_tpl : function(){
            return tmpl[this.module_name+'_list']();
        },

        tpl : function(file){
            return tmpl[this.module_name+'_file_item']([file]);
        },

        get_html : function(files){
            return tmpl[this.module_name+'_file_item']({
                files : files,
                id_perfix : this.record_dom_map_perfix
            });
        },

        item_menu_class : 'context-menu',
        shortcuts: {
            menu_active : function(value, view){
                $(this).toggleClass(view.item_menu_class, value);
            },
            //实际上对应的是File_object的属性
            _name: function(name) {
                var can_ident = file_type_map.can_identify(File.get_ext(name)),
                    $dom = $(this),
                    is_video = $dom.attr('data-video');//视频要显示出后缀名

                $dom.find('[data-name=file_name]').attr('title', name).text(can_ident && !is_video ? name.slice(0,name.lastIndexOf('.')) : name);
            }
        },

        on_show: function() {
            this._activated = true;
        },

        on_hide: function() {
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        //插入记录，扩展父类
        on_add: function(store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            if(this.module_name === 'video') {
                this._fetch_video_thumb(records);
            }
            this.update_draggable();
        },
        on_update : function(){
            File_view.superclass.on_update.apply(this, arguments);
            this.update_draggable();
        },
        refresh : function(){
            File_view.superclass.refresh.apply(this, arguments);
            this.update_draggable();
        },

        after_render : function(){
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            this._render_ie6_fix();
            
            // 直接点击时打开
            this.selection.on('before_select_click', function(record, e){
                this.trigger('action', 'open', record, e, this.get_action_extra());
                return false;
            }, this);
            
            // 多选时不要hover
            var me = this;
            this.selection.on('selectionchanged', function(records){
                me.is_multi_selection = records.length > 1;
                me.is_need_edit = records.length > 0;
                me.show_edit(records);
                me._if_block_hover();
            });

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {
                
                // 如果启用拖拽，则在记录上按下时，不能框选
                this.selection.on('before_box_select', function($tar){
                    return !me.draggable || !me.get_record($tar);
                });

                this.set_draggable(true);

                me._render_drag_files();

            }
        },

        show_edit: function(records) {
            records = records || this.get_selected();
            if(!records || records.length === 0) {
                main_ui.toggle_edit(false);
            } else {
                main_ui.toggle_edit(true, records.length);
            }
        },

        cancel_sel: function() {
            this.selection.clear();
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
                    cursorAt: { bottom: 65, right: 65 },
                    distance: 20,
                    appendTo: 'body',
                    scroll: false,
                    helper: function (e) {
                        return $('<div id="_disk_ls_dd_helper" class="drag-helper"/>');
                    },
                    start: $.proxy(me.handle_start_drag, me),
                    stop : $.proxy(me.handle_stop_drag, me)
                });
            });
        },

        get_selected : function(){
            if(this.enable_select){
                return this.selection.get_selected();
            }
            return [];
        },

        handle_start_drag : function(e, ui){
            var record = this.get_record(e.target);
            if(!this.draggable || !record){
                return false;
            }
            var items = [];
            // 如果拖动的文件已经选中，则表示拖动所有选中的文件
            if(record.get('selected')){
                items = this.get_selected();
            }else{ // 反之，只拖动当前一个，并清除选中
                this.store.each(function(rec){
                    rec.set('selected', rec === record);
                });
                items = [record];
            }

            if (!items.length) {
                return false;
            }

            //判断如果大于1个文件不给拖动
            if(items.length>1) {
                return false;
            }

            // before_drag 事件返回false时终止拖拽
            this.trigger('before_drag_files', items);

            ui.helper.html(tmpl.drag_cursor({ files : items }));

        },

        _get_drag_helper: function () {
            return $('#_disk_ls_dd_helper');
        },

        handle_stop_drag : function(){
            var $helper = this._get_drag_helper();
            if ($helper[0]) {
                $helper.remove();
            }
            this.trigger('stop_drag');
        },
        // ------------------- 拖动 结束 -----------------


        // 拖拽文件，拖拽下载在内部实现
        _render_drag_files: function () {
            var me = this;
            var mouseleave = 'mouseleave.file_list_ddd_files',
                can_drag_files = false;

            try {
                if (window.external.DragFiles) {
                    require.async('drag_files', function (mod) { //异步加载drag_files
                        drag_files = mod.get('./drag_files');
                    });
                    can_drag_files = true;
                }
            } catch (e) {
                console.error(e.message);
            }


            this
                // 拖拽时，如果鼠标移出窗口，则使用拖拽下载命令代替移动文件命令
                .listenTo(me, 'before_drag_files', function (files) {

                    $(document.body)
                        .off(mouseleave)
                        .one(mouseleave, function (e) {

                            // 取消拖拽动作（取消移动文件动作）
                            me.handle_stop_drag();

                            // 下载
                            if (can_drag_files && drag_files) {
                                // 启动拖拽下载
                                drag_files.set_drag_files(files, e);
                            } else {
                                //老版本appbox拖拽下载
                                require.async('downloader', function (mod) {
                                    downloader = mod.get('./downloader');
                                    downloader.drag_down(files, e);
                                    user_log('DISK_DRAG_DOWNLOAD');
                                });
                            }

                        });
                })
                // 拖拽停止时取消上面的事件
                .listenTo(me, 'stop_drag', function () {
                    $(document.body).off(mouseleave);
                });

        },

        _if_block_hover : function(){
            var $view_ct = this.get_$view_ct();
            $view_ct.toggleClass('block-hover', !!this.is_multi_selection || !!this.is_menu_on);
        },
        // ie6 鼠标hover效果
        _render_ie6_fix: function () {
            // ie6 sucks
            if ($.browser.msie && $.browser.version < 7) {
                var me = this,
                    hover_class = 'list-hover';

                me.$list.on('mouseenter', me.item_selector, function () {
                    $(this).addClass(hover_class);
                }).on('mouseleave', me.item_selector, function () {
                        $(this).removeClass(hover_class);
                    });
            }
        },

        on_datachanged: function() {
            File_view.superclass.on_datachanged.apply(this, arguments);
            if(this.store.size() === 0) {//无数据时，显示空白运营页
                if(!this.$view_empty) {
                    this._init_view_empty();
                } else {
                    this.get_$view_empty().show();
                }
                this.get_$view_list().hide();

            } else {
                this.get_$view_empty() && this.get_$view_empty().hide();
                this.get_$view_list().show();

                if(this.module_name === 'video') {//视频分类时，要拉取视频缩略图
                    this._fetch_video_thumb(this.store.data);
                }
            }
        },

        /**
         * 初始化列表为空时的提示页面
         * @private
         */
        _init_view_empty: function() {
            var $to = this.get_$view_ct();
            var configs = {
                doc: {
                    id: 'j-doc-empty',
                    to: $to,
                    icon_class: 'icon-notxt',
                    title: '暂无文档',
                    content: '请点击右上角的“添加”按钮添加'
                },
                video: {
                    id: 'j-video-empty',
                    to: $to,
                    icon_class: 'icon-novideo',
                    title: '暂无视频',
                    content: '请点击右上角的“添加”按钮添加'
                },
                audio: {
                    id: 'j-audio-empty',
                    to: $to,
                    icon_class: 'icon-nomusic',
                    title: '暂无音乐',
                    content: '请点击右上角的“添加”按钮添加'
                }
            };

            this.$view_empty = blank_tip.show(configs[this.module_name]);
        },


        /**
         * 拉取视频缩略图
         * @param {Array<File_record>} records 视频文件数组
         * @private
         */
        _fetch_video_thumb: function(records) {
            var me = this,
                thumb_size = 64,//宽度（目前提供尺寸：1024*1024，640*480，320*240，64*48）
                is_retry = true,//是否重试
                retry_cnt = 2;//重试次数

            $.each(records || [], function(i, record) {
                var thumb_url = record.get_video_thumb_url(thumb_size),
                    $thumb = me.get_dom(record).find('.img');

                if(thumb_url) {
                    image_loader
                        .load(thumb_url)
                        .done(function(img) {
                            //img.attr('alt', '');
                            $thumb.append(img);
                        })
                        .fail(function() {
                            if(!is_retry) {
                                $thumb.prepend(me.get_default_img('video'));
                                return;
                            }
                            me._retry_fetch_video_thumb({
                                $thumb: $thumb,
                                thumb_url: thumb_url,
                                retry_cnt: retry_cnt
                            })
                        });
                } else {
                    $thumb.prepend(me.get_default_img('video'));
                }
            });
        },

        /**
         * 重试拉取失败的视频缩略图
         * @param {Object} fail_thumb 包含：要替换的$thumb，缩略图url，重试次数
         * @private
         */
        _retry_fetch_video_thumb: function(fail_thumb) {
            var $thumb = fail_thumb.$thumb,
                thumb_url = fail_thumb.thumb_url,
                retry_cnt = fail_thumb.retry_cnt;

            var own_fn = arguments.callee,
                me = this;

            if(retry_cnt === 0) {
                fail_thumb = null;//直接释放引用
                return;
            }

            image_loader
                .load(thumb_url)
                .done(function(img) {
                    $thumb.append(img);
                    fail_thumb = null;
                })
                .fail(function() {
                    if( fail_thumb.retry_cnt === 1 ) {
                        $thumb.prepend(me.get_default_img('video'));
                    }
                    fail_thumb.retry_cnt--;//重试次数减1
                    own_fn.call(me, fail_thumb);//再重试
                });
        },

        get_default_img: function(type) {
            type = type || 'nor';
            var $dom = $('<i class="icon icon-m icon-' + type +'-m"></i>');
            return $dom;
        },

        _handle_action : function(action, record, e){
            switch(action){
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
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

            var menu = this.get_context_menu(),
                records;
            
            if(record.get('selected')){
                records = this.selection.get_selected();
            }else{
                this.cancel_sel();
                record.set('selected', true);
                records = [record];
            }
            this.show_edit(records);

            this.context_records = records;
            
            var visibles = records.length>1 ? {
                'delete' : 1
            } : undefined;
            
            menu.show(e.pageX, e.pageY, visibles);
            
            var me = this;
            me.is_menu_on = true;
            me._if_block_hover();
            record.set('menu_active', true);
            menu.once('hide', function(){
                record.set('menu_active', false);
                me.is_menu_on = false;
                me._if_block_hover();
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
                    me.trigger('action', this.config.id, me.context_records, e, me.get_action_extra({src:'contextmenu'}));
                    if(this.config.id === 'jump') {
                        me.cancel_sel();
                    }
                };
                items = this.get_context_menu_cfg();
                $.each(items, function(index, item){
                    item.click = handler;
                });
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });
            }
            return menu;
        },
        get_context_menu_cfg : function(){
            return [
                {
                    id: 'download',
                    text: '下载',
                    icon_class: 'ico-null'
                },
                {
                    id: 'delete',
                    text: '删除',
                    icon_class: 'ico-null'
                },
                {
                    id: 'rename',
                    text: '重命名',
                    icon_class: 'ico-null'
                },
                {
                    id: 'jump',
                    text: '查看所在目录',
                    icon_class: 'ico-null'
                },
                {
                    id: 'qrcode',
                    text: '获取二维码',
                    split: true,
                    icon_class: 'ico-dimensional-menu'
                },
                {
                    id: 'share',
                    text: '分享',
                    split: true,
                    icon_class: 'ico-share'
                }
            ];
        },
        /**
         * 开始重命名
         * @param {File_record} record 文件对象
         * @param {Function} rename_callback 实际重命名回调方法
         */
        start_rename: function(record, rename_callback) {
            var file_name = record.get_name();
            var $file_name = this.get_dom(record).find('[data-name=file_name]');
            var $editor = this.get_$rename_editor();
            var $input = $editor.find('input[type=text]');

            var me = this;
            $file_name
                .hide()
                .after($editor.show());

            var auto_blur_handler = function(e){
                if(!$(e.target).is($input)){
                    $input.blur();
                }
            }, $body = $(document.body);
            $body.on('mousedown', auto_blur_handler);
            $input.val(file_name).focus()
                .on(key_event + '.rename', function(e) {
                    if (e.which === 13) {//ENTER
                        var val = $.trim(this.value),
                            dotLastIndex = val.lastIndexOf('.');
                        if(!val || dotLastIndex === 0 && val.length > 1) {
                            return;
                        }

                        if(file_name === val) {//未修改
                            me.remove_rename_editor();
                            return;
                        }
                        var err = File.check_name(val);
                        if(err) {
                            mini_tip.error(err);
                            return;
                        }
                        rename_callback(val);

                    } else if (e.which == 27) { //ESC
                        me.remove_rename_editor();
                    }
                })
                .on('blur.rename', function(e) {
                    var val = $.trim(this.value),
                        err = File.check_name(val),
                        dotLastIndex = val.lastIndexOf('.');
                    if(err) {
                        mini_tip.error(err);
                        me.remove_rename_editor();
                    } else if(val && val !== file_name && !(dotLastIndex === 0 && val.length > 1)) {
                        rename_callback(val);
                    } else {
                        me.remove_rename_editor();
                    }
                    $body.off('mousedown', auto_blur_handler);
                });

            me._select_text_before($input, '.');//聚焦选中

        },

        /**
         * 选中文件名而不包括扩展名
         * @param {jQuery|HTMLElement} $input
         * @param {String} sep
         * @private
         */
        _select_text_before: function ($input, sep) {
            var input = $($input)[0],
                text = $input.val(),
                before = (text.lastIndexOf(sep) == -1) ? text.length : text.lastIndexOf(sep);

            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(0, before);
            }
            else if (input.createTextRange) {
                var text_range = input.createTextRange();
                text_range.collapse(true);
                text_range.moveEnd('character', before);
                text_range.moveStart('character', 0);
                text_range.select();
            }
            else {
                input.select();
            }
        },

        remove_rename_editor: function() {
            var $editor = this.get_$rename_editor();
            $editor.prev('[data-name=file_name]').show();
            $editor.remove();
        },

        // 显示loading
        on_beforeload : function(){
            this.get_$load_more().show();
        },
        // 去掉loading
        on_load : function(){
            this.get_$load_more().hide();
        },

        on_before_refresh: function() {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().hide();
        },

        on_refresh: function() {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().show();
	        //测速
	        try{
		        var flag = '21254-1-11';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 2, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
        },

        get_$view_empty: function() {
            return this.$view_empty;
        },

        get_$main_bar1: function() {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_normal'));
        },

        get_$view_list: function() {
            return this.$view_list || (this.$view_list = $('#_' + this.module_name + '_view_list'));
        },

        get_$view_ct: function() {
            return this.$view_ct || (this.$view_ct = $('#_' + this.module_name + '_body'));
        },

        get_$load_more: function() {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        },

        get_$rename_editor: function() {
            return this.$rename_editor || (this.$rename_editor = $(tmpl.rename_editor()));
        }
    });
    return File_view;
});