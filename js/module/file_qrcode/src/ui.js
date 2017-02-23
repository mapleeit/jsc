/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-1-6
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        text = lib.get('./text'),
        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        widgets = common.get('./ui.widgets'),
        ui_center = common.get('./ui.center'),
        https_tool = common.get('./util.https_tool'),
        undefined;


    var ui = new Module('file_qrcode_ui', {
        _$file_qrcode_dialog: null,
        _$file_qrcode_pic: null,
        _$file_qrcode_name: null,
        _$file_qrcode_size: null,
        _$file_qrcode_icon: null,
        _$file_qrcode_mask:null,
        render: function () {

        },
        show: function (url, filename, size,icon) {
            var me = this;
            widgets.mask.show();
            me.get_$file_qrcode_dialog().appendTo($('body'));
            ui_center.listen(this._$file_qrcode_dialog);
            me.get_$dimensional_close().bind('click', function () {
                me.hide(icon);
                return false;
            });
            me.get_$dimensional_mask().bind('click',function(){
                me.hide(icon);
                return false;
            })
            me.set_pic(url);
            me.set_name(text.ellipsis_cut(filename,168,'...',text.create_measurer(me.get_$dimensional_name())));
            me.set_name_tip(filename);
            me.set_size(size);
            me.set_icon(icon);
            me.get_$file_qrcode_dialog().show();
        },

        hide: function (icon) {
            var me=this;
            widgets.mask.hide();
            this._$file_qrcode_dialog.hide();
            //移除添加的样式
            me.get_$dimensional_icon().removeClass('icon-'+icon + '-m');
            me.get_$dimensional_mask().unbind('click');

        },

        //获取下载弹出层对象
        get_$file_qrcode_dialog: function () {
            return this._$file_qrcode_dialog || ( this._$file_qrcode_dialog = $(tmpl.file_qrcode_box()) );
        },

        get_$dimensional_close: function () {
            return this._$file_qrcode_close || (this._$file_qrcode_close = this._$file_qrcode_dialog.find('#dimensional_close'));
        },

        get_$dimensional_pic: function () {
            return this._$file_qrcode_pic || (this._$file_qrcode_pic = this._$file_qrcode_dialog.find('#dimensional_code_pic'));
        },
        get_$dimensional_name: function () {
            return this._$file_qrcode_name || (this._$file_qrcode_name = this._$file_qrcode_dialog.find('#dimensional_code_name'));
        },
        get_$dimensional_size: function () {
            return this._$file_qrcode_size || (this._$file_qrcode_size = this._$file_qrcode_dialog.find('#dimensional_code_size'));
        },

        get_$dimensional_icon: function () {
            return this._$file_qrcode_icon || (this._$file_qrcode_icon = this._$file_qrcode_dialog.find('#dimensional_code_icon'));
        },

        get_$dimensional_mask:function(){
            return this._$file_qrcode_mask || (this._$file_qrcode_mask = $('#_widgets_mask'));
        },

        set_pic: function (url) {
            var _url = 'http://www.weiyun.com/php/phpqrcode/qrcode.php?data='
                + url + '&level=5&size=4';
            _url = https_tool.translate_url(_url);
            this.get_$dimensional_pic().attr('src', _url);
        },

        set_name: function (name) {
            this.get_$dimensional_name().text(name);

        },
        set_name_tip: function (name) {
            this.get_$dimensional_name().attr('title',name);

        },

        set_size: function (size) {
            this.get_$dimensional_size().text(size);
        },

        set_icon:function(icon){
            this.get_$dimensional_icon().addClass('icon-' + icon + '-m');
        }
    });

    return ui;
});

