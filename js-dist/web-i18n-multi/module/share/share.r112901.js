//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/module/share/share.r112901",["lib","common","$","i18n","main"],function(require,exports,module){

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
//share/src/header/column_model.js
//share/src/header/header.js
//share/src/header/share_info.js
//share/src/header/toolbar.js
//share/src/secret/secret.js
//share/src/share.js
//share/src/header/header.tmpl.html
//share/src/secret/secret.WEB.tmpl.html
//share/src/view.tmpl.html

//js file list:
//share/src/Loader.js
//share/src/Mgr.js
//share/src/Module.js
//share/src/View.js
//share/src/header/column_model.js
//share/src/header/header.js
//share/src/header/share_info.js
//share/src/header/toolbar.js
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
        REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg',
        DEFAULT_CMD = 'get_share_list',

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
                .post({
                    url: REQUEST_CGI,
                    cmd: DEFAULT_CMD,
                    re_try:3,
                    header:{"uin":query_user.get_uin_num()},
                    body: cfg
                })
                .ok(function(msg, body) {
                    var records_arr = me.generate_files(body.items || []),
                        total;
                    total = {public_num : body.total-body.private_num, private_num: body.private_num};

                    me._all_load_done = !!body.end;//是否已加载完

                    if(body.total == 0) {//总数为空时，后台竞然返回的end字段为false，这里再作下判断
                        me._all_load_done = true;
                    }

                    def.resolve(records_arr, total);
                    me.trigger('load', records_arr);
                })
                .fail(function(msg, ret) {
                    //114300　表示所有分享已被取消可以当作没有分享外链．
                    if(ret==114300){
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
 * @date 2013-8-19
 */
define.pack("./Mgr",["lib","common","$","i18n","./secret.secret"],function(require, exports, module){
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
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        progress = common.get('./ui.progress'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),

        _ = require('i18n').get('./pack'),
        l_key = 'share',

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
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    this.process_action(action_name, record, e);
                }, this);
                this.listenTo(this.view, 'box_select', this.on_box_select, this);
            }
            //监听头部发出的事件（工具栏（取消分享）、表头（全选，排序操作））
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
                    this.update_share_total_count({//更新分享数
                        private_num: 1,
                        public_num: -1
                    });
                },
                'change_pwd_success' : function(record, pwd) {
                    record.set('share_pwd', pwd);
                },
                'delete_pwd_success' : function(record) {
                    record.set('share_pwd', '');
                    this.update_share_total_count({//更新分享数
                        private_num: -1,
                        public_num: 1
                    });
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
         * 框选处理，更改表头全选状态
         */
        on_box_select: function() {
            this.header.on_data_update(this.store);
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

            if(this.header.get_column_model().is_checkalled()) {//全选则取消所有
                this.on_cancel_all_share();
                return;
            }

            selecteds = $.grep(store.data, function(item) {
                    if(item.get('selected')) {
                        return true;
                    }
                });
            if(selecteds.length === 0) {
                mini_tip.warn(_(l_key,'请选择链接'));
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
                request.post({
                    url: 'http://web.cgi.weiyun.com/wy_share.fcg',
                    cmd: 'clear_share',
                    header:{"uin":query_user.get_uin_num()}
                }).done(function(msg,ret){
                     if(ret==0){
                        //store.clear操作无法切换成无分享链接时的UI界面,因此直接重新加载一个空数组
                        me.store.load([]);
                        mini_tip.ok(_(l_key,'已取消分享'));
                     }else if(ret==114400){    //部分删除成功
                       var INIT_NUM = 50,
                           LINE_HEIGHT= 47;
                       var num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), INIT_NUM);
                       me.load_files(0,num);
                       mini_tip.warn(_(l_key,'部分分享链接取消失败'));
                     }else{  // 其他情况
                       mini_tip.error(msg);
                     }
                });
            }
            widgets.confirm(_(l_key,'取消分享'), _(l_key,'您确定取消全部分享吗？'), _(l_key,'取消分享后，分享链接将被删除。'), _do_cancel_all_share, null, [_(l_key,'是'), _(l_key,'否')]);
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
                del_num_limit=10,  //cgi限制的一次批量取消分享的个数
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
                };
                request.post({
                    url: 'http://web.cgi.weiyun.com/wy_share.fcg',
                    cmd: 'cancel_share',
                    header:{"uin":query_user.get_uin_num()},
                    body: {
                        key_list: key_list
                    }
                })
                    .ok(function(msg, body) {
                        var fail_list=body.fail_list,
                            del_records=del_record_slice;
                        //在要删除的记录数组中，剔除删除失败的记录。
                        if(fail_list.length>0){
                            del_records=$.grep(del_record_slice,function(item){
                                return me._contain(item.get('share_key'),fail_list);
                            });
                        }
                        //记录取消分享成功的总数， 与取消成功相应的记录
                        $.each(del_records, function(i, record) {
                            del_success_record.push(del_records[i])
                            del_success_num++;
                            if(!record.get('share_pwd')) {
                                del_success_public_num++;
                            } else {
                                del_success_private_num++;
                            }
                        });

                    }).done(function(msg,ret){
                        //判断删除的情况
                        start+=del_num_limit;
                        if(start>=del_total){
                            //store没有提供批量接口，因此一个个的将记录移除
                            $.each(del_success_record, function(i) {
                                me.store.remove(del_success_record[i]);
                            });
                            //隐藏删除进度
                            progress.hide();
                            //判断删除情况给出相应的提示
                            if(del_total==del_success_num){
                                mini_tip.ok(_(l_key,'已取消分享'));
                            }else if(del_success_num > 0){
                                mini_tip.warn(_(l_key,'部分分享链接取消失败'));
                            }else{
                                mini_tip.error(_(l_key,'分享链接取消失败:')+msg);
                            }
                            me.supply_files_if();//删除了多少节点，要相应补上
                            me.update_share_total_count({
                                private_num: -del_success_private_num,
                                public_num: -del_success_public_num
                            });
                        }else{
                            //显示当前删除进度， 递归调用该方法取消剩余的分享
                            var title = text.format(_(l_key,'正在取消第{0}/{1}个分享链接'), [start, del_total]);
                            progress.show(title, false, true);
                            _do_cancel_share();
                        }
                    });
            }
            widgets.confirm(_(l_key,'取消分享'), _(l_key,'您确定取消分享吗？'), _(l_key,'取消分享后，分享链接将被删除。'), _do_cancel_share, null, [_(l_key,'是'), _(l_key,'否')]);
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
                if(text===json[i].share_key){
                    // 114300 表示服务端没有找到该数据， WEB端可认为是删除成功。
                    if(json[i].ret !=114300){
                        return false;
                    }else{
                        return true;
                    }
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
                pwd = pwd ? '（'+_(l_key,'密码')+'：' + pwd + '）'  : '';
                link = pwd ? _(l_key,'链接')+'：' + record.get('raw_url') : record.get('raw_url');
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
                me.update_share_total_count(total, true);
            });
        },
        /**
         * 更新分享数
         * @param {Object} count 要更新的分享数
         * @param {Boolean} is_refresh 是否事个数据刷新，而不是在原基础上加或减
         */
        update_share_total_count: function(count, is_refresh) {
            this.header.get_share_info().update_share_total_count(count, is_refresh);
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
                header.render(this.$top_ct, this.$bar1_ct, this.$column_ct);
            }
            return header;
        },
        activate : function(){

            this.get_list_view().show();
            this.get_list_header().show();
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
            this.get_list_view().hide();
            this.get_list_header().hide();
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
define.pack("./View",["lib","common","$","./tmpl","main","i18n"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        View = lib.get('./data.View'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        ContextMenu = common.get('./ui.context_menu'),
        constants = common.get('./constants'),
        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip'),
        user_log = common.get('./user_log'),
        m_speed = common.get('./m_speed'),
        tmpl = require('./tmpl'),
        main_ui = require('main').get('./ui'),
        global_event = common.get('./global.global_event'),
        list_hover_class = 'list-hover',

        sel_box,

        get_el = function (id) { return document.getElementById(id); },

        _ = require('i18n').get('./pack'),
        l_key = 'share',

        undefined;

    var File_view = inherit(View, {

        list_selector: '#_share_view_list>.files',
        item_selector: 'div[data-file-id]',
        action_property_name: 'data-action',


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
                // $(this).toggleClass('ui-selected', value);
                if (sel_box)
                    sel_box.set_selected_status([this.attr('id')], value);
            },
            expanded: function (value) {
                $(this).toggleClass('list-more', value);
            }
        },

        get_record_by_id: function (id) {
            return this.store.get(id);
        },

        //插入记录，扩展父类
        on_add: function (store, records, index) {
            File_view.superclass.on_add.apply(this, arguments);

        },

        after_render: function () {
            File_view.superclass.after_render.apply(this, arguments);

            // 绑定右键
            this.on('recordcontextmenu', this.show_ctx_menu, this);

            // 点选，checkbox选择
            this.on('recordclick', this._handle_item_click, this);

            // 绑定按钮
            this.on('action', this._handle_action, this);
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
        },

        on_hide: function () {
            //因为contextmenu有复制且菜单是在body下的，所以事件是绑定在body上，为避免影响到其它模块的复制功能，所以切换模块时要进行销毁
            this.copy && this.copy.destroy();
            this.copy = null;
            this._disable_box_selection();
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
                me.trigger('box_select');
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

                this.get_$view_ct().addClass('ui-view-empty');
//                this.get_$view_empty().show();
//                this.get_$view_list().hide();
                //调整运营页高度
                //加入了一个空白的层，以修复头部边框bug。 后续需要jinfu用css样式控制 yuyanghe todo
                //this.get_$main_bar1().hide();
            } else {
                //加入了一个空白的层，以修复头部边框bug。 后续需要jinfu用css样式控制 yuyanghe todo  .show()命令会导致最近文件栏目出现bug
                //this.get_$main_bar1().css('display','');

                this.get_$view_ct().removeClass('ui-view-empty');
//                this.get_$view_empty().hide();
//                this.get_$view_list().show();
            }
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
            var is_checkbox = $target.closest('.checkbox', $record).length;
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
            // 如果按了shift，表示区域选择，同时不更新上次点击的记录
            if (e.shiftKey) {
                multi_select = true;
                expand_click = false;
                // 如果没有上次点击的记录，从起始开始
                start = last_click_record ? store.indexOf(last_click_record) : 0;
                end = index;
            } else { // 否则，只选或反选这条，记录当前操作的记录
                this.last_click_record = record;
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
                        text: _(l_key,'访问分享链接'),
                        icon_class: 'ico-link',
                        click: default_handle_item_click
                    },
                    {
                        id: secret ? 'manage_pwd' : 'create_pwd',
                        text: secret ? _(l_key,'密码管理') : _(l_key,'创建访问密码'),
                        icon_class: secret ? 'ico-lock' : 'ico-kill-lock',
                        click: default_handle_item_click
                    }
                ];

                if (Copy.can_copy()) {
                    items.push({
                        id: 'copy_share',
                        text: _(l_key,'复制分享链接'),
                        icon_class: 'ico-copy',
                        click: default_handle_item_click
                    });
                }
            }
            items.push({
                id: 'cancel_share',
                text: _(l_key,'取消分享'),
                icon_class: 'ico-kill-share',
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
                menu.$el.find('[data-item-id="copy_share"] a')
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
                        return _(l_key,'链接')+'：' + record.get('raw_url') + '（'+_(l_key,'密码')+'：' + share_pwd + '）';
                    }
                    return record.get('raw_url');
                }, this)
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok(_(l_key,'复制成功，粘贴给您的朋友吧'));
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn(_(l_key,'您的浏览器不支持该功能'));
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
            this.get_$view_ct().hide();
        },

        on_refresh: function () {
            this.last_expanded_record = null;
            this.last_click_record = null;
            this.set_$last_hover_item(null);
            this.get_$view_ct().show();
            //测速
            try {
                m_speed.done('share', 'first_page_show');
                m_speed.send('share');
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
            // return this.$view_empty || (this.$view_empty = $('#_share_view_empty'));
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
                    $el: $list,
                    $scroller: main_ui.get_scroller().get_$el(),
                    all_same_size: false,
                    keep_on: function ($tar) {
                        return $tar.is('label');
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
 * 外链管理列表表头
 * @author hibincheng
 * @date 2012-09-4
 */
define.pack("./header.column_model",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        Scroller = common.get('./ui.scroller'),
        tmpl = require('./tmpl'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        current_has_scrollbar = false,

        undefined;

    var toolbar = new Module('share_manage_toolbar', {

        render: function($ct) {

            if(!this.rendered) {
                this.$el = $(tmpl.columns()).appendTo($ct);
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', this.$el);
                if($target.is('[data-action=checkall]')) {
                    $target.toggleClass(checkalled_class);
                    checkalled = !checkalled;
                    me.trigger('action', 'checkall', checkalled, e);
                } else {
                    me.trigger('action', $target.attr(action_property_name), e);
                }
            });
        },
        /**
         * 更改全选，当选择/取消选择一条记录时，动态更改全选状态
         * @param {Boolean} new_checkalled
         */
        checkall: function(new_checkalled) {
            if(new_checkalled !== checkalled) {
                this.get_$checkall().toggleClass(checkalled_class, new_checkalled);
                checkalled = new_checkalled;
                this.trigger('action', 'change_checkall', new_checkalled);
            }
        },
        //取消全选
        cancel_checkall: function() {
            if(this.is_checkalled()) {
                this.get_$checkall().toggleClass(checkalled_class, false);
                checkalled = false;
            }
        },
        //是否已全选
        is_checkalled: function() {
            return checkalled;
        },
        /**
         * 当内容区出现滚动条时，要修正表头宽度，不然会出现不对齐现象
         * @param {Boolean} has_scrollbar 是否出现了滚动条
         */
        sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this.$el.find('.share-head').css('paddingRight', padding_right + 'px');//需要同步滚动条宽度不会很常操作，一般就一次，直接用选择器了
            current_has_scrollbar = has_scrollbar;

        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        },

        get_$checkall: function() {
            return this.$checkall || (this.$checkall = this.$el.find('[data-action=checkall]'));
        }
    });

    return toolbar;

});/**
 * 外链管理模块头部模块（包括分享信息、工具栏、列表表头三个子模块）
 * @author hibincheng
 * @date 2013-09-04
 */
define.pack("./header.header",["lib","common","$","./tmpl","main","./header.toolbar","./header.share_info","./header.column_model"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('share.header'),
        Module = common.get('./module'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        Scroller = common.get('./ui.scroller'),
        tmpl = require('./tmpl'),

        main_ui = require('main').get('./ui'),

        share_info,
        toolbar,
        cm,

        file_item_height = 47,//文件列表中每一项的高度

        undefined;

    var header = new Module('share_header', {

        bind_store: function(store) {
            var old_store = this.store;
            if(old_store) {
                old_store.off('datachanged', this._detect_data_empty, this);
                old_store.off('clear', this._detect_hide_column_model, this);
                old_store.off('update', this.on_data_update, this);
                old_store.off('remove', this.sync_scrollbar_width_if, this);
            }

            store.on('datachanged', this._detect_data_empty, this);
            store.on('clear', this._detect_hide_column_model, this);
            store.on('update', this.on_data_update, this);
            store.on('remove', this.sync_scrollbar_width_if, this);
            this.store = store;
        },

        _detect_hide_column_model: function() {
            this.get_column_model().hide();
        },

        //检查数据是否为空了
        _detect_data_empty: function() {
            var store_size = this.store.size(),
                cm = this.get_column_model(),
                tbar = this.get_toolbar();
            if(store_size === 0) {//无数据时，不显示工具栏和表头
                tbar.hide();
                cm.hide();
                this.get_share_info().hide_share_count();//分享数也隐藏
            } else {
                tbar.show();
                cm.show();
                this.sync_scrollbar_width_if();
                this.get_share_info().show_share_count();//分享数显示
            }
            main_ui.sync_size();
        },

        /**
         * 根据数据多少来判断是否会出现滚动条，并同步到表头
         */
        sync_scrollbar_width_if: function() {
            var store_size = this.store.size(),
                body_box_height = main_ui.get_$body_box().height(),
                cm = this.get_column_model();

            if(store_size * file_item_height > body_box_height) {//出现滚动条
                cm.sync_scrollbar_width(true);
            } else {
                cm.sync_scrollbar_width(false);
            }
        },

        on_data_update: function(store) {
            var checkalled = true,
                column_model = this.get_column_model();

            store.each(function(item) {
                if(!item.get('selected')) {//找到一个不是选中，则不是全选 // TODO 建议使用 collections.any()
                    checkalled = false;
                    return false; //break
                }
            });

            column_model.checkall(checkalled);
        },

        render: function($top_ct, $bar1_ct, $column_ct) {

            this.$share_info_ct = $top_ct;
            this.$toolbar_ct = $bar1_ct;
            this.$column_model_ct = $column_ct;
            //this.$el = $(tmpl.header()).appendTo(this.$ct);

            this._render_toolbar($bar1_ct);
            //web才把分享信息折开作为一个模块，appbox的分享信息是和toolbar放在一起的
            if(constants.UI_VER === 'WEB') {
                this._render_share_info($top_ct);
            } else {
                this._render_share_info(toolbar.get_$appbox_share_info_ct());
            }
            this._render_column_model($column_ct);

            this._bind_action();
        },

        _render_toolbar: function($bar1_ct) {
            toolbar = require('./header.toolbar');
            toolbar.render($bar1_ct);
        },

        _render_share_info: function($top_ct) {
            share_info = require('./header.share_info');
            share_info.render($top_ct);
        },

        _render_column_model: function($bar2_ct) {
            cm = require('./header.column_model');
            cm.render($bar2_ct);
        },

        _bind_action: function() {
            var me = this,
                array_concat = Array.prototype.concat;
            //把toolbar,cm的action事件统一向外抛
            this.listenTo(cm, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
            });
            this.listenTo(toolbar, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
            });
        },

        get_column_model: function() {
            return cm;
        },

        get_share_info: function() {
            return share_info;
        },

        get_toolbar: function() {
            return toolbar;
        },
        show: function(){
            //this.get_$toolbar().show();
            this.get_$share_info_ct().show();
            this.get_$column_model_ct().show();
        },
        hide: function() {
            //this.get_$toolbar().hide();
            this.get_$share_info_ct().hide();
            this.get_$column_model_ct().hide();
        },

        get_$toolbar_ct: function() {
            return this.$toolbar_ct;
        },

        get_$toolbar: function() {
            return this.$toolbar || (this.$toolbar = $('#_share_toolbar'));
        },

        get_$share_info_ct: function() {
            return this.$share_info_ct;
        },

        get_$column_model_ct: function() {
            return this.$column_model_ct;
        },

        destroy: function() {
            this.bind_store(null);
            //this.$el.remove();
        }
    });

    return header;
});/**
 * 分享信息模块
 * @author hibincheng
 * @date 2013-09-04
 */
