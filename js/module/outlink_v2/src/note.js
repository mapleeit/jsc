/**
 * 笔记预览
 */
define(function(require, exports, modules) {
    var lib = require('lib'),
        common = require('common'),

        Module = common.get('./module'),

        file_path = require('./file_path.file_path'),
        selection = require('./selection'),
        tmpl = require('./tmpl'),

        cur_note,

        undefined;

    var note = new Module('outlink.note', {

        preview: function(note, extra) {
            if(this._rendered) {
                return;
            }
            if(extra.note_article_url) {
                window.open(extra.note_article_url);
                return;
            }

            var $con = this.get_$con();
            $con.hide();
            this.$ct = $(tmpl.note({
                title: note.get_name(),
                time: note.get_modify_time(),
                content: extra.note_content,
                article_url: extra.note_article_url
            })).insertAfter($con);

            // 给所有a标签的href加上U镜检查
            this.UMirrorCheck(this.$ct);

            this.bind_events();
            cur_note = note;
            selection.select(note);

            selection.get_sel_box().disable();
            $(document).off('contextmenu.file_list_context_menu');
            $(document.body).css('overflow', 'auto');
            this._rendered = true;
        },

        /**
         * U镜检查
         * 替换所有$dom中a标签的href
         * @param $dom
         */
        UMirrorCheck: function ($dom) {
            $dom.find('a').each(function (index) {
                var originURL = $(this).attr('href');
                // 防止嵌套添加
                if (!/^(http:|https:)?\/\/www\.urlshare\.cn\/umirror_url_check/.test(originURL)) {
                    $(this).attr('href', '//www.urlshare.cn/umirror_url_check?plateform=mqq.weiyun&url=' + encodeURIComponent(originURL));
                }
            })
        },

        render_article: function(artcile_url) {
            var $article_iframe = $('#_note_article_frame'),
                width = $(window).width(),
                height = $(window).height();
            $article_iframe.attr('src', artcile_url).css({
                width: '100%',
                height: height
            });
        },

        bind_events: function() {
            var me = this;
            this.listenTo(file_path, 'action', function(action_name) {
                if(action_name == 'click_path') {
                    me.destroy();
                }
            });
        },

        destroy: function() {
            this.stopListening(file_path);
            this.$ct.remove();
            this.$ct = null;
            this.get_$con().show();
            this._rendered = false;
            selection.unselect(cur_note);
            cur_note = null;
            selection.get_sel_box().enable();
            $(document.body).css('overflow', '');
        },

        get_$con: function() {
            return $('#lay-main-con');
       }
    });

    return note;
});