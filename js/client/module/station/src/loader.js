/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        update_cookie = common.get('./update_cookie'),

        //Record = require('./File_record'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/temporary_file.fcg',
        DEFAULT_CMD = 'TemporaryFileDiskDirList',

    //排序类型
        SORT_TYPE = {
            TIME: 0,//时间序
            NAME: 1 //名称序
        },

        undefined;

    var loader = inherit(Event, {
        /**
         * 加载文件节点
         * @param {Object} cfg 详细配置如下：
         *      offset : {Number} 起始位置
         *      num : {Number} 加载条数
         *      sort_type : {String} 排序方式，目前需要支持a-z名称排序（name）与最后修改时间（time）
         *      sub_type : {String} (可选) 子分类，用于文档进行
         * @param {Function} callback 加载完成后的回调，需传入2个参数：
         *      success : {Boolean} 是否成功
         *      records_arr : {Array<Record>} 文件节点
         *      msg : {String} 如果失败，需要在这里给出具体错误文本
         * @param {Object} scope (optional) callback调用的this对象
         */
        load : function(cfg, callback, scope){

            //有before_load方法时 则进行拦截处理请求
            if(this.before_load && this.before_load.call(this, cfg) === false) {
                return;
            }

            this
                ._load(cfg, callback)
                .done(function(records_arr, total) {
                    callback.call(scope || this, records_arr, total);
                });

        },
        /**
         * 加载文件节点的实际请求方法
         * @param cfg
         * @private
         */
        _load: function(cfg, callback) {

            var def = $.Deferred(),
                is_refresh = cfg.start === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }

            me._loading = true;
            me._last_load_req = request
                .xhr_post({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    re_try:3,
                    pb_v2: true,
                    body: {
                        start: cfg.start || 0,
                        count: cfg.count || 20,
                        get_abstract_url: true
                    }
                })
                .ok(function(msg, body) {
                    me._all_load_done = !!body.finish_flag;//是否已加载完
                    if(body.total_file_count == 0) {//总数为空时，后台竞然返回的end字段为false，这里再作下判断
                        me._all_load_done = true;
                    }

                    def.resolve(body);
                    me.trigger('load', body);
                })
                .fail(function(msg, ret) {
                    if(ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065) {
                        update_cookie.update(function() {
                            me.load(cfg, callback);
                        });
                    } else {
                        me.trigger('error', msg, ret);
                    }
                    def.reject(msg, ret);
                })
                .done(function() {
                    me._last_load_req = null;
                    me._loading = false;
                });
            return def;
        },

        load_station_info: function() {
            var def = $.Deferred(),
                me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskUserInfoGet',
                pb_v2: true
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
                console.log('拉取用户中转站信息失败');
                def.reject();
            });
            return def;
        },

        is_first_loaded: function() {
            return this._first_loaded;
        },

        is_loading: function() {
            return this._loading;
        },

        is_all_load_done: function() {
            return this._all_load_done;
        },
        /**
         * 对cgi返回的数据进行再处理，目前有当已全选时，要选中后续加载的每条记录
         * @param {Object} file
         */
        format_file: function(file) {
            if(this.get_checkalled()) {
                file.selected = true;
            }
        },

        set_checkalled: function(checkalled) {
            this._checkalled = checkalled;
            console.log('checkall:',checkalled)
        },

        get_checkalled: function() {
            return this._checkalled;
        },

        abort: function() {
            this._last_load_req && this._last_load_req.destroy();
        }
    });

    return loader;
});