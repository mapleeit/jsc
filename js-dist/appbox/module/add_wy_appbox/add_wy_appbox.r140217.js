//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/add_wy_appbox/add_wy_appbox.r140217",["lib","common","$","main"],function(require,exports,module){

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
//add_wy_appbox/src/add_wy_appbox.js
//add_wy_appbox/src/ui.js
//add_wy_appbox/src/add_wy_appbox.tmpl.html

//js file list:
//add_wy_appbox/src/add_wy_appbox.js
//add_wy_appbox/src/ui.js
/**
 * 上传控件安装
 * @author yuyanghe
 * @date 13-7-26
 */
define.pack("./add_wy_appbox",["lib","common","$","./tmpl","./ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        user_log = common.get('./user_log'),
        query_user=common.get('./query_user'),
        request = common.get('./request'),
        add_wy_appbox_event = common.get('./global.global_event').namespace('add_wy_appbox'),
        tmpl = require('./tmpl'),
        mini_tip=common.get('./ui.mini_tip'),
        undefined;

    var add_wy_appbox = new Module('add_wy_appbox', {
        _ui: require('./ui'),
        _is_render: false,
        _$check_qq_version: null,
        _$add_wy_to_appbox: null,
        _$check: null,
        _$success: null,
        _$fail: null,
        uin:query_user.get_uin_num(),
        render: function () {
            var me = this;
            //监听微云是否已在主面板
            add_wy_appbox_event.on('is_wy_in_appbox', function () {
                me.is_wy_in_appbox();
            });
            //添加微云到appbox主面板启动事件.
            add_wy_appbox_event.on('add_wy_to_appbox', function () {
                me._add_wy_to_appbox_start();
            });
            //检查QQ版本是否大于1.92
            me.on('check_qq_version', function () {
                me.check_qq_version();
            });

        },
        //检测QQ版本  利用iframe 访问qq域名下的一个网页检测。 若大于1.92 则弹出添加到主面版流程。
        check_qq_version: function(){
            var me=this;
            me._$check_qq_version = $(tmpl.check_qq_version()).appendTo(document.body);

        },

        //判断微云是否已加入主面版;
        is_wy_in_appbox: function(){
            var me = this;

            //访问CGI 判断微云是否已经添加至主面板
            request.xhr_get({
              cmd: 'quick_list',
              url: 'http://web.cgi.weiyun.com/weiyun_web_quick_list.fcg'
            }).ok(function (msg, body) {
                    var exist=body.exist;
                    var firstvisit=body.firstvisit;
                    if(exist < 1 &&firstvisit != 0 ){        //  　1代表已存在主面板中，0代表没有。firstvisit １代表第一次访问cgi 　０代表不是第一次
                        me.trigger('check_qq_version');
                    }
                });

        },

        _add_wy_to_appbox_start:function(){
            var me=this;
            me._$add_wy_to_appbox=$(tmpl.add_wy_to_appbox()).appendTo(document.body).hide();
            //窗口事件绑定
            me._$add_wy_to_appbox.find('.close').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:7});
                return me.hide();
            })
            me._$add_wy_to_appbox.find('#add_wy_to_appbox_add').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:1});
                this.href='Tencent://AppBox/?SubCmd=OpenTab&tabName=TencentTab&appID=10018&FUin='+me.uin;
                me._$check=$(tmpl.check()).appendTo(document.body).hide();
                //窗口事件绑定
                me._$check.find('.close').bind('click',function(){
                    user_log('ADD_WY_TO_APPBOX',0,{subop:7});
                    return me.hide();
                });
                //暂不添加按钮
                me._$check.find('#add_wy_to_appbox_cancel').bind('click',function(){
                    user_log('ADD_WY_TO_APPBOX',0,{subop:3});
                    return me.hide();
                });
                //已完成按钮       确保已完成按钮在ajax请求完毕无法使用 。 避免重复发送ajax请求。
                me._$check.find('#add_wy_to_appbox_ok').one('click',function(){
                    $(this).find('img').show();
                    this.disable=false;
                    me._is_add_success();
                    user_log('ADD_WY_TO_APPBOX',0,{subop:2});
                    return false;
                })
                me.show(me._$check);
            })
            return me.show(me._$add_wy_to_appbox);
        },
        //判断微云是否已添加到主面板中
        _is_add_success: function(){
            var me=this;
            request.xhr_get({
                cmd: 'quick_list',
                timeout:5000,
                url: 'http://web.cgi.weiyun.com/weiyun_web_quick_list.fcg'
            }).ok(function (msg, body) {
                    var exist=body.exist;
                    if(exist < 1){    // 1代表已添加     0代表未添加
                        me._add_fail();
                    }else{
                        me._add_success();
                    }
                }).fail(function(msg){
                    //ajax请求失败。 mini_tip反映失败原因。 然后 重新激活已完成按钮 。
                    mini_tip.error(msg);
                    var $add_wy_to_appbox_ok=me._$check.find('#add_wy_to_appbox_ok');
                    $add_wy_to_appbox_ok.disable=true;
                    var $img=$add_wy_to_appbox_ok.find('img');
                    $img.hide();
                    $add_wy_to_appbox_ok.one('click',function(){
                        user_log('ADD_WY_TO_APPBOX',0,{subop:2});
                        $(this).find('img').show();
                        this.disable=false;
                        me._is_add_success();
                        return false;
                    })

                });
            return false;
        },
        //用户已添加微云到主面板后的弹窗展示
        _add_success:function(){
            var me=this;
            //成功
            me._$success = $(tmpl.success()).appendTo(document.body).hide();
            me._$success.find('.close').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:7});
                return me.hide();
            });
            //确定按钮
            me._$success.find('#add_wy_to_appbox_ok_success').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:6});
                return me.hide();
            });
            return me.show(me._$success);
        },
        //用户添加微云到主面板后的
        _add_fail:function(){
            var me=this;
            me._$fail = $(tmpl.fail()).appendTo(document.body).hide();
            me._$fail.find('.close').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:7});
                return me.hide();
            });

            //暂不添加按钮,事件绑定.
            me._$fail.find('#add_wy_to_appbox_next').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:5});
                return me.hide();
            });
            //重新添加
            me._$fail.find('#add_wy_to_appbox_retry').bind('click',function(){
                user_log('ADD_WY_TO_APPBOX',0,{subop:4});
                this.href='Tencent://AppBox/?SubCmd=OpenTab&tabName=TencentTab&appID=10018&FUin='+me.uin;
                me.hide();
            });
            return me.show(me._$fail);
        },

        show: function ($Item) {
            var me = this;
            this.hide();
            this._ui.show($Item);
            return false;
        },

        hide: function () {
            this._ui.hide();
            return false;
        }

    });
    add_wy_appbox.render();

    return add_wy_appbox;
});/**
 * appbox 添加微云到主面板
 * @author yuyanghe
 * @date 13-8-6
 */
