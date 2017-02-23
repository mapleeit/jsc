/**
 * weiyun手机端webview和web通信工具
 * @author hibincheng
 * @example: 微信支付
 *   weiyun_bridge.set_scheme('weiyunapi://pay.weiyun.com');
 *   weiyun_bridge.send('pay', {service_id: 1, service_name: 'pay_test'}, function(data) {
 *		if(data.success) {
 *	       console.log('pay success');
 *		}
 *	 });
 */
(function() {

    var win = window,
        doc = document,
        encode = encodeURIComponent,
        bridge_scheme = 'weiyun://bridge.weiyun.com',
        bridge_iframe,
        callback_pool = {},
        handler_pool = {},
        weiyun_version; //weiyun终端版本号

    function create_bridge() {
        bridge_iframe = doc.createElement('iframe');
        bridge_iframe.style.display = 'none';
        doc.body.appendChild(bridge_iframe);
    }

    function serialize_data(json) {
        var arr = [];
        for(var key in json) {
            var type = Object.prototype.toString.call(json[key]),
                value = json[key];
            if(type === '[object Array]' || type === '[object Object]') {
                value = JSON.stringify(value);
            }
            arr.push( encode(key) + '=' + encode(value) );
        }
        return arr.join('&');
    }

    function set_scheme(scheme) {
        bridge_scheme = scheme;
    }

    //发送消息给native
    function send(cmd, data, callback) {
        var callback_name = '_call_back_' + (+new Date);

        if(typeof callback === 'function') {
            data.callback_type = 'jsfunction';
        } else {
            data.callback_type = 'url';
        }

        if(!data.callback_value) {
            callback_pool[callback_name] = callback;
            data.callback_value = callback_name;
        }

        if(!bridge_iframe) {
            create_bridge();
        }
        bridge_iframe.src = bridge_scheme + '/' + cmd + '?' + serialize_data(data);
    }

    //注册js函数，给native调用
    function register(name, func) {
        handler_pool[name] = func;
    }

    //调用native方法，实际和send一致
    function invoke(name, data, callback) {
        send(name, data, callback);
    }

    //处理native的调用
    function receive_from_native(data) {
        var data = typeof data === 'string' ? JSON.parse(data) : data;
        var fun_id;
        if(data.callback_id) {
            fun_id = data.callback_id;
            delete data.callback_id;
            callback_pool[fun_id] && callback_pool[fun_id](data);
            delete callback_pool[fun_id];
        } else if(data.handler_id) {
            fun_id = data.callback_id;
            delete data.callback_id;
            handler_pool[fun_id] && handler_pool[fun_id](data);
        }

    }

    function get_weiyun_version() {
        if(weiyun_version) {
            return weiyun_version;
        }
        var match_result = win.navigator.userAgent.toLowerCase().match(/.+weiyun\/(.+)\s?.*/);
        weiyun_version = match_result && match_result[1];
        return weiyun_version;
    }

    //bridge api
    var bridge = {
        set_scheme: set_scheme,
        send: send,
        register: register,
        invoke: invoke,
        get_weiyun_version: get_weiyun_version
    }

    //global
    win.onWebApiResult = receive_from_native;
    win.weiyun_bridge = bridge;

})(window, document);