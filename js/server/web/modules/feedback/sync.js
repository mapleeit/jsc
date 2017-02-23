/**
 * 微云整站直出,
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var logger = plug('logger'),
        gzipHttp	= require('photo.v7/nodejs/util/gzipHttp'),
        page302     = require('weiyun/page302'),
        inspect     = require('weiyun/util/inspect/inspect'),
        ret_msgs    = require('weiyun/util/ret_msgs'),
        pageError   = require('weiyun/pageError.js'),
        reportMD = require('weiyun/util/reportMD'),
        ajax = plug('qzone/ajax'),
        config = require('./config'),
        path        = require('path');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var filename = (pathname || '').split('/').pop();
    var _data = request.POST || {};

    var reporter = function(data) {
        var ret = (data && data.result)? data.result : -1,
            isFail = (data && data.result == 0)? 0 : 1;
        reportMD(177000225, ret, isFail);
    }

    var validate = function(data) {
        if(!data.uin) {
            return false;
        }
        if(!data.title) {
            return false;
        }
        if(!data.text) {
            return false;
        }
        if(!data.p_id) {
            return false;
        }
        return true;
    }

    request.once('fail',function(){
        reporter({});
        if(request.method === 'POST') {
            gzipHttp.create().end(JSON.stringify({code: -1, message: '服务器繁忙'}));
        } else {
            pageError(request, response, '服务器繁忙');
        }
    });
    if(filename === 'feedback' && request.method === 'GET') {
        page302(request, response, 'http://www.weiyun.com/feedback.html');
    } else if(filename === 'feedback' && request.method === 'POST') {

        logger.debug('weiyun feedback data title:' + _data.title + ' text:' + _data.text + ' p_id:' + _data.p_id);

        if(!validate(_data)) {
            reporter({});
            gzipHttp.create().end(JSON.stringify({code: -1, message:"params error"}));
            return;
        }
        ajax.proxy(window.request, window.response).request({
            type : 'POST',
            url : 'http://twx.qq.com/addpost_api',
            data : _data,
            autoToken : true,
            l5api: config['l5api'],
            dcapi: config['dcapi'],
            dataType: 'json'
        }).done(function(d) {
            reporter((d && d.result) || {});
            gzipHttp.create().end(JSON.stringify(d && d.result));
        }).fail(function(d) {
            reporter((d && d.result) || {});
            gzipHttp.create().end(JSON.stringify((d && d.result) || {code:-1,message:'上报失败'}));
        });
    }
}