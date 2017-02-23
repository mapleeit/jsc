define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),

        Record = require('./File_record'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/lib_list.fcg',
        DEFAULT_CMD = 'get_lib_list',
        //REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg',
        //DEFAULT_CMD = 'get_share_list',

        LIB_ID = {
            doc: 1,
            audio: 3,
            video: 4
        },

        //排序类型
        SORT_TYPE = {
            mtime: 1,//更新时间序
            az: 2 //az序
        },

        FILTER_TYPE2EXT_NAME = {
            word: ['doc', 'docx'],
            pdf: ['pdf'],
            excel: ['xls','xlsx'],
            ppt: ['ppt']
        },
        FILTER_TYPE2GROUP_ID = {
            all: 0,
            word: 1,
            excel: 2,
            ppt: 3,
            pdf: 4
        },

        undefined;
    var lib_v3_enable =false;
    query_user.on_ready(function(user) {
        if(user.is_lib3_user()) {
            lib_v3_enable = true;
            REQUEST_CGI = 'http://web2.cgi.weiyun.com/user_library.fcg';
            DEFAULT_CMD = 'LibPageListGet';
        }
    })
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
                is_refresh = cfg.offset === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            //排序类型
            if(cfg.sort_type) {
                cfg.sort_type = SORT_TYPE[cfg.sort_type];
                me.last_sort_type = cfg.sort_type;
            } else {
                cfg.sort_type = me.last_sort_type;
            }
            //文件类型
            if(cfg.filter_type !== 'all') {
                if(cfg.filter_type) {
                    cfg.ext_names = FILTER_TYPE2EXT_NAME[cfg.filter_type];
                    me.last_ext_names = cfg.ext_names;
                    me.last_filter_type = cfg.filter_type;

                } else {
                    cfg.ext_names = me.last_ext_names;
                    cfg.filter_type = me.last_filter_type;
                }
            } else {
                delete me.last_ext_names;//选择全部时，不需要ext_names参数
                delete me.last_filter_type;
            }

            if(lib_v3_enable) {
                cfg.group_id = FILTER_TYPE2GROUP_ID[cfg.filter_type] || 0;
                delete cfg.ext_names;
            }

            delete cfg.filter_type;


            cfg.lib_id = LIB_ID[me.module_name];

            if(is_refresh) {//刷新前
                me.trigger('before_refresh');
            } else {//加载更多前
                me.trigger('before_load');
            }

            me._loading = true;
            me._last_load_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    pb_v2: lib_v3_enable,
                    body: cfg
                })
                .ok(function(msg, body) {
                    var items = lib_v3_enable ? body.FileItem_items : body.list_item;
                    var records_arr = me.generate_files(items || []);

                    me._all_load_done = lib_v3_enable ? !!body.finish_flag : !!body.end;//是否已加载完

                    def.resolve(records_arr);
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

        generate_files: function(files) {
            if(!$.isArray(files)) {
                console.error('Loader.js->generate_files: cgi返回的数据格式不对');
                return;
            }

            var records_arr =[];

            $.each(files, function(i, item) {
                var record;
                record=new Record(item);
                records_arr.push(record);
            });

            return records_arr;
        },

        abort: function() {
            this._last_load_req && this._last_load_req.destroy();
        }
    });

    return Loader;
});