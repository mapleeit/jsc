//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/good-photo/module/mv/mv.r161107",["$","lib","common"],function(require,exports,module){

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
//mv/src/address.js
//mv/src/app_cfg.js
//mv/src/file/FileNode.js
//mv/src/file/InnerVation.js
//mv/src/file/Record.js
//mv/src/image_lazy_loader.js
//mv/src/input_box.js
//mv/src/like.js
//mv/src/mgr.js
//mv/src/music.js
//mv/src/mv.js
//mv/src/store.js
//mv/src/ui.js
//mv/src/user_info.js
//mv/src/user_log.js
//mv/src/preview/family.tmpl.html
//mv/src/preview/school.tmpl.html
//mv/src/preview/travel.tmpl.html
//mv/src/template.tmpl.html
//mv/src/template/family.tmpl.html
//mv/src/template/school.tmpl.html
//mv/src/template/travel.tmpl.html
//mv/src/view.tmpl.html

//js file list:
//mv/src/address.js
//mv/src/app_cfg.js
//mv/src/file/FileNode.js
//mv/src/file/InnerVation.js
//mv/src/file/Record.js
//mv/src/image_lazy_loader.js
//mv/src/input_box.js
//mv/src/like.js
//mv/src/mgr.js
//mv/src/music.js
//mv/src/mv.js
//mv/src/store.js
//mv/src/ui.js
//mv/src/user_info.js
//mv/src/user_log.js
/**
 * 图片地理信息
 * @author xixinhuang
 * @date 2017-01-12
 */
define.pack("./address",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        https_tool = common.get('./util.https_tool'),

        undefined;

    var address = new Module('address', {

        init: function() {
            var me = this;
            //缓存地理信息数据
        },

        _bind_event: function() {

        },

        get_address: function(data) {
            var me = this;

            this.send_request().done(function(body) {
                debugger;
            }).fail(function(msg, ret) {
                debugger;
                widgets.reminder.error(msg || '请求失败，请稍后重试');
            });
        },

        send_request: function() {
            var defer = $.Deferred(),
                me = this;
            var req_data = {
                long_lat_list: [{
                    longitude: 113.91378833,
                    latitude: 22.55252833
                }],
                poi_count: 1
            };

            request.xhr_get({
                url: https_tool.translate_cgi('http://' + location.hostname + '/hzp_interface.fcg'),
                cmd: 'GetPoiInfoByLongLat',
                use_proxy: false,
                body: req_data
            }).ok(function(msg, body) {
                defer.resolve(body);
            }).fail(function(msg, ret) {
                defer.reject(msg, ret);
            });

            return defer;
        },

        get_$list: function() {
            return this.$list = this.$list || (this.$list = $('.j-list'));
        }
    });

    return address;
});/**
 * 好照片app相关
 * @author xixinhuang
 * @date 2015-12-24
 */
define.pack("./app_cfg",["lib","common","$"],function(require, exports, module) {

    var lib     = require('lib'),
        common  = require('common'),
        $       = require('$'),

        cookie = lib.get('./cookie'),
        Module  = lib.get('./Module'),
        constants = common.get('./constants'),
        browser = common.get('./util.browser'),

        REGEXP_ANDROID_HZP_APP = /Android.*? haozp\/(\d\.\d\.\d)/,
        REGEXP_IOS_HZP_APP = /(iPad|iPhone|iPod).*? haozp\/(\d\.\d\.\d)/,
        REGEXP_HZP_VERSION = /(iPad|iPhone|iPod|Android).*? haozp\/(\d+).(\d+).(\d+)/i,
        user_agent = navigator.userAgent,
        undefined;

    var app_cfg = new Module('mv.app_cfg', {

        init: function() {
            if(window.g_info) {
                this.data = JSON.parse(window.g_info);
                return;
            }
            var data = {
                is_ios_app: false,
                is_android_app: false,
                is_hzp_app: false,
                is_h5: false,
                is_web: false,
                is_debug: false,
                is_test: false
            }
            if(REGEXP_IOS_HZP_APP.test(user_agent)) {
                data.is_ios_app = true;
                data.is_hzp_app = true;
            }
            if(REGEXP_ANDROID_HZP_APP.test(user_agent)) {
                data.is_android_app = true;
                data.is_hzp_app = true;
            }
            if(browser.IOS || browser.android) {
                data.is_h5 = true;
            } else {
                data.is_web = true;
            }
            data.is_debug = location.search.indexOf('__debug__') > -1 || cookie.get('debug') === 'on';
            data.is_test = location.hostname === 'hzp-test.qq.com';

            this.data = data;
        },

        is_IOS_app: function() {
            //return REGEXP_IOS_HZP_APP.test(user_agent);
            return this.data['is_ios_app'];
        },

        is_android_app: function() {
            //return REGEXP_ANDROID_HZP_APP.test(user_agent);
            return this.data['is_android_app'];
        },

        is_hzp_app: function() {
            //return this.is_IOS_app() || this.is_android_app();
            return this.data['is_hzp_app'];
        },

        //大于某个版本返回true，否则返回false
        compare_hzp_version: function(version) {
            var value,
                result = false,
                version_arr = this.get_version_code_list(version),    //IOS1.5.3以上才能支持输入框
                match_arr = REGEXP_HZP_VERSION.exec(user_agent);

            if(match_arr && match_arr.length>1) {
                for(var i=2; i<match_arr.length; i++) {
                    value = parseInt(match_arr[i]);
                    if(value > version_arr[i-1]) {
                        result = true;
                        break;
                    } else if(value < version_arr[i-1]) {
                        result = false;
                        break;
                    }
                }
            }

            return result;
        },

        //example: '1.5.4' ==> [0, 1, 5, 4]
        get_version_code_list: function(version) {
            var arr = ['0'].concat(version.split('.'));
            arr.forEach(function(item, i) {
                arr[i] = parseInt(item);
            });

            return arr;
        },

        get_app_cfg: function() {
            return this.data;
        },

        set_visibility: function(is_hidden) {
            this.is_visibility = !is_hidden;
            this.time = +new Date();
            var me = this;

            setTimeout(function() {
                me.is_visibility = true;
                me.time = 0;
            }, 5000);
        },
        /*
         * 判断页面可见性，需满足条件：1）设置过is_visibility; 2）时间在500ms内; 3) is_visibility属性为false，即不可见
         * */
        get_visibility: function() {
            var now = +new Date();
            if(this.time && (now - this.time < 500) && !this.is_visibility) {
                this.is_visibility = true;
                this.time = 0;
                return false;
            } else {
                return true;
            }
        },

        //hex2bin，把后台返回的dir_key转换为客户端使用的字符串格式
        hex2String: function(strInput){
            var HexStr = '',
                nInputLength = strInput.length;

            //当输入够偶数位,奇数是非法输入
            if(nInputLength%2 === 0) {
                for (var i=0; i < nInputLength; i = i + 2 )
                {
                    var str = strInput.substr(i, 2); //16进制；
                    //StrHex = StrHex + .toString(16);

                    var n = parseInt(str, 16);//10进制；
                    HexStr = HexStr + String.fromCharCode(n);
                }
            }
            return HexStr;
        }
    });

    return app_cfg;

});
/*
 好照片动感影集，文件fileitem对象
 * @author xixinhuang
 * @date 2016/09/01
 * */
define.pack("./file.FileNode",[],function(require, exports, modules) {

    var id_seed = 0;
    var FileNode = function (data) {
        this._d = data;
        this._id = data.file_id || 'hzp-record-' + (++id_seed);
    };


    FileNode.prototype = {
        get_id: function() {
            return this._id;
        },

        get_file_item: function() {
            return this._d;
        },
        /**
         * 更新属性，如果它有关联store，会触发store的update事件，也可以当作batch_set的别名使用（只会产生一次事件）：
         * record.set('a', 1);
         * record.set({a:1,b:2});
         * @param {String} name
         * @param {Mixed} value
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        set : function(name, value, prevent_events){
            if(name && typeof name === 'object'){
                return this.batch_set(name, prevent_events);
            }
            var data = this.get_file_item(),
                old = data[name], olds;
            if(old !== value){
                data[name] = value;
                if(prevent_events !== true){
                    olds = {};
                    olds[name] = old;
                    this.notify_update(olds);
                }
            }
        },
        /**
         * 以数据对象形式批量更新属性，注意无视原型中的值
         * @param {Object} values
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        batch_set : function(values, prevent_events){
            var name, value, old,
                olds = {},
                modified = false,
                data = this.get_file_item();

            for(name in values){
                if(values.hasOwnProperty(name)){
                    value = values[name];
                    old = data[name];
                    if(old !== value){
                        data[name] = value;
                        olds[name] = old;
                        modified = true;
                    }
                }
            }
            if(prevent_events !== true && modified){
                this.notify_update(olds);
            }
        },
        /**
         * 获取属性值
         * @param {String} name
         * @return {Mixed} value
         */
        get : function(name){
            return this.d[name];
        },
        /**
         * 通知关联的store值有更新
         * @private
         */
        notify_update : function(olds){

        },

        get_file_id: function() {
            return this._d['file_id'] || '';
        },

        get_file_sha: function() {
            return this._d['file_sha'] || '';
        },

        get_ext_info: function () {
            return this._d['ext_info'] || null;
        },

        get_total_num: function () {
            return this.get_ext_info()? this._d['ext_info']['total_num'] : 0;
        },

        get_longitude: function () {
            return this.get_ext_info()? this._d['ext_info']['longitude'] : 0;
        },

        get_height: function () {
            return this.get_ext_info()? this._d['ext_info']['height'] : 0;
        },

        get_batch_id: function () {
            return this.get_ext_info()? this._d['ext_info']['batch_id'] : 0;
        },

        get_thumb_url: function () {
            return this.get_ext_info()? this._d['ext_info']['thumb_url'] : '';
        },

        get_take_time: function () {
            return this.get_ext_info()? this._d['ext_info']['take_time'] : 0;
        },

        get_latitude: function () {
            return this.get_ext_info()? this._d['ext_info']['latitude'] : 0;
        },

        get_number: function () {
            return this.get_ext_info()? this._d['ext_info']['number'] : 0;
        },

        get_width: function () {
            return this.get_ext_info()? this._d['ext_info']['width'] : 0;
        },

        get_upload_uid: function () {
            return this.get_ext_info()? this._d['ext_info']['upload_uid'] : '';
        },

        get_pdir_key: function() {
            return this._d['pdir_key'] || '';
        },

        get_filename: function() {
            return this._d['filename'] || '';
        },

        get_file_size: function() {
            return this._d['file_size'] || 0;
        },

        get_file_ctime: function() {
            return this._d['file_ctime'] || 0;
        },

        get_file_mtime: function() {
            return this._d['file_mtime'] || 0;
        },

        get_lib_id: function() {
            return this._d['lib_id'] || 0;
        },

        get_file_status: function() {
            return this._d['file_status'] || 0;
        },

        get_diff_version: function() {
            return this._d['diff_version'] || 0;
        }
    }

    return FileNode;
});/*
 好照片动感影集，后台传递的innerVation对象
 * @author xixinhuang
 * @date 2016/09/01
 * */
define.pack("./file.InnerVation",["$","lib","./file.Record","./file.FileNode"],function(require, exports, modules) {
    var $ = require('$');
    var lib = require('lib');
    var Record = require('./file.Record');
    var FileNode = require('./file.FileNode');

    var InnerVation = function(data) {
        var file_list = data.file_list;
        //data.innervation_id = data.innervation_id.replace(/_.+/,'');
        this.data = data;
        this.data.file_list = [];
        //this.innervation_id     = data.innervation_id;
        //this.innervation_title  = data.innervation_title;
        //this.dir                = data.dir;
        //this.innervation_desc   = data.innervation_desc;
        //this.owner              = data.owner;
        //this.create_time        = data.create_time;
        //this.modify_time        = data.modify_time;
        //this.file_list          = [];
        //this.innervation_template = data.innervation_template;

        var me = this,
            record = {};
        $.each(file_list, function(index, item) {
            record = new Record(item);
            me.data.file_list.push(record);
        });
    }

    InnerVation.prototype = {
        /**
         * 更新属性，如果它有关联store，会触发store的update事件，也可以当作batch_set的别名使用（只会产生一次事件）：
         * record.set('a', 1);
         * record.set({a:1,b:2});
         * @param {String} name
         * @param {Mixed} value
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        set : function(name, value, prevent_events){
            if(name && typeof name === 'object'){
                return this.batch_set(name, prevent_events);
            }
            var data = this.data,
                old = data[name], olds;
            if(old !== value){
                data[name] = value;
                if(prevent_events !== true){
                    olds = {};
                    olds[name] = old;
                    this.notify_update(olds);
                }
            }
        },
        /**
         * 以数据对象形式批量更新属性，注意无视原型中的值
         * @param {Object} values
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        batch_set : function(values, prevent_events){
            var name, value, old,
                olds = {},
                modified = false,
                data = this.data;
            for(name in values){
                if(values.hasOwnProperty(name)){
                    value = values[name];
                    old = data[name];
                    if(old !== value){
                        data[name] = value;
                        olds[name] = old;
                        modified = true;
                    }
                }
            }
            if(prevent_events !== true && modified){
                this.notify_update(olds);
            }
        },
        /**
         * 通知关联的store值有更新
         * @private
         */
        notify_update : function(olds){

        },
        /*
         * 把好照片数据转化为动感影集的photoList数据
         * */
        get_data: function() {
            //return JSON.stringify(this.data);
            var file_list = [],
                data = this.data;
            $.each(this.get_file_list(), function(i, item) {
                file_list.push(item.get_record());
            });
            data.file_list = file_list;
            return data;
        },
        get_old_group_list: function() {
            var group_list = [];
            var group = {},
                count = 0,
                file_list = this.get_file_list(),
                list = [1, 2, 3];

            for(var i=0; i<file_list.length; i++) {
                if(count > 2) {
                    break;
                }
                if(!group.index) {
                    group.index = list[count];
                    group.file_list = [];
                }
                group.file_list.push(file_list[i]);

                if(group.file_list.length === group.index) {
                    group_list.push(group);
                    group = {};
                    count++;
                }
            }
            if(group.index) {
                group_list.push(group);
            }
            return group_list;
        },
        get_group_list: function() {
            var group_list = [];
            var group = {},
                file_list = this.get_file_list();

            if(!file_list[0].page_num) {
                return this.get_old_group_list();
            }

            for(var i=0; i<file_list.length; i++) {
                if(!group.index) {
                    group.index = file_list[i].page_num;
                    group.file_list = [];
                }
                if(group.index !== file_list[i].page_num) {
                    group_list.push(group);
                    group = {};

                    group.index = file_list[i].page_num;
                    group.file_list = [];
                }

                group.file_list.push(file_list[i]);
            }
            if(group.index) {
                group_list.push(group);
            }
            return group_list;
        },
        get_photo_list: function() {

        },
        get_innervation_id: function() {
            return this.data.innervation_id;
        },
        get_innervation_title: function() {
            return this.data.innervation_title;
        },
        get_innervation_desc: function() {
            return this.data.innervation_desc;
        },
        get_dir: function() {
            return this.data.dir;
        },
        get_like_list: function() {
            return this.data.like_user_list || [];
        },
        get_owner: function() {
            return this.data.owner;
        },
        get_create_time: function() {
            return this.data.create_time;
        },
        get_modify_time: function() {
            return this.data.modify_time;
        },
        get_file_list: function() {
            return this.data.file_list;
        },
        get_innervation_template: function() {
            return this.data.innervation_template;
        },
        get_file_item: function(index) {
            return index < this.data.file_list.length? this.data.file_list[index] : {};
        },
        get_file_item_by_id: function(id) {
            var file;
            $.each(this.data.file_list, function(index, item) {
                file = item.get_file_item();
                if(file.get_id() === id) {
                    return item;
                }
            });
            return '';
        },
        set_innervation_title: function(innervation_title) {
            this.data.innervation_title = innervation_title;
        },
        set_innervation_desc: function(innervation_desc) {
            this.data.innervation_desc = innervation_desc;
        },
        set_innervation_template: function(template) {
            this.get_innervation_template().template_id     = template.template_id;
            this.get_innervation_template().music_id        = template.music_id;
            this.get_innervation_template().lrc_id          = template.lrc_id;
            this.get_innervation_template().climax_start    = template.climax_start;
            this.get_innervation_template().climax_endure   = template.climax_endure;
            this.get_innervation_template().ring            = template.ring;
        },
        set_file_text: function(file_id, text) {
            var file_item = this.get_file_item_by_id(file_id);
            if(file_item) {
                file_item.set_file_text(text);
            }
        },
        set_modify_time: function() {
            this.data.modify_time = +new Date();
        }
    }

    return InnerVation;
});
/*
 好照片动感影集，后台传递的innerVation对象
 * @author xixinhuang
 * @date 2016/09/01
 * */
