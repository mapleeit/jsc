/**
 * 上传控件安装
 * @author yuyanghe
 * @date 13-7-26
 */
define(function (require, exports, module) {
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
});