/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-26
 * Time: 下午4:24
 * To change this template use File | Settings | File Templates.
 * 41表 数据上报专用方法
 */

define(function (require, exports, module) {
    var
        lib = require('lib'),
        $ = require('$'),
        JSON = lib.get('./json'),
        console = lib.get('./console').namespace('stat_log'),
        image_loader = lib.get('./image_loader'),
        constants = require('./constants'),
        query_user = require('./query_user'),
        urls = require('./urls'),
        ops = require('./configs.ops'),
        new_ops = require('./configs.new_ops'),
        https_tool = require('./util.https_tool'),
        logger = require('./util.logger'),
        undefined;


    var default_headers = {
        cmd: 'stat',
        appid:constants.APPID
    };

    var cgi_url = https_tool.translate_cgi('http://stat.cgi.weiyun.com/stat.fcg');


    /**
     * 用户行为分析数据上报
     * @param {Object} [data]
     * @param {Object} [extra_config] 额外的参数，比如指定os_type
     */
    var stat_log = function (data, extra_config) {
        var body = $.extend({
            uin: ''+query_user.get_uin_num()
        }, data);
        stat_log.single_log(extra_config, body);
    };

    /**
     * 日志上报 带extra_config参数
     * @param {Object} [extra_config] 请求头额外的参数，比如指定os_type
     * @param {Object} body req_body内容
     */
    stat_log.single_log = function (extra_config, body) {
        var data_str = JSON.stringify({
            req_header: $.extend({}, default_headers, {
                uin: query_user.get_uin_num()
            }, extra_config),
            req_body:  body
        });
        image_loader.load(urls.make_url(cgi_url, {data: data_str}));
    };

    /**
     * 点击流上报
     */
    stat_log.click_log = function (op_or_name, ret, params, extra_config) {
        var cfg = new_ops.get_op_config(op_or_name), op;
        if (cfg) {
            op = cfg.op;
            console.log('APPID:' + default_headers.appid, op + '>' + cfg.name);
        }
        else {
            if (parseInt(op_or_name) == op_or_name) {
                op = op_or_name;
                console.log('APPID:' + default_headers.appid, op);
            } else {
                console.warn('无效的参数op=' + op_or_name);
                return;
            }
        }

        var req_body = {
            table40: [{
                "actiontype_id": op+"" //这里必须是字符串
            }]
        };
        stat_log( req_body, $.extend({}, extra_config) );
    };

    /**
     * 日志上报 　　预上传　和　上传下载任务结束后的专用方法
     * @param weiyun_version
     * @param Upload      Upload_Class对象
     * @param action_id
     * @param subaction_id
     * @param thraction_id
     */
    stat_log.upload_stat_report_41 = function (Upload, weiyun_version,action_id, subaction_id, thraction_id) {
        //上传下载数据上报
        var actiontype_id, subactiontype_id, thractiontype_id,start_time,end_time,start_file_prcessed= 0,processed=0;
        try {
            //判断是下载任务还是上传任务
            if (!Upload.is_upload()) {
                actiontype_id = 'DOWNLOAD_ACTIONTYPE_ID';
                subactiontype_id = 'DOWNLOAD_TRANS_SUBACTIONTYPE_ID';
                thractiontype_id = 'DOWNLOAD_TRANS_THRACTIONTYPE_ID';
                start_time=Upload.startTime;
            } else {
                actiontype_id = action_id ? action_id : 'UPLOAD_ACTIONTYPE_ID';
                subactiontype_id = subaction_id ? subaction_id : 'UPLOAD_TRANS_SUBACTIONTYPE_ID';
                thractiontype_id = thraction_id ? thraction_id : 'UPLOAD_TRANS_NORMAL_THRACTIONTYPE_ID';
                start_time=Upload.start_time;
            }
            //记录本次传输是从哪个字节开始的。
            if(Upload.start_file_processed && Upload.start_file_processed>0){
                start_file_prcessed = Upload.start_file_processed;
            }
            //计算本次传输的大小。
            if(start_file_prcessed >0 && Upload.processed && Upload.processed>0){
                processed= Upload.processed - start_file_prcessed;
            }else if(Upload.processed && Upload.processed>0){
                processed= Upload.processed
            }
            end_time =+new Date();
            var req_body = {
                table41: [{
                    "weiyun_version": weiyun_version,
                    "actiontype_id": ops.get_op_config(actiontype_id).op,
                    "subactiontype_id": ops.get_op_config(subactiontype_id).op,
                    "thractiontype_id": ops.get_op_config(thractiontype_id).op,
                    "module_id":'1',
                    "result_flag": Upload.log_code ? ''+Upload.log_code:'0',
                    "secondupload_flag": Upload.is_miaoc() ? '1' : '0',
                    "file_name": Upload.file_name,
                    "file_extension": Upload.get_file_type(),
                    "file_id": Upload.file_id,
                    "package_id":Upload.is_package_size?(end_time+''+query_user.get_uin_num()):'',
                    "file_size": ''+Upload.file_size,
                    "file_speed": ''+(1000*processed/(end_time-start_time)),
                    "intext_1": Upload.tp_key? '1':'0',
                    "intext_2": end_time+'',//产生记录的时间戳
                    "intext_3": Upload.processed?Upload.processed+'':'',  //已成功传输的文件大小
                    "intext_13": ''+start_time,
                    "intext_14": end_time+'',
                    "intext_15": Upload.transresult ? (Upload.transresult+''):'0', //transresult属性０成功１暂停3失败,具体可以看维表，该字段在aop_wrap_log里面赋值的．
                    "intext_16": (processed && processed>0) ? processed +'':'',       //本次传输的文件大小
                    "stringext_7":Upload.upload_type+'',
                    "stringext_8":constants.BROWSER_NAME,
                    //"stringext_9": Upload.download_url ? Upload.download_url : '',
                    "op_time": (end_time-start_time)+''
                }]
            };
            stat_log(req_body, {});
            if(Upload.log_code) {
                logger.report({
                    time: (new Date()).toString(),
                    type: Upload.is_upload() ? 'upload' : 'download',
                    upload_type: Upload.upload_type,
                    weiyun_version: weiyun_version,
                    secondupload_flag:  Upload.is_miaoc() ? '1' : '0',
                    file_name: Upload.file_name,
                    file_id: Upload.file_id,
                    file_sha: Upload.file_sha,
                    file_size: ''+Upload.file_size,
                    server_name: Upload.server_name,
                    server_port: Upload.server_port,
                    spend_time: end_time-start_time,
                    ret_code: Upload.log_code,
                    download_url: Upload.download_url ? Upload.download_url : '',
                    msg: Upload._state_log && Upload._state_log.msg
                });
            }
        } catch (e) {

        }
    };
    /**
     * 日志上报 　　预下载专用方法
     * @param download_info
     */
    stat_log.pre_download_stat_report_41= function (download_info) {

        var me = this;
        var actiontype_id, subactiontype_id, thractiontype_id, file_name, file_size = 0, file_ext = '',file_id='';
        try {
            actiontype_id = ops.get_op_config('DOWNLOAD_ACTIONTYPE_ID').op;
            subactiontype_id = ops.get_op_config('DOWNLOAD_PRE_SUBACTIONTYPE_ID').op;
            thractiontype_id = ops.get_op_config('DOWNLOAD_PRE_THRACTIONTYPE_ID').op;


            var req_body = {
                table41: [
                    {
                        "actiontype_id": actiontype_id,
                        "subactiontype_id": subactiontype_id,
                        "thractiontype_id": thractiontype_id,
                        "module_id": '1', //默认 网盘
                        "file_id":download_info.is_package?'':''+download_info.file_id,
                        "file_name": download_info.file_name,
                        "file_extension": download_info.file_ext,
                        "file_size": '' + download_info.file_size,
                        "package_id": download_info.is_package ? (+new Date() + '' + query_user.get_uin_num()):'',
                        "intext_2": +new Date() + '',  //产生记录的时间戳
                        "intext_13": +new Date() + ''  //任务开始时间
                    }
                ]
            };
            stat_log(req_body, {});
            if(download_info.ret_code) {
                logger.report({
                    time: (new Date()).toString(),
                    type: 'pre_download',
                    file_id: download_info.is_package?'':''+download_info.file_id,
                    file_name: download_info.file_name,
                    file_size: '' + download_info.file_size,
                    ret_code: download_info.ret_code
                });
            }
        } catch (e) {

        }
    };

    return stat_log;
});