define.pack("./file.Record",["$","lib","./file.FileNode"],function(require, exports, modules) {
    var $ = require('$');
    var lib = require('lib');
    var FileNode = require('./file.FileNode');

    /*
     * 对fileItem对象进行扩展，加上file_text图片评论数据
     * */
    var Record = function(data) {
        $.extend(FileNode, this);
        this.file_item = data.file_item;
        this.page_num = data.page_num;
        this.page_info = data.page_info;
        this.file_text = data.file_text || '';
        this.preface = data.preface || '';
        this.default_pic_url = data.default_pic_url || '';
    };

    Record.prototype = {
        get_record: function() {
            return {
                file_item: {
                    file_id: this.file_item.file_id,
                    pdir_key: this.file_item.pdir_key
                },
                page_num: this.page_num || 0,
                page_info: this.page_info || '',
                file_text: this.get_file_text(),
                preface: this.get_preface(),
                default_pic_url: this.default_pic_url || ''
            }
        },
        get_file_item: function() {
            return this.file_item;
        },
        get_file_text: function() {
            return this.file_text;
        },
        //多个描述字段合并时，需要拆分，这里返回object 或 string
        get_format_file_text: function() {
            var file_text = this.get_file_text();
            var REGEXP_MULTI_FILE_TEXT = /{['"](desc_\d.*?)+['"]}/i;
            if(REGEXP_MULTI_FILE_TEXT.test(file_text)) {
                file_text = JSON.parse(file_text);
            }
            return file_text;
        },
        get_default_pic_url: function() {
            return this.default_pic_url;
        },
        get_preface: function() {
            return this.preface;
        },
        get_page_info: function() {
            return this.page_info;
        },
        get_sub_template: function() {
            var page_info = this.get_page_info();
            var arr = page_info.split('_');
            var sub_template = arr[0] || '';
            return sub_template;
        },
        set_default_pic_url: function(default_pic_url) {
            this.default_pic_url = default_pic_url;
        },
        set_file_text: function(file_text) {
            this.file_text = file_text;
        }
    }

    return Record;
});/**
 * image lazy loader
 * @author xixinhuang
 * @date 2016-12-14
 */
define.pack("./image_lazy_loader",["$","lib","common","./user_log","./app_cfg","./store"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets'),
        image_loader = lib.get('./image_loader'),
        logger = common.get('./util.logger'),
        rAF = common.get('./polyfill.rAF'),

        user_log = require('./user_log'),
        app_cfg = require('./app_cfg'),
        store = require('./store'),
        undefined;

    var img_size;
    //auto_show需要根据图片尺寸来自适应
    var auto_show = true;
    var minHeight = 0;

    var screen_h = window.screen.height;
    var win_h = $(window).height();
    var win_w = $(window).width();


    var lazy_loader = new Module('lazy_loader', {

        init: function(img_container) {
            this.$ct = $(img_container);
            img_size = 64;
            this.load_image();
        },

        load_image: function() {
            var me = this;
            window.requestAnimationFrame(function() {
                me._load_image();
            });
        },

        _load_image: function() {
            var divs = this.$ct.find('[data-src]'),
                win_scrolltop = window.pageYOffset,
                me = this;

            divs.each(function(i, dom) {
                var $dom = $(dom);
                if(!$dom.attr('data-loaded')) {
                    var thumb_url = $dom.attr('data-src');

                    image_loader.load(thumb_url).done(function(img) {
                        var dom_width = $dom.width(),
                            dom_height = $dom.height(),
                            img_width = img.width,
                            img_height = img.height;
                        if(img_width*dom_height/(img_height*dom_width)>1) {
                            $(img).css({width: 'auto', height: '100%', 'transform': 'translateX(-50%)',  '-webkit-transform': 'translateX(-50%)', 'left': '50%'});
                        } else if(img_width*dom_height/(img_height*dom_width)<1){
                            $(img).css({height: 'auto', width: '100%', 'transform': 'translateY(-50%)',  '-webkit-transform': 'translateY(-50%)', 'top': '50%'});
                        } else {
                            $(img).css({width: '100%', height: 'auto'});
                        }

                        $(img).attr('data-loaded', 'true');
                        $(img).appendTo($dom.empty());
                        $('#loading').hide();

                        user_log.write_log('_load_image', thumb_url + ' dom_width:' + dom_width + ' dom_height: ' + dom_height + ' img_width:' + img_width + ' img_height' + img_height);
                    }).fail(function(img) {
                        $('#loading').hide();
                        widgets.reminder.ok('加载失败');

                        if(store.is_preview() && app_cfg.is_hzp_app() && thumb_url.indexOf('haozp') > -1) {
                            user_log.write_log('_imagePicker_URL_validate', thumb_url);
                            user_log.report('hzp_show_image_error', 1000301);
                        } else if(store.is_preview() && app_cfg.is_hzp_app()) {
                            user_log.write_log('_edit_load_image_failed', thumb_url);
                            user_log.report('hzp_show_image_error', 1000302);
                        } else if(!store.is_preview() && app_cfg.is_hzp_app()) {
                            user_log.write_log('_preview_load_image_failed', thumb_url);
                            user_log.report('hzp_show_image_error', 1000303);
                        } else {
                            user_log.write_log('_preview_load_image_failed', thumb_url);
                            user_log.report('hzp_show_image_error', 1000304);
                        }
                    });
                }
            });
        }
    });

    return lazy_loader;
});/**
 * 输入框操作
 * @author xixinhuang
 * @date 2016-12-23
 */
define.pack("./input_box",["$","lib","common","./user_log"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        user_log = require('./user_log'),
        undefined;

    var MAX_LEN = 200;

    var input_box = new Module('input_box', {

        init: function() {
            var me = this;

            if(me.is_app_edit()) {
                me._bind_input_event();
            } else {
                me.get_$list().find('p.description').attr('contenteditable', 'true');
            }
        },

        _bind_input_event: function() {
            var me  = this;
            this.get_$list().off('click').on('click', 'p.description', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var $target = $(this),
                    text = $target.text(),
                    index = $(e.target).closest('[data-index]').attr('data-index'),
                    desc_index = $target.attr('data-id') || '1',
                    is_empty = true;
                me.show_inputbox(text, index + '_' + desc_index, is_empty);
            });

            qpreview.on('getInputValue', function(json) {
                var value = decodeURIComponent(json.text);
                var indexs = json.index.split('_');
                var $item = me.get_$list().find('[data-index="' + indexs[0] + '"]');
                var $desc = $item && $item.find('[data-id="' + indexs[1] + '"]');
                var max_len = $desc.attr('max_len') && parseInt($desc.attr('max_len'));
                var default_text = $desc.attr('data-content') || '';
                if(max_len && value.length > max_len) {
                    value = value.substr(0, 12) + '...';
                }

                user_log.write_log('getInputValue', json);

                if($desc && $desc.length>0 && value) {
                    $desc.text(value);
                } else if($desc && $desc.length>0){
                    $desc.text('');
                    user_log.report('hzp_error', 0);
                    //$desc.text(default_text);
                } else {
                    widgets.reminder.error('输入有误，请重新输入');
                    user_log.report('hzp_error', 0);
                }
            });
        },

        //是否由客户端来编辑，这里用版本号来区分
        is_app_edit: function() {
            var result = false,
                version_arr = [0, 1, 5, 2],    //IOS1.5.3以上才能支持输入框
                REGEXP_IOS_VERSION = /(iPad|iPhone|iPod).*? haozp\/(\d+).(\d+).(\d+)/ig,
                user_agent = navigator.userAgent,
                match_arr = REGEXP_IOS_VERSION.exec(user_agent);

            if(match_arr && match_arr.length>1) {
                for(var i=1; i<match_arr.length; i++) {
                    if(match_arr[i] > version_arr[i-1]) {
                        result = true;
                        break;
                    } else if(match_arr[i] < version_arr[i-1]) {
                        result = false;
                        break;
                    }
                }
            }

            return result;
        },

        show_inputbox: function(text, index, is_empty) {
            var scheme_url = 'weiyunphototool://activity/inputbox?' + 'max_len=' + MAX_LEN +
                '&text=' + encodeURIComponent(text) + '&index=' + index + '&is_empty=' + is_empty + '&callback=getInputValue';

            user_log.write_log('show_inputbox', scheme_url);
            location.href = scheme_url;
        },

        get_$list: function() {
            return this.$list = this.$list || (this.$list = $('.j-list'));
        }
    });

    return input_box;
});/**
 * 点赞操作
 * @author xixinhuang
 * @date 2016-12-30
 */
define.pack("./like",["$","lib","common","./user_info","./user_log","./app_cfg","./store","./tmpl"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        https_tool = common.get('./util.https_tool'),
        browser = common.get('./util.browser'),
        logger = common.get('./util.logger'),
        ret_msgs = common.get('./ret_msgs'),
        user_info = require('./user_info'),
        user_log = require('./user_log'),
        app_cfg = require('./app_cfg'),
        store = require('./store'),
        tmpl = require('./tmpl'),

        undefined;

    var DATE_FORMAT_LIST = [60, 60 * 60, 60 * 60 * 24, 60 * 60 * 24 * 30, 60 * 60 * 24 * 30 * 12, Number.MAX_VALUE];
    var TEXT_MAP = ['刚刚', 'X分钟前', 'X小时前', 'X天前', 'X个月前', '更早'];

    var like = new Module('like', {
        //展示点赞列表，去掉重复操作
        init: function() {
            var is_like = store.is_like(),
                user_id = store.get_user_id(),
                like_list = store.get_like_list();

            if(!app_cfg.is_hzp_app() && is_like) {
                this.insert_$tips();
            } else {
                this.$like_info = $(tmpl.like_list({
                    is_like: is_like,
                    user_id: user_id,
                    list: like_list
                })).appendTo(this.get_$ct());
            }

            this._like_len = like_list.length;
            this._is_like = is_like;
        },

        is_limit: function() {
            return !!(this._like_len && this._like_len > 2);
        },

        is_like: function() {
            return !!this._is_like;
        },

        show_detail: function(like_list) {
            if(!like_list || !like_list.length) {
                return;
            }
            like_list = like_list.sort(function(a, b) {
                var aa, bb;
                if (typeof a === "object" && typeof b === "object" && a && b) {
                    aa = a['like_time'];
                    bb = b['like_time'];
                    if (aa === bb) {
                        return 0;
                    }
                    if (typeof aa === typeof bb) {
                        return aa > bb ? -1 : 1;
                    }
                    return typeof aa > typeof bb ? -1 : 1;
                }
                return 0;
            });
            $(tmpl.like_detail({
                list: like_list
            })).appendTo(this.get_$detail().find('ul').empty());

            this.get_$detail().find('.title h1').text('赞（' + (like_list.length) + '人）');
            this.get_$detail().show();
        },

        hide_detail: function() {
            this.get_$detail().hide();
        },

        insert_$tips: function() {
            var is_join = false;
            $(tmpl.like_tips({
                is_join: is_join
            })).appendTo(this.get_$ct());
        },

        insert_$like: function(like_user) {
            var me = this;

            me.$self_like = $(tmpl.add_like({
                avatar: like_user
            }));
            if(me.is_limit()) {
                $.each(me.get_$ct().find('.like-list'), function(i, item){
                    var avatar_list = $(item).find('.item-avatar');
                    if(avatar_list && avatar_list.length > 2) {
                        avatar_list.eq(0).remove();
                    }
                });
            }

            var like_len = me.is_like()? me._like_len : me._like_len + 1;
            me.$self_like.appendTo(me.get_$ct().find('.like-list'));
            me.get_$ct().find('.icon').removeClass('icon-dislike').addClass('icon-like');
            me.get_$ct().find('.like-text').text('等'+ like_len + '人点赞');
            me.get_$ct().find('.btn-like span').text('已点赞');

            user_log.write_log('add_like', like_user);
        },

        remove_$like: function() {
            var me = this;
            var user_id = store.get_user_id();
            var like_len = me.is_like()? me._like_len-1 : me._like_len;
            var like_text = like_len === 0? '' : '等'+ like_len + '人点赞';
            var $self_like =  me.get_$ct().find('[data-like-id="' + user_id + '"]');
            if($self_like && $self_like.length) {
                $self_like.remove();
            }

            me.get_$ct().find('.icon').removeClass('icon-like').addClass('icon-dislike');
            me.get_$ct().find('.like-text').text(like_text);
            me.get_$ct().find('.btn-like span').text('点赞');
        },

        add_like: function() {
            if(this.requesting) {
                return ;
            }
            var me = this;

            if(app_cfg.is_hzp_app() && user_info.is_login()) {
                me.insert_$like(user_info.get_user_info());
            }

            window.pvClickSend && window.pvClickSend('hzp.mv.addlike');

            this.send_request(true).done(function(body) {
                if(app_cfg.is_hzp_app() && !user_info.is_login()) {
                    me.insert_$like(body['like_user']);
                } else if(!app_cfg.is_hzp_app()) {
                    //纯H5场景下，鼓励用户加入相册
                    me.get_$like_info().hide();
                    me.insert_$tips();
                }
                me.requesting = false;
            }).fail(function(msg, ret) {
                if (ret_msgs.is_sess_timeout(ret) && app_cfg.is_hzp_app()) {
                    // todo 客户端内不允许登录态过期，后续优化，主动从客户端获取登录态并更新cookie
                    widgets.reminder.error(msg || '登录态失效，请重新登录');
                } else {
                    widgets.reminder.error(msg || '点赞失败，请稍后重试');
                }

                user_log.write_log('add_like_error', msg + ':' + ret);
                user_log.report('hzp_like_error', ret);
                me.requesting = false;
            });
        },

        cancel_like: function() {
            if(this.requesting) {
                return ;
            }
            var me = this;

            me.remove_$like();
            window.pvClickSend && window.pvClickSend('hzp.mv.dislike');

            this.send_request(false).done(function(body) {
                user_log.write_log('cancel_like', body['like_user'] || '');

                if(!store.is_preview() && !app_cfg.is_hzp_app() && !browser.QQ) {
                    user_log.report('hzp_error', 0);
                }

                me.requesting = false;
            }).fail(function(msg, ret) {
                if (ret_msgs.is_sess_timeout(ret) && app_cfg.is_hzp_app()) {
                    // todo 客户端内不允许登录态过期，后续优化，主动从客户端获取登录态并更新cookie
                    widgets.reminder.error(msg || '登录态失效，请重新登录');
                } else {
                    widgets.reminder.error(msg || '点赞失败，请稍后重试');
                }

                user_log.write_log('cancel_like_error', msg + ':' + ret);
                user_log.report('hzp_like_error', ret);
                me.requesting = false;
            });
        },

        send_request: function(like) {
            var defer = $.Deferred(),
                me = this;
            var req_data = {
                item_id: store.get_innervation_id(),
                dir_key: store.get_dir_key(),
                item_type: 1,   //对象类型，0：文件，1：mv,2:心情
                like: like
            };

            request.xhr_get({
                url: https_tool.translate_cgi('http://' + location.hostname + '/hzp_interface.fcg'),
                cmd: 'ShareAlbumLike',
                use_proxy: false,
                cavil: true,
                body: req_data
            }).ok(function(msg, body) {
                defer.resolve(body);
            }).fail(function(msg, ret) {
                defer.reject(msg, ret);
            });

            return defer;
        },

        get_date_text: function(time) {
            var result = !time? TEXT_MAP[TEXT_MAP.length - 1] : TEXT_MAP[0],
                interval = (+new Date() - time / 1000) / 1000;

            for(var i=0; i<DATE_FORMAT_LIST.length; i++) {
                if(interval < DATE_FORMAT_LIST[i]) {
                    result = TEXT_MAP[i];
                    if(i>0) {
                        var value = Math.floor(interval / (DATE_FORMAT_LIST[i-1]));
                        result = result.replace('X', value);
                    }
                    break;
                }
            }

            return result;
        },

        get_$like_info: function() {
            return this.$like_info = this.$like_info || (this.$like_info = $('.j-like-info'));
        },

        get_$detail: function() {
            return this.$detail = this.$detail || (this.$detail = $('.j-like-detail'));
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('.j-share-info'));
        }
    });

    return like;
});define.pack("./mgr",["lib","$","common","./user_info","./user_log","./app_cfg","./store","./like"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        cookie = lib.get('./cookie'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        session_event = common.get('./global.global_event').namespace('session_event'),
        ret_msgs = common.get('./ret_msgs'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        app_api = common.get('./app_api'),
        user = common.get('./user'),
        https_tool = common.get('./util.https_tool'),
        user_info = require('./user_info'),
        user_log = require('./user_log'),
        app_cfg = require('./app_cfg'),
        store = require('./store'),
        like = require('./like'),
        undefined;

    var default_app_cfg = {
        android: {
            published: true,
            packageName: 'com.tencent.weiyungallery',
            packageUrl: "weiyunphototool://share",
            scheme: "weiyunphototool",
            url: window.location.protocol + "//www.weiyun.com"	//这个是302到跳转页，不是直接到apk
        },
        ios: {
            published: true,
            packageName: "com.tencent.albumtool",
            packageUrl: "weiyunphototool://share",
            scheme: "weiyunphototool",
            url: window.location.protocol + "//www.weiyun.com"
        },
        appid: 'wxbed0eb0b57304fd0'
    };

    var mgr = new Mgr('mv.mgr', {

        init: function(cfg) {
            var me = this;
            session_event.on('session_timeout', function() {
                user_info.clear();
                me.clear_cookie();
                me.to_login();
            });

            $.extend(this, cfg);
            this.observe(this.store);
            this.observe(this.view);

        },

        on_save: function(data) {
            if(this._requesting) {
                return;
            }
            this._requesting = true;
            var me = this;

            request.xhr_get({
                url: https_tool.translate_cgi('http://' + location.hostname + '/hzp_interface.fcg'),
                cmd: 'ShareAlbumInnervationModify',
                use_proxy: false,
                body: {
                    innervation: data
                }
            }).ok(function(msg, body) {
                widgets.reminder.ok('保存成功');
                me.view.stop_music();
                //me.clear_cookie();

                user_log.write_log('save_mv_error', 'save successful!');
                user_log.report('hzp_mv_save_error', 0);

                me._requesting = false;
                //保存成功后去预览
                location.href = location.protocol + '//' + location.hostname + '/mv/tpl?key=' + body.innervation_id;

                //用schema来关闭H5页面
                //location.href = 'weiyunphototool://activity/finish';
            }).fail(function(msg, ret) {
                widgets.reminder.error(msg || '保存失败');
                me.view.stop_music();
                //me.clear_cookie();

                user_log.write_log('save_mv_error', msg + ':' + ret);
                user_log.report('hzp_mv_save_error', ret);

                me._requesting = false;
                //用schema来关闭H5页面
                location.href = 'weiyunphototool://activity/finish';
            });
        },

        //创建的时候删除mv,与remove的区别是最后调用的scheme不同。
        on_not_save: function() {
            if(this._requesting) {
                return;
            }
            this._requesting = true;

            this.view.hide_menu();
            var me = this;

            //新版不会带innervation_id，这里不需要删除
            if(!store.get_innervation_id() || store.get_dir_key()) {
                me.view.stop_music();
                //me.clear_cookie();

                user_log.write_log('not_save_mv', store.get_dir_key());
                me.view.back_to_select();
                return;

                //用schema来关闭H5页面
                //location.href = 'weiyunphototool://activity/cancel';
            }

            request.xhr_get({
                url: https_tool.translate_cgi('http://' + location.hostname + '/hzp_interface.fcg'),
                cmd: 'ShareAlbumInnervationDelete',
                use_proxy: false,
                body: {
                    innervation_id_list: [store.get_innervation_id()]
                }
            }).ok(function() {

                me.view.stop_music();
                //me.clear_cookie();

                me.view.back_to_select();

                user_log.write_log('not_save_mv', store.get_innervation_id());
                me._requesting = false;
                //用schema来关闭H5页面
                //location.href = 'weiyunphototool://activity/cancel';
            }).fail(function(msg, ret) {
                widgets.reminder.error(msg || '删除失败');
                me.view.stop_music();
                //me.clear_cookie();

                me.view.back_to_select();
                me._requesting = false;

                user_log.write_log('not_save_mv_error', msg + ':' + ret);
                user_log.report('hzp_mv_save_error', ret);
                //用schema来关闭H5页面
                //location.href = 'weiyunphototool://activity/cancel';
            });
        },

        //预览的时候删除mv，与not_save的区别是最后调用的scheme不同。这里需要刷新趣味集的feeds流
        on_remove: function() {
            var me = this;
            this.view.hide_menu();

            //样式不兼容，先隐藏widgets确认框
            widgets.confirm({
                tip: '确定要删除这个MV吗？',
                sub_tip: '',
                ok_fn: null,
                cancel_fn: function() {
                    me.do_remove_mv();
                },
                btns_text: ['取消', '确认']
            });
        },

        do_remove_mv: function() {
            if(this._requesting) {
                return;
            }
            this._requesting = true;

            var me = this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://' + location.hostname + '/hzp_interface.fcg'),
                cmd: 'ShareAlbumInnervationDelete',
                use_proxy: false,
                body: {
                    innervation_id_list: [store.get_innervation_id()]
                }
            }).ok(function() {

                me.view.stop_music();
                //me.clear_cookie();

                user_log.write_log('remove_mv', store.get_innervation_id());

                me._requesting = false;
                //用schema来关闭H5页面
                location.href = 'weiyunphototool://activity/delete';
            }).fail(function(msg, ret) {
                widgets.reminder.error(msg || '删除失败');
                me.view.stop_music();
                //me.clear_cookie();

                user_log.write_log('remove_mv_error', msg + ':' + ret);
                user_log.report('hzp_mv_save_error', ret);

                me._requesting = false;
                //用schema来关闭H5页面
                location.href = 'weiyunphototool://activity/delete';
            });
        },

        on_share: function() {
            var title = store.get_share_title() || store.get_nickname() + '的动感MV',
                text = store.get_photos().length + '个精彩瞬间',
                share_pic = store.get_cover_url() || 'http://qzonestyle.gtimg.cn/qz-proj/wy-photo/img/logo-200.jpg';

            this.view.hide_menu();
            var scheme_url = 'weiyunphototool://action/share/?title=' + encodeURIComponent(title)
                + '&text=' + encodeURIComponent(text) + '&share_url='
                + encodeURIComponent(location.href) + '&share_pic=' + share_pic;

            user_log.write_log('share_mv', 'scheme_url');

            location.href = scheme_url;
        },

        on_select_template: function() {
            if(!store.get_dir_key() && !store.get_innervation_id()) {
                location.href = 'weiyunphototool://activity/getdirkey';
                widgets.reminder.error('参数错误');

                user_log.write_log('select_template_error', 'it not exist dir_key');
                user_log.report('hzp_error', 0);
            } else {
                this.view.start_edit_mv();
            }
        },

        on_make_mv: function() {
            var redirect_url = app_cfg.is_hzp_app()? 'http://hzp.qq.com/mv/tpl?edit=1' : 'weiyunphototool://action/addmv';
            location.href = redirect_url;
            if(app_cfg.is_hzp_app()) {
                //todo 在手Q微信里需要跳去下载
                //todo 需要delete以前的旧样式
            }
        },

        on_like: function() {
            var me = this;
            if(app_cfg.is_hzp_app() && app_cfg.compare_hzp_version('1.5.3') == false) {
                widgets.confirm({
                    tip: '更新版本之后即可进行点赞',
                    sub_tip: '',
                    ok_fn: null,
                    cancel_fn: function() {
                        me.to_download_app();
                    },
                    btns_text: ['取消', '更新']
                });
                return;
            } else if(browser.WEIXIN && !cookie.get('user_id')) {
                this.to_login();
                return;
            }

            if(store.is_like()) {
                store.set_like(false);
                like.cancel_like();
            } else {
                store.set_like(true);
                like.add_like();
            }
        },

        on_view_like: function() {
            if(this._requesting) {
                return;
            }
            this._requesting = true;

            var me = this;
            me.view.get_$loading().show();

            request.xhr_get({
                url: https_tool.translate_cgi('http://' + location.hostname + '/hzp_interface.fcg'),
                cmd: 'ShareAlbumInnervationView',
                use_proxy: false,
                body: {
                    innervation_id: store.get_innervation_id()
                }
            }).ok(function(msg, body) {
                me._requesting = false;
                me.view.get_$loading().hide();
                like.show_detail(body.innervation.like_user_list);
            }).fail(function(msg, ret) {
                me.view.get_$loading().hide();
                widgets.reminder.error(msg || '保存失败');
                me._requesting = false;
            });
        },

        on_return: function() {
            this.view.hide_menu();

            this.close_webview();
        },

        //发起加入相册的命令
        on_enter_group: function() {
            var dir_key = store.get_dir_key(),
                nickname = store.get_nickname(),
                is_join = false;  //store.is_join_album();
            if(is_join) {
                this.do_enter_group();
                return;
            } if(this._requesting || !is_join) {
                return;
            }
            this._requesting = true;

            var me = this;

            request.xhr_get({
                url: https_tool.translate_cgi('http://hzp-test.qq.com/hzp_interface.fcg'),
                cmd: 'ShareAlbumDirJoin',
                use_proxy: false,
                body: {
                    pdir_key: dir_key,
                    invite_nickname: nickname,
                    only_query: false
                }
            }).ok(function(msg, body) {
                me._requesting = false;
                me.do_enter_group();
            }).fail(function(msg, ret) {
                widgets.reminder.error(msg || '保存失败');
                me._requesting = false;
            });
        },

        //进入相册，有安装则呼起，否则跳去下载
        do_enter_group: function() {
            var me = this,
                dir_key = app_cfg.hex2String(store.get_dir_key()),
                schema_url = browser.IOS? default_app_cfg['ios']['packageUrl'] + '/' + dir_key : default_app_cfg['android']['packageUrl'] + '/' + dir_key;

            if(app_cfg.is_hzp_app()) {
                location.href = schema_url;

                //移动端1.7版本后会自动退出相册，不需要再手动退出
                if(app_cfg.compare_hzp_version('1.7.0') == false) {
                    this.close_webview();
                }
            } else if(browser.android && (browser.WEIXIN || browser.QQ || browser.QZONE)) {
                app_api.isAppInstalled(default_app_cfg, function(result) {
                    if(result) {
                        window.location.href = schema_url;
                    } else {
                        me.to_download_app();
                    }
                });
                //} else if(browser.IOS && (browser.WEIXIN)) {
                //    //app_api.launchWyApp(default_app_cfg, function(result) {
                //    //    if(!result){
                //    //        me.view.show_tips();
                //    //    }
                //    //});
                //    window.location.href = schema_url;
                //    if(is_refresh){
                //        me.view.show_tips();
                //    } else {
                //        setTimeout(function() {
                //            me.to_download_app();
                //        },300);
                //    }
            } else if(browser.IOS && (browser.QQ || browser.QZONE)) {

                window.location.href = schema_url;
                setTimeout(function() {
                    var is_visibility = app_cfg.get_visibility();
                    is_visibility && me.to_download_app();
                }, 100);
            } else {
                window.location.href = schema_url;
                setTimeout(function() {
                    me.to_download_app();
                },300);
            }
        },

        //用schema来关闭H5页面
        close_webview: function() {
            user_log.report('hzp_error', 0);

            //创建MV后会去预览，此时需要调finish，客户端才会刷新动态；所以用referrer来区分
            var REG_REFER = /https?:\/\/hzp(-test)?\.qq\.com\/mv\/tpl\?.*edit=1/i;
            if(REG_REFER.test(document.referrer)) {
                location.href = 'weiyunphototool://activity/finish';
            } else {
                location.href = 'weiyunphototool://activity/cancel';
            }
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('skey');
            if(uin && skey || sid) {
                return true;
            }

            if(browser.WEIXIN || browser.QQ || browser.QZONE) {
                logger.report('weiyun_share_no_login', {
                    time: (new Date()).toString(),
                    url: location.href,
                    uin: uin || '',
                    skey: skey || '',
                    sid:  ''
                });
            }
            return false;
        },

        clear_cookie: function() {
            var cookie_key_list = ['wx_nickname', 'wx_headimgurl','wx_openid', 'wx_access_token', 'wy_appid', 'wy_uf', 'user_id', 'access_token', 'openid', 'uin', 'skey', 'p_uin', 'p_skey', 'hzp_owner'];
            var opition = {
                raw: true,
                domain: 'qq.com',
                path: '/'
            };
            for(var key in cookie_key_list) {
                cookie.unset(cookie_key_list[key], opition);
            }
        },

        to_download_app: function() {
            var download_url = app_cfg.is_IOS_app()? 'itms-apps://itunes.apple.com/cn/app/id1102283957' :
                browser.IOS? 'https://itunes.apple.com/cn/app/id1102283957' : 'http://183.56.150.169/imtt.dd.qq.com/16891/6984A105FCCA1814AFA092C6050926B7.apk?mkey=5874b7777b7d03ce&f=8e5d&c=0&fsname=com.tencent.weiyungallery_1.5.2_102.apk&csr=4d5s&p=.apk';
            location.href = download_url;
        },

        to_login: function() {
            if(browser.WEIXIN) {
                var max_time = new Date();
                //max_time.setMinutes(max_time.getMinutes() + 1);
                var r_url = location.href + '&max-age=' + max_time.getTime();
                var redirect_url = 'http://hzp.qq.com/weixin_oauth20.fcg?g_tk=5381&appid=wx847160118bbab80c&action=view_mv&r_url=' + encodeURIComponent(r_url) + '&use_r_url=1';
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847160118bbab80c&redirect_uri=' + encodeURIComponent(redirect_url) + '%26use_r_url%3D1&response_type=code&scope=snsapi_userinfo&state=view_mv#wechat_redirect';
            } else if(!app_cfg.is_hzp_app()){
                var go_url = window.location.href;
                window.location.href = "http://ui.ptlogin2.qq.com/cgi-bin/login?appid=527020901&daid=442&no_verifyimg=1&pt_wxtest=1&f_url=loginerroralert&hide_close_icon=1&s_url=" + encodeURIComponent(go_url) + "&style=9&hln_css=https%3A%2F%2Fqzonestyle.gtimg.cn%2Fqz-proj%2Fwy-photo%2Fimg%2Flogo-488x200.png";
            }
        }
    });

    return mgr;
});define.pack("./music",["$","lib","common","./user_log","./store","./ui","./mgr"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        browser = common.get('./util.browser'),
        widgets = common.get('./ui.widgets'),
        app_api = common.get('./app_api'),
        user_log = require('./user_log'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),

        undefined;

    var MUSIC_COOKIE_NAME = 'qzoneMusicData';

    var music_map = {
        'travel_1': {
            "songid":731026,
            "songmid":"002RgYe83wz9Eu",
            "songname":"Count On Me",
            "singerid":21414,
            "singername":"Bruno Mars",
            "type":3,
            "start":0,
            "end":196,
            "cover":"http://y.gtimg.cn/music/photo_new/T002R300x300M000001Imbfz08OscK.jpg?max_age=2592000",
            "tab":0,
            "ring":0
        },
        'travel_2': {
            "songid":1411663,
            "songmid":"003gONWU2AWLM6",
            "songname":"Marry You",
            "singerid":21414,
            "singername":"Bruno Mars",
            "type":3,
            "start":0,
            "end":230,
            "cover":"http://y.gtimg.cn/music/photo_new/T002R300x300M000004HvHHS2OZfen.jpg?max_age=2592000",
            "tab":0,
            "ring":0
        },
        //travel_3还未有音乐，先用2
        'travel_3': {
            "songid":108645662,
            "songmid":"003Xak8D0fq1oX",
            "songname":"悠长假期",
            "singerid":19010,
            "singername":"旅行团",
            "type":3,
            "start":0,
            "end":293,
            "cover":"http://y.gtimg.cn/music/photo_new/T002R300x300M000004GOKsr2Fuepg.jpg?max_age=2592000",
            "tab":0,
            "ring":0
        },
        'school_1': {
            "songid":101803842,
            "songmid":"0003LQew3TmUTA",
            "songname":"老男孩",
            "singerid":11761,
            "singername":"筷子兄弟",
            "type":3,
            "start":0,
            "end":288,
            "cover":"http://y.gtimg.cn/music/photo_new/T002R300x300M000002xOmp62kqSic.jpg?max_age=2592000",
            "tab":0,
            "ring":0
        },
        'school_2': {
            "songid": 102346647,
            "songmid": "004Ul8AH1z3Xpa",
            "songname": "同桌的你",
            "singerid": 212,
            "singername": "老狼",
            "type": 3,
            "start": 0,
            "end": 229,
            "cover": "http://y.gtimg.cn/music/photo_new/T002R300x300M000001VaXQX1Z1Imq.jpg?max_age=2592000",
            "tab": 0,
            "ring": 0
        },
        //school_2还未有音乐，先用2
        'school_3': {
            "songid": 102346647,
            "songmid": "004Ul8AH1z3Xpa",
            "songname": "同桌的你",
            "singerid": 212,
            "singername": "老狼",
            "type": 3,
            "start": 0,
            "end": 229,
            "cover": "http://y.gtimg.cn/music/photo_new/T002R300x300M000001VaXQX1Z1Imq.jpg?max_age=2592000",
            "tab": 0,
            "ring": 0
        },
        'family_1': {
            "songid": 4758500,
            "songmid": "002DrY494Aky9O",
            "songname": "宝贝",
            "singerid": 5558,
            "singername": "张悬",
            "type": 3,
            "start": 0,
            "end": 161,
            "cover": "http://y.gtimg.cn/music/photo_new/T002R300x300M000002GJDhP0ZluDv.jpg?max_age=2592000",
            "tab": 0,
            "ring": 0
        },
        //family_2还未有音乐，先用2
        'family_2': {
            "songid": 365552,
            "songmid": "003Oezp74E7nZq",
            "songname": "きっとまたいつか",
            "singerid": 10848,
            "singername": "Depapepe",
            "type": 3,
            "start": 0,
            "end": 249,
            "cover": "http://y.gtimg.cn/music/photo_new/T002R300x300M000002x92E32NWlX6.jpg?max_age=2592000",
            "tab": 0,
            "ring": 0
        },
        'family_3': {
            "songid": 365552,
            "songmid": "003Oezp74E7nZq",
            "songname": "きっとまたいつか",
            "singerid": 10848,
            "singername": "Depapepe",
            "type": 3,
            "start": 0,
            "end": 249,
            "cover": "http://y.gtimg.cn/music/photo_new/T002R300x300M000002x92E32NWlX6.jpg?max_age=2592000",
            "tab": 0,
            "ring": 0
        }
    };
    var default_music = music_map.school_1;

    var audio;
    var ringPreSrc = 'http://thirdparty.gtimg.com/L200';
    var preSrc = 'http://thirdparty.gtimg.com/C200';
    var music_data = {
        lastSong: false,	//上一次播放的音乐
        status: 0		// 0 -> 停止状态，1->播放状态，2->到封底了，还没播完继续播，之后播完转0停止
    };
    var guid = (function() {
        var curMs;
        var pgv_pvid = cookie.get('pgv_pvid');
        if (!!pgv_pvid && pgv_pvid.length > 0) {
            guid = pgv_pvid;
            return guid;
        }

        curMs = (new Date()).getUTCMilliseconds();
        guid = (Math.round(Math.random() * 2147483647) * curMs) % 10000000000;
        return guid;
    })();
    //音乐操作
    var operations = {
        convertMusicSrc: function(ring, songmid, vkey){
            var src = songmid + '.m4a?fromtag=38&vkey=' + vkey + '&guid=' + guid;
            var list = [];
            if(ring){
                list.push(ringPreSrc+src);
                list.push(preSrc+src);
            }else{
                list.push(preSrc+src);
                list.push(ringPreSrc+src);
            }
            return list;
        },
        //获取音乐数据
        getMusicSrc: function(song) {
            var songmid = song.songmid;
            var self = this;
            var deferred = $.Deferred();

            if(!self.vkey || true) {
                //获取vkey
                var vkeyUrl = 'http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=' + guid;
                $.ajax({
                    url: vkeyUrl,
                    type: 'get',
                    requestType: 'jsonp',
                    dataType: 'jsonp',
                    jsonpCallback: 'jsonCallback',
                    data: {},
                    success: function(vkeyData) {
                        if (!!vkeyData && vkeyData.code == 0 && vkeyData.key) {
                            /*
                             铃声m4a播放链接拼接规则：
                             注：这里只能mid（字符串id）拼接，所以接口协议中增加一个songmid参数
                             songUrl = 'http://thirdparty.gtimg.com/L200'+ songmid +'.m4a?fromtag=38&vkey=' + vkey +'&guid=' + guid;
                             */
                            self.vkey = vkeyData.key;
                            var src=[];

                            //后台不支持ring字段前，先用song.start做为判断标准顶着
                            if(/*typeof(song.ring)=='undefined' || song.ring || */song.start != 0){ //铃声版本
                                src = self.convertMusicSrc(true, songmid, self.vkey);
                            } else { //整曲版本
                                src = self.convertMusicSrc(false, songmid, self.vkey);
                            }

                            deferred.resolve(src);
                        } else {
                            deferred.reject({ msg: '歌曲数据获取失败, code: ' + vkeyData.code });
                        }
                    }
                });
            } else {
                var src = self.convertMusicSrc(true, songmid, self.vkey);
                deferred.resolve(src);
            }

            return deferred;
        },
        //获取歌词显示
        getMusicLrc: function(songid) {
            var deferred = $.Deferred();

            //获取歌词显示
            var lrcUrl = 'http://lyric.music.qq.com/fcgi-bin/fcg_query_lyric.fcg?nobase64=1&musicid=' + songid + '&pcachetime=' + (new Date().getTime());
            $.ajax({
                url: lrcUrl,
                type: 'get',
                requestType : 'jsonp',
                dataType : 'jsonp',
                jsonpCallback: 'MusicJsonCallback',
                data:{},
                success: function(lrcData) {
                    if (!!lrcData && lrcData.retcode == 0) {
                        deferred.resolve(lrcData);
                    } else {
                        deferred.reject({ msg: '歌词获取失败, code: ' + lrcData.retcode });
                    }
                }
            });

            return deferred;
        },
        unescapeHTML: function(text) {
            var div = document.createElement('div');
            div.innerHTML = text;
            return div.innerText || div.textNode || '';
        }
    };

    var music = new Module('music', {

        init: function() {
            var template_id = store.get_template_id();
            var music_data = decodeURIComponent(cookie.get(MUSIC_COOKIE_NAME));
            if(music_data) {
                cookie.set(MUSIC_COOKIE_NAME, '', {
                    domain: 'qq.com',
                    path: '/'
                });
                this.update_music(JSON.parse(music_data));
            } else {
                var music = music_map[template_id]? music_map[template_id] : default_music;
                this.update_music(music);
            }
            this.stop_music();
            this._bind_event();

            this.play_music();
            //operations.getMusicSrc(default_music);
        },

        _bind_event: function() {
            var me = this;
            this.get_$music().off('click').on('click', function(e) {
                e.preventDefault();
                var $item = $(e.target).closest('[data-id]');
                if($item.hasClass('music-off')) {
                    $item.removeClass('music-off').addClass('music');
                    me.start_music();
                } else {
                    $item.removeClass('music').addClass('music-off');
                    me.stop_music();
                }

                user_log.write_log('switch_music', $item.hasClass('music-off')? 'stop_music' : 'start_music');
            });
        },

        play_music: function() {
            var me = this;
            var srcRequest;
            var lrcRequest;
            var when;
            var template_id = store.get_template_id();
            var music = music_map[template_id]? music_map[template_id] : default_music;
            srcRequest = operations.getMusicSrc(music);

            when = srcRequest;
            when.done(function (musicSrc, lrcData) {
                //初始化音乐audio标签
                audio = document.createElement("audio");
                audio.loop = 'loop';
                audio.autoplay = '';
                //audio.preload = '';
                audio.src = musicSrc[0];
                $(document.body).append(audio);
                //这个load一定不能省，调用后才会刷新audio的src
                audio.load();
                //歌词处理
                //if (!!lrcData && lrcData.retcode == 0) {
                //    if (lrcData.type != 3) {
                //        me.lrcIndex = -1;
                //        //lrc.parseLyricData(operations.unescapeHTML(lrcData.lyric));
                //        //lrc.updateLrc('');
                //        //lrc.showLrc();
                //        ////重置禁音时的歌词时间偏移量，这个是在预览页结尾“重新播放”执行的时候用的，如果不重置，歌词不会重新开始
                //        //lrcTimerOffset = 0;
                //        //self.autoLrc();
                //    } else {
                //        // 没有歌词不弹提示
                //        //lib.msg.show('暂无歌词');
                //    }
                //}
                me.get_$music().removeClass('music-off').addClass('music');
                setTimeout(function() {
                    me.start_music(); //直接播放
                }, 500);
            }).fail(function(result) {
                me.hide_music_switch();

                user_log.write_log('load_music_error', result);
                user_log.report('hzp_error', 0);
            });
        },

        start_music: function() {
            if (audio) {
                var lrcTimerOffset = 0;

                if(music_data.status !== 1) {
                    audio.removeEventListener('timeupdate', false);
                    audio.addEventListener('timeupdate', function () {
                        lrcTimerOffset = 1;
                    });
                    audio.removeEventListener('ended', false);
                    audio.addEventListener('ended', function(){
                        music_data.status = 0;
                    });

                    //这里设置歌词同步时间要加个try catch，不然iphone4s里如果audio标签没play时设置currentTime，会抛“InvalidStateError: DOM Exception 11”这个error出来
                    try {
                        audio.currentTime = lrcTimerOffset;
                    } catch(e) {
                    }
                    audio.play();

                    music_data.status = 1;
                }
            }
        },

        stop_music: function() {
            if (audio) {
                if(music_data.status !== 0) {
                    audio.pause();
                    music_data.status = 0;
                    audio.removeEventListener('timeupdate', false);
                }
            }
        },

        /**
         * 获取每个模版下的默认音乐
         * @param template_id
         * @param sub_template
         */
        get_template_music: function() {
            var template_id = store.get_template_id();
            var music = music_map[template_id]? music_map[template_id] : default_music;
            var music_obj = {
                music_id: music.songid.toString(),
                ring: music.ring.toString(),
                climax_start: music.start.toString(),
                climax_endure: music.end.toString(),
                lrc_id: music.songmid.toString()
            }
            return music_obj;
        },

        //现在不能选音乐，只能用默认
        update_music: function(data) {

        },

        hide_music_switch: function() {
            this.get_$music().hide();
        },

        show_music_switch: function() {
            this.get_$music().show();
        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$music: function() {
            return this.$music = this.$music || (this.$music = this.get_$ct().find('[data-id=switch_music]'));
        }
    });

    return music;
});define.pack("./mv",["$","lib","common","./app_cfg","./store","./ui","./mgr","./music","./user_log","./user_info"],function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        browser = common.get('./util.browser'),
        constants = common.get('./constants'),
        app_api = common.get('./app_api'),

        app_cfg = require('./app_cfg'),
        store = require('./store'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        music = require('./music'),
        user_log = require('./user_log'),
        user_info = require('./user_info'),
        undefined;

    var mv = new Module('mv', {

        render: function(serv_rsp) {
            //有错误，则不继续初始化
            if(serv_rsp.ret) {
                return;
            }
            app_cfg.init();
            store.init(serv_rsp);
            if(!store.is_preview()) {
                music.init();
            }
            ui.render();
            mgr.init({
                store: store,
                view: ui
            });
            user_log.init();
            user_info.render();

            var share_data = {
                title: store.get_share_title() || store.get_nickname() + '的动感MV',
                desc: store.get_photos().length + '个精彩瞬间',
                image: store.get_cover_url() || 'http://qzonestyle.gtimg.cn/qz-proj/wy-photo/img/logo-200.jpg',
                url: location.href
            }
            this.set_share(share_data);
        },

        set_share: function(share_data) {
            var me = this,
                cfg = {
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'previewImage'
                ],
                hideMenuItems: []
            }
            if(browser.QQ || browser.QZONE) {
                app_api.init(function() {
                    app_api.setShare(share_data);
                    me.bind_pageVisibility_events();
                    mqq.ui.setOnCloseHandler(function() {
                        user_log.report('hzp_error', 0);
                        mqq.ui.closeWebViews();
                    });
                });
            } else if(browser.WEIXIN) {
                //require.async(constants.HTTP_PROTOCOL + '//res.wx.qq.com/open/js/jweixin-1.0.0.js', function (res) {
                //    wx = res;
                    app_api.init(cfg, function() {
                        app_api.setShare(share_data);
                        //微信里H5音乐必须在js sdk加载ready后再播放，否则是没有声音的
                        music.start_music();
                    });
                    user_log.report('hzp_error', 0);
                //});
            }
        },

        bind_pageVisibility_events: function() {
            document.addEventListener("qbrowserVisibilityChange", function(e){
                if(e.hidden){
                    app_cfg.set_visibility(e.hidden);
                }
                //widgets.reminder.ok(typeof e.hidden + ':' + e.hidden + ':' + app_cfg.get_visibility());
            });
        }
    });

    return mv;
});
define.pack("./store",["lib","common","$","./file.InnerVation","./app_cfg"],function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        InnerVation = require('./file.InnerVation'),
        browser = common.get('./util.browser'),
        app_cfg = require('./app_cfg'),

        undefined;

    var store = new Module('store', {
        init: function (data) {
            var me = this;
            me.set_preview(data);
            //me.data = data;

            if(!this.is_preview()) {
                this.InnerVation = new InnerVation(data.innervation);
                this.group_list = this.InnerVation.get_group_list();
                var template_id = this.InnerVation.get_innervation_template().template_id;
                this._main_template = template_id.replace(/_.+/,'');  //加replace是兼容旧版
                this._sub_template = this.group_list[0].file_list[0].get_sub_template() || template_id.replace(/^.+_/,''); //加replace是兼容旧版
                if(isNaN(this._sub_template)) {
                    //兼容旧数据
                    this._sub_template = '1';
                }

                var is_like = false,
                    like_list = this.get_like_list(),
                    user_id = this.get_user_id();
                for(var i=0; i<like_list.length; i++) {
                    if(user_id === like_list[i].user_id) {
                        is_like = true;
                        break;
                    }
                }
                this._is_like = is_like;
            }
        },

        set_preview: function(data) {
            this._preview = data && data.is_edit;
            this.innervation_id = data && data.innervation_id;
            //var arr = location.search.replace('?','').split('&');
            //for(var i=0; i<arr.length; i++) {
            //    var map = arr[i].split('=');
            //    if(map[0] && map[0] === 'preview' && map[1]) {
            //        this._preview = true;
            //    }
            //    if(map[0] && map[0] === 'key' && map[1]) {
            //        this.innervation_id = map[1];
            //    }
            //}
        },

        is_preview: function() {
            return !!this._preview;
        },

        is_old: function() {
            return !!this.InnerVation['innervation_title'];
        },

        is_like: function() {
            if(this.is_preview()) {
                return false;
            } else {
                return !!this._is_like;
            }
        },

        get_dir_key: function() {
            if(this.is_preview()) {
                return this.dir_key || '';
            } else {
                var dir = this.InnerVation.get_dir();
                return (dir.dir_item && dir.dir_item.dir_key) || '';
            }
        },

        set_dir_key: function(dir_key) {
            this.dir_key = dir_key;
        },

        get_dir_name: function() {
            if(this.is_preview()) {
                return this.dir_name || '';
            } else {
                var dir = this.InnerVation.get_dir();
                return (dir.dir_item && dir.dir_item.dir_name) || '';
            }
        },

        set_dir_name: function(dir_name) {
            this.dir_name = dir_name;
        },

        set_owner: function(owner) {
            var owner = {
                nickname: owner.nickname || '',
                logo: owner.logo || '//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/avatar-160.png',
                user_id: owner.user_id || ''
            }
            this._owner = owner;
        },

        set_title: function(title) {
             this.InnerVation['innervation_title'] = title;
        },

        set_desc: function(content) {
             this.InnerVation['innervation_desc'] = content;
        },

        set_file_item: function(index, file_id) {
            var photos = this.get_photos();
            var file_item = photos[index].get_file_item();

        },

        set_file_text: function(index, file_text) {
             this.InnerVation['file_list'][index].file_text = file_text;
        },

        set_like: function(like) {
            if(this.is_preview()) {
                return false;
            } else {
                return this._is_like = like;
            }
        },

        set_template_id: function(template_id) {
            this._main_template = template_id.replace(/_.+/,'');  //加replace是兼容旧版
            this._sub_template = template_id.replace(/^.+_/,''); //加replace是兼容旧版
        },

        get_innervation: function() {
            // this.InnerVation['modify_time'] = +new Date();

            var data =  this.InnerVation;
            return data;
        },

        get_innervation_id: function() {
            if(this.is_preview()) {
                return this.innervation_id;
            } else {
                return this.InnerVation.get_innervation_id();
            }
        },

        get_group_list: function() {
            return this.group_list;
        },

        get_title: function() {
            var title = this.InnerVation.get_innervation_title();
            return title.indexOf('title1')>-1? JSON.parse(title) : title;
        },

        get_desc: function() {
            var desc = this.InnerVation.get_innervation_desc();
            return desc.indexOf('desc1')>-1? JSON.parse(desc) : desc;
        },

        get_owner: function() {
            if(this.is_preview()) {
                return this._owner;
            } else {
                return this.InnerVation.get_owner();
            }
        },

        get_nickname: function() {
            if(this.is_preview()) {
                return this._owner && this._owner['nickname'];
            } else {
                var owner = this.get_owner();
                return owner && owner['nickname'];
            }
        },

        //取封面图，即第一页的第一张图片，分享用
        get_cover_url: function() {
            var groups = this.get_group_list();
            var file = groups[0].file_list[0];
            var cover_url = (file.file_item && file.file_item.ext_info && file.file_item.ext_info.thumb_url)? file.file_item.ext_info.thumb_url : file.default_pic_url;
            return cover_url;
        },

        get_like_list: function() {
            if(this.is_preview()) {
                return [];
            } else {
                return this.InnerVation.get_like_list();
            }
        },

        get_user_id: function() {
            if(!this.is_preview()) {
                if(app_cfg.is_hzp_app()) {
                    return cookie.get('user_id') || cookie.get('uin').replace(/^o0*/,'');
                } else if(browser.QQ) {
                    return cookie.get('uin').replace(/^o0*/,'');
                } else if(browser.WEIXIN) {
                    return cookie.get('user_id') || cookie.get('wx_openid') || cookie.get('uin').replace(/^o0*/,'');
                } else {
                    return cookie.get('uin').replace(/^o0*/,'');
                }
             }
            return ''
        },

        //取标题，即第一页的文案，没有则用默认，分享用
        get_share_title: function() {
            var groups = this.get_group_list();
            var file = groups[0].file_list[0];
            var title = file.get_format_file_text() || '';
            if(typeof title == 'object') {
                title = title['desc_0'];
            }
            return title;
        },

        /**
         * 返回模版对象，包括sub_template
         * @returns {object}
         */
        get_template: function() {
            return this.InnerVation.get_innervation_template();
        },

        /**
         * 返回模版id，是虚拟的，没有对应的字段。它包括main_template + '_' + sub_template
         * 意思是{旅游}的第{几}套模版
         * @returns {object}
         */
        get_template_id: function() {
            return this._main_template + '_' + this._sub_template;
        },

        /**
         * 返回主模版，意思是主题，如同学，亲子，旅游
         * @returns {string}
         */
        get_main_template: function() {
            return this._main_template || 'school';
        },

        /**
         * 返回子模版，意思是某个主题的第N套模版
         * @returns {string}
         */
        get_sub_template: function() {
            return this._sub_template || '1';
        },

        get_photos: function() {
            return this.InnerVation.get_file_list();
        },

        get_date_text: function() {
            var data_time = this.InnerVation.get_create_time();
            var date = new Date(data_time / 1000);
            return (date.getMonth()+1) + '月' + date.getDate() + '日';
        },

        get_record: function(file) {
            return {
                file_item: {
                    file_id: file.file_item.file_id
                },
                file_text: file.file_text
            }
        }
    });

    return store;
});/**
 * ui模块
 * @author hibincheng
 * @date 2014-12-23
 */
