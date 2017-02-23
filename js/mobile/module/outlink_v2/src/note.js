/**
 * 视频云播模块
 * @author hibincheng
 * @date 2015-07-21
 */
define(function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        Module  = lib.get('./Module'),
        browser = common.get('./util.browser'),
        logger  = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        tmpl    = require('./tmpl'),
        target_action = (browser.WEIXIN && browser.WINDOWS_WEIXIN)? 'click' : 'touchend',
        undefined;

    var note = new Module('outlink.note', {

        preview: function(note, extra) {
            if(this._rendered) {
                return;
            }

            //把列表页隐藏
            $('#container').hide();
            $(document.body).addClass('weiyun-note');

            this.$ct = $(tmpl.note({
                title: note.get_name(),
                time: note.get_modify_time(),
                content: extra.note_content
            })).appendTo(document.body);

            // 给所有a标签的href加上U镜检查
            this.UMirrorCheck(this.$ct);

            this.bind_events(note);

            this._rendered = true;

            return this;
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

        bind_events: function(note) {
            var me = this;
            this.$ct.on(target_action, '[data-action=save]', function(e) {
                me.trigger('action', 'save', [note], e);
            });
        },

        destroy: function() {
            this._rendered = false;
            this.$ct.remove();
            this.$ct = null;
            $('#container').show();
            $(document.body).removeClass('weiyun-note');
        }
    });

    return note;

});