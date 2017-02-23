/**
 * 剪贴板模块 发送tab 富文本编辑器
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console').namespace('clipboard'),

        scr_reader_mode = common.get('./scr_reader_mode'),
        global_event = common.get('./global.global_event'),

        main_ui = require('main').get('./ui'),
        tmpl = require('./tmpl'),

        has_content = false, //editor中是否有内容
        ie67 = $.browser.msie && $.browser.version < 8,
        window_resize_event = 'window_resize_real_time',
        undefined;

    var Editor = inherit(Event, {

        name: 'editor',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($ct) {
            if(this._rendered) {
                return;
            }

            this._$ct = $ct;

            this.render_editor();
            this.activate();
            this._rendered = true;

        },

        /**
         * 渲染编辑器，采用textarea，不能使用富文本，不然其它端会显示出html标签
         */
        render_editor: function() {
            var $textarea = $('<textarea class="editor" placeholder="输入或粘贴一段内容，可以发送到自己的手机上（需要安装手机版微云）。" style=""></textarea>');
            var me = this;

            if(!scr_reader_mode.is_enable()) {
                $textarea.css('outline', 'none');
            }
            //simulate placeholder
            if($.browser.msie) {
                $textarea.val($textarea.attr('placeholder')).css('color', '#7d838f');
                $textarea.
                    on('focus', function(e) {
                        $textarea.css('color', '');
                        if($.trim($textarea.val()) === $textarea.attr('placeholder')) {
                            $textarea.val('');
                            me.trigger('action', 'empty', true);
                        }
                    })
                    .on('blur', function(e) {
                         if($.trim($textarea.val()) === '') {
                             $textarea.val($textarea.attr('placeholder')).css('color', '#7d838f');
                             me.trigger('action', 'empty', true);
                             has_content = false;
                         } else {
                             me.trigger('action', 'empty', false);
                         }
                    });
            } else {
                $textarea
                    .on('blur', function(e) {
                        if(me.get_content()) {
                            me.trigger('action', 'empty', false);
                        } else {
                            me.trigger('action', 'empty', true);
                            has_content = false;
                        }
                    });
            }

            $textarea.on('keyup', function(e) {
                if(!me.get_content()) {
                    me.trigger('action', 'empty', true);
                    has_content = false;
                } else if(!has_content) {//键入第一个字符后
                    me.trigger('action', 'empty', false);
                    has_content = true;
                }
            })
                .on('paste', function(e) {
                    me.paste_detect_empty();
                });

            this._$editor = $textarea.appendTo(this._$ct);

        },

        /**
         * 粘贴时对内容是否为空进行检测，从而是否开启发送按钮
         */
        paste_detect_empty: function() {
            var me = this;
            setTimeout(function() { //异步去检测，以便内容已经粘贴了
                if(me.get_content()) {
                    me.trigger('action', 'empty', false);
                }
            },0);
        },

        /**
         * 同步编辑器大小以撑满内容区
         */
        sync_editor_size: function() {
            var me = this,
                $editor = me.get_$editor();
            var height = $(window).height() - main_ui.get_$bar1().outerHeight() - main_ui.get_fixed_header_height();
            $editor.height(height - 100); //等给下方工具栏高度
            if(ie67) {
                $('#_clipboard_body').repaint();
            }
        },

        //不采用富文本实现，因客户端无法接收
       /* render_editor: function() {
            var $ifr = $('<iframe id="_iframe_editor" frameBorder=0 style="width:100%;height:100%;"></iframe>'),
                ie = $.browser.msie,
                me = this;


            $ifr.on('load', function() {
                var editor_doc,
                    ifr = $ifr[0],
                    default_style = '*{padding:0;margin:0;} body{padding:10px 0 0 5px;}'
                    default_tip = '<p id="'+editor_tip_id+'" style="color: #bababa;">输入或粘贴一段内容，可以发送到自己的手机上（需要安装手机版微云）。</p>';

                $ifr.off('load');

                editor_doc = ifr.contentDocument || ifr.contentWindow.document;
                editor_doc.open();
                editor_doc.write('<!DOCTYPE html><html><head><style>' + default_style + '</style>' +
                    '</head><body>' + default_tip + '</body></html>');
                editor_doc.close();
                if(ie) {
                    editor_doc.body.disabled = true;
                    editor_doc.body.contentEditable = true;
                    editor_doc.body.removeAttribute('disabled');
                } else {
                    editor_doc.designMode = 'on';
                }

                me._$editor_doc = $(editor_doc);
                me._editor_win = ifr.contentWindow;
                $(editor_doc.body)
                    .on('focus', function(e) {
                        console.log('enter body');
                        e.preventDefault();
                        if($('#'+editor_tip_id, editor_doc).length) {
                            $(editor_doc.body).empty();
                        } else {
                           // $('<input>').appendTo(editor_doc.body).focus().remove();
                        }
                    })
                    .on('blur', function(e) {
                        console.log('back body');
                        e.preventDefault();
                        var con = $(editor_doc.body).html();
                        if(!$.trim(con)) {
                            $(editor_doc.body).html(default_tip);
                            me.trigger('action', 'empty', true);
                        } else {
                            me.trigger('action', 'empty', false);
                        }
                    });
            });

            if(ie) {
                $ifr.attr('src', 'javascript:void(function(){document.open();document.domain = "'+document.domain+'";document.close();}());');
            }

            //同步iframe高度使之撑满内容区
            var height = main_ui.get_$main_content().height();
            $ifr.height(height - 6);
            this.listenTo(main_ui, 'area_resize', function() {
                $ifr.height(main_ui.get_$main_content().height() - 6);
            });

            this._$editor = $ifr.appendTo(this._$ct);
            this.start_listen_empty();
        },*/

        /*start_listen_empty: function() {
            var me = this;
            this.get_$editor_doc().on('keyup', function(e) {
                if(!me.get_content()) {
                    me.trigger('action', 'empty', true);
                }
            });
        },*/
        /**
         * 清除内容
         */
        clear: function() {
            this.get_$editor().val('').blur();
            has_content = false;
        },

        /*get_content: function() {
            if($('#'+editor_tip_id, this._$editor_doc).length) {
                return '';
            }
            return $.trim($('body', this._$editor_doc).html());
        },*/

        /**
         * 获取编辑器中的内容
         * @returns {*}
         */
        get_content: function() {
            return this.get_$editor().val();
        },

        is_activated: function() {
            return this._is_activated;
        },

        activate: function() {
            if(this.is_activated()) {
                return;
            }
            var me = this;
            me.sync_editor_size();
            //同步editor高度使之撑满内容区
            this.listenTo(global_event, window_resize_event, function() {
                this.sync_editor_size();
            });
            this._is_activated = true;
        },

        deactivate: function() {
            this.stopListening(global_event, window_resize_event);
            this._is_activated = false;
        },

        get_$editor: function() {
            return this._$editor;
        }

    });

    return Editor;
});