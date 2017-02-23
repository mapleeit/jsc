//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/share_trace/share_trace.r160926",["lib","common","$"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//share_trace/src/file/fileType.js
//share_trace/src/share_list.js
//share_trace/src/trace_detail.js
//share_trace/src/share_list/share_item.tmpl.html
//share_trace/src/trace_detail/trace_detail.tmpl.html

//js file list:
//share_trace/src/file/fileType.js
//share_trace/src/share_list.js
//share_trace/src/trace_detail.js
/**
 * Created by maplemiao on 2016/10/12.
 */

"use strict";
define.pack("./file.fileType",[],function(require, exports, module) {
    var defaults_v2 = 'nor',
        folder_type_v2 = 'file',
        type_map_v2 = {
            doc: ['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb', 'et'],
            ppt: ['ppt', 'pptx', 'dps', 'pptm'],
            pic: ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif', 'webp', 'bmp', 'exif', 'raw', 'image'],
            video: ['mp4', 'mov', 'mkv', 'mpg', 'mpeg', 'dat', 'f4a', 'webm', 'mod', 'avi', 'mpe', 'mpeg4', 'wmv', 'wmf',
                'asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa',
                'rmvb', 'rm', '3gp', '3g2', '3gp2', '3gpp'],
            audio: ['mp3', 'wav', 'wave', 'acc', 'aac', 'aiff', 'amr', 'ape', 'flac', 'm4a', 'mid', 'midi', 'ogg',
                'rtttl', 'wma', 'ram', 'ra', 'au', 'xmf'],
            flv: ['fla', 'flv', 'swf'],
            zip: ['zip', 'rar', 'tar', 'jar', '7z', 'z', '7-zip', 'ace', 'lzh', 'arj', 'gzip', 'bz2', 'cab', 'compress',
                'uue', 'iso', 'dmg'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php', 'c', 'cpp', 'h', 'cs', 'plist', 'html', 'htm', 'xml', 'ipe'],
            note: ['note'],
            keynote: ['keynote'],
            ipa: ['ipa'],
            pdf: ['pdf'],
            txt: ['txt', 'text', 'rp', 'document'],
            msg: ['msg', 'oft'],
            apk: ['apk'],
            vsd: ['vsd', 'vsdx'],
            ps: ['psd', 'psb'],
            ai: ['ai', 'eps', 'svg'],
            numbers: ['numbers'],
            settings: ['asp', 'bak', 'bat', 'exe', 'exec', 'dll', 'xmin', 'log', 'msi', 'old', 'tmp', 'key'],
            help: ['chm', 'hlp', 'cnt'],
            font: ['ttf', 'opt', 'fon', 'ttc'],
            pages: ['pages'],
            nor: ['unknow'],
            file: ['filebroken']
        },
        all_map_v2 = {};

    var type, sub_types, i, l;

    for (type in type_map_v2) {

        sub_types = type_map_v2[type];

        for (i = 0, l = sub_types.length; i < l; i++) {
            all_map_v2[sub_types[i]] = type;
        }
    }

    module.exports = function (name, version) {
        var result;
        var ext = name.toLowerCase().split('.').pop();

        result = all_map_v2[ext] || defaults_v2;

        return result;
    };
});
/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

define.pack("./share_list",["lib","common","$","./file.fileType","./tmpl"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        text = lib.get('./text'),
        dateformat = lib.get('./dateformat'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        request = common.get('./request'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        fileType = require('./file.fileType'),
        tmpl = require('./tmpl'),

        undefined;

    var share_list = new Module('share_list', {
        init: function (data) {
            var me = this;
            me.data = data || {};
            me.offset = (me.data.item || []).length;
            me.count = (data.item || []).length;
            me.loading = false;

            /**
             * 每页加载的分享链接条数
             * @constant {number}
             */
            me.PAGE_SIZE = 30;
            me.render_thumb();
            me._bind_events();
        },

        //加载缩略图，在这里处理是为了用common库方法来兼容https
        render_thumb: function() {
            var me = this;
            var $file_list = this.get_$share_link_list().find('[data-share-item]');
            $.each($file_list, function(i, file) {
                var share_icon = $(file).attr('data-share-icon');
                var thumb_url = $(file).attr('data-share-thumb-url');
                if(thumb_url) {
                    thumb_url = me.translate_https_url(thumb_url);
                    var file_type = (share_icon === 'package' || !share_icon)? 'shared-link' : fileType(share_icon, 'v2');
                    thumb_url = file_type==='video'? thumb_url + '/64' : (file_type==='pic'? thumb_url + '?size=64*64' : '');
                    $(file).find('i.icon').css('background-image','url(' + thumb_url + ')');
                }
            });
        },

        translate_https_url: function(url) {
            if(!constants.IS_HTTPS) {
                return url;
            }
            var url_object = new URL(url);
            return 'https://' + https_tool.translate_host(url_object.hostname) + ':8443' + url_object.pathname  + url_object.search;
        },

        _bind_events: function () {
            var me = this;

            $('.j-share-link-list').on('click', '.j-share-item', function (e) {
                var $li = $(e.target).closest('li'),
                    shareKey = $li.attr('data-share-key');
                if ($li.hasClass('fail')) {
                    return;
                }
                location.href = location.origin + '/share_trace/trace_detail?' +
                    'share_key=' + shareKey;
            });

            /**
             * 到底部自动加载
             * @listens scroll
             */
            $(window).on('scroll', function () {
                if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                    if (!me.data.done && !me.loading) {
                        me.loading = true;
                        me.get_$loading().show();
                        me._load()
                            .done(function (msg, data) {
                                me.get_$loading().hide();

                                var htmlString = '';

                                for (var i = 0, items = data.item || [], len = items.length; i < len; i++) {
                                    htmlString += tmpl.share_item({
                                        item: items[i],
                                        util: {
                                            htmlEscape: text.text,
                                            dateformat: dateformat,
                                            fileType: fileType
                                        }
                                    });
                                }
                                me.offset += (data.item || []).length;
                                me.count += (data.item || []).length;
                                me.data.done = data.done;
                                me.loading = false;

                                if (data.done) {
                                    me.get_$file_count().find('span').text(me.count + '个文件');
                                    me.get_$file_count().show();
                                }

                                me.get_$share_link_list().append(htmlString);
                            })
                            .fail(function (msg, ret) {
                                widgets.reminder.error('拉取信息失败，请重试');
                            })
                    }
                }
            })
        },

        /**
         * load more share item
         * @private
         */
        _load: function () {
            var me = this;

            var def = $.Deferred();

            //noinspection JSAnnotator
            document.domain = 'weiyun.com';

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareList',
                re_try:3,
                pb_v2: true,
                body: {
                    offset: me.offset,
                    size: me.PAGE_SIZE,
                    order: 0 // time order : 0 && name order : 1
                }
            }).ok(function (msg, data) {
                logger.write(['xhr_post success ---> WeiyunShareList '], 'h5_session_timeout', 0);
                def.resolve(msg, data);
            }).fail(function (msg, ret) {
                logger.write(['xhr_post error ---> WeiyunShareList '], 'h5_session_timeout', ret);
                def.reject(msg, ret);
            });

            return def;
        },

        // ------------------------------------ DOM -------------------------------------
        get_$loading: function () {
            var me = this;

            return me.$loading || (me.$loading = $('.j-loading'));
        },

        get_$file_count: function () {
            var me = this;

            return me.$file_count || (me.$file_count = $('.j-file-count'));
        },

        get_$share_link_list : function () {
            var me = this;

            return me.$share_link_list || (me.$share_link_list = $('.j-share-link-list'));
        }
    });

    return share_list;
});/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

