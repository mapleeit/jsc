/**
 * @fileoverview TFL(TAPD Front-end Library)是TAPD前端UI框架,依赖于JQuery.
 */

var TFL = {
	version: '1.0',
	moduleConfigs: {},
	widgets: {},
	path: window.tfl_path || '',
	tag: window.tfl_tag || window.jsVersion || ''
};

TFL.Loader = {
	loaded: {},// 已加载模块
	loadingFiles: {},// 加载中模块
	loadList: {},// 已加载模块列表
	load: function(url, type, charset, cb, bot){
		var doc = document,
		    head = doc.getElementsByTagName("head")[0],
			node, tp, tag = '',

		done = function() {
		  TFL.Loader.loaded[url] = 1;
		  delete(TFL.Loader.loadingFiles[url]);
		  cb && cb();
		  cb = null;
		};
		if (!url) {
			return;
		}
	
		if (TFL.Loader.loaded[url]) {
			cb && cb();
			return;
		}
	
		if (TFL.Loader.loadingFiles[url]) {
			setTimeout(function() {
				TFL.Loader.load(url, type, charset, cb, bot);
			}, 10);
			return;
		}
	
		TFL.Loader.loadingFiles[url] = 1;
		
		tp =  type || url.split('?')[0].toLowerCase().substring(url.lastIndexOf('.') + 1);

		if (TFL.tag) {
			if (url.indexOf('?') == -1) {
				tag = '?v=' + TFL.tag;
			} else {
				var reg = /(v=|r=)/;
				tag = (reg.test(url)) ? '' : '&v=' + TFL.tag;
			}
		}

		if (tp === 'js') {
		  node = doc.createElement('script');
		  node.setAttribute('type', 'text/javascript');
		  node.setAttribute('src', url + tag);
		  node.setAttribute('async', true);
		} else if (tp === 'css') {
		  node = doc.createElement('link');
		  node.setAttribute('type', 'text/css');
		  node.setAttribute('rel', 'stylesheet');
		  node.setAttribute('href', url + tag);
		  done();
		}
	
		if (charset) {
		  node.charset = charset;
		}
	
		if (tp === 'js') {
		  node.onerror = function() {
			done();
			node.onerror = null;
		  };
		  node.onload = node.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
			  done();
			  node.onload = node.onreadystatechange = null;
			}
		  };
		}
		if(tp === 'css'){
			if( bot ){
				doc.body.appendChild(node);
			} else {
				head.insertBefore(node, TFL.headFirstChild);
			}
		} else {
			head.appendChild(node);
		}
	}
};

var loadJs = TFL.Loader.loadJs = function(jsurl, cb){
	TFL.Loader.load(jsurl, 'js', '', cb);
};

var loadCss = TFL.Loader.loadCss = function(cssurl, bot){
	TFL.Loader.load(cssurl, 'css', '', null, bot);
};

TFL.headFirstChild = document.getElementsByTagName("head")[0].firstChild;

TFL.add = function(mName, config) {
	if (!mName || !config || !config.path) {
		return;
	}
	TFL.moduleConfigs[mName] = config;
};

TFL.register = function (mName, config) {
	TFL.add(mName, {path: config.jsUrl});//兼容旧注册模块方式
};

TFL.use = function () {
	var args = [].slice.call(arguments), fn, id, simpleDeps = args[0].split(",");
	
	if( simpleDeps.length > 1 ){//处理TFL.use('mod1,mod2',function(){})的串行加载模式
		TFL.use(simpleDeps[0], function(){
			simpleDeps.shift();
			TFL.use(simpleDeps.join(","), args[1]);
		});
		return;
	}
	
    if ( typeof args[args.length - 1] === 'function' ) {
      fn = args.pop();
    }

    id = args.join('');

    TFL.loadDeps(args, function() {
        TFL.Loader.loadList[id] = 1;
        fn && fn();
    });
};

TFL.loadDeps = function(deps, cb) {
    var mods = TFL.moduleConfigs, 
    	id, m, mod, i = 0, len;

    id = deps.join('');
    len = deps.length;

    if (TFL.Loader.loadList[id]) {
      cb();
      return;
    }

    function callback() {
      if(!--len) {
        cb();
      }
    }

    for (; m = deps[i++];) {
	  if(m == 'jqueryUiCore' && jQuery.ui){
	  	callback();
		continue;
	  }
      mod = TFL.getMod(m);
      if (mod.requires) {
        TFL.loadDeps(mod.requires, (function(mod){
			return function(){
				TFL.Loader.load(mod.path, mod.type, mod.charset, callback);
			};
        })(mod));
      } else {
      	if(mod.path == ''){
      		callback();
      	}
        TFL.Loader.load(mod.path, mod.type, mod.charset, callback);
      }
    }
};

