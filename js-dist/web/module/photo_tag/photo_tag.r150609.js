//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/photo_tag/photo_tag.r150609",["$","lib","common"],function(require,exports,module){

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
//photo_tag/src/photo_tag.js

//js file list:
//photo_tag/src/photo_tag.js
/**
 * Created by xixinhuang on 2015/7/14.
 */
define.pack("./photo_tag",["$","lib","common"],function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),
        request = common.get('./request'),
        cookie = lib.get('./cookie'),
        logger = common.get('./util.logger'),
        session_event = common('./global.global_event').namespace('session'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        req;

    var REQUEST_CGI = 'http://web2.cgi.weiyun.com/user_library.fcg',
        IMAGE_CMD = 'GetTagList', //'LibImageTagGet',
        TAG_FILE_CMD = 'LibTagFileListPageGet';

    var
        offset = 0,
        cur_tag,
        finish_flag = 0,
        MAX_PER_PAGE = 100,
        sort_type = 4,
        image_size = '320*320',

        undefined;



    var searcher = {
        tags: [],
        tags_count: 0,

        get_data: function(){
            if(!this.check_login()){
                login.to_login();
                return;
            }
            var def = $.Deferred(),
                me = this;
            var req_cfg = {
                assortment_id: 1
            };
            req && req.destroy();
            req = request.xhr_get({
                url: REQUEST_CGI,
                cmd: IMAGE_CMD,
                cavil: true,
                pb_v2: true,
                body: req_cfg
            }).ok(function(msg, body) {
                var data = body['image_tags'] || [];
                me.update(data);
            }).fail(function(ret, msg) {
                def.reject(ret, msg);
                var tag_container = document.getElementById('tag_container');
                tag_container.innerHTML = '该帐号无数据';
            });
        },
        update: function(data){
            var doc = document;
            var tag_container = doc.getElementById('tag_container');
            if(data.length){
                for(var item in data){
                    var tag = new Tag({tag_name: data[item]['tag_name'],local_version: '',count:data[item]['file_num']});
                    var newItem = doc.createElement('div');
                    newItem.setAttribute("class","col-md-1 item");
                    newItem.setAttribute("id","item_"+item);
                    var a = doc.createElement('a');
                    a.href = '#';
                    var tag_name = data[item]['tag_name'];
                    a.innerHTML = tag_name;
                    newItem.appendChild(a);
                    tag.set_id("item_"+item);
                    this.add_event('click',newItem,tag);
                    tag_container.appendChild(newItem);
                }
                this.update_uin();
            } else {
                this.update_uin();
                tag_container.innerHTML = '该帐号无数据';
            }
        },
        update_uin: function() {
            var uin = (cookie.get('uin')|| '').replace(/^o0/, '');
            document.getElementById('uin').innerText = uin;
        },
        show_error_tips: function() {
            var div = document.getElementById('error_tips');
            div.style.visibility = 'visible';
        },
        hide_error_tips: function() {
            var div = document.getElementById('error_tips');
            div.style.visibility = 'hidden';
        },
        add_event: function(type,ele,tag){
            var me = this;
            ele.addEventListener(type,function(){
                offset = 0;
                me.get_data_by_tag(tag);
            });
        },
        change_background: function(id){
            if(offset){
                return;
            }
            var items = document.getElementsByClassName('select_tag');
            if(items && items.length){
                for(var i=0; i<items.length; i++){
                    items[i].className = '';
                }
            }
            document.getElementById(id).getElementsByTagName('a')[0].className = 'select_tag';
        },

        check_login: function() {
            var uin = cookie.get('uin'),
                skey = cookie.get('skey');

            if(uin && skey) {
                return true;
            }
            return false;
        },
        update_photo: function(count,files){
            var doc = document;
            var tag_container = doc.getElementById('photo_container');
            this.clear_node(tag_container,tag_container.children);

            if(count){
                for(var item in files){
                    var file = files[item];
                    var url = files[item]['ext_info']['thumb_url'];
                    var newItem = doc.createElement('div');
                    newItem.setAttribute("id",'item_'+item);
                    newItem.setAttribute("data-file-id",'');
                    newItem.setAttribute("class","col-md-3 photo");
                    var img = doc.createElement('img');
                    img.setAttribute("src",url + '?size=' + image_size);
                    newItem.appendChild(img);
                    var msg = doc.createElement('span');
                    msg.setAttribute('class','photo_msg');
                    var confidence = files[item]['ext_info']['tags'];
                    msg.innerText = confidence[0]['tags_confidence'];
                    newItem.appendChild(msg);
                    tag_container.appendChild(newItem);
                }
            }
        },
        clear_node: function(container,children){
            if(!offset && children && children.length){
                for(var i=children.length; i>0; i--){
                    container.removeChild(children[i-1]);
                }
            }
        },
        getMorePage: function(){
            if(!finish_flag && cur_tag.get_count() > (offset + MAX_PER_PAGE)){
                offset += MAX_PER_PAGE;
                this.get_data_by_tag(cur_tag);
            }
        },
        get_data_by_tag: function(tag){
            if(!this.check_login()){
                login.to_login();
                return;
            }
            cur_tag = tag;
            var def = $.Deferred(),
                me = this;
            var req_cfg = {
                tag_name: tag.get_tag_name(),
                sort_type: sort_type,
                offset: offset,
                count: MAX_PER_PAGE
            };
            req && req.destroy();
            req = request.xhr_get({
                url: REQUEST_CGI,
                cmd: TAG_FILE_CMD,
                cavil: true,
                pb_v2: true,
                body: req_cfg
            }).ok(function(msg, body) {
                me.hide_error_tips();
                if(body['total_number'] && body['FileItem_items']){
                    var total_number = body['total_number'];
                    var file_items = body['FileItem_items'];
                    finish_flag = body['finish_flag'];
                    me.update_photo(total_number,file_items);
                }
                me.change_background(tag.get_id());
            }).fail(function(ret, msg) {
                def.reject(ret, msg);
                //������ʾ
                me.show_error_tips();
            });
        }
    };

    var Tag = function(config){
            this.tag_name = config.tag_name;
            this.local_version = config.local_version;
            this.id = '';
            this.count = config.count;
        };
    Tag.prototype = {
        get_tag_name: function(){
            return this.tag_name;
        },
        get_local_version: function(){
            return this.sort_type;
        },
        get_count: function(){
            return this.count;
        },
        set_id: function(id){
            this.id = id;
        },
        get_id: function(){
            return this.id;
        }
    };


    var login = new Module('outlink.login', {

        init: function() {
            this.listenTo(session_event, 'session_timeout', this.to_login);
        },

        to_login: function() {
            var me = this;
            require.async('qq_login', function (mod) {
                var qq_login = mod.get('./qq_login'),
                    qq_login_ui = qq_login.ui;

                me
                    .stopListening(qq_login)
                    .stopListening(qq_login_ui)
                    .listenTo(qq_login, 'qq_login_ok', function () {
                        //me.trigger('login_done');

                        searcher.get_data();
                    })
                    .listenToOnce(qq_login_ui, 'show', function () {
                        widgets.mask.show('qq_login', null, true);
                    })
                    .listenToOnce(qq_login_ui, 'hide', function () {
                        widgets.mask.hide('qq_login');

                        me.stopListening(qq_login_ui);
                    });
                qq_login.show();
            });
        }

    });

    return searcher;
});