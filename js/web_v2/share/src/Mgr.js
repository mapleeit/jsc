/**
 * 通用的文件列表操作逻辑处理
 * @author hibincheng
 * @modified maplemiao
 * @date 2013-8-19
 */
define(function(require, exports, module){
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
});