define.pack("./ui",["lib","$","common","./image_lazy_loader","./input_box","./store","./mgr","./like","./music","./tmpl","./address","./user_log","./app_cfg"],function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),
        widgets = common.get('./ui.widgets'),
        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        image_lazy_loader = require('./image_lazy_loader'),
        input_box = require('./input_box'),
        store = require('./store'),
        mgr = require('./mgr'),
        like = require('./like'),
        music = require('./music'),
        tmpl = require('./tmpl'),
        address = require('./address'),
        user_log = require('./user_log'),
        app_cfg = require('./app_cfg'),
        undefined;

    var win_height = $(window).height();
    var win_width = $(window).width();
    var template_width = 75;    //每个模版占用宽度%，在选模版页面滑动时候用到
    var last_slide_time = 0;
    var current_theme = 'school';   //default theme
    var index = 1;         //当前所在的页码
    var preview_index = 1; //预览用，控制动画
    var total_pages = 1;   //MV总页面，初始只有一页，没有封面封底的概念
    var edit_content;

    var ui = new Module('ui', {

        render: function() {
            if(store.is_preview()) {
                $('.section-00').show();

                //监听选模版页面滑动
                this.listen_template_slide();

                //绑定客户端的交互接口
                this._bind_app_events();

            } else {
                $('.section-00').hide();
                var owner = store.get_owner();
                var innervation_id = store.get_innervation_id();
                var group_list = store.get_group_list();
                var template_id = store.get_main_template();
                var sub_template = store.get_sub_template();
                var date = store.get_date_text();

                $(tmpl[template_id + '_list']({
                    top: -100,
                    owner: owner,
                    date: date,
                    template: template_id,
                    sub_template: sub_template,
                    innervation_id: innervation_id,
                    list: group_list
                })).appendTo(this.get_$list());
                $(tmpl[template_id + '_list']({
                    top: 100,
                    owner: owner,
                    date: date,
                    template: template_id,
                    sub_template: sub_template,
                    innervation_id: innervation_id,
                    list: group_list
                })).appendTo(this.get_$list());

                //覆盖标题
                var title = store.get_share_title() || store.get_nickname() + '的动感MV';
                $('.section-02').find('.title h1').text(title);

                //处理缩略图
                image_lazy_loader.init(this.get_$list());

                //显示点赞列表
                like.init();

                var total_length = group_list.length? group_list.length+1 : 1;
                var query = location.search,
                    s_time = (query.indexOf('max-age')>-1 && query.length>20)? query.slice(query.indexOf('max-age') + 8, query.indexOf('max-age') + 21) : 0;
                if((+new Date() - s_time) < 30 * 1000) {
                    //todo 判断时间间隔的逻辑后续去掉
                    index = total_length;
                    this.check(true, index);
                    this.restore(true, index);
                    var $now = this.get_$list().find('[data-id="2"]').eq(index-1);
                    $now.css('transform', 'translateY(0%)').addClass('animate').css('z-index', '100').attr('data-pos', 'center');
                    mgr.on_like();
                } else {
                    var $now = this.get_$list().find('[data-id="2"]').eq(0);
                    $now.css('transform', 'translateY(0%)').addClass('animate').css('z-index', '100').attr('data-pos', 'center');
                }

                var progress = Math.round(index*100/total_length);
                this.get_$progress().css('width', progress + '%');
                this.get_$ct().find('[data-id=title]').text(index + '/' + total_length);
                $('.section-02').show();

                //非主人和群主不能删除MV，通过客户端种入的owner或hzp_owner来区分
                if(cookie.get('hzp_owner') === '1' || cookie.get('owner') === '1') {
                    this.get_$ct().find('[data-action=remove]').show();
                }

                //好照片APP里需要前端种appid
                if(app_cfg.is_hzp_app()) {
                    var value = cookie.get('wy_uf') === '1'? 'wx847160118bbab80c' : '1105149996';
                    cookie.set('wy_appid', value, {
                        domain: 'qq.com',
                        path: '/'
                    });
                }

                //music.init();
                this.listen_preview_slide();
            }

            //for test
            //address.get_address();

            this._bind_events();
        },

        start_edit_mv: function() {
            var me = this;
            var template_id = $('#template_list').find('.islider-active [data-type=template]').attr('data-id');
            store.set_template_id(template_id);
            music.init();

            this.load_css_file(template_id, function() {
                $(tmpl[template_id + '_sel']()).appendTo($('.section-03').empty());
                $(tmpl[template_id + '_tmpl']()).appendTo(me.get_$list().empty());
                me.get_$ct().find('[data-id=title]').text('1/1');
                me.get_$toolbar().find('[data-id=delete]').hide();
                me.get_$toolbar().find('[data-id=add]').show();

                //文本输入框
                input_box.init();

                user_log.write_log('load_css_file', template_id);

                //处理缩略图
                image_lazy_loader.init(me.get_$list());
                $('.section-01').show();
                $('.section-00').hide();

                //监听编辑内页滑动
                me.listen_slide();
            });
        },

        load_css_file: function(css_path, callback) {
            //创建时带上时间戳，以避免缓存
            css_path = seajs.data.alias[css_path] + '?t=' + (new Date()).getTime();
            require.async(css_path, function(mod) {
                callback && callback();
            });
        },

        show_save_menu: function() {
            this.get_$ct().find('[data-id=save_bar]').show();
            this.get_$ct().find('[data-id=save_bar]').removeClass('hide').addClass('show');
        },

        show_edit_menu: function() {
            this.get_$ct().find('[data-id=edit_bar]').show();
            this.get_$ct().find('[data-id=edit_bar]').removeClass('hide').addClass('show');
        },

        //动画需要加hide和show
        hide_menu: function() {
            var me = this;
            me.get_$ct().find('[data-id=save_bar]').removeClass('show').addClass('hide');
            me.get_$ct().find('[data-id=edit_bar]').removeClass('show').addClass('hide');

            setTimeout(function() {
                me.get_$ct().find('[data-id=save_bar]').hide();
                me.get_$ct().find('[data-id=edit_bar]').hide();
            }, 500);
        },

        stop: function() {
            var $play_dom = this.get_$ct().find('.j-animate');
            $play_dom.removeClass('running').addClass('paused');
            $('.icon-paused').hide();
            $('.icon-play').show();
        },

        play: function() {
            var $play_dom = this.get_$ct().find('.j-animate');
            $play_dom.removeClass('paused').addClass('running');
            $('.icon-play').hide();
            $('.icon-paused').show();
        },

        //获取页面数据，然后trigger出save事件来保存
        save_data: function() {
            var main_template = store.get_main_template();
            var sub_template = store.get_sub_template();      //子模版不是一样的

            var photo_list = [];
            var list = this.get_$ct().find('.photo');
            var $li, file_item, preface, file_text, file_id, pic_url, page_num, page_info, description = '';
            for(var i=0; i<list.length; i++) {
                file_id = list.eq(i).attr('data-file-id') || '';
                pic_url = list.eq(i).find('.inner img').attr('src');
                $li = list.eq(i).closest('div.item');

                description = $li.find('.description');
                if(description.length>1) {
                    file_text = {};
                    $.each(description, function(i, desc) {
                        file_text['desc_' + i] = $(desc).text();
                    });
                    file_text = JSON.stringify(file_text);
                } else if(description.length>0) {
                    file_text = $li.find('.description').text() || '';
                }

                if($li.hasClass('j-preface')) {
                    var preface_title = $li.find('[data-preface-title]').text();
                    var preface_author = $li.find('[data-preface-author]').text();
                    var preface_time = $li.find('[data-preface-time]').text();
                    var preface_desc_list = [];
                    var preface_desc = $li.find('[data-preface-desc]');
                    $.each(preface_desc, function(i, desc) {
                        preface_desc_list.push($(desc).text());
                    });
                    preface = {
                        preface_title: preface_title,
                        preface_desc_list: preface_desc_list,
                        preface_author: preface_author,
                        preface_time: preface_time,
                        preface_info: ''
                    }
                }
                if($li.attr('data-sub-template') && $li.attr('data-sub-template') !== sub_template) {
                    sub_template = $li.attr('data-sub-template');
                }

                page_num = parseInt($li.closest('.wrap').attr('data-index')) + 1;
                page_info = $li.attr('data-page') || '1';
                file_item = {
                    file_text: file_text || '',
                    page_num: page_num,
                    page_info: sub_template + '_' + page_info
                };
                if(preface) {
                    file_item.preface = preface;
                    file_item.file_text = '';
                    preface = '';
                } else if(file_id) {
                    file_item.file_item = {
                        file_id: file_id
                    }
                } else if(pic_url){
                    file_item.default_pic_url = location.protocol + pic_url.replace(/^https?:/, '');
                }
                photo_list.push(file_item);

                //清空数据
                description = '';
                pic_url = '';
                file_text = '';
            }

            var template = {
                template_id: main_template
            };
            $.extend(template, music.get_template_music());

            var innervation = {
                innervation_template: template,
                owner: store.get_owner(),
                innervation_title: '',
                innervation_desc: '',
                file_list: photo_list
            };

            if(store.get_innervation_id()) {
                innervation.innervation_id = store.get_innervation_id();
            } else if(store.get_dir_key()) {
                innervation.dir = {
                    dir_item: {
                        dir_key: store.get_dir_key()
                    }
                }
            }
            return innervation;
        },

        validate: function(innervation) {
            if(typeof innervation != 'object'){
                return false;
            }
            if(!innervation.innervation_id) {
                return false;
            }
            //if(!innervation.innervation_title) {
            //    return false;
            //}
            //if(!innervation.innervation_desc) {
            //    return false;
            //}
            var file_list = innervation.file_list;
            if(!file_list.length) {
                return false;
            }
            for(var i=0; i<file_list.length; i++) {
                if(!file_list[i].page_num || !file_list[i].file_item.file_id) {
                    return false;
                }
            }
            return true;
        },

        update_toolbar: function(next_index) {
            var $next = this.get_$list().find('[data-item-index="' + next_index + '"]');
            var is_fixed = $next.attr('data-filter') === 'fixed';
            if(is_fixed || (next_index === 1)) {
                //首页不可删除，需要隐藏删除按钮
                this.get_$toolbar().find('[data-id=delete]').hide();
            } else {
                this.get_$toolbar().find('[data-id=delete]').show();
            }
        },

        _bind_events: function()  {
            var me = this;
            this.get_$ct().on('click', '[data-action]', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $item = $(e.target).closest('[data-action]');
                var action_name = $item.attr('data-action');

                switch (action_name) {
                    case 'back':
                        if($('.section-03').hasClass('hide')) {
                            me.show_save_menu();
                        } else {
                            $('.section-01').show();
                            $('.section-03').removeClass('show').addClass('hide');
                            $('.section-00').hide();
                        }
                        break;

                    case 'show_tag':
                        me.clear_sel_events();
                        $('<div class="tag" data-action="replace"><span>换图</span></div>').appendTo($item);
                        $item.removeClass('edit').addClass('edit-now');
                        break;

                    case 'replace':
                        var $photo = $(e.target).closest('.photo');
                        var file_index = $photo.attr('data-file-index');
                        location.href = 'weiyunphototool://activity/imagePicker?index=' + file_index;

                        user_log.write_log('imagePicker', 'weiyunphototool://activity/imagePicker?index=' + file_index);
                        break;

                    case 'cancel':
                        me.hide_menu();
                        break;

                    case 'switch_theme':
                        var type = $item.attr('data-id'),
                            template_map = {school: 0, family: 3, travel: 6},
                            template_index = parseInt(template_map[type]);
                        me.islider.slideTo(template_index);
                        break;

                    case 'select_page':
                        me.move_back();

                        var main_template = store.get_main_template();
                        var arr = $item.attr('data-id').split('_');
                        var sub_template = arr[0] || '1';
                        var page_type = arr[1] || '1';

                        var current_index = window.mySwipe.getPos();
                        var $last_page = me.get_$list().find('[data-index="' + current_index + '"]');
                        var file_index = me.get_$list().find('.photo').length + 1;
                        current_index++;
                        total_pages++;
                        var $new_page = $(tmpl[main_template + '_' + sub_template + '_tmpl_' + page_type]({
                            index: current_index + 1,
                            file_index: file_index
                        }));
                        $last_page.after($new_page);

                        //禁用动画

                        //处理缩略图
                        image_lazy_loader.init($new_page);
                        $('.section-03').removeClass('show').addClass('hide');

                        //兼容旧版,开启文本编辑
                        if(!input_box.is_app_edit()) {
                            me.get_$list().find('p.description').attr('contenteditable', 'true');
                        }

                        //me.get_$ct().find('[data-id=title]').text(index + '/' + total_pages);
                        //me.slide_left(false, index-1, false);
                        //监听编辑内页滑动
                        window.mySwipe.setup();

                        setTimeout(function() {
                            window.mySwipe.slide(current_index, 800);
                            //window.mySwipe.next();
                        }, 20);

                        user_log.write_log('select_page', main_template + '_' + sub_template + '_tmpl_' + page_type);
                        break;

                    case 'add':
                        $('.section-03').removeClass('hide').addClass('show');
                        break;

                    case 'delete':
                        var current_index = window.mySwipe.getPos();
                        var $item = me.get_$list().find('[data-index="' + current_index + '"]');
                        if($item) {
                            $item.remove();
                            me.move_forward();
                            total_pages--;
                            //me.update_toolbar(current_index+1);

                            window.mySwipe.setup();

                            setTimeout(function() {
                                //window.mySwipe.prev();
                                window.mySwipe.slide(current_index-1, 800);
                            }, 20);
                        }
                        user_log.write_log('delete_page', 'total_pages: ' + (total_pages+1) + ' index: ' + (current_index+1));
                        break;

                    case 'close_detail':
                        like.hide_detail();
                        break;

                    case 'replay':
                        me.slide_play(true, parseInt($item.closest('li.j-animate').attr('data-index')));
                        break;

                    case 'close':
                        $('.section-03').removeClass('show').addClass('hide');
                        break;

                    case 'edit':
                        me.hide_menu();
                        widgets.reminder.error('暂时不支持编辑');
                        break;

                    case 'more':
                        me.show_edit_menu();
                        break;

                    case 'pause':
                        me.stop();
                        break;

                    case 'play':
                        me.play();
                        break;

                    case 'save':
                        me.hide_menu();
                        var innervation = me.save_data();
                        me.trigger('action', 'save', innervation, e);
                        break;

                    default:
                        me.trigger('action', action_name, e);
                }
            }).on('animationend webkitAnimationEnd oAnimationEnd', '.photo', function(e) {
                if(store.is_preview()) {
                    var $item = $(e.target).closest('.photo');
                    $item.addClass('edit');
                }
            }).on('animationend webkitAnimationEnd oAnimationEnd', '.text', function(e) {
                if(store.is_preview()) {
                    var $item = $(e.target).closest('.text');
                    $item.find('.description').addClass('edit');
                }
            }).on('focus', '[contenteditable]', function(e) {
                var $item = $(this);
                $item.removeClass('edit').addClass('edit-now');
                edit_content = $item.text();
            }).on('blur', '[contenteditable]', function(e) {
                var $item = $(this);
                $item.removeClass('edit-now');
                if(edit_content != $item.text()) {
                    $item.trigger('change');
                }
            }).on('change', '[contenteditable]', function(e) {
                var $item = $(this);
                if(!$item.text()) {
                    widgets.reminder.error('请输入文字');
                    $item.text($item.attr('data-content')).removeClass('edit').addClass('edit-now');
                }
            });

            //点击空白处取消
            $(document).on('click', function(e) {
                e.preventDefault();
                var $target = $(e.target);
                if($target.closest("[data-action=replace]").length === 0) {
                    me.clear_sel_events();
                }

                var $edit_bar = me.get_$ct().find('[data-id=edit_bar]');
                if($edit_bar.length && $target.closest("[data-action]").length === 0) {
                    //$edit_bar.hide();
                    me.hide_menu();
                }
                var $save_bar = me.get_$ct().find('[data-id=save_bar]');
                if($save_bar.length && $target.closest("[data-action]").length === 0) {
                    //$save_bar.hide();
                    me.hide_menu();
                }
            });
        },

        _bind_app_events: function() {
            var me = this;
            qpreview.on('showImage', function(json) {
                me.get_$loading().show();

                user_log.write_log('showImage', json);

                var $item = me.get_$list().find('[data-file-index="' + json.index + '"]');
                $item.find('.inner').css('overflow', 'hidden').attr('data-src', json.thumb_url);
                image_lazy_loader.init($item);

                $item.attr('data-file-id', json.fileid);
                $item.find('.tag').remove();
                $item.removeClass('j-photo').removeClass('edit-now');

                //$item.closest('li.item');
            });

            qpreview.on('getDirKey', function(json) {
                user_log.write_log('getDirKey', json);

                cookie.set('uin', json.user_id, {
                    domain: 'qq.com',
                    path: '/'
                });
                store.set_owner(json);
                store.set_dir_key(json.dir_key);
            });

            location.href = 'weiyunphototool://activity/getdirkey';

            user_log.write_log('getdirkey', 'weiyunphototool://activity/getdirkey');
        },

        listen_slide: function() {
            var me =  this;
            window.mySwipe = Swipe(document.getElementById('slider'), {
                callback: function(index, elem) {
                    if(!store.is_preview()) {
                        return;
                    }

                    var $container = me.get_$list(),
                        $items = $container.find('.j-animate');
                    $items.find('.photo').removeClass('edit');
                    $items.find('.description').removeClass('edit');
                    $(elem).find('.photo').addClass('edit');
                    $(elem).find('.description').addClass('edit');
                    me.update_toolbar(index + 1);

                    me.clear_sel_events();
                    me.get_$ct().find('[data-id=title]').text((index+1) + '/' + total_pages);
                }
            });
        },

        listen_preview_slide: function() {
            var x,
                y,
                xx,
                yy,
                slideX,
                slideY,
                slideLeft,
                slideTop,
                me = this;
            var moving = false;

            this.get_$ct().on('touchstart', '.j-animate', function(e) {
                if($(e.target).closest('[data-action]').length !== 0 || moving) {
                    return;
                }
                moving = true;
                x = e.targetTouches[0].screenX;
                y = e.targetTouches[0].screenY;
                slideX = true;
                slideY = true;
            });
            this.get_$ct().on('touchmove', '.j-animate', function(e) {
                e.preventDefault();

                if(!moving) {
                    return;
                }

                //记录上次操作时间以防止滑动速度过快
                //if(last_slide_time && (+new Date() - last_slide_time < 800)) {
                //    return;
                //}

                last_slide_time = +new Date();
                moving = false;
                xx = e.targetTouches[0].screenX;
                yy = e.targetTouches[0].screenY;

                var $item = $(e.target).closest('[data-type]');
                var index = parseInt($item.attr('data-index'));
                var type = $item.attr('data-type');

                if(slideX && Math.abs(xx-x)-Math.abs(yy-y)>0) { //左右滑动
                    slideY = false;
                    slideLeft = (xx - x)>0;
                } else if(slideY && Math.abs(xx-x)-Math.abs(yy-y)<0){  //上下滑动
                    slideX = false ;
                    slideTop = (y - yy)>0;

                    if(type === 'play') {
                        //新版左右滑动预览
                        me.slide_play(slideTop, index);
                    }
                }
            });
        },

        listen_template_slide: function() {
            var tempSlider = document.getElementById('template_list');
            var $theme_items = $(".theme-list");
            var data =[
                {content: '<div class="template-wrap"><div class="template" data-id="school_1" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-classmate-1.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="school_2" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-classmate-2.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="school_3" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-classmate-3.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="family_1" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-family-1.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="family_2" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-family-2.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="family_3" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-family-3.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="travel_1" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-travel-1.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="travel_2" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-travel-2.jpg);"></div></div>'},
                {content: '<div class="template-wrap"><div class="template" data-id="travel_3" data-type="template" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/select/select-travel-3.jpg);"></div></div>'}
            ];

            this.islider = new iSlider(tempSlider,data,{
                isLooping: 1,
                isOverspread: 1,
                animateTime: 800,
                animateType: 'depth',
                onSlideChange: function(index, dom) {
                    //当场景发生改变时触发
                    //更换下面主题
                    var theme = $(dom).find('.template').attr('data-id') || '';
                    theme = theme.replace(/_.+/, '');
                    if(theme !== current_theme) {
                        current_theme = theme;
                        $theme_items.find('.act').removeClass('act');
                        $theme_items.find('[data-id="' + current_theme + '"]').addClass('act');
                    }
                },
                onSlideChanged: function(index, dom) {
                    //当场景改变完成(动画完成)时触发 or 执行loadData时触发
                }
            });
        },

        /**
         * 创建MV时，新增或删除，需要更改index
         */
        move_back: function() {
            var me = this,
                current_index = window.mySwipe.getPos(),
                data_index,
                $item;
            for(var i=total_pages; i>current_index+1; i--) {
                $item = me.get_$list().find('[data-item-index="' + i + '"]');
                data_index = parseInt($item.attr('data-item-index'));
                $item.attr('data-item-index', data_index+1);
            }
        },

        /**
         * 创建MV时，新增或删除，需要更改index
         */
        move_forward: function() {
            var me = this,
                current_index = window.mySwipe.getPos(),
                data_index,
                $item;
            for(var i=current_index+2; i<=total_pages; i++) {
                $item = me.get_$list().find('[data-item-index="' + i + '"]');
                data_index = parseInt($item.attr('data-item-index'));
                $item.attr('data-item-index', data_index-1);
            }
        },

        slide_first_page: function() {
            var $item = this.get_$list().find('[data-index="1"]');
            var $next = this.get_$list().find('[data-index="2"]');
            this.get_$toolbar().find('[data-id=delete]').hide();
            $item.show();
            $next.hide();
            index = 1;
            this.get_$ct().find('[data-id=title]').text(1 + '/' + total_pages);
        },

        //创建的时候可以左右滑动
        slide_left: function(slideLeft, current, isRefresh) {
            if(!store.is_preview()) {
                return;
            }

            //滑动到其他页面去掉选图tag
            this.clear_sel_events();

            var $container = this.get_$list(),
                $items = $container.find('.j-animate');
            var total_length = $items.length;

            //禁用循环
            if((slideLeft && current===1) || (!slideLeft && current===total_length)) {
                return;
            }

            var next_index = slideLeft? current-1 : current+1;
            var $now = $container.find('[data-index="' + current + '"]');
            var $next = $container.find('[data-index="' + next_index + '"]');

            //右滑动
            if(!slideLeft && $next.length){
                $now.css('left', '-100%');
                $now.find('.photo').removeClass('edit');
                $now.find('.description').removeClass('edit');
                $next.css('left', '0%');

                if($next.hasClass('j-not-animate')) {
                    //没有图片动画的页面需要新加edit，如序言
                    $next.find('.photo').addClass('edit');
                    $next.find('.description').addClass('edit');
                }

            //左滑动
            } else if(slideLeft && $next.length) {
                $now.css('left', '100%');
                $now.find('.photo').removeClass('edit');
                $now.find('.description').removeClass('edit');
                $next.css('left', '0%');

                if($next.hasClass('j-not-animate')) {
                    //没有图片动画的页面需要新加edit，如序言
                    $next.find('.photo').addClass('edit');
                    $next.find('.description').addClass('edit');
                }
            }

            this.update_toolbar(next_index);
            if(isRefresh) {
                index = next_index;
                this.get_$ct().find('[data-id=title]').text(index + '/' + total_pages);
            }
        },

        //新版左右滑动预览
        slide_play: function(slideTop, index) {
            if(store.is_preview()) {
                return;
            }
            var me = this,
                $container = this.get_$list(),
                $items = $container.find('.j-animate');
            var total_length = $items.length / 2;


            if(me.last_slide_time && (me.last_slide_time && +new Date() - me.last_slide_time)<600) {
                return;
            }
            //禁用循环
            //if((slideLeft && index===0) || (!slideLeft && index===length-1)) {
            //    return;
            //}

            if(total_length === 1) {
                return;
            }

            var next_index = this.get_next_index(slideTop, index);

            //预览滑动动画之前，需要进行左右两边的兑换
            this.check(slideTop, next_index);
            this.restore(slideTop, next_index);

            var $now = $container.find('[data-pos=center]');
            var $next = $container.find('[data-index="' + next_index + '"]');

            me.last_slide_time = +new Date();
            setTimeout(function() {
                //右滑动
                if(slideTop){
                    $next.css('transform', 'translateY(0%)').addClass('animate').css('z-index', '100').attr('data-pos', 'center');
                    $now.css('transform', 'translateY(-100%)').removeClass('animate').css('z-index', '50').attr('data-pos', '');
                    //左滑动
                } else if(!slideTop) {
                    $next.css('transform', 'translateY(0%)').addClass('animate').css('z-index', '100').attr('data-pos', 'center');
                    $now.css('transform', 'translateY(100%)').removeClass('animate').css('z-index', '50').attr('data-pos', '');
                }

                if(Math.abs(next_index) === total_length) {
                    me.get_$slide_icon().hide();
                } else {
                    me.get_$slide_icon().show();
                }
            }, 50);

            var progress = Math.round(Math.abs(next_index)*100/total_length);
            this.get_$progress().css('width', progress + '%');
            this.get_$ct().find('[data-id=title]').text(Math.abs(next_index) + '/' + total_length);
        },

        //取出下一页的页码
        //@example:
        //slideTop=ture: 1=>2=>3=>-1=>-2=>-3=>1=>2=>3=>-1
        //slideTop=false: 1=>-3=>-2=>-1=>3=>2=>1=>-3=>-2=>-1
        get_next_index: function(slideTop, index) {
            var $container = this.get_$list(),
                $items = $container.find('.j-animate');
            var total_length = $items.length / 2;

            var next_index;
            if(slideTop) {
                if(index>0 && index < total_length) {
                    next_index = index + 1;
                } else if(index>0 && index === total_length) {
                    next_index = -1;
                } else if(index<0 && -index < total_length) {
                    next_index = index - 1;
                } else if(index<0 && -index === total_length) {
                    next_index = 1;
                }
            } else {
                if(index>0 && index > 1) {
                    next_index = index - 1;
                } else if(index>0 && index === 1) {
                    next_index = -total_length;
                } else if(index<0 && -index > 1) {
                    next_index = index + 1;
                } else if(index<0 && -index === 1) {
                    next_index = total_length;
                }
            }

            return next_index;
        },

        //预览滑动动画之前，需要进行左右两边的兑换
        restore: function(slideTop, next_index) {
            var $container = this.get_$list(),
                $items = $container.find('.j-animate');
            var total_length = $items.length / 2;
            var now_index = parseInt($container.find('[data-pos=center]').attr('data-id'));

            var item, position;
            //右边已经没了，需要挪动左边补充
            if(slideTop && Math.abs(next_index) >= total_length) {
                var left_items = $container.find('[data-id="' + preview_index + '"]');
                var trans = parseInt(left_items.css('transform').replace('translateY(','').replace('%)',''));
                if(trans === -100 && now_index !== preview_index) {
                    left_items.addClass('disable');
                    preview_index++;

                    for(var i=0; i<left_items.length; i++) {
                        item = left_items.eq(i);
                        //挪动DOM结构时候，left也是动画就会产生耗时，这里先用disable禁掉动画，瞬间挪过去
                        item.css('transform', 'translateY(100%)').attr('data-pos', '').attr('data-id', (preview_index+1));
                    }
                    setTimeout(function() {
                        left_items.removeClass('disable');
                    }, 30);
                }
                //左边已经没了，需要挪动右边补充
            } else if(!slideTop && Math.abs(next_index)===1) {
                var right_items = $container.find('[data-id="' + (preview_index+1) + '"]');
                var trans = parseInt(right_items.css('transform').replace('translateY(','').replace('%)',''));
                if(trans === 100 && now_index !== preview_index) {
                    right_items.addClass('disable');
                    preview_index--;

                    for(var i=0; i<right_items.length; i++) {
                        item = right_items.eq(i);
                        item.css('transform', 'translateY(-100%)').attr('data-pos', '').attr('data-id', (preview_index));
                    }
                    setTimeout(function() {
                        right_items.removeClass('disable');
                    }, 30);
                }
            }
        },
        //恢复，主要是上下关系
        check: function(slideTop, next_index) {
            var $container = this.get_$list();
            var $next = $container.find('[data-index="' + next_index + '"]');

            //右边已经没了，需要挪动左边补充
            if(slideTop) {
                $next.addClass('disable');
                $next.css('transform', 'translateY(100%)').attr('data-pos', '');
                setTimeout(function() {
                    $next.removeClass('disable');
                }, 30);
                //左边已经没了，需要挪动右边补充
            } else if(!slideTop) {
                $next.addClass('disable');
                $next.css('transform', 'translateY(-100%)').attr('data-pos', '');
                setTimeout(function() {
                    $next.removeClass('disable');
                }, 30);
            }
        },

        back_to_select: function() {
            index = 1;
            $('.section-01').hide();
            $('.section-03').removeClass('show').addClass('hide');
            $('.section-00').show();
        },

        clear_sel_events: function() {
            var me = this;
            var $tag_btn = me.get_$ct().find('[data-action=replace]');
            if($tag_btn.length) {
                $tag_btn.remove();
                me.get_$ct().find('.edit-now').removeClass('edit-now');
            }
        },

        stop_music: function() {
            music.stop_music();
        },

        show_tips: function() {

        },

        get_$ct: function() {
            return this.$ct = this.$ct || (this.$ct = $('#container'));
        },

        get_$list: function() {
            return this.$list = this.$list || (this.$list = $('.j-list'));
        },

        get_$progress: function() {
            return this.$progress = this.$progress || (this.$progress = this.get_$ct().find('[data-id=progress]'));
        },

        get_$loading: function() {
            return this.$loading = this.$loading || (this.$loading = $('#loading'));
        },

        get_$slide_icon: function() {
            return this.$slide_icon = this.$slide_icon || (this.$slide_icon = this.get_$ct().find('.slide'));
        },

        get_$toolbar: function() {
            return this.$toolbar = this.$toolbar || (this.$toolbar = $('#tool_bar'));
        }
    });

    return ui;
});/**
 * 获取头像昵称等数据
 * @author xixinhuang
 * @date 2017-01-13
 */
