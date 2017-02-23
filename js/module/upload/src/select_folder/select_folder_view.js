/**
 * 上传:选择上传位置UI
 * @author bondli
 * @date 13-8-29
 */
define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),
        tmpl = require('./tmpl'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        widgets = common.get('./ui.widgets'),
        ui_center = common.get('./ui.center'),
        query_user = common.get('./query_user'),
        Pop_panel = common.get('./ui.pop_panel'),
        constants = common.get('./constants'),
        Module = common.get('./module'),

        main = require('main').get('./main'),

        file_dir_list = require('./select_folder.file_dir_list'),
        select_folder_msg = require('./select_folder.select_folder_msg'),

        undefined;

    var select_folder_view = new Module('select_folder_view', {

    	render : function () {
            var me = this;
            me.$dom = $(tmpl.select_folder());        //位置选择框对象
            me.$icon = me.$dom.find('[data-id=icon]');    //文件图标
            me.$name = me.$dom.find('[data-id=name]');    //文件名
            me.$chdir = me.$dom.find('[data-btn-id=CHDIR]');    //修改按钮
            me.$tree_ct = me.$dom.find('[data-id=tree-container]');  //目录树对象

            me.$chdir.on('click',function(e){
            	e.preventDefault();
                $(this).hide();
                me.click_chdir();
            });

        },

        /**
         * 显示修改路径的按钮
         */
        show_chdir_btn : function() {
        	this.$chdir.show();
        },

        /**
         * 显示icon和文件名
         */
        show_icon_and_name : function(icon, fullname, name) {
        	this.$icon.attr('class', 'filetype icon-' + icon);
        	this.$name.attr('title', fullname).html(name);
        },

        /**
		 * 点击修改默认路径
         */
        click_chdir : function(){
        	var me = this;
        	me.$tree_ct.fadeIn();

        	var node,
        		node_id;

            //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
            if (disk.is_rendered() && disk.is_activated()) {
                node = file_list.get_cur_node();
                //判断是否虚拟目录,是虚拟目录强制回到根目录
                if ( node && node.is_vir_dir() ) {
                    node = file_list.get_root_node();
                }
                node_id = node.get_id();
            } 
            else 
            {
                node_id = query_user.get_cached_user().get_main_key();
            }
            //当前停留在相册的时候
            if(main.get_cur_mod_alias() == 'photo'){
                node_id = constants.UPLOAD_DIR_PHOTO;
            }

            //加载目录列表
            file_dir_list.show( me.$tree_ct, node_id );

            //调整选择框的位置
            ui_center.update( me.$dom.closest('#_upload_dialog') );

            //更新相册的文字显示和去掉上次选中的样式
            me.set_album_text();
            me.clear_album_selected();
        },
        /**
         * 设置按钮提示信息框位置
         */
        reset_box_pop_postion: function() {
            var me = this;
            if( constants.IS_APPBOX ){
                me.set_box_pop();
                me.$box_pop.find('.ui-pop-darr').show();
                me.$box_pop.find('.ui-pop-uarr').hide();
            }
            else{
                me.set_box_pop();
            }
        },
        /**
         * 设置按钮提示信息框
         */
        set_box_pop : function(right) {
            var me = this;
            me.$box_pop = $('#_upload_box_pop');
            me.$box_pop.find('.ui-pop-uarr').show();
            me.$box_pop.find('.ui-pop-darr').hide();

            if(constants.IS_APPBOX){
                me.$box_pop.css({top:'auto',right: right || '30px',bottom:'-70px'});
            } else {
                me.$box_pop.css({top:'auto',right: right || '80px',bottom:($.browser.msie ? '-60px' : '-40px')});
            }
            new Pop_panel({
                $dom: me.$box_pop,
                host_$dom: $('#_upload_dialog a[data-btn-id=OTHER]'),
                show: function () {
                    me.$box_pop.show();
                },
                hide: function () {
                    me.$box_pop.hide();
                },
                delay_time: 50
            });
        },
        /**
         * 设置相册目录旁边的文字
         */
        set_album_text : function (text) {
            var default_text = '<i style="visibility:hidden;"></i>相册';
            text = (text) ? '<label>（'+ text +'）</label>' : '';
            $('#album').html(default_text + text);
        },

        /**
         * 清除相册上的选中样式
         */
        clear_album_selected : function() {
        	$('#_file_box_node_-1').children('a').removeClass('selected');
        },

        set_error_text : function(text) {
            var $el = $('#tips-err');
            $el.text(text);
            if(text.length){
                $el.show();
            }
            else {
                $el.hide();
            }
        }

    });

    //select_folder_view.render();

    module.exports = select_folder_view;

});