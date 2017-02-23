/**
 * URL生成器 TODO 移动到lib下
 * @jameszuo 12-12-26 下午7:02
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        JSON = lib.get('./json'),

        undefined;

    module.exports = {

        /**
         * 跳转： .redirect('web/index.html', { appid: 1, profile: { id:'AAA', length: 2 } })  ->  location.href = 'http://www.weiyun.com/web/index.html?appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22';
         * @param url
         * @param params
         */
        redirect: function (url, params) {
            location.href = this.make_url(url, params);
        },

        /**
         * 生成靠谱的URL而不会出现编码问题： .make_url('web/index.html', { appid: 1, profile: { id:'AAA', length: 2 } })  ->  http://www.weiyun.com/web/index.html?appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22
         *
         * @param {String} url
         * @param {Object} params
         * @param {Boolean} [encode_value] 是否编码, 默认true
         */
        make_url: function (url, params, encode_value) {

            url = this.absolute_url(url);

            var params_str = this.make_params(params, encode_value);

            var suffix = url.indexOf( '?' ) > -1 ? '&' : '?';

            return url + (params_str ? suffix + params_str : '');
        },

        /**
         * 生成靠谱的URL参数而不会出现编码问题   { appid: 1, profile: { id:'AAA', length: 2 } }  ->   appid=1&profile=%22%7B%22id%22%3A%22AAA%22%2C%22length%22%3A2%7D%22
         * @param {Object} params
         * @param {Boolean} [encode_value] 是否编码, 默认true
         */
        make_params: function (params, encode_value) {
            if (typeof params == 'object') {
                var p = [],
                    encode = encodeURIComponent;

                for (var key in params) {
                    var value = params[key];
                    if (value == undefined) {
                        value = '';
                    }

                    if (typeof value == 'object') {
                        value = JSON.stringify(value);
                        p.push(encode(key) + '=' + encode(value)); // JSON 必须 encode
                    }
                    else {
                        value = value.toString();
                        p.push(encode(key) + '=' + (encode_value !== false ? encode(value) : value));
                    }

                }
                return p.join('&');
            }
            return '';
        },

	    /**
	     * 解析url参数
	     * @param {String} url
	     */
	    parse_params: function(url) {
		    url = url || window.location.href;
		    var query = {}, params = [], value = [];
		    if (url.indexOf('?') != -1) {
			    params = url.substr(url.indexOf('?') + 1).split('&');
			    for(var i=0, len=params.length; i<len; i++) {
				    value = params[i].split('=');
				    if(value[0]) {
					    query[value[0]] = decodeURIComponent(value[1]) || null;
				    }
			    }
		    }
		    return query;
	    },

        /**
         * 转换绝对路径URL： .absolute_url('web/index.html')  ->  http://www.weiyun.com/web/index.html
         *
         * @param url
         * @return {*}
         */
        absolute_url: function (url) {
            // 如果不是以 http:// 开头，则表示是相对路径，转为绝对路径
            var constants = require('./constants');
            if (!reg_abs_url.test(url)) {
                url = constants.DOMAIN + (url.charAt(0) == '/' ? url : '/' + url);
            }
            return url;
        },

        /**
         * 获取当前URL
         */
        cur_url: function () {
            return location.href;
        }
    };

    var reg_abs_url = /^https?:\/\//;

});