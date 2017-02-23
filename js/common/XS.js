(function(){
    var build = function($, global){
        var targetTypes = {
            Iframe : "iframe",
            Parent : "parent",
            None : "none"
        };
        var supportPostMessage = ("postMessage" in global) && ("onmessage" in global);
        var Module = function(cfg){
            $.extend(this, cfg);
            this._hooked_callbacks = [];
            this._hash_hooked = false;
            this._pending_messages = [];
            if(this.targetType === targetTypes.Iframe){
                this.get_iframe();
            }
        };
        Module.targetTypes = targetTypes;
        Module.supportPostMessage = supportPostMessage;
        $.extend(Module.prototype, {
            /**
             * @cfg {String} targetType iframe或parent
             *     当为iframe时，创建src为{@link url}的iframe，用postMessage或hash传递消息。
             *     当为parent时，必须支持postMessage，访问parent，用postMessage传递消息
             */ 
            targetType : targetTypes.Iframe,
            /**
             * @cfg {String} url (optional) 当targetType为iframe时配置
             */
            /**
             * @cfg {String} origin 当使用postMessage方案时，限定父页面的域名
             */
            _parse_message : function(message){
                var parts = message && message.split ? message.split('/') : [];
                return $.map(parts, function(str){
                    return decodeURIComponent(str);
                });
            },
            get_iframe : function(){
                var iframe = this.iframe,
                    me = this;
                if(!iframe){
                    iframe = this.iframe = $('<iframe id="xs_iframe" src="'+this.url+'" width="30" height="30" frameBorder="1" scrolling="auto"></iframe>')
                        .css({
                            position : 'absolute',
                            left : '-100px',
                            top : '0px'
                        }).appendTo(document.body)[0];
                    $(iframe).one('load', function(){
                        me._notify_iframe_ready();
                    });
                }
                return iframe;
            },
            _notify_iframe_ready : function(){
                var me = this;
                me._iframe_ready = true;
                var messages = me._pending_messages;
                me._pending_messages = [];
                $.each(messages, function(index, message){
                    me._send_iframe_message(message);
                });
            },
            _send_iframe_message : function(message){
                var iframe;
                if(this._iframe_ready){
                    iframe = this.get_iframe();
                    if(supportPostMessage){
                        iframe.contentWindow.postMessage(message, this.origin);
                    }else{ // 如果不支持，使用iframe hash方式传递，iframe属于weiyun.com，仍遵循同源策略，不会被恶意利用
                        iframe.src = iframe.src.split('#')[0] + '#' + message;
                        iframe.width = iframe.width > 50 ? 50 : 100;
                    }
                }else{
                    this._pending_messages.push(message);
                }
            },
            _reg_hashchange : function(callback){
                var last_hash, me = this, create_monitor_fn;
                if(!me._hash_hooked){
                    create_monitor_fn = function(is_resize){
                        return function(){
                            var hash = location.hash.replace(/^#*/, ''),
                                strs;
                            if(is_resize || last_hash !== hash){
                                strs = me._parse_message(hash);
                                
                                $.each(me._hooked_callbacks, function(index, cb){
                                    cb(strs);
                                });
                                last_hash = hash;
                            }
                        };
                    };
                    $(window).on('resize', create_monitor_fn(true));
                    setInterval(create_monitor_fn(false), 200);
                    this._hash_hooked = true;
                }
                me._hooked_callbacks.push(callback);
            },
            send_message : function(strs){
                var message = [], iframe;
                $.each(strs, function(i, str){
                    message.push(encodeURIComponent(str));
                });
                message = message.join('/');
                
                switch(this.targetType){
                    case targetTypes.Iframe:
                        this._send_iframe_message(message);
                        break;
                    case targetTypes.Parent:
                        if(supportPostMessage){
                            // 为了防止被恶意利用，限定只能是weiyun.com域名
                            parent.postMessage(message, this.origin);
                        }
                        break;
                }
            },
            on_message : function(callback){
                var me = this;
                if(supportPostMessage){
                    $(global).on('message', function(jqEvent){
                        var event = jqEvent.originalEvent,
                            data = event.data, strs;
//                        if(event.origin === me.origin){
                            strs = me._parse_message(data);
                            callback(strs);
//                        }
                    });
                }else{
                    me._reg_hashchange(callback);
                }
            }
        });
        return Module;
    };
    
    var win = window;
    if(win.define){
        define("club/weiyun/js/common/XS",["$"],function(require, exports, module){
            var $ = require('$');
            return build($, win);
        });
    }else{
        win.XS = build(jQuery, win);
    }
})();
