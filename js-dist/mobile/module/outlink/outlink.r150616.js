//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/mobile/module/outlink/outlink.r150616",["$","lib","common"],function(require,exports,module){

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
//outlink/src/Previewer.js
//outlink/src/image_lazy_loader.js
//outlink/src/mgr.js
//outlink/src/outlink.js
//outlink/src/select_mode.js
//outlink/src/store.js
//outlink/src/ui.file_list.js
//outlink/src/ui.js
//outlink/src/ui.photo.js
//outlink/src/outlink.tmpl.html
//outlink/src/previewer.tmpl.html

//js file list:
//outlink/src/Previewer.js
//outlink/src/image_lazy_loader.js
//outlink/src/mgr.js
//outlink/src/outlink.js
//outlink/src/select_mode.js
//outlink/src/store.js
//outlink/src/ui.file_list.js
//outlink/src/ui.js
//outlink/src/ui.photo.js
/**
 * 图片预览类
 * @author:hibincheng
 * @date:20150-01-30
 */
define.pack("./Previewer",["$","lib","common","./store","./tmpl"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),
        router = lib.get('./router'),
        prettysize = lib.get('./prettysize'),
        widgets = common.get('./ui.widgets'),

        store = require('./store'),
        tmpl = require('./tmpl'),

        undefined;

    /**
     *
     * @param {Object} cfg
     * @constructor
     */
    var Previewer = function(file_id) {
        this.urls = store.get_thumb_urls(1024);
        this.total = this.urls.length;
        this.index = store.get_image_index(file_id);
        this.render();
    };

    Previewer.prototype = {

        render: function() {
            this.$previewer = $(tmpl.previewer({
                page_text: this.index+1 + '/' + this.total
            })).appendTo(document.body);

            this.$img_list = this.$previewer.find('[data-id=img_list]');

            var me = this,
                vm = $(window).width() + 15; //15px是每张图的margin-right

            this.$img_list.width(vm*this.total).css({
                '-webkit-transform':'translate(-'+this.index*vm+'px,-50%)'
            }).on('click', 'img', function(e) {
               // e.preventDefault();
                //me.trigger('exit');
            });

            this.$previewer.on('touchmove', function(e) {
                e.preventDefault();
            });

            this.$previewer.find('[data-id=bbar]').on('touchstart', '[data-action]', function(e) {
                e.preventDefault();
                var action_name = $(e.target).closest('[data-action]').attr('data-action');
                if(action_name === 'view_raw') {
                    me.on_view_raw();
                } else {
                    me.trigger('action', action_name, [store.get_image_by_index(me.index).get_id()], e);
                }
            });

            //先占位，当划到某图才加载
            $(tmpl.previewer_item({
                total: this.total,
                item: this.urls
            })).appendTo(this.$img_list);

            this.load_more(this.index);
            require.async('Swipe', function() {
                me.init_swipe();
            })
            //var file_size = store.get_node_by_index(this.index).get_file_size();
            //this.get_$file_size().text('(' + prettysize(file_size) + ')');
        },

        init_swipe: function() {
            function transformBox(obj,value,time){
                var time=time?time:0;
                obj.css({
                    'transform':"translate("+value+"px, -50%)",
                    'transition':time+'ms linear',
                    '-webkit-transform':"translate("+value+"px, -50%)",
                    '-webkit-transition':time+'ms linear'
                });
            }
            var me = this;
            var $cur_img;
            this.$img_list.parent().Swipe({
                iniAngle:15,
                speed: 300,
                iniL:50,
                mode: 'left-right',
                sCallback:function(tPoint){
                    tPoint.setAttr('total', me.total);
                    tPoint.setAttr('count', me.index);
                    $cur_img = $('#previewer_item_' + me.index);
                },
                mCallback:function(tPoint){
                    var innerW=me.$img_list.width();
                    var offset=tPoint.mX+(-tPoint.count*innerW/tPoint.total);
                    if(!tPoint.mutiTouch && Math.abs(tPoint.angle)<tPoint.iniAngle){
                        transformBox(me.$img_list,offset,0);
                    }
                },
                eCallback:function(tPoint){
                    var innerW=me.$img_list.width(),
                        count=tPoint.count;
                    if(tPoint.mutiTouch) {
                        return;
                    }
                    function slide(d){
                        switch(d){
                            case "left":
                                ++count;
                                count = Math.min(count, tPoint.total-1); //不能超过边界
                                break;
                            case "right":
                                --count;
                                count = Math.max(count, 0); //不能超过边界
                        }
                        var offset = -count * innerW/tPoint.total;
                        transformBox(me.$img_list,offset,tPoint.speed);
                    }

                    slide(tPoint.direction);
                    tPoint.setAttr("count",count);
                    if(!tPoint.mX) {
                        router.go('root');
                    } else if(tPoint.direction) {
                        me.load_more(count);
                    }
                }
            });
        },

        load_more: function(index) {
            this.index = index;

            var $page_text = this.get_$page_text();
            $page_text.text(index + 1 + '/' + this.total).css('opacity', '0');
            clearTimeout(this.page_timer);
            $page_text.animate({
                opacity: 0.5
            }, 500, 'ease-out');
            this.page_timer = setTimeout(function(){
                $page_text.animate({
                    opacity: 0
                }, 500, 'ease-out');
            },2000);

            var file_size = store.get_image_by_index(this.index).get_file_size();
            this.get_$file_size().text('(' + prettysize(file_size) + ')');
            if($('#previewer_item_' + index).attr('src')) {
                return;
            }
            this.load_image(index).done(function(img) {
                $('#' + img.id).replaceWith(img);
            }).fail(function() {
                $('#previewer_item_' + index).replaceWith('<i id="previewer_item_'+index+'" class="icons  icon-img-damaged" style=""></i>');
            });
        },

        load_image: function(index, def) {
            var me = this,
                url = this.urls[index];

            def = def || $.Deferred();
            def.try_num = def.try_num || 3;
            image_loader.load(url).done(function(img) {
                img.className = 'wy-img-preview';
                img.id = 'previewer_item_'+ index;
                def.resolve(img);
            }).fail(function(img) {
                if(!--def.try_num) {
                    //img.className = 'wy-img-preview';
                   // img.id = 'previewer_item_'+ index;
                    def.reject(img);
                } else {
                    me.load_image(index, def);
                }
            });

            return def;
        },

        on_view_raw: function() {
            var index = this.index;
            var raw_url = store.get_image_by_index(index).get_thumb_url();
            var $cur_img = $(this.$img_list.children()[index]).find('img');
            if($cur_img.attr('data-size') == 'raw') {
                widgets.reminder.ok('已经是原图');
                return;
            }
            $cur_img.replaceWith('<i id="previewer_item_'+index+'" class="icons icons-reminder icon-reminder-loading"></i>');
            image_loader.load(raw_url).done(function(img) {
                img.className = 'wy-img-preview';
                img.id = 'previewer_item_'+ index;
                $(img).attr('data-size', 'raw');
                $('#' + img.id).replaceWith(img);
            }).fail(function() {
                $('#previewer_item_' + index).replaceWith('<i id="previewer_item_'+index+'" class="icons  icon-img-damaged" style=""></i>');
            });
        },

        get_$img_list: function() {
            return this.$img_list;
        },

        get_$page_text: function() {
            return this.$page_text = this.$page_text || (this.$page_text = this.$previewer.find('[data-id=page_text]'));
        },

        get_$file_size: function() {
            return this.$file_size = this.$file_size || (this.$file_size = this.$previewer.find('[data-id=file_size]'));
        },

        destroy: function() {
            this.$previewer.remove();
        }
    };

    $.extend(Previewer.prototype, events);

    return Previewer;
});/**
 * image lazy loader
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./image_lazy_loader",["$","lib"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),

        Module = lib.get('./Module'),
        undefined;

    var img_size = window.devicePixelRatio && window.devicePixelRatio > 2 ? '240*240' : '120*120';

    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);

            this.load_image();
            var me = this;
            $(window).on('scroll', function() {
                me.load_image();
            });

        },

        load_image: function() {
            var imgs = this.$ct.find('[data-src]'),
                win_height = $(window).height(),
                win_scrolltop = window.pageYOffset;

            imgs.each(function(i, img) {
                var $img = $(img);
                if(!$img.attr('data-loaded')) {
                    if($img.offset()['top'] < win_height + win_scrolltop + 100) {
                        var src = $img.attr('data-src');
                        src = src.indexOf('?') > -1 ? src + '&size=' + img_size : src + '?size=' + img_size;
                        $img.css('backgroundImage', "url('"+src+"')");
                        $img.attr('data-loaded', 'true');
                    }
                }
            });
        }
    });

    return lazy_loader;
});/**
 * mgr
 * @author hibincheng
 * @date 2014-12-22
 */
