//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/share/share.r150609",["lib","common","$","main"],function(require,exports,module){

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
//share/src/Loader.js
//share/src/Mgr.js
//share/src/Module.js
//share/src/View.js
//share/src/header.js
//share/src/secret/secret.js
//share/src/share.js
//share/src/secret/secret.tmpl.html
//share/src/view.tmpl.html

//js file list:
//share/src/Loader.js
//share/src/Mgr.js
//share/src/Module.js
//share/src/View.js
//share/src/header.js
//share/src/secret/secret.js
//share/src/share.js
define.pack("./Loader",["lib","common"],function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),

        Record = lib('./data.Record'),
        query_user = common.get('./query_user'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/outlink.fcg',
        DEFAULT_CMD = 'WeiyunShareList',

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
                is_refresh = cfg.offset === 0,//从0开始加载数据，则表示刷新
                me = this;

            if(me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }

            if(cfg.sort_type) {
                cfg.sort_type = SORT_TYPE[cfg.sort_type.toUpperCase()];
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
                    body: cfg
                })
                .ok(function(msg, body) {
                    var records_arr = me.generate_files(body.item || []),
                        total;
                    total = {public_num : body.total-body.private_num, private_num: body.private_num};

                    me._all_load_done = !!body.done;//是否已加载完

                    if(body.total == 0) {//总数为空时，后台竞然返回的end字段为false，这里再作下判断
                        me._all_load_done = true;
                    }

                    def.resolve(records_arr, total);
                    me.trigger('load', records_arr);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    if(ret == 114300){
                        me._all_load_done = true;//已加载完
                        def.resolve([], 0);
                        me.trigger('load', []);
                    }else{
                        def.reject(msg, ret);
                        me.trigger('error', msg, ret);
                    }
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
        },

        get_checkalled: function() {
            return this._checkalled;
        },

        abort: function() {
            this._last_load_req && this._last_load_req.destroy();
        }
    });

    return Loader;
});/**
 * 通用的文件列表操作逻辑处理
 * @author hibincheng
 * @modified maplemiao
 * @date 2013-8-19
 */
define.pack("./Mgr",["lib","common","$","./secret.secret"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        text = lib.get('./text'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        request = common.get('./request'),
        Record = lib.get('./data.Record'),
        query_user = common.get('./query_user'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),

        secret = require('./secret.secret'),
        undefined;
    /*
     * 要支持的操作：
     * 取消分享
     * 创建密码
     * 管理密码
     * 复制
     * 切换排序
     * 刷新
     */
    var Mgr = inherit(Event, {

        step_num: 20,

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },
        /**
         * @cfg {View} view
         */
        /**
         * @cfg {Store} store
         */
        /**
         * @cfg {Loader} loader
         */

        bind_events: function() {
            var me = this;
            // 监听编辑态左方的‘取消选择’按钮
            this.listenTo(global_event, 'edit_cancel_all', function () {
                this.store.each(function (rec, id) {
                    rec.set('selected', false);
                });
                this.view.trigger('select_change');
            });
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                }, this);
                this.listenTo(this.view, 'box_select', this.on_box_select, this);
            }
            //监听头部发出的事件
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {
                    this.process_action(action_name, data, e);
                }, this);
            }
            //数据加载器相关事件
            if(this.loader) {
                this
                    .listenTo(this.loader,'error', function(msg) {
                        mini_tip.error(msg);
                    }, this)
                    .listenTo(this.loader, 'before_load', function() {
                        this.view.on_beforeload();
                    }, this)
                    .listenTo(this.loader, 'after_load', function() {
                        this.view.on_load();
                    })
                    .listenTo(this.loader, 'before_refresh', function() {
                        widgets.loading.show();
                        this.view.on_before_refresh();
                    })
                    .listenTo(this.loader, 'after_refresh', function() {
                        widgets.loading.hide();
                        this.view.on_refresh();
                    });
            }

            //访问密码相关事件
            this.listenTo(secret, {
                'create_pwd_success' : function(record, pwd) {
                    record.set('share_pwd', pwd);
                },
                'change_pwd_success' : function(record, pwd) {
                    record.set('share_pwd', pwd);
                },
                'delete_pwd_success' : function(record) {
                    record.set('share_pwd', '');
                }
            });
        },

        // 分派动作
        process_action : function(action_name, data, event){
            var fn_name = 'on_' + action_name;
            if(typeof this[fn_name] === 'function'){
                if(arguments.length > 2) {
                    this[fn_name](data, event);
                } else {
                    this[fn_name](data);//data == event;
                }
            }
        },
        /**
         * 全选操作
         * @param checkalled
         */
        on_checkall: function(checkalled) {
            this.store.each(function(item) {
                item.set('selected', checkalled);
            });

            this.loader.set_checkalled(checkalled);
            user_log('SHARE_SELECT_ALL');

        },

        /**
         * 更改全选状态
         * @param checkalled
         */
        on_change_checkall: function(checkalled) {
            this.loader.set_checkalled(checkalled);
        },

        /**
         * 点击“取消分享”按钮进行批量取消
         */
        on_bat_cancel_share: function() {
            var store = this.store,
                selecteds = [];

            // if(this.header.get_column_model().is_checkalled()) {//全选则取消所有
            //     this.on_cancel_all_share();
            //     return;
            // }

            selecteds = $.grep(store.data, function(item) {
                    if(item.get('selected')) {
                        return true;
                    }
                });
            if(selecteds.length === 0) {
                mini_tip.warn('请选择链接');
                return;
            }
            this.do_cancel_share(selecteds);
            user_log('SHARE_TBAR_CANCEL');

        },
        /**
         * 全选时取消所有分享链接
         */
        on_cancel_all_share: function() {
            var me = this;
            var _do_cancel_all_share=function(){
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunShareClear',
                    pb_v2: true
                }).done(function(msg,ret){
                     if(ret==0){
                        //store.clear操作无法切换成无分享链接时的UI界面,因此直接重新加载一个空数组
                        me.store.load([]);
                        mini_tip.ok('已取消分享');
                     }else if(ret==114400){    //部分删除成功
                       var INIT_NUM = 50,
                           LINE_HEIGHT= 47;
                       var num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), INIT_NUM);
                       me.load_files(0,num);
                       mini_tip.warn('部分分享链接取消失败');
                     }else{  // 其他情况
                       mini_tip.error(msg);
                     }
                });
            };
            widgets.confirm('取消分享', '您确定取消全部分享吗？', '取消分享后，分享链接将被删除', _do_cancel_all_share, null, ['是', '否']);
        },

        on_cancel_share: function(record, event) {
            event.preventDefault();
            this.do_cancel_share([record]);
            user_log('SHARE_HOVERBAR_CANCEL');
        },

        /**
         * 执行取消外链分享
         * @param records
         */
        do_cancel_share: function(records) {
            var me=this,
                del_total=records.length, //当前取消分享操作记录的总数
                del_num_limit = 10,  // 这个数量是比较合适的数量限制，后台cgi并没有强制限制的一次批量取消分享的个数，但一次查询太多影响效率
                del_success_num= 0,        //统计取消分享操作取消成功的个数
                del_success_private_num = 0,//删除的私密外链数
                del_success_public_num = 0,//删除的公开外链数
                del_success_record=[],     //记录多个请求在服务端被成功删除的记录。最终利用该数组在Web端统一删除
                start=0;   //偏移位
            var _do_cancel_share=function(){
                var key_list = [],
                    del_record_slice=[];
                //批量取消操作 目前只支持一次删除10个
                for(var i=start;i<records.length && i<del_num_limit+start;i++){
                    key_list.push(records[i].get('share_key')||"");
                    del_record_slice.push(records[i]);
                }
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunShareDelete',
                    pb_v2: true,
                    body: {
                        share_key_list: key_list
                    }
                })
                    .ok(function(msg, body) {
                        var ret_list = body.ret_item_list || [],
                            del_records=del_record_slice;
                        //在要删除的记录数组中，剔除删除失败的记录。
                        if(ret_list.length>0){
                            del_records=$.grep(del_record_slice,function(item){
                                return me._contain(item.get('share_key'),ret_list);
                            });
                        }
                        //记录取消分享成功的总数， 与取消成功相应的记录
                        $.each(del_records, function(i, record) {
                            del_success_record.push(del_records[i]);
                            del_success_num++;
                            if(!record.get('share_pwd')) {
                                del_success_public_num++;
                            } else {
                                del_success_private_num++;
                            }
                        });
                        //选择多个但只取消一个，需求把其他的选择状态去除
                        me.view.unsel_files();
                    }).done(function(msg,ret){
                        //判断删除的情况
                        start+=del_num_limit;
                        if(start>=del_total){
                            me.store.batch_remove(del_success_record);
                            //隐藏删除进度
                            progress.hide();
                            //判断删除情况给出相应的提示
                            if(del_total==del_success_num){
                                mini_tip.ok('已取消分享');
                            }else if(del_success_num > 0){
                                mini_tip.warn('部分分享链接取消失败');
                            }else{
                                mini_tip.error('分享链接取消失败:'+msg);
                            }
                            me.supply_files_if();//删除了多少节点，要相应补上
                        }else{
                            //显示当前删除进度， 递归调用该方法取消剩余的分享
                            var title = text.format('正在取消第{0}/{1}个分享链接', [start, del_total]);
                            progress.show(title, false, true);
                            _do_cancel_share();
                        }
                    });
            };
            widgets.confirm('取消分享', '您确定取消分享吗？', '取消分享后，分享链接将被删除', _do_cancel_share, null, ['是', '否']);
        },

        /**
         * 判断某条记录的取消分享操作是否失败。
         * @param text  外链的share_key
         * @param json   cgi返回的数组  [{share_key:"",ret: }]
         * @returns {boolean}
         * @private
         */
        _contain:function(text,json){
            for(var i=0;i < json.length;i++){
                if(text === json[i].share_key) {
                    // 114300 表示服务端没有找到该数据， WEB端可认为是删除成功。
                    return (json[i].ret === 0 || json[i].ret === 114300)
                }
            }
            return true;
        },
        /**
         * 判断是否要补充数据
         */
        supply_files_if: function() {
            if (!this.loader.is_loading() && this.scroller.is_reach_bottom()) {
                if(this.loader.is_all_load_done()){
                    if(this.store.size()==0){
                        this.store.load([]);
                    }
                }else{
                    this.load_files(this.store.size(), this.step_num);
                }
            }
        },

        on_view_share: function(record, event) {
            var raw_url = record.get('raw_url');
            event.preventDefault();
            window.open(raw_url);
            user_log('SHARE_HOVERBAR_VISIT');
        },


        /**
         * 创建访问密码
         * @param record 对应要创建访问密码的外链
         * @param event
         */
        on_create_pwd: function(record, event) {
            event.preventDefault();
            secret.create_pwd(record);
            user_log('SHARE_HOVERBAR_PWD_CREATE');
        },

        on_manage_pwd: function(record, event) {
            event.preventDefault();
            secret.manage_pwd(record);
            user_log('SHARE_HOVERBAR_PWD_CHANGE');
        },
        //IE，非flash实现复制功能
        on_copy_share: function(record, event) {
            event.preventDefault();
            if($.browser.msie) {
                var pwd = record.get('share_pwd');
                var link;
                pwd = pwd ? '（密码：' + pwd + '）'  : '';
                link = pwd ? '链接：' + record.get('raw_url') : record.get('raw_url');
                this.view.copy.ie_copy(link + pwd);
            }
            user_log('SHARE_HOVERBAR_COPY');
        },

        /**
         * 刷新操作
         * @param e
         */
        on_refresh: function(e) {
            e.preventDefault();
            global_event.trigger('share_refresh');//保持原有逻辑，直接触发
        },
        /**
         * 分批加载数据
         * @param offset 开始的下标
         * @param num 加数的数据量
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(offset, num, is_refresh) {
            var me = this,
                store = me.store,
                loader = me.loader;

            loader.load({
                offset: offset,
                size: num,
                order:0
            }, function(rs, total) {
                if(offset === 0) {//开始下标从0开始表示重新加载
                    store.load(rs);
                } else {
                    store.add(rs, store.size());
                }

                /*if(is_refresh) {
                    mini_tip.ok('列表已更新');
                }*/
            });
        },
        /**
         * 配置分批加载数据的辅助判断工具
         * @param {Scroller} scroller
         */
        set_scroller: function(scroller) {
            this.scroller = scroller;
        }
    });
    return Mgr;
});/**
 * 外链管理模块类，这里用于兼容原有的common/module与现有的代码
 * @author hibincheng
 * @date 2013-8-15
 */