define.pack("./user_info",["$","lib","common","./user_log","./store"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        request = common.get('./request'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        https_tool = common.get('./util.https_tool'),
        user_info_event = common.get('./global.global_event').namespace('user_info_event'),

        user_log = require('./user_log'),
        store = require('./store'),
        undefined;

    var user_info = new Module('user_info', {
        _is_login: false,
        _nickname: '',
        _logo: '',

        render: function() {
            if(this._rendered) {
                return;
            }
            this.check_user_info();
            this._bind_events();
            this._rendered = true;
        },

        _bind_events: function() {
            var me = this;
            //更新cookie后，需要重新拉取头像昵称信息
            user_info_event.on('update_cookie', function() {
                me.check_user_info();
            });
        },

        is_login: function() {
            return this._is_login;
        },

        get_user_info: function() {
            return {
                nickname: this._nickname,
                logo: this._logo,
                user_id: store.get_user_id()
            }
        },

        check_user_info: function() {
            var me = this;
            request.xhr_get({
                url: https_tool.translate_cgi('http://hzp.qq.com/hzp_interface.fcg'),
                cmd: 'AuthProxyGetUserInfo',
                use_proxy: false,
                body: {}
            }).ok(function(msg, body) {
                me._nickname = body.nick_name;
                me._logo = body.head_img_url;
                me._is_login = true;
                user_log.write_log('AuthProxyGetUserInfo', body);
            }).fail(function(msg, ret) {
                //widgets.reminder.error(msg || '请求失败，请稍后重试');
                me._is_login = false;
                user_log.write_log('AuthProxyGetUserInfo_error', msg + ':' + ret);
                if (!ret_msgs.is_sess_timeout(ret)) {
                    user_log.report('hzp_error', ret);
                }
            });
        },

        clear: function() {
            this._is_login = false;
            this._rendered = false;
            this._nickname = '';
            this._logo = '';
        }
    });

    return user_info;
});/**
 * 用户操作日志
 * 后续再并入common库
 * @author xixinhuang
 * @date 2017-01-13
 */
define.pack("./user_log",["$","lib","common","./store","./app_cfg"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        cookie = lib.get('./cookie'),
        dateformat  = lib.get('./dateformat'),
        request = common.get('./request'),
        ret_msgs = common.get('./ret_msgs'),
        widgets = common.get('./ui.widgets'),
        logger = common.get('./util.logger'),
        browser = common.get('./util.browser'),
        reportMD = common.get('./report_md'),
        constants = common.get('./constants'),
        https_tool = common.get('./util.https_tool'),
        store = require('./store'),
        app_cfg = require('./app_cfg'),

        log_data = [],
        undefined;

    var last_time,
        cache_log = [],
        cache_error = [],
        timer = {},
        uin = '';
    var view_key = 'hzp_' + uin;

    var user_log = new Module('user_log', {

        init: function() {
            log_data = [
                'hzp MV ' + (store.is_preview()? 'edit' : 'preview'),
                'hzp --------> time: ' + dateformat(+ new Date(), 'yyyy-mm-dd HH:MM:ss'),
                'hzp --------> url:' + location.href,
                'hzp --------> user_id: ' + store.get_user_id(),
                'hzp --------> platform: ' + JSON.stringify(app_cfg.get_app_cfg()) + ' is_qq: ' + (browser.QQ) + ' is_weixin: ' + browser.WEIXIN,
                'hzp --------> is_owner: ' + (cookie.get('hzp_owner') === '1'),
                //'hzp --------> nickname: ' + (nickname || ''),
                //'hzp --------> head_url: ' + (head_url || ''),
                'hzp --------> access_token: ' + cookie.get('access_token'),
                'hzp --------> openid: ' + cookie.get('openid')
            ];
        },
        
        write_log: function(key, str) {
            if(typeof str === 'object') {
                log_data.push('hzp --------> ' + key + ': ' + dateformat(+ new Date(), 'yyyy-mm-dd HH:MM:ss') + ' ' + JSON.stringify(str));
            } else {
                log_data.push('hzp --------> ' + key + ': ' + dateformat(+ new Date(), 'yyyy-mm-dd HH:MM:ss') + ' ' + str);
            }
        },

        //微信或者微信帐号登录等场景，如果没有uin数据，则从user_id种取出，种入uin字段，方便查询log。如果user_id非数字则使用10000代替
        set_cookie: function() {
            var user_id = cookie.get('user_id'),
                uin = cookie.get('uin'),
                p_uin = cookie.get('p_uin');

            if(!uin) {
                user_id = (!user_id || isNaN(user_id))? (p_uin || 10000): user_id;
                cookie.set('uin', user_id, {
                    domain: 'qq.com',
                    expires: 1,
                    path: '/'
                });
            }
        },

        //异常上报一次，退出页面上报一次，预览则自动上报一次
        report: function(mode, ret) {
            var now = new Date().getTime(),
                take_time = 4,      //实时上报
                //last_time ? (now - last_time) / 1000 : 4,
                url = (constants.IS_HTTPS ? 'https:': 'http:') + '//hzp.qq.com/report/error/' + (mode || view_key),
                interfaceMap = {
                    'wy_h5_vip_qboss': 178000393, // 微云H5会员页qboss广告数据拉取接口
                    'outlink_v2_error': 179000129, // 微云H5分享页操作异常log上报
                    'hzp_show_image_error': 179000212, //好照片换图异常
                    'hzp_mv_save_error': 179000206,//好照片MV保存接口
                    'hzp_like_error': 179000207,   //好照片MV点赞接口
                    'hzp_error': 178000359,        //好照片操作异常log上报
                    'h5_session_timeout': 179000171,    //移动端内嵌页登录态失效
                    'upload_error': 177000185,
                    'upload_plugin_error': 177000186,
                    'download_error': 177000187,
                    'disk_error': 178000314,
                    'flash_error': 177000197,
                    'hash_error': 178000306
                };

            this.set_cookie();

            //三秒上报一次, 这里last_time标识上次上报的时间点。
            if(take_time > 3) {
                timer && clearTimeout(timer);
                cache_error.push(log_data.join('\n'));
                timer = setTimeout(function() {
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: cache_error.join('\n'),
                        contentType: 'text/plain',
                        xhrFields: {
                            withCredentials: true
                        }
                    });
                    cache_error = [];
                }, 3 * 1000);
                last_time = now;
            } else {
                cache_error.push(log_data.join('\n'));
            }

            if(mode && ret) {
                reportMD(277000034, interfaceMap[mode], parseInt(ret), 0);
            }
        }
    });

    return user_log;
});
//tmpl file list:
//mv/src/preview/family.tmpl.html
//mv/src/preview/school.tmpl.html
//mv/src/preview/travel.tmpl.html
//mv/src/template.tmpl.html
//mv/src/template/family.tmpl.html
//mv/src/template/school.tmpl.html
//mv/src/template/travel.tmpl.html
//mv/src/view.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'family_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var len = data.list.length;
        var top = data.top;
        var prefix = 100;
        var template = data.template;
        var sub_template = data.sub_template;

        for(var i=0; i < len; i++) {
            var item = data.list[i];
            var postion = top === 100? '2' : '1';
            var data_index = top === 100? (i+1) : -(i+1);
            var file_list = item.file_list;
            var page = file_list[0].page_info || sub_template + '_1';
            var _data = {
                index: i,
                item: item,
                top: top,
                date: data.date,
                owner: data.owner,
                template: template,
                sub_template: page.replace(/_.+/, ''),
                postion: postion,
                data_index: data_index
            }
    __p.push('    ');
_p(this[template + '_' + page](_data));
__p.push('    ');
 } __p.push('    ');
