/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-6-13
 * Time: 下午7:03
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        tmpl = require('./tmpl'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
	    huatuo_speed = common.get('./huatuo_speed'),
        https_tool = common.get('./util.https_tool'),
        image_loader = lib.get('./image_loader'),

        file_data = require('./file_list.file'),

        jquery_ui,
        drag_files,
        thumb_loader, //缩略图加载器

        STEP_COUNT = 10,//第次滚动渲染数据的条数
        LINEHEIGHT = 50, //列表行高
        HEADHEIGHT = 50, //页头高度
        TIMES = 1.5, //可见列表高度倍数

        today_queue,//等待渲染的今天数据
        yesterday_queue,//等待渲染的昨天数据
        last7day_queue,//等待渲染最近7天的数据
        longtime_queue,//等待渲染的更早数据
        undef;

    var ui = new Module('recent_ui', {

        //拖拽的支持
        draggable : false,
        draggable_key : 'recent',
        set_draggable : function(draggable){
            this.draggable = draggable;
            this.update_draggable();
        },

        render: function () {
            var me = this,
                _download = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    me.trigger('download', me._get_file_id(this), e);
                },
                _enter = function (e) {
                    e.preventDefault();
                    me.trigger('enter', me._get_file_id(this), e);
                };
            this._get_data_wraper()
                .off('click.icon-download', '[data-function=download]')
                .on('click.icon-download', '[data-function=download]', _download)
                .off('click.ui-item', '[data-file-id]')
                .on('click.ui-item', '[data-file-id]', _enter);

        },
        _get_file_id: function (dom) {
            return $(dom).closest('[data-file-id]').attr('data-file-id');
        },
        //把模版html外层再包一个div
        get_recent_group: function(html) {
            return '<div class="list-group-recent-item">' + html + '</div>'
        },
        get_list_group: function(html) {
            return '<ul class="list-group">' + html + '</ul>'
        },
        _get_paint_unit: function (ary, type) {
            var html = '';
            if (ary && ary.length) {
                html = this.get_list_group(tmpl.row({'files': ary, 'time': type}));
                if (html && ary[0].get_id() === file_data[type][0].get_id()) {//首次渲染把单元标题加上
                    return this.get_recent_group(tmpl['bar']({'time': type}) + html);
                }
            }
            return this.get_recent_group(html);
        },
        /*
         *@today     今天的变更文件 array
         *@yesterday 昨天的变更文件 array
         *@last7day  最近7天的变更文件 array
         *@longtime  昨天的变更文件 array
         *call by file_list
         */
        _has_data: false,

        /**
         * 渲染数据
         * @param is_first_page 是否是首屏
         */
        paint: function (is_first_page) {
            var me = this,
                paint_count,//要渲染的条数
                html = [],
                paint_data;

            //首屏渲染
            if (is_first_page) {
                paint_count = Math.max(Math.ceil((($(window).height() - HEADHEIGHT) / LINEHEIGHT) * TIMES), STEP_COUNT); //首屏渲染的列表文件条数
                today_queue = file_data.T.slice(0);
                yesterday_queue = file_data.Y.slice(0);
                last7day_queue = file_data.S.slice(0);
                longtime_queue = file_data.L.slice(0);
            } else {
                paint_count = STEP_COUNT;//非首屏渲染时，每滚动渲染10条
            }

            //今天
            if (today_queue.length > 0) {
                paint_data = today_queue.splice(0, paint_count);
                html.push(me._get_paint_unit(paint_data, 'T'));
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //昨天
            if (yesterday_queue.length > 0 && paint_count > 0) {
                paint_data = yesterday_queue.splice(0, paint_count);
                html.push(me._get_paint_unit(paint_data, 'Y'));
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //最近7天
            if (last7day_queue.length > 0 && paint_count > 0) {
                paint_data = last7day_queue.splice(0, paint_count);
                html.push(me._get_paint_unit(paint_data, 'S'));
                paint_count = Math.max(paint_count - paint_data.length, 0);
            }

            //7天前
            if (longtime_queue.length > 0 && paint_count > 0) {
                html.push(me._get_paint_unit(longtime_queue.splice(0, paint_count), 'L'));
            }

            if (html.length) {
                if (is_first_page) {
                    me._get_data_wraper().empty();
                }
                me._get_data_wraper().append(html.join(''));
                me._render_thumb();
                me._render_video_thumb();
                me._has_data = true;
            }

            if (is_first_page) {//首屏渲染时，如果都没数据显示，则显示无数据背景
                me.load_empty_body(!html.length);
            }
            //me._finished(isfinished);

            //appbox中支持拖拽下载，目前仅支持一个文件的拖拽下载
            if (constants.IS_APPBOX) {

                this.set_draggable(true);

                me._render_drag_files();

            }

	        //测速
	        //try{
		     //   var flag = '21254-1-9';
		     //   if(is_first_page && window.g_start_time) {
			 //       huatuo_speed.store_point(flag, 3, new Date() - window.g_start_time);
			 //       huatuo_speed.report(flag);
		     //   }
	        //} catch(e) {
            //
	        //}
        },

        get_thumb_loader: function() {
            var def = $.Deferred();

            if(!thumb_loader) {
                require.async('downloader', function(mod) {
                    var Thumb_loader = mod.get('./Thumb_loader');
                    thumb_loader = new Thumb_loader({
                        width: 32,
                        height: 32
                    });
                    def.resolve(thumb_loader);
                });
            } else {
                def.resolve(thumb_loader);
            }

            return def;
        },

        _render_thumb: function() {
            var me = this;
            this.get_thumb_loader().done(function(thumb_loader) {
                me._get_data_wraper().find('[data-init=0]').each(function (i, n) {
                    var id = me._get_file_id(n),
                        file = file_data.get_file_by_id(id);
                    if(file.is_image()) {
                        thumb_loader.get(file.get_pid(), file.get_id(), file.get_name(), file.get_thumb_url()).done(function(url, img) {
                            var $icon = $(n);
                            $icon.attr({'data-init': '1'});
                            me.set_image($icon, img);
                        });
                    }
                });
            });
        },

        _render_video_thumb: function() {
            var me = this;

            me._get_data_wraper().find('[data-init=0]').each(function (i, n) {
                var id = me._get_file_id(n),
                    file = file_data.get_file_by_id(id),
                    video_thumb_url = https_tool.translate_cgi(file.get_video_thumb_url(64));

                if(file.is_video()) {
                    image_loader.load(video_thumb_url).done(function(img) {
                        var $icon = $(n);
                        $icon.attr({'data-init': '1'});
                        me.set_image($icon, img);
                    }).fail(function() {
                        //todo 是否选择重试
                    });
                }
            });
        },
        /**
         * 替换真正的缩略图
         * @param $icon 默认图标
         * @param img 拉取的缩略图
         */
        set_image: function ($icon, img) {
            if ($icon[0]) {
                var $img_copy = $(img).clone();

                $.each($icon[0].attributes, function (i, attr) {
                    if (attr.nodeName.indexOf('data-') === 0) {
                        $img_copy.attr(attr.nodeName, $icon.attr(attr.nodeName));
                    }
                });

                var copy_attr_list = { unselectable: 1 };
                $.each(copy_attr_list, function (attr_name) {
                    $img_copy.attr(attr_name, $icon.attr(attr_name));
                });

                //$img_copy[0].className = $icon[0].className;
                $img_copy.attr('unselectable', 'on');
                $img_copy.addClass('icon icon-m icon-pic-m');
                $icon.replaceWith($img_copy);
            }
        },
        /*清空列表*/
        empty_list: function () {
            this._get_data_wraper().empty();
        },
        /*返回列表数据对象的包裹jQuery对象*/
        _get_data_wraper: function () {
     //       return this.$wraper || (this.$wraper = constants.UI_VER === 'APPBOX' ? this._get_container() : this._get_container().children('[data-id="file_list_container"]'));
            return this.$wraper || (this.$wraper =this._get_container().find('[data-id=file_list]'));

        },
        /*返回列表框架的包裹jQuery对象*/
        _get_container: function () {
            return this.$table ? this.$table : this.$table = $('#_recent_body');
        },
        /*隐藏或显示 正在加载button call by file_list*/
        loadBtn: function (is_show) {
            ( this.$load_btn || ( this.$load_btn = $(tmpl.tail_load()).appendTo(this._get_container())) )
                [ is_show ? 'show' : 'hide' ]();
            is_show && this._has_data && user_log('RECENT_LOAD_MORE');//添加 加载更多统计
        },
        /*列表为空,加载无文件背景*/
        load_empty_body: function (is_show) {
            ( this.$empty_body || ( this.$empty_body = $(tmpl.empty_body()).appendTo(this._get_container()))   )
               [ is_show ? 'show' : 'hide' ]();
            this._get_container().toggleClass('ui-view-empty', is_show);
        },
        /*列表加载完成
         _finished: function(is_show){
         ( this.$loaded || ( this.$loaded = $(tmpl.tail_loaded()).appendTo(this._get_container()))   )
         [ is_show ? 'show' : 'hide' ]();
         }
         */

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
            if(!this.draggable){
                return;
            }
            // 将所有节点都设定为可拖拽
            var me = this;
            this.when_draggable_ready().done(function(){
                var $items = me._get_data_wraper().children('[data-file-id]');
                $items.draggable({
                    scope: me.draggable_key,
                    // cursor:'move',
                    cursorAt: { bottom: -15, right: -15 },
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

        handle_start_drag : function(e, ui){
            var $target_el = $(e.originalEvent.target),
                $curr_item = $target_el.closest('[data-file-id]'),
                curr_item_id = $curr_item.attr('data-file-id');

            var item = file_data.get_file_by_id(curr_item_id),
                items = [item];

            if(!this.draggable || !items){
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

        }


    });
    return ui;
});

