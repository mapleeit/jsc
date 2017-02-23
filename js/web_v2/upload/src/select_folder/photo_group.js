/**
 * 选择上传分组
 * @author trump
 * @date 13-11-05
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),

        File = common.get('./file.file_object'),
        request = common.get('./request'),
        Pop_panel = common.get('./ui.pop_panel'),
        constants = common.get('./constants'),
        widgets = common.get('./ui.widgets'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        ds_photogroup_event = common.get('./global.global_event').namespace('datasource.photogroup'),

        main =  require('main').get('./main'),
        album_mod,
        upload_route = require('./upload_route'),
        DISABLE_NEW_GROUP_CLASS = 'disabled',
        undefined;
    var Group_record = function (cfg) {
        this.id = cfg.id;
        this.name = cfg.name;
    };

    var upload_photo_group = new Module('upload_photo_group',{
        on_photogroup_change: function(){
            group_route.load_groups(true);
        },
        render: function(){
            this.listenTo(ds_photogroup_event,'add remove update',function(records,meta){
                if( meta.src === group_route ){
                    return;
                }
                this.on_photogroup_change();
            });
        }
    });

    var lib_v3_enable = false;
    query_user.on_ready(function(user) {
        if(user.is_lib3_user()) {
            lib_v3_enable = true;
        }
    });

    upload_photo_group.render();
    //分组信息
    var group_route = {

        /**
         * 获取当前页面的组记录id
         * @returns {*}
         */
        getCurPageGroupId: function(){
            if(!album_mod){
                require.async('album',function(mod){
                    album_mod = mod;
                });
            }
            if( !album_mod || main.get_cur_mod_alias() !== 'album' ){
                return null;
            }
            return album_mod.get('./photo').get_simple_module().get_group_id();
        },
        /**
         * 获取当前页面的组记录name
         * @returns {*}
         */
        getCurPageGroupName: function(){
            if( !album_mod ){
                require.async('album',function(mod){
                    album_mod = mod;
                });
            }
            if( !album_mod || main.get_cur_mod_alias() !== 'album' ){
                return null;
            }
            return album_mod.get('./photo').get_simple_module().get_group_name();
        },
        _canceled: {},
        _group_cgi: 'http://web2.cgi.weiyun.com/pic_group.fcg',
        _request: function (url, cmd, header, body, post_process) {
            var def = $.Deferred(), me = this;
            var pb_v2 = cmd.indexOf('_') < 0 ? true : false;
            var req = request.xhr_get({
                url: url,
                cmd: cmd,
                pb_v2: pb_v2,
                header: header,
                body: body,
                cavil: true
            });
            req.ok(function (msg, body, header, data) {
                var args;
                if (post_process) {
                    args = post_process.apply(this, arguments);
                } else {
                    args = $.makeArray(arguments);
                }
                def.resolve.apply(def, args);
            }).fail(function (msg, ret, body, header, data) {
                    def.reject(msg, ret, body, header, data);
                });
            return def;
        },
        //创建分组
        create_group: function (name) {
            var me = this;
            var cmd = lib_v3_enable ? 'LibCreatePicGroup' : 'create_group';

	        if(!name || name.replace(/(^\s*)|(\s*$)/g, '') === '') {
		        mini_tip.error('需要输入分组名称才能创建分组');
		        return;
	        }

            if(lib_v3_enable) {
                this._group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            return me._request(
                me._group_cgi,
                cmd,
                {},
                {
                    group_name: name
                },
                function (msg, body, header, data) {
                    return [{
                        id: body.group_id,
                        name: body.group_name
                    }, body.group_id];
                }
            ).done(function (record, total) {
                photo_group.on_create_group_ok(record.id,record.name);
                ds_photogroup_event.trigger('add',[record],{src: me});
                me.load_groups();
            }).fail(function (msg){
                mini_tip.error(msg);
            });
        },
        //加载分组
        load_groups: function (just_ask_data) {
            var cmd = lib_v3_enable ? 'LibGetPicGroup' : 'get_group';

            if(lib_v3_enable) {
                this._group_cgi = 'http://web2.cgi.weiyun.com/user_library.fcg'
            }
            this._request(
                this._group_cgi,
                cmd,
                {},
                {},
                function (msg, body, header, data) {
                    var groups = [],
                        pic_group;
                    pic_group = lib_v3_enable ? body.groups : body.pic_group;
                    if(pic_group) {
                        $.each(pic_group, function (index, group) {
                            groups.push(new Group_record({
                                id: group.group_id,
                                name: group.group_name
                            }, group.group_id));
                        });
                    }
                    return [groups];
                }
            ).done(function (records, total) {
                group_route.groups = records;
                if(!just_ask_data){
                    photo_group.paint_group();
                }
            }).fail(function (msg) {
                if(!just_ask_data){
                    mini_tip.error(msg);
                }
            });
        },
        /**
         * 输入的名字是否可以创建新的分组
         * @param name
         * @returns {boolean}
         */
        is_suit_for_new: function (name) {
            if (!name || !name.length) {
                return false;
            }
            return true;
        },
        /**
         * 返回所有分组信息
         * @returns {Array<Group_record>}
         */
        find_all: function () {
            if (this.groups) {
                return this.groups;
            }
            return [];
        }
    };
    var photo_group = {
        /**
         * 分组新建成功后的处理逻辑
         * @param id
         * @param name
         */
        on_create_group_ok: function(id,name){
            this.on_chose_done(id,name);
        },
        /**
         * 显示/隐藏图片分组
         * @param {jQuery} [$render_to]
         * @param {Array} files
         * @param {boolean} [force_hide]
         */
        toggle_photo_group: function ($render_to, files, force_hide) {
            var me = this;
            if(!me.is_render && (!$render_to || !files)) {
                return;
            }
            if (!me.is_render) {
                me._render($render_to);
            }
            me.when_click('group_hide');
            if( !!force_hide || !me.is_all_image(files)){
                me.get_$check_parent().hide();//隐藏分组
            } else {
                me.set_photo_group_id(0);
                me.get_$check_parent().show();//显示分组
                me.reset_photo_group();//重置默认分组
                me.paint_group();
                var groupId = group_route.getCurPageGroupId(),
                    groupName = group_route.getCurPageGroupName();
                //如若处在一个有分组模块，那么就将这些分组信息设置为默认信息上传信息
                if( groupId && groupName){//设置默认分组
                    me.$check_prent.trigger('click');
                    me.set_photo_group_id( groupId );
                    me.get_$select_btn().find('span').html( groupName +'<i></i>');
                }
            }
        },
        /**
         * 重置分组html结构
         */
        reset_photo_group: function(){
            //设置默认分组
            this.set_photo_group_id(1);
            this.get_$select_btn().find('span').html('未分组<i></i>');
        },
        /**
         * 渲染组列表
         */
        paint_group: function () {
            var place = this.$panel,array = group_route.find_all();
            if(!place){
                place = this.get_$panel();
            }
            return place.empty().append(tmpl.photo_group_items({array:array}))
                .height(array.length > 5 ? 115 : 'auto')
        },
        /**
         * 初始化渲染
         * @param $render_to
         * @private
         */
        _render: function ($render_to) {
            var me = this;
            if (me.is_render) {
                return;
            }
            group_route.load_groups();
            me.is_render = true;
            me.get_$new_input();
            me.get_$new_btn();
            me.get_$select_btn();
            (me.$check_prent =
                ( me.$check = $render_to.find('[data-id=upload_group_check]') )
                    .parent()
                )
                .on('click', function (e) {
                    e.stopPropagation();
                    var is_checked = me.get_$check().hasClass('checked');
                    if (is_checked) {
                        me.when_click('group_hide');
                    } else {
                        me.reset_photo_group();//重置默认分组
                        me.when_click('group_show');
                    }
                });
        },
        /**
         * 获取图片组ID
         * @returns {int}
         */
        get_photo_group_id: function () {
            if(this._chose_group_id){
                return this._chose_group_id - 0;
            }
            return 0;
        },
        /**
         * 设置图片组ID
         * @param id
         */
        set_photo_group_id: function (id) {
            this._chose_group_id = id;
        },
        /**
         * 是否控件上传
         * @returns {boolean}
         * @private
         */
        _is_plugin: function () {
            return upload_route.type == 'active_plugin' || upload_route.type == 'webkit_plugin';
        },
        /**
         * 获取文件名
         */
        _get_name: $.noop(),
        /**
         * 输入的文件全部为图片文件
         * @param files
         */
        is_all_image: function(files){
            if (!files || !files.length) {
                return false;
            }

            if (!this._get_file_name) {//初始化获取名称的函数
                this._get_file_name = this._is_plugin() ? function (path) {
                    var ary = path.split(/\\|\//);
                    return ary[ary.length - 1] || '';
                } : function (path) {
                    return path.name;
                };
            }
            var i = 0, file;
            //中断条件：出现不为图片的文件
            while(file = files[i]){
                if(!File.is_image(this._get_file_name(file))){
                    return false;
                }
                i+=1;
            }
            return true;
        }
    };
    $.extend(photo_group,{
        /**
         * 分组信息的包装层
         * @returns {jQuery}
         */
        get_$group: function () {
            var me = this;
            if (me.$group) {
                return me.$group;
            }
            return me.$group = $('#upload_dropdown_group')
                .hover(function () {
                    $('body').off('mouseup.out_upload_group');
                }, function () {
                    $('body').on('mouseup.out_upload_group', function () {
                        //处于新建分组的输入状态时，回到选择分组的状态 ； 否则隐藏选择分组
                        if( me.get_$wrap().css('display').toLowerCase() !== 'none' ){
                            me.get_$select_btn().trigger('click');
                        } else {
                            me.when_click('out_upload_group');
                        }
                    });
                });
        },
        /**
         * 选择指定分组的下拉框按钮
         * @returns {jQuery}
         */
        get_$select_btn: function () {
            var me = this;
            if (me.$select_btn) {
                return me.$select_btn;
            }
            return (me.$select_btn = $('#upload_select_group')).on('click', function (e) {
                e.stopPropagation();
                me.when_click('upload_select_group');
            });
        },
        /**
         * 下拉面板容纳所有的组信息
         * @returns {jQuery}
         */
        get_$panel: function () {
            var me = this;
            if (me.$panel) {
                return me.$panel;
            }
            me.$panel = $('#upload_group_panel');

            me.$panel.on('click', 'li', function (e) {
                e.preventDefault();
                var _self = $(this).find('a'),
                    id = _self.attr('data-group-id');
                if (!id || id == 0) {
                    return;
                }
                me.on_chose_done(id,_self.text());
            });
            return me.paint_group();
        },
        /**
         * 当被选中一个分组时的处理逻辑
         * @param group_id 组id
         * @param group_name 组名
         */
        on_chose_done: function(group_id,group_name){
            var me = this;
            me.get_$select_btn().find('span').html(group_name+'<i></i>');//修改选中的分组TEXT
            me.set_photo_group_id(group_id);
            me.when_click('li');
        },
        /**
         * 新建分组的输入框和创建按钮的 容器
         * @returns {jQuery}
         */
        get_$wrap: function () {
            return this.$add_wrap || ( this.$add_wrap = $('#upload_new_group_wrap'));
        },
        /**
         * 新建分组的创建按钮
         * @returns {jQuery}
         */
        get_$new_btn: function () {
            if (this.$new_btn) {
                return this.$new_btn;
            }
            var me = this;
            return (me.$new_btn = $('#upload_new_btn'))
                .on('click', function (e) {
                    e.stopPropagation();
                    group_route.create_group(me.get_$new_input().val())
                });
        },
        /**
         * 新建分组的输入框
         * @returns {jQuery}
         */
        get_$new_input: function () {
            if (this.$new_input) {
                return this.$new_input;
            }
            var me = this;
            return (me.$new_input = $('#upload_new_group_input'))
                .on('focus', function (e) {
                    e.stopPropagation();
                    if (this.value === '新建分组') {
                        this.value = '';
                    }
                    me.$new_btn[group_route.is_suit_for_new(this.value) ? 'removeClass' : 'addClass'](DISABLE_NEW_GROUP_CLASS);
                })
                .on('keyup', function (e) {
                    e.stopPropagation();
                    me.$new_btn[group_route.is_suit_for_new(this.value) ? 'removeClass' : 'addClass'](DISABLE_NEW_GROUP_CLASS);
                });
        },
        /**
        * 新建分组的入口按钮
        * @returns {jQuery}
        * */
        get_$add_btn: function () {
            var me = this;
            if (me.$add_btn) {
                return me.$add_btn;
            }
            return (me.$add_btn = $('#upload_new_group_btn')).on('click', function (e) {
                e.stopPropagation();
                me.when_click('upload_new_group_btn');
                me.get_$new_input().focus().val('');
            });
        },
        /**
         * checkbox 选择一个指定的分组的CheckBox对象
         * @returns {jQuery}
         */
        get_$check: function () {
            return this.$check;
        },
        /**
         * checkbox的包装层
         * @returns {jQuery}
         */
        get_$check_parent: function () {
            return this.$check_prent;
        },
        /**
         * 各种操作的UI展示效果
         * @param target
         */
        when_click: function (target) {
            switch (target) {
                case('li'):
                    this.get_$select_btn().show();
                    this.get_$add_btn().hide();
                    this.get_$wrap().hide();
                    this.get_$panel().hide();
                    return;
                case('upload_select_group'):
                    this.get_$select_btn().hide();
                    this.get_$add_btn().show();
                    this.get_$wrap().hide();
                    this.get_$panel().show();
                    return;
                case('upload_new_group_btn'):
                    this.get_$select_btn().hide();
                    this.get_$add_btn().hide();
                    this.get_$wrap().show();
                    this.get_$panel().show();
                    return;
                case('out_upload_group'):
                    this.get_$select_btn().show();
                    this.get_$add_btn().hide();
                    this.get_$wrap().hide();
                    this.get_$panel().hide();
                    return;
                case('group_hide'):
                    this.get_$group().hide();//隐藏分组信息
                    this.get_$check().removeClass('checked');
                    return;
                case('group_show'):
                    this.get_$group().show();//隐藏分组信息
                    this.get_$check().addClass('checked');
                    return;
            }
        }
    });

    return photo_group;
});