TFL.getMod = function(m){
	 var mods = TFL.moduleConfigs, mod; 
	 if (typeof m === 'string') {
	   mod = (mods[m])? mods[m] : { path: m };
	 } else {
	   mod = m;
	 }
	 return mod;
};

TFL.delay = function() {
	var args = [].slice.call(arguments), delay = args.shift();
	window.setTimeout(function(){
		var i = 0, fun;
		for(; fun = args[i++]; ){
			fun && fun();
		}
	}, delay);
};
/**
 * usage
 * TFL.css([
 *  '.aa{ border: 1px solid red; }',
 *  '.bb{ color: red; margin-top:10px; }'
 * ]);
 */
TFL.css = function(s) {
	s = s.join('');
	var doc = document, css = doc.getElementById('tfl-inline-css');
	if (!css) {
		css = doc.createElement('style');
		css.type = 'text/css';
		css.id = 'tfl-inline-css';
		doc.body.appendChild(css);
	}
	if (css.styleSheet) {
		css.styleSheet.cssText = css.styleSheet.cssText + s;
	} else {
		css.appendChild(doc.createTextNode(s));
	}
};

TFL.widget = function(wName, wContent, needInit, needInstance) {
	var namespace = wName ? wName.split('.') : [], first = TFL, last, tgtObj;
	for( var i = 0, len = namespace.length; i < len; i++ ) {
		if( (i+1) < len ) {
			var o = namespace[i], o1 = namespace[i+1];
			first[o] = first[o] || {};
			first[o][o1] = first[o][o1] || {};
			last = o1;
			first = first[o];
		} else {
			if(last) {
				first[o1] = wContent;	
				tgtObj = first[o1];		
			} else {
				if( needInstance ){
					TFL.toInstantiate(namespace[i], wContent);
				} else {
					TFL[namespace[i]] = wContent;
				}
				tgtObj = TFL[namespace[i]];
			}
			(needInit && TFL.initWidget(wName, tgtObj))
		}
	}
};

TFL.initWidget = function(name, obj){

	var callInit = function(){
		if( obj.init ){
			if( TFL.widgets[name] ){
				return
			}
			TFL.widgets[name] = true;
			obj.init();
		}
	};

	if( jQuery.isReady ){
		setTimeout(callInit, 0);
	} else {
		$(function(){ 
			callInit();
		})		
	}
};

TFL.toInstantiate = function(name, prototype){
	TFL[name] = function(options){
		return new TFL[name].handler(options); 
	};
	TFL[name].handler = function(options){
		this.widgetName = name;
		this.options = $.extend({}, this.defaults, options);
		this._init();
		return this;
	};
	TFL[name].handler.prototype = $.extend({}, TFL.widget.prototype, prototype);
};

TFL.widget.prototype = {
	_init: function(){},
	_trigger: function(type, object) {
		var callback = this.options[type], eventType = this.widgetName + type;
		$(object).trigger(eventType);
        ($.isFunction(callback) && callback(object));
	}
};

TFL.ie = {
	isTrue: $.browser.msie,
	version: $.browser.version.split(".")[0],
	init: function(){
		if( this.isTrue ){
			var docMode = this.mode(), ieClass = "ie ie" + this.version;
			if( docMode < 9 ){ ieClass += " oldie" }
			ieClass += " mode" + docMode;
			$("html").addClass(ieClass);
			$(function(){
				TFL.ie.css3();
			});
 		}
	},
	mode: function(v){
		if( !this.isTrue ){
			return ;
		}
		var mode = parseInt(document.documentMode || this.version);
		if(v){
			return (mode === v);
		}else{
			return mode;
		}
	},
	css3: function(){
		if(this.isTrue && this.mode() < 9){
			TFL.Loader.loadJs("http://imgcache.qq.com/club/weiyun/js/publics/note_web/lib/tfl-editor/js/tfl-ie.js", function(){
				TFL.tflIe.init();
			});
		}
	}
};

TFL.ie.init();

