/**
 * 记录用户的操作日志
 * @jameszuo 12-12-24 下午12:45
 */
define(function (require, exports, module) {
    var
        lib = require('lib'),

        $ = require('$'),

        JSON = lib.get('./json'),
        console = lib.get('./console').namespace('user_log'),
        image_loader = lib.get('./image_loader'),

        constants = require('./constants'),
        query_user = require('./query_user'),
        urls = require('./urls'),
        ops = require('./configs.ops'),

        stat_log = require('./stat_log'),
        https_tool = require('./util.https_tool'),

    // 版本号（统计用，参考oz配置）
        VERSION_NO = constants.IS_APPBOX ? 0 : 1,

    // 操作系统类型（统计用，参考oz配置）
        OS_TYPE = constants.APPID,

    //  设备类型
        DEVICE_TYPE = constants.IS_APPBOX ? 9002 : 9001,    // appbox 的设备类型是9002

    // 模块ID（统计用，参考oz配置）
        SERVICE_ID = 1,// { disk: 1, photo: 2 }[constants.APP_NAME],

        base_params = {
            extString1: constants.OS_NAME,
            extString2: constants.BROWSER_NAME + ($.browser.msie ? parseInt($.browser.version) : '')
        },

    // 用户点击数 && 暂时存储点击获取的数据
        count_to_sent = 1, // $.browser.msie && $.browser.version < 7 ? 6 : 10, // 应erric要求，去掉批量上报的特性
        stack_data = [],

        undefined;


    if (VERSION_NO == null) {
        console.warn('获取 VERSION_NO 失败');
    }
    if (OS_TYPE == null) {
        console.warn('获取 OS_TYPE 失败');
    }
    if (SERVICE_ID == null) {
        console.warn('获取 SERVICE_ID 失败');
    }

    var default_headers = {
        cmd: 'wy_log_flow_bat',
        dev_id: DEVICE_TYPE,
        os_type: OS_TYPE,
        dev_type: DEVICE_TYPE,
        client_ip: '',
        weiyun_ver: '',
        source: 'weiyunWeb',
        os_ver: '',
        msg_seq: 1,
        proto_ver: 2,
        rsp_compressed: 1,
        encrypt: 0,
        net_type: 0
    };

    var cgi_url = 'http://tj.cgi.weiyun.com/wy_log.fcg';

    cgi_url = https_tool.translate_cgi(cgi_url);
    /**
     * oz 用户行为分析数据上报（旧版）
     * @param {String|Number} op_or_name 操作数字ID或名称（如9130或'disk_file_list_reaload'）
     * @param {Number} [ret]
     * @param {Object} [params]
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     */
    var user_log = function (op_or_name, ret, params, extra_config) {

        var cfg = ops.get_op_config(op_or_name), op;
        if (cfg) {
            op = cfg.op;
            console.log('APPID:' + default_headers.os_type, op + '>' + cfg.name);
        }
        else {
            if (parseInt(op_or_name) == op_or_name) {
                op = op_or_name;
                console.log('APPID:' + default_headers.os_type, op);
            } else {
                console.warn('无效的参数op=' + op_or_name);
                return;
            }
        }


        var data = $.extend({
            op: op,
            rst: ret || 0,
            service_id: SERVICE_ID,
            subop: 0
        }, base_params, params);

        // 单个上报
        if (count_to_sent === 1 || extra_config) {
            user_log.single_log(extra_config, data);

            //这里增加一个新的上报，等数据稳定后就可以废弃旧的上报
            //同时上传和下载的上报不需要新的上报了
            if(op != 9136 && op != 9137 && op != 9138 && op != 515){
                stat_log.click_log(op_or_name, ret, params, extra_config);
            }
        }
        // 批量上报
        else {
            stack_data.push(data);
            if (stack_data.length == count_to_sent) {
                user_log.pitch_log(stack_data);
                stack_data = [];
            }
        }

    };

    /**
     * 设置基础参数（所有的user_log请求都会戴上这些参数）
     */
    user_log.set_base_param = function (key, value) {
        base_params[key] = value;
    };

    /**
     * 批量上报日志
     * bondli
     */
    user_log.pitch_log = function (data) {
        var header = $.extend({
            uin: query_user.get_uin_num()
        }, default_headers);

        var body = {
            log_data: data
        };

        var data_str = JSON.stringify({
            req_header: header,
            req_body: body
        });


        image_loader.load(urls.make_url(cgi_url, { data: data_str}));
    };

    /**
     * 日志上报 带extra_config参数
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     * @param {Object} data 鼠标点击时获取的数据
     *
     */
    user_log.single_log = function (extra_config, data) {

        var data_str = JSON.stringify({
            req_header: $.extend({}, default_headers, {
                uin: query_user.get_uin_num()
            }, extra_config),
            req_body: {
                log_data: [ data ]
            }
        });
        image_loader.load(urls.make_url(cgi_url, { op: data.op, data: data_str}));

    };

    /**
     *
     * header
     * body
     *  log_data[{
     *     op:1
     *
     *  }]
     *
     */

    return user_log;
});