define.pack("./trace_detail",["lib","common","$","./file.fileType","./tmpl"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        text = lib.get('./text'),
        dateformat = lib.get('./dateformat'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        logger = common.get('./util.logger'),
        widgets = common.get('./ui.widgets'),
        fileType = require('./file.fileType'),
        tmpl = require('./tmpl'),

        undefined;

    var trace_detail = new Module('trace_detail', {
        init: function (data) {
            var me = this;

            me.data = data;
            me.currentTab = 'view'; // view OR download, current tab status
            me.viewFinishFlag = me.data.viewFinishFlag || false; // false OR true, view list finished flag status
            me.downloadFinishFlag = me.data.downloadFinishFlag || false; // false OR true, download list finished flag status
            me.viewOffset = 0;
            me.downloadOffset = 0;
            me._tab_btn_top_status = 0; // 0 OR 1, whether tab btn on the top
            // 浏览和下载列表数据缓存
            me.store = {
                'view': [],
                'download': [],
                'viewCount' : me.data.viewCount,
                'downloadCount': me.data.downloadCount
            };

            me.render_thumb();
            me._init_store();
            me._bind_events();
            console.log(data);
        },

        /**
         * 将直出拉取的首屏数据存到缓存中来
         * @private
         */
        _init_store: function () {
            var me = this;

            $.map(me.data.viewUserList, function (item, index) {
                me.store.view.push(item);
            });

            // update offset
            me.viewOffset = me.store.view.length;
            me.downloadOffset = me.store.download.length;
        },

        //加载缩略图，在这里处理是为了用common库方法来兼容https
        render_thumb: function() {
            var me = this;
            var $image = this.get_$main_div().find('.info>i.icon');
            var share_icon = me.data.itemInfo.share_icon;
            var thumb_url = me.data.itemInfo.thumb_url;
            if(thumb_url) {
                thumb_url = me.translate_https_url(thumb_url);
                var file_type = (share_icon === 'package' || !share_icon)? 'shared-link' : fileType(share_icon, 'v2');
                thumb_url = file_type==='video'? thumb_url + '/64' : (file_type==='pic'? thumb_url + '?size=64*64' : '');
                $image.css('background-image','url(' + thumb_url + ')');
            }
        },

        translate_https_url: function(url) {
            if(!constants.IS_HTTPS) {
                return url;
            }
            var url_object = new URL(url);
            return 'https://' + https_tool.translate_host(url_object.hostname) + ':8443' + url_object.pathname  + url_object.search;
        },

        _bind_events: function () {
            var me = this;

            me.get_$view_btn().on('click', function (e) {
                me._set_current_tab('view');
            });

            me.get_$download_btn().on('click', function (e) {
                me._set_current_tab('download');
            });

            me.on('change-tab', function (tab) {
                var currentTab = tab;

                var handleChange = function () {
                    me._handle_blank();
                    me._handle_tab();
                };

                // first time click the download tab, need load data
                if (tab === 'download' && me.downloadFinishFlag === false && me.downloadOffset === 0) {
                    me._load(tab)
                        .done(function (msg, data) {
                            var htmlString = '';

                            for (var i = 0, items = data[currentTab + '_user_list'] || [], len = items.length; i < len; i++) {
                                htmlString += tmpl.user_item({
                                    item: items[i],
                                    util: {
                                        htmlEscape: text.text,
                                        dateformat: dateformat
                                    }
                                });

                                me.store[currentTab].push(items[i]);
                            }
                            me[currentTab + 'Offset'] += len;
                            me[currentTab + 'FinishFlag'] = data.finish_flag;

                            me['get_$' + currentTab + '_list']().append(htmlString);

                            handleChange();
                        })
                        .fail(function (msg, err) {
                            widgets.reminder.error('拉取信息失败，请重试');

                            handleChange();
                        })
                } else {
                    handleChange();
                }
            });

            me.on('scroll-to-bottom', function () {
                var currentTab = me._get_current_tab();

                // if has finished
                if (me[currentTab + 'FinishFlag']) {
                    return;
                }

                me.get_$loading().show();

                me._load(currentTab)
                    .done(function (msg, data) {
                        var htmlString = '';

                        for (var i = 0, items = data[currentTab + '_user_list'] || [], len = items.length; i < len; i++) {
                            htmlString += tmpl.user_item({
                                item: items[i],
                                util: {
                                    htmlEscape: text.text,
                                    dateformat: dateformat
                                }
                            });

                            me.store[currentTab].push(items[i]);
                        }
                        me[currentTab + 'Offset'] += len;
                        me[currentTab + 'FinishFlag'] = data.finish_flag;

                        me['get_$' + currentTab + '_list']().append(htmlString);

                        me.get_$loading().hide();
                    })
                    .fail(function (msg, ret) {
                        widgets.reminder.error('拉取信息失败，请重试');
                    })
            });

            me.on('scroll-tab-top', function () {
                me._tab_btn_top_status = 1; // update status

                // change tab btn css position
                me.get_$link_detail().addClass('hang');
            });

            me.on('scroll-tab-top-cancel', function () {
                me._tab_btn_top_status = 0; // update status

                me.get_$link_detail().removeClass('hang');
            });

            $(window).on('scroll', function () {
                if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                    me.trigger('scroll-to-bottom');
                }

                if (me.get_$main_div().height() <= $(window).scrollTop() && !me._tab_btn_top_status) {
                    me.trigger('scroll-tab-top');
                } else if (me.get_$main_div().height() > $(window).scrollTop() && me._tab_btn_top_status) {
                    me.trigger('scroll-tab-top-cancel');
                }
            });
        },

        /**
         * set tab status
         * @param tab
         * @private
         * @fires trace_detail#change-tab
         */
        _set_current_tab: function (tab) {
            var me = this;

            me.currentTab = tab;

            me.trigger('change-tab', tab);
        },

        /**
         * get tab status
         * @returns {string|*} view | download
         * @private
         */
        _get_current_tab: function () {
            var me = this;

            return me.currentTab;
        },

        /**
         * 处理空状态
         * @private
         */
        _handle_blank: function () {
            var me = this;

            var tabTextMap = {
                'view' : '浏览',
                'download' : '下载'
            };
            var currentTab = me._get_current_tab(),
                textString = '暂无' + tabTextMap[currentTab] + '记录';

            me.get_$blank_text().text(textString);

            if (currentTab === 'view' && me.store.view.length === 0) {
                me.get_$blank_div().show();
            } else if (currentTab === 'download' && me.store.download.length === 0) {
                me.get_$blank_div().show();
            } else {
                me.get_$blank_div().hide();
            }
        },

        /**
         * 处理列表展示，
         * 处理tab按钮展示
         * @private
         */
        _handle_tab: function () {
            var me = this;

            var currentTab = me._get_current_tab();

            if (currentTab === 'view') {
                me.get_$view_btn().addClass('act');
                me.get_$download_btn().removeClass('act');

                me.get_$view_list().show();
                me.get_$download_list().hide();
            } else if (currentTab === 'download') {
                me.get_$view_btn().removeClass('act');
                me.get_$download_btn().addClass('act');

                me.get_$view_list().hide();
                me.get_$download_list().show();
            }
        },

        /**
         * load item
         * @param tab 'view' || 'download'
         * @private
         */
        _load: function (tab) {
            var me = this;
            var dataMap = {
                'view' : {
                    type: 1,
                    offset: me.viewOffset
                },
                'download' : {
                    type: 2,
                    offset: me.downloadOffset
                }
            };

            var def = $.Deferred();

            //noinspection JSAnnotator
            document.domain = 'weiyun.com';

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunShareTraceInfo',
                re_try:3,
                pb_v2: true,
                body: {
                    share_key: me.data.params['share_key'],
                    list_type: dataMap[tab].type,
                    offset: dataMap[tab].offset,
                    get_share_item: true
                }
            }).ok(function (msg, data) {
                logger.write(['xhr_post success ---> WeiyunShareTraceInfo '], 'h5_session_timeout', 0);
                def.resolve(msg, data);
            }).fail(function (msg, ret) {
                logger.write(['xhr_post error ---> WeiyunShareTraceInfo '], 'h5_session_timeout', ret);
                def.reject(msg, ret);
            });

            return def;
        },

        // ------------------------------------ DOM -------------------------------------
        get_$view_list: function () {
            var me = this;

            return me.$view_list || (me.$view_list = $('.j-view-list'));
        },

        get_$download_list: function () {
            var me = this;

            return me.$download_list || (me.$download_list = $('.j-download-list'));
        },

        get_$view_btn: function () {
            var me = this;

            return me.$view_btn || (me.$view_btn = $('.j-view-btn'));
        },

        get_$download_btn: function () {
            var me = this;

            return me.$download_btn || (me.$download_btn = $('.j-download-btn'));
        },

        get_$blank_text: function () {
            var me = this;

            return me.$blank_text || (me.$blank_text = $('.j-blank-text'));
        },

        get_$blank_div: function () {
            var me = this;

            return me.$blank_div || (me.$blank_div = $('.j-blank-div'));
        },

        get_$main_div: function () {
            var me = this;

            return me.$main_div || (me.$main_div = $('.j-main-div'));
        },

        get_$link_detail: function () {
            var me = this;

            return me.$link_detail || (me.$link_detail = $('.j-link-detail'));
        },

        get_$loading : function () {
            var me = this;

            return me.$loading || (me.$loading = $('.j-loading'));
        },

        get_$main_icon: function () {
            var me = this;

            return me.$main_icon || (me.$main_icon = $('.j-main-icon'));
        }
    });

    return trace_detail;
});
//tmpl file list:
//share_trace/src/share_list/share_item.tmpl.html
//share_trace/src/trace_detail/trace_detail.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'share_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
 var item = data.item || {}; var util = data.util; __p.push('    ');

        // 把fileType方法包一层，adapter
        util.customFileType = function(ext) {
            var result;
            var fileType = function(name) {
                return util.fileType(name, 'v2');
            };

            if (ext === 'package' || !ext) {
                result = 'shared-link';
            } else {
                result = fileType(ext);
            }
            return result;
        };
    __p.push('    <li data-share-item\r\n\
        data-share-key="');
