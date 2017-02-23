/**
 * 列表数据加载器
 * @author hibincheng
 * date 2015-05-08
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),

        Record = require('./File_record'),
        query_user = common.get('./query_user'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/temporary_file.fcg',
        DEFAULT_CMD = 'TemporaryFileDiskDirList',

    //排序类型
        SORT_TYPE = {
            TIME: 0,//时间序
            NAME: 1 //名称序
        },

        undefined;

    var Loader = inherit(Event, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
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
                ._load(cfg)
                .done(function(records_arr, total) {
                    callback.call(scope || this, records_arr, total);
                });

        },
        /**
         * 加载文件节点的实际请求方法
         * @param cfg
         * @private
         */
        _load: function(cfg) {

            var def = $.Deferred(),
                is_refresh = cfg.start === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }

            if(is_refresh) {//刷新前
                this.trigger('before_refresh');
            } else {//加载更多前
                this.trigger('before_load');
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
                        count: cfg.count || 50,
                        get_abstract_url: true
                    }
                })
                .ok(function(msg, body) {
                    var records_arr = me.generate_files(body.file_list || []),
                        total;

                    me._all_load_done = !!body.finish_flag;//是否已加载完

                    if(body.total_file_count == 0) {//总数为空时，后台竞然返回的end字段为false，这里再作下判断
                        me._all_load_done = true;
                    }

                    def.resolve(records_arr, body.total_file_count);
                    me.trigger('load', records_arr);
                })
                .fail(function(msg, ret) {
                    def.reject(msg, ret);
                    me.trigger('error', msg, ret);
                })
                .done(function() {
                    // 首次加载列表
                    if (!me._first_loaded) {
                        me._first_loaded = true;
                        me.trigger('first_load_done');
                    }
                    me._last_load_req = null;
                    me._loading = false;
                    if(is_refresh) {//刷新后
                        me.trigger('after_refresh');
                    } else {//加载更多后
                        me.trigger('after_load');
                    }
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

        generate_files: function(files) {
            if(!$.isArray(files)) {
                console.error('Loader.js->generate_files: cgi返回的数据格式不对');
                return;
            }

            var records_arr =[],
                me = this;

            $.each(files, function(i, item) {
                var record;
                me.format_file(item);
                record=new Record(item);
                records_arr.push(record);
            });

            return records_arr;
        },
        /**
         * 当已全选时，要选中后续加载的每条记录
         * @param {Boolean} checkalled 是否全选
         */
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

    return Loader;
});