define.pack("./Module",["lib","common","$","main"],function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Record = lib.get('./data.Record'),
        Store = lib.get('./data.Store'),

        common = require('common'),
        OldModule = common.get('./module'),
        query_user = common.get('./query_user'),
        main_ui,

        $ = require('$');
    // 构造假的module ui，先用于bypass common/module中的判断条件
    var dummy_module_ui = {
        __is_module : true,
        render : $.noop,
        activate : $.noop,
        deactivate : $.noop
    };

    var noop = $.noop;

    var Module = inherit(Event, {
        constructor : function(cfg){
            $.extend(this, cfg);
        },
        get_list_view : function(){
            var view = this.list_view;
            if(!view.rendered){
                view.render(this.$body_ct);
            }
            return view;
        },
        get_list_header: function() {
            var header = this.list_header;
            if(!header.rendered){
                header.render();
            }
            return header;
        },
        activate : function(){

            this.get_list_view().show();
            this.get_list_header().activate();
            this.on_activate();
            // 鼠标点击其它地方，取消选中
//            var me = this,
//                $els = me.$body_ct;
//            if(!this._clear_selection_on_blur){
//                this._clear_selection_on_blur = function(e){
//                    // 列表内点击，无视
//                    if($(e.target).closest($els).length>0){
//                        return;
//                    }
//                    // 操作区点击，无视
//                    if($(e.target).closest('[data-no-selection], object, embed').length>0){
//                        return;
//                    }
//                    me.get_list_view().store.each(function(rec){
//                        rec.set('selected', false);
//                    });
//
//                    me.get_list_header().get_column_model().cancel_checkall();//全选checkbox也要去掉
//                };
//            }
//            $(document.body).on('mouseup', this._clear_selection_on_blur);
        },
        deactivate : function(){
            this.loader && this.loader.abort();
            this.get_list_view().hide();
            this.get_list_header().deactivate();
            this.on_deactivate();
            // $(document.body).off('mouseup', this._clear_selection_on_blur);
        },

        on_activate: noop,
        on_deactivate: noop,
        /**
         * 用于兼容原本的common/module模块
         * @return {CommonModule} module
         */
        get_common_module : function(){
            var module = this.old_module_adapter, me = this;
            if(!module){
                module = this.old_module_adapter = new OldModule(this.name, {
                    ui : dummy_module_ui,
                    render : function(){
                        main_ui = require('main').get('./ui');
                        //me.$header_ct = main_ui.get_$special_header();
                        me.$top_ct = main_ui.get_$top();
                        me.$bar1_ct = main_ui.get_$bar1();
                        me.$column_ct = main_ui.get_$share_head();
                        me.$body_ct = main_ui.get_$body_box();
                    },
                    activate : function(){
                        if(query_user.get_cached_user()) {
                            me.activate();
                        } else {
                            me.listenToOnce(query_user, 'load', function() {
                                me.activate();
                            });
                        }
                    },
                    deactivate : function(){
                        //yuyanghe   判断列表是否为空 为空时 移除share-empty-module 样式
                        if(me.get_list_view().store.size() == 0){
                            // yuyanghe 修复运营页面头部无线条BUG  用.show()命令最近文件会出现bug
                            main_ui.get_$bar1().css('display','');
                        }
                        me.deactivate();
                    }
                });
            }
            return module;
        }
    });
    return Module;
});/**
 *
 * @author hibincheng
 * @date 2013-8-15
 */
