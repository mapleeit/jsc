/**
 * 管理器
 * @author xixinhuang
 * date 2015-11-12
 */
define(function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        tmpl = require('./tmpl'),

        toolbar = require('./header.toolbar'),
        station_info = require('./header.station_info'),
        cm = require('./header.column_model'),

        file_item_height = 47,//文件列表中每一项的高度

        undefined;

    var header = new Module('header', {

        bind_store: function(store) {
            var old_store = this.store;
            if(old_store) {
                old_store.off('datachanged', this._detect_data_empty, this);
                old_store.off('clear', this._detect_hide_column_model, this);
                old_store.off('update', this.on_data_update, this);
            }

            store.on('datachanged', this._detect_data_empty, this);
            store.on('clear', this._detect_hide_column_model, this);
            store.on('update', this.on_data_update, this);
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
            if(!this.is_activated()) {
                return;
            }
            if(store_size === 0) {//无数据时，不显示工具栏和表头
                //tbar.hide();
                cm.hide();
            } else {
               // tbar.show();
                cm.show();
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

            this.$toolbar_ct = $bar1_ct;
            this.$column_model_ct = $column_ct;

            this._render_toolbar($bar1_ct);

            this._render_column_model($column_ct);

            this._bind_action();
        },

        update_info: function() {
            console.log('update_info');
            //station_info.update_info();
        },

        _render_toolbar: function($bar1_ct) {
            //toolbar.render($bar1_ct);
        },

        _render_column_model: function($bar2_ct) {
            //cm.render($bar2_ct);
        },

        _bind_action: function() {
            var me = this,
                array_concat = Array.prototype.concat;
            //把toolbar,cm的action事件统一向外抛
            this.listenTo(cm, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
                //console.log('toolbar/_bind_action:' + arguments);
            });
            this.listenTo(toolbar, 'action', function() {
                me.trigger.apply(me, array_concat.apply(['action'],arguments));
                //console.log('header/_bind_action:' + arguments);
            });
        },

        get_column_model: function() {
            return cm;
        },

        get_toolbar: function() {
            return toolbar;
        },
        show: function(){
           this.get_$column_model_ct().show();
            this._activated = true;
        },
        hide: function() {
            this.get_$column_model_ct().hide();
            this._activated = false;
        },

        is_activated: function() {
            return this._activated;
        },

        get_$toolbar_ct: function() {
            return this.$toolbar_ct;
        },

        get_$toolbar: function() {
            return this.$toolbar || (this.$toolbar = $('#_station_toolbar'));
        },

        get_$column_model_ct: function() {
            return this.$column_model_ct;
        },

        destroy: function() {
            this.bind_store(null);
        }
    });

    return header;
});