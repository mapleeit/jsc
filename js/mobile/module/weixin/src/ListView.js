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
        image_lazy_loader = require('./image_lazy_loader'),
        store = require('./store'),
        tmpl = require('./tmpl'),

        undefined;

    function ListView(cfg) {
        $.extend(this, cfg);
        this.name = 'weixin.list_view';
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

            image_lazy_loader.init(this.$ct);
            this.on_render();
            this.bind_events();
            this.on_refresh(store.get_cur_node().get_kid_nodes(), true);
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
                $('#_load_more').hide();
            }).listenTo(store, 'before_load', function() {
                $('#_load_more').show();
            }).listenTo(store, 'refresh_done', function(files) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_refresh(files);
            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
                $('#_load_more').hide();
            }).listenTo(store, 'load_fail', function(msg, ret, is_refresh) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_load_fail(msg, is_refresh);
            }).listenTo(store, 'restore', function() {
                me.change_select_mode();
            });
        },

        on_render: function() {
            this.$ct = $('#_list');

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
                    file = me.store.get(file_id);

                if(me._select_mode) {
                    $item.toggleClass('checked');
                    selection.toggle_select(file);
                    me._$confirm_btn.toggleClass('btn-disable', !selection.get_selected().length);
                } else {
                    me.trigger('action', action_name, file, e);
                }
            });

            this._$confirms = this.$toolbar.find('[data-id=confirm]');
            this._$normal = this.$toolbar.find('[data-id=normal]');
            this._$confirm_btn = this.$toolbar.find('[data-action=confirm]');
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
            this.$ct.toggleClass('active');

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
                me._$confirms.show();
            }
        },

        on_refresh: function(files, is_async) {
            if(!files.length) {
                this.$toolbar.hide();
                this.empty();
                return;
            }
            if(!is_async) {
                var html = tmpl.list({
                    list: files
                });
                this.$ct.empty().append(html);
                this.$toolbar.show();
            }
            image_lazy_loader.load_image();
        },

        on_add: function(files) {
            var html = tmpl.list({
                list: files
            });
            this.$ct.append(html);
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