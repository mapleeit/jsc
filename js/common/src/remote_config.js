/**
 * 公用的服务端存取key-value配置
 * @author hibincheng
 * @date 2013-11-18
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        request = require('./request'),

        DEFAULT_CGI = 'http://web2.cgi.weiyun.com/config.fcg',
        GET_CMD = 'get',
        SET_CMD = 'set',

        undefined;

    /**
     * 获取配置
     * @param key
     * @param default_value
     * @returns {*}
     */
    function remote_get(key, default_value) {
        var keys = [],
            def = $.Deferred();

        if(arguments.length === 1 && $.isArray(key)) { //参数为[{key:xx,default:xx},{}]形式
            keys = key;
        } else {
            keys.push({
                'key': key,
                'default': default_value
            });
        }

        $.each(keys, function(i, item) {
            if(!item['default'] && item['default'] !== '') {
                item['default'] = '';//默认为空字符串
            }
        });

        var req = request.xhr_get({
            url: DEFAULT_CGI,
            cmd: GET_CMD,
            re_try:3,
            cavil: true,
            body: {
                keys: keys
            }
        }).
            ok(function(msg, body) {
                def.resolve(body.values);
            })
            .fail(function(msg, ret) {
                def.reject(msg, ret);
            });

        def.abort = function() { //供deffered进行请求中止
            req.destroy();
        };

        return def;
    }

    /**
     * 设置配置  （注意value只能是字符串）
     * @param key
     * @param value
     * @returns {*}
     */
    function remote_set(key, value) {
        var pairs = [],
            def = $.Deferred();

        if(arguments.length === 1 && $.isArray(key)) { // {..} json格式参数
            pairs = key;
        } else {
            pairs.push({
                key: key,
                value: value
            });
        }

        var req = request.xhr_post({
            url: DEFAULT_CGI,
            cmd: SET_CMD,
            re_try:3,
            cavil: true,
            body: {
                pairs: pairs
            }
        })
            .ok(function(msg, body) {
                def.resolve(body);
            }).
            fail(function(msg, ret) {
                def.reject(msg, ret);
            });

        def.abort = function() {//供deffered进行请求中止
            req.destroy();
        };

        return def;
    }

    //对外api
    return {
        get: remote_get,
        set: remote_set
    };
});