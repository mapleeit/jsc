/**
 * 测速上报(m.isd.com)
 * @author hibincheng
 * @date 2014-12-29
 */
define(function(require, exports, module) {

    var lib = require('lib'),

        image_loader = lib.get('./image_loader'),
        Module = lib.get('./Module'),
        speed_config = require('./configs.speed_config'),
        user = require('./user'),

        speed_url = 'http://isdspeed.qq.com/cgi-bin/r.cgi',

        undefined;

    var cache = {};

    var m_speed = new Module('m_speed', {

        start: function(action_name, time) {
            var ns = action_name.split('.');
            var cur;
            cache[ns[0]] = cache[ns[0]] || {};
            if(ns.length > 1) {
                cur = (cache[ns[0]][speed_config.get(action_name)] = []);
                cur[0] = time;
            } else {
                cache[ns[0]] = [];
                cache[ns[0]][0] = time;
            }

        },

        end: function(action_name, time) {
            var ns = action_name.split('.');
            if(ns.length > 1) {
                cache[ns[0]][speed_config.get(action_name)][1] = time;
            } else {
                cache[ns[0]][1] = time;
            }
        },

        set_taken: function(action_name, spend_time) {
            var ns = action_name.split('.');
            var cur;
            cache[ns[0]] = cache[ns[0]] || {};
            if(ns.length > 1) {
                cur = (cache[ns[0]][speed_config.get(action_name)] = []);
                cur[2] = spend_time;
            } else {
                cache[ns[0]] = [];
                cache[ns[0]][2] = spend_time;
            }
        },

        done: function(action_name) {
            var time_cache = cache[action_name];
            if($.isArray(time_cache)) { //单个上报
                this.time(action_name, time_cache);
            } else {
                this._batch(action_name, time_cache);
            }
            delete cache[action_name];
        },

        time: function(action_name, times) {
            var flags = speed_config.get(action_name),
                spend_time = times[2] ? times[2] : times[1] - times[0];
            if(!flags) {
                return;
            }
            flags = flags.split('-');
            var args = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2], flags[3] + '=' + spend_time],
                uin = user.get_uin();
            if(uin) {
                args.push('uin=' + uin);
            }

            image_loader.load(speed_url + '?' + args.join('&'));
        },

        performance: function(action_name) {
            var flags = speed_config.get_perf_flag(action_name),
                perf_data = window.performance.timing,
                start_time = perf_data.navigationStart,
                points = [];
            if(!flags) {
                return;
            }
            flags = flags.split('-');

            points[ 1 ] = perf_data.unloadEventStart - start_time;
            points[ 2 ] = perf_data.unloadEventEnd - start_time;
            points[ 3 ] = perf_data.redirectStart - start_time;
            points[ 4 ] = perf_data.redirectEnd - start_time;
            points[ 5 ] = perf_data.fetchStart - start_time;
            points[ 6 ] = perf_data.domainLookupStart - start_time;
            points[ 7 ] = perf_data.domainLookupEnd - start_time;
            points[ 8 ] = perf_data.connectStart - start_time;
            points[ 9 ] = perf_data.connectEnd - start_time;
            points[ 10 ] = perf_data.requestStart - start_time;
            points[ 11 ] = perf_data.responseStart - start_time;
            points[ 12 ] = perf_data.responseEnd - start_time;
            points[ 13 ] = perf_data.domLoading - start_time;
            points[ 14 ] = perf_data.domInteractive - start_time;
            points[ 15 ] = perf_data.domContentLoadedEventStart - start_time;
            points[ 16 ] = perf_data.domContentLoadedEventEnd - start_time;
            points[ 17 ] = perf_data.domComplete - start_time;
            points[ 18 ] = perf_data.loadEventStart - start_time;
            points[ 19 ] = perf_data.loadEventEnd - start_time;

            var speedparams = ['flag1='+flags[0], 'flag2='+flags[1], 'flag3='+flags[2]];
            for(var i = 1, len = points.length; i < len; i++) {
                speedparams.push(i + '=' + points[i]);
            }
            image_loader.load(speed_url + '?' + speedparams.join('&'));
        },
        /**
         * @param action_name
         * @param {Object<Array>}times
         * @private
         */
        _batch: function(action_name, times) {
            var flags = speed_config.get(action_name);
            if(!flags) {
                return;
            }
            flags = flags.split('-');
            var args = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2]],
                uin = user.get_uin();

            for(var o in times) {
                //如果数组中有第3个数值则第3个为spend_time,第一个数值为开始时间，第2个数据为结束时间
                var spend_time = times[o][2] ? times[o][2] : times[o][1] - times[0];
                args.push(o + '=' + spend_time);
            }
            if(uin) {
                args.push('uin=' + uin);
            }

            image_loader.load(speed_url + '?' + args.join('&'));
        }
    });

    return m_speed;

});