define.pack("./ui",["lib","common","$","./tmpl","main"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        center = common.get('./ui.center'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        tmpl = require('./tmpl'),
        main_ui,
        undefined;

    var ui = new Module('add_wy_appbox_ui', {

        render: function () {

        },
        /*  安装浮窗显示
         *  @params 浮动窗口的对象
         */
        show: function ($Item) {
            this._$el=$Item;
            this._$el.stop(false, true).fadeIn('fast');
            center.listen(this._$el);
            main_ui = require('main').get('./ui');
            if (main_ui && main_ui.is_visible && main_ui.is_visible()) {
                widgets.mask.show('upload_install');
            }
        },

        hide: function () {
            if (this._$el) {
                this._$el.stop(false, true).fadeOut('fast', function () {
                    center.stop_listen(this);
                });
                widgets.mask.hide('upload_install');
                this._$el=null;
            }
            return false;
        }

    });

    return ui;
});





//tmpl file list:
//add_wy_appbox/src/add_wy_appbox.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'check_qq_version': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div id="check_qq_version" class="box plugin-pop" style="display:none">\r\n\
        <div class="box-inner">\r\n\
            <i class="ui-bg"></i>\r\n\
            <!-- .box-inner -->\r\n\
            <div class="box-btns">\r\n\
                <iframe src="http://web.weiyun.qq.com/appbox/qqclient.html"></iframe>\r\n\
            </div>\r\n\
            <!-- .box-foot -->\r\n\
            <i class="ui-arr"></i>\r\n\
        </div>\r\n\
    </div>');

return __p.join("");
},

'add_wy_to_appbox': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="add2qq" style="z-index:10003">\r\n\
        <div class="con"><img src="http://imgcache.qq.com/vipstyle/nr/box/img/add2qq-add-now.jpg"/></div>\r\n\
        <div class="btn-box">\r\n\
            <a href="#" class="btn-blue" target="_blank" id=\'add_wy_to_appbox_add\'>现在去添加</a>\r\n\
        </div>\r\n\
        <a class="close" href="#"></a>\r\n\
    </div>');

return __p.join("");
},

'check': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="add2qq" style="z-index:10003">\r\n\
        <div class="con"><img src="http://imgcache.qq.com/vipstyle/nr/box/img/add2qq-complete.jpg"/></div>\r\n\
        <div class="btn-box">\r\n\
            <a href="#" class="btn-blue" id=\'add_wy_to_appbox_ok\'><img src="http://imgcache.qq.com/vipstyle/nr/box/img/add2qq-loading.gif" style="display:none"/>已完成</a>\r\n\
            <a href="#" class="btn-gray" id=\'add_wy_to_appbox_cancel\'>暂不添加</a>\r\n\
        </div>\r\n\
        <a class="close" href="#"></a>\r\n\
    </div>');

return __p.join("");
},

'success': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="add2qq" style="z-index:10003">\r\n\
        <div class="con"><img src="http://imgcache.qq.com/vipstyle/nr/box/img/add2qq-success.jpg"/></div>\r\n\
        <div class="btn-box">\r\n\
            <a href="#" class="btn-blue" id=\'add_wy_to_appbox_ok_success\'>确定</a>\r\n\
        </div>\r\n\
        <a class="close" href="#"></a>\r\n\
    </div>');

return __p.join("");
},

'fail': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <div class="add2qq" style="z-index:10003">\r\n\
        <div class="con"><img src="http://imgcache.qq.com/vipstyle/nr/box/img/add2qq-do-no-add.jpg"/></div>\r\n\
        <div class="btn-box">\r\n\
            <a href="#" class="btn-blue" id=\'add_wy_to_appbox_retry\' target="_blank">重新添加</a>\r\n\
            <a href="#" class="btn-gray" id=\'add_wy_to_appbox_next\'>以后添加</a>\r\n\
        </div>\r\n\
        <a class="close" href="#"></a>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
