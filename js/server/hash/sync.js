/**
 * 微云 simple sha & md5 cmem cache
 * @param request
 * @param response
 */
module.exports = function(request,response) {
    var cmem		= plug('pool/cmem.l5.js'),
	    dcapi       = plug('api/libdcapi/dcapi.js'),
	    serverInfo  = plug('serverInfo'),
	    path        = require('path'),
	    gzipHttp	= require('photo.v7/nodejs/util/gzipHttp');

    var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    var paths = (pathname || '').split('/');
	var memcached	= cmem({
		ip			: '127.0.0.1',	//only windows
		port		: 11211,		//only window
		bid			: 101021413,
		modid		: 241153,
		cmd			: 655360,
		poolSize	: 20,
		retries		: 1,
		timeout		: 50
	});

	var key, sha, md5, size, fileSha, fileMd5;
	var cacheDay = 7; //缓存cmem的天数
	if(paths.length) {
		sha = paths[3] || '';
		md5 = paths[4] || '';
		size = paths[5] || '';
		fileSha = paths[6] || '';
		fileMd5 = paths[7] || '';
	}

	if(sha && md5 && size) {
		key = sha + '_' + md5 + '_' + size;

		memcached.get(key, function(err, data) {
			if(data) {
				if(fileSha && fileMd5) {
					//如果key有对应的值，跟fileSha和fileMd5比较一下，并上报比较结果
					if(fileSha === data.fileSha && fileMd5 === data.fileMd5) {
						//匹配正确
						dcapiReport(178000299);
						responseHtml(JSON.stringify({
							ret: 0,
							msg: 'key match',
							data: {
								sha: sha,
								md5: md5,
								size: size,
								fileSha: data.fileSha,
								fileMd5: data.fileMd5
							}
						}));
					} else {
						//匹配错误
						dcapiReport(178000300);
						//更新cmem cache
						setKey(data.fileSha, data.fileMd5);
					}
				} else {
					//没有fileSha和fileMd5，就不用写入，直接返回查到的值
					if(data.fileSha && data.fileMd5) {
						dcapiReport(178000301);
						responseHtml(JSON.stringify({
							ret: 0,
							msg: 'search success',
							data: {
								sha: sha,
								md5: md5,
								size: size,
								fileSha: data.fileSha,
								fileMd5: data.fileMd5
							}
						}));
					} else {
						dcapiReport(178000305);
						//空值
						responseHtml(JSON.stringify({
							ret: 3,
							msg: 'key has empty value',
							data: {
								sha: sha,
								md5: md5,
								size: size
							}
						}));
					}
				}
			} else {
				dcapiReport(178000302);
				if(fileSha && fileMd5) {
					//查不到值，写入cache
					setKey();
				} else {
					//查不到值又没有可以写入的值，返回key no found
					responseHtml(JSON.stringify({
						ret: 2,
						msg: 'key not found',
						data: {
							sha: sha,
							md5: md5,
							size: size
						}
					}));
				}
			}
		});
	} else {
		responseHtml('key error, sha: ' + sha + ', md5: ' + md5 + ', size: ' + size);
	}

	function dcapiReport(interfaceId) {
		dcapi.report({
			fromId: 204971707,
			toId: 277000034,
			interfaceId: interfaceId,
			toIp: serverInfo.intranetIp,
			code: 0,
			isFail: 0,
			delay: 100
		});
	}

	function responseHtml(html) {
		var gzipResponse = gzipHttp.getGzipResponse({
			request: request,
			response: response,
			plug: plug,
			code: 200,
			contentType: 'text/html; charset=UTF-8'
		});
		gzipResponse.write(html);
		gzipResponse.end();
	}

	function setKey(oldFileSha, oldFileMd5) {
		var returnData = {
			sha: sha,
			md5: md5,
			size: size,
			fileSha: fileSha,
			fileMd5: fileMd5
		};
		if(oldFileSha) {
			returnData.oldFileSha = oldFileSha;
		}
		if(oldFileMd5) {
			returnData.oldFileMd5 = oldFileMd5;
		}
		//为保证key和value是严格1:1对应，先查下对应的fileSha和fileMd5是否已存在，如果存在就不予写入
		//这样做是为了防止整个cmem被恶意刷入同一个key（就是1个value对应多个key），导致运营事故发生
		var mapKey = fileSha + '_' + fileMd5;
		//如果key和value相同是不合法的，不予写入
		if(sha != fileSha && md5 != fileMd5) {
			memcached.get(mapKey, function(err, data) {
				if(data) {
					//上报一下被恶意刷入的统计
					dcapiReport(178000312);
					responseHtml(JSON.stringify({
						ret: 5,
						msg: 'mem exist',
						data: returnData
					}));
				} else {
					//写入mapKey用于1:1校验
					memcached.set(mapKey, key, cacheDay * 24 * 60 * 60, function(err, ret) {
						//写入实际的值
						memcached.set(key, {
							fileSha: fileSha,
							fileMd5: fileMd5
						}, cacheDay * 24 * 60 * 60, function(err, ret) {
							responseHtml(JSON.stringify({
								ret: 0,
								msg: (oldFileSha && oldFileMd5) ? 'key not matched so updated' : 'key not found so cached',
								data: returnData
							}));
						});
					});
				}
			});
		} else {
			responseHtml(JSON.stringify({
				ret: 4,
				msg: 'key and value are duplicate',
				data: returnData
			}));
		}
	}
};