_p(this.last_page(data));
__p.push('');

return __p.join("");
},

'family_1_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-1 content-1 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('        ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'family_1_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-1 content-2 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
            <div class="welt welt-1"></div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_1_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-1 content-3 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="welt welt-6"></div>\r\n\
            <div class="welt welt-7"></div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_1_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-1 content-4 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
        <div class="welt welt-1"></div>\r\n\
        <div class="welt welt-2"></div>\r\n\
        <div class="welt welt-3"></div>\r\n\
        <div class="welt welt-4"></div>\r\n\
        <div class="welt welt-5"></div>\r\n\
        <div class="welt welt-6"></div>\r\n\
        <div class="welt welt-7"></div>\r\n\
        <div class="welt welt-8"></div>\r\n\
    </li>');

return __p.join("");
},

'family_1_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-1 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface_desc_list[0] || '');
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface_desc_list[1] || '');
__p.push('</p>\r\n\
                <p class="description description-4">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-5">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_2_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-1 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'family_2_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-2 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_2_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-3 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="welt welt-6"></div>\r\n\
            <div class="welt welt-7"></div>\r\n\
            <div class="welt welt-8"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_2_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-4 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
        <div class="welt welt-1"></div>\r\n\
        <div class="welt welt-2"></div>\r\n\
        <div class="welt welt-3"></div>\r\n\
        <div class="text">');

                var file_text = file_list[0].get_format_file_text() || '';
                if(typeof file_text == 'string') {
            __p.push('            <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                } else if(typeof file_text == 'object') {
                    for(var key in file_text) {
                    var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
            __p.push('            <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                    }
                }
            __p.push('        </div>\r\n\
    </li>');

return __p.join("");
},

'family_2_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-2 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface_desc_list[0] || '');
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface_desc_list[1] || '');
__p.push('</p>\r\n\
                <p class="description description-4">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-5">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_3_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-1 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

            var file_list = data.item.file_list;
            var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
            for(var j=0; j < file_list.length; j++) {
            var file = file_list[j].file_item;
            var file_text = file_list[j].file_text || default_text_list[j];
            var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="text">');

                var file_text = file_list[0].get_format_file_text() || '';
                if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                } else if(typeof file_text == 'object') {
                for(var key in file_text) {
                var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                }
                }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'family_3_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-2 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

            var file_list = data.item.file_list;
            var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
            for(var j=0; j < file_list.length; j++) {
            var file = file_list[j].file_item;
            var file_text = file_list[j].file_text || default_text_list[j];
            var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="text">');

                var file_text = file_list[0].get_format_file_text() || '';
                if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                } else if(typeof file_text == 'object') {
                for(var key in file_text) {
                var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                }
                }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_3_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-3 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

            var file_list = data.item.file_list;
            var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
            for(var j=0; j < file_list.length; j++) {
            var file = file_list[j].file_item;
            var file_text = file_list[j].file_text || default_text_list[j];
            var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="welt welt-6"></div>\r\n\
            <div class="text">');

                var file_text = file_list[0].get_format_file_text() || '';
                if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                } else if(typeof file_text == 'object') {
                for(var key in file_text) {
                var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                }
                }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_3_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item content-4 ');
_p(data.template+'-'+data.sub_template);
__p.push(' j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

            var file_list = data.item.file_list;
            var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
            for(var j=0; j < file_list.length; j++) {
            var file = file_list[j].file_item;
            var file_text = file_list[j].file_text || default_text_list[j];
            var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
        <div class="welt welt-1"></div>\r\n\
        <div class="welt welt-2"></div>\r\n\
        <div class="welt welt-3"></div>\r\n\
        <div class="welt welt-4"></div>\r\n\
        <div class="welt welt-5"></div>\r\n\
        <div class="welt welt-6"></div>\r\n\
        <div class="text">');

            var file_text = file_list[0].get_format_file_text() || '';
            if(typeof file_text == 'string') {
            __p.push('            <p class="description description-1">');
_p(file_text);
__p.push('</p>');

            } else if(typeof file_text == 'object') {
            for(var key in file_text) {
            var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
            __p.push('            <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

            }
            }
            __p.push('        </div>\r\n\
    </li>');

return __p.join("");
},

'family_3_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item family-2 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

            var file_list = data.item.file_list;
            var preface = file_list[0].preface;
            var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface_desc_list[0] || '');
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface_desc_list[1] || '');
__p.push('</p>\r\n\
                <p class="description description-4">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-5">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var len = data.list.length;
        var top = data.top;
        var prefix = 100;
        var template = data.template;
        var sub_template = data.sub_template;

        for(var i=0; i < len; i++) {
            var item = data.list[i];
            var postion = top === 100? '2' : '1';
            var data_index = top === 100? (i+1) : -(i+1);
            var file_list = item.file_list;
            var page = file_list[0].page_info || sub_template + '_1';
            var _data = {
                index: i,
                item: item,
                top: top,
                date: data.date,
                owner: data.owner,
                template: template,
                sub_template: page.replace(/_.+/, ''),
                postion: postion,
                data_index: data_index
            }
    __p.push('    ');
_p(this[template + '_' + page](_data));
__p.push('    ');
 } __p.push('    ');
_p(this.last_page(data));
__p.push('');

return __p.join("");
},

'school_1_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-1 content-1 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'school_1_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-1 content-2 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>');
 } __p.push('            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_1_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-1 content-3 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_1_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-1 content-4 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_1_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-1 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_2_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-2 content-1 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'school_2_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-2 content-2 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_2_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-2 content-3 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_2_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-2 content-4 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
        <div class="welt welt-1"></div>\r\n\
        <div class="welt welt-2"></div>\r\n\
        <div class="welt welt-3"></div>\r\n\
        <div class="text">');

                var file_text = file_list[0].get_format_file_text() || '';
                if(typeof file_text == 'string') {
            __p.push('            <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                } else if(typeof file_text == 'object') {
                    for(var key in file_text) {
                    var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
            __p.push('            <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                    }
                }
            __p.push('        </div>\r\n\
    </li>');

return __p.join("");
},

'school_2_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-2 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_3_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-3 content-1 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('        ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'school_3_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-3 content-2 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                }
                }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_3_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-3 content-3 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'school_3_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-3 content-4 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
        <div class="welt welt-1"></div>\r\n\
        <div class="welt welt-2"></div>\r\n\
        <div class="welt welt-3"></div>\r\n\
        <div class="welt welt-4"></div>\r\n\
    </li>');

return __p.join("");
},

'school_3_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item classmate-3 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var len = data.list.length;
        var top = data.top;
        var prefix = 100;
        var template = data.template;
        var sub_template = data.sub_template;

        for(var i=0; i < len; i++) {
            var item = data.list[i];
            var postion = top === 100? '2' : '1';
            var data_index = top === 100? (i+1) : -(i+1);
            var file_list = item.file_list;
            var page = file_list[0].page_info || sub_template + '_1';
            var _data = {
                index: i,
                item: item,
                top: top,
                date: data.date,
                owner: data.owner,
                template: template,
                sub_template: page.replace(/_.+/, ''),
                postion: postion,
                data_index: data_index
            }
    __p.push('    ');
_p(this[template + '_' + page](_data));
__p.push('    ');
 } __p.push('    ');
_p(this.last_page(data));
__p.push('');

return __p.join("");
},

'travel_1_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-1 content-1 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'travel_1_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-1 content-2 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('         ');
 } __p.push('    </li>');

return __p.join("");
},