TFL.browser = {
	name: null,
	init: function() {
		var b,
			ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('msie') >= 0) {
			b = 'ie';
		} else if (ua.indexOf('firefox') >= 0) {
			b = 'firefox';
		} else if (ua.indexOf('opr') >= 0 || ua.indexOf('opera') >= 0 ) {
			b = 'opera';
		} else if (ua.indexOf('chrome') >= 0) {
			b = 'chrome';
		} else if (ua.indexOf('safari') >= 0) {
			b = 'safari';
		}
		this.name = b;
	},
	is: function(browser) {
		return browser.toLowerCase() === this.name;
	}
};
TFL.browser.init();

TFL.tagBoolean = function(para,obj,defaultValue){
	var val = $(obj).attr(para) , bool; 
	if(defaultValue){
	   bool = val == 'false' ? false : true;
	}else{
	   bool = (val == 'true' || para == val) ? true : false;
	}
	return bool;
};

TFL.requireFunction = function(name, mod, cb){
	cb = cb || function(){};
	if( $.isFunction(name) ){
		cb();
	}else{
		TFL.use(mod, cb);
	}
};

TFL.preventCssRepeat = function(name, rq){
	var hd = $("head").addClass(name + '-css-loaded'), rt = rq;
	if(hd.css('clear') === 'both'){
		rt = '';
	}
	hd.removeClass(name + '-css-loaded');
	(!hd.attr('class') && hd.removeAttr('class'));
	return rt;
};

TFL.highchart = function(options){
	TFL.use("highchart", function(){
		TFL._highchart(options)
	})
};

TFL.getTblPath = function() {
	var path = '';
	var current_host = location.host;
	switch(current_host) {
		case 'rd.tencent.com' :
			path = 'http://rd.tencent.com/tdl/tbl/';
			break;
		case 'smart.oa.com':
			path = 'http://smart.oa.com/~frankychen/tdl/tbl/';
			break;
		case 'mac.oa.com':
		case 'opel.oa.com':
			path = 'http://mac.oa.com/tdl/tbl/';
			break;
		default :
			path = 'http://tdl.oa.com/tbl/';
	}
	return path;
};

TFL.parseHash = function(hashParam) {
    var hash = window.location.hash;
    if( hash.indexOf('#') !==0 ) { return false };
    var arrParams = hash.split('#')[1].split('&');
    var l = arrParams.length;
    var params = {};
    for (var i = 0; i < l; i++ ) {
        var key = arrParams[i].split('=')[0],
            value = arrParams[i].split('=')[1];
        if (key && value) {
            params[key] = value;
        }   
    }
    if (hashParam) {
    	return params[hashParam];
    } else {
   	 	return params;
    }
};

TFL.isDomainSetted = function(){
	return location.host.replace(/:\d+/, '') !== document.domain;
};

TFL.getDomain = function(){
	return document.domain;
};

$.fn.dialog = function(options){
	var self = $(this);
	TFL.use("uiDialog", function(){
		self.dialog(options)
	})
};

$.fn.DkSelect = function(options){
	var self = $(this);
	TFL.use("plugDkSelect", function(){
		self.DkSelect(options)
	})
};

$.fn.cluetip = function(options){
	var self = $(this);
	TFL.use("uiCluetip", function(){
		self.cluetip(options)
	})
};

if(!window.t){
	window.t = function(str){
		return str;
	}
};

if(!window.console){
	window.console = { log: function(){} };
};

