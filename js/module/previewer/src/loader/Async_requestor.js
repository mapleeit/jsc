/**
 * 预览异步轮询请求
 * 后台会返回3种结果：
 * 1. 服务器重定向
 * 2. 正在进行
 * 3. 返回正常结果
 * 这里封装后，就只有成功或失败2种结果了
 * @author cluezhang
 * @date 2013-12-10
 */
define(function(require, exports, module){
    var 
        inherit = require('./inherit'),
        $ = require('$'),
        https_tool = require('common').get('./util.https_tool');

    var Requestor = inherit(Object, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        /**
         * @cfg {Number} single_timeout 单次轮询超时，默认10（秒）
         */
        single_timeout : 10,
        /**
         * @cfg {Number} timeout 总共的超时时间，默认60（秒）
         */
        timeout : 60,
        /**
         * @cfg {Number} 轮询间隔
         */
        interval : 2,
        max_retry : 3,
        /**
         * @property {Object} 请求失败的类型
         */
        failure_types : {
            Network : 'network',
            Server : 'server',
            Timeout : 'timeout',
            Abort : 'abort'
        },
        /**
         * @private
         * 预览服务器返回码定义
         */
        server_errors : {
            // 预览类型不支持
            '206005' : {
                tip : '暂不支持预览该类型文件',
                retry : false, // 是否能重试
                download : true // 是否能下载
            },
            // 文件类型不支持
            '206006' : {
                tip : '暂不支持预览该类型文件',
                retry : false,
                download : true
            },
            // 转换失败
            '206011' : {
                tip : '文件预览失败',
                retry : false,
                download : true
            },
            // 文件不存在
            '206013' : {
                tip : '文件预览失败，该文件不存在',
                retry : false,
                download : false
            },
            // 文件加密
            '206014' : {
                tip : '原文件已加密',
                retry : false,
                download : true
            },
            // 文件损坏
            '206015' : {
                tip : '文件预览失败',
                retry : false,
                download : true
            },
            // 未知错误
            '206999' : {
                tip : '文件预览失败',
                retry : true,
                download : true
            }
        },
        /**
         * @property {Object} 返回的state，各种状态码的定义
         * @private
         */
        state_types : {
            Dispatch : 2, // 服务器重分派
            Processing : 1, // 正在处理（正在下载或正在转换）
            Complete : 0 // 处理完毕，返回结果
        },
        /**
         * 分段预览
         * @param {Object} options 有以下属性
         *      host（原始请求服务器，例如：docview.weiyun.com。如果服务器返回dispatch，会自动切换）
         *      path（cgi路径，不含host，例如：/document_view.fcg?xxx）
         *      params（get参数对象）属性
         * @param {Object} no_encoding_params 指定哪些属性不进行转义（服务器方skey不能将@转义，坑。。）
         * @return {$.Deferred} def 成功后，done回调第一个参数为response；
         *      失败时，第一个参数为{@link #failure_types}中定义的错误类型，如果为Server类型，则第2参数为错误码
         */
        get : function(options, no_encoding_params){
            var def = $.Deferred(), me = this;
            def.options = options;
            def.retry = 0;
            def.no_encoding_params = no_encoding_params;
            
            def.abort = function(){
                def.reject(me.failure_types.Abort);
            };
            
            this.do_request(def);
            
            setTimeout(function(){
                def.reject(me.failure_types.Timeout);
            }, this.timeout * 1000);
            
            return def;
        },
        /**
         * @private
         */
        buffer_do_request : function(def, buffer){
            var me = this;
            setTimeout(function(){
                me.do_request(def);
            }, (buffer || me.interval) * 1000);
        },
        /**
         * 某些字段不进行转义，比如skey
         * @private
         */
        encode_params : function(data, no_encoding_params){
            var key, value, queries = [], encode;
            for(key in data){
                if(data.hasOwnProperty(key)){
                    value = data[key];
                    if(no_encoding_params.hasOwnProperty(key)){
                        queries.push(key + '=' + value);
                    }else{
                        queries.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                }
            }
            return queries.join("&");
        },
        /**
         * 发起单个请求
         * @private
         */
        do_request : function(def){
            if(def.state() !== 'pending'){
                return;
            }
            var me = this, options,
                opt = def.options,
                host = def.host || opt.host;
            options = $.extend({
                    timeout: me.single_timeout * 1000,
                    dataType : 'jsonp'
                }, {
                    url : host + opt.path,
                    data : opt.params
                });
            if (options.url.indexOf('http') !== 0) {
                options.url = 'http://' + options.url;
            }
            if(def.no_encoding_params){
                options.data = this.encode_params(options.data, def.no_encoding_params);
            }
            options.url = https_tool.translate_cgi(options.url);
            $.ajax(options).done(function(data){
                me.process_response(def, data);
            }).fail(function(){
                def.retry++;
                // 如果轮询失败次数超限，则失败
                if(def.retry >= me.max_retry){
                    def.reject(me.failure_types.Network);
                }else{
                    // 否则还抢救一下
                    me.buffer_do_request(def);
                }
            });
        },
        /**
         * 处理请求返回
         * @private
         */
        process_response : function(def, response){
            var ret = response.result, msg, state, error_meta,
                me = this,
                state_types = me.state_types;
            if(ret === 0){
                // 成功
                state = response.state;
                switch(state){
                    case state_types.Dispatch:
                        def.host = response.host;
                        me.buffer_do_request(def, response.interval);
                        break;
                    case state_types.Processing:
                        me.buffer_do_request(def, response.interval);
                        break;
//                    case state_types.Complete:
                    default:
                        def.resolve(response);
                        break;
                }
            }else{
                error_meta = this.server_errors[ret] || {
                    tip : '文件预览失败',
                    retry : true,
                    download : true
                };
                def.reject(me.failure_types.Server, ret, error_meta);
            }
        }
    });
    return Requestor;
});