define.pack("./header.share_info",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),

        undefined;

    var share_info = new Module('share_info', {

        render: function($ct) {
            if(!this.rendered) {
                if(constants.UI_VER === 'WEB') {
                    this.$el = $(tmpl.web_share_info()).appendTo($ct);
                } else {
                    this.$el = $(tmpl.appbox_share_info()).appendTo($ct);
                }
                this.rendered = true;
            }
        },
        /**
         * 更新分享数
         * @param {Object}count 更新数 包含公开数和私密数
         * @param {Boolean} is_refresh 是否事个数据刷新，而不是在原基础上加或减
         */
        update_share_total_count: function(count, is_refresh) {
            var old_public_num = parseInt(this.get_$public_count().text(), 10);
            var old_private_num = parseInt(this.get_$private_count().text(), 10);

            if(is_refresh) {
                this.get_$public_count().text(count.public_num || 0);
                this.get_$private_count().text(count.private_num || 0);
                return;
            }

            if(count.public_num) {
                this.get_$public_count().text(Math.max(old_public_num + count.public_num, 0));
            }
            if(count.private_num) {
                this.get_$private_count().text(Math.max(old_private_num + count.private_num, 0));
            }
        },

        hide_share_count: function() {
            this.get_$share_count_head().addClass('head-only');
        },

        show_share_count: function() {
            this.get_$share_count_head().removeClass('head-only');
            this.get_$share_count_ct().show();
        },

        get_$public_count: function() {
            return this.$public_count || (this.$public_count = this.$el.find('[data-id=public_count]'));
        },

        get_$private_count: function() {
            return this.$private_count || (this.$private_count = this.$el.find('[data-id=private_count]'));
        },

        get_$share_count_head: function() {
            return this.$share_count_head || (this.$share_count_head = this.$el.find('[class=head]'));
        },

        get_$share_count_ct: function() {
            return this.$share_count_ct || (this.$share_count_ct = this.$el.find('[data-id=share_count_ct]'));
        }
    });
    return share_info;

});/**
 * 外链管理工具栏模块
 * @author hibincheng
 * @date 2013-9-4
 */
