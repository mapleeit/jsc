/**
 * URL 解析
 * example:
 * var url = new URL('http://www.weiyun.com/web/login.html?code=123&from=http%3A%2F%2Furl.cn%2FAujoa6#action=TEST&type=1');
 * url.get_param('from'); // -> http://url.cn/Aujoa6
 * url.get_hash_param('action'); // -> TEST
 * url.protocol  // -> http:
 * url.host      // -> www.weiyun.com
 * url.port      // -> ""
 * url.pathname  // -> /web/login.html
 * url.search    // -> ?code=123&from=http%3A%2F%2Furl.cn%2FAujoa6
 * url.hash      // -> action=TEST&type=1
 * @author jameszuo
 * @date 12-12-28 下午12:00
 */
define(function (require, exports, module) {

    var $ = require('$'),
        url_caches = {},
        PROPS = ['protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'],
        URL,
        parse,
        parse_params,
        get_cur_url,

        $div;

    /**
     * URL 对象
     * @param url
     * @constructor
     */
    URL = function (url) {
        var link = document.createElement('a');
        link.href = url;

        for (var i = 0, l = PROPS.length; i < l; i++) {
            this[PROPS[i]] = link[PROPS[i]];
        }

        this.port = parseInt(this.port || 80);
        this.hash = this.hash.replace(/^#/, '');

        // dam IE
        if (this.pathname.charAt(0) != '/')
            this.pathname = '/' + this.pathname;

        // search params
        this._params = parse_params(this.search.replace(/^\?*/, ''));

        // hash params
        this._hash_params = parse_params(this.hash.replace(/^#*/, ''));

        // for ie bug
        get_$div().append(link);
        $(link).remove();
    };

    $.extend(URL.prototype, {

        get_main_domain: function () {
            return this.host.split('.').slice(-2);
        },

        get_url: function () {
            return this.protocol + '//' + this.host + this.pathname;
        },

        /**
         * 获取全部参数
         * @returns {Object}
         */
        get_params: function () {
            return this._params;
        },

        /**
         * 获取 GET 参数
         * @param {String} key
         * @return {String}
         */
        get_param: function (key) {
            return this._params[key] || '';
        },

        /**
         * 判断参数列表中是否包含指定参数
         * @param {String} key
         * @return {Boolean}
         */
        has_param: function (key) {
            return key in this._params;
        },

        /**
         * 获取 Hash 参数
         * @param {String} key
         * @return {String}
         */
        get_hash_param: function (key) {
            return this._hash_params[key] || '';
        },

        /**
         * 判断 Hash 参数列表中是否包含指定参数
         * @param {String} key
         * @return {Boolean}
         */
        has_hash_param: function (key) {
            return key in this._hash_params;
        }
    });

    /**
     * 解析一个URL str
     * @param {String} url 要解析的url
     * @return {URL} url URL对象
     */
    parse = function (url) {
        var cache_parser = url_caches[url];
        if (!cache_parser) {
            cache_parser = url_caches[url] = new URL(url);
        }
        return cache_parser;
    };

    /**
     * 获取当前地址栏解析的URL对象
     */
    get_cur_url = function () {
        return parse(window.location.href);
    };

    /**
     * 解析参数
     * @param query_str
     * @return {{}}
     */
    parse_params = function (query_str) {
        var match,
        // search = /([^&=]+)=?([^&]*)/g,
            search = /([^&\?=]+)=?([^&\?]*)/g, // 兼容 a=1&b=2?c=3 这样二的参数
            decode = decodeURIComponent,
            params = {};

        while (match = search.exec(query_str)) {
            var key = decode(match[1]),
                val = decode(match[2]);
            if (!(key in params)) { // 只取第一个参数
                params[key] = val;
            }
        }

        return params;
    };

    var get_$div = function () {
        return $div || ($div = $('<div data-id="url_parser" style="display:none;"/>').appendTo(document.body));
    };

    return {
        parse: parse,
        get_cur_url: get_cur_url,
        parse_params: parse_params
    };
});