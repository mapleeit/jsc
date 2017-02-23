(function(global){
    var apply = function(a, b){
        var p;
        if(a && b && typeof b == 'object'){
            for(p in b){
                a[p] = b[p];
            }
        }
        return a;
    };
    /**
     * 构造url并打开iframe
     * iframe要的参数，即保存文件到微云要的参数：
     * name
     * path：存储路径
     * type: picture（图片，可以有thumb_url来指定缩略图），  // 或可通过url来
     * position: remote(通过http请求)， ftn， plain(直接字符串明文？)
     * url: 
     * content: 
     */
    var idSeed = 1000,
        interfaces = ['login', 'visible', 'close'],
        callback_suffix = '_callback',
        encode = encodeURIComponent,
        each_interface = function(callback){
            var i;
            for(i=0; i<interfaces.length; i++){
                callback(interfaces[i]);
            }
        };
    var C = function(cfg){
        var me = this, i;
        apply(me, cfg);
        me.id = 'save2weiyun_' + (idSeed++);
        each_interface(function(name){
            var interface_name = name + callback_suffix,
                fn = me[interface_name];
            if(typeof fn === 'function'){
                me[interface_name] = me._make_global_callback(fn, me, name);
            }
        });
    };
    apply(C.prototype, {
        _make_global_callback : function(fn, scope, name){
            var global_name = this.id + '_callback_' + name;
            global[global_name] = function(){
                var ret;
                try{
                    ret = fn.apply(scope, arguments);
                }catch(e){}
                return ret;
            };
            return global_name;
        },
        _make_url : function(cfg){
            var p, params = [], me = this;
            for(p in cfg){
                if(cfg.hasOwnProperty(p)){
                    params.push(encode(p)+'='+encode(cfg[p]));
                }
            }
            each_interface(function(name){
                var interface_name = name + callback_suffix;
                if(me[interface_name]){
                    params.push(encode(interface_name) + '=' + encode(me[interface_name]));
                }
            });
            return 'http://web.weiyun.qq.com/share/qq.php?'+params.join('&');
        },
        open_iframe : function(src){
            var iframe = this._iframe;
            if(!iframe){
                iframe = this._iframe = document.createElement('iframe');
                iframe.setAttribute('frameBorder', '0', 0);
                iframe.setAttribute('marginheight', '0');
                iframe.setAttribute('marginwidth', '0');
                iframe.setAttribute('scrolling', 'no');
                iframe.style.width = 500 + 'px';
                iframe.style.height = 350 + 'px';
                iframe.style.display = 'block';
                document.body.appendChild(iframe);
            }
            iframe.setAttribute('src', src);
        },
        save_pic : function(info){
            // 如果 confirm为false，直接保存， 扩展开，如果是己方网站，iframe也隐藏着
            // type目前支持pic，必需要有url参数，newsurl,thumb_url及title可选
            this.open_iframe(this._make_url({
                appid : 30227, // qq新闻的appid
                url : info.url,
                thumb_url : info.thumb_url,
                title : info.title,
                newsurl : info.newsurl
            }));
        }
    });
    global.WeiyunShare = C;
})(window);