define.pack("./header.toolbar",["lib","common","$","./tmpl"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        action_property_name = 'data-action',

        is_web_ui = constants.UI_VER === 'WEB',

        undefined;

    var toolbar = new Module('share_manage_toolbar', {

        render: function($ct) {
            if(!this.rendered) {
                if(is_web_ui) {
                    this.$el = $(tmpl.web_toolbar()).appendTo($ct);
                } else {
                    this.$el = $(tmpl.appbox_toolbar()).appendTo($ct);
                }
                this.rendered = true;
                this._bind_action();
            }
        },

        _bind_action: function() {
            var me = this;
            this.$el.on('click', '['+action_property_name+']',function(e){
                e.preventDefault();
                var $target = $(e.target).closest('['+action_property_name+']', me.$el);
                me.trigger('action', $target.attr(action_property_name), e);
            });
        },

        show: function() {
            this.$el.show();
            if(!is_web_ui) {//appbox
                this.get_$appbox_share_info_ct().show();
                this.get_$appbox_kill_btn().show();
                this.get_$appbox_share_info_empty().hide();
            }
        },

        hide: function() {
            if(!is_web_ui) {//appbox
                this.$el.show();
                this.get_$appbox_share_info_ct().hide();
                this.get_$appbox_kill_btn().hide();
                this.get_$appbox_share_info_empty().show();
            } else {
                this.$el.hide();
            }
        },

        get_$appbox_share_info_ct: function() {
            return this.$appbox_share_info_ct || (this.$appbox_share_info_ct = this.$el.find('[data-id=share_count_ct]'));
        },

        get_$appbox_share_info_empty: function() {
            return this.$share_info_empty || (this.$share_info_empty = this.$el.find('[data-id=share_info_empty]'));
        },

        get_$appbox_kill_btn: function() {
            return this.$kill_btn || (this.$kill_btn = this.$el.find('[data-action=bat_cancel_share]'));
        }
    });

    return toolbar;

});/**
 * 外链密码模块
 * @author bondli
 * @date 2013-9-16
 */
