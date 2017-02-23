/**
 * 异步请求
 * @author jameszuo
 * @date 13-3-8
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        $ = require('$'),
        url_parser = lib.get('./url_parser'),
        cookie = lib('./cookie'),

        ret_msgs = require('./ret_msgs'),
        urls = require('./urls'),
        cgi_ret_report = require('./cgi_ret_report'),
        session_event = require('./global.global_event').namespace('session_event'),
        https_tool = require('./util.https_tool'),
        constants = require('./constants'),

        pb_cmds = require('./pb_cmds'),
        user_log,

        root = window,

    // ---------------------------------------------------------

    // 请求可能出现的错误类型
        error_status = {
            error: '网络错误, 请稍后再试',
            timeout: '连接服务器超时, 请稍后再试',
            parsererror: '服务器出现错误, 请稍后再试'
        },

    // 请求出现错误时, 返回的错误码
        unknown_code = ret_msgs.UNKNOWN_CODE,
        unknown_msg = ret_msgs.UNKNOWN_MSG,

    // ---------------------------------------------------------


        default_headers_v2 = { cmd: '', appid: constants.APPID, version: 2,major_version: 2},

        default_options = {
            url: '',
            cmd: '',
            just_plain_url: false, // 是否只采用URL而不包含data参数（req_header, req_body）
            body: null,
            header: null,
            cavil: false,
            resend: false,
            re_try: 2,   //重试参数, @svenzeng
            re_try_flag: false,     //是否经过了重试
            safe_req: false // 启用安全模式（即不在setTimeout里执行回调，仅 xhr_get|xhr_post 支持）
        },

    // 超时时间
        callback_timeout = 10,

        set_timeout = setTimeout,
        D = Date,

        undefined;

    function proxy_domain(url) {
        return window.location.protocol + '//'+(location.host || location.hostname)+'/proxy/domain/' + url.slice(7);
    }

    var request = {

        /**
         * 发送GET请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {JsonpRequest}
         */
        get: function (options) {
            return this._new_request(JsonpRequest, arguments);
        },

        /**
         * 发送POST请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 会话超时后，是否触发『会话超时』事件，默认false
         *   - {Boolean} [resend] 会话超时重新登录后，是否重新发送该请求，默认false
         * @returns {IframePostRequest}
         */
        post: function (options) {
            return this._new_request(IframePostRequest, arguments);
        },

        /**
         * 发送 XHR 请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {CrossDomainRequest}
         */
        xhr_get: function (options) {
            options.method = 'GET';
            return this._new_request(CrossDomainRequest, arguments);
        },

        /**
         * 发送 XHR 请求（当用户会话超时时，将会返回登录页）
         * @param {Object} options
         *   - {String} cmd 命令字
         *   - {String} [url] CGI URL
         *   - {Object} [body]
         *   - {Object} [header]
         *   - {Boolean} [cavil] 挑剔模式（会话超时后，是否弹出登录框，默认false）
         *   - {Boolean} [resend] 重新登录后，是否重新发送该请求，默认false（仅在挑剔模式下可用）
         *   - {Boolean} [change_local_uin] 是否修改本地初始化时记录的local_uin，默认false
         * @returns {CrossDomainRequest}
         */
        xhr_post: function (options) {
            options.method = 'POST';
            return this._new_request(CrossDomainRequest, arguments);
        },

        _new_request: function (RequestClass, args_) {
            var options;

            if (args_ && typeof args_[0] === 'object') {
                options = args_[0];
            }
            else {
                throw 'request 无效的请求参数';
            }

            return new RequestClass(options);
        }
    };

    var AbstractRequest = function (options) {
        options.ori_url = options.url;
        options.url = https_tool.translate_cgi(options.url);
        if(constants.IS_DEBUG) {
            options.use_proxy = false;
        }
        if(options.use_proxy) {
            options.url = proxy_domain(options.url);
        }
        this._options = $.extend({}, default_options, options, {
            ok_fn: options.ok_fn || [],
            fail_fn: options.fail_fn || [],
            done_fn: options.done_fn || []
        });
    };

    AbstractRequest.prototype = {
        _default_url: null, // 请覆盖

        _def_error_data: {
            rsp_header: {
                retcode: 404,//unknown_code,
                retmsg: '连接服务器超时，请稍后再试'
            },
            rsp_body: {}
        },

        _unknown_error_data: {
            rsp_header: {
                retcode: unknown_code,
                retmsg: error_status[status] || unknown_msg
            },
            rsp_body: {}
        },

        is_abort: false,

        _send: null,  // 请覆盖

        destroy: null,  // 请覆盖

        ok: function (fn) {
            if (this._destroied)
                return;
            this._options.ok_fn.push(fn);
            return this;
        },

        fail: function (fn) {
            if (this._destroied)
                return;
            this._options.fail_fn.push(fn);
            return this;
        },

        done: function (fn) {
            if (this._destroied)
                return;
            this._options.done_fn.push(fn);
            return this;
        },

        _get_data: function () {
            var o = this._options,
                header = $.isFunction(o.header) ? o.header() : o.header,
                body = $.isFunction(o.body) ? o.body() : (o.body || {}),
                req_body = {},
                data;

            header = $.extend({}, default_headers_v2, header, { cmd: pb_cmds.get(o.cmd) });
            req_body['weiyun.'+o.cmd+'MsgReq_body'] = body;
            body = {
                ReqMsg_body: req_body
            };
            body = $.extend({}, body);

            data = {
                req_header: header,
                req_body: body
            };
            return data;
        },

        _get_cgi_url: function (data, params) {
            var me = this,
                o = me._options,
                cmd = data.req_header.cmd,
                cgi_url;

            // 使用自定义的URL
            var special_url = o.url || me._default_url;
            // 在URL中插入
            cgi_url = urls.make_url(special_url, $.extend({
                cmd: pb_cmds.get(cmd),   // 默认会有一个cmd参数，可被自定义URL中的参数覆盖。如 http://qq.com/?a=1&cmd=XXX 会保持不变，而 http://qq.com/?a=1 会变为 http://qq.com/?a=1&cmd=SOMETHING
                wx_tk: get_wx_tk(),
                g_tk: get_g_tk()//g_tk
            }, params));

            return cgi_url;
        },

        _callback: function (data, is_timeout) {
            if (this._destroied)
                return;

            var end_time = new Date().getTime();

            var me = this;

            this._clear_timeout();

            // fix
            if (!data.rsp_body)
                data.rsp_body = {};
            if (!data.rsp_header)
                data.rsp_header = {};

            var
                cmd = me._options.cmd,
                header = data.rsp_header,
                body = data.rsp_body,
                ret = typeof header.retcode === 'number' ? header.retcode : 0,
                msg = header.msg || header.retmsg || ret_msgs.get(ret);

            body = body && body.RspMsg_body && body.RspMsg_body['weiyun.'+me._options.cmd+'MsgRsp_body'] || {};
            if (ret === 0) {

                // ok
                $.each(me._options.ok_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        fn.call(me, msg, body, header, data);
                    }
                });

            } else {

                $.each(me._options.fail_fn, function (i, fn) {
                    if ($.isFunction(fn)) {
                        fn.call(me, msg, ret, body, header, data);
                    }
                });

                // 未登录
                if (ret_msgs.is_sess_timeout(ret)) {
                    session_event.trigger('session_timeout');
                }
            }

            // done
            $.each(me._options.done_fn, function (i, fn) {
                if ($.isFunction(fn)) {
                    fn.call(me, msg, ret, body, header, data);
                }
            });

            me.destroy();

            set_timeout(function () {
                reporter.all(me._options.ori_url, cmd, ret, end_time - me.__start_time, is_timeout);
            }, 0);
        },

        /**
         * 检查是否允许发送请求
         * @returns {boolean}
         * @private
         */
        _before_start: function () {
            return true;
        },

        _is_need_retry: function () {
            return this._options.re_try-- > 0;
        },

        _retry: function () {
            this._options.re_try_flag = true;
            return this._send();
        },

        _timeout: function () {
            if (this._is_need_retry()) {  //fail
                return this._retry();
            }
            var error_data = this.is_abort ? this._def_error_data : this._unknown_error_data;
            this._callback(error_data, true);
            this.destroy(); // 超时后销毁请求，避免出现即提示错误又响应操作的问题
        },

        _start_timeout: function () {
            var me = this;
            me.__timer = set_timeout(function () {

                me._timeout();
            }, callback_timeout * 1000);
        },

        _clear_timeout: function () {
            clearTimeout(this.__timer);
        }
    };

    // ========================================================================================================

    var JsonpRequest = function (options) {
        AbstractRequest.apply(this, arguments);

        this._send();
    };

    $.extend(JsonpRequest.prototype, AbstractRequest.prototype, {

        _default_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',

        _send: function () {
            var me = this,
                o = me._options;

            if (me._before_start && me._before_start() === false) {    //如果before返回false, 阻断后续请求
                return false;
            }

            var data = me._get_data(),
                cgi_url = me._get_cgi_url(data),
                callback_name = me._callback_name = 'get_' + _rand();

            this.__start_time = new D().getTime();

            var jqXHR = me._req = $.ajax({
                url: cgi_url,
                dataType: 'jsonp',
                cache: false,
                jsonpCallback: callback_name,
                data: o.just_plain_url ? undefined : {
                    data: JSON.stringify(data)
                }
            });


            me._start_timeout();

            jqXHR
                .done(function (data) {
                    if (o.adaptDate) {//允许适配数据
                        data = o.adaptDate(data);
                    }
                    set_timeout(function () { // 脱离response中的try块
                        me._callback(data, false);
                    }, 0);
                })
                .fail(function (jqXHR, status) {
                    console.error('request error:', status);
                    me.is_abort = (status == 'abort');
                });
            return jqXHR;
        },

        destroy: function () {
            var me = this;
            me._clear_timeout();
            me._req && me._req.abort();
            me._req = null;
            me._options.ok_fn = [];
            me._options.fail_fn = [];
            me._options.done_fn = [];
        }
    });


    // ========================================================================================================

    var IframePostRequest = function (options) {
        AbstractRequest.apply(this, arguments);

        this._send();
    };

    IframePostRequest._iframe_pool = [];
    IframePostRequest._iframe_pool_limit = 15;
    IframePostRequest._get_$container = function () {
        return this._$div || (this._$div = $('<div data-id="post_iframe_cont" style="display:none;"></div>').appendTo(document.body))
    };

    $.extend(IframePostRequest.prototype, AbstractRequest.prototype, {

        _default_url: 'http://web.cgi.weiyun.com/wy_web_jsonp.fcg',

        _send: function () {
            var me = this;

            if (me._before_start && me._before_start() === false) {    //如果before返回false, 阻断后续请求
                return false;
            }

            var data = me._get_data(),
                callback = me._callback_name = 'post_callback_' + _rand(),
                cgi_url = me._get_cgi_url(data, { callback: callback }),

                $form = this._get_form(data, callback);


            // 全局回调
            root[callback] = function (data) {
                set_timeout(function () { // 脱离response中的try块
                    me._callback(data, false);
                }, 0);
            };

            me._start_timeout();


            this._get_iframe(function ($iframe) {
                me._$iframe = $iframe;

                me.__start_time = new D().getTime();

                $iframe.attr('data-action', cgi_url);
                $form
                    .attr('action', cgi_url)
                    .attr('target', $iframe.attr('name'))
                    .submit();
            });

            return this;
        },

        _get_form: function (data, callback) {
            var $form = this._$form = $('<form style="display:none;" method="POST"></form>').appendTo(IframePostRequest._get_$container());

            if (!this._options.just_plain_url) {

                var str_data = JSON.stringify(data);

                $('<input type="hidden"/>').attr('name', 'data').val(str_data).appendTo($form);
                $('<input type="hidden"/>').attr('name', 'callback').val(callback).appendTo($form);
            }

            return $form;
        },


        _get_iframe: function (_callback) {
            var me = this,
                free_iframes = IframePostRequest._iframe_pool,
            // 先从池中取出空闲的iframe
                $iframe = free_iframes.shift(),

                callback = function ($iframe) {
                    _callback($iframe);
                };

            if ($iframe) { // 空闲iframe
                $iframe.data('released', false); // 标记iframe正在被使用
                callback($iframe);
            }
            else {

                $iframe = $("<iframe src=\"" + constants.HTTP_PROTOCOL + "//www.weiyun.com/set_domain.html\" name=\"" + _rand() + "\" style=\"display:none;\"></iframe>");

                // 请求 set_domain.html 完成后执行回调，回调完成后，再放入池中
                $iframe.one('load', function () {

                    // iframe 业务使用完毕后放入池中
                    $iframe.on('load', function () {
                        me._release_iframe($iframe);
                    });

                    // 回调
                    callback($iframe);
                });

                $iframe.appendTo(IframePostRequest._get_$container());
            }
        },

        _release_iframe: function ($iframe) {
            set_timeout(function () {
                var free_iframes = IframePostRequest._iframe_pool;

                // 如果个数未满足池大小上限，则加入到池中
                if (free_iframes.length < IframePostRequest._iframe_pool_limit) {

                    // abort
                    if ($iframe.data('released') === false) {
                        try {
                            var iframe_win = $iframe[0].contentWindow;
                            if ($.browser.msie) {
                                iframe_win.document.execCommand('Stop');
                            } else {
                                iframe_win.stop();
                            }
                            var script = iframe_win.document.getElementsByTagName('script')[0];
                            if (script) {
                                script.parentNode.removeChild(script);
                            }
                        } catch (e) {
                        }
                        // released
                        $iframe.data('released', true);  // 标记iframe没有被使用
                    }

                    // 不在池中，才push
                    if ($.inArray($iframe, free_iframes) == -1) {
                        free_iframes.push($iframe);
                    }
                }
                // 否则销毁
                else {
                    $iframe.remove();
                }
            }, 0);
        },

        destroy: function () {
            this._clear_timeout();
            if (this._callback_name) {
                window[this._callback_name] = $.noop;
            }
            // iframe 由池控制，不在这里销毁，仅断开引用
            if (this._$iframe) {
                this._release_iframe(this._$iframe);
                this._$iframe = null;
            }
            if (this._$form) {
                this._$form.remove();
                this._$form = null;
            }
            if (this._$div) {
                this._$div.remove();
                this._$div = null;
            }
        }
    });

    // ========================================================================================================

    var CrossDomainRequest = function (options) {
        AbstractRequest.call(this, options);
        if (!options.url) {
            console.error('发送CrossDomainRequest请求请带上url参数');
            return;
        }
        if(options.timeout) {
            callback_timeout = options.timeout;
        }
        this._send();
    };
    CrossDomainRequest._Requests = {};
    $.extend(CrossDomainRequest.prototype, AbstractRequest.prototype, {
        _default_url: 'you_forgot_the_url',
        _re_del_get_prefix: /^\s*try\s*\{\s*\w+\s*\(\s*/,
        _re_del_get_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*$/,
        _re_del_post_prefix: /^.*<script>.*\btry\s*\{\s*parent\.\w+\s*\(\s*/,
        _re_del_post_suffix: /\s*\)\s*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}\s*;?\s*<\/script>.*$/g,

        _send: function () {
            var me = this, o = me._options;

            if (me._before_start && me._before_start() === false) return false;    //如果before返回false, 阻断后续请求

            o.method = o.method ? o.method.toUpperCase() : 'GET';
            var data = me._get_data(),
                url_obj = url_parser.parse(o.url),
                url = url_obj.protocol + '//' + url_obj.host + url_obj.pathname;

            if (o.just_plain_url) {
                url = urls.make_url(url, $.extend({}, url_obj.get_params(), {
                    g_tk: get_g_tk(),
                    wx_tk: get_wx_tk(),
                    callback: 'X_' + o.method,
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'GET') {
                // 添加 cmd 和 g_tk 参数
                url = urls.make_url(url, $.extend({}, url_obj.get_params(), {
                    cmd: pb_cmds.get(o.cmd),
                    g_tk: get_g_tk(),
                    wx_tk: get_wx_tk(),
                    data: JSON.stringify(data),
                    callback: 'X_GET',
                    _: _ts()
                }));
                data = null;
            }
            else if (o.method === 'POST') {
                var params = {
                    cmd: pb_cmds.get(o.cmd),
                    g_tk: get_g_tk(),
                    wx_tk: get_wx_tk(),
                    callback: 'X_POST',
                    _: _ts()
                },
                    sid = url_obj.get_params()['sid'];
                if(sid) {
                    params['sid'] = sid;
                }
                url = urls.make_url(url, params);
                data = urls.make_params($.extend({}, url_obj.get_params(), {
                    data: JSON.stringify(data)
                }));
            }
            else {
                throw '暂不支持' + o.method;
            }

            this.__start_time = new D().getTime();

            if(o.use_proxy) {
                this._send_to_proxy(url, url_obj, data);
            } else {
                this._send_to_iframe(url, url_obj, data);
            }
        },

        _send_to_proxy: function(url, url_obj, data) {
            var me = this;
            me._req = $.ajax({
                type: this._options.method,
                url: url,
                timeout: 10*1000,
                data: data,
                success: function(data, status) {
                    me._ajax_callback(true, 200, data);
                },
                error: function(xhr, errorType, error) {
                    me._ajax_callback(false, xhr.status, '');
                }
            });
        },

        _ajax_callback: function(http_ok, status, text) {
            var me = this,
                o = me._options;
            var rsp_data;
            if (http_ok) {
                if (o.method === 'GET') {
                    text = text.replace(me._re_del_get_prefix, '').replace(me._re_del_get_suffix, '');
                } else if (o.method === 'POST') {
                    text = text.replace(me._re_del_post_prefix, '').replace(me._re_del_post_suffix, '');
                }
                try {
                    rsp_data = $.parseJSON(text);
                } catch (e) {
                    console.error('XHR callback parsing json failed.', e.message);
                }
            }

            // 数据适配数据
            if (o.data_adapter) {
                var headers_map = {};
                $.each(this.getAllResponseHeaders().split('\r\n'), function (i, h) {
                    var kv = h.split(':');
                    headers_map[$.trim(kv[0])] = $.trim(kv[1]);
                });
                rsp_data = o.data_adapter(rsp_data || {}, headers_map);
            }


            if (!rsp_data || $.isEmptyObject(rsp_data)) {
                rsp_data = {
                    rsp_header: {
                        retcode: status ? status : 404,
                        retmsg: me._def_error_data.rsp_header.msg
                    },
                    rsp_body: {}
                };
            }
            // 重试
            var ret = rsp_data.rsp_header.retcode ? rsp_data.rsp_header.retcode : status;
            if (me._is_need_retry() && (!http_ok || ret_msgs.is_need_retry(ret))) {
                return me._retry();
            }

            if (o.safe_req) {
                me._callback(rsp_data || {}, false);
            } else {
                set_timeout(function () { // 脱离response中的try块
                    me._callback(rsp_data || {}, false);
                }, 0);
            }
        },

        _send_to_iframe: function (url, url_obj, data) {
            var me = this,
                o = me._options;

            this._get_request(url_obj, function (Request) {

                var req = me._req = new Request({
                    url: url,
                    data: data,
                    method: o.method,
                    callback: function (http_ok, status, text) {
                        // error
                        if (typeof status === 'string')
                            return console.error(text);

                        // 如果已销毁，则不做任何处理
                        if (me._destroied)
                            return;

                        me._ajax_callback(http_ok, status, text);
                    }
                });
                me._start_timeout();

                me.__start_time = new D().getTime();
                req.send();
            });
        },

        _get_request: function (url_obj, callback) {
            var me = this,
                o = me._options;
            var Request = CrossDomainRequest._Requests[url_obj.host];

            if (Request) {
                callback(Request);
            } else {
                var src = url_obj.protocol + '//' + url_obj.host  + '/cdr_proxy.html';
                $('<iframe data-id="cdr_proxy" src="' + src + '" style="display:none;"></iframe>')
                    .on('load', function () {
                        var iframe = this;
                        setTimeout(function () {
                            var Request;
                            try {
                                Request = CrossDomainRequest._Requests[url_obj.host] = iframe.contentWindow.Request;
                                callback(Request);
                            } catch (e) {
                                console.warn('请求' + src + '未能成功，降级为' + (o.method === 'GET' ? 'JSONP' : 'form data')) + '重新发送';
                                me.destroy();
                                return me._comp_req = (o.method === 'GET' ? request.get(o) : request.post(o));
                            }
                        }, 0);
                    })
                    .appendTo(document.body)
            }
        },

        destroy: function () {
            var me = this;
            me._clear_timeout();
            me._req && me._req.abort();
            me._req = null;
            me._destroied = true;

            // 销毁降级了的请求对象
            if (me._comp_req) {
                me._comp_req.destroy();
            }
        }
    });


    // ========================================================================================================

    // 统计信息上报
    var reporter = {

        /**
         * 上报所有CGI相关统计
         * @param url
         * @param cmd
         * @param ret 返回码
         * @param time 耗时
         * @param is_timeout 是否已超时
         */
        all: function (url, cmd, ret, time, is_timeout) {
            // 返回码上报
            this.ret_report(url, cmd, ret, time);
        },

        ret_report: function (url, cmd, ret, time) {
            cgi_ret_report.report(url, cmd, ret, time);
        }
    };

    var _token = function(token) {
        token = token || '';
        var hash = 5381;
        for (var i = 0, len = token.length; i < len; ++i) {
            hash += (hash << 5) + token.charCodeAt(i);
        }
        return hash & 0x7fffffff;
    }

    /**
     * 获取 g_tk
     * @returns {string}
     */
    var get_g_tk = function () {
        var s_key = cookie.get('skey') || '';
        return  _token(s_key);
    };

    /**
     * 获取 wx_tk (采用g_tk相同算法， 后续有必要再对算法修改)
     * @returns {string}
     */
    var get_wx_tk = function () {
        var wx_ticket = cookie.get('wx_login_ticket') || '';
        return  _token(wx_ticket);
    };

    var _rand = function () {
        return 'R' + (+new Date);
    };

    var _ts = function () {
        return new Date().getTime().toString(32);
    };

    return request;
});