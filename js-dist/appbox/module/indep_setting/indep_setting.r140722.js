//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/indep_setting/indep_setting.r140722",["lib","common","$"],function(require,exports,module){

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
//indep_setting/src/indep_setting.js
//indep_setting/src/indep_setting.tmpl.html

//js file list:
//indep_setting/src/indep_setting.js
/**
 *  独立密码设置框
 *  @date 2014-04-08
 *  @author hibincheng
 */
define.pack("./indep_setting",["lib","common","$","./tmpl"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        security = lib.get('./security'),
        cookie = lib.get('./cookie'),
        text = lib.get('./text'),

        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        Module = common.get('./module'),
        ret_msgs = common.get('./ret_msgs'),
        page_event = common.get('./global.global_event').namespace('page'),

        tmpl = require('./tmpl'),

        CMDS = { CREATE: 'PwdAdd', MODIFY: 'PwdModify', REMOVE: 'PwdDelete' },
        MSGS = { CREATE: '密码设置成功', MODIFY: '密码修改成功', REMOVE: '独立密码已删除' },
        ERRORS = {
            1024: '会话已超时，请重新登录后再尝试',
            1030: '独立密码签名已经超时，请重新验证',
            1031: function (type) {
                return type == 'MODIFY' ? '当前密码输入有误，请重新输入' : '您输入的密码有误，请重新输入';
            },
            1032: '新设置独立密码失败',
            1033: '删除独立密码失败',
            1034: '失败次数过多，独立密码已被锁定',
            1035: '独立密码不能与QQ密码相同',
            // 1106: '您修改密码的频率过快，请12小时后尝试',
            1107: '新密码不能和原密码相同',
            1108: '您尚未设置独立密码，请刷新页面后尝试',
            1109: '您修改密码的频率过快，请过12小时后尝试',
            1908: '您已设置了独立密码，请重新登录'
        },

        cookie_name_indep = 'indep',

        dialog,
        cur_opr, //当前操作类型

        undefined;

    var indep_setting = new Module('indep_setting', {

        render: function() {

        },

        do_submit: function(data) {
            var me = this,
                opr = this.get_cur_opr(),
                submit_data = {};

            switch(opr) {
                case 'MODIFY':
                    submit_data['old_pwd_md5'] = security.md5(data['cur_pwd']);
                    submit_data['new_pwd_md5'] = security.md5(data['new_pwd']);
                    //submit_data['new_password2'] = security.md5(data['confirm_new_pwd']);
                    break;
                case 'CREATE':
                    submit_data['pwd_md5'] = security.md5(data['new_pwd']);
                    //submit_data['password2'] = security.md5(data['confirm_new_pwd']);
                    break;
                case 'REMOVE':
                    submit_data['pwd_md5'] = security.md5(data['cur_pwd']);
                    break;
            }

            // md5 的密码
            var new_pwd = security.md5(data['new_pwd']) || '';

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: CMDS[opr],
                cavil: true,
                pb_v2: true,
                body: submit_data
            })
                .ok(function (msg) {
                    if (opr === 'MODIFY' || opr === 'CREATE') {
                        cookie.set(cookie_name_indep, new_pwd, {
                            domain: constants.MAIN_DOMAIN,
                            path: '/'
                        });
                    } else {
                        cookie.unset(cookie_name_indep, {
                            domain: constants.MAIN_DOMAIN,
                            path: '/'
                        });
                    }
                    me.on_set_success();

                    var has_pwd = opr !== 'REMOVE',

                    // 设置是否已设置独立密码
                        user = query_user.get_cached_user();

                    if (user) {
                        user.set_has_pwd(has_pwd);
                    }

                    // 更新锁图标
                    page_event.trigger(has_pwd ? 'set_indep_pwd' : 'unset_indep_pwd');
                })
                .fail(function (msg, ret) {
                    var errorText = ERRORS[ret];
                    if($.isFunction(errorText))
                        errorText = errorText(opr);
                    me.mark_error(errorText || msg, ret);
                });
        },

        submit: function() {
            var data = this.get_form_data();
            if(this.validate(data)) {
                this.do_submit(data);
            }
        },

        validate: function(data) {
            var opr = this.get_cur_opr(),
                err_field_name,
                err_msg;

            switch(opr) {
                case 'MODIFY':
                    if(!data['cur_pwd']) {
                        err_field_name = 'cur_pwd';
                        err_msg = '请输入原密码';
                    } else if(!data['new_pwd']) {
                        err_field_name = 'new_pwd';
                        err_msg = '请输入新密码';
                    } else if(data['new_pwd'].length < 6) {
                        err_field_name = 'new_pwd';
                        err_msg = '新密码长度不能小于6个字符'
                    } else if(data['new_pwd'] !== data['confirm_new_pwd']) {
                        err_field_name = 'confirm_new_pwd';
                        err_msg = '您两次输入的新密码不一致，请重新输入';
                    }
                    break;
                case 'REMOVE':
                    if(!data['cur_pwd']) {
                        err_field_name = 'cur_pwd';
                        err_msg = '请输入原密码';
                    }
                    break;
                case 'CREATE':
                    if(!data['new_pwd']) {
                        err_field_name = 'new_pwd';
                        err_msg = '请输入密码';
                    } else if(data['new_pwd'].length < 6) {
                        err_field_name = 'new_pwd';
                        err_msg = '密码长度不能小于6个字符'
                    } else if(data['new_pwd'] !== data['confirm_new_pwd']) {
                        err_field_name = 'confirm_new_pwd';
                        err_msg = '您两次输入的密码不一致，请重新输入';
                    }
                    break;
            }

            if(err_msg) {
                this.mark_error(err_msg, err_field_name);
                return false;
            }
            return true;
        },

        mark_error: function(err_msg, name_or_err_code) {
            var $el = dialog.get_$el(),
                opr = this.get_cur_opr();
            if($.isNumeric(name_or_err_code)) { //服务端验证错误
                if (opr == 'MODIFY') {  // 修改
                    // 原密码错误，则清空原密码
                    if (name_or_err_code == 1031) {
                        $el.find(':input[name=cur_pwd]').val('').focus();
                    }
                    // 新旧密码相同
                    else if (name_or_err_code == 1107) {
                        $el.find(':input[name=new_pwd]').val('').focus();
                    }
                }
                // 取消
                else if (opr == 'REMOVE') {
                    if (name_or_err_code == 1031) {
                        $el.find(':input[name=cur_pwd]').val('').focus();
                    }
                }
            } else {
                $el.find(':input[name='+name_or_err_code+']').focus();
            }

            $el.find('[data-id=err_msg]').text(err_msg).show();

        },

        on_set_success: function() {
            var msg = MSGS[this.get_cur_opr()];
            dialog.set_content(tmpl.success_tip({msg: msg}));
            dialog.set_button_visible('OK', false);
            dialog.set_button_visible('CANCEL', false);
            dialog.set_button_visible('CLOSE', true);
            dialog.focus_button('CLOSE');
        },

        get_form_data: function() {
            var $inputs = dialog.get_$el().find(':input'),
                data = {};
            $inputs.each(function(i, input) {
                var name = input.name;
                if(name) {
                    data[name] = $.trim($(input).val());
                }
            });

            return data;

        },

        create_dialog: function() {
            var me = this;
            var dialog = new widgets.Dialog({
                klass: 'full-pop-small',
                buttons: [
                    'OK',
                    'CANCEL',
                    { id: 'CLOSE', text: '关闭', klass: 'g-btn-gray', disabled: false, visible: false }
                ],
                handlers: {
                    OK: function () {
                        me.submit();
                    }
                }
            });
            dialog.render_if();
            var $dialog_con = dialog.get_$el();
            $dialog_con
                .on('click', '[data-action=switch_opr]', function(e) {
                    e.preventDefault();
                    var $target = $(this),
                        $parent = $target.parent(),
                        opr = $target.attr('data-opr');
                    if(opr === 'modify') {
                        $parent.children('[data-id=radio_modify]').addClass('checked');
                        $parent.children('[data-id=radio_remove]').removeClass('checked');
                        $dialog_con.find('[data-group=modify]').show();
                        $dialog_con.find('[data-id=err_msg]').hide();
                    } else if(opr === 'remove') {
                        $parent.children('[data-id=radio_modify]').removeClass('checked');
                        $parent.children('[data-id=radio_remove]').addClass('checked');
                        $dialog_con.find('[data-group=modify]').hide();
                        $dialog_con.find('[data-id=err_msg]').hide();
                    }

                    me.fix_focus();

                    me.set_cur_opr(opr.toUpperCase());
                });
            return dialog;
        },

        get_dialog: function(is_modify) {
            if(dialog) {
                dialog.destroy();
            }
            dialog = this.create_dialog();

            if(is_modify) {
                this.set_cur_opr('MODIFY');
                dialog.set_content(tmpl.modify());
                dialog.set_title('管理独立密码');
            } else { //create
                this.set_cur_opr('CREATE');
                dialog.set_content(tmpl.create());
                dialog.set_title('设置独立密码');
            }

            return dialog;
        },

        set_cur_opr: function(opr) {
            cur_opr = opr;
        },

        get_cur_opr: function() {
            return cur_opr;
        },

        show: function() {
            var user = query_user.get_cached_user();
            if(!user) { //should login
                return;
            }
            this
                .get_dialog(user.has_pwd())
                .show();

            this.fix_focus();
        },

        hide: function() {
            dialog && dialog.hide();
        },

        /**
         * 聚焦到输入框内方便输入
         */
        fix_focus: function() {
            //聚焦在第一个输入框
            setTimeout(function() {
                dialog.get_$el().find(':input').first().focus();
            },0);
        }
    });

    return indep_setting;
});
//tmpl file list:
//indep_setting/src/indep_setting.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'create': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var pwd_max_len = 16;
    __p.push('    <div class="token-pass"><div class="pass-inner pass-add">\r\n\
        <ul class="err">\r\n\
            <li class="list"><label class="label">输入独立密码</label><input name="new_pwd" class="input" type="password" maxlength="');
