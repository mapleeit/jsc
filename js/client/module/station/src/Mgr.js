/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        cookie = lib.get('./cookie'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        constants = common.get('./constants'),
        global_event = common.get('./global.global_event'),
        mini_tip = common.get('./ui.mini_tip'),

        file_qrcode,
        Remover = require('./Remover'),

        share_enter,
        undefined;

    var Mgr = inherit(Event, {

        step_num: 20,

        init: function(cfg) {
            $.extend(this, cfg);
            this.bind_events();
        },

        bind_events: function() {
            //监听列表项发出的事件
            if(this.view) {
                this.listenTo(this.view, 'action', function(action_name, record, e){
                    e.preventDefault();
                    this.process_action(action_name, record, e);
                }, this);
                this.listenTo(this.view, 'box_select', this.on_box_select, this);
            }
            //监听头部发出的事件（工具栏（取消分享）、表头（全选，排序操作））
            if(this.header) {
                this.listenTo(this.header, 'action', function(action_name, data, e) {

                    if(action_name === 'checkall' || action_name === 'change_checkall') {
                        this.process_action(action_name, data, e);
                        return;
                    }
                    var records = this.view.get_selected_files();
                    if(action_name !== 'refresh' && !records.length) {
                        console.warn('请选择文件');
                        return;
                    }
                    e = data;
                    this.process_action(action_name, records, e);
                }, this);
            }
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
            this.view.select_all_files(checkalled);
            console.log('on_checkall');//保持原有逻辑，直接触发
        },

        /**
         * 刷新操作
         * @param e
         */
        on_refresh: function(e) {
            console.log('station_refresh');//保持原有逻辑，直接触发
            global_event.trigger('station_refresh', true);//保持原有逻辑，直接触发
        },

        on_open: function(records, e) {
            console.log('on_open');//保持原有逻辑，直接触发
            var cur_record = $.isArray(records) ? records[0] : records;
            //目录点击文件点支持图片预览
            if(!cur_record.is_image()) {
                this.on_download(records, e);
                return;
            }
            //todo 预览图片
        },

        preview_image: function(record) {
            console.log('预览图片');//保持原有逻辑，直接触发
        },

        on_delete: function(records, e) {
            console.log('on_delete');//保持原有逻辑，直接触发
            records = $.isArray(records) ? records : [records];
            var me = this;
            records = [].concat(records);
            //this.remover = this.remover || new Remover();
            Remover.remove_confirm(records).done(function() {
                console.log('remove_confirm complete');//保持原有逻辑，直接触发
                me.header.get_column_model().cancel_checkall();
                global_event.trigger('station_refresh', true);//删除文件后刷新页面
                me.header.update_info();
            });
        },

        on_share: function(records, e) {
            if(records.length == 0) {
                mini_tip.warn('请选择笔记');
                return
            }
            if(!share_enter) {
                require.async('share_enter', function(mod) {
                    share_enter = mod.get('./share_enter');
                    share_enter.start_share(records, true);
                });
            } else {
                share_enter.start_share(records, true);
            }
        },

        on_download: function(records, e) {
            console.log('on_download');//保持原有逻辑，直接触发
            records = $.isArray(records) ? records : [records];
            var data = {},
                fileList = [],
                file;
            records.forEach(function(item) {
                file = {};
                file.fileName  = item.get_name();
                file.fileSize  = item.get_size();
                file.fileID    = item.get_id();
                file.pFolderID = item.get_pdir_key();
                fileList.push(file);
            });
            data.fileList = fileList;
            window.external.ClickDownload( JSON.stringify(data) );
        },

        on_qrcode: function(record, e) {
            record = $.isArray(record) ? record : [record];
            if(!file_qrcode) {
                require.async('file_qrcode', function (mod) {
                    file_qrcode = mod.get('./file_qrcode');
                    file_qrcode.show(record, true);
                });
            } else {
                file_qrcode.show(record, true);
            }
        },

        on_select: function() {
            console.log('on_select');
            var is_checkalled = this.header.get_column_model().is_checkalled(),
                total_files_size = this.view.get_total_size(),
                select_files = this.view.get_selected_files();
            if(is_checkalled && select_files.length !== total_files_size) {
                this.header.get_column_model().cancel_checkall();
            } else if(!is_checkalled && select_files.length === total_files_size) {
                this.header.get_column_model().make_checkall();
            }
        },
        /**
         * 分批加载数据
         * @param offset 开始的下标
         * @param num 加数的数据量
         * @param is_refresh 是否是刷新列表
         */
        load_files: function(offset, num, is_refresh) {
            var me = this;

            this.loader.load({
                start: offset,
                count: num,
                get_abstract_url: true
            }, function(rs) {
                if(offset === 0 || is_refresh) {
                    me.store.clear();
                    me.store.init(rs);
                    //var now = new Date();
                    //$('[data-id="bubbble_hint"]').text(rs.file_list.length + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + rs.file_list.length);
                    //me.store.init(rs);
                } else {
                    me.store.add(rs);
                }
            });
        }
    });

    //$.extend(Mgr, events);
    return Mgr;
});