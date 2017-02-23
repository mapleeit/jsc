/**
 * 上传选择文件框
 * @author bondli
 * @date 13-7-3
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),
        JSON = lib.get('./json'),

        security = lib.get('./security'),

        constants = common.get('./constants'),
        Module = common.get('./module'),


        upload_event = common.get('./global.global_event').namespace('upload2'),
        global_event = common.get('./global.global_event'),
        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        query_user = common.get('./query_user'),

        main = require('main').get('./main'),

        widgets = common.get('./ui.widgets'),
        text = lib.get('./text'),
        File = common.get('./file.file_object'),

        file_dir_list = require('./select_folder.file_dir_list'),

        user_log = common.get('./user_log'),
        request = common.get('./request'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        plugin_detect = common.get('./util.plugin_detect.js'),
        create_dirs = require('./upload_folder.create_dirs'),

        select_folder_msg = require('./select_folder.select_folder_msg'),
        select_folder_view = require('./select_folder.select_folder_view'),
        photo_group = require('./select_folder.photo_group'),
        upload_route = require('./upload_route'),

        $body = $(document.body),

        //mac系统, safari 下不显示下载按钮
        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1,

        dialog,

        $icon, $name,

        undefined;

    var select_folder = new Module('upload_select_folder', {

        ppdir : '',  //上传到的父级目录

        pdir : '',   //上传到的目录

        ppdir_name : '',  //上传到的父级目录名称

        pdir_name : '',  //上传到的目录名称

        files : [],  //选定要上传的文件

        upload_plugin : {},  //上传对象

        upload_type : 'plugin',  //上传类型，plugin,form,flash

        $tree_ct : '',   //目录树容器

        dir_paths : [],  //选择的目录路径名称

        dir_id_paths : [], //选择的目录路径ID

        upload_mode : 1,  //上传模式，1：上传文件，2：上传文件夹

        cache : [],

        dir_level : 1, //所选目录的层级

        //初始化
        render: function () {
            var me = this;
            var read_mode = scr_reader_mode.is_enable();
            
            select_folder_view.render();

            //根据当前的上传类型，确定按钮
            var upload_button = [];
            if ( me.upload_type == 'plugin' || plugin_detect.is_newest_version() || (!constants.IS_APPBOX && $.browser.chrome) || upload_route.is_support_html5_pro() ) {
                upload_button.push({
                    id: 'OK', text: '开始上传', aria_label: read_mode ? '开始上传' : '', tips: 'jisu', klass: 'g-btn g-btn-blue', visible: true
                });
                upload_button.push({
                    id: 'CANCEL',
                    text: '取消',
                    klass: 'g-btn g-btn-gray'
                });
            }
            else {
                if(gbIsWin && !read_mode){ // 读屏软件很难处理复杂的弹出层逻辑，这里屏蔽掉安装极速上传控件的提示 - james
                    upload_button.push({
                        id: 'OTHER', text: '极速上传', tips: 'jisu', klass: 'g-btn g-btn-blue', visible: true
                    });
                }
                upload_button.push({
                    id: 'OK', text: '普通上传', aria_label: read_mode ? '开始上传' : '', klass: 'g-btn g-btn-gray', visible: true
                });
            }

            if (!dialog) {
                dialog = new widgets.Dialog({
                    title: '上传文件',
                    empty_on_hide: false,
                    destroy_on_hide: false,
                    content: select_folder_view.$dom,
                    tmpl: tmpl.dialog,
                    mask_bg: 'ui-mask-white',
                    buttons: upload_button,
                    handlers: {
                        OK: function () {
                            submit();
                            return false;
                        },
                        OTHER: function() {
                            other();
                            return false;
                        }
                    }
                });
                //当关闭或者隐藏的时候
                me.listenTo(dialog, 'hide', function (isUser) {
                    me.hide();
                    file_dir_list.hide();
                    if(isUser == false) {
                        try{
                            if(me.upload_type == "form") {
	                            upload_route.upload_plugin.reset();
                            }
                        }
                        catch(e) {}
                    }
                });
            }
            // 提交
            var submit = function () {

                if( me.upload_mode == 2 ) {
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO) {
                        select_folder_view.set_album_text( select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO') );
                        return;
                    }
                    //执行创建目录前先判断目录层级是否太深
                    if( me.get_dir_level() + me.files.select_dir_level >= 20 ){
                        select_folder_view.set_error_text('目录所在层级过深，请上传至其他目录');
                        return;
                    }
                }
                else{
                    //表单模式不允许上传相册
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO && me.upload_type == 'form' ) {
                        select_folder_view.set_album_text( select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO') );
                        return;
                    }

                    //上传到相册需要过滤文件
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO && me.getPhotoFiles() == false ) {
                        return;
                    }

                    //获取上传到相册的文件
                    if( me.pdir == constants.UPLOAD_DIR_PHOTO ) {
                        me.files = me.getPhotoFiles();
                    }
                }

                //动画效果
                var $dialog = dialog.get_$el();

                widgets.mask.hide('ui.widgets.Dialog');

                var width = $dialog.width(),
                    height = $dialog.height(),
                    marginLeft = $dialog.css('marginLeft');
                $dialog.animate({
                    "top": "+=570px", //向下移动
                    //"opacity": 0.4,   //透明
                    "width": "740px",    //宽度变大
                    "height": "40px",
                    "marginLeft": "-370px"
                },'slow',function(){
                    //最终隐藏起来
                    dialog.hide();
                    $dialog.css({
                        "width": width,
                        "height": 'auto',
                        "marginLeft": marginLeft
                        //"opacity": 1
                    });
                });

                //console.log(me.ppdir, me.pdir, me.ppdir_name, me.pdir_name, me.dir_paths, me.dir_id_paths);
                if( me.upload_mode == 2 ) {
                    create_dirs.init(me.files, me.upload_plugin, {
                        'ppdir': me.ppdir,
                        'pdir': me.pdir,
                        'ppdir_name': me.ppdir_name,
                        'pdir_name': me.pdir_name,
                        'dir_paths': me.dir_paths,
                        'dir_id_paths': me.dir_id_paths
                    });
                }
                else{
                    upload_event.trigger('add_upload', me.upload_plugin, me.files, {
                        'ppdir': me.ppdir,
                        'pdir': me.pdir,
                        'ppdir_name': me.ppdir_name,
                        'pdir_name': me.pdir_name,
                        'dir_paths': me.dir_paths,
                        'dir_id_paths': me.dir_id_paths
                    });
                }


                // for ARIA 开始上传后，将焦点设置到上传按钮以便盲人继续选择文件 - james
                if (scr_reader_mode.is_enable()) {
                    upload_route.focus_upload_button();
                }
            };

            // 点击安装控件或者装新版QQ
            var other = function() {
                if(constants.IS_APPBOX){
                    window.open('http://im.qq.com/qq/');
                }
                else{
                    dialog.hide();
                    upload_event.once('upload_dialog_show',function(){
                        dialog.show();
                        //显示“修改按钮”
                        select_folder_view.show_chdir_btn();
                        //调整按钮提示信息框位置
                        select_folder_view.reset_box_pop_postion();
                    });
                    upload_event.trigger('install_plugin', '您还未安装微云极速上传控件', 'UPLOAD_SUBMIT_BTN_PLUGIN' );  //0, 上报用
                }
                return false;
            }
        },

        //设置node所在的dir层数
        set_dir_level: function (node) {
            var i = 0;
            while ((node.get_parent() && !node.get_parent().is_super()) && (node = node.get_parent())) { // 不包括super节点
                i++;
            }
            this.dir_level = i;
        },

        get_dir_level: function () {
          return this.dir_level;
        },

        //判断是否选择了非图片文件
        hasNotPhotoFiles: false,

        //从选择的文件中获取照片文件
        getPhotoFiles: function () {
            var me = this,
                __files = [],
                photo_type = ['jpg','jpeg','gif','png','bmp'];

            $.each(me.files, function(i, n){
                if( me.upload_type == 'plugin' ) {
                    var ary = n.split(/\\|\//);
                    var file_name = ary[ary.length - 1] || '';
                }
                else if( me.upload_type == 'flash' ) {
                    var file_name = n.name;
                }

                var file_type = File.get_type(file_name);

                if( $.inArray(file_type, photo_type) != -1 ) {
                    __files.push( n );
                }
                else{
                    me.hasNotPhotoFiles = true;
                }
            });

            if( __files.length == 0 ){
                return false;
            }
            else {
                return __files;
            }

        },

        //超过大小的提示
        show_max_size_dialog : function ( wording, btn ) {
            var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">'+wording+'</span></p>');
            var dialog = new widgets.Dialog({
                title: '上传提醒',
                empty_on_hide: true,
                destroy_on_hide: true,
                content: $el,
                tmpl: tmpl.dialog2,
                buttons: [ btn ],
                handlers: {
                    OTHER: function(){
                        var url = (constants.IS_APPBOX) ? 'http://im.qq.com/qq/' :
                        'http://www.weiyun.com/plugin_install.html?from=ad';
                        window.open(url);
                        return false;
                   }
                }
            });
            dialog.show();
        },

        //超过4G的提示
        flash_max_size_4G_tips : function () {
            var wording = select_folder_msg.get('NO_SUPPORT_G4_FILE');
            var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
            this.show_max_size_dialog(wording, btn);
        },

        //超过2G的提示
        flash_max_size_2G_tips : function () {
            if( !$.browser.msie ){
                var wording = select_folder_msg.get('CHANGE_IE_TO_SUPPORT_G4_FILE');
                var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
            }
            else{
                var wording = select_folder_msg.get('FLASH_UPLOAD_FILE_THAN_M300');
                var btn = {id: 'OTHER', text: '极速上传', tips: 'jisu', klass: 'ui-btn-other', visible: true};
            }
            this.show_max_size_dialog(wording, btn);
            //调整极速上传的提示位置
            /*
            var top = '243px',right = '-20px';
            if(constants.IS_APPBOX){
                top = '193px';
                right = '-65px';
            }
            */
            var right = '-15px';
            if(constants.IS_APPBOX){
                right = '-60px';
            }
            select_folder_view.set_box_pop(right);
        },

        //单文件超过300M的提示
        flash_max_size_tips : function () {
            //判断是否支持装控件
            if ( $.browser.safari || !gbIsWin ) {
                var wording = select_folder_msg.get('BROWSER_NO_SUPPORT_M300_FILE');
                var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
            }
            else {
                var wording = select_folder_msg.get('FLASH_UPLOAD_FILE_THAN_M300');
                var btn = {id: 'OTHER', text: '极速上传', tips: 'jisu', klass: 'ui-btn-other', visible: true};
            }
            this.show_max_size_dialog(wording, btn);
            //调整极速上传的提示位置
            var right = '-15px';
            if(constants.IS_APPBOX){
                right = '-60px';
            }
            select_folder_view.set_box_pop(right);
        },

        //获取当前选择目录的名称
        get_cur_node_paths: function() {
            //获取当前的文件位置，如果是“最近文件”，“回收站”设置为“网盘”
            var node,
                node_name,
                ret_name = upload_route.get_root_name();
            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                //var node = file_list.get_cur_node() || file_list.get_root_node();
                node = file_list.get_cur_node(); 
                //判断是否虚拟目录,是虚拟目录强制回到根目录
                if ( node && node.is_vir_dir() ) {
                    node = file_list.get_root_node();
                }
                node_name = node.get_name();

                this.pdir = node.get_id();
                this.ppdir = node.get_parent().get_id();
                this.pdir_name = node_name;
                this.ppdir_name = node.get_parent().get_name() || '';

                //设置所选目录的层级
                this.set_dir_level(node);
            } 
            else 
            {
                var node_id = query_user.get_cached_user().get_main_key();
                node_name = query_user.get_cached_user().get_main_dir_name();

                this.pdir = node_id;
                this.ppdir = query_user.get_cached_user().get_root_key();
                this.pdir_name = node_name;
                this.ppdir_name = '';

                //设置所选目录的层级
                this.dir_level = 1;
            }
            if( node_name == '微云' || node_name == '网盘' ){
                return [ret_name];
            }
            var path = [node_name];
            while(node_name != '微云' && node_name != '网盘') {
                node = node.get_parent();
                node_name = node.get_name();
                path.unshift(node_name);
            }
            return path;
        },

        //显示默认的路径
        set_default_path_name : function(dir_paths, is_upfolder) {
            if(upload_route.is_ku20()){//todo ku2.0
                //$('#disk_upload_upload_to').html(text.smart_cut(node_name, 20));
                this.measure_upload_paths(dir_paths, true);
                return;
            }

            //当前停留在相册的时候
            if(main.get_cur_mod_alias() == 'photo'){
                var node_id = constants.UPLOAD_DIR_PHOTO;
                node_name = '相册';
                this.pdir = node_id;
                this.ppdir = constants.UPLOAD_DIR_PHOTO;
                this.ppdir_name = '';
                this.pdir_name = node_name;
                //如果是上传文件夹
                if(is_upfolder) {
                    node_name = '相册<label>（'+select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO')+'）</label>';
                    this.set_submit_disable();
                }
                else {
                    if( this.upload_type == 'form' ) {
                        //判断能否安装插件
                        node_name = '相册<label>（'+select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO')+'）</label>';
                        this.set_submit_disable();
                    }
                    else {
                        if( this.getPhotoFiles() == false ) {
                            node_name = '相册<label>（'+select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO')+'）</label>';
                            this.set_submit_disable();
                        }
                    }
                }
                
                $('#disk_upload_upload_to').html(node_name);
            }
            else{
                //$('#disk_upload_upload_to').html(text.smart_cut(node_name, 20));
                this.measure_upload_paths(node_name, true);
            }
        },
        //显示上传位置选择框
        show: function (files, upload_plugin, upload_type) {

            //先隐藏上传管理器
            //global_event.trigger('upload_to_min');

            this.files = files;
            this.upload_plugin = upload_plugin;
            this.upload_type = upload_type;

            this.upload_mode = 1;

            //增加选择的目录的路径和路径ID
            this.dir_paths = [];
            this.dir_id_paths = [];

            this.render();


            //根据选择的文件个数，获取文件名称，文件后缀
            var full_name = '',
                file_name = '',
                file_ext = '';
            if( this.upload_type == 'plugin' ) {
                var ary = this.files[0].split(/\\|\//);
                full_name = ary[ary.length - 1] || '';
            }
            else if( this.upload_type == 'flash' ) {
                full_name = this.files[0].name;
            }
            else {
                full_name = this.files[0].name;
            }

            //flash上传，并且是单文件需要判断是否超过大小
            if ( this.upload_type == 'flash' && this.files.length == 1 ) {
                var cur_file_size = this.files[0].size;
                //判断是否大于4G,这个时候size=-1
                if( cur_file_size === -1 ){
                    this.flash_max_size_2G_tips();
                    return;
                }
                //判断是否大于2G
                if( cur_file_size > 1024 * 1024 * 1024 * 2 ){
                    this.flash_max_size_2G_tips();
                    return;
                }
                //限制:300M
                else if( cur_file_size > 1024 * 1024 * 300 ){
                    this.flash_max_size_tips();
                    return;
                }
            };

            var is_all_image = photo_group.is_all_image( files ); //是否全都是图片

            //处理文件名和文件icon
            if( this.files.length == 1 ){
                file_ext = File.get_type(full_name);
                if(file_ext == '') {
                    file_ext = 'file';
                }
                //截取
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 20 : 26 );
            }
            else{ //多个文件
                var m_word = is_all_image ? '张图片' : '个文件';
                file_ext = File.get_type(full_name);
                if(file_ext == '') {
                    file_ext = 'file';
                }
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 16 : 20 ) + ' <em>等'+ (this.files.length) +m_word+'</em>';
                full_name = full_name + ' 等'+ (this.files.length) +m_word;
            }
            select_folder_view.show_icon_and_name(file_ext, full_name, file_name);

            var paths = this.get_cur_node_paths();

            //显示“修改按钮”
            select_folder_view.show_chdir_btn();

            dialog.show();

            select_folder_view.set_box_pop();

            dialog.get_$body().repaint();

            this.set_submit_enable();

            this.set_default_path_name(paths);

            if(is_all_image) {
                photo_group.toggle_photo_group(select_folder_view.$dom,files);
            }

            //上报用户选了多少个文件,临时上报就不写入ops的配置了
            user_log(59010,0,{"file_num": this.files.length});

        },

        /**
         * 上传文件夹特殊处理下
         */
        show_by_upfolder: function (files, upload_plugin) {
            this.files = files;
            this.upload_plugin = upload_plugin;
            this.upload_type = 'plugin';

            this.upload_mode = 2;

            //增加选择的目录的路径和路径ID
            this.dir_paths = [];
            this.dir_id_paths = [];

            this.render();

            //根据选择的文件个数，获取文件名称，文件后缀
            var file_ext = 'folder',
                full_name = files.dir_name,
                file_name = text.smart_cut( full_name, constants.IS_APPBOX ? 20 : 26 );

            select_folder_view.show_icon_and_name(file_ext, full_name, file_name);

            var paths = this.get_cur_node_paths();


            //显示“修改按钮”
            select_folder_view.show_chdir_btn();

            dialog.show();
            dialog.set_title('上传文件');

            dialog.get_$body().repaint();

            this.set_submit_enable();

            this.set_default_path_name(paths, 1);

            photo_group.toggle_photo_group(select_folder_view.$dom,files);

        },

        //设置目录列表隐藏
        hide : function() {
            select_folder_view.$tree_ct[0].style.display = 'none';
            this.trigger('hide');
            photo_group.toggle_photo_group(null,null,true);
        },

        /**
         * 设置提交按钮为禁用
         */
        set_submit_disable : function () {
            var btn = dialog.get_$el().find('a[data-btn-id="OK"]');
            if( !btn.hasClass('g-btn-gray') ) {
                btn.find('.btn-inner').addClass('disabled');
            }
            else {
                btn.find('.btn-inner').addClass('disabled');
            }

            dialog.set_button_enable('OK', false);
        },

        /**
         * 启用提交按钮
         */
        set_submit_enable : function () {
            var btn = dialog.get_$el().find('a[data-btn-id="OK"]');
            if( !btn.hasClass('g-btn-gray') ) {
                btn.find('.btn-inner').removeClass('disabled');
            }
            else {
                btn.find('.btn-inner').removeClass('disabled');
            }
        },
    
        //更新上传到的路径显示
        update : function( ppdir, pdir, dir_paths, dir_id_paths ){
            this.ppdir = ppdir;
            this.pdir = pdir;
            //$('#disk_upload_upload_to').html( dir_paths[dir_paths.length-1] );
            //设置所选目录的层级
            this.dir_level = dir_paths.length;

            select_folder_view.set_error_text(''); //用户选择变更的时候将错误信息隐藏

            if( this.pdir == constants.UPLOAD_DIR_PHOTO ) {
                //表单模式不允许上传相册
                if( this.upload_type == 'form' ){
                    select_folder_view.set_album_text( select_folder_msg.get('PLEASE_INSTALL_PLUGIN_TO_PHOTO') );
                    this.set_submit_disable();
                    return;
                }

                //文件夹模式不允许上传到相册
                if( this.upload_mode == 2 ) {
                    select_folder_view.set_album_text( select_folder_msg.get('NO_SUPPORT_UPLOAD_TO_PHOTO') );
                    this.set_submit_disable();
                    return;
                }

                //上传到相册需要过滤文件
                if( this.getPhotoFiles() == false ) {
                    select_folder_view.set_album_text( select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO') );
                    //按钮也灰掉
                    this.set_submit_disable();
                    return;
                }

                //选的文件中有部分是图片，有部分是非图片的时候也需要提示
                if( this.hasNotPhotoFiles == true ) {
                    select_folder_view.set_album_text( select_folder_msg.get('ONLY_SUPPORT_UPLOAD_PHOTO') );
                }
            }
            else{
                select_folder_view.set_album_text();
                this.set_submit_enable();
            }

            this.measure_upload_paths(dir_paths);

            //增加选择的目录的路径和路径ID
            if(upload_route.is_ku20()){ //todo ku2.0
                this.dir_paths = dir_paths;
            } else {
                this.dir_paths = $.map(dir_paths, function (path) {
                    return (path == '网盘') ? '微云' : path;
                });
            }

            this.dir_id_paths = dir_id_paths;

            this.ppdir_name = '';
            this.pdir_name = dir_paths[dir_paths.length - 1];
            if( dir_paths.length > 1 ) {
                this.ppdir_name = dir_paths[dir_paths.length - 2];
            }
        },

        measure_upload_paths: function(dir_paths, is_default) {
            var $paths = $('#disk_upload_upload_to'),
                paths = $.isArray(dir_paths) ? dir_paths.join('\\') : dir_paths;
            $paths.text(paths);
            $paths.attr('title', paths);

            //判断长度是否超出
            var size = text.measure($paths, paths),
                limit_width = is_default ? 280 : 320;
            if( size.width > limit_width ) {
                var len = dir_paths.length;
                //$('#disk_upload_upload_to').html( text.smart_sub(dir_paths[len-1], 20) );
                var output = [];
                if( len>4 ) {
                    var output = text.smart_sub(dir_paths[len-2], 8) + '\\' + text.smart_sub(dir_paths[len-1], 8);
                    $paths.text( upload_route.get_root_name()+'\\...\\' + output );
                }
                else {
                    $.each(dir_paths,function(i,n) {
                        output.push( text.smart_sub(n,5) );
                    });
                    $paths.text(output.join('\\'));
                }
            }
        }

    });

    //定义一个选择的目录的事件
    select_folder.on('selected', function( ppdir, pdir, dir_paths, dir_id_paths ){
        select_folder.update( ppdir, pdir, dir_paths, dir_id_paths );
    });

    module.exports = select_folder;
});