define.pack("./mgr",["lib","$","common","./store"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),

        store = require('./store'),
        //preview_dispatcher = common.get('./util.preview_dispatcher'),

        ftn_preview,

        undefined;

    var ios_preview_file_type = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];

    var mgr = new Mgr('outlink.mgr', {

        init: function() {
            var me = this;
            session_event.on('session_timeout', function() {
                me.to_login();
            });
        },
        //以下是自定义的事件处理逻辑

        on_save: function(file_ids) {
           /* if(!this.check_login()) {
                this.to_login();
                return;
            }*/

            widgets.reminder.loading('保存中...');
            var data = {
                share_key: store.get_share_key(),
                pwd: store.get_share_pwd(),
                dir_list: [],
                file_list: [],
                src_pdir_key: store.get_node_by_id(file_ids[0]).get_pdir_key()
            }
            for(var i = 0, len = file_ids.length ; i < len; i++) {
                var file = store.get_node_by_id(file_ids[i]);
                //支持批量文件转存
                if(file.is_dir()) {
                    data['dir_list'].push({
                        dir_key: file_ids[i]
                    });
                } else {
                    data['file_list'].push({
                        file_id: file_ids[i],
                        pdir_key: file.get_pdir_key()
                    });
                }
            }
            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg' + (store.get_sid() ? '?sid='+store.get_sid() : ''),
                cmd: store.is_note() ? 'WeiyunShareSaveData' : 'WeiyunSharePartSaveData',
                use_proxy: true,
                body: data
            }).ok(function() {
                widgets.reminder.ok('保存成功');
            }).fail(function(msg) {
                widgets.reminder.error(msg || '保存失败');
            })
        },

        on_mobile_save: function(file_ids) {
            var len = file_ids.length,
                error = '';
            if(typeof mqq === 'undefined') {
                return;
            } else if(!mqq.compare('5.2') < 0) {
                widgets.reminder.error('保存失败，请升级qq版本');
                return;
            }
            widgets.reminder.loading('保存中...');
            for(var i= 0; i< len; i++) {
                var file = store.get_node_by_id(file_ids[i]);
                mqq.media.saveImage({
                    content: file.get_thumb_url()
                }, function(data) {
                    if(data.retCode !== 0) {
                        error = data.msg || '保存失败';
                    }
                    if(--len === 0) {
                        if(error) {
                            widgets.reminder.error(error);
                        } else {
                            widgets.reminder.ok('保存成功');
                        }
                    }

                });
            }
        },

        on_save_all: function() {
            /*if(!this.check_login()) {
                this.to_login();
                return;
            }*/
            widgets.reminder.loading('保存中...');
            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg' + (store.get_sid() ? '?sid='+store.get_sid() : ''),
                cmd: 'WeiyunShareSaveData',
                use_proxy: true,
                body: {
                    share_key: store.get_share_key(),
                    pwd: store.get_share_pwd()
                }
            }).ok(function() {
                widgets.reminder.ok('保存成功');
            }).fail(function(msg, ret) {
                widgets.reminder.error(msg || '保存失败');
            })
        },

        on_open: function(file_id) {
            var file = store.get_node_by_id(file_id);
            this.on_preview(file);
        },

        on_preview: function(node){
            var me = this;
            require.async('ftn_preview', function(mod) {
                ftn_preview = mod.get('./ftn_preview');

                if(ftn_preview.can_preview(node)){
                    node._share_key = store.get_share_key();
                    node._share_pwd = store.get_share_pwd();
                    node.down_file = function (e) {
                        me.on_download([node], e);
                    }
                    ftn_preview.preview(node);
                } else{
                    //不支持预览的文件跳转至下载
                    me.on_download(node);
                }
            });
        },

        on_secret_view: function(pwd) {
            widgets.reminder.loading('请稍候...');
            cookie.set('sharepwd', pwd);
            setTimeout(function() {
                location.reload();
            }, 10);
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('skey'),
                sid = store.get_sid();
            if(uin && skey || sid) {
                return true;
            }

            if(browser.WEIXIN || browser.QQ || browser.QZONE) {
                logger.report('weiyun_share_no_login', {
                    time: (new Date()).toString(),
                    url: location.href,
                    uin: uin || '',
                    skey: skey || '',
                    sid: sid || ''
                });
            }
            return false;
        },

        //下载
        on_download: function(file) {
            var data = {},
                me = this;

            data.share_key = store.get_share_key();
            data.pwd = store.get_share_pwd();
            data.pack_name = file.get_name();
            data.pdir_key = file.get_pdir_key();

            data.file_list = [];
            data.file_list.push({
                file_id: file.get_id(),
                pdir_key: file.get_pdir_key()
            });

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                cmd: 'WeiyunSharePartDownload',
                use_proxy: true,
                cavil: true,
                pb_v2: true,
                body: data
            }).ok(function(msg, body) {
                me.do_download(body.download_url);
            }).fail(function(msg) {
                widgets.reminder.error(msg || '下载失败');
            });
        },

        do_download: function(download_url) {
            this.get_$down_iframe().attr('src', download_url);
        },
        get_$down_iframe: function() {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        },

        to_login: function() {
            var go_url = window.location.href;
            window.location.href = "http://ui.ptlogin2.weiyun.com/cgi-bin/login?appid=527020901&no_verifyimg=1&f_url=loginerroralert&hide_close_icon=1&s_url="+encodeURIComponent(go_url)+"&style=9&hln_css=http%3A%2F%2Fimgcache.qq.com%2Fvipstyle%2Fnr%2Fbox%2Fweb%2Fimages%2Flogo-v2.png";
        }
    });

    return mgr;
});define.pack("./outlink",["$","lib","common","./store","./ui","./mgr"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),

        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var outlink = new Module('outlink', {

        render: function(share_info) {
            store.init(share_info);
            ui.render();
            mgr.observe(ui);

            seajs.use(['filetype_icons_css', 'component_base_css', 'component_confirm_css', 'component_tips_css', 'zepto_fx']);
        }
    });

    return outlink;
});/**
 * 多选模块
 * @author hibincheng
 * @date 2015-02-04
 */
