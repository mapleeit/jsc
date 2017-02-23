/**
 * 通过与安卓客户端的通信来获取某些信息。目前实现的主要接口是拿到客户端的版本号，后续可能还会再增加。
 * @author xixinhuang
 * @date 16-07-19
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        Module  = lib.get('./Module'),
        $ = require('$'),
        undefined;

    var default_url = 'weiyunserver://action/start_local_server',
        default_ports = [9091, 5656, 7374];

    var android_serv = new Module('android_serv', {
        /*
         * 启动客户端的server，这里使用schema，但不呼起客户端
         * */
        version_name: null,
        version_code: null,
        req_count: 0,

        start_server: function() {
            var me = this;

            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = '<iframe id="schema" src="' + default_url + '" scrolling="no" width="0" height="0"></iframe>';
            document.body.appendChild(div);

            //WebSocket方案暂时有问题，这里用http请求代替
            //var android_conn = new WebSocket('ws://' + schema_url);
            //android_conn.onmessage = function(event) {
            //    alert('message:' + event.data);
            //}
            //android_conn.onopen = function(event) {
            //    alert('open' + JSON.stringify(event));
            //    android_conn.send({'method': 'get_version'});
            //}
            //android_conn.onclose = function(event) {
            //    alert('onclose' + JSON.stringify(event))
            //}
            //android_conn.onerror = function(event) {
            //    alert('onerror' + JSON.stringify(event));
            //    android_conn.close();
            //}
            setTimeout(function () {
                document.body.removeChild(div);
                me.conn_server();
            }, 300);
        },

        conn_server: function() {
            if(this.req_count && !default_ports[this.req_count]) {
                return;
            }
            var me = this,
                url = 'http://localhost:' + default_ports[this.req_count] + '/?method=get_version';
                //url = 'http://localhost:' + default_ports[this.req_count] + '/?method=get_version';

            this.get_version(url).done(function(rspData) {
                if(rspData.error_code === 0) {
                    me.set_version(rspData);
                } else {
                    me.req_count++;
                    me.conn_server();
                }
            });
        },

        get_version: function(url) {
            var defer		= $.Deferred();
            $.ajax({
                type: 'GET',
                url: url,
                data: {},
                timeout: 3000,
                success: function(data){
                    (data && data.error_code === 0)? defer.resolve(data) : defer.reject(data);
                },
                error: function(res) {
                    defer.reject(res);
                }
            });
            return defer.promise();
        },

        set_version: function(data) {
            this.version_name = data.version_name;
            this.version_code = data.version_code;
        },

        compare_version: function(version, callback) {
            if(!this.version_name && !this.version_code) {
                this.start_server(default_url);
                callback(false);
            } else if((typeof version == 'number' && this.version_code >= version) || (typeof version == 'string' && this.version_name >= version)){
                callback(true);
            } else {
                callback(false);
            }
        },

        close: function() {

        }
    });

    return android_serv;
});