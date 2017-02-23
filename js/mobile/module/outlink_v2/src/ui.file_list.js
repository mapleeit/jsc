/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        router = lib.get('./router'),
        store = require('./store'),
        ListView = require('./ListView'),
        mgr = require('./mgr'),
        selection = require('./selection'),
        Previewer = require('./Previewer'),

        video = require('./video'),
        note = require('./note'),

        tmpl = require('./tmpl'),

        undefined;

    common.get('./polyfill.rAF');

    var win_height = $(window).height();

    function toMMSS(time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    }

    var ui = new Module('ui.file_list', {

        render: function() {
            router.init('root');
            this.listenTo(router, 'change', function(to, from) {
                if(from === 'preview') {
                    this.back_to_list();
                }
            });


            this._$ct = $('#container');

            this.list_view = new ListView({
                $ct:$('#file_list'),
                store: store,
                $toolbar: $('#_toolbar'),
                auto_render: true
            });

            mgr.observe(this.list_view);

            var me = this;
            setTimeout(function() {

                $(window).on('scroll', function(e) {
                    window.requestAnimationFrame(function() {
                        if(me.is_reach_bottom()) {
                            store.load_more();
                        }
                       /* if(window.pageYOffset + win_height >= me._$ct.height() && !store.is_load_done()) {
                            $('#_load_more').show();
                        } else {
                            $('#_load_more').hide();
                        }*/
                    });
                })
            }, 100);
        },

        image_preview: function(file) {
            this.previewer = new Previewer(file);
            router.go('preview');
            selection.clear();
            selection.select(file);
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
            //this.get_$ct().hide();
        },

        note_preview: function(file, extra) {
            if(extra.note_article_url) {
                location.href = extra.note_article_url;
                return;
            }

            this.previewer = note.preview(file, extra);
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        doc_preview: function(file, extra, success, fail) {
            var me = this;
            require.async('ftn_preview', function(mod) {
                me.previewer = mod.get('./ftn_preview').preview(file, extra, success, fail);
                router.go('preview');
            });
        },

        video_play: function(file, extra) {
            this.previewer = video.play(file, extra);
            router.go('preview');
            this.listenTo(this.previewer, 'exit', function() {
                this.back_to_list();
            }).listenTo(this.previewer, 'action', function(action_name, data, e) {
                this.trigger('action', action_name, data, e);
            });
        },

        back_to_list: function() {
            this.previewer.destroy();
            this.stopListening(this.previewer);
            this.previewer = null;
            selection.clear();
            //this.get_$ct().show();
            //this.get_$banner().show();
        },

        is_reach_bottom: function() {
            if(window.pageYOffset + win_height > this._$ct.height() - 200) {
                return true;
            }

            return false;
        },


        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$file_list: function() {
            return this.$file_list = this.$file_list || (this.$file_list = $('#file_list'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});