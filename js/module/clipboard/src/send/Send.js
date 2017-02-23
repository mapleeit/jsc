/**
 * 剪贴板模块 发送tab
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),

        user_log = common.get('./user_log'),

        Editor = require('./send.Editor'),
        FootBar = require('./send.FootBar'),
        Mgr = require('./send.Mgr'),
        tmpl = require('./tmpl'),

        ie67 = $.browser.msie && $.browser.version < 8,

        undefined;

    var Send = inherit(Event, {

        name: 'send',

        title: '发送',

        constructor: function(cfg) {
            $.extend(this, cfg);
            this.mgr = new Mgr();
        },

        render: function($render_to) {

            if(this._rendered) {
                return;
            }

            this._$render_to = $render_to;
            this._$ct = $(tmpl.send()).appendTo($render_to);
            this.render_editor();
            this.render_fbar();
            this.activate();
            this._rendered = true;
        },

        is_rendered: function() {
            return !!this._rendered;
        },

        render_editor: function() {
            this._editor = new Editor({
                $render_to: this.get_$editor_ct()
            });

            this.add_sub_mod(this._editor);
            this.mgr.observe(this._editor);
        },

        render_fbar: function() {
            this._fbar = new FootBar({
                $render_to: this.get_$fbar_ct()
            });

            this.add_sub_mod(this._fbar);
            this.mgr.observe(this._fbar);
        },

        /**
         * 添加子模块，便于管理
         * @param mod
         */
        add_sub_mod: function(mod) {
            if(!this._sub_mods) {
                this._sub_mods = [];
            }

            this._sub_mods.push(mod);
        },

        is_activated: function() {
            return !!this._is_activated;
        },

        activate: function() {
            if(this.is_activated()) {
                return;
            }
            this.show();
            this.get_$clipboard_body().addClass('clipboard-send-active');
            this._editor.activate();
            if(ie67) {
                $('#_main_box').css('overflow', 'hidden').repaint();
            }
            user_log('CLIPBOARD_SEND_TAB');
            this._is_activated = true;
        },

        deactivate: function() {
            if(!this.is_activated()) {
                return;
            }
            this.hide();
            this.mgr.abort_ajax();
            if(ie67) {
                $('#_main_box').css('overflow', '');
            }
            this.get_$clipboard_body().removeClass('clipboard-send-active');
            this._editor.deactivate();
            this._is_activated = false;
        },

        show: function() {
            this.get_$ct().show();
        },

        hide: function() {
            this.get_$ct().hide();
        },

        get_$ct: function() {
            return this._$ct;
        },

        get_$clipboard_body: function() {
            return this._$clipboard_body || (this._$clipboard_body = $('#_clipboard_body'));
        },

        get_$editor_ct: function() {
            return this._$ct.find('[data-id=editor_ct]');
        },

        get_$fbar_ct: function() {
            return this._$ct.find('[data-id=footbar_ct]');
        },


        destroy: function() {
            $.each(this.sub_mods, function(i, sub_mod) {
                sub_mod.destroy();
            });

            this._sub_mods = null;
            this.mgr.destroy();
            this.mgr = null;
        }

    });

    return Send;
});