/**
 * mgr
 * @author xixinhuang
 * @date 2016-03-07
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
        browser = common.get('./util.browser'),

        util = require('./util'),
        getMD5 = require('./md5'),
        getSha = require('./sha'),
        ui = require('./ui'),

        _file,
        _file_data,

        undefined;

    var upload = new Module('upload', {

        init: function(file, file_data) {

            _file = file;
            _file_data = file_data;
            var blob,
                me = this;

            if(browser.android) {
                blob = file;
            } else {
                var file_da = file_data.split(',')[1];
                file_da = window.atob(file_da);
                var ia = new Uint8Array(file_da.length);
                for(var i=0; i<file_da.length; i++) {
                    ia[i] = file_da.charCodeAt((i));
                }

                blob = new _Blob(ia,'image/jpeg');
            }

            var req_data = {
                filename: file.name,
                file_size: blob.size
            };

            var fr = new FileReader();
            fr.onload = function () {
                var data = new Uint8Array(fr.result);
                var result = getSha(data);
                var sha = Array.prototype.map.call(result, function (e) {
                    return (e < 16 ? "0" : "") + e.toString(16);
                }).join("");

                var result_md5 = getMD5(data);
                var md5 = Array.prototype.map.call(result_md5, function (e) {
                    return (e < 16 ? "0" : "") + e.toString(16);
                }).join("");

                req_data['file_sha'] = sha;
                req_data['file_md5'] = md5;

                me.pre_upload(blob, req_data);
            };
            fr.readAsArrayBuffer(blob);
        },

        //IOS7及以下的情况，待传完图片再显示
        is_ios_7: function() {
            var ios_7_reg = /OS [1-7]_\d[_\d]* like Mac OS X/i,
                ua = window.navigator.userAgent;
            if(browser.IOS && ios_7_reg.test(ua)){
                return true;
            }
            return false;
        },

        pre_upload: function(file, data) {

            var me = this;
            document.domain = 'weiyun.com';
            request.xhr_get({
                url: 'http://web.cgi.weiyun.com/robot_tag.fcg',
                cmd: 'TagPicUpload',
                cavil: true,
                pb_v2: true,
                body: data
            }).ok(function(msg, body) {
                me._upload_file(file, body);
            }).fail(function(msg, ret) {

            });
        },

        translate_host: function(host) {
            if(!host) {
                return host;
            }
            if(host.indexOf('.ftn.') > -1) {
                return host.split('.').slice(0, 3).join('-') + '.weiyun.com';
            }
            return host.replace(/\.qq\.com/, '.weiyun.com');
        },

        _upload_file: function(file, data) {
            var xhr = new XMLHttpRequest();
            var me = this;
            var host = this.translate_host(data.server_name);
            var _url ='http://'+ host +':' + data.server_port + '/ftn_handler/?ver=12345&ukey='+data.check_key+'&filekey='+data.file_key+'&';

            var fd =  new FormData();
            fd.append('file', file);
            xhr.open("post", _url);

            xhr.timeout = 30000;
            xhr.ontimeout = function() {
                console.log('timeout');
            }
            xhr.upload.addEventListener('progress',function(e){
                console.log('complete!');
            },false);
            xhr.upload.addEventListener('error',function(e){
                console.log('upload error!');
            });
            xhr.addEventListener('error',function(e){
                console.log('error!')
            });
            xhr.upload.onreadystatechange = function(e){
                if(xhr.readyState === 4){
                    me.get_image_url(data);
                }
            }
            xhr.onreadystatechange = function(e){
                if(xhr.readyState === 4){
                    me.get_image_url(data);
                }
            }
            xhr.send(fd);
        },

        get_image_url: function(data) {

            var me = this,
                req_data = {
                file_id: data.file_id,
                pdir_key: data.pdir_key
            }

            request.xhr_get({
                url: 'http://web.cgi.weiyun.com/robot_tag.fcg',
                cmd: 'PicGetUrl',
                cavil: true,
                pb_v2: true,
                body: req_data
            }).ok(function(msg, body) {
                me.fid = data.file_id;
                me.pid = data.pdir_key;
                me.pic_url = body.pic_abstract_url + '&size=256*256';
                me.trigger('action', 'get_porn', _file_data);
            }).fail(function(msg, ret) {
                //上传图片失败也仍旧拉取标签
                me.trigger('action', 'get_porn', _file_data);
            });
        }
    });

    var _Blob = function(data, datatype) {
        var out;
        try {
            out = new Blob([data], {
                type: datatype
            });
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(data.buffer);
                out = bb.getBlob('image/jpeg');
            } else if (e.name == "InvalidStateError") {
                out = new Blob([data], {
                    type: datatype
                });
            } else {
                console.log("Errore");
            }
        }
        return out;
    }

    return upload;
});