/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        global_event = common.get('./global.global_event'),
        global_function = common.get('./global.global_function'),

        Module = common.get('./module'),
        store = require('./store'),
        tmpl = require('./tmpl'),
        column_model = require('./header.column_model'),
        image_lazy_loader = require('./image_lazy_loader'),

        action_property_name = 'data-action',
        padding_left = 10,
        scroller,
        undefined;

    var View = new Module('station.View', {
        _inited: false,
        render: function() {
            if(this._inited) {
                return;
            }
            $(tmpl.station_list()).appendTo(this.get_$main_box());
            $(tmpl.view_empty()).appendTo(this.get_$view_ct());

            this.bind_events();
            this._inited = true;
        },

        bind_events: function() {
            var me = this;
            this.listenTo(store, 'add', function(files) {
                me.on_add(files);
            }).listenTo(store, 'refresh_done', function(files) {
                me.on_refresh(files);
            }).listenTo(store, 'before_refresh', function() {
                me.remove_all();
            });

            var station_refresh = function(size){
                global_event.trigger('station_refresh', size);
            };
            global_function.register('station_refresh', station_refresh);
        },

        adjust_area: function(){
            this.get_$main().find('.inner').css('padding-left', padding_left + 'px');
            this.get_$station_header().find('.inner').css('padding-left', padding_left + 'px');
            this.get_$station_toolbar().css('padding-left', padding_left + 'px');
            this.adjust_height();
        },

        adjust_height: function() {
            var bar_height = this.get_$bar1_ct().height(),
                header_height = this.get_$station_header().height(),
                win_height = $(window).height(),
                height = win_height - bar_height - header_height - 27;
            this.get_$main().css('height', height + 'px');
        },

        on_refresh: function(files) {
            var me = this;
            if(files && files.length) {
                var file_list = $(tmpl.file_item(files)),
                    $container = this.get_$view_ct().find('#_station_view_list .files');
                file_list.appendTo($container);
                image_lazy_loader.init($container);

                this.get_$view_empty().css('display', 'none');
                this.get_$view_empty().removeClass('ui-view-empty');
                this.get_$station_header().css('display', 'block');
                this.adjust_area();

                this.files = files;
                this.$file_list = $container.children();
                this.$file_list.each(function(i, item) {
                    //me.select_file(i, item);
                    $(item).on('click', '['+action_property_name+']' ,function(e){
                        e.preventDefault();
                        var $target = $(e.target).closest('['+action_property_name+']', $(item));
                        if($target.attr(action_property_name) === 'select') {
                            me.select_file(item);
                        }
                        me.trigger('action', $target.attr(action_property_name), me.files[i], e);
                    });
                    //预览文件，主要是图片
                    //$(item).on('click', function(e){
                    //    e.preventDefault();
                    //    var is_data_action = !!$(e.target).closest('[' + action_property_name + ']').length;
                    //    if (is_data_action) {
                    //        return;
                    //    }
                    //    me.trigger('action', 'open', me.files[i], e);
                    //});
                });
            } else if(files && files.length === 0) {
                this.remove_all();
                this.get_$view_empty().css('display', 'block');
                this.get_$view_ct().addClass('ui-view-empty');
                this.adjust_area();
            }
        },

        on_add: function(files) {
            var is_checkalled = column_model.is_checkalled(),
                me = this;
            if(files && files.length) {
                var file_list = $(tmpl.file_item(files)),
                    $container = this.get_$view_ct().find('#_station_view_list .files');

                file_list.appendTo($container);
                //image_lazy_loader.init($container);
                files.forEach(function(item) {
                    me.files.push(item);
                });
                file_list.each(function(i, item) {
                    if(item.nodeType === 1) {
                        is_checkalled && $(item).addClass('ui-selected');
                        me.$file_list.push(item);
                        $(item).on('click', '['+action_property_name+']' ,function(e){
                            e.preventDefault();
                            var $target = $(e.target).closest('['+action_property_name+']', $(item));
                            if($target.attr(action_property_name) === 'select') {
                                me.select_file(item);
                            }
                            me.trigger('action', $target.attr(action_property_name), me.files[i], e);
                        });
                    }
                });
                this.adjust_area();
            }
        },

        select_file: function(item) {
            if($(item).hasClass('ui-selected')) {
                $(item).removeClass('ui-selected');
            } else {
                $(item).addClass('ui-selected');
            }
            this._block_hoverbar_if(this.get_selected_files().length);
        },

        select_all_files: function(select_all_files) {
            this.$file_list && this.$file_list.each(function(i, item) {
                if(select_all_files) {
                    if(!$(item).hasClass('ui-selected')) {
                        $(item).addClass('ui-selected');
                    }
                } else{
                    if($(item).hasClass('ui-selected')) {
                        $(item).removeClass('ui-selected');
                    }
                }
            });
            var selected_files_cnt = select_all_files? this.$file_list.length : 0;
            this._block_hoverbar_if(selected_files_cnt);
        },

        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                this.get_$view_ct().addClass('block-hover');
            } else {
                this.get_$view_ct().removeClass('block-hover');
            }
        },

        remove_all: function() {
            this.$file_list && this.$file_list.remove();
            this.files = null;
        },

        _handle_item_click: function (e) {
            console.log('_handle_item_click');
        },

        get_selected_files: function() {
            var selected_files = [],
                me = this;
            $.each(this.$file_list, function(i, item) {
                if($(item).hasClass('ui-selected')) {
                    selected_files.push(me.files[i]);
                }
            });

            return selected_files;
        },

        get_total_size: function() {
            return this.files? this.files.length : 0;
        },

        get_scroller: function () {
            if (!scroller) {
                var Scroller = common.get('./ui.scroller'),
                scroller = new Scroller(this.get_$main_box());
            }
            return scroller;
        },

        get_$view_empty: function () {
             return this.$view_empty || (this.$view_empty = $('#_station_view_empty'));
        },

        get_$ct_list: function() {
            return this._$ct_list || (this._$ct_list = $('#_disk_files_file_list'));
        },

        get_$view_ct: function () {
            return this.$view_ct || (this.$view_ct = $('#_station_body'));
        },

        get_$main: function() {
            return this._$main || (this._$main = $('#_main_content'));
        },

        get_$main_box: function() {
            return this._$main_box || (this._$main_box = $('#_main_box'));
        },

        get_$disk_body: function() {
            return this._$disk_body || (this._$disk_body= $('#_disk_body'));
        },

        get_$station_header: function() {
            return this._$station_header || (this._$station_header = $('#_main_station_header'));
        },

        get_$station_toolbar: function() {
            return this._$station_toolbar || (this._$station_toolbar = $('#_station_toolbar'));
        },

        get_$bar1_ct: function() {
            return this.$bar1_ct || (this.$bar1_ct = $('#_main_bar1'));
        },

        get_$load_more: function () {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        }
    });

    return View;
});