_p( item.share_key );
__p.push('"\r\n\
        data-share-name="');
_p(item.share_name);
__p.push('"\r\n\
        data-share-create-time="');
_p(item.create_time);
__p.push('"\r\n\
        data-share-pwd="');
_p(item.share_pwd);
__p.push('"\r\n\
        data-share-remain-time="');
_p(item.remain_time);
__p.push('"\r\n\
        data-share-icon="');
_p(item.share_icon);
__p.push('"\r\n\
        data-share-thumb-url="');
_p(item.thumb_url);
__p.push('"\r\n\
        class="wy-file-item j-share-item ');
_p(!item.share_name ? 'fail' : '');
__p.push(' ');
_p(item.result===20002 ? 'expired' : '');
__p.push('">\r\n\
        <i class="icon icon-m icon-');
_p(util.customFileType(item.share_icon || ''));
__p.push('-m"');
if (util.customFileType(item.share_icon || '') === 'video') {__p.push('style="background-image:url(');
_p(decodeURIComponent(item.thumb_url + '/64'));
__p.push(')"');
}__p.push('           ');
if (util.customFileType(item.share_icon || '') === 'pic') {__p.push('style="background-image:url(');
_p(decodeURIComponent(item.thumb_url) + '?size=64*64');
__p.push(')"');
}__p.push('        ></i>\r\n\
        <div class="file-describe bBor">\r\n\
            <h3 class="file-name">');
