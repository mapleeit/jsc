/**
 * 剪贴板模块 接收tab 管理器，列表及详细视图都由这mgr管理
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),
        store = lib.get('./store'),
        json = lib.get('./json'),

        global_event = common.get('./global.global_event'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),

        REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
        undefined;

    var Mgr = inherit(Event, {

        constructor: function(cfg) {
            $.extend(this, cfg);
            this._observe_mods_map = {};
        },
        /**
         * 观察者模式实现，监听模块的自定义事件
         * @param {Module} mod 模块
         */
        observe: function(mod) {
            if(this.has_observe_mod(mod)) {
                return;
            }
            this._observe_mods_map[mod.name] = mod;
            this.bind_action(mod);
        },

        has_observe_mod: function(mod) {
            if(!mod.name) {
                console.error('observe module must have name');
                return false;
            }
            return !!this._observe_mods_map[mod.name];
        },
        /**
         * 绑定自定义事件
         * @param mod
         */
        bind_action: function(mod) {
            this.listenTo(mod, 'action', function(action_name, data, event, extra) {
                this.dispatch_action(action_name, data, event, extra);
            });
        },
        /**
         * 分派自定义事件
         * @param {String} action_name 事件名
         * @param {Object} data 参数
         * @param {jQuery.Event} event
         */
        dispatch_action: function(action_name, data, event, extra) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](data, event, extra);
            }
            event.preventDefault();
        },

        /**
         * 返回到接收列表
         */
        on_back: function(record, event, extra) {
            this.get_list_view().show();
            this.get_detail_view().hide();
            global_event.trigger('enter_clipboard_list');
            if(extra && extra.src === 'detailmenu') {
                user_log('CLIPBOARD_RECEIVE_DETAIL_BACK_BTN');
            }
        },

        /**
         * 复制操作，ie非flash时走这里逻辑，其它用flash实现
         * @param record
         * @param event
         */
        on_copy: function(record, event, extra) {
            event.preventDefault();
            var view = this.get_list_view();
            view.copy.ie_copy(record.get('content'));
            if(extra) {
                switch(extra.src) {
                    case 'contextmenu':
                        user_log('CLIPBOARD_RECEIVE_CONTEXTMENU_COPY');
                        break;
                    case 'detailmenu':
                        user_log('CLIPBOARD_RECEIVE_DETAIL_COPY_BTN');
                        break;
                }
            }
        },

        /**
         * 删除一条剪贴板内容
         * @param record
         * @param event
         */
        on_delete: function(record, event, extra) {
            var ctime = record.get('ctime'),
                me = this;

            widgets.confirm('删除', '您确定删除吗？', '', function() {
                request.xhr_post({
                    url: REQUEST_CGI,
                    cmd: 'ClipBoardDelete',
                    cavil: true,
                    pb_v2: true,
                    body: {
                        msg_ctime: ctime
                    }
                })
                    .ok(function(msg, body) {
                        mini_tip.ok('删除成功');
                        me.store.remove(record);
                        global_event.trigger('remove_clipboard_success', ctime);
                        if(me.is_detail_mode()) {
                            me.on_back();
                        }
                    })
                    .fail(function(msg, ret) {
                        mini_tip.error(msg || '删除失败');
                    });

                if(extra) {
                    switch(extra.src) {
                        case 'contextmenu':
                            user_log('CLIPBOARD_RECEIVE_CONTEXTMENU_DELETE');
                            break;
                        case 'detailmenu':
                            user_log('CLIPBOARD_RECEIVE_DETAIL_DELETE_BTN');
                            break;
                    }
                }

            }, null, ['是', '否']);

        },

        /**
         * 根据模块名找到对应已监听的模块
         * @param name
         * @returns {*}
         */
        get_observe_mod_by_name: function(name) {
            return this._observe_mods_map[name];
        },
        /**
         * 详情视图模式
         */
        is_detail_mode: function() {
            var detail_view = this.get_detail_view();
            return detail_view && !detail_view.is_hide();
        },

        /**
         * 详细视图
         * @returns {*}
         */
        get_detail_view: function() {
            return this.get_observe_mod_by_name('receive_detail');
        },
        /**
         * 列表视图
         * @returns {*}
         */
        get_list_view: function() {
            return this.get_observe_mod_by_name('receive_list');
        },

        destroy: function() {
            $.map(this._observe_mods_map, function(mod) {
                me.stopListen(mod, 'action');
            });
            this._observe_mods_map = null;
        }

    });

    return Mgr;
});