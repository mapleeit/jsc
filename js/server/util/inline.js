/**
 * 获取直出内联js css
 * @type {string}
 */

var fs	 = require('fs');
var css	 = plug('qzone/cdn/css');
var cssConfigs = require('weiyun/conf/configs_css.js');

var scriptPref = '<script>';
var scriptSuffix  = '</script>';
var inlineJS = {
    'configs_mobile': __dirname + '/../conf/configs_mobile.js',
    'configs_web':  __dirname + '/../conf/configs_web.js',
	'configs_web_v2':  __dirname + '/../conf/configs_web_v2.js',
    'configs_appbox':  __dirname + '/../conf/configs_appbox.js',
    'configs_client':  __dirname + '/../conf/configs_client.js',
    'configs_photo':  __dirname + '/../conf/configs_photo.js',
    'seajs': __dirname + '/../sea.js'
};
var jsCache = {};

function getInlineJS(path) {
    var jsText = '';
	if(jsCache[path]) {
		jsText = jsCache[path];
	} else {
		if(fs.existsSync(path)) {
			try {
				jsText = fs.readFileSync(path, 'utf-8');
				jsText = scriptPref + jsText + scriptSuffix;
				jsCache[path] = jsText;
			} catch(e) {
				throw new Error('get js fail');
			}
		} else {
			jsText = '<script src="' + path + '"></script>';
		}
	}

    return jsText;
}


//把css内联到页面
module.exports.css = function(cssPaths, flag) {
    var cssText = [];
    cssPaths = Array.isArray(cssPaths) ? cssPaths : [cssPaths];
    cssPaths.forEach(function(path) {
        var realPath = cssConfigs['@' + path + '@'];
        if(flag) {
            cssText.push(css.getHtml({
                domain: 'qzonestyle.gtimg.cn',
                path: realPath,
                l5api: plug('config').l5api['qzonestyle.gtimg.cn']
            }));
        } else if(realPath) {
            cssText.push(css.getHtml({
                domain: 'img.weiyun.com',
                path: realPath,
                l5api: plug('config').l5api['img.weiyun.com']
            }));
        } else {
            cssText.push(css.getHtml({
                domain: 'img.weiyun.com',
                path: realPath,
                l5api: plug('config').l5api['img.weiyun.com']
            }));
        }
    });

    return cssText.join('');
}

//把js内联到页面，目前先实现从node上读，后续有需求再实现从cdn上取
module.exports.js = function(jsPaths) {
    var jsText = [];
    jsPaths = Array.isArray(jsPaths) ? jsPaths : [jsPaths];

    jsPaths.forEach(function(path) {
        if(inlineJS[path]) {
            jsText.push(getInlineJS(inlineJS[path]));
        }
    });

    return jsText.join('');
}