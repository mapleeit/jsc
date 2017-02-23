/**
 * 网络系统配置，对应的配置字段请看PB协议中的“cloud_config/cloud_config_client.proto”文件
 * @author hibincheng
 * @date 2014-08-14
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        $ = require('$'),

        request = require('./request'),
        query_user = require('./query_user'),

        DEFAULT_CGI = 'http://web2.cgi.weiyun.com/cloud_config.fcg',
        disk_config = {},
        is_loaded = false,
        undefined;

    function load() {
        query_user.on_ready(function(user) {
            request.xhr_get({
                url: DEFAULT_CGI,
                cmd: 'DiskConfigGet',
                pb_v2: true
            }).ok(function(msg, body) {
                disk_config = $.extend(body);
            }).done(function() {
                is_loaded = true;
            });
        });
    }

    /**
     * 支持'.'号获取多级配置项，如'user_info.is_stained'
     * @param key
     * @returns {{}}
     */
    function get(key) {
        var keys = key.split('.'),
            config = disk_config;

        for(var i= 0, l=keys.length; i < l; i++) {
            config = config[keys[i]];
            if(!config) {
                return;
            }
        }

        return config;
    }

    //对外api
    return {
        load: load,
        get: get
    };
});