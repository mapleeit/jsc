/**
 * FTN域名DNS劫持检测（通过请求一个小文件来判断用户dns是否被劫持了）
 * @author bondli 13-5-23
 * @optimize jameszuo 13-6-5
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        image_loader = lib.get('./image_loader'),
        console = lib.get('./console'),

        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        ops = common.get('./configs.ops'),

    // 要检查的域名
        download_domain_arr = [
            "xatfs-yun-ftn.weiyun.com",
            "xa-yun-ftn.weiyun.com",
            "njtfs-yun-ftn.weiyun.com",
            "tjtfs-yun-ftn.weiyun.com",
            "hz-yun-ftn.weiyun.com",
            "sztfs-yun-ftn.weiyun.com",
            "cd-yun-ftn.weiyun.com",
            "xaxf-yun-ftn.weiyun.com",
            "cdxf-yun-ftn.weiyun.com",
            "sz-yun-ftn.weiyun.com",
            "tj-yun-ftn.weiyun.com",
            "sh-yun-ftn.weiyun.com",
            "xg-yun-ftn.weiyun.com",
            //"shxf.yun.ftn.weiyun.com",
            "xa-yunbatch-ftn.weiyun.com",
            "hz-yunbatch-ftn.weiyun.com",
            "cd-yunbatch-ftn.weiyun.com",
            "xaxf-yunbatch-ftn.weiyun.com",
            "cdxf-yunbatch-ftn.weiyun.com",
            "sz-yunbatch-ftn.weiyun.com",
            "tj-yunbatch-ftn.weiyun.com",
            "sh-yunbatch-ftn.weiyun.com",
            "xg-yunbatch-ftn.weiyun.com"
            //"shxf.yunbatch.ftn.weiyun.com"

        ],

        url_suffix = '/ftn_handler/f9ab366bb9f7b5c9127ce8501a44bd5cb11ed85b25db28d70c101572d2f8014eca723af5fc0c937c7cc56afce01f123fadb619fad2e31be6ba621d639eb6f369/ea7df583983133b62712b5e73bffbcd45cc53736/?fname=bt.gif',

        stack_limit = $.browser.msie ? ($.browser.version < 7 ? 10 : 20) : download_domain_arr.length, // ie6 每次发10个，IE7+20个，其他浏览器一起发（除2不靠谱，域名个数可能是奇数）
        stack_data = [],

        op_cfg = ops.get_op_config('download_hijack_check'),

    // 图片回调
        oz_report = function (ok, domain, has_more) {
            // 上报
            stack_data.push({
                op: op_cfg ? op_cfg.op : null,
                rst: ok ? 0 : 1,
                service_id: 1,
                subop: 0,
                extString1: domain
            });

            // 达到堆大小上限，发送
            if (stack_data.length >= stack_limit || !has_more) {
                user_log.pitch_log(stack_data);
                stack_data = [];
            }

            if (!ok) {
                console.error('连接FTN域名失败：' + domain);
            }
        },


        set_timeout = setTimeout,

    // 串行发送检测请求（因为浏览器有并发连接数限制，并发过多请求会很卡，且导致其他CGI请求挂起）
        detect_next = function () {
            var domain = download_domain_arr.shift();
            if (domain) {
                var has_more = !!download_domain_arr.length;

                set_timeout(function () {
                    image_loader.load(constants.HTTP_PROTOCOL + '//' + domain + url_suffix)
                        .done(function () {
                            oz_report(true, domain, has_more);
                        })
                        .fail(function () {
                            oz_report(false, domain, has_more);
                        })
                        .always(function () {
                            if (has_more) {
                                detect_next();
                            }
                        });
                }, 250);
            }
        };

    return {
        start: function() {
            if (!constants.IS_DEBUG) {
                detect_next(0);
            }
        }
    }

});