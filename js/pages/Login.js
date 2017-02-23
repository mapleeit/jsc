/**
 * 登录相关，这里登录要求与网盘不同，用户可以取消
 * @author cluezhang
 * @date 2013-6-18
 */
define("club/weiyun/js/pages/Login",["$","./lib.extend","common"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        extend = lib.get('./inherit'),
        common = require('common'),
        urls = common.get('./urls'),
        center = common.get('./ui.center'),
        widgets = common.get('./ui.widgets'),
        id_seed = 0;
    // 管理ptlogin的全局回调
    var ptlogin_callback_mgr = {
        ptlogin_events : [
            'Close',
            'LoginEx', // 它返回非true时表示出错。。。登录中止（if(!LoginEx(xxx)){ return; }）
            'Logout',
            'Reset',
            'Resize'
        ],
        callbacks_map : {},
        hooked_events : {},
        asure_event_hooked : function(event){
            var hooked_events = this.hooked_events;
            if(hooked_events.hasOwnProperty(event)){
                return;
            }
            var me = this,
                global = window;
            var fn_name = 'ptlogin2_on' + event,
                old_fn = global[fn_name];
            global[fn_name] = function(){
                var ret = me._trigger(event, $.makeArray(arguments));
                ret = ret !== false;
                if(ret && $.isFunction(old_fn)){
                    ret = old_fn();
                    ret = !!ret;
                }
                return ret;
            };
            hooked_events[event] = true;
        },
//        init : function(){
//            var me = this,
//                global = window;
//            $.each(me.ptlogin_events, function(index, event){
//                var fn_name = 'ptlogin2_on' + event,
//                    old_fn = global[fn_name];
//                global[fn_name] = function(){
//                    var ret = me._trigger(event, $.makeArray(arguments));
//                    ret = ret !== false;
//                    if(ret && $.isFunction(old_fn)){
//                        ret = old_fn();
//                        ret = !!ret;
//                    }
//                    return ret;
//                };
//            });
//        },
        register : function(event, callback, scope){
            this.asure_event_hooked(event);
            this._get_callbacks(event).push({
                fn : callback,
                scope : scope
            });
        },
        unregister : function(event, callback, scope){
            var callbacks = this._get_callbacks(event),
                processed = [];
            $.each(callbacks, function(index, o){
                if(o.fn !== callback || o.scope !== scope){
                    processed.push(o);
                }
            });
            this.callbacks_map[event] = processed;
        },
        _get_callbacks : function(event){
            var map = this.callbacks_map,
                callbacks = map[event];
            if(!callbacks){
                callbacks = map[event] = [];
            }
            return callbacks;
        },
        _trigger : function(event, argus){
            var callbacks = this._get_callbacks(event).slice(0);
            $.each(callbacks, function(index, o){
                o.fn.apply(o.scope, argus);
            });
        }
    };
//    ptlogin_callback_mgr.init();
    
    // 登录组件
    var Login = extend(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
            var me = this;
            me.id = 'common_login_'+(id_seed++);
            var callback_name = me._global_callback_name = 'common_login_callback_'+me.id;
            window[callback_name] = function(){
                me._login_done();
            };
            me.callbacks = [];
        },
        _get_login_el : function(){
            var el = this.el;
            if(!el){
                el = this.el = $('<div><iframe id="_qq_login_frame" style="height:100%;width:100%;" scrolling="auto" frameborder="0" src=""></iframe></div>').appendTo(document.body).hide();
                el.css({
                    'position': 'fixed',
                    'left': '50%',
                    'top': '50%',
                    'width': '622px',
                    'height': '368px',
                    'display': 'block',
                    'z-index': '3000',
                    'background-color': 'white'
                });
                ptlogin_callback_mgr.register('Resize', function(width, height){
                    el.css({
                        width : width+'px',
                        height : height + 'px'
                    });
                });
            }
            return el;
        },
        /**
         * @param {Object} options (optional) 登录参数，非必须
         * @param {Function} callback (optional) 结束后的回调，非必须，注意当用户取消登录时也会触发，此时第一个参数为false
         * @param {Object} scope (optional)
         */
        login : function(options, callback, scope){
            var me = this,
                el = me._get_login_el();
            if($.isFunction(options)){
                scope = callback;
                callback = options;
                options = null;
            }
            el.stop(false, true).fadeIn('fast');
            el.find('iframe').attr('src', me._get_url(options || {}));
            center.listen(el);

            widgets.mask.show(me.id);
            
            if($.isFunction(callback)){
                me.callbacks.push({
                    fn : callback,
                    scope : scope
                });
            }
            this._hook_cancel();
        },
        _sync_center : function(){
            var el = this._get_login_el();
            center.update(el);
        },
        _hook_cancel : function(){
            ptlogin_callback_mgr.register('Close', this._login_cancel, this);
            ptlogin_callback_mgr.register('Resize', this._sync_center, this);
        },
        _unhook_cancel : function(){
            ptlogin_callback_mgr.unregister('Close', this._login_cancel, this);
            ptlogin_callback_mgr.unregister('Resize', this._sync_center, this);
        },
        _do_hide : function(){
            var el = this._get_login_el();
            el.stop(false, true).fadeOut('fast');
            center.stop_listen(el);
            widgets.mask.hide(this.id);
        },
        _login_done : function(){
            this._do_hide();
            
            $.each(this.callbacks, function(index, o){
                o.fn.call(o.scope, true);
            });
            this.callbacks = [];
            this._unhook_cancel();
        },
        _login_cancel : function(){
            this._do_hide();
            
            $.each(this.callbacks, function(index, o){
                o.fn.call(o.scope, false);
            });
            this.callbacks = [];
            this._unhook_cancel();
        },
        _get_url : function(options){
            return urls.make_url('http://ui.ptlogin2.weiyun.com/cgi-bin/login', {
                appid: 527020901,
                s_url: urls.make_url('/web/callback/common_qq_login_ok.html?'+this._global_callback_name),
                style: options.style || 11,
                target: 'self',
                link_target: 'blank',
                hide_close_icon: options.hasOwnProperty('hide_close_icon') ? options.hide_close_icon : 0
            });
        }
    });
    
    return Login;
});