(function(base){
	var jsUrlPrefix =  base + 'js/',
		cssUrlPrefix =  base + 'css/';
	TFL.moduleConfigs = {
		'jqueryUiCore': {
			path: jsUrlPrefix + 'jquery-ui-core.js'
		},
		'uiDialog': {
			path: jsUrlPrefix + 'ui.dialog.tapd.js', 
			requires: ['jqueryUiCore']
		},
		'dialog': {
			path: jsUrlPrefix + 'tfl-dialog.js', 
			requires:[cssUrlPrefix + 'tfl-dialog.css']
		},
		'uiDatepicker': {
			path: jsUrlPrefix + 'ui.datepicker.min.js',
			requires: ['jqueryUiCore']
		},
		'datePicker': {
			path: jsUrlPrefix + 'tfl-datepicker.js', 
			requires:[cssUrlPrefix + 'tfl-datepicker.css']
		},
		'localData': {
			path: jsUrlPrefix + 'tfl-localdata.js'
		},
		'uiCluetip': {
			path: jsUrlPrefix + 'jquery.cluetip.js'
		},
		'cluetip': {
			path: jsUrlPrefix + 'tfl-cluetip.js', 
			requires:[cssUrlPrefix + 'tfl-cluetip.css']
		},
		'pinyinEngine': {
			path: jsUrlPrefix + 'pinyinEngine.js'
		},
		'plugDkSelect': {
			path: jsUrlPrefix + 'dk_select.js'
		},
		'dkSelect': {
			path: jsUrlPrefix + 'tfl-dkselect.js', 
			requires:[cssUrlPrefix + 'tfl-dkselect.css']
		},
		'tSelect': {
			path: jsUrlPrefix + 'tfl-tselect.js'
		},
		'resizable': {
			path: jsUrlPrefix + 'ui.resizable.js', 
			requires:['jqueryUiCore']
		},
		'draggable': {
			path: jsUrlPrefix + 'ui.draggable.js', 
			requires:['jqueryUiCore']
		},
		'droppable': {
			path: jsUrlPrefix + 'ui.droppable.js', 
			requires:['jqueryUiCore']
		},
		'tab': {
			path: jsUrlPrefix + 'tfl-tab.js', 
			requires:['tabCss']
		},
		'tabCss': {
			path: TFL.preventCssRepeat('tab', cssUrlPrefix + 'tfl-tab.css')
		},
		'highchart': {
			path: jsUrlPrefix + 'tfl-highchart.js'
		},
		'plugUserChooser': {
			path: jsUrlPrefix + 'userchooser.js'
		},
		'userChooser': {
			path: jsUrlPrefix + 'tfl-userchooser.js',
			requires:[cssUrlPrefix + 'tfl-dropdown.css']
		},
		'button': {
			path: jsUrlPrefix + 'tfl-button.js'
		},
		'ico': {
			path: cssUrlPrefix + 'tfl-ico.css'
		},
		'mainnav': {
			path: jsUrlPrefix + 'tfl-mainnav.js',
			requires:[cssUrlPrefix + 'tfl-mainnav.css']
		},
		'topnav': {
			path: jsUrlPrefix + 'tfl-topnav.js',
			requires:[cssUrlPrefix + 'tfl-topnav.css']
		},
		'sidebar': {
			path: jsUrlPrefix + 'tfl-sidebar.js',
			requires:[cssUrlPrefix + 'tfl-sidebar.css']
		},
		'step': {
			path: cssUrlPrefix + 'tfl-step.css'
		},
		'dropdown': {
			path: jsUrlPrefix + 'tfl-dropdown.js',
			requires:[cssUrlPrefix + 'tfl-dropdown.css']
		},
		'filter': {
			path: jsUrlPrefix + 'tfl-filter.js',
			requires:[cssUrlPrefix + 'tfl-filter.css', 'remove']
		},
		'tips': {
			path: jsUrlPrefix + 'tfl-tips.js',
			requires:[cssUrlPrefix + 'tfl-tips.css']
		},
		'progress': {
			path: cssUrlPrefix + 'tfl-progress.css'
		},
		'confirm': {
			path: jsUrlPrefix + 'tfl-confirm.js',
			requires:[cssUrlPrefix + 'tfl-dialog.css']
		},
		'field': {
			path: jsUrlPrefix + 'tfl-field.js'
		},
		'remove': {
			path: jsUrlPrefix + 'tfl-remove.js',
			requires:['ico']
		},
		'editable': {
			path: jsUrlPrefix + 'tfl-editable.js',
			requires:['field','ico']
		},
		'editor': {
			path: jsUrlPrefix + 'tfl-editor.js',
			requires: [cssUrlPrefix + 'tfl-editor.css', 'tabCss']
		},
		'gallery': {
			path: jsUrlPrefix + 'tfl-gallery.js',
			requires: [cssUrlPrefix + 'tfl-gallery.css']
		},
		'mask': {
			path: jsUrlPrefix + 'tfl-mask.js'
		},
		'pinyinuserchooser' : {
			path: jsUrlPrefix + 'tfl-pinyinuserchooser.js',
			requires : ['typeahead']
		},
		'jquery17' : {
			path: jsUrlPrefix + 'jquery-1.7.2.min.extend.js'
		},
		'typeahead' : {
			path: jsUrlPrefix + 'typeahead.bundle.js',
			requires : ['jquery17']
		},
		'bubble': {
			path: jsUrlPrefix + 'tfl-bubble.js'
		}
	};

})(TFL.path);

// TFL.use("pinyinuserchooser");
