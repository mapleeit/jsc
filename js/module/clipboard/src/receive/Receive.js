/**
 * 剪贴板模块 接收tab
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),

        global_event = common.get('./global.global_event'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),

        Loader = require('./receive.Loader'),
        View = require('./receive.View'),
        Mgr = require('./receive.Mgr'),
        Detail = require('./receive.Detail'),
        clipboard_plugin = require('main').get('./clipboard_plugin'),

        tmpl = require('./tmpl'),

        undefined;

    var Receive = inherit(Event, {

        name: 'receive',

        title: '接收',

        render: function($render_to) {
            if(this._rendered) {
                return;
            }
            this._$ct = $(tmpl.receive()).appendTo($render_to);
            this.store = new Store();
            this.list_view = new View({
                name: 'receive_list',
                list_selector: '.clip-receive-list',
                item_selector: '[data-file-id]',
                store: this.store
            });

            this.list_view.render(this._$ct);
            this.listenTo(this.list_view, 'recordclick', this.on_show_detail, this);

            this.loader = new Loader({
                store: this.store,
                auto_load: true
            });

            //this.bind_loader_events(this.loader);
            //this.loader.load_data();

            this.mgr = new Mgr({
                store: this.store
            });
            this.mgr.observe(this.list_view);
            this.activate();
            this._rendered = true;
        },

        is_rendered: function() {
            return !!this._rendered;
        },

        /**
         * 监听加载器发出的事件
         * @param loader
         */
        /*bind_loader_events: function(loader) {
            this
                .listenTo(loader, 'before_load', function() {
                    widgets.loading.show();
                })
                .listenTo(loader, 'after_load', function() {
                    widgets.loading.hide();
                })
                .listenTo(loader, 'error', function(msg) {
                    mini_tip.error(msg);
                });
        },*/

        /**
         * 创建详细视图
         * @returns {Detail}
         */
        create_detail_view: function() {
            var detail_view = new Detail({
                $render_to: this.get_$ct()
            });
            this.mgr.observe(detail_view);
            this.detail_view = detail_view;
            return detail_view;
        },

        /**
         * 显示详细视图
         * @param record
         * @param event
         */
        on_show_detail: function(record, event) {
            var list_view = this.get_list_view(),
                detail_view = this.get_detail_view();

            event.preventDefault();
            if(!detail_view) {
                detail_view = this.create_detail_view();
            }

            list_view.hide();
            detail_view.set_record(record);
            detail_view.show();
            global_event.trigger('exit_clipboard_list');
            user_log('CLIPBOARD_RECEIVE_SHOW_DETAIL');
        },

        get_list_view: function() {
            return this.list_view;
        },

        get_detail_view: function() {
            return this.detail_view;
        },

        is_activated: function() {
            return !!this._is_activated;
        },

        /**
         * 是否是详细视图模式
         * @returns {boolean|*}
         */
        is_detail_mode: function() {
            return this.detail_view && !this.detail_view.is_hide();
        },

        activate: function() {
            if(this.is_activated()) {
                return;
            }
            //有未读消息，强制进入接收列表
            if(clipboard_plugin.get_unread_records_num() && this.is_detail_mode()) {
                this.get_list_view().show();
                this.get_detail_view().hide();
            }
            this.show();
            this._is_activated = true;
            if(!this.is_detail_mode()) {
                global_event.trigger('enter_clipboard_list');
                user_log('CLIPBOARD_RECEIVE_TAB');
            }
        },

        deactivate: function() {
            if(!this.is_activated()) {
                return;
            }
            this.hide();
            //this.mgr.abort_ajax();
            //this.loader.abort();
            this._is_activated = false;
            if(!this.is_detail_mode()) {
                global_event.trigger('exit_clipboard_list');
            }
        },

        show: function() {
            var detail_view = this.detail_view;
            this.get_$ct().show();
            if(detail_view && !detail_view.is_hide()) {
                detail_view.show_tbar();
            }
        },

        hide: function() {
            var detail_view = this.detail_view;
            this.get_$ct().hide();
            if(detail_view && !detail_view.is_hide()) {
                detail_view.hide_tbar();
            }
        },

        get_$ct: function() {
            return this._$ct;
        },

        destroy: function() {
            this.list_view.destroy();
            this.detail_view && this.detail_view.destroy();
            this.list_view = null;
            this.detail_view = null;
            this._$ct.remove();
            this._$ct = null;
        }
    });

    return Receive;
});