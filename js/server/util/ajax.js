
var qzoneAjax = plug('qzone/ajax');
var Deferred = plug('pengyou/util/Deferred');
var pbCmds = require('weiyun/util/pbCmds');
var Token = require('weiyun/util/Token');
var ret_msgs = require('weiyun/util/ret_msgs');
var appid = require('weiyun/util/appid');

/**
 * Ajax微云适配构造函数，
 * 只是做了一层数据结构适配、gtk封装、appid，
 * 内部还是调用了plug('qzone/ajax')的ajax方法
 *
 * @param ajax plug('qzone/ajax') TSW中的ajax方法
 * @param res
 * @constructor
 */
function AjaxAdapter(ajax, res) {
    this.token = Token(res.cookies.skey);
    this.wx_token = Token(res.cookies.wx_login_ticket);
    this.ajax = ajax;
}

/**
 * request 方法
 * 默认jsonp方式
 *
 * @param {Object} opt request params
 * @param {string} opt.cmd 命令字，要在pbCmds模块中声明
 * @param {Object} opt.data 请求参数，具体请参照相关命令字协议
 * @param {string} opt.url 请求后台cgi的url，如http://web2.cgi.weiyun.com/weiyun_activity.fcg
 * @param {Object} opt.l5api
 * @param {Object} opt.dcapi
 * @returns {Deferred} def
 */
AjaxAdapter.prototype.request = function(opt) {
    var cmd = opt.cmd;
    var cmdid = pbCmds.get(cmd);
    opt.formatCode = function(result){
        if(result && result.rsp_header)    {
            return result.rsp_header.retcode;
        }
        return -9999;
    };
    var callbackName = opt.method == 'GET' ? 'X_GET' : 'X_POST';
    var data = {
        cmd: cmdid,
        g_tk: this.token,
        wx_tk: this.wx_token,
        data: formatData(opt.cmd, opt.ext_header, opt.data),
        callback: callbackName
    };
    opt.data = data;
    opt.jsonpCallback = callbackName;
    opt.dataType = 'jsonp';
    opt.timeout = opt.timeout || 6000;
    delete opt.cmd;
    var defer = Deferred.create();
    this.ajax.request(opt)
        .done(function(d) {
            var rsp_data = d.result;
            var ret = rsp_data && rsp_data['rsp_header'] ? parseInt(rsp_data['rsp_header']['retcode'], 10) : 1000;
            var msg = rsp_data && rsp_data['rsp_header'] &&rsp_data['rsp_header']['retmsg'] ? rsp_data['rsp_header']['retmsg'] : ret_msgs.get(ret);
            //parse json error
            if(!d.hasError && !rsp_data) {

                defer.reject(msg, ret);
            //服务器逻辑错误，返回错误码
            } else if(ret != 0) {
                defer.reject(msg, ret);
            } else {
                var rsp_body = rsp_data['rsp_body'] || {};
                rsp_body =  rsp_body['RspMsg_body'] && rsp_body['RspMsg_body']['weiyun.'+cmd+'MsgRsp_body'] || {};
                defer.resolve(rsp_body);
            }
        }).fail(function() {
            //http error:
            var ret = 404;
            defer.reject(ret_msgs.get(ret), ret);
        });

    return defer;
};

function formatData(cmd, ext_header, data) {
    var cmdid = pbCmds.get(cmd);
    var _appid = appid();
    var reqHeader = {
            cmd: cmdid,
            appid: _appid,
            version: 2,
            major_version: 2
        },
        reqBody = {};
    reqBody['weiyun.' + cmd + 'MsgReq_body'] = data;

    //扩展header可查询协议ExtReqHead字段，这里合并到reqHeader中
    if(ext_header && typeof ext_header == 'object') {
        for(var name in ext_header) {
            reqHeader[name] = ext_header[name];
        }
    }

    return  JSON.stringify({
        req_header: reqHeader,
        req_body: {
            ReqMsg_body: reqBody
        }
    });
}

/**
 * server.util.ajax
 *
 * @module server/util/ajax
 */
module.exports = {

    /**
     * ajax包装了一层适配器
     * 用于适配微云后台的数据接口格式
     *
     * @param request
     * @param response
     * @returns {AjaxAdapter}
     */
    proxy: function(request, response) {
        var ajax = qzoneAjax.proxy(request, response);
        var ajaxAdapter = new AjaxAdapter(ajax, request, response);
        return ajaxAdapter;
    }
};