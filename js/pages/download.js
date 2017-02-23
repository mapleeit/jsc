/**
 * 通用的客户端下载弹窗组件库，整理需求如下：
 * 1. 目前只分android、iPhone、iPad这3个版本，需要弹框选择不同下载途径
 * 2. 下载方式有以下：
 * 2.1 通过手机qq推送（仅android）
 * 2.2 通过短信发送（android、iPhone）
 * 2.3 点击链接下载/跳转（android、iPhone、iPad），iPhone与iPad可考虑分开，因为它们是转到iTunes Store，而不是下载
 * 2.4 二维码获取
 * 3. 根据端的不同，可供的下载方式不同，弹窗布局也不同。考虑将布局也弄成可配置的，不必自动处理。
 */
(function(){
    document.domain = 'weiyun.com';
    var $ = window.jQuery;
    var __IS_APPBOX = (function(){
        var loc = location,
            mainURL = loc.protocol + '//' + loc.host; // -> http://www.weiyun.com
        return loc.href.indexOf(mainURL + '/appbox/') === 0 || /[\?&]appbox(=[^&#]*)?/.test(loc.search);
    })();
    var inherit = (function(){
        var $ = window.jQuery;
        var object_proto = Object.prototype;
        var isObject = function (v) {
            return !!v && object_proto.toString.call(v) === '[object Object]';
        };
        var override = function (cls, overrides) {
            var proto = cls.prototype;
            $.extend(proto, overrides);
            if ($.browser.msie && overrides.hasOwnProperty('toString')) {
                proto.toString = overrides.toString;
            }
        };
        var object_constructor = object_proto.constructor;
        return function (sub_class, super_class, overrides) {
            if (isObject(super_class)) {
                overrides = super_class;
                super_class = sub_class;
                sub_class = overrides.constructor !== object_constructor ? overrides.constructor
                    : function () {
                    super_class.apply(this, arguments);
                };
            }
            var F = function () {
            }, sub_proto, super_proto = super_class.prototype;
    
            F.prototype = super_proto;
            sub_proto = sub_class.prototype = new F();
            sub_proto.constructor = sub_class;
            sub_class.superclass = super_proto;
            if (super_proto.constructor === object_constructor) {
                super_proto.constructor = super_class;
            }
            sub_class.override = function (o) {
                override(sub_class, o);
            };
            override(sub_class, overrides);
            return sub_class;
        };
    })();
    
    var cache = [];
    var log = function(data){
        cache.push(data);
    };
    var hook_log = function(special_log){
        if(!special_log){
            return;
        }
        var loaded_log = special_log.build_40_logger({});
        $.map(cache, loaded_log);
        log = loaded_log;
    };
    if(window.seajs){
        seajs.use( ['special_log'], hook_log);
    }else{
        hook_log(window.special_log);
    }
    
    
    var module = {
        method : {},
        dialog : {}
    };
    var method = module.method;
    /**
     * 下载途径基类，它要有这些功能：
     * 1. 有标题，标明途径（例如：短信获取下载地址、前往App Store下载）
     * 2. 渲染到指定节点
     */
    method.Base = inherit(Object, {
        type : 'base',
        html : '<div></div>',
        constructor : function(config){
            $.extend(this, config);
        },
        render : function($ct){
            if(this.rendered){
                return;
            }
            if($ct){
                this.$ct = $ct;
            }
            this.rendered = true;
            this.on_render();
            this.after_render();
        },
        on_render : function(){
            this.$el = $(this.html).appendTo(this.$ct);
        },
        after_render : $.noop,
        notify_using : function(){
            if(this.callback){
                this.callback.call(this.scope, this.type);
            }
        }
    });
    
    /**
     * 直接下载
     */
    method.DirectDownload = inherit(method.Base, {
        title : '下载安装包',
        type : 'directdownload',
        html : '<div class="btn"><span>下载安装包</span></div>',
        url : '',
        after_render : function(){
            var me = this;
            this.$el.on('click', function(e){
                e.preventDefault();
                location.href=module.urls.android;
                me.notify_using();
            });
        }
    });
    /**
     * 跳转到其它页面下载
     */
    method.Redirect = inherit(method.Base, {
        title : '前往App Store下载',
        type : 'redirect',
        html : '<div class="btn"><span>前往App store下载</span></div>',
        url : '',
        after_render : function(){
            var me = this;
            this.$el.on('click', function(){
                window.open(me.url);
                me.notify_using();
            });
        }
    });
    /**
     * QQ推送逻辑
     */
    var QQPush = method.QQPush = inherit(method.Base, {
        title : '发送到手机',
        type : 'send_to_phone',
        html : '<p class="desc">点击发送，安装包将发送到您的手机空间或手机QQ上。</p><button class="btn-goto">发送到手机</button>',
        after_render : function(){
            var me = this;
            // 点击发送，先同步cookie，再弹框
            me.$el.filter('button').on('click', function(){
                me.assure_login().done(function(){
                    me.assure_qq_sync().done(function(){
                        me.pop_push_dialog();
                    });
                });
                me.notify_using();
            });
        },
        assure_qq_sync : function(){
            // 先保证weiyun登录，再同步到qq.com
            var def = $.Deferred();
            
            // 使用ptlogin跳转到qq.com，再qq.com跳回weiyun.com，再调用父页面回调
            var callback_name = 'download_login_callback_' + (new Date()).getTime();
            var callback_url = 'http://www.weiyun.com/web/callback/common_qq_login_ok.html?'+encodeURIComponent(callback_name);
            var redirect_url = 'http://web.weiyun.qq.com/web/callback/common_qq_login_ok.html?'+encodeURIComponent(callback_url);
            var login_url = "http://ptlogin2.weiyun.com/ho_cross_domain?tourl="+encodeURIComponent(redirect_url);
            var $iframe = $('<iframe></iframe>').appendTo( $('body')).hide();
            window[callback_name] = function(){
                window[callback_name] = $.noop;
                $iframe.remove();
                def.resolve();
            };
            $iframe.attr( 'src', login_url );
            
            return def;
        },
        // 保证qq.com域的cookie同步过去了
        assure_login : function(){
            // 外部扩展接口
            if(window.assure_login){
                return window.assure_login();
            }
            // 先保证weiyun登录
            var def = $.Deferred(), me = this;
            
            seajs.use(['lib', 'common'], function(lib, common){
                var query_user = common.get('./query_user');
                if(query_user.get_uin() && query_user.get_skey()){
                    def.resolve();
                }else{
                    me.when_login_box_ready().done(function(login_mod){
                        login_mod.login(function(success){
                            if(success){
                                def.resolve();
                            }
                        });
                    });
                }
            });
            
            return def;
        },
        when_login_box_ready : function(){
            var def = $.Deferred();
            
            var me = this,
                login = me.login_mod;
            if(login){
                def.resolve(login);
            }else{
                seajs.use(['lib', 'common', 'login'], function(lib, common, Login){
                    def.resolve(me.login_mod = new Login());
                });
            }
            
            return def;
        },
        // 弹出推送框
        pop_push_dialog : function(){
            seajs.use('http://qzs.qq.com/open/canvas/pcpush.js', function(){
                /*global PCPUSH:true*/
                PCPUSH.show(100720601, 'EXTERNAL', '发送到手机');
            });
        }
    });
    /**
     * 手机短信发送逻辑
     * 1. 点击发送时，验证手机号合法性 + 如果有验证码，判断是否有输验证码
     * 2. 点击验证码、换一个时，重刷验证码
     * 3. 发送成功后，显示成功界面，显示重新发送切换回
     * 4. 发送失败后，显示失败信息；如果要验证码则显示验证区，否则不显示
     */
    var client_types = {
        Android : 1,
        iPhone : 2,
        AndroidSpecial : 3,
        iPad : 4,
        Mobile: 5
    };
    var state_types = {
        Init : 'init',
        Error : 'error',
        Success : 'success'
    };

    /**
     * 获取 g_tk
     * @returns {string}
     */
    var get_g_tk = function () {
        var s_key = _getCookie('skey') || '',
            hash = 5381;
        /* if (!s_key) {
         return '';
         }*/
        for (var i = 0, len = s_key.length; i < len; ++i) {
            hash += (hash << 5) + s_key.charCodeAt(i);
        }
        return hash & 0x7fffffff;
    };

    //获取cookie
    var _getCookie = function(name){
        var cookieValue = '';
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);

                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    var SMS = method.SMS = inherit(method.Base, {
        title : '短信获取下载地址',
        type : 'send_message',
        source : '', // 下载来源
        client_types : client_types,
        client_type : client_types.Android, // 下载目标机型
        captcha : false,
        state : state_types.Init,
        ret_map : {
            '6' : '发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。',
            '7' : '发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。'
        },
        html : '<p class="desc">请填写手机号，下载地址将发送到您的手机上。</p>' +
                '<div class="phonenum clearfix">' +
                    '<input type="text" class="ipt-phonenum">' +
                    '<button class="btn-send" data-captcha-action="send">发送短信</button>' +
                '</div>' +
                '<div class="sms-captcha clearfix">' +
                    '<input type="text" class="ipt-captcha" />' +
                    '<a href="#" data-captcha-action="change-captcha" title="点击换一张"><img alt="验证码" /></a>' +
                    '<a href="#" data-captcha-action="change-captcha">换一张</a>' +
                '</div>' +
                '<div class="sms-info clearfix">' +
                    '您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。' +
                    '<a href="#" data-captcha-action="resend">重新发送</a>' +
                '</div>' +
                '<div class="sms-error clearfix">错误提示</div>',
        on_render : function(){
            SMS.superclass.on_render.apply(this, arguments);
            var $el = this.$el;
            this.$form_desc = $el.filter('.desc');
            var $form = this.$form = $el.filter('.phonenum');
            this.$tel_input = $form.find('input');
            var $captcha = this.$captcha = $el.filter('.sms-captcha');
            this.$captcha_img = $captcha.find('img');
            this.$captcha_input = $captcha.find('input');
            this.$error = $el.filter('.sms-error');
            this.$info = $el.filter('.sms-info');
            
            this.update_ui();
        },
        after_render : function(){
            var me = this,
                action_property = 'data-captcha-action';
            this.$el.on('click', '['+action_property+']', function(e){
                e.preventDefault();
                var action = $(this).attr(action_property);
                switch(action){
                    case 'send':
                        me.send();
                        break;
                    case 'change-captcha':
                        me.update_captcha();
                        break;
                    case 'resend':
                        if(me.captcha){
                            me.update_captcha();
                        }
                        me.reset();
                        break;
                }
            });
            this.$captcha_input.add(this.$tel_input).on('keydown', function(e){
                var code = e.keyCode || e.which;
                if(code === 13){
                    me.send();
                }
            });
        },
        error : function(msg){
            this.state = state_types.Error;
            this.$error.html(msg || '网络繁忙，暂不能发送短信，请稍后再试。建议您通过左侧二维码的方式快速安装微云。');
            this.update_ui();
        },
        success : function(/* msg */){
            this.state = state_types.Success;
            this.update_ui();
        },
        reset : function(){
            this.state = state_types.Init;
            this.update_ui();
        },
        show_captcha : function(){
            this.captcha = true;
            this.update_captcha();
            this.update_ui();
            this.$captcha_input.focus();
        },
        update_ui : function(){
            var form = true,
                captcha = this.captcha,
                error = false,
                info = false;
            switch(this.state){
                case state_types.Init: // 初始待提交状态
                    break;
                case state_types.Error: // 出错状态
                    error = true;
                    break;
                case state_types.Success:
                    form = false;
                    info = true;
                    captcha = false;
                    break;
            }
            this.$form_desc.toggle(form);
            this.$form.toggle(form);
            this.$captcha.toggle(captcha);
            this.$error.toggle(error);
            this.$info.toggle(info);
        },
        update_captcha : function(){
            this.$captcha_img.attr('src', 'http://captcha.weiyun.com/getimage?aid=543009514&'+Math.random());
            this.$captcha_input.val('');
        },
        send : function(){
            if(this.sending){
                return;
            }
            this.reset();
            var tel = this.$tel_input.val(),
                captcha = this.$captcha_input.val(),
                options = {
                    number : tel,
                    captcha : captcha || undefined
                }, msg;
            msg = this.before_send(options);
            if(typeof msg === 'string'){
                return this.error(msg);
            }
            this.do_send(options);
            this.notify_using();
        },
        before_send : function(options){
            // 手机合法性
            if(!/^1[358]\d{9}$/.test(options.number)){
                return '请输入正确的手机号码';
            }
            // 如果有验证码，是否是合法的验证码
            if(this.captcha && !options.captcha){
                return '请输入验证码';
            }
        },
        translate : function(ret){
            return this.ret_map[ret];
        },
        do_send : function(options){
            var me = this;
            if(me.sending){
                return;
            }
            me.sending = true;


            $.ajax({
                url : 'http://web2.cgi.weiyun.com/weiyun_other.fcg?g_tk='+get_g_tk()+'&cmd=243500&data=' + JSON.stringify({
                        "req_header":{"cmd":243500,"appid":30013,"version":2,"major_version":2},
                        "req_body":{"ReqMsg_body":{"weiyun.SmsSendMsgReq_body":{
                            phone_number: options.number,
                            sms_type: 0
                        }}}
                    }),
                type : 'get',
                dataType : 'jsonp'
            }).done(function(data){
                if(data && data['rsp_header'] && data['rsp_header']['retcode'] == 0) {
                    me.success();
                } else {
                    me.error();
                }

                /*var ret = parseInt(data.ret, 10) || 0;
                switch(ret){
                    case 0:
                        me.success();
                        break;
                    case 15:
                        me.error('请输入验证码');
                        me.show_captcha();
                        break;
                    case 16:
                        me.error( '验证码错误');
                        me.show_captcha();
                        break;
                    default:
                        me.error(me.translate(ret));
                        break;
                }*/
            }).fail(function(){
                me.error();
            }).always(function(){
                me.sending = false;
            });
        }
    });
    SMS.client_types = client_types;
    
    /**
     * 二维码
     */
    method.QRCode = inherit(method.Base, {
        title : '通过二维码扫描',
        url : '',
        html : '<img alt="二维码" />',//<p>扫描二维码，下载移动端</p>',
        after_render : function(){
            this.$el.filter('img').attr('src', this.url);
        }
    });
    /**
     * mobile tip
     */
    method.MobileTip = inherit(method.Base, {
        title : '支持：',
        type : 'mobile_tip',
        html : '<h4 style="margin-top:5px">iPhone、Android、iPad</h4>'
    });
    
    var mask = (function(){
        var $el;
        function get_$el(){
            if(!$el){
                $el = $('<div class="ui-mask" style="display: block;"></div>').hide().appendTo(document.body);
            }
            return $el;
        }
        return {
            show : function(){
                if($.browser.msie && $.browser.version<7){
                    get_$el().height($(document.body).height());
                }
                get_$el().show();
            },
            hide : function(){
                get_$el().hide();
            }
        };
    })();
    
    /**
     * 弹出框
     * 
     */

    var Dialog = module.dialog.Base = inherit(Object, {
        mask_html : '<div class="ui-mask"></div>',
        html : '<div class="qr-dialog">' +
	        '<div class="box">' +
		        '<div class="hd clearfix">' +
			        '<h4 class="title" data-download-name="title"></h4>' +
			        '<span class="close-btn" title="关闭" data-download-action="close"><i class="icon icon-dialog-close"></i></span>' +
		        '</div>' +
		        '<div class="bd">' +
		            '<div class="qr-code" data-download-name="qrcode"></div>' +
		            '<p class="text">扫描二维码，下载客户端</p>' +
		            '<div class="info" data-download-name="methods"></div>' +
			    '</div>' +
	        '</div>' +
        '</div>',
        qrcode_url : '//qzonestyle.gtimg.cn/qz-proj/wy-platform/img/qr-code.png',
        client_type : '',
        is_show_order: true,
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        render : function(){
            if(this.rendered){
                return;
            }
            var me = this,
                $el = this.$el = $(this.html).appendTo(document.body);
            
            // 创建引用
            var type_property = 'data-download-name', elements = {};
            $el.find('['+type_property+']').each(function(){
                var $dom = $(this),
                    name = $dom.attr(type_property);
                elements['$'+name] = $dom;
            });
            
            // 更新标题
            elements.$title.text(this.title);
            
            // 创建QRCode
            this.qrcode = new method.QRCode({
                url : this.qrcode_url,
                $ct : elements.$qrcode
            });
            this.qrcode.render();
            
            // 其它方法
            var is_multi = this.methods.length > 1 && this.is_show_order;
            $.each(this.methods, function(index, method){
                var no = index + 1,
//                    no_cn = (['零', '一', '二', '三', '四', '五'])[no],
                    title = (is_multi ? ('方法'+no+'：') : '')+method.title,
                    cls = 'way way-'+no;
                var $ct = $('<div class="'+cls+'"><h4 style="display: none;">'+title+'</h4></div>').appendTo(elements.$methods);
                method.render($ct);
                
                // 日志上报绑定
                var logs = {};
                logs[client_types.iPhone] = {
                    redirect : 150013,
                    send_message : 150014
                };
                logs[client_types.Android] = {
                    directdownload : 150016,
                    send_to_phone : 150017,
                    send_message : 150018
                };
                logs[client_types.iPad] = {
                    redirect : 150020
                };
                logs[client_types.Mobile] = {
                    send_message: 111
                };
                method.callback = function(){
                    log({
                        actiontype_id : logs[me.client_type][method.type]
                    });
                    if(method.type === 'send_to_phone'){
                        me.hide();
                    }
                };
            });
            
            // 动作绑定
            var action_property = 'data-download-action',
                me = this;
            this.$el.on('click', '['+action_property+']', function(e){
                e.preventDefault();
                var $dom = $(this),
                    action = $dom.attr(action_property);
                var fn_name = 'on_' + action;
                if(me[fn_name]){
                    me[fn_name]($dom, e);
                }
            });

            this.rendered = true;
        },
        show : function(){
            mask.show();
            this.render();
            this.$el.show();
            // 偏上一点，因为短信验证码可能会把它挤下来些
            //this.$el.css('margin-top', -this.$el.height()/2);
            // 不支持fixed布局的，主动计算一些
            if($.browser.msie && $.browser.version<7){
                this.$el.css('top', $(window).scrollTop() + $(window).height()/2);
            }
        },
        hide : function(){
            this.$el.hide();
            mask.hide();
        },
        on_close : function(){
            this.hide();
        }
    });



    //以后的下载地址的修改请在download.html中修改，这样只发download.html就可以了 by hibincheng
    module.urls = {
        windows : 'http://dldir1.qq.com/weiyun/weiyun_windows_2.2.0.1154.exe',
        windows_sync : 'http://dldir1.qq.com/weiyun/weiyun_sync_2.0.0.532.exe',
        mac_sync : 'http://dldir1.qq.com/weiyun/Weiyun_Mac_2.0.002.20632.dmg',
        android: 'http://dldir1.qq.com/weiyun/Weiyun_3.0.2.847_1.apk',
        iphone: 'http://itunes.apple.com/cn/app/id522700349?mt=8&ls=1',
        ipad: 'https://itunes.apple.com/cn/app/id608263551?mt=8&ls=1'
    };
    
    module.dialog.android = new Dialog({
        title : '微云Android版',
        client_type : client_types.Android,
//        qrcode_url : 'http://tacs.oa.com/img.php?145x145',
        methods : [
            new method.DirectDownload({
                url : module.urls.android
            })
        ]
    });
    
    module.dialog.iphone = new Dialog({
        title : '微云iPhone版',
        client_type : client_types.iPhone,
//        qrcode_url : 'http://tacs.oa.com/img.php?145x145',
        methods : [
            new method.Redirect({
                url : module.urls.iphone
            })
        ]
    });
    
    module.dialog.ipad = new Dialog({
        title : '微云iPad版',
        client_type : client_types.iPad,
//        qrcode_url : 'http://tacs.oa.com/img.php?145x145',
        methods : [
            new method.Redirect({
                url : module.urls.ipad
            })
        ]
    });

    module.dialog.mobile = new Dialog({
        title : '微云手机版',
        client_type : client_types.Mobile,
        is_show_order : false,
//        qrcode_url : 'http://tacs.oa.com/img.php?145x145',
        methods : [
            new method.SMS({
                client_type : client_types.iPhone
            }),
            new method.MobileTip()
        ]
    });
    
    var $iframe;
    var do_download = function(url){
        //dldir1.qq.com域名不兼容https，这次用新开标签页下载
        if(window.location.protocol === 'https:') {
            if(url.indexOf('https') > -1) {
                url.replace('https', 'http');
            } else if(url.indexOf('http') === -1) {
                url = 'http:' + url;
            }
            window.open(url);
        } else {
            if(!$iframe){
                $iframe = $('<iframe></iframe>').hide().appendTo(document.body);
            }
            $iframe.attr('src', url);
        }
    };
    
    var log_ids = {
        windows : 150009,
        windows_sync : 150010,
        mac_sync : 150011,
        iphone : 150012,
        android : 150015,
        ipad : 150019
    };
    module.go = function(type){
        var log_id = log_ids[type];
        if(log_id){
            log({
                actiontype_id : ''+log_id
            });
        }
        var dialog = module.dialog[type];
        if(dialog){
            dialog.show();
            return dialog;
        }
        var url = module.urls[type];
        if(url){
            do_download(url);
            return url;
        }
    };
    
    if(window.define && typeof window.define === 'function'){
        define("club/weiyun/js/pages/download",[],function(){
            return module;
        });
    }else{
        window['download_util'] = module;
    }
})();