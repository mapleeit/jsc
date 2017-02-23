/**
 * ListView列表类
 * @author hibincheng
 * @date 2015-03-19
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        widgets = common.get('./ui.widgets'),
        selection = require('./selection'),
        note_preview = require('./note_preview'),
        router = lib.get('./router'),
        //image_lazy_loader = require('./image_lazy_loader'),
        store = require('./store'),
        tmpl = require('./tmpl'),

        undefined;

    function ListView(cfg) {
        $.extend(this, cfg);
        this.name = 'note.list_view';
        this._select_mode = false; //选择模式
        if(this.auto_render) {
            this.render();
        }
    }

    ListView.prototype = {

        render: function() {
            if(this._rendered) {
                return;
            }
            router.init('root');
            this.on_refresh(store.get_all_records());
            this.on_render();
            this.bind_events();
            this._rendered = true;
        },

        /**
         * 监听store变化，更新视图
         */
        bind_events: function() {
            var store = this.store,
                me = this;
            //store events
            this.listenTo(store, 'before_refresh', function() {
                me.$ct.empty();
                me.$toolbar.hide();
                widgets.reminder.loading('加载中...');
                //widgets.reminder.loading('加载中...');
                $('#_load_more').hide();
            }).listenTo(store, 'before_load', function() {
                this.$toolbar.hide();
                $('#_load_more').show();
            }).listenTo(store, 'refresh_done', function(files) {
                console.log('ListView: store is refresh_done.');
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_refresh(files);
            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
                $('#_load_more').hide();
            }).listenTo(store, 'load_fail', function(msg, ret, is_refresh) {
                widgets.reminder.hide();
                me.on_load_fail(msg, is_refresh);
            }).listenTo(store, 'restore', function() {
                me.change_select_mode();
            });


            this.listenTo(router, 'change', function(to, from) {
                if(to === 'root'){
                    note_preview.destroy();
                    me.scroll_to_before(from);
                }
            });
        },

        scroll_to_before: function(from) {
            //alert(from + ':' + $('#item_' + from).offset().top);
            var _top = $('#item_' + from).offset().top;
            $('html, body').animate({scrollTop: _top}, 1000);

        },

        on_render: function() {
            var me = this;
            var is_move = false;
            this.$ct.on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            //监听UI事件，然后让mgr处理
            this.$ct.on('touchend', '[data-id=item]', function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $item = $(e.target).closest('[data-id=item]'),
                    action_name = $item.attr('data-action'),
                    file_id = $item.attr('data-file-id'),
                    file = me.store.get_file(file_id);

                if(me._select_mode) {
                    $item.toggleClass('checked');
                    selection.toggle_select(file);
                    me._$confirm_btn.toggleClass('btn-disable', !selection.get_selected().length);
                    if(selection.get_selected().length) {
                        me._$choose_num.text('(' + selection.get_selected().length + ')');
                    } else {
                        me._$choose_num.text('');
                    }
                } else {
                    me.trigger('action', action_name, file, e);
                }
            });

            this._$confirms = this.$toolbar.find('[data-id=confirm]');
            this._$normal = this.$toolbar.find('[data-id=normal]');
            this._$confirm_btn = this.$toolbar.find('[data-action=confirm]');
            this._$choose_num = this.$toolbar.find('[data-id=choose_num]');
            this.$toolbar.on('touchend', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(selection.is_empty() && action_name === 'confirm') {
                    return;
                }
                if(action_name === 'share') {
                    me.change_select_mode();
                } else {
                    if(action_name === 'confirm') {
                        me.trigger('action', 'share');//完成分享后，再进行change_select_mode
                    } else {
                        me.change_select_mode();
                    }
                }
            });

        },

        change_select_mode: function() {
            this._select_mode = !this._select_mode;
            this.$ct.find('ul').toggleClass('active');

            var me = this,
                selected_files;
            if(!this._select_mode) {
                selected_files = selection.get_selected();
                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).removeClass('checked');
                });
                selection.clear();
                me._$normal.show();
                me._$confirms.hide();

            } else {
                me._$normal.hide();
                me._$confirm_btn.addClass('btn-disable').show();
                me._$choose_num.text('');
                me._$confirms.show();
            }
        },

        on_refresh: function(notes, is_async) {
            if(notes.length) {
                if(!is_async) {
                    var html = tmpl.note_list({
                        list: notes
                    });
                    this.$ct.empty().append(html);
                    //wx_jsapi.is_ok() && this.$toolbar.show();
                    this.last_group_day = notes[notes.length - 1][0].get_offset_day();
                    this.$toolbar.show();
                }
                $('#_load_more').hide();
                $('#_note_view_list').show();
            } else {
                this.$toolbar.hide();
                this.empty();
            }
        },

        on_add: function(items) {
            if(this.last_group_day && items[0][0].get_offset_day() === this.last_group_day) {
                var html = tmpl.note_item({
                    list: items[0]
                });
                var group = this.$ct.find('ul'),
                    last_note_list = $(group[group.length-1]).children();
                $(last_note_list[last_note_list.length - 1]).addClass('bBor');
                $(group[group.length-1]).append(html);
                items.shift();
            }
            if(items.length) {
                var html = tmpl.note_list({
                    list: items
                });
                this.$ct.append(html);
                this.last_group_day = items[items.length - 1][0].get_offset_day();
            }
            this.$toolbar.show();
        },

        on_load_fail: function(msg, is_refresh) {
            var me = this;
            if(is_refresh) {
                this.$ct.empty().append(tmpl.fail({
                    msg: msg
                }));

                $('#_fail').on('touchend', function(e) {
                    me.trigger('action', 'refresh');
                });
            }
        },

        empty: function() {
            this.$ct.empty().append(tmpl.empty());
        },

        get_$item_by_id: function(file_id) {
            return $('#item_' + file_id);
        },

        get_$ct: function() {
            return this._$ct;
        }

    };

    $.extend(ListView.prototype, events);

    return ListView;
});