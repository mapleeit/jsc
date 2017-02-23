/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var wy_ajax = require('weiyun/util/ajax');
var ajax = plug('qzone/ajax');
var config = require('./config');
var logger = plug('logger');
var Deferred = plug('pengyou/util/Deferred');

function loadData() {
    var defer = Deferred.create();
    var mod = window.request.REQUEST.query === 'porn'? 'WeiyunYoutuPorn' : 'WeiyunYoutuTag',
        type = window.request.REQUEST.query === 'porn'? 'imageporn' : 'imagetag',
        data = window.request.POST,
        content_length = JSON.stringify(data).length;

    ajax.proxy(window.request, window.response).request({
        type : 'POST',
        url : 'http://' + type + '.api.youtu.qq.com/youtu/imageapi/' + type,
        port: 18081,
        data : data,
        autoToken : true,
        l5api: config['l5api'][mod],
        dcapi: config['dcapi'][mod],
        headers: {
            'content-type' : 'text/json',
            'content-length': content_length
        },
        enctype: 'application/json',
        dataType: 'json'
    }).done(function(d) {
        if(d && d.result && d.result.code == 0){
            defer.resolve(d.result);
        }else{
            defer.reject(d.result || {});
        }
    }).fail(function(d) {
        logger.debug('weiyun_fail: ${mod}',{
            mod: 'msg:' + JSON.stringify(d.responseText)
        });
        defer.reject(d.result || {});
    });

    return defer;
}

function loadPic() {
    var defer = Deferred.create();
    var params = [], req_data, part, key, fid, pid;

    var parts = window.request.REQUEST.query.split('&');

    for (var i = 0; i < parts.length; i++) {
        part = parts[i].split('=');
        key = part[0];
        params[key] = part.slice(1).join('=');
    }

    if(params['fid'] && params['pid']) {
        fid = params['fid'];
        pid = params['pid'];
        req_data = {
            'file_id': fid,
            'pdir_key': pid
        }
    } else {
        defer.reject({});
    }

    wy_ajax.proxy(window.request, window.response).request({
        l5api: config['l5api']['WeiyunPic'],
        dcapi: config['dcapi']['WeiyunPic'],
        url : 'http://web.cgi.weiyun.com/robot_tag.fcg',
        data : req_data,
        cmd: 'PicGetUrl'
    }).done(function(data) {
        defer.resolve(data);
    }).fail(function(d) {
        logger.debug('weiyun_fail: ${mod}',{
            mod: 'msg:' + JSON.stringify(d.responseText)
        });
        defer.reject(d.result || {});
    });

    return defer;
}

module.exports = {
    loadData: loadData,
    loadPic: loadPic
};