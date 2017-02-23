define(function(require, exports, module) {
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
});