define.pack("./View",["lib","common","$","./tmpl","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        // console = lib.get('./console'),
        ContextMenu = common.get('./ui.context_menu'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        tmpl = require('./tmpl'),
        main_ui = require('main').get('./ui'),
        global_event = common.get('./global.global_event'),
        list_hover_class = 'list-hover',

        sel_box,

        get_el = function (id) { return document.getElementById(id); },

        undefined;

    var File_view = inherit(View, {

        // header_selector: '#_share_view_header>.tit',
        list_selector: '#_share_view_list>.list-group',
        item_selector: 'li[data-file-id]',
        action_property_name: 'data-action',
        record_dom_map_perfix: 'share-item-',

        _select_items_cnt: 0,//已勾选的文件个数

        list_tpl: function () {
            return tmpl.share_list();
        },

        tpl: function (file) {
            return tmpl.file_item([file]);
        },

        get_html: function (files) {
            return tmpl.file_item(files);
        },
        shortcuts: {
            selected: function (value) {
                if (sel_box){
                    sel_box.set_selected_status([this.attr('id')], value);
                }
            },
            expanded: function (value) {
                $(this).toggleClass('exp', value);
            }
        },

        get_record_by_id: function (id) {
            return this.store.get(id);
        },

        //插入记录，扩展父类
        on_add: function (store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);
            var prefix = this.record_dom_map_perfix;
            $.each(records, function(i, item) {
                if(item.get('selected')) {
                    sel_box.set_selected_status([prefix + item.id], true);
                }
            });
        },

        after_render: function () {
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 点选，checkbox选择
            this.on('recordclick', this._handle_item_click, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);

            // 选择变化时是否显示编辑态
            this.on('select_change', this._handle_select_change, this);

	        //任务管理器打开时禁用选框
	        var oldStateIsEnabled;
	        this.listenTo(global_event, 'manage_toggle', function(state) {
		        if (sel_box) {
			        if(state === 'show') {
				        oldStateIsEnabled = sel_box.is_enabled();
				        oldStateIsEnabled && sel_box.disable();
			        } else if(state === 'hide') {
				        oldStateIsEnabled && sel_box.enable();
			        }
		        }
	        });

            //修复hover
            this._fix_flash_hover();

            this._init_copy();
        },

        on_show: function () {
            //初始化复制工具
            if (!this.copy) {
                this._init_copy();
            }
            this._enable_box_selection();
            this._activated = true;
        },

        on_hide: function () {
            //因为contextmenu有复制且菜单是在body下的，所以事件是绑定在body上，为避免影响到其它模块的复制功能，所以切换模块时要进行销毁
            this.copy && this.copy.destroy();
            this.copy = null;
            this._disable_box_selection();
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        //启用框选
        _enable_box_selection: function () {
            var me = this,
                sel_box = this._get_sel_box();

            sel_box.enable();

            this.listenTo(sel_box, 'select_change', function (sel_id_map, unsel_id_map) {
                var sel_cnt = 0;
                for (var el_id in sel_id_map) {
                    var item = get_el(el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = me.get_record_by_id(id))) {
                        record.set('selected', true, true);
                        sel_cnt++;
                    }
                }
                for (var el_id in unsel_id_map) {
                    var item = get_el(el_id), id, record;
                    if (item && (id = item.getAttribute('data-record-id')) && (record = me.get_record_by_id(id))) {
                        record.set('selected', false, true);
                    }
                }

                me._block_hoverbar_if(sel_cnt);
                me.trigger('select_change');
            });
        },

        //禁用框选
        _disable_box_selection: function () {
            var sel_box = this._get_sel_box();
            sel_box.disable();

            this.stopListening(sel_box, 'select_change');
        },

        on_datachanged: function () {
            var me = this;
            File_view.superclass.on_datachanged.apply(this, arguments);
            if (this.store.size() === 0) {//无数据时，显示空白运营页

                // this.get_$view_ct().addClass('ui-view-empty');
               this.get_$view_empty().show();
               this.get_$view_list().hide();
                //调整运营页高度
                //加入了一个空白的层，以修复头部边框bug。 后续需要jinfu用css样式控制 yuyanghe todo
                //this.get_$main_bar1().hide();
            } else {
                //加入了一个空白的层，以修复头部边框bug。 后续需要jinfu用css样式控制 yuyanghe todo  .show()命令会导致最近文件栏目出现bug
                //this.get_$main_bar1().css('display','');

                // this.get_$view_ct().removeClass('ui-view-empty');
               this.get_$view_empty().hide();
               this.get_$view_list().show();
            }
        },

        _handle_select_change: function () {
            var me = this;
            var sel_meta = me.get_sel_meta();

            if (sel_meta.files.length) {
                main_ui.toggle_edit(true, sel_meta.files.length);
            } else {
                main_ui.toggle_edit(false);
            }
        },

        /**
         * 清除选择状态
         */
        unsel_files: function() {
            var records = this.get_sel_meta().files;
            var prefix = this.record_dom_map_perfix;
            if(records.length > 1) {
                for(var i=0; i<records.length; i++) {
                    records[i].set('selected', false, true);
                    sel_box.set_selected_status([prefix + records[i].id], false);
                }
            }
        },

        /**
         * 获取已经选择的总条目信息
         * @returns {{files: Array, is_all: boolean}}
         */
        get_sel_meta: function () {
            var me = this;
            var sel_meta = {
                files: [],
                is_all: false
            };

            me.store.each(function (rec, id) {
                if (rec.get('selected')) {
                    sel_meta.files.push(rec);
                }
            });

            if (me.store.length == sel_meta.files.length) {
                sel_meta.is_all = true;
            }

            return sel_meta;
        },

        _handle_action: function (action, record, e) {
            switch (action) {
                case 'contextmenu':
                    this.show_ctx_menu(record, e);
                    break;
            }
        },

        _handle_item_click: function (record, e) {
            var $target = $(e.target);
            var $record = $target.closest(this.item_selector);
            var is_checkbox = $target.closest('.j-icon-checkbox', $record).length;
            var is_data_action = !!$target.closest('[' + this.action_property_name + ']').length;
            var last_click_record = this.last_click_record,
                store = this.store,
                index = store.indexOf(record),
                start, end,
                multi_select = false,
                clear_selected = true,
                expand_click = true;
            if (is_data_action) {//如果是功能性操作直接返回，对应的mgr中已有相应处理
                return;
            }
            if (is_checkbox || e.ctrlKey || e.metaKey) { // 如果是checkbox或按了ctrl键，不清除已选项
                clear_selected = false;
                expand_click = false;
            }
            // 如果按了shift，表示区域选择
            if (e.shiftKey) {
                multi_select = true;
                expand_click = false;
                // 如果没有上次点击的记录，从起始开始
                start = last_click_record ? store.indexOf(last_click_record) : 0;
                end = index;
                this.last_click_record = record;
            } else { // 否则，只选或反选这条，记录当前操作的记录
                if(!record.get("selected")){
                    this.last_click_record = record;
                }
            }
            // 这里有些特殊，如果是普通的单击记录，是展开/收缩的。
            if (expand_click) {
                //只展开一个记录，上次展开的记录要收缩起来
                this.last_expanded_record && this.last_expanded_record != record && this.last_expanded_record.set('expanded', false);
                record.set('expanded', !record.get('expanded'));

                if (record.get('expanded')) {
                    this.last_expanded_record = record;
                }
            } else {
                store.each(function (rec, idx) {
                    var selected, old_selected = rec.get('selected');
                    // 是否是操作目标
                    var in_range = multi_select ? (idx >= start && idx <= end || idx >= end && idx <= start) : idx === index;
                    if (multi_select) { // 多选时，范围内的必定选中，范围外的如果没有ctrl则不选，如果有则保持
                        if (in_range) {
                            selected = true;
                        } else {
                            selected = clear_selected ? false : old_selected;
                        }
                    } else { // 单选时
                        if (clear_selected) { // 如果没按ctrl，目标记录一定选中，其它的则不选
                            selected = in_range;
                        } else { // 如果按了ctrl，其它记录不变，目标记录切换状态
                            selected = in_range ? !old_selected : old_selected;
                        }
                    }
                    if (selected !== old_selected) {
                        rec.set('selected', selected);
                    }
                });
                this.trigger('select_change');
                this._block_hoverbar_if(this.get_selected_files().length);
            }
        },
        /**
         * 获取已选择的列表项
         * @returns {Array}
         */
        get_selected_files: function() {
            var store = this.store,
                selected_files = [];
            $.each(store.data, function(i, item) {
                if(item.get('selected')) {
                    selected_files.push(item);
                }
            });

            return selected_files;
        },
        /**
         * 保持右键菜单选中的记录为已选择状态，其它都更改为非已选
         * @param record 当前右键菜单对应的记录
         */
        keep_single_select: function (record) {
            var store = this.store;
            store.each(function (item) {
                if (item.get('selected')) {
                    item.set('selected', false);
                }
            });
            record.set('selected', true);
        },

        /**
         * 显示右键菜单
         */
        show_ctx_menu: function (record, e) {
            e.preventDefault();
            var menu,
                items,
                me = this,
                secret = record.get('share_pwd'),
                is_normal = (record.get('result') == 0),
                $target_item = $(e.target).closest(me.item_selector),
                $view_ct = this.get_$view_ct();

            if (record.get('illegal')) {//违法就无需显示右键菜单了
                return;
            }

            this.keep_single_select(record);//右键菜单只作用一条记录

            var x = e.pageX,
                y = e.pageY;

            items = [];
            if (is_normal) {

                items = [
                    {
                        id: 'view_share',
                        text: '访问分享链接',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    },
                    {
                        id: secret ? 'manage_pwd' : 'create_pwd',
                        text: secret ? '密码管理' : '创建访问密码',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    }
                ];

                if (Copy.can_copy()) {
                    items.push({
                        id: 'copy_share',
                        text: '复制分享链接',
                        icon_class: 'ico-null',
                        click: default_handle_item_click
                    });
                }
            }
            items.push({
                id: 'cancel_share',
                text: '取消分享',
                icon_class: 'ico-null',
                click: default_handle_item_click
            });

            menu = new ContextMenu({
                items: items
            });


            menu.on('hide', function () {
                $view_ct.removeClass('block-hover');
                $target_item.removeClass('context-menu');
            });

            $view_ct.addClass('block-hover');
            $target_item.addClass('context-menu');

            menu.show(x, y);
            menu.$el.addClass('content-menu-share');

            this.last_expanded_record && this.last_expanded_record.set('expanded', false);
            this.last_expanded_record = record;
            record.set('expanded', true);

            if (Copy.can_copy()) {
                menu.$el.find('[data-item-id="copy_share"]')
                    .attr('data-clipboard-target', true)
                    .attr('record-menu', true)
                    .attr('record-id', record.id);
            }
            //item click handle
            function default_handle_item_click(e) {
                me.trigger('action', this.config.id, record, e);
            }
        },
        /**
         * 初始化复制操作
         * @private
         */
        _init_copy: function () {
            var me = this;

            if (!Copy.can_copy()) {
                return;
            }
            //因contextmenu是在body中的，所以不能使用container_selector
            this.copy = new Copy({
                //container_selector: this.list_selector + ' , .content-menu-share',
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function () {
                    var $target = me.copy.get_$cur_target(),
                        $list_item,
                        record,
                        record_id = $target.attr('record-id'),
                        share_pwd;
                    if (record_id) {//菜单上的“复制”按钮
                        record = me.store.get(record_id);
                    } else {
                        $list_item = $target.closest(me.item_selector);
                        record = me.get_record($list_item);
                    }
                    //数据上报根据 target对象的 className中是否包含link-copy判断
                    if ($target.hasClass('link-copy')) {
                        user_log('SHARE_HOVERBAR_COPY');
                    } else {
                        user_log('SHARE_ITEM_COPY');
                    }

                    share_pwd = record.get('share_pwd');
                    if (share_pwd) {//有访问密码
                        return '链接：' + record.get('raw_url') + '（密码：' + share_pwd + '）';
                    }
                    return record.get('raw_url');
                }, this)
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok('复制成功，粘贴给您的朋友吧');
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn('您的浏览器不支持该功能');
                })
                .listenTo(this.copy, 'mouseover', function () {//修复有flash时无法hover
                    var $target = me.copy.get_$cur_target();
                    var $list_item = $target.closest(me.item_selector);
                    var record = me.get_record($list_item);
                    var $last_hover_item = me.get_$last_hover_item();
                    if ($target.attr('record-menu')) {
                        return;
                    }
                    $last_hover_item && $last_hover_item.removeClass(list_hover_class);
                    $list_item.addClass(list_hover_class);
                    me.set_$last_hover_item($list_item);
                    me.set_on_flash(true);
                })
                .listenTo(this.copy, 'mouseout', function () {
                    var $target = me.copy.get_$cur_target();
                    var $list_item = $target.closest(me.item_selector);
                    var $last_hover_item = me.get_$last_hover_item();
                    var record = me.get_record($list_item);
                    if ($target.attr('record-menu')) {
                        return;
                    }
                    if (record && !record.get('expanded') || $last_hover_item != $list_item) {
                        $list_item.removeClass(list_hover_class);
                    }
                    me.set_on_flash(false);
                });
        },
        /**
         * 设置鼠标是否进入了flash
         * @param on
         */
        set_on_flash: function (on) {
            this._has_on_flash = !!on;
        },

        is_on_flash: function () {
            return this._has_on_flash;
        },
        //有flash时会影响到的hover效果，需要使用样式list-hover来控制，只是使得:hover伪类还不行，因为在flash上hover时不会触发dom的hover，所以直接采用ie6的hover解决方案
        _fix_flash_hover: function () {
            var me = this;
            $(this.list_selector)
                .on('mouseenter', this.item_selector, function (e) {
                    var $last_hover_item = me.get_$last_hover_item();
                    $last_hover_item && $last_hover_item.removeClass(list_hover_class);
                    me.set_on_flash(false);
                    $(this).addClass(list_hover_class);
                })
                .on('mouseleave', this.item_selector, function (e) {
                    if (!me.is_on_flash()) {
                        $(this).removeClass(list_hover_class);
                    }
                });
        },

        set_$last_hover_item: function ($item) {
            this._$last_hover_item = $item;
        },
        get_$last_hover_item: function () {
            return this._$last_hover_item;
        },

        // 显示loading
        on_beforeload: function () {
            this.get_$load_more().show();
        },
        // 去掉loading
        on_load: function () {
            this.get_$load_more().hide();
        },

        on_before_refresh: function () {
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().hide();
        },

        on_refresh: function () {
            this.last_expanded_record = null;
            this.last_click_record = null;
            this.set_$last_hover_item(null);
            if(!this.is_activated()) {
                return;
            }
            this.get_$view_ct().show();
            //测速
            try {
	            var flag = '21254-1-14';
	            if(window.g_start_time) {
		            huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		            huatuo_speed.report();
	            }
            } catch (e) {

            }
        },
        /**
         * 是否屏蔽列表项的hoverbar
         * @param selected_files_cnt 选中文件的个数
         * @private
         */
        _block_hoverbar_if: function(selected_files_cnt) {
            if(selected_files_cnt > 1) {
                this.get_$view_ct().addClass('block-hover');
            } else {
                this.get_$view_ct().removeClass('block-hover');
            }
        },

        get_$view_empty: function () {
            return this.$view_empty || (this.$view_empty = $('#_share_view_empty'));
        },

        get_$main_bar1: function () {
            return this.$main_bar1 || (this.$main_bar1 = $('#_main_bar1'));
        },

        get_$view_list: function () {
            return this.$view_list || (this.$view_list = $('#_share_view_list'));
        },

        get_$view_ct: function () {
            return this.$view_ct || (this.$view_ct = $('#_share_body'));
        },

        get_$load_more: function () {
            return this.$load_more || (this.$load_more = $(tmpl.load_more()).appendTo(this.$el));
        },

        _get_sel_box: function () {
            if (!sel_box) {
                var SelectBox = common.get('./ui.SelectBox');
                var $list = $(this.list_selector);
                sel_box = new SelectBox({
                    ns: 'share',
                    selected_class: 'act',
                    $el: $list,
                    $scroller: main_ui.get_scroller().get_$el(),
                    all_same_size: false,
                    keep_on: function ($tar) {
                        return !!$tar.closest('#_main_top').length || !!$tar.closest('.mod-msg').length;
                        // return $tar.is('label');
                    },
                    clear_on: function ($tar) {
                        return $tar.closest('[data-record-id]').length === 0;
                    },
                    container_width: function () {
                        return $list.width();
                    }
                });
            }
            return sel_box;
        }


    });
    return File_view;
});/**
 * _main_bar1（编辑态右方按钮） & _main_bar2（列表上方提示信息部分）
 * @author hibincheng
 * @modified maplemiao
 * @date 2016-08-20
 *
 */