'travel_1_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-1 content-3 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_1_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-1 content-4 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_1_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-1 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface_desc_list[0] || '');
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface_desc_list[1] || '');
__p.push('</p>\r\n\
                <p class="description description-4">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-5">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_2_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-2 content-1 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('         ');
 } __p.push('    </li>');

return __p.join("");
},

'travel_2_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-2 content-2 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_2_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-2 content-3 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_2_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('     <li class="item travel-2 content-4 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_2_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-2 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface_desc_list[0] || '');
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface_desc_list[1] || '');
__p.push('</p>\r\n\
                <p class="description description-4">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-5">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_3_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-3 content-1 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>');
 if(data.index === 0) {__p.push('            ');
_p(this.author(data));
__p.push('        ');
 } __p.push('    </li>');

return __p.join("");
},

'travel_3_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-3 content-2 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_3_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-3 content-3 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_3_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-3 content-4 j-animate" data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var default_text_list = ['记得那一天', '和我说说日子 跟我聊聊岁月<br>就像回到我们从前', '老同学 好久不見<br>背后沧海桑田<br>让我们回忆想念'];
                for(var j=0; j < file_list.length; j++) {
                    var file = file_list[j].file_item;
                    var file_text = file_list[j].file_text || default_text_list[j];
                    var thumb_url = (file.ext_info && file.ext_info.thumb_url) || file_list[j].default_pic_url;
            __p.push('            <div class="photo photo-');
_p(j+1);
__p.push('">\r\n\
                <div class="inner" data-file-id="');
_p(file.file_id);
__p.push('" style="overflow: hidden" data-src="');
_p(thumb_url);
__p.push('">\r\n\
                    <!--<img src="');
_p(thumb_url);
__p.push('">-->\r\n\
                </div>\r\n\
            </div>');
 } __p.push('            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="text">');

                    var file_text = file_list[0].get_format_file_text() || '';
                    if(typeof file_text == 'string') {
                __p.push('                <p class="description description-1">');
_p(file_text);
__p.push('</p>');

                    } else if(typeof file_text == 'object') {
                        for(var key in file_text) {
                        var desc_index = parseInt(key.replace(/^.+_/,'')) +1;
                __p.push('                <p class="description description-');
_p(desc_index);
__p.push('">');
_p(file_text[key]);
__p.push('</p>');

                        }
                    }
                __p.push('            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'travel_3_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <li class="item travel-3 content-5 j-animate"  data-type="play" data-index="');
_p(data.data_index);
__p.push('" data-id="');
_p(data.postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="info">');

                var file_list = data.item.file_list;
                var preface = file_list[0].preface;
                var preface_desc_list = (preface.preface_desc_list && preface.preface_desc_list.length>0)? preface.preface_desc_list : [];
            __p.push('            <div class="text photo">\r\n\
                <p class="description description-1">');
_p(preface.preface_title);
__p.push('</p>\r\n\
                <p class="description description-2">');
_p(preface_desc_list[0] || '');
__p.push('</p>\r\n\
                <p class="description description-3">');
_p(preface_desc_list[1] || '');
__p.push('</p>\r\n\
                <p class="description description-4">');
_p(preface.preface_author);
__p.push('</p>\r\n\
                <p class="description description-5">');
_p(preface.preface_time);
__p.push('</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'author': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var logo = data.owner.logo || '//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/avatar-160.png';
        var nickname = data.owner.nickname || '';
        var date = data.date;
    __p.push('    <div class="author">\r\n\
        <div class="avatar" style="background-image:url(');
_p(logo);
__p.push(')"></div>\r\n\
        <p class="infor">');
_p(nickname);
__p.push(' 于');
_p(date);
__p.push('</p>\r\n\
    </div>');

return __p.join("");
},

'last_page': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var logo = data.owner.logo || '//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/avatar-160.png';
        var nickname = data.owner.nickname || '';
        var postion = data.top === 100? '2' : '1';
        var data_index = data.top === 100? data.list.length+1 : -(data.list.length+1);
        var _template = data.template==='school'? 'classmate' : data.template;
        var template_class = _template + '-' + data.sub_template;

        var store = require('./store');
        var dir_name = decodeURIComponent(store.get_dir_name());
    __p.push('    <li class="item ');
_p(template_class);
__p.push(' j-animate" data-type="play" data-index="');
_p(data_index);
__p.push('" data-id="');
_p(postion);
__p.push('" style="transform: translateY(');
_p(data.top+'%');
__p.push('); z-index: 50;">\r\n\
        <div class="mv-share">\r\n\
            <!-- 中间内容 S -->\r\n\
            <div class="photo-bd">\r\n\
                <div class="share-info j-share-info">\r\n\
                    <div class="info-avatar">\r\n\
                        <img src="');
_p(logo);
__p.push('" alt="用户头像">\r\n\
                    </div>\r\n\
                    <div class="info-name">\r\n\
                        <h3>\r\n\
                            出品: <span>');
_p(nickname);
__p.push('</span>\r\n\
                        </h3>\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- 中间内容 E -->\r\n\
            <!-- 底部 S -->\r\n\
            <div class="photo-ft">');
 if(dir_name) { __p.push('                <div class="from"><p>摘自<span data-action="enter_group">《');
_p(dir_name);
__p.push('》</span></p></div>');
 } __p.push('                <div class="logo-info clearfix">\r\n\
                    <span class="logo"></span>\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- 底部 E -->\r\n\
        </div>\r\n\
    </li>');

return __p.join("");
},

'family_1_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="1_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'family_1_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item family-1 content-1 j-animate" data-sub-template="1" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="1">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_1_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-1 content-1 j-animate" data-sub-template="1" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-1.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_1_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-1 content-2 j-animate" data-sub-template="1" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.edit -->\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-2.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="宝贝，欢迎你的到来">宝贝，欢迎你的到来</p>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_1_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-1 content-3 j-animate" data-sub-template="1" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-3.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-4.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
                <div class="welt welt-6"></div>\r\n\
                <div class="welt welt-7"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_1_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-1 content-4 j-animate" data-sub-template="1" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-5.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-6.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 edit" data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/temp/photo-7.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
            <div class="welt welt-5"></div>\r\n\
            <div class="welt welt-6"></div>\r\n\
            <div class="welt welt-7"></div>\r\n\
            <div class="welt welt-8"></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_1_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';

    __p.push('    <div class="wrap">\r\n\
        <div class="item family-1 content-5 j-animate j-preface" data-sub-template="1" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="献给">献给</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-desc data-content="最亲爱的的宝贝">最亲爱的的宝贝</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-desc data-content="愿你快乐健康成长">愿你快乐健康成长</p>\r\n\
                    <p class="description description-4 edit" data-id="4" data-preface-author data-content="——');
_p(nickname);
__p.push('">——');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-5 edit" data-id="5" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_2_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="2_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'family_2_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item family-2 content-1 j-animate" data-sub-template="2" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="宝宝日记">宝宝日记</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_2_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-2 content-1 j-animate" data-sub-template="2" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="宝宝日记">宝宝日记</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_2_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-2 content-2 j-animate" data-sub-template="2" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.edit -->\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="快快长大～">快快长大～</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_2_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-2 content-3 j-animate" data-sub-template="2" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
                <div class="welt welt-6"></div>\r\n\
                <div class="welt welt-7"></div>\r\n\
                <div class="welt welt-8"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="爱哭的你">爱哭的你</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_2_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-2 content-4 j-animate" data-sub-template="2" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-6.jpg">\r\n\
\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 edit" data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/temp/photo-7.jpg">\r\n\
\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="text">\r\n\
                <p class="description" data-id="1" data-content="爱笑的你">爱笑的你</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_2_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-2 content-5 j-animate j-preface" data-sub-template="2" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="献给">献给</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-desc data-content="最亲爱的宝贝">最亲爱的宝贝</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-desc data-content="愿你快乐健康成长">愿你快乐健康成长</p>\r\n\
                    <p class="description description-4 edit" data-id="4" data-preface-author data-content="——');
_p(nickname);
__p.push('">——');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-5 edit" data-id="5" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_3_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="3_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-2/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'family_3_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item family-3 content-1 j-animate" data-sub-template="3" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_3_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-3 content-1 j-animate" data-sub-template="3" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_3_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-3 content-2 j-animate" data-sub-template="3" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.edit -->\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
            </div>\r\n\
            <div class="text">\r\n\
                <p class="description description-1 edit" data-id="1" data-content="可爱的小宝贝">可爱的小宝贝</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_3_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-3 content-3 j-animate" data-sub-template="3" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-4.jpg">\r\n\
                        <img src="">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
                <div class="welt welt-6"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_3_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-3 content-4 j-animate" data-sub-template="2" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-6.jpg">\r\n\
\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 edit" data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/family-3/temp/photo-7.jpg">\r\n\
\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
                <div class="welt welt-6"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'family_3_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item family-3 content-5 j-animate j-preface" data-sub-template="2" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="献给">献给</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-desc data-content="最亲爱的宝贝">最亲爱的宝贝</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-desc data-content="愿你快乐健康成长">愿你快乐健康成长</p>\r\n\
                    <p class="description description-4 edit" data-id="4" data-preface-author data-content="——');
