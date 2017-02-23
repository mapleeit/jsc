/**
 * 搜索Module
 * @author cluezhang
 * @date 2013-9-12
 */
define(function(require, exports, module){
    var lib = require('lib'),
        $ = require('$'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        console = lib.get('./console'),
        
        routers = lib.get('./routers'),
        store = lib.get('./store'),

        main_mod = require('main'),
        main = main_mod.get('./main'),
        main_ui = main_mod.get('./ui'),
        
        common = require('common'),
        
        query_user = common.get('./query_user'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),
	    huatuo_speed = common.get('./huatuo_speed'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        Module = common.get('./Simple_module'),
        scr_reader_mode = common.get('./scr_reader_mode');
    var Requestor = require('./Requestor'),
        Switch_view = require('./Switch_view'),
        Main_panel = require('./Panel');
        
    var get_mode_store_key = function(){
            return 'photo_view_mode' + query_user.get_uin_num();
        },
        toolbar_act_event = 'toolbar_act',
        
        scroller = main_ui.get_scroller();
    return new Module({
        name : 'photo',
        main_view : new Main_panel({
            $ct : main_ui.get_$body_box()
        }),
        create_toolbar : function(){
            var me = this,
                create_handler = function(act){
                    return function(e){
                        //console.debug(act);
                        switch(act){
                            case('create_group'):
                                user_log('ALBUM_GROUP_TOOL_NEW');
                                break;
                            case('set_group'):
                                user_log('ALBUM_GROUP_TOOL_CHANGE');
                                break;
                            case('batch_delete'):
                                user_log('ALBUM_GROUP_TOOL_DEL');
                                break;
                        }
                        me.main_view.on_toolbar_act(act, e);
                    };
                };
            var toolbar = new Toolbar({
                cls: 'toolbar-btn clear photo-toolbar',
                btns: [
                    new Button({
                        id: 'create_group',
                        label: '新建分组',
                        icon: 'ico-mkdir',
                        handler: create_handler('create_group')
                    }),
                    new Button({
                        id: 'set_group',
                        label: '更改分组',
                        icon: 'ico-movegroup',
                        handler: create_handler('set_group')
                    }),
                    new Button({
                        id: 'batch_delete',
                        label: '删除',
                        icon: 'ico-del',
                        handler: create_handler('batch_delete')
                    }),
                    new Button({
                        id: 'refresh',
                        label: '',
                        icon: 'ico-ref',
                        handler: function() {
                            me.refresh();
                        }
                    })
                ]
            });
            toolbar.render(main_ui.get_$bar1());
            // 这里的resize是通知main模块调整总容器高度的。
            this.get_module_adapter().trigger('resize');
            return toolbar;
        },

        /**
         * 获取要进入的视图模式，可通过hash：albumn.all、albumn.time、albumn.group 定位到哪个tab
         * @returns {*}
         */
        get_init_view_mode: function() {
            var mode;
            var hashs = routers.get_param('m').split('.'),
                last_hash = hashs[hashs.length-1],
                modes = ['all', 'group', 'time']; //目录就两级吧

            // 视图模式（针对读屏模式只启用全部视图）- james
            if(scr_reader_mode.is_enable()) {
                mode = 'all';
            } else if($.inArray(last_hash, modes) > -1) {
                mode = last_hash;
            } else {
                mode = store.get(get_mode_store_key()) || 'time';
            }
            return mode;
        },

        create_switch_view : function(){
            var me = this,
                main_view = me.main_view;
            var toolbar = this.get_singleton('toolbar');

            var default_mode = this.get_init_view_mode();
            var switch_view = new Switch_view({
                mode : default_mode,
                $ct : toolbar.get_$el()
            });
            switch_view.render();
            switch_view.on('switch', function(mode){
                // 持久化用户选择
                store.set(get_mode_store_key(), mode);
                main_view.switch_mode(mode);
                me.store_hash(mode);
                // log
                switch(mode){
                    case 'all':
                        user_log('ALBUM_MODE_ALL');
                        break;
                    case 'time':
                        user_log('ALBUM_MODE_TIME');
                        break;
                    case 'group':
                        user_log('ALBUM_MODE_GROUP');
                        break;
                }
            });
            // 初始时进行一次视图切换
            main_view.switch_mode(switch_view.get_mode());
            return switch_view;
        },
        /**
         * 将当前的访问路径存储到hash中
         */
        store_hash: function (mode) {
            var path = ['album']
           setTimeout(function () {
               path.push(mode);
               routers.replace({
                   m: path.join('.')
               }, true);
            }, 0);
        },
        
        // 保证界面已渲染，事件已绑定
        asure_inited : function(){
            if(this.rendered){
                return;
            }
            this.get_singleton('toolbar');
            var switch_view = this.get_singleton('switch_view');
            this.rendered = true;
            
            var main_view = this.main_view;
            // 初始大小
            main_view.set_size(this.get_view_size());
            // 设置初始时模式的工具栏
            this.set_toolbar_meta(main_view.get_toolbar_meta());
            // 绑定后续模式切换后工具栏的变动
            main_view.on('toolbar_meta_changed', this.set_toolbar_meta, this);
            // 绑定toolbar传入
            this.on(toolbar_act_event, main_view.on_toolbar_act, main_view);
            
            // 模式切换后，触发是否要加载更多的判断
            main_view.on('modeactivate', this.if_reachbottom, this);
        },
        on_activate : function(){
	        //测速
	        try{
		        var flag = '21254-1-10';
		        if(window.g_start_time) {
			        huatuo_speed.store_point(flag, 1, new Date() - window.g_start_time);
			        huatuo_speed.report();
		        }
	        } catch(e) {

	        }
            Module.prototype.on_activate.apply(this, arguments);
            this.asure_inited();
            scroller.on('scroll', this.if_reachbottom, this);
            scroller.on('resize', this.on_resize, this);
            
            this.main_view.activate();
            
            global_event.on('album_refresh', this.refresh, this);
            if(location.search.indexOf('s=ic') != -1) {//只有从空间个人中心过来的才出现tip
                $('#_main_logout').hide();//产品确定，去掉 退出 按钮
                this.add_tip();
            }
        },
        add_tip: function() {
            var self = this;
            if(-1 != location.search.indexOf('flag=first')) {
                if($('div#qzone_wy_tip').length == 0) {
                    $('<div id="qzone_wy_tip" class="lay-alert" style="position:relative;"><div class="inner"><div class="wy-alert wy-alert-warning wy-alert-dismissible" role="alert"><a href="javascript:;" class="close close-tip" aria-label="Close"><span aria-hidden="true">×</span></a>您在手机QQ空间“照片备份”中的照片已存到微云，微云文件全部仅自己可见。</div></div></div>').insertBefore($('#_main_content'));
                    self.bindTipEvent();
                } else {
                    $('div#qzone_wy_tip').show();
                }
                setTimeout(function() {
                    self.tip_slow_vanish();
                }, 10000);
            } else if(-1 != location.search.indexOf('flag=hasdot')){
                if($('div#qzone_wy_tip').length == 0) {
                    $('<div id="qzone_wy_tip" class="lay-alert" style="position:relative;"><div class="inner"><div class="wy-alert wy-alert-warning wy-alert-dismissible" role="alert"><a href="javascript:;" class="close close-tip" aria-label="Close"><span aria-hidden="true">×</span></a>您有新备份到微云的照片，快用微云网页版查看管理吧！</div></div></div>').insertBefore($('#_main_content'));
                    self.bindTipEvent();
                } else {
                    $('div#qzone_wy_tip').show();
                }
                setTimeout(function() {
                    self.tip_slow_vanish();
                }, 10000);
            }
        },
        bindTipEvent: function() {
            var self = this;
            $('a.close-tip').on('click', function() {
                self.tip_slow_vanish();
                return false;
            });
        },
        hide_tip: function() {
            $('div#qzone_wy_tip').hide();
        },
        tip_slow_vanish: function() {//产品逻辑：点击tip的叉，tip慢慢消失
            $('div#qzone_wy_tip').slideUp();
        },
        on_deactivate : function(){
            global_event.off('album_refresh', this.refresh, this);
            
            this.main_view.deactivate();
            
            scroller.off('scroll', this.if_reachbottom, this);
            scroller.off('resize', this.on_resize, this);
            Module.prototype.on_deactivate.apply(this, arguments);
            this.hide_tip();
        },
        on_resize : function(){
            this.main_view.set_size(this.get_view_size());
            this.if_reachbottom();
        },
        /**
         * 获取可视范围的大小
         * @return {Object} size 有width与height属性，数字，像素
         */
        get_view_size : function(){
//            var $ct = $(window);//this.$ct;
            // 坑爹，activate时main_ui还处于display:none状态，只好取它父节点的大小了
            var $ct = main_ui.get_$body_box();
            return {
                width : $ct.innerWidth() - parseInt($ct.css('padding-left'), 10) - parseInt($ct.css('padding-right'), 10),
                height : $ct.height() - parseInt($ct.css('padding-top'), 10) - parseInt($ct.css('padding-bottom'), 10)
            };
        },
        if_reachbottom : function(){
            if(scroller.is_reach_bottom()){
                this.main_view.on_reachbottom();
            }
        },
        refresh : function(){
            user_log('NAV_ALBUM_REFRESH');
            this.main_view.refresh();
        },
        /**
         * 获取当前正处于的分组信息，如果为null则没有进分组
         */
        get_group : function(){
            var main_view = this.main_view, group;
            if(main_view.mode === 'group'){
                group = main_view.get_current_mode_instance().get_current_group();
                if(group){
                    return group;
                }
            }
            return null;
        },
        /**
         * 获取当前正处于的分组id，如果为null则没有进分组
         * @returns {*}
         */
        get_group_id : function(){
            var group = this.get_group();
            return group ? group.get('id') : null;
        },
        /**
         * 获取当前正处于的分组name，如果为null则没有进分组
         * @returns {*}
         */
        get_group_name : function(){
            var group = this.get_group();
            return group ? group.get('name') : null;
        },
        set_toolbar_meta : function(meta){
            meta = meta || {};
            var toolbar = this.get_singleton('toolbar');
            meta.refresh = true;
            $.each(toolbar.get_btns(), function(index, btn){
                btn[meta.hasOwnProperty(btn.get_id()) ? 'show' : 'hide']();
            });
        }
    }).get_common_module();
});