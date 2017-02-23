/**
 * QQ通行证登录UI
 * @author jameszuo
 * @date 13-3-26
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        force_blur = lib.get('./ui.force_blur'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        query_user = common.get('./query_user'),

        tmpl = require('./tmpl'),

        qq_login,

        undefined;
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
    //限制登录的提示信息
    var err_msg_map = {
        '190011': '企业QQ号码无法使用微云，请使用普通QQ号码登录'
    };

    var ui = new Module('qq_login_ui', {

        render: function () {
            qq_login = require('./qq_login');
            this._render();
        },

        _render: function() {
            this._$el = $(tmpl.qq_login_box()).appendTo(document.body).css({ display: 'none', zIndex: 3000, width: '420px', height: '316px', backgroundColor: '#fff' });
            this._$el.find('.login').css({width: '422px', height: '316px', top: '50px', right: '0px', zIndex: '-1' });
            this._$qq_iframe = this._$el.find('#_qq_login_frame');
            this._$wx_iframe = this._$el.find('#_wx_login_frame');
            this._$agree_btn = $('.j-agree-switch');
            this._$agree_mask = $('.j-agree-mask');
            ptlogin_callback_mgr.register('Resize', this.on_ptlogin_resize, this);

            this.bind_events();
        },

        bind_events: function() {
            var me = this;
	        var curMod = 'qq';
            me._$el.on('click', '[data-mod]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-mod]');
                var mod = $target.attr('data-mod');
	            curMod = mod;
		        if(mod == 'close') {
			        qq_login.hide();
		        } else if(mod == 'qq') {
                    $target.addClass('checked');
                    me._$el.find('.choose-wx-wrap').removeClass('checked');
                    $('#_qq_login_frame').show();
                    $('#_wx_login_frame').hide();
                    me._$agree_mask.hide();
                    me._$agree_btn.find("[data-id=qq] .mod-check").addClass('act');
                    me._$agree_btn.find("[data-id=qq]").show();
                    me._$agree_btn.find("[data-id=weixin]").hide();
                } else if(mod == 'weixin') {
                    $target.addClass('checked');
                    me._$el.find('.choose-qq-wrap').removeClass('checked');
                    $('#_qq_login_frame').hide();
                    $('#_wx_login_frame').show();
                    me._$agree_mask.hide();
                    me._$agree_btn.find("[data-id=weixin] .mod-check").addClass('act')
                    me._$agree_btn.find("[data-id=qq]").hide();
                    me._$agree_btn.find("[data-id=weixin]").show();
                }
            });

            me._$el.on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(e.target).closest('[data-action]');
                var action = $target.attr('data-action');
                if(action === 'agreement') {
                    var is_agree = $target.hasClass('act'),
                        $mask = $('.j-agree-mask');
                    if(is_agree) {
                        $mask.show();
                    } else {
                        $mask.hide();
                    }
                    $target.toggleClass('act');
                }
            });

	        me._$el.on('mouseover', '[data-mod]', function(e) {
		        e.preventDefault();
		        var $target = $(e.target).closest('[data-mod]');
		        var mod = $target.attr('data-mod');
		        if(mod == 'qq') {
			        $target.addClass('checked');
			        $('.choose-wx-wrap').removeClass('checked');
		        } else if(mod == 'weixin') {
			        $target.addClass('checked');
			        $('.choose-qq-wrap').removeClass('checked');
		        }
	        });

	        me._$el.on('mouseout', '[data-mod]', function(e) {
		        e.preventDefault();
		        if(curMod == 'qq') {
			        $('.choose-qq-wrap').addClass('checked');
			        $('.choose-wx-wrap').removeClass('checked');
		        } else {
			        $('.choose-wx-wrap').addClass('checked');
			        $('.choose-qq-wrap').removeClass('checked');
		        }
	        });
        },
        
        on_ptlogin_resize : function(width, height){
            var $el = this._$el;
            $el.css({
                width : width+'px',
                height : height+'px'
            });
            if(this.visible){
                center.update($el);
            }
        },

        show: function () {
            this.visible = true;
            this._$el.stop(false, true).fadeIn('fast');
            this._$qq_iframe.attr('src', qq_login.get_ptlogin_url());
            this._$wx_iframe.attr('src', qq_login.get_wxlogin_url());
            center.listen(this._$el);

            this.trigger('show');
        },

        hide: function () {
            this.visible = false;
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });

                force_blur(); // 修复浏览器状态栏始终显示 javascript:void(0); 的问题 - james

                this.trigger('hide');
            }
        },

        show_limit_tip: function(err_code) {
            this.destroy();
            this._render();
            this.show();

            var $tip = this._$limit_tip || $(tmpl.limit_login_tip({tip_msg: err_msg_map[err_code+'']})).appendTo(this._$el);
            $tip.fadeIn(500);
            setTimeout(function() {
                $tip.fadeOut(500);
            }, 5000);
            this._$limit_tip = $tip;
        },

        destroy: function() {
            if(this._$el) {
                this._$el.remove();
                this._$el = null;
                this._$iframe.remove();
                this._$iframe = null;
                this._$limit_tip && this._$limit_tip.remove();
                this._$limit_tip = null;
                ptlogin_callback_mgr.unregister('Resize');
            }
        }
    });
    return ui;
});