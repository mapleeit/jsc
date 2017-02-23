/**
 * oz 模调被调上报，注意查询被调而不是主调。
 * 查询方法：m.isd.com的模调页，选被调查询，微云-微云业务-Web接入业务，填被调id和接口id
 * @param {String|Number} key cgi的url地址或别名，用于匹配在map里的interfaceId
 * @param {String|Number} code 调用结果
 * @param {String|Number} type 0：成功，1:失败，2:逻辑失败
 * @param {String|Number} interfaceId 接口id，在模调系统里建的
 */

var base = require('base.js');

var reportUrl = 'https://www.weiyun.com/report/md',
	writeUrl = 'https://www.weiyun.com/weiyun/error/wxa_error',
	map = {
		'wns_login': 179000193,
		'wns_request': 179000194,
		'DiskUserInfoGet': 179000195,
		'DiskDirBatchList': 179000196,
		'DiskFileBatchDownload': 179000197,
		'DiskDirFileBatchDeleteEx': 179000198,
		'DiskFileBatchRename': 179000199,
		'DiskDirAttrModify': 179000200,
		'WeiyunShareAdd': 179000201,
		'WeiyunShareView': 179000202,
		'WeiyunSharePartSaveData': 179000203,
		'LibPageListGet': 179000204
	},
	logStore = [];

function report(key, code, type, interfaceId) {
	var data = {
			fromId: 204971707,
			toId: 279000132
		},
		pathname;

	if(key) {
		if(map[key]) {
			interfaceId = map[key];
		} else {
			pathname = (base.parseURL(key).pathname || '').substr(1);
			if(pathname && map[pathname]) {
				interfaceId = map[pathname];
			}
		}
	}

	if(interfaceId) {
		data.interfaceId = interfaceId;
		if(code !== undefined) {
			data.code = code;
		}
		if(type !== undefined) {
			data.type = type;
		}
		wx.request({
			url: reportUrl,
			data: data
		});
	}
}

/**
 * 记录log
 * @param log
 */
function log(msg) {
	logStore.push(msg);
	console.log(msg);
}

/**
 * log上报罗盘
 */
function write() {
	var storageData = wx.getStorageSync('wns_token_info'), uin;
	if(storageData && storageData.uid) {
		uin = storageData.uid;
	} else {
		uin = '2202055020';
	}
	logStore.unshift('[md.write]: report time: ' + new Date().toString());
	wx.request({
		url: writeUrl + '?uin=' + uin,
		method: 'POST',
		data: logStore.join('\n'),
		header: {
			'Content-Type': 'text/plain'
		}
	});
	logStore = [];
}

module.exports = {
	log: log,
	write: write,
	report: report
};