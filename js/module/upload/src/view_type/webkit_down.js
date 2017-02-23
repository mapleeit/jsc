/**
 * User: trumpli
 * Date: 13-8-2
 * Time: 下午5:32
 */
define(function (require, exports, module) {
    var common = require('common'),
        lib = require('lib'),
        console = lib.get('./console'),
        File = common.get('./file.file_object'),
        file_type_map = common.get('./file.file_type_map'),

        is_newest_version = function () {//频繁验证，有性能有问题；这里用一个缓存读取
            return common.get('./util.plugin_detect').is_newest_version();
        }(),

        view = require('./view');
    return {
        get_html: function (task,view_id) {
            var file_type = task.get_file_type(),
                file_size = File.get_readability_size(task.file_size);
            if (!file_type_map.can_identify(file_type)) {
                file_type = 'unknow';
            }
            if(task.is_package()){//打包下载  使用下面的提示
                file_size = '-';
            }
            return {
                "view_id":view_id,
                "mask_width": '0',
                "li_class": "waiting",
                "icon": "icon-down",
                "icon_err": "下载失败",
                "file_type": file_type,
                'full_name': task.file_name,
                'file_name': view.revise_file_name(task.file_name),
                'file_size': file_size,
                'file_dir': task.dir_name,
                'target_path': (task.target_path + task.file_name)
            };
        },
        start: function () {
            var me = this;
            me.set_upload_face_status('uploading');//设置外观样式为 等待 状态
            me.get_click().hide();
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('正在下载').css('display','inline');
            if(me.get_task().is_package()){
                me.get_percent_face().addClass('package-download').width('100%');
            }else{
                me.get_percent_face().width('0%');
            }
            me.set_cur_doing_vid();
            me.old_state = me.state;
        },
        /**
         * 状态：暂停
         */
        pause: function () {
            var me = this;
            this.set_upload_face_status('paused');//设置外观样式为 暂停 状态
            this.show_click('icon-continue', '续传', 'click_continuee');
            this.get_delete().css('display', 'inline-block');
            //修改成暂停前保存上次的文本
            me.old_text = this.get_msg().html();
            this.get_msg().html('暂停').show();

            //解决点击了暂停，还是被进入了processing，导致按钮样式不对
            me.old_state = me.state;

            //解决点击了暂停，还是被进入了processing，导致状态文字不对
            //setTimeout(function(){
            //    me.get_msg().html('暂停');
            //},300);
            
        },
        /**
         * 状态：继续
         */
        continuee: function () {
            var me = this;
            this.set_upload_face_status('uploading');//设置外观样式为 正在下载 状态
            this.show_click('icon-pause', '暂停', 'click_pause');
            //this.get_msg().html('正在下载').show();
            this.get_msg().html(me.old_text==='暂停' ? '正在下载' : me.old_text).show();
            this.hide_error();
        },
        /**
         * 状态：续传暂停
         *
        resume_pause: function () {
            var me = this;
            me.set_upload_face_status('paused');//设置外观样式为 等待下载中 状态
            me.show_click('icon-continue', '续传', 'click_resume_continuee');
            me.get_delete().css('display', 'inline-block');
            me.get_msg().html('等待下载').css('display','inline');
        },*/
        processing: function () {
            var me = this,
                task = me.get_task(),
                percent = task.fix_percent(Math.max(task.percent, 1), 0) + '%';

            //添加暂停功能 最新版QQ才出现暂停功能，打包下载不提供暂停功能
            if( !me.get_task().is_package() && me.old_state==='start' && is_newest_version ){
                me.show_click('icon-pause', '暂停', 'click_pause');
            }
            //打包下载不显示进度
            if(!task.is_package()){
                me.get_msg().html(percent).show();//显示进度百分比-文本
                me.get_percent_face().width(percent);//显示样式进度
            }
            
        },
        done: function () {
            var me = this;
            me.set_upload_face_status('completed');//设置外观样式为 完成 状态
            me.get_click().remove();
            me.get_msg().remove();
            view.on_done_reset_scroll(me.v_id);
        }
    };
});