_p(nickname);
__p.push('">——');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-5 edit" data-id="5" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_1_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="1_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'school_1_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item classmate-1 content-1 j-animate" data-sub-template="1" data-type="preview" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="匆匆那年">匆匆那年</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-content="一起走过的日子"> 一起走过的日子</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_1_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-1 content-1 j-animate" data-sub-template="1" data-type="preview" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="匆匆那年">匆匆那年</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-content="一起走过的日子"> 一起走过的日子</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_1_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-1 content-2 j-animate" data-sub-template="1" data-type="preview" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.edit -->\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="挥手告别校园">挥手告别校园</p>\r\n\
                    <p class="description description-1 edit" data-id="2" data-content="那里充满青春回忆">那里充满青春回忆</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_1_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-1 content-3 j-animate" data-sub-template="1" data-type="preview" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="青春校园">青春校园</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_1_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-1 content-4 j-animate" data-sub-template="1" data-type="preview" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-6.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 edit" data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/temp/photo-7.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="welt welt-5"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_1_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-1 content-5 j-animate j-preface" data-sub-template="1" data-type="preview" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="向三十年的青春岁月致敬" max_len="12">向三十年的青春岁月致敬</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-author data-content="——');
_p(nickname);
__p.push('">——');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_2_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="2_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'school_2_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item classmate-2 content-1 j-animate" data-sub-template="2" data-type="preview" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-1.jpg">\r\n\
\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="青春不见不散">青春不见不散</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_2_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-2 content-1 j-animate" data-sub-template="2" data-type="preview" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="青春不见不散">青春不见不散</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_2_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-2 content-2 j-animate" data-sub-template="2" data-type="preview" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.edit -->\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="旧时光">旧时光</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_2_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-2 content-3 j-animate" data-sub-template="2" data-type="preview" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="时光是记忆的橡皮擦">时光是记忆的橡皮擦</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_2_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-2 content-4 j-animate" data-sub-template="2" data-type="preview" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-6.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 edit" data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/temp/photo-7.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="text">\r\n\
                <p class="description" data-id="1" data-content="20年的回忆">20年的回忆</p>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_2_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-2 content-5 j-animate j-preface" data-sub-template="2" data-type="preview" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="向三十年的青春岁月致敬" max_len="12">向三十年的青春岁月致敬</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-author data-content="——');
