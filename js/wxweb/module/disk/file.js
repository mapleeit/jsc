/**
 * 网盘文件
 */

var base = require('../../common/base.js');

	//字节单位
var BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],
	//图片类型
	EXT_IMAGE_TYPES = { jpg: 1, jpeg: 1, gif: 1, png: 1, bmp: 1, pic: 1 },
	//可预览的文档类型
	EXT_PREVIEW_DOC_TYPES = { xls: 1, xlsx: 1, doc: 1, docx: 1, ppt: 1, pptx: 1, pdf: 1, txt: 1 },
	//文档类型细分
	EXT_FILTER_DOC_TYPES = {
		'doc': {'doc': 1, 'docx': 1},
		'xls': {'xls': 1, 'xlsx': 1},
		'ppt': {'ppt': 1, 'pptx': 1},
		'pdf': {'pdf': 1}
	},
	//视频类型
	EXT_VIDEO_TYPES = { video: 1, swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1 },
	EXT_PREVIEW_VIDEO_TYPES = { mov: 1, mp4: 1, mpg: 1, mpeg: 1, '3gp': 1 },
	//音频类型
	EXT_AUDIO_TYPES = { mp3: 1, wmv: 1, acc: 1, flac: 1 },
	//压缩包类型
	EXT_COMPRESS_TYPES = { zip: 1, '7z': 1, rar: 1 },
	//文件后缀
	EXT_REX = /\.([^\.]+)$/;

	//文件类型对应icon图标