define.pack("./secret.secret",["lib","common","$","./tmpl","i18n"],function(require, exports, module){
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
        mini_tip = common.get('./ui.mini_tip'),
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

        _ = require('i18n').get('./pack'),
        l_key = 'share',

        undefined;

    var REQUEST_CGI = 'http://web.cgi.weiyun.com/wy_share.fcg',
        ADD_PASSWD_CMD = 'create_pwd',
        EDIT_PASSWD_CMD = 'modify_pwd',
        DEL_PASSWD_CMD = 'delete_pwd';

    var secret = new Module('secret', {

        set_passwd : function(sharekey, passwd, cmd){
            //删除密码不验证老密码，其他需要验证长度
            //if(passwd.length != 4 && cmd == EDIT_PASSWD_CMD) return;
            //验证传入的sharekey是否合法
            var def = $.Deferred();
            if(sharekey.length != 32) {
                def.reject('sharekey不合法');
                return;
            }
            //验证请求的命令字是否合法
            if( $.inArray(cmd,[ADD_PASSWD_CMD,EDIT_PASSWD_CMD,DEL_PASSWD_CMD]) == -1 ) return;

            var data = {share_key: sharekey};
            if(cmd != DEL_PASSWD_CMD){
                data = {
                    share_key: sharekey,
                    share_pwd: passwd
                };
            }

            request.post({
                url: REQUEST_CGI,
                cmd: cmd,
                header:{ "uin": query_user.get_uin_num() },
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
                    me.show_msg_tip(true, _(l_key,'链接复制成功'));
                })
                .listenTo(this.copy, 'copy_error', function() {
                    me.show_msg_tip(false, _(l_key,'链接复制成功'));
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
                title: _(l_key,'创建密码'),
                empty_on_hide: false,
                destroy_on_hide: false,
                tmpl: tmpl.secret_dialog,
                mask_bg: 'ui-mask-white',
                buttons: [{
                    id: 'OK',
                    text: _(l_key,'确定'),
                    disabled: true,
                    klass: 'btn-blue'
                }, {
                    id: 'COPY',
                    text: _(l_key,'复制链接和密码'),
                    disabled:true,
                    klass: 'btn-blue btn-copy'
                }, {
                    id: 'CLOSE',
                    text: _(l_key,'确定'),
                    disabled:true,
                    klass: 'btn-gray'
                }, {
                    id: 'CANCEL',
                    text: _(l_key,'取消'),
                    disabled: true,
                    klass: 'btn-gray'
                }],
                handlers: {
                    OK: function(e) {
                        e && e.preventDefault();
                        if(me.get_$ok_btn().is('.disabled')) {//禁用时，不进行操作
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
                    if(pwd.length === 4) {
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
                    if(me.get_$change_pwd_text().val().length === 4) {
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
                    dialog.set_title(_(l_key,'创建密码'));
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
                    dialog.set_title(_(l_key,'密码管理'));
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
                this.get_$success_title().text(_(l_key,'访问密码创建成功！'));
                pwd = this.get_$pwd_text().val();
            } else {
                this.get_$success_title().text(_(l_key,'密码修改成功！'));
                pwd = this.get_$change_pwd_text().val();
            }

            //this.get_$success_info().text('我通过微云给你分享了“' + share_name + '”');
            this.get_$success_pwd().text(_(l_key,'链接')+'：' + cur_record.get('short_url') + '（'+_(l_key,'密码')+'：' + pwd + '）');
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
                    mini_tip.ok(_(l_key,'密码删除成功'));
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
define.pack("./share",["lib","common","main","./Module","./Loader","./Mgr","./View","./header.header"],function(require, exports, module){
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
        m_speed = common.get('./m_speed'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),

        Module = require('./Module'),
        Loader = require('./Loader'),
        Mgr = require('./Mgr'),
        View = require('./View'),
        header = require('./header.header'),

        scroller,
        first_page_num,//首屏加载文件条数
        LINE_HEIGHT = 47,//列表每行的高度
        STEP_NUM = 20,//每次拉取数据条数
        inited = false,

        undefined;
    
    var store = new Store();
    var loader = new Loader();
    var view = new View({
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
        init: function() {
            if(!inited) {
                first_page_num = Math.max(Math.ceil(($(window).height() * 1.5) / LINE_HEIGHT), STEP_NUM);

                //测速
                try{
                    m_speed.start('share', 'first_page_show');
                } catch(e) {

                }

                mgr.load_files(0, first_page_num);

                scroller = main_ui.get_scroller();

                mgr.set_scroller(scroller);
                inited = true;
            } else {
                this.on_refresh(false);//每次模块激活都刷新
            }
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
            loader.abort();
            this.stopListening(global_event, 'window_resize', this.on_win_resize);
            //this.stopListening(global_event, 'window_scroll' , this.on_win_scroll);
            //this.stopListening(scroller, 'resize');
            this.stopListening(scroller, 'scroll');
            this.stopListening(global_event, 'share_refresh', this.on_refresh, this);
        },

        /**
         * 刷新操作
         */
        on_refresh: function(is_from_nav) {
            if(is_from_nav !== false) {
                store.clear();
            }
            //测速
            try{
                m_speed.start('share', 'first_page_show');
            } catch(e) {

            }

            mgr.load_files(0, first_page_num, is_from_nav === false ? false : true);
            header.get_column_model().cancel_checkall();
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
            console.log('share on_win_resize');
            var num = Math.ceil((height * 1.5) / LINE_HEIGHT),
                size = store.size();
            if(num > first_page_num) {//当窗口从小到大时才需要加载更多数据
                first_page_num = num;//保存新的首屏显示条数
                mgr.load_files(size, num - size);//从后加载
            }

            header.sync_scrollbar_width_if();//同步滚动条宽度到表头
        },

        /**
         * 滚动页面时加载更多数据
         */
        on_win_scroll: function() {
            console.log('share on_win_scroll');
            if (!loader.is_loading() && !loader.is_all_load_done() && scroller.is_reach_bottom()) {
                mgr.load_files(store.size(), STEP_NUM);
            }
        }
    });
    
    return module.get_common_module();
});
//tmpl file list:
//share/src/header/header.tmpl.html
//share/src/secret/secret.WEB.tmpl.html
//share/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'web_share_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib'),
            text = lib.get('./text'),
            _ = require('i18n').get('./pack'),
            l_key = 'share';
    __p.push('    <div class="inner">\r\n\
        <div class="share-top">\r\n\
            <div class="head" id=\'share_head\'>\r\n\
                <h2 class="title">');
_p(_(l_key,'分享的链接'));
__p.push('</h2>\r\n\
                <p class="con" data-id="share_count_ct" style="display:none;">');
_p(text.format(_(l_key,('{0}个公开分享')),['<span data-id="public_count"></span>']));
__p.push('&nbsp;&nbsp;');
_p(text.format(_(l_key,('{0}个私密分享')),['<span data-id="private_count"></span>']));
__p.push('</p>\r\n\
            </div>\r\n\
            <div class="infor">');
_p(_(l_key,'微云分享链接，不限下载次数，永久有效！'));
__p.push('</div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'appbox_share_info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var lib = require('lib'),
            text = lib.get('./text'),
            _ = require('i18n').get('./pack'),
            l_key = 'share';
    __p.push('    <div><p data-id="share_count_ct" style="display:none;">');
_p(text.format(_(l_key,('{0}个公开分享')),['<span data-id="public_count"></span>']));
__p.push('        &nbsp;&nbsp;');
_p(text.format(_(l_key,('{0}个私密分享')),['<span data-id="private_count"></span>']));
__p.push('    </div>');

return __p.join("");
},

'web_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- update jin 20130731 -->\r\n\
    <!-- .btn项hover状态使用.hover样式 -->\r\n\
    <!-- .btn项菜单弹出状态使用.on样式 -->\r\n\
    <!-- .btn项不可用状态使用.disable样式 -->');

    var _ = require('i18n').get('./pack'),
    l_key = 'share';
    __p.push('    <div id="_share_toolbar" class="toolbar-btn clear share-toolbar" style="display:none">\r\n\
        <a class="btn btn-kill-share" href="#" data-no-selection data-action="bat_cancel_share"><span class="btn-auxiliary"><i class="ico ico-kill-share"></i><span class="text">');
_p(_(l_key,'取消分享'));
__p.push('</span></span></a>\r\n\
        <a data-action="refresh" class="btn btn-ref" href="#"><span class="btn-auxiliary btn-notext"><i class="ico ico-ref"></i></span></a>\r\n\
    </div>');

return __p.join("");
},

'appbox_toolbar': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <!-- update jin 20130731 -->\r\n\
    <!-- .btn项hover状态使用.hover样式 -->\r\n\
    <!-- .btn项菜单弹出状态使用.on样式 -->\r\n\
    <!-- .btn项不可用状态使用.disable样式 -->');

    var _ = require('i18n').get('./pack'),
        l_key = 'share';
    __p.push('    <div id="_share_toolbar" class="toolbar-btn clear share-toolbar" style="display:none">\r\n\
        <a class="btn btn-kill-share" href="#" data-no-selection data-action="bat_cancel_share"><span class="btn-auxiliary"><i class="ico ico-kill-share"></i><span class="text">');
_p(_(l_key,'取消分享'));
__p.push('</span></span></a>\r\n\
        <a data-action="refresh" class="btn btn-ref" href="#"><span class="btn-auxiliary btn-notext"><i class="ico ico-ref"></i></span></span></a>\r\n\
        <div class="infor share-infor-ct" data-id="share_count_ct"></div>\r\n\
        <div data-id="share_info_empty" class="infor share-infor-empty">');
_p(_(l_key,'暂无分享'));
__p.push('</div>\r\n\
    </div>');

return __p.join("");
},

'columns': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var _ = require('i18n').get('./pack'),
    l_key = 'share';
    __p.push('        <div class="inner" style="display:none">\r\n\
            <div class="share-head">\r\n\
                <!-- list-hover 为ie6下hover样式 -->\r\n\
                    <span class="list name"><span class="wrap"><span class="inner">');
_p(_(l_key,'名称'));
__p.push('                        <label class="checkall" data-action="checkall" data-no-selection ></label>\r\n\
                    </span></span></span>\r\n\
                    <span class="list status"><span class="wrap"><span class="inner">');
_p(_(l_key,'状态'));
__p.push('<i class="gap"></i>\r\n\
                    </span></span></span>\r\n\
                    <span class="list time"><span class="wrap"><span class="inner">');
_p(_(l_key,'分享时间'));
__p.push('<i class="gap"></i>\r\n\
                    </span></span></span>\r\n\
                    <span class="list view"><span class="wrap"><span class="inner">');
_p(_(l_key,'浏览次数'));
__p.push('<i class="gap"></i>\r\n\
                    </span></span></span>\r\n\
                    <span class="list download"><span class="wrap"><span class="inner">');
_p(_(l_key,'下载次数'));
__p.push('<i class="gap"></i>\r\n\
                    </span></span></span>\r\n\
                    <span class="list" style="width:2%"></span>\r\n\
            </div>\r\n\
    </div>');

return __p.join("");
},

'secret_dialog': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    ');

        var $ = require('$'),
            _ = require('i18n').get('./pack'),
            l_key = 'share';
    __p.push('    <div id="_share_secret_pop_container" data-no-selection class="popshare-box popshare-pass-manage" close-box="true">\r\n\
        <h3 data-draggable-target class="popshare-head __title"></h3>\r\n\
        <div class="__content">\r\n\
            <!--创建密码content-->\r\n\
            <div data-id="create_content" class="popshare-main create" style="display:none;">\r\n\
                <p class="infor">');
_p(_(l_key,'请输入您要创建的密码：'));
__p.push('</p>\r\n\
                <div class="buf-password"><input style="ime-mode:disabled" name="create_pwd_text" data-id="pwd_text" type="text" maxlength="4" value=""></div>\r\n\
            </div>\r\n\
            <!--修改密码content-->\r\n\
            <div data-id="change_content" class="popshare-main change" style="display:none;">\r\n\
                <div class="del"><i data-id="del_pwd_check" class="ico"></i><span data-id="del_pwd_check_tip">');
_p(_(l_key,'删除密码'));
__p.push('</span></div>\r\n\
                <div class="edit buf-password"><i data-id="change_pwd_check" class="ico ico-checked"></i><span data-id="change_pwd_check_tip">');
_p(_(l_key,'修改密码'));
__p.push('</span>\r\n\
                    <input style="ime-mode:disabled" name="change_pwd_text" data-id="change_pwd_text" type="text" maxlength="4" value=""></div>\r\n\
            </div>\r\n\
            <!--成功content-->\r\n\
            <div data-id="success_content" class="popshare-main success" style="display:none;">\r\n\
                <div class="msg"><i class="ico"></i><span data-id="success_title"></span></div>\r\n\
                <p data-id="success_info" class="infor"></p>\r\n\
                <p data-id="success_pwd" class="pass"></p>\r\n\
            </div>\r\n\
        </div>\r\n\
        <div class="popshare-foot popshare-btn __buttons">\r\n\
            <span class="infor" data-id="msg_tip" style="display:none;"></span>');

            $.each(data.buttons || [], function(i, btn) {
            __p.push('                ');
if(btn.id=='COPY') { __p.push('                    <a data-clipboard-target-pop  type="button" data-btn-id="');
_p(btn.id );
__p.push('" class="');
_p(btn.klass );
__p.push('" href="#" ><span>');
_p( btn.text );
__p.push('</span></a>');
 } else { __p.push('                    <a type="button" data-btn-id="');
_p(btn.id );
__p.push('" class="');
_p(btn.klass );
__p.push('" href="#" ><span>');
_p( btn.text );
__p.push('</span></a>');
 } __p.push('            ');
 }); __p.push('        </div>\r\n\
        <a data-btn-id="CANCEL" href="#" class="popshare-close" close-btn="true" title="');
_p(_(l_key,'关闭'));
__p.push('"></a>\r\n\
    </div>');

}
return __p.join("");
},

'share_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="_share_body"  class="disk-view ui-view ui-listview disk-share">\r\n\
        <div id="_share_view_list">\r\n\
            <!-- 文件列表 -->\r\n\
            <div class="files"></div>\r\n\
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
            date_time = lib.get('./date_time'),

            records = data;

        var fixNum = function(num){
            var n = num - 0;
            if((n+'').length == 1){
            return '0'+n;
            }
            return n;
        };

        var _ = require('i18n').get('./pack'),
            l_key = 'share';

        var getTimeFormat = function(time){
            var time  = date_time.parse_str(time);
            var today = date_time.today().getTime();
            var yesterday = date_time.yesterday().getTime();
            if(time >= today){
                return _(l_key,'今天')+' '+fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            } else if(time >= yesterday){
                return _(l_key,'昨天')+' '+fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            } else {
                return time.getFullYear() + '-' + ( time.getMonth() + 1) + '-' + time.getDate() + ' ' + fixNum(time.getHours()) + ':' + fixNum(time.getMinutes());
            }
        };



        // 点击显示更多：list-more
        $.each(records, function(i, file) {
            var result=file.get('result');
            var is_normal=(result==0);
            var is_invalid = result == 114200;//失效链接
            var is_dirty = result != 0 && result != 114200;// result　０：正常，114200：源文件已被删除，其他则表示服务端错误
            var share_name = file.get('share_name');
            share_name = share_name && share_name!=''? share_name : _(l_key,'该文件已被删除，分享链接已失效');
            var is_note = (file.get('share_flag') == 2);
    __p.push('        <div id="_share_list_');
_p(file.id);
__p.push('" data-record-id="');
_p(file.id);
__p.push('" data-file-id data-list="file" class="list clear ');
_p( is_invalid ? 'list-link-disabled':'' );
__p.push('  ');
_p( file.get('selected') ? 'ui-selected':'' );
__p.push(' ');
_p( file.get('expanded') ? 'list-more':'' );
__p.push('">\r\n\
            <label class="checkbox"></label>\r\n\
            <span class="img"><i class="filetype icon-link"></i></span>\r\n\
            <span class="name"><p class="text"><em><span  title="');
_p(share_name);
__p.push('">');
_p(text.text(share_name));
__p.push('</span></em></p></span>\r\n\
                <span class="tool"><span class="inner">\r\n\
                    <a data-action="cancel_share" class="link-kill-share" title="');
_p(_(l_key,'取消分享'));
__p.push('" href="#"><i class="ico-kill-share"></i></a>');

                     if(is_normal){
                   __p.push('                        ');
 if(!is_note) { __p.push('                            ');
 if(!file.get('share_pwd')) {__p.push('                                <a data-action="create_pwd" class="link-lock" title="');
_p(_(l_key,'创建访问密码'));
__p.push('" href="#"><i class="ico-kill-lock"></i></a>');
} else { __p.push('                                <a data-action="manage_pwd" class="link-lock" title="');
_p(_(l_key,'密码管理'));
__p.push('" href="#"><i class="ico-lock"></i></a>');
 } __p.push('                        ');
 } __p.push('                        ');
 if(Copy.can_copy()) { __p.push('                            <a data-clipboard-target data-action="copy_share" class="link-copy" title="');
_p(_(l_key,'复制分享链接'));
__p.push('" href="#"><i class="ico-copy"></i></a>');
 } __p.push('                        <a data-action="view_share" class="link-link" title="');
_p(_(l_key,'访问分享链接'));
__p.push('" href="#"><i class="ico-link"></i></a>');
 } __p.push('                </span></span>');

            if(!is_dirty) {
            __p.push('            <span class="status"><span class="inner">');
_p((is_normal ? file.get('share_pwd') ?_(l_key,'私密') : _(l_key,'公开'):_(l_key,'已失效')));
__p.push('</span></span>');

            } else {//脏数据，一些服务端返回的有错误了
            __p.push('            <span class="status"><span class="inner">');
_p(file.get('share_pwd') ?_(l_key,'私密') : _(l_key,'公开') );
__p.push('</span></span>');

            }
            __p.push('            <span class="time"><span class="inner">');
_p(getTimeFormat(file.get('create_time')));
__p.push('</span></span>\r\n\
            <span class="view"><span class="inner">');
_p(file.get('view_cnt')>=0?file.get('view_cnt'):'-');
__p.push('</span></span>\r\n\
            <span class="download"><span class="inner">');
_p(file.get('down_cnt')>=0?file.get('down_cnt'):'-');
__p.push('</span></span>\r\n\
            <div class="more">');

                if(is_normal){
                __p.push('\r\n\
                <label>');
_p(_(l_key,'链接'));
__p.push('：</label><a data-action="view_share" ');
_p(click_tj.make_tj_str('SHARE_ITEM_CLICK'));
__p.push('  href="#" target="_blank">');
_p(file.get('raw_url'));
__p.push('</a>');
 if(file.get('share_pwd')) { __p.push('                <label>');
_p(_(l_key,'访问密码'));
__p.push('：</label><em data-id="share_pwd">');
_p(file.get('share_pwd'));
__p.push('</em>');
 } __p.push('                ');
 if(Copy.can_copy()) { __p.push('                <a data-clipboard-target data-action="copy_share" class="btn-copy" href="#" title="');
_p(_(l_key,'复制'));
__p.push('"></a>');
 } 
                } else if(is_dirty) {
                __p.push('                <label>');
_p(_(l_key,'链接信息获取失败'));
__p.push('</label>');
 } else { __p.push('                <label>');
_p(_(l_key,'文件已被删除'));
__p.push('</label>');
 } __p.push('            </div>\r\n\
        </div>');

    });
    __p.push('');

return __p.join("");
},

'view_empty': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div id="_share_view_empty" class="g-empty share-empty"><div class="inner"></div></div>');

}
return __p.join("");
},

'load_more': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var _ = require('i18n').get('./pack'),
            l_key = 'share';
    __p.push('    <a href="javascript:void(0)" class="load-more" style="display:none;"><i class="icon-loading"></i>');
_p(_(l_key,'正在加载'));
__p.push('</a>');

return __p.join("");
}
};
return tmpl;
});
