/**
 * 返回码上报
 * @author jameszuo
 * @date 13-4-25
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        constants = require('./constants'),
        $ = require('$'),

        url_parser = lib.get('./url_parser'),
        image_loader = lib.get('./image_loader'),

        urls = require('./urls'),

        type_ok = 1,  // 成功
        type_err = 2,// 失败
        type_logic_err = 3, // 逻辑失败
        ret_rate = 1,// 采样率

        //report_cgi = 'http://c.isdspeed.qq.com/code.cgi',
        report_cgi =  constants.HTTP_PROTOCOL + '//user.weiyun.com/isdspeed/c/code.cgi',

    // 表示成功的返回码(type=1)
        ok_rets = {
            0: 1
        },

    // 表示逻辑错误的返回码(type=3) // james 20130527: 逻辑错误作为成功来处理(type=1)
        logic_error_rets = {
            1010: 1, //对应目录列表查询请求,说明客户端不需要刷新该目录下的本地缓存列表
            1016: 1, //存储平台不存在该用户
            1018: 1, //要拉取的目录列表已经是最新的
            1019: 1, //目录不存在
            1020: 1, //文件不存在
            1021: 1, //目录已经存在
            1022: 1, //文件已传完
            1024: 1, //验证clientkey失败
            1026: 1, //父目录不存在
            1027: 1, //不允许在根目录下上传文件
            1028: 1, //目录或者文件数超过总限制
            1029: 1, //单个文件大小超限
            1030: 1, //签名已经超时，客户端需要重新验证独立密码
            1031: 1, //验证独立密码失败
            1032: 1, //开通独立密码失败
            1033: 1, //删除独立密码失败
            1034: 1, //失败次数过多,独立密码被锁定
            1035: 1, //添加的独立密码和QQ密码相同
            1051: 1, //当前目录下已经存在同名的文件
            1052: 1, //下载未完成上传的文件
            1053: 1, //当前上传的文件超过可用空间大小
            1054: 1, //不允许删除系统目录
            1055: 1, //不允许移动系统目录
            1056: 1, //该文件不可移动
            1057: 1, //续传时源文件已经发生改变
            1058: 1, //删除文件版本冲突
            1059: 1, //覆盖文件版本冲突，本地文件版本过低，请先同步服务器版本
            1060: 1, //禁止查询根目录
            1061: 1, //禁止修改根目录属性
            1062: 1, //禁止删除根目录
            1063: 1, //禁止删除非空目录
            1064: 1, //禁止拷贝未上传完成文件
            1065: 1, //不允许修改系统目录
            1070: 1,
            1073: 1, //外链失效，下载次数已超过限制
            1074: 1, //黑名单校验失败,其它原因
            1075: 1, //黑名单校验失败，没有找到sha
            1076: 1, //非法文件，文件在黑名单中
            1083: 1, //目录或者文件数超单个目录限制
            1088: 1, //文件名目录名无效
            1091: 1, //转存的文件未完成上传
            1092: 1, //转存的文件名无效编码
            1095: 1, //转存文件已过期
            1105: 1, //独立密码已经存在
            1106: 1, //修改密码失败
            1107: 1, //新老密码一样
            1111: 1, //源、目的目录相同目录，不能移动文件
            1112: 1, //不允许文件或目录移动到根目录下
            1113: 1, //不允许文件复制到根目录下
            1116: 1, //不允许用户在根目录下创建目录
            1119: 1, //目的父目录不存在
            1120: 1, //目的父父目录不存在
            1117: 1, //批量下载中某个目录或文件不存在
            3002: 1,
            3008: 1,
            100028: 1,
            100029: 1,
            190041: 1, // 会话超时
            10603: 1 // 压缩包正在下载中
        },

    // 除了表示成功的返回码，和表示逻辑错误的返回码，其他的返回码均认为是失败(type=2)
    // err_rets = { /* ALL */ },

        set_timeout = setTimeout,

        undefined;

    var cgi_ret_report = {

        /**
         * 上报
         * @param {string} cgi_url cgi url
         * @param {string} cmd 命令字，为空即不传
         * @param {number} ret CGI返回码
         * @param {number} time 耗时(ms)
         */
        report: function (cgi_url, cmd, ret, time) {
            if (!cgi_url) {
                return;
            }

            set_timeout(function () {
                var url = url_parser.parse(cgi_url),
                    cgi_name = url.pathname.replace(/^\//, ''); //   /wy_web_jsonp.fcg -> wy_web_jsonp.fcg


                var result_type;
                if (ret in ok_rets) {
                    result_type = type_ok; // 1
                } else if (ret in logic_error_rets) {
//                    result_type = type_logic_err; // 3

                    // james 20130527: 逻辑错误作为成功来处理(type=1)
                    result_type = type_ok;
                } else {
                    result_type = type_err; // 2
                }


                image_loader.load(urls.make_url(report_cgi, {
                    uin : require('./query_user').get_uin_num() || undefined,
                    domain: url.host,
                    cgi: cgi_name + (cmd ? '?cmd=' + cmd : ''), // cgi=wy_web_jsonp.fcg?cmd=query_user， cgi=wy_web_jsonp.fcg
                    type: result_type,
                    code: ret,
                    time: time,
                    rate: ret_rate
                }));
            }, 500);
        }
    };

    return cgi_ret_report;
});