_p( util.htmlEscape(item.share_name) || '该文件已删除' );
__p.push('</h3>\r\n\
            <span class="file-info">\r\n\
                <span class="file-date">');
_p( util.dateformat(item.create_time, 'yyyy-mm-dd HH:MM') );
__p.push('</span>\r\n\
                <span class="file-times">浏览');
_p(item.view_cnt);
__p.push('次</span>\r\n\
                <span class="file-times">下载');
_p(item.down_cnt);
__p.push('次</span>\r\n\
            </span>\r\n\
        </div>\r\n\
        <div class="right">');
 if (!item.share_name) { __p.push('            <span class="txt">已失效</span>');
 } else { __p.push('            <i class="icon-grey-rarr"></i>');
}__p.push('        </div>\r\n\
    </li>\r\n\
');

return __p.join("");
},

'user_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');
  var item = data.item || {}; __p.push('    ');
  var util = data.util || {}; __p.push('    ');

        util.formatSource = function (source) {
            source = JSON.parse(source || "{}").browser;
            var map = {
                'weixin': '来自微信',
                'qq': '来自QQ'
            };

            return map[source] || '来自Web';
        };
        item.__nickname = util.htmlEscape(item.nickname) || '未知用户';
        item.__from_source = util.formatSource(item.from_source);
    __p.push('    <li data-user-uin="');
_p(  item.uin  );
__p.push('" class="guest-item">\r\n\
        <div class="avatar" style="background-image:url(');
_p( item.head_logo_url );
__p.push(')"></div>\r\n\
        <div class="guest bBor">\r\n\
            <h3 class="name">');
_p( item.__nickname );
__p.push('</h3>\r\n\
            <span class="info">\r\n\
                <span class="from">');
_p( item.__from_source );
__p.push('</span>\r\n\
            </span>\r\n\
        </div>\r\n\
        <div class="right">\r\n\
            <span class="date">');
_p( util.dateformat(parseInt(item.op_time), 'mm/dd HH:MM') );
__p.push('</span>\r\n\
        </div>\r\n\
    </li>\r\n\
');

return __p.join("");
}
};
return tmpl;
});
