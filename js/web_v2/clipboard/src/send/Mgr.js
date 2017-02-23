/**
 * 剪贴板模块 发送tab 管理器
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
        text = lib.get('./text'),

        global_event = common.get('./global.global_event'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),

        REQUEST_CGI = 'http://web2.cgi.weiyun.com/clip_board.fcg',
        device_id = constants.DEVICE_ID,

        undefined;

    var Mgr = inherit(Event, {

        constructor: function(cfg) {
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
            this.listenTo(mod, 'action', function(action_name, data, event) {
                this.dispatch_action(action_name, data, event);
            });
        },
        /**
         * 分派自定义事件
         * @param {String} action_name 事件名
         * @param {Object} data 参数
         * @param {jQuery.Event} event
         */
        dispatch_action: function(action_name, data, event) {
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                this[fn_name](data, event);
            }
            event && event.preventDefault();
        },

        /**
         * 发送剪贴内容
         * @param event
         */
        on_send: function(event) {
            var content = this.get_editor().get_content(),
                me = this;
            if(!content || content === '输入或粘贴一段内容，可以发送到自己的手机上（需要安装手机版微云）。') {
                mini_tip.warn('发送内容为空');
                me.get_fbar().toggle_send_btn(true);
                return;
            }

            if(this._send_req) {
                this._send_req.destroy();
            }
            this._send_req = request.xhr_post({
                url: REQUEST_CGI,
                cmd: 'ClipBoardUpload',
                cavil: true,
                pb_v2: true,
                body: {
                    msg_info: {
                        items: [{
                            type: 1,
                            content: content
                        }],
                        device_id: device_id
                    }
                }
            })
                .ok(function(msg, body) {
                    mini_tip.ok('发送成功！可以在您其他安装了微云的设备上接收');
                    me.get_fbar().on_send_succ(true);
                    me.store_owner_send_ctime(body.msg_ctime);
                })
                .fail(function(msg, ret) {
                    if(ret == 190013) {
                        msg = '字符数超出限制';
                    }
                    mini_tip.error(msg || '发送失败');
                    me.get_fbar().on_send_succ(false);
                });

            user_log('CLIPBOARD_SEND_SEND_BTN');
        },

        /**
         * 保存自己发送的消息的创建时间，用于轮询更新消息时过滤掉自己发的
         */
        store_owner_send_ctime: function(ctime) {
            var local_ctimes;
            if(ctime) {
                global_event.trigger('send_clipboard_success', ctime);
            }
        },

        /**
         * 清除编辑器中的内容
         * @param event
         */
        on_clear: function(event) {
            var editor = this.get_editor(),
                fbar = this.get_fbar();
            editor.clear();
            fbar.toggle_clear_btn(false);
            user_log('CLIPBOARD_SEND_CLEAR_BTN');
        },

        on_empty: function(is_empty) {
            var fbar = this.get_fbar();
            fbar.toggle_clear_btn(!is_empty);
        },

        get_observe_mod_by_name: function(name) {
            return this._observe_mods_map[name];
        },

        get_editor: function() {
            return this.get_observe_mod_by_name('editor');
        },

        get_fbar: function() {
            return this.get_observe_mod_by_name('footbar');
        },

        abort_ajax: function() {
            this._send_req && this._send_req.destroy();
        },

        destroy: function() {
            var me = this;
            this.abort_ajax();
            $.map(this._observe_mods_map, function(mod) {
                me.stopListen(mod, 'action');
            });
            this._observe_mods_map = null;
        }

    });

    return Mgr;
});