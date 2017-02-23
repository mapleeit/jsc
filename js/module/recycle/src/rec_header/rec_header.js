/**
 * 回收站列表头
 * @author bondli
 * @date 13-10-31
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Scroller = common.get('./ui.scroller'),
        tmpl = require('./tmpl'),
        rec_list = require('./rec_list.rec_list'),

        main_ui = require('main').get('./ui'),

        checkalled = false,
        action_property_name = 'data-action',
        checkalled_class = 'checkalled',

        file_item_height = 47,//文件列表中每一项的高度
        current_has_scrollbar = false,


        undef;

    var rec_header = new Module('rec_header', {

        render: function () {
            var main_ui = require('main').get('./ui');
            var selection = require('./rec_list.selection.selection');

            this
                .on('activate', function () {
                    // 监听取消全选
                    this.listenTo(selection, 'cancel_checkall', this.cancel_checkall);
                    // 监听设置全选
                    this.listenTo(selection, 'set_checkall', this.checkall);

                    //同步滚动条宽度到表头
                    this.listenTo(rec_list, 'load', this.sync_scrollbar_width_if);
                    this.listenTo(rec_list, 'restore_has_ok', this.sync_scrollbar_width_if);
                    this.listenTo(main_ui.get_scroller(), 'resize', this.sync_scrollbar_width_if);
                })
                .on('deactivate', function () {
                    // 停止监听取消全选
                    this.stopListening(selection, 'cancel_checkall', this.cancel_checkall);
                    // 停止监听设置全选
                    this.stopListening(selection, 'set_checkall', this.checkall);

                    this.stopListening(rec_list, 'load', this.sync_scrollbar_width_if);
                    this.stopListening(rec_list, 'restore_has_ok', this.sync_scrollbar_width_if);
                    this.stopListening(main_ui.get_scroller(), 'resize', this.sync_scrollbar_width_if);

                    this.cancel_checkall();
                    checkalled = false;
                });

            if(!this.rendered) {
                this.$el = $(tmpl.rec_file_header()).appendTo(this.get_$el());
                this.rendered = true;

                var me = this;

                //监听全选按钮点击事件
                this.$el.on('click', '[data-action=checkall]', function(e){
                    $(this).toggleClass(checkalled_class);
                    checkalled = !checkalled;
                    me.trigger('action', 'checkall', checkalled, e);
                });
            }
        },

        /**
         * 根据列数数据多少判断是否出现滚动条，决定是否要同步滚动条宽度到表头
         */
        sync_scrollbar_width_if: function() {
            var files_total = rec_list.get_loaded_files().length,
                body_box_height = main_ui.get_$body_box().height();

            if(files_total * file_item_height > body_box_height) {//出现滚动条
                this._sync_scrollbar_width(true);
            } else {
                this._sync_scrollbar_width(false);
            }
        },

        /**
         * 当内容区出现滚动条时，要修正表头宽度，不然会出现不对齐现象
         * @param {Boolean} has_scrollbar 是否出现了滚动条
         */
        _sync_scrollbar_width: function(has_scrollbar) {
            var scrollbar_width,
                padding_right;

            if(has_scrollbar === current_has_scrollbar) {
                return;
            }
            scrollbar_width = Scroller.get_scrollbar_width();
            padding_right = has_scrollbar ? scrollbar_width : 0;
            this.get_$el().find('.recycle-head').css('paddingRight', padding_right + 'px');//需要同步滚动条宽度不会很常操作，一般就一次，直接用选择器了
            current_has_scrollbar = has_scrollbar;

        },

        get_$el: function () {
            return $('#_rec_file_header');
        },

        //全选按钮
        get_$checkall: function() {
            return this.$checkall || (this.$checkall = this.$el.find('[data-action=checkall]'));
        },

        /**
         * 更改全选，当选择/取消选择一条记录时，动态更改全选状态
         * @param {Boolean} new_checkalled
         */
        checkall: function(new_checkalled) {
            if(new_checkalled !== checkalled) {
                this.get_$checkall().toggleClass(checkalled_class, new_checkalled);
                checkalled = new_checkalled;
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
        }
    });

    return rec_header;
});