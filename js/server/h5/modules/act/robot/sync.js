/**
 * 微云H5小活动-萌萌机器人BB识图
 * author: xixinhuang
 * date: 16/01/27
 */
module.exports = function(request, response) {
    var path        = require('path');
    var gzipHttp	= require('photo.v7/nodejs/util/gzipHttp');
    var tmpl        = require('./tmpl');
    var page302     = require('weiyun/page302');
    var loader      = require('./loader');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
    var queryString = request.REQUEST.query;
    var has_pic = queryString.indexOf('fid') > -1 && queryString.indexOf('pid') > -1;
    var filename = (pathname || '').split('/').pop();

    request.once('fail',function(){
        responseHtml(tmpl.fail({
            type: 'err',
            msg: '服务器繁忙，请重试'
        }));
    });

    if(filename === 'robot' && request.method === 'GET') {
        if(has_pic) {
            var params = getParams();
            loader.loadPic().done(function(data) {
                responseHtml(tmpl.body({
                    tag: params.tag || '',
                    pic: data.pic_abstract_url + '&size=1024*1024'
                }));
            }).fail(function(data) {
                responseHtml(tmpl.body(data));
            });
        } else {
            responseHtml(tmpl.body({}));
            return;
        }
    } else if(filename === 'robot' && request.method === 'POST') {
        loader.loadData().done(function(data) {
            responseJSON(JSON.stringify(data));
        }).fail(function(data) {
            responseJSON(JSON.stringify(data));
        });
    }

    function getParams() {
        var params = {}, type, part, key;

        var parts = request.REQUEST.query.split('&');
        for (var i = 0; i < parts.length; i++) {
            part = parts[i].split('=');
            key = part[0];
            params[key] = part.slice(1).join('=');
        }

        if(params['fid'] && params['pid']) {
            return params;
        }

        return '';
    }
    var gzipResponse;
    function responseHtml(html) {
        gzipResponse = gzipResponse || gzipHttp.getGzipResponse({
                request: request,
                response: response,
                plug: plug,
                code: 200,
                contentType: 'text/html; charset=UTF-8'
        });
        gzipResponse.write(html);
        gzipResponse.end();
    }
    function responseJSON(data) {
        gzipResponse = gzipResponse || gzipHttp.getGzipResponse({
                request: request,
                response: response,
                plug: plug,
                code: 200,
                contentType: 'application/json; charset=UTF-8'
            });
        gzipResponse.write(data);
        gzipResponse.end();
    }
}