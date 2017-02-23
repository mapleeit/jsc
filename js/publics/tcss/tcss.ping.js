/**
*
* @author (BSF) gionouyang;johnnyzheng;xiangchen
* $Date: 2011-05-04 $
* $Rev: 6 $
*/
(function() {
    //document,location,body对象、空变量，参数对象
    var _d, _l, _b, _n = "-", _params, _curDomain, _curUrl, _domainToSet, _refDomain, _refUrl, _image,_ext,_hurlcn, _tt,_ch=0,_crossDomain=0;_ver = "tcss.3.1.5",_speedTestUrl="//jsqmt.qq.com/cdn_djl.js";
    window.Tcss={};
	//是否是pgv版本
	var _pgvVersion=(typeof(tracert)=="function" && typeof(pgvGetColumn)=="function" && typeof(pgvGetTopic)=="function" && typeof(pgvGetDomainInfo)=="function"  && typeof(pgvGetRefInfo)=="function" );


    //是否调用多次
    if (typeof (_rep) == 'undefined') {
        var _rep = 1;
    }


    function tcss(params) {
        this.url = [];
        this.init(params);
    }

    /**
     * tcss的原型
     * @type {Object}
     */
    tcss.prototype = {
        init: function(params) {
            params ? _params = params : _params = {};
            _d = document;
            if (!(_params.statIframe)) {
                if (window != top) {
                    try {
                        _d = top.document;
                    }
                    catch (e) {
                    }
                }
            }
            //防止在iframe跨域的时候发生问题
			if (typeof (_d) == 'undefined') {
				_d=document;
             }
            _l = _d.location;
            _b = _d.body;
			if(_pgvVersion){
				Tcss.d=_d;
				Tcss.l=_l;
	        }
            //初始化ext
            _ext=[];
            //初始化hurlcn 里面存放实际域名 页面 和实际来源 页面等信息
            _hurlcn=[];

            //初始化tt字段 里面放用户自定义的字段
            _tt=[];

        },
        /**
         * tcss的主函数
         */
        run: function() {
            var bt, et, ext;
            // lufy 用于统计js执行时间 2009.12.23
            bt = new Date().getTime();


            //初始化cookie
            _cookie.init();



            // 构造需要提交的url
            this.url.push(this.getDomainInfo());
            //如果跨域 覆盖接口
            this.coverCookie();
            // 从cookie获取ssid，如果没有则初始化到cookie
            _cookie.setCookie("ssid");

            //保存cookie
            _cookie.save();

            this.url.unshift(window.location.protocol + "//user.weiyun.com/tcss/pingfore/pingd?"); //http://user.weiyun.com/tcss/pingfore/ -> http://pingfore.weiyun.com
            this.url.push(this.getRefInfo(_params));

            //获取用户id - pvid
            try {
                if (navigator.cookieEnabled) {
                    this.url.push("&pvid=" + _cookie.setCookie("pgv_pvid", true));
                }
                else {
                    this.url.push("&pvid=NoCookie");
                }
            }
            catch (e) {
                this.url.push("&pvid=NoCookie");
            }

            //浏览器基础
            this.url.push(this.getMainEnvInfo());
            //扩展环境变量
            this.url.push(this.getExtendEnvInfo());


            Tcss.pgUserType='';
            // 用户类型
            if(_params.pgUserType || _params.reserved2){
                var pgUserType=_params.pgUserType || _params.reserved2;
                pgUserType=escape(pgUserType.substring(0,256))
                Tcss.pgUserType=pgUserType
                _tt.push("pu=" + Tcss.pgUserType);
            }

			//调用pgv主函数

			if(_pgvVersion){
			   pgvGetColumn();
			   pgvGetTopic();
			   this.url.push('&column='+Tcss.column+'&subject='+Tcss.subject);
			   tracert();
	        }

            this.url.push("&vs=" + _ver);





            _cookie.setCookie("ts_uid",true);
            // 用于统计js执行时间 2009.12.23
            et = new Date().getTime();
			//拼接ext字段
			_ext.push("tm="+(et-bt));
            if(_ch){
                _ext.push("ch="+_ch);
            }
            _params.extParam ? ext = _params.extParam + '|' : ext = "";
            this.url.push('&ext=' + escape(ext + _ext.join(';')));
            this.url.push('&hurlcn=' + escape(_hurlcn.join(';')));

            this.url.push("&rand=" + Math.round(Math.random() * 100000));

			// 网站测速
			typeof (_speedMark) == 'undefined' ? this.url.push("&reserved1=-1") : this.url.push("&reserved1=" + (new Date() - _speedMark));


            var su=this.getSud();
            if(su){
                _tt.push("su=" + escape(su.substring(0,256)))
            }
            this.url.push('&tt=' + escape(_tt.join(';')));
            //用户类型tt

			this.sendInfo(this.url.join(''));
            //跨域的时候上报两次
            if(_crossDomain==1){
                //上报域名
                var tcss_rp_dm = this.getParameter("tcss_rp_dm", _d.URL);
                if(tcss_rp_dm !=Tcss.dm){
                      var url=this.url.join('').replace(/\?dm=(.*?)\&/,"?dm="+tcss_rp_dm+"&");
                      this.sendInfo(url);
                }
            }

            //热点分析
            if (_params.hot) {
                if (document.attachEvent) { //ie
                    document.attachEvent("onclick", function(event) {
                        pgvWatchClick(event);
                    });

                }
                else { // firefox, w3c
                    document.addEventListener("click", function(event) {
                        //new tcss().watchClick(event);
                        pgvWatchClick(event);
                    }, false);
                }
            }
            //如果用户允许重复上报，重置_rep这个参数
            if (_params.repeatApplay && _params.repeatApplay == "true") {
                if (typeof (_rep) != 'undefined') {

                    _rep = 1;
                }
            }


        },

        /**
         * 获取用户自定义session信息
         * @return {*}
         */
        getSud:function(){
            if(_params.sessionUserType){
                return  _params.sessionUserType
            }
            var sudParamName = _params.sudParamName || "sessionUserType";
            var sud = this.getParameter(sudParamName, _d.URL);
            return sud;
        },

        /**
         * 如果跨域覆盖当前cookie
         */
        coverCookie:function(){
            if(_params.crossDomain && _params.crossDomain=="on"){
                var pgv_pvid = this.getParameter("tcss_uid", _d.URL);
                var sid = this.getParameter("tcss_sid", _d.URL);
                var ts_refer = this.getParameter("tcss_refer", _d.URL);
                var ts_last = this.getParameter("tcss_last", _d.URL);
                // 从cookie获取ssid，如果没有则初始化到cookie
                if(sid && pgv_pvid){
                _crossDomain=1;
                _cookie.setCookie("ssid",false,sid);
                //保存cookie
                _cookie.save();
                _cookie.setCookie("ts_refer",true,ts_refer);
                _cookie.setCookie("ts_last",true,ts_last);
                _cookie.setCookie("pgv_pvid", true,pgv_pvid);
                }
            }
        },


        /**
         * 获取域名相关信息，包括域名，url，如果设置了hot参数，则在域名中加上.hot后缀
         * 使用location.hostname代替location.host 规避端口的风险:上报不成功和不能种cookie
         * @param hot
         * @return {String}
         */
        getDomainInfo: function(hot) {
            var dm, url;

            // 根据当前url获取域名，如果设置了虚拟域名，则取虚拟域名
            dm =  _l.hostname.toLowerCase();
            if(_params.virtualDomain){
                //如设置了虚拟域名,则保持真实域名
                _hurlcn.push("ad="+dm);
                dm=_params.virtualDomain;

            }

			// get url
            url = this.getCurrentUrl();


            Tcss.dm=dm;
			if(_pgvVersion){
			  pgvGetDomainInfo();
	        }
			_curDomain=Tcss.dm;


            //设置cookie域名
            if (!_domainToSet){
                _domainToSet = this.getCookieSetDomain(_l.hostname.toLowerCase());
				if(_pgvVersion){
				   Tcss.domainToSet=_domainToSet;
				}
			}

            if (hot) {
                    Tcss.dm += ".hot";
            }

            return ("dm=" + Tcss.dm + "&url=" + Tcss.url );
        },


        /**
         *   获取当前url，如果设置了虚拟url，则返回虚拟url，去掉参数，保留SenseParam
         */
        getCurrentUrl: function() {
            var url = "",arg = _n;
            url = _curUrl = escape(_l.pathname);
            //或得页面url中的参数 added by johnnyzheng
            if (_l.search != "") {
                arg = escape(_l.search.substr(1));
            }
            // sense param
            if (_params.senseParam) {
                var value = this.getParameter(_params.senseParam, _d.URL);
                if (value) {
                    url += "_" + value;
                }
            }

            if (_params.virtualURL) {
                //如设置了虚拟页面,则保持真实页面
                _hurlcn.push("au="+url);
                url = _params.virtualURL;
            }
			Tcss.url=url;
			Tcss.arg=arg;
        },

        /**
         * 获取来源信息
         * @param params
         * @return {String}
         */
        getRefInfo: function(params) {
            var refdm = _n, refurl = _n, refarg = _n, refStr = _d.referrer, tagParamName, adtag, pos;

            tagParamName = params.tagParamName || "ADTAG";
            adtag = this.getParameter(tagParamName, _d.URL);

            pos = refStr.indexOf("://");
            if (pos > -1) {
                //如果加上/g参数，那么只返回$0匹配。也就是说arr.length = 0
                //$1-$4  协议，域名，端口号，还有最重要的路径path！
                //$5-$7  文件名，锚点(#top)，query参数(?id=55)
                var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;
                var arr = refStr.match(re);
                if (arr) {
                    refdm = arr[2];
                    refurl = arr[4] + (arr[5] ? arr[5] : "");
                }
            }

            //得到来源rurl中的参数
            if (refStr.indexOf("?") != -1) {
                var pos = refStr.indexOf("?") + 1;
                refarg = refStr.substr(pos);
            }

            //保存真实的域名来源
            var tempRefdm=refdm;

            if(_params.virtualRefDomain){
                //如设置虚拟来源域名 则上报真实来源
                if(refdm!=_n){
                  _hurlcn.push("ard="+refdm);
                }
                refdm=_params.virtualRefDomain;
            }

            if(_params.virtualRefURL){
                //如设置虚拟来源url 则上报真实来源
                if(refurl!=_n){
                 _hurlcn.push("aru="+escape(refurl));
                }
                refurl=_params.virtualRefURL;
            }

			var or;
            if (adtag) {
				or = refdm + refurl;
                refdm = "ADTAG";
                refurl = adtag;
            }

            _refDomain = refdm;
            _refUrl = escape(refurl);
            //补齐url中的来源参数


			//当来源获取不到,或者为adtag or为空 上报ts_last；
			if(_refDomain==_n||(_refDomain=="ADTAG"&&tempRefdm==_n)){
				var url=_cookie.get("ts_last=",true);
				//读取到ts_last信息就进行上报
				if(url!=_n){
			      _ext.push("ls="+url);
				}
			}
			//当前的url截断为128位编码 种植到cookie当中
			_cookie.setCookie("ts_last",true,escape((_l.hostname+_l.pathname).substring(0,128)));

            //始终上报ts_refer
            var ts_refer=_cookie.get("ts_refer=",true);
            if(ts_refer!=_n){
                _ext.push("rf="+ts_refer);
            }

            //提供内部域名的接口
            var innerDomain=_l.hostname;
			if(_params.inner){
               innerDomain=","+innerDomain+","+_params.inner+",";
            }
			//当来源获取不到的时候时并且不为本域名的时候
			if(!(_refDomain==_n ||  (","+innerDomain+",").indexOf(_refDomain)>-1 || _crossDomain==1 )){

				//获得cookie中的来源
				var curRef=escape((_refDomain+refurl).substring(0,128));
				//如果当前来源不同 重新种植ssid
				if(curRef!=ts_refer){
					//此时上报ch=2
                    _ch=2;
				}
				_cookie.setCookie("ts_refer",true,curRef);
			}


			Tcss.rdm=_refDomain;
			Tcss.rurl=_refUrl;
			Tcss.rarg=escape(refarg);
			if(_pgvVersion){
			  pgvGetRefInfo();
	        }

			if(or)
			{
				return ("&rdm=" + Tcss.rdm + "&rurl=" + Tcss.rurl + "&rarg=" + Tcss.rarg + "&or=" + or);
			}
			else
			{
				return ("&rdm=" + Tcss.rdm + "&rurl=" + Tcss.rurl + "&rarg=" + Tcss.rarg);
			}
        },

        /**
         * 获取客户端基础环境变量数据
         * 2012-12-22 去掉cpu的上报字段
         * @return {String}
         */
        getMainEnvInfo: function() {
            var ret = "";
            try {
                var scr = _n, scl = _n, lang = _n, pf = _n, tz = _n, java = 0, n = navigator;
                if (self.screen) {
                    scr = screen.width + "x" + screen.height;
                    scl = screen.colorDepth + "-bit";
                }
                if (n.language) {
                    lang = n.language.toLowerCase();
                }
                else
                    if (n.browserLanguage) {
                    lang = n.browserLanguage.toLowerCase();
                }
                java = n.javaEnabled() ? 1 : 0;
                pf = n.platform;
                tz = new Date().getTimezoneOffset() / 60;
                ret = "&scr=" + scr + "&scl=" + scl + "&lang=" + lang + "&java=" + java  + "&pf=" + pf + "&tz=" + tz;
            }
            catch (e) {
            }
            finally {
                return ret;
            }
        },

        /**
         * 获取扩展环境变量，如是否支持flash，是否首页，网络连接方式等
         * @return {String}
         */
        getExtendEnvInfo: function() {
            var ret = "";
            try {
                var flash, currentUrl = _l.href, connectType = _n;
                ret += "&flash=" + this.getFlashInfo();
                if (_b.addBehavior) {
                    _b.addBehavior("#default#homePage");
                    if (_b.isHomePage(currentUrl))
                        ret += "&hp=Y";
                }

                if (_b.addBehavior) {
                    _b.addBehavior("#default#clientCaps");
                    connectType = _b.connectionType;
                }
                ret += "&ct=" + connectType;
            }
            catch (e) {
            }
            finally {
                return ret;
            }
        },

        /**
         * 校验是否支持flash
         * @return {String}
         */
        getFlashInfo: function() {
            var f = _n, n = navigator;
            try {
                if (n.plugins && n.plugins.length) {
                    for (var i = 0; i < n.plugins.length; i++) {
                        if (n.plugins[i].name.indexOf('Shockwave Flash') > -1) {
                            f = n.plugins[i].description.split('Shockwave Flash ')[1];
                            break;
                        }
                    }
                }
                else
                    if (window.ActiveXObject) {
                    for (var i = 12; i >= 5; i--) {
                        try {
                            var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + i + "');");
                            if (fl) {
                                f = i + '.0';
                                break;
                            }
                        }
                        catch (e) {
                        }
                    }
                }
            }
            catch (e) {
            }
            return f;
        },

        /**
         * 根据参数名称获取url中的参数值
         * @param name
         * @param src
         * @return
         */
        getParameter: function(name, src) {
            if (name && src) {
                var r = new RegExp("(\\?|#|&)" + name + "=([^&^#]*)(#|&|$)");
                var m = src.match(r);
                return m ? m[2] : "";
            }
            return "";
        },

        /**
         * 获取域名的主域
         * @param domain
         * @return {String}
         */
        getCookieSetDomain: function(domain) {
            var dotlen, pos, domainToSet, dot = [], j = 0;
            //获取小数点个数
            for (var i = 0; i < domain.length; i++) {
                if (domain.charAt(i) == '.') {
                    dot[j] = i;
                    j++;
                }
            }
            dotlen = dot.length;
            pos = domain.indexOf(".cn");
            if (pos > -1) {
                dotlen--;
            }
            domainToSet = "qq.com";
            if (dotlen == 1) {
                domainToSet = domain;
            }
            else
                if (dotlen > 1) {
                domainToSet = domain.substring(dot[dotlen - 2] + 1);
            }
            return domainToSet;
        },
        /**
         * 供页面直接调用的热点统计
         * @param e
         */
        watchClick: function(e) {
            try {
                var istag = true, hottag = "", srcElement;
                // srcElement = window.event.srcElement || e.target;
                srcElement = window.event ? window.event.srcElement : e.target;
                switch (srcElement.tagName) {
                    case "A":
                        hottag = "<A href=" + srcElement.href + ">" + srcElement.innerHTML + "</a>";
                        break;
                    case "IMG":
                        hottag = "<IMG src=" + srcElement.src + ">";
                        break;
                    case "INPUT":
                        hottag = "<INPUT type=" + srcElement.type + " value=" + srcElement.value + ">";
                        break;
                    case "BUTTON":
                        hottag = "<BUTTON>" + srcElement.innerText + "</BUTTON>";
                        break;
                    case "SELECT":
                        hottag = "SELECT";
                        break;
                    default:
                        istag = false;
                        break;
                }
                if (istag) {
                    var t = new tcss(_params);
                    var pos = t.getElementPos(srcElement);
                    if (_params.coordinateId) {
                        var coordinatePos = t.getElementPos(document.getElementById(_params.coordinateId));
                        pos.x -= coordinatePos.x;
                    }

                    t.url.push(t.getDomainInfo(true));
                    t.url.push("&hottag=" + escape(hottag));
                    t.url.push("&hotx=" + pos.x);
                    t.url.push("&hoty=" + pos.y);
                    t.url.push("&rand=" + Math.round(Math.random() * 100000));
                    t.url.unshift(window.location.protocol + "//user.weiyun.com/tcss/pinghot/pingd?");//http://user.weiyun.com/tcss/pinghot/ -> http://pinghot.weiyun.com

                    t.sendInfo(t.url.join(''));

                }
            }
            catch (ex) {
            }
        },

        /**
         *  获取元素的坐标值
         * @param el
         * @return {*}
         */
        getElementPos: function(el) {
            if (el.parentNode === null || el.style.display == 'none') {
                return false;
            }

            var ua = navigator.userAgent.toLowerCase(), parent = null, pos = [], box;

            //IE & TT
            if (el.getBoundingClientRect) {
                var scrollTop, scrollLeft, clientTop, clientLeft;
                box = el.getBoundingClientRect();
                scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                // 减去clientLeft和clientTop，屏蔽IE和TT的差异
                clientTop = document.body.clientTop;
                clientLeft = document.body.clientLeft;

                return {
                    x: box.left + scrollLeft - clientLeft,
                    y: box.top + scrollTop - clientTop
                };
            }
            // gecko & firefox
            else
                if (document.getBoxObjectFor) {
                box = document.getBoxObjectFor(el);

                var borderLeft = (el.style.borderLeftWidth) ? Math.floor(el.style.borderLeftWidth) : 0;
                var borderTop = (el.style.borderTopWidth) ? Math.floor(el.style.borderTopWidth) : 0;

                pos = [box.x - borderLeft, box.y - borderTop];
            }
            // safari & opera
            else {
                pos = [el.offsetLeft, el.offsetTop];
                parent = el.offsetParent;
                if (parent != el) {
                    while (parent) {
                        pos[0] += parent.offsetLeft;
                        pos[1] += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                }
                if (ua.indexOf('opera') > -1 ||
                    (ua.indexOf('safari') > -1 && el.style.position == 'absolute')) {
                    pos[0] -= document.body.offsetLeft;
                    pos[1] -= document.body.offsetTop;
                }
            }

            if (el.parentNode) {
                parent = el.parentNode;
            }
            else {
                parent = null;
            }

            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                // account for any scrolled ancestors
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;

                if (parent.parentNode) {
                    parent = parent.parentNode;
                }
                else {
                    parent = null;
                }
            }
            return {
                x: pos[0],
                y: pos[1]
            };
        },

        /**
         * 供页面直接调用的指定按钮统计
         */
        sendClick: function() {
            if (_params.hottag) {
                this.url.push(this.getDomainInfo(true));
				//this.url.push(this.getRefInfo({}));
                this.url.push("&hottag=" + escape(_params.hottag));
                this.url.push("&hotx=9999&hoty=9999");
                this.url.push("&rand=" + Math.round(Math.random() * 100000));
                this.url.unshift(window.location.protocol + "//user.weiyun.com/tcss/pinghot/pingd?"); //http://user.weiyun.com/tcss/pinghot/ -> http://pinghot.weiyun.com
                this.sendInfo(this.url.join(''));
            }
        },

        pgvGetArgs : function(){
             this.getDomainInfo();
             var returnArgs=[];
             returnArgs.push("tcss_rp_dm="+Tcss.dm);
             returnArgs.push("tcss_uid="+_cookie.get("pgv_pvid=", true));
             returnArgs.push("tcss_sid="+_cookie.get("ssid=", true));
             returnArgs.push("tcss_refer="+_cookie.get("ts_refer=", true));
             returnArgs.push("tcss_last="+_cookie.get("ts_last=", true));
             return returnArgs.join('&');
        },

        /**
         *提交数据到服务器
         * @param url
         */
        sendInfo: function(url) {
			 _image = new Image(1, 1);
			 Tcss.img=_image;
			 _image.onload = _image.onerror = _image.onabort = function() {
				_image.onload = _image.onerror = _image.onabort = null;
				//_image=null;
				Tcss.img=null;
			};
			_image.src=url;

        }
    }


    /**
     * cookie的帮助函数
     * @type {Object}
     * @private
     */
    var _cookie = {
        sck: [], //cookie key
        sco: {}, //cookie object
        init: function() {
            var value = this.get("pgv_info=", true);
            if (value != _n) {
                var arr = value.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var arr2 = arr[i].split('=');
                    this.set(arr2[0], unescape(arr2[1]));
                }
            }
        },
        /**
         *  根据cookie名称获取cookie值
         * @param name
         * @param isend
         * @return {String}
         */
        get: function(name, isend) {
            var cookies = isend ? _d.cookie : this.get("pgv_info=", true);
            var value = _n;
            var offset, end;
            //   寻找是否有此Cookie名称
            offset = cookies.indexOf(name);
            if (offset > -1) {
                offset += name.length;
                //   取得值的结尾位置
                end = cookies.indexOf(";", offset);
                if (end == -1)
                    end = cookies.length; //   最後一个Cookie
                if (!isend) {
                    var end2 = cookies.indexOf("&", offset);
                    if (end2 > -1) {
                        end = Math.min(end, end2);
                    }
                }
                value = cookies.substring(offset, end); // 取得Cookie值
            }
            return value;
        },
        /**
         * 设置数组值对
         * @param key
         * @param value
         */
        set: function(key, value) {
            this.sco[key] = value;
            var isExist = false;
            var sckLen = this.sck.length;
            for (var i = 0; i < sckLen; i++) {
                if (key == this.sck[i]) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                this.sck.push(key);
            }
        },
        /**
         * 设置cookie
         * @param name
         * @param isend 是否永久性cookie
         * @param value
         * @return cookie的值
         */
        setCookie: function(name, isend, value) {
			//当前域名
			var domain=_l.hostname;
            var id = _cookie.get(name + "=", isend);
			//没有取到当前的cookie值
            if (id == _n && !value) {
				switch(name){
					//当获取不到ts_uid的时候 new=1
					case "ts_uid":
						_ext.push("nw=1");
						break;
					//当获取不到ssid的时候 ch=1
                    //或者强制更新ch=2
					case "ssid":
                           _ch=1;
                        break;
				}


                isend ? id = "" : id = "s";
                var curMs = new Date().getUTCMilliseconds();
                id += (Math.round(Math.abs(Math.random() - 1) * 2147483647) * curMs) % 10000000000;
            }
            else {//如果value有值，就取value的值 added by johnnyzheng
                id = value ? value : id;
            }
            if (isend){
				//add 10.1
				switch(name){
					case "ts_uid":
						//uid种植两年时间
						this.saveCookie(name + "=" + id,domain, this.getExpires(2*365*24*60));
						break;

						//来源种植6个月
					case "ts_refer":
						this.saveCookie(name + "=" + id,domain, this.getExpires(6*30*24*60));
						break;
						//ts_last种植30分钟
					case "ts_last":
						this.saveCookie(name + "=" + id,domain, this.getExpires(30));
						break;
					default:
						 // 存储pvid到cookie
                       this.saveCookie(name + "=" + id,_domainToSet, "expires=Sun, 18 Jan 2038 00:00:00 GMT;");

				}

			}else{
				 this.set(name, id);
			}

            return id;
        },

        /**
         * 获取过期的字符串
         * @param minitus
         * @return {String}
         */
		getExpires: function(minitus) {
		    var expires = new Date();
		    expires.setTime(expires.getTime() + (minitus * 60 * 1000));
			return "expires=" + expires.toGMTString();
		},


        /**
         * 写入数组对值对象到Cookie
         */
        save: function() {
            // timespan单位是分
            if (_params.sessionSpan) {
                var expires = new Date();
                expires.setTime(expires.getTime() + (_params.sessionSpan * 60 * 1000));
            }

            var cookies = "";
            var sckLen = this.sck.length;
            for (var i = 0; i < sckLen; i++) {
                cookies += this.sck[i] + "=" + this.sco[this.sck[i]] + "&";
            }
            cookies = "pgv_info=" + cookies.substr(0, cookies.length - 1);
            var expire = "";
            if (expires)
                expire = "expires=" + expires.toGMTString();

            this.saveCookie(cookies, _domainToSet,expire);
        },

        /**
         * 保持cookie
         * @param cookie
         * @param domain
         * @param expires
         */
        saveCookie: function(cookie,domain, expires) {
            _d.cookie = cookie + ";path=/;domain=" + domain + ";" + expires;
        }

    }


    /**
     *  ping.js入口, pgvMain对象
     * @param param1
     * @param param2
     */
    window.pgvMain = function(param1, param2) {
        var params = "";
        if (param2) {
            params = param2;
            _ver = "tcsso.3.1.5"
        }
        else {
            params = param1;
            _ver = "tcss.3.1.5";
        }
        try {
            //支持pgv的重复上报
            if(_pgvVersion){
                if(typeof (pvRepeatCount)!="undefined" && pvRepeatCount==1){
                    _rep=1;
                    pvRepeatCount=2;
                }else{
                    //置不上报参数
                    _rep=2;
                }
            }
            if (_rep == 1) {
                //防止重复提交的办法
                _rep = 2;
            }
            else {
                return;

            }
            new tcss(params).run();
        }
        catch (e) {

        }
    };


    /**
     * pgvSendClick入口 指定按钮热点
     * @param params
     */
    window.pgvSendClick = function(params) {
        new tcss(params).sendClick();
    };

    /**
     * pgvWatchClick入口 页面连接热点
     * @param params
     */
    window.pgvWatchClick = function(params) {
        new tcss(params).watchClick(params);
    };
    /**
     * 获取跨域的参数
     * @param params
     */
    window.pgvGetArgs=function(params){
       return new tcss(params).pgvGetArgs();
    }

    //异步加载js
    function loadScript(src){
        var node=document.createElement('script'),script=document.getElementsByTagName('script')[0];
        node.src=src;
        node.type='text/javascript';
        node.async = true;
        /*
         node.onload=node.onerror=node.onreadystatechange=function(){
         /loaded|complete|undefined/.test(node.readyState)&&function(){
         node.onload=node.onerror=node.onreadystatechange=null;
         node.parentNode.removeChild(node);
         node=undefined;
         }();
         };
         */
        script.parentNode.insertBefore(node,script);
    }

    //异步加载架构平台部的测速的js
    //loadScript(_speedTestUrl);
})();
