/**
 * office预览模块
 * @author hibincheng
 * @date 2014-05-04
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        widgets = common.get('./ui.widgets'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        tmpl = require('./tmpl'),

        file_type_map = {
            ppt: 'ppt',
            pptx: 'ppt',
            doc: 'doc',
            docx: 'doc',
            xls: 'excel',
            xlsx: 'excel',
            pdf: 'pdf'
        },

        MIN_VIEWER_WIDTH = constants.IS_APPBOX ? 800 : 940,

        undefined;

    var Previewer = inherit(Event, {

        auto_render: true,

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.auto_render) {
                this.render();
            }
        },

        render: function() {

            if(this.is_full_screen) {
                this._$ct = $(tmpl.full_preview({
                    file_type: file_type_map[this.file_type]
                })).appendTo(document.body);
            } else {
                this._$ct = $(tmpl.preview({
                    file_type: file_type_map[this.file_type],
                    title: this.file_name
                })).appendTo(document.body);
            }

            this._header_height = this._$ct.find('[data-id=header]').height();

            if(!this.is_full_screen) {
                widgets.mask.show('office_preview', this._$ct);
            }

            var url = this.url,
                $iframe,
                me = this;

            $iframe = $('<iframe frameBorder=false style="width:100%"></iframe>');
            $iframe.attr('src', url).appendTo(this._$ct.find('[data-id=content]'));
            $iframe.on('load', function(e){
                me.trigger('action', 'preview_page_load', e); //预览页面已加载，实际完整的预览内容并没有全部显示，只是进入了微软的预览页面
            });

            this._$iframe = $iframe;
            this.adjust_viewer();
            this._bind_events();

            this._$ct.show();
        },

        _bind_events: function() {
            var me = this;
            this._$ct.on('click', '[data-action]', function(e) {
                e.preventDefault();
                var $target = $(this),
                    action_name = $target.attr('data-action');
                me.trigger('action', action_name, e);
            });

            this.listenTo(global_event, 'window_resize', function() {
                this.adjust_viewer();
            });
            this.listenTo(global_event, 'press_key_esc', function() {
                this.trigger('action', 'close', null);
            });
        },

        /**
         * 调整预览窗口的宽高
         */
        adjust_viewer: function() {
            var $ct = this.get_$ct(),
                $iframe = this.get_$iframe(),
                win_width = $(window).width(),
                height = $(window).height() - (this._header_height || 0);

            if(win_width < MIN_VIEWER_WIDTH || constants.IS_APPBOX) {
                $ct.css({
                    width: MIN_VIEWER_WIDTH + 'px',
                    marginLeft: -MIN_VIEWER_WIDTH / 2 + 'px'
                });
            } else {
                var iframe_width = this.is_full_screen ? win_width : win_width*0.98
                $ct.css({
                    width: iframe_width + 'px',
                    marginLeft: -iframe_width / 2 + 'px'
                });
            }

            $iframe && $iframe.css('height', height);

        },

        get_$ct: function() {
            return this._$ct;
        },

        get_$iframe: function() {
            return this._$iframe;
        },

        get_$title: function() {
            return this._$title || (this._$title = this._$ct.find('[data-id=title]'));
        },

        destroy: function() {
            this._$ct.remove();
            this.$ct = null;
            this._$iframe = null;
            this.stopListening(global_event, 'window_resize');
            this.stopListening(global_event, 'press_key_esc');
            if(!this.is_full_screen) {
                widgets.mask.hide('office_preview');
            }
        }
    });

    return Previewer;
});