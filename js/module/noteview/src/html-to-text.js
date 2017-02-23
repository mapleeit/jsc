define(function(require, exports, module) {
	//这个过滤html标签，用于提取笔记标题（title）和大纲（summary）用的
	exports.HtmlToText = function htmlToText(html, extensions) {
		var text = html;

		if(extensions && extensions['preprocessing'])
			text = extensions['preprocessing'](text);

		text = text
			// Remove line breaks
			.replace(/(?:\n|\r\n|\r)/ig, " ")
			// Remove content in script tags.
			.replace(/<\s*script[^>]*>[\s\S]*?<\/script>/mig, "")
			// Remove content in style tags.
			.replace(/<\s*style[^>]*>[\s\S]*?<\/style>/mig, "")
			// Remove content in comments.
			.replace(/<!--.*?-->/mig, "")
			// Remove !DOCTYPE
			.replace(/<!DOCTYPE.*?>/ig, "");

		/* I scanned http://en.wikipedia.org/wiki/HTML_element for all html tags.
		 I put those tags that should affect plain text formatting in two categories:
		 those that should be replaced with two newlines and those that should be
		 replaced with one newline. */

		if(extensions && extensions['tagreplacement'])
			text = extensions['tagreplacement'](text);

		var doubleNewlineTags = ['p', 'h[1-6]', 'dl', 'dt', 'dd', 'ol', 'ul',
			'dir', 'address', 'blockquote', 'center', 'div', 'hr', 'pre', 'form',
			'textarea', 'table'];

		var singleNewlineTags = ['li', 'del', 'ins', 'fieldset', 'legend',
			'tr', 'th', 'caption', 'thead', 'tbody', 'tfoot'];

		for(i = 0; i < doubleNewlineTags.length; i++) {
			var r = RegExp('</?\\s*' + doubleNewlineTags[i] + '[^>]*>', 'ig');
			text = text.replace(r, '\n\n');
		}

		for(i = 0; i < singleNewlineTags.length; i++) {
			var r = RegExp('<\\s*' + singleNewlineTags[i] + '[^>]*>', 'ig');
			text = text.replace(r, '\n');
		}

		// Replace <br> and <br/> with a single newline
		text = text.replace(/<\s*br[^>]*\/?\s*>/ig, '\n');

		text = text
			// Remove all remaining tags.
			.replace(/(<([^>]+)>)/ig, "")
			// Trim rightmost whitespaces for all lines
			.replace(/([^\n\S]+)\n/g, "\n")
			.replace(/([^\n\S]+)$/, "")
			// Make sure there are never more than two
			// consecutive linebreaks.
			.replace(/\n{2,}/g, "\n\n")
			// Remove newlines at the beginning of the text.
			.replace(/^\n+/, "")
			// Remove newlines at the end of the text.
			.replace(/\n+$/, "")
			// Decode HTML entities.
			.replace(/&([^;]+);/g, decodeHtmlEntity);

		if(extensions && extensions['postprocessing'])
			text = extensions['postprocessing'](text);

		return text;
	};

	//这个不过滤标签，以保留笔记里的html语义内容
	exports.HtmlToContent = function htmlToText(html, extensions) {
		var text = html;

		if(extensions && extensions['preprocessing'])
			text = extensions['preprocessing'](text);

		text = text
			// Remove line breaks
			.replace(/(?:\n|\r\n|\r)/ig, " ")
			// Remove content in script     tags.
			.replace(/<\s*script[^>]*>[\s\S]*?<\/script>/mig, "")
			// Remove content in style tags.
			.replace(/<\s*style[^>]*>[\s\S]*?<\/style>/mig, "")
			// Remove content in comments.
			.replace(/<!--.*?-->/mig, "")
			// Remove !DOCTYPE
			.replace(/<!DOCTYPE.*?>/ig, "");

		/* I scanned http://en.wikipedia.org/wiki/HTML_element for all html tags.
		 I put those tags that should affect plain text formatting in two categories:
		 those that should be replaced with two newlines and those that should be
		 replaced with one newline. */

		if(extensions && extensions['tagreplacement'])
			text = extensions['tagreplacement'](text);

		var doubleNewlineTags = ['p', 'h[1-6]', 'dl', 'dt', 'dd', 'ol', 'ul',
			'dir', 'address', 'blockquote', 'center', 'div', 'hr', 'pre', 'form',
			'textarea', 'table'];

		var singleNewlineTags = ['li', 'del', 'ins', 'fieldset', 'legend',
			'tr', 'th', 'caption', 'thead', 'tbody', 'tfoot'];

		for(i = 0; i < doubleNewlineTags.length; i++) {
			var r = RegExp('</?\\s*' + doubleNewlineTags[i] + '[^>]*>', 'ig');
			text = text.replace(r, '{##' + doubleNewlineTags[i] + '##}');
		}

		for(i = 0; i < singleNewlineTags.length; i++) {
			var r = RegExp('<\\s*' + singleNewlineTags[i] + '[^>]*>', 'ig');
			text = text.replace(r, '{##' + singleNewlineTags[i] + '##}');
		}

		// Replace <br> and <br/> with a single newline
		text = text.replace(/<\s*br[^>]*\/?\s*>/ig, '\n');

		text = text
			// Remove all remaining tags.
			.replace(/(<([^>]+)>)/ig, "")
			// Trim rightmost whitespaces for all lines
			.replace(/([^\n\S]+)\n/g, "\n")
			.replace(/([^\n\S]+)$/, "")
			// Make sure there are never more than two
			// consecutive linebreaks.
			.replace(/\n{2,}/g, "\n\n")
			// Remove newlines at the beginning of the text.
			.replace(/^\n+/, "")
			// Remove newlines at the end of the text.
			.replace(/\n+$/, "")
			//还原{##和##}
			.replace(/{##/g, "<")
			.replace(/##}/g, ">")
			// Decode HTML entities.
			.replace(/&([^;]+);/g, decodeHtmlEntity);

		if(extensions && extensions['postprocessing'])
			text = extensions['postprocessing'](text);

		return text;
	};

	//外显时用于过滤敏感代码
	exports.HtmlToSafe = function htmlToSafe(html) {
		var text = html;

		text = text
			.replace(/position:\s*fixed;*/img, '')
			.replace(/\s*on[a-zA-Z\s]*=[^>|^\s]*/img, '')
			.replace(/\S*v\s*b\s*s\s*c\s*r\s*i\s*p\s*t\s*:[^>|^\s]*/img, '')
			.replace(/\S*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:[^>|^\s]*/img, '')
			.replace(/\S*b\s*a\s*c\s*k\s*g\s*r\s*o\s*u\s*n\s*d\s*:\s*e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n[^>|^\s]*/img, '');

		//https下，图片用代理url，配置-yippeehuang，机器运维-rajhuang
		//代理规则：https://h5.weiyun.com/tx_tls_gate=图片url（不带协议头）
		//https://h5.weiyun.com/tx_tls_gate=postfiles5.naver.net/20160108_212/azadkwk_1452244290135iOydf_JPEG/IMG_7558_G2.jpg?type=w2
		//————2016.06.17 因为加入防劫持，会把白名单外的域名过滤掉，所以http|https笔记外链图片全用代理  iscowei
		//if(window.location.protocol === 'https:') {
			try {
				//————2016.12.13 这里需要判断，如果后台已经返回了代理过的链接，则不再替换 @xixinhuang
				//https://h5.weiyun.com/tx_tls_gate= 是微云web笔记的代理，需要校验reder
				//https://proxy.gtimg.cn/tx_tls_gate= 是空间业务通用的代理，不校验refer
				var REGEXP_PROXY_WEIYUN_URL = /src=(['"])https?:\/\/h5\.weiyun\.com\/tx_tls_gate=/i,
					REGEXP_PROXY_URL = /src=(['"])https?:\/\/proxy\.gtimg\.cn\/tx_tls_gate=/i;

				text = text.replace(/<img.*?src=['"].*?['"].*?>/ig, function (img) {
					//已经代理过的不再代理该图片
					if(REGEXP_PROXY_URL.test(img) || REGEXP_PROXY_WEIYUN_URL.test(img)) {
						return img;
					} else {
						return img.replace(/src=(['"])http:\/\/(.*?)['"]/i, 'src=$1https://h5.weiyun.com/tx_tls_gate=$2$1');
					}
				});
			} catch (e) {
			}
		//}

		return text;
	};

	function decodeHtmlEntity(m, n) {
		// Determine the character code of the entity. Range is 0 to 65535
		// (characters in JavaScript are Unicode, and entities can represent
		// Unicode characters).
		var code;

		// Try to parse as numeric entity. This is done before named entities for
		// speed because associative array lookup in many JavaScript implementations
		// is a linear search.
		if(n.substr(0, 1) == '#') {
			// Try to parse as numeric entity
			if(n.substr(1, 1) == 'x') {
				// Try to parse as hexadecimal
				code = parseInt(n.substr(2), 16);
			} else {
				// Try to parse as decimal
				code = parseInt(n.substr(1), 10);
			}
		} else {
			// Try to parse as named entity
			code = ENTITIES_MAP[n];
		}

		// If still nothing, pass entity through
		return (code === undefined || code === NaN) ?
			'&' + n + ';' : String.fromCharCode(code);
	}

	var ENTITIES_MAP = {
		'nbsp': 160,
		'iexcl': 161,
		'cent': 162,
		'pound': 163,
		'curren': 164,
		'yen': 165,
		'brvbar': 166,
		'sect': 167,
		'uml': 168,
		'copy': 169,
		'ordf': 170,
		'laquo': 171,
		'not': 172,
		'shy': 173,
		'reg': 174,
		'macr': 175,
		'deg': 176,
		'plusmn': 177,
		'sup2': 178,
		'sup3': 179,
		'acute': 180,
		'micro': 181,
		'para': 182,
		'middot': 183,
		'cedil': 184,
		'sup1': 185,
		'ordm': 186,
		'raquo': 187,
		'frac14': 188,
		'frac12': 189,
		'frac34': 190,
		'iquest': 191,
		'Agrave': 192,
		'Aacute': 193,
		'Acirc': 194,
		'Atilde': 195,
		'Auml': 196,
		'Aring': 197,
		'AElig': 198,
		'Ccedil': 199,
		'Egrave': 200,
		'Eacute': 201,
		'Ecirc': 202,
		'Euml': 203,
		'Igrave': 204,
		'Iacute': 205,
		'Icirc': 206,
		'Iuml': 207,
		'ETH': 208,
		'Ntilde': 209,
		'Ograve': 210,
		'Oacute': 211,
		'Ocirc': 212,
		'Otilde': 213,
		'Ouml': 214,
		'times': 215,
		'Oslash': 216,
		'Ugrave': 217,
		'Uacute': 218,
		'Ucirc': 219,
		'Uuml': 220,
		'Yacute': 221,
		'THORN': 222,
		'szlig': 223,
		'agrave': 224,
		'aacute': 225,
		'acirc': 226,
		'atilde': 227,
		'auml': 228,
		'aring': 229,
		'aelig': 230,
		'ccedil': 231,
		'egrave': 232,
		'eacute': 233,
		'ecirc': 234,
		'euml': 235,
		'igrave': 236,
		'iacute': 237,
		'icirc': 238,
		'iuml': 239,
		'eth': 240,
		'ntilde': 241,
		'ograve': 242,
		'oacute': 243,
		'ocirc': 244,
		'otilde': 245,
		'ouml': 246,
		'divide': 247,
		'oslash': 248,
		'ugrave': 249,
		'uacute': 250,
		'ucirc': 251,
		'uuml': 252,
		'yacute': 253,
		'thorn': 254,
		'yuml': 255,
		'quot': 34,
		'amp': 38,
		'lt': 60,
		'gt': 62,
		'OElig': 338,
		'oelig': 339,
		'Scaron': 352,
		'scaron': 353,
		'Yuml': 376,
		'circ': 710,
		'tilde': 732,
		'ensp': 8194,
		'emsp': 8195,
		'thinsp': 8201,
		'zwnj': 8204,
		'zwj': 8205,
		'lrm': 8206,
		'rlm': 8207,
		'ndash': 8211,
		'mdash': 8212,
		'lsquo': 8216,
		'rsquo': 8217,
		'sbquo': 8218,
		'ldquo': 8220,
		'rdquo': 8221,
		'bdquo': 8222,
		'dagger': 8224,
		'Dagger': 8225,
		'permil': 8240,
		'lsaquo': 8249,
		'rsaquo': 8250,
		'euro': 8364
	};
});