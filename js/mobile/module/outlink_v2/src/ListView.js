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
        browser = common.get('./util.browser'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',


        undefined;

    function ListView(cfg) {
        $.extend(this, cfg);
        this.name = 'outlink.list_view';
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
                //widgets.reminder.loading('加载中...');
            }).listenTo(store, 'before_load', function() {
                $('#_load_more').show();
            }).listenTo(store, 'refresh_done', function(files) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_refresh(files);

                //屏蔽save_all行为
                //if(files.length === 1 && files[0].get_parent() && !files[0].get_parent().get_parent()) {
                //    this._$normal.find('button').attr('data-action', 'save_all');
                //} else {
                    this._$normal.find('button').attr('data-action', 'save');
                //}

            }).listenTo(store, 'load_done', function(files) {
                me.on_add(files);
                me.default_all_selected(files);
                $('#_load_more').hide();
            }).listenTo(store, 'load_fail', function(msg, ret, is_refresh) {
                widgets.reminder.hide();
                $('#_load_more').hide();
                me.on_load_fail(msg, is_refresh);
            });
        },

        on_render: function() {
            var me = this;
            var is_move = false;
            this.$ct.on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            //监听UI事件，然后让mgr处理
            this.$ct.on(target_action, '[data-id=item]', function(e) {
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
            this.$toolbar.on(target_action, '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]'),
                    action_name = $target.attr('data-action');
                if(selection.is_empty() && action_name === 'confirm') {
                    return;
                }

                if((action_name === 'save' || action_name === 'save_all' || action_name === 'download') && store.is_single_file() && (store.get_cur_node() === store.get_root_node())) {
                    //根目录是单个文件，直接一键保存
                    //me.default_all_selected(store.get_cur_node().get_kid_nodes());
                    me.trigger('action', action_name, store.get_cur_node().get_kid_nodes());
                    return;
                }

                if(action_name === 'save_all') {
                    me.trigger('action', action_name);
                    return;
                }
                if(action_name === 'save' || action_name === 'save_all' || action_name === 'download') {
                    me._$normal.hide();
                    //me._$confirm_btn.addClass('btn-disable').show();
	                me._$confirm_btn.attr('data-target', action_name === 'download' ? 'download' : 'save');
                    me._$confirm_btn.show();
                    me._$confirms.show();
                    me.default_all_selected(store.get_cur_node().get_kid_nodes());
                } else {
                    me._$normal.show();
                    me._$confirms.hide();
                    me._$confirm_btn.removeClass('btn-disable');
                    if(action_name === 'confirm') {
                        me.trigger('action', $target.attr('data-target'), selection.get_selected());
                    }
                }
                me.change_select_mode();
            });

        },

        change_select_mode: function() {
            this._select_mode = !this._select_mode;
            if(this._select_mode) {
                this.$ct.removeClass('unactive').addClass('active');
            } else {
                this.$ct.removeClass('active').addClass('unactive');
            }

            var me = this,
                selected_files = selection.get_selected();
            if(!this._select_mode) {

                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).removeClass('checked');
                });
                selection.clear();

            } else {
                $.each(selected_files, function(i, file) {
                    me.get_$item_by_id(file.get_id()).addClass('checked');
                });
            }
        },

        on_refresh: function(files, is_async) {

            if(files.length) {
                if(!is_async) {
                    var html = tmpl.list({
                        list: files
                    });
                    this.$ct.empty().append(html);
                }
                this.$toolbar.show();
                image_lazy_loader.load_image();
            } else {
                this.$toolbar.hide();
                this.empty();
            }
        },

        default_all_selected: function(files) {
            var me = this;
            $.each(files, function(i, file) {
                me.get_$item_by_id(file.get_id()).addClass('checked');
                selection.select(file);
            });
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

                $('#_fail').on(target_action, function(e) {
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