define.pack("./header",["lib","common","$","./tmpl","main"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),

        tmpl = require('./tmpl'),
        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;

    var header = new Module('header', {
        render: function () {
            var me = this;

            if (!this.rendered) {
                this.rendered = true;
            }
        },

        activate: function () {
            var me = this;

            me._render_main_bar1();
            me._render_main_bar2();
        },

        deactivate: function () {
            var me = this;

            me._destroy_main_bar1();
            me._destroy_main_bar2();
        },

        _render_main_bar1: function () {
            var me = this,
                $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.append(tmpl._main_bar1()).show();
            $_main_bar1
                .on('click.bat_cancel_share', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    me.trigger('action', 'bat_cancel_share', e);
                })
        },
        _destroy_main_bar1: function () {
            var me = this,
                $_main_bar1 = main_ui.get_$bar1();

            $_main_bar1.off('click');
            $_main_bar1.empty();
        },

        _render_main_bar2: function () {
            var me = this,
                $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.append(tmpl._main_bar2());
            $_main_bar2.show();
        },

        _destroy_main_bar2: function () {
            var me = this,
                $_main_bar2 = main_ui.get_$bar2();

            $_main_bar2.empty();
            $_main_bar2.hide();
        },

        bind_store: function (store) {
            var old_store = this.store;
            if(old_store) {
                old_store.off('datachanged', this.on_data_datachanged, this);
                old_store.off('clear', this.on_data_clear, this);
                old_store.off('update', this.on_data_update, this);
                old_store.off('remove', this.on_data_remove, this);
            }

            store.on('datachanged', this.on_data_datachanged, this);
            store.on('clear', this.on_data_clear, this);
            store.on('update', this.on_data_update, this);
            store.on('remove', this.on_data_remove, this);
            //
            this.store = store;
        },
        on_data_clear: function () {
        //    on data clear
        },
        on_data_update: function (e) {
        //    on data update
        },
        on_data_remove: function () {
            var me = this;
            
            main_ui.toggle_edit(false);
        },
        on_data_datachanged: function() {
        //    on data datachanged
        }
    });
    return header;

});/**
 * 外链密码模块
 * @author bondli
 * @date 2013-9-16
 */
