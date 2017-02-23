/**
 * 通用预览结果请求加载
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Async_requestor = require('./loader.Async_requestor'),
        $ = require('$');
    var Module = inherit(Object, {
        requestor : new Async_requestor(),
        /**
         * @cfg {Object} properties 预览文件的必要信息，含以下字段：
         *      uin
         *      skey
         *      appid
         *      
         *      file_id
         *      file_md5
         *      file_name
         *      file_size
         *      parent_dir_key
         *      
         *      file_src  0为普通文件，1为压缩包中的，2为离线文件
         *      compress_path  当file_src为1时有效，标识它在压缩包中的路径
         *      offline_type  当file_src为2时有效，1为发送列表，2为接收列表
         */
        // 属性映射关系表，原cgi字的字段太抽象了，表示看不懂
        property_translates : {
            uin : 'mf',
            skey : 'vi',
            appid : 'sai',
            
            file_id : 'fi',
            file_md5 : 'fm',
            file_name : 'fn',
            file_size : 'fsize',
            parent_dir_key : 'pdk',
            
            file_src : 'fsrc',
            compress_path : 'fpath',
            offline_type : 'fcat'
        },
        constructor : function(cfg){
            $.extend(this, cfg);
            this.loading = false;
        },
        is_loading : function(){
            return !!this.loading;
        },
        /**
         * @override
         * @return {Object} options
         */
        get_options : function(){
            return {
                host : 'http://docview.weiyun.com',
                path : '/docview_np.fcg',
                params : $.extend({
                    cmd: 'office_view'
                }, this.get_params())
            };
        },
        get_params : function(){
            var params = {
                bv: '20130120',
                vt: 1,
                fin: 1,
                ratio: 1
            };
            
            var properties = this.properties, n, map_key, translates = this.property_translates;
            for(n in properties){
                if(properties.hasOwnProperty(n)){
                    map_key = translates.hasOwnProperty(n) ? translates[n] : n;
                    params[map_key] = properties[n];
                }
            }
            
            return params;
        },
        get_no_encoding_params : function(){
            var filter = {},
                translates = this.property_translates;
            
            // skey不进行转义，防止@转义后cgi不认
            filter[translates['skey']] = true;
            filter[translates['compress_path']] = true;
            
            return filter;
        },
        get : function(){
            if(this.loading){
                return;
            }
            var me = this,
                def = this.requestor.get(me.get_options(), me.get_no_encoding_params());
            
            me.loading = def;
            def.always(function(){
                me.loading = false;
            });
            
            return def;
        },
        /**
         * @private
         */
        abort : function(){
            if(this.loading){
                this.loading.abort();
            }
        }
    });
    return Module;
});