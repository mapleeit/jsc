/**
 * cookie
 * @james 2012/12/16
 *
 * 示例:
 * 写cookie:
 * cookie.set(name, value, options)
 *    options.domain    可访问该cookie的domain
 *    options.path      可访问该cookie的路径
 *    options.expires   有效期（单位：分钟）
 *    options.raw       是否保留格式而不编码，默认false
 *    options.secure    是否https cookie
 */

define(function (require, exports, module) {

    var JSON = require('./json'),
        loc = location,
        doc = document,
        defaults = {
            domain: loc.hostname,
            path: loc.pathname,
            expires: 0,
            secure: false,
            raw: false,
            json: false
        },
        pluses = /\+/g,
        raw = function (s) {
            return s;
        },
        decoded = function (s) {
            return decodeURIComponent(s.replace(pluses, ' '));
        },
        getOptions = function (options) {
            options = options || {};
            for (var key in defaults) {
                options[key] = options[key] || defaults[key];
            }
            return options;
        },

        /**
         * 写cookie
         * @param {String} key
         * @param {String} value
         * @param {Object} options
         * @return {String} new_cookie
         */
        set = function (key, value, options) {
            if (!key) return '';

            options = getOptions(options);

            if (value === null) {
                options.expires = -1;
            } else {
                if(!options.raw){
                    value = encodeURIComponent(options.json ? JSON.stringify(value) : String(value));
                }
            }

            // 过期时间
            var expires_date;
            if (options.expires !== 0) {
                expires_date = new Date();
                expires_date.setMinutes(new Date().getMinutes() + options.expires);
            }

            return (doc.cookie = [
                encodeURIComponent(key), '=', value,
                expires_date ? '; expires=' + (expires_date.toUTCString()) : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        },
        get = function (key, options) {
            if (!key) return '';

            options = getOptions(options);

            var decode = options.raw ? raw : decoded;
            var cookies = doc.cookie.split('; ');
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                if (decode(parts.shift()) === key) {
                    var cookie = decode(parts.join('='));
                    return options.json ? JSON.parse(cookie) : cookie;
                }
            }
            return '';
        },
        unset = function (key, options) {
            if (get(key) !== null) {
                set(key, null, options);
                return true;
            }
            return false;
        },

        minutes = function (n) {
            return n;
        },
        hours = function (n) {
            return minutes(n) * 60;
        },
        days = function (n) {
            return hours(n) * 24;
        },
        months = function (n) {
            return days(n) * 30;
        },
        years = function (n) {
            return months(n) * 12;
        };

    return {
        set: set,
        get: get,
        unset: unset,
        minutes: minutes,
        hours: hours,
        days: days,
        months: months,
        years: years
    };
});