define.pack("./secret.secret",["lib","common","$","./tmpl"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var inherit = lib.get('./inherit'),
        text = lib.get('./text'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        Module = common.get('./module'),
        request = common.get('./request'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        cur_record,//当前操作对应的外链
        cur_operator,//当前操作（创建密码、管理密码）
        cur_sub_operator,//当前子操作（修改密码、删除密码）
        NUM_WORD_REG = /[0-9a-zA-Z]/,
        NUM_WORD_FILTER_REG = /[^0-9a-zA-Z]/g,
        filter_key_code = [8, 9, 37, 39, 35, 46],//BackSpace、Tab、Left、Right Delete、End,字符过滤时不对这几个操作字符过虑
        ico_checked_class = 'ico-checked',

        OPERATOR = {
            CREATE: 'create',
            MANAGE: 'manage'
        },

        SUB_OPERATOR = {
            CHANGE: 'change',
            DELETE: 'delete'
        },

        undefined;

    var REQUEST_CGI = 'http://web2.cgi.weiyun.com/outlink.fcg',
        ADD_PASSWD_CMD = 'WeiyunSharePwdCreate',
        EDIT_PASSWD_CMD = 'WeiyunSharePwdModify',
        DEL_PASSWD_CMD = 'WeiyunSharePwdDelete';

    var secret = new Module('secret', {

        set_passwd : function(sharekey, passwd, cmd){
            //删除密码不验证老密码，其他需要验证长度
            //if(passwd.length != 4 && cmd == EDIT_PASSWD_CMD) return;
            //验证传入的sharekey是否合法
            var def = $.Deferred();
            if(!sharekey.length) {
                def.reject('sharekey不合法');
                return;
            }
            //验证请求的命令字是否合法
            if( $.inArray(cmd,[ADD_PASSWD_CMD,EDIT_PASSWD_CMD,DEL_PASSWD_CMD]) == -1 ) return;

            var data = {share_key: sharekey};
            if(cmd === EDIT_PASSWD_CMD) {
                data['share_new_pwd'] = passwd;
            } else if(cmd === ADD_PASSWD_CMD){
                data = {
                    share_key: sharekey,
                    share_pwd: passwd
                };
            }

            request.xhr_post({
                url: REQUEST_CGI,
                cmd: cmd,
                pb_v2: true,
                body: data
            }).ok(function(){
                def.resolve(passwd);
            }).fail(function (msg, ret) {
                def.reject(msg, ret);
            });

            return def;
        },

        /**
         * 初始化复制操作
         * @private
         */
        _init_copy: function() {
            var me = this;

            if(!Copy.can_copy()) {
                return;
            }

            this.copy = new Copy({
                container_selector: '#_share_secret_pop_container',
                target_selector: '[data-clipboard-target-pop]'     //hack，使用特别的target_selector，避免被当前模块的contextmenu中的复制绑定在body上事件先执行
            });

            this
                .listenTo(this.copy, 'provide_text', function() {
                    return me.get_$success_pwd().text();
                })
                .listenTo(this.copy, 'copy_done', function() {
                    me.show_msg_tip(true, '链接复制成功');
                })
                .listenTo(this.copy, 'copy_error', function() {
                    me.show_msg_tip(false, '链接复制失败');
                });
        },
        /**
         * 创建密码管理窗口
         * @returns {widgets.Dialog}
         * @private
         */
        _create_secret_dialog: function() {
            var me = this;
            var dialog = new widgets.Dialog({
                title: '创建密码',
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.secret_dialog,
                mask_bg: 'ui-mask-white',
                buttons: [{
                    id: 'OK',
                    text: '确定',
                    disabled: true,
                    klass: 'g-btn-blue'
                }, {
                    id: 'COPY',
                    text: '复制链接和密码',
                    disabled:true,
                    klass: 'g-btn-blue btn-copy'
                }, {
                    id: 'CLOSE',
                    text: '确定',
                    disabled:true,
                    klass: 'g-btn-gray'
                }, {
                    id: 'CANCEL',
                    text: '取消',
                    disabled: true,
                    klass: 'g-btn-gray'
                }],
                handlers: {
                    OK: function(e) {
                        e && e.preventDefault();
                        if(me.get_$ok_btn().attr('disabled')) {//禁用时，不进行操作
                            return;
                        }
                        if(cur_operator === OPERATOR.CREATE) {
                            me.do_create_pwd();
                        } else if(cur_sub_operator === SUB_OPERATOR.CHANGE) {
                            me.do_change_pwd();
                        } else {
                            me.do_delete_pwd();
                        }
                    },
                    COPY: function(e) {
                        e.preventDefault();
                        me.copy.ie_copy(me.get_$success_pwd().text());
                    },
                    CANCEL: function() {
                        me.release_quote();
                    },
                    CLOSE: function() {
                        me.release_quote();
                    }
                }
            });

            dialog.render_if();
            dialog.$buttons = dialog.$el.find('a[type=button]');//这里的按钮不是button,而是a标签

            this._init_copy();

            this.bind_events(dialog);

            return dialog;
        },
        /**
         * 绑定ui事件
         */
        bind_events: function(dialog) {
            var me = this;
            //判断keyCode是否是数字和字母
            var is_num_word_key = function(key) {
                if(key > 47 && key < 58 || key > 64 && key < 91 || key > 95 && key < 106) {
                    return true;
                }
                return false;
            }
            dialog.$el
                .on('keydown', '[data-id=pwd_text],[data-id=change_pwd_text]', function(e) {
                    var keycode = e.keyCode;
                    if(!is_num_word_key(keycode)
                        && $.inArray(keycode, filter_key_code) === -1
                        || e.shiftKey === true) {//非数字或字母，不给输入
                        e.preventDefault();
                        //webkit、opera 中文输入法下禁止输入，此时keyCode为固定的值  ie firefox采用 html:style="ime-mode:disabled"
                        if($.browser.webkit && keycode === 229 || $.browser.opera && keycode === 197) {
                            var pwd = $.trim($(this).val());
                            $(this).val(pwd.replace(NUM_WORD_FILTER_REG, ''));
                        }
                        return false;
                    }
                })
                .on('keyup', '[data-id=pwd_text],[data-id=change_pwd_text]', function(e) {
                    var pwd = $.trim($(this).val());
                    var keycode = e.keyCode;
                    var char = String.fromCharCode(keycode);
                    if(($.browser.webkit || $.browser.opera) && !NUM_WORD_REG.test(char) && $.inArray(keycode, filter_key_code) === -1) {//webkit opera 中文输入法下禁止输入，此时keyCode并不固定，先在keydown拦截，没成功再在这里拦一次
                        pwd = pwd.replace(NUM_WORD_FILTER_REG, '');
                        $(this).val(pwd);
                    }
                    if(cur_operator === OPERATOR.MANAGE && cur_sub_operator !== SUB_OPERATOR.CHANGE) {//非修改密码选中时，不进行按钮连动
                        return;
                    }
                    if(pwd.length === 6) {
                        dialog.set_button_enable('OK', true);
                    } else {
                        dialog.set_button_enable('OK', false);
                    }
                })
                .on('click', '[data-id=del_pwd_check],[data-id=del_pwd_check_tip]', function(e) {//选择删除密码
                    me.switch_manage_sub_operator(SUB_OPERATOR.DELETE);
                    dialog.set_button_enable('OK', true);
                })
                .on('click', '[data-id=change_pwd_check],[data-id=change_pwd_check_tip]', function(e) {//选择修改密码
                    me.switch_manage_sub_operator(SUB_OPERATOR.CHANGE);
                    if(me.get_$change_pwd_text().val().length === 6) {
                        dialog.set_button_enable('OK', true);
                    } else {
                        dialog.set_button_enable('OK', false);
                    }
                });
            //密码框禁用粘贴
            dialog.$el.find('[data-id=pwd_text],[data-id=change_pwd_text]')
                .on('paste', function(e) {
                    e.preventDefault();
                    return false;
                });
        },

        get_secret_dialog: function() {
            if(!this.secret_dialog) {
                this.secret_dialog = this._create_secret_dialog();
            }
            return this.secret_dialog;
        },
        /**
         * 密码管理框，切换checkbox（删除密码 or 修改密码）
         * @param sub_operator
         */
        switch_manage_sub_operator: function(sub_operator) {
            if(sub_operator === SUB_OPERATOR.CHANGE) {
                this.get_$change_pwd_check().addClass(ico_checked_class);
                this.get_$del_pwd_check().removeClass(ico_checked_class);
                cur_sub_operator = SUB_OPERATOR.CHANGE;
            } else {
                this.get_$change_pwd_check().removeClass(ico_checked_class);
                this.get_$del_pwd_check().addClass(ico_checked_class);
                cur_sub_operator = SUB_OPERATOR.DELETE;
            }
        },
        /**
         * 切换窗口内容（创建密码、管理密码、密码生成成功）
         * @param content_type
         */
        switch_dialog_content: function(content_type) {
            var dialog = this.get_secret_dialog();
            switch(content_type) {
                case 'create':
                    dialog.set_title('创建密码');
                    dialog.set_button_enable('OK', false);
                    dialog.set_button_visible('OK', true);
                    dialog.set_button_visible('CANCEL', true);
                    dialog.set_button_visible('COPY', false);
                    dialog.set_button_visible('CLOSE', false);
                    this.get_$pwd_text().val('');
                    this.get_$create_content().show();
                    this.get_$change_content().hide();
                    this.get_$success_content().hide();
                    break;
                case 'manage':
                    dialog.set_title('密码管理');
                    dialog.set_button_enable('OK', true);
                    dialog.set_button_visible('OK', true);
                    dialog.set_button_visible('CANCEL', true);
                    dialog.set_button_visible('COPY', false);
                    dialog.set_button_visible('CLOSE', false);
                    this.get_$change_pwd_text().val('');
                    this.switch_manage_sub_operator(SUB_OPERATOR.CHANGE);
                    this.get_$create_content().hide();
                    this.get_$change_content().show();
                    this.get_$success_content().hide();
                    break;
                case 'success':
                    dialog.set_button_visible('OK', false);
                    if(Copy.can_copy()) {
                        dialog.set_button_visible('COPY', true);
                    }
                    dialog.set_button_visible('CLOSE', true);
                    dialog.set_button_visible('CANCEL', false);
                    this.get_$create_content().hide();
                    this.get_$change_content().hide();
                    this.get_$success_content().show();
                    this.fill_success_data();
                    break;

            }
        },
        /**
         * 重置窗口（每次打开窗口前需要先重置）
         */
        reset_dialog: function() {
            this.get_$msg_tip().hide();
            this.switch_dialog_content(cur_operator);
        },

        /**
         * 创建/修改密码成功后，对成功页面进行填充相应的信息
         */
        fill_success_data: function() {
            var pwd;
                //share_name = cur_record.get('share_name'),
                //append_str = share_name.slice(share_name.length-6),
                //share_name = text.smart_sub(share_name.slice(0, share_name.length-6), 10) + append_str;//截取一个合理长度一行能显示的字条

            if(cur_operator === OPERATOR.CREATE) {
                this.get_$success_title().text('访问密码创建成功！');
                pwd = this.get_$pwd_text().val();
            } else {
                this.get_$success_title().text('密码修改成功！');
                pwd = this.get_$change_pwd_text().val();
            }

            //this.get_$success_info().text('我通过微云给你分享了“' + share_name + '”');
            this.get_$success_pwd().text('链接：' + cur_record.get('raw_url') + '（密码：' + pwd + '）');
        },
        /**
         * 创建密码操作
         */
        do_create_pwd: function() {
            var me = this,
                pwd = this.get_$pwd_text().val();
            this.set_passwd(cur_record.get('share_key'), pwd, ADD_PASSWD_CMD)
                .done(function() {
                    me.switch_dialog_content('success');
                    me.trigger('create_pwd_success', cur_record, pwd);
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
            user_log('SHARE_MGR_PWD_OK_CREATE');
        },
        /**
         * 修改密码操作
         */
        do_change_pwd: function() {
            var me = this,
                pwd = this.get_$change_pwd_text().val();
            this.set_passwd(cur_record.get('share_key'), pwd, EDIT_PASSWD_CMD)
                .done(function() {
                    me.switch_dialog_content('success');
                    me.trigger('change_pwd_success', cur_record, pwd);
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
            user_log('SHARE_MGR_CHANGE_CHECKBOX');
        },
        /**
         * 删除密码操作
         */
        do_delete_pwd: function() {
            var me = this;
            this.set_passwd(cur_record.get('share_key'), '', DEL_PASSWD_CMD)
                .done(function() {
                    me.trigger('delete_pwd_success', cur_record);
                    me.get_secret_dialog().hide();
                    mini_tip.ok('密码删除成功');
                })
                .fail(function(msg) {
                    me.show_msg_tip(false, msg);
                });
            user_log('SHARE_MGR_DELETE_CHECKBOX');
        },
        /**
         * 创建访问密码
         * @param {Record} record 要创建访问密码的外链
         */
        create_pwd: function(record) {
            var dialog = this.get_secret_dialog();
            cur_record = record;
            cur_operator = OPERATOR.CREATE;
            this.reset_dialog();
            dialog.show();
            this.get_$pwd_text().focus();//窗口显示出来后，聚焦到密码输入框
        },

        /**
         * 管理访问密码
         * @param {Record} record 要进行管理访问密码的外链
         */
        manage_pwd: function(record) {
            var dialog = this.get_secret_dialog();
            cur_record = record;
            cur_operator = OPERATOR.MANAGE;
            this.reset_dialog();
            dialog.show();
            this.get_$change_pwd_text().val(record.get('share_pwd')).focus();//窗口显示出来后，聚焦到密码输入框
        },

        /**
         * 释放引用
         */
        release_quote: function() {
            cur_record = null;
            cur_operator = null
            cur_sub_operator = null;
        },

        /**
         * 显示提示信息
         * @param {Boolean} is_succ 是否成功
         * @param {String} msg 要提示的信息
         */
        show_msg_tip: function(is_succ, msg) {
            var $tip = this.get_$msg_tip();
            if(is_succ) {
                $tip.hide().removeClass('err').text(msg).fadeIn(200);
            } else {
                $tip.hide().addClass('err').text(msg).fadeIn(200);
            }

            setTimeout(function() {
                $tip.fadeOut(200);
            }, 3000);

        },


        //=========================== DOM 相关 ================================//
        get_$pwd_text: function() {
            return this.$pwd_text || (this.$pwd_text = this.get_secret_dialog().$el.find('[data-id=pwd_text]'));
        },

        get_$create_content: function() {
            return this.$create_content || (this.$create_content = this.get_secret_dialog().get_$body().find('[data-id=create_content]'));
        },

        get_$change_content: function() {
            return this.$change_content || (this.$change_content = this.get_secret_dialog().get_$body().find('[data-id=change_content]'));
        },

        get_$success_content: function() {
            return this.$success_content || (this.$success_content = this.get_secret_dialog().get_$body().find('[data-id=success_content]'));
        },

        get_$success_title: function() {
            return this.$success_title || (this.$success_title = this.get_secret_dialog().$el.find('[data-id=success_title]'));
        },

        get_$success_info: function() {
            return this.$success_info || (this.$success_info = this.get_secret_dialog().$el.find('[data-id=success_info]'));
        },

        get_$success_pwd: function() {
            return this.$success_pwd || (this.$success_pwd = this.get_secret_dialog().$el.find('[data-id=success_pwd]'));
        },

        get_$del_pwd_check: function() {
            return this.$del_pwd_check || (this.$del_pwd_check = this.get_$change_content().find('[data-id=del_pwd_check]'));
        },

        get_$change_pwd_check: function() {
            return this.$change_pwd_check || (this.$change_pwd_check = this.get_$change_content().find('[data-id=change_pwd_check]'));
        },

        get_$change_pwd_text: function() {
            return this.$change_pwd_text || (this.$change_pwd_text = this.get_$change_content().find('[data-id=change_pwd_text]'));
        },

        get_$msg_tip: function() {
            return this.$msg_tip || (this.$msg_tip = this.get_secret_dialog().$el.find('[data-id=msg_tip]'));
        },

        get_$ok_btn: function() {
            return this.$ok_btn || (this.$ok_btn = this.get_secret_dialog().$el.find('[data-btn-id=OK]'));
        }
    });

    return secret;
});/**
 * 外链管理模块
 * @author hibincheng
 * @date 2013-8-15
 */
define.pack("./share",["lib","common","main","./Module","./Loader","./Mgr","./View","./header"],function(require, exports, module){
    var
        lib = require('lib'),
        common = require('common') ;

    var inherit = lib.get('./inherit'),
        Store = lib.get('./data.Store'),
        Record = lib.get('./data.Record'),
        console = lib.get('./console'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
	    huatuo_speed = common.get('./huatuo_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        header = require('./header'),

        scroller,
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        undefined;
    
    var store = new Store();
    var loader = new Loader();
    var view = new View({
        header: header,
        store : store
    });

    header.bind_store(store);//绑定数据源

    var mgr = new Mgr({
        header: header,
        view: view,
        loader: loader,
        store: store,
        step_num: STEP_NUM
    });

    var module = new Module({
        name : 'share',
        list_view : view,
        list_header: header,
        loader: loader,
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
	                var flag = '21254-1-14';
	                if(window.g_start_time) {
		                huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
		                huatuo_speed.report();
	                }
                } catch(e) {

                }

                mgr.load_files(0, first_page_num);

                scroller = main_ui.get_scroller();


                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }

            /**
             * new by maple
             */
            header.render();

            this.listenTo(global_event, 'share_refresh', this.on_refresh);
            this.listenTo(global_event, 'window_resize', this.on_win_resize);
//            this.listenTo(global_event, 'window_scroll', this.on_win_scroll);
            //this.listenTo(scroller, 'resize', this.on_win_resize);
            this.listenTo(scroller, 'scroll', this.on_win_scroll);
        },
        on_activate: function() {
            var me = this;
            me.init();
            //document.title = '分享的链接 - 微云';

            main_ui.sync_size();
        },

        on_deactivate: function() {
            var me = this;

            me.set_selected_false();

            this.stopListening(global_event, 'window_resize', this.on_win_resize);
            //this.stopListening(global_event, 'window_scroll' , this.on_win_scroll);
            //this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'share_refresh', this.on_refresh, this);
        },

        /**
         * 把store中选中状态置否，并且触发view中的selected_change事件重新渲染顶部编辑态
         */
        set_selected_false: function () {
            var me = this;

            store.each(function (rec, id) {
                rec.set('selected', false);
            });
            me.list_view.trigger('select_change');
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }

            mgr.load_files(0, first_page_num, is_from_nav === false ? false : true);
            loader.set_checkalled(false);
            if(is_from_nav !== false) {
                user_log('NAV_SHARE_REFRESH');
            }
        },

        /**
         * 窗口大小改变时，判断是否需要加载更多数据
         * @param width window.width
         * @param height  window.height
         */
        on_win_resize: function(width, height) {
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.load_files(size, num - size);//从后加载
            }

        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files(store.size(), STEP_NUM);
            }
        }
    });

    return module.get_common_module();
});
//tmpl file list:
//share/src/secret/secret.tmpl.html
//share/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'secret_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$');
    __p.push('    <div id="_share_secret_pop_container" data-no-selection class="full-pop full-pop-small" close-box="true">\r\n\
        <h3 data-draggable-target class="full-pop-header __title"></h3>\r\n\
        <div class="full-pop-content __content">\r\n\
            <!--创建密码content-->\r\n\
            <div data-id="create_content" class="popshare-box popshare-pass-manage" style="display:none;">\r\n\
                <div class="create">\r\n\
                    <p class="infor">请输入您要创建的密码：</p>\r\n\
                    <div class="buf-password"><input style="ime-mode:disabled" name="create_pwd_text" data-id="pwd_text" type="text" maxlength="6" value=""></div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!--修改密码content-->\r\n\
            <div data-id="change_content" class="popshare-box popshare-pass-manage" style="display:none;">\r\n\
                <div class="change">\r\n\
                    <div class="del"><i data-id="del_pwd_check" class="ico"></i><span data-id="del_pwd_check_tip">删除密码</span></div>\r\n\
                    <div class="edit buf-password"><i data-id="change_pwd_check" class="ico ico-checked"></i><span data-id="change_pwd_check_tip">修改密码</span><input style="ime-mode:disabled" name="change_pwd_text" data-id="change_pwd_text" type="text" maxlength="6" value=""></div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!--成功content-->\r\n\
            <div data-id="success_content" class="popshare-box popshare-pass-manage" style="display:none;">\r\n\
                <div class="success">\r\n\
                    <div class="msg"><i class="ico"></i><span data-id="success_title"></span></div>\r\n\
                    <p data-id="success_info" class="infor"></p>\r\n\
                    <p data-id="success_pwd" class="pass"></p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="full-pop-btn __buttons">\r\n\
            <span class="infor" data-id="msg_tip" style="display:none;"></span>');

            $.each(data.buttons || [], function(i, btn) {
            __p.push('                ');
if(btn.id=='COPY') { __p.push('                    <a data-clipboard-target-pop  type="button" data-btn-id="');
_p(btn.id );
__p.push('" class="g-btn ');
_p(btn.klass );
__p.push('" href="#" ><span class="btn-inner">');
_p( btn.text );
__p.push('</span></a>');
 } else { __p.push('                    <a type="button" data-btn-id="');
_p(btn.id );
__p.push('" class="g-btn ');
_p(btn.klass );
__p.push('" href="#" ><span class="btn-inner">');
_p( btn.text );
__p.push('</span></a>');
 } __p.push('            ');
 }); __p.push('        </div>\r\n\
        <a data-btn-id="CANCEL" href="#" class="full-pop-close" close-btn="true" title="关闭">×</a>\r\n\
    </div>');

}
return __p.join("");
},

