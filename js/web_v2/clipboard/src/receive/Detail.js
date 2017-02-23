/**
 * 剪贴板模块 接收tab 详细视图
 * @author hibincheng
 * @date 2014-01-14
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Event = lib.get('./Event'),
        inherit = lib.get('./inherit'),
        View = lib.get('./data.View'),
        console = lib.get('./console').namespace('clipboard'),
        text = lib.get('./text'),

        Copy = common.get('./util.Copy'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        user_log = common.get('./user_log'),

        main_ui = require('main').get('./ui'),
        tmpl = require('./tmpl'),

        ie67 = $.browser.msie && $.browser.version < 8,
        url_reg = /(?:(?:http|https|ftp)\:\/\/|\bwww\.)(?:[a-z0-9\-]+\.)+[a-z]{2,4}(?:\:\d{2,})?([a-z\u00C0-\u017F0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~]*)?/gi, //增加对前缀为www.开始的url,因为一般用户输入时不会以http开头
        protocol_reg = /^(?:(?:http|https|ftp):\/\/)/i,

        undefined;

    var Detail = inherit(Event, {

        name: 'receive_detail',

        constructor: function(cfg) {
            $.extend(this, cfg);
            if(this.$render_to) {
                this.render(this.$render_to);
            }
        },

        render: function($render_to) {
            if(this._rendered) {
                return;
            }
            this._$ct = $(tmpl.receive_detail()).appendTo($render_to);
	        this.sync_$container_size();
            this.render_tbar();
            this.init_copy();
            this._rendered = true;
        },

        sync_$container_size: function() {
            var height = $(window).height() - main_ui.get_fixed_header_height() - $('.j-clipboard-tab').height(),
                $content = this.get_$content();
            $content.height(height - 142);
        },

        render_tbar: function() {
            var me = this;
            this._$tbar = $(tmpl.toolbar()).prependTo(this.$render_to).show();
            main_ui.sync_size();
            this._$tbar.on('click', '[data-action]', function(e) {
                e.preventDefault();
                var action_name = $(this).attr('data-action');
                me.trigger('action', action_name, me.get_record(), e, {src: 'detailmenu'});
            });
        },

        /**
         * 初始化复制操作
         * @private
         */
        init_copy: function () {
            var me = this;

            if (!Copy.can_copy()) {
                return;
            }
            //因contextmenu是在body中的，所以不能使用container_selector
            this.copy = new Copy({
                container_selector: '.j-clipboard-operate',
                target_selector: '[data-clipboard-target]'
            });

            this
                .listenTo(this.copy, 'provide_text', function () {
                    var content = me.get_record().get('content');
                    return content;
                }, this)
                .listenTo(this.copy, 'copy_done', function () {
                    mini_tip.ok('复制成功');
                    user_log('CLIPBOARD_RECEIVE_DETAIL_COPY_BTN');
                })
                .listenTo(this.copy, 'copy_error', function () {
                    mini_tip.warn('您的浏览器不支持该功能');
                });
        },

        is_renderd: function() {
            return !!this._rendered;
        },

        /**
         * 修复用户产生的文本消息（HTML转义 + URL添加链接）
         * @param {String} str 需要处理的用户文本
         * @param {Number} [len] 截取长度（参考.smart_sub()方法），可选
         *
         */
        fix_user_text: function (str, len) {
	        if (!str || !(typeof str === 'string')) return '';

	        var me = this;

	        // 首先要将文本和URL分离开，然后对文本进行HTML转义，对URL进行修复
	        // 如“你好www.g.cn世界”，需要拆分为 "你好", "www.g.cn", "世界"
	        var texts = [],
		        is_urls = {}, // { 1: String, 3: String } 保存所有的URL以及URL在文本数组中出现的索引位置
		        last_end = 0,
		        i = 0;

	        var match;
	        while (match = url_reg.exec(str)) {
		        var url = match[0],
			        start = match.index,
			        end = start + url.length,
			        left_text = str.substring(last_end, start);

		        texts.push(left_text);  // 取URL左侧的文字
		        texts.push(url);
		        is_urls[texts.length - 1] = url;

		        last_end = end;
		        i++;
	        }
	        // 取URL右侧的文字
	        if (texts.length && last_end < str.length - 1) {
		        texts.push(str.substr(last_end));

		        // 先截断
		        if (len > 0) {
			        texts = me._smart_sub_arr(texts, len);
		        }


		        texts = $.map(texts, function (str, i) {
			        var url;
			        // 生成链接（如果URL被截断了，则不处理链接）
			        if (i in is_urls && str === (url = is_urls[i])) {
				        if (!protocol_reg.test(url)) {
					        url = 'http://' + url;
				        }
				        return '<a href="' + url + '" target="_blank">' + str + '</a>'; // 这里用text作为文本，是因为它有可能由"www.weiyun.com"被截断为"www.wei.."
			        }
			        else {
				        // 字符串HTML转义
				        return text.text(str);
			        }
		        });
	        } else {
		        texts.push(str);
	        }

	        return texts.join('');
        },

        set_record: function(rd) {
            this._record = rd;
            var content = rd.get('content');
            content = this.fix_user_text(content);

            content = content.replace(/\r\n|\r|\n/g, '<br />');
            this.set_content(content);
        },

        get_record: function() {
            return this._record;
        },

        set_content: function(con) {
            var $content = this.get_$content();
            $content.html(con);
        },

        get_$content: function() {
            return this._$content || (this._$content = this._$ct.find('[data-id=content]'));
        },

        is_hide: function() {
            return !!this._is_hidden;
        },

        show: function() {
            this._$ct.show();
            this.show_tbar();
            this._is_hidden = false;
        },

        hide: function() {
            this._$ct.hide();
            this.hide_tbar();
            this._is_hidden = true;
        },

        show_tbar: function() {
            this._$tbar.show();
            main_ui.sync_size();

            if(ie67) {
                main_ui.get_$body_box().css({
                    'border-bottom-width': '1px',
                    'background-image': 'none'
                });
            }
        },

        hide_tbar: function() {
            this._$tbar.hide();
            main_ui.sync_size();

            if(ie67) {
                main_ui.get_$body_box().css({
                    'border-bottom-width': '',
                    'background-image': ''
                });
            }
        },

        destroy: function() {
            this._$ct.remove();
            this._$tbar.remove();
            this.$render_to = null;
            this._record = null;
        }
    });

    return Detail;
});