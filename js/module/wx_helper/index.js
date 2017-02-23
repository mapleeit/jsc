//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js/module/wx_helper/index",["lib","common","$"],function(require,exports,module){

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
//wx_helper/src/wx_helper.js
//wx_helper/src/wx_helper.tmpl.html

//js file list:
//wx_helper/src/wx_helper.js
/**
 * 微信助手模块
 * @jackbinwu 02/05/2013
 */
define.pack("./wx_helper",["lib","common","$","./tmpl"],function (require, exports, module) {

    var weixin = {},
        lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        url_parser = lib.get('./url_parser');

    /*{{{ 绑定QQ号码 */
    weixin.bind_qq = function(){

        var _url = url_parser.get_cur_url(),
            _id = _url.get_param('id'),
            _cgi_url = [
                'http://wx.cgi.weiyun.com/mapuser.fcg?',
                'cmd=set&id=' + encodeURIComponent(_id)
            ].join('');

        //发送请求
        $.ajax({
            type: "get",
            url: _cgi_url,
            dataType: "jsonp",
            success: function(data) {

                $('#result_bind_qq').attr('class', 'app-inner response');

                if('undefined' != typeof(data.ret) && data.ret == 0){
                    $('#result_bind_qq .ui-title').html(
                        '<i class="icon-ok"></i>帐号绑定成功'
                    );
                }else{
                    $('#result_bind_qq .ui-title').html(
                        '<i class="icon-error"></i>帐号绑定失败'
                    );
                }
            }
        });
    };
    /* }}} */

    /*{{{ 获取最近收藏文章列表 */
    weixin.list = function(){

        var template = lib.get('./template'),
            html = require('./tmpl');

        //常量定义
        var _CST_CMD_GET_ARTICLE_LIST = 'get_article_list',
            _CST_CMD_GET_CHAT_LIST = 'get_chat_list',
            _CST_CMD_GET_FILE_LIST = 'get_file_list';

        //相应错误码，错误信息
        var _CST_MSG = {
            '-1' : '暂时无法访问，请稍后重试',
            '-2' : '删除失败，请稍后重试',
            '10000' : '登录态已经过期，请您重新在微信内输入"0"进行激活', //sid失效
            '10001' : '暂时无法访问，请稍后重试', //参数错误
            '10002' : '暂时无法访问，请稍后重试', //服务器内部错误
            '10005' : '暂时无法访问，请稍后重试', //访问第三方拉列表错误
        };

        //获取GET参数
        var _url = url_parser.get_cur_url(),
            _g_id = _url.get_param('id'),
            _g_sid = _url.get_param('sid'),
            _g_cmd = _url.get_param('cmd');

        //列表请求公共处理部分
        var _request_handle = function(offset, per_num, cb_suc){

            var _cgi_url = [
                'http://wx.cgi.weiyun.com/weixin_push.fcg?',
                'cmd='+_g_cmd, '&',
                'id='+_g_id, '&',
                'sid='+_g_sid, '&',
                'pos={POS}', '&',
                'count={COUNT}'
            ].join('');

            //发送请求
            $.ajax({
                type: "post",
                url: _cgi_url.replace(/(\{\w+\})/g, function(w){
                    var _map = {'{POS}' : offset, '{COUNT}' : per_num};
                    return _map[w];}),
                dataType: "jsonp",
                success: $.isFunction(cb_suc) ? cb_suc : function(){}
            });

        };

        /* {{{ 让元素垂直居中 */
        var _to_center = function(obj){

            var _W_H = $(window).height(), //浏览器可视区域高度
                _W_W = $(window).width();  //浏览器可视区域宽度

            var _E_H = obj.outerHeight(),        //元素高度
                _E_W = obj.outerWidth();         //元素宽度

            var _top = (_W_H - _E_H) > 0 ? (_W_H - _E_H)/2 : 0;
                _top += $(window).scrollTop();

            var _left = (_W_W - _E_W) > 0 ? (_W_W - _E_W)/2 : 0;

            obj.css({
                position : 'absolute',
                margin : 0,
                top : _top,
                left : _left
            });

        }
        /* }}} */

        /* {{{ loading显示控制 */
        var _show_loading = function(){ //显示
            var _el_loading = $('#view_loading');
            _el_loading.show();
            _to_center(_el_loading);
        };

        var _hide_loading = function(){ //隐藏
            $('#view_loading').hide();
        };
        /* }}} */

        /* {{{ 显示错误信息 */
        var _show_msg = function(msg, type){
            _hide_loading();
            if(0 == type){
                $('#view_message').attr('class', 'app-inner response');
                $('#view_message .ui-title').html([
                    '<i class="icon-error"></i>', msg
                ].join(''));
            }else{
                alert(msg);
            }
        };
        /* }}} */

        /* {{{ 获取最近收藏文章列表 */
        var _get_article_list = function(){

            var _cst_per_num = 5; //< 每页记录条数

            _show_loading();
            $('#view_article_list').show();
            //document.title = "最近收藏文章";

            //type为0代表第一次展示，1代表点击更多加载
            var _handle = function(json, type){

                //相关DOM元素
                var _el_empty = $('#view_article_list p'),
                    _el_list = $('#view_article_list ul'),
                    _el_more = $('#view_article_list div.app-footer');

                _hide_loading();

                if(0 == json.ret){

                    var _total = json.total,
                        _pos = json.pos,
                        _data = json.data!=null?json.data:[],
                        _num = _data.length;

                    if(_num > 0){
                        var tmpl_list = template.compile(html.article_list())({items:_data});
                        _el_list.append(tmpl_list);
                        if(0 == type){
                            _el_empty.hide();
                            _el_list.show();
                        };
                    }else{
                        if(0 == type){
                            _el_empty.show();
                            _el_list.hide();
                        }
                    };

                    //绑定更多按钮事件
                    if(_num < _cst_per_num/* 返回的数量小于每页数量时 */ ||
                        _pos+_cst_per_num == _total /* 正好返回最后一整页时 */){
                        _el_more.hide();
                    }else{ //< 符合显示更多事件的时候
                        _el_more.show();
                        _el_more.unbind('click.Evt_wx_helper_more').bind('click.Evt_wx_helper_more',function(e){
                            _show_loading();
                            _request_handle(_pos+_num, _cst_per_num, function(json){
                                _handle(json, 1); //< 下一页
                            });
                        });
                    }

                }else if('undefined' != typeof(_CST_MSG[json.ret])){
                    _show_msg(_CST_MSG[json.ret], type);
                }else{
                    _show_msg(_CST_MSG[-1], type);
                }

            };

            //第一遍加载
            _request_handle(0, 5/*首屏获取5条*/, function(json){

                _hide_loading();
                _handle(json, 0); //< 首页加载

            });
        };
        /* }}} */

        /* 获取保存的聊天记录信息 */
        var _get_chat_list = function(){

            var _cst_per_num = 5; //< 每页记录条数

            _show_loading();
            $('#view_chat_list').show();
            //document.title = "最近保存聊天信息";

            //type为0代表第一次展示，1代表点击更多加载
            var _handle = function(json, type){

                //相关DOM元素
                var _el_empty = $('#view_chat_list p'),
                    _el_list = $('#view_chat_list ul'),
                    _el_more = $('#view_chat_list div.app-footer');

                _hide_loading();

                if(0 == json.ret){

                    var _total = json.total,
                        _pos = json.pos,
                        _data = json.data!=null?json.data:[],
                        _num = _data.length;


                    /* {{{ 这里临时特殊处理，语音暂不显示 */
                    var _tmp_data = [];
                    for (var i = _data.length - 1; i >= 0; i--) {
                        if(1 != _data[i].type){
                            _total--; //< 总记录条数--
                        }else{
                            _tmp_data.push(_data[i]);
                        }
                    };

                    _data = _tmp_data;
                    _num = _data.length;
                    /* }}} */

                    if(_num > 0){
                        var tmpl_list = template.compile(html.chat_list())({items:_data, require : require});
                        _el_list.append(tmpl_list);
                        if(0 == type){
                            _el_empty.hide();
                            _el_list.show();
                        };
                    }else{
                        if(0 == type){
                            _el_empty.show();
                            _el_list.hide();
                        }
                    };

                    //绑定更多按钮事件
                    if(_num < _cst_per_num/* 返回的数量小于每页数量时 */ ||
                        _pos+_cst_per_num == _total /* 正好返回最后一整页时 */){
                        _el_more.hide();

                    }else{ //< 符合显示更多事件的时候
                        _el_more.show();
                        _el_more.unbind('click.Evt_wx_helper_more').bind('click.Evt_wx_helper_more',function(e){
                            _show_loading();
                            _request_handle(_pos+_num, _cst_per_num, function(json){
                                _handle(json, 1); //< 下一页
                            });
                        });
                    }

                }else if('undefined' != typeof(_CST_MSG[json.ret])){
                    _show_msg(_CST_MSG[json.ret], type);
                }else{
                    _show_msg(_CST_MSG[-1], type);
                }

            };

            //第一遍加载
            _request_handle(0, 5/*首屏获取5条*/, function(json){

                _hide_loading();
                _handle(json, 0); //< 首页加载

            });

            /* {{{ 展开更多的事件绑定 */
            $('#view_chat_list ul').click(function(event){

                var _el_evt = $(event.target),
                    _el_more = $('#view_chat_list div.app-footer');

                if(_el_evt.is("div.ui-more a")){

                    var _el = _el_evt.parent().parent();

                    _el.find('._smalltext').hide();
                    _el.find('._fulltext').show();
                    _el_evt.parent().hide();

                }
            });
            /* }}} */
        };
        /* }}} */

        /* 获取最近文件列表 */
        var _get_file_list = function(){

            var _cst_per_num = 5; //< 每页记录条数

            _show_loading();
            $('#view_file_list').show();
            //document.title = "最近文件";

            //type为0代表第一次展示，1代表点击更多加载
            var _handle = function(json, type){

                //相关DOM元素
                var _el_empty = $('#view_file_list p'),
                    _el_list = $('#view_file_list ul'),
                    _el_more = $('#view_file_list div.app-footer');

                _hide_loading();

                if(0 == json.ret){

                    var _total = json.total,
                        _pos = json.pos,
                        _data = json.data!=null?json.data:[],
                        _num = _data.length;

                    if(_num > 0){
                        var tmpl_list = template.compile(html.file_list())({items:_data, common:common});
                        _el_list.append(tmpl_list);
                        if(0 == type){
                            _el_empty.hide();
                            _el_list.show();
                        };
                    }else{
                        if(0 == type){
                            _el_empty.show();
                            _el_list.hide();
                        }
                    };

                    //绑定更多按钮事件
                    if(_num < _cst_per_num/* 返回的数量小于每页数量时 */ ||
                        _pos+_cst_per_num >= 15 /* 只显示15条记录信息，超过的话 */){
                        _el_more.unbind('click.Evt_wx_helper_more').find('span').html("下载微云客户端");
                        _el_more.find('a').attr('href', 'http://www.weiyun.com/d')
                    }else{ //< 符合显示更多事件的时候
                        _el_more.show();
                        _el_more.unbind('click.Evt_wx_helper_more').bind('click.Evt_wx_helper_more',function(e){
                            _show_loading();
                            _request_handle(_pos+_num, _cst_per_num, function(json){
                                _handle(json, 1); //< 下一页
                            });
                        });
                    }

                }else if('undefined' != typeof(_CST_MSG[json.ret])){
                    _show_msg(_CST_MSG[json.ret], type);
                }else{
                    _show_msg(_CST_MSG[-1], type);
                }

            };

            //第一遍加载
            _request_handle(0, 5/*首屏获取5条*/, function(json){

                _hide_loading();
                _handle(json, 0); //< 首页加载

            });
        };
        /* }}} */

        /* {{{ 初始化 */
        var _init = (function(){
            switch(_g_cmd){
                case _CST_CMD_GET_ARTICLE_LIST:
                    _get_article_list();
                    break;
                case _CST_CMD_GET_CHAT_LIST:
                    _get_chat_list();
                    break;
                case _CST_CMD_GET_FILE_LIST:
                    _get_file_list();
                    break;
                default:
                    break;
            }
        })();
        /* }}} */

    };
    /* }}} */

    module.exports = weixin;
});
//tmpl file list:
//wx_helper/src/wx_helper.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'article_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    [#\r\n\
    if(items && items.length) {\r\n\
        $.each(items, function(i, item){\r\n\
            var ctime = item.ctime,\r\n\
                desc = item.desc,\r\n\
                link = item.link,\r\n\
                msgid = item.msgid,\r\n\
                title = item.title;\r\n\
    #]\r\n\
    <li class="item">\r\n\
        <div class="ui-btns">\r\n\
            <span class="date-text">[#= ctime #]</span>\r\n\
            <!--\r\n\
            <a href="" class="ui-btn del">删除</a>\r\n\
            -->\r\n\
        </div>\r\n\
        <a class="summary" href="[#= link #]">\r\n\
            <h3 class="ui-title">[#= title #]</h3>\r\n\
            <p class="ui-text">[#= desc #]</p>\r\n\
        </a>\r\n\
    </li>\r\n\
    [#\r\n\
        });\r\n\
    }\r\n\
    #]');

return __p.join("");
},

'chat_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    [#\r\n\
    if(items && items.length) {\r\n\
        for (var i = items.length - 1; i >= 0; i--) {\r\n\
\r\n\
            var cst_len = 60;\r\n\
\r\n\
            var item = items[i];\r\n\
            var ctime = item.ctime,\r\n\
                type = item.type,\r\n\
                msgid = item.msgid,\r\n\
                content = item.content;\r\n\
\r\n\
            var _tmp_cnt = content;\r\n\
            var _flag_cnt_len = false;\r\n\
\r\n\
            if(content.length > cst_len){\r\n\
                _flag_cnt_len = true;\r\n\
                _tmp_cnt = [content.substr(0, cst_len), \'...\'].join(\'\');\r\n\
            }\r\n\
\r\n\
            content = item.content.replace(\r\n\
                /\'/g, \'&#039;\').replace(\r\n\
                /"/g, \'&quot;\').replace(\r\n\
                /</g, \'&lt;\').replace(\r\n\
                />/g, \'&gt;\').replace(\r\n\
                /&/g, \'&amp;\');\r\n\
    #]\r\n\
    <li class="item">\r\n\
        <div class="ui-btns">\r\n\
            <span class="date-text">[#= ctime #]</span>\r\n\
           <!--\r\n\
            <a href="" class="ui-btn del">删除</a>\r\n\
            -->\r\n\
        </div>\r\n\
        <div class="weixin">\r\n\
            <div class="ui-text _smalltext">\r\n\
                [#= _tmp_cnt #]\r\n\
            </div>\r\n\
            <div class="ui-text _fulltext hide">\r\n\
                [#= content #]\r\n\
            </div>\r\n\
            [# if(_flag_cnt_len){ #]\r\n\
                <div class="ui-more">\r\n\
                    <a href="javascript:void(0)">点击展开</a>\r\n\
                </div>\r\n\
            [# } #]\r\n\
        </div>\r\n\
    </li>\r\n\
    [#\r\n\
        };\r\n\
    };\r\n\
    #]');

return __p.join("");
},

'file_list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    [#\r\n\
    if(items && items.length) {\r\n\
\r\n\
       var file = common.get(\'./file.file_object\');\r\n\
\r\n\
        $.each(items, function(i, item){\r\n\
            var ctime = item.ctime,\r\n\
                fileid = item.fileid,\r\n\
                outlink = item.outlink,\r\n\
                pdirkey = item.pdirkey,\r\n\
                filename = item.filename,\r\n\
                filetype = file.get_type(filename, false);\r\n\
\r\n\
                filetype = (filetype == \'file\' || filetype ==\'\') ? \'unknow\' : filetype;\r\n\
    #]\r\n\
    <li class="item">\r\n\
        <a href="[#= outlink #]" style="text-decoration:none;">\r\n\
            <span class="img">\r\n\
                <i class="filetype icon-[#= filetype #]"></i>\r\n\
            </span>\r\n\
            <h3 class="ui-title">[#= filename #]</h3>\r\n\
            <span class="ui-text">[#= ctime #]</span>\r\n\
            <!--\r\n\
            <a href="#">删除</a>\r\n\
            -->\r\n\
        </a>\r\n\
    </li>\r\n\
    [#\r\n\
        });\r\n\
    }\r\n\
    #]');

return __p.join("");
}
};
return tmpl;
});