'_main_bar1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="edit-item" data-action="bat_cancel_share"><i class="icon icon-cancel"></i><span class="text">取消分享</span></li>');

return __p.join("");
},

'_main_bar2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_share_view_header" class="act-panel-inner cleafix">\r\n\
        <p class="tit">分享的链接</p>\r\n\
    </div>');

return __p.join("");
},

'share_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_share_body" class="mod-list-group mod-list-group-share-links" data-label-for-aria="分享的链接内容区域">\r\n\
        <div id="_share_view_list" class="list-group-bd">\r\n\
            <ul class="list-group"></ul>\r\n\
        </div>');
_p( this.view_empty() );
__p.push('    </div>\r\n\
');

return __p.join("");
},

'file_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib'),
            common = require('common'),
            text = lib.get('./text'),
            Copy = common.get('./util.Copy'),
            click_tj = common.get('./configs.click_tj'),
            scr_reader_mode = common.get('./scr_reader_mode'),
            date_time = lib.get('./date_time'),

            read_mode = scr_reader_mode.is_enable(),

            records = data;

        var fixNum = function(num){
            var n = num - 0;
            if((n+'').length == 1){
                return '0'+n;
            }
            return n;
        };
        var getTimeFormat = function(time){
            time  = new Date(time * 1000); //cgi返回的是秒的单位
            var today = date_time.today().getTime();
            var yesterday = date_time.yesterday().getTime();
            if(time >= today){
                return '今天 '+fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            } else if(time >= yesterday){
                return '昨天 '+fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            } else {
                return time.getFullYear() + '-' + ( time.getMonth() + 1) + '-' + time.getDate() + ' ' + fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            }
        };
        var getRemainTimeFormat = (function() {
            var one_hour = 60*60;
            var one_day = 24*one_hour;
            return function(time) {
                var remain_hour = Math.ceil(time/one_hour);
                var remain_day = Math.ceil(time/one_day);
                if(remain_hour > 0 && remain_hour < 24) {
                    return '<span style="color:#ec202c">剩余'+remain_hour+'小时</span>';
                } else if(remain_day > 1) {
                    return '剩余'+remain_day+'天';
                } else {
                    return '已失效';
                }
            }
        })();
        // 点击显示更多：list-more
        $.each(records, function(i, file) {
            var result=file.get('result');
            var is_normal=(result==0);
            var RET_MSG_MAP = {
                114200: '文件已被删除',
                114503: '非法举报',
                20002: '链接已过期，请联系分享者重新分享。',
                20003: '外链使用次数已用完，请联系分享者重新分享。'
            };
            var share_name = file.get('share_name') ? file.get('share_name') : '该文件已被删除，分享链接已失效';
            var text_name = text.text(share_name);
            var is_note = (file.get('share_flag') == 2);
            __p.push('        <li id="share-item-');
_p(file.id);
__p.push('" data-record-id="');
_p(file.id);
__p.push('" data-file-id data-list="file" class="list-group-item ');
_p(result ? 'list-link-disabled' : '');
__p.push(' ');
_p(file.get('selected') ? 'act' : '');
__p.push('">\r\n\
            <div class="item-tit">\r\n\
                <div class="label" tabindex="0"><i class="icon icon-check-s j-icon-checkbox"></i></div>\r\n\
                <div class="thumb"><i class="icon icon-m icon-shared-link-m"></i></div>\r\n\
                <div class="info">\r\n\
                    <span data-name="file_name" class="tit" title="');
_p(text_name);
__p.push('">');
_p(text_name);
__p.push('</span>\r\n\
                    <span class="tit tit-sub">');
if (!result) {__p.push('链接 <a target="_blank" href="');
_p(file.get('raw_url'));
__p.push('" class="txt txt-link" tabindex="-1">');
_p(file.get('raw_url'));
__p.push('</a>');
} else {_p(RET_MSG_MAP[result] || '链接信息获取失败');
}__p.push('                    </span>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="item-info">\r\n\
                <span class="item-info-list">\r\n\
                    <span class="mod-act-list">');
 if(is_normal){ __p.push('                            <a data-action="view_share" tabindex="0" class="act-list" title="分享链接" aria-hidden="true" aria-label="分享链接" href="#"><i class="icon icon-share"></i></a>');
 if(Copy.can_copy()) { __p.push('                                <a data-clipboard-target data-action="copy_share" tabindex="-1" class="act-list" title="复制" aria-hidden="true" aria-label="复制" href="#"><i class="icon icon-copy"></i></a>');
 } __p.push('                            ');
 if(!is_note) { __p.push('                                ');
 if(!file.get('share_pwd')) {__p.push('                                    <a data-action="create_pwd" class="act-list" tabindex="-1" title="公开链接" aria-hidden="true" aria-label="公开链接" href="#"><i class="icon icon-pw"></i></a>');
} else { __p.push('                                    <a data-action="manage_pwd" class="act-list has-pw" tabindex="-1" title="私密链接" aria-hidden="true" aria-label="私密链接" href="#"><i class="icon icon-pw"></i></a>');
 } __p.push('                            ');
 } __p.push('                        ');
 } __p.push('                        <a data-action="cancel_share" class="act-list" tabindex="-1" title="取消分享" aria-hidden="true" aria-label="取消分享" href="#"><i class="icon icon-share-cancel"></i></a>\r\n\
                    </span>\r\n\
                </span>\r\n\
                <span class="item-info-list">\r\n\
                    <span class="mod-status-list">');
 if (!result){ __p.push('                            <span class="txt txt-status" tabindex="0">');
_p((is_normal ? file.get('share_pwd') ?'私密' : '公开':'已失效'));
__p.push('</span>');
 } else { __p.push('                            <span class="txt txt-status" tabindex="0">已失效</span>');
 } __p.push('                        <span class="txt txt-status" tabindex="0">浏览');
_p(file.get('view_cnt')>=0?file.get('view_cnt'):'-');
__p.push('次</span>\r\n\
                        <span class="txt txt-status" tabindex="0">下载');
_p(file.get('down_cnt')>=0?file.get('down_cnt'):'-');
__p.push('次</span>\r\n\
                    </span>\r\n\
                </span>\r\n\
                <span class="item-info-list">\r\n\
                    <span class="txt txt-time" tabindex="0">');
_p(getTimeFormat(file.get('create_time')));
__p.push(' 分享</span>\r\n\
                </span>\r\n\
                <span class="item-info-list">\r\n\
                    <span class="txt txt-time" tabindex="0">');
_p(getRemainTimeFormat(file.get('remain_time')));
__p.push('</span>\r\n\
                </span>\r\n\
            </div>\r\n\
        </li>');

    });
    __p.push('');

return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_share_view_empty" class="g-empty share-empty" aria-label="分享的链接没有内容" tabindex="0">\r\n\
        <div class="empty-box">\r\n\
            <div class="status-inner">\r\n\
                <i class="icon icon-noshare"></i>\r\n\
                <p class="txt">快把你的文件分享给好友吧！</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>正在加载</a>');

return __p.join("");
}
};
return tmpl;
});
