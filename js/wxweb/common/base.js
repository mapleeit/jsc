/**
 * 通用基础函数
 *
 * 【url】
 * parseURL: 使用字符索引对URL进行解析
 *
 * 【date】
 * formatDate: 以指定的格式输出日期和时间
 *
 */

//使用字符索引对URL进行解析
function parseURL(url) {
	if(typeof url !== 'string' || url === '') {
		return {};
	}

	var urlExp = /^(http:|https:|file:)(?:\/\/)([^\/]*)([^?#]*)([^#]*)(.*)$/ig,
		hostExp = /^([^:]*)((:\d+)?)$/ig;

	var protocol = '',
		host = '',
		hostname = '',
		port = '',
		pathname = '',
		search = '',
		hash = '';

	url.replace(urlExp, function() {
		var args = arguments;
		protocol = args[1];
		host = args[2];
		pathname = args[3];
		search = args[4];
		hash = args[5];
	});

	host.replace(hostExp, function() {
		var args = arguments;
		hostname = args[1];
		port = args[2].replace(':', '');
	});

	return protocol ? {
		protocol: protocol,
		host: host,
		hostname: hostname,
		port: port,
		pathname: pathname,
		search: search,
		hash: hash
	} : {};
}

//以指定的格式输出日期和时间
function formatDate(date, formatStr) {
	if(typeof date === 'number') {
		date = new Date(date);
	}
	//格式化时间
	var arrWeek = ['日', '一', '二', '三', '四', '五', '六'],
		str = formatStr
			.replace(/yyyy|YYYY/, date.getFullYear())
			.replace(/yy|YY/, addZero(date.getFullYear() % 100, 2))
			.replace(/mm|MM/, addZero(date.getMonth() + 1, 2))
			.replace(/m|M/g, date.getMonth() + 1)
			.replace(/dd|DD/, addZero(date.getDate(), 2))
			.replace(/d|D/g, date.getDate())
			.replace(/hh|HH/, addZero(date.getHours(), 2))
			.replace(/h|H/g, date.getHours())
			.replace(/ii|II/, addZero(date.getMinutes(), 2))
			.replace(/i|I/g, date.getMinutes())
			.replace(/ss|SS/, addZero(date.getSeconds(), 2))
			.replace(/s|S/g, date.getSeconds())
			.replace(/w/g, date.getDay())
			.replace(/W/g, arrWeek[date.getDay()]);
	return str;
}

//低十位补0
function addZero(v, size) {
	for(var i = 0, len = size - (v + "").length; i < len; i++) {
		v = "0" + v;
	}
	return v + "";
}

function extend() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, options;
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target != "object" && typeof target != "function" )
		target = {};
	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
		// Extend the base object
			for ( var name in options ) {
				var copy = options[ name ];
				// Prevent never-ending loop
				if ( target === copy )
					continue;
				if ( copy !== undefined )
					target[ name ] = copy;
			}
	// Return the modified object
	return target;
}

//判断对象是否为空
function isEmptyObject(e) {
	for(var key in e) {
		return false;
	}
	return true;
}

module.exports = {
	parseURL: parseURL,
	formatDate: formatDate,
	extend: extend,
	isEmptyObject: isEmptyObject
};