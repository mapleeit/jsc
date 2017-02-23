//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/noteview/noteview.r160106",["$","lib","common"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//noteview/src/EventEmitter.js
//noteview/src/buttons.js
//noteview/src/html-to-text.js
//noteview/src/libs/utf8.js
//noteview/src/noteview.js
//noteview/src/photo_upload.js
//noteview/src/tfl-editor-extender.js
//noteview/src/tfl-extend/checkbox.js
//noteview/src/tfl-extend/security_filter.js
//noteview/src/tips-expand.js

//js file list:
//noteview/src/EventEmitter.js
//noteview/src/buttons.js
//noteview/src/html-to-text.js
//noteview/src/libs/utf8.js
//noteview/src/noteview.js
//noteview/src/photo_upload.js
//noteview/src/tfl-editor-extender.js
//noteview/src/tfl-extend/checkbox.js
//noteview/src/tfl-extend/security_filter.js
//noteview/src/tips-expand.js
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
define.pack("./EventEmitter",[],function(require, exports, module) {
    !function(undefined) {

        var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
        var defaultMaxListeners = 10;

        function init() {
            this._events = {};
            if (this._conf) {
                configure.call(this, this._conf);
            }
        }

        function configure(conf) {
            if (conf) {

                this._conf = conf;

                conf.delimiter && (this.delimiter = conf.delimiter);
                conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
                conf.wildcard && (this.wildcard = conf.wildcard);
                conf.newListener && (this.newListener = conf.newListener);

                if (this.wildcard) {
                    this.listenerTree = {};
                }
            }
        }

        function EventEmitter(conf) {
            this._events = {};
            this.newListener = false;
            configure.call(this, conf);
        }

        //
        // Attention, function return type now is array, always !
        // It has zero elements if no any matches found and one or more
        // elements (leafs) if there are matches
        //
        function searchListenerTree(handlers, type, tree, i) {
            if (!tree) {
                return [];
            }
            var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
                typeLength = type.length, currentType = type[i], nextType = type[i+1];
            if (i === typeLength && tree._listeners) {
                //
                // If at the end of the event(s) list and the tree has listeners
                // invoke those listeners.
                //
                if (typeof tree._listeners === 'function') {
                    handlers && handlers.push(tree._listeners);
                    return [tree];
                } else {
                    for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
                        handlers && handlers.push(tree._listeners[leaf]);
                    }
                    return [tree];
                }
            }

            if ((currentType === '*' || currentType === '**') || tree[currentType]) {
                //
                // If the event emitted is '*' at this part
                // or there is a concrete match at this patch
                //
                if (currentType === '*') {
                    for (branch in tree) {
                        if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
                            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
                        }
                    }
                    return listeners;
                } else if(currentType === '**') {
                    endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
                    if(endReached && tree._listeners) {
                        // The next element has a _listeners, add it to the handlers.
                        listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
                    }

                    for (branch in tree) {
                        if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
                            if(branch === '*' || branch === '**') {
                                if(tree[branch]._listeners && !endReached) {
                                    listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
                                }
                                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
                            } else if(branch === nextType) {
                                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
                            } else {
                                // No match on this one, shift into the tree but not in the type array.
                                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
                            }
                        }
                    }
                    return listeners;
                }

                listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
            }

            xTree = tree['*'];
            if (xTree) {
                //
                // If the listener tree will allow any match for this part,
                // then recursively explore all branches of the tree
                //
                searchListenerTree(handlers, type, xTree, i+1);
            }

            xxTree = tree['**'];
            if(xxTree) {
                if(i < typeLength) {
                    if(xxTree._listeners) {
                        // If we have a listener on a '**', it will catch all, so add its handler.
                        searchListenerTree(handlers, type, xxTree, typeLength);
                    }

                    // Build arrays of matching next branches and others.
                    for(branch in xxTree) {
                        if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
                            if(branch === nextType) {
                                // We know the next element will match, so jump twice.
                                searchListenerTree(handlers, type, xxTree[branch], i+2);
                            } else if(branch === currentType) {
                                // Current node matches, move into the tree.
                                searchListenerTree(handlers, type, xxTree[branch], i+1);
                            } else {
                                isolatedBranch = {};
                                isolatedBranch[branch] = xxTree[branch];
                                searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
                            }
                        }
                    }
                } else if(xxTree._listeners) {
                    // We have reached the end and still on a '**'
                    searchListenerTree(handlers, type, xxTree, typeLength);
                } else if(xxTree['*'] && xxTree['*']._listeners) {
                    searchListenerTree(handlers, type, xxTree['*'], typeLength);
                }
            }

            return listeners;
        }

        function growListenerTree(type, listener) {

            type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

            //
            // Looks for two consecutive '**', if so, don't add the event at all.
            //
            for(var i = 0, len = type.length; i+1 < len; i++) {
                if(type[i] === '**' && type[i+1] === '**') {
                    return;
                }
            }

            var tree = this.listenerTree;
            var name = type.shift();

            while (name) {

                if (!tree[name]) {
                    tree[name] = {};
                }

                tree = tree[name];

                if (type.length === 0) {

                    if (!tree._listeners) {
                        tree._listeners = listener;
                    }
                    else if(typeof tree._listeners === 'function') {
                        tree._listeners = [tree._listeners, listener];
                    }
                    else if (isArray(tree._listeners)) {

                        tree._listeners.push(listener);

                        if (!tree._listeners.warned) {

                            var m = defaultMaxListeners;

                            if (typeof this._events.maxListeners !== 'undefined') {
                                m = this._events.maxListeners;
                            }

                            if (m > 0 && tree._listeners.length > m) {

                                tree._listeners.warned = true;
                                console.error('(node) warning: possible EventEmitter memory ' +
                                        'leak detected. %d listeners added. ' +
                                        'Use emitter.setMaxListeners() to increase limit.',
                                    tree._listeners.length);
                                console.trace();
                            }
                        }
                    }
                    return true;
                }
                name = type.shift();
            }
            return true;
        }

        // By default EventEmitters will print a warning if more than
        // 10 listeners are added to it. This is a useful default which
        // helps finding memory leaks.
        //
        // Obviously not all Emitters should be limited to 10. This function allows
        // that to be increased. Set to zero for unlimited.

        EventEmitter.prototype.delimiter = '.';

        EventEmitter.prototype.setMaxListeners = function(n) {
            this._events || init.call(this);
            this._events.maxListeners = n;
            if (!this._conf) this._conf = {};
            this._conf.maxListeners = n;
        };

        EventEmitter.prototype.event = '';

        EventEmitter.prototype.once = function(event, fn) {
            this.many(event, 1, fn);
            return this;
        };

        EventEmitter.prototype.many = function(event, ttl, fn) {
            var self = this;

            if (typeof fn !== 'function') {
                throw new Error('many only accepts instances of Function');
            }

            function listener() {
                if (--ttl === 0) {
                    self.off(event, listener);
                }
                fn.apply(this, arguments);
            }

            listener._origin = fn;

            this.on(event, listener);

            return self;
        };

        EventEmitter.prototype.emit = function() {

            this._events || init.call(this);

            var type = arguments[0];

            if (type === 'newListener' && !this.newListener) {
                if (!this._events.newListener) { return false; }
            }

            // Loop through the *_all* functions and invoke them.
            if (this._all) {
                var l = arguments.length;
                var args = new Array(l - 1);
                for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
                for (i = 0, l = this._all.length; i < l; i++) {
                    this.event = type;
                    this._all[i].apply(this, args);
                }
            }

            // If there is no 'error' event listener then throw.
            if (type === 'error') {

                if (!this._all &&
                    !this._events.error &&
                    !(this.wildcard && this.listenerTree.error)) {

                    if (arguments[1] instanceof Error) {
                        throw arguments[1]; // Unhandled 'error' event
                    } else {
                        throw new Error("Uncaught, unspecified 'error' event.");
                    }
                    return false;
                }
            }

            var handler;

            if(this.wildcard) {
                handler = [];
                var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
                searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
            }
            else {
                handler = this._events[type];
            }

            if (typeof handler === 'function') {
                this.event = type;
                if (arguments.length === 1) {
                    handler.call(this);
                }
                else if (arguments.length > 1)
                    switch (arguments.length) {
                        case 2:
                            handler.call(this, arguments[1]);
                            break;
                        case 3:
                            handler.call(this, arguments[1], arguments[2]);
                            break;
                        // slower
                        default:
                            var l = arguments.length;
                            var args = new Array(l - 1);
                            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
                            handler.apply(this, args);
                    }
                return true;
            }
            else if (handler) {
                var l = arguments.length;
                var args = new Array(l - 1);
                for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

                var listeners = handler.slice();
                for (var i = 0, l = listeners.length; i < l; i++) {
                    this.event = type;
                    listeners[i].apply(this, args);
                }
                return (listeners.length > 0) || !!this._all;
            }
            else {
                return !!this._all;
            }

        };

        EventEmitter.prototype.on = function(type, listener) {

            if (typeof type === 'function') {
                this.onAny(type);
                return this;
            }

            if (typeof listener !== 'function') {
                throw new Error('on only accepts instances of Function');
            }
            this._events || init.call(this);

            // To avoid recursion in the case that type == "newListeners"! Before
            // adding it to the listeners, first emit "newListeners".
            this.emit('newListener', type, listener);

            if(this.wildcard) {
                growListenerTree.call(this, type, listener);
                return this;
            }

            if (!this._events[type]) {
                // Optimize the case of one listener. Don't need the extra array object.
                this._events[type] = listener;
            }
            else if(typeof this._events[type] === 'function') {
                // Adding the second element, need to change to array.
                this._events[type] = [this._events[type], listener];
            }
            else if (isArray(this._events[type])) {
                // If we've already got an array, just append.
                this._events[type].push(listener);

                // Check for listener leak
                if (!this._events[type].warned) {

                    var m = defaultMaxListeners;

                    if (typeof this._events.maxListeners !== 'undefined') {
                        m = this._events.maxListeners;
                    }

                    if (m > 0 && this._events[type].length > m) {

                        this._events[type].warned = true;
                        console.error('(node) warning: possible EventEmitter memory ' +
                                'leak detected. %d listeners added. ' +
                                'Use emitter.setMaxListeners() to increase limit.',
                            this._events[type].length);
                        console.trace();
                    }
                }
            }
            return this;
        };

        EventEmitter.prototype.onAny = function(fn) {

            if (typeof fn !== 'function') {
                throw new Error('onAny only accepts instances of Function');
            }

            if(!this._all) {
                this._all = [];
            }

            // Add the function to the event listener collection.
            this._all.push(fn);
            return this;
        };

        EventEmitter.prototype.addListener = EventEmitter.prototype.on;

        EventEmitter.prototype.off = function(type, listener) {
            if (typeof listener !== 'function') {
                throw new Error('removeListener only takes instances of Function');
            }

            var handlers,leafs=[];

            if(this.wildcard) {
                var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
                leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
            }
            else {
                // does not use listeners(), so no side effect of creating _events[type]
                if (!this._events[type]) return this;
                handlers = this._events[type];
                leafs.push({_listeners:handlers});
            }

            for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
                var leaf = leafs[iLeaf];
                handlers = leaf._listeners;
                if (isArray(handlers)) {

                    var position = -1;

                    for (var i = 0, length = handlers.length; i < length; i++) {
                        if (handlers[i] === listener ||
                            (handlers[i].listener && handlers[i].listener === listener) ||
                            (handlers[i]._origin && handlers[i]._origin === listener)) {
                            position = i;
                            break;
                        }
                    }

                    if (position < 0) {
                        continue;
                    }

                    if(this.wildcard) {
                        leaf._listeners.splice(position, 1);
                    }
                    else {
                        this._events[type].splice(position, 1);
                    }

                    if (handlers.length === 0) {
                        if(this.wildcard) {
                            delete leaf._listeners;
                        }
                        else {
                            delete this._events[type];
                        }
                    }
                    return this;
                }
                else if (handlers === listener ||
                    (handlers.listener && handlers.listener === listener) ||
                    (handlers._origin && handlers._origin === listener)) {
                    if(this.wildcard) {
                        delete leaf._listeners;
                    }
                    else {
                        delete this._events[type];
                    }
                }
            }

            return this;
        };

        EventEmitter.prototype.offAny = function(fn) {
            var i = 0, l = 0, fns;
            if (fn && this._all && this._all.length > 0) {
                fns = this._all;
                for(i = 0, l = fns.length; i < l; i++) {
                    if(fn === fns[i]) {
                        fns.splice(i, 1);
                        return this;
                    }
                }
            } else {
                this._all = [];
            }
            return this;
        };

        EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

        EventEmitter.prototype.removeAllListeners = function(type) {
            if (arguments.length === 0) {
                !this._events || init.call(this);
                return this;
            }

            if(this.wildcard) {
                var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
                var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

                for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
                    var leaf = leafs[iLeaf];
                    leaf._listeners = null;
                }
            }
            else {
                if (!this._events[type]) return this;
                this._events[type] = null;
            }
            return this;
        };

        EventEmitter.prototype.listeners = function(type) {
            if(this.wildcard) {
                var handlers = [];
                var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
                searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
                return handlers;
            }

            this._events || init.call(this);

            if (!this._events[type]) this._events[type] = [];
            if (!isArray(this._events[type])) {
                this._events[type] = [this._events[type]];
            }
            return this._events[type];
        };

        EventEmitter.prototype.listenersAny = function() {

            if(this._all) {
                return this._all;
            }
            else {
                return [];
            }

        };

        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define.pack("./EventEmitter",[],function() {
                return EventEmitter;
            });
        } else if (typeof exports === 'object') {
            // CommonJS
            exports.EventEmitter2 = EventEmitter;
        }
        else {
            // Browser global.
            window.EventEmitter2 = EventEmitter;
        }
    }();
});
define.pack("./buttons",["$"],function(require, exports, module) {
    var $ = require('$');
    exports.BindFunctions = function() {
        $("#refresh").click(function(){
            window.external.CallWeiyunClient_RefreshNote();
        });
        $("#remove").click(function(){
            window.external.CallWeiyunClient_RemoveNote();
        });
        $("#create").click(function(){
            window.external.CallWeiyunClient_CreateNote();
        });
    };
});define.pack("./html-to-text",[],function(require, exports, module) {
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
});define.pack("./libs.utf8",[],function(require, exports, module) {
    (function(root) {

        // Detect free variables `exports`
        var freeExports = typeof exports == 'object' && exports;

        // Detect free variable `module`
        var freeModule = typeof module == 'object' && module &&
            module.exports == freeExports && module;

        // Detect free variable `global`, from Node.js or Browserified code,
        // and use it as `root`
        var freeGlobal = typeof global == 'object' && global;
        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
            root = freeGlobal;
        }

        /*--------------------------------------------------------------------------*/

        var stringFromCharCode = String.fromCharCode;

        // Taken from http://mths.be/punycode
        function ucs2decode(string) {
            var output = [];
            var counter = 0;
            var length = string.length;
            var value;
            var extra;
            while (counter < length) {
                value = string.charCodeAt(counter++);
                if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                    // high surrogate, and there is a next character
                    extra = string.charCodeAt(counter++);
                    if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                    } else {
                        // unmatched surrogate; only append this code unit, in case the next
                        // code unit is the high surrogate of a surrogate pair
                        output.push(value);
                        counter--;
                    }
                } else {
                    output.push(value);
                }
            }
            return output;
        }

        // Taken from http://mths.be/punycode
        function ucs2encode(array) {
            var length = array.length;
            var index = -1;
            var value;
            var output = '';
            while (++index < length) {
                value = array[index];
                if (value > 0xFFFF) {
                    value -= 0x10000;
                    output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                    value = 0xDC00 | value & 0x3FF;
                }
                output += stringFromCharCode(value);
            }
            return output;
        }

        /*--------------------------------------------------------------------------*/

        function createByte(codePoint, shift) {
            return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
        }

        function encodeCodePoint(codePoint) {
            if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
                return stringFromCharCode(codePoint);
            }
            var symbol = '';
            if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
                symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
            }
            else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
                symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
                symbol += createByte(codePoint, 6);
            }
            else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
                symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
                symbol += createByte(codePoint, 12);
                symbol += createByte(codePoint, 6);
            }
            symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
            return symbol;
        }

        function utf8encode(string) {
            var codePoints = ucs2decode(string);
            var length = codePoints.length;
            var index = -1;
            var codePoint;
            var byteString = '';
            while (++index < length) {
                codePoint = codePoints[index];
                byteString += encodeCodePoint(codePoint);
            }
            return byteString;
        }

        /*--------------------------------------------------------------------------*/

        function readContinuationByte() {
            if (byteIndex >= byteCount) {
                throw Error('Invalid byte index');
            }

            var continuationByte = byteArray[byteIndex] & 0xFF;
            byteIndex++;

            if ((continuationByte & 0xC0) == 0x80) {
                return continuationByte & 0x3F;
            }

            // If we end up here, it’s not a continuation byte
            throw Error('Invalid continuation byte');
        }

        function decodeSymbol() {
            var byte1;
            var byte2;
            var byte3;
            var byte4;
            var codePoint;

            if (byteIndex > byteCount) {
                throw Error('Invalid byte index');
            }

            if (byteIndex == byteCount) {
                return false;
            }

            // Read first byte
            byte1 = byteArray[byteIndex] & 0xFF;
            byteIndex++;

            // 1-byte sequence (no continuation bytes)
            if ((byte1 & 0x80) == 0) {
                return byte1;
            }

            // 2-byte sequence
            if ((byte1 & 0xE0) == 0xC0) {
                var byte2 = readContinuationByte();
                codePoint = ((byte1 & 0x1F) << 6) | byte2;
                if (codePoint >= 0x80) {
                    return codePoint;
                } else {
                    throw Error('Invalid continuation byte');
                }
            }

            // 3-byte sequence (may include unpaired surrogates)
            if ((byte1 & 0xF0) == 0xE0) {
                byte2 = readContinuationByte();
                byte3 = readContinuationByte();
                codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
                if (codePoint >= 0x0800) {
                    return codePoint;
                } else {
                    throw Error('Invalid continuation byte');
                }
            }

            // 4-byte sequence
            if ((byte1 & 0xF8) == 0xF0) {
                byte2 = readContinuationByte();
                byte3 = readContinuationByte();
                byte4 = readContinuationByte();
                codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
                    (byte3 << 0x06) | byte4;
                if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
                    return codePoint;
                }
            }

            throw Error('Invalid UTF-8 detected');
        }

        var byteArray;
        var byteCount;
        var byteIndex;
        function utf8decode(byteString) {
            byteArray = ucs2decode(byteString);
            byteCount = byteArray.length;
            byteIndex = 0;
            var codePoints = [];
            var tmp;
            while ((tmp = decodeSymbol()) !== false) {
                codePoints.push(tmp);
            }
            return ucs2encode(codePoints);
        }

        /*--------------------------------------------------------------------------*/

        var utf8 = {
            'version': '2.0.0',
            'encode': utf8encode,
            'decode': utf8decode
        };

        // Some AMD build optimizers, like r.js, check for specific condition patterns
        // like the following:
        if (
            typeof define == 'function' &&
            typeof define.amd == 'object' &&
            define.amd
            ) {
            define.pack("./libs.utf8",[],function() {
                return utf8;
            });
        }	else if (freeExports && !freeExports.nodeType) {
            if (freeModule) { // in Node.js or RingoJS v0.8.0+
                freeModule.exports = utf8;
            } else { // in Narwhal or RingoJS v0.7.0-
                var object = {};
                var hasOwnProperty = object.hasOwnProperty;
                for (var key in utf8) {
                    hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
                }
            }
        } else { // in Rhino or a web browser
            root.utf8 = utf8;
        }

    }(this));
});
define.pack("./noteview",["./tfl-extend.checkbox","./tfl-extend.security_filter","./html-to-text","$","./tfl-editor-extender"],function (require, exports, module) {
    exports.name = 'hello';
    var CheckBoxFeature = require("./tfl-extend.checkbox");
    var SecurityFilter = require("./tfl-extend.security_filter");
    //var photo_upload = require('./photo_upload');
	var htmlHelper = require("./html-to-text");
    var C = {};
    var DefineConstValue = function () {
        // 按钮状态
        this.STATE_NORMAL = 0;
        this.STATE_IS_SAVING = 1;
        this.STATE_SAVE_COMPLETE = 2;
        this.STATE_SAVE_FAILD = 3;

        // 笔记类型
        this.NOTE_TYPE_ARTICLE = 1;
        this.NOTE_TYPE_HTMLTEXT = 2;

        // 最大分段文本长度
        this.MAX_STEP_ARGUMENT_LENGTH = 10 * 1024;

        // 最大笔记长度200kb
        this.MAX_CONTENTLENGTH = 200 * 1024;
    };
    DefineConstValue.call(C);

    var $ = exports.jQuery = require('$');
    var tfl_editor_extender = require('./tfl-editor-extender');
    var editor = null;
    var current_session_id = "0";
    var is_editor_ready = false;
    var save_state = C.STATE_NORMAL;
    var savestate_timer = null;

    var GetNoteContent = function () {
        var result = editor.getJsonContent();
        $.extend(result, {"session_id": current_session_id});
        return result;
    };

    /*
     * 更新笔记内容的回调
     */
    var UpdateWeiyunClientContent = function (session_id, cache_id) {
        // 调用微云客户端接口, 通知微云客户端更新笔记数据. 使用推的模式+拆分参数.
        var strContent = JSON.stringify(GetNoteContent());
        if (window.external && window.external.CallWeiyunClient_UpdateContent_Begin) {
            var strUpdateCache = "false";
            if (cache_id != undefined) {
                session_id = cache_id;
                strUpdateCache = "true";
            }
            window.external.CallWeiyunClient_UpdateContent_Begin(session_id, strUpdateCache);
            var index = 0;
            var length = strContent.length;
            var step = C.MAX_STEP_ARGUMENT_LENGTH;
            while (index < length) {
                window.external.CallWeiyunClient_UpdateContent_Step(session_id, strContent.substr(index, step));
                index += step;
            }
            window.external.CallWeiyunClient_UpdateContent_End(session_id);
        } else {
            //alert('保存');
        }
    };

    var ChangeSaveButtonStyle = function () {
        $(".editor-ico-save").append($('<p class="editor-ico-save-p">').text("保存"));
        SetSaveButtonState(C.STATE_NORMAL);
    };

    var SetSaveButtonState = function (state) {
        var $btn = $(".editor-ico-save");
        if (state == C.STATE_NORMAL) {
            $btn.children("p").text("保存");
            $btn.removeClass("disable");
        }
        else if (state == C.STATE_IS_SAVING) {
            $btn_text = $btn.children("p");
            $btn.children("p").html("<img src='./img/loading_btn.gif'>");
            $btn_text.children("img").css("margin", "5px");
            $btn.addClass("disable");
        }
        else if (state == C.STATE_SAVE_COMPLETE) {
            $btn.children("p").text("已保存");
            $btn.addClass("disable");
        }
        else if (state == C.STATE_SAVE_FAILD) {
            $btn.children("p").text("未保存");
            $btn.addClass("disable");
        }
        save_state = state;
    };

    var OnNoteViewReady = function () {
        if (!Function.prototype.bind) {       //ie8 以下兼容
            Function.prototype.bind = function (oThis) {
                if (typeof this !== "function") {
                    // closest thing possible to the ECMAScript 5 internal IsCallable function
                    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                }
                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };
                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();
                return fBound;
            };
        }
        if(!String.prototype.trim){
            String.prototype.trim=function(){
                return this.replace(/(^\s*)|(\s*$)/g, "");
            }
        }

        editor = TFL.editor.instances["tflEditor"];
        editor.eventMgr.on('button_save', OnSaveButtonClick);
        editor.eventMgr.on('button_insert', OnInsertImage);
        editor.eventMgr.on('onchange', OnNoteContentChange);
        editor.eventMgr.on('paste_base64', OnPasteBase64);
        CheckBoxFeature.InstallToEditor(editor);
        SecurityFilter.InstallToEditor(editor);
        editor.eventMgr.on('onAfterPaste', OnAfterPaste.bind(editor));
        ChangeSaveButtonStyle();

        //绑定上传图片的事件
        //photo_upload._bind_events();
    };

    var CheckNeedSave = (function () {
        var last_save_session_id = null;
        var last_save_time = null;

        /**
         * @returns {boolean}
         */
        function FuncCheckNeedSave(session_id) {
            if (last_save_session_id == session_id) {
                // 1s的延迟
                var timeStamp = new Date().getTime();
                if (timeStamp - last_save_time > 1000) {
                    last_save_time = timeStamp;
                    return true;
                }
                return false;
            } else {
                last_save_session_id = session_id;
                last_save_time = new Date().getTime();
                return true;
            }
        }

        return FuncCheckNeedSave;
    })();

    var OnSaveButtonClick = function (autosave) {
        var me = this;
        if (!CheckNeedSave(current_session_id) || editor.doc.body.innerHTML.length == 0) {
            return;
        }

        if (window.external && window.external.CallWeiyunClient_SaveNote) {
            UpdateWeiyunClientContent(current_session_id, undefined);
            window.external.CallWeiyunClient_SaveNote(current_session_id, "", "false");
        } else {
            if (window.parent && window.parent.call_save_note) {
                window.parent.call_save_note(current_session_id, GetNoteContent(),autosave);
            }
        }
    };
    var OnInsertImage = function () {
        if (window.external &&  window.external.CallWeiyunClient_InsertImage) {
            window.external.CallWeiyunClient_InsertImage(JSON.stringify(GetNoteContent()));
        } else {
            var inputObj = document.createElement('input')
            inputObj.setAttribute('id', '_ef');
            inputObj.setAttribute('type', 'file');
            inputObj.setAttribute("style", 'visibility:hidden');
            document.body.appendChild(inputObj);
            inputObj.click();
            //    inputObj.value ;
        }
    };
    var OnNoteContentChange = function (changeSuccess) {
        var $btn = $(".editor-ico-save");
        if (save_state == C.STATE_NORMAL && $btn.hasClass('disable')) {
            SetSaveButtonState(C.STATE_NORMAL);
        }
        if (window.external && window.external.CallWeiyunClient_OnDocumentChange) {
            window.external.CallWeiyunClient_OnDocumentChange(current_session_id, 'NO_IME');
        }else{
           // alert('test');
            if(changeSuccess === false) {
                window.parent && window.parent.call_note_show_tip && window.parent.call_note_show_tip('warn', '笔记内容字数超限，请另新建笔记');
            }
        }
    };
    var OnPasteBase64 = function (result) {
        UpdateWeiyunClientContent(current_session_id, undefined);
        if (window.external && window.external.CallWeiyunClient_OnPasteImageBuffer_Begin) {
            var base64 = result.split(',')[1];
            var index = 0;
            var length = base64.length;
            var step = C.MAX_STEP_ARGUMENT_LENGTH;
            window.external.CallWeiyunClient_OnPasteImageBuffer_Begin(current_session_id);
            while (index < length) {
                window.external.CallWeiyunClient_OnPasteImageBuffer_Step(current_session_id, base64.substr(index, step));
                index += step;
            }
            window.external.CallWeiyunClient_OnPasteImageBuffer_End(current_session_id);
        } else {
            _console.error('CallWeiyunClient_OnPasteImageBuffer_Begin Not exist!');
        }
    };
    var OnAfterPaste = function () {
        var editor = this;

        var MAX_CONTENT = editor.options.max_content;
        if (editor.doc.body.innerHTML.length > MAX_CONTENT) {
            editor.doc.body.innerHTML = editor.doc.body.innerHTML.substr(0, MAX_CONTENT);
        }
    };

    exports.InitNoteView = function (id) {
        // 这里对tfl控件做微云自己的扩展
        tfl_editor_extender();
        // 这里初始化editor控件
        // 创建之前, 修改一下对齐的tips
        TFL.editor.lang({'justify': '对齐调整'});
        TFL.editor({
            id: "tflEditor",
            needFocus: false,
            buttonsRight: [],
            hasBtnText: [],
            afterCreate: function () {
                editor = TFL.editor.instances["tflEditor"];
                var $toolbar = editor.toolbar;
                var $editor = editor.editor;
                var $htmlNode = $('html');
                if(!$.browser.msie  || $.browser.version > 8){
                    $editor.addClass('editor-maximize');
                }else{
                    $editor.width('100%');
                }
                $('body').addClass('body-editor-maximize');
                $editor.find('.editor-area').height($editor.height() - $toolbar.outerHeight() - 1);
                $htmlNode.addClass('html-overflow-hidden');
                is_editor_ready = true;
                OnNoteViewReady();
            },
            buttons: [
                'bold', 'italic', 'underline',
                'font', 'size', 'color',
                'insertunorderedlist', 'insertorderedlist', 'justify',
                'indent', 'outdent', 'checkbox', 'uploadimage'
            ],
            justify: ['justifyleft', 'justifycenter', 'justifyright'],
            buttonsRight: ['save'],
            max_content: C.MAX_CONTENTLENGTH
        });
    };

    exports.CallJS_ResizeExitorArea=function(height,width){
        var $editor = TFL.editor.instances["tflEditor"].editor;
        if($.browser.msie && $.browser.version <= 8){
            if(width && width>0){
                $editor.width(width);
            }
            $editor.find('.editor-area').height(height - 50);
        }else{
            $editor.find('.editor-area').height(height-45);
        }

    }

    exports.CallJS_ShowNote = (function () {
        var time_out = null;

        function ShowNote(session_note_id, note_type, html_context, url) {
            // 如果编辑器没有准备好, 那么延迟显示内容
            var $arguments = arguments;
            var self = this;
            if (time_out != null) {
                clearTimeout(time_out);
                time_out = null;
            }
            if (is_editor_ready == false) {
                // _console.log('try show note next 1 second!');
                time_out = setTimeout(function () {
                    ShowNote.apply(self, $arguments);
                }, 1000);
                return "delay";
            }
            current_session_id = session_note_id;

            if (note_type != C.NOTE_TYPE_ARTICLE) {
                var focus = false;
                var $tflEditor=$('#tflEditor');
                $('#note_viewer').show();

                SetSaveButtonState(C.STATE_NORMAL);

	            //过滤xss
	            html_context = htmlHelper.HtmlToSafe(html_context);

                if(session_note_id =="" && (html_context=='<br>' || html_context=='')){
                    editor.setHtml('<div/>');   // ie兼容 新建笔记逻辑. 否则会导致编辑器换行的间隙出现问题
                }else{
                    editor.setHtml(html_context);
                }
                if (html_context.length == 0) {
                    var $btn = $(".editor-ico-save");
                    $btn.addClass('disable');
                }
            }
            return "done!";
        }

        return ShowNote;
    })();

    exports.CallJS_ChangeSaveState = function (session_note_id, state) {
//        if (current_session_id != session_note_id) {
//            return;
//        }

        SetSaveButtonState(state);

        /**
         * 在{timeout}时间内, 从{{old_state}}恢复成原来的{{new_state}}状态
         * 使用统一的{{timer}}对象
         * @returns {Object}
         */
        var ResumeSaveState = function (session_id, old_state, new_state, timer, timeout) {
            if (timer != null) {
                clearTimeout(timer);
            }
            return setTimeout(function () {
                if (current_session_id != session_id)
                    return;
                if (old_state != save_state)
                    return;
                SetSaveButtonState(new_state);
            }, timeout);
        };

        if (state == C.STATE_SAVE_COMPLETE || state == C.STATE_SAVE_FAILD) {
            savestate_timer = ResumeSaveState(session_note_id, state, C.STATE_NORMAL, savestate_timer, 2000);
        }
    };

    exports.CallJS_WeiYunInsertImage = function (src, border, margin, width, height) {
        var html = '<img src="' + src + '" class="wyimage" ' + 'alt="img" style="' +
            (border ? 'border:' + border + 'px solid black;' : '') +
            (margin ? 'margin:' + margin + 'px;' : '') + '" ' +
            (width ? 'width="' + width + '" ' : '') +
            (height ? 'height="' + height + '" ' : '') + '/>';
        editor.insertHtml(html);
        editor.eventMgr.emit('onchange');
    };

    exports.CallJS_WebWeiYunInsertImage = function (config) {
        var src=config.url;
        window.current_upload_img_src=src;
        //var border, margin,width,height;

        var img = new Image();
        img.className = 'wyimage';
        img.style = 'display: none';
        //var html = '<img src="' + src + '" ' + ' onload="console.log(1);" ' + ' class="wyimage" alt="img" style="' +
        //    (border ? 'border:' + border + 'px solid black;' : '') +
        //    (margin ? 'margin:' + margin + 'px;' : '') + '" ' +
        //    (width ? 'width="' + width + '" ' : '') +
        //    (height ? 'height="' + height + '" ' : '') + '/>';
        //editor.insertHtml(html);
        img.onload = function() {
            window.parent.parent.call_close_note_pic_upload_mask();
            window.current_upload_img_src = null;
            window.CallJS_WeiYunInsertImage(this.src);
            //this.remove();
        };
	    img.src = src;  //window.parent.parent.call_close_note_pic_upload_mask();window.current_upload_img_src=null;window.CallJS_WeiYunInsertImage(this.src);
        editor.eventMgr.emit('onchange');
    };

    exports.CallJS_UpdateImageUrl = function (src_url, replace_url) {
        if(src_url == null){
            src_url=window.current_upload_img_src;
            window.current_upload_img_src=null;
        }
        if(src_url == null){
            return;
        }
        $(editor.doc.body).find('img').each(function (index, obj) {
            if (obj.src == src_url) {
                if (replace_url == null) {
                    obj.remove();
                } else {
                    obj.src = replace_url;
                }
            }
        });
    };

    /*
     * 心跳函数
     */
    exports.CallJS_NoteEcho = function (seq) {
        if (window.external &&  window.external.CallWeiyunClient_EchoFromJS) {
            window.external.CallWeiyunClient_EchoFromJS(seq);
        }
    };

    /*
     * 客户端发起保存缓存的异步调用
     */
    exports.CallJS_SaveCacheFromWeiyun = function (session_id, cache_id) {
        if (session_id != current_session_id) {
            window.external.CallWeiyunClient_SaveCacheFail(cache_id);
            return;
        }
        UpdateWeiyunClientContent(session_id, cache_id); // 更新缓存
    };

    /*
     * 从客户端发过来的save
     */
    exports.CallJS_SaveFromWeiyun = function (session_id, autosave) {
        if (session_id != current_session_id)
            return;
        if(window.external && window.external.CallWeiyunClient_SaveNote){
            UpdateWeiyunClientContent(session_id, undefined);
            window.external.CallWeiyunClient_SaveNote(current_session_id, "", autosave);
        }else{
            //web 逻辑
            OnSaveButtonClick(autosave);
        }
    };
    /*
     *取消图片上传
     */
    exports.CallJS_CancelUploadPic=function(){
        $('#weiyun_note_edit_pic_upload_iframe').remove();
    };
    //获取笔记内容
    exports.CallJS_GetNoteContent=GetNoteContent;
});define.pack("./photo_upload",["lib","common"],function (require, exports, module) {
    var
        lib = require('lib'),
        common = require('common'),
        Module = common.get('./module'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
        security = lib.get('./security'),
        undefined;

    var photo_upload = new Module('photo_upload',{
        _bind_events: function() {
            var _input = $('#note_view_pic_upload_file'),
                me = this;

            _input.on('change', function(e) {
                //todo 此处要过滤类型
                var file = e.target.files[0];
                me.get_pic_msg(file, this.value).done(function(data) {
                    me.pre_upload(data);
                });
            });
            _input.on('click', function() {
                //alert('click');
            });
        },

        upload: function() {

        },

        pre_upload: function(data) {
            var me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/weiyun_note.fcg',
                cmd: 'NotePreUpload',
                use_proxy: false,
                cavil: true,
                pb_v2: true,
                body: data
            }).ok(function(msg, body) {
                mini_tip.error(msg);
            }).fail(function(msg) {
                mini_tip.error(msg);
            });
        },

        get_pic_msg: function(img, path) {
            var pics = {},
                data = {},
                defer = $.Deferred();

            data.files = [img];
            pics.pic_type = 1;
            pics.pic_size = img.size;
            pics.pic_width = 1;
            pics.pic_heigth = 1;

            var reader = new FileReader();
            reader.onload = function(event) {
                var content = event.target.result;
                pics.pic_md5 = security.md5(content);
                data.pics = [pics];
                defer.resolve(data);
            };
            reader.onerror = function(event) {
                console.log('笔记图片上传错误');
                defer.reject(data);
            };
            reader.readAsBinaryString(img);

            return defer;
        }
    });

    return photo_upload;
});define.pack("./tfl-editor-extender",["./EventEmitter","$","./html-to-text"],function(require, exports, module) {
    var EventEmitter = require("./EventEmitter").EventEmitter2;
    var $ = require('$');


    /*
     * 这里添加了保存按钮的处理逻辑
     */
    var AddSaveButton = function() {
        TFL.editor.add('save',function(ui){
            var self = this;
            self.eventMgr.emit('button_save');
        });
    };

    /*
     * 这里覆盖了原来editor的图片按钮逻辑
     */
    var AddImageButton = function() {
        //上传图片
        //TFL.editor.add('uploadimage', function(ui){
        //    var self = this;
        //    self.eventMgr.emit('button_insert');
        //});
    };

    /*
     * 添加checkbox点击事件
     */
    var AddCheckboxButton = function() {
        TFL.editor.add('checkbox', function(ui){
            var self = this;
            self.eventMgr.emit('button_checkbox');
        });
        TFL.editor.lang({'checkbox': '插入复选框'});
    };

    var InstallOnChangeEvent = function(obj) {
        var ON_CHANGE_NOTIFY_TIME = 500;
        var timer = null;
        var bHasPendingNotify = false;
        var ignoreKeys = {
            16:1, 17:1, 18:1,   //shift, ctrl, alt
            37:1, 38:1, 39:1, 40:1  //方向键
        };

        var fireChange = function(obj, e) {
            if (obj.doc.body.innerHTML.length >= obj.options.max_content) {
                if (e && e.keyCode != 8 && e.keyCode != 46) {
                    e.preventDefault();
                }
                obj.eventMgr.emit('onchange', false);
                obj.lastChangeTime = new Date().getTime();
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                return;
            }

            var timeStamp = new Date().getTime();
            if (timeStamp - obj.lastChangeTime > ON_CHANGE_NOTIFY_TIME) {
	            if(e.type === 'paste') {
		            obj.eventMgr.emit('onPaste');
	            }
	            obj.eventMgr.emit('onchange');
                obj.lastChangeTime = timeStamp;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            } else if (timer == null) {
                timer = setTimeout(function(){
	                if(e.type === 'paste') {
		                obj.eventMgr.emit('onPaste');
	                }
                    obj.eventMgr.emit('onchange');
                    obj.lastChangeTime = timeStamp;
                    timer = null;
                }, ON_CHANGE_NOTIFY_TIME);
            }
        };

        $(obj.doc.body).on('change keyup paste', function(e) {
            if (e.type==="keyup") {
                if (!ignoreKeys[e.keyCode] && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    fireChange(obj, e);
                }
            } else if (e.type==="change") {
                fireChange(obj);
            } else if (e.type==="paste") {
	            setTimeout(function() {
		            fireChange(obj, e);
	            }, 0);
            }
        });
    };

    var InstallMaxContentLimit = function(obj) {
        var passthroughKeys = {
            37:1, 38:1, 39:1, 40:1,  //方向键
            46:1, 8: 1 // 删除键
        };
        $(obj.win).bind('keydown', function(e) {
           if (obj.doc.body.innerHTML.length >= obj.options.max_content && obj.isSelectRangeEmpty()) {
               if (!e.ctrlKey && !e.metaKey && !e.altKey && !passthroughKeys[e.keyCode]) {
                   e.preventDefault();
               }
           }
        });
    };

    var InstallOnWindowResize = function(obj) {
        $(obj.win).resize(function(e){
            obj.eventMgr.emit('resize', e);
        });
    };

    var InstallOnSaveShortcut = function(obj) {
        $(obj.win).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        obj.eventMgr.emit('button_save');
                        break;
                }
            }
        });
        $(obj.doc).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        obj.eventMgr.emit('button_save');
                        break;
                }
            }
        });
    };

    var func = function(obj) {
        var lang = {};
        $.extend(TFL.editor.lang, lang);

        // 继续
        var oldAfterCreate = TFL.editor.handler.prototype._afterCreate;
        var oldHtml = TFL.editor.handler.prototype.html;
        $.extend(TFL.editor.handler.prototype,
            {
                oldHtml: oldHtml,
                setHtml: function(html) {
                    // 设置笔记内容的方法, 追加事件通知
                    // event: setHtml
                    // argument: [html]
                    if (typeof html === 'undefined') {
                        html = this.html();
                    }
                    if (this.filter.setHtml != undefined) {
                        this.filter.setHtml.trigger();
                    }
                    if (this.eventMgr) {
                        var data = [html];
                        this.eventMgr.emit('setHtml', data);
                        html = data[0];
                    }
                    this.cmd.setHtml(html);
                    this.lastChangeTime = 0;
                },
                html: function() {
                    // 获取笔记内容的方法, 追加事件通知
                    // event: html
                    // argument: []
                    html = oldHtml.call(this);
                    if (this.eventMgr) {
                        var data = [html];
                        this.eventMgr.emit('html', data);
                        html = data[0];
                    }
                    return html;
                },
                //获取选中html字符串
                isSelectRangeEmpty: function(){
                    var selection = this.win.getSelection();
                    return selection.type == "Caret";
                },
                _afterCreate: function() {
                    // 在现有编辑器中, 追加一个EventMgr
                    this.filter = {};
                    this.eventMgr = new EventEmitter();
                    oldAfterCreate.call(this);

                    InstallOnChangeEvent(this);
                    InstallOnWindowResize(this);
                    InstallOnSaveShortcut(this);
                    InstallMaxContentLimit(this);
                },
                getJsonContent: function() {
                    // 扩展获取笔记内容的方法
                    var self = this;

                    var htmlHelper = require("./html-to-text");
                    var htmlContent = self.html();

                    var textContent = htmlHelper.HtmlToContent(htmlContent);
	                var textNote = htmlHelper.HtmlToText(htmlContent);
                    var texts = textNote.split('\n');
                    var title;
                    var i = 0;
                    for (i = 0; i < texts.length; ++i) {
                        title = texts[i].trim();
                        if (title.length > 0)
                            break;
                    }
                    var summary = "";
                    for (i = i+1; i < texts.length; ++i) {
                        summary += texts[i].trim();
                        if (summary.length > 50) {
                            summary = summary.substr(0, 50);
                            break;
                        }
                    }
                    var pics = [];
                    var $parent = $("<div>");
                    $parent.html(htmlContent).find('img').each(function(index, obj){
                        var src = $(obj).attr('src');
//                        if (pics.indexOf(src) < 0) {   ie8不兼容
//                            pics.push(src);
//                        }
                        var _exist=false;
                        for(var i=0;i<pics.length;i++){
                             if(pics[i] == src){
                                 _exist=true;
                                 break;
                             }
                        }
                        if(!_exist){
                            pics.push(src);
                        }
                    });
                    return {"content": $parent.html(), "text": textContent, "title": title, "summary":summary, "pics":pics};
                },
                _pasteBase64: function(){
                    var self = this, clipboardData, items, item;
                    $(self.win).bind('paste', function(e){
                        //支持clipboardData浏览器
                        if(e && (clipboardData = e.originalEvent.clipboardData)
                             && (items = clipboardData.items) && (item = items[0])) {
                            for (var i in items) {
                                var item = items[i];
                                if( item.kind =='file' && item.type.match(/^image\//i) ) {
                                    var blob = item.getAsFile();
                                    var xhr2_http = {
                                        _xhr: null,
                                        _get: function () {
                                            var me = this;
                                            if (!me._xhr) {
                                                me._xhr = new XMLHttpRequest();
                                            }
                                            return me._xhr;
                                        },
                                        get: function () {
                                            var me = this;
                                            me.abort();
                                            me._get().open('post', 'https://user.weiyun.com/wx/pic_uploader.fcg?appid=30012', true);
                                            return me._xhr;
                                        },
                                        abort: function () {
                                            this._get().abort();
                                        }
                                    };
                                    var xhr = xhr2_http.get(),
                                        formData = new FormData();
                                    formData.append('UploadFile', blob);
                                    xhr.withCredentials=true;
                                    xhr.send(formData);
                                    xhr.onreadystatechange = function () {
                                        var me = this;//xhr对象
                                        if (me.readyState == 4) {
                                            var reg_exp = /\d+/,
                                                ret = me.responseText.match(reg_exp);
                                            if(!ret){
                                                return;
                                            }
                                            ret = ret[0];
                                            if (ret == 0) {
                                                var length=me.responseText.length;
                                                //直接复用了上传图片的CGI
                                                var src_url =  me.responseText.substring(92,length-24);
                                                window.CallJS_WeiYunInsertImage(src_url);
                                            }
                                        }
                                    };
                                    return false;
                                }
                            }


                            return true;
                        }
                    })
                }
            });
        AddSaveButton();
        //AddImageButton();
        AddCheckboxButton();
    };
    return func;
});define.pack("./tfl-extend.checkbox",["$"],function(require, exports, module) {
    var $ = require('$');

    /**
     * 创建一个checkbox
     * @returns {string}
     */
    var CreateCheckboxHtml = function(classname) {
        if (classname == undefined)
            classname = "checkbox_uncheck";
        return '<img class="'+classname+'">';
    };

    var CheckBoxTransform_InputToImage = function(str) {
        // 检查<input type="checkbox">Checkbox的项目, 替换成img
        var checkbox = CreateCheckboxHtml("checkbox_check");
        var uncheckbox = CreateCheckboxHtml("checkbox_uncheck");

        str = str.replace(/<input\s+type=("|')checkbox\1[^<]*?checked[^<]*?>/g, checkbox);
        str = str.replace(/<input\s+type=("|')checkbox\1[^<]*?>/g, uncheckbox);
        return str;
    };
    var CheckBoxTransform_ImageToInput = function(str) {
        var checkbox = '<input type="checkbox" checked="true">';
        var uncheckbox = '<input type="checkbox">';
        var reCheckbox = /<img\s+class=('|")checkbox_check\1[^<]*?>/g;
        var reUncheckBox = /<img\s+class=('|")checkbox_uncheck\1[^<]*?>/g;

        str = str.replace(reCheckbox, checkbox);
        str = str.replace(reUncheckBox, uncheckbox);
        return str;
    };
    var CheckBoxTransform_ReAddOnClick = function(str) {
        var checkbox = CreateCheckboxHtml("checkbox_check");
        var uncheckbox = CreateCheckboxHtml("checkbox_uncheck");
        var reCheckbox = /<img\s+class=('|")checkbox_check\1[^<]*?>/g;
        var reUncheckBox = /<img\s+class=('|")checkbox_uncheck\1[^<]*?>/g;

        str = str.replace(reCheckbox, checkbox);
        str = str.replace(reUncheckBox, uncheckbox);
        return str;
    };

    var OnCheckboxClick = function() {
        var html = '<p>'+CreateCheckboxHtml("checkbox_uncheck")+'&nbsp;</p>';
        this.insertHtml(html);
        this.eventMgr.emit('onchange');
    };
    var OnEditorGetHtml = function(data) {
        data[0] = CheckBoxTransform_ImageToInput(data[0]);
    };
    var OnEditorSetHtml = function(data) {
        data[0] = CheckBoxTransform_InputToImage(data[0]);
    };
    var OnPasteHtml = function(array) {
        var html = array[0];
        array[0] = CheckBoxTransform_ReAddOnClick(html);
    };
    var InstallToEditor = function(editor) {
        editor.eventMgr.on('button_checkbox', OnCheckboxClick.bind(editor));
        editor.eventMgr.on('html', OnEditorGetHtml.bind(editor));
        editor.eventMgr.on('setHtml', OnEditorSetHtml.bind(editor));
        editor.eventMgr.on('onPasteHtml', OnPasteHtml.bind(editor));
        $(editor.doc).click(function(e){
            var target = e.target;
            if (target.tagName == 'IMG' && target.className.indexOf('checkbox_') == 0) {
                if (target.className == 'checkbox_check') {
                    target.className = 'checkbox_uncheck';
                } else {
                    target.className = 'checkbox_check';
                }
                editor.eventMgr.emit('onchange');
            }
        });
    };

    exports.InstallToEditor = InstallToEditor;
});define.pack("./tfl-extend.security_filter",["$"],function(require, exports, module) {
    var $ = require('$');

    //清理内容CACHE，提高速度
    var FILTED_CONTENT_CACHE = {};

    //特殊input标签放行
    var SPECIFIC_INPUT_REGEX = /^input\s+(.*)type=["']checkbox["']/i;

    //可移除标签（包含内容）
    var REMOVEABLE_TAGS_N_CONTENT = /^(style|comment|select|option|script|title|head|button)/i;

    //可移除标签（不包含内容）
    var REMOVEABLE_TAGS = /^(!doctype|html|link|base|body|frame|frameset|iframe|ilayer|layer|meta|textarea|form|area|bgsound|player|applet|xml)/i;

    //内联方法
    var HIGHT_RISK_INLINE_EVENT = /^(onmouseover|onclick|onerror|onload|onmousemove|onmouseout)/i;

    //word class命中
    var WORD_CLASS = /(MsoListParagraph|MsoNormal|msocomoff|MsoCommentReference|MsoCommentText|msocomtxt|blog_details_)/i;

    //class白名单
    var CLASS_WHITELIST = /^(blog_video|blog_music|blog_music_multiple|blog_flash|blog_album|wyimage|checkbox_.*)$/i;

    //ID白名单
    var ID_WHITELIST = /^(musicFlash\w*)$/i;

    //内部ID
    var INNER_ID_LIST = /^(veditor_\w*)$/i;

    //内联样式
    var REMOVEABLE_STYLE_KEY = /^(text-autospace|mso-|layout-grid)/i;
    var REMOVEABLE_STYLE_VAL = /expression/i;

    //忽略过滤属性的标签
    var IGNORE_ATTR_BY_TAG = /^(param|embed|object|video|audio)/i;

    //属性清理
    var REMOVEABLE_ATTR_KEY = /^(lang|eventsListUID)/i;

    //标签判定，该判定不严谨，仅用于标签的内容判定，对于多层嵌套的没有处理
    var TAG_JUDGE = /<([^>\s]+)([^>]*)>([\s\S]*?)<\/\2>(.*)/g;

    //属性切割
    //TODO: 这个切割隔不了 <a title="<img src=Rz!>" contentEditable="false" href="http://user.qzone.qq.com/528968/" target="_blank" uin="528968" unselectable="on">
    var ATTR_SEP_EXP = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g;

    //是否清除行高
    var SW_CLEAR_LINE_HEIGHT = false;

    //是否清理id
    var SW_CLEAR_INNER_ID = true;

    //隐藏标签（待清理）
    var COLL_HIDDEN_TAGS = {};

    //是否保留背景色
    //hardcode
    var KEEP_BGC = window.getParameter ? (window.getParameter('synDataKey') == 't2bContent' || window.getParameter('isUgcBlog')) : false;



    var X = function(t/**,arg1,arg2**/) {
        var a = arguments;
        for ( var i=1; i<a.length; i++ ) {
            var x = a[i];
            for ( var k in x ) {
                if (!t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    };

    /**
     * 去除object里面的key的大小写区分
     * @param {Object} obj
     * @return {Object}
     **/
    var _t = function(obj){
        var tmp = {};
        for(var key in obj){
            var item = obj[key];
            if(typeof(item) == 'object'){
                tmp[key.toUpperCase()] = transToUpperCase(item);
            } else {
                tmp[key.toUpperCase()] = item;
            }
        }
        return tmp;
    };

    var ve = {};

    ve.trimre = /^\s+|\s+$/g;
    ve.fillCharReg = new RegExp('\uFEFF', 'g');
    ve.string = {
        trim: function (str) {
            if (!str) {
                return str;
            }
            return str.replace(ve.trimre, '').replace(ve.fillCharReg, '');
        }
    };

    ve.lang = {
        /**
         * 哈希迭代器
         * @param {Object}   o  哈希对象|数组
         * @param {Function} cb 回调方法
         * @param {[type]}   s  [description]
         * @return {[type]}
         */
        each : function(o, cb, s) {
            var n, l;

            if (!o){
                return 0;
            }

            s = s || o;

            if(typeof(o.length) != 'undefined') {
                for (n=0, l = o.length; n<l; n++) {	// Indexed arrays, needed for Safari
                    if (cb.call(s, o[n], n, o) === false){
                        return 0;
                    }
                }
            } else {
                for(n in o) {	// Hashtables
                    if (o.hasOwnProperty && o.hasOwnProperty(n) && cb.call(s, o[n], n, o) === false) {
                        return 0;
                    }
                }
            }
            return 1;
        }
    };

    ve.dom = {
        remove: function(node, keepChildren){
            var parent = node.parentNode,
                child;
            if (parent) {
                if (keepChildren && node.hasChildNodes()) {
                    while (child = node.firstChild) {
                        parent.insertBefore(child, node);
                    }
                }
                parent.removeChild(node);
            }
            return node;
        }
    };
    /**
     * DTD对象
     * @deprecated 对象中以$符号开始的，表示为额外的判定方法，传入的参数不一定是tagName
     * 例如 ve.dtd.$displayBlock[node.style.display]
     * @return {Boolean}
     */
    ve.dtd = (function(){
        //交叉规则
        var A = _t({isindex:1,fieldset:1}),
            B = _t({input:1,button:1,select:1,textarea:1,label:1}),
            C = X( _t({a:1}), B ),
            D = X( {iframe:1}, C ),
            E = _t({hr:1,ul:1,menu:1,div:1,blockquote:1,noscript:1,table:1,center:1,address:1,dir:1,pre:1,h5:1,dl:1,h4:1,noframes:1,h6:1,ol:1,h1:1,h3:1,h2:1}),
            F = _t({ins:1,del:1,script:1,style:1}),
            G = X( _t({b:1,acronym:1,bdo:1,'var':1,'#':1,abbr:1,code:1,br:1,i:1,cite:1,kbd:1,u:1,strike:1,s:1,tt:1,strong:1,q:1,samp:1,em:1,dfn:1,span:1}), F ),
            H = X( _t({sub:1,img:1,embed:1,object:1,sup:1,basefont:1,map:1,applet:1,font:1,big:1,small:1}), G ),
            I = X( _t({p:1}), H ),
            J = X( _t({iframe:1}), H, B ),
            K = _t({img:1,embed:1,noscript:1,br:1,kbd:1,center:1,button:1,basefont:1,h5:1,h4:1,samp:1,h6:1,ol:1,h1:1,h3:1,h2:1,form:1,font:1,'#':1,select:1,menu:1,ins:1,abbr:1,label:1,code:1,table:1,script:1,cite:1,input:1,iframe:1,strong:1,textarea:1,noframes:1,big:1,small:1,span:1,hr:1,sub:1,bdo:1,'var':1,div:1,object:1,sup:1,strike:1,dir:1,map:1,dl:1,applet:1,del:1,isindex:1,fieldset:1,ul:1,b:1,acronym:1,a:1,blockquote:1,i:1,u:1,s:1,tt:1,address:1,q:1,pre:1,p:1,em:1,dfn:1}),

            L = X( _t({a:0}), J ),
            M = _t({tr:1}),
            N = _t({'#':1}),
            O = X( _t({param:1}), K ),
            P = X( _t({form:1}), A, D, E, I ),
            Q = _t({li:1}),
            R = _t({style:1,script:1}),
            S = _t({base:1,link:1,meta:1,title:1}),
            T = X( S, R ),
            U = _t({head:1,body:1}),
            V = _t({html:1});

        //特殊规则
        var block = _t({address:1,blockquote:1,center:1,dir:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1}),
            empty =  _t({area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1,embed:1,wbr:1});

        return {
            /**
             * 判断节点display是否为块模型
             * @param {String} DOM.style.display
             * @return {Boolean}
             */
            $displayBlock: {
                '-webkit-box':1,'-moz-box':1,'block':1 ,'list-item':1,'table':1 ,'table-row-group':1,
                'table-header-group':1,'table-footer-group':1,'table-row':1,'table-column-group':1,
                'table-column':1, 'table-cell':1 ,'table-caption':1
            },

            /**
             * 判定方法
             * @param {String} DOM.tagName
             * @return {Boolean}
             */
            $nonBodyContent: X( V, U, S ),
            $block : block,
            $inline : L,
            $body : X( _t({script:1,style:1}), block ),
            $cdata : _t({script:1,style:1}),
            $empty : empty,
            $nonChild : _t({iframe:1}),
            $listItem : _t({dd:1,dt:1,li:1}),
            $list: _t({ul:1,ol:1,dl:1}),
            $isNotEmpty : _t({table:1,ul:1,ol:1,dl:1,iframe:1,area:1,base:1,col:1,hr:1,img:1,embed:1,input:1,link:1,meta:1,param:1}),
            $removeEmpty : _t({a:1,abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1}),
            $removeEmptyBlock : _t({'p':1,'div':1}),
            $tableContent : _t({caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1,table:1}),
            $notTransContent : _t({pre:1,script:1,style:1,textarea:1}),

            /**
             * 普通判定
             * @param {String} DOM.tagName
             * @return {Boolean}
             */
            html: U,
            head: T,
            style: N,
            script: N,
            body: P,
            base: {},
            link: {},
            meta: {},
            title: N,
            col : {},
            tr : _t({td:1,th:1}),
            img : {},
            embed: {},
            colgroup : _t({thead:1,col:1,tbody:1,tr:1,tfoot:1}),
            noscript : P,
            td : P,
            br : {},
            th : P,
            center : P,
            kbd : L,
            button : X( I, E ),
            basefont : {},
            h5 : L,
            h4 : L,
            samp : L,
            h6 : L,
            ol : Q,
            h1 : L,
            h3 : L,
            option : N,
            h2 : L,
            form : X( A, D, E, I ),
            select : _t({optgroup:1,option:1}),
            font : L,
            ins : L,
            menu : Q,
            abbr : L,
            label : L,
            table : _t({thead:1,col:1,tbody:1,tr:1,colgroup:1,caption:1,tfoot:1}),
            code : L,
            tfoot : M,
            cite : L,
            li : P,
            input : {},
            iframe : P,
            strong : L,
            textarea : N,
            noframes : P,
            big : L,
            small : L,
            span :_t({'#':1,br:1}),
            hr : L,
            dt : L,
            sub : L,
            optgroup : _t({option:1}),
            param : {},
            bdo : L,
            'var' : L,
            div : P,
            object : O,
            sup : L,
            dd : P,
            strike : L,
            area : {},
            dir : Q,
            map : X( _t({area:1,form:1,p:1}), A, F, E ),
            applet : O,
            dl : _t({dt:1,dd:1}),
            del : L,
            isindex : {},
            fieldset : X( _t({legend:1}), K ),
            thead : M,
            ul : Q,
            acronym : L,
            b : L,
            a : X( _t({a:1}), J ),
            blockquote :X(_t({td:1,tr:1,tbody:1,li:1}),P),
            caption : L,
            i : L,
            u : L,
            tbody : M,
            s : L,
            address : X( D, I ),
            tt : L,
            legend : L,
            q : L,
            pre : X( G, C ),
            p : X(_t({'a':1}),L),
            em :L,
            dfn : L
        };
    })();

    /**
     * 去除属性两边的引号、空白字符
     * @param {String} attr
     * @return {String}
     */
    var trimAttr = function(attr){
        attr = ve.string.trim(attr);
        if(/^["|'](.*)['|"]$/.test(attr)){
            return attr.substring(1, attr.length-1);
        }
        return attr;
    };

    /**
     * 构造attr字串
     * @param {Array} attrs
     * @return {String}
     */
    var buildAttrStr = function(attrs){
        var a = [];
        for(var i in attrs){
            if((i.toLowerCase() != 'class' || i.toLowerCase() != 'style') && !attrs[i]){
                //class、style不允许空串
            }
            else if(attrs[i] === null || attrs[i] === undefined){
                a.push(i);
            } else {
                a.push(i + '="'+attrs[i].replace(/([^\\])"/g, '$1\\"')+'"');
            }
        }
        return (a.length ? ' ' : '')+a.join(' ');
    };

    /**
     * 处理正则规则
     * @param {String} str
     * @param {Array} regItems
     * @param {Function} onMatch
     **/
    var processStrByReg = function(str, regItems, onMatch){
        var _this = this;
        for(var i=0; i<regItems.length; i++){
            var v = regItems[i];
            if (v.constructor == RegExp){
                str = str.replace(v, function(){
                    if(onMatch){
                        return onMatch.apply(_this, arguments);
                    }
                    return '';
                });
            } else {
                str = str.replace(v[0], function(){
                    if(onMatch){
                        var arg = arguments;
                        return onMatch.apply(_this, arg);
                    }
                    return arguments[v[1].substring(1)];
                    //return v[1]; 这里有点问题。 如果返回$1这种格式貌似不生效
                });
            }
        }
        return str;
    };

    /**
     * 正则克隆
     * @param {RegExp} reg
     * @param {String} option
     * @return {RegExp}
     **/
    var regClone = function(reg, option){
        return new RegExp(reg.source, option);
    };

    /**
     * 分隔属性字符串
     * @param {String} str
     * @return {String}
     **/
    var splitStyleStr = function(str){
        str = str.replace(/&amp;/g, '_veditor_sep_');
        var arr = str.split(';');
        var result = [];
        ve.lang.each(arr, function(item){
            result.push(item.replace(/_veditor_sep_/g, '&amp;'));
        });
        return result;
    };

    /**
     * 过滤元素：去除隐藏元素，修正本地图片
     * @param object tags
     * @param {String} str source string
     * @return {String};
     **/
    var filteElement = (function(){
        var _TMP_DIV;
        return function(tags, str){
            if(!_TMP_DIV){
                _TMP_DIV = document.createElement('div');
            }
            _TMP_DIV.innerHTML = str;
            var hit = false;
            ve.lang.each(tags, function(val, tag){
                var nodeList = _TMP_DIV.getElementsByTagName(tag);
                for(var i=nodeList.length-1; i>=0; i--){
                    var n = nodeList[i];
                    if(n && n.parentNode){
                        if(n.className!="wyimage" && (isLocalImg(n) || isSafariTmpImg(n))){
                            n.removeAttribute('src');
                            n.title = '';
                            n.alt = isSafariTmpImg(n) ? '本地图片':'本地图片，请重新上传';
                            hit = true;
                            n.parentNode.removeChild(n);
                        }
                        else if(n.style.display.toLowerCase() == 'none'){
                            ve.dom.remove(n);
                            hit = true;
                        }
                    }
                }
            });
            return hit ? _TMP_DIV.innerHTML : str;
        }
    })();

    var filteElementOld = (function(){
        var _TMP_DIV;
        return function(tags, str){
            if(!_TMP_DIV){
                _TMP_DIV = document.createElement('div');
            }
            _TMP_DIV.innerHTML = str;
            var hit = false;
            ve.lang.each(tags, function(val, tag){
                var nodeList = _TMP_DIV.getElementsByTagName(tag);
                for(var i=nodeList.length-1; i>=0; i--){
                    var n = nodeList[i];
                    if(n && n.parentNode){
                        if(isLocalImg(n) || isSafariTmpImg(n)){
                            n.removeAttribute('src');
                            n.title = '';
                            n.alt = isSafariTmpImg(n) ? '本地图片':'本地图片，请重新上传';
                            hit = true;
                            n.parentNode.removeChild(n);
                        }
                        else if(n.style.display.toLowerCase() == 'none'){
                            ve.dom.remove(n);
                            hit = true;
                        }
                    }
                }
            });
            return hit ? _TMP_DIV.innerHTML : str;
        }
    })();

    /**
     * safari tmp file
     * @param {DOM} node
     * @return {Boolean}
     */
    var isSafariTmpImg = function(node){
        return node && node.tagName == 'IMG' && /^webkit-fake-url\:/i.test(node.src);
    };

    /**
     * 本地图片
     * @param {DOM} node
     * @return {Boolean}
     **/
    var isLocalImg = function(node){
        return node && node.tagName == 'IMG' && /^file\:/i.test(node.src);
    };

    var arg2Arr = function(args, startPos) {
        startPos = startPos || 0;
        return Array.prototype.slice.call(args, startPos);
    };

    var FilterFunctions = {
        /**
         * 清理内容
         * @param {String} source
         * @return {String}
         **/
        cleanString: function(source){
            var _this = this;
            if(FILTED_CONTENT_CACHE[source] !== undefined){
                return FILTED_CONTENT_CACHE[source];
            }

            //去换行、去评论、去ie条件方法、去xml标记
            var str = processStrByReg(source, [
	            ///[\r]/gi, //这两行会导致pre标签里的换行被干掉，所以注释了
	            ///[\n]/gi,
                /<![^>]+>/g,
                /<\??xml[^>]*>/gi,
                /<\/xml>/gi,
                /(\&nbsp;)*$/gi
            ]);

            //清理配对标签
            str = _this.cleanPairTags(str);

            //排除过滤 input
            str = processStrByReg(str, [[/<\s*([^>]*)>/gi]], function(match, p1, offset){
                // input\s+(.*)type=["']((?!checkbox)\w+)["'])
                if (/input/.test(p1) == false) {
                    return match;
                }
                if (SPECIFIC_INPUT_REGEX.test(p1)) {
                    return match;
                }
                return "";
            });

            //单标签过滤
            str = processStrByReg(str, [[/<\/?([\w|\:]+)[^>]*>/gi]], this.cleanTag);

            //属性清理
            str = processStrByReg(str, [[/<(\w+)\s+([^>]+)>/gi]], function(){
                var args = arg2Arr(arguments);
                return _this.onAttrMatch.apply(_this, args);
            });

            FILTED_CONTENT_CACHE[source] = str;
            return str;
        },

        /**
         * 清理标签对
         * @param {String} str
         * @return {String}
         **/
        cleanPairTags: function(str){
            var _this = this;
            str = str.replace(TAG_JUDGE, function(){
                var args = arguments;
                var match = args[0],
                    tag = args[1],
                    attr = args[2],
                    content = args[3],
                    res = args[4];

                if(!ve.dtd[tag.toLowerCase()]){
                    return match;
                }

                if(regClone(TAG_JUDGE, 'g').test(res)){
                    res = _this.cleanPairTags(res);
                }

                if(REMOVEABLE_TAGS_N_CONTENT.test(tag)){
                    //console.log('标签+内容被删除', tag);
                    return res;
                } else {
                    if(regClone(TAG_JUDGE, 'g').test(content)){
                        content = _this.cleanPairTags(content);
                    }
                    return '<'+tag+attr+'>'+content+'</'+tag+'>'+res;
                }
            });

            //移除没有style属性且没有内容的空div
            str = str.replace(/(<div)([^>]*)(><\/div>)/gi, function(match, p1, attr, p2){
                if(!attr || attr.indexOf('style') < 0){
                    //console.log('空div被移除', match);
                    return '<br/>';
                } else {
                    return p1 + attr + p2;
                }
            });
            return str;
        },

        /**
         * 修正office图片标签内容
         * @param {String} match
         * @param {String} props
         * @return {String}
         **/
        convOfficeImg: function(match, props){
            var tmp = /(^|\s)o\:title="([^"]*)"/i.exec(props);
            var title = tmp ? tmp[2] : '';
            var tmp = /(^|\s)src="([^"]*)"/i.exec(props);
            var src = tmp ? tmp[2] : '';
            if(src){
                return '<img src="'+src+'"'+(title ? ' title="'+title+'">' : '>');
            }
            return '';	//match 无法转换的就删除
        },

        /**
         * 清理标签
         * @param {String} match
         * @param {String} tag
         * @return {String}
         **/
        cleanTag: function(match, tag){
            if(REMOVEABLE_TAGS.test(tag)){
                //console.log('指定标签被删除', tag);
                return '';
            }
            if(tag.substring(0, 1) != '$' && !ve.dtd[tag.toLowerCase()] && tag.toLowerCase() != 'marquee'){
                //console.log('非html标签被删除',tag);
                return '';
            }
            return match;
        },

        /**
         * 属性匹配
         * @param {String} match 命中整个字串
         * @param {String} tag 标签
         * @param {String} attrStr 属性字串
         * @return {String}
         **/
        onAttrMatch: function(match, tag, attrStr){
            if(IGNORE_ATTR_BY_TAG.test(tag)){
                //console.log('>>>>>>>属性不过滤', tag);
                return match;
            }

            var arr = (' '+attrStr).match(ATTR_SEP_EXP);
            var keepAttrs = {};

            if(arr && arr.length){
                for(var i=0; i<arr.length; i++){
                    var spos = arr[i].indexOf('=');
                    var key = arr[i].substring(0, spos);
                    var val = trimAttr(arr[i].substring(spos+1)) || '';

                    switch(key.toLowerCase()){
                        case 'id':
                            val = this.onIdFilter(tag, val);
                            break;

                        case 'class':
                            val = this.onClassFilter(tag, val);
                            break;

                        case 'style':
                            val = this.onStyleFilter(tag, val);
                            break;

                        default:
                            val = this.onCustomAttrFilter(tag, key.toLowerCase(), val);
                    }
                    keepAttrs[key] = val;
                }
            }
            var newAttrStr = buildAttrStr(keepAttrs);
            return '<'+tag+newAttrStr+'>';
        },

        /**
         * 自定义属性过滤
         * 需要对额外属性进行过滤的，可以放到这里来做
         * @deprecated 这里居然为了空间的架构，做了表情域名矫正
         * @param {String} tag
         * @param {String} key
         * @param {String} val
         * @return {String}
         **/
        onCustomAttrFilter: function(tag, key, val){
            //直出页表情粘贴矫正!
            if(tag.toLowerCase() == 'img' && key.toLowerCase() == 'src'){
                if(val.toLowerCase().indexOf('http://user.qzone.qq.com/qzone/em/') == 0){
                    return val.replace(/(http:\/\/)([\w\.]+)(\/)/ig, function($0, $1, $2, $3){
                        return $1 + 'i.gtimg.cn'+$3;
                    });
                }
            }

            if(HIGHT_RISK_INLINE_EVENT.test(key) || //内联事件过滤
                REMOVEABLE_ATTR_KEY.test(key)		//额外属性过滤
                ){
                //console.log('自定义属性被删除', key);
                return null;
            }
            return val;
        },

        /**
         * id过滤
         * @param {String} tag 标签
         * @param {String} id
         * @return {Mix}
         **/
        onIdFilter: function(tag, id){
            id = ve.string.trim(id);
            if(INNER_ID_LIST.test(id)){
                return SW_CLEAR_INNER_ID ? null : id;
            }
            if(ID_WHITELIST.test(id)){
                return id;
            }
            return null;
        },

        /**
         * class过滤
         * @param {String} tag 标签
         * @param {String} id
         * @return {Mix}
         **/
        onClassFilter: function(tag, classStr){
            var clsArr = classStr.split(' ');
            var result = [];
            ve.lang.each(clsArr, function(cls){
                if(CLASS_WHITELIST.test(ve.string.trim(cls))){
                    result.push(cls);
                }
            });
            return result.length ? result.join(' ') : null;
        },

        /**
         * 内联样式过滤
         * @param {String} tag 标签
         * @param {String} id
         * @return {Mix}
         **/
        onStyleFilter: function(tag, styleStr){
            if(!ve.string.trim(styleStr)){
                return styleStr;
            }

            var keepStyles = {};
            var a = splitStyleStr(styleStr);

            //构造style字串
            var _buildStyleStr = function(styles){
                var a = [];
                for(var i in styles){
                    if(styles[i]){
                        a.push(i + ':'+styles[i]+'');
                    }
                }
                return a.join(';');
            };

            var addBGTransparent;
            for(var i=0; i<a.length; i++){
                var str = ve.string.trim(a[i]);
                var pos = str.indexOf(':');
                var key = ve.string.trim(str.substring(0, pos));
                var val = ve.string.trim(str.substring(pos+1));

                //fix 引号在ie下面的转义问题
                if(key.toLowerCase().indexOf('background') == 0){
                    val = val.replace(/\"/g, '');
                }

                //只过滤背景色
                if(key.toLowerCase() == 'background' && !KEEP_BGC){
                    if(/url|position|repeat/i.test(val)){
                        addBGTransparent = true;
                    } else {
                        val = null;
                    }
                }

                //过滤none的结构
                if(key.toLowerCase() == 'display' && val.toLowerCase().indexOf('none') >=0){
                    COLL_HIDDEN_TAGS[tag] = true;
                }

                //过滤overflow*:auto, scroll
                if(key.toLowerCase().indexOf('overflow')>=0 && (val.toLowerCase().indexOf('auto') >= 0 || val.toLowerCase().indexOf('scroll') >=0)){
                    val = null;
                }

                else if(REMOVEABLE_STYLE_KEY.test(key)||
                    REMOVEABLE_STYLE_VAL.test(val) ||
                    (SW_CLEAR_LINE_HEIGHT && /^line-height/i.test(key))
                    ){
                    //console.log('删除样式 ',key);
                    val = null;
                }
                keepStyles[key] = val;
            }
            if(addBGTransparent){
                keepStyles['background-color'] = 'transparent';
            }
            return _buildStyleStr(keepStyles);
        }
    };

    var OnEditorFilter = function(data) {
        SW_CLEAR_LINE_HEIGHT = true;
        COLL_HIDDEN_TAGS = {'img':true};
        data[0] = FilterFunctions.cleanString(data[0]);
        SW_CLEAR_LINE_HEIGHT = false;
        data[0] = filteElement(COLL_HIDDEN_TAGS, data[0]);
        COLL_HIDDEN_TAGS = {};
    };

	var OnPasteFilter = function() {
		var doc = this.doc.body;
		//过滤掉粘贴进来的不安全的标签
		doc.innerHTML = FilterFunctions.cleanString(doc.innerHTML);
	};

    var InstallToEditor = function(editor) {
        editor.eventMgr.on('html', OnEditorFilter.bind(editor));
        editor.eventMgr.on('setHtml', OnEditorFilter.bind(editor));
        editor.eventMgr.on('onPasteHtml', OnEditorFilter.bind(editor));
	    editor.eventMgr.on('onPaste', OnPasteFilter.bind(editor));
    };

    exports.InstallToEditor = InstallToEditor;
});define.pack("./tips-expand",["$"],function(require, exports, module) {
    var $ = require('$');

    function getMore(obj) {
        if (obj.attr('data-mlOverflow_more') != undefined) {
            return obj.attr('data-mlOverflow_more');
        }
        else
            return "More";
    }

    function getLess(obj) {
        if (obj.attr('data-mlOverflow_less') != undefined)
            return obj.attr('data-mlOverflow_less');
        else
            return "Less";
    }

    function makeItLess(obj, resize_event_handler) {
        // 实现缩进功能
        obj.children(".mlOverflow_button").remove();
        var offset = 0;
        if (obj.children('.mlOverflow_text').outerHeight(true) > obj.outerHeight(true)) {
            obj.append('<a href="#" class="mlOverflow_button">'+getMore(obj)+'</a>');
            offset = $('.mlOverflow_button').outerHeight(true);
        }
        while ((obj.children('.mlOverflow_text').outerHeight(true) + offset) > obj.outerHeight(true)) {
            obj.children('.mlOverflow_text').text(
                obj.children('.mlOverflow_text').text().replace(/\W*\s(\S)*$/, '...')
            );
        }

        // 按钮展开与收起的绑定处理
        obj.children('.mlOverflow_button').click(function () {
            var holder = $(this).siblings('.mlOverflow_text').text();
            $(this).siblings('.mlOverflow_text').text($(this).siblings('.mlOverflow_text').data('mlOverflow_text'));
            $(this).siblings('.mlOverflow_text').data('mlOverflow_text', holder);
            if ($(this).text() == getMore(obj)) {
                $(this).text(getLess(obj));
                obj.css('max-height', 'none');
                obj.css('height', 'auto');
            }
            else {
                $(this).text(getMore(obj));
                obj.css('max-height', ''+obj.data('mlOverflow_height')+'px');
            }

            if (resize_event_handler) {
                resize_event_handler();
            }
        });
    }

    exports.UpdateTips = function(selector, height, resize_event_handler) {
        // Save the original text and height of each exOverflow div, in case they're expanded
        $(selector).each(function(){
            if ($(this).children('.mlOverflow_text').text().length < 0) {
                $(this).hide();
            }
        });

        $(selector).each(function () {
            $(this).data('mlOverflow_height', height);
            $(this).css('max-height', ''+height+'px');
            $(this).children('.mlOverflow_text').data('mlOverflow_text', $(this).children('.mlOverflow_text').text());
        });

        $(selector).each(function(){
            makeItLess($(this), resize_event_handler);
        });
    };

    exports.ResizeTips = function(selector, resize_event_handler) {
        var holder = $(selector).children('.mlOverflow_text').data('mlOverflow_text');
        if ($(selector).children(".mlOverflow_button").text() == getMore($(selector))) {
            $(selector).children('.mlOverflow_text').text(holder);
            makeItLess($(selector), resize_event_handler);
        }
    }
});