var defaults = 'normal',
	type_map = {
		folder: ['dir'],
		doc: ['doc', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
		xls: ['xls', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
		ppt: ['ppt', 'pptm'],
		bmp: ['bmp', 'exif', 'raw'],
		'3gp': ['3gp', '3g2', '3gp2', '3gpp'],
		mpe: ['mpe', 'mpeg4'],
		asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa'],
		wav: ['wav', 'ram', 'ra', 'au'],
		c: ['c', 'cpp', 'h', 'cs', 'plist'],
		'7z': ['7z', 'z', '7-zip'],
		ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
		jpg: ['jpg', 'jpeg', 'tif', 'tiff', 'webp'],
		rmvb: ['rmvb'],
		rm: ['rm'],
		hlp: ['hlp', 'cnt'],
		code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
		exec: ['exec', 'dll'],
		pdf: ['pdf'],
		txt: ['txt', 'text'],
		msg: ['msg'],
		rp: ['rp'],
		vsd: ['vsd'],
		ai: ['ai'],
		eps: ['eps'],
		log: ['log'],
		xmin: ['xmin'],
		psd: ['psd'],
		png: ['png'],
		gif: ['gif'],
		mod: ['mod'],
		mov: ['mov'],
		avi: ['avi'],
		swf: ['swf'],
		flv: ['flv'],
		wmv: ['wmv'],
		wma: ['wma'],
		mp3: ['mp3'],
		mp4: ['mp4'],
		ipa: ['ipa'],
		apk: ['apk'],
		ipe: ['ipe'],
		exe: ['exe'],
		msi: ['msi'],
		bat: ['bat'],
		fla: ['fla'],
		html: ['html'],
		htm: ['htm'],
		asp: ['asp'],
		xml: ['xml'],
		chm: ['chm'],
		rar: ['rar'],
		zip: ['zip'],
		tar: ['tar'],
		cab: ['cab'],
		uue: ['uue'],
		jar: ['jar'],
		iso: ['iso'],
		dmg: ['dmg'],
		bak: ['bak'],
		tmp: ['tmp'],
		ttf: ['ttf'],
		otf: ['opt'],
		old: ['old'],
		docx: ['docx'],
		wps: ['wps'],
		xlsx: ['xlsx'],
		pptx: ['pptx'],
		dps: ['dps'],
		et:  ['et'],
		key: ['key'],
		numbers: ['numbers'],
		pages: ['pages'],
		keynote: ['keynote'],
		mkv: ['mkv'],
		mpg: ['mpg'],
		mpeg: ['mpeg'],
		dat: ['dat'],
		f4a: ['f4a'],
		webm: ['webm'],
		ogg: ['ogg'],
		acc: ['acc'],
		m4a: ['m4a'],
		wave: ['wave'],
		midi: ['midi'],
		ape: ['ape'],
		aac: ['aac'],
		aiff: ['aiff'],
		mid: ['mid'],
		xmf: ['xmf'],
		rtttl: ['rtttl'],
		flac: ['flac'],
		amr: ['amr'],
		ttc: ['ttc'],
		fon: ['fon'],
		dmg: ['dmg'],
		document: ['document'],
		image: ['image'],
		video: ['video'],
		audio: ['audio'],
		compress: ['compress'],
		unknow: ['unknow'],
		filebroken: ['filebroken']
	},
	all_map = {};

var store = {}; //存储文件数据的对象

for (var type in type_map) {
	var sub_types = type_map[type];
	for (var i=0, l=sub_types.length; i<l; i++) {
		all_map[sub_types[i]] = type;
	}
}

//格式化文件对象，添加需要用到的属性
function format(files, type, pdir_key, ppdir_key) {
	var fileList = [], file, temp;

	if(!(files instanceof Array)) {
		files = [files];
	}

	for(var i=0, len=files.length; i<len; i++) {
		temp = files[i];
		file = getStore(temp['dir_key'] || temp['file_id']) || {};
		//父目录索引
		file.pdir_key = temp.pdir_key || pdir_key;
		file.ppdir_key = temp.ppdir_key || ppdir_key;
		//生成文件对象，最简化数据以保证setData的传输数据大小
		if(!file.ext_info) {
			file.ext_info = {};
		}
		if(temp.dir_key) {
			file.dir_key = temp.dir_key;
			file.dir_name = temp.dir_name;
			file.dir_ctime = temp.dir_ctime;
			file.dir_mtime = temp.dir_mtime;
		}
		if(temp.file_id) {
			file.file_id = temp.file_id;
			file.filename = temp.filename;
			file.file_size = temp.file_size;
			file.file_ctime = temp.file_ctime;
			file.file_mtime = temp.file_mtime;
		}
		//数据类型，文件夹/文件
		file.type = temp.type || type;
		//文件后缀名
		file.ext = temp.ext || ext(temp.filename || temp.file_name);
		//文件大小
		if(temp.file_read_size) {
			file.file_read_size = temp.file_read_size;
		} else if(temp.file_size) {
			file.file_read_size = read_size(temp.file_size);
		}
		//创建时间
		if(temp.create_time) {
			file.create_time = temp.create_time;
		} else if(temp.file_ctime || temp.dir_ctime) {
			file.create_time = base.formatDate((temp.file_ctime || temp.dir_ctime), 'YY-MM-DD hh:ii');
		}
		//修改时间
		if(temp.modify_time) {
			file.modify_time = temp.modify_time;
		} else if(temp.file_mtime || temp.dir_mtime) {
			file.modify_time = base.formatDate((temp.file_mtime || temp.dir_mtime), 'YY-MM-DD hh:ii');
		}
		//文件图标
		file.icon = temp.icon || icon(file.ext || file.type);
		//是否图片
		if(temp.is_image === undefined) {
			file.is_image = file.ext ? isImage(file.ext) : false;
		} else {
			file.is_image = temp.is_image;
		}
		//是否视频
		if(temp.is_video === undefined) {
			file.is_video = file.ext ? isVideo(file.ext) : false;
		} else {
			file.is_video = temp.is_video;
		}
		//是否音频
		if(temp.is_audio === undefined) {
			file.is_audio = file.ext ? isAudio(file.ext) : false;
		} else {
			file.is_audio = temp.is_audio;
		}
		//是否文档
		if(temp.is_doc === undefined) {
			file.is_doc = file.ext ? isDoc(file.ext) : false;
		} else {
			file.is_doc = temp.is_doc;
		}
		if(temp.long_time || (temp.ext_info && temp.ext_info.long_time)) {
			file.long_time = temp.long_time || temp.ext_info.long_time;
		}
		if(temp.ext_info && temp.ext_info.thumb_url) {
			file.ext_info.thumb_url = temp.ext_info.thumb_url.replace(/^http:\/\//, 'https://');
		}
		if(temp.ext_info && temp.ext_info.https_url) {
			file.ext_info.https_url = temp.ext_info.https_url.replace(/^http:\/\//, 'https://');
		}
		if(temp.https_thumb_url) {
			file.https_thumb_url = temp.https_thumb_url;
		}
		if(temp.thumb_url) {
			file.thumb_url = temp.thumb_url.replace(/^http:\/\//, 'https://');
		}
		if(temp.video_thumb) {
			file.video_thumb = temp.video_thumb.replace(/^http:\/\//, 'https://');
		}

		fileList.push(file);
		setStore(file);
	}

	return fileList;
}

//记录文件数据
function setStore(file, update) {
	store[file['dir_key'] || file['file_id']] = file;
}

//取出文件数据
function getStore(key) {
	return store[key] || null;
}

//删除文件数据
function removeStore(file) {
	store[file['dir_key'] || file['file_id']] = null;
	delete store[file['dir_key'] || file['file_id']];
}

//过滤筛选图片
function filter(files, type) {
	var result = [],
		file,
		fileExt;

	type = type.toLowerCase();

	if(!(files instanceof Array)) {
		files = [files];
	}

	for(var i=0, len=files.length; i<len; i++) {
		file = files[i];
		if(type === 'image') {
			if(file && file.is_image && file.ext_info && file.ext_info.https_url) {
				result.push(file.ext_info.https_url + '&size=1024*1024');
			}
		} else {
			fileExt = file.ext ? file.ext : file.filename ? ext(file.filename) : null;
			if(fileExt && isDoc(fileExt, type)) {
				result.push(file);
			}
		}
	}

	return result;
}

/**
 * 获取文件后缀名(小写)
 * @param {String} name
 * @return {String}
 */
function ext(name) {
	var m = (name || '').match(EXT_REX);
	return m ? m[1].toLowerCase() : null;
}

/**
 * 可读性强的文件大小
 * @param {Number} bytes
 * @param {Number} [decimal_digits] 保留小数位，默认1位
 */
function read_size(bytes, decimal_digits) {
	if(bytes === -1){
		return '超过4G';
	}

	bytes = parseInt(bytes);
	decimal_digits = parseInt(decimal_digits);
	decimal_digits = decimal_digits >= 0 ? decimal_digits : 1;

	if (!bytes)
		return '0B';

	var unit = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	var size = bytes / Math.pow(1024, unit);
	var decimal_mag = Math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
	var decimal_size = Math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35
	var int_size = parseInt(decimal_size);
	var result = decimal_size !== int_size ? decimal_size : int_size; // 如果没有小数位，就显示为整数（如1.00->1)

	return result + BYTE_UNITS[unit];
}

//获取文件图标
function icon(type) {
	return all_map[type] || defaults;
}

//是否图片文件
function isImage(type) {
	return type.toLowerCase() in EXT_IMAGE_TYPES;
}

//是否音频文件
function isAudio(type) {
	return type.toLowerCase() in EXT_AUDIO_TYPES;
}

//是否视频频文件
function isVideo(type) {
	return type.toLowerCase() in EXT_VIDEO_TYPES;
}

function isPreviewVideo(type) {
	return type.toLowerCase() in EXT_PREVIEW_VIDEO_TYPES;
}

/**
 * 判断是否文档
 * @param {String} name
 * @return {String}
 */
function isDoc(ext, type) {
	if(type && EXT_FILTER_DOC_TYPES[type]) {
		return ext in EXT_FILTER_DOC_TYPES[type];
	} else {
		return ext in EXT_PREVIEW_DOC_TYPES;
	}
}

module.exports = {
	setStore: setStore,
	getStore: getStore,
	removeStore: removeStore,
	format: format,
	filter: filter,
	isPreviewVideo: isPreviewVideo
};