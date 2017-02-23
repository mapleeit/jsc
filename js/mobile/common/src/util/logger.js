/**
 * 上报日志到闹歌系统
 * @date 2015-02-28
 * @author hibincheng
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        user = require('./user'),
        reportMD = require('./report_md'),
        constants = require('./constants'),

        undefined;

    var last_time,
        cache_log = [],
        cache_error = [],
        timer = {},
        uin = user.get_uin();
    var view_key = 'weiyun_' + uin;

    function report(store_key, str) {
        if(!str) {
            str = store_key;
            store_key = view_key;
        }

        try {

            var request,
                now = new Date().getTime(),
                take_time = last_time? (now - last_time) / 1000 : 4,
                url = constants.IS_HTTPS ? 'https://www.weiyun.com/log/post/' + store_key : 'http://www.weiyun.com/log/post/' + store_key;

            if(typeof str === 'object') {
                str.time = new Date().toString();
                str.uin = uin;
                str = JSON.stringify(str);
            } else {
                str = 'time:' + new Date().toString() + 'uin:' + uin + ' ' + str;
            }

            //三秒上报一次, 这里last_time标识上次上报的时间点。
            if(take_time > 3) {
                timer && clearTimeout(timer);
                cache_log.push(str);
                timer = setTimeout(function() {
                    if(window.XDomainRequest) {
                        request = new window.XDomainRequest();
                        request.open('POST',url, true);
                    } else {
                        request = new window.XMLHttpRequest();
                        request.open('POST',url, true);
                        request.setRequestHeader('Content-Type','text/plain');
                        request.withCredentials = true;
                    }
                    request.send(cache_log.join('\n'));
                    cache_log = [];
                }, 3 * 1000);
                last_time = now;
            } else {
                cache_log.push(str);
            }
        } catch(e) {

        }
    }

    //写控制台信息并上报罗盘、返回码
    function write(log, mode, ret) {
        var now = new Date().getTime(),
            take_time = last_time ? (now - last_time) / 1000 : 4,
            url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
            interfaceMap = {
                'wy_h5_vip_qboss': 178000393, // 微云H5会员页qboss广告数据拉取接口
                'outlink_v2_error': 179000129, // 微云H5分享页操作异常log上报
                'hzp_error': 178000359,        //好照片操作异常log上报
                'h5_session_timeout': 179000171,    //移动端内嵌页登录态失效
                'upload_error': 177000185,
                'upload_plugin_error': 177000186,
                'download_error': 177000187,
                'disk_error': 178000314,
                'flash_error': 177000197,
                'hash_error': 178000306
            };

        //三秒上报一次, 这里last_time标识上次上报的时间点。
        if(take_time > 3) {
            timer && clearTimeout(timer);
            cache_error.push(log.join('\n'));
            timer = setTimeout(function() {
                $.ajax({
                    url: url,
                    type: 'post',
                    data: cache_error.join('\n'),
                    contentType: 'text/plain',
                    xhrFields: {
                        withCredentials: true
                    }
                });
                cache_error = [];
            }, 3 * 1000);
            last_time = now;
        } else {
            cache_error.push(log.join('\n'));
        }

        if(mode && ret) {
            reportMD(277000034, interfaceMap[mode], parseInt(ret), 0);
        }
    }

    /**
     * 若是成功，则上报模调
     * 若是失败，则分别上报罗盘和模调
     * @param log
     * @param mode
     * @param ret
     * @param result 0：成功，1:失败，2:逻辑失败
     */
    function dcmdWrite(log, mode, ret, result) {
        result = result || 0;
        var now = new Date().getTime(),
            take_time = last_time ? (now - last_time) / 1000 : 4,
            url = (constants.IS_HTTPS ? 'https:': 'http:') + '//www.weiyun.com/weiyun/error/' + (mode || view_key),
            interfaceMap = {
                'sign_in_monitor' : 179000182
            };

        if(log instanceof Array) {
            for(var i=0, len=log.length; i<len; i++) {
                console.log(log[i]);
            }
        } else if(log instanceof String) {
            console.log(log);
        }

        // 成功不上报罗盘
        result && report({
            report_console_log: true,
            url: url
        });

        if(mode && (typeof ret != undefined)) {
            reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
        }
    }

    //前台JS错误监控，目前针对：下载文件，参数错误(错误码1000500)上报
    function monitor(mode, ret, result) {
        var interfaceMap = {
            'js_download_error': 178000367
        };

        if(mode && (ret != undefined) && (result != undefined)) {
            reportMD(277000034, interfaceMap[mode], parseInt(ret), result);
        }
    }


    return {
        report: report,
        write: write,
        monitor: monitor,
        dcmdWrite: dcmdWrite
    }
});