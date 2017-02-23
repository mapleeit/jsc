/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define(function (require, exports, module) {
    var functional = require('common').get('./util.functional'),
        Cache = require('./tool.upload_cache'),
        view = require('./view'),
        upload_route = require('./upload_route'),
        get_info = function( cache_key ){
            return Cache.get(cache_key).get_count_nums();
        };
    var folder_view={
        get_html: function (upload_obj,view_id) {
            var dir_name = upload_obj.pdir_name;//目录名称
            return {
                "view_id":view_id,
                "mask_width": '0',
                "li_class": "waiting",
                "file_type": 'file',
                'full_name': upload_obj.file_name,
                'file_name': view.revise_file_name(upload_obj.file_name),
                'file_size': upload_obj.file_count+'个文件',
                'file_dir': dir_name,
                'local_path': upload_obj.path
            };
        },
        after_done: function(){
            this.set_folder_size('done');
        },
        after_error: function () {
            this.set_folder_size('done');
        },
        set_folder_size: function(state){
            var task = this.get_upload_obj(),
                info = get_info(task.sub_cache_key),
                html = '空文件夹';
            if(task.file_count !== 0){
                if(state === 'update'){
                    html = info.error  + info.done + 1 + '/' + ( info.length - info.pause )+'个文件';
                } else if(state ==='wait'){
                    //防止点击了暂停后再次进入等待状态，仍然显示正在计算
                    if(this.folder_has_ready){
                        html = info.length + '个文件';
                    }else{
                        html = '正在计算...';    
                    }
                } else if(state ==='done'){
                    html = info.length + '个文件';
                } else if(state === 'start'){
                    html = '1/'+(info.length - info.pause);
                } else if(state === 'resume_pause'){
                    html = info.length + '个文件';
                }
            }
            this.get_file_size().html(html);
        },
        set_folder_size_ready: function(){
            var info = get_info(this.get_upload_obj().sub_cache_key);
            this.get_file_size().html(info.length + '个文件');
            //文件计算是否完毕
            this.folder_has_ready = true;
        },
        start: function(){
            var me = this;
            me.set_folder_size('start');
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('正在上传').show();
            me.get_percent_face().width('1%'); //显示进度百分比-样式
            me.set_cur_doing_vid();
        },
        wait: function () {
            var me = this ;
            me.set_folder_size('wait');
            me.get_msg().html('等待上传').show();
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.hide_error();
        },
        upload_file_update_process: function () {
            var me = this,
                upload_obj = me.get_upload_obj();
            if (!upload_obj) {
                return;
            }
            upload_obj.state = 'upload_file_update_process';
            upload_obj.can_pause && me.show_click('icon-pause', '暂停', 'click_pause');
            var width = upload_obj.processed / upload_obj.file_size * 100;
            width = upload_obj.fix_percent(width);
            me.get_percent_face().width((width<1?1:width)+'%');//显示进度百分比-样式
            me.get_msg().html(width+'%').show();//显示进度百分比-文本

            me.set_folder_size('update');
        },
        /**
         * 状态：续传暂停
         */
        resume_pause: function () {
            var me = this;
            me.show_click('icon-continue', '续传', 'click_resume_continuee');
            me.get_delete().css('display', 'inline-block');
            me.set_folder_size('resume_pause');
        },
        /**
         * 状态：扫描状态
         */
        file_sign_update_process: function () {
            var upload_obj = this.get_upload_obj();
            var percent = upload_obj.folder_scan_percent;
	        if(upload_obj.state !== 'error') {
		        percent = upload_obj.fix_percent(percent);
		        this.get_msg().html('准备中:' + percent + '%').show();
		        this.get_click().hide();

		        var width = upload_obj.processed / upload_obj.file_size * 100;
		        width = upload_obj.fix_percent(width);
		        this.get_percent_face().width((width < 1 ? 1 : width) + '%');//显示进度百分比-样式
	        }
        },
        /**
         * 状态：扫描完成
         */
        file_sign_done: function () {
            this.get_msg().html('正在上传').show();
        }
    };

    folder_view.file_sign_update_process = functional.throttle(folder_view.file_sign_update_process, 500);//文件扫描

    return folder_view;
});