_p(pwd_max_len);
__p.push('"></li>\r\n\
            <li class="list"><label class="label">确认密码</label><input name="confirm_new_pwd" class="input" type="password" maxlength="');
_p(pwd_max_len);
__p.push('"></li>\r\n\
            <li class="msg-box"><label class="label label-place"></label><span data-id="err_msg" class="msg"></span></li>\r\n\
        </ul>\r\n\
    </div></div>\r\n\
');

return __p.join("");
},

'modify': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var pwd_max_len = 16;
    __p.push('    <div class="token-pass">\r\n\
        <div class="pass-inner pass-change">\r\n\
            <ul class="err">\r\n\
                <li class="list check-box">\r\n\
                    <label class="label label-place"></label><i data-opr="modify" data-id="radio_modify" data-action="switch_opr" class="ico-radio checked"></i><span data-opr="modify" data-action="switch_opr">更改密码</span><i data-opr="remove" data-id="radio_remove" class="ico-radio" data-action="switch_opr"></i><span data-opr="remove" data-action="switch_opr">删除密码</span>\r\n\
                </li>\r\n\
                <li class="list"><label class="label">输入当前密码</label><input name="cur_pwd" class="input" type="password" maxlength="');
_p(pwd_max_len);
__p.push('"></li>\r\n\
                <li data-group="modify" class="list"><label class="label">填写新密码</label><input name="new_pwd" class="input" type="password" maxlength="');
_p(pwd_max_len);
__p.push('"></li>\r\n\
                <li data-group="modify" class="list"><label class="label">确认新密码</label><input name="confirm_new_pwd" class="input" type="password" maxlength="');
_p(pwd_max_len);
__p.push('"></li>\r\n\
                <li class="msg-box"><label class="label label-place"></label><span class="msg" data-id="err_msg"></span></li>\r\n\
            </ul>\r\n\
        </div>\r\n\
    </div>\r\n\
');

return __p.join("");
},

'success_tip': function(data){

var __p=[],_p=function(s){__p.push(s)};
with(data||{}){
__p.push('    <div class="token-pass">\r\n\
        <div class="pass-inner pass-success">\r\n\
            <i class="ico"></i>\r\n\
            <h4 class="title">');
_p( data.msg);
__p.push('</h4>\r\n\
        </div>\r\n\
    </div>');

}
return __p.join("");
}
};
return tmpl;
});
