/**
 * 数据加载模块
 */
var async = require('weiyun/util/async');
var ajax = require('weiyun/util/ajax');
var config = require('./config');
var Token   = require('weiyun/util/Token');
var pbCmds = require('weiyun/util/pbCmds');
var Deferred = plug('pengyou/util/Deferred');

function loadUserInfo(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['DiskUserInfoGet'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskUserInfoGet',
        data: {
            show_qqdisk_migrate: true,
            is_get_qzone_flag: true,
            is_get_upload_flow_flag: true,
            is_get_weiyun_flag: true
        }
    }).done(function(data) {
        callback(null, data);
    }).fail(function(msg, ret) {
        callback({
            cmd: 'DiskUserInfoGet',
            msg: msg,
            ret: ret
        },null);
    });
}

function loadDiskConfig(callback) {
	ajax.proxy(window.request, window.response).request({
		l5api: config['l5api'],
		dcapi: config['dcapi']['DiskUserInfoGet'],
		url: 'http://web2.cgi.weiyun.com/weiyun_config.fcg',
		cmd: 'DiskConfigGet',
		data: {}
	}).done(function(data) {
		callback(null, data);
	}).fail(function(msg, ret) {
		callback({
			cmd: 'DiskConfigGet',
			msg: msg,
			ret: ret
		},null);
	});
}

function loadDirFileList(callback) {
    ajax.proxy(window.request, window.response).request({
        l5api: config['l5api'],
        dcapi: config['dcapi']['DiskDirBatchList'],
        url: 'http://web2.cgi.weiyun.com/qdisk_get.fcg',
        cmd: 'DiskDirBatchList',
        data: {
            dir_list: [{
                get_type: 0,            // int,拉取列表类型：0:所有,1:目录2:文件,其他所有
                start: 0,               // int,偏移量
                count: 100,             // int,分页大小, 最大1000个（但如果要返回摘要文件url, 则最大只能100个）
                sort_field: 2,          // int,排序字段: 0-不排序(速度最快) 1-按名字排序,汉字基于拼音顺序(速度最慢) 2-按修改时间排序。默认采用时间排序
                reverse_order: false,   // bool,true=逆序)
	            get_abstract_url: true  // 2016.07.04 add by iscowei 返回图片/视频的缩略图url
            }]
        }
    }).done(function(data) {
        if(data && data.dir_list) {
            callback(null, data.dir_list[0]);
        } else {
            callback({
                cmd: 'DiskDirBatchList',
                msg: '数据出错',
                ret: 10001
            }, null);
        }
    }).fail(function(msg, ret) {
        callback({
            cmd: 'DiskDirBatchList',
            msg: msg,
            ret: ret
        }, null);
    });
}

module.exports = {
    batchLoadData: function() {
        var def = Deferred.create();
        async.parallel([
            function(callback) {
                loadUserInfo(callback);
            },
            function(callback) {
                loadDirFileList(callback);
            },
	        function(callback) {
		        loadDiskConfig(callback);
	        }],
            function(err, results) {
                if(!err) {
                    def.resolve(results[0], results[1], results[2]); //按parallel顺序返回
                } else {
                    def.reject(err);
                }
            });
        return def;
    },
    verifyIndep: function (data) {
        var def = Deferred.create();
        ajax.proxy(window.request, window.response).request({
            l5api: config['l5api'],
            dcapi: config['dcapi']['VerifyIndep'],
            url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
            cmd: 'PwdVerify',
            data: data
        }).done(function(data) {
            if(data && data.cs_sig) {
                def.resolve();
            } else {
                def.reject()
            }
        }).fail(function(msg, ret) {
            def.reject(msg, ret);
        })
        return def;
    }
}