define.pack("./select_mode",["lib"],function(require, exports, module) {
    var lib = require('lib'),

        Module = lib.get('./Module'),
        undefined;

    var select_items = [],
        select_map = {};

    var select_mode = new Module('select_mode', {

        select: function(item) {
            if(!select_map[item]) {
                select_items.push(item);
                select_map[item] = 1;
            }
        },

        unselect: function(item) {
            var index = select_map[item];
            if(select_map[item]) {
                for(var i= 0,len = select_items.length; i < len; i++) {
                    if(select_items[i] === item) {
                        select_items.splice(i, 1);
                        break;
                    }
                }
                delete  select_map[item];
            }
        },

        toggle_select: function(item) {
            if(select_map[item]) {
                this.unselect(item);
            } else {
                this.select(item);
            }
        },

        get_selected_items: function() {
            return select_items;
        },

        is_empty: function() {
            return select_items.length === 0;
        },

        clear: function() {
            select_items = [];
            select_map = {};
        }
    });

    return select_mode;
});/**
 * share_info 数据存储模块
 */
define.pack("./store",["$","lib","common"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),

        undefined;

    var nodes_map = {};

    var File = function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.child_file_list = [];
        this.child_dir_list = [];
    }

    File.prototype = {
        get_id: function() {
            return this.data['file_id'] || this.data['dir_key'];
        },

        get_name: function() {
            return this.data['file_name'] || this.data['dir_name'];
        },

        get_type: function() {
            if(this.data['dir_name']) {
                return '';
            } else {
                return (this.data['file_name'].split('.')[1] || '').toLowerCase();
            }
        },

        get_file_size: function() {
            return this.data['file_size'];
        },

        get_pdir_key: function() {
            return this.data['pdir_key'];
        },

        get_thumb_url: function() {
            return this.data['thumb_url'];
        },

        get_parent: function() {
            return this.parent;
        },

        get_file_children: function() {
            return this.child_file_list;
        },
        get_dir_children: function() {
            return this.child_dir_list;
        },

        is_dir: function() {
            return !!this.data['dir_key'];
        },

        is_image: function() {
            return !!this.data['thumb_url'];
        },

        append_child: function(node) {
            if(node.is_dir()) {
                this.child_dir_list.push(node);
            } else {
                this.child_file_list.push(node);
            }

            nodes_map[node.get_id()] = node;
        }
    }

    var root_node = new File(null, {
        file_id: '',
        file_name: '微去分享',
        pdir_key: '',
        file_size: 0
    })

    var store = new Module('store', {

        init: function(share_info) {
            this.share_info = share_info || {};
            var share_flag = parseInt(this.share_info['share_flag'], 10);

            if(share_flag == 5 || share_flag == 6) {
                this.share_type = 'collector';
            } else if(share_flag == 7 || share_flag == 8) {
                this.share_type = 'article';
            } else if(share_flag == 2 || share_flag == 4) {
                this.share_type = 'note';
            } else {
                this.share_type = 'normal';
            }

            this.format_file_list(share_info, root_node);
            this.format_dir_list(share_info, root_node);

        },

        format_file_list: function(info, root_node) {
            var file_list = info['file_list'];

            if(file_list && file_list.length) {
                $.each(file_list, function(i, file) {
                    var file_node = new File(root_node, {
                        pdir_key: file['pdir_key'] || info['dir_key'] || info['pdir_key'],
                        file_id: file['file_id'],
                        file_name: file['file_name'],
                        file_size: file['file_size'],
                        thumb_url: file['thumb_url']
                    });
                    root_node.append_child(file_node);
                });
            }
        },

        format_dir_list: function(info, root_node) {
            var dir_list = info['dir_list'];

            if(dir_list && dir_list.length) {
                $.each(dir_list, function(i, dir) {
                    var dir_node = new File(root_node, {
                        pdir_key: dir['pdir_key'] || info['dir_key'] || info['pdir_key'],
                        dir_key: dir['dir_key'],
                        file_name: dir['dir_name'],
                        file_size: dir['dir_size'] || 0
                    });
                    root_node.append_child(dir_node);
                    if(dir['file_list']) {
                        store.format_file_list(dir, dir_node);
                    }
                    if(dir['dir_list']) {
                        store.format_dir_list(dir, dir_node);
                    }
                });
            }
        },

        /*get_file_list: function() {
            return this.share_info['file_list'];
        },

        get_dir_list: function() {
            return this.share_info['dir_list'];
        },

        get_dir_file_list: function() {
            if(this.share_info['dir_list'] && this.share_info['dir_list'].length === 1) {
                return this.share_info['dir_list']['file_list'] || [];
            }
            return [];
        },*/

        get_node_by_id: function(id) {
            return nodes_map[id];
        },

        get_root_node: function() {
            return root_node;
        },

        get_share_key: function() {
            return this.share_info['share_key'];
        },

        get_share_pwd: function() {
            return this.share_info['pwd'];
        },

        get_sid: function() {
            return this.share_info['sid'];
        },

        is_photo_list: function() {
            if(typeof this.is_all_image !== 'undefined') {
                return this.is_all_image;
            }
            if(this.share_type !== 'normal') {
                return false;
            }
            var share_info = this.share_info;

            if(share_info['dir_list'] && share_info['dir_list'].length > 0) {
                return false;
            }
            var file_list = share_info['file_list'],
                is_all_image = true;
            if(file_list && share_info['dir_list']) {
                return false;
            }
            if(file_list && !share_info['dir_list']) {
                for(var i = 0, len = file_list.length; i < len; i++) {
                    if(!file_list[i].thumb_url) {
                        is_all_image = false;
                        break;
                    }
                }
            }
            this.is_all_image = is_all_image;
            return is_all_image;
        },
        is_file_list: function() {
            return this.share_type === 'normal' && !this.is_photo_list();
        },
        is_note: function() {
            return this.share_type == 'note';
        },

        is_article: function() {
            return this.share_type == 'article';
        },

        is_collector: function() {
            return this.share_type == 'collector';
        },

        is_need_pwd: function() {
            return !!this.share_info.need_pwd;
        },

        is_temporary: function() {
            return !!this.share_info.temporary;
        },

        get_thumb_urls: function(size) {
            var thumb_urls = [];
            if(this.is_photo_list()) {
                var imgs = root_node.child_file_list;

                for(var i= 0, len = imgs.length; i < len; i++) {
                    var thumb_url = imgs[i].get_thumb_url();
                    if(thumb_url) {
                        thumb_url = thumb_url.indexOf('?') > -1 ? thumb_url + '&size='+size+'*'+size : thumb_url + '?size='+size+'*'+size;
                        thumb_urls.push(imgs[i].get_thumb_url() + (size ? '&size='+size+'*'+size : ''));
                    }
                }
            } else {
                var nodes = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list;
                for(var i= 0, len = nodes.length; i < len; i++) {
                    var thumb_url = nodes[i].get_thumb_url();
                    if(thumb_url) {
                        thumb_url = thumb_url.indexOf('?') > -1 ? thumb_url + '&size='+size+'*'+size : thumb_url + '?size='+size+'*'+size;
                        thumb_urls.push(thumb_url);
                    }
                }
            }
            return thumb_urls;
        },

        get_node_index: function(file_id) {
            var imgs = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list,
                index;
            $.each(imgs, function(i, img) {
                if(img.get_id() === file_id) {
                    index = i;
                    return false;
                }
            });

            return index;
        },
        get_image_index: function(file_id) {
            var nodes = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list,
                index,
                imgs = [];
            $.each(nodes, function(i, node) {
                if(node.is_image()) {
                    imgs.push(node);
                }
            });

            $.each(imgs, function(i, img) {
                if(img.get_id() === file_id) {
                    index = i;
                    return false;
                }
            });

            return index;
        },
        get_node_by_index: function(index) {
            return root_node.child_file_list[index] || root_node.child_dir_list[0].child_file_list[index];
        },

        get_image_by_index: function(index) {
            var nodes = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list,
                imgs = [];
            $.each(nodes, function(i, node) {
                if(node.is_image()) {
                    imgs.push(node);
                }
            });

            return imgs[index];
        }
    });

    return store;
});/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui.file_list",["lib","$","common","./store","./image_lazy_loader","./Previewer","./select_mode","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        router = lib.get('./router'),
        widgets = common.get('./ui.widgets'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        select_mode = require('./select_mode'),
        tmpl = require('./tmpl'),

        undefined;

    var ui = new Module('ui.file_list', {

        render: function() {
            this.render_list();
            this.bind_action();
            image_lazy_loader.init('#container');
            router.init('root');
            this.listenTo(router, 'change', function(to, from) {
                if(from === 'preview') {
                    this.back_to_list();
                }
            });
        },

        render_list: function() {
            var me = this;
            var is_move = false;
            this.get_$file_list().on('touchmove', '[data-id=item]', function(e) {
                is_move = true;
            });
            this.get_$file_list().on('touchend', '[data-id=item]', function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $target = $(e.target).closest('[data-id=item]'),
                    src = $target.find('.icons').attr('data-src');
                if(me.batch_operating) {
                    select_mode.toggle_select($target.attr('id'));
                    $target.toggleClass('checked');
                    me.get_$confrim_btn().toggleClass('btn-disable', select_mode.is_empty());
                }else if(src) { //图片则进行预览
                    me.preview_img(src, $target.attr('id'));
                } else {
                    me.trigger('action', $target.attr('data-action'), $target.attr('id'), e);
                }
            })
        },

        preview_img: function(src, file_id) {
            this.get_$ct().hide();
            this.get_$banner().hide();
            this.previewer = new Previewer(file_id);
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
            this.get_$ct().show();
            this.get_$banner().show();
        },

        bind_action: function() {
            var me = this;
            //批量操作按钮
            this.get_$ct().find('[data-id=bbar_normal],[data-id=bbar_confirm]').on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action');
                e.preventDefault();
                if(action_name === 'save_all') {
                    me.trigger('action', action_name, e);
                    return;
                }
                if(action_name !== 'cancel' && select_mode.is_empty() && me.batch_operating) {
                    return;
                }
                if(!me.toggle_batch(action_name)) {
                    var selected_items = select_mode.get_selected_items();
                    if(action_name !=='cancel' && selected_items.length) {
                        me.trigger('action', action_name, selected_items, e);
                    }
                    select_mode.clear();
                }
            });
        },

        toggle_batch: function(action_name) {
            var $item_list = this.get_$ct().find('[data-id=item]'),
                me = this;
            $item_list.each(function(i,item) {
                var $item = $(item);
                if(!me.batch_operating) {
                    $item.addClass('choseable checked');
                    select_mode.toggle_select($item.attr('id'));
                } else {
                    $item.removeClass('choseable checked');
                }
            });

            if(!me.batch_operating) {
                me.get_$file_list().addClass('active').removeClass('unactive');
                me.get_$ct().find('[data-id=bbar_normal]').hide();
                me.get_$ct().find('[data-id=bbar_confirm]').show().find('[data-id=confirm]').attr('data-action', action_name);
            } else {
                me.get_$file_list().removeClass('active').addClass('unactive');
                me.get_$ct().find('[data-id=bbar_normal]').show();
                me.get_$ct().find('[data-id=bbar_confirm]').hide();
                me.get_$confrim_btn().toggleClass('btn-disable', false);
            }
            me.batch_operating = !me.batch_operating;
            return me.batch_operating;
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
});/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui",["lib","$","common","./store","./image_lazy_loader","./Previewer","./ui.file_list","./ui.photo","./mgr","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        huatuo_speed = common.get('./huatuo_speed'),
        browser = common.get('./util.browser'),
        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        ui_file_list = require('./ui.file_list'),
        ui_photo = require('./ui.photo'),
        mgr = require('./mgr'),
        tmpl = require('./tmpl'),

        undefined;

    var ui = new Module('outlink.ui', {

        render: function() {
            $('#_avator').css('backgroundImage', 'url('+$('#_avator').attr('data-src')+')'); //头像也延迟加载
            if(store.is_need_pwd()) {
                this.render_secret();
                return;
            }else if(store.is_photo_list()) {
                mgr.observe(ui_photo);
                ui_photo.render();
                this.report_speed();
                return;
            } else if(store.is_note()) {
                this.render_note();
            } else if(store.is_file_list()) {
                mgr.observe(ui_file_list);
                ui_file_list.render();
                this.report_speed();
                return;
            }

            this.bind_action();
            this.report_speed();
        },

        report_speed: function() {
            var render_time = +new Date();
            //延时以便获取performance数据
            setTimeout(function() {
                huatuo_speed.store_point('1483-1-1', 20, g_serv_taken);
                huatuo_speed.store_point('1483-1-1', 21, g_css_time - g_start_time);
                huatuo_speed.store_point('1483-1-1', 22, (g_end_time - g_start_time) + g_serv_taken);
                huatuo_speed.store_point('1483-1-1', 23, g_js_time - g_end_time);
                huatuo_speed.store_point('1483-1-1', 24, (render_time - g_start_time) + g_serv_taken);
                huatuo_speed.report('1483-1-1', true);
            }, 1000);
        },

        bind_action: function() {
            var me = this;
            this.get_$ct().on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action'),
                    file_id = $target.closest('[data-id=item]').attr('id');

                me.trigger('action', action_name, file_id, e);
            });
        },

        render_secret: function() {
            var me = this;
            if(store.share_info['retry']) {
                cookie.unset('sharepwd');
                widgets.reminder.error(store.share_info['msg'] || '密码错误');
            }

            var is_num_word_key = function(key) {
                if(key > 47 && key < 58 || key > 64 && key < 91 || key > 95 && key < 106) {
                    return true;
                }
                return false;
            }

            this.get_$ct().on('click', '[data-action=secret_view]', function(e) {
                var $inputs = me.get_$ct().find('input[type=password]'),
                    pwd = '';

                $inputs.forEach(function(input) {
                    pwd = pwd + ($(input).val() || '');
                });

                if(!pwd) {
                    widgets.reminder.error('密码不能为空');
                    return;
                } else if(pwd.length !== 4) {
                    widgets.reminder.error('请输入完整密码');
                    return;
                }
                me.trigger('action', 'secret_view', pwd, e);
            });

            this.get_$ct().find('[data-id=pwdContainer] input').on('keydown', function(e) {
                var $target = $(e.target),
                    keycode = e.keyCode;

                var $cur = $target.parent(),
                    $pre = $cur.prev();

                if(keycode == 8) {//回退键
                    if($target.attr('name') == 'pwd1') {
                        return;
                    }

                    $cur.clone().insertAfter($cur);
                    $target.val($pre.children('input').val());
                    $target.attr('name', $pre.children('input').attr('name'));
                    $pre.remove();
                }
            }).on('keyup', function(e) {
                var $target = $(e.target),
                    keycode = e.keyCode;

                var $cur = $target.parent(),
                    $next = $cur.next();

                if(keycode != 8) {
                    if($target.attr('name') == 'pwd4') {
                        $target[0].blur();
                        return;
                    }

                    $cur.clone().insertBefore($cur);
                    $target.val($next.children('input').val());
                    $target.attr('name', $next.children('input').attr('name'));
                    $next.remove();
                }
            });

        },

        render_note: function() {
            this.get_$ct().find('[data-id=content] img').addClass('.note-img');
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$pwd: function() {
            return this.$pwd = this.$pwd || (this.$pwd = $('#pw-input'));
        }
    });

    return ui;
});/**
 * 图列表ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui.photo",["lib","$","common","./store","./image_lazy_loader","./Previewer","./select_mode","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        router = lib.get('./router'),
        image_loader = lib.get('./image_loader'),
        widgets = common.get('./ui.widgets'),

        store = require('./store'),
        image_lazy_loader = require('./image_lazy_loader'),
        Previewer = require('./Previewer'),
        select_mode = require('./select_mode'),
        tmpl = require('./tmpl'),

        undefined;

    var ui = new Module('ui.photo', {

        render: function() {
            //单张图
            if(store.get_root_node().get_file_children().length === 1) {
                this.render_one_img();
            } else {
                this.render_img_list();
                router.init('root');
                this.listenTo(router, 'change', function(to, from) {
                    if(from === 'preview') {
                        this.back_to_list();
                    }
                });
            }
        },
        //单图使用
        render_one_img: function() {
            var me = this;
            //html已直出，只绑定事件即可
            this.get_$ct().on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action'),
                    file_id = store.get_node_by_index(0).get_id();
                if(action_name === 'view_raw') {
                    me.on_view_raw();
                } else {
                    me.trigger('action', action_name, [file_id], e);
                }
            });
            $('[data-id=img]').width($(window).width());
        },
        //单图使用
        on_view_raw: function() {
            var raw_url = store.get_node_by_index(0).get_thumb_url();
            var $cur_img = $('img');
            if($cur_img.attr('data-size') == 'raw') {
                widgets.reminder.ok('已经是原图');
                return;
            }
            $cur_img.replaceWith('<i id="_preview_loading" class="icons icons-reminder icon-reminder-loading"></i>');
            image_loader.load(raw_url).done(function(img) {
                img.className = 'wy-img-preview';
                $(img).attr('data-size', 'raw');
                $('#_preview_loading').replaceWith(img);
            });
        },

        toggle_batch: function(action_name) {
            var $img_list = this.get_$ct().find('[data-id=img]'),
                me = this;
            $img_list.each(function(i, img) {
                var $img = $(img);
                $img.empty();
                if(!me.batch_operating) {
                    $img.append('<i data-id="check" class="icons icon-blue-checked"></i>');
                    select_mode.toggle_select($img.attr('id'));
                }
            });
            if(!me.batch_operating) {
                me.get_$ct().find('[data-id=bbar_normal]').hide();
                me.get_$ct().find('[data-id=bbar_confirm]').show().find('[data-id=confirm]').attr('data-action', action_name);
            } else {
                me.get_$ct().find('[data-id=bbar_normal]').show();
                me.get_$ct().find('[data-id=bbar_confirm]').hide();
                me.get_$confrim_btn().toggleClass('btn-disable', false);
            }
            me.batch_operating = !me.batch_operating;
            return me.batch_operating;
        },

        render_img_list: function() {
            var me = this;
            image_lazy_loader.init('#container');
            var is_move = false;
            this.get_$ct().on('touchmove', '[data-id=img]', function(e) {
                is_move = true;
            });
            this.get_$ct().on('touchend', '[data-id=img]',  function(e) {
                e.preventDefault();
                if(is_move) {
                    is_move = false;
                    return;
                }
                var $target = $(e.target).closest('[data-id=img]');
                if(me.batch_operating) {
                    select_mode.toggle_select($target.attr('id'));
                    $target.find('[data-id=check]').toggleClass('icon-grey-check').toggleClass('icon-blue-checked');
                    me.get_$confrim_btn().toggleClass('btn-disable', select_mode.is_empty());
                } else {
                    me.preview_img($target.attr('data-src'), $target.attr('id'));
                }
            });
            //批量操作按钮
            this.get_$ct().find('[data-id=bbar_normal],[data-id=bbar_confirm]').on('touchend', '[data-action]', function(e) {
                var $target = $(e.target),
                    action_name = $target.attr('data-action');
                e.preventDefault();
                if(action_name !== 'cancel' && select_mode.is_empty() && me.batch_operating) {
                    return;
                }
                if(!me.toggle_batch(action_name)) {
                    var selected_items = select_mode.get_selected_items();
                    if(action_name !=='cancel' && selected_items.length) {
                        me.trigger('action', action_name, selected_items, e);
                    }
                    select_mode.clear();
                }
            });
        },

        preview_img: function(src, file_id) {
            this.get_$ct().hide();
            this.get_$banner().hide();
            this.previewer = new Previewer(file_id);
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
            this.get_$ct().show();
            this.get_$banner().show();
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$banner: function() {
            return this.$banner = this.$banner || (this.$banner = $('#banner'));
        },

        get_$confrim_btn: function() {
            return this.$confrim_btn = this.$confrim_btn || (this.$confrim_btn = this.get_$ct().find('[data-id=confirm]'));
        }
    });

    return ui;
});
//tmpl file list:
//outlink/src/outlink.tmpl.html
//outlink/src/previewer.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'previewer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wy-img-previewer-wrapper">\r\n\
        <nav data-id="page_text" data-id="back" class="wy-share-nav wy-back-nav" style="">');
_p(data.page_text);
__p.push('</nav>\r\n\
        <div class="wy-hor-img-bg">\r\n\
            <ul data-id="img_list" class="wy-img-preview-list">\r\n\
            </ul>\r\n\
        </div>\r\n\
        <footer data-id="bbar" class="wy-preview-controller verticle-wy-preview-controller">');

                var action_name = window.mqq ? 'mobile_save' : 'view_raw',
                    action_text = window.mqq ? '保存到手机' : '查看原图';

                var store = require('./store');
            __p.push('            <button data-action="');
_p(action_name);
__p.push('" class="btn-item" role="button">');
_p(action_text);
__p.push('<span data-id="file_size" class="file-size"></span></button>\r\n\
            <button data-action="save" class="btn-item" role="button">');
 if(store.is_temporary()) { __p.push('保存到中转站');
 } else {__p.push('保存到微云');
 } __p.push('</button>\r\n\
        </footer>\r\n\
    </div>');

return __p.join("");
},

'previewer_item': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var $ = require('$'),
            width = $(window).width();
    __p.push('    ');
for(var i=0, len=data.total; i<len;i++) { __p.push('        <li class="wy-img-item" style="width:');
_p(width);
__p.push('px">\r\n\
            <i id="previewer_item_');
_p(i);
__p.push('" class="icons icons-reminder icon-reminder-loading" style=""></i>');
 if(i == len-1) { __p.push('        </li>');
}__p.push('    ');
}__p.push('');

return __p.join("");
}
};
return tmpl;
});
