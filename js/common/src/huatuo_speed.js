/**
 * 测速上报华佗系统(huatuo.qq.com)
 * @author iscowei
 * @date 2016-03-17
 *
 * @modified by maplemiao
 * @date 2016-12-22
 */
define(function(require, exports, module) {
    var lib = require('lib');
    var constants = require('./constants');
    var image_loader = lib.get('./image_loader');

    // 测速上报cgi
    // http://tapd.oa.com/mhb/markdown_wikis/#1010084921005723541
    var ht_speed_url = location.protocol + '//report.huatuo.qq.com/report.cgi';
    var cache = {},
        report_appid = 10011,
        sample_rate = 1,    // 采样率100%
        delay_time = 1000;  // 延迟上报1s，获取performance数据

    return new function() {
        // 基准时间
        // 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前
        this.base_time = window.performance && window.performance.timing ? window.performance.timing.fetchStart : 0;

        this.store_point = function(point_key, index, spend_time) {
            var points = cache[point_key] || (cache[point_key] = []);
            points[index] = spend_time;
        };

        this.report = function(point_key, use_performance) {
            var me = this;

            if (!point_key) {
                return ;
            }

            // 延迟以获取performance数据
            setTimeout(function () {
                var points, flags, speed_params;

                points = cache[point_key] || [];
                flags = point_key.split('-');
                speed_params = ['flag1=' + flags[0], 'flag2=' + flags[1], 'flag3=' + flags[2], 'flag5=' + sample_rate];

                // 如果没有自己上报的测速点，那就用performance测速点代替
                // 这里建议都使用performance上报前19个点的数据，自定义测速点从20开始报
                if(window.performance && window.performance.timing && (use_performance || !points.length)) {
                    var perf_data = window.performance.timing;

                    points[ 1 ] = perf_data.unloadEventStart - perf_data.navigationStart;
                    points[ 2 ] = perf_data.unloadEventEnd - perf_data.navigationStart;
                    points[ 3 ] = perf_data.redirectStart;
                    points[ 4 ] = perf_data.redirectEnd;
                    points[ 5 ] = perf_data.fetchStart - me.base_time;
                    points[ 6 ] = perf_data.domainLookupStart - me.base_time;
                    points[ 7 ] = perf_data.domainLookupEnd - me.base_time;
                    points[ 8 ] = perf_data.connectStart - me.base_time;
                    points[ 9 ] = perf_data.connectEnd - me.base_time;
                    points[ 10 ] = perf_data.requestStart - me.base_time;
                    points[ 11 ] = perf_data.responseStart - me.base_time;
                    points[ 12 ] = perf_data.responseEnd - me.base_time;
                    points[ 13 ] = perf_data.domLoading - me.base_time;
                    points[ 14 ] = perf_data.domInteractive - me.base_time;
                    points[ 15 ] = perf_data.domContentLoadedEventStart - me.base_time;
                    points[ 16 ] = perf_data.domContentLoadedEventEnd - me.base_time;
                    points[ 17 ] = perf_data.domComplete - me.base_time;
                    points[ 18 ] = perf_data.loadEventStart - me.base_time;
                    points[ 19 ] = perf_data.loadEventEnd - me.base_time;
                }
                //测速点id开始，如果要测页面的performance则id:1-19为performance测速
                if(points.length) {
                    for(var i = 1, len = points.length; i < len; i++) {
                        speed_params.push(i + '=' + points[i]);
                    }

                    var params = ['appid=' + report_appid, 'speedparams=' + encodeURIComponent(speed_params.join('&'))];

                    // platform
                    switch (constants.OS_NAME) {
                        case 'ipad':
                        case 'iphone':
                            params.push('platform=ios');
                            break;
                        case 'android':
                        case 'windows phone':
                            params.push('platform=android');
                            break;
                        case 'mac':
                        case 'windows':
                        case 'linux':
                        case 'unix':
                            params.push('platform=pc');
                    }

                    image_loader.load(ht_speed_url + '?' + params.join('&'));
                    cache[point_key] = null;
                }
            }, delay_time);
        };
    };
});