_p(nickname);
__p.push('">——');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_3_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="3_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-2/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'school_3_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item classmate-3 content-1 j-animate" data-sub-template="3" data-type="preview" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="老同学再聚首">老同学再聚首</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-content="旧时光又重回">旧时光又重回</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_3_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-3 content-1 j-animate" data-sub-template="3" data-type="preview" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 edit" data-id="1" data-content="老同学再聚首">老同学再聚首</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-content="旧时光又重回">旧时光又重回</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_3_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-3 content-2 j-animate" data-sub-template="3" data-type="preview" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.edit -->\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description edit" data-id="1" data-content="书写友谊">书写友谊</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_3_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-3 content-3 j-animate" data-sub-template="3" data-type="preview" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_3_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-3 content-4 j-animate" data-sub-template="3" data-type="preview" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 edit" data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 edit" data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-6.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 edit" data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/classmate-3/temp/photo-7.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
            <div class="welt welt-1"></div>\r\n\
            <div class="welt welt-2"></div>\r\n\
            <div class="welt welt-3"></div>\r\n\
            <div class="welt welt-4"></div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'school_3_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item classmate-3 content-5 j-animate j-preface" data-sub-template="3" data-type="preview" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="向三十年的青春岁月致敬" max_len="12">向三十年的青春岁月致敬</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-author data-content="——');
_p(nickname);
__p.push('">——');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_1_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="1_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'travel_1_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item travel-1 content-1 j-animate" data-sub-template="1" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_1_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-1 content-1 j-animate" data-sub-template="1" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-1.jpg" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_1_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-1 content-2 j-animate" data-sub-template="1" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.-->\r\n\
                <div class="photo photo-1 " data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 " data-id="1" data-content="去不同的地方">去不同的地方</p>\r\n\
                    <p class="description description-2 " data-id="2" data-content="感悟不同的人生">感悟不同的人生</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_1_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-1 content-3 j-animate" data-sub-template="1" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 " data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 " data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_1_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-1 content-4 j-animate" data-sub-template="1" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 " data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 " data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-6.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 " data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/temp/photo-7.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_1_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-1 content-5 j-animate j-preface" data-sub-template="1" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="致旅行">致旅行</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-desc data-content="旅行不仅是发现最美风景">旅行不仅是发现最美风景</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-desc data-content="而是去感悟人生">而是去感悟人生</p>\r\n\
                    <p class="description description-4 edit" data-id="4" data-preface-author data-content="');
_p(nickname);
__p.push('">');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-5 edit" data-id="5" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_2_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="2_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'travel_2_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item travel-2 content-1 j-animate" data-sub-template="2" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description " data-id="1" data-content="WORLDWIDE TOUR">WORLDWIDE TOUR</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_2_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-2 content-1 j-animate" data-sub-template="2" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description " data-id="1" data-content="WORLDWIDE TOUR">WORLDWIDE TOUR</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_2_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-2 content-2 j-animate" data-sub-template="2" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.-->\r\n\
                <div class="photo photo-1 " data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 " data-id="1" data-content="TRAVEL ALONE">TRAVEL ALONE</p>\r\n\
                    <p class="description description-2 " data-id="2" data-content="discover the world">discover the world</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_2_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-2 content-3 j-animate" data-sub-template="2" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 " data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 " data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 " data-id="1" data-content="ENJOYABLE TOUR">ENJOYABLE TOUR</p>\r\n\
                    <p class="description description-2 " data-id="2" data-content="set yourself free">set yourself free</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_2_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-2 content-4 j-animate" data-sub-template="2" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 " data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 " data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-6.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 " data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/temp/photo-7.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 " data-id="1" data-content="TRAVEL WITH LEARNING">TRAVEL WITH LEARNING</p>\r\n\
                    <p class="description description-2 " data-id="2" data-content="broad the horizon">broad the horizon</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_2_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-2 content-5 j-animate j-preface" data-sub-template="2" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="致旅行">致旅行</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-desc data-content="旅行不仅是发现最美风景">旅行不仅是发现最美风景</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-desc data-content="而是去感悟人生">而是去感悟人生</p>\r\n\
                    <p class="description description-4 edit" data-id="4" data-preface-author data-content="');
_p(nickname);
__p.push('">');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-5 edit" data-id="5" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_3_sel': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="template-select-wrap">\r\n\
        <ul class="template-select clearfix">\r\n\
            <div class="item" data-id="3_5" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-5.jpg)"></div>\r\n\
            <div class="item" data-id="3_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="3_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="3_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="1_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="1_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="1_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-1/cover/cover-4.jpg)"></div>\r\n\
            <div class="item" data-id="2_2" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-2.jpg)"></div>\r\n\
            <div class="item" data-id="2_3" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-3.jpg)"></div>\r\n\
            <div class="item" data-id="2_4" data-action="select_page" style="background-image:url(//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-2/cover/cover-4.jpg)"></div>\r\n\
        </ul>\r\n\
    </div>');

return __p.join("");
},

'travel_3_tmpl': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="wrap">\r\n\
        <div class="item travel-3 content-1 j-animate" data-sub-template="3" data-page="1" data-filter="fixed">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 j-photo" data-action="show_tag" data-file-index="1" >\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description " data-id="1" data-content="TRAVEL">TRAVEL</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_3_tmpl_1': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-3 content-1 j-animate" data-sub-template="3" data-page="1">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 j-photo" data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-1.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description " data-id="1" data-content="TRAVEL">TRAVEL</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_3_tmpl_2': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-3 content-2 j-animate" data-sub-template="3" data-page="2">\r\n\
            <div class="info">\r\n\
                <!-- 编辑态蓝框.-->\r\n\
                <div class="photo photo-1 " data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-2.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description " data-id="1" data-content="一个人的旅行">一个人的旅行</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_3_tmpl_3': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-3 content-3 j-animate" data-sub-template="3" data-page="3">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 " data-action="show_tag" data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-3.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 " data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-4.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description " data-id="1" data-content="两个人的发呆">两个人的发呆</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_3_tmpl_4': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-3 content-4 j-animate" data-sub-template="3" data-page="4">\r\n\
            <div class="info">\r\n\
                <div class="photo photo-1 " data-action="show_tag"  data-file-index="');
_p(file_index);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-5.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-2 " data-action="show_tag" data-file-index="');
_p(file_index+1);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-6.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="photo photo-3 " data-action="show_tag" data-file-index="');
_p(file_index+2);
__p.push('">\r\n\
                    <div class="inner" style="overflow: hidden" data-src="//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/mv/travel-3/temp/photo-7.jpg">\r\n\
                    </div>\r\n\
                </div>\r\n\
                <div class="welt welt-1"></div>\r\n\
                <div class="welt welt-2"></div>\r\n\
                <div class="welt welt-3"></div>\r\n\
                <div class="welt welt-4"></div>\r\n\
                <div class="text">\r\n\
                    <p class="description description-1 " data-id="1" data-content="也许是离愁  偶遇">也许是离愁  偶遇</p>\r\n\
                    <p class="description description-2 " data-id="2" data-content="人在囧途">人在囧途</p>\r\n\
                    <p class="description description-3 " data-id="3" data-content="让人意想不到">让人意想不到</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'travel_3_tmpl_5': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var index = data.index;
        var file_index = data.file_index;
        var lib = require('lib');
        var dateformat  = lib.get('./dateformat');
        var today = dateformat(+new Date(), 'yyyy.mm.dd');
        var store = require('./store');
        var nickname = store.get_nickname() || '';
    __p.push('    <div class="wrap">\r\n\
        <div class="item travel-3 content-5 j-animate j-preface" data-sub-template="3" data-page="5">\r\n\
            <div class="info">\r\n\
                <div class="text photo">\r\n\
                    <p class="description description-1 edit" data-id="1" data-preface-title data-content="致旅行">致旅行</p>\r\n\
                    <p class="description description-2 edit" data-id="2" data-preface-desc data-content="旅行不仅是发现最美风景">旅行不仅是发现最美风景</p>\r\n\
                    <p class="description description-3 edit" data-id="3" data-preface-desc data-content="而是去感悟人生">而是去感悟人生</p>\r\n\
                    <p class="description description-4 edit" data-id="4" data-preface-author data-content="');
_p(nickname);
__p.push('">');
_p(nickname);
__p.push('</p>\r\n\
                    <p class="description description-5 edit" data-id="5" data-preface-time data-content="');
_p(today);
__p.push('">');
_p(today);
__p.push('</p>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'like_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var like_list = data.list || [],
            like_icon_class = data.is_like? 'icon-like' : 'icon-dislike',
            like_btn_text = data.is_like? '已点赞' : '点赞',
            max_len = like_list.length>3? 3 : like_list.length,
            user_id = data.user_id,
            is_self = false,
            user_avatar;
        var like_text = like_list.length>0? '等'+ like_list.length + '人点赞' : '';
    __p.push('    <div class="info-ft like-bf j-like-info">\r\n\
        <div class="info-btn" data-action="like">\r\n\
            <!--客户端icon-dislike-->\r\n\
            <a class="btn-like" href="javascript:;"><i class="icon ');
_p(like_icon_class);
__p.push('"></i><span>');
_p(like_btn_text);
__p.push('</span></a>\r\n\
        </div>\r\n\
        <div class="like-list-wrap" data-action="view_like">\r\n\
            <ul class="like-list clearfix">');

                    for(var i=0; i < max_len; i++) {
                        user_avatar = like_list[i].logo || '//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/avatar-160.png';
                __p.push('                <li class="item-avatar" data-like-id="');
_p(like_list[i].user_id);
__p.push('">\r\n\
                    <img src="');
_p(user_avatar);
__p.push('" alt="头像">\r\n\
                </li>');

                    }
                __p.push('            </ul>\r\n\
            <p class="like-text">');
_p(like_text);
__p.push('</p>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'like_tips': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var btn_text = data.is_join? '打开相册' : '加入相册';
    __p.push('    <div class="info-ft like-at j-like-tips">\r\n\
        <div class="info-text">\r\n\
            <p class="text-thx">感谢你的点赞</p>\r\n\
            <p class="text-add">加入相册查看更多精彩内容</p>\r\n\
        </div>\r\n\
        <div class="info-btn" data-action="enter_group">\r\n\
            <a class="btn-like" href="javascript:;">');
_p(btn_text);
__p.push('</a>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'add_like': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var avatar = data.avatar;
        var logo = avatar.logo;
        var user_id = avatar.user_id;
    __p.push('    <li class="item-avatar" data-like-id="');
_p(user_id);
__p.push('">\r\n\
        <img src="');
_p(logo);
__p.push('" alt="头像">\r\n\
    </li>');

return __p.join("");
},

'like_detail': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){

        var like = require('./like');
        var like_list = data.list;
        var user_avatar,
            user_id,
            date_text,
            nickname;

        for(var i=0; i < like_list.length; i++) {
            user_avatar = like_list[i].logo || '//qzonestyle.gtimg.cn/qz-proj/wy-photo/img/avatar-160.png';
            user_id = like_list[i].user_id;
            nickname = like_list[i].nickname;
            date_text = like.get_date_text(like_list[i].like_time);
    __p.push('    <li class="like-detail-item">\r\n\
        <div class="main">\r\n\
            <div class="avatar" style="background-image:url(');
_p(user_avatar);
__p.push(')"></div>\r\n\
            <div class="name"><span>');
_p(nickname);
__p.push('</span></div>\r\n\
        </div>\r\n\
        <div class="right"><span class="time">');
_p(date_text);
__p.push('</span></div>\r\n\
    </li>');

        }
    __p.push('');

}
return __p.join("");
}
};
return tmpl;
});
