/**
 * 日期时间模块
 * @author jameszuo
 * @date 13-3-5
 */
define(function (require, exports, module) {
    var $ = require('$'),
        collections = require('./collections'),
        console = require('./console'),
        text = require('./text'),

        D = Date,

        str_date_format = '{year}-{month}-{date}',
        str_datetime_format = str_date_format + ' {hour}:{minute}:{second}',

        re_parse_str = new RegExp('^(\\d{4})\\-(\\d{2})\\-(\\d{2})\\s+(\\d{2})\\:(\\d{2})\\:(\\d{2})(\\s*000)?$'),
        re_left_0 = new RegExp('^0?'),

        parse_int = parseInt,

        date_str_tpl = '1970-01-01 00:00:00',

        today,
        yesterday,
        tomorrow,

        undefined;

    var date_time = {

        /**
         * 获取当前浏览器时间
         * @returns {Date}
         */
        now: function () {
            return new D();
        },

        /**
         * 获取当前浏览器时间的易读的格式
         * @returns {String}
         */
        now_str: function () {
            return this._format(str_datetime_format, this.now());
        },

        /**
         * 今天
         */
        today: function () {
            var d = this.now();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            return d;
        },

        /**
         * 昨天
         */
        yesterday: function () {
            var d = this.today();
            d.setDate(d.getDate() - 1);
            return d;
        },

        /**
         * 明天
         */
        tomorrow: function () {
            var d = this.today();
            d.setDate(d.getDate() + 1);
            return d;
        },

        /**
         * 计算在当前时间的基础上增加 N 天后的时间
         * @param {Number} days
         * @returns {Date}
         */
        add_days: function (days) {
            var now = this.now();
            now.setDate(now.getDate() + days);
            return now;
        },

        /**
         * 计算在当前时间的基础上增加 N 天后的时间，返回易读的格式
         * @param {Number} days
         * @returns {Date}
         */
        add_days_str: function (days) {
            return this._format(str_date_format, this.add_days(days));
        },

        _format: function (format, date) {
            return text.format(format, {
                year: date.getFullYear(),
                month: fix_2_num(date.getMonth() + 1),
                date: fix_2_num(date.getDate()),
                hour: fix_2_num(date.getHours()),
                minute: fix_2_num(date.getMinutes()),
                second: fix_2_num(date.getSeconds())
            });
        },

        /**
         * 解析字符串
         * @param {String} str 支持 yyyy-MM-dd hh:mm:ss 或 yyyy-MM-dd hh:mm:ss 000 这样的结构
         */
        parse_str: function (str) {
            if (!re_parse_str.test(str)) {
                throw 'date_time.parse_str() 无效的参数';
            }

            str = str.substr(0, date_str_tpl.length); // 去除多余的毫秒
            str = str + date_str_tpl.substr(str.length + 1);

            return new Date(str.replace(/\-/g, '/'));
        },

        /**
         * 转换为可读性强的日期格式
         * @param {String|Date} str 如2013-05-11 10:20:30
         * @return {Array} [ 日期类型(如today,yesterday,the_day), ... ]
         */
        readability: function (str) {
            var time;

            if (str instanceof Date) {
                time = str;
            }
            else if (typeof str === 'string') {
                time = this.parse_str(str);
            }
            else {
                return [];
            }

            var today = this.today(),
                tomorrow = this.tomorrow(),
                yesterday = this.yesterday(),
                ret;

            if (today < time && time <= tomorrow) {
                var hours = time.getHours(),
                    minutes = time.getMinutes(),
                    ampm = hours >= 12 ? '下午' : '上午';
                ret = ['today', ampm, fix_2_num(hours) + ':' + fix_2_num(minutes)];
            }
            else if (yesterday < time && time <= today) {
                ret = ['yesterday', '昨天'];
            }
            else {
                var month = time.getMonth() + 1,
                    date = time.getDate();

                date = (date < 10 ? '0' + date : date) + '';

                ret = ['the_day', date, month + '月'];
            }

            return ret;
        },

        //把时间戳转化为播放时长，格式为HH:MM:SS或MM:SS
        timestamp2HMS: function(timestamp) {
            var str_time_format = '{minute}:{second}';
            var one_hour = 60 * 60 * 1000,
                offset = 16 * 60 * 60 * 1000;

            if(timestamp > one_hour) {
                str_time_format = '{hour}:' + str_time_format;
            }
            var time = this._format(str_time_format, new Date(timestamp + offset));
            if(time[0] === '0') {
                time = time.slice(1);
            }
            return time;
        },

        timestamp2date: function(timestamp) {
            return this._format(str_datetime_format, new Date(timestamp));
        },

        timestamp2date_ymdhm: function(timestamp) {
            return this._format(str_date_format + ' {hour}:{minute}', new Date(timestamp));
        }

    };

    // fix_2_num(9) -> '09'
    // fix_2_num(10) -> '10'
    var fix_2_num = function (num) {
        return num < 10 ? '0' + num : num;
    };

    var to_int = function (str) {
        str = str.toString().replace(re_left_0, '');
        return parse_int(str) || 0;
    };

    return date_time;
});