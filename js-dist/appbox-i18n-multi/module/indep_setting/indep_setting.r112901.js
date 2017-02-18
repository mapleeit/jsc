//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox-i18n-multi/module/indep_setting/indep_setting.r112901",["lib","common","$","i18n"],function(require,exports,module){

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
// 独立密码设置框
define.pack("./indep_setting",["lib","common","$","./tmpl","i18n"],function (require, exports, module) {
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

        _ = require('i18n').get('./pack'),
        l_key = 'indep_setting',


        CMDS = { CREATE: 'pwd_add', CHANGE: 'pwd_modify', CANCEL: 'pwd_del' },
        TITLES = { CREATE: _(l_key,'新设置密码'), CHANGE: _(l_key,'管理密码'), CANCEL: _(l_key,'管理密码') },
        MSGS = { CREATE: _(l_key,'密码设置成功'), CHANGE: _(l_key,'密码修改成功'), CANCEL: _(l_key,'独立密码已删除') },
        ERRORS = {
            1024: _(l_key,'会话已超时，请重新登录后再尝试'),
            1030: _(l_key,'独立密码签名已经超时，请重新验证'),
            1031: function (type) {
                return type == 'CHANGE' ? _(l_key,'当前密码输入有误，请重新输入') : _(l_key,'您输入的密码有误，请重新输入');
            },
            1032: _(l_key,'新设置独立密码失败'),
            1033: _(l_key,'删除独立密码失败'),
            1034: _(l_key,'失败次数过多，独立密码已被锁定'),
            1035: _(l_key,'独立密码不能与QQ密码相同'),
            // 1106: '您修改密码的频率过快，请12小时后尝试',
            1107: _(l_key,'新密码不能和原密码相同'),
            1108: _(l_key,'您尚未设置独立密码，请刷新页面后尝试'),
            1109: _(l_key,'您修改密码的频率过快，请过12小时后尝试'),
            1908: _(l_key,'您已设置了独立密码，请重新登录')
        },

        cookie_name_indep = 'indep',

        tpl_error_tip = '<div class="-tip ui-form-tips" style="display:none;"><i class="ui-icon"></i>{msg}</div>',

        undefined;

    var indep_setting = new Module('indep_setting', {

        render: function () {

            if (!dialog) {
                var me = this;

                var $el = $(tmpl.indep_setting()),
                    $form_div = this._$form = $el.children('.-form'),
                    $msg = this._$msg = $el.children('._msg'),

                    $switchers = this._$switchers = $('input[data-switch]', $form_div),
                    $groups = this._$groups = $('>[data-group-type]', $form_div),

                    dialog = this._dialog = new widgets.Dialog({
                        klass: 'tokenbox',
                        title: _(l_key,'管理密码'),
                        content: $el,
                        buttons: [
                            'OK',
                            'CANCEL',
                            { id: 'CLOSE', text: _(l_key,'关闭'), klass: 'ui-btn-cancel', disabled: false, visible: false }
                        ],
                        handlers: {
                            OK: function () {
                                submit();
                            }
                        }
                    });

                dialog
                    .on('hide', function () {
                        // 清空输入域
                        $('input[type=password]', $form_div).val('');

                        $form_div.show();
                        // 隐藏提示文本
                        $msg.css({ display: 'none', visibility: 'hidden' }).empty(); // 这里本来 .show() 就可以了，但在IE6下display:none仍然可见，没有找到原因
                    })
                    .on('show', function () {
                        me._get_$cur_group().find(':password:first').focus();
                        dialog.set_button_visible('OK', true);
                        dialog.set_button_visible('CANCEL', true);
                        dialog.set_button_visible('CLOSE', false);
                    });

                // 提交
                var submit = function () {
                    var data = getData(),
                        type = me._current_type,
                        $firstErrorField = null,
                        $group = getGroup(),
                        $inputs = $group.find('input[type=password]');

                    // 暂时只显示第一个错误消息
                    $inputs.each(function (i, input) {
                        var $input = $(input);
                        var err = $input.data('$check').apply($input);
                        if (err) {
                            $firstErrorField = $input;
                            return false;
                        }
                    });
                    if ($firstErrorField) {
                        $firstErrorField.trigger('focus', true);
                        return;
                    }

                    for (var prop in data) {
                        data[prop] = security.md5(data[prop]);
                    }

                    // md5 的密码
                    var new_pwd = data[ {CREATE: 'password', CHANGE: 'new_password'}[type] ] || '';

                    request.post({
                        cmd: CMDS[type],
                        body: data
                    })
                        .ok(function (msg) {
                            if (type === 'CHANGE' || type === 'CREATE') {
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
                            me._tip(type);

                            var has_pwd = type !== 'CANCEL',

                            // 设置是否已设置独立密码
                                user = query_user.get_cached_user();

                            if (user) {
                                user.set_has_pwd(has_pwd);
                            }

                            // 更新锁图标
                            page_event.trigger(has_pwd ? 'set_indep_pwd' : 'unset_indep_pwd');
                        })
                        .fail(function (msg, ret) {
                            fix_focus(type, ret, $inputs);
                            var errorText = ERRORS[ret];
                            if($.isFunction(errorText))
                                errorText = errorText(type);
                            me._err_tip(errorText || msg);
                        });
                };


                // 字段校验配置
                (function () {
                    // 新设置密码的字段
                    var $create = $groups.filter('[data-group-type=CREATE]'),
                        $create_password = $('[name=password]', $create),    // 新密码
                        $create_password2 = $('[name=password2]', $create),    // 确认新密码

                    // 修改密码的字段
                        $change = $groups.filter('[data-group-type=CHANGE]'),
                        $change_oldPassword = $('[name=old_password]', $change),    // 原密码
                        $change_newPassword = $('[name=new_password]', $change),    // 新密码
                        $change_newPassword2 = $('[name=new_password2]', $change),    // 确认新密码

                    // 取消密码的字段
                        $cancel = $groups.filter('[data-group-type=CANCEL]'),
                        $cancel_password = $('[name=password]', $cancel);    // 原密码

                    var
                        base_check = function ($field, err, on_error) {
                            if (err) {
                                $field.trigger('$error', err);
                                if ($.isFunction(on_error))
                                    on_error.call($field);
                                return err;
                            } else {
                                $field.trigger('$clear');
                            }
                        },

                    // --新设置密码的字段-----------------------------------------------------------------------------------
                        check_$create_password = function (e, on_error) {
                            var $field = $(this), val = $field.val(), err;
                            if (!val)
                                err = _(l_key,'请输入密码');
                            else if (val.length < 6)
                                err = _(l_key,'密码长度不能小于6个字符');
                            return base_check($field, err, on_error);
                        },

                        check_$create_password2 = function (e, on_error) {
                            var $field = $(this), val = $field.val(), err;
                            if ($create_password.val() != val) {
                                err = _(l_key,'您两次输入的密码不一致，请重新输入');
                            }
                            return base_check($field, err, on_error);
                        },

                    // --修改密码的字段------------------------------------------------------------------------------------
                        check_$change_oldPassword = function (e, on_error) {
                            var $field = $(this), val = $field.val(), err;
                            if (!val)
                                err = _(l_key,'请输入原密码');
                            return base_check($field, err, on_error);
                        },

                        check_$change_newPassword = function (e, on_error) {
                            var $field = $(this), val = $field.val(), err;
                            if (!val)
                                err = _(l_key,'请输入新密码');
                            else if (val.length < 6)
                                err = _(l_key,'新密码长度不能小于6个字符');
                            return base_check($field, err, on_error);
                        },

                        check_$change_newPassword2 = function (e, on_error) {
                            var $field = $(this), val = $field.val(), err;
                            if (val != $change_newPassword.val())
                                err = _(l_key,'两次输入的密码不一致');
                            return base_check($field, err, on_error);
                        },

                    // --取消密码的字段------------------------------------------------------------------------------------
                        check_$cancel_password = function (e, on_error) {
                            var $field = $(this), val = $field.val(), err;
                            if (!val)
                                err = _(l_key,'请输入原密码');
                            return base_check($field, err, on_error);
                        };

                    // ------------------------------------------------------------------------------------------------
                    $create_password.bind('$check', check_$create_password).data('$check', check_$create_password);
                    $create_password2.bind('$check', check_$create_password2).data('$check', check_$create_password2);
                    $change_oldPassword.bind('$check', check_$change_oldPassword).data('$check', check_$change_oldPassword);
                    $change_newPassword.bind('$check', check_$change_newPassword).data('$check', check_$change_newPassword);
                    $change_newPassword2.bind('$check', check_$change_newPassword2).data('$check', check_$change_newPassword2);
                    $cancel_password.bind('$check', check_$cancel_password).data('$check', check_$cancel_password);
                    // ------------------------------------------------------------------------------------------------

                    $.each([$create_password,
                        $create_password2,
                        $change_oldPassword,
                        $change_newPassword,
                        $change_newPassword2,
                        $cancel_password], function (i, $field) {

                        $field.bind({
                            // 目前只显示一条错误消息
                            $error: function (e, err) {
                                var $field = $(this),
                                    $lastField = $field.parent().parent().children('.ui-form-item').filter(':last'),
                                    $tip = $lastField.children('.-tip'),
                                    errTip = $(text.format(tpl_error_tip, { msg: err})),
                                    $errTip = $(errTip);

                                if ($tip[0]) {
                                    $tip.replaceWith($errTip);
                                } else {
                                    $lastField.append($errTip);
                                }
                                $errTip.slideDown('fast');
                            },
                            $clear: function () {
                                $(this).siblings('.-tip').slideUp('fast', function () {
                                    $(this).remove();
                                });
                            }
                        });
                    });

                    // 字段错误触发
                    /*
                     // 应erric要求，暂时先不使用这种方式
                     $all_inputs.bind({
                     focus: function(e, isAuto){
                     if(!isAuto)
                     $(this).trigger('$clear', $.noop);
                     },
                     blur: function(){
                     $(this).trigger('$check', $.noop);
                     }
                     });*/
                })();


                // 切换类型
                $form_div.find(':radio').on('change', function () {
                    var type = $switchers.filter(':checked').attr('data-switch');   // 找出选中的data-switch -> 可能的值为 CHANGE, CANCEL
                    me.switch_type(type);
                });

                // label hack
                $form_div.on('click', 'label', function () {
                    var $label = $(this);
                    $label.siblings(':radio').attr('checked', 'checked').trigger('change');
                    $label.siblings(':password, :text').focus();
                });

                // 获取当前选中的分组
                var getGroup = function (type) {
                    return $groups.filter('[data-group-type=' + (type || me._current_type) + ']');
                };

                // 获取内容
                var getData = function () {
                    var data = {};
                    getGroup().children('.ui-form-item').each(function (i, field) {     // 取得可见字段的值
                        var ipt = $('input', field);
                        data[ipt.attr('name')] = ipt.val();
                    });
                    return data;
                };

                var fix_focus = function (type, ret, $inputs) {
                    var focusEl;
                    // 修改密码失败时
                    if (type == 'CHANGE') {  // 修改
                        // 原密码错误，则清空原密码
                        if (ret == 1031) {
                            focusEl = $inputs.eq(0).val('');
                        }
                        // 新旧密码相同
                        else if (ret == 1107) {
                            focusEl = $inputs.filter(':gt(0)').val('').eq(0);
                        }
                    }
                    // 取消
                    else if (type == 'CANCEL') {
                        if (ret == 1031) {
                            focusEl = $inputs.eq(0).val('');
                        }
                    }
                    focusEl && focusEl.trigger('focus', true);
                };
            }
        },

        show: function () {
            var me = this;

            me.render();

            var user = query_user.get_cached_user();

            if(user) {
                var has_pwd = user.has_pwd();

                me.switch_type(has_pwd ? 'CHANGE' : 'CREATE');
                me._dialog.show();
            }
        },

        hide: function () {
            if (this._$form) {
                this._$form.trigger('on_hide');
            }
        },

        // 切换操作【创建、修改、取消】
        switch_type: function (type) {
            var me = this;

            me._current_type = type;

            // 隐藏所有字段
            me._$groups.hide();
            var $group = me._$groups.filter('[data-group-type=' + type + ']').show();

            me._$switchers
                .filter('[data-switch=' + type + ']')
                .attr('checked', 'checked');    // 选中radiobox

            me._$switchers.parent().hide();

            me._dialog.set_title(TITLES[type]);

            if (type == 'CHANGE' || type == 'CANCEL') {
                $.each(['CHANGE', 'CANCEL'], function (i, type) {
                    me._$switchers.filter('[data-switch=' + type + ']').parent().show();
                });
            }
            // 调整窗口高度
            me._dialog.set_height({CREATE: 220, CHANGE: 260, CANCEL: 260}[type]);

            // 默认焦点
            $group.find('input[type=password]:first').trigger('focus', true);
            // 清空错误消息和已输入的文本
            $('div.-tip', me._$form).remove();
        },

        /**
         * 提示消息
         * @param type 操作类型，根据该type取消息标题和描述
         */
        _tip: function (type) {
            var me = this,
                title = TITLES[type],
                msg = MSGS[type],
                dialog = me._dialog,
                $msg = me._$msg,
                isOK = true;

            me._$form.hide();

            $msg.html(['<i class="', (isOK ? 'ui-icon-ok' : 'ui-icon-warn'), '"></i><h4 class="-title ui-title ui-title-text">', msg, '</h4>'].join(''))
            $msg.css({ display: '', visibility: '' }); // 这里本来 .show() 就可以了，但在IE6下display:none仍然可见，没有找到原因

            dialog.set_title(title);

            // 按钮
            dialog.set_button_visible('OK', false);
            dialog.set_button_visible('CANCEL', false);
            dialog.set_button_visible('CLOSE', true);
            dialog.focus_button('CLOSE');

            // 调整消息的位置
            $msg.css({
                marginTop: (dialog.get_height() - $msg.height() - 70) / 2 + 'px'
            });
        },

        /**
         * 错误提示
         * @param {String} err
         */
        _err_tip: function (err) {
            var $field = this._get_$cur_group().children('.ui-form-item:last'),
                $err_tip = $(text.format(tpl_error_tip, { msg: err}));

            $field.children('.-tip').remove();
            $field.append($err_tip);
            $err_tip.slideDown('fast');
        },

        _get_$group: function (type) {
            return this._$groups.filter('[data-group-type="' + type + '"]');
        },

        _get_$cur_group: function () {
            return this._get_$group(this._current_type);
        }

    });

    return indep_setting;
});
//tmpl file list:
//indep_setting/src/indep_setting.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'indep_setting': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

    var pwd_max_len = 16,
        _ = require('i18n').get('./pack'),
        l_key = 'indep_setting';
    __p.push('    <div>\r\n\
        <div class="-form ui-form">\r\n\
            <div class="ui-form-row">\r\n\
                <span class="token-modify-radio">\r\n\
                    <input type="radio" class="ui-radio" name="switcher" id="pwd_box_switch_create" data-switch="CREATE" style="opacity:0.99;" data-test="123"/>\r\n\
                    <label class="ui-radio-text">');
_p(_(l_key,'新设置密码'));
__p.push('</label>\r\n\
                </span>\r\n\
                <span class="token-modify-radio">\r\n\
                    <input type="radio" class="ui-radio" name="switcher" id="pwd_box_switch_change" data-switch="CHANGE" style="opacity:0.99;" data-test="123"/>\r\n\
                    <label class="ui-radio-text">');
_p(_(l_key,'更改密码'));
__p.push('</label>\r\n\
                </span>\r\n\
                <span class="token-cancel-radio">\r\n\
                    <input type="radio" class="ui-radio" name="switcher" id="pwd_box_switch_cancel" data-switch="CANCEL" style="opacity:0.99;" data-test="123"/>\r\n\
                    <label class="ui-radio-text">');
_p(_(l_key,'删除密码'));
__p.push('</label>\r\n\
                </span>\r\n\
            </div>\r\n\
\r\n\
            <!--// 创建密码需要这两个字段-->\r\n\
            <div class="ui-form-group" data-group-type="CREATE" style="margin-top:0;padding-top:20px;">\r\n\
                <div class="ui-form-item">\r\n\
                    <label class="ui-label">');
_p(_(l_key,'填写您的密码'));
__p.push('</label>\r\n\
                    <input type="password" name="password" class="ui-input" maxlength="');
_p(pwd_max_len);
__p.push('"/>\r\n\
                </div>\r\n\
                <div class="ui-form-item password-item">\r\n\
                    <label class="ui-label">');
_p(_(l_key,'确定密码'));
__p.push('</label>\r\n\
                    <input type="password" name="password2" class="ui-input" maxlength="');
_p(pwd_max_len);
__p.push('"/>\r\n\
                </div>\r\n\
            </div>\r\n\
\r\n\
            <!--// 修改密码所需的三个字段-->\r\n\
            <div class="ui-form-group" data-group-type="CHANGE">\r\n\
                <div class="ui-form-item">\r\n\
                    <label class="ui-label">');
_p(_(l_key,'填写当前密码'));
__p.push('</label>\r\n\
                    <input type="password" name="old_password" class="ui-input" maxlength="');
_p(pwd_max_len);
__p.push('"/>\r\n\
                </div>\r\n\
                <div class="ui-form-item">\r\n\
                    <label class="ui-label">');
_p(_(l_key,'填写新密码'));
__p.push('</label>\r\n\
                    <input type="password" name="new_password" class="ui-input" maxlength="');
_p(pwd_max_len);
__p.push('"/>\r\n\
                </div>\r\n\
                <div class="ui-form-item">\r\n\
                    <label class="ui-label">');
_p(_(l_key,'确定新密码'));
__p.push('</label>\r\n\
                    <input type="password" name="new_password2" class="ui-input" maxlength="');
_p(pwd_max_len);
__p.push('"/>\r\n\
                </div>\r\n\
            </div>\r\n\
\r\n\
            <!--// 取消密码只需要这一个字段-->\r\n\
            <div class="ui-form-group" data-group-type="CANCEL">\r\n\
                <div class="ui-form-item">\r\n\
                    <label class="ui-label">');
_p(_(l_key,'输入密码'));
__p.push('</label>\r\n\
                    <input type="password" name="password" class="ui-input" maxlength="');
_p(pwd_max_len);
__p.push('"/>\r\n\
                </div>\r\n\
            </div>\r\n\
        </div>\r\n\
\r\n\
        <!-- 设置成功时的提示 -->\r\n\
        <div class="_msg ui-confirm-cnt" style="display:none; margin-top: 54px;"><i class="ui-icon-ok">\r\n\
\r\n\
        </i><h4 class="-title ui-title ui-title-text">');
_p(_(l_key,'密码设置成功'));
__p.push('</h4></div>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
